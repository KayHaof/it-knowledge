---
id: network-http-timeouts
type: interview-question
technology: Networking
category: Networking
difficulty: senior
topics:
  - timeouts
  - deadlines
  - retries
relatedLessons:
  - performance-diagnosis
sources:
  - title: OpenTelemetry signals
    url: https://opentelemetry.io/docs/concepts/signals/
    organization: OpenTelemetry
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
    - id: timeouts
      required: true
      aliases:
        - timeouts
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: deadlines
      required: true
      aliases:
        - deadlines
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: retries
      required: false
      aliases:
        - retries
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Read timeout lớn luôn an toàn vì request eventually complete.
      penalty: 20
---

# HTTP client nên tách những timeout nào?

## Rubric

### Must Include

- timeouts

- deadlines

### Strong Answer Includes

- retries

## Câu trả lời 30 giây

Tách pool-acquire, connect, TLS, response-header và read timeout; deadline tổng truyền xuống dependency. Timeout phải nằm trong caller budget và gắn retry policy.

## Câu trả lời chi tiết

Chỉ đặt read timeout có thể che pool starvation. Retry chỉ cho lỗi transient/idempotent với attempt budget và jitter; log phase/cause thay vì một timeout chung. Cancellation cần giải phóng connection.

## Góc nhìn Production

Metric timeout theo phase, deadline và retry amplification; kiểm end-to-end p99.

## Trade-offs

Chỉ đặt read timeout có thể che pool starvation. Retry chỉ cho lỗi transient/idempotent với attempt budget và jitter; log phase/cause thay vì một timeout chung. Cancellation cần giải phóng connection.

## Câu trả lời sai thường gặp

Read timeout lớn luôn an toàn vì request eventually complete.

## Follow-up

- Pool acquire timeout nên ngắn hơn connect không?

- Retry POST an toàn khi nào?

## Nguồn chính thống

- [OpenTelemetry — OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
