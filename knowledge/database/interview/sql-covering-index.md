---
id: sql-covering-index
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - covering-index
  - index-only-scan
  - visibility
relatedLessons:
  - composite-covering-index-explain
sources:
  - title: PostgreSQL Indexes
    url: https://www.postgresql.org/docs/current/indexes.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Using EXPLAIN
    url: https://www.postgresql.org/docs/current/using-explain.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Optimization and Indexes
    url: https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Optimizing Queries with EXPLAIN
    url: https://dev.mysql.com/doc/refman/8.4/en/using-explain.html
    organization: Oracle MySQL
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
    - id: covering-index
      required: true
      aliases:
        - covering-index
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: index-only-scan
      required: true
      aliases:
        - index-only-scan
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: visibility
      required: false
      aliases:
        - visibility
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Thêm mọi SELECT column vào index sẽ luôn làm query nhanh hơn và không có cost ghi.
      penalty: 20
---

# Covering index giảm table lookup nhưng không phải lúc nào index-only scan?

## Rubric

### Must Include

- covering-index

- index-only-scan

### Strong Answer Includes

- visibility

## Câu trả lời 30 giây

Nếu index chứa đủ cột query, engine có thể tránh lookup base table. Tuy nhiên visibility map/heap visibility, storage engine và selectivity quyết định có thực sự index-only hay vẫn đọc table.

## Câu trả lời chi tiết

Covering index tăng write/storage cost và có thể làm key page lớn, cache kém. PostgreSQL cần kiểm visibility để bỏ qua heap ở tuple chưa all-visible; InnoDB secondary index vẫn truy clustered key khi cần. Thêm INCLUDE/column chỉ vì một query phải cân bằng workload.

## Góc nhìn Production

EXPLAIN actual buffers và write amplification trước/sau; theo dõi bloat/maintenance. Không đưa payload lớn vào index.

## Trade-offs

Covering index tăng write/storage cost và có thể làm key page lớn, cache kém. PostgreSQL cần kiểm visibility để bỏ qua heap ở tuple chưa all-visible; InnoDB secondary index vẫn truy clustered key khi cần. Thêm INCLUDE/column chỉ vì một query phải cân bằng workload.

## Câu trả lời sai thường gặp

Thêm mọi SELECT column vào index sẽ luôn làm query nhanh hơn và không có cost ghi.

## Follow-up

- INCLUDE khác key column thế nào?

- Index-only scan thất bại khi visibility nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL Global Development Group — PostgreSQL Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [Oracle MySQL — MySQL Optimization and Indexes](https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html)
- [Oracle MySQL — MySQL Optimizing Queries with EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/using-explain.html)
