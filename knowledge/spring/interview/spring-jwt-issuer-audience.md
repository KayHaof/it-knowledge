---
id: spring-jwt-issuer-audience
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - JWT
  - issuer
  - audience
relatedLessons:
  - spring-security-oauth2-jwt
sources:
  - title: Spring Security Servlet Architecture
    url: https://docs.spring.io/spring-security/reference/servlet/architecture.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OAuth 2.0 Resource Server JWT
    url: https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Method Security
    url: https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html
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
    - id: jwt
      required: true
      aliases:
        - JWT
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: issuer
      required: true
      aliases:
        - issuer
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: audience
      required: false
      aliases:
        - audience
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Verify signature là đủ vì token nào ký bởi cùng IdP cũng dùng được cho mọi API.
      penalty: 20
---

# Resource Server cần kiểm claim nào ngoài chữ ký JWT?

## Rubric

### Must Include

- JWT

- issuer

### Strong Answer Includes

- audience

## Câu trả lời 30 giây

Cần kiểm issuer/trust key, algorithm, thời gian exp/nbf và audience/resource phù hợp; sau đó map scope/role theo policy. Chữ ký hợp lệ với token phát cho service khác vẫn không được chấp nhận.

## Câu trả lời chi tiết

JWT validation gồm key selection theo `kid`, signature algorithm allowlist, issuer, audience và clock skew bounded. Claims là input không tin cậy cho object authorization; cần resolve user/tenant policy và token revocation/short lifetime theo threat model. JWKS rotation, cache refresh và key compromise cần runbook.

## Góc nhìn Production

Theo dõi reject reason, JWKS fetch/cache, clock drift và authorization denied; redaction token. Test wrong issuer/audience, expired, alg confusion và rotated key.

## Trade-offs

JWT validation gồm key selection theo `kid`, signature algorithm allowlist, issuer, audience và clock skew bounded. Claims là input không tin cậy cho object authorization; cần resolve user/tenant policy và token revocation/short lifetime theo threat model. JWKS rotation, cache refresh và key compromise cần runbook.

## Câu trả lời sai thường gặp

Verify signature là đủ vì token nào ký bởi cùng IdP cũng dùng được cho mọi API.

## Follow-up

- Issuer và audience khác trust nào?

- Key rotation làm request đang chạy bị ảnh hưởng ra sao?

## Nguồn chính thống

- [Spring — Spring Security Servlet Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)
- [Spring — OAuth 2.0 Resource Server JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring — Spring Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
