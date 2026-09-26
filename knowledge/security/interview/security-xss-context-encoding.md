---
id: security-xss-context-encoding
type: interview-question
technology: Security
category: Security
difficulty: middle
topics:
  - XSS
  - sanitization
  - CSP
relatedLessons:
  - angular-security-xss-trusted-types
sources:
  - title: Angular security best practices
    url: https://angular.dev/best-practices/security
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Cross Site Scripting Prevention Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Content Security Policy Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Trusted Types
    url: https://www.w3.org/TR/trusted-types/
    organization: W3C
    type: specification
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
    - id: xss
      required: true
      aliases:
        - XSS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: sanitization
      required: true
      aliases:
        - sanitization
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: csp
      required: false
      aliases:
        - CSP
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần strip chuỗi `<script>` là mọi XSS đã bị loại bỏ.
      penalty: 20
---

# Contextual output encoding chống XSS khác sanitize HTML thế nào?

## Rubric

### Must Include

- XSS

- sanitization

### Strong Answer Includes

- CSP

## Câu trả lời 30 giây

Encoding biến dữ liệu thành text an toàn theo context HTML/attribute/JS/URL; sanitizer lọc markup được phép. Chọn sai context hoặc bypass bằng trusted HTML vẫn có thể XSS.

## Câu trả lời chi tiết

Framework template binding thường escape text nhưng `innerHTML`, URL và third-party widget cần policy riêng. CSP/trusted types giảm impact nhưng không thay input validation/output encoding. Không đánh dấu dữ liệu user là trusted để sửa lỗi hiển thị.

## Góc nhìn Production

CSP report-only rồi enforce, scan dependency và test payload theo context.

## Trade-offs

Framework template binding thường escape text nhưng `innerHTML`, URL và third-party widget cần policy riêng. CSP/trusted types giảm impact nhưng không thay input validation/output encoding. Không đánh dấu dữ liệu user là trusted để sửa lỗi hiển thị.

## Câu trả lời sai thường gặp

Chỉ cần strip chuỗi `<script>` là mọi XSS đã bị loại bỏ.

## Follow-up

- CSP nonce dùng thế nào?

- Trusted Types bảo vệ sink nào?

## Nguồn chính thống

- [Angular — Angular security best practices](https://angular.dev/best-practices/security)
- [OWASP — Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP — Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [W3C — Trusted Types](https://www.w3.org/TR/trusted-types/)
