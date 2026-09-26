---
id: kafka-lag-diagnosis
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - consumer-lag
  - throughput
  - backlog
relatedLessons:
  - kafka-consumer-lag-rebalance-operations
sources:
  - title: Apache Kafka Consumer Configs
    url: https://kafka.apache.org/43/configuration/consumer-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Monitoring
    url: https://kafka.apache.org/43/operations/monitoring/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Consumer Rebalance Protocol
    url: https://kafka.apache.org/43/operations/consumer-rebalance-protocol/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Basic Operations
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
    - id: consumer-lag
      required: true
      aliases:
        - consumer-lag
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: throughput
      required: true
      aliases:
        - throughput
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: backlog
      required: false
      aliases:
        - backlog
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần tăng số consumer instance là mọi lag sẽ giảm tuyến tính.
      penalty: 20
---

# Consumer lag tăng: làm sao phân biệt producer burst, consumer chậm và broker issue?

## Rubric

### Must Include

- consumer-lag

- throughput

### Strong Answer Includes

- backlog

## Câu trả lời 30 giây

So sánh ingress rate, consume/commit rate, per-partition lag skew, poll/processing latency và broker request/disk. Lag là symptom backlog, không tự nói nguyên nhân.

## Câu trả lời chi tiết

Nếu producer rate vượt sustained consumer capacity, scale partitions/consumers hoặc shed/load policy. Nếu một partition hot, thêm consumer không giúp key lane; nếu broker fetch latency/under-replicated tăng, fix cluster. Slow external DB và rebalance cũng tạo lag. Dùng lag age và deadline, không chỉ total messages.

## Góc nhìn Production

Dashboard records-in/out, lag max/age, partition skew, fetch/commit p99, broker disk/network. Alert theo SLO lag age và test catch-up rate.

## Trade-offs

Nếu producer rate vượt sustained consumer capacity, scale partitions/consumers hoặc shed/load policy. Nếu một partition hot, thêm consumer không giúp key lane; nếu broker fetch latency/under-replicated tăng, fix cluster. Slow external DB và rebalance cũng tạo lag. Dùng lag age và deadline, không chỉ total messages.

## Câu trả lời sai thường gặp

Chỉ cần tăng số consumer instance là mọi lag sẽ giảm tuyến tính.

## Follow-up

- Partition hot xử lý thế nào?

- Catch-up rate nên tính theo metric nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
- [Apache Kafka — Apache Kafka Consumer Rebalance Protocol](https://kafka.apache.org/43/operations/consumer-rebalance-protocol/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
