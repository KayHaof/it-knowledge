---
id: q-spring-jwt-validation
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - Spring Security
  - OAuth2
  - JWT
relatedLessons:
  - spring-security-oauth2-jwt
sources:
  - title: Spring Security JWT Resource Server
    url: https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html
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
    - id: oauth2
      required: true
      aliases:
        - OAuth2
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: jwt
      required: false
      aliases:
        - JWT
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Signature đúng nghĩa là user được truy cập mọi endpoint và token chưa bao giờ bị thu hồi.
      penalty: 20
---

# Resource Server cần kiểm gì ngoài chữ ký JWT?

## Rubric

### Must Include

- Spring Security

- OAuth2

### Strong Answer Includes

- JWT

## Câu trả lời 30 giây

Ngoài signature/key, phải allowlist algorithm và validate issuer, audience, expiry/not-before cùng claim mapping. Token hợp lệ về mật mã vẫn có thể không được phép thực hiện action; authorization theo resource vẫn tách riêng.

## Câu trả lời chi tiết

Tôi cấu hình trusted issuer/JWK source, audience theo API, clock skew hữu hạn, key rotation/cache và mapping scope/role có namespace rõ. JWT không được coi là encrypted. Revocation/compromise cần short lifetime hoặc server-side control phù hợp; không log raw token.

## Deep Dive

JWK fetch là dependency: cần cache/refresh và behavior rõ khi issuer unavailable, đồng thời chống algorithm/key confusion bằng cấu hình cố định.

## Góc nhìn Production

Theo dõi validation failure theo reason không lộ token, drill key rotation và kiểm tra object-level authorization.

## Trade-offs

JWK fetch là dependency: cần cache/refresh và behavior rõ khi issuer unavailable, đồng thời chống algorithm/key confusion bằng cấu hình cố định.

## Câu trả lời sai thường gặp

Signature đúng nghĩa là user được truy cập mọi endpoint và token chưa bao giờ bị thu hồi.

## Follow-up

- OAuth2 khác OIDC ở mục tiêu nào?

- JWKS rotation khi key cũ còn token sống xử lý ra sao?

## Nguồn chính thống

- [Spring — Spring Security JWT Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
