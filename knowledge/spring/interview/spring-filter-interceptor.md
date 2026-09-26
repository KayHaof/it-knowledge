---
id: spring-filter-interceptor
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - Filter
  - Interceptor
  - security
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
    - id: filter
      required: true
      aliases:
        - Filter
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: interceptor
      required: true
      aliases:
        - Interceptor
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: security
      required: false
      aliases:
        - security
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Interceptor luôn chạy trước mọi Filter vì nó thuộc Spring nên có quyền ưu tiên hơn servlet container.
      penalty: 20
---

# Khi nào dùng Servlet Filter và khi nào dùng Spring MVC Interceptor?

## Rubric

### Must Include

- Filter

- Interceptor

### Strong Answer Includes

- security

## Câu trả lời 30 giây

Filter bao quanh servlet chain, phù hợp raw request/response, CORS, correlation hoặc security integration. Interceptor hiểu handler/controller và lifecycle MVC, phù hợp policy gắn route; cả hai không tự thay thế authorization ở service layer.

## Câu trả lời chi tiết

Filter chạy trước DispatcherServlet và có thể áp dụng cả static/error dispatch tùy config; interceptor có preHandle/postHandle/afterCompletion sau handler mapping. Async request có lifecycle khác và cần test. Authentication filter xây SecurityContext, còn object authorization nên ở service/method policy để không phụ thuộc HTTP.

## Góc nhìn Production

Đo filter/interceptor time, propagation và duplicate logging. Không log body/token mặc định; bảo đảm cleanup context trong finally.

## Trade-offs

Filter chạy trước DispatcherServlet và có thể áp dụng cả static/error dispatch tùy config; interceptor có preHandle/postHandle/afterCompletion sau handler mapping. Async request có lifecycle khác và cần test. Authentication filter xây SecurityContext, còn object authorization nên ở service/method policy để không phụ thuộc HTTP.

## Câu trả lời sai thường gặp

Interceptor luôn chạy trước mọi Filter vì nó thuộc Spring nên có quyền ưu tiên hơn servlet container.

## Follow-up

- CORS filter có giải quyết CSRF không?

- Async MVC callback cần cleanup context nào?

## Nguồn chính thống

- [Spring — Spring MVC DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
- [Spring — Spring MVC Filters](https://docs.spring.io/spring-framework/reference/web/webmvc/filters.html)
- [Spring — Spring MVC Interceptors](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html)
- [Spring — Spring MVC Asynchronous Requests](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html)
