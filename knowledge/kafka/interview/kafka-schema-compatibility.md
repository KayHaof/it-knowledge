---
id: kafka-schema-compatibility
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - schema-evolution
  - compatibility
  - registry
relatedLessons:
  - kafka-schema-dlq-replay
sources:
  - title: Apache Kafka Consumer Configs
    url: https://kafka.apache.org/43/configuration/consumer-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Basic Operations
    url: https://kafka.apache.org/43/operations/basic-kafka-operations/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Design - Delivery and Compaction
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
    - id: schema-evolution
      required: true
      aliases:
        - schema-evolution
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: compatibility
      required: true
      aliases:
        - compatibility
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: registry
      required: false
      aliases:
        - registry
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - JSON tự mô tả nên đổi bất kỳ field nào cũng backward compatible.
      penalty: 20
---

# Thêm field vào event có luôn backward compatible không?

## Rubric

### Must Include

- schema-evolution

- compatibility

### Strong Answer Includes

- registry

## Câu trả lời 30 giây

Thường additive optional field an toàn cho reader cũ nếu serializer/default đúng, nhưng semantics/required validation có thể phá. Compatibility phải kiểm producer/consumer và retained records.

## Câu trả lời chi tiết

Schema registry modes backward/forward/full định nghĩa hướng upgrade; field type change, enum removal, rename và default khác nhau. Consumer phải tolerate unknown field, producer phải đọc old schema trong rolling deploy. DLQ/replay cần schema version tương thích nhiều năm.

## Góc nhìn Production

CI contract-check schema, monitor deserialization errors và registry compatibility. Không đưa PII/schema breaking change mà không migration/replay plan.

## Trade-offs

Schema registry modes backward/forward/full định nghĩa hướng upgrade; field type change, enum removal, rename và default khác nhau. Consumer phải tolerate unknown field, producer phải đọc old schema trong rolling deploy. DLQ/replay cần schema version tương thích nhiều năm.

## Câu trả lời sai thường gặp

JSON tự mô tả nên đổi bất kỳ field nào cũng backward compatible.

## Follow-up

- Forward và backward compatibility khác nhau?

- Replay event cũ sau nhiều version xử lý ra sao?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
- [Apache Kafka — Apache Kafka Design - Delivery and Compaction](https://kafka.apache.org/43/design/design/)
