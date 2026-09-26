---
id: project-experience-n-plus-one
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: middle
topics:
  - JPA
  - N+1
  - debugging
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
    - id: jpa
      required: true
      aliases:
        - JPA
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: n-1
      required: true
      aliases:
        - N+1
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: debugging
      required: false
      aliases:
        - debugging
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đổi mọi association sang EAGER là fix N+1 an toàn.
      penalty: 20
---

# Khi interviewer hỏi “N+1 trong project xử lý thế nào?”, nên trình bày bằng evidence nào?

## Rubric

### Must Include

- JPA

- N+1

### Strong Answer Includes

- debugging

## Câu trả lời 30 giây

Tôi mô tả endpoint/query shape, cách phát hiện bằng SQL log hoặc query-count test, rồi chọn fetch plan/projection theo use case. Tôi không nói EAGER tự giải quyết N+1.

## Câu trả lời chi tiết

Tôi so sánh trước/sau về statement count, rows, p95 và memory; xem fetch join, EntityGraph, batch fetch hay DTO projection cái nào phù hợp. Collection pagination/row explosion và authorization predicate phải được kiểm. Nếu chưa đo production, tôi gọi số liệu là mục tiêu test chứ không bịa.

## Góc nhìn Production

Có query-count regression, slow query trace và plan review; giữ transaction boundary rõ.

## Trade-offs

Tôi so sánh trước/sau về statement count, rows, p95 và memory; xem fetch join, EntityGraph, batch fetch hay DTO projection cái nào phù hợp. Collection pagination/row explosion và authorization predicate phải được kiểm. Nếu chưa đo production, tôi gọi số liệu là mục tiêu test chứ không bịa.

## Câu trả lời sai thường gặp

Đổi mọi association sang EAGER là fix N+1 an toàn.

## Follow-up

- Fetch join pagination có bẫy gì?

- Bạn đo N+1 ở production ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
