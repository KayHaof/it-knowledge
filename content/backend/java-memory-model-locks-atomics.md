---
id: java-memory-model-locks-atomics
slug: java-memory-model-locks-atomics
title: Java Memory Model — Locks, Atomics và Safe Publication
description: Suy luận happens-before, visibility, ordering và atomicity; chọn monitor, Lock, CAS hay immutable snapshot để bảo vệ invariant.
category: backend
technology: Java
level: advanced
estimatedMinutes: 58
tags: ["java","jmm","happens-before","locks","atomics"]
prerequisites: ["java-concurrency"]
related: ["java-completable-future","high-concurrency"]
next: java-concurrent-collections-coordination
learningObjectives: ["Chứng minh visibility bằng happens-before","Phân biệt volatile, lock và atomic read-modify-write","Publish object an toàn và điều tra deadlock/contention"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"Java Language Specification — Threads and Locks","url":"https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"},{"title":"java.util.concurrent Package","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"ReentrantLock API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"VarHandle API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## JMM là luật quan sát, không phải sơ đồ CPU
Java Memory Model định nghĩa những giá trị một thread được phép quan sát và ordering nào được bảo đảm. Compiler, JIT và CPU có thể reorder miễn behavior vẫn hợp lệ theo JMM. Vì vậy đọc code theo thứ tự dòng không đủ khi có data race.

Ba khái niệm phải tách:

- **Atomicity:** operation có bị quan sát ở trạng thái giữa hay interleave không.
- **Visibility:** write của thread A có được thread B nhìn thấy không.
- **Ordering:** các action có thứ tự quan sát bắt buộc nào.

`count++` là read-modify-write, không atomic dù read/write biến đơn lẻ có thể atomic. `volatile` tạo visibility/order cho biến nhưng không khóa cả chuỗi invariant.

## Happens-before là công cụ chứng minh
Nếu action A happens-before B, effects của A phải visible với B theo JMM. Các cạnh quan trọng:

- Unlock monitor happens-before lock tiếp theo trên cùng monitor.
- Write volatile happens-before read tiếp theo của cùng biến.
- Action trước `Thread.start` visible trong thread được start.
- Action trong thread happens-before thread khác return thành công từ `join`.
- Completion/queueing primitives trong `java.util.concurrent` có memory consistency effects được document.

Happens-before là transitive. Không có edge không có nghĩa chắc chắn không thấy write; nghĩa là chương trình không được quyền dựa vào việc thấy nó.

## Safe publication
Object được tạo đúng nhưng publish sai vẫn có thể bị thread khác thấy state stale hoặc reference escape trước constructor xong. Các cách publish thông dụng:

- Gán vào static field trong class initialization.
- Gán dưới lock rồi đọc dưới cùng lock.
- Gán qua volatile reference.
- Đưa qua concurrent collection/queue theo contract.
- Hoàn tất task rồi nhận kết quả qua Future.

Final fields có initialization safety khi constructor không làm `this` escape, nhưng object graph mutable vẫn cần synchronization cho thay đổi sau đó.

```java title="ImmutableSnapshot.java"
record RoutingTable(Map<String, URI> routes) {
  RoutingTable {
    routes = Map.copyOf(routes);
  }
}

final class Router {
  private volatile RoutingTable current = new RoutingTable(Map.of());

  URI route(String key) { return current.routes().get(key); }
  void replace(RoutingTable next) { current = next; }
}
```

Một volatile reference tới immutable snapshot cho read không lock và atomic replace toàn invariant. Mutate map nằm bên trong sau publish sẽ phá mô hình.

## synchronized hay ReentrantLock
`synchronized` cung cấp mutual exclusion, visibility và automatic unlock khi ra block; đây là lựa chọn mặc định tốt cho critical section đơn giản. `ReentrantLock` thêm `tryLock`, timed/interruptible acquisition, nhiều `Condition` và instrumentation.

```java title="TimedLock.java"
if (!lock.tryLock(remaining.toMillis(), TimeUnit.MILLISECONDS)) {
  throw new CapacityTimeout();
}
try {
  updateInvariant();
} finally {
  lock.unlock();
}
```

Mọi successful lock phải có `unlock` trong `finally`. Fair lock có thể giảm starvation trong một số workload nhưng thường giảm throughput; chỉ bật sau khi xác định fairness là requirement và đo.

Không làm remote I/O trong lock nếu có thể lấy snapshot, release rồi gọi. Nếu invariant cần commit cùng I/O, thiết kế state machine/outbox thay vì giữ JVM lock qua network.

## Condition và vòng lặp
`Condition.await` hoặc `Object.wait` giải phóng lock rồi chờ; wake-up có thể spurious và condition có thể không còn đúng trước khi thread lấy lại lock. Luôn kiểm predicate trong `while`.

```java title="BoundedBufferWait.java"
lock.lockInterruptibly();
try {
  while (queue.size() == capacity) {
    notFull.await();
  }
  queue.addLast(value);
  notEmpty.signal();
} finally {
  lock.unlock();
}
```

Trong code production, `BlockingQueue` thường tốt hơn tự viết buffer; ví dụ minh họa protocol.

## Atomics và CAS
`AtomicInteger.compareAndSet` thực hiện conditional update atomic. CAS loop đọc state, tính next và thử đổi nếu state chưa bị writer khác thay. Function có thể chạy lại nhiều lần nên không chứa side effect không idempotent.

Atomics tốt cho invariant nhỏ trên một variable. Ghép hai `AtomicInteger` không tạo transaction xuyên hai biến. Dùng immutable aggregate trong `AtomicReference`, lock hoặc state owner single-thread tùy contention/complexity.

ABA xảy ra khi value đổi A→B→A khiến CAS chỉ nhìn value hiện tại tưởng không đổi; version/stamp hoặc representation khác có thể cần. `LongAdder` scale tốt cho hot counter thống kê nhưng `sum()` không phải atomic snapshot phù hợp cho balance/invariant.

VarHandle cho access modes tinh vi hơn như opaque/acquire/release/CAS. Nó là công cụ low-level; chỉ dùng khi concurrent algorithm có proof, benchmark và test mạnh. `volatile`/concurrency utilities dễ audit hơn.

## Deadlock, livelock và starvation
Deadlock cần vòng chờ lock/resource. Giữ global lock order và tránh gọi callback không tin cậy trong lock. Timed `tryLock` giúp fail/break wait nhưng không tự bảo toàn invariant. Livelock là threads liên tục phản ứng mà không tiến triển; retry cần randomized backoff. Starvation là một task không được phục vụ dù hệ thống có progress.

Thread dump nhiều lần cho thấy lock owner/waiters và stack ổn định. Một dump đơn lẻ chỉ là snapshot; correlate với latency, CPU, queue và workload.

## Failure scenarios
- Double-checked locking với reference không volatile: publication không được bảo đảm.
- Volatile flag bảo vệ thêm một mutable payload không có edge đúng.
- CAS lambda gửi email rồi bị retry: side effect lặp.
- Lock ordering khác nhau giữa hai code path: deadlock hiếm.
- Thread chết khi đang giữ external/distributed lease nhưng JVM lock đã release: hai cơ chế có failure model khác.

## Production checklist
1. Viết invariant và owner của state trước primitive.
2. Vẽ happens-before edge cho mọi cross-thread handoff.
3. Ưu tiên immutable snapshot/message passing.
4. Giữ critical section ngắn, không remote I/O.
5. Metric lock wait/hold, queue, rejection và conflict.
6. Lấy nhiều thread dumps khi incident.
7. Stress/load test nhưng vẫn cần reasoning proof.

## Câu hỏi phỏng vấn
**`volatile` có làm `count++` thread-safe không?** Không. Nó giúp visibility/order nhưng increment vẫn gồm nhiều bước có thể lost update.

**Vì sao `while` thay vì `if` quanh `await`?** Wake-up có thể spurious hoặc predicate bị thread khác thay trước khi lock được lấy lại.

## Key Takeaways
- JMM định nghĩa observation hợp lệ bằng happens-before.
- Safe publication quan trọng ngang việc tạo object đúng.
- Lock bảo vệ invariant; atomic bảo vệ update nhỏ có thể retry.
- Không chọn primitive trước khi xác định state ownership.
