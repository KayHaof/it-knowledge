---
id: sql-normalization-tradeoff
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - normalization
  - denormalization
  - invariant
relatedLessons:
  - normalization-denormalization
sources:
  - title: PostgreSQL Data Definition
    url: https://www.postgresql.org/docs/current/ddl.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL InnoDB Table Best Practices
    url: https://dev.mysql.com/doc/refman/8.4/en/innodb-best-practices.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Oracle Database Concepts - Data Integrity
    url: https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-integrity.html
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
    - id: normalization
      required: true
      aliases:
        - normalization
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: denormalization
      required: true
      aliases:
        - denormalization
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: invariant
      required: false
      aliases:
        - invariant
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Denormalization luôn sai vì duplicate dữ liệu không bao giờ nhất quán.
      penalty: 20
---

# Khi nào denormalization là quyết định có evidence thay vì anti-pattern?

## Rubric

### Must Include

- normalization

- denormalization

### Strong Answer Includes

- invariant

## Câu trả lời 30 giây

Denormalize để tối ưu read shape/latency khi workload đo được và chấp nhận đồng bộ phức tạp. Constraint/source-of-truth, update path và reconciliation phải được thiết kế trước.

## Câu trả lời chi tiết

Normalize giảm duplicate và anomaly; denormalize snapshot/materialized view giảm join hoặc hỗ trợ feed. Cần chọn ownership, refresh latency, backfill và behavior khi write fail. Cache cũng là denormalization với invalidation problem. Không copy field để chữa query chưa có index mà không đo.

## Góc nhìn Production

Monitor freshness lag, rebuild duration, divergence/reconciliation và write amplification. Đảm bảo migration có backfill/rollback.

## Trade-offs

Normalize giảm duplicate và anomaly; denormalize snapshot/materialized view giảm join hoặc hỗ trợ feed. Cần chọn ownership, refresh latency, backfill và behavior khi write fail. Cache cũng là denormalization với invalidation problem. Không copy field để chữa query chưa có index mà không đo.

## Câu trả lời sai thường gặp

Denormalization luôn sai vì duplicate dữ liệu không bao giờ nhất quán.

## Follow-up

- Materialized view khác cache thế nào?

- Reconciliation nên chạy theo key nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Data Definition](https://www.postgresql.org/docs/current/ddl.html)
- [Oracle MySQL — MySQL InnoDB Table Best Practices](https://dev.mysql.com/doc/refman/8.4/en/innodb-best-practices.html)
- [Oracle — Oracle Database Concepts - Data Integrity](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-integrity.html)
