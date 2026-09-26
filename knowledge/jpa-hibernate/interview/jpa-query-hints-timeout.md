---
id: jpa-query-hints-timeout
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - query-hint
  - timeout
  - read-only
relatedLessons:
  - spring-jpa-fetching-batching-locking
sources:
  - title: Hibernate ORM User Guide
    url: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html
    organization: Hibernate
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Data JPA Locking
    url: https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Data JPA Projections
    url: https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html
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
    - id: query-hint
      required: true
      aliases:
        - query-hint
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: timeout
      required: true
      aliases:
        - timeout
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: read-only
      required: false
      aliases:
        - read-only
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đặt `@QueryHints(timeout=...)` bảo đảm database dừng query chính xác sau số milliseconds đó.
      penalty: 20
---

# Query hint timeout/read-only có phải database luôn enforce không?

## Rubric

### Must Include

- query-hint

- timeout

### Strong Answer Includes

- read-only

## Câu trả lời 30 giây

Hint truyền ý định tới provider/driver/database nhưng semantics phụ thuộc dialect và transaction manager. Cần kiểm tra actual SQL/session và vẫn đặt timeout ở nhiều layer.

## Câu trả lời chi tiết

JPA query timeout có thể thành JDBC statement timeout hoặc bị bỏ qua; Hibernate read-only có thể giảm snapshot/dirty checking nhưng không thay quyền database. Timeout query không chắc hủy server work ngay, và caller deadline cần ngắn hơn. Hint fetch size/lock timeout cũng có engine-specific behavior.

## Góc nhìn Production

Đo query cancel, server-side running statements, lock waits và orphan work. Test Hikari/JDBC/DB versions production, không tin annotation đơn lẻ.

## Trade-offs

JPA query timeout có thể thành JDBC statement timeout hoặc bị bỏ qua; Hibernate read-only có thể giảm snapshot/dirty checking nhưng không thay quyền database. Timeout query không chắc hủy server work ngay, và caller deadline cần ngắn hơn. Hint fetch size/lock timeout cũng có engine-specific behavior.

## Câu trả lời sai thường gặp

Đặt `@QueryHints(timeout=...)` bảo đảm database dừng query chính xác sau số milliseconds đó.

## Follow-up

- Client timeout và server statement timeout phối hợp thế nào?

- Read-only hint giúp memory ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
