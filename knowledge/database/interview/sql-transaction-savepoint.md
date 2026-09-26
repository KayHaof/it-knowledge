---
id: sql-transaction-savepoint
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - savepoint
  - rollback
  - batch
relatedLessons:
  - spring-transaction-failure-playbook
sources:
  - title: Using @Transactional
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Transaction Propagation
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Rolling Back a Declarative Transaction
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Programmatic Transaction Management
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html
    organization: Spring
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
    - id: savepoint
      required: true
      aliases:
        - savepoint
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: rollback
      required: true
      aliases:
        - rollback
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: batch
      required: false
      aliases:
        - batch
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Rollback to savepoint giải phóng toàn bộ resource như rollback transaction và commit phần còn lại.
      penalty: 20
---

# Savepoint hữu ích trong batch transaction nhưng có giới hạn nào?

## Rubric

### Must Include

- savepoint

- rollback

### Strong Answer Includes

- batch

## Câu trả lời 30 giây

Savepoint rollback một phần trong cùng transaction, hữu ích bỏ qua record lỗi có chủ ý. Nó không giải phóng mọi lock/log và không biến batch thành nhiều commit độc lập.

## Câu trả lời chi tiết

Sau rollback to savepoint, transaction tiếp tục nhưng statement/constraint error semantics phụ thuộc engine. Transaction vẫn giữ snapshot/locks và log tới commit, nên batch lớn có thể bloat/timeout. Nếu mỗi item độc lập, chunk commit hoặc durable queue thường rõ hơn.

## Góc nhìn Production

Đo transaction age, lock footprint và log volume; giới hạn số savepoint. Không nuốt validation error mà không audit record lỗi.

## Trade-offs

Sau rollback to savepoint, transaction tiếp tục nhưng statement/constraint error semantics phụ thuộc engine. Transaction vẫn giữ snapshot/locks và log tới commit, nên batch lớn có thể bloat/timeout. Nếu mỗi item độc lập, chunk commit hoặc durable queue thường rõ hơn.

## Câu trả lời sai thường gặp

Rollback to savepoint giải phóng toàn bộ resource như rollback transaction và commit phần còn lại.

## Follow-up

- Batch partial failure nên commit theo chunk khi nào?

- Savepoint với deadlock retry có an toàn không?

## Nguồn chính thống

- [Spring — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Spring — Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
- [Spring — Rolling Back a Declarative Transaction](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html)
- [Spring — Programmatic Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html)
