---
id: spring-mvc-dispatcherservlet-flow
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - DispatcherServlet
  - filter
  - interceptor
relatedLessons:
  - spring-mvc-request-lifecycle
sources:
  - title: Spring MVC DispatcherServlet
    url: https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring MVC Filters
    url: https://docs.spring.io/spring-framework/reference/web/webmvc/filters.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring MVC Interceptors
    url: https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring MVC Asynchronous Requests
    url: https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html
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
    - id: dispatcherservlet
      required: true
      aliases:
        - DispatcherServlet
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: filter
      required: true
      aliases:
        - filter
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: interceptor
      required: false
      aliases:
        - interceptor
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Interceptor luôn chạy trước Filter và chỉ cần interceptor cho mọi middleware.
      penalty: 20
---

# Một request Spring MVC đi qua Filter, Interceptor và Controller theo thứ tự nào?

## Rubric

### Must Include

- DispatcherServlet

- filter

### Strong Answer Includes

- interceptor

## Câu trả lời 30 giây

Servlet Filter chạy quanh DispatcherServlet; DispatcherServlet tìm handler, interceptor preHandle chạy trước controller, rồi postHandle/afterCompletion sau đó. Exception resolver xử lý lỗi tùy điểm phát sinh.

## Câu trả lời chi tiết

Filter phù hợp cross-cutting ở servlet boundary như correlation id/CORS; interceptor biết handler nhưng không bao phủ static/async theo cách giống filter. HandlerAdapter gọi controller, message converter serialize response. Async request có lifecycle riêng nên test timeout và cleanup.

## Góc nhìn Production

Gắn trace id sớm ở filter; đo latency từng tầng và tránh đọc body nhiều lần.

## Trade-offs

Filter phù hợp cross-cutting ở servlet boundary như correlation id/CORS; interceptor biết handler nhưng không bao phủ static/async theo cách giống filter. HandlerAdapter gọi controller, message converter serialize response. Async request có lifecycle riêng nên test timeout và cleanup.

## Câu trả lời sai thường gặp

Interceptor luôn chạy trước Filter và chỉ cần interceptor cho mọi middleware.

## Follow-up

- Exception trong Filter được resolver xử lý không?

- Async MVC callback cần cleanup gì?

## Nguồn chính thống

- [Spring — Spring MVC DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
- [Spring — Spring MVC Filters](https://docs.spring.io/spring-framework/reference/web/webmvc/filters.html)
- [Spring — Spring MVC Interceptors](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html)
- [Spring — Spring MVC Asynchronous Requests](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html)
