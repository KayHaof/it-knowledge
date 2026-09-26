---
id: kafka-consumer-poll-liveness
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - consumer
  - poll
  - max-poll
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
    - id: consumer
      required: true
      aliases:
        - consumer
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: poll
      required: true
      aliases:
        - poll
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: max-poll
      required: false
      aliases:
        - max-poll
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ heartbeat quyết định consumer sống nên handler có thể block bao lâu cũng được.
      penalty: 20
---

# Vì sao consumer xử lý batch lâu có thể bị kick khỏi group?

## Rubric

### Must Include

- consumer

- poll

### Strong Answer Includes

- max-poll

## Câu trả lời 30 giây

Consumer phải gọi `poll` trong `max.poll.interval.ms`; xử lý quá lâu làm coordinator xem member dead và rebalance. Tách fetch/process bounded hoặc tăng interval theo evidence, không chỉ tăng timeout vô hạn.

## Câu trả lời chi tiết

`max.poll.records` giới hạn batch trả về, còn heartbeat thread/`session.timeout` liveness khác poll interval. Slow handler giữ partition ownership nhưng không poll; rebalance làm duplicate/replay nếu offset chưa commit. Pause/resume, worker pool và per-record deadline cần giữ ordering/commit semantics.

## Góc nhìn Production

Đo poll gap, processing p99, rebalance count, lag và commit latency. Test poison/slow message và rolling deploy.

## Trade-offs

`max.poll.records` giới hạn batch trả về, còn heartbeat thread/`session.timeout` liveness khác poll interval. Slow handler giữ partition ownership nhưng không poll; rebalance làm duplicate/replay nếu offset chưa commit. Pause/resume, worker pool và per-record deadline cần giữ ordering/commit semantics.

## Câu trả lời sai thường gặp

Chỉ heartbeat quyết định consumer sống nên handler có thể block bao lâu cũng được.

## Follow-up

- max.poll.records chọn theo gì?

- Async processing commit offset an toàn thế nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
- [Apache Kafka — Apache Kafka Consumer Rebalance Protocol](https://kafka.apache.org/43/operations/consumer-rebalance-protocol/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
