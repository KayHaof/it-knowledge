---
id: java-jfr-jmh-difference
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - JFR
  - JMH
  - profiling
relatedLessons:
  - java-performance-jfr-jmh-diagnostics
sources:
  - title: Troubleshoot Performance Issues Using Flight Recorder — JDK 26
    url: https://docs.oracle.com/en/java/javase/26/troubleshoot/troubleshoot-performance-issues-using-jfr.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Flight Recorder Configurations — JDK 26
    url: https://docs.oracle.com/en/java/javase/26/jfapi/flight-recorder-configurations.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: The jfr Command — JDK 26
    url: https://docs.oracle.com/en/java/javase/26/docs/specs/man/jfr.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: jdk.jfr Package API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/jdk.jfr/jdk/jfr/package-summary.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OpenJDK Code Tools — JMH
    url: https://openjdk.org/projects/code-tools/jmh/
    organization: OpenJDK
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
    - id: jfr
      required: true
      aliases:
        - JFR
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: jmh
      required: true
      aliases:
        - JMH
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
        - JFR là công cụ benchmark chính xác cho một method và JMH dùng để debug production live.
      penalty: 20
---

# JFR và JMH trả lời hai câu hỏi khác nhau nào?

## Rubric

### Must Include

- JFR

- JMH

### Strong Answer Includes

- profiling

## Câu trả lời 30 giây

JFR quan sát ứng dụng đang chạy và các event runtime; JMH đo microbenchmark có harness chống warmup/dead-code elimination. Không dùng benchmark toy để kết luận production latency.

## Câu trả lời chi tiết

JMH fork/warmup/measurement giúp tách JIT và tránh benchmark sai; JFR ghi CPU sample, allocation, lock, GC với overhead thấp để tìm bottleneck hệ thống. Tôi dùng JMH xác nhận một primitive sau khi JFR chỉ ra hotspot, rồi kiểm integration/load test.

## Góc nhìn Production

Lưu profile theo build/JDK và workload; scrub dữ liệu nhạy cảm trong recordings.

## Trade-offs

JMH fork/warmup/measurement giúp tách JIT và tránh benchmark sai; JFR ghi CPU sample, allocation, lock, GC với overhead thấp để tìm bottleneck hệ thống. Tôi dùng JMH xác nhận một primitive sau khi JFR chỉ ra hotspot, rồi kiểm integration/load test.

## Câu trả lời sai thường gặp

JFR là công cụ benchmark chính xác cho một method và JMH dùng để debug production live.

## Follow-up

- Dead-code elimination làm benchmark sai thế nào?

- JFR event nào giúp tìm lock contention?

## Nguồn chính thống

- [Oracle — Troubleshoot Performance Issues Using Flight Recorder — JDK 26](https://docs.oracle.com/en/java/javase/26/troubleshoot/troubleshoot-performance-issues-using-jfr.html)
- [Oracle — Flight Recorder Configurations — JDK 26](https://docs.oracle.com/en/java/javase/26/jfapi/flight-recorder-configurations.html)
- [Oracle — The jfr Command — JDK 26](https://docs.oracle.com/en/java/javase/26/docs/specs/man/jfr.html)
- [Oracle — jdk.jfr Package API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/jdk.jfr/jdk/jfr/package-summary.html)
- [OpenJDK — OpenJDK Code Tools — JMH](https://openjdk.org/projects/code-tools/jmh/)
