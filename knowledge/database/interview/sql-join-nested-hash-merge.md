---
id: sql-join-nested-hash-merge
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - nested-loop
  - hash-join
  - merge-join
relatedLessons:
  - database-query-plan
sources:
  - title: PostgreSQL EXPLAIN
    url: https://www.postgresql.org/docs/current/sql-explain.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Using EXPLAIN
    url: https://www.postgresql.org/docs/current/using-explain.html
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
    - id: nested-loop
      required: true
      aliases:
        - nested-loop
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: hash-join
      required: true
      aliases:
        - hash-join
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: merge-join
      required: false
      aliases:
        - merge-join
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Hash join luôn nhanh nhất vì O(n), còn nested loop chỉ dành cho bảng nhỏ tuyệt đối.
      penalty: 20
---

# Optimizer chọn nested loop, hash join hay merge join theo điều kiện nào?

## Rubric

### Must Include

- nested-loop

- hash-join

### Strong Answer Includes

- merge-join

## Câu trả lời 30 giây

Nested loop hợp outer nhỏ và inner có index; hash join hợp equality với input lớn đủ memory; merge join hợp input đã sort/indexed. Statistics, memory và cardinality thực tế có thể làm lựa chọn sai.

## Câu trả lời chi tiết

Nested loop lặp inner theo outer rows, hash build một phía rồi probe, merge đi qua hai stream sorted. Hash spill khi work memory thiếu; merge sort tốn I/O nếu chưa có order; nested loop thảm họa khi outer misestimated lớn. Join order và predicate pushdown thường quan trọng hơn ép một algorithm.

## Góc nhìn Production

Đọc actual loops, buffers, spill và skew; cập nhật statistics/extended stats trước force hint. Load test cold/warm cache.

## Trade-offs

Nested loop lặp inner theo outer rows, hash build một phía rồi probe, merge đi qua hai stream sorted. Hash spill khi work memory thiếu; merge sort tốn I/O nếu chưa có order; nested loop thảm họa khi outer misestimated lớn. Join order và predicate pushdown thường quan trọng hơn ép một algorithm.

## Câu trả lời sai thường gặp

Hash join luôn nhanh nhất vì O(n), còn nested loop chỉ dành cho bảng nhỏ tuyệt đối.

## Follow-up

- Hash spill nhận biết ở đâu?

- Khi nào optimizer cần extended statistics?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)
- [PostgreSQL Global Development Group — Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
