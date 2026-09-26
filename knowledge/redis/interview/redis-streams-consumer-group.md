---
id: redis-streams-consumer-group
type: interview-question
technology: Redis
category: Redis
difficulty: middle
topics:
  - Streams
  - consumer-group
  - pending
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
    - id: streams
      required: true
      aliases:
        - Streams
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: consumer-group
      required: true
      aliases:
        - consumer-group
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: pending
      required: false
      aliases:
        - pending
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - XACK xóa message ngay và consumer group bảo đảm exactly-once xử lý.
      penalty: 20
---

# Redis Streams consumer group xử lý pending entry và ack như thế nào?

## Rubric

### Must Include

- Streams

- consumer-group

### Strong Answer Includes

- pending

## Câu trả lời 30 giây

Consumer đọc qua group, message vào Pending Entries List và chỉ được hoàn tất khi `XACK`. Consumer chết có thể để pending; consumer khác claim sau idle threshold, nhưng handler phải idempotent.

## Câu trả lời chi tiết

`XREADGROUP` cấp entry cho consumer; `XACK` chỉ cập nhật delivery tracking, không xóa stream entry—retention/XTRIM riêng. `XPENDING`/`XAUTOCLAIM` hỗ trợ recovery, nhưng claim trong lúc worker cũ còn chạy tạo duplicate. ID, retry count và dead-letter policy cần lưu rõ.

## Góc nhìn Production

Theo dõi pending age/count, delivery attempts, stream length, trim lag và consumer idle. Test crash giữa side effect và ack.

## Trade-offs

`XREADGROUP` cấp entry cho consumer; `XACK` chỉ cập nhật delivery tracking, không xóa stream entry—retention/XTRIM riêng. `XPENDING`/`XAUTOCLAIM` hỗ trợ recovery, nhưng claim trong lúc worker cũ còn chạy tạo duplicate. ID, retry count và dead-letter policy cần lưu rõ.

## Câu trả lời sai thường gặp

XACK xóa message ngay và consumer group bảo đảm exactly-once xử lý.

## Follow-up

- Claim stale entry có race nào?

- XTRIM ảnh hưởng consumer chậm ra sao?

## Nguồn chính thống

- [Redis — Redis Pub/Sub](https://redis.io/docs/latest/develop/pubsub/)
- [Redis — Redis XADD Command](https://redis.io/docs/latest/commands/xadd/)
- [Redis — Redis XREADGROUP Command](https://redis.io/docs/latest/commands/xreadgroup/)
- [Redis — Redis XAUTOCLAIM Command](https://redis.io/docs/latest/commands/xautoclaim/)
