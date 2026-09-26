---
id: q-completablefuture-pool
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - CompletableFuture
  - ForkJoinPool
  - blocking
relatedLessons:
  - java-completable-future
sources:
  - title: CompletableFuture API
    url: https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletableFuture.html
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
    - id: completablefuture
      required: true
      aliases:
        - CompletableFuture
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: forkjoinpool
      required: true
      aliases:
        - ForkJoinPool
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: blocking
      required: false
      aliases:
        - blocking
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CompletableFuture luôn tạo thread mới nên không thể làm cạn pool.
      penalty: 20
---

# Điều gì xảy ra khi chặn I/O trong chuỗi CompletableFuture dùng common pool?

## Rubric

### Must Include

- CompletableFuture

- ForkJoinPool

### Strong Answer Includes

- blocking

## Câu trả lời 30 giây

Async stage không chỉ định executor thường dùng common ForkJoinPool. Blocking I/O giữ worker, làm task khác chờ và tạo starvation/latency; async syntax không biến API blocking thành non-blocking.

## Câu trả lời chi tiết

Tôi inventory execution context của từng stage, tách executor có giới hạn cho blocking work và giữ CPU-bound pool riêng. Pool/queue phải có overload policy, timeout và context propagation. Sau đó đo active/queued tasks, downstream capacity và p99; tăng pool mù chỉ chuyển bottleneck.

## Deep Dive

Completion stage có thể chạy inline trên thread hoàn thành stage trước hoặc trên executor tùy API; vì vậy thread-local/security/trace context cần propagation rõ.

## Góc nhìn Production

Không dùng common pool cho workload blocking không kiểm soát; inject executor có ownership và shutdown lifecycle.

## Trade-offs

Completion stage có thể chạy inline trên thread hoàn thành stage trước hoặc trên executor tùy API; vì vậy thread-local/security/trace context cần propagation rõ.

## Câu trả lời sai thường gặp

CompletableFuture luôn tạo thread mới nên không thể làm cạn pool.

## Follow-up

- thenApply khác thenCompose thế nào?

- Cancellation có đảm bảo downstream I/O dừng không?

## Nguồn chính thống

- [Oracle — CompletableFuture API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletableFuture.html)
