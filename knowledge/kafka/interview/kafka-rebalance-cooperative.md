---
id: kafka-rebalance-cooperative
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - rebalance
  - cooperative
  - assignment
relatedLessons:
  - kafka-consumer-lag-rebalance-operations
sources:
  - title: Apache Kafka Consumer Configs
    url: https://kafka.apache.org/43/configuration/consumer-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Monitoring
    url: https://kafka.apache.org/43/operations/monitoring/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Consumer Rebalance Protocol
    url: https://kafka.apache.org/43/operations/consumer-rebalance-protocol/
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
    - id: rebalance
      required: true
      aliases:
        - rebalance
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: cooperative
      required: true
      aliases:
        - cooperative
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: assignment
      required: false
      aliases:
        - assignment
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Cooperative rebalance bảo đảm consumer không bao giờ dừng hoặc duplicate message.
      penalty: 20
---

# Cooperative rebalance giảm impact gì nhưng không loại bỏ mọi pause?

## Rubric

### Must Include

- rebalance

- cooperative

### Strong Answer Includes

- assignment

## Câu trả lời 30 giây

Cooperative assignor chuyển dần partition thay vì revoke tất cả, giảm stop-the-world processing. Member join/leave, slow poll và partition count vẫn có thể tạo reassignment/duplicate.

## Câu trả lời chi tiết

Eager protocol revoke toàn bộ rồi assign lại; cooperative-sticky cố giữ assignment và revoke subset qua nhiều round. Handler phải pause partition bị revoke và commit/finish work đúng. Static membership giảm churn khi restart nhanh nhưng stale member fencing/timeout vẫn cần.

## Góc nhìn Production

Theo dõi rebalance duration/count, assignment movement, lag spike và group coordinator. Test pod rollout, GC pause và network flap.

## Trade-offs

Eager protocol revoke toàn bộ rồi assign lại; cooperative-sticky cố giữ assignment và revoke subset qua nhiều round. Handler phải pause partition bị revoke và commit/finish work đúng. Static membership giảm churn khi restart nhanh nhưng stale member fencing/timeout vẫn cần.

## Câu trả lời sai thường gặp

Cooperative rebalance bảo đảm consumer không bao giờ dừng hoặc duplicate message.

## Follow-up

- Static membership giúp rollout thế nào?

- Partition revoke khi async task còn chạy xử lý ra sao?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
- [Apache Kafka — Apache Kafka Consumer Rebalance Protocol](https://kafka.apache.org/43/operations/consumer-rebalance-protocol/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
