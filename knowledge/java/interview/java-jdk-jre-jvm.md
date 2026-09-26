---
id: java-jdk-jre-jvm
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - JDK
  - JRE
  - JVM
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
    - id: jdk
      required: true
      aliases:
        - JDK
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: jre
      required: true
      aliases:
        - JRE
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: jvm
      required: false
      aliases:
        - JVM
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - JRE là compiler còn JVM là thư viện Java.
      penalty: 20
---

# JDK, JRE và JVM khác nhau thế nào?

## Rubric

### Must Include

- JDK

- JRE

### Strong Answer Includes

- JVM

## Câu trả lời 30 giây

JVM thực thi bytecode. JRE là JVM cộng thư viện runtime, còn JDK bổ sung compiler và công cụ phát triển như javac, javadoc và jdb. Từ Java hiện đại, ta thường cài JDK để vừa chạy vừa build ứng dụng.

## Câu trả lời chi tiết

javac biên dịch source thành class file chứa bytecode; JVM nạp, verify, liên kết và diễn giải hoặc JIT-compile bytecode thành mã máy. Runtime image cung cấp các module thư viện cần thiết để chạy. JDK bao gồm runtime và tooling nên CI, IDE và production image có thể chọn phân phối khác nhau, nhưng phải kiểm tra version và vendor compatibility.

## Góc nhìn Production

Pin JDK distribution/version, theo dõi CVE và dùng image runtime tối thiểu sau khi build. Ghi nhận JVM flags và vendor khi điều tra khác biệt hiệu năng.

## Trade-offs

javac biên dịch source thành class file chứa bytecode; JVM nạp, verify, liên kết và diễn giải hoặc JIT-compile bytecode thành mã máy. Runtime image cung cấp các module thư viện cần thiết để chạy. JDK bao gồm runtime và tooling nên CI, IDE và production image có thể chọn phân phối khác nhau, nhưng phải kiểm tra version và vendor compatibility.

## Câu trả lời sai thường gặp

JRE là compiler còn JVM là thư viện Java.

## Follow-up

- Bytecode có phụ thuộc hệ điều hành không?

- JIT khác interpreter ở điểm nào?

## Nguồn chính thống

- [Oracle — JVMS 26 — The class File Format](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html)
- [Oracle — JVMS 26 — Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html)
- [Oracle — ClassLoader API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html)
- [OpenJDK — JEP 261 — Module System](https://openjdk.org/jeps/261)
