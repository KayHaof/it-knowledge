---
id: distributed-quorum-replication-original
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - quorum
  - replication
  - read-write
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
    - id: quorum
      required: true
      aliases:
        - quorum
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: replication
      required: true
      aliases:
        - replication
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: read-write
      required: false
      aliases:
        - read-write
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần R+W>N là mọi read trên cluster luôn mới nhất và không có conflict.
      penalty: 20
---

# Quorum read/write `R+W>N` bảo vệ consistency trong điều kiện nào?

## Rubric

### Must Include

- quorum

- replication

### Strong Answer Includes

- read-write

## Câu trả lời 30 giây

Nếu replica membership/versions ổn định và read/write quorum intersect, ít nhất một replica giao nhau có dữ liệu mới. Network partitions, sloppy quorum, hinted handoff và conflict resolution có thể làm semantics phức tạp hơn.

## Câu trả lời chi tiết

N replicas, write quorum W, read quorum R là mô hình cơ bản; version/vector clock hoặc consensus quyết định conflict. Quorum không tự bảo đảm linearizability nếu replica stale, clock sai hoặc read repair async. R/W lớn tăng latency/availability trade-off.

## Góc nhìn Production

Theo dõi quorum failures, read repair, conflict count, hinted handoff và latency. Test node loss, concurrent writes và clock skew.

## Trade-offs

N replicas, write quorum W, read quorum R là mô hình cơ bản; version/vector clock hoặc consensus quyết định conflict. Quorum không tự bảo đảm linearizability nếu replica stale, clock sai hoặc read repair async. R/W lớn tăng latency/availability trade-off.

## Câu trả lời sai thường gặp

Chỉ cần R+W>N là mọi read trên cluster luôn mới nhất và không có conflict.

## Follow-up

- Sloppy quorum khác strict quorum thế nào?

- Conflict resolution có thể mất update ra sao?

## Nguồn chính thống

- [Amazon Web Services — CAP theorem](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html)
- [Amazon Web Services — Multi-Region fundamental 2: Understanding the data](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html)
- [PostgreSQL Global Development Group — PostgreSQL warm standby and replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Amazon Web Services — DynamoDB partitions and data distribution](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html)
