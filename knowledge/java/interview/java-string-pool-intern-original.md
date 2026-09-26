---
id: java-string-pool-intern-original
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - String
  - pool
  - intern
relatedLessons:
  - java-string-internals-building
sources:
  - title: String API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/String.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: StringBuilder API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/StringBuilder.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: JLS 26 — Lexical Structure and String Literals
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-3.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 254 — Compact Strings
    url: https://openjdk.org/jeps/254
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 280 — Indify String Concatenation
    url: https://openjdk.org/jeps/280
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
rubric:
  dimensions:
    technicalCorrectness: 40
    completeness: 20
    reasoning: 15
    production: 10
    tradeoffs: 10
    communication: 5
  concepts:
    - id: string
      required: true
      aliases:
        - String
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: pool
      required: true
      aliases:
        - pool
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: intern
      required: false
      aliases:
        - intern
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi String đều tự động cùng object và `==` luôn thay cho equals.
      penalty: 20
---

# String pool là gì và khi nào không nên gọi `intern()`?

## Rubric

### Must Include

- String

- pool

### Strong Answer Includes

- intern

## Câu trả lời 30 giây

String literal được canonicalize trong pool nên cùng literal thường chia sẻ object. `intern()` đưa một String vào pool hoặc trả canonical reference, nhưng pool vẫn tiêu tốn memory và có contention/chi phí; không phải cách chung để chữa duplicate data.

## Câu trả lời chi tiết

String immutable nên chia sẻ literal an toàn. Compile-time constants được đưa vào pool, còn string tạo runtime không tự động có cùng identity. `intern()` có thể giảm retained duplicate strings trong dataset phù hợp, nhưng làm canonical table lớn và giữ references lâu hơn. So sánh nội dung bằng `equals`, không dùng identity do pool.

## Góc nhìn Production

Đo retained heap và GC trước/sau khi intern; cân nhắc dictionary bounded hoặc encoding riêng cho cardinality cao. Heap dump giúp xác định duplicate String thực sự.

## Trade-offs

String immutable nên chia sẻ literal an toàn. Compile-time constants được đưa vào pool, còn string tạo runtime không tự động có cùng identity. `intern()` có thể giảm retained duplicate strings trong dataset phù hợp, nhưng làm canonical table lớn và giữ references lâu hơn. So sánh nội dung bằng `equals`, không dùng identity do pool.

## Câu trả lời sai thường gặp

Mọi String đều tự động cùng object và `==` luôn thay cho equals.

## Follow-up

- String literal concatenation được tối ưu khi nào?

- Java 9 compact strings ảnh hưởng footprint ra sao?

## Nguồn chính thống

- [Oracle — String API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/String.html)
- [Oracle — StringBuilder API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/StringBuilder.html)
- [Oracle — JLS 26 — Lexical Structure and String Literals](https://docs.oracle.com/javase/specs/jls/se26/html/jls-3.html)
- [OpenJDK — JEP 254 — Compact Strings](https://openjdk.org/jeps/254)
- [OpenJDK — JEP 280 — Indify String Concatenation](https://openjdk.org/jeps/280)
