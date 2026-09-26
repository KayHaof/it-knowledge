---
id: q-jpa-locking-pagination
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - locking
  - fetching
  - pagination
relatedLessons:
  - spring-jpa-fetching-batching-locking
sources:
  - title: Hibernate ORM User Guide
    url: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html
    organization: Hibernate
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
    - id: locking
      required: true
      aliases:
        - locking
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fetching
      required: true
      aliases:
        - fetching
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: pagination
      required: false
      aliases:
        - pagination
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - LIMIT luôn chạy sau khi Hibernate đã gom entity nên JOIN FETCH không ảnh hưởng pagination.
      penalty: 20
---

# Tại sao JOIN FETCH collection cùng pagination có thể nguy hiểm?

## Rubric

### Must Include

- locking

- fetching

### Strong Answer Includes

- pagination

## Câu trả lời 30 giây

Join collection nhân một parent thành nhiều SQL rows. Pagination ở row level có thể cắt parent, tạo duplicate hoặc buộc ORM xử lý in-memory tùy query/version; result nhỏ nhưng DB vẫn đọc rất nhiều.

## Câu trả lời chi tiết

Tôi xem SQL và execution plan, không chỉ page size Java. Alternatives gồm page IDs trước rồi fetch graph, DTO projection, batch fetching hoặc keyset pagination. Fetch Join, EntityGraph và projection là fetch shape khác nhau; không có lựa chọn mặc định cho mọi endpoint.

## Deep Dive

Pessimistic lock trên query join lớn còn tăng lock footprint; optimistic version phù hợp conflict hiếm nhưng cần conflict workflow.

## Góc nhìn Production

Đặt regression test query/row count và đo memory, DB time, pagination stability trên cardinality đại diện.

## Trade-offs

Pessimistic lock trên query join lớn còn tăng lock footprint; optimistic version phù hợp conflict hiếm nhưng cần conflict workflow.

## Câu trả lời sai thường gặp

LIMIT luôn chạy sau khi Hibernate đã gom entity nên JOIN FETCH không ảnh hưởng pagination.

## Follow-up

- Keyset khác offset pagination thế nào?

- EntityGraph có tự loại N+1 trong mọi query không?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
