---
id: q-redis-ttl-junior
type: interview-question
technology: Redis
category: Redis
difficulty: junior
topics:
  - TTL
  - eviction
  - cache
relatedLessons:
  - redis-data-structures-expiration
sources:
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
    - id: ttl
      required: true
      aliases:
        - TTL
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: eviction
      required: true
      aliases:
        - eviction
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
        - Có TTL nghĩa Redis chắc chắn xóa key đúng millisecond và không bao giờ evict trước.
      penalty: 20
---

# TTL expiration và eviction trong Redis có phải cùng một việc không?

## Rubric

### Must Include

- TTL

- eviction

### Strong Answer Includes

- cache

## Câu trả lời 30 giây

Không. Expiration loại key khi TTL hết theo semantics thời gian; eviction loại key theo maxmemory policy khi thiếu memory. Key còn TTL vẫn có thể bị evict sớm, và key không TTL có thể tồn tại tới khi policy/command loại.

## Câu trả lời chi tiết

Tôi đặt TTL theo freshness contract và thêm jitter chống avalanche. Eviction policy chọn tập key/heuristic để nhường memory; noeviction làm write trả lỗi. Expiration có lazy/active behavior nên không dùng key presence như timer chính xác tuyệt đối cho workflow quan trọng.

## Deep Dive

Memory còn gồm overhead/fragmentation/replication buffers, không chỉ tổng serialized values. Big key làm operation và failover nặng.

## Góc nhìn Production

Đo expired/evicted keys, hit ratio, used memory/fragmentation và test behavior tại maxmemory.

## Trade-offs

Memory còn gồm overhead/fragmentation/replication buffers, không chỉ tổng serialized values. Big key làm operation và failover nặng.

## Câu trả lời sai thường gặp

Có TTL nghĩa Redis chắc chắn xóa key đúng millisecond và không bao giờ evict trước.

## Follow-up

- TTL jitter giải quyết gì?

- noeviction ảnh hưởng write thế nào?

## Nguồn chính thống

- [Redis — Redis key eviction](https://redis.io/docs/latest/develop/reference/eviction/)
