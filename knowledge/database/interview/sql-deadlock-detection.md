---
id: sql-deadlock-detection
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - deadlock
  - lock-order
  - retry
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
    - id: deadlock
      required: true
      aliases:
        - deadlock
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: lock-order
      required: true
      aliases:
        - lock-order
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: retry
      required: false
      aliases:
        - retry
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Deadlock chỉ là query chậm nên tăng timeout sẽ giải quyết vĩnh viễn.
      penalty: 20
---

# Ứng dụng nên phản ứng với database deadlock như thế nào?

## Rubric

### Must Include

- deadlock

- lock-order

### Strong Answer Includes

- retry

## Câu trả lời 30 giây

Database thường abort một transaction để phá cycle. Ứng dụng có thể retry transaction ngắn nếu operation idempotent, đồng thời sửa lock order/index/transaction scope; retry mù chỉ lặp outage.

## Câu trả lời chi tiết

Deadlock graph có thể gồm row/index/gap locks và thứ tự update khác nhau. Chuẩn hóa lock ordering, lấy rows deterministic, giảm hold time và index predicate giảm cycle. Retry cần jitter, cap và phân loại business conflict; external side effect phải nằm ngoài hoặc có idempotency.

## Góc nhìn Production

Metric deadlock/lock timeout, victim query, retry success và p99; alert theo rate. Test concurrent scenarios trong engine thật.

## Trade-offs

Deadlock graph có thể gồm row/index/gap locks và thứ tự update khác nhau. Chuẩn hóa lock ordering, lấy rows deterministic, giảm hold time và index predicate giảm cycle. Retry cần jitter, cap và phân loại business conflict; external side effect phải nằm ngoài hoặc có idempotency.

## Câu trả lời sai thường gặp

Deadlock chỉ là query chậm nên tăng timeout sẽ giải quyết vĩnh viễn.

## Follow-up

- Lock timeout khác deadlock victim thế nào?

- Retry transaction có thể duplicate side effect ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)
- [PostgreSQL Global Development Group — PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Oracle MySQL — MySQL InnoDB Locking and Transaction Model](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-transaction-model.html)
- [Oracle — Oracle Data Concurrency and Consistency](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html)
