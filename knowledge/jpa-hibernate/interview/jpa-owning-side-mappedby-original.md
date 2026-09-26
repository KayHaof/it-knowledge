---
id: jpa-owning-side-mappedby-original
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - owning-side
  - mappedBy
  - association
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
    - id: owning-side
      required: true
      aliases:
        - owning-side
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: mappedby
      required: true
      aliases:
        - mappedBy
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: association
      required: false
      aliases:
        - association
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - mappedBy nghĩa Hibernate sẽ cập nhật relation từ phía đó vì đó là phía được map.
      penalty: 20
---

# Owning side và `mappedBy` quyết định điều gì trong bidirectional mapping?

## Rubric

### Must Include

- owning-side

- mappedBy

### Strong Answer Includes

- association

## Câu trả lời 30 giây

Owning side là phía điều khiển foreign-key update/join table; `mappedBy` chỉ phía inverse trỏ về field owner. Chỉ sửa collection inverse mà không set owner có thể không tạo relation trong database.

## Câu trả lời chi tiết

Hai object references trong memory không tự đồng bộ. Helper `addChild` nên set cả parent trên child và add collection; owner mapping quyết định SQL. `mappedBy` nhận tên Java field, không phải column name. Join table/many-to-many có thêm lifecycle và duplicate risk.

## Góc nhìn Production

Integration test persist/reload từ database, kiểm FK và orphan semantics. Tránh expose mutable collection khiến caller phá invariant.

## Trade-offs

Hai object references trong memory không tự đồng bộ. Helper `addChild` nên set cả parent trên child và add collection; owner mapping quyết định SQL. `mappedBy` nhận tên Java field, không phải column name. Join table/many-to-many có thêm lifecycle và duplicate risk.

## Câu trả lời sai thường gặp

mappedBy nghĩa Hibernate sẽ cập nhật relation từ phía đó vì đó là phía được map.

## Follow-up

- Helper method bảo vệ association thế nào?

- Join column khác join table ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
