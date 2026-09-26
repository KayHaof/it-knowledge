---
id: project-experience-incident-story
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: senior
topics:
  - STAR
  - incident
  - learning
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
    - id: star
      required: true
      aliases:
        - STAR
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: incident
      required: true
      aliases:
        - incident
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: learning
      required: false
      aliases:
        - learning
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Incident tốt là chứng minh ai viết code lỗi và restart service thành công.
      penalty: 20
---

# Kể một incident kỹ thuật theo STAR mà vẫn thể hiện learning thay vì đổ lỗi?

## Rubric

### Must Include

- STAR

- incident

### Strong Answer Includes

- learning

## Câu trả lời 30 giây

Tôi nêu Situation/Task, evidence và impact; Action có mitigation trước rồi root cause/fix; Result dùng metric và Follow-up nói control mới. Tôi tách sự thật, giả định và điều chưa biết.

## Câu trả lời chi tiết

Timeline nên có detection, decision, communication, rollback/recovery và customer impact. Root cause thường là điều kiện hệ thống, không chỉ tên người; thêm test/alert/runbook để giảm recurrence. Không tiết lộ dữ liệu khách hàng hoặc claim metric không có nguồn.

## Góc nhìn Production

Bao gồm owner, deadline và verification sau fix; postmortem blameless nhưng accountability rõ.

## Trade-offs

Timeline nên có detection, decision, communication, rollback/recovery và customer impact. Root cause thường là điều kiện hệ thống, không chỉ tên người; thêm test/alert/runbook để giảm recurrence. Không tiết lộ dữ liệu khách hàng hoặc claim metric không có nguồn.

## Câu trả lời sai thường gặp

Incident tốt là chứng minh ai viết code lỗi và restart service thành công.

## Follow-up

- Nếu root cause chưa chắc thì nói gì?

- Làm sao đo fix không tái diễn?

## Nguồn chính thống

- [OpenTelemetry — OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry — OpenTelemetry logs](https://opentelemetry.io/docs/concepts/signals/logs/)
- [OpenTelemetry — OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
- [Prometheus — Prometheus instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)
- [Grafana Labs — Grafana Alerting best practices](https://grafana.com/docs/grafana/latest/alerting/best-practices/)
