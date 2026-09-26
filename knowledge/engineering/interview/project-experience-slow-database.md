---
id: project-experience-slow-database
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: senior
topics:
  - database
  - incident
  - evidence
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
    - id: database
      required: true
      aliases:
        - database
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: incident
      required: true
      aliases:
        - incident
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: evidence
      required: false
      aliases:
        - evidence
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Thấy API chậm thì tăng database connection pool và thêm index cho mọi column.
      penalty: 20
---

# Nếu database chậm, bạn mô tả quy trình điều tra và tránh tối ưu mù thế nào?

## Rubric

### Must Include

- database

- incident

### Strong Answer Includes

- evidence

## Câu trả lời 30 giây

Tôi chốt impact/time window, tách app pool/network/query/lock và lấy actual plan, wait/CPU/IO evidence. Sau đó thử một thay đổi nhỏ, benchmark và có rollback.

## Câu trả lời chi tiết

Tôi đối chiếu p95/p99 với query fingerprint, rows/plan estimate, connection pool wait, lock và replica lag. Kiểm parameter/data distribution, index/sargability rồi load test representative. Không tăng pool hay thêm index trước khi biết bottleneck và write cost.

## Góc nhìn Production

Giữ incident timeline, plan snapshot và migration rollback; bảo vệ PII trong traces.

## Trade-offs

Tôi đối chiếu p95/p99 với query fingerprint, rows/plan estimate, connection pool wait, lock và replica lag. Kiểm parameter/data distribution, index/sargability rồi load test representative. Không tăng pool hay thêm index trước khi biết bottleneck và write cost.

## Câu trả lời sai thường gặp

Thấy API chậm thì tăng database connection pool và thêm index cho mọi column.

## Follow-up

- Lock wait nhận biết ở đâu?

- EXPLAIN ANALYZE production chạy an toàn thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL Global Development Group — PostgreSQL Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html)
- [Oracle MySQL — MySQL Performance Schema Statement Digests and Sampling](https://dev.mysql.com/doc/refman/8.4/en/performance-schema-statement-digests.html)
- [Oracle — Oracle Explaining and Displaying Execution Plans](https://docs.oracle.com/en/database/oracle/oracle-database/26/tgsql/generating-and-displaying-execution-plans.html)
