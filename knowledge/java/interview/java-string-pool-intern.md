---
id: java-string-pool-intern
type: interview-question
technology: Java
category: Java
difficulty: junior
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
        - String immutable nên `==` luôn đúng khi nội dung giống nhau.
      penalty: 20
---

# String pool hoạt động ra sao và vì sao không dùng `==` để so sánh nội dung?

## Rubric

### Must Include

- String

- pool

### Strong Answer Includes

- intern

## Câu trả lời 30 giây

Literal có thể dùng chung trong string pool; `==` so reference còn `equals` so nội dung. `intern()` đưa/canonicalize reference vào pool nhưng lạm dụng có thể tăng memory và contention.

## Câu trả lời chi tiết

Compiler/runtime có thể canonicalize literal, nhưng String tạo từ input hoặc `new String` có identity khác dù cùng text. String immutable giúp sharing an toàn. Dùng equals hoặc constant-first equals cho input null; chỉ intern dữ liệu bounded, ổn định khi đã đo lợi ích.

## Góc nhìn Production

Theo dõi heap/metaspace và tránh intern unbounded từ request hoặc header.

## Trade-offs

Compiler/runtime có thể canonicalize literal, nhưng String tạo từ input hoặc `new String` có identity khác dù cùng text. String immutable giúp sharing an toàn. Dùng equals hoặc constant-first equals cho input null; chỉ intern dữ liệu bounded, ổn định khi đã đo lợi ích.

## Câu trả lời sai thường gặp

String immutable nên `==` luôn đúng khi nội dung giống nhau.

## Follow-up

- Vì sao String immutable hữu ích cho hash key?

- Khi nào canonicalization đáng dùng?

## Nguồn chính thống

- [Oracle — String API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/String.html)
- [Oracle — StringBuilder API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/StringBuilder.html)
- [Oracle — JLS 26 — Lexical Structure and String Literals](https://docs.oracle.com/javase/specs/jls/se26/html/jls-3.html)
- [OpenJDK — JEP 254 — Compact Strings](https://openjdk.org/jeps/254)
- [OpenJDK — JEP 280 — Indify String Concatenation](https://openjdk.org/jeps/280)
