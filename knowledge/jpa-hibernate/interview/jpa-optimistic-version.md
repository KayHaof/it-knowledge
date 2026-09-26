---
id: jpa-optimistic-version
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - optimistic-locking
  - Version
  - conflict
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
    - id: conflict
      required: false
      aliases:
        - conflict
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - "@Version khóa row vật lý nên không bao giờ có transaction chờ lock."
      penalty: 20
---

# `@Version` bảo vệ lost update như thế nào?

## Rubric

### Must Include

- optimistic-locking

- Version

### Strong Answer Includes

- conflict

## Câu trả lời 30 giây

UPDATE/DELETE kèm version cũ trong WHERE; nếu affected rows bằng zero, provider báo conflict. Nó phát hiện cạnh tranh chứ không tự merge hay retry an toàn.

## Câu trả lời chi tiết

Mỗi commit thành công tăng version. Caller đọc v3, update với predicate v3; caller thứ hai sau đó dùng v3 sẽ fail thay vì overwrite v4. Retry phải đọc lại và quyết định merge theo domain, không lặp mù side effect. Version không thay thế unique constraint hay lock cho invariant cần serialize trước khi đọc.

## Góc nhìn Production

Theo dõi conflict rate, retry success và user-visible conflicts; test concurrent transactions trên DB thật. Trả lỗi conflict rõ thay vì 500 chung chung.

## Trade-offs

Mỗi commit thành công tăng version. Caller đọc v3, update với predicate v3; caller thứ hai sau đó dùng v3 sẽ fail thay vì overwrite v4. Retry phải đọc lại và quyết định merge theo domain, không lặp mù side effect. Version không thay thế unique constraint hay lock cho invariant cần serialize trước khi đọc.

## Câu trả lời sai thường gặp

@Version khóa row vật lý nên không bao giờ có transaction chờ lock.

## Follow-up

- Version conflict nên retry khi nào?

- Bulk update có tăng version không?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
