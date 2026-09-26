---
id: spring-mvc-dispatcherservlet
type: interview-question
technology: Spring
category: Spring
difficulty: junior
topics:
  - Spring MVC
  - DispatcherServlet
  - request-lifecycle
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
    - id: spring-mvc
      required: true
      aliases:
        - Spring MVC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: dispatcherservlet
      required: true
      aliases:
        - DispatcherServlet
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: request-lifecycle
      required: false
      aliases:
        - request-lifecycle
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - DispatcherServlet trực tiếp mở database connection và tự serialize mọi object bằng reflection mặc định.
      penalty: 20
---

# DispatcherServlet đóng vai trò gì trong Spring MVC?

## Rubric

### Must Include

- Spring MVC

- DispatcherServlet

### Strong Answer Includes

- request-lifecycle

## Câu trả lời 30 giây

Nó là front controller nhận request, tìm handler, chạy interceptors/adapters và chuyển kết quả qua message converter hoặc view. Exception có thể đi qua resolver trước khi response hoàn tất.

## Câu trả lời chi tiết

Request đi qua servlet filter trước DispatcherServlet, sau đó HandlerMapping chọn controller và HandlerAdapter invoke method. Argument resolver bind path/body, validation có thể fail, rồi HttpMessageConverter serialize response. Interceptor chạy ở boundary MVC nhưng không thay thế security filter hay transaction policy.

## Góc nhìn Production

Trace request qua filter/handler, đo queue, controller, serialization và downstream latency. Đặt max body/timeout và error contract ổn định.

## Trade-offs

Request đi qua servlet filter trước DispatcherServlet, sau đó HandlerMapping chọn controller và HandlerAdapter invoke method. Argument resolver bind path/body, validation có thể fail, rồi HttpMessageConverter serialize response. Interceptor chạy ở boundary MVC nhưng không thay thế security filter hay transaction policy.

## Câu trả lời sai thường gặp

DispatcherServlet trực tiếp mở database connection và tự serialize mọi object bằng reflection mặc định.

## Follow-up

- Filter khác interceptor ở thứ tự nào?

- ExceptionHandler được gọi ở phase nào?

## Nguồn chính thống

- [Spring — Spring MVC DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
- [Spring — Spring MVC Filters](https://docs.spring.io/spring-framework/reference/web/webmvc/filters.html)
- [Spring — Spring MVC Interceptors](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html)
- [Spring — Spring MVC Asynchronous Requests](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html)
