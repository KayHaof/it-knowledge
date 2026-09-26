---
id: q-postgresql-vacuum
type: interview-question
technology: PostgreSQL
category: PostgreSQL
difficulty: senior
topics:
  - MVCC
  - VACUUM
  - bloat
relatedLessons:
  - transactions-mvcc-deadlocks
sources:
  - title: PostgreSQL routine vacuuming
    url: https://www.postgresql.org/docs/current/routine-vacuuming.html
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
    - id: mvcc
      required: true
      aliases:
        - MVCC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: vacuum
      required: true
      aliases:
        - VACUUM
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: bloat
      required: false
      aliases:
        - bloat
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - VACUUM xóa dữ liệu hợp lệ hoặc luôn trả file về OS ngay lập tức.
      penalty: 20
---

# Tại sao PostgreSQL cần VACUUM và long transaction có thể gây vấn đề gì?

## Rubric

### Must Include

- MVCC

- VACUUM

### Strong Answer Includes

- bloat

## Câu trả lời 30 giây

MVCC giữ row versions để snapshot đang hoạt động có thể đọc. VACUUM thu hồi/reuse dead tuples và duy trì visibility; transaction/snapshot quá lâu có thể ngăn cleanup, gây bloat và tăng work cho query.

## Câu trả lời chi tiết

Tôi xem dead tuples, autovacuum progress, oldest transaction, table/index growth và IO. Không chỉ chạy VACUUM FULL vì nó có lock/cost; thường sửa transaction lifecycle, tune autovacuum theo table và kiểm workload. VACUUM còn liên quan freeze để tránh transaction ID wraparound.

## Deep Dive

Read-only transaction bị bỏ quên vẫn có thể giữ xmin. Index/table bloat và stale statistics là vấn đề liên quan nhưng cần evidence riêng.

## Góc nhìn Production

Alert transaction age, autovacuum lag/failure và disk headroom; test maintenance trên table lớn.

## Trade-offs

Read-only transaction bị bỏ quên vẫn có thể giữ xmin. Index/table bloat và stale statistics là vấn đề liên quan nhưng cần evidence riêng.

## Câu trả lời sai thường gặp

VACUUM xóa dữ liệu hợp lệ hoặc luôn trả file về OS ngay lập tức.

## Follow-up

- VACUUM khác VACUUM FULL?

- ANALYZE liên quan optimizer thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)
