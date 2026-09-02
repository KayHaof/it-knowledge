---
id: database-engine-tradeoffs
slug: mysql-postgresql-oracle-tradeoffs
title: Chọn MySQL, PostgreSQL hay Oracle theo workload
description: So sánh ba relational engines theo capability, transaction behavior, operations, ecosystem và chi phí chuyển đổi thay vì chọn theo khẩu hiệu.
category: database
technology: MySQL / PostgreSQL / Oracle Database
level: senior
estimatedMinutes: 52
tags: ["mysql","postgresql","oracle","database-selection","tradeoffs"]
prerequisites: ["transactions-mvcc-deadlocks","composite-covering-index-explain"]
related: ["normalization-denormalization","performance-diagnosis"]
next: redis-data-structures-expiration
learningObjectives: ["Lập decision matrix database theo workload và tổ chức","Nhận diện khác biệt dialect, concurrency và operations","Thiết kế proof-of-concept cùng migration/exit plan"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Documentation","url":"https://www.postgresql.org/docs/current/index.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL 8.4 Reference Manual","url":"https://dev.mysql.com/doc/refman/8.4/en/","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Oracle Database Concepts","url":"https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Không có relational database tốt nhất cho mọi hệ thống
MySQL, PostgreSQL và Oracle đều cung cấp transaction, index, optimizer, replication/HA options và hệ sinh thái lâu năm. Quyết định thật nằm ở workload, feature bắt buộc, kỹ năng vận hành, support/SLA, licensing, cloud topology và switching cost.

Đừng so sánh bằng một benchmark không đại diện hoặc checklist feature yes/no. Cùng một feature name có semantics, giới hạn và operational behavior khác theo edition, version, storage engine và deployment.

## Decision matrix cần được điền bằng evidence
| Trục | Câu hỏi cần trả lời |
|---|---|
| Correctness | isolation/locking có bảo vệ invariant thực tế không? |
| Query | OLTP, reporting, JSON, full text, geospatial, partitioning cần mức nào? |
| Scale/HA | topology, RPO/RTO, failover, replica lag và multi-region ra sao? |
| Operations | backup/restore đã test, online DDL, upgrade, observability thế nào? |
| Ecosystem | driver, ORM, migration tool, managed service và talent có sẵn không? |
| Economics | license/support/compute/storage/egress/people cost toàn vòng đời? |
| Portability | dùng extension/dialect nào, exit plan và data gravity ra sao? |

## PostgreSQL: extensibility và SQL capability
PostgreSQL thường hấp dẫn khi cần SQL phong phú, nhiều index type, JSONB, extensibility và cộng đồng open source. MVCC/version cleanup khiến vacuum, transaction dài và bloat là khía cạnh vận hành phải hiểu. Extension tạo sức mạnh nhưng cũng là dependency cần kiểm tra trên managed platform và upgrade path.

Không nên suy ra PostgreSQL luôn tối ưu hơn cho mọi query. Statistics, memory, connection model, storage và schema quyết định behavior; connection count lớn thường cần quản lý/pooling phù hợp.

## MySQL: ecosystem rộng, InnoDB là trung tâm
MySQL với InnoDB phổ biến cho OLTP và được nhiều cloud/vendor hỗ trợ. Cần hiểu clustered primary key, secondary index chứa primary key, default isolation/config của đúng version, next-key/gap locking và binary-log/replication choices. Primary key quá rộng làm mọi secondary index lớn hơn.

MySQL là tên server, còn behavior transactional trọng yếu thường gắn với storage engine. Đừng lấy giả định từ engine cũ hoặc version khác áp lên InnoDB hiện tại.

## Oracle: platform và operational capability cấp enterprise
Oracle Database có optimizer, partitioning, RAC/Data Guard và bộ công cụ enterprise phong phú tùy product/edition/license. Nó phù hợp khi tổ chức đã có workload, kỹ năng, support và yêu cầu vận hành tương ứng. Đổi lại, licensing, procurement, specialist skill và vendor-specific capability phải nằm trong decision record.

Không mặc định "enterprise" có nghĩa tự động HA. Kiến trúc, edition, cấu hình, failure testing và quy trình vận hành mới tạo RPO/RTO thực.

## Những khác biệt làm migration đau
- Auto-increment/sequence/identity và cách lấy generated key.
- Boolean, timestamp/timezone, string/collation và empty string semantics.
- Pagination, upsert, returning clause, JSON functions và procedural SQL.
- Lock/isolation behavior, DDL transactional semantics và online operation.
- Index type, partial/function index, partitioning và optimizer hint.
- Case folding của identifier và quoting.

ORM giảm boilerplate nhưng không xóa dialect. Native query, migration, generated SQL, batch behavior và locking vẫn phải test trên target engine.

## Proof-of-concept có sức thuyết phục
PoC nên dùng schema, cardinality, skew, concurrency và query mix đại diện; không chỉ import 10.000 row rồi chạy một SELECT. Đo:
- latency distribution và throughput dưới concurrency;
- lock wait/deadlock/abort;
- write amplification, WAL/redo/binlog và replica lag;
- backup duration, restore time và failover behavior;
- online schema change trên table lớn;
- cost vận hành trong growth horizon.

Không công bố con số chung nếu chưa ghi hardware, dataset, config, warmup và test harness. Kết quả PoC là evidence cho workload đó, không là chân lý toàn cầu.

## Failure scenarios
- Chọn engine vì đội khác dùng nhưng topology/SLO hoàn toàn khác.
- Phụ thuộc proprietary feature rồi đánh giá migration như đổi connection string.
- Chạy write trên primary và read tức thì từ async replica, vi phạm read-your-writes.
- Có backup nhưng chưa bao giờ restore; RTO chỉ tồn tại trên slide.
- Managed service giới hạn extension/config/privilege mà thiết kế phụ thuộc.
- Nâng major version không có plan regression cho query plan và driver.

:::production Checklist quyết định công nghệ
Ghi ADR với requirements và rejected options; pin version/edition; kiểm tra support lifecycle; chạy PoC workload; threat/compliance review; test backup-restore/failover/upgrade; lập capacity và cost model; định nghĩa portability boundary; đặt ngày review lại khi scale hoặc tổ chức thay đổi.
:::

## Góc phỏng vấn
Khi được hỏi "PostgreSQL hay MySQL?", câu trả lời mạnh bắt đầu bằng câu hỏi về workload và constraints. Sau đó nêu 2-3 khác biệt có liên quan, phương pháp PoC và chi phí vận hành/migration. Một danh sách feature không có context là câu trả lời yếu.

## Key Takeaways
- Chọn database là quyết định socio-technical, không chỉ benchmark engine.
- So sánh đúng version, edition, storage engine và deployment model.
- ORM không tạo portability tuyệt đối.
- HA phải được chứng minh qua failure/restore drill.
- Vendor-specific feature vừa tạo lợi thế vừa tăng switching cost.
