---
id: security-sql-injection-parameter
type: interview-question
technology: Security
category: Security
difficulty: junior
topics:
  - SQL injection
  - parameterization
  - ORM
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
    - id: sql-injection
      required: true
      aliases:
        - SQL injection
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: parameterization
      required: true
      aliases:
        - parameterization
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: orm
      required: false
      aliases:
        - ORM
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Dùng JPA là tự động parameterize mọi query kể cả chuỗi native nối tay.
      penalty: 20
---

# Parameterized query ngăn SQL injection bằng cơ chế nào?

## Rubric

### Must Include

- SQL injection

- parameterization

### Strong Answer Includes

- ORM

## Câu trả lời 30 giây

SQL structure và value được gửi tách nhau nên input không trở thành syntax. ORM không tự an toàn nếu nối string vào native query hoặc dynamic identifier.

## Câu trả lời chi tiết

Bind variable xử lý quote/type và giúp plan reuse tùy DB. Dynamic ORDER BY/column cần allowlist vì không bind như value. Authorization/filter tenant vẫn phải áp dụng; parameterization không chữa business access bug.

## Góc nhìn Production

SAST/DAST và query logs đã redact; test malicious input trong integration DB.

## Trade-offs

Bind variable xử lý quote/type và giúp plan reuse tùy DB. Dynamic ORDER BY/column cần allowlist vì không bind như value. Authorization/filter tenant vẫn phải áp dụng; parameterization không chữa business access bug.

## Câu trả lời sai thường gặp

Dùng JPA là tự động parameterize mọi query kể cả chuỗi native nối tay.

## Follow-up

- Identifier dynamic allowlist ra sao?

- SQLi second-order là gì?

## Nguồn chính thống

- [OWASP — OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP — SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
