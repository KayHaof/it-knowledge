---
id: redis-memory-fragmentation
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - memory
  - fragmentation
  - allocator
relatedLessons:
  - redis-hot-big-key-latency
sources:
  - title: Redis Diagnosing Latency Issues
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Latency Monitoring
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis MEMORY USAGE
    url: https://redis.io/docs/latest/commands/memory-usage/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis SLOWLOG
    url: https://redis.io/docs/latest/commands/slowlog/
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
    - id: memory
      required: true
      aliases:
        - memory
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fragmentation
      required: true
      aliases:
        - fragmentation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: allocator
      required: false
      aliases:
        - allocator
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Fragmentation cao chứng minh Redis đang giữ key không thể expire; chỉ FLUSHALL mới sửa.
      penalty: 20
---

# Redis memory fragmentation ratio cao nhưng key count không tăng: điều tra gì?

## Rubric

### Must Include

- memory

- fragmentation

### Strong Answer Includes

- allocator

## Câu trả lời 30 giây

Allocator có thể giữ page sau delete/update, payload size biến động hoặc active defrag chưa theo kịp. Phân biệt used_memory, RSS và maxmemory; fragmentation không đồng nghĩa leak logic.

## Câu trả lời chi tiết

Redis allocator jemalloc giữ arenas/pages; overwrite value kích thước khác tạo free fragments. Fork persistence còn COW làm RSS peak. Active defrag tiêu CPU để relocate object, còn restart giải phóng nhưng có downtime/recovery cost. Memory policy nhìn logical used memory nhưng OS limit nhìn RSS.

## Góc nhìn Production

Theo dõi used/RSS, fragmentation ratio, allocator active/fragmented, fork COW và eviction. Đặt headroom cho snapshot/failover, không chỉ maxmemory bằng container limit.

## Trade-offs

Redis allocator jemalloc giữ arenas/pages; overwrite value kích thước khác tạo free fragments. Fork persistence còn COW làm RSS peak. Active defrag tiêu CPU để relocate object, còn restart giải phóng nhưng có downtime/recovery cost. Memory policy nhìn logical used memory nhưng OS limit nhìn RSS.

## Câu trả lời sai thường gặp

Fragmentation cao chứng minh Redis đang giữ key không thể expire; chỉ FLUSHALL mới sửa.

## Follow-up

- Fork COW gây RSS tăng khi nào?

- Active defrag có ảnh hưởng latency không?

## Nguồn chính thống

- [Redis — Redis Diagnosing Latency Issues](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)
- [Redis — Redis Latency Monitoring](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/)
- [Redis — Redis MEMORY USAGE](https://redis.io/docs/latest/commands/memory-usage/)
- [Redis — Redis SLOWLOG](https://redis.io/docs/latest/commands/slowlog/)
