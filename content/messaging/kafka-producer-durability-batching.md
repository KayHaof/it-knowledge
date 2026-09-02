---
id: kafka-producer-durability-batching
slug: kafka-producer-durability-batching-backpressure
title: Kafka Producer Durability, Batching và Backpressure
description: Tune acks, idempotence, delivery timeout, batch, linger, compression và buffer theo SLO; phân biệt broker ack với business publish success.
category: messaging
technology: Apache Kafka
level: advanced
estimatedMinutes: 65
tags: ["kafka","producer","acks","batching","compression","backpressure"]
prerequisites: ["kafka-broker-storage-replication"]
related: ["kafka-transactions-outbox","kafka-consumer-lag-rebalance-operations"]
next: kafka-consumer-lag-rebalance-operations
learningObjectives: ["Ghép acks/idempotence/retry với topic durability","Tune batch, linger và compression theo workload","Thiết kế async error handling, buffer pressure và publish observability"]
lastReviewed: 2026-09-02
sources: [{"title":"Apache Kafka Producer Configs","url":"https://kafka.apache.org/43/configuration/producer-configs/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Producer API","url":"https://kafka.apache.org/43/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Design","url":"https://kafka.apache.org/43/design/design/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## `send()` thường là enqueue, không phải commit business
Kafka producer gom records theo partition vào buffers/batches và gửi bất đồng bộ. `send()` có thể trả future trước broker acknowledgement; exception trong callback/future mới cho biết delivery result. Nếu code bỏ qua future/callback và request trả success ngay, ứng dụng đang chọn "best effort" dù config broker rất durable.

Record có thể fail trước network do serialization, kích thước, metadata timeout hoặc buffer exhaustion; có thể fail sau send do authorization, unknown topic, timeout hay broker error. Error taxonomy quyết định retry/reject/outbox, không được catch rồi log chung.

```text title="Publish lifecycle"
application record
  -> serializer/partitioner
  -> per-partition accumulator batch
  -> network request to leader
  -> broker append + replication criteria
  -> response
  -> callback/future completion
```

## Acknowledgement là một nửa durability contract
`acks=0` không chờ broker; `acks=1` chờ partition leader; `acks=all` chờ tất cả current ISR theo broker/topic contract. `acks=all` phải đi cùng replication factor và `min.insync.replicas`; nếu min ISR thấp khi ISR co, acknowledgement vẫn có ít copies hơn người dùng tưởng.

Producer không tự biết disk/rack/failure placement đúng. Topic governance phải kiểm tra replication/min ISR/unclean election và broker health. Một client config "an toàn" không bù topic config yếu.

## Idempotence và ordering khi retry
Idempotent producer dùng producer identity/sequence để broker deduplicate protocol retries trong session/scope hỗ trợ. Kafka 4.3 producer config hiện bật idempotence mặc định nếu không có conflicting settings; không copy giả định từ client version khác. Yêu cầu liên quan acks, retries và max in-flight được client validation quản lý.

Khi idempotence tắt, multiple in-flight batches và retry có thể reorder: batch 1 fail, batch 2 thành công, batch 1 retry tới sau. Giảm max-in-flight giữ order nhưng giảm throughput; idempotence cho phép ordering với giới hạn documented. Nó vẫn không loại duplicate khi application gọi `send()` hai lần cho cùng event.

Business event cần `eventId`, outbox/inbox/idempotent consumer nếu caller/timeouts có thể tạo logical resend.

## Delivery timeout là end-to-end producer deadline
`delivery.timeout.ms` giới hạn thời gian report success/failure sau khi `send` trả về, bao gồm delay batching, request và retries theo config relationship. `request.timeout.ms` là timeout request-level; `linger.ms` là batching delay upper bound. Đặt các knobs mâu thuẫn có thể khiến record timeout trước retry hữu ích.

Application request deadline có thể ngắn hơn producer delivery. Nếu HTTP client timeout nhưng producer gửi thành công sau đó, caller retry tạo duplicate business command. Chọn synchronous wait trong request, durable local/outbox acceptance, hay async job API; contract phải explicit.

## Batching theo partition
Producer accumulates batch riêng theo topic-partition. `batch.size` là target maximum-ish allocation/batch behavior; batch có thể gửi sớm khi đầy hoặc sender ready. `linger.ms` cho thêm thời gian để records gần nhau vào cùng batch, giảm requests và tăng compression; dưới load cao batching xảy ra ngay cả linger nhỏ.

Tăng linger không đảm bảo batch lớn nếu key distribution trải trên quá nhiều partitions hoặc traffic thấp mỗi partition. Một topic 500 partitions với producer 1000 records/s có average 2 records/s/partition; accumulator phân mảnh và memory overhead tăng.

Đo `batch-size-avg/max`, `records-per-request`, request rate, record queue time và throughput. Không tune bằng tổng topic rate mà bỏ partition distribution.

## Compression là CPU/network/storage trade-off
Compression áp trên batches; batch lớn và payload lặp thường cho ratio tốt. gzip, snappy, lz4, zstd có trade-offs; broker giữ batch compressed trong log/transfer trong nhiều paths nhưng validation/processing vẫn có cost. Producer CPU có thể là bottleneck trước broker network.

Đo compression ratio, producer CPU, broker CPU, bytes in/out, end-to-end latency và consumer decompression. Payload đã compressed/encrypted hoặc rất nhỏ có thể không lợi. Standardize codec support trên mọi consumer trước rollout.

## Buffer memory và backpressure
Khi broker chậm/metadata unavailable hoặc produce rate vượt drain, accumulator dùng hết `buffer.memory`; `send()` có thể block tới `max.block.ms` rồi fail. Đây là backpressure signal, không nên giải bằng buffer vô hạn. Buffer lớn chỉ trì hoãn failure, tăng heap/GC và số record có outcome chưa rõ khi process crash.

Ứng dụng cần bounded concurrency/queue, admission control và policy khi Kafka unavailable. Nếu event không được mất, transactional outbox cho request commit vào database rồi relay sau; giữ request threads block hàng chục giây trên producer thường gây cascade.

## Partitioner, key và hot partition
Key quyết định partition/order. Null keys thường được phân phối để batch hiệu quả theo default behavior; exact algorithm/version có thể thay. Business key có low cardinality/skew tạo hot partition và small batches ở others.

Custom partitioner trở thành compatibility contract. Thay partition count hoặc algorithm có thể gửi cùng key sang partition khác so với historical records, phá perceived ordering trong transition. Nếu cần strict aggregate order, quản lý partition evolution hoặc topic migration.

## Record size và fragmentation
Producer `max.request.size`, broker/topic max message bytes và consumer fetch limits phải tương thích. Một large record có thể vượt batch.size nhưng vẫn được gửi theo behavior, dùng nhiều memory/network và chặn partition. Không tăng mọi limit mù; chuyển blob sang object storage và publish reference/checksum thường tốt hơn, nhưng thêm atomicity, lifecycle và access-control problem.

## Flush và close
`flush()` chờ records đã gửi trước đó hoàn tất; gọi mỗi message phá batching/throughput. Graceful `close(Duration)` cố drain trong deadline; shutdown hook có giới hạn. Process kill vẫn có buffered records chưa publish, vì producer buffer không phải durable queue.

Fire-and-forget service muốn loss thấp phải dùng outbox/durable input, không dựa graceful shutdown luôn chạy. Callback không nên làm blocking work trên I/O thread; chuyển minimal result sang bounded executor/state.

## Metrics và failure signals
- send/error/retry rate, record queue time và max age;
- request latency/throttle/timeouts;
- buffer available/wait time, batch size và records/request;
- compression ratio, bytes/records rate theo topic;
- metadata age/errors và connection count;
- callback failures phân theo retriable/fatal/auth/serialization;
- broker ISR/under-replication cùng producer metrics.

Correlation eventId/topic/partition/offset hữu ích, nhưng sampling logging để tránh throughput/PII leak. Offset acknowledgement không chứng minh downstream xử lý.

## Failure scenarios
- Gọi `send()` rồi trả HTTP 200, không observe future.
- `acks=all` nhưng topic min ISR=1 và ISR đã co.
- Tăng buffer/timeout làm request threads và heap chết chậm hơn.
- `flush()` sau mỗi event loại bỏ batching.
- Key skew làm một partition nóng dù total broker capacity dư.
- Caller timeout/retry trong khi send đầu cuối cùng thành công, tạo duplicate.
- Custom partitioner đổi khi deploy rolling, cùng key reorder giữa versions.
- Large message limits không đồng bộ producer/broker/consumer.

:::production Producer checklist
Pin client/version defaults; define publish success; observe callback; align RF/min ISR/acks/idempotence; set delivery/request/application deadlines; bound queues; tune batch/linger/compression bằng per-partition metrics; threat-model key skew; validate message limits; use outbox for durable dual-write; chaos test broker throttle, metadata outage và ambiguous timeout.
:::

## Góc phỏng vấn
"Tăng `linger.ms` có luôn tăng latency không?" — Nó đặt upper bound chờ batch khi chưa đầy, nhưng batching hiệu quả có thể giảm request overhead nên dưới load latency có thể tương đương/thấp hơn. Kết quả phụ thuộc per-partition arrival, batch size, compression và SLO; phải đo queue time và p99.

## Key Takeaways
- `send()` enqueue không đồng nghĩa broker đã acknowledge.
- Acks phải đánh giá cùng ISR/min ISR và topic placement.
- Idempotence xử lý protocol retry, không business duplicate.
- Batch hình thành theo partition; distribution quyết định hiệu quả.
- Buffer pressure phải tạo backpressure, không queue vô hạn.
