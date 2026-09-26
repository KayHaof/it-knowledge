---
id: spring-security-filter-chain
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - Spring Security
  - filter-chain
  - authentication
relatedLessons:
  - spring-security-policy-boundaries
sources:
  - title: Authorize HTTP Requests
    url: https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Method Security
    url: https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Cross Site Request Forgery
    url: https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Security CORS
    url: https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html
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
    - id: spring-security
      required: true
      aliases:
        - Spring Security
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: filter-chain
      required: true
      aliases:
        - filter-chain
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: authentication
      required: false
      aliases:
        - authentication
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Có JWT hợp lệ thì SecurityContext tự authorize mọi controller và object trong database.
      penalty: 20
---

# Spring Security filter chain thực hiện authentication và authorization ở đâu?

## Rubric

### Must Include

- Spring Security

- filter-chain

### Strong Answer Includes

- authentication

## Câu trả lời 30 giây

Các filter trích credential, xác thực rồi đặt Authentication vào SecurityContext; authorization quyết định request/method có được phép. Authentication thành công không có nghĩa user được phép truy cập mọi object.

## Câu trả lời chi tiết

Chain order ảnh hưởng bearer token, session, CSRF, exception translation và anonymous authentication. SecurityContext cần lifecycle cleanup và propagation đúng sang async. URL rules là coarse boundary; method/object authorization vẫn kiểm tenant/resource ownership. Custom filter nên có idempotency và failure response rõ, không tự parse token thiếu validation.

## Góc nhìn Production

Metric auth failures/latency, key rotation, context propagation và denied-by-policy; không log token. Integration test route matrix và IDOR/tenant isolation.

## Trade-offs

Chain order ảnh hưởng bearer token, session, CSRF, exception translation và anonymous authentication. SecurityContext cần lifecycle cleanup và propagation đúng sang async. URL rules là coarse boundary; method/object authorization vẫn kiểm tenant/resource ownership. Custom filter nên có idempotency và failure response rõ, không tự parse token thiếu validation.

## Câu trả lời sai thường gặp

Có JWT hợp lệ thì SecurityContext tự authorize mọi controller và object trong database.

## Follow-up

- SecurityContext sang async task thế nào?

- Method security khác URL matcher ra sao?

## Nguồn chính thống

- [Spring — Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)
- [Spring — Spring Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring — Cross Site Request Forgery](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [Spring — Spring Security CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)
