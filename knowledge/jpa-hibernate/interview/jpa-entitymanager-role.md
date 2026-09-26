---
id: jpa-entitymanager-role
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: junior
topics:
  - EntityManager
  - repository
  - persistence
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
        technicalCorrectness: 14
        completeness: 7
    - id: repository
      required: true
      aliases:
        - repository
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: persistence
      required: false
      aliases:
        - persistence
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - EntityManager là một singleton thread-safe dùng chung cho toàn application và mỗi `persist` lập tức INSERT.
      penalty: 20
---

# EntityManager quản lý những gì trong JPA?

## Rubric

### Must Include

- EntityManager

- repository

### Strong Answer Includes

- persistence

## Câu trả lời 30 giây

EntityManager là API làm việc với persistence context: tìm, persist, merge, remove và flush entity. Nó không phải database connection hay transaction manager độc lập; scope của context và transaction quyết định semantics.

## Câu trả lời chi tiết

Persistence context là identity map của entity managed trong một unit of work. `persist` đưa transient vào context, `find` có thể lấy từ first-level cache, `merge` copy state vào instance managed và `remove` đánh dấu xóa. SQL thường được synchronize lúc flush/commit, còn transaction resource do JTA hoặc resource-local manager quản lý.

## Góc nhìn Production

Giữ EntityManager/transaction ngắn theo use case, đo flush/query count và tránh giữ entity qua request. Test trên database engine thật.

## Trade-offs

Persistence context là identity map của entity managed trong một unit of work. `persist` đưa transient vào context, `find` có thể lấy từ first-level cache, `merge` copy state vào instance managed và `remove` đánh dấu xóa. SQL thường được synchronize lúc flush/commit, còn transaction resource do JTA hoặc resource-local manager quản lý.

## Câu trả lời sai thường gặp

EntityManager là một singleton thread-safe dùng chung cho toàn application và mỗi `persist` lập tức INSERT.

## Follow-up

- EntityManager có thread-safe không?

- `find` khác query về first-level cache thế nào?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
