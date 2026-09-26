---
id: jpa-dirty-checking-flush
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - dirty-checking
  - flush
  - write-behind
relatedLessons:
  - spring-jpa-persistence-context
sources:
  - title: Jakarta Persistence Specification
    url: https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2
    organization: Jakarta EE
    type: specification
    accessedAt: 2026-09-02
  - title: Hibernate ORM User Guide
    url: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html
    organization: Hibernate
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Data JPA Persisting Entities
    url: https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html
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
    - id: dirty-checking
      required: true
      aliases:
        - dirty-checking
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
    - id: write-behind
      required: false
      aliases:
        - write-behind
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Dirty checking gửi UPDATE ngay khi setter được gọi và flush chính là commit database.
      penalty: 20
---

# Dirty checking của Hibernate phát hiện update lúc nào?

## Rubric

### Must Include

- dirty-checking

- flush

### Strong Answer Includes

- write-behind

## Câu trả lời 30 giây

Entity managed được snapshot; khi flush provider so sánh state và tạo SQL cần thiết. Flush có thể xảy ra trước commit hoặc trước query tùy flush mode, không đồng nghĩa transaction đã commit.

## Câu trả lời chi tiết

Hibernate trì hoãn DML để batching và ordering, nhưng query có thể trigger auto-flush nhằm giữ query semantics. Explicit flush hữu ích kiểm constraint sớm nhưng tăng round trip. Không nên gọi save cho mọi field nếu chỉ cần mutate managed entity trong transaction.

## Góc nhìn Production

Đo flush time, statement count và batch size; tránh flush trong loop lớn.

## Trade-offs

Hibernate trì hoãn DML để batching và ordering, nhưng query có thể trigger auto-flush nhằm giữ query semantics. Explicit flush hữu ích kiểm constraint sớm nhưng tăng round trip. Không nên gọi save cho mọi field nếu chỉ cần mutate managed entity trong transaction.

## Câu trả lời sai thường gặp

Dirty checking gửi UPDATE ngay khi setter được gọi và flush chính là commit database.

## Follow-up

- Flush trước query vì sao?

- Batching bị phá bởi identity generation thế nào?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
