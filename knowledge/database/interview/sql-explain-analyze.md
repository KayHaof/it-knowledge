---
id: sql-explain-analyze
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - EXPLAIN
  - actual-rows
  - optimizer
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
    - id: explain
      required: true
      aliases:
        - EXPLAIN
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: actual-rows
      required: true
      aliases:
        - actual-rows
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: optimizer
      required: false
      aliases:
        - optimizer
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - EXPLAIN luôn thực thi query đầy đủ nên không cần ANALYZE.
      penalty: 20
---

# EXPLAIN và EXPLAIN ANALYZE trả lời khác nhau thế nào?

## Rubric

### Must Include

- EXPLAIN

- actual-rows

### Strong Answer Includes

- optimizer

## Câu trả lời 30 giây

EXPLAIN cho estimated plan; EXPLAIN ANALYZE chạy query và thêm actual timing/rows/loops. ANALYZE có side effect với INSERT/UPDATE nếu không dùng transaction rollback, nên dùng thận trọng.

## Câu trả lời chi tiết

So sánh estimated vs actual rows để tìm cardinality misestimate, rồi xem join method, buffers, sort spill và loops. Timing instrumentation có overhead; một lần chạy bị cache/warmup ảnh hưởng. PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` và engine khác có option khác.

## Góc nhìn Production

Chạy trên sanitized/replica hoặc transaction rollback, giới hạn timeout. Lưu plan hash và regression threshold cho query critical.

## Trade-offs

So sánh estimated vs actual rows để tìm cardinality misestimate, rồi xem join method, buffers, sort spill và loops. Timing instrumentation có overhead; một lần chạy bị cache/warmup ảnh hưởng. PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` và engine khác có option khác.

## Câu trả lời sai thường gặp

EXPLAIN luôn thực thi query đầy đủ nên không cần ANALYZE.

## Follow-up

- Estimated rows sai khiến join đổi thế nào?

- EXPLAIN DML an toàn trong production ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)
- [PostgreSQL Global Development Group — Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
