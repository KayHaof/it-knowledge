---
id: spring-security-filterchain-order
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - SecurityFilterChain
  - authentication
  - authorization
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
    - id: securityfilterchain
      required: true
      aliases:
        - SecurityFilterChain
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: authentication
      required: true
      aliases:
        - authentication
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: authorization
      required: false
      aliases:
        - authorization
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần bật JWT là mọi endpoint tự được authorize đúng theo role trong token.
      penalty: 20
---

# Vì sao thứ tự rule trong SecurityFilterChain quan trọng?

## Rubric

### Must Include

- SecurityFilterChain

- authentication

### Strong Answer Includes

- authorization

## Câu trả lời 30 giây

Request match rule đầu tiên phù hợp; rule rộng đặt trước có thể nuốt rule bảo vệ phía sau. Authentication thiết lập SecurityContext, authorization quyết định quyền sau khi có principal.

## Câu trả lời chi tiết

Filter chain xử lý bearer/session, CSRF, exception translation và authorization theo thứ tự. Tôi đặt endpoint public rõ ràng, default deny, method security cho defense-in-depth và test matrix role/tenant. Không dùng URL pattern thay cho object-level authorization.

## Góc nhìn Production

Audit denied/allowed events không log token; regression test path normalization và CORS.

## Trade-offs

Filter chain xử lý bearer/session, CSRF, exception translation và authorization theo thứ tự. Tôi đặt endpoint public rõ ràng, default deny, method security cho defense-in-depth và test matrix role/tenant. Không dùng URL pattern thay cho object-level authorization.

## Câu trả lời sai thường gặp

Chỉ cần bật JWT là mọi endpoint tự được authorize đúng theo role trong token.

## Follow-up

- CORS khác CSRF thế nào?

- Object-level authorization kiểm ở đâu?

## Nguồn chính thống

- [Spring — Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)
- [Spring — Spring Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring — Cross Site Request Forgery](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [Spring — Spring Security CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)
