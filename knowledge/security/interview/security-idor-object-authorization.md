---
id: security-idor-object-authorization
type: interview-question
technology: Security
category: Security
difficulty: middle
topics:
  - IDOR
  - authorization
  - tenant
relatedLessons:
  - secrets-authorization-boundaries
sources:
  - title: OWASP Secrets Management Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OWASP Authorization Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
    organization: OWASP
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OWASP Logging Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
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
    - id: idor
      required: true
      aliases:
        - IDOR
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: authorization
      required: true
      aliases:
        - authorization
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: tenant
      required: false
      aliases:
        - tenant
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - ID khó đoán là đủ, vì user đã login nên có quyền đọc mọi ID.
      penalty: 20
---

# Vì sao đổi ID trên URL có thể thành IDOR dù đã đăng nhập?

## Rubric

### Must Include

- IDOR

- authorization

### Strong Answer Includes

- tenant

## Câu trả lời 30 giây

Authentication chỉ biết ai gọi; authorization phải kiểm resource thuộc user/tenant và action được phép. Query theo ID không kèm ownership filter là lỗi phổ biến.

## Câu trả lời chi tiết

Policy nên kiểm ở service/domain boundary, không chỉ UI/route guard. Dùng opaque ID giảm enumeration nhưng không thay authorization; cache key và batch endpoint cũng phải giữ tenant scope. Test matrix horizontal/vertical privilege.

## Góc nhìn Production

Audit denied access, tenant id và unusual enumeration; không leak existence qua timing/status.

## Trade-offs

Policy nên kiểm ở service/domain boundary, không chỉ UI/route guard. Dùng opaque ID giảm enumeration nhưng không thay authorization; cache key và batch endpoint cũng phải giữ tenant scope. Test matrix horizontal/vertical privilege.

## Câu trả lời sai thường gặp

ID khó đoán là đủ, vì user đã login nên có quyền đọc mọi ID.

## Follow-up

- Object-level policy đặt ở đâu?

- 403 và 404 chọn theo threat model nào?

## Nguồn chính thống

- [OWASP — OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP — OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
