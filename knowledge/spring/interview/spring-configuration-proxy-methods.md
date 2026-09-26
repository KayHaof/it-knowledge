---
id: spring-configuration-proxy-methods
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - Configuration
  - Bean
  - proxyBeanMethods
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
    - id: configuration
      required: true
      aliases:
        - Configuration
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: bean
      required: true
      aliases:
        - Bean
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: proxybeanmethods
      required: false
      aliases:
        - proxyBeanMethods
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - proxyBeanMethods=false chỉ đổi tên bean, không ảnh hưởng instance identity.
      penalty: 20
---

# `proxyBeanMethods=false` trong `@Configuration` thay đổi điều gì?

## Rubric

### Must Include

- Configuration

- Bean

### Strong Answer Includes

- proxyBeanMethods

## Câu trả lời 30 giây

Nó tắt CGLIB interception giữa các method `@Bean`, nên gọi trực tiếp method có thể tạo object mới. Đổi lại configuration lite nhẹ hơn; các bean cần chia sẻ phải inject qua parameter thay vì gọi method như factory.

## Câu trả lời chi tiết

Mặc định full `@Configuration` proxy bảo đảm một lần gọi method bean trả instance container-managed khi gọi từ method khác. Với false, class được xử lý như lite configuration và method call là Java call thường. Constructor/method parameter injection giữ dependency explicit, còn direct call có thể phá singleton hoặc scope.

## Góc nhìn Production

Dùng false cho cấu hình stateless và kiểm tra identity/scope bằng integration test. Không bật máy móc để giảm startup nếu configuration có inter-bean calls.

## Trade-offs

Mặc định full `@Configuration` proxy bảo đảm một lần gọi method bean trả instance container-managed khi gọi từ method khác. Với false, class được xử lý như lite configuration và method call là Java call thường. Constructor/method parameter injection giữ dependency explicit, còn direct call có thể phá singleton hoặc scope.

## Câu trả lời sai thường gặp

proxyBeanMethods=false chỉ đổi tên bean, không ảnh hưởng instance identity.

## Follow-up

- Bean method parameter được resolve khi nào?

- Khi nào full configuration proxy gây overhead đáng kể?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
