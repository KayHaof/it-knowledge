---
id: security-password-hashing
type: interview-question
technology: Security
category: Security
difficulty: junior
topics:
  - password
  - Argon2
  - salt
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
    - id: password
      required: true
      aliases:
        - password
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: argon2
      required: true
      aliases:
        - Argon2
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: salt
      required: false
      aliases:
        - salt
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mã hóa password bằng AES với một key chung an toàn hơn password hashing.
      penalty: 20
---

# Password nên hash và salt thế nào?

## Rubric

### Must Include

- password

- Argon2

### Strong Answer Includes

- salt

## Câu trả lời 30 giây

Dùng password hashing chậm, memory-hard như Argon2id/bcrypt với salt ngẫu nhiên mỗi password; không dùng SHA-256 trực tiếp. Hash chứa parameters để có thể tune/upgrade.

## Câu trả lời chi tiết

Salt ngăn rainbow table và hash giống nhau; pepper có thể nằm secret manager nhưng không thay salt. Chọn cost theo latency server, rate-limit login và rehash khi cost cũ. Không log password hay hash trong analytics.

## Góc nhìn Production

Benchmark cost trên production class hardware; monitor login CPU và credential stuffing.

## Trade-offs

Salt ngăn rainbow table và hash giống nhau; pepper có thể nằm secret manager nhưng không thay salt. Chọn cost theo latency server, rate-limit login và rehash khi cost cũ. Không log password hay hash trong analytics.

## Câu trả lời sai thường gặp

Mã hóa password bằng AES với một key chung an toàn hơn password hashing.

## Follow-up

- Salt cần giữ bí mật không?

- Rehash migration không làm user đăng nhập thế nào?

## Nguồn chính thống

- [OWASP — OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP — OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
