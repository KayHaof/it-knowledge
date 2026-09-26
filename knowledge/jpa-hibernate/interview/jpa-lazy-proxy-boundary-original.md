---
id: jpa-lazy-proxy-boundary-original
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - lazy-loading
  - proxy
  - transaction
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
    - id: lazy-loading
      required: true
      aliases:
        - lazy-loading
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: proxy
      required: true
      aliases:
        - proxy
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: transaction
      required: false
      aliases:
        - transaction
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Lazy loading luôn là lỗi Hibernate; bật EAGER sẽ giải quyết mà không tăng query.
      penalty: 20
---

# LazyInitializationException thường chỉ ra boundary sai nào?

## Rubric

### Must Include

- lazy-loading

- proxy

### Strong Answer Includes

- transaction

## Câu trả lời 30 giây

Code truy cập proxy sau khi persistence context đóng, thường do trả entity ra ngoài transaction. Fetch đúng shape trong use case và map DTO bên trong transaction thay vì mở OSIV mù.

## Câu trả lời chi tiết

Hibernate thay association lazy bằng proxy/collection wrapper; khi getter cần dữ liệu, session phải còn mở. `JOIN FETCH`, EntityGraph hoặc projection chọn graph trước khi đóng context. `Hibernate.initialize` chỉ chữa triệu chứng và có thể tạo N+1. OSIV giữ session tới view giúp tránh exception nhưng kéo connection/queries ra ngoài service boundary.

## Góc nhìn Production

Test serialization/mapper ngoài transaction, đo query count và connection hold time. Chọn fetch plan per endpoint, không đổi mọi association EAGER.

## Trade-offs

Hibernate thay association lazy bằng proxy/collection wrapper; khi getter cần dữ liệu, session phải còn mở. `JOIN FETCH`, EntityGraph hoặc projection chọn graph trước khi đóng context. `Hibernate.initialize` chỉ chữa triệu chứng và có thể tạo N+1. OSIV giữ session tới view giúp tránh exception nhưng kéo connection/queries ra ngoài service boundary.

## Câu trả lời sai thường gặp

Lazy loading luôn là lỗi Hibernate; bật EAGER sẽ giải quyết mà không tăng query.

## Follow-up

- OSIV gây rủi ro gì?

- Lazy collection serialize thành JSON thế nào?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
