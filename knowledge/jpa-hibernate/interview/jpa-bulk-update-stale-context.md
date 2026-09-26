---
id: jpa-bulk-update-stale-context
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - bulk-update
  - persistence-context
  - clear
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
    - id: bulk-update
      required: true
      aliases:
        - bulk-update
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: persistence-context
      required: true
      aliases:
        - persistence-context
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: clear
      required: false
      aliases:
        - clear
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bulk JPQL update đi qua từng entity nên tự kích hoạt lifecycle callback và cập nhật context.
      penalty: 20
---

# Bulk JPQL update có thể làm persistence context stale ra sao?

## Rubric

### Must Include

- bulk-update

- persistence-context

### Strong Answer Includes

- clear

## Câu trả lời 30 giây

Bulk DML chạy trực tiếp database, bỏ qua managed entity và dirty checking. Entity đã load vẫn giữ giá trị cũ; clear/refresh hoặc tách transaction trước khi đọc tiếp.

## Câu trả lời chi tiết

Provider không thể đồng bộ mọi instance đang managed với bulk statement. `clearAutomatically`/manual clear tránh ghi đè stale state khi flush sau đó, nhưng làm mất thay đổi chưa flush. Native DML cần đồng bộ cache/index/search projection riêng.

## Góc nhìn Production

Đặt bulk operation ở maintenance boundary, metric affected rows và audit; test concurrent reads.

## Trade-offs

Provider không thể đồng bộ mọi instance đang managed với bulk statement. `clearAutomatically`/manual clear tránh ghi đè stale state khi flush sau đó, nhưng làm mất thay đổi chưa flush. Native DML cần đồng bộ cache/index/search projection riêng.

## Câu trả lời sai thường gặp

Bulk JPQL update đi qua từng entity nên tự kích hoạt lifecycle callback và cập nhật context.

## Follow-up

- Bulk delete có cascade không?

- Làm sao invalidation second-level cache sau bulk DML?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
