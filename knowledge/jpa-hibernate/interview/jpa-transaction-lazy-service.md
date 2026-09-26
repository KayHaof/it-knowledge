---
id: jpa-transaction-lazy-service
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - transaction-boundary
  - service
  - lazy
relatedLessons:
  - spring-aop-transactions
sources:
  - title: Spring AOP Proxying Mechanisms
    url: https://docs.spring.io/spring-framework/reference/core/aop/proxying.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Declarative Transaction Management
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Transaction Propagation
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html
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
    - id: transaction-boundary
      required: true
      aliases:
        - transaction-boundary
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: service
      required: true
      aliases:
        - service
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: lazy
      required: false
      aliases:
        - lazy
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mỗi repository method tự mở transaction là an toàn nhất vì transaction càng nhỏ càng tốt bất kể workflow.
      penalty: 20
---

# Vì sao transaction boundary nên nằm ở service use case thay vì repository từng method?

## Rubric

### Must Include

- transaction-boundary

- service

### Strong Answer Includes

- lazy

## Câu trả lời 30 giây

Use case thường gồm nhiều read/write cần cùng invariant và atomicity. Transaction quanh từng repository method có thể commit nửa workflow và làm lazy/dirty state tách rời.

## Câu trả lời chi tiết

Service boundary chọn isolation, timeout và rollback policy cho command; repository tập trung query. Transaction quá rộng giữ connection/lock khi gọi remote, quá hẹp tạo partial update và stale data. Read use case có thể projection read-only; command cần aggregate load, validate, mutate và flush trong một scope.

## Góc nhìn Production

Đo transaction duration, pool/lock hold và rollback cause; không gọi network trong transaction. Integration test failure ở từng step để xác nhận atomicity.

## Trade-offs

Service boundary chọn isolation, timeout và rollback policy cho command; repository tập trung query. Transaction quá rộng giữ connection/lock khi gọi remote, quá hẹp tạo partial update và stale data. Read use case có thể projection read-only; command cần aggregate load, validate, mutate và flush trong một scope.

## Câu trả lời sai thường gặp

Mỗi repository method tự mở transaction là an toàn nhất vì transaction càng nhỏ càng tốt bất kể workflow.

## Follow-up

- Transaction chứa validation ngoài DB không?

- Remote call nên đặt trước hay sau commit?

## Nguồn chính thống

- [Spring — Spring AOP Proxying Mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
- [Spring — Declarative Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html)
- [Spring — Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
