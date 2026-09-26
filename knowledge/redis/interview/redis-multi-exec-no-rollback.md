---
id: redis-multi-exec-no-rollback
type: interview-question
technology: Redis
category: Redis
difficulty: middle
topics:
  - MULTI
  - EXEC
  - transactions
relatedLessons:
  - redis-coordination-rate-limiting
sources:
  - title: Distributed Locks with Redis
    url: https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Rate Limiter
    url: https://redis.io/docs/latest/develop/use-cases/rate-limiter/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Scripting with Lua
    url: https://redis.io/docs/latest/develop/programmability/eval-intro/
    organization: Redis
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
    - id: multi
      required: true
      aliases:
        - MULTI
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: exec
      required: true
      aliases:
        - EXEC
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: transactions
      required: false
      aliases:
        - transactions
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - MULTI/EXEC đảm bảo mọi command cùng thành công hoặc Redis tự undo tất cả.
      penalty: 20
---

# Redis MULTI/EXEC có rollback như database transaction không?

## Rubric

### Must Include

- MULTI

- EXEC

### Strong Answer Includes

- transactions

## Câu trả lời 30 giây

Không. Commands được queue rồi execute tuần tự tại EXEC, nhưng runtime error của một command không rollback các command trước. Nó cung cấp atomic execution trên một instance, không isolation/durability kiểu RDBMS.

## Câu trả lời chi tiết

WATCH tạo optimistic check-and-abort trước EXEC; client retry khi watched key đổi. Syntax/queue error có thể abort transaction, nhưng command error sau EXEC vẫn để side effects trước đó. Cluster yêu cầu cùng slot. Business invariant phức tạp nên dùng Lua hoặc durable database.

## Góc nhìn Production

Theo dõi WATCH abort, command errors và retry storms. Không đặt transaction lớn/hot key gây block event loop.

## Trade-offs

WATCH tạo optimistic check-and-abort trước EXEC; client retry khi watched key đổi. Syntax/queue error có thể abort transaction, nhưng command error sau EXEC vẫn để side effects trước đó. Cluster yêu cầu cùng slot. Business invariant phức tạp nên dùng Lua hoặc durable database.

## Câu trả lời sai thường gặp

MULTI/EXEC đảm bảo mọi command cùng thành công hoặc Redis tự undo tất cả.

## Follow-up

- WATCH khác pessimistic lock thế nào?

- Lua và MULTI chọn theo điều kiện nào?

## Nguồn chính thống

- [Redis — Distributed Locks with Redis](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [Redis — Redis Rate Limiter](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)
- [Redis — Redis Scripting with Lua](https://redis.io/docs/latest/develop/programmability/eval-intro/)
