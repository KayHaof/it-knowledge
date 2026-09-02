---
id: java-io-nio-files
slug: java-io-nio-files
title: Java I/O và NIO.2 — Files, Paths và Atomic Publish
description: Làm việc an toàn với Path, Files, streams và channels; kiểm soát encoding, partial I/O, symlink, traversal và file replacement.
category: backend
technology: Java
level: intermediate
estimatedMinutes: 50
tags: ["java","io","nio","files","path-security"]
prerequisites: ["java-exceptions-resource-safety"]
related: ["java-jvm-gc-profiling","performance-diagnosis"]
next: java-memory-model-locks-atomics
learningObjectives: ["Phân biệt path logic với file system object","Xử lý streaming và partial channel operations","Thiết kế write-publish an toàn trước crash và input độc hại"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+"}
sources: [{"title":"Path API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/nio/file/Path.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Files API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/nio/file/Files.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"FileChannel API","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/nio/channels/FileChannel.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: Path chưa chắc là file
`Path` là biểu diễn vị trí theo một `FileSystem`; nó có thể tương đối, tuyệt đối, normalized hoặc chứa symlink. Tạo `Path` không truy cập disk và không chứng minh target tồn tại. Các operation của `Files` mới hỏi file system.

```java title="PathResolution.java"
Path configuredRoot = Path.of("/srv/imports").toAbsolutePath().normalize();
Path candidate = configuredRoot.resolve(clientName).normalize();
if (!candidate.startsWith(configuredRoot)) {
  throw new InvalidPathRequest();
}
```

Check trên ngăn lexical `../` escape, nhưng symlink có thể làm target thật đi ra ngoài root. Với target đã tồn tại, cân nhắc `toRealPath` và so root thật; với file mới, cần directory được kiểm soát, policy symlink và quyền OS. Application check không thay filesystem permissions/sandbox.

## Text luôn có encoding
Không dùng default charset cho protocol hoặc persisted file. Default phụ thuộc môi trường và có thể đổi giữa máy dev/container. Khai báo `UTF_8` hoặc encoding của contract.

```java title="ReadConfig.java"
try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
  String header = reader.readLine();
  validateHeader(header);
}
```

Đọc toàn file bằng `readString`/`readAllBytes` thuận tiện nhưng memory tỷ lệ kích thước input. File upload, log, archive và export phải stream, đồng thời giới hạn số byte/line/record. “File trên disk” không có nghĩa đủ nhỏ để đưa vào heap.

`Files.lines` trả stream giữ open file; nó phải nằm trong try-with-resources. Terminal operation xong không chuyển ownership cho GC một cách đáng tin.

## Stream và buffer
`InputStream.read(byte[])` có thể trả ít byte hơn buffer và `-1` mới là EOF. Không giả định một lần read điền đủ message. `readNBytes` có contract tiện hơn nhưng vẫn phải giới hạn input. Khi parse binary protocol, kiểm length trước allocation để tránh integer overflow và memory abuse.

Buffering giảm system calls nhỏ, nhưng buffer càng lớn không luôn nhanh hơn. Đo workload và tránh copy nhiều lớp: HTTP framework đã buffer, application lại copy sang byte array, rồi SDK copy tiếp.

## Channel và partial operation
NIO channel làm việc với `ByteBuffer`. `FileChannel.read`/`write` có thể xử lý ít byte hơn `remaining`; loop tới khi hoàn thành hoặc không còn progress theo contract.

```java title="WriteFully.java"
static void writeFully(FileChannel channel, ByteBuffer data) throws IOException {
  while (data.hasRemaining()) {
    channel.write(data);
  }
}
```

`ByteBuffer` có position, limit và capacity. Sau khi ghi dữ liệu vào buffer rồi muốn channel đọc, gọi `flip`; muốn tái sử dụng, `clear` hoặc `compact` theo phần dữ liệu còn lại. Nhiều bug NIO là state-machine bug của buffer chứ không phải disk.

File channel hỗ trợ position, scatter/gather, transfer và locking, nhưng thread-safety/atomicity tùy operation. File lock có phạm vi process/filesystem và không phải distributed lock đáng tin cho mọi storage.

## Atomic publish pattern
Ghi trực tiếp file đích khiến reader thấy nội dung nửa chừng khi process crash. Một pattern:

1. Tạo temp file trong cùng directory/filesystem.
2. Ghi toàn bộ, flush/force nếu durability contract cần.
3. Validate checksum/schema.
4. Move temp sang tên đích với atomic move nếu filesystem hỗ trợ.
5. Có cleanup cho temp orphan.

```java title="AtomicPublisher.java"
Path temp = Files.createTempFile(target.getParent(), ".upload-", ".tmp");
try {
  writeAndValidate(temp, input);
  Files.move(temp, target,
      StandardCopyOption.ATOMIC_MOVE,
      StandardCopyOption.REPLACE_EXISTING);
} catch (AtomicMoveNotSupportedException unsupported) {
  throw new PublishNotSupported(target, unsupported);
} finally {
  Files.deleteIfExists(temp);
}
```

Không âm thầm fallback non-atomic nếu consumer dựa vào atomic visibility. `ATOMIC_MOVE` không tự đảm bảo mọi durability guarantee sau power loss; storage/filesystem contract và `force` cần được xác định riêng.

## Directory traversal và archive extraction
Filename từ user không phải path đáng tin. Ngoài normalize/root check, cần reject absolute path, path separator bất ngờ, reserved name và length/cardinality quá mức. Khi giải nén archive, mỗi entry phải resolve dưới destination; archive có thể chứa `../`, absolute paths, symlink hoặc decompression bomb.

Không dùng filename gốc làm storage key duy nhất. Tạo server-side ID và lưu display name như metadata đã sanitize. MIME/extension không chứng minh nội dung; kiểm magic/schema bằng parser an toàn.

## File traversal và symlink
`Files.walk`/`walkFileTree` có thể gặp permission error, cycle và tree thay đổi trong lúc duyệt. Decide follow symlink hay không, giới hạn depth/count, đóng returned stream. Check-then-act có race: file có thể bị đổi sau validation; directory do attacker kiểm soát cần OS-level isolation và API mở file an toàn phù hợp platform.

## WatchService không phải event log
File watch có thể coalesce/drop/overflow event và khác nhau theo platform. Nó phù hợp trigger “hãy rescan”, không phải nguồn duy nhất cho exactly-once processing. Persist checkpoint/idempotency và scan reconciliation định kỳ nếu mất event gây hậu quả.

## Failure scenarios
- Dùng default charset: dữ liệu đúng ở máy dev nhưng hỏng trong image khác.
- `readAllBytes` trên upload không giới hạn: OOM.
- Move temp ở filesystem khác: không atomic hoặc thất bại.
- Chỉ normalize mà bỏ symlink: path escape.
- Ghi file đích tại chỗ: reader thấy partial content.
- Không đóng stream từ `Files.walk`: rò file descriptor.

## Production checklist
1. Khai báo charset, newline và schema.
2. Giới hạn byte, record, depth và số file.
3. Stream dữ liệu lớn, đóng mọi owned resource.
4. Test partial read/write và disk-full.
5. Xác định atomicity/durability contract của filesystem.
6. Bảo vệ traversal, symlink và archive bomb.
7. Metric disk space, I/O latency, open descriptors và cleanup failures.

## Câu hỏi phỏng vấn
**`normalize()` có ngăn mọi path traversal không?** Không. Nó xử lý thành phần `.`/`..` ở mức lexical; symlink và race với filesystem vẫn cần policy/kiểm soát khác.

**Tại sao channel write cần loop?** API không cam kết một lần write tiêu thụ toàn buffer; kết quả có thể là partial write.

## Key Takeaways
- Path là tên logic; real path phụ thuộc filesystem và symlink.
- File lớn cần streaming và limit.
- Partial I/O là behavior hợp lệ phải xử lý.
- Publish an toàn cần temp, validate và atomic move theo contract.
