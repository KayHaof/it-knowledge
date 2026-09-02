---
id: composite-covering-index-explain
slug: composite-covering-index-and-explain
title: Composite, Covering Index và EXPLAIN thực chiến
description: Thiết kế index từ workload, đọc estimated/actual plan và chẩn đoán cardinality, scan, join, sort hay spill thay vì đoán mò.
category: database
technology: PostgreSQL / MySQL / Oracle Database
level: advanced
estimatedMinutes: 55
tags: ["index","composite-index","covering-index","explain","optimizer"]
prerequisites: ["sql-logical-processing-joins"]
related: ["database-query-plan","sql-cte-window-analytics","jpa-n-plus-one"]
next: normalization-denormalization
learningObjectives: ["Sắp thứ tự cột composite index theo workload","Phân biệt index access với filter và covering scan","Đọc actual plan cùng cardinality estimate và runtime evidence"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Indexes","url":"https://www.postgresql.org/docs/current/indexes.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL Using EXPLAIN","url":"https://www.postgresql.org/docs/current/using-explain.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Optimization and Indexes","url":"https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Optimizing Queries with EXPLAIN","url":"https://dev.mysql.com/doc/refman/8.4/en/using-explain.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Index là cấu trúc phụ phục vụ workload
Index đổi thêm storage và write amplification để giảm số page/row phải đọc hoặc tránh sort. Câu hỏi đúng không phải "cột này có nên index?" mà là "query pattern nào đủ quan trọng, predicate/order/projection ra sao, độ chọn lọc và tỷ lệ đọc-ghi thế nào?"

Một B-tree được sắp theo key. Với index `(tenant_id, status, created_at)`, prefix bắt đầu từ `tenant_id` hữu ích nhất; predicate equality trên các cột đầu thường cho phép range theo cột sau. Quy tắc "cột selectivity cao nhất luôn đứng trước" quá đơn giản: tenant isolation, equality/range, ordering, grouping và khả năng tái sử dụng đều quan trọng.

```sql title="Index được thiết kế cho access pattern"
CREATE INDEX idx_orders_tenant_status_created
ON orders (tenant_id, status, created_at DESC);

SELECT id, created_at, total_amount
FROM orders
WHERE tenant_id = :tenant
  AND status = 'PAID'
  AND created_at < :cursor
ORDER BY created_at DESC, id DESC
FETCH FIRST 50 ROWS ONLY;
```

Nếu cần ordering tuyệt đối ổn định, đưa tie-break `id` vào `ORDER BY` và cân nhắc index key tương ứng. Cú pháp limit/index include/descending hỗ trợ khác nhau theo engine.

## Equality, range và leftmost prefix
Với `(a,b,c)`, lookup `a=? AND b=? AND c>?` thường dùng cả prefix đến range. Query chỉ `b=?` thường không có điểm bắt đầu hiệu quả trên B-tree này. Query `a>? AND b=?` có thể dùng `a` để range nhưng `b` thường trở thành filter, tùy optimizer/engine.

Không biến quy tắc này thành tuyệt đối: skip scan, bitmap combination hoặc statistics có thể dẫn đến lựa chọn khác. Plan là bằng chứng cuối.

## Covering và index-only scan
Một index "cover" khi chứa đủ dữ liệu query cần, giúp tránh hoặc giảm truy cập heap/table. PostgreSQL `INCLUDE`, MySQL secondary-index leaf có đặc điểm riêng với clustered primary key, Oracle có storage/access path riêng. Index-only không đồng nghĩa zero heap I/O trong mọi engine; visibility, page state và implementation quyết định.

```sql title="PostgreSQL covering index"
CREATE INDEX idx_invoice_customer_due
ON invoices (customer_id, due_date)
INCLUDE (status, amount);
```

Đưa quá nhiều cột vào index làm index lớn, cache kém, insert/update tốn hơn. Covering là quyết định cho read path nóng, không phải mặc định.

## Partial, expression và specialized index
PostgreSQL hỗ trợ partial index cho tập con và expression index; MySQL có generated/functional index tùy phiên bản; Oracle có function-based index. Chúng hữu ích khi query predicate khớp chính xác, nhưng làm portability và migration phức tạp.

```sql title="Partial index cho hàng đợi đang mở trên PostgreSQL"
CREATE INDEX idx_jobs_ready
ON jobs (priority DESC, created_at)
WHERE status = 'READY';
```

Predicate query phải tương thích để optimizer chứng minh index dùng được. Parameterization và kiểu dữ liệu/cast có thể làm mất khả năng đó.

## Đọc plan theo một chuỗi câu hỏi
1. Đây là estimated plan hay đã thực thi?
2. Node nào chiếm elapsed time, loops, rows hoặc I/O lớn?
3. Estimated rows lệch actual rows bao nhiêu lần?
4. Có scan nhiều rồi filter bỏ gần hết không?
5. Join order/algorithm nào được chọn và input cardinality ra sao?
6. Sort/hash có spill ra disk không?
7. Thời gian là CPU, read I/O, lock wait hay client/network?

PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` thực thi query; với write statement nên dùng transaction có rollback trong môi trường an toàn. MySQL `EXPLAIN ANALYZE` cũng thực thi và trả timing. Không chạy tùy tiện trên production đối với query đắt hoặc có side effect.

```sql title="Ví dụ PostgreSQL trong môi trường kiểm soát"
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT *
FROM orders
WHERE tenant_id = 42
  AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 50;
```

## Cardinality estimate là nút thắt trung tâm
Optimizer so sánh cost dựa trên row estimate. Statistics stale, skew, correlated columns, parameter values hay predicate phức tạp có thể khiến estimate sai hàng trăm lần; join order/algorithm sau đó sai theo. Thêm index mà không chữa estimate đôi khi chỉ đổi một plan tệ sang plan tệ khác.

Các hướng điều tra gồm cập nhật statistics, extended statistics/vendor feature cho correlated columns, viết predicate sargable, sửa kiểu dữ liệu và phân tách workload khác biệt. Hint là biện pháp có chi phí duy trì, nên dùng khi đã hiểu root cause và có regression guard.

## Sargability và implicit conversion
Predicate có function trên indexed column hoặc cast ngầm sai phía có thể ngăn range seek.

```sql title="Giữ cột thời gian ở dạng range"
-- Kém sargable
WHERE DATE(created_at) = :day

-- Thường tốt hơn
WHERE created_at >= :day_start
  AND created_at <  :next_day_start
```

Behavior cụ thể phụ thuộc engine, expression index và optimizer rewrite. Quan trọng là xem access condition trong plan, không chỉ nhìn tên index.

## Failure scenarios
- Tạo nhiều index trùng prefix làm write latency và storage tăng.
- Index low-cardinality được dùng nhưng vẫn đọc phần lớn table.
- Query dev nhanh vì dataset nhỏ/cache nóng, production spill vì phân bố khác.
- `SELECT *` phá covering và kéo payload lớn qua network.
- Parameter-sensitive plan tốt cho tenant nhỏ nhưng tệ cho tenant cực lớn.
- Offset pagination càng sâu càng scan/bỏ nhiều row; keyset pagination thường ổn định hơn.

:::production Checklist thay đổi index
Lấy query và bind values đại diện; lưu plan trước/sau; đo p50/p95/p99 cùng rows/I/O; tính write/storage cost; tạo index online/concurrently khi engine hỗ trợ; theo dõi lock và replication lag; chuẩn bị rollback; loại index cũ chỉ sau thời gian quan sát đầy đủ.
:::

## Góc phỏng vấn
"Composite index `(a,b,c)` có dùng được cho `b=?` không?" — thông thường không có leftmost starting point hiệu quả, nhưng câu trả lời senior phải nói optimizer/engine có thể có skip scan hoặc scan toàn index; cần xem plan, cardinality và workload. Index "được dùng" chưa chắc query tốt.

## Key Takeaways
- Thiết kế index từ query shape và workload, không từ danh sách cột.
- Composite order phải cân bằng equality, range, ordering và reuse.
- Covering giảm lookup nhưng tăng write/storage footprint.
- Estimate-vs-actual mismatch thường giải thích plan sai.
- Mọi index change cần evidence trước/sau và kế hoạch vận hành.
