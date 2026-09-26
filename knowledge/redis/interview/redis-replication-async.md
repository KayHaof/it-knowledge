---
id: redis-replication-async
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - replication
  - failover
  - consistency
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
    - id: replication
      required: true
      aliases:
        - replication
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: failover
      required: true
      aliases:
        - failover
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: consistency
      required: false
      aliases:
        - consistency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Replication hoàn tất trước khi Redis trả OK nên failover không thể mất write.
      penalty: 20
---

# Redis replication async tạo cửa sổ mất dữ liệu khi failover như thế nào?

## Rubric

### Must Include

- replication

- failover

### Strong Answer Includes

- consistency

## Câu trả lời 30 giây

Replica có thể chưa nhận/apply write khi primary chết, nên promote replica có thể mất acknowledged data. WAIT giảm xác suất nhưng không biến replication thành consensus/durable commit tuyệt đối.

## Câu trả lời chi tiết

Primary gửi stream replication; replica offset lag phụ thuộc network/CPU. Sentinel/Cluster chọn failover theo health/topology, không biết business write đã an toàn nếu không có synchronous quorum. Read replica có stale reads và reconnect full sync. Durable outcome cần database/outbox hoặc client idempotency ngoài cache.

## Góc nhìn Production

Theo dõi replication offset lag, link status, failover events và lost-write RPO. Test partition, disk full và promotion khi replica lag.

## Trade-offs

Primary gửi stream replication; replica offset lag phụ thuộc network/CPU. Sentinel/Cluster chọn failover theo health/topology, không biết business write đã an toàn nếu không có synchronous quorum. Read replica có stale reads và reconnect full sync. Durable outcome cần database/outbox hoặc client idempotency ngoài cache.

## Câu trả lời sai thường gặp

Replication hoàn tất trước khi Redis trả OK nên failover không thể mất write.

## Follow-up

- WAIT bảo đảm điều gì?

- Cache và durable source phối hợp recovery ra sao?

## Nguồn chính thống

- [Redis — Redis Persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [Redis — Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
- [Redis — Scale with Redis Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)
- [Redis — Redis Cluster Specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
