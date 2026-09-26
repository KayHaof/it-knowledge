---
id: q-exactly-once
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - transactions
  - idempotency
relatedLessons:
  - kafka-delivery
sources:
  - title: Kafka documentation
    url: https://kafka.apache.org/documentation/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Kafka design
    url: https://kafka.apache.org/documentation/#design
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
    - id: transactions
      required: true
      aliases:
        - transactions
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: idempotency
      required: true
      aliases:
        - idempotency
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật exactly_once là toàn hệ thống không bao giờ xử lý message hai lần.
      penalty: 20
---

# Exactly-once của Kafka có nghĩa không bao giờ duplicate ở đâu cả?

## Rubric

### Must Include

- transactions

- idempotency

### Strong Answer Includes

## Câu trả lời 30 giây

Không. Guarantee có phạm vi cấu hình/transaction Kafka, đặc biệt pipeline Kafka-to-Kafka. Side effect ra DB, email hoặc REST vẫn cần idempotency và boundary riêng.

## Câu trả lời chi tiết

Idempotent producer loại duplicate do producer retry trong scope; Kafka transaction có thể atomically write nhiều partitions và commit consumer offsets, consumer read_committed tránh aborted records. Nhưng external systems không tham gia transaction đó. End-to-end cần outbox/inbox, unique key hoặc reconciliation.

## Góc nhìn Production

Nói rõ transaction.id lifecycle, fencing, timeout, read_committed và operational overhead.

## Trade-offs

Idempotent producer loại duplicate do producer retry trong scope; Kafka transaction có thể atomically write nhiều partitions và commit consumer offsets, consumer read_committed tránh aborted records. Nhưng external systems không tham gia transaction đó. End-to-end cần outbox/inbox, unique key hoặc reconciliation.

## Câu trả lời sai thường gặp

Bật exactly_once là toàn hệ thống không bao giờ xử lý message hai lần.

## Follow-up

- At-least-once consumer idempotent ra sao?

- Outbox có exactly-once không?

## Nguồn chính thống

- [Apache Kafka — Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Kafka design](https://kafka.apache.org/documentation/#design)
