---
id: java-execution-jdk-jre-jvm
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
        - JVM là trình biên dịch Java và JRE luôn cần cài riêng khi đã có JDK.
      penalty: 20
---

# Phân biệt JDK, JRE và JVM trong luồng chạy ứng dụng Java?

## Rubric

### Must Include

- JDK

- JRE

### Strong Answer Includes

- JVM

## Câu trả lời 30 giây

JVM thực thi bytecode; JRE là JVM cùng thư viện runtime; JDK bao gồm runtime và công cụ build/debug như javac, javadoc và jcmd. Khi deploy thường chỉ cần runtime phù hợp, còn pipeline cần JDK.

## Câu trả lời chi tiết

Source được javac biên dịch thành bytecode, class loader nạp vào JVM rồi interpreter/JIT thực thi trên hệ điều hành. JDK có toolchain và header/debug tooling, JRE là khái niệm runtime lịch sử và các bản JDK hiện đại thường phân phối runtime image theo nhu cầu. Container nên pin vendor/version và kiểm tra module/runtime image thay vì suy luận từ máy developer.

## Góc nhìn Production

Theo dõi version, vendor, flags và image digest; kiểm tra tương thích bytecode trước rollout.

## Trade-offs

Source được javac biên dịch thành bytecode, class loader nạp vào JVM rồi interpreter/JIT thực thi trên hệ điều hành. JDK có toolchain và header/debug tooling, JRE là khái niệm runtime lịch sử và các bản JDK hiện đại thường phân phối runtime image theo nhu cầu. Container nên pin vendor/version và kiểm tra module/runtime image thay vì suy luận từ máy developer.

## Câu trả lời sai thường gặp

JVM là trình biên dịch Java và JRE luôn cần cài riêng khi đã có JDK.

## Follow-up

- Bytecode khác mã máy thế nào?

- JIT tối ưu ở thời điểm nào?

## Nguồn chính thống

- [Oracle — JVMS 26 — The class File Format](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html)
- [Oracle — JVMS 26 — Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html)
- [Oracle — ClassLoader API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html)
- [OpenJDK — JEP 261 — Module System](https://openjdk.org/jeps/261)
