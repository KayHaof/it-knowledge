---
id: distributed-leader-election-splitbrain
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - leader-election
  - split-brain
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
    - id: leader-election
      required: true
      aliases:
        - leader-election
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: split-brain
      required: true
      aliases:
        - split-brain
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
        - Bầu leader mới tự động dừng process leader cũ nên fencing không cần thiết.
      penalty: 20
---

# Leader election không đủ để ngăn split-brain; cần fencing token vì sao?

## Rubric

### Must Include

- leader-election

- split-brain

### Strong Answer Includes

- fencing

## Câu trả lời 30 giây

Node cũ có thể mất kết nối nhưng vẫn tiếp tục ghi; token tăng dần giúp storage từ chối thao tác của leader cũ. Lease/timeout đơn độc không chứng minh node đã dừng.

## Câu trả lời chi tiết

Quorum chọn leader mới, nhưng network partition khiến old leader không biết. Mỗi write mang epoch/fencing token được resource kiểm monotonic; token phải đi tới nơi bảo vệ state. Đồng hồ local không nên là nguồn duy nhất của lease safety.

## Góc nhìn Production

Test pause-the-world/network partition; metric epoch conflict và rejected stale writes.

## Trade-offs

Quorum chọn leader mới, nhưng network partition khiến old leader không biết. Mỗi write mang epoch/fencing token được resource kiểm monotonic; token phải đi tới nơi bảo vệ state. Đồng hồ local không nên là nguồn duy nhất của lease safety.

## Câu trả lời sai thường gặp

Bầu leader mới tự động dừng process leader cũ nên fencing không cần thiết.

## Follow-up

- Fencing token lưu ở đâu?

- Clock drift phá lease thế nào?

## Nguồn chính thống

- [Amazon Web Services — Leader election in distributed systems](https://aws.amazon.com/builders-library/leader-election-in-distributed-systems/)
- [Amazon Web Services — Challenges with distributed systems](https://aws.amazon.com/builders-library/challenges-with-distributed-systems/)
- [Kubernetes — Leases](https://kubernetes.io/docs/concepts/architecture/leases/)
- [Apache Kafka — Apache Kafka design documentation](https://kafka.apache.org/design/)
