---
id: q-java-pass
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - references
  - memory
relatedLessons:
  - java-language-types-values-parameters
  - java-jvm-memory
sources:
  - title: Java Virtual Machine Specification
    url: https://docs.oracle.com/javase/specs/jvms/se21/html/
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: Java troubleshooting guide
    url: https://docs.oracle.com/en/java/javase/21/troubleshoot/
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
        technicalCorrectness: 20
        completeness: 10
    - id: memory
      required: true
      aliases:
        - memory
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Object trong Java được pass-by-reference nên method có thể gán lại object của caller.
      penalty: 20
---

# Java là pass-by-value hay pass-by-reference?

## Rubric

### Must Include

- references

- memory

### Strong Answer Includes

## Câu trả lời 30 giây

Java luôn pass-by-value. Với object, giá trị được copy là reference; hai biến trỏ cùng object nhưng gán lại parameter không đổi biến của caller.

## Câu trả lời chi tiết

Primitive truyền bản sao giá trị. Với object, reference cũng là một giá trị và được copy vào parameter. Method có thể mutation object qua reference copy nếu object mutable, nhưng không thể thay reference của caller bằng cách gán parameter sang object khác. Vì vậy mô tả chính xác vẫn là pass-by-value.

## Góc nhìn Production

Giảm mutation shared state và dùng object immutable ở boundary giúp code concurrent, cache và test dễ suy luận hơn.

## Trade-offs

Primitive truyền bản sao giá trị. Với object, reference cũng là một giá trị và được copy vào parameter. Method có thể mutation object qua reference copy nếu object mutable, nhưng không thể thay reference của caller bằng cách gán parameter sang object khác. Vì vậy mô tả chính xác vẫn là pass-by-value.

## Câu trả lời sai thường gặp

Object trong Java được pass-by-reference nên method có thể gán lại object của caller.

## Follow-up

- Tại sao mutation object vẫn thấy từ caller?

- String immutable ảnh hưởng ví dụ này thế nào?

## Nguồn chính thống

- [Oracle — Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se21/html/)
- [Oracle — Java troubleshooting guide](https://docs.oracle.com/en/java/javase/21/troubleshoot/)
