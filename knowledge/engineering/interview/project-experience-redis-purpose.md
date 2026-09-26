---
id: project-experience-redis-purpose
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: middle
topics:
  - Redis
  - project-story
  - cache
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
    - id: redis
      required: true
      aliases:
        - Redis
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: project-story
      required: true
      aliases:
        - project-story
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: cache
      required: false
      aliases:
        - cache
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis chỉ là key-value cache nên khi down chỉ cần restart và dữ liệu không ảnh hưởng.
      penalty: 20
---

# Trả lời “Project dùng Redis để làm gì?” mà không bịa chi tiết triển khai thế nào?

## Rubric

### Must Include

- Redis

- project-story

### Strong Answer Includes

- cache

## Câu trả lời 30 giây

Tôi nêu use case đã quan sát hoặc giả định rõ: cache, rate limit, lock hay ephemeral state; sau đó nói consistency, TTL và fallback. Nếu repo không chứng minh topology/metric, tôi gọi đó là answer framework chứ không phải fact.

## Câu trả lời chi tiết

Tôi mô tả key/value shape, owner của invalidation, behavior khi Redis chậm/down và metric cần đo. Cache-aside khác distributed lock/stream về durability; chọn policy theo business impact. Tôi tránh claim Sentinel/Cluster hoặc hit ratio nếu không có cấu hình/evidence.

## Góc nhìn Production

Nêu runbook cache miss storm, eviction và DB protection; kiểm tra source trước khi khẳng định.

## Trade-offs

Tôi mô tả key/value shape, owner của invalidation, behavior khi Redis chậm/down và metric cần đo. Cache-aside khác distributed lock/stream về durability; chọn policy theo business impact. Tôi tránh claim Sentinel/Cluster hoặc hit ratio nếu không có cấu hình/evidence.

## Câu trả lời sai thường gặp

Redis chỉ là key-value cache nên khi down chỉ cần restart và dữ liệu không ảnh hưởng.

## Follow-up

- Redis down thì request xử lý thế nào?

- TTL/invalidation chọn theo tiêu chí gì?

## Nguồn chính thống

- [Redis — Redis cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
- [Redis — Redis key eviction](https://redis.io/docs/latest/develop/reference/eviction/)
