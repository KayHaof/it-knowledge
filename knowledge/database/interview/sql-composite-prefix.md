---
id: sql-composite-prefix
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - composite-index
  - leftmost-prefix
  - selectivity
relatedLessons:
  - composite-covering-index-explain
sources:
  - title: PostgreSQL Indexes
    url: https://www.postgresql.org/docs/current/indexes.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Using EXPLAIN
    url: https://www.postgresql.org/docs/current/using-explain.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Optimization and Indexes
    url: https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Optimizing Queries with EXPLAIN
    url: https://dev.mysql.com/doc/refman/8.4/en/using-explain.html
    organization: Oracle MySQL
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
    - id: composite-index
      required: true
      aliases:
        - composite-index
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: leftmost-prefix
      required: true
      aliases:
        - leftmost-prefix
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: selectivity
      required: false
      aliases:
        - selectivity
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Optimizer có thể dùng mọi cột trong composite index hiệu quả như các index đơn độc lập.
      penalty: 20
---

# Leftmost-prefix rule của composite index có ý nghĩa gì?

## Rubric

### Must Include

- composite-index

- leftmost-prefix

### Strong Answer Includes

- selectivity

## Câu trả lời 30 giây

Index `(tenant_id,status,created_at)` được sắp theo tuple đó; predicate từ prefix đầu giúp seek/range tốt hơn. Bỏ cột đầu có thể buộc scan index rộng hoặc skip-scan tùy engine.

## Câu trả lời chi tiết

Equality trên leading columns rồi range trên column sau thường tận dụng order tốt; điều kiện sau range có thể filter nhưng không thu hẹp seek như prefix. Column order theo workload, selectivity và sort/pagination, không chỉ distinct count. Một index không phục vụ mọi query shape.

## Góc nhìn Production

Capture top query predicates/order and compare plan under tenant skew. Xóa index trùng chỉ sau usage/write-cost review.

## Trade-offs

Equality trên leading columns rồi range trên column sau thường tận dụng order tốt; điều kiện sau range có thể filter nhưng không thu hẹp seek như prefix. Column order theo workload, selectivity và sort/pagination, không chỉ distinct count. Một index không phục vụ mọi query shape.

## Câu trả lời sai thường gặp

Optimizer có thể dùng mọi cột trong composite index hiệu quả như các index đơn độc lập.

## Follow-up

- Equality/range order chọn thế nào?

- Index phục vụ ORDER BY mà không filter ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL Global Development Group — PostgreSQL Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [Oracle MySQL — MySQL Optimization and Indexes](https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html)
- [Oracle MySQL — MySQL Optimizing Queries with EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/using-explain.html)
