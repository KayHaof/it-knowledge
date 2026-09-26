---
id: java-future-vs-completablefuture
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - Future
  - CompletableFuture
  - async
relatedLessons:
  - java-completable-future
sources:
  - title: CompletableFuture API
    url: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: CompletionStage API
    url: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletionStage.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Executors API
    url: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Executors.html
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
    - id: future
      required: true
      aliases:
        - Future
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: completablefuture
      required: true
      aliases:
        - CompletableFuture
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: async
      required: false
      aliases:
        - async
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CompletableFuture luôn chạy trên nhiều thread và không bao giờ block.
      penalty: 20
---

# CompletableFuture cải thiện mô hình Future truyền thống ở đâu?

## Rubric

### Must Include

- Future

- CompletableFuture

### Strong Answer Includes

- async

## Câu trả lời 30 giây

Future cơ bản chủ yếu chờ kết quả blocking; CompletableFuture cho phép compose, combine và xử lý lỗi bất đồng bộ. Nó không tự tạo capacity hay biến tác vụ blocking thành non-blocking.

## Câu trả lời chi tiết

`thenCompose` flatten async dependency, `thenCombine` chạy nhánh độc lập, `orTimeout` tạo deadline. Mặc định nhiều stage dùng common pool, nên blocking I/O cần executor riêng. Propagate cancellation/timeout và giữ context tracing vì thread đổi.

## Góc nhìn Production

Đo queue/executor, timeout và fan-out; dùng structured cancellation cho workflow dài.

## Trade-offs

`thenCompose` flatten async dependency, `thenCombine` chạy nhánh độc lập, `orTimeout` tạo deadline. Mặc định nhiều stage dùng common pool, nên blocking I/O cần executor riêng. Propagate cancellation/timeout và giữ context tracing vì thread đổi.

## Câu trả lời sai thường gặp

CompletableFuture luôn chạy trên nhiều thread và không bao giờ block.

## Follow-up

- thenApply và thenCompose khác nhau thế nào?

- Xử lý exception ở chain ra sao?

## Nguồn chính thống

- [Oracle — CompletableFuture API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html)
- [Oracle — CompletionStage API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletionStage.html)
- [Oracle — Executors API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Executors.html)
