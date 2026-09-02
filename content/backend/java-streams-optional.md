---
id: java-streams-optional
slug: java-streams-optional
title: Java Streams và Optional — Pipeline không Side Effect
description: Thiết kế stream pipeline dễ đọc, hiểu lazy evaluation, collectors, parallelism và dùng Optional đúng tại boundary.
category: backend
technology: Java
level: intermediate
estimatedMinutes: 40
tags: ["java","streams","optional","collectors","functional"]
prerequisites: ["java-collections-generics"]
related: ["java-concurrency","java-completable-future"]
next: java-completable-future
learningObjectives: ["Giải thích lazy stream pipeline và terminal operation","Viết transformation không shared mutation","Đánh giá đúng chi phí parallel stream và Optional"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"java.util.stream Package","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Stream API","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Optional API","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: mô tả phép biến đổi
Stream không phải collection và không sở hữu dữ liệu. Nó là pipeline một lần sử dụng gồm source, intermediate operations và terminal operation. `filter`, `map`, `sorted` chỉ mô tả công việc; terminal operation như `toList`, `reduce` hoặc `findFirst` mới kích hoạt traversal.

```java title="OrderReport.java"
Map<String, BigDecimal> revenueByCountry = orders.stream()
    .filter(Order::isPaid)
    .collect(Collectors.groupingBy(
        order -> order.customer().countryCode(),
        Collectors.reducing(
            BigDecimal.ZERO,
            Order::total,
            BigDecimal::add)));
```

Pipeline rõ khi mỗi stage làm một transformation và tên domain vẫn nhìn thấy. Nếu chuỗi có nhiều nested lambda, exception wrapping và state mutation, vòng lặp có thể dễ hiểu hơn. Functional style là công cụ, không phải mục tiêu.

## Lazy evaluation và short-circuit
Các element thường đi xuyên pipeline từng cái, không nhất thiết tạo collection trung gian cho mỗi stage. `limit`, `findFirst`, `anyMatch` có thể short-circuit; `sorted` và một số operation stateful phải giữ nhiều dữ liệu trước khi phát kết quả. Thứ tự operation ảnh hưởng chi phí: filter sớm có thể giảm dữ liệu phải sort, nhưng chỉ được đổi thứ tự khi giữ nguyên semantic.

```java title="ShortCircuit.java"
boolean hasRisk = transactions.stream()
    .filter(tx -> tx.createdAt().isAfter(cutoff))
    .map(riskService::score)
    .anyMatch(score -> score >= HIGH_RISK);
```

Đoạn này dừng khi gặp điểm rủi ro đầu tiên. Nhưng nếu `score` gọi remote service thì stream che I/O và failure semantics; một orchestration rõ timeout/retry thường phù hợp hơn.

## Side effect và collector
Behavior parameter của stream nên non-interfering: không sửa source trong khi duyệt và tránh shared mutable state. Đoạn `parallelStream().forEach(result::add)` với `ArrayList` vừa race vừa không bảo đảm encounter order. Dùng `collect` để framework quản lý accumulation.

`toList()` trả unmodifiable list theo contract hiện đại của Stream API; không giả định có thể `add`. `Collectors.toList()` không cam kết implementation hoặc mutability cụ thể. Nếu cần loại collection rõ, dùng `toCollection(ArrayList::new)`.

:::warning Duplicate key
`Collectors.toMap` sẽ thất bại khi có duplicate key nếu không cung cấp merge function. Đừng “sửa” bằng cách tùy tiện giữ phần tử đầu tiên; hãy xác định duplicate là lỗi dữ liệu, chọn mới nhất hay cần gom nhóm.
:::

## Parallel stream không phải nút tăng tốc
Parallel stream chia source thành phần, xử lý trên common ForkJoinPool và kết hợp kết quả. Nó có thể có lợi cho computation CPU-bound, dữ liệu đủ lớn, operation stateless/associative và source dễ chia. Nó thường không phù hợp với blocking I/O, request server cần isolation, dataset nhỏ hoặc operation giữ lock.

Common pool là resource dùng chung toàn process. Một endpoint blocking trong parallel stream có thể ảnh hưởng task khác. Hãy benchmark end-to-end, kiểm tra CPU saturation, allocation và tail latency; khi cần ownership/cancellation rõ, dùng executor chuyên biệt.

## Optional là return contract
`Optional<T>` diễn tả “có thể không có kết quả” tại return boundary. Nó không thay thế validation và thường không nên là field của entity/DTO, parameter hay element trong collection. Tránh `optional.get()` không kiểm tra; dùng `map`, `flatMap`, `orElseThrow` hoặc pattern control flow đơn giản.

```java title="CustomerLookup.java"
CustomerView load(CustomerId id) {
  return repository.findById(id)
      .map(mapper::toView)
      .orElseThrow(() -> new CustomerNotFound(id));
}
```

`orElse(expensive())` luôn tính argument trước khi gọi method; `orElseGet(this::expensive)` chỉ chạy supplier khi empty. Đây là khác biệt thực tế khi fallback có I/O hoặc allocation đáng kể.

## Failure scenarios
- Reuse một stream sau terminal operation: `IllegalStateException`.
- Dùng `peek` cho logic bắt buộc: behavior phụ thuộc terminal traversal và tối ưu pipeline.
- Reduce bằng operator không associative rồi chạy parallel: kết quả khó đoán.
- Boxing hàng triệu primitive qua `Stream<Integer>`: allocation/GC tăng; cân nhắc `IntStream`.
- Ném checked exception trong lambda bằng wrapper chung: mất failure taxonomy và retry sai.

## Production checklist
1. Giữ stage stateless, non-interfering và tên domain rõ.
2. Xác định encounter order có phải contract hay không.
3. Chỉ parallel sau benchmark với workload thật.
4. Không chạy blocking I/O trên common pool.
5. Chọn duplicate-key policy một cách nghiệp vụ.
6. Dùng Optional cho absence ở return boundary, không lan tràn vào data model.

## Câu hỏi phỏng vấn
**`map` khác `flatMap` thế nào?** `map` biến một value thành một value; `flatMap` biến thành container/context rồi làm phẳng một lớp, ví dụ tránh `Optional<Optional<T>>`.

**Khi nào parallel stream có thể chậm hơn?** Khi splitting/merging lớn hơn phần tính toán, dataset nhỏ, locality kém, operation blocking hoặc contention trên common pool.

## Key Takeaways
- Stream là lazy single-use pipeline, không phải nơi lưu dữ liệu.
- Side effect làm mất composability và an toàn khi parallel.
- Parallelism cần benchmark và resource ownership.
- Optional diễn tả absence, không phải cách né thiết kế null contract.
