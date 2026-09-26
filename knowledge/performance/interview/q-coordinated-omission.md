---
id: q-coordinated-omission
type: interview-question
technology: Performance
category: Performance
difficulty: senior
topics:
  - load-testing
  - coordinated-omission
  - p99
relatedLessons:
  - load-testing-capacity-model
sources:
  - title: Prometheus histograms and summaries
    url: https://prometheus.io/docs/practices/histograms/
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
    - id: load-testing
      required: true
      aliases:
        - load-testing
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: coordinated-omission
      required: true
      aliases:
        - coordinated-omission
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: p99
      required: false
      aliases:
        - p99
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Nếu test giữ 1.000 concurrent users thì tự động đo đúng mọi arrival pattern và p99.
      penalty: 20
---

# Coordinated omission làm benchmark latency đẹp giả như thế nào?

## Rubric

### Must Include

- load-testing

- coordinated-omission

### Strong Answer Includes

- p99

## Câu trả lời 30 giây

Generator đợi response trước khi gửi request kế nên khi server pause, nó cũng ngừng arrivals và bỏ qua các requests đáng lẽ phải chờ. Histogram chỉ chứa ít sample chậm, làm tail thấp hơn trải nghiệm open traffic.

## Câu trả lời chi tiết

Tôi mô hình arrival production trước, dùng open schedule hoặc correction có assumptions, đo scheduled/sent/completed và cả client/server queue. Đồng thời theo dõi generator CPU/network để chắc nó không là bottleneck. Không average percentiles giữa instances; aggregate histogram đúng semantics.

## Deep Dive

Closed model vẫn đúng cho một số worker pull-next-task, nên vấn đề là mismatch workload chứ không phải mọi closed test đều sai.

## Góc nhìn Production

Version-control workload/data/cache state và giữ correctness/recovery checks; capacity là mức đạt SLO có headroom.

## Trade-offs

Closed model vẫn đúng cho một số worker pull-next-task, nên vấn đề là mismatch workload chứ không phải mọi closed test đều sai.

## Câu trả lời sai thường gặp

Nếu test giữ 1.000 concurrent users thì tự động đo đúng mọi arrival pattern và p99.

## Follow-up

- Open và closed model khác nhau?

- Little's Law dùng kiểm in-flight thế nào?

## Nguồn chính thống

- [Prometheus — Prometheus histograms and summaries](https://prometheus.io/docs/practices/histograms/)
