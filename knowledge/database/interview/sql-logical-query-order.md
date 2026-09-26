---
id: sql-logical-query-order
type: interview-question
technology: SQL
category: SQL
difficulty: junior
topics:
  - SELECT
  - logical-processing
  - alias
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
    - id: select
      required: true
      aliases:
        - SELECT
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: logical-processing
      required: true
      aliases:
        - logical-processing
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: alias
      required: false
      aliases:
        - alias
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Database luôn chạy đúng từ dòng SELECT xuống dưới nên WHERE có thể dùng alias vừa đặt.
      penalty: 20
---

# SQL xử lý FROM, WHERE, GROUP BY và SELECT theo thứ tự logic nào?

## Rubric

### Must Include

- SELECT

- logical-processing

### Strong Answer Includes

- alias

## Câu trả lời 30 giây

Logic thường là FROM/JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY và FETCH/LIMIT. Đây là thứ tự suy luận, không nhất thiết là thứ tự optimizer thực thi vật lý.

## Câu trả lời chi tiết

FROM tạo row source, WHERE lọc row trước aggregate, GROUP BY tạo groups, HAVING lọc group, SELECT tạo projection rồi ORDER/FETCH. Vì alias SELECT chưa tồn tại ở WHERE nên thường không dùng được ở đó. Optimizer có thể push predicate hoặc đổi join order miễn kết quả theo semantics.

## Góc nhìn Production

Đọc execution plan thay vì suy luận từ thứ tự viết; kiểm null, cardinality và row explosion. Tránh SELECT * ở API ổn định.

## Trade-offs

FROM tạo row source, WHERE lọc row trước aggregate, GROUP BY tạo groups, HAVING lọc group, SELECT tạo projection rồi ORDER/FETCH. Vì alias SELECT chưa tồn tại ở WHERE nên thường không dùng được ở đó. Optimizer có thể push predicate hoặc đổi join order miễn kết quả theo semantics.

## Câu trả lời sai thường gặp

Database luôn chạy đúng từ dòng SELECT xuống dưới nên WHERE có thể dùng alias vừa đặt.

## Follow-up

- Optimizer được phép đổi thứ tự join khi nào?

- HAVING khác WHERE ở aggregation nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
- [Oracle MySQL — MySQL SELECT Statement Optimization](https://dev.mysql.com/doc/refman/8.4/en/select-optimization.html)
- [Oracle — Oracle SQL Language Reference - SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)
