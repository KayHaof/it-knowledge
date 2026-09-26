---
id: spring-auto-config-condition
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - auto-configuration
  - conditions
  - starter
relatedLessons:
  - spring-ioc-bean-lifecycle
sources:
  - title: Spring IoC Container
    url: https://docs.spring.io/spring-framework/reference/core/beans.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Customizing the Nature of a Bean
    url: https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot Auto-configuration
    url: https://docs.spring.io/spring-boot/reference/using/auto-configuration.html
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
        - Thêm starter là Spring luôn tạo mọi bean bất kể classpath hay property.
      penalty: 20
---

# Spring Boot auto-configuration quyết định tạo bean dựa trên những tín hiệu nào?

## Rubric

### Must Include

- auto-configuration

- conditions

### Strong Answer Includes

- starter

## Câu trả lời 30 giây

Nó dùng classpath, properties, environment và điều kiện bean hiện có như `@ConditionalOnClass` hoặc `@ConditionalOnMissingBean`. Auto-config cung cấp default có thể override, không phải magic luôn đúng workload.

## Câu trả lời chi tiết

`@SpringBootApplication` bật component scan, auto-configuration và configuration properties. Condition evaluation report cho biết vì sao config match/miss; user-defined bean thường thắng `MissingBean`. Starter chỉ kéo dependency, còn version alignment/BOM và security defaults vẫn cần review.

## Góc nhìn Production

Log effective config an toàn, expose condition report chỉ trong debug nội bộ và test profile/feature flag. Pin dependency versions để auto-config không đổi ngoài ý muốn khi upgrade.

## Trade-offs

`@SpringBootApplication` bật component scan, auto-configuration và configuration properties. Condition evaluation report cho biết vì sao config match/miss; user-defined bean thường thắng `MissingBean`. Starter chỉ kéo dependency, còn version alignment/BOM và security defaults vẫn cần review.

## Câu trả lời sai thường gặp

Thêm starter là Spring luôn tạo mọi bean bất kể classpath hay property.

## Follow-up

- Làm sao debug bean không được auto-config?

- Override default bean có rủi ro gì?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
