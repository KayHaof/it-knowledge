---
id: redis-pubsub-vs-streams
type: interview-question
technology: Redis
category: Redis
difficulty: middle
topics:
  - Pub/Sub
  - Streams
  - consumer-group
relatedLessons:
  - redis-streams-pubsub
sources:
  - title: Redis Pub/Sub
    url: https://redis.io/docs/latest/develop/pubsub/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis XADD Command
    url: https://redis.io/docs/latest/commands/xadd/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis XREADGROUP Command
    url: https://redis.io/docs/latest/commands/xreadgroup/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis XAUTOCLAIM Command
    url: https://redis.io/docs/latest/commands/xautoclaim/
    organization: Redis
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
    - id: pub-sub
      required: true
      aliases:
        - Pub/Sub
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: streams
      required: true
      aliases:
        - Streams
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: consumer-group
      required: false
      aliases:
        - consumer-group
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Pub/Sub lưu mọi message để subscriber kết nối lại đọc bù như queue durable.
      penalty: 20
---

# Khi nào chọn Pub/Sub và khi nào chọn Redis Streams?

## Rubric

### Must Include

- Pub/Sub

- Streams

### Strong Answer Includes

- consumer-group

## Câu trả lời 30 giây

Pub/Sub phù hợp broadcast ephemeral; subscriber offline sẽ mất message. Streams lưu message, có ID, consumer group, pending entries và replay/ack nên phù hợp workflow cần durability.

## Câu trả lời chi tiết

Pub/Sub đơn giản nhưng không backpressure hoặc consumer offset. Streams cần trimming, pending recovery và idempotent processing; nó vẫn có throughput/retention giới hạn khác Kafka. Chọn theo durability, fan-out, replay và operational ownership.

## Góc nhìn Production

Alert pending age/stream length và consumer idle; thiết kế dead-letter/retry.

## Trade-offs

Pub/Sub đơn giản nhưng không backpressure hoặc consumer offset. Streams cần trimming, pending recovery và idempotent processing; nó vẫn có throughput/retention giới hạn khác Kafka. Chọn theo durability, fan-out, replay và operational ownership.

## Câu trả lời sai thường gặp

Pub/Sub lưu mọi message để subscriber kết nối lại đọc bù như queue durable.

## Follow-up

- XACK và pending entry xử lý ra sao?

- Khi nào Redis Streams không thay Kafka?

## Nguồn chính thống

- [Redis — Redis Pub/Sub](https://redis.io/docs/latest/develop/pubsub/)
- [Redis — Redis XADD Command](https://redis.io/docs/latest/commands/xadd/)
- [Redis — Redis XREADGROUP Command](https://redis.io/docs/latest/commands/xreadgroup/)
- [Redis — Redis XAUTOCLAIM Command](https://redis.io/docs/latest/commands/xautoclaim/)
