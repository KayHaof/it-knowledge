---
id: system-design-logging-platform
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - logs
  - ingestion
  - retention
relatedLessons:
  - observability
sources:
  - title: OpenTelemetry signals
    url: https://opentelemetry.io/docs/concepts/signals/
    organization: OpenTelemetry
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OpenTelemetry logs
    url: https://opentelemetry.io/docs/concepts/signals/logs/
    organization: OpenTelemetry
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OpenTelemetry semantic conventions
    url: https://opentelemetry.io/docs/specs/semconv/
    organization: OpenTelemetry
    type: specification
    accessedAt: 2026-09-02
  - title: Prometheus instrumentation practices
    url: https://prometheus.io/docs/practices/instrumentation/
    organization: Prometheus
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Grafana Alerting best practices
    url: https://grafana.com/docs/grafana/latest/alerting/best-practices/
    organization: Grafana Labs
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
    - id: logs
      required: true
      aliases:
        - logs
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: ingestion
      required: true
      aliases:
        - ingestion
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: retention
      required: false
      aliases:
        - retention
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Giữ mọi log vô thời hạn và retry vô hạn là observability tốt nhất.
      penalty: 20
---

# Thiết kế logging platform không để telemetry làm sập ứng dụng?

## Rubric

### Must Include

- logs

- ingestion

### Strong Answer Includes

- retention

## Câu trả lời 30 giây

Agent/collector dùng bounded buffer và non-blocking export; pipeline batch, sample/drop theo policy và lưu hot/cold tier. Business request không chờ backend log vô hạn.

## Câu trả lời chi tiết

Structured log schema, tenant isolation, cardinality và PII redaction từ edge. Kafka/object storage/search index có retention khác nhau; backpressure và quota bảo vệ noisy tenant. Query index async, correlation với trace nhưng không nhúng secret.

## Góc nhìn Production

Đo dropped logs, queue age, exporter failure, storage cost và query latency.

## Trade-offs

Structured log schema, tenant isolation, cardinality và PII redaction từ edge. Kafka/object storage/search index có retention khác nhau; backpressure và quota bảo vệ noisy tenant. Query index async, correlation với trace nhưng không nhúng secret.

## Câu trả lời sai thường gặp

Giữ mọi log vô thời hạn và retry vô hạn là observability tốt nhất.

## Follow-up

- Sampling error/slow trace chọn thế nào?

- Collector down xử lý buffer ra sao?

## Nguồn chính thống

- [OpenTelemetry — OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry — OpenTelemetry logs](https://opentelemetry.io/docs/concepts/signals/logs/)
- [OpenTelemetry — OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
- [Prometheus — Prometheus instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)
- [Grafana Labs — Grafana Alerting best practices](https://grafana.com/docs/grafana/latest/alerting/best-practices/)
