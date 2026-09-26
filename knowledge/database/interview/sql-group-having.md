---
id: sql-group-having
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - GROUP BY
  - HAVING
  - aggregate
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
    - id: group-by
      required: true
      aliases:
        - GROUP BY
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: having
      required: true
      aliases:
        - HAVING
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: aggregate
      required: false
      aliases:
        - aggregate
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - HAVING chỉ là tên khác của WHERE nên đặt điều kiện ở đâu cũng cho cùng kết quả.
      penalty: 20
---

# Khi nào điều kiện nên nằm ở WHERE và khi nào ở HAVING?

## Rubric

### Must Include

- GROUP BY

- HAVING

### Strong Answer Includes

- aggregate

## Câu trả lời 30 giây

WHERE lọc row trước khi group để giảm dữ liệu; HAVING lọc group sau aggregate như COUNT/SUM. Đưa điều kiện row vào HAVING thường khó tối ưu và có thể đổi semantics với NULL.

## Câu trả lời chi tiết

`WHERE order_status='PAID' GROUP BY customer HAVING COUNT(*)>3` đếm chỉ paid orders; đặt status trong HAVING không tương đương. SQL mode/functional dependency có thể yêu cầu mọi cột SELECT không aggregate xuất hiện trong GROUP BY. Aggregate trên LEFT JOIN cần phân biệt COUNT(*) và COUNT(child.id).

## Góc nhìn Production

Đo rows vào aggregate, memory/hash spill và plan; lọc sớm nhưng không hy sinh đúng nghiệp vụ. Test nhóm rỗng và NULL.

## Trade-offs

`WHERE order_status='PAID' GROUP BY customer HAVING COUNT(*)>3` đếm chỉ paid orders; đặt status trong HAVING không tương đương. SQL mode/functional dependency có thể yêu cầu mọi cột SELECT không aggregate xuất hiện trong GROUP BY. Aggregate trên LEFT JOIN cần phân biệt COUNT(*) và COUNT(child.id).

## Câu trả lời sai thường gặp

HAVING chỉ là tên khác của WHERE nên đặt điều kiện ở đâu cũng cho cùng kết quả.

## Follow-up

- COUNT(*) khác COUNT(column) khi nào?

- Group aggregate spill ra disk nhận biết ở đâu?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
- [Oracle MySQL — MySQL SELECT Statement Optimization](https://dev.mysql.com/doc/refman/8.4/en/select-optimization.html)
- [Oracle — Oracle SQL Language Reference - SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)
