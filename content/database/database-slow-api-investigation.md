---
id: database-slow-api-investigation
slug: database-slow-api-investigation
title: Điều tra API chậm từ Application đến Database
description: Điều tra latency theo critical path, query fingerprint, wait event và execution plan để phân biệt pool wait, lock, I/O, cardinality hay application processing.
category: database
technology: Multi-database
level: senior
estimatedMinutes: 66
tags: ["database","slow-query","execution-plan","observability","troubleshooting"]
prerequisites: ["database-query-plan","performance-diagnosis"]
related: ["composite-covering-index-explain","database-connection-pool-capacity","postgresql-planner-statistics"]
next: database-connection-pool-capacity
learningObjectives: ["Phân rã API latency thành các stage có thể đo","Điều tra query bằng fingerprint, wait và actual plan an toàn","Xây runbook xử lý sự cố mà không tối ưu theo phỏng đoán"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Using EXPLAIN","url":"https://www.postgresql.org/docs/current/using-explain.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL Cumulative Statistics System","url":"https://www.postgresql.org/docs/current/monitoring-stats.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Performance Schema Statement Digests and Sampling","url":"https://dev.mysql.com/doc/refman/8.4/en/performance-schema-statement-digests.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Oracle Explaining and Displaying Execution Plans","url":"https://docs.oracle.com/en/database/oracle/oracle-database/26/tgsql/generating-and-displaying-execution-plans.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: API latency là tổng của một critical path

“Database chậm” thường là nhãn gắn quá sớm. Thời gian một request nhìn thấy có thể gồm queue tại web server, chờ thread, chờ connection pool, network tới database, parse/plan, lock wait, execute, fetch nhiều round trip, ánh xạ object, serialization và downstream call. Một query chạy 20 ms nhưng chờ pool 2 giây không phải slow query; ngược lại, endpoint tổng 200 ms có thể che một query quét quá nhiều dữ liệu vì cache đang cứu nó.

~~~mermaid
flowchart LR
  A[Request queue] --> B[Acquire DB connection]
  B --> C[Parse và plan]
  C --> D[Lock hoặc resource wait]
  D --> E[Execute operators]
  E --> F[Fetch result]
  F --> G[Map và serialize]
~~~

Điều tra senior bắt đầu bằng timeline có correlation ID, không bắt đầu bằng “thêm index”. Mục tiêu là chỉ ra stage nào chiếm latency, trong điều kiện tải nào, với query shape và database state nào.

## Bước 1: xác nhận impact và cửa sổ thời gian

Ghi rõ endpoint, tenant, percentile bị ảnh hưởng, error/timeout, thời điểm bắt đầu, deployment hoặc traffic change gần nhất. Average dễ che tail latency; hãy so p50, p95, p99 và throughput. Tách “một request cá biệt chậm” khỏi “mọi request xếp hàng”. Nếu concurrency tăng nhưng thời gian execute từng statement ổn định, bottleneck có thể là pool hoặc admission control.

Đồng bộ clock và giữ cùng time window giữa tracing, application metrics, database metrics và load balancer. Không so plan lúc 10 giờ với CPU spike lúc 11 giờ rồi kết luận nhân quả. Snapshot evidence trước khi restart vì active sessions, blockers và plan cache có thể biến mất.

## Bước 2: phân rã trace và đếm round trip

Trong trace, đo riêng connection acquire, transaction duration, từng database span, số rows trả về và object mapping. Kiểm tra N+1: một statement nhanh lặp 500 lần vẫn tạo latency và load lớn. Kiểm tra lazy loading sau transaction, payload quá rộng, pagination thiếu giới hạn, và gọi database tuần tự dù độc lập.

Query text chứa literal nên được chuẩn hóa thành fingerprint/digest để gom cùng shape. MySQL Performance Schema hỗ trợ statement digest; các engine khác có cơ chế thống kê tương ứng. Xếp hạng theo total time, executions, mean/tail time, rows examined/returned và temporary work. Query có mean nhỏ nhưng gọi hàng triệu lần có thể quan trọng hơn query hiếm chạy vài giây.

Không log nguyên bind value nhạy cảm. Giữ query ID/fingerprint, schema/tenant, plan identifier và sampled parameters đã redaction. Cardinality phụ thuộc parameter nên một sample “nhẹ” không đại diện cho sample gây sự cố.

## Bước 3: hỏi database đang chạy hay đang chờ

CPU cao chỉ là một loại bottleneck. Session có thể chờ row/table lock, disk read, WAL/redo flush, temporary I/O, network client, memory grant hoặc connection slot. PostgreSQL statistics views cung cấp activity và wait information; MySQL/Oracle có view tương đương nhưng tên, retention và privilege phụ thuộc phiên bản.

Đi theo chuỗi blocker: session nạn nhân chờ ai, blocker đang làm statement gì, transaction mở bao lâu, có “idle in transaction” hay không. Đừng chỉ kill nạn nhân; blocker hoặc transaction boundary mới là root cause. Khi nhiều query khác nhau cùng chậm, tìm shared resource như disk saturation, checkpoint, replica conflict hoặc exhausted pool trước khi sửa từng SQL.

## Bước 4: đọc execution plan bằng estimated-versus-actual

Plan là cây operator. Đọc từ nơi dữ liệu được tạo lên parent, chú ý:

- estimated rows so với actual rows ở từng node;
- số loops, rows removed by filter và join amplification;
- scan type, join algorithm, sort/hash spill và temporary bytes;
- buffer/cache hit so với physical read;
- time to first row và total time;
- predicate là index condition hay post-filter;
- plan thay đổi theo bind value, statistics hoặc schema.

Sai lệch cardinality lớn thường làm planner chọn join/order/memory sai. Nguyên nhân có thể là statistics cũ, cột tương quan, skew, expression không được thống kê, implicit cast hoặc predicate không sargable. Index chỉ hữu ích khi khớp filter/order/selectivity và write cost chấp nhận được.

Ví dụ PostgreSQL trên môi trường an toàn:

~~~sql
EXPLAIN (ANALYZE, BUFFERS, WAL, SETTINGS, FORMAT JSON)
SELECT id, created_at, status
FROM orders
WHERE tenant_id = :tenant
  AND status = :status
ORDER BY created_at DESC, id DESC
LIMIT 50;
~~~

EXPLAIN ANALYZE thực thi statement. Không chạy tùy tiện với UPDATE/DELETE, query không giới hạn hoặc workload nhạy cảm trên production. Có thể dùng estimated plan trước, transaction rollback có kiểm soát, clone/replica phù hợp, hay capture actual plan bằng facility của vendor. Oracle phân biệt plan dự đoán và cursor plan đã thực thi; tên command và statistics availability phụ thuộc version/licensing.

## Bước 5: kiểm tra boundary ngoài plan

Plan tốt không đảm bảo API nhanh. Result set lớn làm network/fetch/mapping đắt; ORM có thể hydrate graph dư thừa; connection giữ trong lúc gọi HTTP; transaction bao trùm CPU work; client đọc chậm khiến server chờ. Đo bytes, rows, fetch size và thời gian từ database span kết thúc đến response hoàn tất.

Cache hit cao không chứng minh query rẻ: nó có thể đốt CPU và logical reads. Ngược lại, sequential scan không luôn xấu nếu cần phần lớn table. So sánh với business result, data volume và baseline cùng tải.

## Thử nghiệm giả thuyết, không “change-and-pray”

Mỗi thay đổi phải nêu cơ chế dự kiến và metric xác nhận: index mới giảm rows/pages nào; rewrite loại bỏ sort nào; batch giảm round trips bao nhiêu; transaction ngắn hơn giảm lock wait nào. Dùng representative data và concurrency. Đo trước/sau cả read latency, CPU, I/O, write amplification, storage và replica lag.

Nếu regression sau deploy, so query fingerprint, bind distribution, plan identifier, statistics/schema và application call count. Rollback application có thể nhanh hơn online DDL trong incident; quyết định theo impact và reversibility.

## Failure scenarios

- Thêm index vì thấy sequential scan dù query đọc phần lớn table.
- Chỉ xem query chậm nhất, bỏ qua statement nhanh bị gọi N+1.
- Chạy actual plan của DELETE trực tiếp trên production.
- Restart database làm mất blocker evidence rồi tuyên bố đã sửa.
- Tăng timeout khiến queue dài hơn trong khi service rate không đổi.
- So estimated cost giữa hai database như milliseconds thực tế.
- Tối ưu sample parameter phổ biến nhưng làm tenant lớn regression.

:::production Runbook điều tra
Chốt impact và time window; lấy trace stage timing; gom query fingerprint; kiểm tra pool và active/waiting sessions; theo blocker chain; lấy plan an toàn với representative binds; so estimated/actual rows, loops, I/O và spill; kiểm tra round trip/result mapping; chọn thay đổi reversible; canary và so metric trước/sau; lưu evidence cùng quyết định.
:::

## Góc phỏng vấn

“API chậm, bạn kiểm tra database thế nào?” — Câu trả lời senior phải phân rã latency trước, phân biệt acquire wait với execute time, dùng fingerprint để tìm workload contributor, xem wait/blocker, rồi đọc actual plan có buffer/cardinality. Ứng viên tốt còn nói rủi ro của EXPLAIN ANALYZE, parameter skew, N+1 và cách xác nhận fix dưới concurrency.

## Key Takeaways

- Endpoint latency không đồng nghĩa query execution latency.
- Fingerprint và total workload cost quan trọng hơn một log cá biệt.
- Wait chain trả lời “đang chờ gì”; plan trả lời “đang làm gì”.
- Estimated-versus-actual rows là tín hiệu trung tâm khi đọc plan.
- Mọi tối ưu cần hypothesis, safety guard và before/after evidence.

