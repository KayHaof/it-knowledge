---
id: microservices-retry-storm
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - retry
  - backoff
  - jitter
  - circuit-breaker
relatedLessons:
  - idempotency-retry-circuit-breaker
sources:
  - title: HTTP Semantics — Idempotent Methods
    url: https://www.rfc-editor.org/rfc/rfc9110.html
    organization: IETF
    type: standard
    accessedAt: 2026-09-02
  - title: Retry with backoff pattern
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Circuit breaker pattern
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html
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
    - id: retry
      required: true
      aliases:
        - retry
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: backoff
      required: true
      aliases:
        - backoff
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: jitter
      required: false
      aliases:
        - jitter
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: circuit-breaker
      required: false
      aliases:
        - circuit-breaker
      points:
        technicalCorrectness: 10
        completeness: 5
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Cứ retry đến khi thành công là tăng reliability mà không có downside.
      penalty: 20
---

# Retry storm hình thành và chặn như thế nào?

## Rubric

### Must Include

- retry

- backoff

### Strong Answer Includes

- jitter

- circuit-breaker

## Câu trả lời 30 giây

Nhiều tầng cùng retry khi dependency chậm làm request tăng theo cấp số, càng quá tải hơn. Giới hạn attempt, deadline, exponential backoff+jitter và circuit breaker/bulkhead để cô lập.

## Câu trả lời chi tiết

Retry chỉ an toàn với lỗi transient và operation idempotent; tổng timeout phải nằm trong caller budget. Một tầng sở hữu retry policy, tầng khác propagate failure để tránh nhân bản. Khi breaker mở, trả fallback/503 nhanh và có half-open probe nhỏ.

## Góc nhìn Production

Metric retry amplification, breaker state, downstream saturation; test failure injection.

## Trade-offs

Retry chỉ an toàn với lỗi transient và operation idempotent; tổng timeout phải nằm trong caller budget. Một tầng sở hữu retry policy, tầng khác propagate failure để tránh nhân bản. Khi breaker mở, trả fallback/503 nhanh và có half-open probe nhỏ.

## Câu trả lời sai thường gặp

Cứ retry đến khi thành công là tăng reliability mà không có downside.

## Follow-up

- Timeout budget truyền qua chain thế nào?

- Jitter giảm synchronized retry ra sao?

## Nguồn chính thống

- [IETF — HTTP Semantics — Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html)
- [Amazon Web Services — Retry with backoff pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)
- [Amazon Web Services — Circuit breaker pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html)
