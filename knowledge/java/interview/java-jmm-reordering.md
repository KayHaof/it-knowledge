---
id: java-jmm-reordering
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - JMM
  - reordering
  - happens-before
relatedLessons:
  - java-memory-model-locks-atomics
sources:
  - title: Java Language Specification — Threads and Locks
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: java.util.concurrent Package
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: ReentrantLock API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: VarHandle API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html
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
    - id: jmm
      required: true
      aliases:
        - JMM
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: reordering
      required: true
      aliases:
        - reordering
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: happens-before
      required: false
      aliases:
        - happens-before
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CPU hiện đại chạy tuần tự nên source order luôn là execution order giữa thread.
      penalty: 20
---

# Compiler/CPU reordering ảnh hưởng code concurrent Java như thế nào?

## Rubric

### Must Include

- JMM

- reordering

### Strong Answer Includes

- happens-before

## Câu trả lời 30 giây

Java Memory Model cho phép reorder khi không vi phạm single-thread semantics. Không có happens-before, reader có thể thấy stale hoặc trạng thái một phần; synchronized, volatile và atomic tạo các ordering/visibility guarantees cần thiết.

## Câu trả lời chi tiết

Data race là truy cập cùng mutable data mà thiếu ordering/atomicity phù hợp. `volatile` tạo happens-before write→read, monitor unlock→lock và thread start/join có edges riêng. Không nên suy luận từ x86 hoặc test chạy đúng vài lần; code cần proof theo JMM. Immutable final fields giúp một phần nhưng không bảo vệ mutable graph.

## Góc nhìn Production

Dùng concurrency test/stress và static review; tránh ad-hoc sleeps để “fix” race. Ghi rõ ownership/invariant trong code và metrics khi contention.

## Trade-offs

Data race là truy cập cùng mutable data mà thiếu ordering/atomicity phù hợp. `volatile` tạo happens-before write→read, monitor unlock→lock và thread start/join có edges riêng. Không nên suy luận từ x86 hoặc test chạy đúng vài lần; code cần proof theo JMM. Immutable final fields giúp một phần nhưng không bảo vệ mutable graph.

## Câu trả lời sai thường gặp

CPU hiện đại chạy tuần tự nên source order luôn là execution order giữa thread.

## Follow-up

- Happens-before khác wall-clock order thế nào?

- Atomic field có bảo vệ hai field liên quan không?

## Nguồn chính thống

- [Oracle — Java Language Specification — Threads and Locks](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html)
- [Oracle — java.util.concurrent Package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html)
- [Oracle — ReentrantLock API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle — VarHandle API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html)
