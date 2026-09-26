---
id: jpa-first-level-cache
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
        - JPA first-level cache dùng chung toàn cluster nên mọi request thấy dữ liệu mới ngay.
      penalty: 20
---

# First-level cache của JPA có phạm vi và giới hạn gì?

## Rubric

### Must Include

- first-level-cache

- identity-map

### Strong Answer Includes

- persistence-context

## Câu trả lời 30 giây

Nó gắn với persistence context/EntityManager, đảm bảo cùng identity trong một context và tránh load lặp. Nó không phải cache toàn ứng dụng, không chia sẻ giữa request và không thay index.

## Câu trả lời chi tiết

Lookup cùng entity id có thể trả instance đã managed; bulk JPQL/native update bypass context nên state có thể stale và cần clear/refresh. Context quá lớn giữ nhiều object, làm dirty checking và heap tăng. Second-level cache là layer khác với invalidation/config phức tạp hơn.

## Góc nhìn Production

Đặt transaction/context boundary rõ; monitor heap và clear khi batch processing.

## Trade-offs

Lookup cùng entity id có thể trả instance đã managed; bulk JPQL/native update bypass context nên state có thể stale và cần clear/refresh. Context quá lớn giữ nhiều object, làm dirty checking và heap tăng. Second-level cache là layer khác với invalidation/config phức tạp hơn.

## Câu trả lời sai thường gặp

JPA first-level cache dùng chung toàn cluster nên mọi request thấy dữ liệu mới ngay.

## Follow-up

- Bulk update cần clear khi nào?

- Second-level cache consistency ra sao?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
