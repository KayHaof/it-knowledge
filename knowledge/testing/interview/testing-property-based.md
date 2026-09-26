---
id: testing-property-based
type: interview-question
technology: Testing
category: Testing
difficulty: middle
topics:
  - property-based
  - invariants
  - edge-cases
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
    - id: property-based
      required: true
      aliases:
        - property-based
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: invariants
      required: true
      aliases:
        - invariants
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: edge-cases
      required: false
      aliases:
        - edge-cases
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Property-based test thay được mọi test case nghiệp vụ vì tự kiểm correctness tuyệt đối.
      penalty: 20
---

# Property-based testing hữu ích hơn example test ở tình huống nào?

## Rubric

### Must Include

- property-based

- invariants

### Strong Answer Includes

- edge-cases

## Câu trả lời 30 giây

Nó sinh nhiều input để kiểm invariant như parse/ordering/idempotency, bắt edge case mà vài example bỏ sót. Cần generator và shrinker tốt để failure dễ tái hiện.

## Câu trả lời chi tiết

Example test mô tả business scenario cụ thể; property test mô tả luật tổng quát. Không nên random thiếu seed hoặc tạo dữ liệu không hợp domain. Kết hợp boundary examples, fuzz security input và regression corpus.

## Góc nhìn Production

Lưu seed/case thất bại và giới hạn runtime CI; không đưa nondeterminism vào release gate.

## Trade-offs

Example test mô tả business scenario cụ thể; property test mô tả luật tổng quát. Không nên random thiếu seed hoặc tạo dữ liệu không hợp domain. Kết hợp boundary examples, fuzz security input và regression corpus.

## Câu trả lời sai thường gặp

Property-based test thay được mọi test case nghiệp vụ vì tự kiểm correctness tuyệt đối.

## Follow-up

- Shrinking giúp debug thế nào?

- Property cho idempotent API là gì?

## Nguồn chính thống

- [Angular — Testing - Angular](https://angular.dev/guide/testing)
- [Spring — Testing Spring Applications](https://docs.spring.io/spring-boot/reference/testing/spring-applications.html)
- [Spring — Testcontainers - Spring Boot](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [OWASP — OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PostgreSQL — PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
