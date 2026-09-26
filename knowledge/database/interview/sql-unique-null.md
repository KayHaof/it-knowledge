---
id: sql-unique-null
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - unique-constraint
  - "NULL"
  - business-key
relatedLessons:
  - relational-database
sources:
  - title: PostgreSQL concurrency control
    url: https://www.postgresql.org/docs/current/mvcc.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL InnoDB transaction model
    url: https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Oracle Database concepts
    url: https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/
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
    - id: unique-constraint
      required: true
      aliases:
        - unique-constraint
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: "null"
      required: true
      aliases:
        - "NULL"
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: business-key
      required: false
      aliases:
        - business-key
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - UNIQUE luôn coi mọi NULL là cùng một giá trị trên mọi SQL database.
      penalty: 20
---

# UNIQUE constraint xử lý nhiều NULL giống nhau ở mọi database không?

## Rubric

### Must Include

- unique-constraint

- NULL

### Strong Answer Includes

- business-key

## Câu trả lời 30 giây

Không nên giả định. SQL/database có semantics khác về NULL trong unique index; PostgreSQL còn có lựa chọn `NULLS NOT DISTINCT` ở version hỗ trợ. Business rule cần constraint/index phù hợp engine.

## Câu trả lời chi tiết

NULL unknown nên nhiều engine cho phép nhiều NULL trong unique key, nhưng composite/partial index có nuance. Muốn “mỗi tenant chỉ một active row” thường dùng partial/filtered unique index hoặc generated sentinel, tùy engine. Application check riêng gặp race.

## Góc nhìn Production

Test DDL trên engine/version production và migration rollback. Đưa invariant durable vào database, không chỉ service validation.

## Trade-offs

NULL unknown nên nhiều engine cho phép nhiều NULL trong unique key, nhưng composite/partial index có nuance. Muốn “mỗi tenant chỉ một active row” thường dùng partial/filtered unique index hoặc generated sentinel, tùy engine. Application check riêng gặp race.

## Câu trả lời sai thường gặp

UNIQUE luôn coi mọi NULL là cùng một giá trị trên mọi SQL database.

## Follow-up

- Partial unique index dùng cho soft delete thế nào?

- Composite unique với NULL có bẫy gì?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL concurrency control](https://www.postgresql.org/docs/current/mvcc.html)
- [Oracle MySQL — MySQL InnoDB transaction model](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html)
- [Oracle — Oracle Database concepts](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/)
