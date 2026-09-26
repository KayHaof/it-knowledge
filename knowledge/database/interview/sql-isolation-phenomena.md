---
id: sql-isolation-phenomena
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - isolation
  - dirty-read
  - phantom
relatedLessons:
  - transactions-mvcc-deadlocks
sources:
  - title: PostgreSQL Concurrency Control
    url: https://www.postgresql.org/docs/current/mvcc.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Transaction Isolation
    url: https://www.postgresql.org/docs/current/transaction-iso.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL InnoDB Locking and Transaction Model
    url: https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-transaction-model.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Oracle Data Concurrency and Consistency
    url: https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html
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
    - id: isolation
      required: true
      aliases:
        - isolation
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: dirty-read
      required: true
      aliases:
        - dirty-read
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: phantom
      required: false
      aliases:
        - phantom
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - REPEATABLE READ luôn ngăn mọi phantom/lost update trên mọi database.
      penalty: 20
---

# Dirty read, non-repeatable read và phantom read khác nhau thế nào?

## Rubric

### Must Include

- isolation

- dirty-read

### Strong Answer Includes

- phantom

## Câu trả lời 30 giây

Dirty read đọc dữ liệu chưa commit; non-repeatable read đọc cùng row ra value khác; phantom là cùng predicate thấy thêm/bớt row. Mức isolation và engine MVCC/lock quyết định hiện tượng nào bị chặn.

## Câu trả lời chi tiết

READ COMMITTED thường ngăn dirty nhưng mỗi statement có snapshot mới; REPEATABLE READ giữ snapshot/row semantics khác engine; SERIALIZABLE mô phỏng thứ tự tuần tự bằng lock/abort. Snapshot không tự ngăn lost update nếu write không có version/predicate. SQL standard và implementation thực tế có khác biệt cần kiểm.

## Góc nhìn Production

Test concurrency bằng engine/version thật, đo lock/serialization abort và latency. Chọn mức theo invariant thay vì luôn dùng cao nhất.

## Trade-offs

READ COMMITTED thường ngăn dirty nhưng mỗi statement có snapshot mới; REPEATABLE READ giữ snapshot/row semantics khác engine; SERIALIZABLE mô phỏng thứ tự tuần tự bằng lock/abort. Snapshot không tự ngăn lost update nếu write không có version/predicate. SQL standard và implementation thực tế có khác biệt cần kiểm.

## Câu trả lời sai thường gặp

REPEATABLE READ luôn ngăn mọi phantom/lost update trên mọi database.

## Follow-up

- PostgreSQL và MySQL RR khác semantics nào?

- Lost update cần optimistic version ở đâu?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)
- [PostgreSQL Global Development Group — PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Oracle MySQL — MySQL InnoDB Locking and Transaction Model](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-transaction-model.html)
- [Oracle — Oracle Data Concurrency and Consistency](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html)
