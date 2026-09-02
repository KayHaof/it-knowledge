---
id: database-query-plan
slug: index-and-query-plan
title: Index và đọc Query Plan
description: Hiểu B-tree, composite index, selectivity và cách dùng EXPLAIN ANALYZE mà không tối ưu theo trực giác.
category: database
technology: PostgreSQL / SQL
level: advanced
estimatedMinutes: 36
tags: ["database","index","explain","query-plan","optimization"]
prerequisites: ["relational-database"]
related: ["jpa-n-plus-one","performance-diagnosis"]
next: jpa-n-plus-one
learningObjectives: ["Đọc scan và join node trong plan","Thiết kế composite index theo predicate","Phân biệt estimate với actual"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL EXPLAIN","url":"https://www.postgresql.org/docs/current/sql-explain.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Using EXPLAIN","url":"https://www.postgresql.org/docs/current/using-explain.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Index giải quyết gì
Index là cấu trúc phụ giúp tìm row mà không đọc toàn table, đổi lại tốn storage, write amplification và maintenance. B-tree phù hợp equality, range và ordered traversal. Optimizer có thể bỏ index khi cần đọc phần lớn table vì sequential scan rẻ hơn random access.

## Composite index
Với index (tenant_id, created_at), predicate tenant_id = ? AND created_at < ? tận dụng prefix tốt. Chỉ lọc created_at thường không tận dụng cột đầu. Thứ tự cột phụ thuộc query shape, selectivity, ordering và workload ghi; không có quy tắc “cột selectivity cao luôn đứng trước” áp dụng máy móc.

```sql title="orders.sql"
CREATE INDEX idx_orders_tenant_created
  ON orders (tenant_id, created_at DESC)
  INCLUDE (status, total_amount);

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, total_amount
FROM orders
WHERE tenant_id = 42 AND created_at < TIMESTAMP '2026-09-01'
ORDER BY created_at DESC
LIMIT 50;
```

## Đọc plan theo evidence
EXPLAIN hiển thị plan dự kiến; ANALYZE thực thi câu lệnh và thêm actual time/rows/loops. So sánh estimated rows với actual rows để phát hiện statistics lệch hoặc predicate correlation. BUFFERS giúp phân biệt CPU với I/O cache behavior.

:::warning An toàn production
EXPLAIN ANALYZE thực thi statement. Với UPDATE/DELETE hoặc query rất nặng, dùng transaction rollback, replica an toàn hoặc môi trường tái hiện; không chạy tùy tiện trên production.
:::

## Những node cần nhìn
- Seq Scan/Index Scan/Index Only Scan: cách lấy row.
- Nested Loop: tốt khi outer nhỏ và inner lookup rẻ, xấu khi cardinality lớn ngoài dự kiến.
- Hash Join: thường hợp equality join tập lớn nếu đủ memory.
- Sort: xem memory và spill ra disk.
- loops: nhân actual time/rows theo số vòng để hiểu chi phí lặp.

## Offset và keyset pagination
OFFSET lớn vẫn buộc database đi qua nhiều row rồi bỏ. Keyset dùng khóa sắp xếp ổn định như (created_at,id) để tiếp tục từ cursor, nhanh và nhất quán hơn khi data thay đổi, nhưng không nhảy trang tùy ý dễ dàng.

## Quy trình tối ưu
1. Ghi nhận slow query, tần suất và percentile latency.
2. Lấy plan cùng bind values đại diện và statistics đủ mới.
3. Sửa query/index nhỏ nhất có thể; cân nhắc write cost.
4. Benchmark cold/warm cache và concurrency thực tế.
5. Theo dõi regression sau deploy.

## Key Takeaways
- Index là trade-off read với write/storage.
- Optimizer chọn theo cost estimate, không theo mong muốn của developer.
- Cardinality estimate sai thường kéo theo join strategy sai.
- EXPLAIN ANALYZE phải dùng thận trọng vì thật sự chạy query.
