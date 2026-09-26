---
id: spring-transaction-readonly
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - transactions
  - readOnly
  - flush
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
    - id: transactions
      required: true
      aliases:
        - transactions
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: readonly
      required: true
      aliases:
        - readOnly
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: flush
      required: false
      aliases:
        - flush
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - readOnly đảm bảo mọi câu lệnh INSERT/UPDATE sẽ bị database từ chối giống permission.
      penalty: 20
---

# `@Transactional(readOnly=true)` có phải database luôn chặn write không?

## Rubric

### Must Include

- transactions

- readOnly

### Strong Answer Includes

- flush

## Câu trả lời 30 giây

Nó là hint cho transaction manager/provider, thường tối ưu dirty checking hoặc routing read replica; không phải security boundary chặn mọi write. Code vẫn phải tránh mutation ngoài ý muốn.

## Câu trả lời chi tiết

JPA có thể đặt flush mode/read-only session, JDBC driver/database có semantics khác nhau. Nếu write trong read-only transaction, hành vi tùy engine/config và có thể lỗi muộn. Authorization và command/query separation mới chịu trách nhiệm cấm write.

## Góc nhìn Production

Test trên driver/database thật; kiểm replica lag nếu route read-only sang replica.

## Trade-offs

JPA có thể đặt flush mode/read-only session, JDBC driver/database có semantics khác nhau. Nếu write trong read-only transaction, hành vi tùy engine/config và có thể lỗi muộn. Authorization và command/query separation mới chịu trách nhiệm cấm write.

## Câu trả lời sai thường gặp

readOnly đảm bảo mọi câu lệnh INSERT/UPDATE sẽ bị database từ chối giống permission.

## Follow-up

- Read replica routing đặt ở tầng nào?

- Flush mode ảnh hưởng query nào?

## Nguồn chính thống

- [Spring — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Spring — Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
- [Spring — Rolling Back a Declarative Transaction](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html)
- [Spring — Programmatic Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html)
