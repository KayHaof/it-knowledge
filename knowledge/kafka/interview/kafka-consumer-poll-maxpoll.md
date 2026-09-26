---
id: kafka-consumer-poll-maxpoll
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - poll
  - max.poll.interval
  - rebalance
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
    - id: poll
      required: true
      aliases:
        - poll
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: max-poll-interval
      required: true
      aliases:
        - max.poll.interval
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: rebalance
      required: false
      aliases:
        - rebalance
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần gọi poll một lần rồi xử lý hàng giờ, group vẫn giữ partition vì TCP còn mở.
      penalty: 20
---

# Consumer xử lý batch lâu hơn `max.poll.interval.ms` sẽ ra sao?

## Rubric

### Must Include

- poll

- max.poll.interval

### Strong Answer Includes

- rebalance

## Câu trả lời 30 giây

Broker coi consumer không còn tiến triển, group rebalance và partition được giao consumer khác. Message chưa commit có thể bị xử lý lại.

## Câu trả lời chi tiết

`poll` phải gọi đủ thường xuyên để giữ membership; tăng interval chỉ che latency và làm rebalance recovery chậm. Giảm `max.poll.records`, xử lý song song có kiểm soát hoặc pause/resume partition, nhưng commit offset phải theo thứ tự hoàn thành. Đo processing time p99 so với poll interval.

## Góc nhìn Production

Alert rebalance rate, max lag age và processing latency; poison message cần DLQ/quarantine.

## Trade-offs

`poll` phải gọi đủ thường xuyên để giữ membership; tăng interval chỉ che latency và làm rebalance recovery chậm. Giảm `max.poll.records`, xử lý song song có kiểm soát hoặc pause/resume partition, nhưng commit offset phải theo thứ tự hoàn thành. Đo processing time p99 so với poll interval.

## Câu trả lời sai thường gặp

Chỉ cần gọi poll một lần rồi xử lý hàng giờ, group vẫn giữ partition vì TCP còn mở.

## Follow-up

- Pause/resume có ảnh hưởng heartbeat không?

- Commit out-of-order khi parallel processing xử lý thế nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
- [Apache Kafka — Apache Kafka Consumer Rebalance Protocol](https://kafka.apache.org/43/operations/consumer-rebalance-protocol/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
