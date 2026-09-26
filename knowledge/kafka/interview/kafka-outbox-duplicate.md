---
id: kafka-outbox-duplicate
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - outbox
  - dual-write
  - idempotency
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
    - id: outbox
      required: true
      aliases:
        - outbox
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: dual-write
      required: true
      aliases:
        - dual-write
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: idempotency
      required: false
      aliases:
        - idempotency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Outbox đảm bảo exactly-once end-to-end nên consumer không cần dedupe.
      penalty: 20
---

# Transactional Outbox vẫn có thể phát duplicate Kafka event ở điểm nào?

## Rubric

### Must Include

- outbox

- dual-write

### Strong Answer Includes

- idempotency

## Câu trả lời 30 giây

Publisher có thể crash sau khi Kafka nhận event nhưng trước khi đánh dấu outbox sent. Retry sẽ gửi lại; consumer cần idempotency key/unique inbox và reconciliation.

## Câu trả lời chi tiết

DB transaction ghi business state + outbox atomically. Poller/CDC đọc row, publish và cập nhật sent là hai side effects khác nhau; không có one-transaction giữa DB/Kafka. Event ID ổn định, dedupe store/unique constraint và version check làm duplicate harmless. Cleanup chỉ xóa sau retention/replay guarantee.

## Góc nhìn Production

Theo dõi unsent age, publish attempts, duplicate conflict, CDC lag và cleanup backlog. Inject crash tại từng boundary.

## Trade-offs

DB transaction ghi business state + outbox atomically. Poller/CDC đọc row, publish và cập nhật sent là hai side effects khác nhau; không có one-transaction giữa DB/Kafka. Event ID ổn định, dedupe store/unique constraint và version check làm duplicate harmless. Cleanup chỉ xóa sau retention/replay guarantee.

## Câu trả lời sai thường gặp

Outbox đảm bảo exactly-once end-to-end nên consumer không cần dedupe.

## Follow-up

- CDC khác polling ở failure nào?

- Inbox dedupe giữ bao lâu?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Producer Configs](https://kafka.apache.org/43/configuration/producer-configs/)
- [Apache Kafka — Apache Kafka Design - Transactions](https://kafka.apache.org/43/design/design/)
- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
