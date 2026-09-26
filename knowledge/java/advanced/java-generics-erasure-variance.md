---
id: java-generics-erasure-variance
slug: java-generics-erasure-variance
title: Java Generics — Variance, Erasure và Type Safety
description: Thiết kế generic class và method đúng bằng bounds, invariance, PECS, wildcard capture; hiểu erasure, reifiable types, bridge methods và heap pollution.
technology: Java
domain: backend
category: backend
level: advanced
contentType: internals
order: 25
estimatedMinutes: 65
tags:
  - java
  - generics
  - variance
  - type-erasure
  - heap-pollution
  - type-safety
prerequisites:
  - java-language-types-values-parameters
  - java-collections-generics
related:
  - java-object-model-immutability-records-sealed
  - java-streams-optional
learningObjectives:
  - Thiết kế generic class, method và bounds biểu diễn đúng quan hệ type
  - Áp dụng invariance, PECS và wildcard capture tại API boundary
  - Giải thích erasure, reifiable types và bridge methods bằng contract compile-time/runtime
  - Cô lập raw types, unchecked warnings và heap pollution trong production code
sources:
  - title: Dev.java — Introducing Generics
    url: https://dev.java/learn/language/fp/generics/intro/
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: Dev.java — Wildcards
    url: https://dev.java/learn/language/fp/generics/wildcards/
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: Dev.java — Restrictions on Generics
    url: https://dev.java/learn/language/fp/generics/restrictions/
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: JLS 26 — Type Variables, Parameterized Types and Erasure
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-4.html#jls-4.4
    organization: Oracle
    type: specification
    accessedAt: 2026-09-26
  - title: JLS 26 — Capture Conversion
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-5.html#jls-5.1.10
    organization: Oracle
    type: specification
    accessedAt: 2026-09-26
  - title: JLS 26 — Requirements in Overriding and Hiding
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html#jls-8.4.8.3
    organization: Oracle
    type: specification
    accessedAt: 2026-09-26
lastReviewed: 2026-09-26
appliesTo:
  java: "21+; language rules cross-checked with Java SE 26"
---

# Java Generics — Variance, Erasure và Type Safety

## Tổng quan

Generics không chỉ giúp bỏ cast. Nó cho phép compiler kiểm tra quan hệ giữa các types tại nơi dữ liệu đi vào, đi ra và được biến đổi. Một API generic tốt diễn tả constraint thật; một API lạm dụng wildcard/raw type có thể đẩy lỗi từ compile time sang một `ClassCastException` cách xa nguyên nhân.

Bài này tập trung vào type system và runtime boundary: generic class/method, bounds, invariance, PECS, wildcard capture, erasure, reifiable types, bridge methods, raw types và heap pollution. Việc chọn `List`, `Set`, `Map` theo workload thuộc `java-collections-generics` và không được lặp lại ở đây.

## Mental model: type parameter nhận type, không tạo runtime type mới

Trong `Box<T>`, `T` là type parameter của declaration; trong `Box<String>`, `String` là type argument và `Box<String>` là parameterized type. Type parameter giúp compiler chứng minh rằng value đi vào và value đi ra có quan hệ nhất quán.

```java title="Box.java"
final class Box<T> {
  private T value;

  Box(T value) { this.value = value; }
  T get() { return value; }
  void set(T value) { this.value = value; }
}

Box<String> names = new Box<>("Ada");
String name = names.get(); // không cần cast do compiler giữ contract T = String
```

`Box<String>` không mặc định là một class runtime riêng được specialized từ `Box<Integer>`. Java thường biên dịch generic code bằng erasure để tương thích với class/library trước generics; type safety chủ yếu được chứng minh khi compile, rồi compiler chèn cast/bridge cần thiết.

## Generic class, generic method và bounds

Generic class giữ một type relationship xuyên nhiều fields/methods. Generic method giới thiệu type parameter chỉ cho một operation, kể cả khi enclosing class không generic.

```java title="BoundedRange.java"
record Range<T extends Comparable<? super T>>(T lower, T upper) {
  Range {
    if (lower.compareTo(upper) > 0) {
      throw new IllegalArgumentException("lower must be <= upper");
    }
  }

  boolean contains(T value) {
    return lower.compareTo(value) <= 0 && value.compareTo(upper) <= 0;
  }
}

static <T> T requireValue(T value, String name) {
  if (value == null) throw new IllegalArgumentException(name);
  return value;
}
```

Bound `T extends Comparable<? super T>` cho phép gọi `compareTo` và chấp nhận trường hợp type triển khai `Comparable` của một supertype phù hợp. Trong bound, `extends` mang nghĩa “subtype of”, áp dụng cả class và interface. Với multiple bounds như `<T extends Base & Auditable & Serializable>`, class bound nếu có phải đứng đầu; erasure của type variable dựa trên leftmost bound, nên thứ tự còn tác động binary representation.

Không thêm bound chỉ vì implementation hiện tại tình cờ cần nó. Mỗi bound là một constraint đối với caller và là phần của API evolution. Nếu algorithm chỉ cần một operation nhỏ, cân nhắc truyền functional interface/capability thay vì buộc domain type implement một hierarchy rộng.

## Invariance: subtype của argument không tạo subtype của parameterized type

Nếu `Dog` là subtype của `Animal`, `Box<Dog>` vẫn không phải `Box<Animal>`. Nếu phép gán đó hợp lệ, code nhận `Box<Animal>` có thể đặt một `Cat` vào box vốn hứa chỉ chứa `Dog`. Invariance giữ cả read và write contract an toàn.

Giữ nguyên type argument thì inheritance của generic declaration vẫn hoạt động: `ArrayList<String>` là subtype của `List<String>` vì `ArrayList<E>` triển khai `List<E>`. Điều không tồn tại là quan hệ tự động giữa `List<Dog>` và `List<Animal>`.

Wildcard tạo variance tại use site:

- `? extends T` biểu diễn một type chưa biết nhưng là subtype của `T`; đọc ra như `T`, không thể thêm một `T` cụ thể ngoài `null`.
- `? super T` biểu diễn một type chưa biết nhưng là supertype của `T`; có thể ghi `T`, còn đọc ra chỉ chắc chắn là `Object`.
- `?` biểu diễn unknown type; phù hợp khi operation không phụ thuộc element type.

```java title="Transfer.java"
static <T> void transfer(
    Iterable<? extends T> source,
    java.util.function.Consumer<? super T> destination) {
  for (T value : source) {
    destination.accept(value);
  }
}
```

Đây là PECS ở API boundary: producer extends, consumer super. PECS là mnemonic về hướng dữ liệu, không phải yêu cầu đặt wildcard ở mọi declaration. Nếu một parameter vừa được đọc vừa được ghi bằng cùng type, type parameter cụ thể thường phù hợp hơn. Tránh wildcard ở return type vì nó đẩy capture burden sang mọi caller.

## Wildcard capture: đặt tên cho unknown type trong helper

Mỗi `?` đại diện một unknown type cụ thể mà compiler phải giữ an toàn. Khi error chứa `capture of ?`, câu hỏi đúng là: operation này thật sự an toàn với cùng unknown type hay đang cố trộn hai unknown types khác nhau?

Một private generic helper có thể “đặt tên” cho capture mà public API vẫn nhận `List<?>`:

```java title="WildcardCapture.java"
static void duplicateFirst(List<?> values) {
  duplicateFirstCaptured(values);
}

private static <T> void duplicateFirstCaptured(List<T> values) {
  if (!values.isEmpty()) {
    values.add(values.get(0));
  }
}
```

Compiler suy ra một `T` duy nhất cho list đã capture; value đọc ra có đúng type để ghi lại. Helper không hợp thức hóa operation vốn sai. Hai parameters `List<?> left, List<?> right` có thể capture hai types khác nhau, nên chuyển phần tử giữa chúng không an toàn nếu không có relationship rõ trong signature.

## Erasure: compiler giữ contract rồi hạ về representation tương thích

Type erasure ánh xạ parameterized type về raw declaration và type variable về erasure của leftmost bound. Ví dụ `Box<String>` erases thành `Box`; `T` không bound erases thành `Object`; `T extends Number & Comparable<T>` erases thành `Number`. Compiler chèn casts tại nơi cần khôi phục static type.

Erasure không có nghĩa “mọi thông tin generic biến mất hoàn toàn”. Class file có thể giữ generic signature metadata cho declarations và reflection có thể đọc `Type`; nhưng runtime object không mang một identity riêng cho mọi type argument để kiểm tra `instanceof List<String>`.

Hệ quả thực dụng:

| Mong muốn | Kết quả | Lý do |
|---|---|---|
| `new T()` hoặc `T.class` | Không compile | Runtime không có constructor/class literal của type variable tùy ý |
| `value instanceof List<String>` | Không compile | `List<String>` không reifiable |
| `value instanceof List<?>` | Hợp lệ | Unbounded-wildcard parameterization là reifiable |
| `new List<String>[10]` | Không compile | Array kiểm tra component type runtime, generic argument lại bị erase |
| Hai overload chỉ khác `List<String>`/`List<Integer>` | Name clash | Hai signatures có cùng erasure |
| Static field kiểu `T` trong generic class | Không compile | Static state dùng chung cho mọi type argument |

Reifiable type là type có đủ representation runtime cho operation cần kiểm tra: primitive, non-generic type, raw type, parameterized type toàn unbounded wildcards, hoặc array có component reifiable. “Reifiable” không đồng nghĩa “nên dùng raw type”; raw type reifiable vì nó bỏ type argument, đồng thời bỏ luôn phần lớn compile-time guarantee.

## Bridge methods giữ polymorphism sau erasure

Erasure có thể làm method của subclass không còn cùng JVM descriptor với method generic đã override. Compiler sinh synthetic bridge method để dispatch vẫn tuân Java source semantics.

```java title="BridgeMethod.java"
class Node<T> {
  T value() { return null; }
}

final class NameNode extends Node<String> {
  @Override
  String value() { return "Ada"; }
}
```

Sau erasure, `Node.value()` có return representation `Object`, trong khi implementation cụ thể trả `String`. Compiler có thể tạo bridge `Object value()` delegating tới `String value()`. Bridge method có thể xuất hiện trong stack trace, reflection hoặc coverage report; nó không phải method nghiệp vụ bị developer viết trùng. Dùng `javap -v` để xác nhận flag `ACC_BRIDGE`/`ACC_SYNTHETIC` khi cần điều tra.

## Raw types, unchecked warning và heap pollution

Raw type như `List` tồn tại để tương thích legacy code, nhưng bỏ relationship của type arguments. Gán/call qua raw type thường tạo unchecked warning: compiler không còn đủ thông tin để chứng minh type safety.

```java title="HeapPollution.java"
static void legacyAdd(List values) { // raw type: legacy boundary
  values.add(42);
}

List<String> names = new ArrayList<>();
legacyAdd(names);                     // unchecked warning ở nguyên nhân
String first = names.get(0);          // ClassCastException xuất hiện muộn
```

Heap pollution xảy ra khi variable của parameterized type tham chiếu tới object không thỏa parameterized contract. Lỗi thường nổ ở cast compiler chèn lúc đọc, cách xa raw assignment/unchecked cast ban đầu. Vì vậy không “dọn log” bằng `@SuppressWarnings` trên cả class.

Generic varargs cũng cần chú ý vì varargs được hiện thực bằng array, trong khi element parameterized type có thể non-reifiable. `@SafeVarargs` là assertion của author rằng body không ghi value sai type vào array và không expose array cho code không tin cậy; annotation không tự làm implementation an toàn.

```java title="SafeGenericVarargs.java"
@SafeVarargs
static <T> List<T> snapshot(List<? extends T>... groups) {
  List<T> result = new ArrayList<>();
  for (List<? extends T> group : groups) {
    result.addAll(group);
  }
  return List.copyOf(result);
}
```

Nếu phải tích hợp raw API, cô lập nó trong adapter nhỏ: validate runtime elements, thực hiện một cast có giải thích, suppress warning ngay tại statement đã review, rồi trả typed abstraction cho phần còn lại của hệ thống.

## Type inference và thiết kế API

Type inference dùng invocation arguments, target type và bounds để chọn type arguments. Inference mạnh nhưng không đọc business intent; signature càng biểu đạt relationship rõ, error càng hữu ích.

Chọn abstraction như sau:

- Dùng type parameter khi cùng một unknown type xuất hiện ở nhiều vị trí và relationship giữa chúng quan trọng, ví dụ input và return cùng `T`.
- Dùng bounded type parameter khi algorithm cần capability thật từ bound.
- Dùng wildcard khi chỉ cần variance một chiều hoặc operation không phụ thuộc unknown type.
- Dùng concrete/non-generic type khi generic không thêm guarantee nào; `<T> void log(T value)` không mạnh hơn `void log(Object value)` nếu `T` chỉ xuất hiện một lần.
- Không expose raw type và hạn chế unchecked cast ở public boundary.

Over-generalized signature với nhiều type parameters, recursive bounds và nested wildcards có thể đúng về type theory nhưng khó gọi, khó đọc compiler error và khó evolve. API tốt tối đa hóa guarantee với độ phức tạp tối thiểu mà use cases thật cần.

## Failure Scenarios và debugging

| Triệu chứng | Nguyên nhân thường gặp | Điều tra/sửa |
|---|---|---|
| `required ... found capture of ?` | Cố ghi vào unknown type hoặc trộn hai captures | Kiểm tra direction; dùng type parameter/helper nếu operation thật sự giữ cùng type |
| `name clash ... same erasure` | Overloads chỉ khác generic arguments | Đổi tên hoặc thiết kế một typed strategy/parameter khác |
| `ClassCastException` tại dòng đọc typed value | Heap pollution xảy ra sớm hơn qua raw/unchecked boundary | Bật `-Xlint:unchecked`, lần ngược warning đầu tiên |
| Reflection chỉ thấy raw class | Đang hỏi runtime instance thay vì declaration metadata | Truyền `Class<T>`/`Type` token có chủ đích tại boundary |
| Bridge method trong stack trace | Compiler bảo toàn overriding sau erasure | Dùng `javap -v`; debug method source mà bridge delegate tới |
| Generic varargs warning | Non-reifiable component đi qua array | Tránh varargs, dùng collection/snapshot hoặc chứng minh và giới hạn `@SafeVarargs` |

Compiler warning là evidence, không phải noise. Trong module mới, cân nhắc `javac -Xlint:unchecked` và policy fail build cho unchecked warning mới. Khi migration legacy chưa thể sạch ngay, baseline warnings và giảm dần thay vì suppress diện rộng.

## Production và trade-offs

Generics chuyển nhiều lỗi sang compile time và tạo API tự mô tả hơn, nhưng có ba chi phí cần quản lý:

1. Erasure giới hạn runtime type tests, generic arrays và primitive specialization; generic algorithms dùng wrapper cho primitive values nên có thể phát sinh boxing.
2. Flexible wildcard signatures tăng khả năng tái sử dụng nhưng error message/capture có thể khó với caller.
3. Giữ binary compatibility với ecosystem cũ tạo raw types, bridges và unchecked boundaries.

Checklist production:

- Không chấp nhận unchecked warning mới nếu chưa có owner và lý do cụ thể.
- Cô lập deserialization/reflection/legacy boundary và validate element type trước khi đưa vào domain code.
- Truyền explicit type token khi runtime thật sự cần type argument; đừng giả định `T.class` tồn tại.
- Test public generic API bằng subtype/supertype cases, không chỉ exact type happy path.
- Review API evolution ở cả source và binary level; đổi bound hoặc overload có thể ảnh hưởng inference/erasure.
- Profile boxing/allocation với workload thật; erasure không đồng nghĩa generic code luôn “miễn phí”, nhưng cũng không đủ để kết luận nó chậm.
- Không return wildcard nếu caller buộc phải capture chỉ để dùng kết quả bình thường.

## Khi không nên dùng generics

- Khi các variants có behavior khác nhau và type parameter chỉ che một hierarchy/domain model cần polymorphism rõ.
- Khi runtime schema phải được phân biệt nhưng API không mang `Class<T>`/`Type` token.
- Khi một `<T>` chỉ thay `Object` mà không liên kết hai vị trí hay cung cấp thêm guarantee.
- Khi signature trở nên khó hiểu hơn một interface có tên phản ánh capability.
- Khi unchecked cast là cách duy nhất “chứng minh” implementation; hãy xem lại boundary hoặc representation.

## Góc phỏng vấn

Câu trả lời senior không dừng ở “generics bị xóa lúc runtime”. Cần tách compile-time contract khỏi runtime representation, giải thích vì sao invariance ngăn ghi sai type, PECS mô tả hướng dữ liệu, và erasure dẫn tới non-reifiable restrictions cùng bridge methods. Với production, nêu cách lần từ `ClassCastException` về unchecked warning/heap pollution đầu nguồn.

## Key Takeaways

- Type parameter nên biểu diễn một relationship thật giữa các vị trí trong API.
- Generic types invariant; wildcard tạo variance an toàn tại use site.
- Wildcard capture helper chỉ hợp thức hóa operation giữ cùng unknown type, không biến operation sai thành đúng.
- Erasure bảo toàn compatibility nhưng giới hạn runtime inspection và tạo bridge/casts.
- Raw types và unchecked warnings là đường vào heap pollution; cô lập chúng tại boundary nhỏ nhất.

:::flashcard
id: java-generics-erasure-variance-parameter-argument
front: Type parameter và type argument khác nhau thế nào?
back: Type parameter như T được khai báo trong generic class/method; type argument như String được cung cấp để tạo một parameterized type như Box<String>.
level: advanced
tags: ["java", "generics", "type-parameters"]
:::

:::flashcard
id: java-generics-erasure-variance-invariance
front: Vì sao `Box<Dog>` không phải subtype của `Box<Animal>`?
back: Nếu được xem là subtype, code nhận Box<Animal> có thể ghi Cat vào box chỉ cho Dog. Invariance bảo vệ cả read và write contract.
level: advanced
tags: ["java", "generics", "invariance"]
:::

:::flashcard
id: java-generics-erasure-variance-pecs
front: PECS diễn tả hướng dữ liệu thế nào?
back: Producer dùng `? extends T` để đọc T; consumer dùng `? super T` để ghi T. Nếu vừa đọc vừa ghi cùng type, thường dùng type parameter cụ thể.
level: advanced
tags: ["java", "generics", "pecs", "wildcards"]
:::

:::flashcard
id: java-generics-erasure-variance-reifiable
front: Vì sao `instanceof List<String>` không hợp lệ nhưng `instanceof List<?>` hợp lệ?
back: `List<String>` không reifiable sau erasure, còn parameterized type chỉ chứa unbounded wildcard là reifiable và có thể kiểm tra runtime.
level: advanced
tags: ["java", "generics", "erasure", "reifiable"]
:::

:::flashcard
id: java-generics-erasure-variance-heap-pollution
front: Heap pollution là gì và thường đi vào code bằng đường nào?
back: Một variable parameterized type trỏ tới object không thỏa type contract; raw types, unchecked casts hoặc unsafe generic varargs thường là nguồn và ClassCastException có thể nổ muộn khi đọc.
level: advanced
tags: ["java", "generics", "heap-pollution", "raw-types"]
:::

## Nguồn chính thống

- [Oracle Dev.java — Introducing Generics](https://dev.java/learn/language/fp/generics/intro/)
- [Oracle Dev.java — Wildcards](https://dev.java/learn/language/fp/generics/wildcards/)
- [Oracle Dev.java — Restrictions on Generics](https://dev.java/learn/language/fp/generics/restrictions/)
- [Oracle — JLS 26: Type Variables, Parameterized Types and Erasure](https://docs.oracle.com/javase/specs/jls/se26/html/jls-4.html#jls-4.4)
- [Oracle — JLS 26: Capture Conversion](https://docs.oracle.com/javase/specs/jls/se26/html/jls-5.html#jls-5.1.10)
- [Oracle — JLS 26: Requirements in Overriding and Hiding](https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html#jls-8.4.8.3)
