---
id: java-record-boundary
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - records
  - immutability
  - DTO
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
    - id: records
      required: true
      aliases:
        - records
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: immutability
      required: true
      aliases:
        - immutability
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: dto
      required: false
      aliases:
        - DTO
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Record tự động deep-copy mọi field nên không bao giờ có shared mutation.
      penalty: 20
---

# Record có đồng nghĩa object bất biến sâu không?

## Rubric

### Must Include

- records

- immutability

### Strong Answer Includes

- DTO

## Câu trả lời 30 giây

Không. Record làm final component fields và sinh accessor/equals/hashCode, nhưng field có thể trỏ tới list hoặc object mutable. Record phù hợp value carrier khi component type cũng được kiểm soát bất biến.

## Câu trả lời chi tiết

Canonical constructor có thể validate và defensive-copy collection. `List.copyOf` bảo vệ cấu trúc list nhưng phần tử bên trong vẫn có thể mutable. Record không cho extends class khác và không thay thế domain aggregate có lifecycle. Serialization, JSON naming và binary compatibility vẫn là contract riêng.

## Góc nhìn Production

Dùng record cho request/response immutable ở boundary, copy collection và validate invariant sớm. Không expose entity persistence trực tiếp chỉ vì record tiện.

## Trade-offs

Canonical constructor có thể validate và defensive-copy collection. `List.copyOf` bảo vệ cấu trúc list nhưng phần tử bên trong vẫn có thể mutable. Record không cho extends class khác và không thay thế domain aggregate có lifecycle. Serialization, JSON naming và binary compatibility vẫn là contract riêng.

## Câu trả lời sai thường gặp

Record tự động deep-copy mọi field nên không bao giờ có shared mutation.

## Follow-up

- Record constructor nên normalize input ở đâu?

- Khi nào class thường tốt hơn record?

## Nguồn chính thống

- [Oracle — JLS 26 — Classes](https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html)
- [OpenJDK — JEP 395 — Records](https://openjdk.org/jeps/395)
- [OpenJDK — JEP 409 — Sealed Classes](https://openjdk.org/jeps/409)
- [Oracle — Record API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html)
