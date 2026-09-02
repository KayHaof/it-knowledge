---
id: sql-nosql-data-model-decision
slug: sql-nosql-data-model-decision
title: SQL hay NoSQL — Quyết định từ Data Model
description: Chọn relational hay document model theo invariant, relationship, access pattern, evolution và operational ownership thay vì khẩu hiệu schema hoặc scale.
category: architecture
technology: SQL and Document Databases
level: senior
estimatedMinutes: 68
tags: ["architecture","sql","nosql","data-modeling","decision-guide"]
prerequisites: ["normalization-denormalization","mongodb-document-model"]
related: ["database-engine-tradeoffs","technology-decision-evidence","microservices-boundaries"]
next: technology-decision-evidence
learningObjectives: ["Chọn model theo invariant và access pattern","Nhận diện hybrid JSON/document và polyglot trade-offs","Chạy proof-of-model có migration và source-of-truth boundary"]
lastReviewed: 2026-09-02
sources: [{"title":"MongoDB Data Modeling","url":"https://www.mongodb.com/docs/manual/data-modeling/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Data Modeling Best Practices","url":"https://www.mongodb.com/docs/manual/data-modeling/best-practices/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Schema Validation","url":"https://www.mongodb.com/docs/manual/core/schema-validation/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL Constraints","url":"https://www.postgresql.org/docs/current/ddl-constraints.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL JSON Types","url":"https://www.postgresql.org/docs/current/datatype-json.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Đây là quyết định về shape và ownership, không phải JSON versus tables

SQL database có thể chứa JSON; document database có validation, indexes, references và transactions. Nhãn công nghệ không trả lời invariant nằm ở đâu, dữ liệu nào thay đổi cùng nhau và ai sở hữu consistency.

~~~mermaid
flowchart LR
  I[Business invariants] --> M[Model boundary]
  A[Access patterns] --> M
  E[Evolution + lifecycle] --> M
  M --> R[Relational model]
  M --> D[Document model]
  M --> H[Hybrid/projections]
~~~

Bài tập trung vào method quyết định, không so vendor feature checklist.

## Bắt đầu bằng invariant map

Liệt kê rules phải đúng sau mọi write:

- email unique trong tenant;
- order total bằng snapshot line items;
- inventory không âm;
- enrollment tham chiếu student/course tồn tại;
- audit record không bị sửa;
- một payment intent chỉ capture một lần.

Với relational model, primary/foreign key, unique, check/exclusion constraints và transaction có thể đưa nhiều invariant gần data. PostgreSQL documentation nhấn mạnh constraints áp dụng trên rows/table relationships theo supported semantics; complex cross-row rules vẫn cần transaction/design, không viết check giả định query rows khác.

Document model làm single-document update atomic và có thể gom aggregate thay đổi cùng nhau. Nhưng invariant xuyên documents/collections vẫn cần unique index, conditional update hoặc transaction. “MongoDB có transaction” không có nghĩa mọi relational graph nên chuyển nguyên dạng; distributed/multi-document transaction có cost và không thay model tốt.

Chọn boundary sao cho common invariant nằm trong đơn vị atomic tự nhiên nhất.

## Relationship shape và growth

Relational model mạnh khi entities có lifecycle độc lập, many-to-many, referential integrity và nhiều query combinations chưa biết trước. Normalization giữ một source cho mutable fact và tránh update mọi bản sao; joins là cost cần index/cardinality đúng.

Document embedding mạnh khi data được đọc/cập nhật/archived cùng aggregate và child set bounded. MongoDB guidance nói data accessed together nên lưu cùng, nhưng cũng khuyên reference khi child high-cardinality, independent hoặc array tăng không giới hạn.

Hỏi với mỗi relationship:

- child có sống thiếu parent không;
- cardinality tối đa và growth theo năm;
- update cùng hay khác thời điểm;
- cần query child độc lập không;
- duplicate field mutable hay historical snapshot;
- archive/delete có cùng lifecycle không.

Không embed toàn bộ comments/events vào một document vô hạn. Không tách mọi nested object thành collection/table chỉ vì “chuẩn hóa”.

## Ví dụ Order: cả hai model đều hợp lệ

Relational:

~~~sql
orders(id, customer_id, status, total, version)
order_items(order_id, product_id, sku_snapshot, price_snapshot, quantity)
products(id, current_price, ...)
~~~

Order items giữ price/name snapshot lịch sử; product hiện tại là fact riêng. Foreign/unique/check constraints và transaction bảo vệ references/totals tùy design.

Document:

~~~javascript
{
  _id: "order-8742",
  customerId: "c-19",
  status: "PAID",
  version: 4,
  items: [
    { productId: "p-8", sku: "BK-8", price: 120000, quantity: 2 }
  ],
  total: 240000
}
~~~

Items bounded và luôn đọc cùng order nên embedding hợp lý. Product current state vẫn reference. Conditional update theo version bảo vệ transition; schema validation kiểm types/ranges. Nếu order có hàng triệu tracking events, tách event collection/bucket thay vì làm document phình vô hạn.

Quyết định không đến từ việc payload API là JSON; mọi API đều có thể serialize relational result thành JSON.

## Access-pattern inventory

Ghi top reads/writes với frequency, filters, sort, result size, latency và consistency:

| Pattern | Relational signal | Document signal |
|---|---|---|
| Query ad-hoc qua nhiều dimensions | joins/indexes/SQL thuận lợi | cần indexes/pipeline/projection |
| Lấy trọn aggregate theo ID | cần join hoặc denormalized view | embedded document tự nhiên |
| Update một mutable fact dùng nhiều nơi | normalized source thuận lợi | reference hoặc fan-out update |
| High-volume append events | partitioned table có thể phù hợp | collection/bucket có thể phù hợp |
| Many-to-many integrity | constraints/junction table mạnh | references + app/transaction cost |

Đừng quyết định chỉ theo một endpoint. Bao gồm reporting, reconciliation, GDPR deletion, backfill, support query và incident forensics.

## Schema evolution: flexibility không miễn migration

Relational DDL có schema rõ và migration ordering; large table change có operational cost. Document collections cho documents khác fields/types mặc định, nhưng code vẫn phải đọc old/new shapes, indexes phải hiểu paths và analytics phải xử lý inconsistency.

MongoDB schema validation có thể giới hạn types/ranges khi model ổn định. Dùng schemaVersion, tolerant reader, backfill checkpoint và metrics về old-version population. Flexible schema chuyển thời điểm enforcement, không xóa governance.

PostgreSQL JSON/JSONB cho hybrid: giữ core identity/invariants ở typed columns, variant attributes trong JSON. JSONB hỗ trợ processing/indexing nhưng duplicated keys/order/number conversion và index size có semantics cụ thể. Không đẩy mọi column vào một JSONB blob rồi mất constraints/query clarity; cũng không tạo table cho mỗi optional attribute khi variation thực sự là domain requirement.

## Consistency không phải nút SQL/NoSQL

SQL databases có replica lag và isolation choices; NoSQL products có quorum/read-write concern và transactions. Product/topology/config quyết định guarantee. Hỏi:

- acknowledgement nào làm write “thành công”;
- read sau write đi node nào;
- transaction boundary bao nhiêu facts;
- conflict được prevent, detect hay merge;
- timeout outcome unknown xử lý idempotency thế nào;
- backup/restore và failover đã test chưa.

Đừng nói “SQL luôn ACID, NoSQL eventual”. Đó là phân loại không đủ để thiết kế production.

## Scale bắt đầu từ routing

Document model không tự horizontal scale; relational không tự giới hạn một node. Sharding cần key theo access pattern và tạo cross-shard tax ở cả hai thế giới. Read replicas/cache/search projections giải workload khác.

Trước khi shard, tối ưu query/index, data lifecycle, partition/archive và capacity. Nếu tenantId là route tự nhiên, cả relational sharding lẫn MongoDB shard key có thể dùng; large-tenant skew vẫn tồn tại.

Mô hình tốt giúp query mang routing key và giữ transactions local. Model tệ bắt mọi request scatter-gather dù engine nào.

## Polyglot persistence: một fact chỉ có một authority

Có thể dùng relational database cho orders/payments, document/search store cho catalog/read model, Redis cache và Kafka events. Nhưng mỗi mutable fact cần source of truth. Projection được rebuild và có freshness SLO; nó không đồng thời là writable master.

Dual write hai databases từ request tạo partial failure. Transactional outbox/CDC + idempotent consumer giảm inconsistency, nhưng cần lag, replay, schema và reconciliation operations. Polyglot tăng on-call, backup, security, driver và upgrade surface; chỉ thêm store khi measured benefit vượt cost.

## Proof-of-model, không chỉ proof-of-technology

PoC dùng representative cardinality, skew, document/row growth và concurrency:

1. implement 5–10 dominant operations;
2. encode critical invariants và failure tests;
3. tạo indexes realistic;
4. đo latency distribution, writes, storage/working set;
5. thử schema evolution/backfill;
6. failover, backup restore và replay;
7. chạy support/reporting queries;
8. ước lượng people/managed-service cost và exit plan.

Ghi version, topology, dataset, cache state và assumptions.

## Migration và reversibility

Khi đổi model, định nghĩa source authority từng phase. Backfill có high-water mark/checksum; CDC/outbox bắt live changes; shadow reads so kết quả; cutover theo cohort; rollback không ghi ngược hỗn loạn. Reconcile business totals/IDs, không chỉ document count.

API/domain boundary giúp tránh lộ vendor query object khắp code. Tuy vậy, abstraction “repository chung cho mọi database” có thể che capability và tạo lowest-common-denominator; portability là deliberate boundary, không phép màu.

## Failure scenarios

- Chọn MongoDB vì API trả JSON.
- Chọn SQL vì “mọi thứ cần ACID” nhưng không viết invariant.
- Embed unbounded history và array indexes vào một document.
- Normalize document model thành nhiều collections rồi LOOKUP mọi request.
- Dùng JSONB cho toàn row, bỏ typed constraints cần thiết.
- Hai databases cùng nhận writes cho một fact, không authority/reconciliation.
- Flexible schema không validator/version, types trôi âm thầm.
- PoC bỏ qua tenant skew, failover và reporting.

:::production Decision checklist
Map invariants; vẽ aggregate/lifecycle; inventory reads-writes-reporting; estimate cardinality/growth/skew; chọn embed/reference/normalize; xác định constraints/validation/version; test indexes và transaction boundary; ghi consistency/topology; chỉ thêm projections với one authority; PoC failure/migration/restore; ADR nêu rejected options, exit trigger và ngày review.
:::

## Góc phỏng vấn

“Khi nào chọn SQL hay NoSQL?” — Bắt đầu bằng invariant, relationship cardinality/lifecycle và access patterns. SQL relational phù hợp constraints, many-to-many và query linh hoạt; document phù hợp bounded aggregate thường đọc/ghi cùng. Senior phải nói schema evolution vẫn cần governance, transactions không thay model, JSONB là hybrid, sharding cần routing và polyglot cần một source of truth.

## Key Takeaways

- Chọn unit of atomicity và ownership trước chọn engine.
- Embed khi lifecycle/access cùng và growth bounded; normalize/reference khi độc lập.
- Flexible schema vẫn cần validation, versioning và backfill.
- SQL/NoSQL đều có topology-dependent consistency và sharding tax.
- Polyglot chỉ an toàn khi authority, propagation và reconciliation rõ.
