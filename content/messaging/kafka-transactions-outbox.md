---
id: kafka-transactions-outbox
slug: kafka-idempotent-producer-transactions-outbox
title: Kafka Idempotence, Transactions và Outbox Integration
description: Phân định chính xác idempotent producer, Kafka transaction, consume-transform-produce và database outbox cho end-to-end correctness.
category: messaging
technology: Apache Kafka / Debezium
level: senior
estimatedMinutes: 62
tags: ["kafka","idempotence","transaction","outbox","exactly-once"]
prerequisites: ["kafka-delivery","transactions-mvcc-deadlocks"]
related: ["transactional-outbox","kafka-schema-dlq-replay"]
next: transactional-outbox
learningObjectives: ["Giải thích scope của producer idempotence và Kafka transaction","Chọn outbox thay cho database-Kafka dual write","Thiết kế consumer side effect idempotent và recoverable"]
lastReviewed: 2026-09-02
sources: [{"title":"Apache Kafka Producer Configs","url":"https://kafka.apache.org/43/configuration/producer-configs/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka Design - Transactions","url":"https://kafka.apache.org/43/design/design/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Debezium Outbox Event Router","url":"https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html","organization":"Debezium","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Bắt đầu bằng failure window, không bằng nhãn exactly-once
Nếu service commit order vào database rồi publish Kafka, crash giữa hai bước làm order tồn tại nhưng event mất. Nếu publish trước rồi database rollback, consumer thấy event về order không tồn tại. Retry có thể tạo duplicate vì client không biết request trước đã được broker nhận.

Không có một flag Kafka tự động biến database, REST, email và payment thành một transaction toàn cục. Thiết kế phải đặt atomic boundary ở đâu và cách recovery/reconciliation ngoài boundary.

## Idempotent producer giải quyết retry trong producer session
Producer idempotence dùng producer identity, partition và sequence để broker loại retry duplicate thuộc protocol/session phù hợp. Các config durability/retry/order phải tương thích; client version hiện đại có default và validation riêng, nên đọc đúng version thay vì copy config cũ.

Nó không deduplicate hai lần application gọi `send()` cho cùng business event, không bao phủ producer instance/session tùy ý và không ngăn consumer side effect lặp. `eventId`/business idempotency vẫn cần ở application boundary.

## Kafka transaction gom nhiều partition và offsets
Transactional producer với `transactional.id` có thể atomically commit/abort record trên nhiều Kafka partitions. Trong consume-transform-produce, offsets của input group có thể được commit cùng output records trong Kafka transaction. Consumer downstream dùng `read_committed` để không thấy aborted transactional records.

```text title="Kafka-only atomic boundary"
read input records
beginTransaction
produce output A and B
sendOffsetsToTransaction
commitTransaction
```

Transaction coordinator và producer epochs/fencing giúp ngăn zombie producer cũ. `transactional.id` cần ổn định/duy nhất theo instance logical phù hợp; transaction quá dài va vào timeout và giữ resources. Abort records vẫn chiếm log cho tới retention/cleanup semantics.

:::warning Scope của exactly-once
Kafka transaction rất hữu ích cho Kafka-to-Kafka processing. Một HTTP call, email hoặc update database ngoài Kafka không tự tham gia transaction đó. Nếu consumer ghi external sink, sink cần transaction/idempotency riêng hoặc connector/framework có guarantee được chứng minh.
:::

## Transactional outbox đóng dual-write database → Kafka
Trong cùng local database transaction, service ghi business row và outbox row. Sau commit, relay/CDC publish outbox. Vì hai row commit atomically, event intent không mất ở cửa sổ giữa database và broker.

```sql title="Một local transaction"
BEGIN;
INSERT INTO orders(id, customer_id, status, total_minor)
VALUES (:id, :customer, 'CONFIRMED', :total);

INSERT INTO outbox_events(
  event_id, aggregate_type, aggregate_id,
  event_type, payload, occurred_at
) VALUES (
  :event_id, 'Order', :id,
  'OrderConfirmed', :payload, CURRENT_TIMESTAMP
);
COMMIT;
```

Relay polling thường claim batch, publish rồi mark sent; crash sau publish trước mark tạo duplicate. CDC như Debezium đọc transaction log và route outbox giảm polling/marking concern, nhưng connector can replay after failure. Outbox đạt at-least-once delivery thực dụng, không xóa nhu cầu idempotent consumer.

## Outbox schema và ordering
Outbox nên có immutable `event_id`, aggregate id/type, event type, payload/schema identity, occurred time và tracing metadata. Partition key thường là aggregate id để các event cùng aggregate giữ order trong một topic. Global order không được tạo ra.

Nếu nhiều database/shard cùng phát cho một aggregate, ordering cần owner/sequence rõ. Timestamp không đáng tin để giải quyết concurrent writes; version/sequence trong aggregate transaction mạnh hơn khi business cần phát hiện gap/out-of-order.

Retention cleanup chỉ xóa row sau checkpoint/delivery policy; xóa quá sớm mất khả năng repair, giữ quá lâu phình table/WAL. Partition/archive và index relay phải được vận hành như production table.

## Idempotent consumer bằng authoritative record
Consumer có thể ghi `processed_events(event_id PRIMARY KEY)` và business mutation trong cùng database transaction. Duplicate insert conflict cho biết event đã xử lý. Cần đảm bảo check và side effect chung atomic boundary.

```sql title="Inbox + effect trong một transaction"
BEGIN;
INSERT INTO processed_events(event_id, processed_at)
VALUES (:event_id, CURRENT_TIMESTAMP);

UPDATE customer_balances
SET reward_points = reward_points + :points
WHERE customer_id = :customer_id;
COMMIT;
```

Nếu insert duplicate, rollback/skip theo driver handling. Với external email/payment, truyền idempotency key cho provider nếu contract hỗ trợ hoặc quản lý state machine command/result. "Đã ghi processed trước rồi gọi API" có thể mất effect; "gọi API rồi ghi" có thể lặp effect.

## Saga và compensation
Outbox chuyển event đáng tin cậy, không tạo atomic transaction xuyên services. Workflow nhiều service vẫn có intermediate states, timeout và compensation. Compensation là business action (refund, release reservation), có thể fail/retry và không luôn đảo ngược hoàn hảo.

Choreography giảm coordinator nhưng flow ẩn trong nhiều consumer; orchestration làm state/timeout rõ hơn nhưng thêm component và coupling vào workflow definition. Chọn theo observability, số bước, ownership và change rate.

## Failure scenarios
- `enable.idempotence` được bật nhưng application tự gửi cùng event hai lần.
- Consumer không dùng `read_committed`, thấy aborted transactional records.
- Hai deployment dùng cùng `transactional.id` sai scope và fence nhau.
- Outbox relay publish lặp, consumer gửi email lặp.
- Outbox table không cleanup/index, làm OLTP chậm.
- Aggregate events dùng random key, reorder giữa partitions.
- Schema của payload thay đổi nhưng historical outbox/replay không đọc được.
- CDC connector lag nhưng chỉ monitor Kafka consumer lag.

## Production checklist
- Vẽ từng commit/ack/crash point và ambiguous outcome.
- Bật/config producer idempotence theo client docs; key event đúng.
- Nếu dùng Kafka transaction, đặt unique/stable transactional ID, timeout và `read_committed`.
- Database→Kafka: ghi outbox cùng business transaction.
- Consumer: inbox/unique constraint cùng side effect local.
- External API: idempotency contract hoặc durable state machine.
- Monitor outbox age/count, CDC/relay lag/error, duplicate rate, transaction abort/fencing.
- Có replay, reconciliation, retention và schema migration runbook.

## Góc phỏng vấn
"Outbox có exactly-once không?" — Outbox loại cửa sổ mất event của dual write bằng local DB transaction, nhưng relay/CDC có thể publish lại. End-to-end thường là at-least-once + idempotent consumer, kèm reconciliation. Kafka exactly-once có scope Kafka transaction, không bao phủ side effect tùy ý.

## Key Takeaways
- Mọi guarantee phải nêu rõ boundary và failure assumptions.
- Idempotent producer xử lý protocol retry, không phải business duplicate.
- Kafka transaction mạnh nhất cho consume-transform-produce trong Kafka.
- Outbox biến dual write thành durable intent và eventual publish.
- Consumer/external side effect vẫn cần idempotency và repair path.
