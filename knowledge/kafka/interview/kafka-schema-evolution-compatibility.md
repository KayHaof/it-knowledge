---
id: kafka-schema-evolution-compatibility
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - schema-registry
  - compatibility
  - events
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
    - id: schema-registry
      required: true
      aliases:
        - schema-registry
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
    - id: events
      required: false
      aliases:
        - events
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần version trong topic name thì mọi schema change đều tương thích.
      penalty: 20
---

# Schema event evolve backward/forward compatible nghĩa là gì?

## Rubric

### Must Include

- schema-registry

- compatibility

### Strong Answer Includes

- events

## Câu trả lời 30 giây

Backward compatible là consumer schema mới đọc data cũ; forward là consumer cũ đọc data mới trong giới hạn. Thêm optional field có default thường an toàn hơn rename/remove field.

## Câu trả lời chi tiết

Producer/consumer deploy độc lập nên compatibility policy ngăn breaking change. Avro/Protobuf/JSON schema có rule khác về field number, default và enum. Event versioning vẫn cần semantic contract, migration period và DLQ cho payload lỗi.

## Góc nhìn Production

Block incompatible schema ở CI/registry; metric deserialization failures theo producer version.

## Trade-offs

Producer/consumer deploy độc lập nên compatibility policy ngăn breaking change. Avro/Protobuf/JSON schema có rule khác về field number, default và enum. Event versioning vẫn cần semantic contract, migration period và DLQ cho payload lỗi.

## Câu trả lời sai thường gặp

Chỉ cần version trong topic name thì mọi schema change đều tương thích.

## Follow-up

- Khi nào tạo topic v2?

- Default field có ý nghĩa khi producer không gửi không?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
- [Apache Kafka — Apache Kafka Design - Delivery and Compaction](https://kafka.apache.org/43/design/design/)
