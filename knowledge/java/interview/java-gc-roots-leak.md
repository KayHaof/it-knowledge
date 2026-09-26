---
id: java-gc-roots-leak
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - GC roots
  - memory leak
  - heap dump
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
    - id: gc-roots
      required: true
      aliases:
        - GC roots
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: memory-leak
      required: true
      aliases:
        - memory leak
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: heap-dump
      required: false
      aliases:
        - heap dump
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - GC sẽ thu gom mọi object không còn biến local, bất kể static/cache còn tham chiếu.
      penalty: 20
---

# Java vẫn có memory leak dù có garbage collector không?

## Rubric

### Must Include

- GC roots

- memory leak

### Strong Answer Includes

- heap dump

## Câu trả lời 30 giây

Có. Object không dùng nhưng còn reachable từ GC root như static map, thread local, listener hoặc cache thì không được thu gom. Leak là vấn đề reachability, không phải chỉ malloc/free.

## Câu trả lời chi tiết

Heap dump dominator tree cho thấy object giữ retained heap; tôi tìm path tới root và kiểm lifecycle của executor, ThreadLocal, cache key/listener. WeakReference có thể phù hợp metadata nhưng không thay policy eviction. So sánh old-gen occupancy sau full GC và allocation rate để phân biệt leak với traffic burst.

## Góc nhìn Production

Alert post-GC heap, promotion, allocation rate; giới hạn cache và cleanup hook.

## Trade-offs

Heap dump dominator tree cho thấy object giữ retained heap; tôi tìm path tới root và kiểm lifecycle của executor, ThreadLocal, cache key/listener. WeakReference có thể phù hợp metadata nhưng không thay policy eviction. So sánh old-gen occupancy sau full GC và allocation rate để phân biệt leak với traffic burst.

## Câu trả lời sai thường gặp

GC sẽ thu gom mọi object không còn biến local, bất kể static/cache còn tham chiếu.

## Follow-up

- ThreadLocal leak trong pool xảy ra thế nào?

- Heap dump production cần bảo vệ dữ liệu ra sao?

## Nguồn chính thống

- [Oracle — Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)
- [Oracle — Troubleshoot Performance Issues Using JFR](https://docs.oracle.com/en/java/javase/21/troubleshoot/troubleshoot-performance-issues-using-jfr.html)
- [Oracle — jcmd Manual](https://docs.oracle.com/en/java/javase/21/docs/specs/man/jcmd.html)
