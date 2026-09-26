---
id: microservice-idempotency-key
type: interview-question
technology: Microservices
category: Microservices
difficulty: middle
topics:
  - idempotency
  - deduplication
  - commands
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
    - id: commands
      required: false
      aliases:
        - commands
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ hash request trong memory của pod là đủ idempotency vì retry thường quay lại cùng instance.
      penalty: 20
---

# Idempotency key cho command API nên lưu và kiểm tra gì?

## Rubric

### Must Include

- idempotency

- deduplication

### Strong Answer Includes

- commands

## Câu trả lời 30 giây

Lưu key gắn với caller/tenant, request fingerprint, outcome hoặc in-progress state và expiry phù hợp. Cùng key khác payload phải bị reject; retry cùng key trả outcome trước đó.

## Câu trả lời chi tiết

Unique constraint là race-safe authority; state machine cần phân biệt processing/succeeded/failed/unknown. Nếu response mất sau commit, retry đọc stored result. Key store phải durable/HA và cleanup không xóa sớm hơn retry window. Idempotency không ngăn hai key cho cùng business action—domain invariant vẫn cần.

## Góc nhìn Production

Theo dõi duplicate hit, conflict fingerprint, in-progress age và store growth. Test concurrent same key, timeout và regional failover.

## Trade-offs

Unique constraint là race-safe authority; state machine cần phân biệt processing/succeeded/failed/unknown. Nếu response mất sau commit, retry đọc stored result. Key store phải durable/HA và cleanup không xóa sớm hơn retry window. Idempotency không ngăn hai key cho cùng business action—domain invariant vẫn cần.

## Câu trả lời sai thường gặp

Chỉ hash request trong memory của pod là đủ idempotency vì retry thường quay lại cùng instance.

## Follow-up

- Key scope theo tenant hay global?

- Unknown outcome sau provider timeout xử lý thế nào?

## Nguồn chính thống

- [IETF — HTTP Semantics — Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html)
- [Amazon Web Services — Retry with backoff pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)
- [Amazon Web Services — Circuit breaker pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html)
