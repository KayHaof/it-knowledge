---
id: q-overload-controls
type: interview-question
technology: Performance
category: Performance
difficulty: senior
topics:
  - backpressure
  - load-shedding
  - concurrency-limit
relatedLessons:
  - overload-control-backpressure
sources:
  - title: Avoiding insurmountable queue backlogs
    url: https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/
    organization: Amazon Web Services
    type: vendor-documentation
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
    - id: backpressure
      required: true
      aliases:
        - backpressure
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: load-shedding
      required: true
      aliases:
        - load-shedding
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: concurrency-limit
      required: false
      aliases:
        - concurrency-limit
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần autoscale CPU hoặc queue thật lớn thì không phải từ chối request.
      penalty: 20
---

# Rate limit, concurrency limit và bounded queue khác nhau thế nào khi overload?

## Rubric

### Must Include

- backpressure

- load-shedding

### Strong Answer Includes

- concurrency-limit

## Câu trả lời 30 giây

Rate limit kiểm arrivals theo thời gian; concurrency limit bảo vệ số work đang giữ resource; bounded queue hấp thụ burst ngắn rồi phải có full policy. Backpressure chỉ hiệu lực nếu upstream tuân thủ; boundary ngoài kiểm soát cần reject/shed rõ.

## Câu trả lời chi tiết

Tôi đặt limiter gần scarce resource, truyền deadline và drop expired work. Shed sớm 429/503 hoặc degrade optional work tốt hơn timeout muộn. Retry có budget/jitter, autoscaling có delay và pool per Pod phải tôn trọng global DB capacity. Oldest queue age quan trọng hơn count đơn lẻ.

## Deep Dive

Rate 100/s vẫn tạo 1.000 in-flight nếu mỗi request giữ 10 s. Queue unbounded biến saturation thành memory/latency collapse.

## Góc nhìn Production

Test dependency slow, failover và recovery ramp; metric arrival/completion/shed/queue age cùng resource saturation.

## Trade-offs

Rate 100/s vẫn tạo 1.000 in-flight nếu mỗi request giữ 10 s. Queue unbounded biến saturation thành memory/latency collapse.

## Câu trả lời sai thường gặp

Chỉ cần autoscale CPU hoặc queue thật lớn thì không phải từ chối request.

## Follow-up

- 429 khác 503 theo contract?

- Cache outage tạo fallback storm ra sao?

## Nguồn chính thống

- [Amazon Web Services — Avoiding insurmountable queue backlogs](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/)
