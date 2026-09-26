---
id: distributed-outbox-polling-cdc
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - outbox
  - CDC
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
        technicalCorrectness: 14
        completeness: 7
    - id: cdc
      required: true
      aliases:
        - CDC
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: dual-write
      required: false
      aliases:
        - dual-write
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CDC đảm bảo đúng một lần nên không cần dedup ở Kafka consumer.
      penalty: 20
---

# Polling publisher và CDC cho transactional outbox có trade-off gì?

## Rubric

### Must Include

- outbox

- CDC

### Strong Answer Includes

- dual-write

## Câu trả lời 30 giây

Polling dễ triển khai nhưng tốn query và cần claim/locking; CDC đọc log database với latency thấp hơn nhưng phụ thuộc connector/replication. Cả hai vẫn cần idempotent publish/consume.

## Câu trả lời chi tiết

Outbox row commit cùng business data, publisher chuyển sang Kafka rồi đánh dấu published hoặc giữ offset. Polling phải batch, index status và tránh lock dài; CDC cần schema evolution, snapshot và offset recovery. Duplicate xảy ra khi crash sau broker ack trước mark.

## Góc nhìn Production

Theo dõi oldest outbox age, publish error, connector lag và cleanup; giữ replay/audit window.

## Trade-offs

Outbox row commit cùng business data, publisher chuyển sang Kafka rồi đánh dấu published hoặc giữ offset. Polling phải batch, index status và tránh lock dài; CDC cần schema evolution, snapshot và offset recovery. Duplicate xảy ra khi crash sau broker ack trước mark.

## Câu trả lời sai thường gặp

CDC đảm bảo đúng một lần nên không cần dedup ở Kafka consumer.

## Follow-up

- Outbox cleanup không làm mất khả năng replay thế nào?

- Aggregate ordering giữ bằng cách nào?

## Nguồn chính thống

- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
