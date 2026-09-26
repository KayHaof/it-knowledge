---
id: q-cache-decision
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - cache
  - trade-off
  - failure
relatedLessons:
  - technology-decision-evidence
sources:
  - title: Redis cache-aside
    url: https://redis.io/docs/latest/develop/use-cases/cache-aside/
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
    - id: cache
      required: true
      aliases:
        - cache
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: trade-off
      required: true
      aliases:
        - trade-off
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: failure
      required: false
      aliases:
        - failure
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Caching luôn làm nhanh hơn và nếu hỏng chỉ cần chuyển toàn traffic về database.
      penalty: 20
---

# Bạn quyết định có thêm cache hay không bằng evidence nào?

## Rubric

### Must Include

- cache

- trade-off

### Strong Answer Includes

- failure

## Câu trả lời 30 giây

Tôi chứng minh read hot/source bottleneck, định nghĩa stale tolerance, key/cardinality, invalidation và failure path. Sửa query/index trước nếu đủ; cache chỉ đáng thêm khi latency/load gain lớn hơn consistency và operations cost.

## Câu trả lời chi tiết

Prototype với data/traffic đại diện, đo hit ratio, p99, DB CPU/IO, value size và stampede. Chọn cache-aside/read-through theo ownership, TTL+jitter, request coalescing và version/invalidation. Khi Redis down phải có timeout/admission để fallback không giết DB; sensitive data cần isolation/encryption policy.

## Deep Dive

Cache correctness là distributed state problem: DB commit và invalidation không atomic. Không có TTL phổ quát; contract phải nói stale data chấp nhận ở flow nào.

## Góc nhìn Production

Alert hit ratio cùng origin load, eviction, hot/big key và degraded drill; ghi exit criteria khi cache không còn tạo giá trị.

## Trade-offs

Cache correctness là distributed state problem: DB commit và invalidation không atomic. Không có TTL phổ quát; contract phải nói stale data chấp nhận ở flow nào.

## Câu trả lời sai thường gặp

Caching luôn làm nhanh hơn và nếu hỏng chỉ cần chuyển toàn traffic về database.

## Follow-up

- Stampede khác avalanche?

- Negative cache có rủi ro gì?

## Nguồn chính thống

- [Redis — Redis cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)
