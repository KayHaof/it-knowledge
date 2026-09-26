---
id: spring-transaction-isolation
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - transaction
  - isolation
  - MVCC
relatedLessons:
  - spring-transaction-failure-playbook
sources:
  - title: Using @Transactional
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Transaction Propagation
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Rolling Back a Declarative Transaction
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Programmatic Transaction Management
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html
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
    - id: transaction
      required: true
      aliases:
        - transaction
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: isolation
      required: true
      aliases:
        - isolation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: mvcc
      required: false
      aliases:
        - MVCC
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đặt SERIALIZABLE cho mọi transaction là cách đơn giản bảo đảm không còn race với chi phí không đáng kể.
      penalty: 20
---

# `@Transactional(isolation=...)` không thể giải quyết mọi race nào?

## Rubric

### Must Include

- transaction

- isolation

### Strong Answer Includes

- MVCC

## Câu trả lời 30 giây

Isolation điều chỉnh database visibility/locking, không tạo idempotency cho message hay atomicity với remote service. Chọn mức dựa invariant và engine; vẫn cần unique constraint, version hoặc serialization logic.

## Câu trả lời chi tiết

READ COMMITTED, REPEATABLE READ và SERIALIZABLE có semantics khác theo database. MVCC có thể tránh dirty read nhưng vẫn gặp lost update hoặc phantom tùy pattern. Isolation cao hơn tăng lock/wait/abort; transaction boundary phải ngắn và không ôm HTTP. Race giữa hai aggregate/service cần command idempotency, optimistic version hoặc workflow.

## Góc nhìn Production

Đo lock wait, deadlock, retry/serialization failures và transaction duration. Test trên engine/version production, không suy ra từ H2 mặc định.

## Trade-offs

READ COMMITTED, REPEATABLE READ và SERIALIZABLE có semantics khác theo database. MVCC có thể tránh dirty read nhưng vẫn gặp lost update hoặc phantom tùy pattern. Isolation cao hơn tăng lock/wait/abort; transaction boundary phải ngắn và không ôm HTTP. Race giữa hai aggregate/service cần command idempotency, optimistic version hoặc workflow.

## Câu trả lời sai thường gặp

Đặt SERIALIZABLE cho mọi transaction là cách đơn giản bảo đảm không còn race với chi phí không đáng kể.

## Follow-up

- Optimistic locking khác isolation thế nào?

- Lost update phát hiện bằng pattern nào?

## Nguồn chính thống

- [Spring — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Spring — Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
- [Spring — Rolling Back a Declarative Transaction](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html)
- [Spring — Programmatic Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html)
