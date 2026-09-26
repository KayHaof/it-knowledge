---
id: jpa-batch-insert-flush-clear
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - batch-insert
  - flush
  - clear
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
    - id: batch-insert
      required: true
      aliases:
        - batch-insert
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: flush
      required: true
      aliases:
        - flush
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: clear
      required: false
      aliases:
        - clear
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ gọi `saveAll` là Hibernate luôn dùng một SQL batch bất kể ID strategy và memory.
      penalty: 20
---

# Vì sao batch insert JPA thường cần `flush()` và `clear()` theo chunk?

## Rubric

### Must Include

- batch-insert

- flush

### Strong Answer Includes

- clear

## Câu trả lời 30 giây

Persistence context giữ mọi entity và dirty-check snapshot; chunk flush gửi SQL, clear giải phóng references để memory không tăng. Batch size JDBC và ID generation có thể giới hạn batching thực tế.

## Câu trả lời chi tiết

Persist hàng trăm nghìn entity mà không clear làm first-level cache và dirty-check cost phình lên. Flush/clear mỗi chunk tách memory nhưng entity detached sau clear; quan hệ cần xử lý lại. Identity ID generation có thể buộc insert từng row trên một số database, còn sequence pooling cho batching tốt hơn.

## Góc nhìn Production

Theo dõi heap, flush duration, batch statement, transaction log và lock. Chunk transaction theo retry/restart semantics; đừng gom batch khổng lồ vào một transaction.

## Trade-offs

Persist hàng trăm nghìn entity mà không clear làm first-level cache và dirty-check cost phình lên. Flush/clear mỗi chunk tách memory nhưng entity detached sau clear; quan hệ cần xử lý lại. Identity ID generation có thể buộc insert từng row trên một số database, còn sequence pooling cho batching tốt hơn.

## Câu trả lời sai thường gặp

Chỉ gọi `saveAll` là Hibernate luôn dùng một SQL batch bất kể ID strategy và memory.

## Follow-up

- Identity generator phá batching thế nào?

- Chunk commit ảnh hưởng retry và partial failure ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
