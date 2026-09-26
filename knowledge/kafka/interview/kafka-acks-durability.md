---
id: kafka-acks-durability
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - acks
  - ISR
  - durability
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
    - id: acks
      required: true
      aliases:
        - acks
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: isr
      required: true
      aliases:
        - ISR
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: durability
      required: false
      aliases:
        - durability
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - acks=all đợi mọi broker trong cluster và đảm bảo exactly-once delivery.
      penalty: 20
---

# `acks=all` có nghĩa message không bao giờ mất không?

## Rubric

### Must Include

- acks

- ISR

### Strong Answer Includes

- durability

## Câu trả lời 30 giây

Nó chờ all in-sync replicas xác nhận theo min.insync.replicas, cải thiện durability nhưng không bảo vệ lỗi cấu hình, thảm họa toàn cluster hay producer retry duplicate. Durability là trade-off latency/capacity.

## Câu trả lời chi tiết

Leader append và followers fetch; ISR co lại khi replica chậm. Nếu ISR dưới min, producer nhận lỗi thay vì ghi thiếu replica. Chọn replication factor, min ISR, unclean leader election, disk/zone placement và backup phù hợp.

## Góc nhìn Production

Alert ISR shrink, under-replicated partitions, disk fsync/latency; kiểm restore drill.

## Trade-offs

Leader append và followers fetch; ISR co lại khi replica chậm. Nếu ISR dưới min, producer nhận lỗi thay vì ghi thiếu replica. Chọn replication factor, min ISR, unclean leader election, disk/zone placement và backup phù hợp.

## Câu trả lời sai thường gặp

acks=all đợi mọi broker trong cluster và đảm bảo exactly-once delivery.

## Follow-up

- Unclean leader election nguy hiểm gì?

- Producer timeout sau broker append xử lý duplicate thế nào?

## Nguồn chính thống

- [Apache Kafka — Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Kafka design](https://kafka.apache.org/documentation/#design)
