---
id: redis-outage-cache-fallback
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - outage
  - fallback
  - circuit-breaker
relatedLessons:
  - redis-cache-consistency-stampede
sources:
  - title: Redis Cache-Aside
    url: https://redis.io/docs/latest/develop/use-cases/cache-aside/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Client-Side Caching Introduction
    url: https://redis.io/docs/latest/develop/clients/client-side-caching/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Client-Side Caching Reference
    url: https://redis.io/docs/latest/develop/reference/client-side-caching/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Key Eviction
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
    - id: outage
      required: true
      aliases:
        - outage
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fallback
      required: true
      aliases:
        - fallback
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: circuit-breaker
      required: false
      aliases:
        - circuit-breaker
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis là cache nên luôn bỏ qua lỗi và query database không giới hạn.
      penalty: 20
---

# Nếu Redis down, cache client nên fail-open hay fail-closed?

## Rubric

### Must Include

- outage

- fallback

### Strong Answer Includes

- circuit-breaker

## Câu trả lời 30 giây

Tùy dữ liệu và threat model. Read cache thường fail-open xuống source với concurrency cap; authorization/rate-limit state có thể fail-closed hoặc degraded rõ ràng. Không retry vô hạn làm source sập theo.

## Câu trả lời chi tiết

Circuit breaker tránh mỗi request chờ connect timeout; stale local cache có thể phục vụ bounded data nhưng phải đánh dấu freshness. Write path không được coi cache write là durable thành công. Khi Redis hồi phục, warmup và stampede control cần gradual.

## Góc nhìn Production

Đo fallback QPS, source saturation, cache timeout và recovery warmup. Drill DNS, network, failover và credential expiry.

## Trade-offs

Circuit breaker tránh mỗi request chờ connect timeout; stale local cache có thể phục vụ bounded data nhưng phải đánh dấu freshness. Write path không được coi cache write là durable thành công. Khi Redis hồi phục, warmup và stampede control cần gradual.

## Câu trả lời sai thường gặp

Redis là cache nên luôn bỏ qua lỗi và query database không giới hạn.

## Follow-up

- Rate limit fail-open có abuse risk nào?

- Warmup sau outage tránh stampede thế nào?

## Nguồn chính thống

- [Redis — Redis Cache-Aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
- [Redis — Redis Client-Side Caching Introduction](https://redis.io/docs/latest/develop/clients/client-side-caching/)
- [Redis — Redis Client-Side Caching Reference](https://redis.io/docs/latest/develop/reference/client-side-caching/)
- [Redis — Redis Key Eviction](https://redis.io/docs/latest/develop/reference/eviction/)
