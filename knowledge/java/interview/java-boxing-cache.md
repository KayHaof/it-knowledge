---
id: java-boxing-cache
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - primitive
  - boxing
  - identity
relatedLessons:
  - java-language-types-values-parameters
  - java-object-model-immutability-records-sealed
sources:
  - title: JLS 26 — Classes
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 395 — Records
    url: https://openjdk.org/jeps/395
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 409 — Sealed Classes
    url: https://openjdk.org/jeps/409
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: Record API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html
    organization: Oracle
    type: official-documentation
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
    - id: primitive
      required: true
      aliases:
        - primitive
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: boxing
      required: true
      aliases:
        - boxing
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: identity
      required: false
      aliases:
        - identity
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Integer luôn so giá trị bằng `==` vì compiler tự tối ưu.
      penalty: 20
---

# Vì sao `Integer` dùng `==` đôi khi đúng và đôi khi sai?

## Rubric

### Must Include

- primitive

- boxing

### Strong Answer Includes

- identity

## Câu trả lời 30 giây

`==` giữa object so identity, không so numeric value. JVM có thể cache một số boxed values nên hai `Integer` nhỏ cùng reference, nhưng không nên dựa vào cache; dùng `equals` hoặc unbox có kiểm soát.

## Câu trả lời chi tiết

Autoboxing biến primitive thành wrapper và có thể gọi `valueOf`, nơi implementation cache một range giá trị. Cache range không phải semantic contract cho mọi giá trị hoặc vendor. `==` giữa wrapper có thể còn gây unboxing tùy operand types và NPE nếu null. Ở collection/map, chọn primitive-friendly design hoặc tránh boxing trong hot loop khi profile chứng minh.

## Góc nhìn Production

Review nullability và allocation khi boxed values đi qua DTO/cache. Static analysis nên bắt `==` giữa wrappers; benchmark boxing bằng JMH nếu latency quan trọng.

## Trade-offs

Autoboxing biến primitive thành wrapper và có thể gọi `valueOf`, nơi implementation cache một range giá trị. Cache range không phải semantic contract cho mọi giá trị hoặc vendor. `==` giữa wrapper có thể còn gây unboxing tùy operand types và NPE nếu null. Ở collection/map, chọn primitive-friendly design hoặc tránh boxing trong hot loop khi profile chứng minh.

## Câu trả lời sai thường gặp

Integer luôn so giá trị bằng `==` vì compiler tự tối ưu.

## Follow-up

- `==` giữa Integer và int được xử lý ra sao?

- Boxing có thể gây memory pressure thế nào?

## Nguồn chính thống

- [Oracle — JLS 26 — Classes](https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html)
- [OpenJDK — JEP 395 — Records](https://openjdk.org/jeps/395)
- [OpenJDK — JEP 409 — Sealed Classes](https://openjdk.org/jeps/409)
- [Oracle — Record API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html)
