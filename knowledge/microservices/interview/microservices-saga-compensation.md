---
id: microservices-saga-compensation
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - Saga
  - compensation
  - eventual-consistency
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
    - id: eventual-consistency
      required: false
      aliases:
        - eventual-consistency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Saga cung cấp ACID atomic commit xuyên tất cả database giống 2PC.
      penalty: 20
---

# Saga giải quyết distributed transaction nhưng không rollback vật lý như thế nào?

## Rubric

### Must Include

- Saga

- compensation

### Strong Answer Includes

- eventual-consistency

## Câu trả lời 30 giây

Saga chuỗi local transaction và compensation khi bước sau lỗi; compensation là business action, không đảm bảo undo tuyệt đối. Cần trạng thái workflow và retry/idempotency.

## Câu trả lời chi tiết

Orchestration tập trung state machine; choreography dùng event nhưng khó quan sát vòng lặp. Payment capture có thể cần refund, không thể “rollback” ngân hàng. Thiết kế invariant, timeout, manual review và reconciliation cho trạng thái không chắc chắn.

## Góc nhìn Production

Alert saga age, compensation failures và stuck state; audit mọi transition.

## Trade-offs

Orchestration tập trung state machine; choreography dùng event nhưng khó quan sát vòng lặp. Payment capture có thể cần refund, không thể “rollback” ngân hàng. Thiết kế invariant, timeout, manual review và reconciliation cho trạng thái không chắc chắn.

## Câu trả lời sai thường gặp

Saga cung cấp ACID atomic commit xuyên tất cả database giống 2PC.

## Follow-up

- Orchestration hay choreography khi nào?

- Compensation không thành công xử lý ra sao?

## Nguồn chính thống

- [Amazon Web Services — Saga patterns](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html)
- [Amazon Web Services — Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [Amazon Web Services — Retry with backoff pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)
