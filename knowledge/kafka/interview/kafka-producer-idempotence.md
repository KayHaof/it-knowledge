---
id: kafka-producer-idempotence
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - idempotent-producer
  - retries
  - sequence
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
    - id: idempotent-producer
      required: true
      aliases:
        - idempotent-producer
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: retries
      required: true
      aliases:
        - retries
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: sequence
      required: false
      aliases:
        - sequence
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Idempotent producer khiến toàn hệ thống exactly-once kể cả database consumer.
      penalty: 20
---

# Idempotent producer giảm duplicate do retry bằng cơ chế nào?

## Rubric

### Must Include

- idempotent-producer

- retries

### Strong Answer Includes

- sequence

## Câu trả lời 30 giây

Producer identity và sequence number giúp broker deduplicate retry trong session/partition. Nó không làm business side effect downstream idempotent và có giới hạn khi producer identity reset.

## Câu trả lời chi tiết

Broker kiểm sequence theo producer ID/epoch để loại bản ghi trùng do timeout retry. Cấu hình retries, acks, max in-flight và transaction mode phải nhất quán. Consumer vẫn có thể process lại sau crash trước commit, nên cần idempotency key/outbox downstream.

## Góc nhìn Production

Theo dõi producer error/retry, epoch fencing và end-to-end duplicate rate.

## Trade-offs

Broker kiểm sequence theo producer ID/epoch để loại bản ghi trùng do timeout retry. Cấu hình retries, acks, max in-flight và transaction mode phải nhất quán. Consumer vẫn có thể process lại sau crash trước commit, nên cần idempotency key/outbox downstream.

## Câu trả lời sai thường gặp

Idempotent producer khiến toàn hệ thống exactly-once kể cả database consumer.

## Follow-up

- Producer restart ảnh hưởng dedup thế nào?

- Idempotent consumer lưu key ở đâu?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Producer Configs](https://kafka.apache.org/43/configuration/producer-configs/)
- [Apache Kafka — Apache Kafka Design - Transactions](https://kafka.apache.org/43/design/design/)
- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
