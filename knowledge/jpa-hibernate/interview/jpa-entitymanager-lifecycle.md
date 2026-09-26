---
id: jpa-entitymanager-lifecycle
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: junior
topics:
  - EntityManager
  - transient
  - managed
  - detached
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
    - id: entitymanager
      required: true
      aliases:
        - EntityManager
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: transient
      required: true
      aliases:
        - transient
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: managed
      required: false
      aliases:
        - managed
      points:
        technicalCorrectness: 10
        completeness: 5
    - id: detached
      required: false
      aliases:
        - detached
      points:
        technicalCorrectness: 10
        completeness: 5
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Gọi `merge` làm chính object detached trở thành managed trong mọi trường hợp.
      penalty: 20
---

# Entity lifecycle transient, managed, detached và removed khác nhau thế nào?

## Rubric

### Must Include

- EntityManager

- transient

### Strong Answer Includes

- managed

- detached

## Câu trả lời 30 giây

Transient chưa thuộc persistence context; managed được theo dõi dirty checking; detached không còn được theo dõi; removed sẽ bị xóa khi flush/commit. `persist`, `detach`, `merge`, `remove` chuyển trạng thái.

## Câu trả lời chi tiết

EntityManager giữ identity map trong persistence context. `merge` copy state vào instance managed và trả về instance đó, không biến object truyền vào thành managed. Lazy access ở detached có thể ném LazyInitializationException, nên load đúng boundary hoặc map DTO.

## Góc nhìn Production

Giữ transaction ngắn, không serialize entity graph detached; test state transition với SQL log.

## Trade-offs

EntityManager giữ identity map trong persistence context. `merge` copy state vào instance managed và trả về instance đó, không biến object truyền vào thành managed. Lazy access ở detached có thể ném LazyInitializationException, nên load đúng boundary hoặc map DTO.

## Câu trả lời sai thường gặp

Gọi `merge` làm chính object detached trở thành managed trong mọi trường hợp.

## Follow-up

- Flush khác commit thế nào?

- Vì sao không trả entity detached trực tiếp?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
