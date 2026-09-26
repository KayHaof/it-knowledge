---
id: testing-unit-integration-contract
type: interview-question
technology: Testing
category: Testing
difficulty: junior
topics:
  - unit-test
  - integration-test
  - contract-test
relatedLessons:
  - testing-strategy
sources:
  - title: Testing - Angular
    url: https://angular.dev/guide/testing
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Testing Spring Applications
    url: https://docs.spring.io/spring-boot/reference/testing/spring-applications.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Testcontainers - Spring Boot
    url: https://docs.spring.io/spring-boot/reference/testing/testcontainers.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OWASP Web Security Testing Guide
    url: https://owasp.org/www-project-web-security-testing-guide/
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Transaction Isolation
    url: https://www.postgresql.org/docs/current/transaction-iso.html
    organization: PostgreSQL
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
    - id: unit-test
      required: true
      aliases:
        - unit-test
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: integration-test
      required: true
      aliases:
        - integration-test
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: contract-test
      required: false
      aliases:
        - contract-test
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Unit test pass nghĩa là endpoint chắc chắn chạy đúng với database production.
      penalty: 20
---

# Unit, integration và contract test bắt các loại lỗi nào?

## Rubric

### Must Include

- unit-test

- integration-test

### Strong Answer Includes

- contract-test

## Câu trả lời 30 giây

Unit kiểm logic cô lập; integration kiểm framework/DB/broker thật; contract kiểm compatibility giữa producer-consumer. Không loại nào thay hoàn toàn loại khác.

## Câu trả lời chi tiết

Test pyramid cân bằng speed và confidence; mock quá mức bỏ sót SQL/config. Consumer-driven contract khóa shape/semantics nhưng không kiểm latency/availability. Chạy integration với container/ephemeral dependency và dữ liệu deterministic.

## Góc nhìn Production

Theo dõi flaky/quarantine và thời gian suite; fail pipeline nếu contract breaking.

## Trade-offs

Test pyramid cân bằng speed và confidence; mock quá mức bỏ sót SQL/config. Consumer-driven contract khóa shape/semantics nhưng không kiểm latency/availability. Chạy integration với container/ephemeral dependency và dữ liệu deterministic.

## Câu trả lời sai thường gặp

Unit test pass nghĩa là endpoint chắc chắn chạy đúng với database production.

## Follow-up

- Mock khi nào làm test sai?

- Contract test có bắt business authorization không?

## Nguồn chính thống

- [Angular — Testing - Angular](https://angular.dev/guide/testing)
- [Spring — Testing Spring Applications](https://docs.spring.io/spring-boot/reference/testing/spring-applications.html)
- [Spring — Testcontainers - Spring Boot](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [OWASP — OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PostgreSQL — PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
