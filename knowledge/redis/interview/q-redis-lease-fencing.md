---
id: q-redis-lease-fencing
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - lease
  - fencing
  - Redlock
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
    - id: lease
      required: true
      aliases:
        - lease
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: fencing
      required: true
      aliases:
        - fencing
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: redlock
      required: false
      aliases:
        - Redlock
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis command atomic nên SETNX lock luôn mutual exclusion kể cả failover; Redlock tự động tương đương consensus.
      penalty: 20
---

# SET NX PX đã đủ tạo distributed lock an toàn cho mọi critical section chưa?

## Rubric

### Must Include

- lease

- fencing

### Strong Answer Includes

- Redlock

## Câu trả lời 30 giây

Không. Phải có unique ownership token và compare-delete/renew atomic; holder có thể pause quá TTL rồi ghi stale. Với invariant nghiêm ngặt, protected resource cần fencing token hoặc conditional invariant, còn Redlock phải được đánh giá theo timing/failure assumptions.

## Câu trả lời chi tiết

Một Redis instance dùng SET key token NX PX ttl và Lua compare token khi release. Replication async tạo cửa sổ failover; WAIT giảm xác suất mất write nhưng không biến hệ thống thành linearizable. Redlock lấy majority trên independent masters trong lease validity, phụ thuộc clock drift, bounded elapsed time và failure-domain independence. Dù acquire thành công, GC/network pause vẫn tạo stale actor; monotonic fence phải được downstream atomically từ chối.

## Deep Dive

Lock tối ưu duplicate concurrency, không atomically bao phủ database + payment API. Idempotency/unique constraint/outbox vẫn bảo vệ outcome. Fencing number chỉ có tác dụng nếu resource lưu highest accepted token.

## Góc nhìn Production

Đo contention, acquisition/renew latency, TTL remaining và expired-before-release; retry có jitter. Test process pause, partition, failover và delayed write; break-lock phải fence old worker và reconcile.

## Trade-offs

Lock tối ưu duplicate concurrency, không atomically bao phủ database + payment API. Idempotency/unique constraint/outbox vẫn bảo vệ outcome. Fencing number chỉ có tác dụng nếu resource lưu highest accepted token.

## Câu trả lời sai thường gặp

Redis command atomic nên SETNX lock luôn mutual exclusion kể cả failover; Redlock tự động tương đương consensus.

## Follow-up

- Vì sao DEL không so token nguy hiểm?

- WAIT và fencing giải hai vấn đề khác nhau thế nào?

## Nguồn chính thống

- [Redis — Distributed Locks with Redis](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [Redis — Redis SET Command](https://redis.io/docs/latest/commands/set/)
- [Redis — Redis WAIT Command](https://redis.io/docs/latest/commands/wait/)
- [Redis — Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
