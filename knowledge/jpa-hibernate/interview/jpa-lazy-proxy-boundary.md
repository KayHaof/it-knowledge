---
id: jpa-lazy-proxy-boundary
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - lazy-loading
  - proxy
  - OSIV
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
    - id: osiv
      required: false
      aliases:
        - OSIV
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật OSIV luôn là best practice vì giải quyết mọi LazyInitializationException miễn phí.
      penalty: 20
---

# Lazy proxy và Open Session in View (OSIV) tạo trade-off gì?

## Rubric

### Must Include

- lazy-loading

- proxy

### Strong Answer Includes

- OSIV

## Câu trả lời 30 giây

Lazy proxy tải association khi truy cập; OSIV giữ session tới view nên che lỗi lazy nhưng có thể phát sinh query ngoài service transaction. Tôi thường load đúng read model trong transaction và tắt OSIV nếu cần boundary chặt.

## Câu trả lời chi tiết

OSIV làm serialization/template vô tình traverse graph, gây N+1 và giữ connection lâu nếu request chậm. `JOIN FETCH`, EntityGraph hoặc projection khai báo dữ liệu cần trước khi trả API. Nếu bật OSIV, phải kiểm soát serializer và query count.

## Góc nhìn Production

Theo dõi connection hold time, query count/request và p95 serialization.

## Trade-offs

OSIV làm serialization/template vô tình traverse graph, gây N+1 và giữ connection lâu nếu request chậm. `JOIN FETCH`, EntityGraph hoặc projection khai báo dữ liệu cần trước khi trả API. Nếu bật OSIV, phải kiểm soát serializer và query count.

## Câu trả lời sai thường gặp

Bật OSIV luôn là best practice vì giải quyết mọi LazyInitializationException miễn phí.

## Follow-up

- DTO projection tránh lazy thế nào?

- Tắt OSIV cần sửa service ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
