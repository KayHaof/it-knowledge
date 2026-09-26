---
id: sql-slow-query-runbook
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - slow-query
  - observability
  - plan
relatedLessons:
  - database-slow-api-investigation
sources:
  - title: PostgreSQL Using EXPLAIN
    url: https://www.postgresql.org/docs/current/using-explain.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Cumulative Statistics System
    url: https://www.postgresql.org/docs/current/monitoring-stats.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Performance Schema Statement Digests and Sampling
    url: https://dev.mysql.com/doc/refman/8.4/en/performance-schema-statement-digests.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Oracle Explaining and Displaying Execution Plans
    url: https://docs.oracle.com/en/database/oracle/oracle-database/26/tgsql/generating-and-displaying-execution-plans.html
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
    - id: slow-query
      required: true
      aliases:
        - slow-query
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: observability
      required: true
      aliases:
        - observability
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: plan
      required: false
      aliases:
        - plan
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Query chậm thì thêm index bất kỳ trên mọi column WHERE là đủ.
      penalty: 20
---

# Bạn điều tra một query chậm đột ngột nhưng code không đổi từ đâu?

## Rubric

### Must Include

- slow-query

- observability

### Strong Answer Includes

- plan

## Câu trả lời 30 giây

So sánh query fingerprint/plan hash, bind values, stats, locks, cache hit, data growth và database resource. Phân biệt plan regression, blocking và infrastructure saturation trước khi sửa SQL.

## Câu trả lời chi tiết

Lấy p50/p95/p99 theo fingerprint, actual plan ở thời điểm lỗi và wait events. Kiểm auto-analyze/vacuum, schema/index change, parameter skew, connection pool và replication lag. Mitigation có thể kill blocker/rollback plan/limit traffic; permanent fix cần reproducible dataset và regression guard.

## Góc nhìn Production

Giữ slow-query log có sampling/redaction, trace id và statement timeout. Không log full PII/SQL literals vô hạn.

## Trade-offs

Lấy p50/p95/p99 theo fingerprint, actual plan ở thời điểm lỗi và wait events. Kiểm auto-analyze/vacuum, schema/index change, parameter skew, connection pool và replication lag. Mitigation có thể kill blocker/rollback plan/limit traffic; permanent fix cần reproducible dataset và regression guard.

## Câu trả lời sai thường gặp

Query chậm thì thêm index bất kỳ trên mọi column WHERE là đủ.

## Follow-up

- Plan cache regression rollback thế nào?

- Blocking transaction nhận biết ở metric nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL Global Development Group — PostgreSQL Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html)
- [Oracle MySQL — MySQL Performance Schema Statement Digests and Sampling](https://dev.mysql.com/doc/refman/8.4/en/performance-schema-statement-digests.html)
- [Oracle — Oracle Explaining and Displaying Execution Plans](https://docs.oracle.com/en/database/oracle/oracle-database/26/tgsql/generating-and-displaying-execution-plans.html)
