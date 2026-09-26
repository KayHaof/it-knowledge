---
id: sql-exists-in-null
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - EXISTS
  - IN
  - "NULL"
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
    - id: exists
      required: true
      aliases:
        - EXISTS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: in
      required: true
      aliases:
        - IN
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: "null"
      required: false
      aliases:
        - "NULL"
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - IN và NOT IN luôn là phép so sánh boolean hai giá trị nên NULL không ảnh hưởng.
      penalty: 20
---

# EXISTS và IN có giống nhau khi subquery chứa NULL không?

## Rubric

### Must Include

- EXISTS

- IN

### Strong Answer Includes

- NULL

## Câu trả lời 30 giây

Không luôn. `NOT IN` gặp NULL có thể thành UNKNOWN cho mọi row và trả rỗng; `NOT EXISTS` kiểm correlation rõ hơn. Optimizer có thể biến IN thành semi-join khi semantics tương đương.

## Câu trả lời chi tiết

SQL dùng three-valued logic TRUE/FALSE/UNKNOWN. `x IN (1,NULL)` false/unknown tùy x; `x NOT IN (...)` không true nếu list có NULL. `EXISTS` chỉ quan tâm có row, còn predicate trong subquery điều khiển match. Dùng NOT EXISTS hoặc loại NULL explicit cho anti-join an toàn.

## Góc nhìn Production

Test null fixture và xem actual row counts; không thay EXISTS/IN chỉ từ benchmark một engine. Constraint NOT NULL làm reasoning chắc hơn.

## Trade-offs

SQL dùng three-valued logic TRUE/FALSE/UNKNOWN. `x IN (1,NULL)` false/unknown tùy x; `x NOT IN (...)` không true nếu list có NULL. `EXISTS` chỉ quan tâm có row, còn predicate trong subquery điều khiển match. Dùng NOT EXISTS hoặc loại NULL explicit cho anti-join an toàn.

## Câu trả lời sai thường gặp

IN và NOT IN luôn là phép so sánh boolean hai giá trị nên NULL không ảnh hưởng.

## Follow-up

- Three-valued logic ảnh hưởng WHERE thế nào?

- Semi-join plan nhận biết ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
- [Oracle MySQL — MySQL SELECT Statement Optimization](https://dev.mysql.com/doc/refman/8.4/en/select-optimization.html)
- [Oracle — Oracle SQL Language Reference - SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)
