---
id: redis-rdb-aof
type: interview-question
technology: Redis
category: Redis
difficulty: middle
topics:
  - RDB
  - AOF
  - durability
relatedLessons:
  - redis-persistence-ha-cluster
sources:
  - title: Redis Persistence
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Replication
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/replication/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Scale with Redis Cluster
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Cluster Specification
    url: https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/
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
    - id: rdb
      required: true
      aliases:
        - RDB
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: aof
      required: true
      aliases:
        - AOF
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: durability
      required: false
      aliases:
        - durability
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật AOF nghĩa Redis không thể mất một write và RDB chỉ dùng cho cache không cần backup.
      penalty: 20
---

# RDB và AOF cho Redis trade-off durability nào?

## Rubric

### Must Include

- RDB

- AOF

### Strong Answer Includes

- durability

## Câu trả lời 30 giây

RDB snapshot gọn và restore nhanh nhưng có thể mất dữ liệu giữa snapshots. AOF ghi command với fsync policy chi tiết hơn nhưng file/rewrites và write overhead lớn hơn; có thể kết hợp tùy RPO/RTO.

## Câu trả lời chi tiết

RDB fork copy-on-write có memory/I/O peak; AOF append log cần rewrite để compact và fsync everysec/always/no-appendfsync-on-rewrite đổi loss window. Backup không đồng nghĩa replication vì lỗi logic có thể replicate. Restore test phải đo thời gian và kiểm checksum.

## Góc nhìn Production

Theo dõi bgsave/AOF rewrite duration, fork memory, fsync latency, disk headroom và last successful backup. Xác định RPO/RTO trước config.

## Trade-offs

RDB fork copy-on-write có memory/I/O peak; AOF append log cần rewrite để compact và fsync everysec/always/no-appendfsync-on-rewrite đổi loss window. Backup không đồng nghĩa replication vì lỗi logic có thể replicate. Restore test phải đo thời gian và kiểm checksum.

## Câu trả lời sai thường gặp

Bật AOF nghĩa Redis không thể mất một write và RDB chỉ dùng cho cache không cần backup.

## Follow-up

- Fork COW gây memory pressure ra sao?

- Replication có thay backup không?

## Nguồn chính thống

- [Redis — Redis Persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [Redis — Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
- [Redis — Scale with Redis Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)
- [Redis — Redis Cluster Specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
