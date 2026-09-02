---
id: redis-streams-pubsub
slug: redis-streams-pubsub
title: Redis Streams và Pub/Sub trong Production
description: Chọn transient fan-out hay durable stream, vận hành consumer group, pending entries, reclaim, trimming và idempotent processing.
category: nosql
technology: Redis
level: advanced
estimatedMinutes: 62
tags: ["redis","streams","pubsub","consumer-group","messaging"]
prerequisites: ["redis-data-structures-expiration"]
related: ["kafka-delivery","realtime-protocols","redis-persistence-ha-cluster"]
next: redis-distributed-locks-leases-redlock
learningObjectives: ["Phân biệt delivery semantics của Pub/Sub và Streams","Vận hành consumer group, pending và recovery đúng cách","Thiết kế retention, ordering và idempotency cho production"]
lastReviewed: 2026-09-02
sources: [{"title":"Redis Pub/Sub","url":"https://redis.io/docs/latest/develop/pubsub/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis XADD Command","url":"https://redis.io/docs/latest/commands/xadd/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis XREADGROUP Command","url":"https://redis.io/docs/latest/commands/xreadgroup/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis XAUTOCLAIM Command","url":"https://redis.io/docs/latest/commands/xautoclaim/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: live radio và append-only inbox

Redis Pub/Sub giống phát thanh trực tiếp: publisher đẩy message tới subscribers đang kết nối. Redis Streams giống một log có key, entry ID và khả năng đọc lại. Cả hai dùng Redis nhưng có failure semantics rất khác; chọn theo yêu cầu mất message, replay, fan-out và operational state, không chọn vì API nào ngắn hơn.

~~~mermaid
flowchart LR
  P[Publisher] --> PS[Pub/Sub channel]
  PS --> A[Subscriber đang online]
  PS -. mất khi offline .-> B[Subscriber ngắt kết nối]
  P --> S[Stream entries]
  S --> G1[Consumer group A]
  S --> G2[Consumer group B]
~~~

## Pub/Sub: at-most-once và không có backlog

Tài liệu Redis xác định Pub/Sub có at-most-once delivery. Sau khi server gửi message, nó không lưu để retry nếu subscriber lỗi hoặc network đứt. Subscriber mới không đọc được lịch sử. Vì vậy Pub/Sub phù hợp cho invalidation hint, live UI update hoặc signal có thể tái dựng từ source of truth.

Pub/Sub fan-out tới từng subscription. Một client vừa subscribe channel vừa subscribe pattern khớp channel có thể nhận message qua cả hai subscription; application không nên suy diễn “mỗi payload đúng một lần”. Channel cũng không scoped theo Redis logical database; cần naming convention chứa environment/application/tenant thích hợp.

Sharded Pub/Sub được giới thiệu từ Redis 7.0 và hạn chế propagation trong shard; command và cluster behavior là version-dependent. Nó cải thiện topology scaling nhưng không biến delivery thành durable.

## Streams: entry có ID và được giữ tới khi trim

XADD append field-value entry vào stream. Với ID dấu sao, Redis tạo ID tăng theo time/sequence của stream. ID hữu ích làm cursor nhưng không tự là business event time hoặc global ordering giữa nhiều stream/shard. Nếu cần event ID để deduplicate, hãy ghi một business identifier riêng.

~~~redis
XADD orders MAXLEN ~ 100000 *
  eventId 01J...
  type OrderPaid
  orderId 8742
  schemaVersion 3
~~~

MAXLEN với dấu ngã cho approximate trimming, thường giảm cost nhưng length có thể vượt target tạm thời. Exact/approximate semantics và option availability phụ thuộc Redis version. Retention theo số entry không tương đương retention theo thời gian hay bytes; payload size thay đổi làm memory khó dự đoán. XTRIM/XADD policies phải gắn với memory budget và replay window.

Stream được persistence/replication theo cấu hình Redis hiện hữu. “Entry nằm trong stream” không tự đồng nghĩa đã fsync hoặc tồn tại sau mọi failover; durability vẫn phụ thuộc RDB/AOF, acknowledgement và topology.

## Hai kiểu đọc Streams

XREAD với cursor riêng phù hợp khi mỗi reader tự quản vị trí và có thể replay. Consumer groups thêm server-side coordination: một logical group phân phối entries mới cho consumers trong group thay vì gửi mỗi entry cho tất cả. Muốn ba dịch vụ độc lập đều xử lý mọi event, tạo ba groups; ba consumers cùng một group là competing consumers.

Luồng cơ bản:

~~~redis
XGROUP CREATE orders billing 0 MKSTREAM
XREADGROUP GROUP billing worker-7 COUNT 50 BLOCK 2000 STREAMS orders >
XACK orders billing 1710000000000-0
~~~

Dấu lớn hơn yêu cầu messages chưa từng giao cho group. Khi giao mà chưa ACK, entry vào Pending Entries List (PEL) gắn với consumer. ACK chỉ nên xảy ra sau khi side effect đạt trạng thái mà application coi là hoàn tất.

Nếu ACK trước side effect, crash có thể làm mất processing. Nếu side effect trước ACK, crash ở giữa tạo delivery lại và duplicate side effect. Streams không tạo atomic transaction với database/API bên ngoài; inbox table, unique constraint hoặc idempotency key vẫn cần.

## Pending, reclaim và poison messages

Worker chết để lại pending entries. Operations phải quan sát số pending, idle time, delivery count/claim history và oldest pending age. XAUTOCLAIM có thể chuyển ownership của entries đã idle đủ lâu sang consumer khác; command được giới thiệu theo version cụ thể và response/options tiếp tục thay đổi, nên client compatibility phải được kiểm tra.

Idle threshold quá ngắn làm worker chậm hợp lệ và recovery worker xử lý cùng lúc. Quá dài làm recovery chậm. Lease ownership của PEL không hủy code cũ đang chạy; side effect phải idempotent.

Bounded retry rất quan trọng. Một poison event không nên quay vô hạn:

1. ghi error classification và original stream ID;
2. retry có backoff, giới hạn attempts;
3. chuyển/quarantine vào error stream theo policy;
4. ACK original chỉ sau khi quarantine write đạt durability policy;
5. có owner, replay tool và audit.

Việc ghi error stream rồi ACK original là hai operations; dùng Lua/MULTI khi cùng Redis key/slot và atomicity thực sự cần, nhưng external side effect vẫn nằm ngoài transaction.

## Ordering không đồng nghĩa completion order

Entry IDs tạo order trong một stream. Consumer group giao entries theo stream order, nhưng nhiều workers hoàn tất khác thứ tự; retry/reclaim càng làm đảo completion. Nếu business yêu cầu per-order ordering, route cùng aggregate tới một serialized lane/stream hoặc dùng partitioning strategy ở hệ thống phù hợp hơn.

Một stream key là một key trong Redis Cluster và thuộc một hash slot. Một “global stream” tải cao có thể thành hot key/hot shard dù cluster có nhiều nodes. Tách streams theo tenant/bucket tăng scale nhưng làm global ordering và operations phức tạp. Multi-key commands/scripts trong Cluster cần keys cùng slot; hash tags là công cụ nhưng dễ tạo hotspot nếu dùng quá rộng.

## Backpressure và memory

BLOCK không thay thế bounded application queue. Consumer có thể fetch batch nhanh hơn downstream database, giữ nhiều objects trong memory và để PEL tăng. Điều chỉnh COUNT, worker concurrency và in-flight cap theo sink capacity. Pause fetch hoặc giảm admission khi pending/latency vượt ngưỡng.

Trimming phải xét slowest required group. Nếu entry bị trim khỏi stream trong khi reference còn ở PEL hoặc consumer quá chậm, recovery semantics có thể bất ngờ tùy command/version. Theo dõi first/last ID, length, memory usage, lag/delivery state của từng group và retention headroom trước khi trim mạnh.

## Decision table

| Yêu cầu | Pub/Sub | Streams |
|---|---|---|
| Chỉ cần subscribers online | Phù hợp | Có thể nhưng thêm state |
| Replay/backlog | Không | Có |
| Competing consumers | Không có group | Consumer group |
| Fan-out nhiều dịch vụ | Tự nhiên | Một group mỗi dịch vụ |
| ACK/recovery | Không | PEL, ACK, claim |
| Operational cost | Thấp hơn | Retention, lag, pending, retry |

Nếu cần retention dài, partition scale lớn, schema governance và ecosystem streaming, Kafka có thể phù hợp hơn. Redis Streams hữu ích khi scope vừa phải và đội ngũ đã sở hữu Redis, nhưng không nên biến cache critical path thành message system mà thiếu capacity/isolation plan.

## Troubleshooting

Khi consumer “không nhận message”, xác định đang dùng > hay pending ID, group tạo từ 0 hay dấu đô-la, consumer/group/key có đúng không. Khi lag tăng, so arrival rate với service rate, PEL và downstream wait. Khi memory tăng, xem stream lengths, payload, trim policy, groups không còn dùng và replica/AOF impact.

Pub/Sub mất events khi reconnect là expected semantics, không phải lỗi retry configuration. Nếu event không được phép mất, đổi abstraction.

## Failure scenarios

- Dùng Pub/Sub cho thanh toán bắt buộc xử lý dù consumer offline.
- Dùng một group cho hai dịch vụ nhưng mong cả hai nhận mọi event.
- ACK trước khi database commit.
- Reclaim quá sớm, hai workers cùng tạo side effect.
- Không trim stream, Redis memory tăng vô hạn.
- Trim theo length nhỏ hơn replay/slow-consumer window.
- Một global stream làm hot shard trong Cluster.
- Coi Redis persistence mặc định là durability guarantee tuyệt đối.

:::production Checklist
Chốt loss/replay/fan-out contract; chọn Pub/Sub hay Streams có chủ đích; ghi event ID và schema version; đặt retention theo measured bytes/rate/window; theo dõi stream length, oldest entry, group lag, PEL, oldest pending và retry; giới hạn in-flight; idempotent side effects; quarantine poison; test disconnect, crash-before/after-ACK, reclaim, trim và failover; xác minh Redis/client version.
:::

## Góc phỏng vấn

“Redis Pub/Sub khác Streams thế nào?” — Pub/Sub là transient at-most-once cho subscribers online; Streams giữ entries và hỗ trợ cursor/consumer group/PEL/ACK. Streams vẫn thường at-least-once quanh external side effect, nên cần idempotency. Ứng viên advanced phải nói một group là load sharing, nhiều groups là fan-out, cùng rủi ro trimming, pending và hot stream.

## Key Takeaways

- Pub/Sub không có replay; disconnect có thể mất message vĩnh viễn.
- Streams thêm durable entries và consumer state, đồng thời thêm operations.
- ACK không atomically bao phủ external side effect.
- PEL/reclaim đòi hỏi idle threshold, retry và idempotency.
- Retention, hot key và downstream backpressure quyết định production safety.

