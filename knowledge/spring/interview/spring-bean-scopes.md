---
id: spring-bean-scopes
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - bean-scope
  - singleton
  - request
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
    - id: bean-scope
      required: true
      aliases:
        - bean-scope
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: singleton
      required: true
      aliases:
        - singleton
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: request
      required: false
      aliases:
        - request
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Singleton bean luôn thread-safe và chỉ tồn tại duy nhất trong cả process.
      penalty: 20
---

# Singleton bean của Spring có phải singleton toàn JVM không?

## Rubric

### Must Include

- bean-scope

- singleton

### Strong Answer Includes

- request

## Câu trả lời 30 giây

Nó là một instance mỗi ApplicationContext, không phải toàn JVM nếu có nhiều context/classloader. Singleton cũng không đồng nghĩa thread-safe; state mutable trong bean cần tránh hoặc đồng bộ.

## Câu trả lời chi tiết

Các scope gồm singleton, prototype và web scopes như request/session. Inject prototype vào singleton cần ObjectProvider/proxy để lấy instance đúng lifecycle. Đừng đưa request state vào singleton field; dùng parameter hoặc scoped context rõ ràng.

## Góc nhìn Production

Kiểm memory/lifecycle khi tạo prototype nhiều; test nhiều context và concurrent request.

## Trade-offs

Các scope gồm singleton, prototype và web scopes như request/session. Inject prototype vào singleton cần ObjectProvider/proxy để lấy instance đúng lifecycle. Đừng đưa request state vào singleton field; dùng parameter hoặc scoped context rõ ràng.

## Câu trả lời sai thường gặp

Singleton bean luôn thread-safe và chỉ tồn tại duy nhất trong cả process.

## Follow-up

- Prototype bean được destroy callback tự động không?

- Scoped proxy giải quyết injection thế nào?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
