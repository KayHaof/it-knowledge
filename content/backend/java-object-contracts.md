---
id: java-object-contracts
slug: java-object-contracts
title: Java Object Model — Identity, Value và Invariant
description: Thiết kế class, record và object contract đúng từ equality, immutability đến composition để tránh lỗi dữ liệu khó truy vết.
category: backend
technology: Java
level: beginner
estimatedMinutes: 38
tags: ["java","oop","record","immutability","equals-hashcode"]
prerequisites: []
related: ["java-jvm-memory","java-collections-generics"]
next: java-collections-generics
learningObjectives: ["Phân biệt identity object và value object","Giữ invariant bằng encapsulation và immutability","Cài đặt equals/hashCode an toàn cho collection"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"Java Language Specification — Classes","url":"https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"},{"title":"Object API","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Record Classes","url":"https://docs.oracle.com/en/java/javase/21/language/records.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: object là dữ liệu đi cùng quy tắc
OOP có giá trị khi object bảo vệ một invariant, không phải khi mọi bảng dữ liệu đều được đổi thành class có getter/setter. Một `Order` hợp lệ có tổng tiền không âm, trạng thái chỉ chuyển theo luồng cho phép và các dòng hàng không thể bị sửa từ bên ngoài. Constructor hoặc factory phải thiết lập trạng thái hợp lệ; method nghiệp vụ duy trì trạng thái đó.

Identity object được nhận diện bằng danh tính ổn định như `orderId`; thuộc tính của nó có thể thay đổi theo thời gian. Value object được nhận diện bằng toàn bộ giá trị như `Money(currency, amount)`; hai instance có cùng giá trị nên được xem là tương đương. Phân biệt này quyết định equality, lifecycle và cách lưu trữ.

```java title="Order.java"
public final class Order {
  private final UUID id;
  private final List<OrderLine> lines;
  private OrderStatus status = OrderStatus.DRAFT;

  public Order(UUID id, List<OrderLine> lines) {
    this.id = Objects.requireNonNull(id);
    this.lines = List.copyOf(lines);
    if (this.lines.isEmpty()) throw new IllegalArgumentException("Order must have lines");
  }

  public void confirm() {
    if (status != OrderStatus.DRAFT) throw new IllegalStateException("Invalid transition");
    status = OrderStatus.CONFIRMED;
  }

  public List<OrderLine> lines() { return lines; }
}
```

`List.copyOf` tạo defensive copy và không cho caller sửa collection qua reference đã truyền vào. Tuy vậy, nếu `OrderLine` tự nó mutable thì tính bất biến vẫn chưa sâu; cần thiết kế cả object graph.

## Equality và hash-based collection
Contract của `equals` gồm reflexive, symmetric, transitive, consistent và trả `false` với `null`. Khi hai object bằng nhau theo `equals`, chúng bắt buộc có cùng `hashCode`. `HashMap` dùng hash để tìm bucket rồi mới so equality; phá contract có thể làm key “biến mất” dù vẫn nằm trong map.

```java title="EmailAddress.java"
public record EmailAddress(String value) {
  public EmailAddress {
    Objects.requireNonNull(value);
    value = value.trim().toLowerCase(Locale.ROOT);
    if (!value.contains("@")) throw new IllegalArgumentException("Invalid email");
  }
}
```

Record tự sinh accessor, `equals`, `hashCode` và `toString` dựa trên components. Nó phù hợp với value object nông, nhưng không tự validate nghiệp vụ và cũng không tự defensive-copy một component mutable.

:::warning Mutable key
Không dùng field có thể thay đổi để tính `hashCode` khi object đang là key trong `HashMap` hoặc phần tử của `HashSet`. Sau mutation, collection tìm theo bucket mới trong khi object vẫn ở bucket cũ.
:::

## Inheritance hay composition
Inheritance mô tả quan hệ subtype: mọi nơi nhận base type phải dùng subtype mà không phá contract. Nếu subclass phải vô hiệu hóa method, thay đổi precondition hoặc ném `UnsupportedOperationException`, quan hệ “is-a” có thể sai. Composition ghép capability qua field/interface, giữ coupling thấp hơn và cho phép thay implementation.

`final` giúp đóng hierarchy khi extension không có ý nghĩa. `sealed` giới hạn tập subtype được phép, hữu ích khi domain có tập trạng thái đóng và compiler có thể kiểm tra exhaustive `switch`. Interface nên mô tả hành vi ổn định; đừng tạo interface chỉ để có một implementation và không có boundary cần thay thế.

## Failure scenarios
- Entity dùng database-generated ID trong `equals`: hai entity chưa persist đều có ID `null` và có thể bị xem là bằng nhau.
- Getter trả trực tiếp mutable collection: caller bỏ qua mọi validation của aggregate.
- `toString` in dữ liệu nhạy cảm hoặc duyệt association hai chiều: log rò bí mật hay gây recursion.
- Subclass override `equals` bằng tiêu chí khác base class: symmetry/transitivity bị phá.
- Dùng `BigDecimal.equals` cho quy tắc nghiệp vụ mà không xét scale: `1.0` và `1.00` không bằng nhau theo `equals`.

## Production checklist
1. Ghi rõ object nào có identity, object nào có value semantics.
2. Đặt validation tại boundary tạo/thay đổi trạng thái, không chỉ ở controller.
3. Defensive-copy array, collection và value mutable đi qua public API.
4. Viết property-like tests cho equality contract và state transition.
5. Không đưa secret, token hoặc toàn bộ object graph vào `toString`.
6. Ưu tiên composition khi subtype không thực sự thay thế được base type.

## Câu hỏi phỏng vấn
**Vì sao override `equals` thường phải override `hashCode`?** Hash-based collection chọn vùng tìm kiếm bằng hash trước; object bằng nhau nhưng hash khác nhau có thể nằm ở bucket khác, khiến lookup và uniqueness sai.

**Record có bất biến tuyệt đối không?** Không. Reference component là final nhưng object được tham chiếu có thể mutable. Record vẫn cần compact constructor để validate và defensive copy.

## Key Takeaways
- Encapsulation phải bảo vệ invariant, không chỉ che field bằng getter/setter.
- Identity và value semantics dẫn tới chiến lược equality khác nhau.
- Immutability cần xét toàn object graph.
- Inheritance chỉ đúng khi subtype giữ được contract của base type.
