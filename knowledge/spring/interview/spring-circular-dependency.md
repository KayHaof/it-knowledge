---
id: spring-circular-dependency
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - circular-dependency
  - constructor-injection
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
    - id: circular-dependency
      required: true
      aliases:
        - circular-dependency
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: constructor-injection
      required: true
      aliases:
        - constructor-injection
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần thêm `@Lazy` ở một bean là vòng dependency đã được thiết kế đúng.
      penalty: 20
---

# Vòng dependency trong constructor injection nên xử lý thế nào?

## Rubric

### Must Include

- circular-dependency

- constructor-injection

### Strong Answer Includes

## Câu trả lời 30 giây

Đó thường là dấu hiệu hai class có trách nhiệm gắn chặt; tách abstraction hoặc orchestration service tốt hơn bật workaround. Setter/lazy injection chỉ nên là biện pháp tạm vì che design smell.

## Câu trả lời chi tiết

Container không thể tạo A cần B khi B lại cần A qua constructor. Tôi tìm dependency graph, chuyển shared policy sang interface nhỏ, hoặc phát domain event để phá vòng. `@Lazy` có thể trì hoãn nhưng vẫn giữ coupling và lỗi runtime.

## Góc nhìn Production

Fail fast lúc startup; đưa dependency graph vào architecture review.

## Trade-offs

Container không thể tạo A cần B khi B lại cần A qua constructor. Tôi tìm dependency graph, chuyển shared policy sang interface nhỏ, hoặc phát domain event để phá vòng. `@Lazy` có thể trì hoãn nhưng vẫn giữ coupling và lỗi runtime.

## Câu trả lời sai thường gặp

Chỉ cần thêm `@Lazy` ở một bean là vòng dependency đã được thiết kế đúng.

## Follow-up

- Khi nào event giúp phá vòng?

- Setter injection có rủi ro gì?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
