---
id: postgresql-statistics-misestimation
type: interview-question
technology: PostgreSQL
category: PostgreSQL
difficulty: senior
topics:
  - statistics
  - cardinality
  - ANALYZE
relatedLessons:
  - postgresql-planner-statistics
sources:
  - title: PostgreSQL Statistics Used by the Planner
    url: https://www.postgresql.org/docs/current/planner-stats.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Using EXPLAIN
    url: https://www.postgresql.org/docs/current/using-explain.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL ANALYZE
    url: https://www.postgresql.org/docs/current/sql-analyze.html
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
    - id: statistics
      required: true
      aliases:
        - statistics
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: cardinality
      required: true
      aliases:
        - cardinality
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: analyze
      required: false
      aliases:
        - ANALYZE
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - PostgreSQL đo actual rows mỗi lần query nên statistics không thể stale.
      penalty: 20
---

# Cardinality misestimate trong PostgreSQL có thể khiến plan sai như thế nào?

## Rubric

### Must Include

- statistics

- cardinality

### Strong Answer Includes

- ANALYZE

## Câu trả lời 30 giây

Optimizer ước lượng rows thấp/cao dẫn tới chọn nested loop, join order hoặc memory sai. Skew/correlation giữa columns làm histogram đơn không đủ; ANALYZE/extended statistics có thể cải thiện.

## Câu trả lời chi tiết

Planner dùng statistics target, most-common-values, histogram và ndistinct để estimate selectivity. Predicate correlated như country/status phá giả định độc lập; extended stats dependencies/MCV giúp. Stale stats sau bulk load làm estimate lệch. Force enable_nestloop off chỉ là chẩn đoán, không phải fix.

## Góc nhìn Production

So sánh estimated/actual rows trong EXPLAIN ANALYZE, monitor autovacuum/analyze lag và plan regressions. Tăng statistics target có CPU/storage cost.

## Trade-offs

Planner dùng statistics target, most-common-values, histogram và ndistinct để estimate selectivity. Predicate correlated như country/status phá giả định độc lập; extended stats dependencies/MCV giúp. Stale stats sau bulk load làm estimate lệch. Force enable_nestloop off chỉ là chẩn đoán, không phải fix.

## Câu trả lời sai thường gặp

PostgreSQL đo actual rows mỗi lần query nên statistics không thể stale.

## Follow-up

- Extended statistics chọn columns nào?

- Autovacuum analyze threshold ảnh hưởng deploy bulk ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Statistics Used by the Planner](https://www.postgresql.org/docs/current/planner-stats.html)
- [PostgreSQL Global Development Group — PostgreSQL Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL Global Development Group — PostgreSQL ANALYZE](https://www.postgresql.org/docs/current/sql-analyze.html)
