---
id: java-executors-thread-pools
slug: java-executors-thread-pools
title: Java Executors và Thread Pools — Capacity, Saturation và Shutdown
description: Thiết kế ExecutorService và ThreadPoolExecutor theo workload, queue, deadline và overload policy; chẩn đoán saturation và dừng tiến trình mà không làm mất việc.
technology: Java
domain: backend
category: backend
level: advanced
contentType: production
order: 65
estimatedMinutes: 58
tags:
  - java
  - executorservice
  - threadpoolexecutor
  - saturation
  - backpressure
  - graceful-shutdown
prerequisites:
  - java-concurrency
related:
  - java-memory-model-locks-atomics
  - java-concurrent-collections-coordination
  - java-completable-future
  - java-virtual-threads-structured-concurrency
  - high-concurrency
learningObjectives:
  - Phân biệt task, thread, executor và Future theo contract sở hữu
  - Giải thích tương tác giữa core size, max size, queue và rejection policy
  - Thiết kế capacity, cancellation, observability và graceful shutdown có giới hạn
sources:
  - title: ThreadPoolExecutor API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: ExecutorService API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ExecutorService.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: java.util.concurrent Package — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: Thread API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Thread.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
lastReviewed: 2026-09-26
appliesTo:
  java: 21+; API và hành vi được đối chiếu với Java SE 26
---

# Java Executors và Thread Pools — Capacity, Saturation và Shutdown

## Tổng quan

Thiết kế ExecutorService và ThreadPoolExecutor theo workload, queue, deadline và overload policy; chẩn đoán saturation và dừng tiến trình mà không làm mất việc.

## Tách task khỏi execution resource

`Runnable` và `Callable<T>` mô tả **công việc**; `Thread` là một execution context; `Executor` quyết định lúc nào và ở đâu task chạy. `Runnable` không trả kết quả và method `run` không khai báo checked exception. `Callable<T>` trả kết quả hoặc ném exception; khi submit vào `ExecutorService`, caller nhận `Future<T>` để chờ, lấy kết quả hoặc yêu cầu hủy.

Tách hai vai trò giúp application đặt một policy chung cho số worker, queue, tên thread, rejection, metrics và shutdown. Tự tạo thread cho mỗi request bỏ qua admission control, làm chi phí scheduler và memory tăng theo traffic, đồng thời khiến lifecycle khó quản lý.

`execute` và `submit` không hoàn toàn tương đương về cách quan sát failure. `execute(Runnable)` không tạo `Future`; unchecked exception thoát khỏi task có thể tới uncaught-exception handler của worker. `submit` bọc task trong `Future`, nên exception được giữ và xuất hiện khi gọi `get`. Nếu fire-and-forget bằng `submit` rồi bỏ `Future`, lỗi có thể bị im lặng. Ownership contract phải nói rõ ai quan sát completion và failure.

```java title="TaskOwnership.java"
Future<Invoice> pending = executor.submit(() -> invoiceClient.load(invoiceId));
try {
  return pending.get(remainingMillis, TimeUnit.MILLISECONDS);
} catch (TimeoutException timeout) {
  pending.cancel(true); // yêu cầu interrupt; không bảo đảm task đã dừng
  throw new DependencyTimeoutException(timeout);
}
```

`Future.get()` không có deadline mặc định. Mọi chờ đợi trên request path cần dùng phần thời gian **còn lại** của deadline tổng, không cấp lại một timeout đầy đủ tại mỗi tầng.

## Thuật toán admission của ThreadPoolExecutor

Khi nhận task mới, `ThreadPoolExecutor` thực hiện policy theo ba ngưỡng liên kết:

1. Nếu số worker nhỏ hơn `corePoolSize`, tạo worker.
2. Nếu đã đủ core, thử đưa task vào `workQueue`.
3. Nếu queue không nhận được và worker nhỏ hơn `maximumPoolSize`, tạo thêm worker.
4. Nếu cả queue lẫn pool đều hết capacity, gọi `RejectedExecutionHandler`.

Hệ quả dễ bị bỏ sót: với queue không giới hạn, bước 2 gần như luôn thành công, vì vậy `maximumPoolSize` hầu như không có tác dụng. Hệ thống không reject sớm mà tích lũy task, tăng queue wait, giữ object graph và có thể hết heap trước khi operator thấy “pool đã max”.

| Queue | Hành vi | Khi phù hợp | Rủi ro chính |
|---|---|---|---|
| `SynchronousQueue` | Handoff trực tiếp, không lưu backlog | Task phụ thuộc lẫn nhau hoặc cần scale worker tức thì trong giới hạn rõ | Reject nhanh hoặc tăng thread quá mức nếu max quá cao |
| Bounded `ArrayBlockingQueue`/`LinkedBlockingQueue(capacity)` | Hấp thụ burst hữu hạn | Request/background work có latency budget và overload policy | Cần đo để cân bằng worker với queue |
| Unbounded queue | Dồn mọi task sau core workers | Chỉ khi arrival được chặn ở boundary khác và backlog có giới hạn chứng minh được | Latency, retained memory và stale work tăng không giới hạn |

Queue không tạo thêm service capacity; nó chỉ dời thời điểm xử lý. Nếu arrival rate trung bình lâu dài lớn hơn completion rate, mọi queue hữu hạn cuối cùng sẽ đầy.

## Pool size là capacity decision, không phải số thần kỳ

Với CPU-bound task, tăng worker vượt số CPU thực được cấp cho process thường chỉ tăng context switching và contention. Với blocking I/O, nhiều worker hơn có thể hữu ích vì nhiều task dành thời gian chờ, nhưng capacity thực còn bị chặn bởi connection pool, downstream concurrency/QPS, file descriptors và memory cho task đang chờ.

Một công thức chỉ là giả thuyết ban đầu. Quy trình đáng tin hơn:

1. Đo service time, wait time và arrival burst trên workload gần production.
2. Xác định downstream capacity và request deadline.
3. Chọn concurrency sao cho không vượt resource khan hiếm.
4. Chọn queue đủ hấp thụ burst mong muốn nhưng không chứa task đã quá deadline.
5. Load test đến saturation; quan sát throughput, p95/p99, queue wait và rejection.
6. Giữ headroom cho GC, traffic lệch và failure của một replica.

Không dùng chung một pool cho CPU transform và remote I/O chậm nếu workload cần isolation. Một dependency treo có thể chiếm mọi worker và làm công việc độc lập cũng timeout. Tách bulkhead theo failure domain, nhưng tránh tạo quá nhiều pool nhỏ khiến tổng thread và queue capacity không còn được kiểm soát.

## Bounded pool và overload policy

```java title="BoundedExecutor.java"
ThreadFactory workers = Thread.ofPlatform()
    .name("pricing-", 0)
    .factory();

ThreadPoolExecutor pricing = new ThreadPoolExecutor(
    8,
    16,
    30,
    TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(200),
    workers,
    new ThreadPoolExecutor.AbortPolicy());
```

Ví dụ chỉ minh họa topology, không phải con số mặc định cho mọi hệ thống. `AbortPolicy` biến saturation thành `RejectedExecutionException`; boundary phải map nó thành phản hồi overload phù hợp, metric và retry guidance. Không catch rồi submit lại ngay, vì retry tức thời làm tải cao hơn.

`CallerRunsPolicy` chạy task trên thread submit, tạo feedback vì producer bị chậm lại. Nó chỉ hữu ích khi chạy trong caller không phá event loop, không giữ database lock/transaction và còn đủ deadline. Trên request thread, nó có thể biến queue saturation thành tail latency; trên event-loop thread, một task blocking có thể đóng băng nhiều connection.

`DiscardPolicy` và `DiscardOldestPolicy` chỉ hợp lệ khi business contract cho phép mất việc và có telemetry/audit tương ứng. Với payment, email bắt buộc hay state transition, silent drop là data-loss bug; dùng durable broker/outbox khi công việc phải sống qua process crash.

:::warning Rejection không phải exception “hiếm gặp”
Với bounded design, rejection là trạng thái runtime dự kiến khi capacity hết hoặc executor đang shutdown. Phải test response, metric, retry/backoff và idempotency như một nhánh business failure.
:::

## Cancellation và interruption là cooperative

`Future.cancel(true)` và `shutdownNow()` **yêu cầu** interrupt; chúng không giết thread an toàn. Task phải đáp ứng interruption: API blocking chuẩn thường ném `InterruptedException`; loop tính toán nên kiểm `Thread.currentThread().isInterrupted()` tại điểm hợp lý; code bắt `InterruptedException` mà không thể hoàn tất cancellation nên khôi phục flag bằng `Thread.currentThread().interrupt()`.

```java title="InterruptibleBatch.java"
for (Item item : batch) {
  if (Thread.currentThread().isInterrupted()) {
    throw new CancellationException("batch cancelled");
  }
  transform(item);
}
```

Interrupt không rollback side effect đã commit và không chắc chặn được native/third-party call. Vì vậy cancellation phải kết hợp deadline ở HTTP/database client, idempotency và state machine có thể resume. Không dùng `Thread.stop`: dừng bất kỳ điểm nào có thể để shared state ở trạng thái phá invariant.

## Virtual thread thay đổi chi phí chờ, không thay đổi capacity downstream

Với workload có nhiều blocking I/O, executor một virtual thread cho mỗi task có thể đơn giản hóa code và tránh platform-thread pool lớn. Tuy nhiên, không dùng một bounded pool virtual thread chỉ để “giới hạn thread”; hãy giới hạn resource thật bằng semaphore, connection pool, rate limiter hoặc admission control.

Platform pool vẫn hợp lý cho CPU-bound parallelism, thư viện cần thread affinity, hoặc boundary cần queue/rejection policy cụ thể. Virtual thread không làm query nhanh hơn, không tăng database connections và không tự cung cấp durability/backpressure. Quyết định phải dựa trên thread dump/JFR, pinning evidence, downstream wait và load test; chi tiết adoption nằm ở bài liên quan.

## Observability và playbook saturation

Theo dõi ít nhất:

- pool size, active workers và largest pool size;
- queue depth/capacity, task age và queue-wait distribution;
- submitted, completed, failed, cancelled và rejected tasks;
- execution time theo task/dependency;
- request deadline còn lại khi submit và khi bắt đầu chạy;
- downstream connection-pool wait, timeout và error rate.

`getActiveCount`, `getTaskCount` và `getCompletedTaskCount` là số gần đúng, phù hợp telemetry chứ không phải invariant nghiệp vụ. Queue depth bằng không không chứng minh hệ thống khỏe: pool có thể bị kẹt hết worker. Ngược lại queue tăng nhưng throughput ổn có thể là burst ngắn; cần nhìn trend và tuổi task.

Khi p99 tăng:

1. So sánh arrival với completion rate và rejection.
2. Tách queue wait khỏi execution time.
3. Lấy nhiều thread dump để tìm worker cùng chờ lock, connection hay remote call.
4. Kiểm connection pool/downstream trước khi tăng threads.
5. Xem task quá deadline có tiếp tục giữ capacity không.
6. Giảm admission/load, rollback hoặc cô lập dependency; chỉ resize sau khi có evidence.

## Graceful shutdown có deadline

`shutdown()` ngừng nhận task mới nhưng cho task đã submit tiếp tục. `shutdownNow()` ngăn task đang chờ bắt đầu, trả lại danh sách đó và yêu cầu interrupt task đang chạy. Hai method đều không bảo đảm mọi task đã dừng ngay.

```java title="ExecutorShutdown.java"
pricing.shutdown();
try {
  if (!pricing.awaitTermination(20, TimeUnit.SECONDS)) {
    List<Runnable> neverStarted = pricing.shutdownNow();
    persistOrReport(neverStarted);
    if (!pricing.awaitTermination(10, TimeUnit.SECONDS)) {
      logger.error("pricing executor did not terminate");
    }
  }
} catch (InterruptedException interrupted) {
  pricing.shutdownNow();
  Thread.currentThread().interrupt();
}
```

Trình tự production thường là: báo instance không ready, ngừng admission, chờ in-flight theo deadline, dừng executor, rồi đóng downstream resources. Nếu queued task phải được thực hiện sau restart, local executor không đủ contract; ghi công việc vào durable store/broker trước khi acknowledge request.

## Failure scenarios thường gặp

- `newFixedThreadPool` dùng queue không giới hạn: memory và queue wait tăng nhưng không reject.
- Tăng `maximumPoolSize` trong khi queue không giới hạn: cấu hình không đổi số worker thực tế sau core.
- Task giữ transaction/connection trong lúc chờ `Future` cùng pool: starvation hoặc deadlock phụ thuộc.
- `CallerRunsPolicy` trên event loop: một task blocking làm nghẽn nhiều request.
- Catch `InterruptedException` rồi bỏ qua: deploy/shutdown vượt grace period.
- Submit bằng `submit` và bỏ `Future`: exception task không được quan sát.
- Shutdown trước khi ngừng producer: producer tiếp tục submit và nhận rejection hàng loạt.
- Queue chứa công việc không idempotent nhưng process crash: backlog biến mất hoặc retry tạo side effect lặp.

## Production checklist

1. Chỉ định owner tạo, dùng và đóng mỗi executor.
2. Gắn pool/queue với workload và failure domain cụ thể.
3. Bound concurrency, queue và deadline; định nghĩa nhánh rejection.
4. Không giữ lock/transaction/resource khan hiếm khi chờ task khác.
5. Propagate cancellation; giữ interrupt status khi không xử lý hoàn toàn.
6. Đo queue wait, task age, execution, rejection và downstream wait.
7. Test saturation, retry storm, dependency treo và rolling shutdown.
8. Dùng durable queue khi yêu cầu là crash recovery, không chỉ async execution.

## Key Takeaways

- Executor tách task khỏi execution policy và cần một owner chịu trách nhiệm lifecycle.
- Core size, max size và queue tạo một admission algorithm; không thể tune từng tham số riêng lẻ.
- Bounded capacity cần rejection/backpressure contract rõ, còn unbounded queue chỉ trì hoãn overload.
- Cancellation bằng interrupt là cooperative; deadline và idempotency vẫn phải đi end-to-end.
- Graceful shutdown phải ngừng admission, drain có giới hạn và xử lý công việc chưa bắt đầu.

:::flashcard
id: java-executor-admission-order
front: ThreadPoolExecutor xử lý task mới theo thứ tự core pool, queue, maximum pool và rejection như thế nào?
back: Tạo worker nếu chưa đủ core; sau đó ưu tiên queue; chỉ tạo thêm tới maximum khi queue không nhận; reject nếu cả queue lẫn maximum đều hết capacity.
level: advanced
tags:
  - java
  - threadpoolexecutor
  - capacity
:::

:::flashcard
id: java-executor-unbounded-queue-max-pool
front: Vì sao maximumPoolSize thường không có tác dụng khi ThreadPoolExecutor dùng queue không giới hạn?
back: Sau khi đủ core workers, task gần như luôn được queue chấp nhận nên executor không đi tới bước tạo worker vượt core; backlog và latency tăng thay cho pool size.
level: advanced
tags:
  - java
  - queue
  - saturation
:::

:::flashcard
id: java-executor-interrupt-contract
front: Future.cancel(true) có bảo đảm task Java dừng ngay không?
back: Không. Nó yêu cầu interrupt; task và API blocking phải hợp tác, còn side effect đã commit không tự rollback.
level: advanced
tags:
  - java
  - cancellation
  - interruption
:::

:::flashcard
id: java-executor-durable-work
front: Khi nào local ExecutorService không đủ cho background work?
back: Khi công việc phải sống qua process crash hoặc deploy; cần durable store/broker, acknowledgement và idempotency thay vì chỉ queue trong memory.
level: advanced
tags:
  - java
  - durability
  - graceful-shutdown
:::

## Nguồn chính thống

- [Oracle — ThreadPoolExecutor API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html)
- [Oracle — ExecutorService API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ExecutorService.html)
- [Oracle — java.util.concurrent Package — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html)
- [Oracle — Thread API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Thread.html)
