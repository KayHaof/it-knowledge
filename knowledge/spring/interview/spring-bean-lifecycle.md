---
id: spring-bean-lifecycle
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - bean-lifecycle
  - post-processor
  - destroy
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
    - id: bean-lifecycle
      required: true
      aliases:
        - bean-lifecycle
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: post-processor
      required: true
      aliases:
        - post-processor
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: destroy
      required: false
      aliases:
        - destroy
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi bean đều bị destroy tự động ngay khi request kết thúc.
      penalty: 20
---

# Spring bean lifecycle gồm những bước chính nào?

## Rubric

### Must Include

- bean-lifecycle

- post-processor

### Strong Answer Includes

- destroy

## Câu trả lời 30 giây

Bean được instantiate, inject property, chạy aware callbacks và post-processors, init callbacks rồi mới sẵn sàng dùng. Khi context đóng, destroy callbacks chạy cho scope phù hợp; prototype bean không được container quản lý destroy đầy đủ.

## Câu trả lời chi tiết

BeanPostProcessor có thể bọc proxy trước/sau initialization; `@PostConstruct` dùng cho local invariant nhưng không nên gọi remote dependency dài. AOP proxy thường được tạo qua post-processing, nên self-invocation không đi qua advice. Shutdown cần deadline và cleanup idempotent, đặc biệt executor/connection.

## Góc nhìn Production

Health/readiness chỉ báo ready sau context init; log lifecycle failure và graceful shutdown duration. Test restart/reload để bắt resource không được đóng.

## Trade-offs

BeanPostProcessor có thể bọc proxy trước/sau initialization; `@PostConstruct` dùng cho local invariant nhưng không nên gọi remote dependency dài. AOP proxy thường được tạo qua post-processing, nên self-invocation không đi qua advice. Shutdown cần deadline và cleanup idempotent, đặc biệt executor/connection.

## Câu trả lời sai thường gặp

Mọi bean đều bị destroy tự động ngay khi request kết thúc.

## Follow-up

- Prototype bean cleanup do ai sở hữu?

- AOP proxy xuất hiện ở phase nào?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
