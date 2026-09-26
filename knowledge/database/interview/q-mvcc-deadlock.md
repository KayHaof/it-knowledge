---
id: q-mvcc-deadlock
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - MVCC
  - isolation
  - deadlock
relatedLessons:
  - transactions-mvcc-deadlocks
sources:
  - title: PostgreSQL concurrency control
    url: https://www.postgresql.org/docs/current/mvcc.html
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
    - id: isolation
      required: true
      aliases:
        - isolation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: deadlock
      required: false
      aliases:
        - deadlock
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - MVCC nghĩa mọi query không bao giờ block nhau và deadlock là bug của database.
      penalty: 20
---

# Có MVCC rồi tại sao database vẫn có lock và deadlock?

## Rubric

### Must Include

- MVCC

- isolation

### Strong Answer Includes

- deadlock

## Câu trả lời 30 giây

MVCC giúp read thấy snapshot và giảm một số read-write blocking, nhưng write conflict, constraint, DDL và explicit locks vẫn cần coordination. Hai transaction lấy resource theo thứ tự ngược nhau vẫn deadlock.

## Câu trả lời chi tiết

Tôi vẽ wait-for cycle, xem lock graph và transaction statements. Database phát hiện rồi abort một participant; application phải rollback toàn transaction và có thể retry có giới hạn nếu operation idempotent. Fix thường là lock order nhất quán, transaction ngắn, index đúng và giảm hot resource.

## Deep Dive

Isolation level định nghĩa anomaly được phép, không bảo đảm mọi business invariant. Constraint hoặc atomic statement vẫn cần ở database boundary.

## Góc nhìn Production

Capture deadlock report/SQL/parameters có redaction, theo dõi transaction age và không tăng timeout để che cycle.

## Trade-offs

Isolation level định nghĩa anomaly được phép, không bảo đảm mọi business invariant. Constraint hoặc atomic statement vẫn cần ở database boundary.

## Câu trả lời sai thường gặp

MVCC nghĩa mọi query không bao giờ block nhau và deadlock là bug của database.

## Follow-up

- Lost update được ngăn bằng cách nào?

- Retry deadlock có thể lặp side effect ngoài DB không?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL concurrency control](https://www.postgresql.org/docs/current/mvcc.html)
