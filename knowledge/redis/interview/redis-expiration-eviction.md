---
id: redis-expiration-eviction
type: interview-question
technology: Redis
category: Redis
difficulty: middle
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
        - Đặt TTL nghĩa Redis giải phóng key đúng thời điểm và eviction không bao giờ đụng key còn hạn.
      penalty: 20
---

# Expiration và eviction trong Redis khác nhau thế nào?

## Rubric

### Must Include

- TTL

- expiration

### Strong Answer Includes

- eviction

## Câu trả lời 30 giây

Expiration là TTL của key; Redis xóa khi hết hạn theo lazy check và active cycle. Eviction là chọn key chưa hết hạn để giải phóng memory khi maxmemory đạt, theo policy như allkeys-lru/volatile-ttl.

## Câu trả lời chi tiết

Lazy expiration xóa lúc key được truy cập, active expiration quét sample nên expired key có thể tạm còn trong memory. Eviction policy quyết định cache hit/miss và key nào mất; `noeviction` trả lỗi ghi. Persistent data không nên dùng chung policy cache mà không có capacity plan.

## Góc nhìn Production

Theo dõi expired/evicted keys, memory fragmentation, maxmemory, hit ratio và command errors. Test memory pressure và cold-cache DB load.

## Trade-offs

Lazy expiration xóa lúc key được truy cập, active expiration quét sample nên expired key có thể tạm còn trong memory. Eviction policy quyết định cache hit/miss và key nào mất; `noeviction` trả lỗi ghi. Persistent data không nên dùng chung policy cache mà không có capacity plan.

## Câu trả lời sai thường gặp

Đặt TTL nghĩa Redis giải phóng key đúng thời điểm và eviction không bao giờ đụng key còn hạn.

## Follow-up

- Lazy expiration ảnh hưởng memory peak ra sao?

- Volatile TTL policy nguy hiểm khi key không có TTL thế nào?

## Nguồn chính thống

- [Redis — Redis Data Types](https://redis.io/docs/latest/develop/data-types/)
- [Redis — Redis EXPIRE Command](https://redis.io/docs/latest/commands/expire/)
- [Redis — Redis Key Eviction](https://redis.io/docs/latest/develop/reference/eviction/)
