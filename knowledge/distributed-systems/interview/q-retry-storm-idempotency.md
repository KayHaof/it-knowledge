---
id: q-retry-storm-idempotency
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - retry
  - idempotency
  - circuit-breaker
relatedLessons:
  - idempotency-retry-circuit-breaker
sources:
  - title: Retry with backoff pattern
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html
    organization: Amazon Web Services
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
    - id: retry
      required: true
      aliases:
        - retry
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: idempotency
      required: true
      aliases:
        - idempotency
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: circuit-breaker
      required: false
      aliases:
        - circuit-breaker
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Retry luôn tăng reliability và có thể cấu hình ở mọi client/proxy cho chắc.
      penalty: 20
---

# Tại sao retry có thể biến lỗi nhỏ thành outage lớn?

## Rubric

### Must Include

- retry

- idempotency

### Strong Answer Includes

- circuit-breaker

## Câu trả lời 30 giây

Nhiều tầng retry nhân số attempt đúng lúc dependency thiếu capacity, tăng queue/load và kéo dài recovery. Timeout không nói operation chưa commit, nên retry còn có thể lặp side effect.

## Câu trả lời chi tiết

Tôi phân loại transient/permanent/unknown, đặt deadline, exponential backoff với jitter, attempt và retry budget tại một owner. Admission/bulkhead bảo vệ capacity; circuit breaker giảm call vô ích nhưng half-open phải giới hạn. Mutation cần idempotency key và lưu kết quả đủ lâu cho retry window.

## Deep Dive

Nếu ba tầng cùng retry ba lần, một request có thể tạo tới 27 attempts. Backoff không thay thế load shedding.

## Góc nhìn Production

Đo attempts/original request, timeout layer, queue depth và recovery; chaos test dependency slow chứ không chỉ hard down.

## Trade-offs

Nếu ba tầng cùng retry ba lần, một request có thể tạo tới 27 attempts. Backoff không thay thế load shedding.

## Câu trả lời sai thường gặp

Retry luôn tăng reliability và có thể cấu hình ở mọi client/proxy cho chắc.

## Follow-up

- Jitter giải quyết đồng bộ retry ra sao?

- Circuit breaker khác rate limiter?

## Nguồn chính thống

- [Amazon Web Services — Retry with backoff pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)
