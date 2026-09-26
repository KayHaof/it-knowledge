---
id: jpa-dto-projection
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - DTO-projection
  - read-model
  - serialization
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
    - id: dto-projection
      required: true
      aliases:
        - DTO-projection
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: read-model
      required: true
      aliases:
        - read-model
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: serialization
      required: false
      aliases:
        - serialization
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - DTO projection luôn nhanh hơn entity và không cần index hay query-plan review.
      penalty: 20
---

# Khi nào DTO projection tốt hơn trả JPA entity cho read API?

## Rubric

### Must Include

- DTO-projection

- read-model

### Strong Answer Includes

- serialization

## Câu trả lời 30 giây

Projection lấy đúng columns/shape, tránh lazy graph, dirty tracking và accidental mutation. Nó phù hợp read endpoint không cần domain behavior; entity vẫn hữu ích khi cần aggregate command trong transaction.

## Câu trả lời chi tiết

Constructor/interface projection hoặc native record query map trực tiếp từ result, giảm heap và serialization surprise. Trade-off là query coupling, mapping/versioning và mất identity map. Projection join vẫn có duplicate/cardinality nên cần kiểm result. Đừng dùng projection để bypass authorization predicate.

## Góc nhìn Production

Đo bytes, heap, query plan và serialization latency. Contract test column aliases và fallback migration khi schema đổi.

## Trade-offs

Constructor/interface projection hoặc native record query map trực tiếp từ result, giảm heap và serialization surprise. Trade-off là query coupling, mapping/versioning và mất identity map. Projection join vẫn có duplicate/cardinality nên cần kiểm result. Đừng dùng projection để bypass authorization predicate.

## Câu trả lời sai thường gặp

DTO projection luôn nhanh hơn entity và không cần index hay query-plan review.

## Follow-up

- Projection có gọi lazy association không?

- Native projection khác JPQL constructor thế nào?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
