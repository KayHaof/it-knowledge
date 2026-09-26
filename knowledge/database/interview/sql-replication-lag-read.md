---
id: sql-replication-lag-read
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - replication
  - read-after-write
  - consistency
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
    - id: replication
      required: true
      aliases:
        - replication
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: read-after-write
      required: true
      aliases:
        - read-after-write
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: consistency
      required: false
      aliases:
        - consistency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Replication đồng nghĩa synchronous nên mọi replica luôn nhất quán tức thì.
      penalty: 20
---

# Read replica có thể trả dữ liệu cũ sau khi write thành công vì sao?

## Rubric

### Must Include

- replication

- read-after-write

### Strong Answer Includes

- consistency

## Câu trả lời 30 giây

Replication thường async nên commit primary chưa apply ở replica. Read-after-write cần sticky primary, wait-for-LSN/token hoặc consistency-aware routing; không giả định mọi SELECT thấy write ngay.

## Câu trả lời chi tiết

WAL/binlog được ship/apply với queue; lag tăng do network, replica I/O, long transaction hoặc DDL. Routing đọc replica giảm primary load nhưng đổi freshness/availability. Session có thể giữ pin trong một khoảng hoặc dùng commit position. Failover còn yêu cầu xác định data đã durable ở đâu.

## Góc nhìn Production

Theo dõi replay/apply lag, commit-to-visible latency và stale-read rate; test failover/partition. API contract nên nói rõ freshness.

## Trade-offs

WAL/binlog được ship/apply với queue; lag tăng do network, replica I/O, long transaction hoặc DDL. Routing đọc replica giảm primary load nhưng đổi freshness/availability. Session có thể giữ pin trong một khoảng hoặc dùng commit position. Failover còn yêu cầu xác định data đã durable ở đâu.

## Câu trả lời sai thường gặp

Replication đồng nghĩa synchronous nên mọi replica luôn nhất quán tức thì.

## Follow-up

- Sticky read có làm scale mất không?

- Failover khi replica lag xử lý data loss thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Log-Shipping Standby Servers](https://www.postgresql.org/docs/current/warm-standby.html)
- [Oracle MySQL — MySQL Replication Implementation](https://dev.mysql.com/doc/refman/8.4/en/replication-implementation.html)
- [MongoDB — MongoDB Replication](https://www.mongodb.com/docs/manual/replication/)
- [MongoDB — MongoDB Sharding](https://www.mongodb.com/docs/manual/sharding/)
