---
id: spring-method-authorization
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - method-security
  - RBAC
  - ABAC
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
    - id: method-security
      required: true
      aliases:
        - method-security
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: rbac
      required: true
      aliases:
        - RBAC
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: abac
      required: false
      aliases:
        - ABAC
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Role `USER` trong JWT đảm bảo mọi user chỉ xem được object của chính họ mà không cần kiểm id.
      penalty: 20
---

# Bạn bảo vệ object-level authorization trong Spring service thế nào?

## Rubric

### Must Include

- method-security

- RBAC

### Strong Answer Includes

- ABAC

## Câu trả lời 30 giây

Kiểm quyền ngay tại use-case với subject, action, resource và tenant, không chỉ dựa URL role. Query nên scope theo ownership để giảm IDOR, còn annotation chỉ là một lớp policy.

## Câu trả lời chi tiết

`@PreAuthorize` phù hợp coarse expression, nhưng policy phức tạp nên tách authorization service/decision object có test. Load resource sau khi scope tenant hoặc dùng query predicate, tránh load object rồi mới check gây leak timing/data. Cache decision phải gắn version/tenant và invalidation rõ.

## Góc nhìn Production

Audit allow/deny, policy latency và access anomalies; test matrix ngang tenant, role và resource state. Không trả 404/403 tùy tiện nếu làm lộ existence.

## Trade-offs

`@PreAuthorize` phù hợp coarse expression, nhưng policy phức tạp nên tách authorization service/decision object có test. Load resource sau khi scope tenant hoặc dùng query predicate, tránh load object rồi mới check gây leak timing/data. Cache decision phải gắn version/tenant và invalidation rõ.

## Câu trả lời sai thường gặp

Role `USER` trong JWT đảm bảo mọi user chỉ xem được object của chính họ mà không cần kiểm id.

## Follow-up

- RBAC khác ABAC thế nào?

- Policy cache stale có thể gây breach ra sao?

## Nguồn chính thống

- [Spring — Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)
- [Spring — Spring Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring — Cross Site Request Forgery](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [Spring — Spring Security CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)
