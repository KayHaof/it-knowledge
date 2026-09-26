---
id: q-virtual-thread
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - concurrency
  - loom
relatedLessons:
  - java-concurrency
sources:
  - title: Virtual Threads
    url: https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Java Language Specification - Memory Model
    url: https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html
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
    - id: concurrency
      required: true
      aliases:
        - concurrency
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: loom
      required: true
      aliases:
        - loom
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Virtual thread nhẹ nên mọi task chạy nhanh hơn và không cần giới hạn concurrency.
      penalty: 20
---

# Virtual thread có làm API nhanh hơn không?

## Rubric

### Must Include

- concurrency

- loom

### Strong Answer Includes

## Câu trả lời 30 giây

Không tự giảm latency. Virtual thread giảm chi phí task chờ blocking I/O và có thể tăng throughput; CPU, database connection và downstream capacity vẫn là giới hạn.

## Câu trả lời chi tiết

Virtual thread là java.lang.Thread được JVM schedule lên carrier OS threads. Khi supported blocking I/O xảy ra, runtime có thể unmount virtual thread. Điều này phù hợp thread-per-request I/O-bound. Với CPU-bound, pinning hoặc database pool nhỏ, lợi ích giới hạn; phải benchmark và theo dõi pool wait/pinning.

## Góc nhìn Production

Giữ bulkhead cho downstream, không pool virtual threads, đo JFR pinning và connection-pool wait.

## Trade-offs

Virtual thread là java.lang.Thread được JVM schedule lên carrier OS threads. Khi supported blocking I/O xảy ra, runtime có thể unmount virtual thread. Điều này phù hợp thread-per-request I/O-bound. Với CPU-bound, pinning hoặc database pool nhỏ, lợi ích giới hạn; phải benchmark và theo dõi pool wait/pinning.

## Câu trả lời sai thường gặp

Virtual thread nhẹ nên mọi task chạy nhanh hơn và không cần giới hạn concurrency.

## Follow-up

- Pinning là gì?

- Tại sao không pool virtual threads?

## Nguồn chính thống

- [Oracle — Virtual Threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [Oracle — Java Language Specification - Memory Model](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html)
