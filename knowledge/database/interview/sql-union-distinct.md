---
id: sql-union-distinct
type: interview-question
technology: SQL
category: SQL
difficulty: junior
topics:
  - UNION
  - UNION ALL
  - deduplication
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
    - id: union
      required: true
      aliases:
        - UNION
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: union-all
      required: true
      aliases:
        - UNION ALL
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: deduplication
      required: false
      aliases:
        - deduplication
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - UNION ALL tự động loại row trùng còn UNION chỉ nối nhanh hai query.
      penalty: 20
---

# UNION và UNION ALL khác nhau về duplicate và cost?

## Rubric

### Must Include

- UNION

- UNION ALL

### Strong Answer Includes

- deduplication

## Câu trả lời 30 giây

UNION loại duplicate sau khi ghép hai result sets, thường cần sort/hash. UNION ALL giữ duplicate và thường rẻ hơn; chọn theo business semantics chứ không chỉ performance.

## Câu trả lời chi tiết

Hai nhánh phải tương thích số cột và type; column names lấy từ nhánh đầu. UNION DISTINCT có thể làm mất bản ghi hợp lệ nếu identity chưa đầy đủ. Predicate pushdown và partition pruning vẫn phụ thuộc optimizer.

## Góc nhìn Production

Đo rows trước/sau dedup, memory/temp sort và latency. Nếu cần merge event streams, thêm source/unique key rõ thay DISTINCT mù.

## Trade-offs

Hai nhánh phải tương thích số cột và type; column names lấy từ nhánh đầu. UNION DISTINCT có thể làm mất bản ghi hợp lệ nếu identity chưa đầy đủ. Predicate pushdown và partition pruning vẫn phụ thuộc optimizer.

## Câu trả lời sai thường gặp

UNION ALL tự động loại row trùng còn UNION chỉ nối nhanh hai query.

## Follow-up

- Type coercion giữa hai nhánh có rủi ro gì?

- Khi nào DISTINCT che lỗi data model?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL WITH Queries](https://www.postgresql.org/docs/current/queries-with.html)
- [PostgreSQL Global Development Group — PostgreSQL Window Functions](https://www.postgresql.org/docs/current/functions-window.html)
- [Oracle MySQL — MySQL Window Function Concepts](https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html)
