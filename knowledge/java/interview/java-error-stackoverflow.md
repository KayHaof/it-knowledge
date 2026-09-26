---
id: java-error-stackoverflow
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - Error
  - exception
  - recovery
relatedLessons:
  - java-exceptions-resource-safety
sources:
  - title: Java Language Specification — Exceptions
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-11.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: AutoCloseable API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/AutoCloseable.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Throwable API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Throwable.html
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
    - id: error
      required: true
      aliases:
        - Error
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: exception
      required: true
      aliases:
        - exception
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: recovery
      required: false
      aliases:
        - recovery
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Catch Throwable ở controller là cách tốt nhất để service không bao giờ chết.
      penalty: 20
---

# Có nên catch `Error` để giữ Java service tiếp tục chạy không?

## Rubric

### Must Include

- Error

- exception

### Strong Answer Includes

- recovery

## Câu trả lời 30 giây

Thông thường không. Error biểu thị lỗi nghiêm trọng như StackOverflowError hoặc linkage/resource failure mà process có thể không còn trạng thái an toàn. Chỉ catch loại cụ thể ở boundary có kế hoạch rõ, không catch toàn bộ rồi che incident.

## Câu trả lời chi tiết

Exception thường đại diện điều kiện application có thể map/recover; Error không phải taxonomy tuyệt đối nhưng thường yêu cầu fail-fast hoặc restart. Catch Throwable còn nuốt cả ThreadDeath/OutOfMemoryError và làm cleanup không đáng tin. Nếu bắt StackOverflowError để trả request, các thread khác hoặc heap có thể vẫn hỏng.

## Góc nhìn Production

Crash/restart có health/readiness và durable state recovery; log nguyên nhân trước exit. Runbook phân biệt code bug, dependency mismatch và resource exhaustion.

## Trade-offs

Exception thường đại diện điều kiện application có thể map/recover; Error không phải taxonomy tuyệt đối nhưng thường yêu cầu fail-fast hoặc restart. Catch Throwable còn nuốt cả ThreadDeath/OutOfMemoryError và làm cleanup không đáng tin. Nếu bắt StackOverflowError để trả request, các thread khác hoặc heap có thể vẫn hỏng.

## Câu trả lời sai thường gặp

Catch Throwable ở controller là cách tốt nhất để service không bao giờ chết.

## Follow-up

- Khi nào catch LinkageError ở plugin boundary?

- OutOfMemoryError có nên cố trả response không?

## Nguồn chính thống

- [Oracle — Java Language Specification — Exceptions](https://docs.oracle.com/javase/specs/jls/se26/html/jls-11.html)
- [Oracle — AutoCloseable API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/AutoCloseable.html)
- [Oracle — Throwable API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Throwable.html)
