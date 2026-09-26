---
id: q-kafka-partition-junior
type: interview-question
technology: Kafka
category: Kafka
difficulty: junior
topics:
  - partition
  - offset
  - consumer-group
relatedLessons:
  - kafka-delivery
sources:
  - title: Kafka design documentation
    url: https://kafka.apache.org/43/design/design/
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
        technicalCorrectness: 14
        completeness: 7
    - id: offset
      required: true
      aliases:
        - offset
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: consumer-group
      required: false
      aliases:
        - consumer-group
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Offset là ID toàn cục của message và Kafka giữ global order cho topic.
      penalty: 20
---

# Partition và offset trong Kafka dùng để làm gì?

## Rubric

### Must Include

- partition

- offset

### Strong Answer Includes

- consumer-group

## Câu trả lời 30 giây

Partition là ordered append log và đơn vị parallelism/replication. Offset là vị trí record trong một partition; nó không global giữa partitions. Consumer group phân partitions cho members và lưu tiến độ theo partition.

## Câu trả lời chi tiết

Producer key thường quyết định partition để các event cần order cùng vào một log. Tăng partitions tăng parallelism nhưng thay distribution/order assumptions và khó giảm. Commit offset biểu diễn tiến độ consume, không chứng minh external side effect đã hoàn tất đúng một lần.

## Deep Dive

Nhiều consumers hơn partitions trong cùng group sẽ có members idle; hot key tạo skew dù tổng partition nhiều.

## Góc nhìn Production

Theo dõi lag/skew per partition, key cardinality, rebalance và capacity replication trước khi tăng count.

## Trade-offs

Nhiều consumers hơn partitions trong cùng group sẽ có members idle; hot key tạo skew dù tổng partition nhiều.

## Câu trả lời sai thường gặp

Offset là ID toàn cục của message và Kafka giữ global order cho topic.

## Follow-up

- Consumer nhiều hơn partition thì sao?

- Commit trước hay sau side effect có trade-off gì?

## Nguồn chính thống

- [Apache Kafka — Kafka design documentation](https://kafka.apache.org/43/design/design/)
