---
id: postgresql-index-types-jsonb
slug: postgresql-index-types-jsonb
title: PostgreSQL Index Types và JSONB Access Paths
description: Chọn B-tree, Hash, GIN, GiST, SP-GiST hay BRIN theo operator class, data distribution và write cost; thiết kế JSONB không biến database thành schema-less dumping ground.
category: database
technology: PostgreSQL
level: advanced
estimatedMinutes: 63
tags: ["postgresql","btree","gin","gist","brin","jsonb"]
prerequisites: ["composite-covering-index-explain"]
related: ["postgresql-planner-statistics","postgresql-partitioning-operations"]
next: postgresql-partitioning-operations
learningObjectives: ["Ánh xạ operator/query sang index access method","Chọn jsonb_ops, jsonb_path_ops hoặc expression index","Đánh giá index size, pending list, lossy recheck và write amplification"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Index Types","url":"https://www.postgresql.org/docs/current/indexes-types.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL JSON Types and Indexing","url":"https://www.postgresql.org/docs/current/datatype-json.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL GIN Indexes","url":"https://www.postgresql.org/docs/current/gin.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL BRIN Indexes","url":"https://www.postgresql.org/docs/current/brin.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Index type là contract giữa operator và access method
PostgreSQL không dùng index chỉ vì cột xuất hiện trong `WHERE`. Access method, operator class và operator/query shape phải tương thích. B-tree là mặc định tốt cho equality/range/order; GIN là inverted index cho multi-valued content; GiST/SP-GiST là frameworks cho nhiều data structures; BRIN tóm tắt block ranges; Hash phục vụ equality với behavior riêng.

Mỗi index thêm write, WAL, vacuum và cache cost. "GIN nhanh cho JSON" thiếu phần quan trọng: nhanh cho operator nào, document distribution nào, index lớn bao nhiêu và update rate ra sao?

## B-tree: baseline cho ordered scalar
B-tree hỗ trợ equality, range, ordered scan, prefix phù hợp trong multicolumn index và nhiều operator classes. Nó thường dùng cho ID, timestamp, numeric/string order. `NULLS FIRST/LAST`, collation, expression và sort direction ảnh hưởng khả năng phục vụ order.

Composite B-tree có left-prefix/range logic, nhưng PostgreSQL còn bitmap combination và skip-scan behavior tùy version/data. Dù vậy index `(tenant_id, created_at)` khác `(created_at, tenant_id)` về locality và reusable access patterns.

## Hash, GiST và SP-GiST
Hash index chủ yếu equality; B-tree cũng xử lý equality và linh hoạt hơn, nên Hash chỉ đáng cân nhắc sau đo workload cụ thể. GiST cân bằng tree framework cho ranges, geometric/search domains và extension-provided types; kết quả có thể cần recheck vì representation lossy. SP-GiST phù hợp partitioned search structures như trie/k-d/quadtree tùy operator class.

Không chọn theo tên viết tắt. Mở documentation của data type/operator class, chạy plan và đo index build/update/query trên data thật.

## GIN: inverted index cho nhiều keys/elements
GIN lưu mapping từ key/element sang rows chứa nó, hữu ích cho array, full-text và JSONB. Một row/document tạo nhiều index entries, vì vậy write và index size có thể lớn. Fast update/pending list giảm immediate write cost nhưng pending cleanup/merge có thể tạo latency và maintenance pressure.

GIN plan thường có bitmap index/heap scan và recheck. Nhiều match hoặc lossy bitmap làm heap work lớn dù "index được dùng". Quan sát `Rows Removed by Index Recheck`, buffers và actual row count.

## BRIN: rất nhỏ khi physical correlation tốt
BRIN tóm tắt value range theo nhóm heap pages. Nó không trỏ chính xác từng row như B-tree; query lấy candidate page ranges rồi recheck row. Trên append-only time-series lớn, `created_at` tương quan physical order cao, BRIN rất nhỏ và có thể loại phần lớn pages. Trên column random phân bố khắp table, BRIN gần như không lọc được.

`pages_per_range` đổi granularity, index size và false positives. Data out-of-order, updates và summarization state cần được quan sát. BRIN không thay B-tree cho point lookup latency thấp.

## JSON so với JSONB
`json` giữ input text representation; `jsonb` lưu binary decomposed form, xử lý/index thuận lợi hơn nhưng parse/write có cost và không giữ mọi whitespace/key order/duplicate-key behavior như raw text. Chọn theo semantics; phần lớn queryable document dùng JSONB, nhưng không mặc định mọi payload đều phải JSONB.

Các field làm identity, join, constraint, sort/range thường nên là typed columns. JSONB phù hợp sparse/extension attributes, vendor payload hoặc cấu trúc biến đổi có contract. Vẫn cần schema validation ở application/database phù hợp, versioning và privacy lifecycle.

## `jsonb_ops` và `jsonb_path_ops`
Default GIN `jsonb_ops` hỗ trợ nhiều operators như key-exists, containment và jsonpath. `jsonb_path_ops` hỗ trợ tập operator hẹp hơn nhưng thường index nhỏ/cụ thể hơn cho containment/jsonpath phù hợp. Đây là trade-off query coverage với size/specificity.

```sql title="Hai chiến lược JSONB index"
CREATE INDEX idx_events_payload_ops
ON events USING GIN (payload);

CREATE INDEX idx_events_payload_path
ON events USING GIN (payload jsonb_path_ops);
```

Không tạo cả hai nếu chưa có workload chứng minh. Index toàn document hỗ trợ query linh hoạt nhưng lớn; expression index tập trung hot path:

```sql title="Expression index cho key ổn định"
CREATE INDEX idx_orders_external_customer
ON orders ((metadata ->> 'externalCustomerId'));

SELECT * FROM orders
WHERE metadata ->> 'externalCustomerId' = :id;
```

Expression text so sánh/sort như text; nếu field thực sự numeric/time, cast và invalid-value handling phải explicit. Generated typed column có thể giúp validation/stats/index nhưng tạo duplicate representation cần ownership.

## Partial và covering kết hợp có mục tiêu
Partial index hữu ích khi chỉ subset nhỏ active/open được query nóng. `INCLUDE` có thể cover projection trên B-tree/GiST/SP-GiST theo khả năng access method/version, nhưng included columns vẫn làm index lớn. Unique partial index có thể enforce conditional invariant.

```sql title="Conditional uniqueness"
CREATE UNIQUE INDEX uq_active_username
ON accounts (tenant_id, username)
WHERE deleted_at IS NULL;
```

Query predicate phải đủ để planner chứng minh implication. Parameterized predicate phức tạp có thể không match như kỳ vọng.

## Failure scenarios
- GIN toàn JSONB cho mọi table làm write latency/WAL và storage tăng mạnh.
- Query dùng operator không thuộc operator class đã chọn nên index không dùng.
- JSON number lưu lẫn string làm cast lỗi và statistics kém.
- BRIN đặt trên UUID random, mọi range match gần như toàn table.
- B-tree/GIN được dùng nhưng trả quá nhiều rows, heap recheck chiếm phần lớn time.
- GIN pending cleanup tạo spike nhưng dashboard chỉ theo average latency.
- JSONB chứa PII động không được data catalog/deletion job nhận diện.

:::production Decision checklist
Liệt kê query operators và selectivity; kiểm tra operator class; đo index build/size/write/WAL; chạy EXPLAIN ANALYZE BUFFERS; test data skew; theo dõi index usage/pending/maintenance; đặt typed columns cho invariant; version JSON contract; rollout index concurrently khi phù hợp và có disk/WAL/replica headroom.
:::

## Góc phỏng vấn
"Khi nào BRIN tốt hơn B-tree?" — Table rất lớn có column tương quan với physical page order, query range loại được nhiều block và chấp nhận recheck; BRIN cực nhỏ/write nhẹ hơn. Point lookup hoặc dữ liệu random thường cần B-tree. Phải nói `pages_per_range`, correlation và actual plan.

## Key Takeaways
- Operator class quyết định operator nào dùng được index.
- GIN là inverted index mạnh nhưng write/size/maintenance không rẻ.
- BRIN thắng nhờ physical correlation, không nhờ selectivity đơn thuần.
- JSONB không loại bỏ schema; invariant nên dùng typed representation.
- Index "được dùng" chưa đủ: phải đo heap/recheck/I/O và write cost.
