---
id: microservice-timeout-budget
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - timeouts
  - deadline
  - fan-out
relatedLessons:
  - distributed-failures
sources:
  - title: AWS Builders Library - timeouts, retries and backoff
    url: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
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
    - id: timeouts
      required: true
      aliases:
        - timeouts
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: deadline
      required: true
      aliases:
        - deadline
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: fan-out
      required: false
      aliases:
        - fan-out
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đặt cùng timeout 30 giây cho mọi hop là đơn giản và luôn đủ vì request tổng cũng 30 giây.
      penalty: 20
---

# Bạn phân bổ timeout khi một API fan-out tới nhiều service thế nào?

## Rubric

### Must Include

- timeouts

- deadline

### Strong Answer Includes

- fan-out

## Câu trả lời 30 giây

Caller deadline là upper bound; mỗi child có budget nhỏ hơn, gồm connect/pool/read và processing. Chừa margin cho aggregation, serialize và retry, đồng thời hủy work khi deadline hết.

## Câu trả lời chi tiết

Nếu fan-out song song, tổng latency gần max child nhưng failure probability tăng; tuần tự cộng latency. Retry phải nằm trong deadline tổng và chỉ cho operation idempotent. Cancellation không chắc dừng server work nên downstream cần deadline/cancel propagation và bounded concurrency.

## Góc nhìn Production

Trace per-child deadline/timeout, orphan work, pool wait và p99; load test partial slow/fail. Fallback ghi freshness/unknown state rõ.

## Trade-offs

Nếu fan-out song song, tổng latency gần max child nhưng failure probability tăng; tuần tự cộng latency. Retry phải nằm trong deadline tổng và chỉ cho operation idempotent. Cancellation không chắc dừng server work nên downstream cần deadline/cancel propagation và bounded concurrency.

## Câu trả lời sai thường gặp

Đặt cùng timeout 30 giây cho mọi hop là đơn giản và luôn đủ vì request tổng cũng 30 giây.

## Follow-up

- Fan-out 20 service ảnh hưởng error budget thế nào?

- Cancellation propagation qua HTTP/gRPC ra sao?

## Nguồn chính thống

- [Amazon Web Services — AWS Builders Library - timeouts, retries and backoff](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
