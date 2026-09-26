---
id: q-mvc-webflux
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - mvc
  - reactive
relatedLessons:
  - spring-mvc-webflux
sources:
  - title: Spring Web MVC
    url: https://docs.spring.io/spring-framework/reference/web/webmvc.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring WebFlux
    url: https://docs.spring.io/spring-framework/reference/web/webflux.html
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
    - id: mvc
      required: true
      aliases:
        - mvc
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: reactive
      required: true
      aliases:
        - reactive
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - WebFlux luôn nhanh hơn vì non-blocking.
      penalty: 20
---

# Khi nào chọn Spring MVC thay vì WebFlux?

## Rubric

### Must Include

- mvc

- reactive

### Strong Answer Includes

## Câu trả lời 30 giây

Chọn MVC khi call chain chủ yếu blocking như JPA/JDBC, concurrency vừa phải và ưu tiên đơn giản. WebFlux phù hợp I/O concurrency cao khi dependency path non-blocking và team vận hành reactive tốt.

## Câu trả lời chi tiết

Tôi xem workload, driver, thread model và operational cost. WebFlux dùng reactive stack/backpressure nhưng một JDBC call trên event loop phá lợi ích. MVC có ecosystem blocking mạnh, debug đơn giản và có thể kết hợp virtual threads. Quyết định cuối dựa trên benchmark representative cùng p99, CPU, memory và failure handling.

## Góc nhìn Production

Theo dõi event-loop blocking, pool saturation, context propagation và timeout budget xuyên chain.

## Trade-offs

Tôi xem workload, driver, thread model và operational cost. WebFlux dùng reactive stack/backpressure nhưng một JDBC call trên event loop phá lợi ích. MVC có ecosystem blocking mạnh, debug đơn giản và có thể kết hợp virtual threads. Quyết định cuối dựa trên benchmark representative cùng p99, CPU, memory và failure handling.

## Câu trả lời sai thường gặp

WebFlux luôn nhanh hơn vì non-blocking.

## Follow-up

- boundedElastic có biến JDBC thành non-blocking không?

- Backpressure dừng database overload thế nào?

## Nguồn chính thống

- [Spring — Spring Web MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring — Spring WebFlux](https://docs.spring.io/spring-framework/reference/web/webflux.html)
