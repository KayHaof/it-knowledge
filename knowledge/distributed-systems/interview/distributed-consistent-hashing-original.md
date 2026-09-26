---
id: distributed-consistent-hashing-original
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: middle
topics:
  - consistent-hashing
  - sharding
  - rebalance
relatedLessons:
  - cap-replication-sharding
sources:
  - title: CAP theorem
    url: https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: "Multi-Region fundamental 2: Understanding the data"
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL warm standby and replication
    url: https://www.postgresql.org/docs/current/warm-standby.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: DynamoDB partitions and data distribution
    url: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html
    organization: Amazon Web Services
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
    - id: consistent-hashing
      required: true
      aliases:
        - consistent-hashing
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: sharding
      required: true
      aliases:
        - sharding
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: rebalance
      required: false
      aliases:
        - rebalance
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Consistent hashing bảo đảm mọi node nhận lượng key và traffic bằng nhau bất kể distribution.
      penalty: 20
---

# Consistent hashing giảm dữ liệu phải di chuyển khi thêm node bằng cách nào?

## Rubric

### Must Include

- consistent-hashing

- sharding

### Strong Answer Includes

- rebalance

## Câu trả lời 30 giây

Key và node nằm trên ring; thêm node chỉ ảnh hưởng vùng lân cận thay vì remap toàn bộ key. Virtual nodes cải thiện balance nhưng tăng metadata và rebalancing coordination.

## Câu trả lời chi tiết

Hash ring/virtual nodes phân phối key, replication factor chọn successor nodes. Hot key vẫn hot một token; skew keyspace cần split/replica read hoặc application sharding. Node failure/rejoin tạo movement, stale routing và dual ownership tạm thời.

## Góc nhìn Production

Theo dõi token skew, rebalance bytes/time, hot partitions và request errors. Test join/leave, zone failure và client topology cache.

## Trade-offs

Hash ring/virtual nodes phân phối key, replication factor chọn successor nodes. Hot key vẫn hot một token; skew keyspace cần split/replica read hoặc application sharding. Node failure/rejoin tạo movement, stale routing và dual ownership tạm thời.

## Câu trả lời sai thường gặp

Consistent hashing bảo đảm mọi node nhận lượng key và traffic bằng nhau bất kể distribution.

## Follow-up

- Virtual node count chọn thế nào?

- Hot key không thể split khi nào?

## Nguồn chính thống

- [Amazon Web Services — CAP theorem](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html)
- [Amazon Web Services — Multi-Region fundamental 2: Understanding the data](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html)
- [PostgreSQL Global Development Group — PostgreSQL warm standby and replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Amazon Web Services — DynamoDB partitions and data distribution](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html)
