---
id: q-composite-index-order
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - composite-index
  - EXPLAIN
  - cardinality
relatedLessons:
  - composite-covering-index-explain
sources:
  - title: PostgreSQL multicolumn indexes
    url: https://www.postgresql.org/docs/current/indexes-multicolumn.html
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
    - id: composite-index
      required: true
      aliases:
        - composite-index
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: explain
      required: true
      aliases:
        - EXPLAIN
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: cardinality
      required: false
      aliases:
        - cardinality
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Luôn đặt column có nhiều giá trị nhất đầu tiên và database chắc chắn dùng index.
      penalty: 20
---

# Thứ tự column trong composite index được quyết định thế nào?

## Rubric

### Must Include

- composite-index

- EXPLAIN

### Strong Answer Includes

- cardinality

## Câu trả lời 30 giây

Dựa trên predicate, operator, ordering và access pattern thực tế, không chỉ đặt column selectivity cao nhất trước. B-tree multicolumn thường tận dụng leading constraints để thu hẹp scan; phải xác minh bằng plan/data đại diện.

## Câu trả lời chi tiết

Tôi inventory query hot, equality/range/order, row width và write cost. So estimated/actual rows bằng EXPLAIN ANALYZE/BUFFERS, kiểm statistics và parameter distribution. Covering/include có thể tránh heap access trong điều kiện phù hợp nhưng tăng storage/write amplification.

## Deep Dive

Một index tối ưu query A có thể không phục vụ query B khi range xuất hiện sớm; optimizer vẫn có thể chọn sequential scan nếu đọc phần lớn table rẻ hơn.

## Góc nhìn Production

Theo dõi index usage/bloat và write latency; xóa index redundant sau chu kỳ quan sát an toàn.

## Trade-offs

Một index tối ưu query A có thể không phục vụ query B khi range xuất hiện sớm; optimizer vẫn có thể chọn sequential scan nếu đọc phần lớn table rẻ hơn.

## Câu trả lời sai thường gặp

Luôn đặt column có nhiều giá trị nhất đầu tiên và database chắc chắn dùng index.

## Follow-up

- Index-only scan cần điều kiện gì?

- Tại sao function/cast có thể làm index không dùng được?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL multicolumn indexes](https://www.postgresql.org/docs/current/indexes-multicolumn.html)
