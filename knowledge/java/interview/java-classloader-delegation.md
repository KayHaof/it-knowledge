---
id: java-classloader-delegation
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - ClassLoader
  - delegation
  - class identity
relatedLessons:
  - java-platform-bytecode-classloading
sources:
  - title: JVMS 26 — The class File Format
    url: https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: JVMS 26 — Loading, Linking, and Initializing
    url: https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: ClassLoader API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: JEP 261 — Module System
    url: https://openjdk.org/jeps/261
    organization: OpenJDK
    type: specification
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
    - id: classloader
      required: true
      aliases:
        - ClassLoader
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: delegation
      required: true
      aliases:
        - delegation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: class-identity
      required: false
      aliases:
        - class identity
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Tên đầy đủ của class là đủ để JVM nhận diện, ClassLoader không tham gia identity.
      penalty: 20
---

# Mô hình parent delegation của ClassLoader ngăn lỗi nào và khi nào gây bất ngờ?

## Rubric

### Must Include

- ClassLoader

- delegation

### Strong Answer Includes

- class identity

## Câu trả lời 30 giây

ClassLoader thường hỏi parent trước để class nền tảng không bị ứng dụng giả mạo. Cùng tên binary nhưng do loader khác nạp vẫn là hai kiểu khác nhau, gây ClassCastException hoặc class conflict trong plugin/container.

## Câu trả lời chi tiết

Bootstrap/platform/application loader tạo chuỗi delegation; child chỉ tự định nghĩa khi parent không tìm thấy. Container có thể dùng child-first để cô lập dependency, nhưng điều đó dễ tạo hai phiên bản thư viện và linkage error. Tôi kiểm class origin bằng protection domain và giữ dependency graph nhất quán.

## Góc nhìn Production

Khi lỗi chỉ xảy ra trong container, log loader và location của class; tránh shading mù quáng.

## Trade-offs

Bootstrap/platform/application loader tạo chuỗi delegation; child chỉ tự định nghĩa khi parent không tìm thấy. Container có thể dùng child-first để cô lập dependency, nhưng điều đó dễ tạo hai phiên bản thư viện và linkage error. Tôi kiểm class origin bằng protection domain và giữ dependency graph nhất quán.

## Câu trả lời sai thường gặp

Tên đầy đủ của class là đủ để JVM nhận diện, ClassLoader không tham gia identity.

## Follow-up

- NoClassDefFoundError khác ClassNotFoundException thế nào?

- Child-first hữu ích trong plugin ra sao?

## Nguồn chính thống

- [Oracle — JVMS 26 — The class File Format](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html)
- [Oracle — JVMS 26 — Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html)
- [Oracle — ClassLoader API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html)
- [OpenJDK — JEP 261 — Module System](https://openjdk.org/jeps/261)
