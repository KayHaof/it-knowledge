---
id: spring-constructor-injection
type: interview-question
technology: Spring
category: Spring
difficulty: junior
topics:
  - IoC
  - DI
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
    - id: ioc
      required: true
      aliases:
        - IoC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: di
      required: true
      aliases:
        - DI
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: constructor-injection
      required: false
      aliases:
        - constructor-injection
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Field injection tốt hơn vì giảm số dòng constructor và luôn xử lý được circular dependency.
      penalty: 20
---

# Vì sao constructor injection thường được ưu tiên trong Spring?

## Rubric

### Must Include

- IoC

- DI

### Strong Answer Includes

- constructor-injection

## Câu trả lời 30 giây

Dependency trở thành bắt buộc và object được tạo ở trạng thái hợp lệ ngay từ constructor. Nó làm dependency immutable, dễ test và phát hiện thiếu wiring lúc startup thay vì lỗi null khi chạy.

## Câu trả lời chi tiết

Container resolve dependency graph rồi gọi constructor; field/setter injection cho phép object tồn tại nửa khởi tạo và khó thấy contract. Constructor injection cũng làm circular dependency lộ rõ, buộc thiết kế lại boundary hoặc dùng event/provider có chủ ý. Nhiều dependency trong constructor là tín hiệu class có quá nhiều trách nhiệm, không phải lý do đổi sang field injection.

## Góc nhìn Production

Fail fast khi context start, kiểm tra startup health và giữ constructor nhỏ. Mock/fake test không cần reflection để set private field.

## Trade-offs

Container resolve dependency graph rồi gọi constructor; field/setter injection cho phép object tồn tại nửa khởi tạo và khó thấy contract. Constructor injection cũng làm circular dependency lộ rõ, buộc thiết kế lại boundary hoặc dùng event/provider có chủ ý. Nhiều dependency trong constructor là tín hiệu class có quá nhiều trách nhiệm, không phải lý do đổi sang field injection.

## Câu trả lời sai thường gặp

Field injection tốt hơn vì giảm số dòng constructor và luôn xử lý được circular dependency.

## Follow-up

- Circular dependency nên được refactor thế nào?

- Khi nào setter injection hợp lý?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
