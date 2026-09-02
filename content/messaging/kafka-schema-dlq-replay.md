---
id: kafka-schema-dlq-replay
slug: kafka-schema-evolution-dlq-replay
title: Kafka Schema Evolution, DLQ và Replay
description: Quản lý event contract, compatibility, poison record, retry/DLQ và replay có audit mà không phá ordering hay lặp side effect.
category: messaging
technology: Apache Kafka
level: advanced
estimatedMinutes: 56
tags: ["kafka","schema-evolution","dlq","retry","replay"]
prerequisites: ["kafka-delivery"]
related: ["kafka-broker-storage-replication","kafka-transactions-outbox"]
next: kafka-transactions-outbox
learningObjectives: ["Thiết kế event envelope và compatibility policy","Phân loại transient với poison record","Xây replay workflow có idempotency, audit và rate control"]
lastReviewed: 2026-09-02
sources: [{"title":"Apache Kafka Consumer Configs","url":"https://kafka.apache.org/43/configuration/consumer-configs/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Basic Operations","url":"https://kafka.apache.org/43/operations/basic-kafka-operations/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Design - Delivery and Compaction","url":"https://kafka.apache.org/43/design/design/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Kafka lưu bytes; contract thuộc về đội phát sự kiện
Broker không tự hiểu `customerId`, currency hay required field. Producer serializer và consumer deserializer biến domain data thành bytes và ngược lại. Dù dùng JSON, Avro, Protobuf hay custom binary, cần owner, schema identity/version, compatibility rule, rollout process và test contract.

Event không phải bản dump tùy ý của entity ORM. Nó là public contract có lifecycle dài, có thể được consumer chưa biết tới đọc lại nhiều tháng sau.

## Envelope ổn định, payload theo domain
Một envelope thực dụng thường có:
- `eventId` duy nhất để trace/dedup;
- `eventType` và schema version/identifier;
- `occurredAt` theo UTC cùng semantics event time;
- aggregate/business key dùng partitioning;
- producer/service và correlation/causation IDs;
- payload business, tránh secret/PII không cần thiết.

```json title="Event envelope minh họa"
{
  "eventId": "01J...",
  "eventType": "OrderConfirmed",
  "schemaVersion": 3,
  "occurredAt": "2026-09-02T03:42:17Z",
  "aggregateId": "order-8421",
  "correlationId": "checkout-991",
  "payload": {
    "customerId": "customer-42",
    "currency": "VND",
    "totalMinor": 1250000
  }
}
```

Timestamp không thay thế offset/order. Clock giữa producer có thể lệch; ordering guarantee vẫn theo partition và append order.

## Compatibility là phép biến đổi hai phía
Backward compatibility thường hỏi consumer mới có đọc data cũ không; forward compatibility hỏi consumer cũ có chịu được data mới không. Tên gọi cụ thể trong registry/tool có thể khác theo perspective, nên policy phải có ví dụ producer/consumer rõ.

Thay đổi thường an toàn hơn khi thêm optional field với default/unknown handling. Rename/remove field, đổi type/meaning, đổi enum mà consumer exhaustive, hay tái sử dụng field cho semantics mới đều rủi ro.

Kỹ thuật rollout:
1. deploy consumer tolerant với cả old/new;
2. deploy producer phát new field/version;
3. quan sát toàn bộ consumer inventory;
4. chỉ retire old contract sau retention/replay horizon.

Dual-publish hai topic/version tăng migration control nhưng cần consistency, cost và sunset plan. Không để hai contract tồn tại vô hạn không owner.

## Phân loại lỗi trước retry
| Loại lỗi | Ví dụ | Xử lý |
|---|---|---|
| Transient | timeout dependency, rate limit | retry bounded với backoff/jitter |
| Poison data | schema invalid, enum lạ bắt buộc | quarantine/DLQ, alert owner |
| Business rejection | account closed, invariant fail | record outcome, không retry kỹ thuật vô hạn |
| Consumer bug | null pointer trên case hợp lệ | stop/rollback hoặc quarantine theo risk; fix rồi replay |
| Capacity | lag tăng, pool exhausted | backpressure/scale/load shedding, không nhân retry |

Retry ngay trên consumer thread giữ ordering nhưng poison record chặn partition. Retry topic cho backoff dài giải phóng partition chính nhưng thay đổi ordering giữa record cũ/mới. Nếu business yêu cầu per-key order tuyệt đối, phải thiết kế state machine hoặc block/quarantine key có chủ đích.

## DLQ không phải nghĩa địa
DLQ/quarantine record nên giữ original topic/partition/offset, key, timestamp, headers, schema identity, error class, stack/reference, consumer version và attempt count. Không ghi credential/PII thừa vào error header/log.

DLQ cần:
- metric/rate alert và owner trực;
- access control/retention tương xứng dữ liệu gốc;
- UI/tool điều tra có audit;
- policy sửa data hay sửa code;
- đường replay không bypass validation/idempotency;
- definition of done để DLQ không tăng mãi.

Một deserialization failure có thể xảy ra trước listener business; framework/consumer setup phải bắt raw bytes/metadata ở đúng layer, nếu không record sẽ lặp vô hạn.

## Offset, position và replay
Consumer position là record kế tiếp sẽ poll; committed offset là checkpoint group dùng sau restart/rebalance. Reset offset thay đổi vị trí xử lý của group, không xóa side effect đã tạo. Vì vậy replay phải giả định duplicate.

Cách replay an toàn hơn thường là một group/topic output riêng:
1. xác định phạm vi topic-partition-offset/time và lý do;
2. ước lượng volume/downstream capacity;
3. xác nhận code/schema version có thể đọc dữ liệu cũ;
4. đảm bảo idempotency hoặc sink tách biệt;
5. throttle, monitor và có kill switch;
6. đối soát count/business invariant;
7. lưu audit ai chạy, input nào, kết quả gì.

Reset production group tại chỗ dễ trộn traffic live/replay và làm khó rollback. Với rebuild projection có thể dùng group mới và swap read model sau reconciliation.

## Tombstone và data deletion
Trong compacted topic, value `null` với key thường là tombstone cho delete; cleanup có độ trễ và retention semantics. Đây không tự động đáp ứng toàn bộ privacy deletion: bản sao ở downstream, backup, DLQ, log và analytics vẫn cần lifecycle riêng.

## Failure scenarios
- Producer thêm enum mới, consumer cũ crash vì exhaustive switch.
- Retry topic mất original key/header, phá correlation và ordering.
- DLQ chứa raw PII lâu hơn retention chính.
- Replay dùng group cũ và gửi lại email/payment không idempotent.
- Offset reset nhầm `latest`, bỏ qua backlog chưa xử lý.
- Contract test chỉ kiểm tra syntax, không kiểm tra meaning/unit/timezone.
- Poison rate tăng nhưng không có alert vì "đã vào DLQ".

:::production Checklist event lifecycle
Đặt owner/schema policy; inventory consumer; compatibility test trong CI; version envelope; error taxonomy; bounded retry; DLQ metadata + alert + retention; idempotent side effects; replay runbook/throttle/audit/reconciliation; diễn tập với data cũ trước incident.
:::

## Góc phỏng vấn
"Có DLQ là xử lý poison message xong chưa?" — Chưa. DLQ chỉ tách record khỏi hot path. Cần owner, metadata, alert, retention/security, root-cause workflow, replay idempotent và reconciliation. Chuyển record mà không ai xử lý chỉ đổi vị trí mất dữ liệu.

## Key Takeaways
- Kafka không enforce domain schema; contract governance là bắt buộc.
- Compatibility phải mô tả producer/consumer và rollout order.
- Retry strategy luôn ảnh hưởng ordering, latency và load.
- DLQ cần operational lifecycle, không chỉ một topic.
- Replay là một production change có duplicate và capacity risk.
