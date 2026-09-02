---
id: database-replication-sharding-decisions
slug: database-replication-sharding-decisions
title: Quyết định Replication hay Sharding cho Database
description: Phân biệt replication và sharding theo availability, read/write scale, RPO/RTO, consistency, routing và operational cost trước khi phân tán dữ liệu.
category: database
technology: Distributed Databases
level: senior
estimatedMinutes: 69
tags: ["database","replication","sharding","high-availability","scalability"]
prerequisites: ["database-engine-tradeoffs","transactions-mvcc-deadlocks"]
related: ["cap-replication-sharding","mysql-innodb-locks-replication","postgresql-partitioning-operations"]
next: redis-streams-pubsub
learningObjectives: ["Chọn replication hoặc sharding theo bottleneck thật","Thiết kế consistency, failover và shard-key invariants","Lập migration và operations plan có rollback/reconciliation"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Log-Shipping Standby Servers","url":"https://www.postgresql.org/docs/current/warm-standby.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Replication Implementation","url":"https://dev.mysql.com/doc/refman/8.4/en/replication-implementation.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Replication","url":"https://www.mongodb.com/docs/manual/replication/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Sharding","url":"https://www.mongodb.com/docs/manual/sharding/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Replication tạo bản sao; sharding chia ownership

Replication giữ nhiều copies của cùng logical data để tăng availability, disaster recovery và đôi khi read capacity. Sharding phân chia dataset thành subsets, mỗi shard sở hữu một phần, nhằm vượt giới hạn write/storage/compute của một node hoặc đặt dữ liệu gần region. Hai kỹ thuật giải hai vấn đề khác nhau và thường được kết hợp: mỗi shard lại có replicas.

~~~mermaid
flowchart TB
  W[Write workload] --> P[Primary toàn bộ dữ liệu]
  P --> R1[Replica copy]
  P --> R2[Replica copy]
  K[Shard router theo key] --> S1[Shard A và replicas]
  K --> S2[Shard B và replicas]
  K --> S3[Shard C và replicas]
~~~

Replication không tự tăng single-primary write capacity. Sharding không tự tạo high availability nếu mỗi shard chỉ có một node. Đặt tên đúng giúp tránh thiết kế sai.

## Bắt đầu từ bottleneck và SLO

Trước khi phân tán, trả lời:

- giới hạn là read, write, storage, connection, lock hay một query xấu;
- RPO chấp nhận mất bao nhiêu dữ liệu và RTO phục hồi bao lâu;
- cần read-your-writes, monotonic reads hay eventual consistency;
- query chủ yếu theo tenant/key hay cross-tenant aggregation;
- tăng trưởng, peak, skew và data lifecycle thực tế;
- đội ngũ có trực 24/7, automation và rehearsal failover không.

Index/query fix, archival, compression, vertical scale, caching hoặc native table partitioning thường rẻ hơn application-level sharding. Partitioning trong một database giúp pruning/maintenance nhưng không mặc nhiên phân phối compute sang nhiều independent nodes.

## Replication: write log và consistency window

PostgreSQL physical streaming/log shipping truyền WAL; MySQL replication đọc thay đổi từ binary log theo implementation/config; MongoDB replica set giữ oplog. Chi tiết acknowledgement, failover và read concern khác theo engine/version, vì vậy không gọi chung mọi hệ thống là “đồng bộ”.

Với asynchronous replication, primary có thể acknowledge trước khi replica durable; failover đột ngột có RPO lớn hơn zero. Synchronous acknowledgement giảm cửa sổ mất dữ liệu nhưng latency và availability phụ thuộc số replica/region phải xác nhận. “Sync” cũng cần đọc đúng semantics: nhận, ghi OS cache, flush disk hay commit quorum là các mốc khác nhau theo sản phẩm.

Read replica scale tốt cho truy vấn cho phép stale data. Routing phải định nghĩa:

- sau write, request tiếp theo đọc primary hay giữ session token;
- lag quá ngưỡng thì fail, fallback primary hay trả stale;
- transaction nhiều reads có được cùng snapshot/source không;
- replica dành cho analytics có cạnh tranh recovery/WAL apply không.

Replica lag đo bằng time và log position, nhưng clock hoặc write rate làm diễn giải khác. User-facing freshness metric nên gắn với event/business timestamp.

## Failover là protocol, không chỉ đổi DNS

Promotion cần xác định candidate đủ mới, đạt quorum/fencing và ngăn primary cũ nhận write. Nếu old primary quay lại mà không rejoin đúng quy trình, split brain có thể tạo hai histories. DNS TTL, connection pool, service discovery và client retries quyết định RTO thực tế.

Runbook gồm detection, decision authority, promotion, traffic switch, old-primary fencing, application validation, replica rebuild và reconciliation. Planned switchover không chứng minh unplanned failover an toàn. Rehearse khi có network partition, disk full và client reconnect storm.

Backup vẫn cần thiết: replication sao chép cả DELETE sai, corruption logic và ransomware. Point-in-time recovery, immutable/offsite copy và restore test giải failure class khác.

## Khi sharding trở thành hợp lý

Sharding hợp lý khi đã có evidence một database/node không đáp ứng sustainable write, storage/maintenance window, tenant isolation hoặc data locality, và access pattern có shard key tốt. Shard key phải:

- xuất hiện trong phần lớn query/write routes;
- có cardinality và phân phối đủ đều;
- tránh monotonically hot range nếu routing gây hotspot;
- ổn định, ít cần đổi ownership;
- giữ các dữ liệu cần transaction/join cùng shard;
- không làm một tenant lớn chiếm cả shard nếu tenant size skew.

Hash key phân phối đều nhưng range query/fan-out khó hơn. Range key hỗ trợ locality/range nhưng dễ hotspot. Directory/lookup routing linh hoạt, đổi lại thêm metadata availability và cache invalidation. MongoDB balancing/chunk/routing behavior là product-specific và phụ thuộc phiên bản; đừng áp thuật ngữ đó nguyên xi cho custom sharding.

## Tax của query cross-shard

Query thiếu shard key trở thành scatter-gather: gửi tới nhiều shards, merge results, xử lý partial failure và tail latency của shard chậm nhất. ORDER BY/LIMIT toàn cục cần merge sorted streams; exact COUNT/aggregate có thể đắt. Foreign key, unique constraint và transaction cross-shard không còn đơn giản như local database.

Global uniqueness có thể dùng ID service, namespaced key hoặc reservation workflow. Money/inventory workflow cross-shard cần saga/compensation hoặc database distributed transaction nếu product thật sự hỗ trợ và cost chấp nhận. Không tuyên bố eventual consistency là “được” nếu invariant nghiệp vụ yêu cầu atomic.

Một shard hot không được chữa bằng thêm shards nếu key không thể split. Theo dõi load per shard, top keys/tenants, data size, connection count và p99, không chỉ cluster average.

## Resharding và migration

Shard count không nên bị hard-code vào hash đơn giản ở mọi client. Dùng routing layer/consistent strategy phù hợp để có thể di chuyển ownership. Resharding tiêu tốn network, disk và log replication, có thể cạnh tranh foreground workload.

Migration an toàn thường có các phase:

1. inventory query và chọn invariant/shard key;
2. tạo target, backfill có checkpoint và checksum;
3. capture changes bằng log/CDC hoặc controlled dual path;
4. shadow read/compare;
5. cutover từng cohort có feature flag;
6. giữ rollback window;
7. reconcile counts, balances và missing/duplicate;
8. ngừng old path sau khi evidence đủ.

Naive dual write từ application không atomic: một bên thành công, bên kia thất bại. Outbox/CDC cũng không xóa duplicate; consumer phải idempotent. Backfill và live stream cần high-water mark/order rõ.

## Decision guide

| Nhu cầu chính | Hướng ưu tiên | Rủi ro phải sở hữu |
|---|---|---|
| HA/DR | Replication + backup | failover, RPO/RTO, fencing |
| Read-heavy, stale được | Read replicas/cache | lag, routing, read-your-writes |
| Một node hết write/storage bền vững | Sharding | key, cross-shard, resharding |
| Maintenance table lớn | Native partitioning trước | pruning, lifecycle, không tăng node |
| Tenant isolation/regional locality | Shard theo boundary phù hợp | skew, compliance, routing |

## Failure scenarios

- Thêm replica để chữa primary write CPU.
- Đọc replica ngay sau write rồi báo “mất dữ liệu”.
- Failover không fence primary cũ, tạo split brain.
- Coi replica là backup và phát hiện DELETE đã replicate.
- Shard theo tenant nhưng một tenant chiếm phần lớn tải.
- Query không mang shard key, mọi request fan-out.
- Dual write không reconciliation, hai stores lệch âm thầm.
- Chọn shard count cố định trong client, không có đường reshard.

:::production Checklist
Chốt bottleneck và SLO; đo capacity trend; ghi consistency contract; lập RPO/RTO và failover fencing; giữ backup/restore test; chỉ shard với access-pattern evidence; kiểm tra skew/cross-shard invariants; thiết kế routing metadata; capacity cho backfill; canary cutover và rollback; dashboard per replica/shard; diễn tập mất node, network partition và reconnect storm.
:::

## Góc phỏng vấn

“Khi nào dùng replication, khi nào sharding?” — Replication phục vụ copies/HA/read scaling; sharding chia ownership để scale write/storage/locality. Câu trả lời senior bắt đầu từ bottleneck và SLO, nói replica lag/read consistency, failover fencing, shard-key skew, cross-shard tax và migration. Hai kỹ thuật bổ sung chứ không loại trừ nhau.

## Key Takeaways

- Replication và sharding giải các trục khác nhau.
- Read replicas đưa consistency/routing decision vào application.
- Failover cần quorum, fencing, reconnect và reconciliation.
- Shard key quyết định hotspot lẫn khả năng query/transaction.
- Operational tax và migration path phải được tính trước cutover.
