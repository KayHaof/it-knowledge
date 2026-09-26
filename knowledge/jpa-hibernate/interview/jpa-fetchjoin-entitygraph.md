---
id: jpa-fetchjoin-entitygraph
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - fetch-join
  - EntityGraph
  - query-plan
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
    - id: fetch-join
      required: true
      aliases:
        - fetch-join
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: entitygraph
      required: true
      aliases:
        - EntityGraph
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: query-plan
      required: false
      aliases:
        - query-plan
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - EntityGraph luôn tạo một SQL join duy nhất và fetch join luôn an toàn với mọi pagination.
      penalty: 20
---

# Fetch join và EntityGraph khác nhau trong việc chọn fetch plan?

## Rubric

### Must Include

- fetch-join

- EntityGraph

### Strong Answer Includes

- query-plan

## Câu trả lời 30 giây

Fetch join là query-level JPQL directive gắn rõ association; EntityGraph là metadata/runtime graph tách khỏi query và có thể tái sử dụng. Cả hai không tự giải pagination collection hay row explosion.

## Câu trả lời chi tiết

Fetch join hữu ích khi một use case cần association cụ thể và muốn kiểm soát SQL; EntityGraph giữ repository query tổng quát hơn và provider áp fetch graph/load graph semantics. Collection fetch join nhân parent rows, có thể cần distinct và pagination in-memory. DTO projection thường ít dữ liệu hơn nếu chỉ cần read shape.

## Góc nhìn Production

Review generated SQL, row count, memory và p99; thêm query-count/plan regression. Chọn graph theo endpoint, không gắn global default.

## Trade-offs

Fetch join hữu ích khi một use case cần association cụ thể và muốn kiểm soát SQL; EntityGraph giữ repository query tổng quát hơn và provider áp fetch graph/load graph semantics. Collection fetch join nhân parent rows, có thể cần distinct và pagination in-memory. DTO projection thường ít dữ liệu hơn nếu chỉ cần read shape.

## Câu trả lời sai thường gặp

EntityGraph luôn tạo một SQL join duy nhất và fetch join luôn an toàn với mọi pagination.

## Follow-up

- Collection fetch join + limit nguy hiểm thế nào?

- Khi nào DTO projection tốt hơn entity graph?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
