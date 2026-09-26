---
id: q-structured-concurrency-preview
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - virtual-threads
  - structured-concurrency
  - preview
relatedLessons:
  - java-virtual-threads-structured-concurrency
sources:
  - title: "JEP 444: Virtual Threads"
    url: https://openjdk.org/jeps/444
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: StructuredTaskScope JDK 26 API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/StructuredTaskScope.html
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
    - id: virtual-threads
      required: true
      aliases:
        - virtual-threads
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: structured-concurrency
      required: true
      aliases:
        - structured-concurrency
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: preview
      required: false
      aliases:
        - preview
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi API liên quan Project Loom đều stable từ Java 21 và có thể dùng không cần flags.
      penalty: 20
---

# Virtual threads đã final có nghĩa Structured Concurrency cũng là API final chưa?

## Rubric

### Must Include

- virtual-threads

- structured-concurrency

### Strong Answer Includes

- preview

## Câu trả lời 30 giây

Không. Virtual threads được final từ JDK 21, còn StructuredTaskScope vẫn là preview trong JDK 26. Dùng production phải bật preview, chấp nhận API có thể đổi và pin build/runtime/tooling cùng version.

## Câu trả lời chi tiết

Virtual thread là execution primitive; structured concurrency quản lifetime các subtasks theo lexical scope, giúp join/cancel/failure propagation và observability. Tôi chỉ dùng preview sau ADR, compatibility test và migration plan; library public không nên leak preview type nếu consumers không đồng bộ JDK flags.

## Deep Dive

Scope đóng trước khi subtasks kết thúc hoặc quên join là lifecycle bug mà structure cố làm rõ. Nó không tăng downstream capacity; vẫn cần semaphore/pool của resource.

## Góc nhìn Production

Record JDK/preview flags, test shutdown/cancellation/pinning và có fallback API stable nếu risk không chấp nhận.

## Trade-offs

Scope đóng trước khi subtasks kết thúc hoặc quên join là lifecycle bug mà structure cố làm rõ. Nó không tăng downstream capacity; vẫn cần semaphore/pool của resource.

## Câu trả lời sai thường gặp

Mọi API liên quan Project Loom đều stable từ Java 21 và có thể dùng không cần flags.

## Follow-up

- Structured concurrency khác CompletableFuture graph?

- Virtual thread có nên pool không?

## Nguồn chính thống

- [OpenJDK — JEP 444: Virtual Threads](https://openjdk.org/jeps/444)
- [Oracle — StructuredTaskScope JDK 26 API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/StructuredTaskScope.html)
