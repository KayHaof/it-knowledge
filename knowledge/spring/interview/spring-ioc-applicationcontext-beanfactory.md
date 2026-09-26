---
id: spring-ioc-applicationcontext-beanfactory
type: interview-question
technology: Spring
category: Spring
difficulty: junior
topics:
  - IoC
  - ApplicationContext
  - BeanFactory
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
    - id: ioc
      required: true
      aliases:
        - IoC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: applicationcontext
      required: true
      aliases:
        - ApplicationContext
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: beanfactory
      required: false
      aliases:
        - BeanFactory
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - BeanFactory không hỗ trợ dependency injection còn ApplicationContext mới tạo được bean.
      penalty: 20
---

# ApplicationContext cung cấp thêm gì so với BeanFactory?

## Rubric

### Must Include

- IoC

- ApplicationContext

### Strong Answer Includes

- BeanFactory

## Câu trả lời 30 giây

Cả hai đều quản lý bean và dependency injection; ApplicationContext thêm event, message resolution, resource loading và tích hợp post-processor phổ biến. Ứng dụng Boot thường dùng ApplicationContext.

## Câu trả lời chi tiết

BeanFactory là container tối thiểu, còn ApplicationContext bootstrap nhiều infrastructure như environment, annotation processing và lifecycle event. Không nên coi context là service locator để gọi getBean khắp nơi; constructor injection giữ dependency rõ ràng. Context hierarchy có thể dùng khi tách web/root nhưng tăng độ phức tạp.

## Góc nhìn Production

Kiểm startup time, bean count và failure của conditional config; tránh context khởi tạo lặp trong test.

## Trade-offs

BeanFactory là container tối thiểu, còn ApplicationContext bootstrap nhiều infrastructure như environment, annotation processing và lifecycle event. Không nên coi context là service locator để gọi getBean khắp nơi; constructor injection giữ dependency rõ ràng. Context hierarchy có thể dùng khi tách web/root nhưng tăng độ phức tạp.

## Câu trả lời sai thường gặp

BeanFactory không hỗ trợ dependency injection còn ApplicationContext mới tạo được bean.

## Follow-up

- BeanPostProcessor chạy ở đâu?

- Khi nào dùng context hierarchy?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
