---
id: java-g1-zgc-tradeoff
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - G1
  - ZGC
  - latency
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
    - id: g1
      required: true
      aliases:
        - G1
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: zgc
      required: true
      aliases:
        - ZGC
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: latency
      required: false
      aliases:
        - latency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - ZGC luôn nhanh hơn G1 ở mọi workload và không cần heap headroom.
      penalty: 20
---

# Chọn G1 hay ZGC dựa trên tiêu chí nào?

## Rubric

### Must Include

- G1

- ZGC

### Strong Answer Includes

- latency

## Câu trả lời 30 giây

G1 là collector đa mục tiêu với pause target và throughput tốt cho heap phổ biến; ZGC ưu tiên pause rất thấp trên heap lớn nhưng có trade-off CPU/throughput/version support. Chọn từ SLO và benchmark, không từ nhãn “mới hơn”.

## Câu trả lời chi tiết

Cả hai đều concurrent một phần nhưng cơ chế region/barrier khác nhau; pause thực tế phụ thuộc allocation, live set, heap headroom và humongous objects. Tôi kiểm JFR GC phases, pause p99, CPU và native memory dưới load đại diện. Tuning sai hoặc heap quá sát max đều làm collector khó đáp ứng.

## Góc nhìn Production

Pin JDK, collector flags và alert pause/old-gen/evacuation failure; canary trước đổi collector.

## Trade-offs

Cả hai đều concurrent một phần nhưng cơ chế region/barrier khác nhau; pause thực tế phụ thuộc allocation, live set, heap headroom và humongous objects. Tôi kiểm JFR GC phases, pause p99, CPU và native memory dưới load đại diện. Tuning sai hoặc heap quá sát max đều làm collector khó đáp ứng.

## Câu trả lời sai thường gặp

ZGC luôn nhanh hơn G1 ở mọi workload và không cần heap headroom.

## Follow-up

- Stop-the-world còn xảy ra ở collector concurrent không?

- Humongous allocation xử lý thế nào?

## Nguồn chính thống

- [Oracle — Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html)
- [Oracle — Troubleshoot Performance Issues Using JFR](https://docs.oracle.com/en/java/javase/21/troubleshoot/troubleshoot-performance-issues-using-jfr.html)
- [Oracle — jcmd Manual](https://docs.oracle.com/en/java/javase/21/docs/specs/man/jcmd.html)
