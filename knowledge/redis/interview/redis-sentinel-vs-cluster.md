---
id: redis-sentinel-vs-cluster
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - Sentinel
  - Cluster
  - failover
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
    - id: sentinel
      required: true
      aliases:
        - Sentinel
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: cluster
      required: true
      aliases:
        - Cluster
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: failover
      required: false
      aliases:
        - failover
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Sentinel tự động scale dữ liệu ngang còn Cluster chỉ là tên mới của Sentinel.
      penalty: 20
---

# Redis Sentinel và Cluster giải quyết hai bài toán khác nhau thế nào?

## Rubric

### Must Include

- Sentinel

- Cluster

### Strong Answer Includes

- failover

## Câu trả lời 30 giây

Sentinel cung cấp monitoring/failover cho primary-replica, còn Cluster vừa sharding theo hash slot vừa failover. Cluster tăng capacity nhưng client và multi-key operation phức tạp hơn.

## Câu trả lời chi tiết

Sentinel không tự chia dữ liệu; một primary vẫn là capacity boundary. Cluster route key tới slot, resharding và MOVED/ASK cần client support; cross-slot transaction/Lua bị giới hạn. Cả hai không thay backup/restore và application-level consistency.

## Góc nhìn Production

Test failover DNS/client reconnect, replica lag và resharding; giữ quorum topology lẻ.

## Trade-offs

Sentinel không tự chia dữ liệu; một primary vẫn là capacity boundary. Cluster route key tới slot, resharding và MOVED/ASK cần client support; cross-slot transaction/Lua bị giới hạn. Cả hai không thay backup/restore và application-level consistency.

## Câu trả lời sai thường gặp

Sentinel tự động scale dữ liệu ngang còn Cluster chỉ là tên mới của Sentinel.

## Follow-up

- Failover có thể mất acknowledged write khi nào?

- Hash tag ảnh hưởng phân bố tải ra sao?

## Nguồn chính thống

- [Redis — Redis Persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [Redis — Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
- [Redis — Scale with Redis Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)
- [Redis — Redis Cluster Specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
