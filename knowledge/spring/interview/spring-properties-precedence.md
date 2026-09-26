---
id: spring-properties-precedence
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - configuration-properties
  - profiles
  - secrets
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
    - id: configuration-properties
      required: true
      aliases:
        - configuration-properties
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: profiles
      required: true
      aliases:
        - profiles
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: secrets
      required: false
      aliases:
        - secrets
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - File application-prod.yml luôn thắng mọi environment variable vì profile có ưu tiên cao nhất.
      penalty: 20
---

# Bạn kiểm soát precedence của Spring configuration và secret như thế nào?

## Rubric

### Must Include

- configuration-properties

- profiles

### Strong Answer Includes

- secrets

## Câu trả lời 30 giây

Spring ghép nhiều property source theo thứ tự precedence; environment/command-line thường override file. Dùng `@ConfigurationProperties` typed, validate startup và quản secret qua secret manager thay vì commit plaintext.

## Câu trả lời chi tiết

Profile chọn nhóm cấu hình nhưng không nên là security boundary. Tách immutable defaults, environment overrides và deployment secret; log key names/effective non-secret values để debug. Property binding fail fast với validation giúp tránh giá trị rỗng. Refresh runtime cần atomic snapshot hoặc restart policy, không mutate config rải rác.

## Góc nhìn Production

Audit secret access, rotation, redaction và config drift; metric startup failure theo cause. Không in `Environment` toàn bộ vào log hoặc actuator public.

## Trade-offs

Profile chọn nhóm cấu hình nhưng không nên là security boundary. Tách immutable defaults, environment overrides và deployment secret; log key names/effective non-secret values để debug. Property binding fail fast với validation giúp tránh giá trị rỗng. Refresh runtime cần atomic snapshot hoặc restart policy, không mutate config rải rác.

## Câu trả lời sai thường gặp

File application-prod.yml luôn thắng mọi environment variable vì profile có ưu tiên cao nhất.

## Follow-up

- Profile khác feature flag thế nào?

- Làm sao test precedence trong CI?

## Nguồn chính thống

- [Spring — Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
- [Spring — Creating Your Own Auto-configuration](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html)
