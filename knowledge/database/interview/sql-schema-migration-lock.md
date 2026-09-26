---
id: sql-schema-migration-lock
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - schema-migration
  - locking
  - expand-contract
relatedLessons:
  - database-replication-sharding-decisions
sources:
  - title: PostgreSQL Log-Shipping Standby Servers
    url: https://www.postgresql.org/docs/current/warm-standby.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Replication Implementation
    url: https://dev.mysql.com/doc/refman/8.4/en/replication-implementation.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Replication
    url: https://www.mongodb.com/docs/manual/replication/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Sharding
    url: https://www.mongodb.com/docs/manual/sharding/
    organization: MongoDB
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
    - id: schema-migration
      required: true
      aliases:
        - schema-migration
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: locking
      required: true
      aliases:
        - locking
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: expand-contract
      required: false
      aliases:
        - expand-contract
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - DDL chỉ thay metadata nên thêm index/column trên bảng lớn luôn tức thì và không khóa.
      penalty: 20
---

# Bạn thêm column/index vào bảng lớn mà không gây downtime thế nào?

## Rubric

### Must Include

- schema-migration

- locking

### Strong Answer Includes

- expand-contract

## Câu trả lời 30 giây

Dùng expand-contract: thêm nullable/backward-compatible, deploy code dual-read/write, backfill theo chunk, validate rồi enforce/contract. DDL algorithm/lock phụ thuộc database nên phải test production-like.

## Câu trả lời chi tiết

Index online/concurrently khác nhau theo MySQL/PostgreSQL/Oracle; một số DDL vẫn lấy metadata lock hoặc rewrite table. Backfill phải bounded, resumable, tránh cạnh tranh với OLTP và có checksum. Old code phải chạy được trong rolling deploy trước khi constraint mới bắt buộc.

## Góc nhìn Production

Theo dõi lock wait, replication lag, I/O, backfill rate và abort/rollback plan. Không chạy migration khổng lồ trong request transaction.

## Trade-offs

Index online/concurrently khác nhau theo MySQL/PostgreSQL/Oracle; một số DDL vẫn lấy metadata lock hoặc rewrite table. Backfill phải bounded, resumable, tránh cạnh tranh với OLTP và có checksum. Old code phải chạy được trong rolling deploy trước khi constraint mới bắt buộc.

## Câu trả lời sai thường gặp

DDL chỉ thay metadata nên thêm index/column trên bảng lớn luôn tức thì và không khóa.

## Follow-up

- Concurrent index build failure cleanup ra sao?

- Dual-write divergence phát hiện bằng gì?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Log-Shipping Standby Servers](https://www.postgresql.org/docs/current/warm-standby.html)
- [Oracle MySQL — MySQL Replication Implementation](https://dev.mysql.com/doc/refman/8.4/en/replication-implementation.html)
- [MongoDB — MongoDB Replication](https://www.mongodb.com/docs/manual/replication/)
- [MongoDB — MongoDB Sharding](https://www.mongodb.com/docs/manual/sharding/)
