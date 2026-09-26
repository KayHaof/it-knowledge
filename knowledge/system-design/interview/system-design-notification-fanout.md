---
id: system-design-notification-fanout
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - notification
  - fan-out
  - preferences
relatedLessons:
  - system-design-notification
sources:
  - title: Apache Kafka design documentation
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Debezium Outbox Event Router
    url: https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html
    organization: Debezium
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis rate limiter pattern
    url: https://redis.io/docs/latest/develop/use-cases/rate-limiter/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: W3C Push API
    url: https://www.w3.org/TR/push-api/
    organization: W3C
    type: standard
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
    - id: notification
      required: true
      aliases:
        - notification
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fan-out
      required: true
      aliases:
        - fan-out
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: preferences
      required: false
      aliases:
        - preferences
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Gửi notification đồng bộ trong request transaction bảo đảm người dùng đã nhận.
      penalty: 20
---

# Thiết kế notification system đa kênh với retry và preference?

## Rubric

### Must Include

- notification

- fan-out

### Strong Answer Includes

- preferences

## Câu trả lời 30 giây

Ghi intent/event durable, worker fan-out theo user preference rồi gửi provider với idempotency key. Tách critical và best-effort channel, có DLQ và rate limit.

## Câu trả lời chi tiết

Template/version, locale, quiet hours và dedup policy nằm trong domain. Email/push/SMS provider có timeout/retry khác nhau; status delivery eventual và webhook có thể duplicate. Fan-out on write phù hợp recipient ít, on read/inbox phù hợp broadcast lớn.

## Góc nhìn Production

Đo queue age, provider error, delivery latency, bounce và cost; không log nội dung nhạy cảm.

## Trade-offs

Template/version, locale, quiet hours và dedup policy nằm trong domain. Email/push/SMS provider có timeout/retry khác nhau; status delivery eventual và webhook có thể duplicate. Fan-out on write phù hợp recipient ít, on read/inbox phù hợp broadcast lớn.

## Câu trả lời sai thường gặp

Gửi notification đồng bộ trong request transaction bảo đảm người dùng đã nhận.

## Follow-up

- Preference race với event xử lý sao?

- Broadcast triệu user chọn fan-out nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka design documentation](https://kafka.apache.org/43/design/design/)
- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
- [Redis — Redis rate limiter pattern](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)
- [W3C — W3C Push API](https://www.w3.org/TR/push-api/)
