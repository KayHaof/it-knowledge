---
id: sql-cte-recursive
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - CTE
  - recursive
  - materialization
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
    - id: cte
      required: true
      aliases:
        - CTE
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: recursive
      required: true
      aliases:
        - recursive
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: materialization
      required: false
      aliases:
        - materialization
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CTE luôn chạy trước query chính và lưu toàn bộ kết quả vào bảng tạm.
      penalty: 20
---

# CTE có luôn materialize thành temporary table không?

## Rubric

### Must Include

- CTE

- recursive

### Strong Answer Includes

- materialization

## Câu trả lời 30 giây

Không, phụ thuộc engine/version và hint. Optimizer có thể inline CTE hoặc materialize để tái sử dụng; recursive CTE có semantics riêng và cần giới hạn depth/data.

## Câu trả lời chi tiết

CTE làm query dễ đọc và cho phép recursive traversal, nhưng không phải performance fence phổ quát. PostgreSQL có thể inline CTE non-recursive phù hợp, còn `MATERIALIZED`/`NOT MATERIALIZED` điều khiển trong version hỗ trợ; engine khác có quy tắc khác. Recursive query cần cycle guard, index và termination.

## Góc nhìn Production

Kiểm execution plan, temp spill và rows mỗi recursion; đặt statement timeout cho graph input xấu. Không viết CTE chỉ vì nghe “tối ưu”.

## Trade-offs

CTE làm query dễ đọc và cho phép recursive traversal, nhưng không phải performance fence phổ quát. PostgreSQL có thể inline CTE non-recursive phù hợp, còn `MATERIALIZED`/`NOT MATERIALIZED` điều khiển trong version hỗ trợ; engine khác có quy tắc khác. Recursive query cần cycle guard, index và termination.

## Câu trả lời sai thường gặp

CTE luôn chạy trước query chính và lưu toàn bộ kết quả vào bảng tạm.

## Follow-up

- Khi nào MATERIALIZED giúp?

- Recursive CTE chống cycle thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL WITH Queries](https://www.postgresql.org/docs/current/queries-with.html)
- [PostgreSQL Global Development Group — PostgreSQL Window Functions](https://www.postgresql.org/docs/current/functions-window.html)
- [Oracle MySQL — MySQL Window Function Concepts](https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html)
