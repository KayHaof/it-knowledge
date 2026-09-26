---
id: redis-lock-token-release
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - distributed-lock
  - token
  - lease
relatedLessons:
  - redis-distributed-locks-leases-redlock
sources:
  - title: Distributed Locks with Redis
    url: https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis SET Command
    url: https://redis.io/docs/latest/commands/set/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis WAIT Command
    url: https://redis.io/docs/latest/commands/wait/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Replication
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/replication/
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
    - id: distributed-lock
      required: true
      aliases:
        - distributed-lock
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: token
      required: true
      aliases:
        - token
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: lease
      required: false
      aliases:
        - lease
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - DEL lock key luôn an toàn vì chỉ process từng set key mới được quyền xóa.
      penalty: 20
---

# Vì sao release Redis lock phải compare token trong một atomic operation?

## Rubric

### Must Include

- distributed-lock

- token

### Strong Answer Includes

- lease

## Câu trả lời 30 giây

DEL key mù có thể xóa lock do owner khác sau khi lease cũ hết hạn. Owner sinh random token và Lua chỉ xóa nếu value khớp; vẫn cần fencing/idempotency cho side effect stale.

## Câu trả lời chi tiết

Acquire `SET key token NX PX ttl`; nếu process pause quá TTL, another owner có thể lấy lock. Unlock compare-and-delete ngăn owner cũ xóa lock mới nhưng không ngăn nó ghi protected resource sau pause. Fencing token tăng dần và downstream reject token cũ mới bảo vệ invariant nghiêm ngặt.

## Góc nhìn Production

Đo acquire/renew latency, expired-before-release và contention; test GC pause/network partition. Có runbook reconcile khi lease holder mất.

## Trade-offs

Acquire `SET key token NX PX ttl`; nếu process pause quá TTL, another owner có thể lấy lock. Unlock compare-and-delete ngăn owner cũ xóa lock mới nhưng không ngăn nó ghi protected resource sau pause. Fencing token tăng dần và downstream reject token cũ mới bảo vệ invariant nghiêm ngặt.

## Câu trả lời sai thường gặp

DEL lock key luôn an toàn vì chỉ process từng set key mới được quyền xóa.

## Follow-up

- Fencing token phải enforce ở đâu?

- Renew lease thất bại xử lý side effect thế nào?

## Nguồn chính thống

- [Redis — Distributed Locks with Redis](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [Redis — Redis SET Command](https://redis.io/docs/latest/commands/set/)
- [Redis — Redis WAIT Command](https://redis.io/docs/latest/commands/wait/)
- [Redis — Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
