---
id: mongodb-indexes-aggregation-performance
slug: mongodb-indexes-aggregation-performance
title: MongoDB Indexes và Aggregation Performance
description: Thiết kế compound index theo ESR/ERS, đọc explain evidence và kiểm soát cardinality, blocking stage, spill cùng write amplification của aggregation pipeline.
category: nosql
technology: MongoDB
level: advanced
estimatedMinutes: 65
tags: ["mongodb","index","aggregation","explain","performance"]
prerequisites: ["mongodb-document-model"]
related: ["composite-covering-index-explain","database-slow-api-investigation","mongodb-replica-set-consistency-transactions"]
next: mongodb-replica-set-consistency-transactions
learningObjectives: ["Thiết kế compound index theo query shape và ESR/ERS","Đọc explain bằng keys/documents examined và stage cardinality","Chẩn đoán aggregation spill, lookup fan-out và index write cost"]
lastReviewed: 2026-09-02
sources: [{"title":"MongoDB Indexes","url":"https://www.mongodb.com/docs/manual/indexes/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB ESR Guideline","url":"https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Explain Results","url":"https://www.mongodb.com/docs/manual/reference/explain-results/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Aggregation Pipeline Optimization","url":"https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MongoDB Aggregation Pipeline Limits","url":"https://www.mongodb.com/docs/manual/core/aggregation-pipeline-limits/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: giảm work, không săn tên stage đẹp

MongoDB index là ordered structure giúp thu hẹp keys/documents phải xét và đôi khi cung cấp sort/projection. Aggregation pipeline biến một stream documents qua nhiều stages; cost phụ thuộc số phần tử đi vào từng stage, bytes materialize, blocking work và remote/shard fan-out. Một plan có IXSCAN vẫn có thể chậm nếu đọc hàng triệu keys để trả vài rows.

~~~mermaid
flowchart LR
  Q[Filter + sort + projection] --> I[Index bounds]
  I --> K[Keys examined]
  K --> F[Documents fetched]
  F --> P[Pipeline stages]
  P --> R[nReturned]
~~~

Điều tra bằng tỷ lệ keysExamined/nReturned, docsExamined/nReturned, execution time, sort/spill và stage cardinality. Stage names và explain shape khác giữa classic engine, slot-based execution và MongoDB versions; đọc semantics của đúng release thay vì viết alert phụ thuộc cứng vào một cây JSON.

## Compound index và ESR/ERS

Với query:

~~~javascript
db.orders.find(
  {
    tenantId: "t-17",
    status: "PAID",
    createdAt: { $gte: ISODate("2026-08-01") }
  },
  { orderNo: 1, createdAt: 1, total: 1, _id: 0 }
).sort({ createdAt: -1 }).limit(50)
~~~

Một candidate:

~~~javascript
db.orders.createIndex({
  tenantId: 1,
  status: 1,
  createdAt: -1
})
~~~

ESR là guideline: equality fields trước để tạo bounds hẹp; sort fields tiếp để index trả đúng order; range fields sau. Nếu range cực selective và chấp nhận in-memory sort, ERS có thể ít scan hơn. Vì vậy không biến ESR thành luật cú pháp tuyệt đối. Đo cả candidate plans với cardinality/skew đại diện.

Nhiều equality fields có thể đổi thứ tự với nhau về logical matching, nhưng prefix reuse cho query khác và distribution vẫn ảnh hưởng index portfolio. Sort theo subset chỉ được hỗ trợ khi các prefix keys trước sort được ràng buộc equality phù hợp. Direction của compound sort cũng phải khớp hoặc có thể được đáp ứng bằng reverse scan theo rules cụ thể.

Các operator như inequality, regex và một số cách dùng in-list được xem như range theo optimizer behavior. Ngưỡng/optimization chi tiết của in-list được MongoDB ghi rõ là có thể đổi giữa versions; đừng hard-code một con số vào design rule.

## Prefix, selectivity và coverage

Index {tenantId, status, createdAt} có thể hỗ trợ prefix tenantId, nhưng query chỉ theo status không tự nhiên seek prefix bị thiếu. Một index khổng lồ “dùng cho mọi query” thường vừa không tối ưu bounds vừa tăng storage.

Covered query trả kết quả chỉ từ index khi mọi predicate và projected field cần thiết đều có trong index, với restrictions của index type/multikey/version. Coverage giảm document fetch nhưng thêm output fields làm index rộng, tốn RAM/disk và write amplification. Đừng cover payload lớn hoặc hiếm dùng chỉ để bỏ một FETCH.

## Arrays và multikey amplification

Index trên array trở thành multikey: một document có thể tạo nhiều index entries. Array lớn làm keys examined, index size và write cost tăng. Compound multikey có restrictions khi nhiều indexed paths là arrays; behavior coverage/sort cũng có điều kiện.

Schema embedding một mảng unbounded rồi index phần tử vừa tạo document growth vừa index fan-out. Giới hạn array, bucket/archive hoặc reference collection theo lifecycle. Đo number of entries/index bytes per document, không chỉ document count.

## Index đặc biệt không phải thuốc tổng quát

Partial index giảm entries bằng filter nhưng query phải đủ điều kiện để optimizer dùng an toàn. Sparse, TTL, wildcard, text/geospatial và hashed indexes có semantics riêng. TTL cleanup không phải exact scheduler; wildcard tiện schema biến đổi nhưng không thay query-driven design. Chỉ thêm index khi có query owner, expected benefit và lifecycle.

Mỗi insert/update/delete phải duy trì relevant indexes. Update array/indexed fields có thể chạm nhiều entries. Index working set tranh RAM với documents. Audit index usage cần cửa sổ đủ dài gồm monthly jobs/failover; index “không dùng hôm nay” có thể bảo vệ unique constraint hoặc seasonal query.

## Explain: queryPlanner khác executionStats

Query planner mode cho winning/rejected plan mà không nhất thiết cung cấp actual work. executionStats thực thi và báo evidence. allPlansExecution thêm trial information nhưng có overhead. Với aggregation:

~~~javascript
db.orders.explain("executionStats").aggregate([
  { $match: { tenantId: "t-17", status: "PAID" } },
  { $sort: { createdAt: -1 } },
  { $limit: 50 },
  { $project: { _id: 0, orderNo: 1, createdAt: 1, total: 1 } }
])
~~~

Đọc từ input:

- COLLSCAN hay bounded index access;
- indexBounds có thật sự hẹp;
- keysExamined, docsExamined, nReturned;
- sort được index cung cấp hay blocking;
- rejected candidates và plan cache context;
- execution stages lặp nhiều lần;
- bytes/spill và shard merge nếu được báo;
- query framework/version fields.

Explain có thể bỏ qua/không dùng plan cache theo command semantics và không đại diện concurrency/cache production. executionStats chạy query; tránh pipeline mutation hoặc workload nặng trên production. Dùng sampled shape, staging clone hoặc controlled limit khi thích hợp.

Hint hữu ích để kiểm thử hypothesis, không nên là permanent cure. Optimizer controls là version-specific; pin release trong runbook.

## Pipeline optimizer và pushdown

Đặt MATCH sớm theo source fields giúp giảm documents trước UNWIND, LOOKUP, GROUP. MongoDB optimizer có thể tách/di chuyển predicates qua projection stages nếu dependency cho phép, nhưng không thể push điều kiện dựa trên computed field về trước nơi tạo field.

Ví dụ nguy hiểm:

~~~javascript
[
  { $unwind: "$items" },
  { $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "product"
  }},
  { $match: { "items.quantity": { $gte: 10 } } },
  { $group: { _id: "$tenantId", revenue: { $sum: "$items.amount" } } }
]
~~~

Nếu quantity predicate có thể áp trước UNWIND mà vẫn giữ semantics, nó giảm fan-out. Nhưng moving MATCH qua array operators có thể đổi nghĩa; test correctness trước. LOOKUP cost phụ thuộc local cardinality, foreign index, result multiplicity và sharding placement. Một foreign _id index không cứu việc join hàng triệu local rows.

SORT, GROUP, bucket/window stages thường blocking hoặc giữ state. Một số stages có thể ghi temporary files khi vượt memory và allowDiskUse/config cho phép; exceptions và defaults thay đổi theo version. Spill tránh lỗi memory nhưng có thể gây disk latency, capacity pressure và noisy-neighbor. Theo dõi temporary disk cùng pipeline time.

LIMIT trước expensive stage chỉ hợp lệ nếu không đổi business result. SORT + LIMIT có optimizer coalescing trong trường hợp phù hợp, nhưng vẫn cần index hoặc top-k work. Đừng reorder pipeline chỉ vì “filter trước luôn tốt” khi semantics khác.

## Plan cache và parameter skew

Cùng query shape có tenant nhỏ và tenant rất lớn. Winning plan cho common case có thể tệ cho outlier. Capture representative values đã redaction, plan cache key/shape và data distribution. Sau index/schema/statistics/version changes, plan có thể đổi; canary p95/p99 theo tenant class.

Cold cache, cache warmed, concurrent writes và secondary read đều cho results khác. Benchmark phải ghi topology, version, dataset, index sizes và concurrency; không công bố một milliseconds chung.

## Troubleshooting method

1. Xác định query/pipeline shape, tenant và time window.
2. Đo call count, latency distribution, returned bytes.
3. Lấy safe executionStats với representative parameters.
4. Tìm stage cardinality jump, scan ratio, blocking sort/group/spill.
5. Kiểm tra compound bounds, multikey fan-out và foreign index.
6. Tạo candidate index ở environment phù hợp; đo read gain lẫn write/storage.
7. Rollout có canary, theo dõi replication lag/index build/resource.
8. Giữ rollback: hide/drop chỉ sau observation window và compatibility check.

## Failure scenarios

- Thấy IXSCAN rồi kết luận query tối ưu dù scan ratio rất cao.
- Áp ESR máy móc khi selective range trước sort phù hợp hơn.
- Thêm mọi projection field vào index, làm write latency và RAM xấu.
- UNWIND array lớn trước khi filter, cardinality bùng nổ.
- LOOKUP không index foreign join key hoặc local input quá lớn.
- Bật disk spill rồi coi sự cố đã hết.
- Chạy allPlans/executionStats pipeline nặng tùy tiện trên primary.
- Xóa index theo usage window ngắn, làm monthly job regression.

:::production Checklist
Inventory query shapes; thiết kế ESR/ERS bằng evidence; đo keys/docs examined trên nReturned; kiểm tra multikey/index bytes; giới hạn pipeline cardinality; index join keys; monitor sort/group/spill; canary index build; đo write amplification và replica lag; pin MongoDB/driver version; lưu before/after plan và rollback path.
:::

## Góc phỏng vấn

“MongoDB query có dùng index nhưng vẫn chậm, bạn xem gì?” — Xem bounds, keysExamined/docsExamined so với nReturned, FETCH/sort, multikey fan-out, payload và concurrency. Với aggregation, theo cardinality qua MATCH/UNWIND/LOOKUP/GROUP và spill. ESR là guideline, không phải đáp án thuộc lòng; index mới phải trả giá trên write, RAM và disk.

## Key Takeaways

- Tối ưu là giảm keys, documents, bytes và stage cardinality.
- Compound index phải khớp equality, sort, range và prefix thực tế.
- Covered index có read benefit nhưng tăng write/storage cost.
- Optimizer rewrite phụ thuộc dependency và version; explain để xác minh.
- Spill và hint là diagnostic/mitigation, không thay root-cause design.
