---
id: spring-validation-error-contract
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - validation
  - ProblemDetail
  - errors
relatedLessons:
  - spring-rest-validation-errors
sources:
  - title: Spring MVC Validation
    url: https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring MVC REST Exceptions
    url: https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring HTTP Interface
    url: https://docs.spring.io/spring-framework/reference/integration/rest-clients.html#rest-http-interface
    organization: Spring
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
    - id: validation
      required: true
      aliases:
        - validation
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: problemdetail
      required: true
      aliases:
        - ProblemDetail
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: errors
      required: false
      aliases:
        - errors
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật `@Valid` là mọi business rule và database constraint tự được kiểm tra trước controller.
      penalty: 20
---

# Bạn thiết kế error response validation ổn định cho Spring REST thế nào?

## Rubric

### Must Include

- validation

- ProblemDetail

### Strong Answer Includes

- errors

## Câu trả lời 30 giây

Validate ở boundary và trả status/error code, field violations và correlation id nhất quán; không leak stack/SQL. Dùng exception handler tập trung và giữ contract versionable.

## Câu trả lời chi tiết

Bean Validation bắt syntax/shape, còn domain service kiểm invariant cần dữ liệu. Map `MethodArgumentNotValidException`/constraint errors thành Problem Details hoặc schema riêng với field path, rejected code và message localization. Phân biệt 4xx caller fix với 5xx/timeout retryable; không biến mọi lỗi thành 200.

## Góc nhìn Production

Đo validation error rate, top field/code và unexpected 5xx; redact input nhạy cảm. Contract test clients và thêm max payload/depth để chống abuse.

## Trade-offs

Bean Validation bắt syntax/shape, còn domain service kiểm invariant cần dữ liệu. Map `MethodArgumentNotValidException`/constraint errors thành Problem Details hoặc schema riêng với field path, rejected code và message localization. Phân biệt 4xx caller fix với 5xx/timeout retryable; không biến mọi lỗi thành 200.

## Câu trả lời sai thường gặp

Bật `@Valid` là mọi business rule và database constraint tự được kiểm tra trước controller.

## Follow-up

- Domain validation nên chạy trong transaction nào?

- Làm sao tránh message validation làm lộ PII?

## Nguồn chính thống

- [Spring — Spring MVC Validation](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)
- [Spring — Spring MVC REST Exceptions](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html)
- [Spring — Spring HTTP Interface](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html#rest-http-interface)
