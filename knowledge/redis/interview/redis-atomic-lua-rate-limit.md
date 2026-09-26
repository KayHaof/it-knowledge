---
id: redis-atomic-lua-rate-limit
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - Lua
  - atomicity
  - rate-limiting
relatedLessons:
  - redis-coordination-rate-limiting
sources:
  - title: Distributed Locks with Redis
    url: https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Rate Limiter
    url: https://redis.io/docs/latest/develop/use-cases/rate-limiter/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Scripting with Lua
    url: https://redis.io/docs/latest/develop/programmability/eval-intro/
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
    - id: lua
      required: true
      aliases:
        - Lua
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: atomicity
      required: true
      aliases:
        - atomicity
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: rate-limiting
      required: false
      aliases:
        - rate-limiting
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - MULTI/EXEC hoặc vài command rời luôn tương đương Lua và rate limit sẽ chính xác giữa mọi Redis node.
      penalty: 20
---

# Vì sao Lua script hữu ích cho fixed-window hoặc token-bucket rate limit?

## Rubric

### Must Include

- Lua

- atomicity

### Strong Answer Includes

- rate-limiting

## Câu trả lời 30 giây

Script chạy atomic trên một Redis server, gộp đọc, tính quota và ghi TTL mà không có race giữa commands. Nó không vượt qua cluster cross-slot hay biến Redis thành durable audit store.

## Câu trả lời chi tiết

Token bucket lưu tokens và timestamp; script tính refill theo elapsed time, cap và retry-after rồi decrement nếu đủ. Atomic script phải bounded CPU/time, deterministic và versioned. Cluster cần hash tag cho state cùng key; clock từ client có thể sai nên chọn time source/policy.

## Góc nhìn Production

Đo allowed/blocked, script latency, key cardinality, memory và clock skew. Load test hot tenant và Redis fail-open/fail-closed decision.

## Trade-offs

Token bucket lưu tokens và timestamp; script tính refill theo elapsed time, cap và retry-after rồi decrement nếu đủ. Atomic script phải bounded CPU/time, deterministic và versioned. Cluster cần hash tag cho state cùng key; clock từ client có thể sai nên chọn time source/policy.

## Câu trả lời sai thường gặp

MULTI/EXEC hoặc vài command rời luôn tương đương Lua và rate limit sẽ chính xác giữa mọi Redis node.

## Follow-up

- Fail-open khi Redis down có rủi ro gì?

- Token bucket khác sliding window thế nào?

## Nguồn chính thống

- [Redis — Distributed Locks with Redis](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [Redis — Redis Rate Limiter](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)
- [Redis — Redis Scripting with Lua](https://redis.io/docs/latest/develop/programmability/eval-intro/)
