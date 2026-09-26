---
id: kafka-key-partition-order
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - keys
  - partitioner
  - ordering
relatedLessons:
  - kafka-kraft-partitions-ordering
sources:
  - title: Apache Kafka KRaft
    url: https://kafka.apache.org/43/operations/kraft/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Design
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Basic Operations
    url: https://kafka.apache.org/43/operations/basic-kafka-operations/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Producer Configs
    url: https://kafka.apache.org/43/configuration/producer-configs/
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
    - id: keys
      required: true
      aliases:
        - keys
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: partitioner
      required: true
      aliases:
        - partitioner
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ordering
      required: false
      aliases:
        - ordering
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần set key là Kafka bảo đảm global ordering cho mọi record trong topic.
      penalty: 20
---

# Kafka key giúp giữ ordering cho aggregate như thế nào?

## Rubric

### Must Include

- keys

- partitioner

### Strong Answer Includes

- ordering

## Câu trả lời 30 giây

Record cùng key thường được gửi cùng partition, nên offset order trong aggregate được giữ. Ordering chỉ trong partition; thay partition count/partitioner có thể đổi mapping cho record mới.

## Câu trả lời chi tiết

Partitioner hash key và partition count tạo lane. Null key dùng sticky/round-robin behavior tùy producer. Retry, multiple producers và consumer parallel processing có thể làm completion order khác append order. Key skew tạo hot partition nên key design cân bằng giữa locality và throughput.

## Góc nhìn Production

Theo dõi partition distribution, hot key/lag và reassignment. Khi tăng partition, version/migrate key mapping và kiểm ordering contract.

## Trade-offs

Partitioner hash key và partition count tạo lane. Null key dùng sticky/round-robin behavior tùy producer. Retry, multiple producers và consumer parallel processing có thể làm completion order khác append order. Key skew tạo hot partition nên key design cân bằng giữa locality và throughput.

## Câu trả lời sai thường gặp

Chỉ cần set key là Kafka bảo đảm global ordering cho mọi record trong topic.

## Follow-up

- Tăng partition phá ordering nào?

- Hot key xử lý bằng cách nào nếu aggregate cần thứ tự?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka KRaft](https://kafka.apache.org/43/operations/kraft/)
- [Apache Kafka — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
- [Apache Kafka — Apache Kafka Producer Configs](https://kafka.apache.org/43/configuration/producer-configs/)
