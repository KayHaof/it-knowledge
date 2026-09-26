---
id: microservices-observability-correlation
type: interview-question
technology: Microservices
category: Microservices
difficulty: middle
topics:
  - logging
  - metrics
  - tracing
relatedLessons:
  - otel-context-propagation
sources:
  - title: OpenTelemetry context propagation
    url: https://opentelemetry.io/docs/concepts/context-propagation/
    organization: OpenTelemetry
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OpenTelemetry semantic conventions
    url: https://opentelemetry.io/docs/specs/semconv/
    organization: OpenTelemetry
    type: specification
    accessedAt: 2026-09-02
  - title: W3C Trace Context
    url: https://www.w3.org/TR/trace-context/
    organization: W3C
    type: standard
    accessedAt: 2026-09-02
  - title: Prometheus instrumentation practices
    url: https://prometheus.io/docs/practices/instrumentation/
    organization: Prometheus
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
    - id: logging
      required: true
      aliases:
        - logging
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: metrics
      required: true
      aliases:
        - metrics
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: tracing
      required: false
      aliases:
        - tracing
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần log một request ID ở gateway là có distributed tracing đầy đủ.
      penalty: 20
---

# Correlation ID và trace context khác nhau thế nào?

## Rubric

### Must Include

- logging

- metrics

### Strong Answer Includes

- tracing

## Câu trả lời 30 giây

Correlation ID là mã nghiệp vụ/request để tìm log; trace context mang trace/span và propagation chuẩn để dựng timing tree. Có thể liên kết cả hai nhưng không thay thế nhau.

## Câu trả lời chi tiết

HTTP headers và message metadata cần propagate context, tạo child span cho downstream và tránh trust header từ user nếu dùng cho security. Log structured kèm tenant/request id, metric low-cardinality. Sampling phải giữ error/slow traces.

## Góc nhìn Production

Kiểm mất context qua async boundary; redact PII và giới hạn cardinality.

## Trade-offs

HTTP headers và message metadata cần propagate context, tạo child span cho downstream và tránh trust header từ user nếu dùng cho security. Log structured kèm tenant/request id, metric low-cardinality. Sampling phải giữ error/slow traces.

## Câu trả lời sai thường gặp

Chỉ cần log một request ID ở gateway là có distributed tracing đầy đủ.

## Follow-up

- Trace context qua Kafka truyền thế nào?

- Metric label nào gây cardinality explosion?

## Nguồn chính thống

- [OpenTelemetry — OpenTelemetry context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)
- [OpenTelemetry — OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
- [W3C — W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [Prometheus — Prometheus instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)
