---
id: sql-read-write-split
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - read-write-split
  - replica
  - routing
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
    - id: read-write-split
      required: true
      aliases:
        - read-write-split
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: replica
      required: true
      aliases:
        - replica
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: routing
      required: false
      aliases:
        - routing
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần route mọi SELECT sang replica là scale tuyến tính mà không đổi behavior.
      penalty: 20
---

# Read/write splitting có thể làm transaction semantics sai thế nào?

## Rubric

### Must Include

- read-write-split

- replica

### Strong Answer Includes

- routing

## Câu trả lời 30 giây

Nếu read sau write bị route replica async, caller thấy stale; transaction cũng có thể dùng nhiều connection/database. Cần pin trong transaction, consistency token hoặc route primary cho use case nhạy cảm.

## Câu trả lời chi tiết

Proxy/router thường phân loại SELECT nhưng không hiểu session state, stored procedure hay `SELECT FOR UPDATE`. Replica failover/read-only và lag làm routing động. Caching và retry có thể nhân stale/duplicate. API cần nêu freshness và fallback khi replica unavailable.

## Góc nhìn Production

Đo route ratio, lag, stale-read/error và primary overload; test transaction, failover và prepared statements. Không dùng regex SQL đơn giản làm policy duy nhất.

## Trade-offs

Proxy/router thường phân loại SELECT nhưng không hiểu session state, stored procedure hay `SELECT FOR UPDATE`. Replica failover/read-only và lag làm routing động. Caching và retry có thể nhân stale/duplicate. API cần nêu freshness và fallback khi replica unavailable.

## Câu trả lời sai thường gặp

Chỉ cần route mọi SELECT sang replica là scale tuyến tính mà không đổi behavior.

## Follow-up

- SELECT FOR UPDATE nên route đâu?

- Consistency token triển khai thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Log-Shipping Standby Servers](https://www.postgresql.org/docs/current/warm-standby.html)
- [Oracle MySQL — MySQL Replication Implementation](https://dev.mysql.com/doc/refman/8.4/en/replication-implementation.html)
- [MongoDB — MongoDB Replication](https://www.mongodb.com/docs/manual/replication/)
- [MongoDB — MongoDB Sharding](https://www.mongodb.com/docs/manual/sharding/)
