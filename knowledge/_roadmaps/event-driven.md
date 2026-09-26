---
id: event-driven
type: roadmap
title: Kafka và Event-driven Systems
description: Từ log/partition đến delivery, schema, transactions, outbox, idempotency và workflow.
steps:
  - lessonId: kafka-broker-storage-replication
    note: Broker log, segment và replication.
  - lessonId: kafka-kraft-partitions-ordering
    note: KRaft metadata quorum, partition leadership và ordering.
  - lessonId: kafka-delivery
    note: Partition, groups, offset và ordering.
  - lessonId: kafka-producer-durability-batching
    note: acks, idempotence, batching và durability budget.
  - lessonId: spring-kafka-event-consumer-production
    note: Listener lifecycle, offset, retry và idempotent consumer.
  - lessonId: kafka-capacity-retention-operations
    note: Throughput, partition capacity, retention và disk operations.
  - lessonId: kafka-schema-dlq-replay
    note: Schema, retry, quarantine và replay.
  - lessonId: kafka-transactions-outbox
    note: Producer transaction và DB boundary.
  - lessonId: transactional-outbox
    note: Business change với publish intent.
  - lessonId: idempotency-retry-circuit-breaker
    note: Failure semantics và retry budget.
  - lessonId: cqrs-event-driven
    note: Read projections và rebuild.
  - lessonId: saga-distributed-transactions
    note: Compensation và workflow state.
  - lessonId: redis-streams-pubsub
    note: So sánh stream log, consumer groups và ephemeral Pub/Sub.
  - lessonId: realtime-protocols
    note: WebSocket, SSE, polling và connection lifecycle.
  - lessonId: kafka-vs-rest-message-queue
    note: Chọn synchronous API, broker queue hay event log.
  - lessonId: distributed-failures
    note: Partial failure và unknown outcome.
  - lessonId: otel-context-propagation
    note: Trace qua message headers.
  - lessonId: system-design-chat
    note: Case realtime stateful.
---

# Kafka và Event-driven Systems

## Tổng quan

Từ log/partition đến delivery, schema, transactions, outbox, idempotency và workflow.

## Lộ trình

1. **kafka-broker-storage-replication** — Broker log, segment và replication.

2. **kafka-kraft-partitions-ordering** — KRaft metadata quorum, partition leadership và ordering.

3. **kafka-delivery** — Partition, groups, offset và ordering.

4. **kafka-producer-durability-batching** — acks, idempotence, batching và durability budget.

5. **spring-kafka-event-consumer-production** — Listener lifecycle, offset, retry và idempotent consumer.

6. **kafka-capacity-retention-operations** — Throughput, partition capacity, retention và disk operations.

7. **kafka-schema-dlq-replay** — Schema, retry, quarantine và replay.

8. **kafka-transactions-outbox** — Producer transaction và DB boundary.

9. **transactional-outbox** — Business change với publish intent.

10. **idempotency-retry-circuit-breaker** — Failure semantics và retry budget.

11. **cqrs-event-driven** — Read projections và rebuild.

12. **saga-distributed-transactions** — Compensation và workflow state.

13. **redis-streams-pubsub** — So sánh stream log, consumer groups và ephemeral Pub/Sub.

14. **realtime-protocols** — WebSocket, SSE, polling và connection lifecycle.

15. **kafka-vs-rest-message-queue** — Chọn synchronous API, broker queue hay event log.

16. **distributed-failures** — Partial failure và unknown outcome.

17. **otel-context-propagation** — Trace qua message headers.

18. **system-design-chat** — Case realtime stateful.
