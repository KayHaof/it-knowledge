---
id: java-completable-future
slug: java-completable-future
title: CompletableFuture — Composition, Timeout và Cancellation
description: Điều phối tác vụ bất đồng bộ bằng CompletableFuture với executor ownership, failure propagation và deadline thực tế.
category: backend
technology: Java
level: advanced
estimatedMinutes: 46
tags: ["java","completablefuture","async","timeout","cancellation"]
prerequisites: ["java-concurrency"]
related: ["java-streams-optional","spring-mvc-webflux","high-concurrency"]
next: java-jvm-gc-profiling
learningObjectives: ["Phân biệt composition với blocking join","Thiết kế executor, timeout và error taxonomy","Hiểu giới hạn cancellation trong call chain"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"CompletableFuture API","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"CompletionStage API","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletionStage.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Executors API","url":"https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Executors.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: graph của các stage
`CompletableFuture` vừa là kết quả sẽ hoàn tất trong tương lai, vừa triển khai `CompletionStage` để ghép một graph công việc. Giá trị lớn nhất là composition: stage sau được đăng ký để chạy khi dependency hoàn tất, thay vì thread hiện tại gọi `get` hoặc `join` và chờ.

```java title="CheckoutQuery.java"
CompletableFuture<Customer> customer =
    CompletableFuture.supplyAsync(() -> customerClient.load(customerId), ioExecutor);
CompletableFuture<List<Item>> items =
    CompletableFuture.supplyAsync(() -> catalogClient.load(skus), ioExecutor);

return customer.thenCombine(items, CheckoutView::new)
    .orTimeout(800, TimeUnit.MILLISECONDS);
```

Hai call độc lập có thể chạy đồng thời; `thenCombine` chỉ chạy khi cả hai thành công. Nếu call thứ hai phụ thuộc kết quả thứ nhất, dùng `thenCompose` để làm phẳng `CompletableFuture<CompletableFuture<T>>`.

## Sync hay Async suffix
Stage không có hậu tố `Async` có thể chạy bởi thread hoàn tất stage trước; không nên giả định đó là caller thread. Stage có `Async` nhưng không truyền executor thường dùng default asynchronous execution facility, phổ biến là common ForkJoinPool. Trong service, truyền executor có ownership rõ để tách workload và quan sát saturation.

Executor phải bounded theo resource downstream. Pool/queue khổng lồ không tạo thêm database connection hay QPS; nó chỉ giữ nhiều request chờ hơn. Với virtual threads, không cần pool để tái sử dụng thread, nhưng vẫn cần semaphore, rate limiter hoặc connection pool để giới hạn resource khan hiếm.

## Failure propagation
Khi supplier ném exception, future hoàn tất exceptionally. `join` bọc lỗi trong `CompletionException`; `get` dùng checked `ExecutionException`. `exceptionally` biến failure thành fallback, `handle` nhìn cả value và error, còn `whenComplete` phù hợp cho side effect quan sát nhưng không nên âm thầm nuốt lỗi.

```java title="FailureMapping.java"
return pricingFuture
    .thenApply(Price::requireCurrent)
    .exceptionallyCompose(error -> {
      Throwable cause = unwrap(error);
      if (cause instanceof PriceNotFound) {
        return CompletableFuture.completedFuture(Price.unavailable());
      }
      return CompletableFuture.failedFuture(cause);
    });
```

Fallback chỉ dành cho failure đã hiểu. Trả giá mặc định cho timeout, authorization error và data corruption như nhau sẽ biến outage thành dữ liệu sai.

## Timeout, deadline và cancellation
`orTimeout` làm future hoàn tất exceptionally khi hết thời gian; `completeOnTimeout` cung cấp fallback. Nhưng timeout ở orchestration không bảo đảm socket, database query hoặc remote computation đã dừng. Client/driver phía dưới cũng cần connect/read/query timeout và khả năng hủy.

Deadline là ngân sách còn lại cho toàn request. Nếu mỗi trong ba call tuần tự có timeout 1 giây, tổng có thể vượt deadline 1 giây của caller. Truyền remaining budget xuống các boundary và chừa thời gian serialize/return.

`cancel(true)` trên `CompletableFuture` không mang cùng cam kết interrupt computation như `FutureTask`; API mô tả `mayInterruptIfRunning` không có tác dụng trong implementation này. Vì vậy, cancellation phải là protocol hợp tác của cả call chain.

:::production Orphan work
Caller đã timeout nhưng remote call vẫn chạy là orphan work. Khi tải tăng, công việc vô ích tiếp tục giữ thread, connection và quota, tạo feedback loop khiến hệ thống càng chậm.
:::

## Fan-out có giới hạn
Tạo một future cho mỗi trong hàng chục nghìn phần tử có thể làm queue và memory bùng nổ. Chia batch, giới hạn concurrency và quyết định partial result. `allOf` chỉ báo tất cả hoàn tất, không tự gom typed results và không fail-fast theo nghĩa dừng các task còn lại.

```java title="CollectResults.java"
CompletableFuture<Void> all =
    CompletableFuture.allOf(tasks.toArray(CompletableFuture[]::new));
return all.thenApply(ignored ->
    tasks.stream().map(CompletableFuture::join).toList());
```

Đoạn `join` sau `allOf` không block khi tất cả đã thành công, nhưng vẫn cần policy nếu một task thất bại: fail toàn bộ, best effort hay quorum.

## Failure scenarios
- Gọi `join` ngay sau `supplyAsync`: thêm scheduling nhưng vẫn block tuần tự.
- Callback blocking trên common pool: starvation và ảnh hưởng module không liên quan.
- `exceptionally` trả `null`: failure biến thành NPE ở stage xa nguyên nhân.
- Retry từng nhánh fan-out không jitter/budget: nhân tải lúc downstream suy yếu.
- Giữ request context trong lambda sống lâu: tăng retention và log sai correlation.

## Production checklist
1. Vẽ dependency graph; chỉ chạy song song các nhánh độc lập.
2. Truyền executor riêng và đo active threads, queue, rejection.
3. Đặt timeout ở cả orchestration lẫn I/O client/driver.
4. Phân loại lỗi trước fallback/retry.
5. Giới hạn fan-out và định nghĩa partial-result semantics.
6. Propagate trace/correlation context có chủ đích.

## Câu hỏi phỏng vấn
**`thenApply` khác `thenCompose`?** `thenApply` ánh xạ `T -> U`; `thenCompose` ghép hàm `T -> CompletionStage<U>` và làm phẳng stage lồng nhau.

**Timeout future có dừng công việc không?** Không nhất thiết. Nó thay trạng thái quan sát của future; việc dừng I/O/computation phụ thuộc cancellation support của resource phía dưới.

## Key Takeaways
- CompletableFuture hữu ích ở composition, không phải ở việc bọc mọi call bằng async.
- Executor và downstream capacity phải được quản lý cùng nhau.
- Timeout không đồng nghĩa cancellation.
- Fan-out cần giới hạn, deadline và failure policy rõ.
