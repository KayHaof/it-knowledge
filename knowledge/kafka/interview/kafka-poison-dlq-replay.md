---
id: kafka-poison-dlq-replay
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - DLQ
  - poison-message
  - replay
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
    - id: dlq
      required: true
      aliases:
        - DLQ
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: poison-message
      required: true
      aliases:
        - poison-message
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: replay
      required: false
      aliases:
        - replay
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đẩy message lỗi sang DLQ là xong vì Kafka đảm bảo nó sẽ tự quay lại khi consumer khỏe.
      penalty: 20
---

# DLQ cho poison message cần metadata và quy trình nào để không thành nơi chôn lỗi?

## Rubric

### Must Include

- DLQ

- poison-message

### Strong Answer Includes

- replay

## Câu trả lời 30 giây

Lưu original topic/partition/offset, error class, attempts, schema và correlation; có owner, retention, alert, fix/replay tool và dedupe. Chuyển DLQ không đồng nghĩa business outcome đã xử lý.

## Câu trả lời chi tiết

Phân biệt transient retry/backoff với permanent validation/security error. Replay sau fix phải giữ ordering/side-effect idempotency và không flood production; có filter/rate limit/canary. Poison message có thể block partition nếu không isolate, nhưng bỏ qua mù làm mất invariant.

## Góc nhìn Production

Theo dõi DLQ age/count, replay throughput, unresolved categories và consumer lag. Drill schema rollback, dependency outage và duplicate replay.

## Trade-offs

Phân biệt transient retry/backoff với permanent validation/security error. Replay sau fix phải giữ ordering/side-effect idempotency và không flood production; có filter/rate limit/canary. Poison message có thể block partition nếu không isolate, nhưng bỏ qua mù làm mất invariant.

## Câu trả lời sai thường gặp

Đẩy message lỗi sang DLQ là xong vì Kafka đảm bảo nó sẽ tự quay lại khi consumer khỏe.

## Follow-up

- Replay cùng partition có giữ ordering không?

- Khi nào skip message thay vì retry?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
- [Apache Kafka — Apache Kafka Design - Delivery and Compaction](https://kafka.apache.org/43/design/design/)
