---
id: performance-backpressure-loadshedding
type: interview-question
technology: Performance
category: Performance
difficulty: senior
topics:
  - backpressure
  - load-shedding
  - overload
relatedLessons:
  - overload-control-backpressure
sources:
  - title: Avoiding insurmountable queue backlogs
    url: https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Timeouts, retries and backoff with jitter
    url: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Kubernetes Horizontal Pod Autoscaling
    url: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring WebFlux reactive core
    url: https://docs.spring.io/spring-framework/reference/web/webflux/reactive-spring.html
    organization: Spring
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
    - id: overload
      required: false
      aliases:
        - overload
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Queue vô hạn là backpressure tốt vì không mất dữ liệu.
      penalty: 20
---

# Backpressure và load shedding bảo vệ hệ thống quá tải thế nào?

## Rubric

### Must Include

- backpressure

- load-shedding

### Strong Answer Includes

- overload

## Câu trả lời 30 giây

Backpressure làm producer chậm theo capacity consumer; load shedding chủ động từ chối work ít giá trị để giữ SLO quan trọng. Cả hai cần queue bound và priority.

## Câu trả lời chi tiết

Unbounded queue biến overload thành memory/latency outage. Shed theo deadline/tenant/priority, trả 429/503 và tránh retry đồng bộ. Bulkhead, rate limit và circuit breaker đặt ở boundary phù hợp.

## Góc nhìn Production

Alert queue age, rejection, dropped work và fairness theo tenant.

## Trade-offs

Unbounded queue biến overload thành memory/latency outage. Shed theo deadline/tenant/priority, trả 429/503 và tránh retry đồng bộ. Bulkhead, rate limit và circuit breaker đặt ở boundary phù hợp.

## Câu trả lời sai thường gặp

Queue vô hạn là backpressure tốt vì không mất dữ liệu.

## Follow-up

- Retry-After nên dùng thế nào?

- Work nào được shed trong payment flow?

## Nguồn chính thống

- [Amazon Web Services — Avoiding insurmountable queue backlogs](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/)
- [Amazon Web Services — Timeouts, retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Kubernetes — Kubernetes Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Spring — Spring WebFlux reactive core](https://docs.spring.io/spring-framework/reference/web/webflux/reactive-spring.html)
