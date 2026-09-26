---
id: jpa-pagination-collection-fetch
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - pagination
  - fetch-join
  - collection
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
    - id: pagination
      required: true
      aliases:
        - pagination
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fetch-join
      required: true
      aliases:
        - fetch-join
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: collection
      required: false
      aliases:
        - collection
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Thêm `distinct` vào JPQL luôn làm database paginate đúng số parent.
      penalty: 20
---

# Vì sao fetch join collection cùng pagination có thể trả sai page?

## Rubric

### Must Include

- pagination

- fetch-join

### Strong Answer Includes

- collection

## Câu trả lời 30 giây

Join nhân một parent thành nhiều rows nên limit database áp trên row join, không phải parent. Provider có thể cảnh báo và paginate in-memory, gây memory/latency spike; tách query page id và fetch detail thường an toàn hơn.

## Câu trả lời chi tiết

Page parent IDs bằng query không join, sau đó query fetch children với IN và reorder theo id. `distinct` có thể loại duplicate ở object layer nhưng không biến row limit thành parent limit trong mọi dialect. Multiple bag fetch còn có exception/cartesian explosion. DTO flat query là lựa chọn khác nếu read shape rõ.

## Góc nhìn Production

Đo row count, memory, query count và p99 ở page lớn; kiểm stable ordering/keyset. Không tắt warning pagination mà không load test.

## Trade-offs

Page parent IDs bằng query không join, sau đó query fetch children với IN và reorder theo id. `distinct` có thể loại duplicate ở object layer nhưng không biến row limit thành parent limit trong mọi dialect. Multiple bag fetch còn có exception/cartesian explosion. DTO flat query là lựa chọn khác nếu read shape rõ.

## Câu trả lời sai thường gặp

Thêm `distinct` vào JPQL luôn làm database paginate đúng số parent.

## Follow-up

- Hai-step pagination reorder thế nào?

- Keyset pagination với association khác gì OFFSET?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
