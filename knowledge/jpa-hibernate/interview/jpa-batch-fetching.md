---
id: jpa-batch-fetching
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - batch-fetching
  - N+1
  - IN
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
    - id: batch-fetching
      required: true
      aliases:
        - batch-fetching
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
    - id: in
      required: false
      aliases:
        - IN
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật batch fetching nghĩa mọi association luôn được tải bằng một SELECT duy nhất.
      penalty: 20
---

# Batch fetching giảm N+1 nhưng không biến nó thành một query duy nhất như thế nào?

## Rubric

### Must Include

- batch-fetching

- N+1

### Strong Answer Includes

- IN

## Câu trả lời 30 giây

Hibernate gom nhiều lazy key vào một số SELECT `IN` theo batch size, giảm round-trip nhưng vẫn có nhiều query và giới hạn parameter. Nó là trade-off giữa latency, row count và memory, không thay thế fetch plan.

## Câu trả lời chi tiết

Khi truy cập một proxy, batch fetch queue chứa các id lân cận; provider load theo batch. Batch size quá nhỏ còn nhiều round-trip, quá lớn tạo SQL/IN dài và hydrate dữ liệu thừa. `@BatchSize`/default cần đo với database parameter limit và access pattern. Fetch join cho graph chắc chắn có thể tốt hơn cho read endpoint, nhưng row explosion có thể ngược lại.

## Góc nhìn Production

Theo dõi query count, IN size, DB parse/plan và p99. Bật statistics có kiểm soát và regression test endpoint hot.

## Trade-offs

Khi truy cập một proxy, batch fetch queue chứa các id lân cận; provider load theo batch. Batch size quá nhỏ còn nhiều round-trip, quá lớn tạo SQL/IN dài và hydrate dữ liệu thừa. `@BatchSize`/default cần đo với database parameter limit và access pattern. Fetch join cho graph chắc chắn có thể tốt hơn cho read endpoint, nhưng row explosion có thể ngược lại.

## Câu trả lời sai thường gặp

Bật batch fetching nghĩa mọi association luôn được tải bằng một SELECT duy nhất.

## Follow-up

- Batch size nên đặt theo gì?

- Database giới hạn IN parameter ảnh hưởng ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Spring — Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)
