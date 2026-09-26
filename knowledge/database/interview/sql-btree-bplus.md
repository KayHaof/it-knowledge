---
id: sql-btree-bplus
type: interview-question
technology: SQL
category: SQL
difficulty: junior
topics:
  - B-tree
  - B+tree
  - index
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
    - id: b-tree
      required: true
      aliases:
        - B-tree
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: b-tree
      required: true
      aliases:
        - B+tree
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: index
      required: false
      aliases:
        - index
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Có B-tree index thì mọi query trên column luôn O(1) và không đọc table.
      penalty: 20
---

# B-tree/B+tree index giúp query range bằng cơ chế nào?

## Rubric

### Must Include

- B-tree

- B+tree

### Strong Answer Includes

- index

## Câu trả lời 30 giây

Node giữ keys có thứ tự và leaf thường liên kết để seek rồi scan range. Chi phí tìm gần logarithmic, nhưng selectivity, visibility và random I/O quyết định index có tốt hơn full scan không.

## Câu trả lời chi tiết

Internal nodes dẫn đường, leaf chứa key và row locator/tuple reference theo engine. Composite key order tạo lexicographic ranges; predicate không theo prefix có thể không seek hiệu quả. Index vẫn cần heap/table lookup nếu không covering và nhiều row match có thể đắt hơn sequential scan.

## Góc nhìn Production

Đọc actual plan, buffer hit/read và rows removed; không suy ra từ index tồn tại. Theo dõi index bloat/maintenance theo engine.

## Trade-offs

Internal nodes dẫn đường, leaf chứa key và row locator/tuple reference theo engine. Composite key order tạo lexicographic ranges; predicate không theo prefix có thể không seek hiệu quả. Index vẫn cần heap/table lookup nếu không covering và nhiều row match có thể đắt hơn sequential scan.

## Câu trả lời sai thường gặp

Có B-tree index thì mọi query trên column luôn O(1) và không đọc table.

## Follow-up

- Clustered index khác secondary index thế nào?

- Range selectivity bao nhiêu là quá rộng?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)
- [PostgreSQL Global Development Group — Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
