---
id: java-readwritelock-tradeoff
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - ReadWriteLock
  - contention
  - cache
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
    - id: readwritelock
      required: true
      aliases:
        - ReadWriteLock
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: contention
      required: true
      aliases:
        - contention
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: cache
      required: false
      aliases:
        - cache
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - ReadWriteLock cho reader chạy vô hạn song song mà writer luôn được ưu tiên.
      penalty: 20
---

# ReadWriteLock có luôn tốt khi số reader lớn hơn writer không?

## Rubric

### Must Include

- ReadWriteLock

- contention

### Strong Answer Includes

- cache

## Câu trả lời 30 giây

Không. Reader lock vẫn có overhead, writer starvation hoặc cache contention; workload read ngắn có thể nhanh hơn với synchronized/immutable snapshot. Cần đo read/write duration và contention thực tế.

## Câu trả lời chi tiết

ReentrantReadWriteLock cho nhiều reader đồng thời và một writer độc quyền, với fair/nonfair policy. Upgrade read→write dễ deadlock; downgrade phải theo thứ tự. Nếu data có thể copy atomically, immutable snapshot/volatile reference thường giảm lock. StampedLock optimistic read có trade-off validation và không reentrant.

## Góc nhìn Production

Theo dõi lock wait, writer latency và snapshot memory. Không giữ read lock khi gọi I/O; test write burst và cancellation.

## Trade-offs

ReentrantReadWriteLock cho nhiều reader đồng thời và một writer độc quyền, với fair/nonfair policy. Upgrade read→write dễ deadlock; downgrade phải theo thứ tự. Nếu data có thể copy atomically, immutable snapshot/volatile reference thường giảm lock. StampedLock optimistic read có trade-off validation và không reentrant.

## Câu trả lời sai thường gặp

ReadWriteLock cho reader chạy vô hạn song song mà writer luôn được ưu tiên.

## Follow-up

- Vì sao read-to-write upgrade nguy hiểm?

- Immutable snapshot tốn gì?

## Nguồn chính thống

- [Oracle — Java Language Specification — Threads and Locks](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html)
- [Oracle — java.util.concurrent Package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html)
- [Oracle — ReentrantLock API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle — VarHandle API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html)
