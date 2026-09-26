---
id: redis-ttl-expiration-active-passive
type: interview-question
technology: Redis
category: Redis
difficulty: junior
topics:
  - TTL
  - expiration
  - eviction
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
    - id: ttl
      required: true
      aliases:
        - TTL
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: expiration
      required: true
      aliases:
        - expiration
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: eviction
      required: false
      aliases:
        - eviction
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis luôn xóa key đúng thời điểm TTL về 0 bằng một timer riêng cho từng key.
      penalty: 20
---

# Redis hết hạn key bằng cơ chế active và passive thế nào?

## Rubric

### Must Include

- TTL

- expiration

### Strong Answer Includes

- eviction

## Câu trả lời 30 giây

Passive expiration loại key khi client truy cập; active expiration quét một phần key có TTL nền. Vì vậy key hết hạn không nhất thiết biến mất đúng millisecond và memory có thể còn tạm thời.

## Câu trả lời chi tiết

TTL là metadata, không phải job chính xác theo lịch. Redis chạy cycle để cân bằng CPU và reclaim memory; eviction policy khi maxmemory là cơ chế khác expiration. Cache logic phải chịu stale/miss và không dùng TTL thay scheduler nghiệp vụ.

## Góc nhìn Production

Theo dõi expired/evicted keys, memory fragmentation và hit ratio; chọn TTL có jitter.

## Trade-offs

TTL là metadata, không phải job chính xác theo lịch. Redis chạy cycle để cân bằng CPU và reclaim memory; eviction policy khi maxmemory là cơ chế khác expiration. Cache logic phải chịu stale/miss và không dùng TTL thay scheduler nghiệp vụ.

## Câu trả lời sai thường gặp

Redis luôn xóa key đúng thời điểm TTL về 0 bằng một timer riêng cho từng key.

## Follow-up

- TTL và eviction khác nhau thế nào?

- Jitter giúp cache avalanche ra sao?

## Nguồn chính thống

- [Redis — Redis Data Types](https://redis.io/docs/latest/develop/data-types/)
- [Redis — Redis EXPIRE Command](https://redis.io/docs/latest/commands/expire/)
- [Redis — Redis Key Eviction](https://redis.io/docs/latest/develop/reference/eviction/)
