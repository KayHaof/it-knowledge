---
id: q-n-plus-one
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - jpa
  - performance
relatedLessons:
  - jpa-n-plus-one
sources:
  - title: Hibernate ORM User Guide
    url: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html
    organization: Hibernate
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
        - jpa
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: performance
      required: true
      aliases:
        - performance
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đổi mọi association sang EAGER là hết N+1.
      penalty: 20
---

# N+1 query là gì và tại sao EAGER không phải đáp án?

## Rubric

### Must Include

- jpa

- performance

### Strong Answer Includes

## Câu trả lời 30 giây

Một query lấy N parent rồi N query lấy association. EAGER có thể vẫn sinh secondary select và tải dư. Fix theo use case bằng fetch join, EntityGraph, DTO projection hoặc batch fetching, rồi xác minh SQL.

## Câu trả lời chi tiết

N+1 xuất hiện khi fetch plan không khớp dữ liệu cần. Tôi bật SQL statistics/APM, đếm query và xem row/cardinality. Fetch join giảm round-trip nhưng có thể cartesian/pagination issue; EntityGraph khai báo fetch plan; DTO projection lấy đúng shape; batch giảm N thành nhóm nhưng không luôn còn một query.

## Góc nhìn Production

Thêm regression test query count cho hot endpoint và kiểm p95/database load sau sửa.

## Trade-offs

N+1 xuất hiện khi fetch plan không khớp dữ liệu cần. Tôi bật SQL statistics/APM, đếm query và xem row/cardinality. Fetch join giảm round-trip nhưng có thể cartesian/pagination issue; EntityGraph khai báo fetch plan; DTO projection lấy đúng shape; batch giảm N thành nhóm nhưng không luôn còn một query.

## Câu trả lời sai thường gặp

Đổi mọi association sang EAGER là hết N+1.

## Follow-up

- JOIN FETCH collection với pagination có rủi ro gì?

- Batch fetching trade-off ra sao?

## Nguồn chính thống

- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
