---
id: q-jfr-jmh-evidence
type: interview-question
technology: Performance
category: Performance
difficulty: senior
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
        - Chỉ cần benchmark method bằng System.nanoTime một vòng lặp; kết quả nhanh hơn đồng nghĩa production cải thiện tương ứng.
      penalty: 20
---

# Bạn dùng JFR và JMH khác nhau thế nào khi điều tra API Java chậm?

## Rubric

### Must Include

- JFR

- JMH

### Strong Answer Includes

- profiling

## Câu trả lời 30 giây

JFR thu evidence của workload thật như CPU samples, allocation, GC, locks, I/O và virtual-thread pinning. JMH kiểm một giả thuyết micro-level trong harness chống JIT traps. JMH nhanh hơn không chứng minh endpoint production nhanh hơn.

## Câu trả lời chi tiết

Tôi bắt đầu từ SLO/trace để chọn cửa sổ JFR, cấu hình overhead phù hợp và correlate request, allocation, safepoint, lock, socket/file cùng downstream waits. Khi profile chỉ ra một hot method và có thay đổi cô lập được, tôi viết JMH với forks, warmup, measurement, consumed result, state scope và representative input. Sau microbenchmark vẫn phải load/canary test vì cache, contention, DB/network và tail latency không nằm trong phép đo nhỏ.

## Deep Dive

Dead-code elimination, constant folding, thiếu fork hoặc benchmark setup thay vì operation đều tạo số đẹp giả. Sample profiler cho attribution thống kê, không phải exact accounting từng request.

## Góc nhìn Production

Giữ JFR ring buffer/disk/privacy budget và runbook dump trước restart. Báo version, flags, hardware, data và uncertainty; xác minh CPU, allocation, p99 và error rate sau tối ưu.

## Trade-offs

Dead-code elimination, constant folding, thiếu fork hoặc benchmark setup thay vì operation đều tạo số đẹp giả. Sample profiler cho attribution thống kê, không phải exact accounting từng request.

## Câu trả lời sai thường gặp

Chỉ cần benchmark method bằng System.nanoTime một vòng lặp; kết quả nhanh hơn đồng nghĩa production cải thiện tương ứng.

## Follow-up

- Tại sao JMH cần warmup và forks?

- JFR event nào giúp phân biệt CPU với lock/I/O wait?

## Nguồn chính thống

- [Oracle — Troubleshoot Performance Issues Using Flight Recorder — JDK 26](https://docs.oracle.com/en/java/javase/26/troubleshoot/troubleshoot-performance-issues-using-jfr.html)
- [Oracle — Flight Recorder Configurations — JDK 26](https://docs.oracle.com/en/java/javase/26/jfapi/flight-recorder-configurations.html)
- [Oracle — The jfr Command — JDK 26](https://docs.oracle.com/en/java/javase/26/docs/specs/man/jfr.html)
- [Oracle — jdk.jfr Package API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/jdk.jfr/jdk/jfr/package-summary.html)
- [OpenJDK — OpenJDK Code Tools — JMH](https://openjdk.org/projects/code-tools/jmh/)
