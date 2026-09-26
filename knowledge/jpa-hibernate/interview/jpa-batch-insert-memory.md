---
id: jpa-batch-insert-memory
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - batching
  - flush-clear
  - jdbc
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
    - id: batching
      required: true
      aliases:
        - batching
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: flush-clear
      required: true
      aliases:
        - flush-clear
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: jdbc
      required: false
      aliases:
        - jdbc
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật `hibernate.jdbc.batch_size` đảm bảo một transaction triệu row luôn an toàn memory.
      penalty: 20
---

# Batch insert lớn bằng JPA cần flush/clear vì sao?

## Rubric

### Must Include

- batching

- flush-clear

### Strong Answer Includes

- jdbc

## Câu trả lời 30 giây

Persistence context giữ mọi entity và dirty-checking ngày càng đắt. Flush theo lô rồi clear giải phóng state; JDBC batching cần cấu hình driver/provider và ID strategy phù hợp.

## Câu trả lời chi tiết

Batch size gom prepared statements nhưng identity generation có thể buộc insert từng row. Chu kỳ flush/clear phải cân memory, transaction size, lock duration và restartability. Với ETL thuần dữ liệu, JdbcTemplate hoặc bulk loader có thể phù hợp hơn.

## Góc nhìn Production

Đo heap, batch round trips, log volume và rollback blast radius; checkpoint để resume.

## Trade-offs

Batch size gom prepared statements nhưng identity generation có thể buộc insert từng row. Chu kỳ flush/clear phải cân memory, transaction size, lock duration và restartability. Với ETL thuần dữ liệu, JdbcTemplate hoặc bulk loader có thể phù hợp hơn.

## Câu trả lời sai thường gặp

Bật `hibernate.jdbc.batch_size` đảm bảo một transaction triệu row luôn an toàn memory.

## Follow-up

- Sequence allocation ảnh hưởng batching thế nào?

- Batch failure partial recovery ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
