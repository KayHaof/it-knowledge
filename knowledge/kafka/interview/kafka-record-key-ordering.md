---
id: kafka-record-key-ordering
type: interview-question
technology: Kafka
category: Kafka
difficulty: junior
topics:
  - record-key
  - partition
  - ordering
relatedLessons:
  - kafka-delivery
sources:
  - title: Kafka documentation
    url: https://kafka.apache.org/documentation/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Kafka design
    url: https://kafka.apache.org/documentation/#design
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
    - id: record-key
      required: true
      aliases:
        - record-key
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
        - Kafka giữ thứ tự toàn topic bất kể số partition và key.
      penalty: 20
---

# Kafka key ảnh hưởng partition và ordering thế nào?

## Rubric

### Must Include

- record-key

- partition

### Strong Answer Includes

- ordering

## Câu trả lời 30 giây

Producer thường hash key để chọn partition; các record cùng key đi cùng partition và giữ thứ tự trong partition. Kafka không đảm bảo global ordering giữa nhiều partition.

## Câu trả lời chi tiết

Partition là đơn vị log/parallelism; đổi partition count hoặc partitioner có thể đổi mapping key. Nếu cần order theo aggregate, chọn stable key và xử lý cùng partition, nhưng hot key tạo skew. Consumer group chỉ có một active consumer cho mỗi partition tại thời điểm đó.

## Góc nhìn Production

Theo dõi partition skew, producer metadata và ordering invariant; không tăng partition tùy tiện.

## Trade-offs

Partition là đơn vị log/parallelism; đổi partition count hoặc partitioner có thể đổi mapping key. Nếu cần order theo aggregate, chọn stable key và xử lý cùng partition, nhưng hot key tạo skew. Consumer group chỉ có một active consumer cho mỗi partition tại thời điểm đó.

## Câu trả lời sai thường gặp

Kafka giữ thứ tự toàn topic bất kể số partition và key.

## Follow-up

- Hot partition xử lý thế nào?

- Tăng partition ảnh hưởng key mapping ra sao?

## Nguồn chính thống

- [Apache Kafka — Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Kafka design](https://kafka.apache.org/documentation/#design)
