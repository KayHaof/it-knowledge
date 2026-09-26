---
id: sql-window-frame
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - window-function
  - frame
  - ranking
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
    - id: window-function
      required: true
      aliases:
        - window-function
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: frame
      required: true
      aliases:
        - frame
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ranking
      required: false
      aliases:
        - ranking
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Window function luôn gom group như GROUP BY nên không thể trả cột chi tiết.
      penalty: 20
---

# Window function khác GROUP BY ở chỗ nào?

## Rubric

### Must Include

- window-function

- frame

### Strong Answer Includes

- ranking

## Câu trả lời 30 giây

GROUP BY giảm nhiều row thành một row mỗi group. Window function giữ row detail và tính aggregate/rank trên window liên quan; frame và ORDER BY quyết định row nào được nhìn thấy.

## Câu trả lời chi tiết

`row_number`, `rank`, `sum() over(partition by ... order by ...)` hỗ trợ top-N per group và running total. RANGE/ROWS frame có semantics khác khi giá trị ORDER BY trùng; thiếu order làm kết quả không deterministic. Window thường cần sort và memory, dù optimizer có thể reuse ordering.

## Góc nhìn Production

Chọn tie-breaker stable, giới hạn partition lớn và đo sort spill. Keyset/paged query cần kết hợp window có chủ ý.

## Trade-offs

`row_number`, `rank`, `sum() over(partition by ... order by ...)` hỗ trợ top-N per group và running total. RANGE/ROWS frame có semantics khác khi giá trị ORDER BY trùng; thiếu order làm kết quả không deterministic. Window thường cần sort và memory, dù optimizer có thể reuse ordering.

## Câu trả lời sai thường gặp

Window function luôn gom group như GROUP BY nên không thể trả cột chi tiết.

## Follow-up

- RANK và ROW_NUMBER khác tie thế nào?

- Frame mặc định nguy hiểm khi duplicate order ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL WITH Queries](https://www.postgresql.org/docs/current/queries-with.html)
- [PostgreSQL Global Development Group — PostgreSQL Window Functions](https://www.postgresql.org/docs/current/functions-window.html)
- [Oracle MySQL — MySQL Window Function Concepts](https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html)
