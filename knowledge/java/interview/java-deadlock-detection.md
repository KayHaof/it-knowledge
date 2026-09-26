---
id: java-deadlock-detection
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - deadlock
  - thread-dump
  - locks
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
    - id: deadlock
      required: true
      aliases:
        - deadlock
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: thread-dump
      required: true
      aliases:
        - thread-dump
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: locks
      required: false
      aliases:
        - locks
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Deadlock luôn tự được JVM phát hiện và giải phóng một thread.
      penalty: 20
---

# Điều tra deadlock Java trong production theo các bước nào?

## Rubric

### Must Include

- deadlock

- thread-dump

### Strong Answer Includes

- locks

## Câu trả lời 30 giây

Chụp nhiều thread dump, tìm vòng chờ monitor/lock và map stack về code/lock order. Sau đó giảm phạm vi lock, đặt timeout hoặc thống nhất thứ tự acquire.

## Câu trả lời chi tiết

`jcmd Thread.print`/JFR có thể chỉ deadlocked threads; một dump đơn lẻ có thể nhầm với slow I/O. Tôi đối chiếu lock owner, request trace và pool saturation, rồi tái hiện với timeout/fault injection. Không chữa bằng restart duy nhất vì restart che mất nguyên nhân và có thể làm retry storm.

## Góc nhìn Production

Alert blocked-thread age và pool starvation; giữ dump/trace có request correlation.

## Trade-offs

`jcmd Thread.print`/JFR có thể chỉ deadlocked threads; một dump đơn lẻ có thể nhầm với slow I/O. Tôi đối chiếu lock owner, request trace và pool saturation, rồi tái hiện với timeout/fault injection. Không chữa bằng restart duy nhất vì restart che mất nguyên nhân và có thể làm retry storm.

## Câu trả lời sai thường gặp

Deadlock luôn tự được JVM phát hiện và giải phóng một thread.

## Follow-up

- Livelock khác deadlock thế nào?

- Lock timeout có trade-off gì?

## Nguồn chính thống

- [Oracle — Java Language Specification — Threads and Locks](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html)
- [Oracle — java.util.concurrent Package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html)
- [Oracle — ReentrantLock API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle — VarHandle API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html)
