---
id: microservice-observability-correlation
type: interview-question
technology: Microservices
category: Microservices
difficulty: middle
topics:
  - tracing
  - correlation-id
  - metrics
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
    - id: tracing
      required: true
      aliases:
        - tracing
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: correlation-id
      required: true
      aliases:
        - correlation-id
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: metrics
      required: false
      aliases:
        - metrics
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ log một request ID ở gateway là đủ thay distributed tracing và metrics.
      penalty: 20
---

# Correlation ID và trace ID khác nhau trong hệ thống microservices?

## Rubric

### Must Include

- tracing

- correlation-id

### Strong Answer Includes

- metrics

## Câu trả lời 30 giây

Correlation ID là application identifier để nối business/request logs; trace ID thuộc tracing context có spans/timing và sampling. Một trace có thể chứa nhiều message hops, còn correlation có thể tồn tại qua workflow dài.

## Câu trả lời chi tiết

Propagate W3C trace context qua HTTP và message headers, nhưng không tin header client cho authorization. Log structured fields với tenant-safe IDs, metrics low-cardinality và span links cho async fan-out. Sampling có thể bỏ span nhưng business correlation vẫn cần lưu chọn lọc.

## Góc nhìn Production

Theo dõi missing/invalid context, trace completeness, cardinality và PII. Test proxy/header stripping và Kafka propagation.

## Trade-offs

Propagate W3C trace context qua HTTP và message headers, nhưng không tin header client cho authorization. Log structured fields với tenant-safe IDs, metrics low-cardinality và span links cho async fan-out. Sampling có thể bỏ span nhưng business correlation vẫn cần lưu chọn lọc.

## Câu trả lời sai thường gặp

Chỉ log một request ID ở gateway là đủ thay distributed tracing và metrics.

## Follow-up

- Async message nên link hay child span?

- Cardinality cao trong metrics gây hậu quả gì?

## Nguồn chính thống

- [OpenTelemetry — OpenTelemetry context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)
- [OpenTelemetry — OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
- [W3C — W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [Prometheus — Prometheus instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)
