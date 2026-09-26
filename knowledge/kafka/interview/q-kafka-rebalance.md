---
id: q-kafka-rebalance
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - consumer-group
  - rebalance
  - offset
relatedLessons:
  - kafka-broker-storage-replication
sources:
  - title: Kafka consumer configuration
    url: https://kafka.apache.org/43/configuration/consumer-configs/
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
    - id: consumer-group
      required: true
      aliases:
        - consumer-group
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: rebalance
      required: true
      aliases:
        - rebalance
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: offset
      required: false
      aliases:
        - offset
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Rebalance chỉ đổi metadata tức thì và không ảnh hưởng processing đang chạy.
      penalty: 20
---

# Điều gì xảy ra khi Kafka consumer rebalance và vì sao p99/lag có thể tăng?

## Rubric

### Must Include

- consumer-group

- rebalance

### Strong Answer Includes

- offset

## Câu trả lời 30 giây

Partitions bị revoke rồi assign lại giữa consumers; processing có thể tạm dừng và ownership đổi. In-flight record/offset xử lý sai có thể duplicate hoặc mất tiến độ, còn frequent rebalance làm lag và tail latency tăng.

## Câu trả lời chi tiết

Tôi tìm trigger như member join/leave, session/max-poll timeout hoặc partition change; xem duration/frequency, lag per partition và processing time. Handler revoke phải hoàn tất/commit theo delivery contract, task cần idempotent. Static/cooperative membership có thể giảm disruption nhưng không sửa consumer bị treo.

## Deep Dive

Nếu processing lâu hơn max poll interval, consumer có thể mất membership trong khi side effect vẫn chạy. Commit offset trước effect có risk loss; sau effect có risk duplicate.

## Góc nhìn Production

Alert rebalance rate/duration, max poll violation và skew; load test deploy rolling cùng poison/slow records.

## Trade-offs

Nếu processing lâu hơn max poll interval, consumer có thể mất membership trong khi side effect vẫn chạy. Commit offset trước effect có risk loss; sau effect có risk duplicate.

## Câu trả lời sai thường gặp

Rebalance chỉ đổi metadata tức thì và không ảnh hưởng processing đang chạy.

## Follow-up

- Consumer nhiều hơn partitions sẽ thế nào?

- Cooperative rebalance khác eager ở đâu?

## Nguồn chính thống

- [Apache Kafka — Kafka consumer configuration](https://kafka.apache.org/43/configuration/consumer-configs/)
