---
id: kafka-transaction-boundary
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - Kafka-transactions
  - exactly-once
  - external-db
relatedLessons:
  - kafka-transactions-outbox
sources:
  - title: Apache Kafka Producer Configs
    url: https://kafka.apache.org/43/configuration/producer-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Design - Transactions
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Debezium Outbox Event Router
    url: https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html
    organization: Debezium
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
    - id: kafka-transactions
      required: true
      aliases:
        - Kafka-transactions
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: exactly-once
      required: true
      aliases:
        - exactly-once
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: external-db
      required: false
      aliases:
        - external-db
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Kafka transaction bọc được mọi side effect mà consumer thực hiện trong transaction block.
      penalty: 20
---

# Kafka transaction bảo vệ atomicity nào và không bảo vệ atomicity nào?

## Rubric

### Must Include

- Kafka-transactions

- exactly-once

### Strong Answer Includes

- external-db

## Câu trả lời 30 giây

Nó atomically commit records tới Kafka và offsets của consumer transaction. Database, HTTP provider hoặc email ngoài Kafka không được rollback; cần outbox/idempotency/saga.

## Câu trả lời chi tiết

Producer transaction ghi nhiều partitions và `sendOffsetsToTransaction`; read-process-write Kafka có exactly-once processing semantics trong phạm vi Kafka. Transaction timeout, fencing và abort tạo operational complexity. Sink DB phải có transaction/inbox hoặc connector semantics riêng, không suy ra từ Kafka flag.

## Góc nhìn Production

Theo dõi transaction abort/timeout, producer fencing, coordinator health và lag. Test crash/restart, timeout và broker failover.

## Trade-offs

Producer transaction ghi nhiều partitions và `sendOffsetsToTransaction`; read-process-write Kafka có exactly-once processing semantics trong phạm vi Kafka. Transaction timeout, fencing và abort tạo operational complexity. Sink DB phải có transaction/inbox hoặc connector semantics riêng, không suy ra từ Kafka flag.

## Câu trả lời sai thường gặp

Kafka transaction bọc được mọi side effect mà consumer thực hiện trong transaction block.

## Follow-up

- EOS khác exactly-once business outcome thế nào?

- Transaction timeout quá thấp gây gì?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Producer Configs](https://kafka.apache.org/43/configuration/producer-configs/)
- [Apache Kafka — Apache Kafka Design - Transactions](https://kafka.apache.org/43/design/design/)
- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
