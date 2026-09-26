---
id: sql-null-three-valued
type: interview-question
technology: SQL
category: SQL
difficulty: junior
topics:
  - "NULL"
  - three-valued-logic
  - COALESCE
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
    - id: "null"
      required: true
      aliases:
        - "NULL"
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: three-valued-logic
      required: true
      aliases:
        - three-valued-logic
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: coalesce
      required: false
      aliases:
        - COALESCE
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - NULL là giá trị đặc biệt nên `= NULL` giống mọi ngôn ngữ so sánh null.
      penalty: 20
---

# Tại sao `column = NULL` không trả row nào?

## Rubric

### Must Include

- NULL

- three-valued-logic

### Strong Answer Includes

- COALESCE

## Câu trả lời 30 giây

NULL biểu diễn unknown/absent, không bằng bất kỳ value nào kể cả NULL. Dùng `IS NULL`/`IS NOT NULL`; WHERE chỉ giữ TRUE nên phép so sánh UNKNOWN bị loại.

## Câu trả lời chi tiết

`NULL = NULL` là UNKNOWN, cũng như `5 <> NULL`. AND/OR có truth table ba giá trị, nên thêm điều kiện có thể chuyển UNKNOWN thành FALSE hoặc vẫn UNKNOWN. COALESCE chọn fallback để hiển thị/tính toán nhưng có thể che distinction absent vs empty.

## Góc nhìn Production

Thiết kế nullable/NOT NULL theo domain và test index/predicate với NULL. Không dùng COALESCE trong predicate nếu làm mất sargability mà chưa có functional index.

## Trade-offs

`NULL = NULL` là UNKNOWN, cũng như `5 <> NULL`. AND/OR có truth table ba giá trị, nên thêm điều kiện có thể chuyển UNKNOWN thành FALSE hoặc vẫn UNKNOWN. COALESCE chọn fallback để hiển thị/tính toán nhưng có thể che distinction absent vs empty.

## Câu trả lời sai thường gặp

NULL là giá trị đặc biệt nên `= NULL` giống mọi ngôn ngữ so sánh null.

## Follow-up

- COUNT(column) bỏ qua NULL ra sao?

- COALESCE ảnh hưởng index thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
- [Oracle MySQL — MySQL SELECT Statement Optimization](https://dev.mysql.com/doc/refman/8.4/en/select-optimization.html)
- [Oracle — Oracle SQL Language Reference - SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)
