---
id: java-exceptions-resource-safety
slug: java-exceptions-resource-safety
title: Java Exceptions và Resource Safety
description: Thiết kế exception taxonomy, bảo toàn nguyên nhân, đóng resource đúng với try-with-resources và xử lý interruption theo contract.
category: backend
technology: Java
level: beginner
estimatedMinutes: 43
tags: ["java","exceptions","try-with-resources","error-handling","interruption"]
prerequisites: ["java-object-contracts"]
related: ["spring-rest-validation-errors","spring-testing-strategy"]
next: java-io-nio-files
learningObjectives: ["Chọn checked hoặc unchecked exception theo recovery contract","Giải thích primary và suppressed exception","Giữ nguyên cause, interrupt status và failure taxonomy"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"Java Language Specification — Exceptions","url":"https://docs.oracle.com/javase/specs/jls/se26/html/jls-11.html","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"},{"title":"AutoCloseable API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/AutoCloseable.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Throwable API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Throwable.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: exception là một nhánh kết quả
Exception là cơ chế chuyển control flow ra khỏi đường chạy bình thường khi method không thể hoàn thành contract. Nó không chỉ là message để log. Type, cause và nơi bắt exception quyết định caller có thể retry, sửa input, trả lỗi nghiệp vụ hay dừng process.

`Throwable` có hai nhánh chính: `Error` biểu diễn vấn đề nghiêm trọng mà application thường không nên coi là recoverable; `Exception` biểu diễn failure application có thể cần xử lý. `RuntimeException` và subclasses là unchecked. Checked exception phải được catch hoặc khai báo, nhưng compiler không thể quyết định recovery policy thay kiến trúc.

Một exception tốt trả lời:

- Operation nào thất bại?
- Lỗi thuộc input, business state, dependency hay programming defect?
- Có retry an toàn không?
- Cause gốc còn được giữ không?
- Boundary nào chịu trách nhiệm map/log?

## Checked hay unchecked
Checked exception hợp lý khi caller gần đó có hành động phục hồi bắt buộc và hữu ích, ví dụ một API thư viện yêu cầu xử lý I/O failure. Unchecked exception hợp lý cho violated precondition, invariant, hoặc failure được xử lý tập trung ở boundary. Đây không phải luật “business là checked, technical là unchecked”.

Đừng tạo một `ApplicationException` duy nhất cho mọi lỗi. Taxonomy nên đủ để policy phân biệt:

| Nhóm | Ví dụ policy |
|---|---|
| Validation | Trả chi tiết field an toàn, không retry |
| Business conflict | Trả conflict/state hiện tại |
| Not found | Trả theo disclosure policy |
| Dependency transient | Retry có budget nếu operation idempotent |
| Dependency permanent | Fail fast, không retry |
| Programming defect | Log/alert, không biến thành success |

## Translate ở boundary và giữ cause
Infrastructure exception không nên rò tới domain/API, nhưng translation phải giữ cause để điều tra.

```java title="CustomerRepositoryAdapter.java"
public Customer load(CustomerId id) {
  try {
    return jdbc.queryForObject(SQL, mapper, id.value());
  } catch (DataAccessException failure) {
    throw new CustomerStoreUnavailable(
        "Cannot load customer " + id.safeValue(), failure);
  }
}
```

Message không chứa SQL parameter nhạy cảm. Cause cho phép trace giữ stack gốc. Catch rồi `throw new ...("failed")` không cause làm mất bằng chứng; catch chỉ để log rồi rethrow thường tạo log trùng ở nhiều layer.

:::production Log once
Thông thường layer xử lý cuối cùng biết outcome và correlation ID nên log. Layer thấp thêm context bằng exception/cause hoặc structured event; không log cùng stack trace ở repository, service, controller và gateway.
:::

## Try-with-resources và suppressed exception
Resource như stream, channel, socket hoặc JDBC object phải đóng dù body thành công hay ném lỗi. Try-with-resources gọi `close` tự động theo thứ tự ngược với khai báo.

```java title="CsvReader.java"
List<String> firstLines(Path path) throws IOException {
  try (BufferedReader reader = Files.newBufferedReader(path, UTF_8)) {
    return reader.lines().limit(100).toList();
  }
}
```

Nếu body ném exception rồi `close` cũng ném, exception từ body vẫn là primary; lỗi khi đóng được gắn bằng `getSuppressed()`. Đây là khác biệt quan trọng với `finally` viết sai, nơi lỗi close có thể che nguyên nhân ban đầu.

```java title="SuppressedFailure.java"
try {
  importFile(path);
} catch (ImportFailed failure) {
  logger.error("Import failed", failure);
  for (Throwable suppressed : failure.getSuppressed()) {
    logger.warn("Cleanup also failed", suppressed);
  }
}
```

Không phải mọi `AutoCloseable.close` đều idempotent; contract cụ thể của resource quyết định. Ownership phải rõ: method tạo resource thường đóng nó, còn resource được caller truyền vào thường do caller sở hữu.

## Catch chính xác và không nuốt lỗi
Catch type hẹp giúp policy rõ. `catch (Exception)` ở loop worker có thể hợp lệ tại isolation boundary để một message lỗi không giết worker, nhưng phải record failure và quyết định acknowledgement/retry/dead-letter. Catch rộng trong business code rồi tiếp tục với state nửa hoàn tất tạo corruption.

Không catch `Throwable` để “giữ service sống”; `VirtualMachineError` và lỗi nghiêm trọng khác không có recovery contract thông thường. Multi-catch phù hợp khi nhiều type có cùng policy thật sự, không chỉ để giảm dòng code.

Exception không nên dùng cho control flow phổ biến như “không tìm thấy trong cache”; return type hoặc branch rõ thường dễ đọc và ít tốn stack trace hơn.

## InterruptedException là cancellation signal
Khi thread bị interrupt, blocking operation có thể ném `InterruptedException` và xóa interrupt status. Nếu method không thể propagate checked exception, restore flag trước khi thoát:

```java title="InterruptHandling.java"
try {
  queue.put(command);
} catch (InterruptedException interrupted) {
  Thread.currentThread().interrupt();
  throw new CommandSubmissionCancelled("Submission interrupted", interrupted);
}
```

Nuốt interrupt làm shutdown/cancellation chậm hoặc treo. Không tự động retry vô hạn sau interrupt; đó thường là yêu cầu dừng.

## Retry cần exception taxonomy
Retry chỉ dành cho failure transient và operation idempotent hoặc có deduplication. `IOException` quá rộng để kết luận retry: DNS tạm thời, authentication sai và file không tồn tại có policy khác. Retry phải có deadline, giới hạn attempt, backoff/jitter và metric. Cause chain cần được unwrap có kiểm soát, không match message text.

## Failure scenarios
- `return` trong `finally` che exception và cả return value trước đó.
- Catch validation cùng với outage rồi trả `400`: client bị đổ lỗi cho server failure.
- Close stream do caller sở hữu: các stage sau nhận “stream closed”.
- Rethrow không cause: mất stack gốc.
- Retry exception sau khi side effect đã commit: tạo duplicate.
- Nuốt `InterruptedException`: deploy không graceful và task orphan.

## Production checklist
1. Document exception contract tại public/library boundary.
2. Phân loại retryable, client-correctable và fatal bằng type/code.
3. Giữ cause; sanitize message và metadata.
4. Dùng try-with-resources cho mọi owned resource.
5. Test suppressed exception và cleanup failure ở critical path.
6. Propagate hoặc restore interruption.
7. Log một lần tại boundary biết outcome.

## Câu hỏi phỏng vấn
**Nếu body và `close()` cùng ném lỗi, lỗi nào được throw?** Với try-with-resources, lỗi body là primary; lỗi close nằm trong suppressed exceptions.

**Khi nào dùng checked exception?** Khi API muốn ép caller xử lý một recovery decision có ý nghĩa. Không chọn chỉ dựa trên việc lỗi “nghiệp vụ” hay “kỹ thuật”.

## Key Takeaways
- Exception type là input cho recovery policy.
- Translation không được làm mất cause.
- Try-with-resources bảo toàn cả primary và cleanup failure.
- Interrupt là cancellation protocol, không phải lỗi để nuốt.
