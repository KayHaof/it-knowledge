---
id: q-p99-diagnosis
type: interview-question
technology: Performance
category: Performance
difficulty: senior
topics:
  - p99
  - queueing
  - profiling
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
    - id: p99
      required: true
      aliases:
        - p99
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
    - id: profiling
      required: false
      aliases:
        - profiling
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CPU dưới 100% nghĩa hệ thống không có bottleneck nên chỉ cần tăng timeout.
      penalty: 20
---

# Bạn chẩn đoán p99 tăng nhưng CPU trung bình chỉ 35% như thế nào?

## Rubric

### Must Include

- p99

- queueing

### Strong Answer Includes

- profiling

## Câu trả lời 30 giây

CPU trung bình không loại trừ queue, lock, throttling, GC, downstream tail hoặc một core/partition nóng. Tôi tách queue time và service time theo trace, xem saturation/error/latency theo endpoint/version/instance trên cùng timeline.

## Câu trả lời chi tiết

Chốt cửa sổ và traffic shape, so p50/p95/p99, deploy/config, in-flight, pool wait, DB locks/query, GC/allocation và CPU throttled periods. Lập giả thuyết rồi profile/query plan có kiểm soát; thay một biến và replay workload representative. Không average away hot shard hoặc coordinated omission.

## Deep Dive

Tail có thể khuếch đại qua fan-out: request chờ nhánh chậm nhất. Retry/hedging chỉ dùng với idempotency và budget vì có thể tăng load.

## Góc nhìn Production

Có load shedding, timeout budget và telemetry đủ cardinality nhưng không explosion; verify error/cost sau fix.

## Trade-offs

Tail có thể khuếch đại qua fan-out: request chờ nhánh chậm nhất. Retry/hedging chỉ dùng với idempotency và budget vì có thể tăng load.

## Câu trả lời sai thường gặp

CPU dưới 100% nghĩa hệ thống không có bottleneck nên chỉ cần tăng timeout.

## Follow-up

- Coordinated omission là gì?

- Little's Law giúp kiểm queue ra sao?

## Nguồn chính thống

- [OpenTelemetry — OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
