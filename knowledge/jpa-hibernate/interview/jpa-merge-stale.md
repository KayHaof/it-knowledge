---
id: jpa-merge-stale
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - merge
  - detached
  - lost-update
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
    - id: merge
      required: true
      aliases:
        - merge
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: detached
      required: true
      aliases:
        - detached
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: lost-update
      required: false
      aliases:
        - lost-update
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Merge chỉ cập nhật field đã thay đổi từ lúc đọc và luôn tự resolve conflict.
      penalty: 20
---

# `merge` detached entity có thể làm mất update của người khác thế nào?

## Rubric

### Must Include

- merge

- detached

### Strong Answer Includes

- lost-update

## Câu trả lời 30 giây

Merge copy toàn bộ state detached vào managed instance, kể cả field stale, nên có thể ghi đè thay đổi mới hơn. Dùng DTO patch, `@Version` và chỉ cập nhật field được phép để tránh lost update.

## Câu trả lời chi tiết

Caller đọc entity version 5, người khác commit version 6, rồi caller merge bản cũ. Nếu không có optimistic locking, UPDATE có thể overwrite; với `@Version`, commit ném conflict để retry/reconcile. Merge trả managed copy, object detached gốc vẫn detached. Không merge object deserialize không tin cậy mà không authorization.

## Góc nhìn Production

Theo dõi OptimisticLockException/conflict rate và UX retry. Audit field changes, giới hạn payload và dùng update statement có version predicate.

## Trade-offs

Caller đọc entity version 5, người khác commit version 6, rồi caller merge bản cũ. Nếu không có optimistic locking, UPDATE có thể overwrite; với `@Version`, commit ném conflict để retry/reconcile. Merge trả managed copy, object detached gốc vẫn detached. Không merge object deserialize không tin cậy mà không authorization.

## Câu trả lời sai thường gặp

Merge chỉ cập nhật field đã thay đổi từ lúc đọc và luôn tự resolve conflict.

## Follow-up

- Merge trả instance nào?

- Patch DTO khác full replacement thế nào?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
