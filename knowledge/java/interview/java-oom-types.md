---
id: java-oom-types
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - OutOfMemoryError
  - native-memory
  - diagnostics
relatedLessons:
  - java-jvm-memory
sources:
  - title: Java Virtual Machine Specification
    url: https://docs.oracle.com/javase/specs/jvms/se21/html/
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: Java troubleshooting guide
    url: https://docs.oracle.com/en/java/javase/21/troubleshoot/
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
rubric:
  dimensions:
    technicalCorrectness: 40
    completeness: 20
    reasoning: 15
    production: 10
    tradeoffs: 10
    communication: 5
  concepts:
    - id: outofmemoryerror
      required: true
      aliases:
        - OutOfMemoryError
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: native-memory
      required: true
      aliases:
        - native-memory
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: diagnostics
      required: false
      aliases:
        - diagnostics
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần tăng Xmx là sửa được mọi OutOfMemoryError.
      penalty: 20
---

# OutOfMemoryError có thể đến từ những vùng nào ngoài Java heap?

## Rubric

### Must Include

- OutOfMemoryError

- native-memory

### Strong Answer Includes

- diagnostics

## Câu trả lời 30 giây

Có thể hết heap, metaspace, direct buffer/native memory, thread stacks hoặc container memory limit. Vì vậy Xmx chưa chạm không loại trừ OOMKilled hay native allocation failure.

## Câu trả lời chi tiết

Heap chứa object; metaspace chứa class metadata; direct buffers và JNI dùng native; mỗi thread cần stack; code cache và GC structures cũng có overhead. Container OOM killer nhìn RSS/cgroup, không chỉ heap. Dùng NMT, GC logs, thread count, process metrics và container events để phân loại. Giảm Xmx đôi khi tạo headroom native, nhưng có thể tăng GC pressure.

## Góc nhìn Production

Dashboard heap/RSS/metaspace/direct/thread count cùng memory limit, alert theo headroom. Kiểm tra Netty/direct buffer leak và classloader churn trong redeploy.

## Trade-offs

Heap chứa object; metaspace chứa class metadata; direct buffers và JNI dùng native; mỗi thread cần stack; code cache và GC structures cũng có overhead. Container OOM killer nhìn RSS/cgroup, không chỉ heap. Dùng NMT, GC logs, thread count, process metrics và container events để phân loại. Giảm Xmx đôi khi tạo headroom native, nhưng có thể tăng GC pressure.

## Câu trả lời sai thường gặp

Chỉ cần tăng Xmx là sửa được mọi OutOfMemoryError.

## Follow-up

- OOMKilled khác Java OOM exception ra sao?

- Metaspace leak xuất hiện trong deployment nào?

## Nguồn chính thống

- [Oracle — Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se21/html/)
- [Oracle — Java troubleshooting guide](https://docs.oracle.com/en/java/javase/21/troubleshoot/)
