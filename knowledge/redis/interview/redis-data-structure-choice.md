---
id: redis-data-structure-choice
type: interview-question
technology: Redis
category: Redis
difficulty: junior
topics:
  - data-structures
  - strings
  - hashes
relatedLessons:
  - redis-data-structures-expiration
sources:
  - title: Redis Data Types
    url: https://redis.io/docs/latest/develop/data-types/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis EXPIRE Command
    url: https://redis.io/docs/latest/commands/expire/
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
    - id: data-structures
      required: true
      aliases:
        - data-structures
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: strings
      required: true
      aliases:
        - strings
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: hashes
      required: false
      aliases:
        - hashes
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis chỉ có key-value String nên mọi use case phải serialize JSON vào một key.
      penalty: 20
---

# Bạn chọn String, Hash, Set, Sorted Set hay Stream trong Redis theo use case nào?

## Rubric

### Must Include

- data-structures

- strings

### Strong Answer Includes

- hashes

## Câu trả lời 30 giây

String hợp value/cache counter, Hash hợp field của một object, Set hợp membership, Sorted Set hợp ranking theo score, Stream hợp log/consumer group có offset. Chọn theo atomic operation và retention cần thiết, không theo tên tiện nhất.

## Câu trả lời chi tiết

Hash không tự tạo schema/TTL riêng cho từng field; Sorted Set score ordering không thay thế durable database; Pub/Sub không replay còn Stream có entry ID và consumer group. Key naming, cardinality và payload size ảnh hưởng memory. Multi-key atomicity còn phụ thuộc cùng hash slot trong Cluster.

## Góc nhìn Production

Đo key count, big-key, memory per type và command latency. Document TTL/ownership và migration khi data shape đổi.

## Trade-offs

Hash không tự tạo schema/TTL riêng cho từng field; Sorted Set score ordering không thay thế durable database; Pub/Sub không replay còn Stream có entry ID và consumer group. Key naming, cardinality và payload size ảnh hưởng memory. Multi-key atomicity còn phụ thuộc cùng hash slot trong Cluster.

## Câu trả lời sai thường gặp

Redis chỉ có key-value String nên mọi use case phải serialize JSON vào một key.

## Follow-up

- Khi nào Hash không phù hợp?

- Stream khác Pub/Sub về replay thế nào?

## Nguồn chính thống

- [Redis — Redis Data Types](https://redis.io/docs/latest/develop/data-types/)
- [Redis — Redis EXPIRE Command](https://redis.io/docs/latest/commands/expire/)
- [Redis — Redis Key Eviction](https://redis.io/docs/latest/develop/reference/eviction/)
