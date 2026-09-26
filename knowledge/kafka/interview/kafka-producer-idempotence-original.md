---
id: kafka-producer-idempotence-original
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - idempotent-producer
  - sequence
  - retry
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
    - id: sequence
      required: true
      aliases:
        - sequence
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: retry
      required: false
      aliases:
        - retry
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật enable.idempotence khiến cùng một business event chỉ tồn tại một lần trên toàn cluster.
      penalty: 20
---

# Idempotent producer của Kafka ngăn duplicate trong phạm vi nào?

## Rubric

### Must Include

- idempotent-producer

- sequence

### Strong Answer Includes

- retry

## Câu trả lời 30 giây

Nó dùng producer ID/sequence để broker dedupe retry từ cùng session/partition. Nó không ngăn application gửi cùng business event hai lần, không bao phủ database và không thay idempotent consumer.

## Câu trả lời chi tiết

Producer retry sau network uncertainty có thể gửi lại sequence; broker nhận duplicate sequence và giữ một record. Producer restart/new PID hoặc logic retry ngoài client có thể tạo duplicate business key. Transactions mở rộng atomicity giữa Kafka partitions/offsets nhưng không tự đồng bộ external DB.

## Góc nhìn Production

Theo dõi out-of-order/duplicate errors, retries, PID fencing và transaction abort. Ghi event ID/aggregate version để consumer dedupe.

## Trade-offs

Producer retry sau network uncertainty có thể gửi lại sequence; broker nhận duplicate sequence và giữ một record. Producer restart/new PID hoặc logic retry ngoài client có thể tạo duplicate business key. Transactions mở rộng atomicity giữa Kafka partitions/offsets nhưng không tự đồng bộ external DB.

## Câu trả lời sai thường gặp

Bật enable.idempotence khiến cùng một business event chỉ tồn tại một lần trên toàn cluster.

## Follow-up

- Producer restart ảnh hưởng sequence ra sao?

- Consumer dedupe dùng key hay event ID?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Producer Configs](https://kafka.apache.org/43/configuration/producer-configs/)
- [Apache Kafka — Apache Kafka Design - Transactions](https://kafka.apache.org/43/design/design/)
- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
