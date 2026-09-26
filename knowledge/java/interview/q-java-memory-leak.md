---
id: q-java-memory-leak
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - GC
  - memory-leak
  - profiling
relatedLessons:
  - java-jvm-gc-profiling
sources:
  - title: Java troubleshooting guide
    url: https://docs.oracle.com/en/java/javase/25/troubleshoot/
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
    - id: gc
      required: true
      aliases:
        - GC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: memory-leak
      required: true
      aliases:
        - memory-leak
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: profiling
      required: false
      aliases:
        - profiling
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Full GC sẽ luôn đưa heap về gần 0 nếu ứng dụng không có traffic.
      penalty: 20
---

# Java có Garbage Collection thì vì sao vẫn memory leak?

## Rubric

### Must Include

- GC

- memory-leak

### Strong Answer Includes

- profiling

## Câu trả lời 30 giây

GC chỉ thu object không còn reachable. Cache không giới hạn, listener không unregister, ThreadLocal hoặc classloader giữ reference khiến object vẫn reachable dù business không cần, nên heap vẫn tăng.

## Câu trả lời chi tiết

Tôi phân biệt allocation burst, live-set hợp lệ và retained object bất thường. Dùng GC log/heap histogram để xác định trend, heap dump và dominator/retained path để tìm owner. Tăng Xmx chỉ mua thời gian nếu retention sai; leak có thể nằm ngoài heap như direct buffer hoặc native memory nên phải so heap với RSS.

## Deep Dive

Một leak production phải được chứng minh qua nhiều GC cycle và workload ổn định. Root path quan trọng hơn class có nhiều instance vì owner mới chỉ ra nơi sửa lifecycle.

## Góc nhìn Production

Chuẩn bị dump destination/disk budget, redaction và Native Memory Tracking policy trước incident; soak test sau fix.

## Trade-offs

Một leak production phải được chứng minh qua nhiều GC cycle và workload ổn định. Root path quan trọng hơn class có nhiều instance vì owner mới chỉ ra nơi sửa lifecycle.

## Câu trả lời sai thường gặp

Full GC sẽ luôn đưa heap về gần 0 nếu ứng dụng không có traffic.

## Follow-up

- Phân biệt OOME và OOMKilled?

- Dominator tree cho biết gì?

## Nguồn chính thống

- [Oracle — Java troubleshooting guide](https://docs.oracle.com/en/java/javase/25/troubleshoot/)
