---
id: java-collections-generics
slug: java-collections-generics
title: Java Collections và Generics — Chọn cấu trúc theo Contract
description: Hiểu List, Set, Map, độ phức tạp, generic variance và cách chọn collection theo access pattern thay vì theo thói quen.
category: backend
technology: Java
level: intermediate
estimatedMinutes: 44
tags: ["java","collections","generics","hashmap","pecs"]
prerequisites: ["java-object-contracts"]
related: ["java-streams-optional","java-concurrency"]
next: java-streams-optional
learningObjectives: ["Chọn collection theo ordering, uniqueness và access pattern","Áp dụng PECS đúng tại API boundary","Nhận diện lỗi equality, iteration và memory overhead"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"Collections Framework Overview","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"HashMap API","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Java Language Specification — Type Arguments","url":"https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"}]
---
## Bắt đầu từ contract, không bắt đầu từ class
Trước khi chọn collection, trả lời bốn câu hỏi: có cần giữ thứ tự không, có cho trùng không, lookup theo key hay theo vị trí, và collection có được chia sẻ giữa threads không. `ArrayList` là mặc định tốt cho sequence đọc/append; `HashSet` biểu diễn uniqueness; `HashMap` ánh xạ key-value; `TreeMap` thêm sorted order với chi phí thao tác thường là logarithmic.

| Nhu cầu | Lựa chọn thường gặp | Điểm phải trả giá |
|---|---|---|
| Duyệt tuần tự, truy cập index | ArrayList | Chèn/xóa giữa mảng phải dịch phần tử |
| Unique membership | HashSet | Phụ thuộc equals/hashCode, không bảo đảm order |
| Lookup theo key | HashMap | Memory overhead và resize |
| Giữ insertion order | LinkedHashMap | Thêm liên kết cho mỗi entry |
| Sorted/range query in-memory | TreeMap | So sánh và cây cân bằng |
| Nhiều thread cập nhật | ConcurrentHashMap | Compound invariant vẫn cần coordination |

Big-O chỉ là điểm đầu. Cache locality, allocation, cardinality, hash quality và access pattern thật có thể quan trọng hơn. `LinkedList` có chèn node O(1) khi đã có iterator, nhưng tìm vị trí là O(n) và node allocation làm locality kém; nó hiếm khi thắng `ArrayList` trong workload thông thường.

## HashMap vận hành thế nào
`HashMap` trộn hash, chọn bucket, sau đó dùng `equals` để tìm đúng key. Khi số entry vượt ngưỡng theo capacity và load factor, bảng được resize. Capacity quá nhỏ gây nhiều resize; quá lớn lãng phí memory và làm iteration đi qua nhiều bucket. Không được dựa vào iteration order của `HashMap`.

```java title="InventoryIndex.java"
Map<ProductId, Stock> byProduct = new HashMap<>(expectedSize);
for (Stock stock : stocks) {
  Stock old = byProduct.put(stock.productId(), stock);
  if (old != null) throw new IllegalStateException("Duplicate product");
}
```

Nếu input không tin cậy hoặc cardinality không giới hạn, map cũng là nơi memory growth. Luôn gắn collection cache/index với eviction, quota hoặc lifecycle rõ.

## Generic là invariant
`List<Integer>` không phải subtype của `List<Number>`. Nếu điều đó được phép, code có thể thêm `Double` vào list vốn chỉ nhận `Integer`. Wildcard tạo variance tại điểm sử dụng:

- `? extends T`: producer — đọc ra như `T`, không thêm được giá trị cụ thể.
- `? super T`: consumer — thêm `T` an toàn, đọc ra chỉ chắc chắn là `Object`.
- Không dùng wildcard nếu vừa cần đọc vừa cần ghi cùng một type.

```java title="CollectionTransfer.java"
static <T> void copyAll(
    Collection<? extends T> source,
    Collection<? super T> destination) {
  destination.addAll(source);
}
```

PECS là mnemonic, không phải luật thiết kế tuyệt đối. Public API nên dùng wildcard để tăng khả năng kết hợp; return type thường nên cụ thể và dễ dùng. Tránh raw type vì nó đẩy type error từ compile time sang runtime.

## Iteration, mutation và concurrency
Nhiều iterator là fail-fast theo best effort: structural modification ngoài iterator có thể ném `ConcurrentModificationException`, nhưng đây không phải cơ chế đồng bộ. Không bao giờ dùng việc “không thấy exception” làm bằng chứng thread-safe.

`Collections.unmodifiableList` tạo view không sửa qua reference đó; backing list vẫn có thể đổi. `List.copyOf` tạo unmodifiable snapshot nông. `ConcurrentHashMap.compute` hữu ích cho atomic update trên một key, nhưng transaction xuyên nhiều key vẫn cần lock hoặc thiết kế state khác.

:::production Failure scenario
`map.containsKey(key)` rồi `map.put(key, value)` là check-then-act gồm hai bước. Với concurrent map, dùng `putIfAbsent`, `computeIfAbsent` hoặc một critical section phù hợp; đồng thời bảo đảm mapping function không blocking lâu và không có side effect khó lặp.
:::

## Memory và API boundary
Collection giữ strong reference tới phần tử. Một static map, listener registry hay cache không eviction có thể giữ cả object graph và gây leak logic. Khi trả collection qua API, quyết định rõ snapshot hay live view; đặt tên và document ownership.

## Production checklist
1. Ghi contract về order, duplicate, null và concurrency.
2. Ước lượng cardinality và giới hạn tăng trưởng.
3. Kiểm tra `equals/hashCode` của key, không mutate key trong map.
4. Benchmark bằng kích thước và access pattern gần production.
5. Dùng immutable snapshot tại boundary khi caller không được sở hữu state.
6. Dùng atomic collection operation thay cho chuỗi check-then-act.

## Câu hỏi phỏng vấn
**Vì sao HashMap lookup không luôn là O(1)?** Đó là expected complexity khi hash phân bố tốt; collision, resize và equality cost làm chi phí thay đổi. Contract không cam kết thời gian tuyệt đối.

**`List<? extends Number>` thêm được gì?** Ngoài `null`, không thể thêm một subtype cụ thể vì compiler không biết list thật là `List<Integer>`, `List<Double>` hay type khác.

## Key Takeaways
- Chọn collection từ semantic contract và workload.
- Equality của key là một phần của tính đúng đắn.
- Generic invariant; wildcard diễn tả producer/consumer tại usage boundary.
- Thread-safe collection không tự làm compound business invariant trở nên atomic.
