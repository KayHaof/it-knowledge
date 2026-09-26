---
id: jpa-pessimistic-lock
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - pessimistic-locking
  - FOR UPDATE
  - timeout
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
    - id: pessimistic-locking
      required: true
      aliases:
        - pessimistic-locking
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: for-update
      required: true
      aliases:
        - FOR UPDATE
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: timeout
      required: false
      aliases:
        - timeout
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Pessimistic lock là global application lock nên mọi service và cache đều bị bảo vệ.
      penalty: 20
---

# Khi nào dùng pessimistic lock thay vì optimistic lock trong JPA?

## Rubric

### Must Include

- pessimistic-locking

- FOR UPDATE

### Strong Answer Includes

- timeout

## Câu trả lời 30 giây

Pessimistic lock phù hợp contention cao hoặc invariant cần serialize ngay, nếu database hỗ trợ. Nó giữ database lock trong transaction, tăng wait/deadlock risk; phải có timeout và thứ tự truy cập rõ.

## Câu trả lời chi tiết

`PESSIMISTIC_WRITE` thường map tới SELECT FOR UPDATE/engine tương đương, nhưng exact semantics phụ thuộc dialect/isolation. Lock chỉ giữ tới commit/rollback và không bảo vệ remote side effect ngoài transaction. Optimistic tốt khi conflict thấp và transaction ngắn; pessimistic cần capacity budget cho blocked sessions.

## Góc nhìn Production

Đo lock wait/deadlock/timeout và test failover. Không giữ lock khi gọi API ngoài; map lock timeout thành retry có jitter hoặc conflict.

## Trade-offs

`PESSIMISTIC_WRITE` thường map tới SELECT FOR UPDATE/engine tương đương, nhưng exact semantics phụ thuộc dialect/isolation. Lock chỉ giữ tới commit/rollback và không bảo vệ remote side effect ngoài transaction. Optimistic tốt khi conflict thấp và transaction ngắn; pessimistic cần capacity budget cho blocked sessions.

## Câu trả lời sai thường gặp

Pessimistic lock là global application lock nên mọi service và cache đều bị bảo vệ.

## Follow-up

- Lock timeout khác transaction timeout thế nào?

- Database dialect làm semantics khác ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
