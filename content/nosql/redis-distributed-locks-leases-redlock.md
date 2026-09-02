---
id: redis-distributed-locks-leases-redlock
slug: redis-distributed-locks-leases-redlock
title: Redis Distributed Locks, Leases và Redlock
description: Thiết kế Redis lease có token ownership, atomic release, expiry budget và fencing; đánh giá Redlock trung lập theo assumptions và correctness risk.
category: nosql
technology: Redis
level: senior
estimatedMinutes: 68
tags: ["redis","distributed-lock","lease","redlock","fencing-token"]
prerequisites: ["redis-coordination-rate-limiting","distributed-failures"]
related: ["transactions-mvcc-deadlocks","redis-persistence-ha-cluster","idempotency-retry-circuit-breaker"]
next: kafka-kraft-partitions-ordering
learningObjectives: ["Phân biệt lock cục bộ với lease phân tán có thời hạn","Cài ownership và release an toàn, nhận diện stale holder","Đánh giá Redlock, WAIT và fencing theo failure model cụ thể"]
lastReviewed: 2026-09-02
sources: [{"title":"Distributed Locks with Redis","url":"https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis SET Command","url":"https://redis.io/docs/latest/commands/set/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis WAIT Command","url":"https://redis.io/docs/latest/commands/wait/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis Replication","url":"https://redis.io/docs/latest/operate/oss_and_stack/management/replication/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: đây là lease, không phải quyền sở hữu vĩnh viễn

Redis lock có TTL cấp quyền tạm thời. Client A có thể tin mình giữ lock, bị pause lâu hơn TTL, rồi client B lấy lease mới. Khi A tỉnh lại, cả hai có thể chạy. Vì vậy lock acquisition chỉ trả lời “tại một thời điểm gần đây tôi nhận lease”; nó không chứng minh side effect hiện tại vẫn được chấp nhận.

~~~mermaid
sequenceDiagram
  participant A as Client A
  participant R as Redis
  participant B as Client B
  participant S as Protected resource
  A->>R: SET lock tokenA NX PX ttl
  R-->>A: OK
  Note over A: GC pause dài hơn ttl
  B->>R: SET lock tokenB NX PX ttl
  R-->>B: OK
  A->>S: stale write
  B->>S: current write
~~~

Trước khi chọn thuật toán, xác định correctness: duplicate job chỉ tốn chi phí, hay hai writers có thể làm sai tiền, inventory hoặc schema? Với rủi ro cao, idempotency, database invariant và fencing quan trọng hơn việc “lock có vẻ hoạt động”.

## Primitive một Redis instance

Acquisition cơ bản dùng một command atomic:

~~~redis
SET lock:invoice:8742 7f9a... NX PX 15000
~~~

NX chỉ set khi key chưa tồn tại; PX đặt expiry. Value phải là token ngẫu nhiên đủ duy nhất cho lần acquisition, không chỉ client ID cố định. Nếu cùng client acquire lần sau, token cũ không được phép xóa lease mới.

Release phải compare-and-delete atomically, thường bằng Lua:

~~~lua
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
~~~

GET rồi DEL bằng hai round trips có race: lease có thể hết hạn và client khác acquire giữa hai command. DEL không kiểm token còn nguy hiểm hơn. Renew/extend cũng phải compare token atomically; heartbeat mù có thể gia hạn lease của owner mới.

Token nên tồn tại trong context task và không log toàn bộ nếu có thể bị lạm dụng. Release là best effort trong finally; TTL mới đảm bảo liveness khi process chết.

## Chọn TTL bằng failure budget

TTL phải dài hơn worst-case critical section cộng network/Redis latency, scheduler pause và safety margin, nhưng TTL dài làm recovery chậm khi holder chết. Không dùng average. Nếu work không bounded, hoặc chia thành chunks/checkpoints, hoặc dùng renewal có deadline.

Renewal không loại bỏ stale holder. Network partition có thể khiến client không biết renew thành công; GC/process pause có thể ngăn renewal. Client phải ngừng bắt đầu work mới khi lease validity còn quá ít. Side effect dài cần cancellation/cooperative checks, nhưng thread cũ vẫn có thể không dừng kịp.

Đo acquisition latency, contention, TTL remaining khi bắt đầu/hoàn tất, renew failures, expired-before-release và duplicate outcome. Tránh spin tight loop; retry có randomized backoff và deadline. Fairness không được Redis lock primitive đảm bảo.

## Failover làm single-primary lock yếu đi

Redis replication thường asynchronous. Failure sequence kinh điển:

1. A acquire key trên primary.
2. Primary chết trước khi key replicate.
3. Replica chưa có key được promote.
4. B acquire cùng lock.
5. A và B đều nghĩ mình sở hữu.

WAIT có thể chờ write được acknowledged bởi một số replicas trong thời gian giới hạn, giúp giảm xác suất mất write. Tài liệu WAIT nói rõ nó không biến Redis thành strongly consistent store; failover và persistence vẫn có cửa sổ. Không gắn nhãn linearizable chỉ vì WAIT trả đủ replicas.

Nếu duplicate execution chấp nhận được nhờ idempotency, single Redis lease có thể là trade-off hợp lý. Nếu mutual exclusion là safety-critical, phải đánh giá failure model thay vì ngầm tin failover.

## Redlock: thuật toán và assumptions

Redlock trong tài liệu Redis dùng nhiều Redis masters độc lập. Client:

1. lấy cùng resource với unique token trên từng instance, dùng timeout nhỏ;
2. thành công khi đạt majority và tổng elapsed time nhỏ hơn lease validity;
3. validity còn lại bị giảm bởi elapsed time và clock-drift allowance;
4. nếu thất bại, release trên các instances có thể đã set.

Mục đích là tránh phụ thuộc một replication primary/failover. Tuy nhiên guarantee phụ thuộc assumptions về clock drift, bounded operation time, network timing và majority independence. Process pause hoặc protected resource chấp nhận stale writer vẫn là vấn đề. Library implementation, Redis version và deployment topology phải được audit; năm endpoints trên cùng failure domain không thật sự độc lập.

Đánh giá trung lập:

- dùng được khi lease semantics phù hợp, failure assumptions được chấp nhận và duplicate có mitigation;
- không nên quảng cáo như consensus hoặc transaction lock tổng quát;
- với invariant nghiêm ngặt, cần cơ chế downstream từ chối stale holder hoặc store có consistency model phù hợp;
- complexity vận hành nhiều masters phải được cân với lợi ích.

Không tranh luận thuật toán bằng slogan “luôn an toàn” hoặc “luôn sai”. Viết threat/failure model, test pauses/partitions và chọn theo consequence.

## Fencing token đóng cửa stale holder

Fencing token là sequence tăng đơn điệu được cấp cùng quyền. Protected resource lưu token lớn nhất đã chấp nhận và từ chối request có token nhỏ hơn:

~~~text
lease A -> fence 41
lease B -> fence 42
resource nhận write(42), sau đó từ chối stale write(41)
~~~

Điều này hiệu quả chỉ khi resource thực sự enforce atomic comparison. Truyền token mà file store/API bỏ qua thì vô nghĩa. Một INCR trên Redis có thể tạo số tăng trong một node, nhưng durability/failover của generator phải đáp ứng guarantee cần thiết; không tự suy ra globally monotonic qua mọi failure.

Database có thể enforce bằng conditional update:

~~~sql
UPDATE job_state
SET owner_token = :new_token, result = :result
WHERE job_id = :id
  AND owner_token < :new_token;
~~~

Nếu database đã có unique constraint, row lock hoặc compare-and-set đủ để bảo vệ invariant, Redis lock có thể chỉ giảm duplicate work. Giữ invariant ở system of record thường dễ reason hơn.

## Lock không thay idempotency và transaction

Lease không atomically bao phủ “đọc DB, gọi payment, ghi DB”. Crash ở bất kỳ boundary nào vẫn tạo partial outcome. Dùng idempotency key tại external API, unique business constraint, outbox/inbox hoặc state machine. Lock tối ưu concurrency; invariant quyết định correctness.

Không khóa resource quá rộng như lock:all-orders. Hot lock tạo convoy, tail latency và thundering herd khi release. Khóa theo aggregate, giới hạn queue và trả busy/retry-after nếu phù hợp. Multi-resource acquisition cần canonical ordering hoặc try/release để tránh deadlock-like livelock.

## Operations và incident response

Keyspace scan không nên là dashboard. Instrument tại client với resource class đã giảm cardinality; Redis monitor latency, CPU, memory, replication/failover. Trong incident, không DEL một key lạ trước khi biết token/owner/TTL: có thể mở critical section thứ hai. Nếu buộc break lock, cần business authorization, fence old worker và reconciliation.

Clock wall có thể nhảy; elapsed duration trong client nên dùng monotonic clock nếu library/OS hỗ trợ. Algorithm cụ thể có yêu cầu riêng, phụ thuộc implementation/version.

## Failure scenarios

- Acquire bằng SETNX rồi EXPIRE riêng; process chết giữa hai command.
- Release bằng DEL không so token.
- Job pause vượt TTL nhưng vẫn ghi kết quả.
- Tăng TTL vô hạn để “chắc chắn”, làm recovery tê liệt.
- Tin failover replica giữ mọi lock vì replication “gần real-time”.
- Coi WAIT là strong consistency.
- Dùng Redlock nhưng mọi instances cùng host/failure domain.
- Có fencing number nhưng downstream không kiểm.
- Dùng lock thay unique constraint/idempotency.

:::production Checklist
Phân loại consequence của duplicate; dùng SET NX PX với unique token; compare-and-delete/renew atomic; đặt bounded TTL và deadline; retry backoff+jitter; đo expiry/renew/contention; đánh giá replication/failover; nếu dùng Redlock, ghi assumptions và independent failure domains; dùng fencing nơi stale write nguy hiểm; giữ invariant/idempotency tại source of truth; test process pause, network partition, failover và delayed stale write.
:::

## Góc phỏng vấn

“Redis distributed lock có an toàn không?” — Câu trả lời senior không chỉ đưa SET NX PX. Cần token ownership, atomic release, TTL/renewal và failure khi holder pause. Redis replication async tạo failover window; WAIT chỉ cải thiện durability xác suất. Redlock cần majority và timing assumptions. Với critical resource, fencing và downstream invariant mới chặn stale writer.

## Key Takeaways

- TTL biến lock thành lease; holder có thể trở thành stale.
- Release và renewal phải kiểm đúng acquisition token atomically.
- Replication acknowledgement không tự tạo linearizability.
- Redlock phải được đánh giá theo assumptions và consequence cụ thể.
- Fencing, idempotency và source-of-truth constraint bảo vệ correctness.
