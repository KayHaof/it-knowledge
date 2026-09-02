---
id: java-string-internals-building
slug: java-string-internals-building
title: Java String Internals và Xây dựng Chuỗi Hiệu quả
description: Hiểu UTF-16 semantics, string pool, compact strings, concatenation và lựa chọn StringBuilder/encoding đúng cho workload production.
category: backend
technology: Java
level: intermediate
estimatedMinutes: 52
tags: ["java","string","unicode","stringbuilder","concatenation","encoding"]
prerequisites: ["java-platform-bytecode-classloading"]
related: ["java-jvm-memory","java-jvm-gc-profiling","java-io-nio-files"]
next: java-performance-jfr-jmh-diagnostics
learningObjectives: ["Phân biệt UTF-16 code unit, code point và grapheme","Giải thích pool, intern và compact-string implementation","Chọn concat, StringBuilder, streaming và charset theo workload"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+; compact strings are an implementation optimization since JDK 9"}
sources: [{"title":"String API — Java SE 26","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/String.html","organization":"Oracle","type":"official-api-reference","accessedAt":"2026-09-02"},{"title":"StringBuilder API — Java SE 26","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/StringBuilder.html","organization":"Oracle","type":"official-api-reference","accessedAt":"2026-09-02"},{"title":"JLS 26 — Lexical Structure and String Literals","url":"https://docs.oracle.com/javase/specs/jls/se26/html/jls-3.html","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"},{"title":"JEP 254 — Compact Strings","url":"https://openjdk.org/jeps/254","organization":"OpenJDK","type":"specification","accessedAt":"2026-09-02"},{"title":"JEP 280 — Indify String Concatenation","url":"https://openjdk.org/jeps/280","organization":"OpenJDK","type":"specification","accessedAt":"2026-09-02"}]
---
## String là value immutable với UTF-16 semantics

`String` biểu diễn chuỗi theo UTF-16 code units. `length()` trả số `char` code units, không đảm bảo là số Unicode code points hay số ký tự người dùng nhìn thấy. Một code point ngoài Basic Multilingual Plane dùng surrogate pair; một grapheme có thể gồm base character và combining marks, hoặc nhiều code points ghép thành một emoji.

```java title="UnicodeLength.java"
String text = "A😀";
System.out.println(text.length());                  // 3 UTF-16 code units
System.out.println(text.codePointCount(0, text.length())); // 2 code points
```

Vì vậy cắt tên “tối đa 20 ký tự” bằng `substring(0, 20)` có thể tách surrogate pair hoặc không đúng với grapheme người dùng. Validation phải định nghĩa unit: bytes theo protocol, code points theo technical rule, hay grapheme clusters theo UX. Java core có API code-point; segmentation theo locale/grapheme cần algorithm/library phù hợp và test Unicode.

Immutability cho phép share `String`, cache hash và dùng làm map key an toàn về state. Nó không làm nội dung vô hại: string giữ password/token có thể sống lâu trong heap, xuất hiện trong dump/log và không thể zero hóa. Secret ngắn hạn nên dùng representation có lifecycle kiểm soát nếu API cho phép.

## Literal pool và `intern`

String literals và constant string expressions được intern theo language contract. Vì vậy hai literal cùng nội dung thường cùng reference, nhưng code phải dùng `equals`, không dùng `==` cho value comparison.

```java title="PoolIdentity.java"
String a = "order";
String b = "or" + "der";          // constant expression
String c = new String("order");

assert a == b;
assert a != c;
assert a.equals(c);
```

`intern()` trả canonical representation từ pool. Intern dữ liệu cardinality cao từ user có thể giữ nhiều entries và tăng memory/GC pressure; nó không phải cache strategy mặc định. Chỉ cân nhắc khi vocabulary thực sự bounded, profile chứng minh duplication đáng kể, và có canary/rollback. Deduplication của collector hay application dictionary có trade-off khác.

## Compact Strings là implementation detail

JEP 254 đổi representation nội bộ của HotSpot từ `char[]` sang `byte[]` cộng encoding flag khi nội dung có thể biểu diễn dạng Latin-1, còn vẫn giữ public UTF-16 semantics. Optimization này xuất hiện từ JDK 9 nhưng không phải API contract để reflection dựa vào. Nội dung tiếng Việt thường có code points ngoài Latin-1, nên lợi ích footprint phụ thuộc dữ liệu thật.

Không ước lượng memory bằng `length() * 2` rồi tuyên bố chính xác. Object headers, alignment, coder, sharing/copy behavior và runtime version đều ảnh hưởng. Dùng JFR/heap analysis trên workload đại diện khi memory là quyết định kiến trúc.

## Concatenation: source giống nhau, runtime có thể khác

Toán tử `+` được JLS định nghĩa cho string concatenation. Compiler có thể constant-fold biểu thức literals. Với biểu thức runtime, JEP 280 chuyển bytecode sang `invokedynamic` concat factory để runtime tối ưu strategy mà không cần compiler hard-code chuỗi `StringBuilder` cụ thể.

```java title="ReadableConcat.java"
String label = "order=" + orderId + ", state=" + state;
```

Một expression concat đơn thường rõ và được toolchain tối ưu tốt. Nhưng concat lặp trong loop gán lại tạo intermediate strings vì `String` immutable:

```java title="LoopBuilding.java"
StringBuilder out = new StringBuilder(estimatedCapacity);
for (OrderLine line : lines) {
  out.append(line.sku()).append(',').append(line.quantity()).append('\n');
}
return out.toString();
```

Đừng tự động rewrite mọi `+` thành builder; compiler có context tốt trong một expression và code phức tạp hơn chưa chắc nhanh. Builder có lợi khi append qua nhiều iterations/branches hoặc API cần mutable buffer.

## Capacity, lifetime và giant buffer

`StringBuilder` giữ mutable sequence và không thread-safe. `StringBuffer` synchronized nhưng hiếm khi là câu trả lời đúng cho shared output; thường ownership một thread/request đơn giản hơn. `ensureCapacity` hoặc constructor capacity có thể giảm resize khi estimate đáng tin, nhưng overestimate lớn giữ memory không cần thiết.

ThreadLocal builder tưởng giảm allocation nhưng có thể giữ backing array khổng lồ sau một request bất thường trên thread pool. Nếu tái sử dụng, đặt maximum retained capacity và clear ownership; thường local builder dễ vận hành hơn. Một `toString()` vẫn tạo immutable result, nên xây payload cực lớn trong memory có thể cần streaming thay vì builder.

| Workload | Lựa chọn ban đầu |
|---|---|
| Một expression nhỏ | `+` cho readability |
| Loop/conditional append | `StringBuilder` local |
| Join collection đơn giản | `String.join`, `Collectors.joining` nếu semantics phù hợp |
| File/HTTP payload lớn | `Writer`, stream hoặc chunked encoder |
| Template phức tạp | Template/formatter có escaping và locale rõ |

## Charset boundary: bytes không phải String

Network, file và database wire format là bytes. Chuyển giữa bytes và `String` phải chỉ định charset:

```java title="Utf8Boundary.java"
byte[] payload = text.getBytes(StandardCharsets.UTF_8);
String decoded = new String(payload, StandardCharsets.UTF_8);
```

Dùng default charset làm behavior phụ thuộc OS/container configuration. Decoder có malformed/unmappable policy; silent replacement character có thể phá identifier, signature hoặc dữ liệu. Với protocol, pin UTF-8/charset theo specification, kiểm error handling và giới hạn input trước decode nếu có nguy cơ memory abuse.

`String.getBytes(UTF_8).length` mới là byte length UTF-8, nhưng tạo array; ở hot path lớn hãy dùng encoder/stream hoặc đo strategy phù hợp. Không dùng `length()` để enforce database byte limit.

## Production failure patterns

- `+=` trong loop lớn tạo allocation và GC pressure.
- Log concat chạy trước khi logger kiểm level, gây work vô ích và có thể lộ PII; dùng parameterized logging nhưng vẫn redact.
- Regex cho thao tác literal đơn giản gây compile/matching cost hoặc ReDoS với pattern không tin cậy.
- `split` có semantics regex và trailing-empty behavior dễ gây parse sai.
- `substring` giữ semantics index theo `char`, có thể cắt Unicode sai.
- Accumulate toàn bộ export/JSON trong builder gây peak heap; stream với backpressure/size limit.
- `intern` mọi request key làm pool tăng theo cardinality.

## Chẩn đoán và tối ưu

1. Đo allocation rate, GC và hot stack bằng JFR/profiler.
2. Xác nhận output correctness, charset và escaping trước performance.
3. Phân biệt nhiều small strings với một giant retained buffer.
4. Tạo JMH benchmark cô lập nếu cần so primitive operation; chống dead-code elimination và warmup đúng.
5. Xác nhận lại bằng load test/end-to-end vì logging, I/O và serializer thường chi phối.
6. Giữ implementation đơn giản nếu gain không còn dưới workload thật.

:::warning SQL và HTML
StringBuilder không biến dữ liệu thành an toàn. SQL cần parameter binding; HTML/JSON/CSV cần escaping đúng context. Nối chuỗi nhanh hơn không bù được injection hoặc format corruption.
:::

## Câu hỏi phỏng vấn

**`String.length()` đếm gì?** Số UTF-16 code units; không nhất thiết là code points hay grapheme người dùng nhìn thấy.

**Có luôn phải dùng StringBuilder thay `+` không?** Không. Một concat expression được compiler/runtime tối ưu; builder phù hợp append lặp hoặc nhiều nhánh. Phải đo allocation và workload thực.

## Key Takeaways

- String API dùng UTF-16 code-unit indexing; UX “character” cần định nghĩa khác.
- So sánh value bằng `equals`, không dựa literal-pool identity.
- Compact Strings là HotSpot optimization, không phải public representation contract.
- Dùng builder cho incremental construction, streaming cho payload lớn.
- Charset, escaping, size limit và secret handling là production boundary bắt buộc.

