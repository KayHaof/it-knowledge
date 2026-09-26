---
id: distributed-leader-fencing
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - leader-election
  - fencing
  - split-brain
relatedLessons:
  - distributed-consensus-leader-election
sources:
  - title: Leader election in distributed systems
    url: https://aws.amazon.com/builders-library/leader-election-in-distributed-systems/
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Challenges with distributed systems
    url: https://aws.amazon.com/builders-library/challenges-with-distributed-systems/
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Leases
    url: https://kubernetes.io/docs/concepts/architecture/leases/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka design documentation
    url: https://kafka.apache.org/design/
    organization: Apache Kafka
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
    - id: leader-election
      required: true
      aliases:
        - leader-election
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fencing
      required: true
      aliases:
        - fencing
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: split-brain
      required: false
      aliases:
        - split-brain
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Khi leader mới được bầu, leader cũ chắc chắn nhận được thông báo và dừng ngay.
      penalty: 20
---

# Vì sao leader election phải đi kèm fencing token?

## Rubric

### Must Include

- leader-election

- fencing

### Strong Answer Includes

- split-brain

## Câu trả lời 30 giây

Leader cũ có thể sống sau partition hoặc pause và tiếp tục side effect. Epoch/term fencing được gửi tới resource để từ chối command cũ, kể cả khi election đã chọn leader mới.

## Câu trả lời chi tiết

Consensus/lease chọn owner theo quorum/timing nhưng không giết process stale. Protected storage giữ highest epoch và compare-and-set; worker token cũ bị reject. Fencing phải tới nơi side effect thực sự xảy ra, không chỉ nằm trong coordinator.

## Góc nhìn Production

Theo dõi leader churn, stale-token rejects, quorum health và clock drift. Test stop-the-world pause, network partition và delayed write.

## Trade-offs

Consensus/lease chọn owner theo quorum/timing nhưng không giết process stale. Protected storage giữ highest epoch và compare-and-set; worker token cũ bị reject. Fencing phải tới nơi side effect thực sự xảy ra, không chỉ nằm trong coordinator.

## Câu trả lời sai thường gặp

Khi leader mới được bầu, leader cũ chắc chắn nhận được thông báo và dừng ngay.

## Follow-up

- Lease khác fencing thế nào?

- Resource không hỗ trợ token thì bảo vệ ra sao?

## Nguồn chính thống

- [Amazon Web Services — Leader election in distributed systems](https://aws.amazon.com/builders-library/leader-election-in-distributed-systems/)
- [Amazon Web Services — Challenges with distributed systems](https://aws.amazon.com/builders-library/challenges-with-distributed-systems/)
- [Kubernetes — Leases](https://kubernetes.io/docs/concepts/architecture/leases/)
- [Apache Kafka — Apache Kafka design documentation](https://kafka.apache.org/design/)
