---
id: q-kafka-schema-dlq
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - schema-evolution
  - DLQ
  - replay
relatedLessons:
  - kafka-schema-dlq-replay
sources:
  - title: Kafka basic operations
    url: https://kafka.apache.org/43/operations/basic-kafka-operations/
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
    - id: schema-evolution
      required: true
      aliases:
        - schema-evolution
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: dlq
      required: true
      aliases:
        - DLQ
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: replay
      required: false
      aliases:
        - replay
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Có DLQ nghĩa message không mất nên không cần alert hoặc reconciliation.
      penalty: 20
---

# Tại sao đẩy poison message vào DLQ chưa phải xử lý xong sự cố?

## Rubric

### Must Include

- schema-evolution

- DLQ

### Strong Answer Includes

- replay

## Câu trả lời 30 giây

DLQ chỉ cách ly record để partition tiếp tục; dữ liệu/business effect vẫn thiếu. Cần reason, ownership, alert, redaction, retention và replay procedure idempotent sau khi fix schema/code/data.

## Câu trả lời chi tiết

Tôi phân loại transient với permanent. Retry transient có backoff/budget; validation/schema incompatibility vào quarantine cùng event ID, original topic/partition/offset và error category, không nhất thiết raw secret. Replay qua pipeline kiểm soát, rate limit và dedupe; không publish vòng lặp vô hạn.

## Deep Dive

Compatibility phải xét producer lẫn mọi consumer đang deploy. Default field, rename/remove và semantic change có risk khác nhau dù serialization vẫn parse.

## Góc nhìn Production

Dashboard oldest/volume DLQ, owner/SLA, restore drill và audit effect sau replay.

## Trade-offs

Compatibility phải xét producer lẫn mọi consumer đang deploy. Default field, rename/remove và semantic change có risk khác nhau dù serialization vẫn parse.

## Câu trả lời sai thường gặp

Có DLQ nghĩa message không mất nên không cần alert hoặc reconciliation.

## Follow-up

- Retry topic ảnh hưởng ordering ra sao?

- Replay giữ key và timestamp thế nào?

## Nguồn chính thống

- [Apache Kafka — Kafka basic operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
