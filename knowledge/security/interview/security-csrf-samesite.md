---
id: security-csrf-samesite
type: interview-question
technology: Security
category: Security
difficulty: middle
topics:
  - CSRF
  - SameSite
  - cookies
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
    - id: csrf
      required: true
      aliases:
        - CSRF
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: samesite
      required: true
      aliases:
        - SameSite
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: cookies
      required: false
      aliases:
        - cookies
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật CORS allow-origin của frontend là đã ngăn CSRF hoàn toàn.
      penalty: 20
---

# CSRF bảo vệ kiểu session cookie ra sao?

## Rubric

### Must Include

- CSRF

- SameSite

### Strong Answer Includes

- cookies

## Câu trả lời 30 giây

Browser tự gửi cookie theo cross-site request; CSRF token/SameSite và kiểm Origin giúp chứng minh request đến từ app. Bearer token trong Authorization không tự gửi bởi form cross-site, nhưng XSS vẫn nguy hiểm.

## Câu trả lời chi tiết

Chọn SameSite=Lax/Strict phù hợp flow, Secure+HttpOnly cho cookie và token theo session. CORS không phải CSRF defense; nó kiểm đọc response, không ngăn browser gửi request. State-changing endpoint cần token/Origin check và không dùng GET cho mutation.

## Góc nhìn Production

Test subdomain/cross-site flows; log CSRF failures không lộ token.

## Trade-offs

Chọn SameSite=Lax/Strict phù hợp flow, Secure+HttpOnly cho cookie và token theo session. CORS không phải CSRF defense; nó kiểm đọc response, không ngăn browser gửi request. State-changing endpoint cần token/Origin check và không dùng GET cho mutation.

## Câu trả lời sai thường gặp

Bật CORS allow-origin của frontend là đã ngăn CSRF hoàn toàn.

## Follow-up

- SameSite=None yêu cầu thuộc tính nào?

- XSS bypass CSRF token ra sao?

## Nguồn chính thống

- [OWASP — OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP — SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
