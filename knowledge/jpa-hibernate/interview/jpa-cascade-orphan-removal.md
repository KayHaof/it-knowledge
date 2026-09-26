---
id: jpa-cascade-orphan-removal
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - cascade
  - orphanRemoval
  - aggregate
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
    - id: cascade
      required: true
      aliases:
        - cascade
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: orphanremoval
      required: true
      aliases:
        - orphanRemoval
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: aggregate
      required: false
      aliases:
        - aggregate
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Cascade ALL và orphanRemoval là hai tên khác nhau cho cùng một hành vi.
      penalty: 20
---

# Cascade và orphanRemoval khác nhau trong mapping aggregate?

## Rubric

### Must Include

- cascade

- orphanRemoval

### Strong Answer Includes

- aggregate

## Câu trả lời 30 giây

Cascade truyền một số operation từ parent sang child; orphanRemoval xóa child khi bị loại khỏi collection/association. Cả hai chỉ đúng khi lifecycle child thực sự thuộc parent.

## Câu trả lời chi tiết

`CascadeType.REMOVE` thường chạy khi parent bị remove; orphan removal phản ánh child orphan trong flush. Dùng trên quan hệ shared/reference có thể xóa nhầm dữ liệu. Helper method giữ hai phía bidirectional đồng bộ và test SQL delete/update.

## Góc nhìn Production

Kiểm ownership, soft-delete/audit và bulk operation; tránh cascade graph quá sâu.

## Trade-offs

`CascadeType.REMOVE` thường chạy khi parent bị remove; orphan removal phản ánh child orphan trong flush. Dùng trên quan hệ shared/reference có thể xóa nhầm dữ liệu. Helper method giữ hai phía bidirectional đồng bộ và test SQL delete/update.

## Câu trả lời sai thường gặp

Cascade ALL và orphanRemoval là hai tên khác nhau cho cùng một hành vi.

## Follow-up

- Many-to-many có nên orphanRemoval không?

- Xóa parent lớn tránh lock/timeout thế nào?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
