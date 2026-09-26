---
id: q-oauth2-vs-oidc
type: interview-question
technology: Security
category: Security
difficulty: senior
topics:
  - OAuth2
  - OIDC
  - PKCE
relatedLessons:
  - oauth2-oidc-jwt-security
sources:
  - title: OpenID Connect Core 1.0
    url: https://openid.net/specs/openid-connect-core-1_0.html
    organization: OpenID Foundation
    type: specification
    accessedAt: 2026-09-02
  - title: OAuth 2.0 Security Best Current Practice
    url: https://www.rfc-editor.org/rfc/rfc9700.html
    organization: IETF
    type: standard
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
    - id: oauth2
      required: true
      aliases:
        - OAuth2
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: oidc
      required: true
      aliases:
        - OIDC
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: pkce
      required: false
      aliases:
        - PKCE
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - OIDC là tên mới của OAuth và ID Token dùng để gọi mọi API.
      penalty: 20
---

# OAuth 2.0 và OpenID Connect khác mục tiêu gì?

## Rubric

### Must Include

- OAuth2

- OIDC

### Strong Answer Includes

- PKCE

## Câu trả lời 30 giây

OAuth 2.0 là framework delegated authorization để client lấy access token gọi resource. OIDC thêm identity layer và ID Token/user authentication semantics. Access token không mặc nhiên là hồ sơ đăng nhập cho client.

## Câu trả lời chi tiết

Tôi chọn authorization code với PKCE cho public/browser client, validate issuer, audience, state/nonce theo flow và dùng đúng token đúng audience. Resource Server validate access token; client validate ID Token cho authentication. Redirect URI exact, short lifetime và rotation/revocation giảm impact compromise.

## Deep Dive

JWT chỉ là một token format; OAuth không bắt mọi access token là JWT. PKCE ràng buộc authorization code với client instance, không thay state chống request mix-up/CSRF.

## Góc nhìn Production

Inventory clients/redirect URIs, rotate keys/secrets, không log token và drill compromised refresh token/signing key.

## Trade-offs

JWT chỉ là một token format; OAuth không bắt mọi access token là JWT. PKCE ràng buộc authorization code với client instance, không thay state chống request mix-up/CSRF.

## Câu trả lời sai thường gặp

OIDC là tên mới của OAuth và ID Token dùng để gọi mọi API.

## Follow-up

- state khác nonce thế nào?

- Tại sao implicit flow không còn là lựa chọn mặc định?

## Nguồn chính thống

- [OpenID Foundation — OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [IETF — OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html)
