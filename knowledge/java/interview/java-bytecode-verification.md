---
id: java-bytecode-verification
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - bytecode
  - verification
  - class-file
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
    - id: bytecode
      required: true
      aliases:
        - bytecode
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: verification
      required: true
      aliases:
        - verification
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: class-file
      required: false
      aliases:
        - class-file
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - JVM chỉ đọc source Java trực tiếp nên bytecode verification không liên quan production.
      penalty: 20
---

# JVM làm gì với bytecode trước khi chạy class?

## Rubric

### Must Include

- bytecode

- verification

### Strong Answer Includes

- class-file

## Câu trả lời 30 giây

JVM đọc class file, kiểm tra format và bytecode safety, sau đó link symbolic references và khởi tạo class khi cần. Verification giảm rủi ro type/stack sai nhưng không thay thế sandbox hay application authorization.

## Câu trả lời chi tiết

Class loader định danh class bằng tên nhị phân và loader; linker gồm verification, preparation và resolution có thể lazy. Verifier kiểm tra type trên operand stack, branch hợp lệ và truy cập cấu trúc class theo format. Sau đó JVM có thể interpreter hoặc JIT compile hot code. Class loading không có nghĩa mọi static initializer đã chạy; initialization thường xảy ra ở lần active use đầu tiên.

## Góc nhìn Production

Khi gặp NoClassDefFoundError hoặc VerifyError, kiểm tra dependency tree, classpath, bytecode target và nhiều classloader trước khi tăng heap. Giữ build JDK và runtime tương thích.

## Trade-offs

Class loader định danh class bằng tên nhị phân và loader; linker gồm verification, preparation và resolution có thể lazy. Verifier kiểm tra type trên operand stack, branch hợp lệ và truy cập cấu trúc class theo format. Sau đó JVM có thể interpreter hoặc JIT compile hot code. Class loading không có nghĩa mọi static initializer đã chạy; initialization thường xảy ra ở lần active use đầu tiên.

## Câu trả lời sai thường gặp

JVM chỉ đọc source Java trực tiếp nên bytecode verification không liên quan production.

## Follow-up

- Linking khác initialization thế nào?

- Vì sao cùng FQCN từ hai classloader là hai type?

## Nguồn chính thống

- [Oracle — JVMS 26 — The class File Format](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html)
- [Oracle — JVMS 26 — Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html)
- [Oracle — ClassLoader API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html)
- [OpenJDK — JEP 261 — Module System](https://openjdk.org/jeps/261)
