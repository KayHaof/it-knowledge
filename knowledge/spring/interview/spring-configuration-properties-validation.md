---
id: spring-configuration-properties-validation
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - configuration
  - binding
  - validation
relatedLessons:
  - spring-boot-configuration-conditions
sources:
  - title: Spring Boot Externalized Configuration
    url: https://docs.spring.io/spring-boot/reference/features/external-config.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot Auto-configuration
    url: https://docs.spring.io/spring-boot/reference/using/auto-configuration.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Creating Your Own Auto-configuration
    url: https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html
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
    - id: configuration
      required: true
      aliases:
        - configuration
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: binding
      required: true
      aliases:
        - binding
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: validation
      required: false
      aliases:
        - validation
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - "`@Value` luôn type-safe và tự validate mọi property lúc compile time."
      penalty: 20
---

# Vì sao nên dùng `@ConfigurationProperties` thay vì rải `@Value`?

## Rubric

### Must Include

- configuration

- binding

### Strong Answer Includes

- validation

## Câu trả lời 30 giây

ConfigurationProperties gom cấu hình có type, metadata và validation, dễ test/profile hơn. `@Value` phù hợp vài giá trị đơn nhưng khó quản lý nested config và thiếu fail-fast nhất quán.

## Câu trả lời chi tiết

Binder map prefix vào object, hỗ trợ duration/data size và `@Validated` với constraint. Secret không nên commit vào file; external config phải có precedence rõ. Kiểm startup khi thiếu/invalid config để tránh lỗi muộn ở request path.

## Góc nhìn Production

Log config đã sanitize, kiểm checksum/version và không log secret; test profile production-like.

## Trade-offs

Binder map prefix vào object, hỗ trợ duration/data size và `@Validated` với constraint. Secret không nên commit vào file; external config phải có precedence rõ. Kiểm startup khi thiếu/invalid config để tránh lỗi muộn ở request path.

## Câu trả lời sai thường gặp

`@Value` luôn type-safe và tự validate mọi property lúc compile time.

## Follow-up

- Property precedence trong Boot cần kiểm thế nào?

- Làm sao redact secret trong actuator/env?

## Nguồn chính thống

- [Spring — Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
- [Spring — Creating Your Own Auto-configuration](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html)
