---
id: redis-eviction-policy-choice
type: interview-question
technology: Redis
category: Redis
difficulty: middle
topics:
  - maxmemory
  - eviction
  - cache
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
    - id: maxmemory
      required: true
      aliases:
        - maxmemory
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
        - Redis tự chọn policy tối ưu nhất nên maxmemory không cần cấu hình.
      penalty: 20
---

# Chọn Redis eviction policy theo workload cache thế nào?

## Rubric

### Must Include

- maxmemory

- eviction

### Strong Answer Includes

- cache

## Câu trả lời 30 giây

`allkeys-lru/lfu` phù hợp cache có thể xóa mọi key; `volatile-*` chỉ xét key có TTL; `noeviction` trả lỗi khi đầy. Policy phải khớp loại dữ liệu và failure behavior.

## Câu trả lời chi tiết

LRU gần đây và LFU tần suất phản ánh locality khác nhau; approximate sampling giúp giảm overhead. Nếu trộn cache với dữ liệu quan trọng, eviction có thể xóa nhầm hoặc noeviction làm write fail. Tách instance/namespace và đặt headroom thay vì chỉ tăng maxmemory.

## Góc nhìn Production

Alert evicted_keys, rejected writes, hit ratio và fragmentation; test full-memory behavior.

## Trade-offs

LRU gần đây và LFU tần suất phản ánh locality khác nhau; approximate sampling giúp giảm overhead. Nếu trộn cache với dữ liệu quan trọng, eviction có thể xóa nhầm hoặc noeviction làm write fail. Tách instance/namespace và đặt headroom thay vì chỉ tăng maxmemory.

## Câu trả lời sai thường gặp

Redis tự chọn policy tối ưu nhất nên maxmemory không cần cấu hình.

## Follow-up

- Cache key có TTL nhưng policy allkeys-lru xử lý sao?

- Eviction spike có thể gây DB overload thế nào?

## Nguồn chính thống

- [Redis — Redis Data Types](https://redis.io/docs/latest/develop/data-types/)
- [Redis — Redis EXPIRE Command](https://redis.io/docs/latest/commands/expire/)
- [Redis — Redis Key Eviction](https://redis.io/docs/latest/develop/reference/eviction/)
