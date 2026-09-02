---
id: distributed-time-clocks-ordering
slug: distributed-time-clocks-ordering
title: Thời gian, Clock và Thứ tự Sự kiện trong Distributed Systems
description: Phân biệt wall clock, monotonic clock và logical clock; thiết kế ordering, version, lease, event-time và xử lý clock skew trong production.
category: distributed-systems
technology: Distributed Time and Ordering
level: senior
estimatedMinutes: 52
tags: ["distributed-systems","clock-skew","ordering","lamport-clock","event-time","fencing-token"]
prerequisites: ["distributed-failures"]
related: ["kafka-producer-durability-batching","saga-distributed-transactions","distributed-consensus-leader-election"]
next: distributed-consensus-leader-election
learningObjectives: ["Chọn đúng clock cho duration, timestamp và ordering","Phân biệt total order, causal order và per-key order","Thiết kế version/fencing để stale writer không phá invariant"]
lastReviewed: 2026-09-02
appliesTo: {"scope":"version-neutral; kiểm tra semantics của datastore và stream platform đang vận hành"}
sources: [{"title":"RFC 5905 - Network Time Protocol Version 4","url":"https://www.rfc-editor.org/rfc/rfc5905.html","organization":"IETF","type":"standard","accessedAt":"2026-09-02"},{"title":"RFC 3339 - Date and Time on the Internet: Timestamps","url":"https://www.rfc-editor.org/rfc/rfc3339.html","organization":"IETF","type":"standard","accessedAt":"2026-09-02"},{"title":"Challenges with distributed systems","url":"https://aws.amazon.com/builders-library/challenges-with-distributed-systems/","organization":"Amazon Web Services","type":"primary-vendor","accessedAt":"2026-09-02"},{"title":"Apache Kafka documentation","url":"https://kafka.apache.org/documentation/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: timestamp không phải sự thật toàn cục

Một máy có thể đọc đồng hồ và gắn `2026-09-02T10:00:00Z` cho event, nhưng timestamp đó chỉ là quan sát của máy ấy. Trong distributed system không có một “bây giờ” tức thời mà mọi node cùng nhìn thấy. Clock có drift do oscillator, có offset so với nguồn chuẩn, có thể được NTP điều chỉnh, và process có thể dừng lâu vì scheduler, GC hay suspend. Network lại thêm delay không biết trước. Vì vậy, hai timestamp gần nhau không đủ chứng minh quan hệ nhân quả hay thứ tự commit.

Hãy tách bốn câu hỏi thường bị trộn:

1. **Mất bao lâu?** Dùng monotonic clock trong cùng process.
2. **Hiển thị lúc nào?** Dùng wall-clock timestamp có timezone/UTC và ghi rõ độ chính xác.
3. **Cái nào xảy ra trước về nghiệp vụ?** Dùng version/sequence hoặc causal metadata gắn với domain.
4. **Ai còn quyền ghi?** Dùng epoch/term/fencing token do coordinator đáng tin cấp, không dựa vào “timestamp mới hơn”.

```mermaid
sequenceDiagram
  participant A as Node A (clock +400ms)
  participant B as Node B (clock -300ms)
  participant Q as Queue partition P
  A->>B: command X
  Note over A: local timestamp 10:00:00.500
  Note over B: receive timestamp 09:59:59.900
  B->>Q: append X-result, offset 71
  A->>Q: append audit, offset 72
  Note over Q: offset orders records in P; wall clocks do not
```

## Ba họ clock và giới hạn của chúng

**Wall clock** biểu diễn thời gian lịch, thường đồng bộ bằng NTP. Nó phù hợp với audit display, expiration liên hệ thế giới bên ngoài và correlation gần đúng. Nó có thể nhảy tiến/lùi khi được chỉnh; leap second và cách hệ điều hành/dịch vụ xử lý cũng không đồng nhất. RFC 3339 chuẩn hóa cú pháp timestamp Internet, không hứa các máy phát timestamp tạo được global order.

**Monotonic clock** chỉ tăng trong phạm vi một boot/process theo contract của runtime. Lấy `end - start` bằng clock này để đo timeout, latency và backoff; đừng lấy hai wall timestamps rồi trừ. Monotonic value không có ý nghĩa khi gửi sang host khác hoặc sau restart.

**Logical clock** theo dõi order thay vì thời gian thật. Lamport clock tăng counter khi có local event, gửi counter trong message, và khi nhận thì cập nhật `max(local, received) + 1`. Nếu `a` causally precedes `b`, clock của `a` nhỏ hơn `b`; chiều ngược lại không đúng, nên counter nhỏ hơn không chứng minh causal relation. Vector clock có thể nhận biết concurrent updates nhưng metadata tăng theo số participant và khó quản lý membership. Hybrid logical clock kết hợp thành phần physical và logical; semantics cụ thể phụ thuộc implementation, không nên tự chế protocol.

```text
send:    L := L + 1; message.clock := L
receive: L := max(L, message.clock) + 1
```

## Ordering phải có phạm vi

“Hệ thống bảo đảm ordering” là câu chưa đủ. Cần hỏi order theo **key, partition, aggregate, shard hay toàn hệ thống**, tại producer, broker hay consumer, và qua retry/failover hay không. Kafka duy trì log có offset trong từng partition; không có một offset chung để trộn mọi partition. Nếu order của mọi thay đổi `accountId` quan trọng, chọn cùng partition key và bảo vệ cả producer retry/concurrency lẫn consumer processing. Đổi partition count hoặc key có thể đổi mapping, nên migration cần kế hoạch.

Total order toàn cục thường đòi một serialization point/consensus group, làm tăng coordination và giới hạn throughput/availability theo failure model. Nhiều domain chỉ cần per-aggregate order. Hai aggregate độc lập có thể concurrent; workflow liên aggregate dùng saga, invariant boundary hoặc reconciliation thay vì giả lập một timeline tuyệt đối.

Version field là công cụ đơn giản và mạnh:

```sql
UPDATE inventory
SET available = available - :qty, version = version + 1
WHERE sku = :sku AND version = :expectedVersion AND available >= :qty;
```

Affected row bằng `0` nghĩa là conflict hoặc invariant không thỏa; caller phải đọc lại/quyết định, không blind retry vô hạn. Consumer có thể lưu `lastVersion` theo aggregate, bỏ duplicate cùng version và quarantine gap thay vì âm thầm áp dụng version 14 khi chưa thấy 13. Nhưng sequence chỉ hữu ích nếu một authority cấp nó và persistence của version cùng atomic boundary với state.

## Lease, timeout và fencing

Lease dựa trên thời gian luôn chứa assumption về clock/error bound. Một worker A có thể giữ lease, bị pause, lease hết và B được chọn; A tỉnh lại vẫn tưởng mình là owner. Chỉ kiểm tra local expiry không ngăn stale write. Coordinator nên cấp fencing token tăng đơn điệu; storage/resource từ chối token nhỏ hơn token cao nhất đã thấy.

```text
A gets token 41 -> pause
B gets token 42 -> storage accepts write(token=42)
A resumes       -> storage rejects write(token=41)
```

Trong cùng process, deadline nên tính bằng monotonic duration. Khi gửi qua network, truyền absolute deadline chỉ khi contract clock skew rõ ràng, hoặc truyền remaining budget và trừ chi phí tại mỗi hop một cách bảo thủ. TTL là policy dọn dữ liệu, không nhất thiết là concurrency lock. “Row có `expires_at` cũ” không tự động trao quyền ghi nếu node cũ còn hoạt động.

## Event time, processing time và late data

Streaming phân biệt **event time** do producer quan sát với **processing time** lúc hệ thống xử lý. Mobile offline có thể gửi event cũ sau nhiều giờ; retry có thể làm arrival order khác event order. Watermark là ước lượng tiến độ event time để đóng window, không phải bằng chứng sẽ không còn event muộn. Chọn allowed lateness, correction/upsert hoặc compensation theo business: dashboard có thể cập nhật lại; billing close có thể cần trạng thái provisional rồi final và audit điều chỉnh.

Event cần `eventId`, aggregate, schema, event time và authority sequence nếu có; ingestion time dùng đo lag.

## Failure scenarios và troubleshooting

- **Clock nhảy lùi làm token “chưa hết hạn”:** kiểm tra NTP daemon, offset/step event và validation library; dùng monotonic clock cho elapsed time, cho phép skew có giới hạn ở protocol nhưng không nới vô hạn.
- **Last-write-wins làm mất update:** hai region ghi concurrent và timestamp lệch; thay bằng optimistic version, merge rule mang nghĩa domain hoặc single-writer per key.
- **Consumer thấy 12, 14, rồi 13:** kiểm tra partition key, producer concurrency, retry/DLQ và consumer parallelism. Quy định rõ buffer gap, retry hay reconciliation.
- **Metric latency âm:** code trừ wall clock hoặc timestamp từ hai host. Đo span duration bằng monotonic clock tại một process; trace timestamp liên host chỉ dùng correlation có sai số.
- **Stale leader ghi sau failover:** thêm epoch/fencing tại resource cuối cùng; cảnh báo khi rejected stale token tăng đột biến.

Quan sát production nên có clock offset, synchronization state, leap/step event, event-time lag, ingestion lag, version conflict, sequence gap, duplicate và fencing rejection. Log cả timestamp chuẩn hóa UTC lẫn sequence/term/offset.

## Trade-off và production checklist

- [ ] Mỗi requirement ghi rõ order scope và authority cấp sequence.
- [ ] Duration/timeout dùng monotonic clock; wall clock dành cho calendar/audit contract.
- [ ] Timestamp serialize theo RFC 3339, có offset/UTC, precision và parsing test.
- [ ] Update cạnh tranh dùng version/CAS hoặc transaction phù hợp, không LWW mù.
- [ ] Lease owner có fencing token và downstream thực sự validate token.
- [ ] Stream định nghĩa partition key, duplicate/gap/late-event policy và replay semantics.
- [ ] NTP/clock offset được monitor; alert gắn với tolerance thực của token/database/protocol.
- [ ] Test clock step, process pause, message reorder, duplicate, late arrival và region failover.

Logical metadata và coordination tăng storage/latency nhưng bảo vệ invariant. Ngược lại, chấp nhận concurrent/late event giúp availability và scale tốt hơn nhưng đòi merge/reconciliation. Quyết định phải xuất phát từ hậu quả nghiệp vụ của sai order, không từ mong muốn “mọi thứ sorted”.

## Góc phỏng vấn

**NTP có giải quyết ordering không?** Không. NTP giảm sai lệch theo một accuracy/error budget, nhưng network delay và clock adjustment vẫn tồn tại. Dùng sequence/log/consensus khi cần order mạnh.

**Lamport clock cho biết hai event concurrent không?** Nó bảo toàn chiều happens-before, nhưng chỉ nhìn hai scalar counter không xác định chắc concurrency. Vector clock giàu thông tin hơn với chi phí metadata.

**Vì sao lease cần fencing?** Pause hoặc partition có thể khiến owner cũ tiếp tục chạy sau khi owner mới được cấp lease. Token tăng đơn điệu cho resource cách từ chối stale owner.

## Key Takeaways

- Clock vật lý phục vụ thời gian lịch và correlation gần đúng, không tạo global truth.
- Monotonic clock đo elapsed time; logical/version metadata biểu diễn order trong phạm vi rõ ràng.
- Per-key order thường đủ và rẻ hơn total order toàn hệ thống.
- Lease chỉ an toàn trước stale writer khi resource kiểm tra fencing token.
- Late, duplicate và out-of-order event là trạng thái bình thường cần policy, metric và repair path.
