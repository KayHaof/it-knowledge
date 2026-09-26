---
id: jpa-first-level-cache-original
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - first-level-cache
  - identity-map
  - persistence-context
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
    - id: first-level-cache
      required: true
      aliases:
        - first-level-cache
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: identity-map
      required: true
      aliases:
        - identity-map
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: persistence-context
      required: false
      aliases:
        - persistence-context
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - JPA first-level cache dùng chung toàn cluster nên database chỉ query một lần.
      penalty: 20
---

# First-level cache của JPA bảo đảm điều gì?

## Rubric

### Must Include

- first-level-cache

- identity-map

### Strong Answer Includes

- persistence-context

## Câu trả lời 30 giây

Nó nằm trong persistence context và bảo đảm cùng entity identity trong context thường trả cùng managed instance. Nó giảm query lặp trong cùng unit of work, nhưng không phải shared cache giữa requests hay máy chủ.

## Câu trả lời chi tiết

`find` theo type/id kiểm context trước rồi mới SELECT. Query JPQL có thể vẫn chạy SQL dù entity đã managed, sau đó hydrate/return instance phù hợp. Clear/close xóa cache; concurrent transaction khác không tự thấy thay đổi. First-level cache lớn làm memory và dirty-check cost tăng.

## Góc nhìn Production

Giữ transaction scope bounded và dùng projection cho read list lớn. Không nhầm first-level với distributed cache hoặc cross-request consistency.

## Trade-offs

`find` theo type/id kiểm context trước rồi mới SELECT. Query JPQL có thể vẫn chạy SQL dù entity đã managed, sau đó hydrate/return instance phù hợp. Clear/close xóa cache; concurrent transaction khác không tự thấy thay đổi. First-level cache lớn làm memory và dirty-check cost tăng.

## Câu trả lời sai thường gặp

JPA first-level cache dùng chung toàn cluster nên database chỉ query một lần.

## Follow-up

- `find` và JPQL cùng id có cùng object không?

- Khi nào gọi clear?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
