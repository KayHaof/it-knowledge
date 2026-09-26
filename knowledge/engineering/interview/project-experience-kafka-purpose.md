---
id: project-experience-kafka-purpose
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: middle
topics:
  - Kafka
  - project-story
  - events
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
    - id: kafka
      required: true
      aliases:
        - Kafka
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: project-story
      required: true
      aliases:
        - project-story
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: events
      required: false
      aliases:
        - events
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Kafka được chọn vì đảm bảo global ordering và exactly-once cho mọi service.
      penalty: 20
---

# Trả lời “Tại sao dùng Kafka?” theo cách thể hiện judgment?

## Rubric

### Must Include

- Kafka

- project-story

### Strong Answer Includes

- events

## Câu trả lời 30 giây

Tôi liên hệ nhu cầu durable event, consumer độc lập, replay hoặc throughput với constraint cụ thể; không dùng Kafka chỉ vì microservices. Tôi nói rõ ordering scope, delivery semantics và vận hành cần thiết.

## Câu trả lời chi tiết

Khung trả lời: producer/consumer ownership, partition key, retention, retry/DLQ, idempotency và observability. So sánh REST/queue nếu workflow cần synchronous response hoặc load nhỏ. Nếu repo không có topic config/lag evidence, tôi nói đó là cách đánh giá chứ không khẳng định project đang chạy như vậy.

## Góc nhìn Production

Nêu lag age, ISR, schema compatibility và replay runbook; không claim exactly-once end-to-end.

## Trade-offs

Khung trả lời: producer/consumer ownership, partition key, retention, retry/DLQ, idempotency và observability. So sánh REST/queue nếu workflow cần synchronous response hoặc load nhỏ. Nếu repo không có topic config/lag evidence, tôi nói đó là cách đánh giá chứ không khẳng định project đang chạy như vậy.

## Câu trả lời sai thường gặp

Kafka được chọn vì đảm bảo global ordering và exactly-once cho mọi service.

## Follow-up

- Khi nào REST phù hợp hơn Kafka?

- Consumer xử lý duplicate thế nào?

## Nguồn chính thống

- [Apache Kafka — Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Kafka design](https://kafka.apache.org/documentation/#design)
