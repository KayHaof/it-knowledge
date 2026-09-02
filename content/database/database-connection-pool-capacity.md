---
id: database-connection-pool-capacity
slug: database-connection-pool-capacity
title: Connection Pool và Capacity Budget cho Database
description: Xem connection pool như admission control có queue, lập ngân sách toàn deployment và chẩn đoán saturation, leak, timeout hay connection storm.
category: database
technology: JDBC and SQL Databases
level: senior
estimatedMinutes: 63
tags: ["database","connection-pool","capacity","jdbc","backpressure"]
prerequisites: ["database-slow-api-investigation"]
related: ["spring-production-actuator-resources","high-concurrency","overload-control-backpressure"]
next: sql-keyset-pagination
learningObjectives: ["Lập capacity budget cho pool trên toàn bộ replicas","Phân biệt pool saturation với database saturation","Thiết kế timeout, observability và recovery tránh connection storm"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Connections and Authentication","url":"https://www.postgresql.org/docs/current/runtime-config-connection.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL Resource Consumption","url":"https://www.postgresql.org/docs/current/runtime-config-resource.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Connection Management","url":"https://dev.mysql.com/doc/refman/8.4/en/connection-management.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Boot SQL Databases","url":"https://docs.spring.io/spring-boot/reference/data/sql.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: pool là cổng admission, không phải turbo

Connection pool tái sử dụng kết nối đắt tiền và giới hạn số transaction đồng thời đi vào database. Khi mọi connection bận, request xếp hàng tại pool. Pool lớn hơn có thể giảm acquire wait trong chốc lát nhưng đẩy thêm concurrency vào database, làm CPU scheduling, lock contention, memory và I/O queue xấu hơn. Vì thế “pool full” có thể là cơ chế bảo vệ đang hoạt động đúng.

~~~mermaid
flowchart LR
  R[Request concurrency] --> Q[Pool wait queue]
  Q --> P[Active connections]
  P --> D[Database workers và resources]
  D --> P
~~~

Mục tiêu không phải active connection luôn bằng maximum. Mục tiêu là throughput và latency SLO ổn định, queue bounded, database còn recovery headroom.

## Capacity budget phải tính toàn deployment

Nếu mỗi pod có pool tối đa C và có P pods, riêng application có thể mở tới P × C connections. Cộng batch jobs, migrations, BI, monitoring, replicas cũ khi rolling deploy và số connection dành cho admin/recovery:

~~~text
P_max × C_pool + C_jobs + C_tools + C_migration + C_headroom <= C_database_safe
~~~

C_database_safe không mặc nhiên bằng cấu hình max_connections. Engine cần memory/process/thread và file descriptors; workload trên mỗi connection khác nhau. PostgreSQL có giới hạn connection và một số slot/reservation phụ thuộc phiên bản; MySQL quản lý thread/connection theo cấu hình và implementation tương ứng. Hãy lấy giới hạn cùng thực trạng resource, không sao chép con số từ hệ thống khác.

Autoscaling nguy hiểm nếu chỉ scale theo HTTP CPU: pod mới mở pool mới trong lúc database đã nghẽn. Deployment surge cũng có thể tạm thời nhân đôi pods. Capacity review phải dùng maximum concurrent instances, không dùng replica count bình thường.

## Ước lượng bằng thời gian giữ connection

Theo Little’s Law ở trạng thái ổn định, số tác vụ đang dùng resource xấp xỉ throughput nhân thời gian giữ resource. Nếu endpoint đạt rate λ và giữ connection trung bình W, concurrency trung bình gần λW; tail và burst cần headroom nhưng không biện minh pool vô hạn.

Thời gian giữ connection bắt đầu khi acquire thành công và kết thúc khi trả pool, không chỉ thời gian SQL. Anti-pattern phổ biến:

- mở transaction rồi gọi remote API;
- serialize file hoặc chạy CPU-heavy work trong transaction;
- lazy loading kéo dài connection scope;
- batch xử lý quá lớn trước commit;
- quên close trên exception path;
- framework transaction boundary bao trùm cả controller.

Giảm hold time thường tăng capacity an toàn hơn tăng pool. Chia transaction theo business atomicity, không chia mù quáng làm mất consistency.

## Ba trạng thái cần phân biệt

**Pool thiếu so với database còn rảnh:** pending/acquire latency cao, active chạm cap, nhưng database CPU/I/O/locks thấp và mỗi query ổn. Có thể pool quá nhỏ hoặc connection bị giữ ngoài SQL.

**Database saturated:** active cao, query latency/waits tăng, throughput không tăng khi thêm connection. Tăng pool làm queue chuyển từ application vào database và tail tệ hơn.

**Connection leak hoặc stuck transaction:** active không trở về idle sau tải; acquisition timeout tăng dần; session lâu bất thường. Leak detection chỉ là tín hiệu, vì transaction hợp lệ lâu cũng bị gắn cờ. Cần trace owner và stack/transaction age.

Dashboard tối thiểu gồm active, idle, pending, max, acquire duration, usage/hold duration, creation rate, timeout count; database sessions theo state/wait, transaction age, CPU, I/O, locks; request rate, queue và timeout. Đọc chúng trên cùng timeline.

## Timeout là một ngân sách end-to-end

Timeout phải giảm dần theo deadline nghiệp vụ. Nếu gateway timeout trước nhưng query tiếp tục chạy, hệ thống làm công việc vô ích và giữ connection. Các lớp thường có:

- request deadline;
- pool acquisition timeout;
- connect/socket timeout;
- statement/query timeout;
- lock timeout;
- transaction/idle-in-transaction timeout;
- connection maximum lifetime và idle timeout.

Tên và semantics phụ thuộc driver, pool, engine và phiên bản. Không giả định cùng đơn vị hoặc cancellation chắc chắn. Query timeout có thể gửi cancel nhưng server vẫn cần cleanup. Maximum lifetime nên phối hợp load balancer, proxy và database; mọi connection cùng hết hạn có thể tạo reconnect herd. Jitter hoặc lifecycle tự nhiên tùy pool giúp tránh đồng bộ, nhưng phải xác minh implementation đang dùng.

Spring Boot chọn implementation pool dựa trên dependencies và cho phép cấu hình qua DataSource; property cụ thể thay đổi theo version. Kiểm tra effective configuration từ runtime, đừng tin file config chưa chắc được bind.

## Startup, failover và connection storm

Database restart/failover làm nhiều connections chết cùng lúc. Nếu mọi pod retry tight loop, authentication/TLS và session initialization có thể cản recovery. Dùng exponential backoff có jitter, giới hạn concurrent creates và readiness hợp lý. Readiness không nên báo healthy chỉ vì process sống, nhưng cũng không nên làm toàn fleet restart vì dependency tạm lỗi.

Pool phải validate connection hỏng mà không chạy validation query quá thường. DNS, proxy, TLS certificate và credential rotation đều có thể tạo symptom acquisition timeout; không quy tất cả về max pool.

## Prepared statements và session state

Pooling làm connection trở thành tài nguyên dùng chung. Session-level settings, temporary objects, advisory locks hoặc uncommitted transaction phải được reset trước khi trả pool. Nếu tenant/schema được set theo session mà không cleanup, request sau có thể sai isolation dữ liệu.

Prepared statement cache tồn tại ở driver/server/pool layer tùy stack. Nhân cache size với tổng connections để hiểu memory. Pool lớn có thể làm cache bị phân tán, mỗi connection cold hơn. Transaction pooling proxy còn thay đổi guarantee về session affinity; đây là quyết định kiến trúc, không chỉ một toggle.

## Quy trình sizing thực dụng

1. Đặt database safe budget và operational headroom.
2. Inventory mọi client và maximum deployment replicas.
3. Đo λ, hold-time distribution, query waits dưới representative concurrency.
4. Chọn per-instance cap sao cho tổng không vượt budget.
5. Giới hạn request/worker concurrency trước pool; queue bounded và fail fast có chủ đích.
6. Load test tăng dần, tìm điểm throughput ngừng tăng hoặc tail/DB waits tăng mạnh.
7. Canaries cho thay đổi pool; kiểm tra rolling surge và failover.

Một pool cho traffic tương tác và pool riêng cho batch có thể bảo vệ SLO, nhưng tổng budget vẫn dùng chung. Read/write pools tới primary/replica cần tính lag, routing và connection cap riêng.

## Failure scenarios

- Mỗi pod cấu hình 50 connections, autoscale 100 pods dù database chỉ chịu budget nhỏ hơn nhiều.
- Pool acquisition timeout được tăng liên tục, khiến request chết muộn hơn.
- Connection giữ qua remote call; downstream outage làm pool cạn.
- Rolling deploy mở hai thế hệ pool cùng lúc.
- Leak detector bị tắt vì “false alarm” mà không đo hold time.
- Database failover kéo theo retry không backoff và connection storm.
- Session tenant state không reset, gây data exposure.

:::production Checklist
Ghi effective pool config; tính budget theo max replicas và mọi client; alert pending/acquire/hold-time chứ không chỉ active; đặt bounded caller concurrency; kiểm tra long transactions/leaks; align deadline và cancellation; giữ admin headroom; retry create có backoff+jitter; test restart/failover và deployment surge; review lại khi traffic hoặc topology đổi.
:::

## Góc phỏng vấn

“Pool size nên bằng bao nhiêu?” — Không có con số phổ quát. Câu trả lời senior nêu database safe budget, tổng pods, workload hold time, concurrency limit và thực nghiệm throughput/tail latency. Pool là admission control; nếu database saturated, tăng pool làm contention nặng hơn. Cần phân biệt acquire wait, execute wait và leak.

## Key Takeaways

- Pool giới hạn concurrency và đặt queue trước database.
- Budget là tổng của toàn fleet, jobs, tools, surge và headroom.
- Hold time gồm mọi việc khi connection đang bị giữ.
- Timeout phải phù hợp deadline và cancellation semantics thực tế.
- Sizing đúng đến từ measurement, load test và failure test.

