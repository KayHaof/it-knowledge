---
id: system-design-high-concurrency-api
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - concurrency
  - queueing
  - backpressure
relatedLessons:
  - system-design-method
sources:
  - title: AWS Well-Architected Framework
    url: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
    organization: Amazon Web Services
    type: vendor-documentation
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
    - id: concurrency
      required: true
      aliases:
        - concurrency
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: queueing
      required: true
      aliases:
        - queueing
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: backpressure
      required: false
      aliases:
        - backpressure
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Thêm instance app vô hạn sẽ hấp thụ mọi traffic dù database giữ nguyên capacity.
      penalty: 20
---

# Thiết kế high-concurrency API khi downstream có capacity thấp hơn traffic?

## Rubric

### Must Include

- concurrency

- queueing

### Strong Answer Includes

- backpressure

## Câu trả lời 30 giây

Giới hạn concurrency bằng queue/bulkhead, rate limit và load shedding; cache/read replica hoặc async job giảm work đồng bộ. Trả lỗi nhanh có chủ đích thay vì queue vô hạn.

## Câu trả lời chi tiết

Xác định bottleneck/arrival rate, deadline và priority; pool/connection limit bảo vệ DB. Queue durable cho work cần retry, nhưng user-facing request cần status/polling. Autoscale không thể vượt downstream invariant.

## Góc nhìn Production

Đo queue age, saturation, rejected/expired work và SLO burn; chaos test dependency slow.

## Trade-offs

Xác định bottleneck/arrival rate, deadline và priority; pool/connection limit bảo vệ DB. Queue durable cho work cần retry, nhưng user-facing request cần status/polling. Autoscale không thể vượt downstream invariant.

## Câu trả lời sai thường gặp

Thêm instance app vô hạn sẽ hấp thụ mọi traffic dù database giữ nguyên capacity.

## Follow-up

- Request nào shed trước?

- Async 202 API cần idempotency nào?

## Nguồn chính thống

- [Amazon Web Services — AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
