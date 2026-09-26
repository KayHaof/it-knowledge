---
id: redis-cache-penetration
type: interview-question
technology: Redis
category: Redis
difficulty: middle
topics:
  - cache-penetration
  - negative-cache
  - bloom-filter
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
    - id: negative-cache
      required: true
      aliases:
        - negative-cache
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: bloom-filter
      required: false
      aliases:
        - bloom-filter
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi cache miss đều là cache penetration và chỉ cần tăng TTL.
      penalty: 20
---

# Cache penetration khác stampede và avalanche thế nào?

## Rubric

### Must Include

- cache-penetration

- negative-cache

### Strong Answer Includes

- bloom-filter

## Câu trả lời 30 giây

Penetration là request key không tồn tại liên tục xuyên qua cache; stampede là nhiều request cùng miss một key; avalanche là nhiều key hết hạn/cụm cache lỗi cùng lúc. Biện pháp khác nhau.

## Câu trả lời chi tiết

Negative caching ngắn hạn, Bloom filter hoặc validate input giảm penetration. Single-flight/lock và TTL jitter giảm stampede; staggered TTL, multi-layer cache và capacity plan giảm avalanche. Không cache negative vô thời hạn vì dữ liệu có thể được tạo sau đó.

## Góc nhìn Production

Đo miss reason, DB QPS sau cache và cardinality key; rate-limit invalid identifiers.

## Trade-offs

Negative caching ngắn hạn, Bloom filter hoặc validate input giảm penetration. Single-flight/lock và TTL jitter giảm stampede; staggered TTL, multi-layer cache và capacity plan giảm avalanche. Không cache negative vô thời hạn vì dữ liệu có thể được tạo sau đó.

## Câu trả lời sai thường gặp

Mọi cache miss đều là cache penetration và chỉ cần tăng TTL.

## Follow-up

- Negative cache invalidation ra sao?

- Lock timeout quá ngắn gây stampede thế nào?

## Nguồn chính thống

- [Redis — Redis Cache-Aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
- [Redis — Redis Client-Side Caching Introduction](https://redis.io/docs/latest/develop/clients/client-side-caching/)
- [Redis — Redis Client-Side Caching Reference](https://redis.io/docs/latest/develop/reference/client-side-caching/)
- [Redis — Redis Key Eviction](https://redis.io/docs/latest/develop/reference/eviction/)
