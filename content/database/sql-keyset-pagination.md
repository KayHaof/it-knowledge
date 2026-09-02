---
id: sql-keyset-pagination
slug: sql-keyset-pagination
title: Keyset Pagination và Cursor API trong SQL
description: Thiết kế cursor pagination có thứ tự toàn phần, composite index, forward/backward navigation và semantics ổn định trước dữ liệu thay đổi.
category: database
technology: SQL
level: advanced
estimatedMinutes: 58
tags: ["sql","pagination","keyset","cursor","index"]
prerequisites: ["sql-logical-processing-joins","composite-covering-index-explain"]
related: ["database-query-plan","database-slow-api-investigation"]
next: database-replication-sharding-decisions
learningObjectives: ["Viết keyset predicate khớp composite ordering","Thiết kế cursor token và API contract an toàn","Phân tích duplicate, missing row và navigation khi dữ liệu thay đổi"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL LIMIT and OFFSET","url":"https://www.postgresql.org/docs/current/queries-limit.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL Row and Array Comparisons","url":"https://www.postgresql.org/docs/current/functions-comparisons.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL Indexes and ORDER BY","url":"https://www.postgresql.org/docs/current/indexes-ordering.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## OFFSET đếm vị trí; keyset tiếp tục sau một giá trị

Pagination bằng LIMIT/OFFSET dễ dùng cho trang nhỏ và giao diện nhảy tới số trang. Nhưng database vẫn phải tính rồi bỏ qua các rows trước OFFSET; offset càng sâu càng có thể tốn công. Khi rows được insert/delete giữa hai request, “vị trí thứ 101” cũng dịch chuyển, gây duplicate hoặc missing.

Keyset pagination, còn gọi seek/cursor pagination, không hỏi “bỏ qua N rows” mà hỏi “lấy N rows đứng sau khóa cuối đã thấy trong một thứ tự xác định”. Nó biến cursor thành boundary predicate mà B-tree có thể seek.

~~~mermaid
flowchart LR
  A[ORDER BY khóa toàn phần] --> B[Page 1]
  B --> C[Cursor = khóa row cuối]
  C --> D[WHERE khóa sau cursor]
  D --> E[Page kế tiếp]
~~~

## Thứ tự phải deterministic và unique

Giả sử feed sắp xếp mới nhất trước. ORDER BY created_at DESC một mình không đủ vì nhiều rows có cùng timestamp. Thêm id duy nhất làm tie-breaker:

~~~sql
SELECT id, created_at, title
FROM posts
WHERE tenant_id = :tenant
ORDER BY created_at DESC, id DESC
LIMIT :page_size;
~~~

Cursor của page đầu giữ cặp (last_created_at, last_id). Page sau:

~~~sql
SELECT id, created_at, title
FROM posts
WHERE tenant_id = :tenant
  AND (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC
LIMIT :page_size;
~~~

Trong PostgreSQL, row comparison đánh giá từ trái sang phải theo B-tree operator semantics. Với engine hoặc version không tối ưu row constructor như mong đợi, viết tương đương:

~~~sql
AND (
  created_at < :last_created_at
  OR (created_at = :last_created_at AND id < :last_id)
)
~~~

Luôn kiểm tra execution plan trên engine/version thật. NULL làm comparison phức tạp; tốt nhất cursor columns là NOT NULL hoặc định nghĩa rõ NULLS FIRST/LAST và predicate tương ứng.

## Composite index phải khớp filter và ordering

Với query trên, index thường bắt đầu bằng equality filter rồi ordering keys:

~~~sql
CREATE INDEX idx_posts_tenant_created_id
ON posts (tenant_id, created_at DESC, id DESC);
~~~

PostgreSQL B-tree có thể scan tiến hoặc lùi; mixed ASC/DESC trong multicolumn index có ý nghĩa khi ordering hỗn hợp. Engine khác có behavior/version khác. Dùng EXPLAIN để xác nhận range/seek bắt đầu từ cursor, không scan nhiều rồi filter.

Đừng thêm mọi selected column để “cover” một cách máy móc. Include/covering làm index lớn, tăng write amplification và cache pressure. Quyết định dựa trên read frequency, payload và plan. Page size quá lớn vẫn đắt dù seek tốt.

## Cursor token là API contract, không phải offset đổi tên

Không nhất thiết đưa raw ID/timestamp ra query string. Một opaque token nên encode:

- version của cursor schema;
- ordered key values với precision đầy đủ;
- direction;
- page-size policy hoặc giới hạn server;
- fingerprint của filter/sort/tenant;
- snapshot boundary nếu contract yêu cầu;
- expiry và integrity protection.

Base64 chỉ là encoding, không chống sửa. Ký token bằng MAC hoặc mã hóa khi chứa thông tin nhạy cảm. Server phải bind cursor với authenticated tenant và allowed filter; nếu client đổi status/filter nhưng tái dùng cursor cũ, trả lỗi rõ thay vì page sai.

Không serialize timestamp qua định dạng mất microseconds/timezone. Không dùng display field có collation thay đổi mà không encode collation/version assumptions. Cursor schema cần backward compatibility trong thời gian clients còn giữ token.

## Dữ liệu thay đổi giữa các page

Keyset ổn định hơn OFFSET về vị trí nhưng không tự tạo snapshot xuyên nhiều HTTP requests. Nếu row mới được insert “trước” cursor, user đang đi tiếp sẽ không thấy nó trong session hiện tại — thường là semantics hợp lý cho feed. Nếu sort key của row cũ bị update qua boundary, row có thể xuất hiện lại hoặc bị bỏ qua.

Có ba contract phổ biến:

1. **Live traversal:** chấp nhận thay đổi, tối ưu freshness.
2. **High-water mark:** page đầu ghi một upper boundary; các page sau giới hạn không vượt boundary, ngăn insert mới chen vào nhưng update/delete vẫn cần định nghĩa.
3. **Snapshot/export:** database snapshot hoặc materialized result cho consistency mạnh hơn, nhưng giữ transaction snapshot lâu qua web requests thường gây resource/MVCC pressure và không nên là mặc định.

Chọn sort key immutable hoặc gần immutable giảm anomaly. Nếu nghiệp vụ cần “đọc đúng một lần mọi record” cho job, pagination API không thay thế queue/checkpoint/idempotency.

## Forward và backward navigation

Đi tới page sau với DESC dùng toán tử nhỏ hơn. Để lấy page trước, đảo comparison và ordering, lấy N rows rồi reverse ở application:

~~~sql
SELECT id, created_at, title
FROM posts
WHERE tenant_id = :tenant
  AND (created_at, id) > (:first_created_at, :first_id)
ORDER BY created_at ASC, id ASC
LIMIT :page_size;
~~~

Cursor response có thể cung cấp next và prev dựa trên first/last row. Không tuyên bố hasNext chỉ vì trả đủ N; thường fetch N+1 rồi bỏ row thừa để biết còn dữ liệu. Fetch N+1 vẫn phải enforce maximum page size.

Nhảy trực tiếp tới “trang 500” không tự nhiên với keyset. Nếu product thực sự cần random page và exact total, OFFSET hoặc một search/index/materialized strategy có thể phù hợp hơn. Tránh hứa cả deep random access, live consistency và cost cố định mà không thêm state.

## Count và filter

COUNT(*) chính xác trên filter lớn có thể đắt hơn việc lấy page. API cursor thường trả hasNext thay vì totalPages; count có thể asynchronous, approximate hoặc cache theo business requirement. Đừng chạy count nặng trong mọi request rồi cho rằng keyset đã tối ưu endpoint.

Mọi filter phải được đưa vào cả query và token binding. Dynamic sort cần allowlist vì mỗi ordering cần predicate/index khác; không nối raw column từ client vào SQL. Search text với relevance score cần tie-breaker và score có thể thay đổi khi index/model cập nhật.

## Shard và replica considerations

Trên read replica, lag có thể làm row vừa tạo chưa xuất hiện; read-your-writes cần routing/session policy. Trên nhiều shards, global keyset cần cursor per shard và merge sorted streams, hoặc một globally routed index. Một cặp timestamp/id không bảo đảm uniqueness toàn hệ thống nếu ID chỉ unique trong shard.

Collation, timezone và database version có thể thay đổi ordering. Migration phải test token cũ và mixed-version period.

## Failure scenarios

- ORDER BY created_at không có unique tie-breaker.
- Cursor lưu timestamp bị truncate, gây duplicate tại boundary.
- Predicate dùng nhỏ hơn nhưng ORDER BY lại ASC.
- Có index trên created_at nhưng equality tenant đứng sai vị trí.
- Token Base64 được tin như đã chống tampering.
- Dùng cursor cũ với filter/tenant mới.
- Giữ transaction snapshot hàng giờ để user bấm qua pages.
- Mỗi page vẫn chạy exact COUNT trên tập dữ liệu rất lớn.

:::production Checklist
Chốt live hay snapshot semantics; dùng total order với unique tie-breaker; xử lý NULL/collation; tạo và đo composite index; encode version/filter/tenant/direction; ký token; giới hạn page size; fetch N+1; test equal timestamps, insert/delete/update giữa pages, forward/backward và token cũ; theo dõi rows scanned, latency và payload.
:::

## Góc phỏng vấn

“Tại sao keyset nhanh và có nhược điểm gì?” — Nó seek theo ordered key thay vì tính và bỏ N rows, nên deep traversal thường ổn định hơn khi có index phù hợp. Đổi lại, cần total ordering, cursor contract và không hỗ trợ random page tự nhiên. Dữ liệu mutable vẫn có anomaly; row comparison, NULL, direction và composite index phải khớp.

## Key Takeaways

- Keyset dựa trên giá trị boundary, không dựa trên row position.
- Ordering phải deterministic, unique và khớp predicate.
- Cursor cần version, filter binding và integrity protection.
- Multi-request traversal không tự là consistent snapshot.
- API phải nói rõ navigation, count và mutation semantics.

