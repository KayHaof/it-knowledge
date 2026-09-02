---
id: postgresql-partitioning-operations
slug: postgresql-partitioning-pruning-operations
title: PostgreSQL Partitioning, Pruning và Vận hành
description: Thiết kế range/list/hash partitions cho lifecycle và pruning; tránh over-partitioning, lock khi attach/index và uniqueness limitation.
category: database
technology: PostgreSQL
level: senior
estimatedMinutes: 65
tags: ["postgresql","partitioning","partition-pruning","maintenance","ddl"]
prerequisites: ["postgresql-planner-statistics"]
related: ["postgresql-index-types-jsonb","postgresql-mvcc-vacuum-bloat"]
next: mysql-innodb-clustered-secondary-indexes
learningObjectives: ["Chọn partition key theo query và data lifecycle","Đọc plan-time với execution-time pruning","Lập runbook attach, detach, index và retention ít lock"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Table Partitioning","url":"https://www.postgresql.org/docs/current/ddl-partitioning.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL CREATE TABLE","url":"https://www.postgresql.org/docs/current/sql-createtable.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL ALTER TABLE","url":"https://www.postgresql.org/docs/current/sql-altertable.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Partitioning chia một logical table thành physical relations
Declarative partitioning route row vào child partition theo range, list hoặc hash bounds. Query nhắm parent có thể prune partitions không thể match. Mỗi partition có heap/index/statistics/maintenance riêng, trong khi application nhìn logical table.

Partitioning không tự động làm mọi query nhanh. Nếu query không filter theo partition key hoặc cần scan mọi partition, planning/execution overhead có thể tăng. Mục tiêu mạnh thường là lifecycle: drop/detach một tháng dữ liệu, isolate hot/cold, bulk load/attach, hoặc giữ index mỗi partition ở kích thước quản lý được.

## Chọn partition key từ access và retention
Time range phù hợp append/event/audit data có retention theo thời gian. List phù hợp số category/region hữu hạn và ổn định. Hash phân phối tương đối đều khi không có natural pruning key, nhưng retention theo time khó hơn.

Một key tốt cần:
- xuất hiện trong predicates quan trọng để prune;
- có bounds ổn định/dễ tạo trước;
- align data deletion/archive lifecycle;
- không tạo vài partition hot khổng lồ và nhiều partition rỗng;
- đáp ứng unique/primary-key constraints cần thiết;
- chịu được late-arriving data và timezone semantics.

```sql title="Range partition theo UTC month"
CREATE TABLE events (
  tenant_id bigint NOT NULL,
  occurred_at timestamptz NOT NULL,
  event_id uuid NOT NULL,
  payload jsonb NOT NULL,
  PRIMARY KEY (tenant_id, occurred_at, event_id)
) PARTITION BY RANGE (occurred_at);

CREATE TABLE events_2026_09 PARTITION OF events
FOR VALUES FROM ('2026-09-01 00:00:00+00')
             TO ('2026-10-01 00:00:00+00');
```

Primary/unique constraint trên partitioned table bị ràng buộc bởi khả năng đảm bảo uniqueness xuyên partitions; thường partition key phải nằm trong key constraint. Nếu business đòi global unique khác partition key, cần thiết kế identity/lookup table/coordination phù hợp, không giả định database kiểm tra toàn cục.

## Partition pruning khác index scan
Pruning loại toàn relation dựa trên partition bounds. Sau đó index/seq scan được chọn bên trong partition còn lại. Partition không thay index; mỗi child có thể cần index phục vụ predicate/order khác.

Planner có thể prune tại plan time khi biết constant, và executor có thể prune thêm khi parameter/value chỉ biết lúc init/loop. `EXPLAIN (ANALYZE)` hiển thị subplans chưa chạy hoặc loops để suy ra pruning. Function/cast không tương thích và predicate không trực tiếp liên hệ partition key có thể ngăn pruning.

```sql title="Predicate trực tiếp trên key"
WHERE occurred_at >= :from_utc
  AND occurred_at <  :to_utc
```

`date(occurred_at)=...` hoặc timezone conversion trong predicate có thể khó prune và sai boundary. Tính range tại application/query parameter theo business timezone rồi so sánh timestamptz range explicit.

## Số partitions là một capacity dimension
Quá ít partitions làm index/data chunk lớn, lifecycle coarse. Quá nhiều làm planning time, catalog, memory, autovacuum workers/queues, file descriptors và DDL/index management phức tạp. Đừng partition theo customer nếu có hàng trăm nghìn customers; có thể range time rồi subpartition hash/list khi workload chứng minh, nhưng hai tầng cũng tăng operations.

Đo planning time riêng execution time. Query trả 1 ms nhưng plan 200 ms vẫn là vấn đề. Prepared plans, partition count và version PostgreSQL ảnh hưởng behavior.

## Default partition là safety net có giá
Default partition nhận row không match bounds, giúp write không fail khi quên tạo partition. Nhưng nó có thể che automation hỏng và ngày càng lớn. Khi attach partition mới, PostgreSQL có thể cần scan default partition để chứng minh không chứa row thuộc bound mới, gây lock/latency.

Nếu dùng default, alert bất kỳ row/growth bất thường, có job di chuyển dữ liệu và constraint exclusion phù hợp. Nhiều hệ thống chọn fail-fast write cùng automation tạo partition trước để sự cố lộ rõ.

## Attach/detach và load workflow
Có thể tạo standalone table, load/validate/index trước, thêm `CHECK` constraint khớp bound rồi `ATTACH PARTITION`. Constraint giúp tránh scan validation dưới lock mạnh trên partition. Cần schema/constraint/index compatibility đúng.

Detach partition hỗ trợ retention/archive nhanh hơn row-by-row delete và giảm MVCC churn, nhưng lock mode, foreign keys và concurrent query phải được thử. Có thể detach rồi dump/drop ngoài hot path theo runbook.

## Index trên partitioned table
Tạo index parent áp cấu trúc xuống partitions, nhưng online/concurrent limitations cần đọc đúng version. Một chiến lược cho table lớn là tạo parent index invalid trên `ONLY`, build child indexes `CONCURRENTLY`, rồi attach từng index; sau khi đủ children parent index trở valid. Quy trình có nhiều failure state nên automation phải idempotent và inventory được.

Index thiếu trên một partition mới tạo có thể chỉ làm query một tháng chậm, rất khó phát hiện bằng average. Validate schema/index parity định kỳ.

## Autovacuum, statistics và skew theo partition
Mỗi child có churn và statistics riêng. Current partition write-heavy cần aggressive vacuum/analyze hơn partition lịch sử read-only. Parent-level query estimate còn phụ thuộc statistics/partition planning; bulk attach/load phải analyze trước traffic.

Partition key skew có thể tạo current partition lớn/hot trong khi lịch sử lạnh; partitioning không shard write của một time window qua nodes. Có thể subpartition, nhưng bottleneck single PostgreSQL instance/storage vẫn tồn tại.

## Failure scenarios
- Query thiếu time predicate fan-out qua hàng nghìn partitions.
- Daily partitions sau nhiều năm làm catalog/planning overhead lớn.
- Default partition tích dữ liệu âm thầm; attach tháng mới scan/lock lớn.
- Tạo partition theo local midnight nhưng query UTC, row đi sai boundary.
- Global unique requirement không thể enforce bằng constraint đã thiết kế.
- Partition mới thiếu index/grant/policy làm regression cục bộ.
- Drop partition không xem xét legal hold, backup hay downstream replication.

:::production Runbook lifecycle
Tạo partitions trước horizon; verify bound/timezone, owner, grants, indexes và RLS; load staging table rồi validate/check/attach; ANALYZE; smoke query pruning; alert default partition; detach/archive/drop theo retention approval; theo dõi planning time/catalog count; diễn tập failure giữa từng DDL step và viết automation idempotent.
:::

## Góc phỏng vấn
"Partitioning có thay index không?" — Không. Pruning loại partitions bằng bounds; bên trong partition còn lại planner vẫn chọn seq/index scan. Partitioning hữu ích cho lifecycle và query có partition-key predicate, nhưng over-partitioning tăng planning/catalog/maintenance cost.

## Key Takeaways
- Partition từ query + lifecycle, không từ kích thước table đơn thuần.
- Pruning và indexing là hai tầng tối ưu khác nhau.
- Default partition cần alert và cleanup, không là thùng rác vĩnh viễn.
- Attach/index online cần constraint và runbook lock-aware.
- Luôn đo planning time, parity và per-partition skew.
