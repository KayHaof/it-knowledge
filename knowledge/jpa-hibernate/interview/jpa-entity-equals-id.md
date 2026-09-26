---
id: jpa-entity-equals-id
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - equals
  - hashCode
  - entity
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
    - id: equals
      required: true
      aliases:
        - equals
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: hashcode
      required: true
      aliases:
        - hashCode
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: entity
      required: false
      aliases:
        - entity
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đưa mọi field và mọi association vào equals/hashCode là chính xác nhất cho entity.
      penalty: 20
---

# Thiết kế equals/hashCode cho JPA entity cần tránh bẫy nào?

## Rubric

### Must Include

- equals

- hashCode

### Strong Answer Includes

- entity

## Câu trả lời 30 giây

ID generated có thể null trước persist và thay đổi sau đó, làm hash bucket hỏng nếu dùng làm key. Cần identity strategy ổn định, tránh lazy association và cân nhắc business key immutable.

## Câu trả lời chi tiết

Entity proxy có thể là subclass, nên `getClass`/`instanceof` phải phù hợp Hibernate proxy semantics. HashCode không được thay đổi khi entity nằm trong HashSet; generated id khiến điều này khó trước khi flush. Dùng immutable natural key nếu thật sự unique, hoặc pattern class/id đã kiểm thử với proxy. Không đưa toàn bộ association vào equality vì gây lazy loads/cycles.

## Góc nhìn Production

Test transient/managed/proxy/detached states và collection behavior. Database unique constraint vẫn là authority cho uniqueness.

## Trade-offs

Entity proxy có thể là subclass, nên `getClass`/`instanceof` phải phù hợp Hibernate proxy semantics. HashCode không được thay đổi khi entity nằm trong HashSet; generated id khiến điều này khó trước khi flush. Dùng immutable natural key nếu thật sự unique, hoặc pattern class/id đã kiểm thử với proxy. Không đưa toàn bộ association vào equality vì gây lazy loads/cycles.

## Câu trả lời sai thường gặp

Đưa mọi field và mọi association vào equals/hashCode là chính xác nhất cho entity.

## Follow-up

- Proxy ảnh hưởng getClass thế nào?

- Generated id thay đổi hash bucket ra sao?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
