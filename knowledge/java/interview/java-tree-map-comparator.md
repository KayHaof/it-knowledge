---
id: java-tree-map-comparator
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - TreeMap
  - Comparator
  - ordering
relatedLessons:
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
    - id: treemap
      required: true
      aliases:
        - TreeMap
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: comparator
      required: true
      aliases:
        - Comparator
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ordering
      required: false
      aliases:
        - ordering
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - TreeMap luôn gọi equals sau khi sort nên comparator chỉ để hiển thị.
      penalty: 20
---

# TreeMap dựa trên equals hay comparator để xác định hai key trùng nhau?

## Rubric

### Must Include

- TreeMap

- Comparator

### Strong Answer Includes

- ordering

## Câu trả lời 30 giây

TreeMap dùng `compare` hoặc `compareTo`; key có kết quả bằng zero được xem là cùng key dù `equals` trả false. Comparator phải nhất quán với domain equality nếu muốn map behavior trực quan.

## Câu trả lời chi tiết

TreeMap là balanced search tree, giữ ordering và cung cấp lookup/logarithmic update. `get`, `put` và `remove` đi theo comparator, không hashCode. Comparator mutable hoặc không transitive có thể làm ordering sai và mất entry theo góc nhìn caller. Nếu cần hash semantics dùng HashMap; nếu cần concurrent sorted map xem ConcurrentSkipListMap.

## Góc nhìn Production

Comparator nên immutable, deterministic và xử lý null policy rõ. Test boundary values, tie-breaker và locale; không dùng comparator phụ thuộc clock/config thay đổi.

## Trade-offs

TreeMap là balanced search tree, giữ ordering và cung cấp lookup/logarithmic update. `get`, `put` và `remove` đi theo comparator, không hashCode. Comparator mutable hoặc không transitive có thể làm ordering sai và mất entry theo góc nhìn caller. Nếu cần hash semantics dùng HashMap; nếu cần concurrent sorted map xem ConcurrentSkipListMap.

## Câu trả lời sai thường gặp

TreeMap luôn gọi equals sau khi sort nên comparator chỉ để hiển thị.

## Follow-up

- Comparator không transitive gây hậu quả gì?

- Khi nào dùng ConcurrentSkipListMap?

## Nguồn chính thống

- [Oracle — Collections Framework Overview](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html)
- [Oracle — HashMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [Oracle — Java Language Specification — Type Arguments](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1)
