---
id: sql-inner-left-join
type: interview-question
technology: SQL
category: SQL
difficulty: junior
topics:
  - JOIN
  - INNER
  - LEFT
relatedLessons:
  - sql-logical-processing-joins
sources:
  - title: PostgreSQL Table Expressions
    url: https://www.postgresql.org/docs/current/queries-table-expressions.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL SELECT Statement Optimization
    url: https://dev.mysql.com/doc/refman/8.4/en/select-optimization.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Oracle SQL Language Reference - SELECT
    url: https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html
    organization: Oracle
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
    - id: join
      required: true
      aliases:
        - JOIN
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: inner
      required: true
      aliases:
        - INNER
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: left
      required: false
      aliases:
        - LEFT
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - LEFT JOIN luôn trả đúng một row cho mỗi row trái bất kể có bao nhiêu child.
      penalty: 20
---

# INNER JOIN và LEFT JOIN khác nhau khi bảng phải không có row match?

## Rubric

### Must Include

- JOIN

- INNER

### Strong Answer Includes

- LEFT

## Câu trả lời 30 giây

INNER chỉ giữ row có match hai phía. LEFT giữ toàn bộ row bên trái và điền NULL cho cột bên phải khi không match; điều kiện đặt sai trong WHERE có thể biến LEFT thành INNER.

## Câu trả lời chi tiết

ON xác định match; WHERE lọc result sau join. Muốn giữ parent không có child, điều kiện child nên nằm trong ON hoặc viết `WHERE child.id IS NULL` cho anti-join tùy mục tiêu. Nhiều-to-nhiều có thể nhân row và cần distinct/aggregate có chủ ý.

## Góc nhìn Production

Kiểm row count trước/sau join và null semantics bằng fixture không match. Index foreign key và predicate join, nhưng vẫn đọc plan.

## Trade-offs

ON xác định match; WHERE lọc result sau join. Muốn giữ parent không có child, điều kiện child nên nằm trong ON hoặc viết `WHERE child.id IS NULL` cho anti-join tùy mục tiêu. Nhiều-to-nhiều có thể nhân row và cần distinct/aggregate có chủ ý.

## Câu trả lời sai thường gặp

LEFT JOIN luôn trả đúng một row cho mỗi row trái bất kể có bao nhiêu child.

## Follow-up

- Đặt điều kiện status trong ON hay WHERE?

- Anti-join dùng NOT EXISTS khác LEFT JOIN NULL thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
- [Oracle MySQL — MySQL SELECT Statement Optimization](https://dev.mysql.com/doc/refman/8.4/en/select-optimization.html)
- [Oracle — Oracle SQL Language Reference - SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)
