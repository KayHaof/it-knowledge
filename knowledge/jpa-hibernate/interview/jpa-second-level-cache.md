---
id: jpa-second-level-cache
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - second-level-cache
  - consistency
  - invalidation
relatedLessons:
  - spring-jpa-persistence-context
sources:
  - title: Jakarta Persistence Specification
    url: https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2
    organization: Jakarta EE
    type: specification
    accessedAt: 2026-09-02
  - title: Hibernate ORM User Guide
    url: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html
    organization: Hibernate
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Data JPA Persisting Entities
    url: https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html
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
    - id: second-level-cache
      required: true
      aliases:
        - second-level-cache
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: consistency
      required: true
      aliases:
        - consistency
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: invalidation
      required: false
      aliases:
        - invalidation
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Second-level cache luôn nhất quán tuyệt đối và loại bỏ mọi query database.
      penalty: 20
---

# Second-level cache khác first-level cache và khi nào cache entity nguy hiểm?

## Rubric

### Must Include

- second-level-cache

- consistency

### Strong Answer Includes

- invalidation

## Câu trả lời 30 giây

Second-level cache sống qua persistence contexts và có thể dùng giữa sessions/nodes tùy provider. Nó giảm reads nhưng cần invalidation/consistency, memory và serialization policy; không phù hợp dữ liệu thay đổi liên tục nếu không kiểm chứng.

## Câu trả lời chi tiết

First-level là per-context identity map, second-level cache lưu state/collection/query result theo region. Update từ bulk SQL, another service hoặc replication có thể làm stale; distributed cache invalidation/cluster topology quyết định semantics. Cache hit không đồng nghĩa fresh và query cache dễ cardinality explosion.

## Góc nhìn Production

Đo hit/miss, stale incidents, invalidation lag và heap/network; version cache regions khi deploy schema. Không cache secrets/tenant data thiếu isolation.

## Trade-offs

First-level là per-context identity map, second-level cache lưu state/collection/query result theo region. Update từ bulk SQL, another service hoặc replication có thể làm stale; distributed cache invalidation/cluster topology quyết định semantics. Cache hit không đồng nghĩa fresh và query cache dễ cardinality explosion.

## Câu trả lời sai thường gặp

Second-level cache luôn nhất quán tuyệt đối và loại bỏ mọi query database.

## Follow-up

- Bulk update invalidate cache ra sao?

- Cache region theo tenant cần policy gì?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
