---
id: q-kafka-order
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - partition
  - ordering
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
    - id: partition
      required: true
      aliases:
        - partition
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: ordering
      required: true
      aliases:
        - ordering
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Kafka bảo đảm toàn bộ topic được consume đúng thứ tự.
      penalty: 20
---

# Kafka có bảo đảm thứ tự message không?

## Rubric

### Must Include

- partition

- ordering

### Strong Answer Includes

## Câu trả lời 30 giây

Kafka giữ order trong một partition. Không có global order toàn topic; key/partition strategy quyết định những record nào cần cùng order và parallelism tối đa.

## Câu trả lời chi tiết

Producer chọn partition, record nhận offset trong partition. Consumer group chia partitions giữa consumers nên một partition có một consumer trong group tại thời điểm. Tăng partition tăng parallelism nhưng thay key distribution/ordering. Retry và multi-producer vẫn cần business sequence/idempotency.

## Góc nhìn Production

Theo dõi skew, lag per partition, rebalance và hot key; partition count khó giảm.

## Trade-offs

Producer chọn partition, record nhận offset trong partition. Consumer group chia partitions giữa consumers nên một partition có một consumer trong group tại thời điểm. Tăng partition tăng parallelism nhưng thay key distribution/ordering. Retry và multi-producer vẫn cần business sequence/idempotency.

## Câu trả lời sai thường gặp

Kafka bảo đảm toàn bộ topic được consume đúng thứ tự.

## Follow-up

- Nhiều consumer hơn partition sẽ thế nào?

- Retry topic ảnh hưởng ordering ra sao?

## Nguồn chính thống

- [Apache Kafka — Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Kafka design](https://kafka.apache.org/documentation/#design)
