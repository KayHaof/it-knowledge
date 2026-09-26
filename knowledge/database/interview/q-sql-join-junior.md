---
id: q-sql-join-junior
type: interview-question
technology: SQL
category: SQL
difficulty: junior
topics:
  - JOIN
  - "NULL"
  - logical-processing
relatedLessons:
  - sql-logical-processing-joins
sources:
  - title: PostgreSQL table expressions
    url: https://www.postgresql.org/docs/current/queries-table-expressions.html
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
    - id: join
      required: true
      aliases:
        - JOIN
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: "null"
      required: true
      aliases:
        - "NULL"
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: logical-processing
      required: false
      aliases:
        - logical-processing
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - ON và WHERE luôn tương đương vì optimizer tự sắp xếp điều kiện.
      penalty: 20
---

# Đặt điều kiện bảng bên phải của LEFT JOIN trong WHERE có thể đổi kết quả thế nào?

## Rubric

### Must Include

- JOIN

- NULL

### Strong Answer Includes

- logical-processing

## Câu trả lời 30 giây

LEFT JOIN tạo null-extended rows khi không match. Nếu WHERE sau đó yêu cầu cột bên phải thỏa điều kiện, các row NULL bị loại và kết quả có thể giống INNER JOIN. Điều kiện trong ON giữ semantics match khác.

## Câu trả lời chi tiết

SQL có logical processing: FROM/JOIN/ON tạo row set trước WHERE. Tôi viết sample có unmatched row và NULL để kiểm. Không di chuyển predicate chỉ vì optimizer có thể rewrite; placement phải phản ánh business semantics, rồi dùng plan để tối ưu.

## Deep Dive

Predicate null-rejecting và ba-valued logic khiến UNKNOWN không qua WHERE. COUNT(*) và COUNT(column) cũng khác trên outer join.

## Góc nhìn Production

Test empty/unmatched/duplicate/NULL cases và kiểm cardinality trước pagination/aggregation.

## Trade-offs

Predicate null-rejecting và ba-valued logic khiến UNKNOWN không qua WHERE. COUNT(*) và COUNT(column) cũng khác trên outer join.

## Câu trả lời sai thường gặp

ON và WHERE luôn tương đương vì optimizer tự sắp xếp điều kiện.

## Follow-up

- COUNT(*) khác COUNT(right.id)?

- JOIN nhiều-to-nhiều làm row count tăng ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL table expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
