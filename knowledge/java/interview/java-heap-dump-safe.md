---
id: java-heap-dump-safe
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - heap-dump
  - OOM
  - operations
relatedLessons:
  - java-jvm-gc-profiling
sources:
  - title: Garbage Collection Tuning Guide
    url: https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Troubleshoot Performance Issues Using JFR
    url: https://docs.oracle.com/en/java/javase/21/troubleshoot/troubleshoot-performance-issues-using-jfr.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: jcmd Manual
    url: https://docs.oracle.com/en/java/javase/21/docs/specs/man/jcmd.html
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
    - id: heap-dump
      required: true
      aliases:
        - heap-dump
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: oom
      required: true
      aliases:
        - OOM
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: operations
      required: false
      aliases:
        - operations
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Heap dump luôn an toàn vì chỉ đọc memory và không chứa dữ liệu production nhạy cảm.
      penalty: 20
---

# Bạn lấy heap dump khi service gần OOM mà không làm incident tệ hơn thế nào?

## Rubric

### Must Include

- heap-dump

- OOM

### Strong Answer Includes

- operations

## Câu trả lời 30 giây

Đánh giá disk, process/container headroom và dump tooling trước; dump có thể pause hoặc tiêu tốn I/O lớn. Nếu an toàn, capture live/non-live dump theo mục tiêu, bảo vệ dữ liệu nhạy cảm và phân tích dominator/retained size offline.

## Câu trả lời chi tiết

Heap dump trả lời retained object graph, còn JFR/GC log trả lời allocation timeline. Khi OOM, `HeapDumpOnOutOfMemoryError` có thể cần disk provision trước; dump nên nằm ngoài volume phục vụ latency. Không lấy nhiều dump lặp lại trong outage, và không upload PII tùy tiện. Sau triage, fix lifetime/retention thay vì chỉ tăng Xmx.

## Góc nhìn Production

Runbook cần threshold, permission, encryption, retention và kill/restart decision. Correlate heap, GC, RSS/native memory và traffic để tránh chẩn đoán nhầm heap leak.

## Trade-offs

Heap dump trả lời retained object graph, còn JFR/GC log trả lời allocation timeline. Khi OOM, `HeapDumpOnOutOfMemoryError` có thể cần disk provision trước; dump nên nằm ngoài volume phục vụ latency. Không lấy nhiều dump lặp lại trong outage, và không upload PII tùy tiện. Sau triage, fix lifetime/retention thay vì chỉ tăng Xmx.

## Câu trả lời sai thường gặp

Heap dump luôn an toàn vì chỉ đọc memory và không chứa dữ liệu production nhạy cảm.

## Follow-up

- Retained size khác shallow size thế nào?

- Native memory leak điều tra bằng gì?

## Nguồn chính thống

- [Oracle — Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)
- [Oracle — Troubleshoot Performance Issues Using JFR](https://docs.oracle.com/en/java/javase/21/troubleshoot/troubleshoot-performance-issues-using-jfr.html)
- [Oracle — jcmd Manual](https://docs.oracle.com/en/java/javase/21/docs/specs/man/jcmd.html)
