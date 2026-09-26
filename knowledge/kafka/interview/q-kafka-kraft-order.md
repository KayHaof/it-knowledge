---
id: q-kafka-kraft-order
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - KRaft
  - partition
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
    - id: kraft
      required: true
      aliases:
        - KRaft
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: partition
      required: true
      aliases:
        - partition
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
        - KRaft là consensus nên mọi message trong topic có một thứ tự toàn cục và thêm partition không ảnh hưởng key cũ.
      penalty: 20
---

# KRaft có làm Kafka bảo đảm global ordering cho topic không?

## Rubric

### Must Include

- KRaft

- partition

### Strong Answer Includes

- ordering

## Câu trả lời 30 giây

Không. KRaft quản metadata quorum và leader elections; records vẫn được ordered bằng offset trong từng partition. Không có total order xuyên partitions, và key/partition strategy xác định phạm vi ordering.

## Câu trả lời chi tiết

Controllers replicate cluster metadata; brokers giữ partition logs. Mỗi partition có leader/replicas và là đơn vị parallelism/consumer assignment. Cùng aggregate key thường route cùng partition, nhưng multi-producer causality, parallel processing và retry/DLQ vẫn có thể đảo completion. Tăng partition count có thể đổi key mapping của partitioner, nên history/new records cùng key có thể nằm ở hai partitions và ordering contract phải được migrate.

## Deep Dive

Mất controller majority là control-plane incident; thêm broker không chữa được. Hot key cũng không được chữa chỉ bằng thêm partitions vì một key vẫn route một lane.

## Góc nhìn Production

Pin Kafka/KRaft feature version, theo dõi metadata quorum, offline/under-replicated partitions và lag/skew per partition; bảo vệ cluster ID/storage formatting và canary reassignment.

## Trade-offs

Mất controller majority là control-plane incident; thêm broker không chữa được. Hot key cũng không được chữa chỉ bằng thêm partitions vì một key vẫn route một lane.

## Câu trả lời sai thường gặp

KRaft là consensus nên mọi message trong topic có một thứ tự toàn cục và thêm partition không ảnh hưởng key cũ.

## Follow-up

- Tăng partition ảnh hưởng consumer và key mapping thế nào?

- Controller quorum khác partition ISR ra sao?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka KRaft](https://kafka.apache.org/43/operations/kraft/)
- [Apache Kafka — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
- [Apache Kafka — Apache Kafka Producer Configs](https://kafka.apache.org/43/configuration/producer-configs/)
