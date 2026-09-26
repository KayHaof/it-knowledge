---
id: jpa-entity-lifecycle
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: junior
topics:
  - entity-lifecycle
  - transient
  - managed
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
    - id: entity-lifecycle
      required: true
      aliases:
        - entity-lifecycle
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: transient
      required: true
      aliases:
        - transient
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: managed
      required: false
      aliases:
        - managed
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi object Java có `@Entity` đều managed ngay khi `new`.
      penalty: 20
---

# Transient, managed, detached và removed khác nhau thế nào?

## Rubric

### Must Include

- entity-lifecycle

- transient

### Strong Answer Includes

- managed

## Câu trả lời 30 giây

Transient chưa thuộc persistence context; managed được context theo dõi; detached có identity nhưng không còn được theo dõi; removed được đánh dấu xóa khi flush. Chuyển state đúng giúp dự đoán dirty checking và SQL.

## Câu trả lời chi tiết

`persist` chuyển transient thành managed, commit/clear/close làm entity detached, `merge` trả instance managed khác có thể copy state, còn `remove` đánh dấu managed để DELETE. Gọi method trên detached không tự ghi database. Entity detached giữ snapshot? Hibernate phải reattach/copy theo merge và có thể overwrite field nếu state stale.

## Góc nhìn Production

Không serialize entity rồi merge mù từ client; dùng DTO và optimistic version. Theo dõi detached lazy access và transaction boundary.

## Trade-offs

`persist` chuyển transient thành managed, commit/clear/close làm entity detached, `merge` trả instance managed khác có thể copy state, còn `remove` đánh dấu managed để DELETE. Gọi method trên detached không tự ghi database. Entity detached giữ snapshot? Hibernate phải reattach/copy theo merge và có thể overwrite field nếu state stale.

## Câu trả lời sai thường gặp

Mọi object Java có `@Entity` đều managed ngay khi `new`.

## Follow-up

- Merge trả object nào nên dùng?

- Clear persistence context có tác động gì?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
