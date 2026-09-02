---
id: kafka-kraft-partitions-ordering
slug: kafka-kraft-partitions-ordering
title: Kafka KRaft, Partitions và Ordering
description: Hiểu metadata quorum KRaft, partition leaders, key routing và giới hạn ordering để thiết kế topology và xử lý sự cố Kafka hiện đại.
category: messaging
technology: Apache Kafka
level: advanced
estimatedMinutes: 64
tags: ["kafka","kraft","partition","ordering","metadata-quorum"]
prerequisites: ["kafka-broker-storage-replication"]
related: ["kafka-delivery","kafka-producer-durability-batching","kafka-capacity-retention-operations"]
next: kafka-capacity-retention-operations
learningObjectives: ["Phân biệt KRaft metadata plane với partition data plane","Thiết kế partition key theo ordering và skew","Vận hành tăng partition, quorum và reassignment có kiểm soát"]
lastReviewed: 2026-09-02
sources: [{"title":"Apache Kafka KRaft","url":"https://kafka.apache.org/43/operations/kraft/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Design","url":"https://kafka.apache.org/43/design/design/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Basic Operations","url":"https://kafka.apache.org/43/operations/basic-kafka-operations/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Producer Configs","url":"https://kafka.apache.org/43/configuration/producer-configs/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Hai planes: metadata và records

Kafka hiện đại dùng KRaft để quản lý cluster metadata bằng một controller quorum. Brokers phục vụ produce/fetch và lưu partition logs; controllers quyết định metadata như topics, partitions, replicas, leaders và configs. Metadata plane hỏng không đồng nghĩa bytes trong partition biến mất, nhưng cluster có thể không thực hiện được metadata changes hoặc leader elections cần thiết.

~~~mermaid
flowchart TB
  subgraph Metadata plane
    C1[Active controller]
    C2[Controller follower]
    C3[Controller follower]
    C1 <--> C2
    C1 <--> C3
  end
  subgraph Data plane
    B1[Broker: leader P0]
    B2[Broker: follower P0]
    B3[Broker: other partitions]
  end
  C1 --> B1
  C1 --> B2
  C1 --> B3
~~~

Bài này đối chiếu Apache Kafka 4.3. KRaft configuration, dynamic quorum commands và defaults là version-dependent; kiểm tra documentation đúng minor version trước vận hành.

## KRaft metadata quorum

Mỗi Kafka server có process role controller, broker hoặc cả hai. Tài liệu KRaft khuyến nghị tách roles ở deployment quan trọng; combined mode tiện cho development nhưng controller không được cô lập khỏi broker load và khó scale/roll riêng.

Controllers giữ replicated metadata log. Một controller active xử lý thay đổi, các controllers khác là hot standbys; quorum cần majority để duy trì availability. Số controllers phải xuất phát từ failure tolerance và failure domains, thường là odd quorum. N controllers chịu đồng thời F failures khi N ít nhất 2F+1 và failures thật sự độc lập.

Kafka 4.1 thêm dynamic controller quorum; Kafka 4.3 dùng kraft.version để phân biệt capability và có controller.quorum.bootstrap.servers. Static quorum cũ dùng controller.quorum.voters. Không copy config giữa versions. Thay membership dynamic phải đợi controller mới catch up trước khi add và remove member bằng tool trước khi tắt theo runbook chính thức.

Cluster ID và storage formatting là safety boundary. KRaft không tự format blank log directory vì làm vậy có thể che mất data directory. Automation phải bảo vệ cluster ID, node/directory identity và metadata.log.dir; tuyệt đối không format để “sửa startup” khi chưa xác định disk/mount.

Theo dõi metadata quorum leader, high watermark, follower lag/time và current voters bằng kafka-metadata-quorum tool. Mất majority là control-plane incident; thêm brokers không chữa được.

## Partition là đơn vị log và parallelism

Mỗi topic có một hoặc nhiều partitions. Mỗi partition là ordered log có một leader phục vụ reads/writes theo protocol và replicas theo replication assignment. Offset chỉ có nghĩa trong partition, không phải số thứ tự toàn topic.

Partition đồng thời đặt các giới hạn:

- unit của leader placement và replication;
- unit consumer group phân công;
- trần active consumers hữu ích trong một group cho topic;
- phạm vi ordering tự nhiên;
- đơn vị retention.bytes và nhiều operational metrics.

Nhiều partitions tăng parallelism tiềm năng nhưng thêm metadata, replica traffic, files, recovery/reassignment work và consumer coordination. Không có “số partitions chuẩn”; phải capacity test với record size, key skew, consumer cost, broker topology và growth horizon.

## Ordering chỉ được đảm bảo trong một partition

Kafka duy trì order các records theo offset trong cùng partition. Không có total order xuyên partitions. Producer key thường quyết định partition bằng partitioner; cùng aggregate key được route ổn định tới cùng partition khi partition set và algorithm không đổi.

Ví dụ events của một order:

~~~text
key=order-8742: OrderCreated -> PaymentAuthorized -> OrderShipped
~~~

Nếu đều vào P3, consumer đọc P3 theo offset order. Nhưng application vẫn phải xét:

- hai producers gửi cùng key đồng thời không có business causal coordinator;
- retry với idempotence tắt và nhiều in-flight requests có thể reorder batches theo producer config;
- consumer xử lý song song records cùng partition có thể hoàn tất ngược thứ tự;
- retry topic/DLQ tách record khỏi original order;
- transaction nhiều partitions không tạo một global total order.

Enable idempotence và compatible acks/retry/in-flight settings giúp producer retry không tạo/reorder theo guarantee của client version, nhưng không giải cross-producer causality. Nếu event phải theo state version, đưa aggregate version vào payload và consumer từ chối/gác version ngoài dự kiến.

## Chọn key: locality đối đầu skew

Key theo aggregate như orderId cho per-order order và state locality. Key quá thô như tenantId có thể dồn tenant lớn vào một partition. Key ngẫu nhiên phân bố tốt nhưng mất per-aggregate ordering nếu cùng aggregate không giữ key.

Audit key bằng distribution per partition: records/sec, bytes/sec, storage, request latency và consumer lag. Average topic che hot partition. Một celebrity/large tenant có thể vượt capacity của một leader; thêm partitions không tự split một key.

Khi một key hot, lựa chọn gồm:

- giảm/aggregate events tại producer nếu business cho phép;
- tách loại workload thành topics;
- salt key và chấp nhận/reconstruct ordering ở downstream;
- route tenant lớn vào dedicated topology;
- redesign aggregate boundary.

Mỗi lựa chọn đổi correctness, không chỉ performance.

## Tăng partition là thay đổi data contract

Apache Kafka cho tăng partition count nhưng không giảm trực tiếp. Với keyed data, thêm partitions có thể thay mapping key-to-partition của partitioner; records mới của cùng key có thể sang partition khác trong khi history còn ở partition cũ. Khi consumers xử lý hai partitions song song, per-key order xuyên thời điểm mở rộng bị phá.

Không tăng partitions trong incident chỉ vì lag mà chưa biết bottleneck. Nếu sink database saturated, thêm consumers/partitions tăng contention. Nếu quyết định tăng:

1. inventory producers/partitioners và explicit partition usage;
2. xác định ordering state và migration boundary;
3. capacity metadata, brokers, consumers;
4. canary topic/producer;
5. roll clients có versioned routing nếu cần;
6. monitor skew, ISR, lag và business sequence;
7. giữ reconciliation plan.

Một chiến lược là tạo topic version mới với partition count/key scheme mới, dual-publish qua controlled migration/outbox và cut over groups theo checkpoint. Nó phức tạp nhưng rõ boundary hơn thay đổi tại chỗ khi ordering critical.

## Leader, ISR và ordering khi failure

Follower replicas fetch leader log. Khi leader lỗi, eligible in-sync replica có thể được bầu theo configuration. High watermark/acknowledgement quyết định records nào được xem committed/visible theo client semantics. Unclean leader election có thể ưu tiên availability nhưng có nguy cơ data loss; default và behavior KRaft là version/config-dependent.

Producer nhận leader/epoch errors phải refresh metadata và retry theo delivery deadline. Consumer offset không đổi ý nghĩa, nhưng leader failover có thể tăng latency. Không tự reset offsets vì “partition leader changed”.

Phân biệt:

- metadata quorum lag/mất leader: controller plane;
- partition không leader/under-replicated: data placement/replication;
- producer metadata stale: client reachability/config;
- một partition lag: skew hoặc leader/broker/sink;
- toàn topic lag: capacity/downstream/rebalance.

## Operations checklist

Controller listener và broker listener có security/network role riêng; kiểm tra ACL/TLS và bootstrap endpoints đúng plane. Tách controller failure domain khỏi broker-heavy disks/CPU. Alert metadata quorum health, offline partitions, under-replicated partitions, ISR shrink/expand, leader imbalance, request/error latency và disk.

Reassignment di chuyển replica bytes và bắt follower catch up; throttle/canary theo foreground SLO. Đừng di chuyển nhiều hot partitions đồng thời. Sau operation, verify assignment, leaders, ISR và traffic distribution, không chỉ tool exit code.

## Failure scenarios

- Chạy combined broker/controller cho critical cluster rồi broker disk pressure làm control plane bất ổn.
- Format metadata directory vì node không start, vô tình che mount/data loss.
- Mất majority controllers nhưng chỉ scale brokers.
- Tin cùng key luôn giữ partition sau khi tăng partition count.
- Tăng partitions để chữa hot key đơn lẻ.
- Consumers xử lý song song cùng partition rồi commit offset cao trước offset thấp.
- Bật unclean leader election mà không chấp nhận data-loss trade-off.
- Nói Kafka bảo đảm total ordering cho topic.

:::production Runbook
Ghi Kafka/KRaft feature version; kiểm tra quorum leader/voters/lag; phân biệt metadata với partition incident; bảo vệ cluster ID và directories; đo key/partition skew; lập partition count theo parallelism lẫn overhead; trước khi tăng partitions kiểm tra partitioners và ordering migration; reassignment có throttle; verify leaders/ISR/lag/business sequence; diễn tập controller minority/majority loss và broker failover.
:::

## Góc phỏng vấn

“KRaft liên quan gì tới ordering?” — KRaft quản lý metadata/elections, còn records được ordered bằng offsets trong từng partition. Key routing quyết định records nào cùng order domain. Câu trả lời advanced cần nói controller quorum majority, leader/replica, không có global order, consumer processing có thể reorder, và thêm partitions có thể đổi key mapping.

## Key Takeaways

- KRaft controllers sở hữu metadata plane; brokers sở hữu data plane.
- Quorum availability cần majority và independent failure domains.
- Ordering của Kafka là per partition, không phải per topic.
- Key mang cả business locality lẫn hotspot risk.
- Partition-count change là contract/migration decision, không chỉ capacity toggle.

