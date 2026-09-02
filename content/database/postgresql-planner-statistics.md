---
id: postgresql-planner-statistics
slug: postgresql-planner-statistics-cardinality
title: PostgreSQL Planner Statistics và Cardinality Misestimate
description: Đọc MCV, histogram, ndistinct, correlation và extended statistics để tìm vì sao optimizer chọn sai join order hoặc access path.
category: database
technology: PostgreSQL
level: advanced
estimatedMinutes: 59
tags: ["postgresql","planner","statistics","cardinality","explain"]
prerequisites: ["composite-covering-index-explain"]
related: ["postgresql-mvcc-vacuum-bloat","postgresql-index-types-jsonb"]
next: postgresql-index-types-jsonb
learningObjectives: ["Đối chiếu estimated và actual rows theo từng plan node","Giải thích MCV, histogram, ndistinct và correlation","Dùng extended statistics cho dependency và multivariate distribution"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Statistics Used by the Planner","url":"https://www.postgresql.org/docs/current/planner-stats.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL Using EXPLAIN","url":"https://www.postgresql.org/docs/current/using-explain.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL ANALYZE","url":"https://www.postgresql.org/docs/current/sql-analyze.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Optimizer tối ưu cost trên thế giới ước lượng
PostgreSQL planner không chạy mọi kế hoạch rồi chọn cái nhanh nhất. Nó sinh candidate plans, ước lượng rows và cost, rồi chọn cost thấp. Nếu ước lượng một filter trả 10 row nhưng thực tế 1 triệu row, nested loop có thể được chọn thay vì hash join, memory/sort sizing sai và lỗi nhân lên qua nhiều node.

Vì vậy dấu hiệu đầu tiên khi query plan bất ngờ là tỷ lệ estimated rows so với actual rows, không phải việc có thấy `Seq Scan` hay không. Sequential scan có thể đúng khi query lấy phần lớn table; index scan có thể tệ nếu random heap lookup quá nhiều.

```sql title="Thu evidence có execution và buffer"
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, SETTINGS)
SELECT *
FROM orders
WHERE tenant_id = 42
  AND status = 'PAID';
```

`ANALYZE` trong EXPLAIN thực thi query. Với DML hoặc query đắt, chỉ dùng trong môi trường/transaction được kiểm soát. Timing còn bị cache, concurrent load, JIT và client behavior ảnh hưởng.

## Statistics một cột chứa gì
`ANALYZE` lấy sample và cập nhật catalog. View `pg_stats` trình bày các thành phần như:
- `null_frac`: tỷ lệ NULL;
- `n_distinct`: số distinct ước lượng hoặc tỷ lệ khi giá trị âm;
- `most_common_vals`/`most_common_freqs`: các giá trị phổ biến;
- `histogram_bounds`: phân bố phần còn lại theo bucket;
- `correlation`: liên hệ giữa logical column order và physical row order.

Statistics là approximation và có thể stale giữa các lần analyze. `reltuples`/`relpages` cũng là estimate được cập nhật bởi maintenance/DDL, không phải counter realtime chính xác.

MCV giúp skew: status `PAID` 80% khác status hiếm 0.01%. Histogram ước lượng range cho giá trị không nằm trong MCV. Statistics target tăng số entries/sample detail, đổi lấy thời gian analyze, catalog/memory/planning cost; chỉ tăng có mục tiêu cho cột/query cần thiết.

## Independence assumption và correlated columns
Planner thường kết hợp selectivity của nhiều predicates bằng giả định gần độc lập. Nhưng `country='VN'` và `city='Can Tho'` tương quan mạnh; nhân xác suất độc lập làm under/overestimate.

Extended statistics được tạo cho nhóm cột quan trọng:

```sql title="Thu dependency và MCV nhiều cột"
CREATE STATISTICS st_orders_tenant_status
  (dependencies, mcv, ndistinct)
ON tenant_id, status
FROM orders;

ANALYZE orders;
```

`dependencies` mô tả functional dependency có mức độ; multivariate MCV ghi combination phổ biến; `ndistinct` giúp estimate group distinct. Chỉ tạo object chưa thu data cho tới `ANALYZE`. Extended stats không giải mọi join correlation hay arbitrary expression; phải kiểm tra plan trên đúng PostgreSQL version.

## Parameter-sensitive workloads
Prepared statement có thể dùng custom plan theo parameter hoặc chuyển sang generic plan khi planner đánh giá có lợi. Một plan trung bình có thể ổn với phần lớn tenant nhưng thảm họa với tenant whale. Đây là parameter/data skew, không nhất thiết "index lúc được lúc không".

Điều tra bằng bind values đại diện, generic/custom plan behavior và distribution thật. Giải pháp có thể là statistics tốt hơn, tách query path cho exceptional tenant, partial index, schema partitioning hoặc điều chỉnh plan-cache policy có kiểm chứng. Không hard-code literal chỉ để ép plan mà không hiểu security/caching impact.

## Expression, cast và statistics blind spot
Filter trên expression phức tạp có thể không có statistics hữu ích. Expression index có thể vừa tạo access path vừa thu statistics cho indexed expression tùy behavior; generated column/materialization là option khác. Implicit cast giữa types cũng có thể đổi operator/index eligibility.

```sql title="Biểu diễn predicate theo range dễ estimate và index"
WHERE created_at >= TIMESTAMPTZ '2026-09-01 00:00:00+00'
  AND created_at <  TIMESTAMPTZ '2026-09-02 00:00:00+00'
```

So với `date(created_at)=...`, range giữ semantics timezone explicit và thường mở access path tốt hơn. Nhưng chỉ plan/actual evidence xác nhận.

## Join estimate sai lan truyền
Mỗi node plan có `rows` estimate và khi thực thi có actual rows *per loop*. Khi nested loop chạy inner node 100.000 loops, đọc actual rows mà quên nhân loops dễ đánh giá sai. Tìm node đầu tiên nơi estimate lệch lớn; node phía trên thường chỉ là hậu quả.

Các root causes phổ biến:
- statistics chưa analyze sau bulk load;
- skew thay đổi nhanh hơn auto-analyze threshold;
- correlated columns thiếu extended stats;
- predicate value không nằm trong sample/MCV;
- cross-table correlation planner không biết;
- stale prepared generic plan hoặc parameter cực đoan;
- partition stats/per-partition distribution khác nhau.

## Không "sửa" plan bằng random knobs
Disable `enable_nestloop`, hạ random-page-cost hoặc thêm hint extension có thể làm query hiện tại đổi plan nhưng tác động toàn workload. Dùng session experiment để kiểm chứng giả thuyết được, còn production change cần scope, regression set và rollback.

Đặt cost constants theo storage/hardware thực có thể hợp lý ở platform level. Tuy nhiên statistics/correct query/index thường là nơi điều tra trước nếu chỉ một query sai.

## Failure scenarios
- Sau bulk import không `ANALYZE`, planner vẫn ước lượng theo data cũ.
- Tăng statistics target toàn database, planning/maintenance cost tăng mà query không đổi.
- Chỉ nhìn total query time, không tìm node đầu tiên estimate lệch.
- Thấy Seq Scan và tạo index mới dù query trả 70% table.
- Test tenant nhỏ rồi deploy generic plan cho tenant lớn.
- Chạy EXPLAIN ANALYZE cho destructive DML trực tiếp trên production.
- Ép join type toàn cục để chữa một query, làm regression nơi khác.

:::production Troubleshooting loop
Chụp SQL, bind values, version/settings và plan có buffers; tìm estimate/actual divergence đầu tiên; kiểm tra stats age/distribution; chạy ANALYZE có scope; thử extended stats/index/query rewrite trong staging; benchmark nhiều parameter classes; rollout có query fingerprint monitoring; giữ rollback và xóa statistics/index thử nghiệm nếu không giúp.
:::

## Góc phỏng vấn
"Index tồn tại nhưng PostgreSQL vẫn Seq Scan, có phải optimizer sai?" — Chưa chắc. Query có thể lấy tỷ lệ row lớn, correlation/cache/cost cho Seq Scan rẻ hơn, predicate không tương thích index hoặc cardinality estimate sai. Cần so estimated/actual rows, buffers và distribution trước khi kết luận.

## Key Takeaways
- Plan quality phụ thuộc cardinality estimates theo từng node.
- Statistics là sample/approximation, không phải metadata bất biến.
- MCV/histogram giải skew một cột; extended stats giải một số correlation nhiều cột.
- Parameter skew có thể làm một generic plan không phù hợp mọi tenant.
- Sửa root cause và regression-test, không ép plan bằng knob ngẫu nhiên.
