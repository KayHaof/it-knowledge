---
id: distributed-two-phase-commit
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - 2PC
  - coordinator
  - availability
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
    - id: 2pc
      required: true
      aliases:
        - 2PC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: coordinator
      required: true
      aliases:
        - coordinator
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: availability
      required: false
      aliases:
        - availability
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - 2PC luôn nhanh hơn Saga vì chỉ có một transaction và không cần retry.
      penalty: 20
---

# Two-Phase Commit đổi availability và operational complexity như thế nào?

## Rubric

### Must Include

- 2PC

- coordinator

### Strong Answer Includes

- availability

## Câu trả lời 30 giây

2PC prepare rồi commit để atomic cross-resource, nhưng coordinator/participant có thể giữ lock và block khi coordinator chết. Nó không tự giải latency, retries hay business compensation.

## Câu trả lời chi tiết

Participants vote prepare và phải giữ durable state; coordinator quyết định commit/abort. Crash sau prepare khiến participant in-doubt, cần recovery/coordinator log. 2PC phù hợp resource hỗ trợ protocol và scope nhỏ; microservices thường chọn Saga/outbox để tránh lock xuyên service.

## Góc nhìn Production

Theo dõi in-doubt transactions, coordinator log, lock duration và recovery. Test coordinator crash/partition và manual resolution.

## Trade-offs

Participants vote prepare và phải giữ durable state; coordinator quyết định commit/abort. Crash sau prepare khiến participant in-doubt, cần recovery/coordinator log. 2PC phù hợp resource hỗ trợ protocol và scope nhỏ; microservices thường chọn Saga/outbox để tránh lock xuyên service.

## Câu trả lời sai thường gặp

2PC luôn nhanh hơn Saga vì chỉ có một transaction và không cần retry.

## Follow-up

- In-doubt participant phục hồi thế nào?

- Khi nào 2PC hợp hơn Saga?

## Nguồn chính thống

- [Spring — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Spring — Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
- [Spring — Rolling Back a Declarative Transaction](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html)
- [Spring — Programmatic Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html)
