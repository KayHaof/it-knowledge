---
id: sql-offset-keyset
type: interview-question
technology: SQL
category: SQL
difficulty: middle
topics:
  - pagination
  - OFFSET
  - keyset
relatedLessons:
  - sql-keyset-pagination
sources:
  - title: PostgreSQL LIMIT and OFFSET
    url: https://www.postgresql.org/docs/current/queries-limit.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Row and Array Comparisons
    url: https://www.postgresql.org/docs/current/functions-comparisons.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Indexes and ORDER BY
    url: https://www.postgresql.org/docs/current/indexes-ordering.html
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
    - id: pagination
      required: true
      aliases:
        - pagination
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: offset
      required: true
      aliases:
        - OFFSET
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: keyset
      required: false
      aliases:
        - keyset
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Keyset pagination luôn trả đúng cùng dataset qua mọi page dù transaction/read snapshot thay đổi.
      penalty: 20
---

# Keyset pagination giải quyết vấn đề nào của OFFSET?

## Rubric

### Must Include

- pagination

- OFFSET

### Strong Answer Includes

- keyset

## Câu trả lời 30 giây

OFFSET phải scan/bỏ qua các row trước nên page sâu chậm và dễ trượt khi dữ liệu chèn/xóa. Keyset dùng cursor từ sort key cuối để seek ổn định hơn, nhưng cần ordering unique và API cursor.

## Câu trả lời chi tiết

`WHERE (created_at,id)<(:lastTime,:lastId) ORDER BY created_at DESC,id DESC LIMIT :n` tránh đếm offset lớn. Cursor phải encode direction/filter/version và không để client sửa tùy ý. Snapshot consistency giữa page vẫn là lựa chọn riêng; keyset không tạo historical snapshot.

## Góc nhìn Production

Đo p95 page sâu, index `(filter,sort,id)` và duplicate/missing dưới concurrent writes. Validate cursor expiry/signature nếu cần.

## Trade-offs

`WHERE (created_at,id)<(:lastTime,:lastId) ORDER BY created_at DESC,id DESC LIMIT :n` tránh đếm offset lớn. Cursor phải encode direction/filter/version và không để client sửa tùy ý. Snapshot consistency giữa page vẫn là lựa chọn riêng; keyset không tạo historical snapshot.

## Câu trả lời sai thường gặp

Keyset pagination luôn trả đúng cùng dataset qua mọi page dù transaction/read snapshot thay đổi.

## Follow-up

- Tie-breaker vì sao bắt buộc?

- Cursor đổi filter có nên chấp nhận không?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL LIMIT and OFFSET](https://www.postgresql.org/docs/current/queries-limit.html)
- [PostgreSQL Global Development Group — PostgreSQL Row and Array Comparisons](https://www.postgresql.org/docs/current/functions-comparisons.html)
- [PostgreSQL Global Development Group — PostgreSQL Indexes and ORDER BY](https://www.postgresql.org/docs/current/indexes-ordering.html)
