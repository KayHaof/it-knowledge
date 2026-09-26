---
id: jpa-owning-side-mappedby
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: junior
topics:
  - mappedBy
  - owning-side
  - foreign-key
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
    - id: mappedby
      required: true
      aliases:
        - mappedBy
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: owning-side
      required: true
      aliases:
        - owning-side
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: foreign-key
      required: false
      aliases:
        - foreign-key
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - "`mappedBy` khiến parent luôn là phía ghi foreign key và collection update tự động persist."
      penalty: 20
---

# `mappedBy` nói gì về owning side trong quan hệ bidirectional?

## Rubric

### Must Include

- mappedBy

- owning-side

### Strong Answer Includes

- foreign-key

## Câu trả lời 30 giây

`mappedBy` chỉ phía còn lại quản lý foreign key; bên không owning thay đổi collection chưa chắc ghi SQL. Cập nhật owning side và helper hai chiều để object graph nhất quán.

## Câu trả lời chi tiết

Trong one-to-many, child thường giữ `@ManyToOne` và join column, parent `mappedBy`. `mappedBy` là tên field Java, không phải column. Nếu chỉ sửa inverse collection, transaction commit không tạo link; integration test cần assert row.

## Góc nhìn Production

Kiểm constraint/index foreign key và cascade; không đồng bộ hai phía bằng setter rời rạc.

## Trade-offs

Trong one-to-many, child thường giữ `@ManyToOne` và join column, parent `mappedBy`. `mappedBy` là tên field Java, không phải column. Nếu chỉ sửa inverse collection, transaction commit không tạo link; integration test cần assert row.

## Câu trả lời sai thường gặp

`mappedBy` khiến parent luôn là phía ghi foreign key và collection update tự động persist.

## Follow-up

- Join table many-to-many được quản lý bên nào?

- Helper method nên enforce invariant nào?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
