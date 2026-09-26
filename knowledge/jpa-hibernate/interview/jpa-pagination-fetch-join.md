---
id: jpa-pagination-fetch-join
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - pagination
  - fetch-join
  - row-explosion
relatedLessons:
  - sql-keyset-pagination
sources:
  - title: PostgreSQL LIMIT and OFFSET
    url: https://www.postgresql.org/docs/current/queries-limit.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Row and Array Comparisons
    url: https://www.postgresql.org/docs/current/functions-comparisons.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Indexes and ORDER BY
    url: https://www.postgresql.org/docs/current/indexes-ordering.html
    organization: PostgreSQL Global Development Group
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
    - id: pagination
      required: true
      aliases:
        - pagination
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fetch-join
      required: true
      aliases:
        - fetch-join
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: row-explosion
      required: false
      aliases:
        - row-explosion
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Thêm `DISTINCT` vào JPQL luôn làm collection fetch join pagination chính xác và rẻ.
      penalty: 20
---

# Vì sao collection fetch join kết hợp pagination dễ sai?

## Rubric

### Must Include

- pagination

- fetch-join

### Strong Answer Includes

- row-explosion

## Câu trả lời 30 giây

Join nhân parent rows nên limit/offset áp trên row join, không phải parent; provider có thể warning và paginate in-memory. Dùng hai bước ID/page rồi fetch, hoặc DTO/query phù hợp.

## Câu trả lời chi tiết

Một parent có nhiều child làm duplicate và thiếu parent ở page boundaries. `distinct` có thể deduplicate sau SQL nhưng không giải cardinality và memory. Keyset pagination + batch fetch thường ổn định hơn offset cho dữ liệu lớn.

## Góc nhìn Production

Kiểm page count, SQL row count, memory và latency với child skew; không tắt warning.

## Trade-offs

Một parent có nhiều child làm duplicate và thiếu parent ở page boundaries. `distinct` có thể deduplicate sau SQL nhưng không giải cardinality và memory. Keyset pagination + batch fetch thường ổn định hơn offset cho dữ liệu lớn.

## Câu trả lời sai thường gặp

Thêm `DISTINCT` vào JPQL luôn làm collection fetch join pagination chính xác và rẻ.

## Follow-up

- Two-step pagination thiết kế thế nào?

- Keyset cursor cần sort key nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL LIMIT and OFFSET](https://www.postgresql.org/docs/current/queries-limit.html)
- [PostgreSQL Global Development Group — PostgreSQL Row and Array Comparisons](https://www.postgresql.org/docs/current/functions-comparisons.html)
- [PostgreSQL Global Development Group — PostgreSQL Indexes and ORDER BY](https://www.postgresql.org/docs/current/indexes-ordering.html)
