---
id: q-kafka-outbox-boundary
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - transactions
  - outbox
  - idempotency
relatedLessons:
  - kafka-transactions-outbox
sources:
  - title: Kafka producer configuration
    url: https://kafka.apache.org/43/configuration/producer-configs/
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
        technicalCorrectness: 14
        completeness: 7
    - id: outbox
      required: true
      aliases:
        - outbox
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
        - Bật idempotent producer là DB write và Kafka publish cùng một distributed transaction.
      penalty: 20
---

# Kafka transaction và Transactional Outbox giải quyết hai boundary khác nhau thế nào?

## Rubric

### Must Include

- transactions

- outbox

### Strong Answer Includes

- idempotency

## Câu trả lời 30 giây

Kafka transaction atomically ghi records và offsets trong Kafka scope. Outbox atomically ghi business row và publish intent trong một database transaction. Cả hai không tự làm side effect ngoài boundary exactly-once.

## Câu trả lời chi tiết

Pipeline Kafka-to-Kafka có thể dùng transactional producer + read_committed. Khi source là DB, outbox tránh dual-write lost event; poller/CDC publish sau commit và có thể duplicate. Consumer vẫn dùng event ID/unique inbox và reconciliation cho DB/email/REST effects.

## Deep Dive

Crash sau publish trước checkpoint tạo duplicate hợp lệ. Ordering thường chỉ yêu cầu theo aggregate/key, không global.

## Góc nhìn Production

Theo dõi transaction abort/fencing, oldest unpublished outbox, connector lag, duplicate rate và cleanup.

## Trade-offs

Crash sau publish trước checkpoint tạo duplicate hợp lệ. Ordering thường chỉ yêu cầu theo aggregate/key, không global.

## Câu trả lời sai thường gặp

Bật idempotent producer là DB write và Kafka publish cùng một distributed transaction.

## Follow-up

- Polling outbox khác CDC?

- read_committed có loại duplicate external side effect không?

## Nguồn chính thống

- [Apache Kafka — Kafka producer configuration](https://kafka.apache.org/43/configuration/producer-configs/)
