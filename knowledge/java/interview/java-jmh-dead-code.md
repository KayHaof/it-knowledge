---
id: java-jmh-dead-code
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - JMH
  - benchmark
  - dead-code
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
    - id: jmh
      required: true
      aliases:
        - JMH
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: benchmark
      required: true
      aliases:
        - benchmark
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: dead-code
      required: false
      aliases:
        - dead-code
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - System.nanoTime quanh một vòng lặp luôn đo chính xác tốc độ method production.
      penalty: 20
---

# Vì sao benchmark Java bằng vòng lặp thủ công dễ cho kết quả sai?

## Rubric

### Must Include

- JMH

- benchmark

### Strong Answer Includes

- dead-code

## Câu trả lời 30 giây

JIT có thể loại bỏ dead code, constant-fold hoặc tối ưu warmup chưa đủ; timer và GC còn làm nhiễu. JMH dùng Blackhole, forks và harness để giảm các sai lệch này.

## Câu trả lời chi tiết

Benchmark cần xác định operation, input distribution, state scope và mode throughput/sample. Nếu kết quả không được consume, compiler có thể bỏ toàn bộ method. Một JVM process giữ profile từ test trước; forks cô lập. Benchmark micro không mô phỏng network/DB, nên phải kết hợp JFR và load test end-to-end.

## Góc nhìn Production

Version-control benchmark, report variance/confidence và chạy trên hardware/JDK đại diện. Không tối ưu dựa trên một lần local run.

## Trade-offs

Benchmark cần xác định operation, input distribution, state scope và mode throughput/sample. Nếu kết quả không được consume, compiler có thể bỏ toàn bộ method. Một JVM process giữ profile từ test trước; forks cô lập. Benchmark micro không mô phỏng network/DB, nên phải kết hợp JFR và load test end-to-end.

## Câu trả lời sai thường gặp

System.nanoTime quanh một vòng lặp luôn đo chính xác tốc độ method production.

## Follow-up

- Warmup nên dài bao lâu?

- Benchmark allocation và throughput khác nhau thế nào?

## Nguồn chính thống

- [Oracle — Troubleshoot Performance Issues Using Flight Recorder — JDK 26](https://docs.oracle.com/en/java/javase/26/troubleshoot/troubleshoot-performance-issues-using-jfr.html)
- [Oracle — Flight Recorder Configurations — JDK 26](https://docs.oracle.com/en/java/javase/26/jfapi/flight-recorder-configurations.html)
- [Oracle — The jfr Command — JDK 26](https://docs.oracle.com/en/java/javase/26/docs/specs/man/jfr.html)
- [Oracle — jdk.jfr Package API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/jdk.jfr/jdk/jfr/package-summary.html)
- [OpenJDK — OpenJDK Code Tools — JMH](https://openjdk.org/projects/code-tools/jmh/)
