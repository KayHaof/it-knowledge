---
id: system-design-rate-limiter-distributed
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - rate-limit
  - token-bucket
  - distributed
relatedLessons:
  - system-design-rate-limiter
sources:
  - title: RFC 6585 — 429 Too Many Requests
    url: https://www.rfc-editor.org/rfc/rfc6585.html
    organization: IETF
    type: standard
    accessedAt: 2026-09-02
  - title: Throttle requests to HTTP APIs
    url: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html
    organization: Amazon Web Services
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis rate limiter use case
    url: https://redis.io/docs/latest/develop/use-cases/rate-limiter/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis INCR rate limiter pattern
    url: https://redis.io/docs/latest/commands/incr/
    organization: Redis
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
    - id: rate-limit
      required: true
      aliases:
        - rate-limit
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: token-bucket
      required: true
      aliases:
        - token-bucket
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: distributed
      required: false
      aliases:
        - distributed
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Rate limit chỉ cần counter trong memory mỗi instance nên tổng cluster vẫn chính xác.
      penalty: 20
---

# Thiết kế distributed rate limiter cho API multi-tenant?

## Rubric

### Must Include

- rate-limit

- token-bucket

### Strong Answer Includes

- distributed

## Câu trả lời 30 giây

Chọn key/scope, algorithm (token bucket/sliding window), store atomic và fail-open/closed theo endpoint. Cần trả Retry-After và bảo vệ store khỏi hot key.

## Câu trả lời chi tiết

Token bucket cho burst + average rate; Redis Lua/atomic command giúp check-and-decrement, nhưng cluster hash/replication có semantics. Edge limiter giảm load, service limiter bảo vệ resource; clock và race cần kiểm. Quota tenant/user/IP, plan override và audit đều là policy.

## Góc nhìn Production

Đo allowed/denied, store latency, skew và failover; test thundering herd.

## Trade-offs

Token bucket cho burst + average rate; Redis Lua/atomic command giúp check-and-decrement, nhưng cluster hash/replication có semantics. Edge limiter giảm load, service limiter bảo vệ resource; clock và race cần kiểm. Quota tenant/user/IP, plan override và audit đều là policy.

## Câu trả lời sai thường gặp

Rate limit chỉ cần counter trong memory mỗi instance nên tổng cluster vẫn chính xác.

## Follow-up

- Fail-open khi Redis down khi nào?

- Retry-After tính từ đâu?

## Nguồn chính thống

- [IETF — RFC 6585 — 429 Too Many Requests](https://www.rfc-editor.org/rfc/rfc6585.html)
- [Amazon Web Services — Throttle requests to HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html)
- [Redis — Redis rate limiter use case](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)
- [Redis — Redis INCR rate limiter pattern](https://redis.io/docs/latest/commands/incr/)
