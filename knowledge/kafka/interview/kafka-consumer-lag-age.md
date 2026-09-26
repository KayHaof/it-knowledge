---
id: kafka-consumer-lag-age
type: interview-question
technology: Kafka
category: Kafka
difficulty: senior
topics:
  - consumer-lag
  - backlog
  - SLO
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
    - id: consumer-lag
      required: true
      aliases:
        - consumer-lag
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: backlog
      required: true
      aliases:
        - backlog
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: slo
      required: false
      aliases:
        - SLO
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Lag count luôn phản ánh user impact chính xác hơn thời gian message chờ.
      penalty: 20
---

# Consumer lag nên đo bằng offset count hay age?

## Rubric

### Must Include

- consumer-lag

- backlog

### Strong Answer Includes

- SLO

## Câu trả lời 30 giây

Cả hai. Count cho biết backlog, còn age cho biết message cũ nhất chờ bao lâu và gần SLO hơn khi traffic thay đổi.

## Câu trả lời chi tiết

Lag count phụ thuộc ingest rate; cùng 10k record có thể vài giây hoặc nhiều giờ. Tôi theo dõi per-partition lag, oldest offset timestamp, processing rate và rebalance. Scale consumer chỉ hiệu quả tới partition count và phải kiểm downstream capacity.

## Góc nhìn Production

Alert age/error budget; phân biệt consumer chậm, producer burst và partition skew trước autoscale.

## Trade-offs

Lag count phụ thuộc ingest rate; cùng 10k record có thể vài giây hoặc nhiều giờ. Tôi theo dõi per-partition lag, oldest offset timestamp, processing rate và rebalance. Scale consumer chỉ hiệu quả tới partition count và phải kiểm downstream capacity.

## Câu trả lời sai thường gặp

Lag count luôn phản ánh user impact chính xác hơn thời gian message chờ.

## Follow-up

- Scale group vượt số partition có lợi không?

- Backlog drain time ước lượng thế nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Consumer Configs](https://kafka.apache.org/43/configuration/consumer-configs/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
- [Apache Kafka — Apache Kafka Consumer Rebalance Protocol](https://kafka.apache.org/43/operations/consumer-rebalance-protocol/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
