---
id: java-generics-type-erasure
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - generics
  - type-erasure
  - wildcards
relatedLessons:
  - java-generics-erasure-variance
  - java-collections-generics
sources:
  - title: Collections Framework Overview
    url: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: HashMap API
    url: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Java Language Specification — Type Arguments
    url: https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1
    organization: Oracle
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
    - id: generics
      required: true
      aliases:
        - generics
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: type-erasure
      required: true
      aliases:
        - type-erasure
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: wildcards
      required: false
      aliases:
        - wildcards
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - JVM tạo một class riêng cho mỗi tham số generic và kiểm tra đầy đủ lúc runtime.
      penalty: 20
---

# Type erasure giới hạn generic Java ở những điểm nào?

## Rubric

### Must Include

- generics

- type-erasure

### Strong Answer Includes

- wildcards

## Câu trả lời 30 giây

Runtime thường không giữ tham số generic nên không `new T()`, không `instanceof List<String>` và không overload chỉ khác generic. Compiler vẫn chèn cast và kiểm type ở compile time.

## Câu trả lời chi tiết

`List<String>` và `List<Integer>` cùng raw representation; reflection có thể thấy metadata trong một số declaration nhưng không phải runtime type test. Dùng wildcard để biểu đạt variance, type token khi cần runtime type, và tránh raw type vì mất kiểm tra. Heap pollution có thể xuất hiện qua varargs/raw API.

## Góc nhìn Production

Bật compiler warnings và kiểm boundary serialization/schema thay vì dựa vào generic runtime.

## Trade-offs

`List<String>` và `List<Integer>` cùng raw representation; reflection có thể thấy metadata trong một số declaration nhưng không phải runtime type test. Dùng wildcard để biểu đạt variance, type token khi cần runtime type, và tránh raw type vì mất kiểm tra. Heap pollution có thể xuất hiện qua varargs/raw API.

## Câu trả lời sai thường gặp

JVM tạo một class riêng cho mỗi tham số generic và kiểm tra đầy đủ lúc runtime.

## Follow-up

- PECS áp dụng cho API collection thế nào?

- Type token giải quyết vấn đề gì?

## Nguồn chính thống

- [Oracle — Collections Framework Overview](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html)
- [Oracle — HashMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [Oracle — Java Language Specification — Type Arguments](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1)
