---
id: jpa-osiv-tradeoff
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - OSIV
  - connection-pool
  - boundary
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
    - id: osiv
      required: true
      aliases:
        - OSIV
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: connection-pool
      required: true
      aliases:
        - connection-pool
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: boundary
      required: false
      aliases:
        - boundary
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - OSIV làm mọi lazy loading chạy trong cùng transaction business và không tốn connection.
      penalty: 20
---

# Open Session in View (OSIV) giải quyết gì và tạo rủi ro gì?

## Rubric

### Must Include

- OSIV

- connection-pool

### Strong Answer Includes

- boundary

## Câu trả lời 30 giây

OSIV giữ persistence context tới view để lazy load sau service transaction, giảm LazyInitializationException. Đổi lại query/connection có thể kéo dài theo serialization hoặc remote call, che fetch-plan lỗi và làm pool exhaustion.

## Câu trả lời chi tiết

Service commit transaction nhưng session vẫn mở; mapper/template truy cập lazy association sẽ query ngoài business boundary, thường auto-commit hoặc transaction khác tùy setup. Điều này tạo N+1 và giữ resource lâu. Tắt OSIV buộc fetch DTO trong use case, làm lỗi lộ sớm nhưng boundary rõ hơn.

## Góc nhìn Production

Đo connection hold time, queries sau commit và p99; quyết định OSIV theo API/rendering. Nếu giữ, cấm remote calls và đặt observability cho lazy queries.

## Trade-offs

Service commit transaction nhưng session vẫn mở; mapper/template truy cập lazy association sẽ query ngoài business boundary, thường auto-commit hoặc transaction khác tùy setup. Điều này tạo N+1 và giữ resource lâu. Tắt OSIV buộc fetch DTO trong use case, làm lỗi lộ sớm nhưng boundary rõ hơn.

## Câu trả lời sai thường gặp

OSIV làm mọi lazy loading chạy trong cùng transaction business và không tốn connection.

## Follow-up

- Tắt OSIV cần thay đổi mapper thế nào?

- Lazy query sau commit có isolation nào?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
