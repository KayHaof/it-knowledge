---
id: postgresql-partition-pruning
type: interview-question
technology: PostgreSQL
category: PostgreSQL
difficulty: senior
topics:
  - partitioning
  - pruning
  - retention
relatedLessons:
  - postgresql-partitioning-operations
sources:
  - title: PostgreSQL Table Partitioning
    url: https://www.postgresql.org/docs/current/ddl-partitioning.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL CREATE TABLE
    url: https://www.postgresql.org/docs/current/sql-createtable.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL ALTER TABLE
    url: https://www.postgresql.org/docs/current/sql-altertable.html
    organization: PostgreSQL Global Development Group
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
    - id: partitioning
      required: true
      aliases:
        - partitioning
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: pruning
      required: true
      aliases:
        - pruning
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: retention
      required: false
      aliases:
        - retention
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chia table thành nhiều partition luôn giảm latency vì mỗi query chỉ đọc một row.
      penalty: 20
---

# Partitioning giúp query và vận hành PostgreSQL khi nào?

## Rubric

### Must Include

- partitioning

- pruning

### Strong Answer Includes

- retention

## Câu trả lời 30 giây

Partition theo key/time có thể prune partition không liên quan và drop/archival retention dễ hơn. Nó không tự làm query nhanh nếu predicate không expose partition key hoặc mỗi partition vẫn quá lớn.

## Câu trả lời chi tiết

Declarative range/list/hash partitioning tách storage/index/vacuum; planner/runtime pruning phụ thuộc parameterization/version. Unique/foreign-key constraints và global index semantics có giới hạn theo version. Nhiều partition tăng planning/operational overhead, và hot partition vẫn bottleneck.

## Góc nhìn Production

Theo dõi partition count, pruning ratio, attach/detach lock, bloat và query planning time. Test prepared statements và late-bound parameters.

## Trade-offs

Declarative range/list/hash partitioning tách storage/index/vacuum; planner/runtime pruning phụ thuộc parameterization/version. Unique/foreign-key constraints và global index semantics có giới hạn theo version. Nhiều partition tăng planning/operational overhead, và hot partition vẫn bottleneck.

## Câu trả lời sai thường gặp

Chia table thành nhiều partition luôn giảm latency vì mỗi query chỉ đọc một row.

## Follow-up

- Time partition khác sharding thế nào?

- Detach partition cần lock/backup plan nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [PostgreSQL Global Development Group — PostgreSQL CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html)
- [PostgreSQL Global Development Group — PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
