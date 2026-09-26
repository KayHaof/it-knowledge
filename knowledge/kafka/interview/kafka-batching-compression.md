---
id: kafka-batching-compression
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - batching
  - compression
  - latency
relatedLessons:
  - kafka-producer-durability-batching
sources:
  - title: Apache Kafka Producer Configs
    url: https://kafka.apache.org/43/configuration/producer-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Producer API
    url: https://kafka.apache.org/43/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Design
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
    - id: batching
      required: true
      aliases:
        - batching
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: compression
      required: true
      aliases:
        - compression
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: latency
      required: false
      aliases:
        - latency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Tăng batch size/linger luôn giảm latency vì ít network request hơn.
      penalty: 20
---

# Batching và compression của Kafka producer trade-off gì?

## Rubric

### Must Include

- batching

- compression

### Strong Answer Includes

- latency

## Câu trả lời 30 giây

Batching tăng throughput và compression ratio, nhưng chờ linger/batch tạo latency và memory. Compression giảm network/disk nhưng tốn CPU; chọn theo payload, p99 và broker capacity.

## Câu trả lời chi tiết

Producer accumulator gom record theo partition; `linger.ms`, batch.size và compression.type tương tác. Batch đầy sớm có thể không bị linger; broker decompress/recompress? Kafka thường lưu compressed batch. Message size limits phải đồng bộ producer/broker/consumer.

## Góc nhìn Production

Đo batch size, compression ratio, bufferpool wait, produce p99, CPU và request rate. Load test burst/small messages và broker disk.

## Trade-offs

Producer accumulator gom record theo partition; `linger.ms`, batch.size và compression.type tương tác. Batch đầy sớm có thể không bị linger; broker decompress/recompress? Kafka thường lưu compressed batch. Message size limits phải đồng bộ producer/broker/consumer.

## Câu trả lời sai thường gặp

Tăng batch size/linger luôn giảm latency vì ít network request hơn.

## Follow-up

- Buffer memory full phản ứng thế nào?

- Compression codec chọn theo dữ liệu hay CPU?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Producer Configs](https://kafka.apache.org/43/configuration/producer-configs/)
- [Apache Kafka — Apache Kafka Producer API](https://kafka.apache.org/43/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html)
- [Apache Kafka — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
