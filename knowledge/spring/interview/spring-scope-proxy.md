---
id: spring-scope-proxy
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - bean-scope
  - proxy
  - request-scope
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
    - id: proxy
      required: true
      aliases:
        - proxy
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: request-scope
      required: false
      aliases:
        - request-scope
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Spring copy request-scoped object vào singleton một lần nên giá trị request đầu tiên được dùng cho mọi request.
      penalty: 20
---

# Inject request-scoped bean vào singleton Spring bean hoạt động thế nào?

## Rubric

### Must Include

- bean-scope

- proxy

### Strong Answer Includes

- request-scope

## Câu trả lời 30 giây

Spring cần scoped proxy hoặc ObjectProvider để singleton giữ proxy, proxy resolve instance theo request hiện tại. Giữ trực tiếp request data trong singleton sẽ sai isolation và có thể gây leak giữa request.

## Câu trả lời chi tiết

Singleton được tạo một lần, còn request/session bean có lifecycle ngắn. Scoped proxy delegate method call tới target bound context; gọi ngoài request context sẽ lỗi. ObjectProvider cho phép lazy lookup nhưng vẫn phải rõ ownership và null/error policy. Không biến proxy thành lý do đưa mutable state vào service singleton.

## Góc nhìn Production

Test concurrent requests/tenant isolation và request-context absence ở background job. Không serialize scoped proxy hoặc lưu nó vào cache lâu sống.

## Trade-offs

Singleton được tạo một lần, còn request/session bean có lifecycle ngắn. Scoped proxy delegate method call tới target bound context; gọi ngoài request context sẽ lỗi. ObjectProvider cho phép lazy lookup nhưng vẫn phải rõ ownership và null/error policy. Không biến proxy thành lý do đưa mutable state vào service singleton.

## Câu trả lời sai thường gặp

Spring copy request-scoped object vào singleton một lần nên giá trị request đầu tiên được dùng cho mọi request.

## Follow-up

- Background task dùng request scope thế nào?

- Prototype proxy có tạo object mỗi method call không?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
