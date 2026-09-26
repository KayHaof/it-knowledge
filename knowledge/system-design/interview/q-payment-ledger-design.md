---
id: q-payment-ledger-design
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
        - Bọc database transaction quanh HTTP call tới payment provider hoặc dùng Kafka exactly-once là đủ ngăn double charge.
      penalty: 20
---

# Thiết kế payment service thế nào để timeout/retry không thu tiền hai lần và ledger vẫn đối soát được?

## Rubric

### Must Include

- payment

- ledger

### Strong Answer Includes

- idempotency

## Câu trả lời 30 giây

Tách provider workflow khỏi immutable double-entry ledger. Mỗi payment command có idempotency key/state machine; ledger posting cân bằng debit-credit trong transaction. Unknown provider outcome được query/webhook/reconcile, không retry charge mù.

## Câu trả lời chi tiết

API tạo payment intent duy nhất theo merchant/idempotency key. Worker gọi provider với provider idempotency key, lưu attempt/external reference và chuyển state bằng compare-and-set. Ledger append postings bất biến, tổng debit bằng credit theo transaction/constraints; correction là reversal, không update lịch sử. Outbox phát events sau commit, consumers dedupe. Webhook được authenticate, lưu raw event ID và xử lý out-of-order theo provider state/version.

## Deep Dive

Exactly-once transport không giải business duplicate; cùng một order có thể có retry, partial capture/refund/chargeback. Reconciliation so provider settlement, internal workflow và ledger, tạo auditable exception queue.

## Góc nhìn Production

Encrypt/tokenize sensitive data, least privilege và approval cho manual action. Monitor unknown-age, duplicate-key conflict, unbalanced posting prevention, webhook lag và reconciliation differences; drill provider timeout/outage.

## Trade-offs

Exactly-once transport không giải business duplicate; cùng một order có thể có retry, partial capture/refund/chargeback. Reconciliation so provider settlement, internal workflow và ledger, tạo auditable exception queue.

## Câu trả lời sai thường gặp

Bọc database transaction quanh HTTP call tới payment provider hoặc dùng Kafka exactly-once là đủ ngăn double charge.

## Follow-up

- Ledger khác payment workflow state thế nào?

- Bạn xử lý webhook đến trước API response ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [PostgreSQL Global Development Group — PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL Global Development Group — PostgreSQL Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Apache Software Foundation — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
- [OWASP — OWASP Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html)
