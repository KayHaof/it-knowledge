---
id: java-stack-frame
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - stack
  - stack-frame
  - locals
relatedLessons:
  - java-jvm-memory
sources:
  - title: Java Virtual Machine Specification
    url: https://docs.oracle.com/javase/specs/jvms/se21/html/
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: Java troubleshooting guide
    url: https://docs.oracle.com/en/java/javase/21/troubleshoot/
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
    - id: stack
      required: true
      aliases:
        - stack
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: stack-frame
      required: true
      aliases:
        - stack-frame
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: locals
      required: false
      aliases:
        - locals
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - StackOverflowError nghĩa heap hết vì object được tạo trong method.
      penalty: 20
---

# Một stack frame của Java method chứa những gì và vì sao StackOverflowError xảy ra?

## Rubric

### Must Include

- stack

- stack-frame

### Strong Answer Includes

- locals

## Câu trả lời 30 giây

Mỗi invocation có frame chứa local variables, operand stack và reference tới runtime constant pool. Đệ quy quá sâu hoặc frame quá lớn làm cạn stack của thread và gây StackOverflowError; đây khác OutOfMemoryError của heap.

## Câu trả lời chi tiết

JVM stack là vùng riêng theo thread. Bytecode thao tác trên operand stack, còn local variable array giữ primitive hoặc reference; frame bị pop khi method return. Kích thước stack chịu `-Xss` và số frame phụ thuộc call path, recursion và compiler. Tăng `-Xss` có thể chứa thêm recursion nhưng giảm số thread tạo được, nên phải sửa termination hoặc chuyển sang iteration trước.

## Góc nhìn Production

Phân biệt stack, heap và native memory trong incident; lấy thread dump và stack trace trước khi restart. Theo dõi số thread và giới hạn container khi cân nhắc `-Xss`.

## Trade-offs

JVM stack là vùng riêng theo thread. Bytecode thao tác trên operand stack, còn local variable array giữ primitive hoặc reference; frame bị pop khi method return. Kích thước stack chịu `-Xss` và số frame phụ thuộc call path, recursion và compiler. Tăng `-Xss` có thể chứa thêm recursion nhưng giảm số thread tạo được, nên phải sửa termination hoặc chuyển sang iteration trước.

## Câu trả lời sai thường gặp

StackOverflowError nghĩa heap hết vì object được tạo trong method.

## Follow-up

- Reference local nằm trên stack hay object nằm trên heap?

- Tăng Xss có tác động gì tới thread density?

## Nguồn chính thống

- [Oracle — Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se21/html/)
- [Oracle — Java troubleshooting guide](https://docs.oracle.com/en/java/javase/21/troubleshoot/)
