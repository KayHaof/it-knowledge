---
id: q-spring-transaction-boundary
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - transaction
  - timeout
  - connection-pool
relatedLessons:
  - spring-postgresql-production-boundary
sources:
  - title: Spring declarative transaction management
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html
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
    - id: transaction
      required: true
      aliases:
        - transaction
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: timeout
      required: true
      aliases:
        - timeout
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: connection-pool
      required: false
      aliases:
        - connection-pool
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Transaction chỉ là annotation logic nên không giữ resource vật lý.
      penalty: 20
---

# Tại sao gọi remote API bên trong @Transactional có thể gây pool exhaustion?

## Rubric

### Must Include

- transaction

- timeout

### Strong Answer Includes

- connection-pool

## Câu trả lời 30 giây

Transaction thường giữ JDBC connection và có thể giữ lock trong lúc chờ network. Remote API chậm làm transaction dài, connections không được trả pool, request mới xếp hàng rồi timeout dây chuyền.

## Câu trả lời chi tiết

Tôi đo connection acquisition wait, transaction age, lock và remote latency trên cùng trace. Boundary nên chỉ bao invariant DB; side effect ngoài DB dùng outbox/workflow phù hợp. Timeout phải có budget giảm dần, nhưng timeout HTTP không mặc nhiên rollback hay cancel SQL ở mọi tầng.

## Deep Dive

Tăng pool có thể khuếch đại concurrency vào DB. Với nhiều replicas phải tính global connection budget, không tune từng Pod độc lập.

## Góc nhìn Production

Giới hạn in-flight, cảnh báo pending/acquire time, retry có budget và test dependency chậm thay vì chỉ happy path.

## Trade-offs

Tăng pool có thể khuếch đại concurrency vào DB. Với nhiều replicas phải tính global connection budget, không tune từng Pod độc lập.

## Câu trả lời sai thường gặp

Transaction chỉ là annotation logic nên không giữ resource vật lý.

## Follow-up

- Rollback DB có rollback email/Kafka không?

- Làm sao xử lý outcome unknown sau connection reset?

## Nguồn chính thống

- [Spring — Spring declarative transaction management](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html)
