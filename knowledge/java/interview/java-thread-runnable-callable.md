---
id: java-thread-runnable-callable
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - Thread
  - Runnable
  - Callable
relatedLessons:
  - java-executors-thread-pools
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
    - id: thread
      required: true
      aliases:
        - Thread
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: runnable
      required: true
      aliases:
        - Runnable
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: callable
      required: false
      aliases:
        - Callable
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Runnable luôn chạy song song ngay khi tạo object, còn Callable tự tạo một thread mới.
      penalty: 20
---

# Thread, Runnable và Callable khác nhau thế nào?

## Rubric

### Must Include

- Thread

- Runnable

### Strong Answer Includes

- Callable

## Câu trả lời 30 giây

Runnable mô tả task không trả value và không checked exception; Callable trả value và có thể ném exception. Thread là execution resource/lifecycle, thường nên submit task vào executor thay vì tự tạo thread cho mỗi request.

## Câu trả lời chi tiết

Tách task khỏi thread giúp chọn pool, queue và rejection policy theo workload. Future lấy kết quả Callable nhưng caller vẫn phải xử lý timeout/cancellation. Thread trực tiếp phù hợp adapter nhỏ hoặc process-owned loop, không phù hợp unbounded request concurrency. Virtual thread thay đổi cost waiting nhưng không thay đổi task contract hay downstream capacity.

## Góc nhìn Production

Đặt tên thread, uncaught-exception handler và graceful shutdown; theo dõi active/queued tasks. Không dùng shared executor cho CPU và blocking I/O nếu cần isolation.

## Trade-offs

Tách task khỏi thread giúp chọn pool, queue và rejection policy theo workload. Future lấy kết quả Callable nhưng caller vẫn phải xử lý timeout/cancellation. Thread trực tiếp phù hợp adapter nhỏ hoặc process-owned loop, không phù hợp unbounded request concurrency. Virtual thread thay đổi cost waiting nhưng không thay đổi task contract hay downstream capacity.

## Câu trả lời sai thường gặp

Runnable luôn chạy song song ngay khi tạo object, còn Callable tự tạo một thread mới.

## Follow-up

- Submit task khác execute thế nào?

- Executor nào phù hợp blocking I/O?

## Nguồn chính thống

- [Oracle — Java Language Specification — Threads and Locks](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html)
- [Oracle — java.util.concurrent Package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html)
- [Oracle — ReentrantLock API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle — VarHandle API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html)
