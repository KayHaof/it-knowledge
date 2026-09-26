---
id: kafka-producer-acks-isr
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - acks
  - ISR
  - durability
relatedLessons:
  - kafka-broker-storage-replication
sources:
  - title: Apache Kafka Design
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Broker Configs
    url: https://kafka.apache.org/43/configuration/broker-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Monitoring
    url: https://kafka.apache.org/43/operations/monitoring/
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
        - Replication factor 3 cùng acks=all bảo đảm message tồn tại trên cả ba broker trước mọi response.
      penalty: 20
---

# `acks=all` và `min.insync.replicas` cùng quyết định durability thế nào?

## Rubric

### Must Include

- acks

- ISR

### Strong Answer Includes

- durability

## Câu trả lời 30 giây

`acks=all` chờ leader và ISR hiện tại acknowledge; `min.insync.replicas` đặt ngưỡng ISR tối thiểu để broker nhận write. Nếu ISR dưới ngưỡng, producer phải nhận lỗi thay vì ghi thiếu redundancy.

## Câu trả lời chi tiết

Replication factor 3 không có nghĩa luôn có 3 replica in-sync; lagging replica rời ISR. Acks all vẫn chỉ chờ ISR đủ điều kiện, và unclean leader election có thể đổi durability/availability. Producer retry/idempotence cần xử lý unknown outcome.

## Góc nhìn Production

Alert ISR shrink, under-replicated/offline partitions và produce error/latency. Test broker loss, disk slow và config rollout.

## Trade-offs

Replication factor 3 không có nghĩa luôn có 3 replica in-sync; lagging replica rời ISR. Acks all vẫn chỉ chờ ISR đủ điều kiện, và unclean leader election có thể đổi durability/availability. Producer retry/idempotence cần xử lý unknown outcome.

## Câu trả lời sai thường gặp

Replication factor 3 cùng acks=all bảo đảm message tồn tại trên cả ba broker trước mọi response.

## Follow-up

- Unclean leader election trade-off gì?

- Producer timeout sau broker commit xử lý duplicate thế nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
- [Apache Kafka — Apache Kafka Broker Configs](https://kafka.apache.org/43/configuration/broker-configs/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
