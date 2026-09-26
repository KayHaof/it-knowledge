---
id: java-string-builder-thread
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - StringBuilder
  - StringBuffer
  - immutability
relatedLessons:
  - java-string-internals-building
sources:
  - title: String API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/String.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: StringBuilder API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/StringBuilder.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: JLS 26 — Lexical Structure and String Literals
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-3.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 254 — Compact Strings
    url: https://openjdk.org/jeps/254
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 280 — Indify String Concatenation
    url: https://openjdk.org/jeps/280
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
    - id: stringbuilder
      required: true
      aliases:
        - StringBuilder
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: stringbuffer
      required: true
      aliases:
        - StringBuffer
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: immutability
      required: false
      aliases:
        - immutability
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - StringBuffer luôn nhanh hơn vì synchronized làm các thread chạy an toàn hơn.
      penalty: 20
---

# StringBuilder và StringBuffer khác nhau thế nào trong code server?

## Rubric

### Must Include

- StringBuilder

- StringBuffer

### Strong Answer Includes

- immutability

## Câu trả lời 30 giây

Cả hai là mutable sequence để tránh tạo nhiều String trung gian. StringBuffer có synchronized method cho compatibility cũ, còn StringBuilder không synchronized và thường phù hợp local builder; không cái nào tự biến cả workflow thành thread-safe.

## Câu trả lời chi tiết

`+` trong một expression thường được compiler tối ưu, nhưng nối trong loop có thể tạo nhiều allocation nếu không được tối ưu. StringBuilder mở rộng buffer và tạo String cuối; capacity phù hợp có thể giảm resize. StringBuffer lock từng method, không bảo vệ chuỗi nhiều thao tác nếu lock bị tách. Shared builder nên tránh hoặc bảo vệ ownership thay vì mặc định chọn Buffer.

## Góc nhìn Production

Profile allocation và response size trước khi micro-optimize. Không giữ builder trong singleton hoặc ThreadLocal vô hạn vì có thể giữ payload lớn giữa requests.

## Trade-offs

`+` trong một expression thường được compiler tối ưu, nhưng nối trong loop có thể tạo nhiều allocation nếu không được tối ưu. StringBuilder mở rộng buffer và tạo String cuối; capacity phù hợp có thể giảm resize. StringBuffer lock từng method, không bảo vệ chuỗi nhiều thao tác nếu lock bị tách. Shared builder nên tránh hoặc bảo vệ ownership thay vì mặc định chọn Buffer.

## Câu trả lời sai thường gặp

StringBuffer luôn nhanh hơn vì synchronized làm các thread chạy an toàn hơn.

## Follow-up

- Khi nào StringJoiner hoặc formatter rõ ràng hơn?

- Làm sao tránh log message khổng lồ?

## Nguồn chính thống

- [Oracle — String API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/String.html)
- [Oracle — StringBuilder API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/StringBuilder.html)
- [Oracle — JLS 26 — Lexical Structure and String Literals](https://docs.oracle.com/javase/specs/jls/se26/html/jls-3.html)
- [OpenJDK — JEP 254 — Compact Strings](https://openjdk.org/jeps/254)
- [OpenJDK — JEP 280 — Indify String Concatenation](https://openjdk.org/jeps/280)
