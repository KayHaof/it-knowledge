---
id: redis-penetration-avalanche
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - cache-penetration
  - avalanche
  - stampede
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
    - id: cache-penetration
      required: true
      aliases:
        - cache-penetration
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: avalanche
      required: true
      aliases:
        - avalanche
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: stampede
      required: false
      aliases:
        - stampede
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Cả ba chỉ là tên khác của Redis miss nên tăng TTL là đủ.
      penalty: 20
---

# Cache penetration, avalanche và stampede khác nhau ở đâu?

## Rubric

### Must Include

- cache-penetration

- avalanche

### Strong Answer Includes

- stampede

## Câu trả lời 30 giây

Penetration là request key không tồn tại liên tục đi xuống DB; avalanche là nhiều key hết hạn hoặc cache down cùng lúc; stampede là nhiều caller cùng refill một hot key. Mỗi hiện tượng cần guard khác nhau.

## Câu trả lời chi tiết

Negative caching/bloom filter và input validation giảm penetration. TTL jitter, staggered refresh và warmup giảm avalanche. Single-flight/lease, stale-while-revalidate và bounded origin concurrency giảm stampede. Không dùng một distributed lock unbounded làm hệ thống chờ vô hạn.

## Góc nhìn Production

Dashboard miss by reason, origin QPS, refill concurrency, TTL distribution và DB saturation. Test synchronized expiry và Redis restart.

## Trade-offs

Negative caching/bloom filter và input validation giảm penetration. TTL jitter, staggered refresh và warmup giảm avalanche. Single-flight/lease, stale-while-revalidate và bounded origin concurrency giảm stampede. Không dùng một distributed lock unbounded làm hệ thống chờ vô hạn.

## Câu trả lời sai thường gặp

Cả ba chỉ là tên khác của Redis miss nên tăng TTL là đủ.

## Follow-up

- Negative cache cần TTL nào?

- Stale value có chấp nhận cho business nào?

## Nguồn chính thống

- [Redis — Redis Cache-Aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
- [Redis — Redis Client-Side Caching Introduction](https://redis.io/docs/latest/develop/clients/client-side-caching/)
- [Redis — Redis Client-Side Caching Reference](https://redis.io/docs/latest/develop/reference/client-side-caching/)
- [Redis — Redis Key Eviction](https://redis.io/docs/latest/develop/reference/eviction/)
