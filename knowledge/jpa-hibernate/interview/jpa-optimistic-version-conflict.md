---
id: jpa-optimistic-version-conflict
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - optimistic-locking
  - Version
  - lost-update
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
    - id: optimistic-locking
      required: true
      aliases:
        - optimistic-locking
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: version
      required: true
      aliases:
        - Version
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: lost-update
      required: false
      aliases:
        - lost-update
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - "`@Version` khóa row vật lý nên không bao giờ có concurrent update."
      penalty: 20
---

# `@Version` ngăn lost update như thế nào?

## Rubric

### Must Include

- optimistic-locking

- Version

### Strong Answer Includes

- lost-update

## Câu trả lời 30 giây

UPDATE kèm version cũ; nếu affected rows bằng 0 vì phiên khác đã cập nhật, provider ném optimistic lock exception. Ứng dụng cần retry/merge có chủ đích thay vì ghi đè im lặng.

## Câu trả lời chi tiết

Version có thể là numeric/timestamp và tăng khi entity update. Nó không ngăn đọc stale hay thay thế business conflict resolution; retry transaction phải re-read rồi kiểm rule. Bulk update thường bypass version nếu không thêm predicate.

## Góc nhìn Production

Đo conflict rate và retry storm; trả 409/semantic conflict cho API phù hợp.

## Trade-offs

Version có thể là numeric/timestamp và tăng khi entity update. Nó không ngăn đọc stale hay thay thế business conflict resolution; retry transaction phải re-read rồi kiểm rule. Bulk update thường bypass version nếu không thêm predicate.

## Câu trả lời sai thường gặp

`@Version` khóa row vật lý nên không bao giờ có concurrent update.

## Follow-up

- Khi nào pessimistic lock phù hợp hơn?

- Bulk JPQL update giữ version thế nào?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
