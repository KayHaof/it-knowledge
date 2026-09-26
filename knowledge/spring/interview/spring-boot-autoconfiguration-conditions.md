---
id: spring-boot-autoconfiguration-conditions
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - auto-configuration
  - conditions
  - starter
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
    - id: auto-configuration
      required: true
      aliases:
        - auto-configuration
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: conditions
      required: true
      aliases:
        - conditions
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: starter
      required: false
      aliases:
        - starter
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Starter chứa code nghiệp vụ và luôn ép ứng dụng dùng đúng một implementation.
      penalty: 20
---

# Spring Boot auto-configuration quyết định tạo bean bằng cách nào?

## Rubric

### Must Include

- auto-configuration

- conditions

### Strong Answer Includes

- starter

## Câu trả lời 30 giây

Các configuration class dùng condition dựa trên classpath, property, bean hiện có và web environment. Starter kéo dependency; auto-config chỉ là default có thể override bằng bean/property.

## Câu trả lời chi tiết

`@ConditionalOnClass`, `@ConditionalOnMissingBean` và property conditions tạo report vì sao match/no-match. Khi app behavior lạ, bật condition evaluation report và kiểm version dependency. Exclude có chủ đích, tránh copy toàn bộ auto-config vào code.

## Góc nhìn Production

Pin dependency/BOM và kiểm diff condition report khi nâng Boot; startup failure phải fail fast.

## Trade-offs

`@ConditionalOnClass`, `@ConditionalOnMissingBean` và property conditions tạo report vì sao match/no-match. Khi app behavior lạ, bật condition evaluation report và kiểm version dependency. Exclude có chủ đích, tránh copy toàn bộ auto-config vào code.

## Câu trả lời sai thường gặp

Starter chứa code nghiệp vụ và luôn ép ứng dụng dùng đúng một implementation.

## Follow-up

- Debug condition report ở đâu?

- Override auto-config bean có side effect gì?

## Nguồn chính thống

- [Spring — Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
- [Spring — Creating Your Own Auto-configuration](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html)
