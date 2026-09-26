---
id: q-news-feed-fanout
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - news-feed
  - fan-out
  - ranking
relatedLessons:
  - system-design-news-feed
sources:
  - title: Redis sorted sets
    url: https://redis.io/docs/latest/develop/data-types/sorted-sets/
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
    - id: news-feed
      required: true
      aliases:
        - news-feed
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
    - id: ranking
      required: false
      aliases:
        - ranking
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Fan-out-on-write luôn tốt vì mọi read O(1), chỉ cần Kafka scale consumers.
      penalty: 20
---

# Bạn chọn fan-out-on-write hay fan-out-on-read cho news feed?

## Rubric

### Must Include

- news-feed

- fan-out

### Strong Answer Includes

- ranking

## Câu trả lời 30 giây

Tôi dùng follower distribution và active ratio, không chọn một phía tuyệt đối. Write fan-out cho read nhanh nhưng write amplification/celebrity burst; read fan-out giảm write nhưng merge/rank đắt. Hybrid thường push author thường và pull/merge celebrity lúc đọc.

## Câu trả lời chi tiết

Post/follow/privacy là source; timeline là projection idempotent có checkpoint/rebuild. Cursor dùng stable sort tuple và rank version; read path enforce privacy cuối vì projection lag. Celebrity fan-out chunk/throttle, cache failure bounded và delete dùng tombstone/version để replay không resurrect data.

## Deep Dive

Threshold celebrity đến từ cost distribution và cần hysteresis. Read-your-own overlay che fan-out lag cho tác giả mà không hứa global consistency.

## Góc nhìn Production

Đo create-to-visible, queue age, candidate/filter counts, duplicate/empty rate, cache-origin load và privacy deletion SLA.

## Trade-offs

Threshold celebrity đến từ cost distribution và cần hysteresis. Read-your-own overlay che fan-out lag cho tác giả mà không hứa global consistency.

## Câu trả lời sai thường gặp

Fan-out-on-write luôn tốt vì mọi read O(1), chỉ cần Kafka scale consumers.

## Follow-up

- Cursor ổn định khi ranking đổi thế nào?

- Rebuild projection không tranh live traffic ra sao?

## Nguồn chính thống

- [Redis — Redis sorted sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/)
