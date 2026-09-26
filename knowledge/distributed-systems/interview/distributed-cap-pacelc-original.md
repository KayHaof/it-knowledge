---
id: distributed-cap-pacelc-original
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
        - CAP nghĩa hệ thống chỉ được chọn hai trong ba chữ ở mọi thời điểm, kể cả khi network khỏe.
      penalty: 20
---

# CAP và PACELC giúp đặt trade-off hệ thống theo failure model nào?

## Rubric

### Must Include

- CAP

- PACELC

### Strong Answer Includes

- consistency

## Câu trả lời 30 giây

CAP nói khi network partition không thể đồng thời availability và strong consistency theo định nghĩa; PACELC bổ sung khi bình thường phải chọn latency hay consistency. Đây là khung suy luận, không phải nhãn database đơn giản.

## Câu trả lời chi tiết

Partition là không thể tránh trong distributed network; hệ thống có thể degrade/đọc stale hoặc reject writes. Ngoài partition, synchronous quorum tăng latency nhưng giảm stale. Requirement cần nêu consistency scope, read/write availability, freshness và recovery, không nói “CP luôn tốt”.

## Góc nhìn Production

Ghi SLO cho stale reads, unavailable writes, quorum latency và failover. Test partition/region loss thay vì benchmark happy path.

## Trade-offs

Partition là không thể tránh trong distributed network; hệ thống có thể degrade/đọc stale hoặc reject writes. Ngoài partition, synchronous quorum tăng latency nhưng giảm stale. Requirement cần nêu consistency scope, read/write availability, freshness và recovery, không nói “CP luôn tốt”.

## Câu trả lời sai thường gặp

CAP nghĩa hệ thống chỉ được chọn hai trong ba chữ ở mọi thời điểm, kể cả khi network khỏe.

## Follow-up

- Linearizability khác serializability thế nào?

- PACELC áp dụng cho cache/read replica ra sao?

## Nguồn chính thống

- [Amazon Web Services — CAP theorem](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html)
- [Amazon Web Services — Multi-Region fundamental 2: Understanding the data](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html)
- [PostgreSQL Global Development Group — PostgreSQL warm standby and replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Amazon Web Services — DynamoDB partitions and data distribution](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html)
