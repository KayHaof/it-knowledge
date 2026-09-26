---
id: interview-system-design-payment-ledger
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - payment
  - ledger
  - idempotency
relatedLessons:
  - system-design-payment-ledger
sources:
  - title: PostgreSQL Transaction Isolation
    url: https://www.postgresql.org/docs/current/transaction-iso.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Constraints
    url: https://www.postgresql.org/docs/current/ddl-constraints.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Explicit Locking
    url: https://www.postgresql.org/docs/current/explicit-locking.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Design
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Software Foundation
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OWASP Transaction Authorization Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
    organization: OWASP
    type: standard
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
    - id: payment
      required: true
      aliases:
        - payment
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: ledger
      required: true
      aliases:
        - ledger
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: idempotency
      required: false
      aliases:
        - idempotency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Nếu HTTP call timeout thì gửi payment request lần nữa với UUID mới để chắc chắn thành công.
      penalty: 20
---

# Thiết kế payment workflow tránh double charge và unknown outcome?

## Rubric

### Must Include

- payment

- ledger

### Strong Answer Includes

- idempotency

## Câu trả lời 30 giây

Dùng idempotency key, immutable ledger và provider reference; trạng thái pending/authorized/captured/refunded rõ. Timeout không retry command mới mà query/reconcile cùng key.

## Câu trả lời chi tiết

Tách order intent khỏi ledger entries, outbox phát event và webhook dedup. Amount/currency invariant kiểm server-side; compensation/refund không phải rollback. Reconciliation định kỳ với provider và manual review cho state không xác định.

## Góc nhìn Production

Audit append-only, encrypt/tokenize PII, alert mismatch/duplicate và age pending.

## Trade-offs

Tách order intent khỏi ledger entries, outbox phát event và webhook dedup. Amount/currency invariant kiểm server-side; compensation/refund không phải rollback. Reconciliation định kỳ với provider và manual review cho state không xác định.

## Câu trả lời sai thường gặp

Nếu HTTP call timeout thì gửi payment request lần nữa với UUID mới để chắc chắn thành công.

## Follow-up

- Ledger correction không mutate history thế nào?

- Webhook giả mạo xác thực ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [PostgreSQL Global Development Group — PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL Global Development Group — PostgreSQL Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Apache Software Foundation — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
- [OWASP — OWASP Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html)
