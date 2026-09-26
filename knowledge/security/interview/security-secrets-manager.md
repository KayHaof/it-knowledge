---
id: security-secrets-manager
type: interview-question
technology: Security
category: Security
difficulty: middle
topics:
  - secrets
  - rotation
  - least-privilege
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
    - id: secrets
      required: true
      aliases:
        - secrets
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: rotation
      required: true
      aliases:
        - rotation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: least-privilege
      required: false
      aliases:
        - least-privilege
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Base64 trong ConfigMap là mã hóa secret an toàn.
      penalty: 20
---

# Quản lý secret runtime nên khác config thường thế nào?

## Rubric

### Must Include

- secrets

- rotation

### Strong Answer Includes

- least-privilege

## Câu trả lời 30 giây

Secret cần vault/secret manager, quyền tối thiểu, audit và rotation; không commit hoặc bake cố định vào image. App cần reload/rollout strategy khi secret đổi.

## Câu trả lời chi tiết

Inject qua workload identity hoặc mounted secret, tránh env/log dump nếu threat model nhạy. Rotation cần overlap old/new credentials và kiểm consumer cache. Secret manager outage cũng là dependency cần timeout/fallback an toàn.

## Góc nhìn Production

Scan git/image, monitor access anomalies và expiry; revoke credential bị lộ.

## Trade-offs

Inject qua workload identity hoặc mounted secret, tránh env/log dump nếu threat model nhạy. Rotation cần overlap old/new credentials và kiểm consumer cache. Secret manager outage cũng là dependency cần timeout/fallback an toàn.

## Câu trả lời sai thường gặp

Base64 trong ConfigMap là mã hóa secret an toàn.

## Follow-up

- Rotation không downtime thiết kế thế nào?

- Workload identity giảm rủi ro gì?

## Nguồn chính thống

- [OWASP — OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP — OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
