---
id: q-cors-csrf
type: interview-question
technology: Security
category: Security
difficulty: middle
topics:
  - CORS
  - CSRF
  - browser
relatedLessons:
  - security-fundamentals
sources:
  - title: CSRF Prevention Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
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
    - id: cors
      required: true
      aliases:
        - CORS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: csrf
      required: true
      aliases:
        - CSRF
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: browser
      required: false
      aliases:
        - browser
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CORS chặn mọi request từ domain khác nên API không cần CSRF protection hoặc authentication.
      penalty: 20
---

# CORS và CSRF khác nhau thế nào, bật CORS chặt có loại CSRF không?

## Rubric

### Must Include

- CORS

- CSRF

### Strong Answer Includes

- browser

## Câu trả lời 30 giây

CORS kiểm soát JavaScript origin nào được đọc response; CSRF lợi dụng browser tự gửi credential để tạo request ngoài ý muốn. CORS chặt không thay CSRF token/SameSite/origin checks cho cookie-authenticated mutation.

## Câu trả lời chi tiết

Tôi xác định credential model và trust boundary. Cookie có thể tự attach theo policy nên state-changing request cần CSRF defense; bearer token trong explicit header có threat khác nhưng XSS/token storage vẫn quan trọng. Preflight không phải authentication và non-browser client không bị CORS bảo vệ.

## Deep Dive

Simple request có thể được gửi dù response không đọc được; side effect có thể đã xảy ra. SameSite hỗ trợ defense-in-depth nhưng cần kiểm browser/flow và không thay mọi control.

## Góc nhìn Production

Allowlist exact origins/methods/headers, không phản chiếu Origin mù với credentials; test subdomain, redirect và proxy behavior.

## Trade-offs

Simple request có thể được gửi dù response không đọc được; side effect có thể đã xảy ra. SameSite hỗ trợ defense-in-depth nhưng cần kiểm browser/flow và không thay mọi control.

## Câu trả lời sai thường gặp

CORS chặn mọi request từ domain khác nên API không cần CSRF protection hoặc authentication.

## Follow-up

- SameSite=Lax còn gửi cookie khi nào?

- Preflight được cache và authorize ra sao?

## Nguồn chính thống

- [OWASP — CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
