---
id: mysql-innodb-locks-replication
slug: mysql-innodb-isolation-locks-replication
title: MySQL InnoDB Isolation, Locks và Replication Failover
description: Nối read view, record/gap/next-key locks với binlog, GTID và replica lag để hiểu concurrency lẫn failover data-loss window của MySQL.
category: database
technology: MySQL InnoDB
level: senior
estimatedMinutes: 68
tags: ["mysql","innodb","isolation","gap-lock","replication","gtid"]
prerequisites: ["transactions-mvcc-deadlocks","mysql-innodb-clustered-secondary-indexes"]
related: ["database-engine-tradeoffs","distributed-failures"]
next: oracle-undo-read-consistency-optimizer
learningObjectives: ["Phân biệt consistent read và locking read","Giải thích record, gap và next-key locking theo index range","Đánh giá async/semisync replication, GTID và failover correctness"]
lastReviewed: 2026-09-02
sources: [{"title":"MySQL InnoDB Locking and Transaction Model","url":"https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-transaction-model.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Transaction Isolation Levels","url":"https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Replication Implementation","url":"https://dev.mysql.com/doc/refman/8.4/en/replication-implementation.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Replication with GTIDs","url":"https://dev.mysql.com/doc/refman/8.4/en/replication-gtids-concepts.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Hai data paths: read view và locking access
InnoDB consistent nonlocking read dùng MVCC read view để chọn version. Locking read (`FOR UPDATE`/`FOR SHARE`) và DML cần lock current index records/ranges phù hợp. Trộn hai model trong một transaction mà không hiểu snapshot có thể tạo kết quả "SELECT thường không thấy nhưng locking SELECT thấy" tùy isolation/timing.

Default isolation của MySQL 8.4 là `REPEATABLE READ`, nhưng application/framework/managed service có thể override. Không suy contract từ tên: đọc đúng InnoDB behavior, statement type và binlog/replication needs.

## READ COMMITTED và REPEATABLE READ
Ở `READ COMMITTED`, mỗi consistent read thường tạo snapshot mới; non-repeatable read có thể xảy ra. InnoDB giảm một số gap locking cho search/index scan so với `REPEATABLE READ`, nhưng locks phục vụ FK/duplicate checks vẫn tồn tại.

Ở `REPEATABLE READ`, consistent reads trong transaction chia snapshot (sau khi thiết lập) và InnoDB dùng next-key locking cho locking/DML ranges để ngăn phantom theo behavior documented. Snapshot read không tự khóa predicate; check-then-insert cần unique constraint/locking/atomic statement phù hợp.

`SERIALIZABLE` tăng locking cho plain SELECT trong conditions nhất định và giảm concurrency. Nó không miễn retry deadlock; transaction vẫn phải ngắn.

## Record, gap và next-key locks
Record lock khóa index record. Gap lock khóa khoảng trống giữa index records hoặc trước/sau range; nó chủ yếu ngăn insert vào gap, và có semantics khác row mutex trực giác. Next-key lock kết hợp record + gap trước record.

Lock gắn với index access path. Query thiếu index phù hợp có thể scan/lock phạm vi lớn hơn dự kiến. Một predicate trông hẹp trong SQL nhưng optimizer scan nhiều index entries thì contention vẫn cao.

```sql title="Range locking phụ thuộc index"
SELECT id
FROM reservations
WHERE resource_id = ?
  AND start_at < ?
  AND end_at > ?
FOR UPDATE;
```

Nếu business invariant là "không overlap", locking hiện hữu rows có thể không khóa sự vắng mặt theo cách kỳ vọng khi không có covering coordination/index strategy. Có thể dùng per-resource coordination row, serializable/constraint model hoặc redesign slot representation. Race test với hai sessions là bắt buộc.

## Deadlock và lock wait khác nhau
Deadlock là cycle và InnoDB chọn victim rollback. Lock wait là một transaction chờ holder, có thể timeout nhưng không phải cycle. Retry toàn transaction cho deadlock/transient conflict với backoff/jitter; timeout do query path tệ không nên retry storm.

Điều tra bằng deadlock report/Performance Schema, transaction statements, index used và lock order. Sắp xếp resource IDs ổn định, index hẹp đúng predicate, giảm batch và không gọi remote API khi giữ lock.

Metadata locks cũng gây surprise: một transaction quên commit sau SELECT có thể giữ metadata dependency, khiến ALTER đợi; request sau xếp hàng sau DDL và outage lan rộng. Deployment cần query lock queue và fail-fast timeout/runbook.

## Undo, purge và transaction dài
InnoDB undo records hỗ trợ rollback và MVCC version reconstruction. Long-running read view làm purge không thể loại old versions, history list/buffer pressure tăng. Batch update/delete lớn vừa tạo undo/redo/binlog vừa rollback lâu nếu fail.

Chia job thành transaction có checkpoint, nhưng mỗi chunk phải idempotent và không phá invariant toàn cục. Monitor transaction age, undo/history, disk và replication impact, không chỉ query latency.

## Binlog và replication pipeline
Source ghi transactions vào binary log; replica I/O/receiver lấy events, relay/applier áp dụng theo configuration. Replication mặc định asynchronous: source commit không đợi replica nhận/apply, nên failover có thể chọn replica thiếu committed transactions.

Replica lag có nhiều dạng: network receive lag, apply lag do single hot dependency/large transaction, SQL error hoặc storage capacity. Một số "seconds behind" metric không đủ cho all topologies; theo GTID executed/retrieved sets, applier queues/errors và business freshness.

## GTID là identity, không là zero-loss guarantee
GTID định danh transaction duy nhất trong topology, giúp auto-position/failover biết transaction nào đã thực thi. Nó không làm async replica đồng bộ hơn và không tự chọn replica mới nhất. Orchestrator cần so executed sets, fencing old primary và bảo đảm topology không split-brain.

Promotion mà old primary vẫn nhận write tạo diverged histories. Network partition cần STONITH/fencing, writable endpoint control và operator discipline. DNS/load balancer đổi endpoint không tự ngăn old client session ghi vào primary cũ.

## Semisynchronous replication trade-off
Semisync yêu cầu source đợi một/số replica xác nhận đã nhận và log event theo contract, không nhất thiết đã apply transaction. Nó giảm cửa sổ committed data chỉ ở source nhưng chưa tới replica, đổi lại commit latency phụ thuộc network/replica và có timeout/fallback behavior cần cấu hình/monitor.

Semisync không thay backup, replica selection, fencing hay read-after-write. Nếu đọc từ replica ngay sau write, cần session stickiness, wait-for-position/GTID hoặc API consistency contract; nếu không, user thấy dữ liệu "biến mất" tạm thời.

## Durability knobs phải xét cùng nhau
InnoDB redo flush và binary-log sync policies ảnh hưởng crash durability/latency. Tối ưu từng knob độc lập có thể tạo trạng thái storage engine đã commit nhưng binlog chưa durable hoặc ngược lại, làm recovery/replication phức tạp. Dùng documented safe combinations theo RPO, hardware cache và managed-service guarantees; chaos-test power/process failure.

## Failure scenarios
- Query range thiếu index giữ next-key locks trên phạm vi lớn, insert khác bị chặn.
- Retry lock timeout vô hạn làm load tăng và deadlock thường hơn.
- Long transaction giữ undo versions, purge tụt và replica apply chậm.
- Promote replica lagging rồi old primary trở lại, hai bên cùng nhận write.
- GTID được quảng cáo như bảo đảm synchronous replication.
- Read replica dùng cho request vừa write nhưng không có consistency policy.
- Semisync timeout fallback không alert, hệ thống âm thầm trở async.
- DDL chờ metadata lock và tạo queue request sau nó.

:::production Concurrency và failover checklist
Pin isolation; test racing sessions; index locking predicates; timeout/short transactions; capture deadlocks; monitor undo/history và metadata locks; define RPO/RTO/read freshness; enable/verify GTID topology; track receive/apply lag; choose semisync knowingly; fence old primary; rehearse failover/failback and data reconciliation.
:::

## Góc phỏng vấn
"GTID có ngăn mất dữ liệu khi MySQL failover không?" — Không. GTID cho transaction identity và positioning, còn async replica có thể chưa nhận/apply commit. Zero-loss còn phụ thuộc durability, semisync/group replication contract, replica selection và fencing. Read consistency cũng cần policy riêng.

## Key Takeaways
- Consistent read và locking read đi qua semantics khác.
- InnoDB locks index records/ranges; access path quyết định contention footprint.
- Long transaction tạo undo/purge cost ngoài lock time.
- Async replication có committed-write loss/staleness window.
- GTID hỗ trợ topology; failover correctness vẫn cần selection, fencing và drill.
