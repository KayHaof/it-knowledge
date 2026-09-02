---
id: redis-coordination-rate-limiting
slug: redis-locks-idempotency-rate-limiting
title: Redis Locks, Idempotency và Rate Limiting
description: Xây coordination primitive có atomicity, ownership, expiry và failure policy; biết khi Redis lock không đủ để bảo vệ correctness.
category: nosql
technology: Redis
level: senior
estimatedMinutes: 55
tags: ["redis","distributed-lock","idempotency","rate-limit","lua"]
prerequisites: ["redis-data-structures-expiration"]
related: ["redis-persistence-ha-cluster","high-concurrency","distributed-failures"]
next: kafka-broker-storage-replication
learningObjectives: ["Thiết kế lock có ownership token và lease","Xây rate limiter atomic với failure policy rõ","Phân biệt deduplication, idempotency và mutual exclusion"]
lastReviewed: 2026-09-02
sources: [{"title":"Distributed Locks with Redis","url":"https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis Rate Limiter","url":"https://redis.io/docs/latest/develop/use-cases/rate-limiter/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis Scripting with Lua","url":"https://redis.io/docs/latest/develop/programmability/eval-intro/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Ba vấn đề thường bị trộn
Mutual exclusion cố ngăn hai worker vào critical section cùng lúc. Idempotency làm cùng một logical command chạy lại vẫn có một hiệu ứng business. Deduplication phát hiện identifier đã thấy trong một retention window. Rate limiting quyết định cho phép request theo quota. Redis hỗ trợ xây primitive, nhưng guarantee end-to-end còn phụ thuộc resource authoritative và failure model.

Đừng dùng distributed lock nếu một atomic database statement, unique constraint, queue partitioning hay optimistic version đã giải quyết đúng hơn.

## Single-instance lease đúng tối thiểu
Acquire cần một operation atomic `SET key random-token NX PX ttl`. Token duy nhất đại diện ownership. Release phải compare token rồi delete atomically; `GET` và `DEL` riêng có race: lease cũ hết hạn, owner mới lấy lock, owner cũ xóa nhầm lock mới.

```lua title="Release chỉ khi vẫn là owner"
if redis.call('get', KEYS[1]) == ARGV[1] then
  return redis.call('del', KEYS[1])
else
  return 0
end
```

Lease phải dài hơn work dự kiến cộng network/scheduling margin, hoặc có renewal với ownership check. Nhưng stop-the-world pause, process suspension hay network partition vẫn có thể khiến worker tiếp tục sau khi lease hết.

## Fencing bảo vệ resource khỏi owner cũ
Ownership token ngăn xóa nhầm lock, chưa ngăn stale owner ghi vào database/storage sau khi lease hết. Fencing token là số tăng đơn điệu đi cùng quyền sở hữu; resource downstream từ chối token thấp hơn token mới nhất.

```text title="Timeline cần fencing"
Worker A nhận fence=41, bị pause và lease hết
Worker B nhận fence=42, ghi thành công
Worker A tỉnh lại, gửi write fence=41
Storage từ chối 41 vì đã thấy 42
```

Fencing chỉ hiệu quả nếu authoritative resource kiểm tra token atomically. Nếu downstream API không hỗ trợ điều đó, lock lease không tạo correctness tuyệt đối. Hãy nêu rõ assumption về clock drift/quorum khi dùng thuật toán nhiều node như Redlock theo tài liệu Redis.

## Idempotency record là state machine
Client gửi `Idempotency-Key`; server cần scope theo tenant/operation, hash request để chặn tái dùng key với payload khác và lưu trạng thái `PROCESSING/SUCCEEDED/FAILED` cùng response hoặc reference.

Race `GET key` rồi thực thi không an toàn. Claim phải atomic, nhưng hiệu ứng nằm ở database ngoài Redis vẫn có dual-write window. Với command tài chính, thường đặt idempotency record và business update trong cùng database transaction; Redis có thể tăng tốc lookup nhưng không làm owner cuối.

TTL của record phải dài hơn retry horizon. Xóa quá sớm cho duplicate quay lại; giữ mãi tăng memory/privacy burden.

## Rate limiter algorithms
| Thuật toán | State | Ưu điểm | Trade-off |
|---|---|---|---|
| Fixed window | counter + TTL | đơn giản, rẻ | burst ở ranh giới window |
| Sliding log | sorted set timestamp | chính xác theo request | memory và cleanup O(log N)/N |
| Sliding counter | các bucket | cân bằng | approximation |
| Token bucket | token + last refill | cho burst có kiểm soát | arithmetic/state update cần atomic |

Fixed window dùng `INCR` + `EXPIRE`, nhưng cả check/increment/expiry cần atomic. Lua/Redis Function giữ read-decide-write trong server; script phải bounded để không chặn các client khác.

```lua title="Fixed window giản lược"
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[2])
end
if current > tonumber(ARGV[1]) then
  return {0, current}
end
return {1, current}
```

Production response thường cần limit, remaining, reset/retry-after. Key dimension phải chống bypass: user, tenant, credential, route và đôi khi IP; đừng tin header client không được gateway xác thực.

## Fail-open hay fail-closed
Redis timeout trong đường đồng bộ buộc chọn policy. Security/financial quota có thể fail-closed để bảo vệ downstream nhưng giảm availability. UX/noncritical analytics có thể fail-open với local emergency limit. Có thể dùng layered limiter: local per-instance để chặn spike, Redis cho global quota, downstream concurrency limit làm lớp cuối.

Quyết định phải explicit theo endpoint, không catch exception rồi mặc định allow/deny cho cả hệ thống.

## Cluster và atomic boundary
Lua/transaction multi-key trong Redis Cluster cần keys cùng hash slot. Gắn cùng hash tag cho quota của một subject có thể đúng; dồn mọi subject của tenant lớn vào một tag có thể tạo hot shard. Cross-region active-active quota thường phải chấp nhận approximation/partitioned allowance hoặc dùng coordination mạnh hơn; speed-of-light và partition không biến mất.

## Failure scenarios
- Lock release bằng `DEL` không kiểm tra owner.
- Worker chạy lâu hơn TTL và hai owner cùng ghi.
- Retry `EVAL` sau timeout nhưng không biết script đã chạy; operation không idempotent.
- Rate key không có expiry do crash giữa `INCR`/`EXPIRE`.
- Một global key thành hot key giới hạn throughput toàn service.
- Redis fail-open làm database sập; fail-closed biến cache outage thành outage API.
- Idempotency key dùng chung giữa tenant hoặc payload khác.

:::production Checklist coordination
Viết safety/liveness property; ưu tiên primitive authoritative đơn giản; token ownership + atomic release; đặt deadline/TTL/renewal; dùng fencing nếu stale owner có thể gây hại; scope và hash idempotency request; chọn rate algorithm/failure policy; giới hạn script; monitor denied/error/latency/hot key; chaos test pause, timeout, failover và duplicate.
:::

## Góc phỏng vấn
"SETNX có đủ làm distributed lock?" — Không. Cần atomic acquire cùng TTL, unique ownership token, compare-delete release, xử lý lease expiry/renewal và failure assumptions. Nếu stale owner có thể ghi, cần fencing ở resource hoặc chọn cơ chế khác.

## Key Takeaways
- Lock, idempotency, dedup và rate limit giải quyết bài toán khác nhau.
- Lease hết hạn tạo stale owner; token release chưa phải fencing.
- Atomic Redis script không bao phủ side effect ngoài Redis.
- Rate limiter phải có explicit failure policy và bounded state.
- Correctness quan trọng nên neo ở system có thể enforce invariant.
