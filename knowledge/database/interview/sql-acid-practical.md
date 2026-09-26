---
id: sql-acid-practical
type: interview-question
technology: SQL
category: SQL
difficulty: junior
topics:
  - ACID
  - transaction
  - durability
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
    - id: acid
      required: true
      aliases:
        - ACID
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: transaction
      required: true
      aliases:
        - transaction
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: durability
      required: false
      aliases:
        - durability
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - ACID nghĩa database tự rollback cả HTTP call và message broker khi transaction fail.
      penalty: 20
---

# ACID nên được giải thích bằng ví dụ nghiệp vụ nào thay vì từ viết tắt?

## Rubric

### Must Include

- ACID

- transaction

### Strong Answer Includes

- durability

## Câu trả lời 30 giây

Atomicity giữ chuyển khoản hoặc cùng thành công/cùng rollback; consistency giữ invariant như tổng debit-credit; isolation kiểm soát concurrent reads/writes; durability giữ commit sau crash theo database guarantee. ACID không tự bao gồm remote service.

## Câu trả lời chi tiết

Mỗi thuộc tính có scope và mức bảo đảm theo engine/config. Constraint/trigger giúp consistency, WAL/redo giúp durability, lock/MVCC giúp isolation; atomicity chỉ trong resource transaction. Nếu ghi DB rồi gọi Kafka/payment ngoài transaction, cần outbox/idempotency hoặc workflow.

## Góc nhìn Production

Kiểm recovery, replication/backup và isolation thực tế; đừng gọi eventual workflow “một transaction ACID” nếu có nhiều resource.

## Trade-offs

Mỗi thuộc tính có scope và mức bảo đảm theo engine/config. Constraint/trigger giúp consistency, WAL/redo giúp durability, lock/MVCC giúp isolation; atomicity chỉ trong resource transaction. Nếu ghi DB rồi gọi Kafka/payment ngoài transaction, cần outbox/idempotency hoặc workflow.

## Câu trả lời sai thường gặp

ACID nghĩa database tự rollback cả HTTP call và message broker khi transaction fail.

## Follow-up

- Durability có phụ thuộc fsync/replication không?

- Consistency trong ACID khác eventual consistency thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)
- [PostgreSQL Global Development Group — PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Oracle MySQL — MySQL InnoDB Locking and Transaction Model](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-transaction-model.html)
- [Oracle — Oracle Data Concurrency and Consistency](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html)
