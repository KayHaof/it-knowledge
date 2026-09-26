---
id: java-escape-analysis
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - allocation
  - JIT
  - escape-analysis
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
    - id: allocation
      required: true
      aliases:
        - allocation
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: jit
      required: true
      aliases:
        - JIT
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: escape-analysis
      required: false
      aliases:
        - escape-analysis
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi local object luôn nằm trên stack và Java không allocate heap trong method.
      penalty: 20
---

# Escape analysis của JIT có thể loại bỏ allocation hoặc lock như thế nào?

## Rubric

### Must Include

- allocation

- JIT

### Strong Answer Includes

- escape-analysis

## Câu trả lời 30 giây

JIT phân tích object có thoát khỏi method hoặc thread hay không. Object không escape có thể được scalar-replace hoặc stack-like optimize, và lock không cần thiết đôi khi được loại bỏ. Đây là tối ưu runtime phụ thuộc profile, không phải contract để code dựa vào.

## Câu trả lời chi tiết

Nếu reference không được lưu ra field, trả về hay truyền tới code không phân tích được, compiler có thể tách fields thành scalar hoặc bỏ allocation. Với monitor chỉ được dùng trong một thread, lock elision/coarsening có thể giảm overhead. Deoptimization có thể quay lại interpreter khi assumption sai, vì vậy benchmark cần warmup và fork. Allocation rate, GC và JIT compilation vẫn phải đo ở workload thật.

## Góc nhìn Production

Dùng JFR allocation/tlab và profile để xác nhận thay vì suy đoán từ source. Đừng làm API kỳ quặc chỉ để ép object lên stack; ưu tiên data shape và allocation hợp lý.

## Trade-offs

Nếu reference không được lưu ra field, trả về hay truyền tới code không phân tích được, compiler có thể tách fields thành scalar hoặc bỏ allocation. Với monitor chỉ được dùng trong một thread, lock elision/coarsening có thể giảm overhead. Deoptimization có thể quay lại interpreter khi assumption sai, vì vậy benchmark cần warmup và fork. Allocation rate, GC và JIT compilation vẫn phải đo ở workload thật.

## Câu trả lời sai thường gặp

Mọi local object luôn nằm trên stack và Java không allocate heap trong method.

## Follow-up

- Vì sao JMH cần warmup khi đo allocation?

- Deoptimization xảy ra khi nào?

## Nguồn chính thống

- [Oracle — Troubleshoot Performance Issues Using Flight Recorder — JDK 26](https://docs.oracle.com/en/java/javase/26/troubleshoot/troubleshoot-performance-issues-using-jfr.html)
- [Oracle — Flight Recorder Configurations — JDK 26](https://docs.oracle.com/en/java/javase/26/jfapi/flight-recorder-configurations.html)
- [Oracle — The jfr Command — JDK 26](https://docs.oracle.com/en/java/javase/26/docs/specs/man/jfr.html)
- [Oracle — jdk.jfr Package API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/jdk.jfr/jdk/jfr/package-summary.html)
- [OpenJDK — OpenJDK Code Tools — JMH](https://openjdk.org/projects/code-tools/jmh/)
