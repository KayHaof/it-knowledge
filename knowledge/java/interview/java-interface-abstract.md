---
id: java-interface-abstract
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - interface
  - abstract-class
  - polymorphism
relatedLessons:
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
    - id: interface
      required: true
      aliases:
        - interface
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: abstract-class
      required: true
      aliases:
        - abstract-class
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: polymorphism
      required: false
      aliases:
        - polymorphism
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Interface chỉ dành cho Java cũ còn abstract class luôn tốt hơn vì có code dùng lại.
      penalty: 20
---

# Khi nào dùng interface và khi nào dùng abstract class?

## Rubric

### Must Include

- interface

- abstract-class

### Strong Answer Includes

- polymorphism

## Câu trả lời 30 giây

Interface mô tả capability/contract và cho phép nhiều interface; abstract class chia sẻ state hoặc invariant triển khai trong một hierarchy. Chọn theo ownership và substitutability, không chỉ theo số method.

## Câu trả lời chi tiết

Interface giúp caller phụ thuộc abstraction và test bằng fake, nhưng default method vẫn cần cẩn thận khi evolve. Abstract class phù hợp template method hoặc protected invariant khi các subtype thực sự cùng concept và cần code chung. Composition thường ít coupling hơn inheritance; inheritance expose protected hooks và tạo fragile base class.

## Góc nhìn Production

Giữ interface nhỏ theo consumer và version contract additive. Không dùng abstract base để gom tiện ích unrelated; đo impact khi thay đổi public API.

## Trade-offs

Interface giúp caller phụ thuộc abstraction và test bằng fake, nhưng default method vẫn cần cẩn thận khi evolve. Abstract class phù hợp template method hoặc protected invariant khi các subtype thực sự cùng concept và cần code chung. Composition thường ít coupling hơn inheritance; inheritance expose protected hooks và tạo fragile base class.

## Câu trả lời sai thường gặp

Interface chỉ dành cho Java cũ còn abstract class luôn tốt hơn vì có code dùng lại.

## Follow-up

- Default method conflict xử lý thế nào?

- Composition thay inheritance ở ví dụ nào?

## Nguồn chính thống

- [Oracle — JLS 26 — Classes](https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html)
- [OpenJDK — JEP 395 — Records](https://openjdk.org/jeps/395)
- [OpenJDK — JEP 409 — Sealed Classes](https://openjdk.org/jeps/409)
- [Oracle — Record API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html)
