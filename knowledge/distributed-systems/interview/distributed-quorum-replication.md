---
id: distributed-quorum-replication
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - quorum
  - replication
  - read-repair
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
    - id: read-repair
      required: false
      aliases:
        - read-repair
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần R+W>N là hệ thống luôn linearizable và không mất dữ liệu.
      penalty: 20
---

# Quorum R/W ảnh hưởng consistency và availability ra sao?

## Rubric

### Must Include

- quorum

- replication

### Strong Answer Includes

- read-repair

## Câu trả lời 30 giây

Với N replica, R+W>N tạo overlap giúp đọc thấy write trong mô hình phù hợp; quorum không tự giải concurrent conflict, clock skew hay network partition. R/W càng lớn càng tăng latency và giảm availability.

## Câu trả lời chi tiết

Read quorum có thể trả nhiều version rồi conflict resolution; hinted handoff/read repair là cơ chế bổ trợ. Strong consistency cần protocol/linearization rõ, không chỉ số học quorum. Chọn N/R/W theo failure domain và SLO, kiểm stale reads thực tế.

## Góc nhìn Production

Theo dõi quorum timeout, divergent versions và repair backlog; đặt replica khác zone.

## Trade-offs

Read quorum có thể trả nhiều version rồi conflict resolution; hinted handoff/read repair là cơ chế bổ trợ. Strong consistency cần protocol/linearization rõ, không chỉ số học quorum. Chọn N/R/W theo failure domain và SLO, kiểm stale reads thực tế.

## Câu trả lời sai thường gặp

Chỉ cần R+W>N là hệ thống luôn linearizable và không mất dữ liệu.

## Follow-up

- Read repair có làm read latency tăng không?

- Tại sao quorum cùng zone nguy hiểm?

## Nguồn chính thống

- [Amazon Web Services — CAP theorem](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html)
- [Amazon Web Services — Multi-Region fundamental 2: Understanding the data](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html)
- [PostgreSQL Global Development Group — PostgreSQL warm standby and replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Amazon Web Services — DynamoDB partitions and data distribution](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html)
