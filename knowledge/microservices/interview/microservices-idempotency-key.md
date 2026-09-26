---
id: microservices-idempotency-key
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - idempotency
  - deduplication
  - API
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
    - id: idempotency
      required: true
      aliases:
        - idempotency
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: deduplication
      required: true
      aliases:
        - deduplication
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: api
      required: false
      aliases:
        - API
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ hash body ở client là đủ, không cần lưu trạng thái server.
      penalty: 20
---

# Thiết kế idempotency key cho command API cần lưu gì?

## Rubric

### Must Include

- idempotency

- deduplication

### Strong Answer Includes

- API

## Câu trả lời 30 giây

Lưu key gắn với caller/operation, request fingerprint và kết quả trạng thái trong TTL phù hợp. Retry cùng payload trả kết quả cũ; payload khác phải bị từ chối.

## Câu trả lời chi tiết

Record cần trạng thái processing/succeeded/failed, unique constraint và atomic claim để chống race. TTL phải dài hơn retry window nhưng có cleanup. Idempotency không thay business invariant; downstream event/payment cũng cần dedup.

## Góc nhìn Production

Theo dõi key conflict, store growth và stuck-processing; tránh chứa plaintext sensitive response.

## Trade-offs

Record cần trạng thái processing/succeeded/failed, unique constraint và atomic claim để chống race. TTL phải dài hơn retry window nhưng có cleanup. Idempotency không thay business invariant; downstream event/payment cũng cần dedup.

## Câu trả lời sai thường gặp

Chỉ hash body ở client là đủ, không cần lưu trạng thái server.

## Follow-up

- Crash giữa claim và commit xử lý thế nào?

- Idempotency key scope theo tenant ra sao?

## Nguồn chính thống

- [IETF — HTTP Semantics — Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html)
- [Amazon Web Services — Retry with backoff pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)
- [Amazon Web Services — Circuit breaker pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html)
