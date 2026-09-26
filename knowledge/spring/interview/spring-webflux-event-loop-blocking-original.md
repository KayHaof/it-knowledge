---
id: spring-webflux-event-loop-blocking-original
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - WebFlux
  - Netty
  - event-loop
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
    - id: netty
      required: true
      aliases:
        - Netty
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: event-loop
      required: false
      aliases:
        - event-loop
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - WebFlux tự chuyển mọi blocking method sang worker thread nên JDBC trên event loop an toàn.
      penalty: 20
---

# Blocking call trên WebFlux event loop gây hậu quả gì?

## Rubric

### Must Include

- WebFlux

- Netty

### Strong Answer Includes

- event-loop

## Câu trả lời 30 giây

Nó giữ event-loop thread, làm nhiều request không tiến triển và p99 tăng dù CPU thấp. Phải dùng non-blocking driver hoặc isolate blocking work trên bounded scheduler, nhưng isolation không biến call thành non-blocking.

## Câu trả lời chi tiết

Netty event loop phục vụ nhiều connection; một JDBC/file/blocking SDK call ngăn event loop xử lý read/write khác. `boundedElastic` giới hạn nhưng có queue/latency và vẫn cần downstream connection budget. Backpressure chỉ điều tiết reactive publisher, không sửa blocking code tự thân. MVC/virtual threads đôi khi đơn giản hơn nếu dependency path blocking.

## Góc nhìn Production

Alert event-loop blocked duration, scheduler queue, pool wait và p99; load test slow downstream. Không dùng unbounded elastic pool hay block trong map.

## Trade-offs

Netty event loop phục vụ nhiều connection; một JDBC/file/blocking SDK call ngăn event loop xử lý read/write khác. `boundedElastic` giới hạn nhưng có queue/latency và vẫn cần downstream connection budget. Backpressure chỉ điều tiết reactive publisher, không sửa blocking code tự thân. MVC/virtual threads đôi khi đơn giản hơn nếu dependency path blocking.

## Câu trả lời sai thường gặp

WebFlux tự chuyển mọi blocking method sang worker thread nên JDBC trên event loop an toàn.

## Follow-up

- Backpressure có bảo vệ database không?

- Khi nào chọn MVC với virtual threads?

## Nguồn chính thống

- [Spring — Spring Web MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring — Spring WebFlux](https://docs.spring.io/spring-framework/reference/web/webflux.html)
