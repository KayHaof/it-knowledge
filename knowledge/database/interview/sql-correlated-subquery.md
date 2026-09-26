---
id: sql-correlated-subquery
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - subquery
  - correlation
  - EXISTS
relatedLessons:
  - sql-cte-window-analytics
sources:
  - title: PostgreSQL WITH Queries
    url: https://www.postgresql.org/docs/current/queries-with.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Window Functions
    url: https://www.postgresql.org/docs/current/functions-window.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Window Function Concepts
    url: https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html
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
    - id: subquery
      required: true
      aliases:
        - subquery
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: correlation
      required: true
      aliases:
        - correlation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: exists
      required: false
      aliases:
        - EXISTS
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi correlated subquery chắc chắn chạy một query database mới cho từng row và luôn chậm.
      penalty: 20
---

# Correlated subquery khác subquery thường về execution risk nào?

## Rubric

### Must Include

- subquery

- correlation

### Strong Answer Includes

- EXISTS

## Câu trả lời 30 giây

Correlated subquery tham chiếu row ngoài và có thể được đánh giá nhiều lần, dù optimizer đôi khi decorrelate thành join. Nó phù hợp EXISTS nhưng cần xem plan và cardinality thay vì mặc định gọi là N+1.

## Câu trả lời chi tiết

`WHERE EXISTS (SELECT 1 FROM child c WHERE c.parent_id=p.id ...)` diễn đạt semi-join và có thể short-circuit. Correlated scalar subquery trả nhiều row sẽ lỗi; optimizer có thể chuyển thành hash/semi join. Thiếu index correlation key hoặc outer set lớn tạo nested-loop đắt.

## Góc nhìn Production

EXPLAIN/ANALYZE actual loops và rows là bằng chứng; test skew data. Khi cần, viết window/CTE/join rõ rồi so plan.

## Trade-offs

`WHERE EXISTS (SELECT 1 FROM child c WHERE c.parent_id=p.id ...)` diễn đạt semi-join và có thể short-circuit. Correlated scalar subquery trả nhiều row sẽ lỗi; optimizer có thể chuyển thành hash/semi join. Thiếu index correlation key hoặc outer set lớn tạo nested-loop đắt.

## Câu trả lời sai thường gặp

Mọi correlated subquery chắc chắn chạy một query database mới cho từng row và luôn chậm.

## Follow-up

- EXISTS khác IN khi có NULL thế nào?

- Decorrelate được optimizer làm ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL WITH Queries](https://www.postgresql.org/docs/current/queries-with.html)
- [PostgreSQL Global Development Group — PostgreSQL Window Functions](https://www.postgresql.org/docs/current/functions-window.html)
- [Oracle MySQL — MySQL Window Function Concepts](https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html)
