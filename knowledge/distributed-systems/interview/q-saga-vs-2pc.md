---
id: q-saga-vs-2pc
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - saga
  - 2PC
  - compensation
relatedLessons:
  - saga-distributed-transactions
sources:
  - title: Saga patterns
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html
    organization: Amazon Web Services
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
    - id: saga
      required: true
      aliases:
        - saga
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: 2pc
      required: true
      aliases:
        - 2PC
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: compensation
      required: false
      aliases:
        - compensation
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Saga cung cấp ACID toàn cục và compensation luôn trả hệ thống về đúng trạng thái ban đầu.
      penalty: 20
---

# Saga khác Two-Phase Commit và compensation có phải rollback không?

## Rubric

### Must Include

- saga

- 2PC

### Strong Answer Includes

- compensation

## Câu trả lời 30 giây

2PC phối hợp participants prepare/commit cho atomic outcome nhưng có coordination/availability cost. Saga commit từng local transaction rồi chạy compensating action khi fail; compensation là business action mới, không xóa lịch sử như rollback DB.

## Câu trả lời chi tiết

Tôi chọn theo invariant, participant capability, latency và availability. Saga choreography ít coordinator nhưng flow khó quan sát; orchestration rõ state hơn nhưng coordinator là thành phần phải bền vững. Mỗi step/compensation phải idempotent, retryable và có manual/reconciliation path.

## Deep Dive

Compensation có thể fail hoặc không thể đảo ngược hoàn toàn, ví dụ email đã gửi. Thiết kế cần semantic lock/reservation và trạng thái pending rõ cho user.

## Góc nhìn Production

Persist saga state, timeout theo step, correlation, alert stuck instances và drill resume/manual repair.

## Trade-offs

Compensation có thể fail hoặc không thể đảo ngược hoàn toàn, ví dụ email đã gửi. Thiết kế cần semantic lock/reservation và trạng thái pending rõ cho user.

## Câu trả lời sai thường gặp

Saga cung cấp ACID toàn cục và compensation luôn trả hệ thống về đúng trạng thái ban đầu.

## Follow-up

- Choreography và orchestration trade-off gì?

- Isolation anomaly trong Saga xử lý thế nào?

## Nguồn chính thống

- [Amazon Web Services — Saga patterns](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html)
