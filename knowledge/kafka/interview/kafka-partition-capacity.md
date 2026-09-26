---
id: kafka-partition-capacity
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - partition-count
  - capacity
  - reassignment
relatedLessons:
  - kafka-capacity-retention-operations
sources:
  - title: Apache Kafka Topic Configs
    url: https://kafka.apache.org/43/configuration/topic-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Hardware and OS
    url: https://kafka.apache.org/43/operations/hardware-and-os/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Monitoring
    url: https://kafka.apache.org/43/operations/monitoring/
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
    - id: partition-count
      required: true
      aliases:
        - partition-count
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: capacity
      required: true
      aliases:
        - capacity
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: reassignment
      required: false
      aliases:
        - reassignment
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Càng nhiều partition càng tốt vì Kafka gần như không có chi phí metadata/recovery.
      penalty: 20
---

# Bạn chọn partition count ban đầu bằng cách nào?

## Rubric

### Must Include

- partition-count

- capacity

### Strong Answer Includes

- reassignment

## Câu trả lời 30 giây

Tính throughput/partition, consumer parallelism, key skew, retention bytes và broker disk/network headroom, rồi thêm growth margin. Tăng partition sau có operational/reordering cost nên không chọn tùy tiện.

## Câu trả lời chi tiết

Partition là đơn vị leader, replica, file và consumer assignment; quá nhiều tăng metadata/recovery/rebalance overhead, quá ít giới hạn throughput/hot key. Producer batch/request size và broker I/O tạo capacity thực. Repartition/reassignment cần throttle để không làm p99 và ISR xấu.

## Góc nhìn Production

Load test sustained/burst, đo bytes/sec per partition, skew, recovery time và disk. Document expansion plan và partitioner version.

## Trade-offs

Partition là đơn vị leader, replica, file và consumer assignment; quá nhiều tăng metadata/recovery/rebalance overhead, quá ít giới hạn throughput/hot key. Producer batch/request size và broker I/O tạo capacity thực. Repartition/reassignment cần throttle để không làm p99 và ISR xấu.

## Câu trả lời sai thường gặp

Càng nhiều partition càng tốt vì Kafka gần như không có chi phí metadata/recovery.

## Follow-up

- Tăng partition ảnh hưởng key hash và ordering ra sao?

- Reassignment throttle chọn theo metric nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Topic Configs](https://kafka.apache.org/43/configuration/topic-configs/)
- [Apache Kafka — Apache Kafka Hardware and OS](https://kafka.apache.org/43/operations/hardware-and-os/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
