---
id: kafka-vs-rest-message-queue
slug: kafka-vs-rest-message-queue
title: Kafka vs REST vs Message Queue — Decision Guide
description: Chọn synchronous API, work queue hay durable event log theo response contract, temporal coupling, delivery, replay, ordering và operational ownership.
category: architecture
technology: Distributed Systems
level: senior
estimatedMinutes: 72
tags: ["architecture","kafka","rest","message-queue","decision-guide"]
prerequisites: ["microservices-boundaries"]
related: ["cqrs-event-driven","kafka-delivery","idempotency-retry-circuit-breaker"]
next: technology-decision-evidence
learningObjectives: ["Chọn communication style theo business contract thay vì xu hướng","So sánh failure, delivery, ordering và backpressure của ba lựa chọn","Thiết kế hybrid flow với source of truth, outbox và reconciliation"]
lastReviewed: 2026-09-02
sources: [{"title":"RFC 9110 HTTP Semantics","url":"https://www.rfc-editor.org/rfc/rfc9110.html","organization":"IETF","type":"standard","accessedAt":"2026-09-02"},{"title":"Apache Kafka Design","url":"https://kafka.apache.org/43/design/design/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"What is Amazon Simple Queue Service","url":"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html","organization":"Amazon Web Services","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"AWS Publish-Subscribe Pattern","url":"https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/publish-subscribe.html","organization":"Amazon Web Services","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"AWS Transactional Outbox Pattern","url":"https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html","organization":"Amazon Web Services","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Không phải ba sản phẩm thay thế trực tiếp

REST thường biểu diễn synchronous request/response qua HTTP resource semantics. Message queue phân phối units of work cho competing workers, thường message được acknowledge/xóa theo broker semantics. Kafka là durable partitioned event log: nhiều consumer groups có vị trí riêng, retention và replay. Một số sản phẩm hỗ trợ nhiều mode, nhưng mental model phải theo contract đang dùng.

~~~mermaid
flowchart TB
  U[Caller cần outcome] -->|request/response| API[REST API]
  API --> DB[(Source of truth)]
  DB --> O[Transactional outbox]
  O --> K[Kafka event log]
  K --> C1[Independent projection]
  K --> Q[Work queue/adaptor]
  Q --> W[Competing workers]
~~~

Câu hỏi đúng không phải “Kafka hay REST nhanh hơn?” mà là: ai cần trả lời cho ai, khi nào outcome được coi là accepted/completed, failure nằm ở đâu và ai vận hành backlog.

## REST: contract trực tiếp và temporal coupling

RFC 9110 định nghĩa HTTP là stateless application-level request/response protocol với method, status và representation semantics. REST/HTTP phù hợp khi caller cần kết quả tức thời để tiếp tục: kiểm tra giá, đọc profile, validate quyền, hoặc command phải biết accepted/rejected ngay.

Ưu điểm:

- flow dễ theo trace và status code;
- caller nhận response trực tiếp;
- resource/version/cache/auth semantics trưởng thành;
- phù hợp query và interactive latency.

Giá phải trả là temporal coupling: caller và callee phải reachable trong deadline. Timeout tạo ambiguity — request có thể đã commit nhưng response bị mất. Retry cần method/idempotency semantics; POST business command nên có idempotency key khi duplicate nguy hiểm. Circuit breaker, concurrency limit và deadline propagation ngăn dependency chậm kéo sập caller.

REST không bắt buộc “đồng bộ business completion”. API có thể trả 202 Accepted và operation resource để poll; nhưng nếu mọi call trở thành 202 mà không có durable work state, status ownership và cancellation, đó chỉ là che queue trong memory.

## Message queue: load leveling và work ownership

Queue phù hợp khi một work item cần một worker trong pool xử lý, producer không cần kết quả ngay và burst cần buffer tạm. Examples: resize image, gửi email, generate report. Worker acknowledge sau completion; visibility/lease/redelivery/DLQ semantics phụ thuộc broker.

Queue decouple thời gian nhưng không xóa capacity constraint. Nếu arrival rate lâu dài cao hơn service rate, backlog tăng tới retention/quota/disk limit. Cần oldest-message age, queue depth, drain rate, poison policy và consumer autoscaling có downstream cap.

Delivery thường có duplicate window quanh side effect và ack. Idempotency vẫn cần. Ordering của standard/fifo queue tùy product/config; không suy ra từ tên “queue”. Request-reply qua hai queues có thể làm được nhưng thêm correlation, reply expiry, orphan replies và cancellation; không dùng để mô phỏng RPC nếu caller vẫn block chờ cùng deadline.

## Kafka: events, nhiều readers và replay

Kafka phù hợp khi fact đã xảy ra cần được nhiều consumers độc lập đọc, retention/replay có giá trị, hoặc stream state/projection cần rebuild. Consumer groups giữ offsets riêng; một group cho competing instances, nhiều groups cho fan-out logical consumers. Event producer không biết toàn bộ subscribers.

Kafka không tự là work queue đơn giản:

- record ở lại theo retention dù đã consume;
- offset/partition đặt replay và ordering semantics;
- partitions giới hạn group parallelism;
- slow group không xóa record nhưng có thể vượt retention;
- schema evolution và event ownership là long-lived contract.

Ordering chỉ trong partition. At-least-once quanh external side effect tạo duplicates. Kafka transactions hỗ trợ phạm vi Kafka phù hợp nhưng không atomically commit arbitrary database. Version/config cụ thể quyết định client guarantee; bài không giả định mọi Kafka deployment có exactly-once end-to-end.

## Bảng quyết định

| Signal chính | REST/HTTP | Work queue | Kafka event log |
|---|---|---|---|
| Caller cần câu trả lời ngay | Mạnh | Không tự nhiên | Không tự nhiên |
| Một work item, một worker pool | Có thể nhưng coupled | Mạnh | Consumer group có thể, thêm log semantics |
| Nhiều consumers độc lập | Caller phải gọi/fan-out | Cần subscriptions/queues | Mạnh với groups |
| Replay/rebuild lịch sử | Không mặc định | Thường giới hạn/product-specific | Core strength |
| Load leveling burst | Ít, cần admission | Mạnh trong capacity | Mạnh trong retention capacity |
| Query tùy ý | Mạnh qua API/store | Không | Cần projection/state store |
| Ordering | Theo request/application | Product-specific | Per partition |
| Operational state | deadlines/connections | depth/leases/DLQ | partitions/offsets/retention/schema |

Chọn theo dominant contract. Không thêm broker chỉ để “decouple” nếu team chưa có consumer ownership, schema governance, DLQ/replay và on-call.

## Command khác event

Command là yêu cầu một capability owner làm việc: ShipOrder, ChargePayment. Nó có thể bị reject và thường có intended receiver. Event là fact đã xảy ra: OrderShipped, PaymentAuthorized; consumers không được thay đổi ý nghĩa quá khứ.

Đặt tên event kiểu DoSomethingAsync làm ownership mơ hồ. Event payload cần event ID, aggregate ID/version, occurredAt, producer/schema version và data cần thiết theo privacy policy. Không phát toàn bộ database row như contract vĩnh viễn.

Nếu chỉ một service có quyền thay đổi Order, clients gửi command tới owner qua REST/queue; owner commit state rồi publish fact. Event consumers xây projections hoặc reactions. Điều này bảo vệ service boundary tốt hơn shared topic để nhiều services “cùng sửa”.

## Dual write và transactional outbox

Flow “commit DB rồi publish” có crash window; “publish rồi commit DB” cũng có window ngược. Transactional outbox ghi business change và outbox record trong cùng local transaction, sau đó relay/CDC publish. Pattern giảm inconsistency giữa state và event nhưng tạo duplicate possibility; consumers dùng inbox/idempotency.

~~~text
HTTP command
  -> local transaction: update aggregate + insert outbox
  -> return accepted/created
  -> relay publishes event
  -> consumers process idempotently
  -> operation/projection exposes eventual status
~~~

Outbox retention, relay lag, poison row, ordering per aggregate và reconciliation là production responsibilities. Không gọi flow “exactly once” khi external side effects còn ngoài boundary.

## Consistency và user experience

Synchronous không luôn strongly consistent: callee có thể đọc replica stale hoặc gọi sâu hơn. Asynchronous không luôn “chậm”: consumer có thể xử lý nhanh nhưng contract vẫn eventual. Ghi guarantee cụ thể:

- accepted khi nào;
- completed khi nào và ai là source of truth;
- user đọc status ở đâu;
- read-your-writes cần primary/session token hay pending UI;
- lỗi sau accept được báo/retry/cancel thế nào;
- retention/replay window là bao lâu.

Một checkout có thể dùng REST để validate và create order, local transaction/outbox để publish OrderPlaced, Kafka cho inventory/analytics projections, queue cho email, và REST operation resource cho UI. Hybrid thường đúng hơn ép toàn hệ thống dùng một protocol.

## Failure và overload chuyển vị trí

REST truyền backpressure qua latency/error; cần bounded concurrency và fail fast. Queue/Kafka hấp thụ burst nhưng chuyển lỗi thành backlog; producer có thể trông khỏe trong khi users chờ hàng giờ. Alert event age/business freshness, không chỉ publish success.

Retries ở mọi layer có thể nhân tải: HTTP client retry, producer retry, consumer retry và DLQ replay. Đặt một owner cho retry budget mỗi boundary, exponential backoff+jitter, max attempts/deadline và idempotency key. Poison events phải được quarantine với schema/raw metadata an toàn.

## Operations và economics

REST cần service discovery, load balancing, TLS/auth, tracing, rate limit và dependency SLO. Queue cần broker capacity, depth/age, visibility/lease, DLQ/redrive. Kafka cần brokers/controllers, partitions, replication, retention, schemas, consumer lag/rebalance và replay tooling.

Đếm cả human cost: ai sở hữu topic/queue, compatibility review, data deletion/privacy, incident response và disaster recovery. Managed service giảm hạ tầng nhưng không xóa semantic ownership.

## Failure scenarios

- Dùng Kafka request-reply nhưng caller vẫn chờ 200 ms, tạo RPC phức tạp.
- REST call chain dài không truyền deadline, một callee chậm gây cascade.
- Queue backlog che downstream outage tới khi vượt retention.
- Một Kafka group được dùng cho hai services nhưng mong cả hai nhận mọi event.
- Publish event trước database commit rồi state không tồn tại.
- Outbox được gọi exactly-once nhưng consumer side effect không idempotent.
- Event schema chứa internal row và PII không có lifecycle.
- Chọn công nghệ theo team trend, không ghi acceptance/completion contract.

:::production Decision checklist
Viết caller/outcome/deadline; phân loại command hay event; xác định one-worker hay fan-out; chốt replay/order/consistency; mô hình burst và sustained capacity; đặt idempotency/retry/DLQ; giải dual write bằng outbox khi cần; định nghĩa status/reconciliation; đánh giá schema/privacy/on-call; prototype failure path; ghi ADR với tiêu chí đổi quyết định.
:::

## Góc phỏng vấn

“Khi nào dùng Kafka thay REST?” — Khi producer không cần response trực tiếp, consumers độc lập và durable replay/event history có giá trị. Không dùng Kafka chỉ để né timeout. Senior sẽ tách queue work distribution khỏi event log, nói temporal coupling, offset/retention, per-partition order, duplicate/idempotency, outbox và cost vận hành. Một flow tốt thường hybrid.

## Key Takeaways

- REST, queue và Kafka biểu diễn ba communication contracts khác nhau.
- Async chuyển failure thành backlog; nó không tạo capacity vô hạn.
- Command có owner; event là fact và là long-lived contract.
- Outbox giải dual-write window nhưng vẫn cần idempotent consumers.
- Quyết định senior gồm user semantics, failure model và operational ownership.
