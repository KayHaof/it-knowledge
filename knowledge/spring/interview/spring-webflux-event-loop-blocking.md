---
id: spring-webflux-event-loop-blocking
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - WebFlux
  - event-loop
  - blocking
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
    - id: webflux
      required: true
      aliases:
        - WebFlux
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: event-loop
      required: true
      aliases:
        - event-loop
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: blocking
      required: false
      aliases:
        - blocking
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - WebFlux tự chuyển mọi JDBC call sang worker thread nên blocking không ảnh hưởng.
      penalty: 20
---

# Blocking JDBC call trên WebFlux event loop gây hậu quả gì?

## Rubric

### Must Include

- WebFlux

- event-loop

### Strong Answer Includes

- blocking

## Câu trả lời 30 giây

Nó giữ event-loop thread, làm các request khác xếp hàng và p99 tăng. Dùng reactive driver hoặc cô lập blocking work sang bounded scheduler, nhưng chuyển scheduler không biến JDBC thành non-blocking.

## Câu trả lời chi tiết

Netty event loop ít thread phục vụ nhiều connection; block lâu làm throughput sụt và timeout lan truyền. `boundedElastic` có giới hạn nên vẫn cần bulkhead, timeout và pool sizing. Nếu workload chủ yếu blocking, MVC + virtual threads có thể đơn giản hơn WebFlux.

## Góc nhìn Production

Theo dõi event-loop blocked, scheduler queue, DB pool wait; dùng BlockHound/test để bắt blocking.

## Trade-offs

Netty event loop ít thread phục vụ nhiều connection; block lâu làm throughput sụt và timeout lan truyền. `boundedElastic` có giới hạn nên vẫn cần bulkhead, timeout và pool sizing. Nếu workload chủ yếu blocking, MVC + virtual threads có thể đơn giản hơn WebFlux.

## Câu trả lời sai thường gặp

WebFlux tự chuyển mọi JDBC call sang worker thread nên blocking không ảnh hưởng.

## Follow-up

- R2DBC trade-off với JDBC là gì?

- Backpressure mất tác dụng khi adapter blocking thế nào?

## Nguồn chính thống

- [Spring — Spring Web MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring — Spring WebFlux](https://docs.spring.io/spring-framework/reference/web/webflux.html)
