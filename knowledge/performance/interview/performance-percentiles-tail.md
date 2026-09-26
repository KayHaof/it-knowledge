---
id: performance-percentiles-tail
type: interview-question
technology: Performance
category: Performance
difficulty: junior
topics:
  - p50
  - p95
  - p99
  - latency
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
    - id: p50
      required: true
      aliases:
        - p50
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: p95
      required: true
      aliases:
        - p95
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: p99
      required: false
      aliases:
        - p99
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: latency
      required: false
      aliases:
        - latency
      points:
        technicalCorrectness: 10
        completeness: 5
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Average thấp nghĩa mọi user đều có latency tốt.
      penalty: 20
---

# Vì sao p99 quan trọng hơn average cho API?

## Rubric

### Must Include

- p50

- p95

### Strong Answer Includes

- p99

- latency

## Câu trả lời 30 giây

Average che khuất tail; p99 phản ánh request chậm do queue, GC, lock hoặc downstream. SLO cần percentile và window rõ.

## Câu trả lời chi tiết

Fan-out làm tail compound và percentile không thể cộng đơn giản giữa service. Histogram cần bucket đủ và sample đại diện; xem cùng error/throughput/trace. P50 tốt nhưng p99 xấu vẫn làm user timeout.

## Góc nhìn Production

Alert burn rate theo SLO và phân đoạn route/tenant.

## Trade-offs

Fan-out làm tail compound và percentile không thể cộng đơn giản giữa service. Histogram cần bucket đủ và sample đại diện; xem cùng error/throughput/trace. P50 tốt nhưng p99 xấu vẫn làm user timeout.

## Câu trả lời sai thường gặp

Average thấp nghĩa mọi user đều có latency tốt.

## Follow-up

- Fan-out ảnh hưởng p99 thế nào?

- Histogram và summary khác gì?

## Nguồn chính thống

- [OpenTelemetry — OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
