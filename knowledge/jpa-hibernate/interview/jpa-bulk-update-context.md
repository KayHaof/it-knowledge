---
id: jpa-bulk-update-context
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - bulk-update
  - JPQL
  - stale-context
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
    - id: bulk-update
      required: true
      aliases:
        - bulk-update
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: jpql
      required: true
      aliases:
        - JPQL
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: stale-context
      required: false
      aliases:
        - stale-context
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bulk JPQL gọi setter trên mọi entity managed nên cache luôn đồng bộ.
      penalty: 20
---

# Bulk JPQL update có tương tác thế nào với persistence context?

## Rubric

### Must Include

- bulk-update

- JPQL

### Strong Answer Includes

- stale-context

## Câu trả lời 30 giây

Bulk update chạy trực tiếp trên database và bypass dirty checking/context. Entity managed trong cùng context có thể giữ giá trị cũ; cần clear/refresh hoặc chạy boundary riêng.

## Câu trả lời chi tiết

JPQL `update` trả số row nhưng không hydrate từng entity. Nếu context đã load rows, commit dirty checking sau đó có thể ghi đè bulk result. Spring Data `@Modifying(clearAutomatically=true)` hỗ trợ clear nhưng không thay authorization/transaction design. Bulk delete còn phải xét cascade/orphan và cache invalidation.

## Góc nhìn Production

Dùng bulk cho maintenance có transaction/lock budget, metric row count và audit. Không trộn entity mutation và bulk update trong một unit of work thiếu plan.

## Trade-offs

JPQL `update` trả số row nhưng không hydrate từng entity. Nếu context đã load rows, commit dirty checking sau đó có thể ghi đè bulk result. Spring Data `@Modifying(clearAutomatically=true)` hỗ trợ clear nhưng không thay authorization/transaction design. Bulk delete còn phải xét cascade/orphan và cache invalidation.

## Câu trả lời sai thường gặp

Bulk JPQL gọi setter trên mọi entity managed nên cache luôn đồng bộ.

## Follow-up

- Khi nào dùng native SQL?

- Second-level cache cần invalidate thế nào?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
