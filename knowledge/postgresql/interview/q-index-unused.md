---
id: q-index-unused
type: interview-question
technology: PostgreSQL
category: PostgreSQL
difficulty: middle
topics:
  - index
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
    - id: index
      required: true
      aliases:
        - index
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: optimizer
      required: true
      aliases:
        - optimizer
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Có index thì database luôn đọc index.
      penalty: 20
---

# Tại sao database có index nhưng vẫn chọn full table scan?

## Rubric

### Must Include

- index

- optimizer

### Strong Answer Includes

## Câu trả lời 30 giây

Optimizer ước lượng sequential scan rẻ hơn khi predicate trả nhiều row, table nhỏ, statistics hoặc cost model cho thấy random access đắt, hay query không dùng được prefix/expression của index.

## Câu trả lời chi tiết

Tôi lấy EXPLAIN ANALYZE BUFFERS với bind value đại diện, so estimate/actual rows, kiểm statistics, predicate, cast, collation và composite prefix. Index không bắt buộc được dùng; nó có write/storage cost. Fix có thể là update stats, query rewrite hoặc index phù hợp, sau đó benchmark.

## Góc nhìn Production

Không ép hint trước khi hiểu cardinality; plan có thể khác theo parameter và data distribution.

## Trade-offs

Tôi lấy EXPLAIN ANALYZE BUFFERS với bind value đại diện, so estimate/actual rows, kiểm statistics, predicate, cast, collation và composite prefix. Index không bắt buộc được dùng; nó có write/storage cost. Fix có thể là update stats, query rewrite hoặc index phù hợp, sau đó benchmark.

## Câu trả lời sai thường gặp

Có index thì database luôn đọc index.

## Follow-up

- Index selectivity là gì?

- Index-only scan cần điều kiện nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)
- [PostgreSQL Global Development Group — Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
