---
id: distributed-partial-failure-deadline
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - partial-failure
  - timeout
  - failure-detector
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
    - id: partial-failure
      required: true
      aliases:
        - partial-failure
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: timeout
      required: true
      aliases:
        - timeout
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: failure-detector
      required: false
      aliases:
        - failure-detector
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Nếu TCP connection timeout thì server chắc chắn chưa xử lý request.
      penalty: 20
---

# Vì sao distributed system phải giả định partial failure?

## Rubric

### Must Include

- partial-failure

- timeout

### Strong Answer Includes

- failure-detector

## Câu trả lời 30 giây

Một node có thể sống nhưng network giữa các node lỗi hoặc response chậm không rõ đã commit chưa. Timeout chỉ cho biết caller hết kiên nhẫn, không chứng minh operation chưa chạy.

## Câu trả lời chi tiết

Thiết kế cần deadline, retry có điều kiện, idempotency và trạng thái reconciliation. Failure detector luôn có false positive khi network delay; circuit breaker giảm blast radius nhưng không quyết định truth. Quan sát p99 và queue age để phân biệt slow với down.

## Góc nhìn Production

Fault injection DNS/packet loss/latency; alert timeout rate và unknown outcome.

## Trade-offs

Thiết kế cần deadline, retry có điều kiện, idempotency và trạng thái reconciliation. Failure detector luôn có false positive khi network delay; circuit breaker giảm blast radius nhưng không quyết định truth. Quan sát p99 và queue age để phân biệt slow với down.

## Câu trả lời sai thường gặp

Nếu TCP connection timeout thì server chắc chắn chưa xử lý request.

## Follow-up

- Retry POST an toàn khi nào?

- Làm sao reconcile unknown payment result?

## Nguồn chính thống

- [Amazon Web Services — AWS Builders Library - timeouts, retries and backoff](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
