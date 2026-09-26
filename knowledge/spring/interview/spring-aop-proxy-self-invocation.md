---
id: spring-aop-proxy-self-invocation
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - AOP
  - proxy
  - self-invocation
relatedLessons:
  - spring-aop-transactions
sources:
  - title: Spring AOP Proxying Mechanisms
    url: https://docs.spring.io/spring-framework/reference/core/aop/proxying.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Declarative Transaction Management
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Transaction Propagation
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html
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
    - id: aop
      required: true
      aliases:
        - AOP
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
    - id: self-invocation
      required: false
      aliases:
        - self-invocation
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần đặt `@Transactional` trên class thì mọi lời gọi nội bộ đều tạo transaction mới.
      penalty: 20
---

# Vì sao self-invocation làm `@Transactional` hoặc `@Cacheable` không có tác dụng?

## Rubric

### Must Include

- AOP

- proxy

### Strong Answer Includes

- self-invocation

## Câu trả lời 30 giây

Annotation được áp qua proxy; gọi method bằng `this` đi thẳng vào target nên bỏ qua interceptor. Tách bean hoặc gọi qua boundary được proxy là cách rõ ràng.

## Câu trả lời chi tiết

Spring tạo JDK dynamic proxy hoặc CGLIB subclass tùy bean. Chỉ invocation đi qua proxy mới chạy transaction/cache/security advice; private/final method còn có hạn chế proxy. Self-injection và `AopContext` có thể dùng nhưng tăng coupling, nên refactor service boundary.

## Góc nhìn Production

Test transaction thực bằng integration test và log transaction id; không tin annotation qua unit test thuần.

## Trade-offs

Spring tạo JDK dynamic proxy hoặc CGLIB subclass tùy bean. Chỉ invocation đi qua proxy mới chạy transaction/cache/security advice; private/final method còn có hạn chế proxy. Self-injection và `AopContext` có thể dùng nhưng tăng coupling, nên refactor service boundary.

## Câu trả lời sai thường gặp

Chỉ cần đặt `@Transactional` trên class thì mọi lời gọi nội bộ đều tạo transaction mới.

## Follow-up

- JDK proxy và CGLIB khác gì?

- Khi nào propagation REQUIRES_NEW bị bỏ qua?

## Nguồn chính thống

- [Spring — Spring AOP Proxying Mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
- [Spring — Declarative Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html)
- [Spring — Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
