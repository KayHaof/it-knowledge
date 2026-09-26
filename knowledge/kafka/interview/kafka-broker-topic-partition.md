---
id: kafka-broker-topic-partition
type: interview-question
technology: Kafka
category: Kafka
difficulty: junior
topics:
  - broker
  - topic
  - partition
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
    - id: broker
      required: true
      aliases:
        - broker
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: topic
      required: true
      aliases:
        - topic
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: partition
      required: false
      aliases:
        - partition
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Topic chỉ có một log toàn cục và broker nào cũng chứa mọi record theo cùng offset.
      penalty: 20
---

# Broker, topic và partition trong Kafka liên hệ thế nào?

## Rubric

### Must Include

- broker

- topic

### Strong Answer Includes

- partition

## Câu trả lời 30 giây

Broker là server lưu dữ liệu; topic là logical stream; partition là log có thứ tự và đơn vị parallelism nằm trên broker. Record có offset trong partition, không có offset toàn topic.

## Câu trả lời chi tiết

Topic chia partition để producer/consumer scale; mỗi partition có leader và replicas. Consumer group chia partition cho members, nên số consumer active tối đa theo partition assignment. Partition count, key distribution và retention là contract vận hành khó đổi sau này.

## Góc nhìn Production

Theo dõi partition skew, offline/under-replicated partitions, disk và lag. Đặt replication factor/placement theo failure domain.

## Trade-offs

Topic chia partition để producer/consumer scale; mỗi partition có leader và replicas. Consumer group chia partition cho members, nên số consumer active tối đa theo partition assignment. Partition count, key distribution và retention là contract vận hành khó đổi sau này.

## Câu trả lời sai thường gặp

Topic chỉ có một log toàn cục và broker nào cũng chứa mọi record theo cùng offset.

## Follow-up

- Consumer group chia partition ra sao?

- Tăng partition có ảnh hưởng ordering không?

## Nguồn chính thống

- [Apache Kafka — Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Kafka design](https://kafka.apache.org/documentation/#design)
