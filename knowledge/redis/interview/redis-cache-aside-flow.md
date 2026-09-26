---
id: redis-cache-aside-flow
type: interview-question
technology: Redis
category: Redis
difficulty: junior
topics:
  - cache-aside
  - invalidation
  - TTL
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
    - id: cache-aside
      required: true
      aliases:
        - cache-aside
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: invalidation
      required: true
      aliases:
        - invalidation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ttl
      required: false
      aliases:
        - TTL
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Cache-aside luôn nhất quán vì sau khi ghi database cache tự biết cập nhật.
      penalty: 20
---

# Cache-aside read/write flow nên được thiết kế thế nào?

## Rubric

### Must Include

- cache-aside

- invalidation

### Strong Answer Includes

- TTL

## Câu trả lời 30 giây

Read thử cache rồi query source và populate nếu miss; write cập nhật source rồi invalidate hoặc update cache theo policy. Cache không phải source of truth và mọi path phải xử lý stale/miss.

## Câu trả lời chi tiết

Đọc miss đồng thời có thể stampede nên single-flight/lock hoặc request coalescing cần bounded. Write-through/write-behind đổi consistency và failure semantics. Invalidation trước hay sau DB commit có cửa sổ stale; versioned key/short TTL giúp giảm nhưng không triệt tiêu. Serialize schema có version để deploy rolling.

## Góc nhìn Production

Đo hit/miss, fill latency, stale rate, stampede, DB fallback và cache errors. Chạy warm/cold load test và Redis outage drill.

## Trade-offs

Đọc miss đồng thời có thể stampede nên single-flight/lock hoặc request coalescing cần bounded. Write-through/write-behind đổi consistency và failure semantics. Invalidation trước hay sau DB commit có cửa sổ stale; versioned key/short TTL giúp giảm nhưng không triệt tiêu. Serialize schema có version để deploy rolling.

## Câu trả lời sai thường gặp

Cache-aside luôn nhất quán vì sau khi ghi database cache tự biết cập nhật.

## Follow-up

- Invalidate trước hay sau commit?

- Cache miss đồng thời xử lý thế nào?

## Nguồn chính thống

- [Redis — Redis cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
- [Redis — Redis key eviction](https://redis.io/docs/latest/develop/reference/eviction/)
