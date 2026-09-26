---
id: microservice-saga-state-machine
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - Saga
  - compensation
  - workflow
relatedLessons:
  - saga-distributed-transactions
sources:
  - title: Saga patterns
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Transactional outbox pattern
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Retry with backoff pattern
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html
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
    - id: saga
      required: true
      aliases:
        - Saga
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: compensation
      required: true
      aliases:
        - compensation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: workflow
      required: false
      aliases:
        - workflow
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Saga cung cấp ACID rollback xuyên các database và compensation luôn trả hệ thống đúng trạng thái ban đầu.
      penalty: 20
---

# Saga nên được model như state machine nào để xử lý retry và compensation?

## Rubric

### Must Include

- Saga

- compensation

### Strong Answer Includes

- workflow

## Câu trả lời 30 giây

Mỗi step có state, command/event id, timeout, retry policy và compensation; transition phải idempotent. Compensation là nghiệp vụ ngược/điều chỉnh, không hoàn tác vật lý mọi side effect.

## Câu trả lời chi tiết

Orchestration tập trung flow/timeout; choreography giảm coordinator nhưng khó thấy global state. Saga lưu durable progress và recovery từ event/outbox, xử lý out-of-order/duplicate. Một step đã gửi email/payment có thể cần refund/manual review thay vì rollback.

## Góc nhìn Production

Theo dõi age/state distribution, stuck steps, compensation success và manual queue. Drill worker crash, duplicate event và dependency outage.

## Trade-offs

Orchestration tập trung flow/timeout; choreography giảm coordinator nhưng khó thấy global state. Saga lưu durable progress và recovery từ event/outbox, xử lý out-of-order/duplicate. Một step đã gửi email/payment có thể cần refund/manual review thay vì rollback.

## Câu trả lời sai thường gặp

Saga cung cấp ACID rollback xuyên các database và compensation luôn trả hệ thống đúng trạng thái ban đầu.

## Follow-up

- Orchestration và choreography chọn theo gì?

- Compensation không khả nghịch audit thế nào?

## Nguồn chính thống

- [Amazon Web Services — Saga patterns](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html)
- [Amazon Web Services — Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [Amazon Web Services — Retry with backoff pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)
