---
id: kafka-ordering-retry
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - ordering
  - retry
  - partition
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
    - id: ordering
      required: true
      aliases:
        - ordering
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: retry
      required: true
      aliases:
        - retry
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
        - Kafka giữ offset nên message retry luôn quay lại đúng vị trí trước khi message sau được xử lý.
      penalty: 20
---

# Retry topic hoặc DLQ có thể phá ordering của một aggregate như thế nào?

## Rubric

### Must Include

- ordering

- retry

### Strong Answer Includes

- partition

## Câu trả lời 30 giây

Message B có thể xử lý trước A nếu A retry sang topic khác hoặc consumer song song. Ordering contract cần giữ key/sequence, pause partition hoặc state version để từ chối out-of-order.

## Câu trả lời chi tiết

Partition append order chỉ đảm bảo fetch sequence; retry delay tạo completion reorder. Retry topic cùng partition key vẫn có lane khác và merge consumer không tự khôi phục. Có thể block partition cho A, dùng retry scheduler per key, hoặc chấp nhận eventual order với version predicate.

## Góc nhìn Production

Theo dõi out-of-order rejects, retry age, key skew và business compensation. Test poison A rồi valid B, restart và replay.

## Trade-offs

Partition append order chỉ đảm bảo fetch sequence; retry delay tạo completion reorder. Retry topic cùng partition key vẫn có lane khác và merge consumer không tự khôi phục. Có thể block partition cho A, dùng retry scheduler per key, hoặc chấp nhận eventual order với version predicate.

## Câu trả lời sai thường gặp

Kafka giữ offset nên message retry luôn quay lại đúng vị trí trước khi message sau được xử lý.

## Follow-up

- Pause partition có gây lag cascade không?

- Version predicate bảo vệ aggregate thế nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
- [Apache Kafka — Apache Kafka Design - Delivery and Compaction](https://kafka.apache.org/43/design/design/)
