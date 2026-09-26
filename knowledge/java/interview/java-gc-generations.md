---
id: java-gc-generations
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - GC
  - young-generation
  - old-generation
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
    - id: gc
      required: true
      aliases:
        - GC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: young-generation
      required: true
      aliases:
        - young-generation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: old-generation
      required: false
      aliases:
        - old-generation
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi object bắt đầu ở stack rồi chuyển heap old sau một request.
      penalty: 20
---

# Vì sao heap thường phân thế hệ young và old?

## Rubric

### Must Include

- GC

- young-generation

### Strong Answer Includes

- old-generation

## Câu trả lời 30 giây

Object ngắn sống tập trung ở young nên collector có thể thu gom nhanh theo giả định generational hypothesis. Object sống lâu được promote sang old, nơi collection thường đắt hơn. Đây là implementation strategy, không phải mọi collector/version có layout giống hệt.

## Câu trả lời chi tiết

Allocation vào Eden, survivor tracking và promotion giúp young collection xử lý nhiều garbage với ít scanning old roots hơn. Premature promotion, humongous allocation hoặc allocation burst có thể làm old pressure tăng. G1 dùng regions và logical generations; ZGC cũng có chiến lược khác. Tuning phải dựa GC log, allocation rate và pause/p99.

## Góc nhìn Production

Theo dõi young/old occupancy, promotion rate, pause và allocation stalls. Đừng đặt NewRatio máy móc từ blog cũ khi JDK collector mặc định đã thay đổi.

## Trade-offs

Allocation vào Eden, survivor tracking và promotion giúp young collection xử lý nhiều garbage với ít scanning old roots hơn. Premature promotion, humongous allocation hoặc allocation burst có thể làm old pressure tăng. G1 dùng regions và logical generations; ZGC cũng có chiến lược khác. Tuning phải dựa GC log, allocation rate và pause/p99.

## Câu trả lời sai thường gặp

Mọi object bắt đầu ở stack rồi chuyển heap old sau một request.

## Follow-up

- Promotion failure là gì?

- Humongous object ảnh hưởng collector nào?

## Nguồn chính thống

- [Oracle — Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)
- [Oracle — Troubleshoot Performance Issues Using JFR](https://docs.oracle.com/en/java/javase/21/troubleshoot/troubleshoot-performance-issues-using-jfr.html)
- [Oracle — jcmd Manual](https://docs.oracle.com/en/java/javase/21/docs/specs/man/jcmd.html)
