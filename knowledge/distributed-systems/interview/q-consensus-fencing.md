---
id: q-consensus-fencing
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - consensus
  - leader-election
  - fencing
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
    - id: consensus
      required: true
      aliases:
        - consensus
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: leader-election
      required: true
      aliases:
        - leader-election
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: fencing
      required: false
      aliases:
        - fencing
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Heartbeat lock hoặc một row leader=true đủ consensus; khi leader mới lên thì leader cũ chắc chắn dừng ngay.
      penalty: 20
---

# Có leader election rồi vì sao hệ thống vẫn cần consensus log và fencing?

## Rubric

### Must Include

- consensus

- leader-election

### Strong Answer Includes

- fencing

## Câu trả lời 30 giây

Election chỉ chọn một candidate theo view hiện tại; old leader bị partition/pause vẫn có thể hành động. Consensus dùng quorum, term/epoch và replicated log để commit một history; fencing giúp protected resource từ chối command từ leader stale.

## Câu trả lời chi tiết

Trong Raft-like model, leader chỉ commit entry khi replication/quorum rules của term được thỏa; followers áp cùng committed order. Majority intersection ngăn hai quorums độc lập commit histories xung đột trong cùng configuration, nhưng liveness mất khi không có majority. Client timeout vẫn cho outcome unknown và retry cần request ID. Membership change, snapshot/log compaction và recovery là protocol operations, không tự viết ad-hoc.

## Deep Dive

Lease-based leader có timing assumptions; consensus safety không nên dựa chỉ vào wall-clock timeout. Term/epoch phải đi tới storage/worker như fencing token nếu stale actor còn side effect ngoài log.

## Góc nhìn Production

Theo dõi term/leader churn, commit/apply lag, quorum health và disk; test minority/majority partition, slow disk, restart và membership change. Không force two sides active để cứu availability.

## Trade-offs

Lease-based leader có timing assumptions; consensus safety không nên dựa chỉ vào wall-clock timeout. Term/epoch phải đi tới storage/worker như fencing token nếu stale actor còn side effect ngoài log.

## Câu trả lời sai thường gặp

Heartbeat lock hoặc một row leader=true đủ consensus; khi leader mới lên thì leader cũ chắc chắn dừng ngay.

## Follow-up

- Quorum intersection bảo vệ safety thế nào?

- Leader lease và fencing token khác nhau ra sao?

## Nguồn chính thống

- [Amazon Web Services — Leader election in distributed systems](https://aws.amazon.com/builders-library/leader-election-in-distributed-systems/)
- [Amazon Web Services — Challenges with distributed systems](https://aws.amazon.com/builders-library/challenges-with-distributed-systems/)
- [Kubernetes — Leases](https://kubernetes.io/docs/concepts/architecture/leases/)
- [Apache Kafka — Apache Kafka design documentation](https://kafka.apache.org/design/)
