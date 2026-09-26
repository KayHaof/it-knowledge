---
id: q-spring-ioc-junior
type: interview-question
technology: Spring
category: Spring
difficulty: junior
topics:
  - IoC
  - DI
  - bean
relatedLessons:
  - spring-ioc-bean-lifecycle
sources:
  - title: Spring IoC container
    url: https://docs.spring.io/spring-framework/reference/core/beans.html
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
    - id: bean
      required: false
      aliases:
        - bean
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - DI chỉ là Spring tự gọi new thay mình và càng nhiều bean càng tốt.
      penalty: 20
---

# Dependency Injection giải quyết vấn đề gì ngoài việc tránh từ khóa new?

## Rubric

### Must Include

- IoC

- DI

### Strong Answer Includes

- bean

## Câu trả lời 30 giây

DI tách object khỏi cách tạo và wiring dependency, cho phép container quản lifecycle/configuration và giúp thay implementation/test double ở boundary. Nó không có nghĩa mọi object đều phải là bean.

## Câu trả lời chi tiết

Application code phụ thuộc abstraction/capability, configuration root chọn implementation. Constructor injection làm dependency bắt buộc rõ và object dễ test; field injection che dependency và khó tạo object ngoài container. Scope/lifecycle phải phù hợp state và concurrency.

## Deep Dive

IoC container còn xử lý post-processors/proxy nên object tự tạo bằng new sẽ không tự nhận các container concern như transaction/security.

## Góc nhìn Production

Tránh singleton giữ request state, phát hiện circular dependency như design smell và không đặt domain value object vào container.

## Trade-offs

IoC container còn xử lý post-processors/proxy nên object tự tạo bằng new sẽ không tự nhận các container concern như transaction/security.

## Câu trả lời sai thường gặp

DI chỉ là Spring tự gọi new thay mình và càng nhiều bean càng tốt.

## Follow-up

- Constructor injection hơn field injection ở đâu?

- Bean singleton có thread-safe tự động không?

## Nguồn chính thống

- [Spring — Spring IoC container](https://docs.spring.io/spring-framework/reference/core/beans.html)
