---
id: security-jwt-signed-not-encrypted
type: interview-question
technology: Security
category: Security
difficulty: junior
topics:
  - JWT
  - signature
  - claims
relatedLessons:
  - oauth2-oidc-jwt-security
sources:
  - title: RFC 9700 — Best Current Practice for OAuth 2.0 Security
    url: https://www.rfc-editor.org/rfc/rfc9700.html
    organization: IETF
    type: standard
    accessedAt: 2026-09-02
  - title: RFC 7519 — JSON Web Token
    url: https://www.rfc-editor.org/rfc/rfc7519.html
    organization: IETF
    type: standard
    accessedAt: 2026-09-02
  - title: OAuth2 Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html
    organization: OWASP
    type: standard
    accessedAt: 2026-09-02
  - title: JSON Web Token Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html
    organization: OWASP
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
    - id: jwt
      required: true
      aliases:
        - JWT
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: signature
      required: true
      aliases:
        - signature
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: claims
      required: false
      aliases:
        - claims
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Payload JWT đã base64 nên người dùng không thể đọc hoặc sửa được.
      penalty: 20
---

# JWT có được mã hóa mặc định không?

## Rubric

### Must Include

- JWT

- signature

### Strong Answer Includes

- claims

## Câu trả lời 30 giây

JWT thường là signed, payload base64url có thể đọc; JWS không che bí mật. JWE mới mã hóa, nhưng không nên đưa secret/PII vào token nếu không cần.

## Câu trả lời chi tiết

Verifier kiểm signature, algorithm allowlist, issuer/audience/expiry và key rotation. Token bearer bị đánh cắp có thể dùng tới hạn; lưu trữ/browser transport và revocation strategy quan trọng. Không tin role claim nếu issuer/tenant chưa được xác thực.

## Góc nhìn Production

Redact token trong log, rotate keys và alert signature/issuer failures.

## Trade-offs

Verifier kiểm signature, algorithm allowlist, issuer/audience/expiry và key rotation. Token bearer bị đánh cắp có thể dùng tới hạn; lưu trữ/browser transport và revocation strategy quan trọng. Không tin role claim nếu issuer/tenant chưa được xác thực.

## Câu trả lời sai thường gặp

Payload JWT đã base64 nên người dùng không thể đọc hoặc sửa được.

## Follow-up

- JWS và JWE khác nhau thế nào?

- Revocation token stateless xử lý ra sao?

## Nguồn chính thống

- [IETF — RFC 9700 — Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
- [IETF — RFC 7519 — JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519.html)
- [OWASP — OAuth2 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)
- [OWASP — JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
