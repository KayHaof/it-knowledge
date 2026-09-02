---
id: java-concurrent-collections-coordination
slug: java-concurrent-collections-coordination
title: Concurrent Collections — Coordination và Backpressure
description: Chọn ConcurrentHashMap, BlockingQueue, CopyOnWriteArrayList và atomic operations theo contention, snapshot, compound invariant và bounded capacity.
category: backend
technology: Java
level: advanced
estimatedMinutes: 52
tags: ["java","concurrent-collections","blockingqueue","concurrenthashmap","backpressure"]
prerequisites: ["java-memory-model-locks-atomics"]
related: ["java-collections-generics","java-concurrency"]
next: java-virtual-threads-structured-concurrency
learningObjectives: ["Hiểu consistency contract của concurrent iterator","Dùng atomic map operation không lặp side effect","Biến queue capacity thành overload policy rõ"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"ConcurrentHashMap API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"BlockingQueue API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/BlockingQueue.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"CopyOnWriteArrayList API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/CopyOnWriteArrayList.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"ConcurrentSkipListMap API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentSkipListMap.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Thread-safe collection bảo vệ điều gì
Concurrent collection bảo vệ integrity của cấu trúc dữ liệu và định nghĩa memory-consistency cho operation của nó. Nó không tự bảo vệ invariant nghiệp vụ trải qua nhiều keys hoặc nhiều systems.

Ví dụ chuyển 10 đơn vị giữa hai account trong hai map entries cần invariant tổng tiền. Hai lần `compute` riêng đều thread-safe nhưng thread khác có thể thấy trạng thái giữa, và failure sau debit trước credit làm mất tiền. Cần lock/transaction/state owner bao trọn invariant.

## ConcurrentHashMap
`ConcurrentHashMap` hỗ trợ concurrent reads và updates với contention tốt hơn khóa toàn map. Nó không cho `null` key/value, giúp `null` biểu diễn absence không mơ hồ. Iterator/view là weakly consistent: có thể phản ánh một số thay đổi concurrent, không ném fail-fast theo cách collection thường, và không phải snapshot tại một thời điểm.

Atomic operations theo key:

```java title="RequestDeduplicator.java"
Result existing = results.putIfAbsent(requestId, pending);
if (existing != null) {
  return existing.await();
}
```

Ví dụ vẫn cần xử lý owner thất bại để pending không treo. Dedupe thực qua process restart cần durable store/idempotency, không chỉ in-memory map.

`computeIfAbsent` tiện cho lazy initialization, nhưng mapping function có thể được gọi trong điều kiện contention/failure và không nên làm I/O lâu, recursion lên cùng map hoặc side effect khó lặp. Đừng dùng map không eviction làm cache production.

## Bulk operations và snapshot
`size`, aggregation và iteration trong lúc map đổi chỉ phù hợp monitoring/ước lượng theo contract, không làm basis cho authorization hoặc financial invariant. Muốn snapshot nhất quán, copy dưới coordination phù hợp hoặc thiết kế versioned immutable state.

ConcurrentHashMap bulk operations có parallelism threshold và yêu cầu function không phụ thuộc ordering/shared mutation. Common pool interaction cần benchmark giống parallel stream.

## BlockingQueue là boundary producer-consumer
Blocking queue kết hợp storage và coordination. Capacity là quyết định resilience:

| Operation | Khi đầy/rỗng |
|---|---|
| `add/remove` | Ném exception |
| `offer/poll` | Trả trạng thái ngay |
| timed `offer/poll` | Chờ có deadline |
| `put/take` | Chờ không giới hạn tới khi có thể hoặc interrupt |

Unbounded queue biến overload thành memory growth và latency không giới hạn. Bounded queue buộc hệ thống chọn: block producer, reject, drop/coalesce hoặc spill bền vững.

```java title="BoundedSubmission.java"
boolean accepted = queue.offer(job, remainingMillis, TimeUnit.MILLISECONDS);
if (!accepted) {
  throw new CapacityRejected("Worker queue is full");
}
```

Deadline phải đến từ request budget. Nếu producer giữ database transaction trong lúc `put` chờ, connection/lock bị giữ và saturation lan ngược nguy hiểm.

## Shutdown và poison pill
Poison pill có thể dừng consumer, nhưng số pill phải khớp consumers và không được đứng sau vô hạn công việc mới. Cancellation flag + interrupt + lifecycle coordination thường rõ hơn. Khi shutdown:

1. Ngừng nhận việc mới.
2. Quyết định drain hay cancel queue.
3. Interrupt/wake workers.
4. Chờ bounded time.
5. Persist/requeue work chưa hoàn tất nếu contract yêu cầu.

Queue in-memory không có durability; process crash làm mất item dù `put` đã trả về.

## CopyOnWriteArrayList
Mỗi mutation tạo copy backing array; read/iteration không lock và iterator nhìn snapshot tại thời điểm tạo. Nó phù hợp danh sách nhỏ, read cực nhiều, write hiếm như listeners/config handlers. Nó tệ cho event log, session list hoặc collection cập nhật thường xuyên.

Snapshot iterator không thấy update mới và không hỗ trợ mutation qua iterator. Memory/copy spike theo kích thước list; tên “concurrent” không có nghĩa phù hợp mọi traffic.

## ConcurrentSkipListMap và ordering
Skip-list map cung cấp sorted/navigable concurrent map, hữu ích range query hoặc time/key ordering. Chi phí và constant factors cao hơn hash lookup. Iterator weakly consistent; comparator phải ổn định và nhất quán với equality semantics cần thiết.

Không dùng local sorted map làm scheduler durable nếu restart, clock jump và multi-instance ownership chưa được giải quyết.

## Counter và frequency map
Frequency map thường dùng `ConcurrentHashMap<K, LongAdder>`, nhưng sum chỉ hợp metric thống kê:

```java title="FrequencyMap.java"
frequencies.computeIfAbsent(key, ignored -> new LongAdder()).increment();
```

Map vẫn tăng theo số key; input cardinality cao tạo memory attack. Giới hạn/tag normalize/eviction. Không dùng LongAdder cho inventory/balance cần exact atomic read-update.

## Backpressure end-to-end
Bounded local queue chỉ bảo vệ một điểm. Producer có thể retry tức thì và tạo retry storm; upstream cần hiểu rejection, deadline và rate limit. Downstream capacity gồm worker CPU, connection pool, broker/database quota. Queue length nên gắn với Little’s Law/measurement và latency budget, không chọn số tròn tùy ý.

:::production Queue is not capacity
Queue cho phép hấp thụ burst ngắn; nó không tăng service rate. Nếu arrival rate dài hạn lớn hơn completion rate, mọi queue hữu hạn cuối cùng sẽ đầy.
:::

## Failure scenarios
- `containsKey` rồi `put`: check-then-act race.
- `computeIfAbsent` gọi remote API: giữ coordination lâu và failure khó kiểm soát.
- Unbounded executor queue: OOM trước khi rejection xảy ra.
- Dùng iterator như consistent audit snapshot.
- CopyOnWrite list có write burst: allocation/GC spike.
- Queue consumer ack external message trước khi side effect durable: mất việc.

## Production checklist
1. Ghi consistency/snapshot contract của mỗi read.
2. Dùng atomic operation theo key; lock/transaction cho multi-key invariant.
3. Bound queue và map cardinality.
4. Định nghĩa overload, retry và shutdown semantics.
5. Không block trong map callbacks.
6. Metric queue wait/depth, rejection, task age và completion rate.
7. Chọn durable broker/store khi crash recovery là requirement.

## Câu hỏi phỏng vấn
**ConcurrentHashMap có làm chuỗi nhiều operation atomic không?** Không. Từng operation có contract riêng; compound invariant cần atomic method phù hợp hoặc coordination ngoài.

**Weakly consistent iterator là gì?** Nó không fail-fast và có thể phản ánh một phần update concurrent, nhưng không cam kết snapshot tại một instant.

## Key Takeaways
- Concurrent collection bảo vệ cấu trúc, không tự bảo vệ nghiệp vụ.
- Queue capacity là overload policy.
- Snapshot/ordering semantics phải được đọc từ contract.
- Durability và multi-instance coordination nằm ngoài in-memory collection.
