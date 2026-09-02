---
id: mongodb-replica-set-consistency-transactions
slug: mongodb-replica-set-consistency-transactions
title: MongoDB Replica Set, Consistency và Transactions
description: Ghép read preference, read concern và write concern với elections, causal sessions và multi-document transactions mà không overclaim consistency.
category: nosql
technology: MongoDB
level: senior
estimatedMinutes: 69
tags: ["mongodb","replica-set","consistency","transactions","read-write-concern"]
prerequisites: ["mongodb-document-model"]
related: ["transactions-mvcc-deadlocks","database-replication-sharding-decisions","mongodb-sharding-schema-operations"]
next: mongodb-sharding-schema-operations
learningObjectives: ["Phân biệt routing, visibility và acknowledgement controls","Thiết kế read-your-writes/causal flow có giới hạn rõ","Xử lý election và transaction retry mà không nhân side effect"]
lastReviewed: 2026-09-02
sources: [{"title":"MongoDB Replication","url":"https://www.mongodb.com/docs/manual/replication/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Read Concern","url":"https://www.mongodb.com/docs/manual/reference/read-concern/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Write Concern","url":"https://www.mongodb.com/docs/manual/reference/write-concern/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Causal Consistency","url":"https://www.mongodb.com/docs/manual/core/causal-consistency-read-write-concerns/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Transactions","url":"https://www.mongodb.com/docs/manual/core/transactions/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Ba controls không thể thay thế nhau

Replica set có một primary nhận writes và secondaries apply oplog asynchronously. Khi primary không còn eligible/reachable, election chọn primary mới. Application consistency được điều khiển qua ba trục:

- **read preference:** đọc từ member nào;
- **read concern:** dữ liệu ở mức visibility/isolation nào;
- **write concern:** write cần acknowledgement/durability tới đâu.

~~~mermaid
flowchart LR
  A[Application] -->|write concern| P[Primary]
  P -->|oplog async| S1[Secondary]
  P -->|oplog async| S2[Secondary]
  A -->|read preference + read concern| P
  A -->|read preference + read concern| S1
~~~

Đọc primary không tự đồng nghĩa write trước đó đã majority durable. Đọc majority không tự đồng nghĩa latest value của toàn hệ thống, nhất là từ secondary đang lag. Chọn ba controls theo invariant/SLO cụ thể.

Bài đối chiếu MongoDB 8.3 current docs. Defaults, driver retry behavior và restrictions thay đổi theo server/driver/deployment; kiểm tra effective settings.

## Replication, oplog và majority commit

Primary ghi operations vào oplog; secondaries fetch/apply. Replication asynchronous nên replication lag là expected nhưng phải bounded theo freshness/oplog window. Nếu secondary chậm quá lâu và oplog history bị ghi đè trước khi catch up, nó có thể cần resync thay vì incremental recovery.

Majority commit point biểu diễn phần history replicated theo majority semantics. Flow control có thể hạn chế primary writes để giữ majority committed lag theo target, đổi throughput/latency lấy replica health. Do đó write latency tăng có thể là replication pressure, không chỉ application query.

Arbiter bỏ phiếu nhưng không giữ data, nên không tăng data redundancy. “Ba process” trên cùng host không chịu được host failure.

## Write concern: acknowledgement không phải business completion

Write concern gồm số/mode acknowledgements, journaling option và timeout theo server semantics. w:1 thường acknowledge từ primary; w:majority đợi majority acknowledgement theo cấu hình. Journaling/durability của majority còn liên quan writeConcernMajorityJournalDefault và storage configuration.

Write concern timeout nghĩa client không nhận đủ acknowledgement trong deadline; nó không tự động rollback write đã được primary áp dụng. Outcome có thể cần read/reconciliation. Vì vậy:

- gắn idempotency key hoặc unique business key;
- không retry blind một non-idempotent command;
- log operation ID và error labels;
- xác minh state từ source of truth khi outcome unknown.

Write majority giảm rollback risk so với weak acknowledgement trong election scenarios, nhưng không atomically bao phủ email/payment/file bên ngoài MongoDB.

## Read preference là routing, không là consistency level

Primary preference/read routing quyết định node. Secondary reads có thể scale hoặc locality tốt hơn nhưng nhìn state cũ do asynchronous apply. nearest chọn theo topology/latency criteria chứ không chứng minh freshest.

Read-your-writes có thể đạt bằng đọc primary trong flow, causal session phù hợp hoặc explicit operation contract. Không route tất cả reads sang secondary rồi kỳ vọng user thấy write ngay. Với analytics/reporting, stale window có thể chấp nhận nếu dashboard hiển thị freshness.

Trong transaction có reads, documentation yêu cầu primary read preference và operations trong transaction route cùng member. Driver thường enforce; đừng override topology theo custom client hack.

## Read concern: local, majority, snapshot, linearizable

Các levels có semantics/restrictions riêng:

- local có thể thấy data chưa majority committed và có thể rollback khi failover;
- majority đọc từ in-memory view ở majority-commit point theo documented guarantee, nhưng không hứa dữ liệu mới nhất trên member;
- snapshot đọc một point-in-time majority-committed view trong supported contexts khi phối hợp commit concern đúng;
- linearizable chỉ áp dụng cho supported primary single-document reads với restrictions; cần maxTimeMS để tránh chờ vô hạn khi majority unavailable.

Không gọi majority là linearizable. Không gọi snapshot là serializable. Transaction isolation còn có write conflict, concurrent update và application invariant cần kiểm tra.

Read concern guarantees trong transaction phụ thuộc commit concern; majority/snapshot cần transaction commit với majority theo documentation.

## Causal consistency

Causal session giúp bảo toàn relationships như read-your-writes và monotonic ordering cho operations có causal relation khi dùng supported read/write concerns và session sequencing. MongoDB documentation chỉ ra combination majority read concern + majority write concern cung cấp đầy đủ causal consistency guarantees.

Điều này không tạo global total order cho mọi clients. Hai sessions độc lập không tự biết causality của nhau nếu không truyền cluster/operation time theo supported API. Session thường không nên dùng concurrent operations tùy driver contract. Load balancer/service boundary phải giữ logical session information nếu requirement cần.

Một cách thiết kế API:

1. command dùng majority write concern và idempotency key;
2. response trả resource/version token;
3. subsequent read dùng cùng causally consistent session hoặc đọc source phù hợp;
4. nếu không thể giữ session xuyên request, dùng version polling/primary routing và nói rõ contract.

Không giữ database session/transaction nhiều phút chỉ để user bấm UI.

## Elections, rollback và retries

Trong election, một khoảng không có primary writes. Driver topology discovery có thể retry certain writes/reads khi enabled và operation eligible. Retryable write không có nghĩa mọi multi-step business operation được retry an toàn.

Write yếu chưa majority committed có thể rollback khi old history không thắng election. Theo dõi rollback directory/events và reconcile business IDs. Client kết nối nhầm former primary trong network partition có thể thấy stale data; majority writes chỉ được hoàn tất bởi primary có majority support.

Application cần finite deadlines, retry backoff có jitter, idempotent operation IDs và xử lý topology/transient/unknown-commit errors theo driver guide.

## Multi-document transactions

Single-document write đã atomic cho fields/subdocuments trong document. Multi-document transaction dùng khi invariant thật sự trải nhiều documents/collections; nó không phải lý do bỏ data modeling.

Transaction boundary nên nhỏ, bounded và không chờ người dùng/remote API. Nó giữ snapshot/resources, có thể gặp write conflict, timeout hoặc abort. Trên sharded cluster có coordination thêm. Limits/lifetime/oplog behavior là version-dependent.

Pseudocode:

~~~javascript
session.withTransaction(() => {
  accounts.updateOne(
    { _id: from, balance: { $gte: amount }, version: expected },
    { $inc: { balance: -amount, version: 1 } },
    { session }
  )
  accounts.updateOne(
    { _id: to },
    { $inc: { balance: amount, version: 1 } },
    { session }
  )
  transfers.insertOne({ transferId, from, to, amount }, { session })
}, {
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
  readPreference: "primary"
})
~~~

Driver transaction callback có thể retry toàn body cho transient errors và retry commit for unknown result according to driver/version. Callback phải không gửi email/charge payment trực tiếp, vì retry nhân external side effect. Ghi outbox/document state trong transaction, publish sau với idempotency.

Unique constraints và conditional updates vẫn cần để bảo vệ invariant. “Đã bọc transaction” không chữa lost update nếu logic read-modify-write không có predicate/version phù hợp.

## Cross-shard visibility nuance

MongoDB transactions hỗ trợ sharded clusters, nhưng outside reads với weak concern có thể thấy một shard’s transaction result trước shard khác sau commit propagation, như documentation cảnh báo. Nếu global observation cần snapshot/majority semantics, cấu hình reader đúng; không overclaim rằng mọi local read ngoài transaction thấy atomic cross-shard cut.

Distributed transaction có latency/availability cost và shard routing. Model để common transaction nằm trong một document hoặc shard khi hợp lý, nhưng correctness đứng trước micro-optimization.

## Production observability

Theo dõi member state/elections, replication lag per secondary, majority commit lag, oplog window/headroom, flow-control impact, rollback, write concern errors/timeouts, transaction abort/retry/commit latency và connection topology changes. Ghép với user freshness và operation IDs.

Backup không được thay bởi replica. Logical deletion/corruption replicate; cần point-in-time/restore drills.

## Failure scenarios

- Đọc secondary ngay sau write rồi gọi đó là data loss.
- Dùng read concern majority và tuyên bố luôn latest/linearizable.
- Timeout write concern rồi retry charge không idempotency.
- Đặt arbiter và hai data nodes cùng failure domain nhưng gọi là HA.
- Transaction gọi payment API bên trong callback tự retry.
- Transaction dài giữ resource và tăng conflicts.
- Weak local reader quan sát cross-shard commit không đồng thời.
- Coi replica là backup.

:::production Checklist
Pin server/driver versions; ghi read preference/concern/write concern per use case; majority cho invariant cần durability; idempotency cho unknown outcome; causal/session plan cho read-your-writes; transaction nhỏ và callback side-effect-free; monitor lag/oplog/flow control/elections/rollback; test primary stepdown và network partition; verify backup restore; document stale/freshness SLO.
:::

## Góc phỏng vấn

“MongoDB replica set có strong consistency không?” — Không trả lời yes/no. Phải nêu primary/secondary replication async, rồi chọn read preference, read concern và write concern. Majority không luôn latest; causal sessions cần đúng concerns; linearizable bị giới hạn. Transactions atomic trong boundary hỗ trợ nhưng không bao phủ external side effects và không mặc nhiên serializable.

## Key Takeaways

- Routing, read visibility và write acknowledgement là ba trục riêng.
- Majority giảm rollback risk nhưng không có nghĩa mọi read là latest.
- Causal consistency có session/concern requirements, không global total order.
- Transaction retries đòi body không có non-idempotent external effects.
- Election safety phải được chứng minh bằng failure test và reconciliation.
