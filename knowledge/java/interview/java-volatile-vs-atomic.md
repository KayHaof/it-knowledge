---
id: java-volatile-vs-atomic
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - volatile
  - atomic
  - visibility
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
    - id: volatile
      required: true
      aliases:
        - volatile
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: atomic
      required: true
      aliases:
        - atomic
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: visibility
      required: false
      aliases:
        - visibility
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Volatile làm mọi thao tác trên biến atomic và thay được synchronized.
      penalty: 20
---

# Volatile có thay thế AtomicInteger cho mọi counter không?

## Rubric

### Must Include

- volatile

- atomic

### Strong Answer Includes

- visibility

## Câu trả lời 30 giây

Volatile đảm bảo visibility và ordering nhất định nhưng không làm phép read-modify-write atomic. Counter nhiều writer cần atomic operation hoặc lock.

## Câu trả lời chi tiết

`volatile int x` khiến thread đọc giá trị mới hơn nhưng `x++` vẫn gồm đọc, cộng, ghi và có thể mất update. AtomicInteger dùng CAS cho operation đơn biến; invariant nhiều biến thường cần lock hoặc immutable state swap. Tính đúng đắn phải dựa trên happens-before, không chỉ “thấy volatile”.

## Góc nhìn Production

Kiểm tra contention/CAS retry và dùng metric để phát hiện lost update; benchmark trên CPU thật.

## Trade-offs

`volatile int x` khiến thread đọc giá trị mới hơn nhưng `x++` vẫn gồm đọc, cộng, ghi và có thể mất update. AtomicInteger dùng CAS cho operation đơn biến; invariant nhiều biến thường cần lock hoặc immutable state swap. Tính đúng đắn phải dựa trên happens-before, không chỉ “thấy volatile”.

## Câu trả lời sai thường gặp

Volatile làm mọi thao tác trên biến atomic và thay được synchronized.

## Follow-up

- CAS thất bại nhiều khi nào?

- Khi nào lock dễ đúng hơn atomic?

## Nguồn chính thống

- [Oracle — Java Language Specification — Threads and Locks](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html)
- [Oracle — java.util.concurrent Package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html)
- [Oracle — ReentrantLock API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle — VarHandle API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html)
