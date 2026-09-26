---
id: redis-lua-atomic-multi-step
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - Lua
  - atomicity
  - scripts
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
    - id: lua
      required: true
      aliases:
        - Lua
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: atomicity
      required: true
      aliases:
        - atomicity
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: scripts
      required: false
      aliases:
        - scripts
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Lua script đảm bảo atomic transaction trên toàn Redis Cluster và không thể làm Redis chậm.
      penalty: 20
---

# Lua script trong Redis giúp atomic multi-step operation ở mức nào?

## Rubric

### Must Include

- Lua

- atomicity

### Strong Answer Includes

- scripts

## Câu trả lời 30 giây

Script chạy tuần tự trên một Redis instance nên không client nào xen giữa các lệnh trong script. Nó không biến nhiều instance/DB thành distributed transaction và script dài sẽ block server.

## Câu trả lời chi tiết

Rate limit check-and-increment hoặc compare-and-delete lock cần atomicity; script nhận KEYS/ARGV rõ và deterministic để replication. Cluster yêu cầu keys cùng hash slot. Giới hạn runtime, tránh scan/network trong script và version script khi deploy.

## Góc nhìn Production

Theo dõi command latency/slowlog, script timeout và replication lag; kiểm ACL quyền EVAL.

## Trade-offs

Rate limit check-and-increment hoặc compare-and-delete lock cần atomicity; script nhận KEYS/ARGV rõ và deterministic để replication. Cluster yêu cầu keys cùng hash slot. Giới hạn runtime, tránh scan/network trong script và version script khi deploy.

## Câu trả lời sai thường gặp

Lua script đảm bảo atomic transaction trên toàn Redis Cluster và không thể làm Redis chậm.

## Follow-up

- MULTI/EXEC khác Lua ở đâu?

- Hash tag giải quyết cross-key cluster thế nào?

## Nguồn chính thống

- [Redis — Distributed Locks with Redis](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [Redis — Redis Rate Limiter](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)
- [Redis — Redis Scripting with Lua](https://redis.io/docs/latest/develop/programmability/eval-intro/)
