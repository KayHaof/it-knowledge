---
id: java-language-types-values-parameters
slug: java-language-types-values-parameters
title: Java Types, Values và Parameters — Nền tảng để suy luận đúng
description: Hiểu primitive và reference values, initialization, scope, pass-by-value, overload resolution cùng rủi ro boxing, null và NullPointerException.
technology: Java
domain: backend
category: backend
level: basic
contentType: core
order: 5
estimatedMinutes: 52
tags:
  - java
  - types
  - variables
  - pass-by-value
  - boxing
  - "null"
prerequisites: []
related:
  - java-object-contracts
  - java-jvm-memory
  - java-generics-erasure-variance
learningObjectives:
  - Phân biệt type, variable, primitive value, reference value và object
  - Giải thích initialization, scope và definite assignment của field, local variable, parameter
  - Dự đoán đúng pass-by-value, conversion và overload resolution cơ bản
  - Nhận diện rủi ro boxing, unboxing, null và NullPointerException tại boundary
sources:
  - title: JLS 26 — Types, Values, and Variables
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-4.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-26
  - title: JLS 26 — Conversions and Contexts
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-5.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-26
  - title: JLS 26 — Scope of a Declaration
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-6.html#jls-6.3
    organization: Oracle
    type: specification
    accessedAt: 2026-09-26
  - title: JLS 26 — Method Invocation Expressions
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-15.html#jls-15.12
    organization: Oracle
    type: specification
    accessedAt: 2026-09-26
  - title: Dev.java — Calling Methods and Constructors
    url: https://dev.java/learn/language/oop/classes-objects/calling-methods-constructors/
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: Dev.java — Autoboxing and Unboxing
    url: https://dev.java/learn/numbers-strings/autoboxing/
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
lastReviewed: 2026-09-26
appliesTo:
  java: "21+; language rules cross-checked with Java SE 26"
---

# Java Types, Values và Parameters — Nền tảng để suy luận đúng

## Tổng quan

Nhiều lỗi Java tưởng là lỗi “memory” hoặc “framework” thực ra bắt đầu từ một mental model sai: nhầm variable với object, nhầm reference value với pass-by-reference, nghĩ local variable có default value, hoặc không nhận ra compiler đã boxing/unboxing khi chọn overload. Bài này xây nền tảng để đọc một biểu thức và trả lời ba câu hỏi: compile-time type là gì, value nào đang được copy, và conversion nào được phép xảy ra.

Phạm vi bài là semantics của ngôn ngữ. Equality và `hashCode` được trình bày riêng trong `java-object-contracts`; heap, stack frame và object lifetime được trình bày trong `java-jvm-memory`.

## Mental model: variable là typed slot, object không nằm “trong” reference variable

Java là statically typed: mỗi variable và expression có type được biết tại compile time. Variable là một storage location có type; nó chứa một value phù hợp với type đó. Hai nhóm value chính là:

- primitive value như `int`, `long`, `double`, `char`, `boolean`;
- reference value: một reference tới object/array, hoặc `null`.

Reference variable không chứa toàn bộ object. Gán một reference sang variable khác chỉ copy reference value; hai variable có thể cùng trỏ tới một object. Việc object thật nằm ở vùng runtime nào là câu chuyện JVM implementation, không cần giả định “mọi local ở stack, mọi object ở heap” để giải thích semantics này.

```java title="TypedSlots.java"
int retries = 3;                 // variable chứa primitive value 3
StringBuilder first = new StringBuilder("A");
StringBuilder second = first;    // copy reference value
second.append("B");             // object chung thay đổi

System.out.println(first);       // AB
```

`String`, array, enum, record và wrapper như `Integer` đều là reference types. `String` immutable không biến nó thành primitive; array cũng là object dù syntax truy cập phần tử khác class thông thường.

## Primitive values và conversion số

Java có tám primitive types. `byte`, `short`, `int`, `long` là signed integers; `char` là một unsigned 16-bit UTF-16 code unit, không bảo đảm biểu diễn trọn một Unicode code point; `float` và `double` theo IEEE 754; `boolean` chỉ có `true` và `false`.

| Nhóm | Type | Điều cần nhớ |
|---|---|---|
| Integral | `byte`, `short`, `int`, `long` | Phép toán trên `byte`/`short` thường được numeric promotion thành `int` |
| Character unit | `char` | Một ký tự người dùng nhìn thấy có thể cần nhiều hơn một `char` |
| Floating point | `float`, `double` | Có rounding, infinity và NaN; không dùng như decimal money nếu cần chính xác thập phân |
| Logic | `boolean` | Không chuyển ngầm từ số/reference như trong C |

Integer overflow không tự ném exception. Cast narrowing có thể mất high-order bits; nó chỉ yêu cầu compiler cho phép conversion, không xác nhận value còn đúng với domain.

```java title="NumericConversions.java"
byte quantity = 100;
int doubled = quantity * 2;       // binary numeric promotion -> int

int max = Integer.MAX_VALUE;
int wrapped = max + 1;            // Integer.MIN_VALUE, không tự throw

long total = (long) max * 2;      // widen trước phép nhân
```

Trong nghiệp vụ, hãy kiểm tra range và dùng operation có failure rõ như `Math.addExact` khi overflow phải bị từ chối. Không thêm cast chỉ để “làm compiler im lặng”; trước hết xác định conversion có giữ invariant hay không.

## Field, local variable, parameter và scope

Instance field và static field nhận initial value mặc định nếu chương trình không ghi initializer: số là zero, `boolean` là `false`, reference là `null`. Local variable không được tự gán default; compiler yêu cầu nó definitely assigned trên mọi control-flow path trước khi đọc. Parameter đã nhận value khi method được gọi, nên là variable đã được khởi tạo.

```java title="InitializationRules.java"
final class JobState {
  private int attempts;          // mặc định 0
  private String owner;          // mặc định null

  int nextDelay(boolean urgent) {
    int seconds;
    if (urgent) {
      seconds = 1;
    } else {
      seconds = 10;
    }
    return seconds;              // definitely assigned trên cả hai nhánh
  }
}
```

Scope quyết định nơi một declaration có thể được tham chiếu. Block nhỏ làm lifetime logic và vùng ảnh hưởng dễ thấy hơn. Shadowing field bằng parameter là hợp lệ và thường xuất hiện trong constructor, nhưng phải dùng `this.field` để phân biệt; shadowing nhiều tầng khiến debug khó và dễ cập nhật nhầm variable.

```java title="ScopeAndShadowing.java"
final class RetryPolicy {
  private final int limit;

  RetryPolicy(int limit) {
    if (limit < 0) throw new IllegalArgumentException("limit");
    this.limit = limit;
  }
}
```

Đừng dùng giá trị mặc định của field để biểu diễn trạng thái nghiệp vụ nếu `0`, `false` hoặc `null` không thật sự là trạng thái hợp lệ. Constructor/factory nên thiết lập invariant rõ thay vì để một object “nửa khởi tạo” lọt ra ngoài.

## Java luôn truyền argument theo value

Khi gọi method, value của mỗi argument được gán vào parameter mới. Với primitive, primitive value được copy. Với reference type, reference value được copy. Vì hai reference có thể trỏ cùng object, callee có thể mutate object đó nếu API cho phép; nhưng gán parameter sang reference khác không gán lại variable của caller.

```java title="PassByValue.java"
static void update(StringBuilder label, int attempts) {
  label.append("-checked");          // mutate object chung
  label = new StringBuilder("other"); // chỉ gán lại parameter local
  attempts++;                         // chỉ đổi primitive parameter local
}

StringBuilder label = new StringBuilder("order");
int attempts = 1;
update(label, attempts);

System.out.println(label);     // order-checked
System.out.println(attempts);  // 1
```

Mệnh đề “object được pass-by-reference” che mất khác biệt giữa mutate referent và rebind parameter. Khi thiết kế API, ghi rõ ownership và mutation policy: method có sửa object đầu vào không, có giữ reference sau khi trả về không, và caller có được dùng object đồng thời ở thread khác không.

## Conversion và overload resolution cơ bản

Java áp dụng conversion theo context: assignment, method invocation, cast, numeric promotion, string conversion. Widening primitive như `int` sang `long` thường không cần cast; narrowing như `long` sang `int` cần cast vì có thể mất dữ liệu. Widening reference giữ type safety; downcast reference được runtime kiểm tra và có thể ném `ClassCastException`.

Overload resolution diễn ra tại compile time dựa trên declared types và các method khả dụng. Một mental model giản lược nhưng hữu ích là compiler tìm lần lượt:

1. fixed-arity method áp dụng bằng strict invocation, chưa dùng boxing/unboxing;
2. fixed-arity method áp dụng khi cho phép boxing/unboxing;
3. variable-arity (`varargs`) method nếu hai pha trước không có kết quả;
4. trong cùng pha, chọn method most specific; nếu không có một lựa chọn duy nhất, compilation thất bại.

```java title="OverloadPhases.java"
static String choose(long value) { return "long"; }
static String choose(Integer value) { return "Integer"; }
static String choose(int... values) { return "varargs"; }

String selected = choose(1); // "long": widening ở strict phase thắng boxing/varargs
```

Runtime type của object không làm compiler chọn lại overload:

```java title="DeclaredTypeWins.java"
static String describe(Object value) { return "object"; }
static String describe(String value) { return "string"; }

Object value = "hello";
System.out.println(describe(value)); // object
```

Đừng tạo overload chỉ khác nhau bằng nhiều tổ hợp primitive/wrapper/varargs nếu caller phải thuộc lòng resolution rules. Tên method khác nhau hoặc một parameter object có contract rõ thường dễ bảo trì hơn. Thêm overload mới vào public API còn có thể làm source code cũ trở nên ambiguous khi compile lại.

## Boxing, unboxing và null

Boxing chuyển primitive thành wrapper tương ứng; unboxing lấy primitive value từ wrapper. Compiler có thể chèn conversion ở assignment, argument, arithmetic hoặc comparison context. Wrapper cần thiết khi API yêu cầu reference type, khi generic type không nhận primitive, hoặc khi `null` thật sự biểu diễn absence.

```java title="UnboxingBoundary.java"
Map<String, Integer> quotas = Map.of("free", 10);

Integer premiumQuota = quotas.get("premium"); // null: key không tồn tại
// int next = premiumQuota + 1;                // NullPointerException khi unbox

int safeQuota = quotas.getOrDefault("premium", 0);
```

Rủi ro quan trọng:

- unboxing một `null` ném `NullPointerException` tại chỗ conversion, không nhất thiết tại nơi `null` được tạo;
- boxing trong hot loop hoặc cấu trúc dữ liệu lớn có thể tăng allocation/memory traffic, nhưng phải profile trước khi tối ưu;
- implementation có thể tái sử dụng một số wrapper instance; code không được dựa vào wrapper identity như business contract;
- wrapper nullable đi qua JSON, database hoặc configuration cần phân biệt rõ “missing”, `null` và giá trị zero/false.

Nếu absence không hợp lệ, reject sớm bằng validation hoặc `Objects.requireNonNull` với tên field rõ. Nếu absence hợp lệ, giữ nó rõ trong type/API contract và chuyển sang default chỉ tại nơi business rule thật sự định nghĩa default đó.

## Khi nên dùng và khi không nên dùng

- Dùng primitive cho value bắt buộc, tính toán số học và đường dữ liệu cần tránh nullable state.
- Dùng wrapper khi một API/generic boundary yêu cầu reference hoặc khi `null` là một trạng thái có chủ đích.
- Dùng overload khi các variant có cùng semantics và resolution vẫn dễ dự đoán.
- Không dùng `null` để mã hóa nhiều trạng thái khác nhau như “chưa tải”, “không tồn tại”, “bị cấm” và “lỗi”.
- Không dùng cast để thay validation range/schema.
- Không mutate argument nếu method name/contract khiến caller hợp lý kỳ vọng một phép tính thuần.

## Failure Scenarios và debugging

| Triệu chứng | Câu hỏi điều tra | Cách sửa thường phù hợp |
|---|---|---|
| Compile error “might not have been initialized” | Control-flow path nào đọc local trước khi gán? | Gán trên mọi path hoặc cấu trúc lại flow; không thêm default giả |
| NPE tại arithmetic/call nhận primitive | Có wrapper nullable bị auto-unbox không? | Giữ wrapper đến boundary, validate/default theo business rule |
| Caller thấy object đổi dù “đã truyền bản sao” | Callee mutate referent hay chỉ rebind parameter? | Làm rõ ownership, copy hoặc dùng immutable value |
| Chọn overload bất ngờ | Declared type và phase conversion nào đang thắng? | Thu hẹp overload set, thêm cast có chủ đích hoặc đổi tên method |
| Giá trị số âm/nhỏ sau tính toán lớn | Overflow xảy ra trước hay sau widening? | Widen operand trước phép toán, kiểm range hoặc dùng exact operation |

Khi debug, tách ba lớp bằng evidence: source type mà compiler thấy, bytecode/conversion compiler tạo, và value runtime. Bật compiler warnings, đặt breakpoint trước operation gây lỗi và xem cả wrapper lẫn primitive target. Với overload khó hiểu, tạo một compile test tối thiểu thay vì suy từ runtime log.

## Production và trade-offs

Type chặt giúp đẩy lỗi về compile time, nhưng wrapper nullable và overload phức tạp có thể mở lại ambiguity ở runtime hoặc call site. Primitive thường gọn hơn, nhưng không biểu diễn absence và không dùng trực tiếp làm generic type argument. Defensive copy giảm side effect nhưng có allocation cost; quyết định theo ownership và workload, không theo khẩu hiệu.

Ở boundary production:

1. Định nghĩa rõ missing/null/default trong API, event và database mapping.
2. Validate narrowing conversion và range trước khi persist hoặc gửi sang hệ thống khác.
3. Không giữ mutable argument sau lời gọi nếu contract không nói rõ ownership transfer.
4. Theo dõi NPE theo call site và input shape; sửa nơi sinh trạng thái sai, không chỉ thêm null-check cuối chuỗi.
5. Benchmark boxing/allocation bằng workload đại diện nếu profiler cho thấy nó đáng kể.
6. Compatibility-test public overloads khi nâng library/compiler vì thêm method có thể đổi source resolution.

## Góc phỏng vấn

Một câu trả lời tốt về pass-by-value bắt đầu bằng “Java copy value vào parameter”, sau đó tách primitive value và reference value, rồi minh họa mutate referent khác rebind parameter. Với boxing, cần nêu compiler chèn conversion, unboxing `null` gây NPE và overload có thể ưu tiên widening trước boxing. Không cần viện dẫn stack/heap để giải thích contract ngôn ngữ.

## Key Takeaways

- Variable là typed storage location; reference value không phải object.
- Field có default initialization, local variable phải definitely assigned trước khi đọc.
- Java luôn pass-by-value, kể cả khi value được copy là reference.
- Overload resolution là quyết định compile-time theo declared type và conversion phases.
- Boxing giúp nối primitive với reference APIs nhưng đưa thêm nullability và có thể có chi phí allocation.

:::flashcard
id: java-language-types-values-variable-object
front: Reference variable có chứa trực tiếp object không?
back: Không. Nó chứa một reference value tới object hoặc null; gán sang variable khác copy reference value chứ không copy object.
level: basic
tags: ["java", "types", "references"]
:::

:::flashcard
id: java-language-types-values-local-field-initialization
front: Field và local variable chưa có initializer khác nhau thế nào?
back: Instance/static field nhận default value theo type; local variable phải definitely assigned trên mọi control-flow path trước khi đọc.
level: basic
tags: ["java", "variables", "initialization"]
:::

:::flashcard
id: java-language-types-values-pass-by-value
front: Vì sao method sửa được object của caller nhưng không gán lại được reference variable của caller?
back: Parameter nhận bản copy của reference value. Bản copy trỏ cùng object nên có thể mutate object, nhưng rebind parameter chỉ đổi local copy.
level: basic
tags: ["java", "pass-by-value", "references"]
:::

:::flashcard
id: java-language-types-values-unboxing-null
front: Khi nào autounboxing có thể gây NullPointerException?
back: Khi compiler cần lấy primitive value từ một wrapper đang null, ví dụ dùng Integer null trong phép toán hoặc truyền vào parameter int.
level: basic
tags: ["java", "boxing", "null"]
:::

## Nguồn chính thống

- [Oracle — JLS 26: Types, Values, and Variables](https://docs.oracle.com/javase/specs/jls/se26/html/jls-4.html)
- [Oracle — JLS 26: Conversions and Contexts](https://docs.oracle.com/javase/specs/jls/se26/html/jls-5.html)
- [Oracle — JLS 26: Scope of a Declaration](https://docs.oracle.com/javase/specs/jls/se26/html/jls-6.html#jls-6.3)
- [Oracle — JLS 26: Method Invocation Expressions](https://docs.oracle.com/javase/specs/jls/se26/html/jls-15.html#jls-15.12)
- [Oracle Dev.java — Calling Methods and Constructors](https://dev.java/learn/language/oop/classes-objects/calling-methods-constructors/)
- [Oracle Dev.java — Autoboxing and Unboxing](https://dev.java/learn/numbers-strings/autoboxing/)
