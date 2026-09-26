---
id: distributed-outbox-polling-cdc-original
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - outbox
  - CDC
  - polling
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
    - id: polling
      required: false
      aliases:
        - polling
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CDC làm event exactly-once nên không cần idempotency hoặc outbox cleanup.
      penalty: 20
---

# Polling Publisher và CDC của Outbox khác nhau về trade-off nào?

## Rubric

### Must Include

- outbox

- CDC

### Strong Answer Includes

- polling

## Câu trả lời 30 giây

Polling đơn giản, chủ động batch nhưng tạo query/lock và latency; CDC đọc log gần realtime, giảm poll load nhưng cần connector/schema/offset vận hành. Cả hai vẫn cần duplicate-safe consumer.

## Câu trả lời chi tiết

Polling có thể `FOR UPDATE SKIP LOCKED`, trạng thái claim và retry; nhiều worker cần lease. CDC theo WAL/binlog phản ánh commit order nhưng DDL/connector lag và snapshot phải quản. Outbox row schema event identity/aggregate sequence phục vụ cả hai.

## Góc nhìn Production

Theo dõi unsent age, poll/CDC lag, claim contention, connector errors và cleanup. Test restart, schema migration và duplicate publication.

## Trade-offs

Polling có thể `FOR UPDATE SKIP LOCKED`, trạng thái claim và retry; nhiều worker cần lease. CDC theo WAL/binlog phản ánh commit order nhưng DDL/connector lag và snapshot phải quản. Outbox row schema event identity/aggregate sequence phục vụ cả hai.

## Câu trả lời sai thường gặp

CDC làm event exactly-once nên không cần idempotency hoặc outbox cleanup.

## Follow-up

- Polling claim timeout xử lý sao?

- CDC snapshot tạo duplicate thế nào?

## Nguồn chính thống

- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
