---
id: java-concurrency
slug: java-concurrency-virtual-threads
title: Java Concurrency và Virtual Threads
description: Race condition, happens-before, executor và cách đánh giá virtual thread cho workload I/O-bound.
category: backend
technology: Java
level: advanced
estimatedMinutes: 35
tags: ["java","concurrency","virtual-threads","happens-before","executor"]
prerequisites: ["java-jvm-memory"]
related: ["spring-mvc-webflux","high-concurrency"]
next: spring-mvc-webflux
learningObjectives: ["Giải thích visibility và atomicity","Chọn synchronization primitive theo invariant","Biết virtual thread cải thiện throughput khi nào"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"Virtual Threads","url":"https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Java Language Specification - Memory Model","url":"https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"}]
---
## Concurrency không chỉ là nhiều thread
Concurrency là quản lý nhiều task có thời gian sống chồng lấp; parallelism là thực thi thật sự cùng lúc. Lỗi khó nhất thường đến từ shared mutable state: lost update, stale read và invariant bị phá vỡ.

```java title="UnsafeCounter.java"
final class UnsafeCounter {
  private int value;
  void increment() { value++; } // read + add + write, không atomic
}
```

## Atomicity, visibility, ordering
volatile đảm bảo visibility và thiết lập quan hệ happens-before cho read/write tương ứng, nhưng không biến chuỗi read-modify-write thành atomic. synchronized và Lock có thể bảo vệ critical section nhiều bước. AtomicInteger phù hợp cho atomic update đơn giản; concurrent collection bảo vệ cấu trúc nhưng không tự bảo vệ invariant xuyên nhiều collection.

:::interview Câu bẫy
volatile int count; count++ vẫn có race condition. Hai thread có thể đọc cùng một giá trị rồi cùng ghi kết quả tăng một lần.
:::

## Executor và bounded resource
Executor tách submission khỏi execution. Pool size là cơ chế kiểm soát resource, nhưng queue không giới hạn có thể biến overload thành latency và memory growth. Chọn rejection/backpressure có chủ ý; timeout và cancellation phải truyền qua call chain.

## Virtual threads
Virtual thread vẫn là java.lang.Thread nhưng không gắn độc quyền với một OS thread. Khi blocking I/O được runtime hỗ trợ, virtual thread có thể unmount để carrier thread chạy task khác. Chúng tăng khả năng phục vụ nhiều task chờ I/O; không làm CPU code chạy nhanh hơn và không loại bỏ giới hạn database connection, downstream QPS hay memory.

```java title="VirtualThreadExample.java"
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
  Future<Order> order = executor.submit(() -> repository.load(orderId));
  return order.get();
}
```

:::production Production checklist
Đo carrier pinning, connection-pool wait, downstream saturation và allocation. Không pool virtual threads; hãy giới hạn resource khan hiếm bằng semaphore hoặc pool của chính resource.
:::

## Failure scenarios
- Deadlock: lock ordering không nhất quán.
- Starvation: task không được cấp CPU/resource.
- Queue explosion: producer nhanh hơn consumer.
- ThreadLocal retention: dữ liệu sống quá lâu trong worker pool.
- Timeout giả: request bị cancel nhưng công việc downstream vẫn chạy.

## Trả lời phỏng vấn
Virtual thread phù hợp server thread-per-request có nhiều blocking I/O. Nó cải thiện throughput bằng cách giảm chi phí thread chờ, không giảm latency của một query và không tăng capacity database. Cần load test, quan sát pinning và giữ bulkhead cho downstream.

## Key Takeaways
- Xác định invariant trước khi chọn lock/atomic.
- volatile cho visibility, không tự bảo đảm compound atomicity.
- Queue và pool phải có giới hạn gắn với overload policy.
- Virtual threads là scale cho blocking I/O, không phải “thread nhanh hơn”.
