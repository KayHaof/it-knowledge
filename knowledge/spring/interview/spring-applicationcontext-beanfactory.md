---
id: spring-applicationcontext-beanfactory
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - ApplicationContext
  - BeanFactory
  - events
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
    - id: applicationcontext
      required: true
      aliases:
        - ApplicationContext
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: beanfactory
      required: true
      aliases:
        - BeanFactory
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: events
      required: false
      aliases:
        - events
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - BeanFactory là phiên bản cũ không tạo singleton, còn ApplicationContext mới tạo được bean.
      penalty: 20
---

# ApplicationContext bổ sung gì so với BeanFactory?

## Rubric

### Must Include

- ApplicationContext

- BeanFactory

### Strong Answer Includes

- events

## Câu trả lời 30 giây

BeanFactory là container dependency cơ bản; ApplicationContext thêm lifecycle integration, event publication, message source và nhiều cơ chế enterprise. Ứng dụng web thường dùng ApplicationContext để có các tiện ích đó.

## Câu trả lời chi tiết

Cả hai resolve bean và scope, nhưng ApplicationContext bootstrap post-processors, resource loading, environment/profile và application events thuận tiện hơn. Không nên gọi `getBean` khắp business code vì làm mất dependency rõ ràng; dùng injection và event boundary có owner. Startup order vẫn phải kiểm soát khi listener gọi external system.

## Góc nhìn Production

Đo startup từng phase, fail fast nếu bean bắt buộc thiếu và không thực hiện network side effect trong constructor. Event async cần executor bounded và observability.

## Trade-offs

Cả hai resolve bean và scope, nhưng ApplicationContext bootstrap post-processors, resource loading, environment/profile và application events thuận tiện hơn. Không nên gọi `getBean` khắp business code vì làm mất dependency rõ ràng; dùng injection và event boundary có owner. Startup order vẫn phải kiểm soát khi listener gọi external system.

## Câu trả lời sai thường gặp

BeanFactory là phiên bản cũ không tạo singleton, còn ApplicationContext mới tạo được bean.

## Follow-up

- BeanPostProcessor chạy trước hay sau init method?

- Application event có bảo đảm durable delivery không?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
