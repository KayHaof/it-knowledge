---
id: jpa-cascade-orphan
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
        - Cascade REMOVE và orphanRemoval là hai tên khác nhau của cùng một SQL behavior trong mọi case.
      penalty: 20
---

# Cascade và orphanRemoval khác nhau thế nào?

## Rubric

### Must Include

- cascade

- orphanRemoval

### Strong Answer Includes

- aggregate

## Câu trả lời 30 giây

Cascade truyền thao tác như persist/remove từ parent sang child. orphanRemoval xóa child khi bị loại khỏi association collection trong aggregate; nó không phải cơ chế delete tùy ý cho mọi quan hệ.

## Câu trả lời chi tiết

`cascade=REMOVE` chạy khi parent bị remove; orphanRemoval phản ánh ownership và lifecycle child phụ thuộc parent. Với shared child hoặc many-to-many, orphanRemoval/delete cascade có thể xóa dữ liệu ngoài ý muốn. Đồng bộ cả hai phía của bidirectional association và xác định aggregate boundary trước khi bật.

## Góc nhìn Production

Test delete graph, FK ordering và bulk data; audit accidental deletes. Không dùng cascade remove cho quan hệ reference dùng chung.

## Trade-offs

`cascade=REMOVE` chạy khi parent bị remove; orphanRemoval phản ánh ownership và lifecycle child phụ thuộc parent. Với shared child hoặc many-to-many, orphanRemoval/delete cascade có thể xóa dữ liệu ngoài ý muốn. Đồng bộ cả hai phía của bidirectional association và xác định aggregate boundary trước khi bật.

## Câu trả lời sai thường gặp

Cascade REMOVE và orphanRemoval là hai tên khác nhau của cùng một SQL behavior trong mọi case.

## Follow-up

- orphanRemoval chạy lúc nào?

- Many-to-many có nên dùng orphanRemoval không?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
