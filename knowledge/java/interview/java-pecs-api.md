---
id: java-pecs-api
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - PECS
  - wildcards
  - collections
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
    - id: pecs
      required: true
      aliases:
        - PECS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: wildcards
      required: true
      aliases:
        - wildcards
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: collections
      required: false
      aliases:
        - collections
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Extends luôn cho phép đọc và ghi mọi subtype vào collection.
      penalty: 20
---

# PECS áp dụng vào một method copy collection như thế nào?

## Rubric

### Must Include

- PECS

- wildcards

### Strong Answer Includes

- collections

## Câu trả lời 30 giây

Producer Extends, Consumer Super. Source nên là `Iterable<? extends T>` để đọc T; destination nên là `Collection<? super T>` để ghi T. Cách này cho phép subtype source và supertype destination an toàn.

## Câu trả lời chi tiết

Method `copy(Collection<? super T> dest, Collection<? extends T> src)` đọc từng T từ src rồi add vào dest. `extends` không cho add vì compiler không biết subtype cụ thể; `super` cho add T vì mọi supertype của T đều nhận được T. PECS là guideline cho variance tại boundary, không phải quy tắc đặt wildcard mọi nơi.

## Góc nhìn Production

Public utility API nên dùng variance nơi tăng khả năng tái sử dụng nhưng giữ local variable type đơn giản. Compile test với subtype/supertype để tránh API chỉ chạy happy path.

## Trade-offs

Method `copy(Collection<? super T> dest, Collection<? extends T> src)` đọc từng T từ src rồi add vào dest. `extends` không cho add vì compiler không biết subtype cụ thể; `super` cho add T vì mọi supertype của T đều nhận được T. PECS là guideline cho variance tại boundary, không phải quy tắc đặt wildcard mọi nơi.

## Câu trả lời sai thường gặp

Extends luôn cho phép đọc và ghi mọi subtype vào collection.

## Follow-up

- Vì sao destination không dùng `? extends T`?

- Type inference chọn T từ hai tham số thế nào?

## Nguồn chính thống

- [Oracle — Collections Framework Overview](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html)
- [Oracle — HashMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [Oracle — Java Language Specification — Type Arguments](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1)
