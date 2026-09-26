---
id: java-class-initialization-order
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - class-initialization
  - static
  - classloader
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
    - id: class-initialization
      required: true
      aliases:
        - class-initialization
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: static
      required: true
      aliases:
        - static
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: classloader
      required: false
      aliases:
        - classloader
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Class nào được load là static block chạy ngay và có thể chạy lại mỗi lần tạo object.
      penalty: 20
---

# Khi nào static field và static block của một class được khởi tạo?

## Rubric

### Must Include

- class-initialization

- static

### Strong Answer Includes

- classloader

## Câu trả lời 30 giây

Initialization thường xảy ra trước active use như tạo instance, gọi static method hoặc đọc non-constant static field. JVM chạy superclass initialization trước subclass và thực thi các khai báo theo thứ tự source. Đọc compile-time constant có thể không kích hoạt initialization.

## Câu trả lời chi tiết

Loading và linking có thể xảy ra sớm, nhưng initialization được đồng bộ để một class chỉ chạy một lần thành công trong một loader. JVM khởi tạo superclass rồi static fields/static blocks của class theo thứ tự. Nếu initializer ném exception, lần đầu thường nhận ExceptionInInitializerError và trạng thái class lỗi khiến lần dùng sau gặp NoClassDefFoundError. Vì vậy static initialization không nên gọi network hay phụ thuộc cấu hình mong manh.

## Góc nhìn Production

Giữ initializer nhẹ và deterministic; chuyển I/O/config validation vào lifecycle có health signal. Log nguyên nhân gốc trước khi class bị đánh dấu erroneous.

## Trade-offs

Loading và linking có thể xảy ra sớm, nhưng initialization được đồng bộ để một class chỉ chạy một lần thành công trong một loader. JVM khởi tạo superclass rồi static fields/static blocks của class theo thứ tự. Nếu initializer ném exception, lần đầu thường nhận ExceptionInInitializerError và trạng thái class lỗi khiến lần dùng sau gặp NoClassDefFoundError. Vì vậy static initialization không nên gọi network hay phụ thuộc cấu hình mong manh.

## Câu trả lời sai thường gặp

Class nào được load là static block chạy ngay và có thể chạy lại mỗi lần tạo object.

## Follow-up

- Compile-time constant có gây initialization không?

- Vì sao ExceptionInInitializerError khó hồi phục trong cùng classloader?

## Nguồn chính thống

- [Oracle — JVMS 26 — The class File Format](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html)
- [Oracle — JVMS 26 — Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html)
- [Oracle — ClassLoader API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html)
- [OpenJDK — JEP 261 — Module System](https://openjdk.org/jeps/261)
