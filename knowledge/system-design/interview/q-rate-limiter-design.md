---
id: q-rate-limiter-design
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - rate-limiter
  - token-bucket
  - distributed
relatedLessons:
  - system-design-rate-limiter
sources:
  - title: HTTP 429 status
    url: https://www.rfc-editor.org/rfc/rfc6585.html
    organization: IETF
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
    - id: rate-limiter
      required: true
      aliases:
        - rate-limiter
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: token-bucket
      required: true
      aliases:
        - token-bucket
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: distributed
      required: false
      aliases:
        - distributed
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Một global counter reset mỗi phút là chính xác, công bằng và scale cho mọi API.
      penalty: 20
---

# Thiết kế rate limiter phân tán cần chốt những semantics nào trước thuật toán?

## Rubric

### Must Include

- rate-limiter

- token-bucket

### Strong Answer Includes

- distributed

## Câu trả lời 30 giây

Chốt identity/key, scope, burst và sustained rate, hard hay approximate, failure policy, multi-region và response contract. Token bucket/sliding window chỉ có nghĩa sau khi biết invariant và user impact.

## Câu trả lời chi tiết

Tôi đặt limiter gần điểm bảo vệ, canonicalize tenant/user/API key và dùng atomic update có TTL. Local limiter nhanh nhưng per-instance; centralized Redis nhất quán hơn trong region nhưng thêm latency/failure/hot key. Shard theo key, trả 429/Retry-After phù hợp và giữ separate concurrency limit cho slow work.

## Deep Dive

Rate limit đo arrival theo thời gian, concurrency limit đo in-flight resource. Clock/window boundary, retry và fail-open/closed ảnh hưởng fairness/capacity.

## Góc nhìn Production

Monitor allowed/rejected, store latency/error, hot keys và shadow mode trước enforce; admin/emergency bypass phải audit.

## Trade-offs

Rate limit đo arrival theo thời gian, concurrency limit đo in-flight resource. Clock/window boundary, retry và fail-open/closed ảnh hưởng fairness/capacity.

## Câu trả lời sai thường gặp

Một global counter reset mỗi phút là chính xác, công bằng và scale cho mọi API.

## Follow-up

- Token bucket khác leaky/sliding window?

- Limiter down nên fail-open hay fail-closed?

## Nguồn chính thống

- [IETF — HTTP 429 status](https://www.rfc-editor.org/rfc/rfc6585.html)
