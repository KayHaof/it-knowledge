---
id: redis-pubsub-loss
type: interview-question
technology: Redis
category: Redis
difficulty: junior
topics:
  - Pub/Sub
  - replay
  - delivery
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
    - id: replay
      required: true
      aliases:
        - replay
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: delivery
      required: false
      aliases:
        - delivery
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis giữ Pub/Sub message tới khi mọi subscriber xác nhận nên delivery là at-least-once.
      penalty: 20
---

# Vì sao Redis Pub/Sub không phù hợp làm durable event log?

## Rubric

### Must Include

- Pub/Sub

- replay

### Strong Answer Includes

- delivery

## Câu trả lời 30 giây

Pub/Sub chỉ gửi tới subscriber đang online; message không được lưu để replay hoặc ack. Nó phù hợp notification ephemeral, còn durable workflow cần Streams, Kafka hoặc database-backed outbox.

## Câu trả lời chi tiết

Subscriber disconnect/mạng chậm sẽ mất event, và fan-out không có consumer offset. Retry ở application có thể duplicate mà không biết event cũ. Redis Streams thêm retention, ID, group/pending nhưng vẫn phải thiết kế trim/backpressure.

## Góc nhìn Production

Monitor subscriber count, publish rate và disconnect; không dùng Pub/Sub cho payment/audit. Có fallback hoặc reconciliation khi notification mất.

## Trade-offs

Subscriber disconnect/mạng chậm sẽ mất event, và fan-out không có consumer offset. Retry ở application có thể duplicate mà không biết event cũ. Redis Streams thêm retention, ID, group/pending nhưng vẫn phải thiết kế trim/backpressure.

## Câu trả lời sai thường gặp

Redis giữ Pub/Sub message tới khi mọi subscriber xác nhận nên delivery là at-least-once.

## Follow-up

- Khi nào Pub/Sub đủ?

- Streams retention nên giới hạn bằng gì?

## Nguồn chính thống

- [Redis — Redis Pub/Sub](https://redis.io/docs/latest/develop/pubsub/)
- [Redis — Redis XADD Command](https://redis.io/docs/latest/commands/xadd/)
- [Redis — Redis XREADGROUP Command](https://redis.io/docs/latest/commands/xreadgroup/)
- [Redis — Redis XAUTOCLAIM Command](https://redis.io/docs/latest/commands/xautoclaim/)
