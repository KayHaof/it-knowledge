---
id: java-threadlocal-pool-leak
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - ThreadLocal
  - thread-pool
  - leak
relatedLessons:
  - java-concurrent-collections-coordination
sources:
  - title: ConcurrentHashMap API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: BlockingQueue API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/BlockingQueue.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: CopyOnWriteArrayList API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/CopyOnWriteArrayList.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: ConcurrentSkipListMap API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentSkipListMap.html
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
    - id: threadlocal
      required: true
      aliases:
        - ThreadLocal
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: thread-pool
      required: true
      aliases:
        - thread-pool
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: leak
      required: false
      aliases:
        - leak
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - ThreadLocal tự reset sau mỗi task của ExecutorService.
      penalty: 20
---

# ThreadLocal có thể gây leak dữ liệu request trong thread pool như thế nào?

## Rubric

### Must Include

- ThreadLocal

- thread-pool

### Strong Answer Includes

- leak

## Câu trả lời 30 giây

ThreadLocal value sống theo worker thread, không theo request. Nếu không remove trong finally, context hoặc payload của request trước có thể bị giữ và lộ sang request sau, đồng thời giữ heap lâu.

## Câu trả lời chi tiết

Pool tái sử dụng thread nên ThreadLocal map tồn tại qua nhiều task; key weak nhưng value có thể còn tới khi map expunge. Async handoff còn làm context propagation sai hoặc mất. Chỉ lưu dữ liệu nhỏ, immutable và cleanup ở owner boundary; framework context cần dùng API lifecycle-aware.

## Góc nhìn Production

Test request isolation, heap retained size và MDC/security context cleanup. Tránh đưa user/tenant data nhạy cảm vào ThreadLocal nếu không có clear hook.

## Trade-offs

Pool tái sử dụng thread nên ThreadLocal map tồn tại qua nhiều task; key weak nhưng value có thể còn tới khi map expunge. Async handoff còn làm context propagation sai hoặc mất. Chỉ lưu dữ liệu nhỏ, immutable và cleanup ở owner boundary; framework context cần dùng API lifecycle-aware.

## Câu trả lời sai thường gặp

ThreadLocal tự reset sau mỗi task của ExecutorService.

## Follow-up

- Vì sao key weak không đủ tránh value leak?

- Context propagation qua CompletableFuture nên làm thế nào?

## Nguồn chính thống

- [Oracle — ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
- [Oracle — BlockingQueue API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/BlockingQueue.html)
- [Oracle — CopyOnWriteArrayList API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/CopyOnWriteArrayList.html)
- [Oracle — ConcurrentSkipListMap API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentSkipListMap.html)
