---
id: redis-data-structures-expiration
slug: redis-data-structures-expiration-eviction
title: Redis Data Structures, Expiration và Eviction
description: Model dữ liệu theo command complexity, memory và access pattern; phân biệt TTL expiration với maxmemory eviction trong production.
category: nosql
technology: Redis
level: intermediate
estimatedMinutes: 50
tags: ["redis","data-structures","ttl","eviction","memory"]
prerequisites: []
related: ["redis-cache-aside","redis-persistence-ha-cluster"]
next: redis-persistence-ha-cluster
learningObjectives: ["Chọn Redis type theo access pattern và complexity","Giải thích expiration khác eviction","Phát hiện big key, hot key và unbounded collection"]
lastReviewed: 2026-09-02
sources: [{"title":"Redis Data Types","url":"https://redis.io/docs/latest/develop/data-types/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis EXPIRE Command","url":"https://redis.io/docs/latest/commands/expire/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Redis Key Eviction","url":"https://redis.io/docs/latest/develop/reference/eviction/","organization":"Redis","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Redis không chỉ là String cache
Redis là data-structure server: command chạy gần dữ liệu và phần lớn state nằm trong memory. Thiết kế tốt bắt đầu từ operation cần atomic và query direction, không bắt đầu từ việc serialize mọi object thành JSON string.

Một command có big-O tốt vẫn có thể chậm nếu collection/key quá lớn; `O(N)` với N=20 khác N=20 triệu. Vì Redis xử lý command theo execution model có phần tuần tự trung tâm, một command dài có thể làm latency của client khác tăng.

## Chọn type theo access pattern
| Type | Access pattern phù hợp | Rủi ro cần kiểm soát |
|---|---|---|
| String | cache blob, counter, token | value lớn, read-modify-write không atomic |
| Hash | record có field, counter theo field | hash khổng lồ, TTL thường ở key level |
| List | queue/deque đơn giản, bounded recent items | blocking/retention và reliability semantics |
| Set | membership, unique tags, intersection | phép tập hợp trên set lớn |
| Sorted set | leaderboard, time/rank index | score tie, range/removal lớn |
| Stream | append log, consumer groups | pending entries, trimming, replay lifecycle |
| Bitmap/HyperLogLog | dense boolean / approximate cardinality | offset range / sai số có chủ đích |

```text title="Key design có namespace và bounded scope"
user:{42}:profile
user:{42}:sessions
leaderboard:{season-2026}
rate:{tenant-17}:{2026-09-02T10:42}
```

Curly-brace hash tag có ý nghĩa placement trong Redis Cluster; chỉ dùng khi cần multi-key cùng slot và hiểu nguy cơ hot slot. Đừng đưa mọi key của tenant lớn vào cùng một hash tag.

## Atomic command trước, transaction/script sau
`INCR`, `HINCRBY`, `SADD ...` đã atomic ở mức command. Nếu workflow gồm nhiều command với điều kiện, có thể dùng Lua/Functions hoặc transaction tùy semantics. Atomicity không làm thao tác remote bên ngoài Redis trở thành atomic.

```text title="Counter có expiration cần một atomic unit"
INCR api:minute:tenant-17:27839562
EXPIRE api:minute:tenant-17:27839562 120
```

Hai command riêng có failure window sau `INCR`. Có thể gói logic vào script/function hoặc dùng command/options phù hợp. Script dài vẫn block execution, nên cần giới hạn input và thời gian.

## TTL expiration khác maxmemory eviction
Expiration là lifecycle do ứng dụng gắn vào key. Khi deadline qua, key được xem là hết hạn; Redis kết hợp lazy expiration khi truy cập và active expiration sampling. Vì vậy không nên dùng keyspace event như một scheduler chính xác tuyệt đối.

Eviction xảy ra khi memory vượt `maxmemory` và policy cho phép loại key. `allkeys-*` xét mọi key; `volatile-*` chỉ xét key có TTL và có thể hành xử như `noeviction` nếu không có ứng viên. LRU/LFU là approximation, không phải danh sách hoàn hảo toàn cục.

| Câu hỏi | TTL | Eviction |
|---|---|---|
| Ai định nghĩa lifecycle? | application | memory policy |
| Kích hoạt chính | thời gian | memory pressure |
| Có thể xảy ra sớm hơn business TTL? | không do TTL | có |
| Có nên dùng cho source of truth? | chỉ nếu loss được chấp nhận | thường không |

Thêm jitter vào TTL của nhiều key cùng cohort để tránh avalanche. Không đặt TTL ngẫu nhiên nếu business yêu cầu hết hạn chính xác; khi đó cần một durable scheduler/source of truth riêng.

## Memory không bằng tổng payload
Memory còn có key/object overhead, allocator fragmentation, replication/client buffers, copy-on-write khi fork RDB/AOF rewrite và temporary result. Đặt `maxmemory` sát giới hạn container có thể bị OOM trước khi eviction cứu được.

Theo dõi `used_memory`, RSS, fragmentation, evicted/expired keys, command latency, client buffers và hit/miss. Capacity test phải có key/value size distribution thật, không chỉ số key.

## Big key, hot key và unbounded collection
Big key chiếm nhiều memory hoặc chứa quá nhiều element. Hot key nhận phần lớn QPS. Một key có thể đồng thời big và hot, làm CPU/network/replication/failover tệ hơn.

Biện pháp gồm:
- giới hạn list/stream bằng trimming có semantics rõ;
- shard logical collection khi operation cho phép;
- local cache có invalidation/tolerance phù hợp cho read hot;
- tránh trả toàn bộ collection, dùng bounded range/scan;
- delete lớn theo cơ chế non-blocking phù hợp và quan sát memory reclaim;
- thay đổi key distribution, không chỉ thêm node nếu một key vẫn vào một shard.

`KEYS` trên keyspace lớn và command trả collection không giới hạn là operational hazard. Dùng incremental `SCAN` cho tooling, nhưng hiểu rằng scan trong lúc dataset đổi không tạo snapshot transaction.

## Failure scenarios
- Cache key không version khi schema payload đổi, gây deserialize failure hàng loạt.
- `volatile-lru` nhưng nhiều key không TTL làm write mới bị từ chối.
- Stream/list không trim nên memory tăng vô hạn.
- TTL cùng lúc cho hàng triệu key làm source database nhận miss storm.
- Command set intersection trên collection lớn làm event loop bị giữ lâu.
- Cluster scale-out nhưng hash tag dồn workload vào một slot.

:::production Checklist data model
Ghi command chính và complexity; giới hạn kích thước mỗi key/collection; đặt key naming/version/TTL owner; chọn maxmemory policy theo vai trò instance; chừa headroom cho buffers và copy-on-write; load test distribution; alert eviction, OOM, latency, hot/big key; xác định behavior khi Redis chậm hoặc mất.
:::

## Góc phỏng vấn
"TTL và eviction khác gì?" — TTL là deadline lifecycle của key; eviction là phản ứng với memory pressure theo policy và có thể xóa key trước TTL. Câu trả lời production phải nói thêm headroom, allkeys/volatile, stampede và source-of-truth/fallback.

## Key Takeaways
- Model theo operation atomic và bound, không theo object Java/JSON.
- Complexity phải nhân với kích thước collection thực.
- Expiration và eviction giải quyết hai vấn đề khác nhau.
- Memory planning phải gồm overhead, buffers và fork behavior.
- Scale shard không giải quyết một hot key đơn lẻ.
