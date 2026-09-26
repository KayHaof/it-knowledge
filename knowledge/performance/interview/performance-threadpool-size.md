---
id: performance-threadpool-size
type: interview-question
technology: Performance
category: Performance
difficulty: senior
topics:
  - thread-pool
  - queueing
  - CPU
relatedLessons:
  - high-concurrency
sources:
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
    - id: thread-pool
      required: true
      aliases:
        - thread-pool
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: queueing
      required: true
      aliases:
        - queueing
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: cpu
      required: false
      aliases:
        - CPU
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Nhiều thread luôn tăng throughput vì nhiều request chạy đồng thời.
      penalty: 20
---

# Vì sao tăng thread pool có thể làm hiệu năng tệ hơn?

## Rubric

### Must Include

- thread-pool

- queueing

### Strong Answer Includes

- CPU

## Câu trả lời 30 giây

Thread quá nhiều tăng context switch, contention và queue downstream; CPU-bound không vượt số core hữu ích. I/O-bound vẫn bị giới hạn connection/service capacity.

## Câu trả lời chi tiết

Pool bounded là admission control; Little’s Law liên kết concurrency/throughput/latency. Tách pool theo dependency và đo active, queue, rejection, service time trước tuning. Virtual thread không bỏ giới hạn DB/downstream.

## Góc nhìn Production

Tune với CPU quota/container và tổng instance; load test workload thật.

## Trade-offs

Pool bounded là admission control; Little’s Law liên kết concurrency/throughput/latency. Tách pool theo dependency và đo active, queue, rejection, service time trước tuning. Virtual thread không bỏ giới hạn DB/downstream.

## Câu trả lời sai thường gặp

Nhiều thread luôn tăng throughput vì nhiều request chạy đồng thời.

## Follow-up

- Queueing delay đo ở đâu?

- Pool starvation khác DB slow thế nào?

## Nguồn chính thống

- [Amazon Web Services — AWS Builders Library - avoiding overload](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/)
