---
id: distributed-backoff-jitter
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: middle
topics:
  - backoff
  - jitter
  - thundering-herd
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
    - id: backoff
      required: true
      aliases:
        - backoff
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: jitter
      required: true
      aliases:
        - jitter
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: thundering-herd
      required: false
      aliases:
        - thundering-herd
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Exponential backoff không jitter đã đủ vì mỗi client có latency mạng khác nhau nên sẽ tự phân tán.
      penalty: 20
---

# Jitter trong exponential backoff giải quyết thundering herd thế nào?

## Rubric

### Must Include

- backoff

- jitter

### Strong Answer Includes

- thundering-herd

## Câu trả lời 30 giây

Jitter ngẫu nhiên hóa thời điểm retry để clients không cùng thức dậy và đập vào dependency. Cần cap, budget và idempotency; jitter không sửa root cause overload.

## Câu trả lời chi tiết

Full/equal/decorrelated jitter có phân bố khác nhau; chọn theo latency/recovery và retry volume. Clock-scheduled jobs cũng cần spread. Nếu server trả Retry-After, client phải tôn trọng trong deadline. Backoff dài có thể tăng queue age nên worker cần visibility.

## Góc nhìn Production

Đo retry synchrony, downstream QPS peaks, recovery time và queue age. Chaos test simultaneous client failure.

## Trade-offs

Full/equal/decorrelated jitter có phân bố khác nhau; chọn theo latency/recovery và retry volume. Clock-scheduled jobs cũng cần spread. Nếu server trả Retry-After, client phải tôn trọng trong deadline. Backoff dài có thể tăng queue age nên worker cần visibility.

## Câu trả lời sai thường gặp

Exponential backoff không jitter đã đủ vì mỗi client có latency mạng khác nhau nên sẽ tự phân tán.

## Follow-up

- Retry-After và client cap phối hợp thế nào?

- Full jitter khác decorrelated jitter ra sao?

## Nguồn chính thống

- [IETF — HTTP Semantics — Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html)
- [Amazon Web Services — Retry with backoff pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)
- [Amazon Web Services — Circuit breaker pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html)
