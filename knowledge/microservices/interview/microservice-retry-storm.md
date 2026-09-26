---
id: microservice-retry-storm
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - retry
  - backoff
  - jitter
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
        technicalCorrectness: 14
        completeness: 7
    - id: backoff
      required: true
      aliases:
        - backoff
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: jitter
      required: false
      aliases:
        - jitter
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Retry càng nhiều càng tăng reliability mà không ảnh hưởng downstream vì request cũ đã fail.
      penalty: 20
---

# Retry storm hình thành qua nhiều service như thế nào?

## Rubric

### Must Include

- retry

- backoff

### Strong Answer Includes

- jitter

## Câu trả lời 30 giây

Một lỗi downstream khiến mỗi caller retry, nhân request theo fan-out và cùng thời điểm nếu không jitter. Budget, exponential backoff, circuit breaker và queue/load shedding giảm amplification.

## Câu trả lời chi tiết

Nếu mỗi hop retry 3 lần trong chain 4 tầng, một user request có thể tạo hàng chục attempts. Timeout không cancel server work càng tăng load. Chọn một owner retry, propagate deadline và phân loại transient/overload/permanent; exponential backoff có cap/jitter.

## Góc nhìn Production

Đo attempts/request, retry reason, breaker state, downstream QPS và saturation. Chaos test 5xx/latency/connection reset.

## Trade-offs

Nếu mỗi hop retry 3 lần trong chain 4 tầng, một user request có thể tạo hàng chục attempts. Timeout không cancel server work càng tăng load. Chọn một owner retry, propagate deadline và phân loại transient/overload/permanent; exponential backoff có cap/jitter.

## Câu trả lời sai thường gặp

Retry càng nhiều càng tăng reliability mà không ảnh hưởng downstream vì request cũ đã fail.

## Follow-up

- Retry owner nên là caller hay worker?

- Circuit breaker half-open thăm dò thế nào?

## Nguồn chính thống

- [IETF — HTTP Semantics — Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html)
- [Amazon Web Services — Retry with backoff pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)
- [Amazon Web Services — Circuit breaker pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html)
