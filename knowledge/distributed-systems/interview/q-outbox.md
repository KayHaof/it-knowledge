---
id: q-outbox
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - outbox
  - dual-write
relatedLessons:
  - transactional-outbox
sources:
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
        technicalCorrectness: 20
        completeness: 10
    - id: dual-write
      required: true
      aliases:
        - dual-write
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Outbox làm DB và Kafka thành một exactly-once distributed transaction.
      penalty: 20
---

# Transactional Outbox giải quyết gì và còn hạn chế nào?

## Rubric

### Must Include

- outbox

- dual-write

### Strong Answer Includes

## Câu trả lời 30 giây

Nó ghi business change và publish intent trong cùng DB transaction, tránh lost event do dual write. Publisher gửi sau commit nhưng có thể duplicate, nên consumer vẫn idempotent.

## Câu trả lời chi tiết

Outbox row có eventId, aggregate/version và payload. Poller claim row hoặc CDC đọc transaction log rồi publish. Crash sau publish trước checkpoint tạo duplicate. Cần ordering theo aggregate, retry/quarantine, schema evolution, cleanup và monitor oldest unpublished age.

## Góc nhìn Production

Polling dễ sở hữu nhưng có DB load; CDC latency thấp hơn nhưng thêm connector/offset operations.

## Trade-offs

Outbox row có eventId, aggregate/version và payload. Poller claim row hoặc CDC đọc transaction log rồi publish. Crash sau publish trước checkpoint tạo duplicate. Cần ordering theo aggregate, retry/quarantine, schema evolution, cleanup và monitor oldest unpublished age.

## Câu trả lời sai thường gặp

Outbox làm DB và Kafka thành một exactly-once distributed transaction.

## Follow-up

- Polling và CDC trade-off gì?

- Cleanup outbox an toàn thế nào?

## Nguồn chính thống

- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
