---
id: spring-reactive-backpressure
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - Reactive Streams
  - backpressure
  - Flux
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
    - id: reactive-streams
      required: true
      aliases:
        - Reactive Streams
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: backpressure
      required: true
      aliases:
        - backpressure
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: flux
      required: false
      aliases:
        - Flux
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Reactive Streams đảm bảo memory không tăng và mọi upstream sẽ tự giảm tốc dù external system không hỗ trợ backpressure.
      penalty: 20
---

# Backpressure trong Reactor bảo vệ hệ thống khỏi overload ra sao?

## Rubric

### Must Include

- Reactive Streams

- backpressure

### Strong Answer Includes

- Flux

## Câu trả lời 30 giây

Subscriber báo demand, publisher không nên phát vô hạn vượt khả năng xử lý. Nhưng boundary như Kafka, database hay HTTP client phải hỗ trợ semantics tương ứng; chỉ thêm `onBackpressureBuffer` có thể chuyển overload thành memory leak.

## Câu trả lời chi tiết

Flux operators propagate request(n), buffer/drop/latest/error là các policy khác nhau. Buffer cần bounded size/age và metric; drop có business implication. Blocking bridge, prefetch và parallel operators có thể che demand. End-to-end cần queue limit, timeout, rate/concurrency limit và downstream capacity, không chỉ reactive type.

## Góc nhìn Production

Theo dõi requested/prefetch, queue depth, dropped/overflowed signals và consumer lag. Test slow subscriber, cancellation và reconnect để chứng minh loss semantics.

## Trade-offs

Flux operators propagate request(n), buffer/drop/latest/error là các policy khác nhau. Buffer cần bounded size/age và metric; drop có business implication. Blocking bridge, prefetch và parallel operators có thể che demand. End-to-end cần queue limit, timeout, rate/concurrency limit và downstream capacity, không chỉ reactive type.

## Câu trả lời sai thường gặp

Reactive Streams đảm bảo memory không tăng và mọi upstream sẽ tự giảm tốc dù external system không hỗ trợ backpressure.

## Follow-up

- Buffer hay drop phù hợp telemetry nào?

- Cancellation có dừng side effect đã gửi không?

## Nguồn chính thống

- [Spring — Spring Web MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring — Spring WebFlux](https://docs.spring.io/spring-framework/reference/web/webflux.html)
