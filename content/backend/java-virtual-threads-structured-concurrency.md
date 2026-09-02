---
id: java-virtual-threads-structured-concurrency
slug: java-virtual-threads-structured-concurrency
title: Virtual Threads và Structured Concurrency — Adoption Guide
description: Chuyển workload blocking I/O sang virtual threads, giới hạn resource khan hiếm và đánh giá StructuredTaskScope preview theo đúng phiên bản JDK.
category: backend
technology: Java
level: senior
estimatedMinutes: 61
tags: ["java","virtual-threads","structured-concurrency","loom","adoption"]
prerequisites: ["java-concurrency"]
related: ["java-completable-future","spring-mvc-webflux"]
next: spring-boot-configuration-conditions
learningObjectives: ["Chọn workload phù hợp virtual threads","Tách thread abundance khỏi downstream capacity","Áp dụng StructuredTaskScope với preview/version policy rõ"]
lastReviewed: 2026-09-02
appliesTo: {"virtual-threads":"final since JDK 21","structured-concurrency":"sixth preview in JDK 26"}
sources: [{"title":"JEP 444 — Virtual Threads","url":"https://openjdk.org/jeps/444","organization":"OpenJDK","type":"specification","accessedAt":"2026-09-02"},{"title":"Virtual Threads — Java 26 Adoption Guide","url":"https://docs.oracle.com/en/java/javase/26/core/virtual-threads.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"JEP 491 — Synchronize Virtual Threads without Pinning","url":"https://openjdk.org/jeps/491","organization":"OpenJDK","type":"specification","accessedAt":"2026-09-02"},{"title":"StructuredTaskScope API — Java 26 Preview","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/StructuredTaskScope.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Version map trước khi thiết kế
Virtual threads được finalize bởi JEP 444 trong JDK 21. Chúng là `Thread` do Java runtime schedule lên carrier platform threads, phù hợp mô hình thread-per-task với blocking I/O.

Structured concurrency là ý tưởng quản lý nhóm subtasks như một unit có lexical lifetime, failure và cancellation chung. Nhưng `StructuredTaskScope` vẫn là **preview API ở JDK 26**; API đã thay đổi qua nhiều vòng preview. Code dùng nó phải compile/run với `--enable-preview` đúng JDK release và có kế hoạch migration mỗi lần nâng JDK.

| Capability | Trạng thái |
|---|---|
| Virtual threads | Final từ JDK 21 |
| Synchronized unmount improvement | Delivered trong JDK 24 qua JEP 491 |
| StructuredTaskScope | Sixth preview trong JDK 26 |

Không đưa preview API vào public library contract nếu consumers không thể đồng bộ JDK flags/version. Có thể cô lập nó sau internal interface để migration cục bộ.

## Virtual thread giải quyết điều gì
Platform thread giữ một OS thread trong suốt lifetime; hàng chục nghìn request chờ I/O sẽ cần nhiều stack/native resource hoặc queue/pool. Virtual thread nhẹ hơn và có thể unmount khỏi carrier khi blocking operation được runtime hỗ trợ, giúp carrier chạy task khác.

Nó tăng **concurrency khả dụng cho workload chờ**, không làm database query nhanh hơn, không tăng CPU cores và không tạo thêm downstream quota. CPU-bound task vẫn bị giới hạn bởi CPU; tạo hàng triệu virtual threads tính toán chỉ thêm scheduling/allocation.

```java title="VirtualThreadPerTask.java"
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
  Future<Order> order = executor.submit(() -> orderClient.load(orderId));
  return order.get();
}
```

Không pool virtual threads để “tiết kiệm thread”; mỗi task có thể có thread riêng. Thứ phải giới hạn là resource thật.

## Admission control cho resource khan hiếm
Nếu database pool có capacity hữu hạn, 100.000 virtual threads vẫn chỉ có số connection đó. Các thread còn lại chờ pool, giữ request/context/memory và đẩy tail latency.

```java title="DownstreamBulkhead.java"
final class LimitedClient {
  private final Semaphore permits;
  private final CustomerClient delegate;

  Customer load(CustomerId id, Duration budget) throws InterruptedException {
    if (!permits.tryAcquire(budget.toMillis(), TimeUnit.MILLISECONDS)) {
      throw new CapacityRejected();
    }
    try {
      return delegate.load(id);
    } finally {
      permits.release();
    }
  }
}
```

Permit count phải dựa trên downstream capacity/load test. Semaphore local không giới hạn tổng traffic từ nhiều replicas; rate limit/quota phía server hoặc distributed admission có thể cần.

## Pinning thay đổi theo phiên bản
Khi virtual thread bị pin trong blocking operation, carrier không được trả cho scheduler và scalability giảm. Ở JDK 21–23, blocking bên trong `synchronized` là một nguồn pinning quan trọng. JEP 491 trong JDK 24 thay đổi monitor implementation để virtual thread có thể unmount khi block trong synchronized trong nhiều trường hợp. Tài liệu JDK 26 vẫn nêu native method và foreign function là nguồn pinning.

Vì vậy recommendation “thay mọi synchronized bằng ReentrantLock” không còn đúng tổng quát cho JDK mới và có thể làm code phức tạp vô ích. Inventory runtime version, đo JFR/thread dumps và sửa hot pinning thực tế.

Pinning không làm kết quả sai; nó là vấn đề scalability. Một vài pinned calls hiếm không đồng nghĩa phải rewrite library.

## ThreadLocal và context
Virtual threads hỗ trợ `ThreadLocal`, nhưng số thread lớn làm per-thread state đắt nếu mỗi thread tạo object lớn. Không dùng ThreadLocal như cache/pool resource. Cleanup trong `finally`; kiểm logging/security context framework có propagate đúng tại task boundary.

ThreadLocal từng an toàn trong fixed worker pool không tự trở thành request scope chuẩn. Scoped values cung cấp mô hình context immutable có bounded lifetime ở JDK mới, nhưng adoption cũng phải theo status/version API.

## Structured concurrency: lifetime thành cây
Unstructured fan-out bằng futures dễ để task con sống sau request, failure một nhánh không hủy nhánh còn lại và trace không thể hiện quan hệ. Structured scope buộc owner fork, join và close trong một lexical block.

```java title="Jdk26PreviewScope.java"
// JDK 26 preview: compile và run với --enable-preview.
try (var scope = StructuredTaskScope.open()) {
  var customer = scope.fork(() -> customerClient.load(customerId));
  var basket = scope.fork(() -> basketClient.load(customerId));

  scope.join(); // mặc định: fail nếu một subtask thất bại
  return new Checkout(customer.get(), basket.get());
}
```

API JDK 26 mở scope với `Joiner` để chọn policy như tất cả thành công hoặc kết quả thành công đầu tiên. Close bảo đảm owner không đi qua scope khi subtasks chưa kết thúc. Tuy nhiên cancellation dùng interruption; subtask/client không phản ứng interruption có thể trì hoãn close.

:::warning Preview contract
Không copy snippet StructuredTaskScope giữa JDK 21, 22, 25 và 26 mà không đọc API của đúng release. Tên class/method/policy đã tiến hóa qua preview; CI phải pin toolchain và bật preview cả compile, test, runtime.
:::

## Deadline, cancellation và orphan work
Scope có thể cấu hình timeout ở API preview hiện tại, nhưng timeout chỉ hữu ích khi task con tôn trọng interrupt và I/O driver có timeout/cancellation. Deadline tổng phải được truyền xuống client. Hủy virtual thread không rollback external side effect đã commit.

Nếu một nhánh charge payment và nhánh khác load profile song song, fail-fast cancellation không tạo atomicity. Chỉ parallelize tasks độc lập và dùng idempotency/saga cho side effects.

## Migration playbook
1. Chọn endpoint blocking I/O có concurrency cao và dependency thread-safe.
2. Giữ baseline throughput, p95/p99, CPU, heap, connection wait và thread count.
3. Bật virtual-thread executor/container theo một canary.
4. Loại bỏ pool dùng chỉ để giới hạn threads; thêm bulkhead cho resource thật.
5. Quan sát pinning theo JDK version, ThreadLocal footprint và orphan work.
6. Load test overload, timeout, dependency chậm và graceful shutdown.
7. Chỉ thử structured concurrency trong module internal đã pin JDK preview.

## Khi giữ platform threads hoặc reactive
Platform pool phù hợp CPU-bound work cần giới hạn concurrency tự nhiên hoặc library phụ thuộc thread affinity/native behavior. Reactive vẫn có lợi khi stack ecosystem là non-blocking end-to-end, cần demand/backpressure stream và team vận hành tốt. Virtual threads làm imperative blocking code scale tốt hơn; chúng không thay Reactive Streams semantic.

## Production checklist
1. Ghi JDK vendor/version và preview flags trong artifact.
2. Không pool virtual threads; bound downstream resource.
3. Set connect/read/query timeout và propagate deadline.
4. Audit ThreadLocal, native calls và pinning theo runtime.
5. Đảm bảo task phản ứng interrupt/cancellation.
6. Canary với metrics saturation và tail latency.
7. Cô lập StructuredTaskScope preview sau internal boundary.

## Câu hỏi phỏng vấn
**Virtual thread có làm CPU task chạy nhanh hơn không?** Không. Nó giảm chi phí giữ nhiều thread chờ, chủ yếu tăng throughput cho blocking I/O concurrency cao.

**Structured concurrency đã final chưa?** Virtual threads đã final từ JDK 21; StructuredTaskScope vẫn là preview ở JDK 26 tại lần review này và cần `--enable-preview`.

## Key Takeaways
- Virtual thread dồi dào, nhưng connection/CPU/quota vẫn khan hiếm.
- Pinning guidance phải theo JDK version.
- Structured scope cải thiện lifetime/failure tree nhưng vẫn preview.
- Cancellation chỉ tốt bằng cooperation của subtask và dependency.
