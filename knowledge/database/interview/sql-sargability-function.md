---
id: sql-sargability-function
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - sargability
  - functions
  - predicates
relatedLessons:
  - database-query-plan
sources:
  - title: PostgreSQL EXPLAIN
    url: https://www.postgresql.org/docs/current/sql-explain.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Using EXPLAIN
    url: https://www.postgresql.org/docs/current/using-explain.html
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
    - id: sargability
      required: true
      aliases:
        - sargability
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: functions
      required: true
      aliases:
        - functions
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: predicates
      required: false
      aliases:
        - predicates
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Optimizer luôn đảo function khỏi column nên mọi biểu thức có index tương đương.
      penalty: 20
---

# Vì sao bọc column trong function có thể làm mất index seek?

## Rubric

### Must Include

- sargability

- functions

### Strong Answer Includes

- predicates

## Câu trả lời 30 giây

Predicate như `DATE(created_at)=...` cần tính function cho nhiều row nên index trên `created_at` khó seek trực tiếp. Viết range half-open hoặc functional index phù hợp engine để giữ sargability.

## Câu trả lời chi tiết

`created_at >= start AND created_at < next_start` biểu diễn ngày mà không transform từng value. Cast/collation/implicit conversion cũng phá access path hoặc đổi semantics timezone. Functional/generated-column index có thể giúp nhưng tăng write cost và phải nhất quán expression.

## Góc nhìn Production

EXPLAIN plan trước/sau với timezone/data type production. Static review query và regression test boundary DST/precision.

## Trade-offs

`created_at >= start AND created_at < next_start` biểu diễn ngày mà không transform từng value. Cast/collation/implicit conversion cũng phá access path hoặc đổi semantics timezone. Functional/generated-column index có thể giúp nhưng tăng write cost và phải nhất quán expression.

## Câu trả lời sai thường gặp

Optimizer luôn đảo function khỏi column nên mọi biểu thức có index tương đương.

## Follow-up

- Implicit cast nào làm scan?

- Functional index khác materialized column thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)
- [PostgreSQL Global Development Group — Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
