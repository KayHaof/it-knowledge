---
id: spring-transaction-rollback-rules
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - rollback
  - checked-exception
  - transaction
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
    - id: rollback
      required: true
      aliases:
        - rollback
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: checked-exception
      required: true
      aliases:
        - checked-exception
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: transaction
      required: false
      aliases:
        - transaction
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi exception đều tự động rollback và catch exception không ảnh hưởng transaction.
      penalty: 20
---

# Spring mặc định rollback cho exception nào?

## Rubric

### Must Include

- rollback

- checked-exception

### Strong Answer Includes

- transaction

## Câu trả lời 30 giây

Mặc định runtime exception và Error khiến rollback; checked exception thường không. Khai báo `rollbackFor` khi domain cần rollback với checked exception, và đừng nuốt exception trong transaction.

## Câu trả lời chi tiết

Interceptor đánh dấu rollback-only khi exception khớp rule; nếu catch rồi không rethrow, commit có thể xảy ra hoặc transaction đã rollback-only dẫn UnexpectedRollbackException. Rule cụ thể hơn có thể override rule rộng. Boundary nên map lỗi sau khi transaction kết thúc.

## Góc nhìn Production

Test commit/rollback bằng integration test, log rollback-only và metric rollback rate.

## Trade-offs

Interceptor đánh dấu rollback-only khi exception khớp rule; nếu catch rồi không rethrow, commit có thể xảy ra hoặc transaction đã rollback-only dẫn UnexpectedRollbackException. Rule cụ thể hơn có thể override rule rộng. Boundary nên map lỗi sau khi transaction kết thúc.

## Câu trả lời sai thường gặp

Mọi exception đều tự động rollback và catch exception không ảnh hưởng transaction.

## Follow-up

- UnexpectedRollbackException xuất hiện khi nào?

- RollbackFor pattern có rủi ro gì?

## Nguồn chính thống

- [Spring — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Spring — Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
- [Spring — Rolling Back a Declarative Transaction](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html)
- [Spring — Programmatic Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html)
