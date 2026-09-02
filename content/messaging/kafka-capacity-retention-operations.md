---
id: kafka-capacity-retention-operations
slug: kafka-capacity-retention-operations
title: Kafka Capacity, Retention và Operations
description: Lập capacity model theo ingress, compression, replicas, retention và fan-out; vận hành disk, compaction, reassignment và lag trước khi hết headroom.
category: messaging
technology: Apache Kafka
level: senior
estimatedMinutes: 71
tags: ["kafka","capacity","retention","operations","log-compaction"]
prerequisites: ["kafka-broker-storage-replication","kafka-consumer-lag-rebalance-operations"]
related: ["kafka-schema-dlq-replay","kafka-kraft-partitions-ordering","load-testing-capacity-model"]
next: kafka-vs-rest-message-queue
learningObjectives: ["Lập capacity model disk/network/CPU theo workload","Giải thích retention và compaction ở cấp log segment","Xây runbook disk pressure, reassignment và lag an toàn"]
lastReviewed: 2026-09-02
sources: [{"title":"Apache Kafka Topic Configs","url":"https://kafka.apache.org/43/configuration/topic-configs/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Hardware and OS","url":"https://kafka.apache.org/43/operations/hardware-and-os/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Monitoring","url":"https://kafka.apache.org/43/operations/monitoring/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Basic Operations","url":"https://kafka.apache.org/43/operations/basic-kafka-operations/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Capacity là nhiều budgets liên kết

Kafka không chỉ cần “đủ disk”. Ingress đi qua producer network, broker CPU/compression/checksum, page cache và disk; replicas nhân traffic và storage; mỗi independent consumer group tạo egress; reassign/recovery cạnh tranh cùng resources. Partition count thêm metadata, files và coordination. Một capacity plan phải đồng thời giữ disk, network, CPU, memory/page cache, file handles và operational headroom.

~~~mermaid
flowchart LR
  P[Compressed producer ingress] --> L[Partition leaders]
  L --> R[Replica traffic]
  L --> D[Retained log segments]
  L --> C1[Consumer group A]
  L --> C2[Consumer group B]
  D --> X[Reassignment và recovery]
~~~

Bài dùng Apache Kafka 4.3 documentation. Defaults, tiered storage và metric/config names thay đổi theo version; luôn kiểm tra effective topic/broker config.

## Bắt đầu bằng workload inventory

Theo topic và partition, đo:

- records/sec và bytes/sec sau compression ở normal/peak;
- record/batch size distribution, không chỉ average;
- replication factor và minimum ISR policy;
- số consumer groups cùng read rate, lag/replay scenarios;
- retention/replay/RPO requirement;
- key/partition skew;
- compaction/delete policy;
- growth, burst duration và maintenance/recovery concurrency.

Compression xảy ra trên record batches và ratio phụ thuộc payload/batching. Không áp ratio từ benchmark khác; đo representative messages và producer config thật. Large records ảnh hưởng producer, broker, replica fetch và consumer memory limits đồng thời.

## Disk model có thể ước lượng, không được coi là cam kết

Ước lượng thô:

~~~text
logical retained bytes
  ≈ compressed_ingress_bytes_per_second
    × retention_seconds
    × replication_factor

required capacity
  = logical retained bytes
    + index/segment overhead
    + compaction/rewrite space
    + rebalance/recovery headroom
    + growth and skew margin
~~~

Phải phân bố theo broker/partition, vì cluster còn 40% free không giúp broker chứa hot leaders chỉ còn 2%. Filesystem reserved space, monitoring mismatch và deleted-but-open files cũng làm “free disk” khác nhau theo OS.

Retention.bytes được áp per partition, nên topic budget liên quan partition count. Retention.ms là thời gian policy cho delete cleanup, không phải exact per-record TTL. Cleanup làm việc theo segments; active segment phải roll và deletion chạy theo background checks. Thay retention lúc disk đầy không giải phóng bytes ngay lập tức.

## Segment geometry quyết định cleanup granularity

Kafka log chia thành segment files với offset/time indexes. segment.bytes và segment.ms ảnh hưởng lúc roll; retention và cleaning xử lý file/segment chứ không xóa giữa active segment tùy tiện. Segment lớn giảm số files nhưng cleanup kém granular; segment nhỏ tăng files/metadata/roll overhead.

Không tune segment chỉ để thấy disk giảm nhanh mà bỏ qua open files, index overhead và broker load. Chọn bằng retention precision cần thiết, throughput và operations test.

## Delete retention và log compaction là hai semantics

cleanup.policy=delete loại segments cũ khi time/size conditions đáp ứng. cleanup.policy=compact giữ lại ít nhất representation mới hơn cho mỗi key theo compaction semantics, nhưng compaction là background process và log vẫn có duplicates/older versions trước khi clean. Consumer không được giả định “mỗi key chỉ xuất hiện một lần”.

Có thể cấu hình delete,compact để kết hợp window và key compaction. Tombstone biểu diễn delete; delete.retention.ms đặt cửa sổ liên quan để consumers xây snapshot có thể thấy tombstone. Nếu consumer full-scan chậm hơn window, nó có thể bỏ lỡ delete marker và dựng state sai. Key null không có normal key-compaction semantics mong muốn.

Compacted topic vẫn cần capacity cho dirty log và cleaner rewrite. Monitor cleaner backlog/ratio và disk I/O theo metric availability của version. Đừng dùng compaction thay database backup: nó lưu logical latest log state theo key, không cung cấp mọi query/invariant.

## Network model và fan-out

Broker leader nhận producer bytes, gửi replica bytes và phục vụ consumer fetch. Hai consumer groups đọc toàn bộ topic tạo hai logical copies egress; replay group có thể đọc nhanh hơn realtime. Reassignment thêm source read + network + target write. Cross-zone/rack placement còn ảnh hưởng link/cost.

Ước lượng riêng ingress, replication, normal consumer egress, peak replay và recovery. Capacity cho “normal traffic” nhưng không có recovery headroom làm một broker failure kéo dài under-replication.

Quota/throttle bảo vệ cluster khỏi noisy producer, consumer replay và reassignment, nhưng có thể tăng lag. Alert throttle time cùng business freshness để không nhầm protection với network bug.

## CPU, memory và page cache

Kafka tận dụng filesystem/page cache; heap free không phản ánh total cache pressure. Compression codec/level, TLS, request rate, small batches và log cleaning tiêu CPU. High disk throughput nhưng page cache miss/readahead pattern xấu có thể tăng latency.

Hardware guidance là starting point, không sizing table. Load test trên filesystem/storage class thật với failure/recovery. Virtualized/cloud disks có throughput, IOPS, burst credit và latency constraints riêng.

## Partition count và balance

Partitions cho parallelism nhưng tạo replicas, logs/index files, leader work và controller metadata. Phân bố count đều chưa đủ; bytes/sec và storage per partition mới thể hiện load. Rack awareness/placement phải tránh replicas cùng failure domain.

Tăng partitions không thể hoàn tác bằng giảm trực tiếp; có thể đổi key mapping. Reassignment để balance là data movement, cần kế hoạch throttle, batch nhỏ, canary brokers và verify. Đừng chạy reassignment lớn cùng broker upgrade, compaction backlog và traffic peak.

## Observability theo user outcome

Theo dõi:

- bytes/records in/out và request latency/error/throttle;
- disk used/free, growth slope và time-to-full per broker;
- offline/under-replicated partitions, ISR shrink/expand;
- leader count và bytes/CPU skew;
- network saturation và replica fetch lag;
- consumer lag, oldest-event age và retention deadline;
- controller quorum/metadata health;
- log cleaner/segment deletion signals nếu áp dụng;
- JVM/OS CPU, GC, page cache, file descriptors.

Metric names/MBeans phụ thuộc release. Dashboard phải version-control mappings và test sau upgrade. Alert time-to-exhaustion hữu ích hơn ngưỡng phần trăm đơn lẻ khi growth nhanh.

## Disk-pressure runbook

1. Xác nhận broker/filesystem nào tăng, topic/partition nào đóng góp và tốc độ đầy.
2. Kiểm tra retention effective config, segment roll, compaction/cleaner và deleted-open files.
3. Hạn chế noncritical producers/replays hoặc áp quota theo authorization.
4. Tăng storage/brokers hoặc di chuyển replicas có capacity và network headroom.
5. Chỉ giảm retention khi business owner chấp nhận replay/data window mới.
6. Theo dõi deletion thực, ISR, reassignment và consumer retention deadline.
7. Reconcile sau recovery và sửa forecast.

Không xóa thủ công segment files trong log directory. Nó phá broker metadata/log consistency và replica recovery. Không bật unclean election để chữa disk mà chưa chấp nhận data-loss risk. Nếu retention giảm, consumers lag phía sau earliest retained offset có thể mất dữ liệu; chụp group offsets và cảnh báo owners trước.

## Change safety

Topic override có thể khác broker default. Inventory effective config trước và sau alter. Với config version-dependent như remote/tiered storage, kiểm tra compatibility, local retention, delete behavior, tooling và rollback. Tiered storage đổi disk model nhưng không xóa network/cache/metadata planning.

Capacity review trước product launch, new consumer group, schema payload tăng, replication-factor change, retention extension hoặc partition increase. Schema field “nhỏ” lặp hàng tỷ records có storage/network cost dài hạn.

## Failure scenarios

- Tính storage từ raw JSON nhưng bỏ qua compression đo thực tế hoặc ngược lại.
- Nhân retention nhưng quên replication factor và skew.
- Giảm retention.ms rồi chờ disk giảm tức thì.
- Nghĩ compacted topic chỉ còn một record mỗi key ở mọi thời điểm.
- Replay consumer bão hòa egress và làm replica lag.
- Reassign toàn cluster lúc peak, không giữ transient target space.
- Chỉ alert cluster average disk, bỏ broker hot sắp đầy.
- Xóa segment bằng filesystem để “cứu disk”.

:::production Checklist
Inventory per-topic rate/size/skew/groups; đo compression; model disk+network+CPU với replication; giữ recovery/reassignment/cleaner headroom; cấu hình retention theo replay SLA; hiểu segment granularity và tombstone window; dashboard per broker/partition; quota replay/noisy clients; rehearsal disk-full và broker loss; thay đổi config/reassignment theo canary; review model khi payload, groups, partitions hoặc version đổi.
:::

## Góc phỏng vấn

“Tính Kafka storage và retention thế nào?” — Bắt đầu từ compressed ingress rate × retention × replication, sau đó cộng segment/index, compaction/rewrite, skew và recovery headroom. Senior phải nói retention per segment/per partition, delete không tức thời, consumer lag so với earliest retained offset, fan-out network và reassignment transient cost.

## Key Takeaways

- Kafka capacity là disk, network, CPU, page cache, partitions và recovery cùng lúc.
- Retention là segment cleanup policy, không phải exact message TTL.
- Compaction giữ logical latest-by-key theo background semantics, không loại duplicate ngay.
- Cluster averages che broker/partition skew.
- Disk incident cần controlled throttling/movement, không xóa files thủ công.

