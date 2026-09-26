---
id: java-executor-queue-saturation
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - ExecutorService
  - ThreadPoolExecutor
  - backpressure
relatedLessons:
  - java-executors-thread-pools
  - high-concurrency
sources:
  - title: ThreadPoolExecutor API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: AWS Builders Library - avoiding overload
    url: https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/
    organization: Amazon Web Services
    type: vendor-documentation
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
    - id: executorservice
      required: true
      aliases:
        - ExecutorService
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: threadpoolexecutor
      required: true
      aliases:
        - ThreadPoolExecutor
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: backpressure
      required: false
      aliases:
        - backpressure
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Queue càng lớn càng an toàn vì request sẽ luôn chờ thay vì bị từ chối.
      penalty: 20
---

# ThreadPoolExecutor nên phản ứng thế nào khi queue đầy?

## Rubric

### Must Include

- ExecutorService

- ThreadPoolExecutor

### Strong Answer Includes

- backpressure

## Câu trả lời 30 giây

Queue đầy là tín hiệu quá tải; policy có thể reject, chạy caller, hoặc drop theo loại công việc. Tăng thread vô hạn chỉ đẩy áp lực sang CPU, downstream và memory.

## Câu trả lời chi tiết

Bounded queue cùng core/max pool và rejection policy tạo bulkhead rõ ràng. `CallerRunsPolicy` tạo backpressure lên request thread nhưng có thể làm timeout lan truyền; `AbortPolicy` cần map thành lỗi retryable có kiểm soát. Tách pool theo dependency và đo active, queue depth, rejection, execution latency.

## Góc nhìn Production

Đặt deadline, bulkhead và alert saturation; không dùng unbounded queue cho request path.

## Trade-offs

Bounded queue cùng core/max pool và rejection policy tạo bulkhead rõ ràng. `CallerRunsPolicy` tạo backpressure lên request thread nhưng có thể làm timeout lan truyền; `AbortPolicy` cần map thành lỗi retryable có kiểm soát. Tách pool theo dependency và đo active, queue depth, rejection, execution latency.

## Câu trả lời sai thường gặp

Queue càng lớn càng an toàn vì request sẽ luôn chờ thay vì bị từ chối.

## Follow-up

- Pool sizing cho CPU-bound và I/O-bound khác nhau thế nào?

- Làm sao ngăn retry làm queue phình?

## Nguồn chính thống

- [Oracle — ThreadPoolExecutor API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html)
- [Amazon Web Services — AWS Builders Library - avoiding overload](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/)
