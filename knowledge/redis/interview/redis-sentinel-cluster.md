---
id: redis-sentinel-cluster
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - Sentinel
  - Cluster
  - hash-slot
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
    - id: hash-slot
      required: false
      aliases:
        - hash-slot
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Sentinel tự shard data và Cluster chỉ là Sentinel có thêm dashboard.
      penalty: 20
---

# Redis Sentinel và Redis Cluster giải quyết hai bài toán nào khác nhau?

## Rubric

### Must Include

- Sentinel

- Cluster

### Strong Answer Includes

- hash-slot

## Câu trả lời 30 giây

Sentinel giám sát/failover cho primary-replica deployment, chủ yếu availability. Cluster sharding dữ liệu qua hash slots và failover node, nhưng đổi multi-key/transaction semantics.

## Câu trả lời chi tiết

Sentinel clients discover primary và replica; dữ liệu vẫn một shard. Cluster phân 16384 slots, key cùng `{tag}` mới ở cùng slot; cross-slot MGET/transaction/Lua bị giới hạn hoặc cần client fan-out. Failover không phải backup và resharding tạo network/load.

## Góc nhìn Production

Theo dõi quorum, slot coverage, migration, replica lag và client topology refresh. Test node loss, split brain, reshard và multi-key command.

## Trade-offs

Sentinel clients discover primary và replica; dữ liệu vẫn một shard. Cluster phân 16384 slots, key cùng `{tag}` mới ở cùng slot; cross-slot MGET/transaction/Lua bị giới hạn hoặc cần client fan-out. Failover không phải backup và resharding tạo network/load.

## Câu trả lời sai thường gặp

Sentinel tự shard data và Cluster chỉ là Sentinel có thêm dashboard.

## Follow-up

- Hash tag dùng khi nào?

- Cluster mất slot coverage thì client nên làm gì?

## Nguồn chính thống

- [Redis — Redis Persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [Redis — Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
- [Redis — Scale with Redis Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)
- [Redis — Redis Cluster Specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
