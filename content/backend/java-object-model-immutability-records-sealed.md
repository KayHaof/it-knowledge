---
id: java-object-model-immutability-records-sealed
slug: java-object-model-immutability-records-sealed
title: Java Object Model — Immutability, Records và Sealed Types
description: Thiết kế object giữ invariant bằng immutability, hiểu giá trị và giới hạn của record, sealed hierarchy cùng trade-off khi tích hợp framework.
category: backend
technology: Java
level: intermediate
estimatedMinutes: 57
tags: ["java","object-model","immutability","records","sealed-classes","value-object"]
prerequisites: ["java-object-contracts"]
related: ["java-memory-model-locks-atomics","spring-jpa-persistence-context","spring-rest-validation-errors"]
next: java-string-internals-building
learningObjectives: ["Phân biệt final reference với immutable object graph","Dùng record cho transparent data carrier mà vẫn giữ invariant","Mô hình hóa closed hierarchy bằng sealed types và đánh giá compatibility"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+; records final since 16, sealed classes final since 17"}
sources: [{"title":"JLS 26 — Classes","url":"https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"},{"title":"JEP 395 — Records","url":"https://openjdk.org/jeps/395","organization":"OpenJDK","type":"specification","accessedAt":"2026-09-02"},{"title":"JEP 409 — Sealed Classes","url":"https://openjdk.org/jeps/409","organization":"OpenJDK","type":"specification","accessedAt":"2026-09-02"},{"title":"Record API — Java SE 26","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html","organization":"Oracle","type":"official-api-reference","accessedAt":"2026-09-02"}]
---
## Object model: identity, state và behavior

Java object có identity, runtime type, fields và methods. Biến kiểu reference không chứa toàn bộ object; nó giữ reference có thể trỏ tới object hoặc `null`. Gán một reference sang biến khác không copy object. Đây là nguồn của aliasing: hai component tưởng sở hữu state riêng nhưng đang sửa cùng một object graph.

`final` trên biến/field chỉ ngăn reference được gán lại sau initialization. Nó không tự làm object được trỏ tới immutable:

```java title="ShallowFinal.java"
final List<String> roles = new ArrayList<>();
roles.add("ADMIN"); // hợp lệ: reference không đổi, object vẫn mutable
```

Immutability là property của abstraction và graph có thể quan sát, không phải một keyword đơn lẻ. Một class `final` có field `final List` nhưng trả trực tiếp list mutable vẫn không immutable.

## Recipe cho immutable value object

Một value object production thường cần:

1. Validate invariant tại mọi constructor/factory path.
2. Không expose mutator thay đổi state.
3. Fields cần thiết là `private final`.
4. Defensive copy input/output mutable.
5. Thành phần lồng nhau cũng immutable hoặc được copy.
6. `equals`/`hashCode` dựa trên cùng state ổn định.
7. Không để `this` thoát ra trước khi construction hoàn tất.

```java title="Money.java"
public final class Money {
  private final BigDecimal amount;
  private final Currency currency;

  private Money(BigDecimal amount, Currency currency) {
    this.amount = amount.stripTrailingZeros();
    this.currency = Objects.requireNonNull(currency);
    if (amount.signum() < 0) throw new IllegalArgumentException("negative amount");
  }

  public static Money of(BigDecimal amount, Currency currency) {
    return new Money(Objects.requireNonNull(amount), currency);
  }
}
```

Ví dụ trên còn một quyết định domain: chuẩn hóa scale ảnh hưởng equality và serialization. Đừng copy máy móc; document canonical form và test contract với database/API.

Immutability giảm số trạng thái trung gian, giúp chia sẻ giữa threads dễ hơn và bảo vệ key trong `HashMap`. Nó không làm composite operation tự động atomic; một reference tới immutable snapshot vẫn cần synchronization/atomic publication khi cập nhật.

## Defensive copy đúng chỗ

`List.copyOf(input)` tạo unmodifiable snapshot về cấu trúc, nhưng các element mutable vẫn có thể đổi. `Collections.unmodifiableList(input)` chỉ là read-only view; owner giữ `input` vẫn sửa được. Với mảng, dùng `clone` hoặc `Arrays.copyOf` khi nhận và trả. Với time API hiện đại như `Instant`, element vốn immutable nên dễ kiểm soát hơn legacy `Date`.

Copy mọi thứ có cost allocation và có thể không phù hợp object rất lớn. Khi performance quan trọng, chọn persistent data structure, ownership protocol hoặc read-only API, rồi đo. Tối ưu bằng cách expose nội bộ mutable phải được cô lập; đừng làm thủng public invariant.

## Record là nominal tuple, không phải phép màu immutability

Record khai báo state description ngắn gọn và compiler cung cấp private final component fields, accessors, canonical constructor, `equals`, `hashCode`, `toString`. Record là implicitly final và trực tiếp kế thừa `java.lang.Record`.

```java title="CreateOrder.java"
public record CreateOrder(String customerId, List<String> skuIds) {
  public CreateOrder {
    customerId = Objects.requireNonNull(customerId).trim();
    if (customerId.isEmpty()) throw new IllegalArgumentException("empty customerId");
    skuIds = List.copyOf(skuIds);
    if (skuIds.isEmpty()) throw new IllegalArgumentException("empty order");
  }
}
```

Compact canonical constructor cho phép validate/normalize parameters trước khi compiler gán fields. Record trên là immutable nếu `String` immutable và list snapshot không chứa element mutable. Nếu component là `byte[]`, `Date` hoặc domain entity mutable, record chỉ shallowly immutable.

Record phù hợp command/query DTO, event value, composite key và result row khi data chính là API của type. Nó kém phù hợp khi cần hidden representation, lifecycle mutable phức tạp, inheritance từ base class, hoặc muốn decouple public API khỏi storage components. Thêm/bớt/reorder record component thay đổi constructor/accessors/equality/serialization shape; đây là compatibility change, không phải refactor nội bộ vô hại.

## Equality và framework boundary

Record equality yêu cầu cùng record class và component values tương ứng equal. Điều này tốt cho value semantics, nhưng component như `BigDecimal` có scale-sensitive `equals`; array dùng identity equality mặc định; lazy ORM proxy có semantics riêng. Chọn component theo contract thực tế.

JPA entity có identity và managed mutable lifecycle, thường không nên biến thành record chỉ để giảm boilerplate. Record phù hợp DTO projection bên ngoài persistence context. Một số serializer/framework hỗ trợ record tốt ở phiên bản mới, nhưng constructor names, module reflection access và nullability vẫn phải được integration-test với version đang chạy.

## Sealed hierarchy: đóng tập biến thể trực tiếp

`sealed` class/interface chỉ cho các direct subtypes được phép. Mỗi subtype trực tiếp phải khai báo `final`, `sealed` hoặc `non-sealed`. Khi nằm cùng compilation unit có thể suy luận danh sách; nếu không, `permits` làm contract rõ.

```java title="PaymentResult.java"
public sealed interface PaymentResult
    permits Approved, Declined, Pending {}

public record Approved(String transactionId) implements PaymentResult {}
public record Declined(String reasonCode) implements PaymentResult {}
public record Pending(Instant retryAfter) implements PaymentResult {}
```

Closed hierarchy giúp compiler hiểu các case hợp lệ, đặc biệt với pattern matching `switch` ở Java 21+. Nó mô hình hóa domain sum type rõ hơn chuỗi `type` tùy ý. Nhưng sealed chỉ giới hạn direct subtype; nhánh `non-sealed` mở lại extension bên dưới.

Thêm permitted subtype là source-level evolution buộc consumer exhaustive switch được recompile/review. Xóa subtype hoặc biến hierarchy đang mở thành sealed có thể gây binary incompatibility cho class cũ. Với public library/plugin ecosystem cần extensibility, interface mở và registration mechanism thường phù hợp hơn.

## Composition, inheritance và proxy

Inheritance tạo substitutability contract, không chỉ reuse code. Constructor của superclass chạy trước state subclass; gọi overridable method từ constructor có thể quan sát subclass chưa initialized. Prefer composition cho policy thay đổi độc lập.

`final`/record/sealed có thể cản subclass-based proxy. Spring hiện có nhiều proxy strategy nhưng class/method final và constructor visibility vẫn ảnh hưởng. JPA lazy proxy cũng có constraints. Đừng bỏ invariant chỉ để framework proxy; dùng interface, mapping DTO/entity tách biệt hoặc cấu hình supported mechanism, rồi test trên runtime thật.

## Failure scenarios

- Dùng mutable entity làm `HashMap` key rồi đổi field thuộc hash code: lookup mất dấu.
- Record chứa list từ request mà không copy: caller sửa state sau validation.
- Trả `Collections.unmodifiableList` nhưng giữ mutable backing list: snapshot thay đổi ngoài ý muốn.
- Dùng record làm JPA entity và giả định mọi provider/lazy behavior tương thích.
- Sealed hierarchy public nhưng thêm subtype không quản lý version: consumer exhaustive logic lỗi khi nâng cấp.
- Đưa secret vào record rồi log `toString`: component bị lộ mặc dù code không tự viết `toString`.

:::production Serialization boundary
Generated `toString`, component names và equality không phải lý do để expose record trực tiếp như long-lived public event contract. Version schema độc lập, redact secret, và compatibility-test producer/consumer.
:::

## Câu hỏi phỏng vấn

**Record có immutable tuyệt đối không?** Không. Component fields là final nhưng object mà chúng trỏ tới có thể mutable. Cần defensive copy và element immutability.

**Khi nào sealed type tốt hơn interface mở?** Khi domain thật sự có tập biến thể do một owner kiểm soát và exhaustive handling tạo giá trị; không phù hợp extension/plugin tùy ý.

## Key Takeaways

- `final` reference không đồng nghĩa immutable object graph.
- Immutability đến từ invariant, ownership và defensive-copy policy.
- Record là transparent carrier với shallow final state, không tự đóng sâu graph.
- Sealed types diễn đạt closed hierarchy nhưng tạo evolution contract.
- Tách persistence entity, API/event schema và domain value theo lifecycle của chúng.

