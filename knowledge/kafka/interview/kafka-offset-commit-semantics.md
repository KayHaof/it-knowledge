---
id: kafka-offset-commit-semantics
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - offset
  - commit
  - at-least-once
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
    - id: offset
      required: true
      aliases:
        - offset
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: commit
      required: true
      aliases:
        - commit
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: at-least-once
      required: false
      aliases:
        - at-least-once
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Commit offset đồng nghĩa message đã được xử lý thành công và không bao giờ cần đọc lại.
      penalty: 20
---

# Commit offset trước hay sau business side effect tạo semantics nào?

## Rubric

### Must Include

- offset

- commit

### Strong Answer Includes

- at-least-once

## Câu trả lời 30 giây

Commit trước giảm duplicate nhưng crash sau commit làm mất processing. Commit sau giảm loss nhưng crash giữa side effect và commit tạo duplicate; idempotency/transaction boundary quyết định outcome.

## Câu trả lời chi tiết

Auto-commit có thể commit records đã poll nhưng chưa xử lý xong nếu batch dài. Manual sync/async commit có ordering/failure nuance; commit failed không nên ack business. Kafka transaction có thể atomically commit offsets và output topic, không tự commit DB.

## Góc nhìn Production

Theo dõi commit failures, duplicate rate, lag và processing outcome; test crash injection tại từng điểm. Dùng unique constraint/event ID ở sink.

## Trade-offs

Auto-commit có thể commit records đã poll nhưng chưa xử lý xong nếu batch dài. Manual sync/async commit có ordering/failure nuance; commit failed không nên ack business. Kafka transaction có thể atomically commit offsets và output topic, không tự commit DB.

## Câu trả lời sai thường gặp

Commit offset đồng nghĩa message đã được xử lý thành công và không bao giờ cần đọc lại.

## Follow-up

- Auto-commit nguy hiểm khi batch lâu vì sao?

- Kafka transaction và database update phối hợp thế nào?

## Nguồn chính thống

- [Apache Kafka — Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Kafka design](https://kafka.apache.org/documentation/#design)
