---
id: q-jwt
type: interview-question
technology: Security
category: Security
difficulty: junior
topics:
  - jwt
  - authorization
relatedLessons:
  - security-fundamentals
sources:
  - title: OWASP Top 10:2025
    url: https://owasp.org/Top10/
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Authentication Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Authorization Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Cross-Site Request Forgery Prevention Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: SQL Injection Prevention Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
    organization: OWASP
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
        - jwt
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: authorization
      required: true
      aliases:
        - authorization
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - JWT payload đã được mã hóa nên có thể chứa password.
      penalty: 20
---

# JWT có an toàn vì được mã hóa không?

## Rubric

### Must Include

- jwt

- authorization

### Strong Answer Includes

## Câu trả lời 30 giây

JWT ký thông thường chỉ Base64URL encode payload, không mã hóa. Signature chống sửa và xác thực issuer/key; dữ liệu vẫn đọc được. Server còn phải kiểm issuer, audience, expiry và authorization.

## Câu trả lời chi tiết

JWS gồm header, payload, signature. Bất kỳ ai có token đều decode header/payload. Security đến từ TLS khi truyền, key management, algorithm allowlist, claim validation, short lifetime và storage phù hợp. Revocation là trade-off với stateless validation; JWT không tự thay session hay object-level authorization.

## Góc nhìn Production

Rotate key, cache JWKS an toàn, tránh log token và chuẩn bị incident khi signing key leak.

## Trade-offs

JWS gồm header, payload, signature. Bất kỳ ai có token đều decode header/payload. Security đến từ TLS khi truyền, key management, algorithm allowlist, claim validation, short lifetime và storage phù hợp. Revocation là trade-off với stateless validation; JWT không tự thay session hay object-level authorization.

## Câu trả lời sai thường gặp

JWT payload đã được mã hóa nên có thể chứa password.

## Follow-up

- Signature khác encryption ra sao?

- Logout/revocation thiết kế thế nào?

## Nguồn chính thống

- [OWASP — OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP — SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
