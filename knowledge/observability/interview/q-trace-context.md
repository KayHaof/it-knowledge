---
id: q-trace-context
type: interview-question
technology: Observability
category: Observability
difficulty: senior
topics:
  - OpenTelemetry
  - trace-context
  - sampling
relatedLessons:
  - otel-context-propagation
sources:
  - title: OpenTelemetry context propagation
    url: https://opentelemetry.io/docs/concepts/context-propagation/
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
    - id: opentelemetry
      required: true
      aliases:
        - OpenTelemetry
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: trace-context
      required: true
      aliases:
        - trace-context
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: sampling
      required: false
      aliases:
        - sampling
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Trace ID là correlation duy nhất nên có thể dùng làm idempotency key và tenant identity.
      penalty: 20
---

# Có traceparent trong Kafka header đã đủ bảo đảm trace đầy đủ chưa?

## Rubric

### Must Include

- OpenTelemetry

- trace-context

### Strong Answer Includes

- sampling

## Câu trả lời 30 giây

Không. Producer phải inject, consumer extract và tạo span đúng lifecycle; async boundary có thể mất context. Sampling, exporter queue/drop và backend ingestion còn quyết định span có được lưu.

## Câu trả lời chi tiết

Tôi tách event ID cho business idempotency khỏi trace ID cho observability. Với batch/fan-out/retry có thể dùng span links thay parent chain sai nghĩa. Baggage phải allowlist, không chứa PII/secret; trace header từ external caller không phải authentication.

## Deep Dive

Head sampling rẻ nhưng bỏ lỗi cuối flow; tail sampling giữ error/slow trace tốt hơn nhưng cần collector buffer/capacity. Metric vẫn là nguồn SLI aggregate.

## Góc nhìn Production

Monitor dropped spans/export failures, cardinality/storage và integration-test propagation qua HTTP/executor/broker.

## Trade-offs

Head sampling rẻ nhưng bỏ lỗi cuối flow; tail sampling giữ error/slow trace tốt hơn nhưng cần collector buffer/capacity. Metric vẫn là nguồn SLI aggregate.

## Câu trả lời sai thường gặp

Trace ID là correlation duy nhất nên có thể dùng làm idempotency key và tenant identity.

## Follow-up

- Span link khác parent-child khi nào?

- Baggage và span attribute khác nhau ra sao?

## Nguồn chính thống

- [OpenTelemetry — OpenTelemetry context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)
