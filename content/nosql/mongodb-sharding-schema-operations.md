---
id: mongodb-sharding-schema-operations
slug: mongodb-sharding-schema-operations
title: MongoDB Sharding, Schema và Operations
description: Chọn shard key theo cardinality, frequency, monotonicity và query routing; vận hành balancer, zones, hotspots và resharding có evidence.
category: nosql
technology: MongoDB
level: senior
estimatedMinutes: 70
tags: ["mongodb","sharding","shard-key","balancer","resharding"]
prerequisites: ["mongodb-document-model","mongodb-replica-set-consistency-transactions"]
related: ["database-replication-sharding-decisions","cap-replication-sharding","mongodb-indexes-aggregation-performance"]
next: sql-nosql-data-model-decision
learningObjectives: ["Chọn shard key bằng workload và routing evidence","Phân tích hashed, ranged và zone sharding trade-offs","Vận hành migration, balancer và resharding tránh hotspot"]
lastReviewed: 2026-09-02
sources: [{"title":"MongoDB Sharding","url":"https://www.mongodb.com/docs/manual/sharding/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Choose a Shard Key","url":"https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Hashed Sharding","url":"https://www.mongodb.com/docs/manual/core/hashed-sharding/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Zones","url":"https://www.mongodb.com/docs/manual/core/zone-sharding/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Sharded Cluster Balancer","url":"https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: shard key vừa định vị data vừa định hình query

MongoDB sharded cluster chia collection thành key ranges/chunks và phân phối chúng qua shards. Mỗi shard là replica set; mongos route client operations; config server replica set giữ cluster metadata. Sharding thêm write/storage capacity khi workload thực sự được phân phối, nhưng đổi mọi query thành routing decision.

~~~mermaid
flowchart LR
  A[Application] --> M[mongos query router]
  M -->|targeted| S1[Shard A replica set]
  M -->|targeted| S2[Shard B replica set]
  M -->|scatter-gather| S3[Shard C replica set]
  C[Config server replica set] --> M
~~~

Nếu request có shard key hoặc relevant compound prefix, mongos có thể target subset. Thiếu key thường broadcast. Thêm shards không làm scatter-gather scale tuyến tính; nó có thể tăng fan-out và tail latency.

Bài đối chiếu MongoDB 8.3 current docs. Resharding, DDL routing, analyzeShardKey và balancer behavior thay đổi theo release; pin server/driver/managed-service version.

## Bốn câu hỏi cho shard key

MongoDB hướng dẫn đánh giá:

1. **Cardinality:** đủ nhiều distinct values để chia thành nhiều ranges/chunks không?
2. **Frequency:** một số values xuất hiện quá nhiều và trở thành indivisible/hot range không?
3. **Monotonicity:** inserts có dồn vào MaxKey/MinKey edge không?
4. **Query patterns:** common filters có chứa shard key để target không?

High cardinality một mình không đảm bảo cân bằng nếu một tenant chiếm phần lớn events. Key phân phối đều một mình cũng không tốt nếu mọi business query thiếu key. Thu thập query samples, bytes/ops theo candidate range và growth, không chọn qua schema aesthetics.

Từ MongoDB 7.0, analyzeShardKey có thể dùng sampled query metrics để đánh giá characteristics/read-write distribution trong supported setup. Sample window phải đại diện peak, batch, tenant lớn và seasonal traffic; tool output không thay domain knowledge.

## Ranged, hashed và compound

Ranged sharding giữ values gần nhau trong cùng ranges. Nó hỗ trợ targeted range query/locality tốt khi prefix có trong query, nhưng monotonically increasing key có thể dồn inserts vào edge range.

Hashed sharding phân phối hash của field, thường trải monotonic values đều hơn. Đổi lại, range query trên original value khó target một shard và có thể broadcast. Application không tự tính hash; router/index semantics xử lý theo MongoDB.

Compound key cân bằng hai mục tiêu. Ví dụ:

~~~javascript
{ tenantId: 1, orderId: "hashed" }
~~~

Tenant prefix có thể hỗ trợ isolation/query routing, hashed suffix phân phối data của tenant tùy supported compound hashed rules. Nhưng nó cũng có thể trải một tenant qua shards, khiến tenant-wide query fan-out. Ngược lại:

~~~javascript
{ region: 1, tenantId: 1, createdAt: 1 }
~~~

giữ locality/range nhưng large tenant hoặc latest-time edge có thể nóng. Hãy simulate routing và distribution bằng production-like data.

Shard key backing index có requirements. Populated collection cần index bắt đầu bằng shard key theo documentation; collation và unique-index constraints có rules riêng. Đừng tạo index xong mới phát hiện write amplification vượt budget.

## Schema phải mang routing context

Service method nên nhận tenant/aggregate key và đưa vào mọi query/update, không lookup bằng email rồi mới biết tenant. Reference giữa collections nên giữ shard-compatible keys nếu common LOOKUP/transaction cần co-location. Một normalized web liên kết xuyên shards có thể làm mọi request thành distributed join.

Denormalize immutable/temporal snapshots để tránh cross-shard reads khi hợp lý. Dữ liệu frequently mutable bị duplicate cần update/reconciliation plan. Một document vẫn có size/growth limits; đừng embed unbounded history chỉ để “cùng shard”.

Shard key không thay authorization. TenantId trong filter giúp route nhưng server vẫn phải xác minh caller được truy cập tenant. Không tin key do client gửi.

MongoDB tạo unique _id index per collection, nhưng trên sharded collection khi _id không là shard key, application phải đảm bảo uniqueness across shards theo official documentation. Unique index support có shard-key-prefix restrictions; kiểm tra exact version trước thiết kế global business uniqueness.

## Hotspot: data balance khác load balance

Balancer có thể làm data size cân hơn nhưng không chữa một hot key: mọi operations của value đó vẫn route cùng key range. Cluster có storage đều nhưng một shard leader CPU/latency cao.

Dashboard cần per shard/range:

- operations và bytes read/write;
- targeted versus broadcast ratio;
- query latency/keys-docs examined;
- chunk/range distribution và jumbo/indivisible signals;
- migration queue/rate/failures;
- replication lag, disk và cache pressure;
- top shard-key values/tenants đã cardinality-safe.

Cardinality thấp/high frequency có thể tạo range không thể split hữu ích. Thêm shards không chia một identical value. Cần compound/refined key, data-model change hoặc reshard.

## Balancer và range migrations

Balancer chạy background và di chuyển ranges để đạt distribution policy. Migration copy data, đồng bộ changes, cập nhật metadata và sau đó range deletion; nó dùng network, disk, CPU và replication capacity. Trong workload peak, migrations có thể tăng tail/lag.

Không disable balancer vĩnh viễn như performance fix. Nếu maintenance cần pause, ghi owner/deadline và monitor imbalance. Tuning windows/concurrency phụ thuộc version/service. Một shard chỉ tham gia migrations theo product constraints; capacity estimate phải dựa docs hiện hành.

Sau migration, orphan/range cleanup có thể còn work. Read concern available trên sharded collection có thể trả orphaned documents theo documentation; consistency choice phải xét routing/cleanup, không chỉ latency.

## Zones: placement policy, không phải compliance trọn gói

Zones gán shard-key ranges vào shards được tag để kiểm soát locality, tenant tier hoặc hardware class. Zone ranges cần dùng fields/prefix trong shard key và boundaries đúng MinKey/MaxKey semantics.

Zone không tự chứng minh data residency: replicas, backups, logs, analytics export và network path vẫn phải được review. Zone capacity không cân sẽ tạo backlog/migration pressure. Trước khi enable, kiểm tra mỗi zone có đủ shards/failure domains và growth headroom.

## Shard key không còn “bất biến tuyệt đối”

MongoDB current docs nói từ 5.0 có reshardCollection để đổi shard key; refineCollectionShardKey thêm suffix; shard key value có thể update trừ immutable _id với conditions. Những capability này không làm key choice rẻ.

- **Refine** thêm suffix, hữu ích tăng cardinality/routing granularity nhưng không tương đương chọn arbitrary key mới.
- **Reshard** tạo redistribution lớn, cần temporary storage, oplog/change capture, network và cutover plan.
- **Update key value** có thể di chuyển document giữa shards và tốn resource nếu thường xuyên.

## Rollout và reshard runbook

1. Chứng minh bottleneck single-node và loại trừ query/index/schema issue.
2. Inventory operations; tính targeted/broadcast cho candidates.
3. Đo cardinality, frequency, monotonicity, zone needs và tenant skew.
4. Tạo backing indexes, đo build/write cost.
5. Capacity config servers, mongos, shard replicas, migration headroom.
6. Canary workload và fault test mất mongos/shard member.
7. Shard/reshard trong controlled window theo official procedure.
8. Theo dõi migrations, range cleanup, lag, disk và p99.
9. Reconcile counts/business invariants và cập nhật query contracts.

Clients phải kết nối qua mongos, không trực tiếp shard cho application operations. Direct-shard/DDL behavior là version-dependent.

## Troubleshooting

Nếu latency chỉ tăng ở một tenant, kiểm tra high-frequency key/hot range trước cluster average. Nếu tất cả queries fan-out, xem filters có đầy đủ key prefix và datatype/collation khớp. Nếu balancer không progress, kiểm tra zone constraints, shard capacity, range/chunk state, active migrations và replica health.

Nếu resharding chậm, không cancel/restart mù; snapshot phase/progress, oplog window, recipient/donor disk/network và blocking operation theo version docs/support.

## Failure scenarios

- Shard theo continent/status có cardinality thấp.
- Shard theo timestamp tăng dần và tạo edge hotspot.
- Hashed key cân write nhưng range reports broadcast mọi shard.
- Chọn tenantId khi một tenant chiếm phần lớn load.
- Dùng tenantId cho routing nhưng bỏ authorization.
- Disable balancer không owner, imbalance tích lũy.
- Zones được coi là đủ compliance dù backups ở region khác.
- Reshard không có temporary disk/recovery headroom.
- Application kết nối trực tiếp một shard.

:::production Checklist
Pin version; sample queries; đánh giá cardinality/frequency/monotonicity/routing; measure targeted ratio và per-key skew; kiểm tra backing/unique indexes; model migration headroom; thiết kế zones cùng compliance toàn vòng đời; monitor balancer/range cleanup/replica health; fault-test mongos và shard; rehearsal reshard; giữ reconciliation và rollback/escalation plan.
:::

## Góc phỏng vấn

“Shard key tốt là gì?” — Không chỉ high cardinality. Nó phải có frequency đều, tránh monotonic hotspot, xuất hiện trong common queries và hỗ trợ locality/invariants. Senior cần nói ranged-versus-hashed, compound trade-off, scatter-gather, hot key không được balancer chữa, reshard/refine version-aware và migration cost.

## Key Takeaways

- Shard key là routing/data-placement contract lâu dài.
- Data distribution đều không bảo đảm load distribution đều.
- Hashed cải thiện spread nhưng có thể làm range query fan-out.
- Balancer tiêu resource và không split một hot key giống nhau.
- Resharding tồn tại nhưng cần capacity, version checks và reconciliation.
