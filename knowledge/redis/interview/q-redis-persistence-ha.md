---
id: q-redis-persistence-ha
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - RDB
  - AOF
  - replication
  - failover
relatedLessons:
  - redis-persistence-ha-cluster
sources:
  - title: Redis persistence
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/
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
        technicalCorrectness: 10
        completeness: 5
    - id: aof
      required: true
      aliases:
        - AOF
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: replication
      required: false
      aliases:
        - replication
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: failover
      required: false
      aliases:
        - failover
      points:
        technicalCorrectness: 10
        completeness: 5
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Có replica nghĩa mọi write đã bền vững và không thể mất dữ liệu.
      penalty: 20
---

# Replication có thay thế Redis persistence và backup không?

## Rubric

### Must Include

- RDB

- AOF

### Strong Answer Includes

- replication

- failover

## Câu trả lời 30 giây

Không. Replication sao chép cả thay đổi hợp lệ lẫn xóa nhầm và có cửa sổ mất write khi failover bất đồng bộ. RDB/AOF có durability trade-off riêng; backup độc lập cần cho point-in-time/disaster recovery.

## Câu trả lời chi tiết

Tôi chọn Redis là cache hay system of record trước. RDB snapshot có recovery nhanh nhưng có loss window; AOF ghi operations với fsync policy và rewrite cost. Replication tăng availability/read capacity nhưng failover không tạo strong consistency. Phải test restore, không chỉ thấy file tồn tại.

## Deep Dive

Master restart rỗng khi không persistence có thể propagate trạng thái rỗng tới replicas trong cấu hình nguy hiểm. Cluster sharding không tự là backup.

## Góc nhìn Production

Đo replication lag/backlog, fork/rewrite memory/latency, disk, restore time và acknowledged-write loss window.

## Trade-offs

Master restart rỗng khi không persistence có thể propagate trạng thái rỗng tới replicas trong cấu hình nguy hiểm. Cluster sharding không tự là backup.

## Câu trả lời sai thường gặp

Có replica nghĩa mọi write đã bền vững và không thể mất dữ liệu.

## Follow-up

- AOF everysec có failure window nào?

- Sentinel khác Redis Cluster?

## Nguồn chính thống

- [Redis — Redis persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
