---
id: system-design-newsfeed-fanout
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - news-feed
  - fan-out
  - ranking
relatedLessons:
  - system-design-news-feed
sources:
  - title: Redis sorted sets
    url: https://redis.io/docs/latest/develop/data-types/sorted-sets/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis cache-aside pattern
    url: https://redis.io/docs/latest/develop/use-cases/cache-aside/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka design documentation
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL multicolumn indexes
    url: https://www.postgresql.org/docs/current/indexes-multicolumn.html
    organization: PostgreSQL Global Development Group
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
    - id: news-feed
      required: true
      aliases:
        - news-feed
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fan-out
      required: true
      aliases:
        - fan-out
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ranking
      required: false
      aliases:
        - ranking
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Fan-out on write luôn tốt hơn vì read chỉ cần một SELECT.
      penalty: 20
---

# News feed nên fan-out on write hay on read?

## Rubric

### Must Include

- news-feed

- fan-out

### Strong Answer Includes

- ranking

## Câu trả lời 30 giây

On write nhanh read nhưng tốn storage/work cho celebrity; on read tiết kiệm write nhưng feed query/ranking nặng. Hybrid thường fan-out người dùng thường và merge celebrity lúc đọc.

## Câu trả lời chi tiết

Feed item immutable reference + ranking features; cache theo user với invalidation/TTL. Backfill, privacy/block/unfollow và eventual consistency cần xử lý. Đo freshness và timeline p99, không tối ưu chỉ QPS.

## Góc nhìn Production

Theo dõi fan-out queue, celebrity hot spots, cache hit và ranking latency.

## Trade-offs

Feed item immutable reference + ranking features; cache theo user với invalidation/TTL. Backfill, privacy/block/unfollow và eventual consistency cần xử lý. Đo freshness và timeline p99, không tối ưu chỉ QPS.

## Câu trả lời sai thường gặp

Fan-out on write luôn tốt hơn vì read chỉ cần một SELECT.

## Follow-up

- Unfollow đã fan-out xử lý sao?

- Feed cache rebuild khi lỗi thế nào?

## Nguồn chính thống

- [Redis — Redis sorted sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/)
- [Redis — Redis cache-aside pattern](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
- [Apache Kafka — Apache Kafka design documentation](https://kafka.apache.org/43/design/design/)
- [PostgreSQL Global Development Group — PostgreSQL multicolumn indexes](https://www.postgresql.org/docs/current/indexes-multicolumn.html)
