---
id: security-ssrf-egress
type: interview-question
technology: Security
category: Security
difficulty: senior
topics:
  - SSRF
  - egress
  - metadata
relatedLessons:
  - threat-modeling-web-api
sources:
  - title: OWASP Threat Modeling Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
    organization: OWASP
    type: standard
    accessedAt: 2026-09-02
  - title: OWASP REST Security Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
    organization: OWASP
    type: standard
    accessedAt: 2026-09-02
  - title: OWASP Authorization Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
    organization: OWASP
    type: standard
    accessedAt: 2026-09-02
  - title: OWASP Logging Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
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
    - id: ssrf
      required: true
      aliases:
        - SSRF
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: egress
      required: true
      aliases:
        - egress
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: metadata
      required: false
      aliases:
        - metadata
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ chặn URL bắt đầu bằng `http://localhost` là đủ chống SSRF.
      penalty: 20
---

# Phòng SSRF khi server fetch URL do user cung cấp thế nào?

## Rubric

### Must Include

- SSRF

- egress

### Strong Answer Includes

- metadata

## Câu trả lời 30 giây

Parse/normalize URL, allowlist scheme/host khi có thể, chặn private/link-local ranges và egress bằng network policy. Phải re-check DNS/IP sau redirect vì hostname validation một lần là chưa đủ.

## Câu trả lời chi tiết

SSRF có thể chạm cloud metadata, internal admin và pivot qua redirect/DNS rebinding. HTTP client cần timeout, no credential forwarding, redirect policy và response size limit. Proxy/egress gateway tập trung policy nhưng không thay input validation.

## Góc nhìn Production

Log destination đã hash/redact, alert blocked egress và test IPv4/IPv6/mixed encoding.

## Trade-offs

SSRF có thể chạm cloud metadata, internal admin và pivot qua redirect/DNS rebinding. HTTP client cần timeout, no credential forwarding, redirect policy và response size limit. Proxy/egress gateway tập trung policy nhưng không thay input validation.

## Câu trả lời sai thường gặp

Chỉ chặn URL bắt đầu bằng `http://localhost` là đủ chống SSRF.

## Follow-up

- DNS rebinding bypass thế nào?

- Cloud metadata nên bảo vệ thêm gì?

## Nguồn chính thống

- [OWASP — OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [OWASP — OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP — OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
