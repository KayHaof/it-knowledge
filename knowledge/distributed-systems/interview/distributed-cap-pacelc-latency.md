---
id: distributed-cap-pacelc-latency
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - CAP
  - PACELC
  - consistency
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
    - id: cap
      required: true
      aliases:
        - CAP
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: pacelc
      required: true
      aliases:
        - PACELC
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
        - CAP bảo một database chỉ được chọn hai trong ba thuộc tính mọi lúc.
      penalty: 20
---

# CAP và PACELC giúp thảo luận trade-off nào?

## Rubric

### Must Include

- CAP

- PACELC

### Strong Answer Includes

- consistency

## Câu trả lời 30 giây

CAP nói khi partition phải chọn consistency hoặc availability trong mô hình cụ thể; PACELC mở rộng rằng ngay cả khi không partition vẫn trade latency với consistency. Không phải nhãn cố định cho toàn hệ thống.

## Câu trả lời chi tiết

Consistency/availability cần định nghĩa theo operation và session; hệ thống có thể có strong write, eventual read khác nhau. PACELC nhắc chi phí quorum/coordination trong trạng thái bình thường. Tôi map SLO, data loss tolerance và failure mode thay vì nói “database là CP/AP”.

## Góc nhìn Production

Document read/write guarantees, quorum timeout và stale-read metric; test partition theo vùng.

## Trade-offs

Consistency/availability cần định nghĩa theo operation và session; hệ thống có thể có strong write, eventual read khác nhau. PACELC nhắc chi phí quorum/coordination trong trạng thái bình thường. Tôi map SLO, data loss tolerance và failure mode thay vì nói “database là CP/AP”.

## Câu trả lời sai thường gặp

CAP bảo một database chỉ được chọn hai trong ba thuộc tính mọi lúc.

## Follow-up

- Network partition khác node crash thế nào?

- Read-your-writes đảm bảo ở đâu?

## Nguồn chính thống

- [Amazon Web Services — CAP theorem](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html)
- [Amazon Web Services — Multi-Region fundamental 2: Understanding the data](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html)
- [PostgreSQL Global Development Group — PostgreSQL warm standby and replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Amazon Web Services — DynamoDB partitions and data distribution](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html)
