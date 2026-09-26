---
id: java-pass-by-value-reference
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - references
  - parameters
  - immutability
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
    - id: references
      required: true
      aliases:
        - references
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: parameters
      required: true
      aliases:
        - parameters
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: immutability
      required: false
      aliases:
        - immutability
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Java pass object by reference nên method có thể thay object của caller bằng phép gán parameter.
      penalty: 20
---

# Java truyền tham số object theo value hay reference?

## Rubric

### Must Include

- references

- parameters

### Strong Answer Includes

- immutability

## Câu trả lời 30 giây

Java luôn pass-by-value; với object, value được copy là reference. Method có thể mutate object qua reference copy nhưng gán parameter sang object khác không đổi biến của caller.

## Câu trả lời chi tiết

Với primitive, copy là giá trị primitive; với object, copy là handle trỏ cùng object. Vì vậy `list.add` thấy ở caller còn `list = newList` thì không. Thiết kế API nên nói rõ mutation, dùng immutable value hoặc trả kết quả mới để tránh side effect.

## Góc nhìn Production

Review ownership và thread-safety khi truyền mutable object qua async boundary.

## Trade-offs

Với primitive, copy là giá trị primitive; với object, copy là handle trỏ cùng object. Vì vậy `list.add` thấy ở caller còn `list = newList` thì không. Thiết kế API nên nói rõ mutation, dùng immutable value hoặc trả kết quả mới để tránh side effect.

## Câu trả lời sai thường gặp

Java pass object by reference nên method có thể thay object của caller bằng phép gán parameter.

## Follow-up

- Record có làm object immutable tuyệt đối không?

- Làm sao bảo vệ collection khỏi mutation?

## Nguồn chính thống

- [Oracle — JLS 26 — Classes](https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html)
- [OpenJDK — JEP 395 — Records](https://openjdk.org/jeps/395)
- [OpenJDK — JEP 409 — Sealed Classes](https://openjdk.org/jeps/409)
- [Oracle — Record API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html)
