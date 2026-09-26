---
id: system-design-multi-region
type: interview-question
technology: System Design
category: System Design
difficulty: senior
topics:
  - multi-region
  - DR
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
    - id: multi-region
      required: true
      aliases:
        - multi-region
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: dr
      required: true
      aliases:
        - DR
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
        - Active-active luôn an toàn hơn vì có hai region nhận traffic đồng thời.
      penalty: 20
---

# Chọn active-active hay active-passive cho multi-region?

## Rubric

### Must Include

- multi-region

- DR

### Strong Answer Includes

- consistency

## Câu trả lời 30 giây

Active-active tận dụng capacity và giảm failover nhưng cần conflict/consistent routing; active-passive đơn giản hơn nhưng RTO/failover và warm capacity cao. Chọn theo RPO/RTO, không theo buzzword.

## Câu trả lời chi tiết

Data replication, write ownership, DNS/traffic failover và dependency locality quyết định semantics. Active-active cần idempotency, conflict resolution và test partition; passive cần promote procedure, lag visibility và capacity rehearsal. Backup/restore vẫn cần trong cả hai.

## Góc nhìn Production

Diễn tập region loss, đo RTO/RPO, replication lag và client retry storm.

## Trade-offs

Data replication, write ownership, DNS/traffic failover và dependency locality quyết định semantics. Active-active cần idempotency, conflict resolution và test partition; passive cần promote procedure, lag visibility và capacity rehearsal. Backup/restore vẫn cần trong cả hai.

## Câu trả lời sai thường gặp

Active-active luôn an toàn hơn vì có hai region nhận traffic đồng thời.

## Follow-up

- RPO zero có thực tế không?

- Failback sau incident cần bước nào?

## Nguồn chính thống

- [Amazon Web Services — CAP theorem](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html)
- [Amazon Web Services — Multi-Region fundamental 2: Understanding the data](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html)
- [PostgreSQL Global Development Group — PostgreSQL warm standby and replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Amazon Web Services — DynamoDB partitions and data distribution](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html)
