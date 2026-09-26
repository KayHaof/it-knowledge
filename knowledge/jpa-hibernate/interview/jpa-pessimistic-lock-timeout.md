---
id: jpa-pessimistic-lock-timeout
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: senior
topics:
  - pessimistic-locking
  - timeout
  - deadlock
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
    - id: pessimistic-locking
      required: true
      aliases:
        - pessimistic-locking
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: timeout
      required: true
      aliases:
        - timeout
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: deadlock
      required: false
      aliases:
        - deadlock
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Pessimistic lock luôn nhanh hơn optimistic lock vì loại bỏ retry.
      penalty: 20
---

# Pessimistic lock nên dùng trong tình huống nào và rủi ro gì?

## Rubric

### Must Include

- pessimistic-locking

- timeout

### Strong Answer Includes

- deadlock

## Câu trả lời 30 giây

Dùng khi contention cao và cần serialize critical row, nhưng giữ lock lâu gây blocking/deadlock. Phải đặt lock timeout, transaction ngắn và có fallback.

## Câu trả lời chi tiết

`SELECT FOR UPDATE` tùy database sẽ khóa row/gap khác nhau; lock mode và timeout hint không hoàn toàn portable. Tôi giữ thứ tự lock nhất quán, index predicate để tránh scan lock rộng và xử lý retry deadlock. Không khóa cả bảng để “chắc chắn”.

## Góc nhìn Production

Theo dõi lock wait/deadlock/rollback và database-specific plan; load test contention.

## Trade-offs

`SELECT FOR UPDATE` tùy database sẽ khóa row/gap khác nhau; lock mode và timeout hint không hoàn toàn portable. Tôi giữ thứ tự lock nhất quán, index predicate để tránh scan lock rộng và xử lý retry deadlock. Không khóa cả bảng để “chắc chắn”.

## Câu trả lời sai thường gặp

Pessimistic lock luôn nhanh hơn optimistic lock vì loại bỏ retry.

## Follow-up

- Gap lock MySQL ảnh hưởng range thế nào?

- Retry deadlock có điều kiện gì?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)
- [PostgreSQL Global Development Group — PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Oracle MySQL — MySQL InnoDB Locking and Transaction Model](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-transaction-model.html)
- [Oracle — Oracle Data Concurrency and Consistency](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html)
