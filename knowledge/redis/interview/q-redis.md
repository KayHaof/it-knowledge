---
id: q-redis
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - cache
  - failure
relatedLessons:
  - redis-cache-aside
sources:
  - title: Redis cache-aside
    url: https://redis.io/docs/latest/develop/use-cases/cache-aside/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis key eviction
    url: https://redis.io/docs/latest/develop/reference/eviction/
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
    - id: cache
      required: true
      aliases:
        - cache
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: failure
      required: true
      aliases:
        - failure
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis chỉ là cache và có thể fallback toàn bộ traffic về DB khi lỗi.
      penalty: 20
---

# Tại sao dùng Redis và nếu Redis down thì sao?

## Rubric

### Must Include

- cache

- failure

### Strong Answer Includes

## Câu trả lời 30 giây

Redis giảm latency/load cho hot reads hoặc cung cấp data primitive phù hợp. Nếu down, timeout ngắn và degradation có giới hạn phải bảo vệ database; fail-open mù quáng có thể tạo cascading failure.

## Câu trả lời chi tiết

Tôi nêu access pattern, latency SLO, TTL/invalidation và alternative như local cache/read replica. Redis là bản sao nên source of truth ở DB. Tôi thiết kế stampede control, eviction/maxmemory, HA, circuit breaker, concurrency limit và stale/fail-closed policy theo dữ liệu.

## Góc nhìn Production

Alert hit ratio cùng DB load, hot/big key, eviction, memory fragmentation và latency.

## Trade-offs

Tôi nêu access pattern, latency SLO, TTL/invalidation và alternative như local cache/read replica. Redis là bản sao nên source of truth ở DB. Tôi thiết kế stampede control, eviction/maxmemory, HA, circuit breaker, concurrency limit và stale/fail-closed policy theo dữ liệu.

## Câu trả lời sai thường gặp

Redis chỉ là cache và có thể fallback toàn bộ traffic về DB khi lỗi.

## Follow-up

- Cache stampede khác avalanche thế nào?

- Distributed lock cần fencing khi nào?

## Nguồn chính thống

- [Redis — Redis cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
- [Redis — Redis key eviction](https://redis.io/docs/latest/develop/reference/eviction/)
