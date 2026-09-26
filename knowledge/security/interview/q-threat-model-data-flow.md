---
id: q-threat-model-data-flow
type: interview-question
technology: Security
category: Security
difficulty: senior
topics:
  - threat-modeling
  - trust-boundary
  - STRIDE
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
    - id: threat-modeling
      required: true
      aliases:
        - threat-modeling
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: trust-boundary
      required: true
      aliases:
        - trust-boundary
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: stride
      required: false
      aliases:
        - STRIDE
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chạy STRIDE cho từng box, liệt kê mọi threat lý thuyết và đánh dấu đã có HTTPS/JWT là hoàn thành.
      penalty: 20
---

# Bạn biến threat model thành engineering work thay vì một checklist STRIDE như thế nào?

## Rubric

### Must Include

- threat-modeling

- trust-boundary

### Strong Answer Includes

- STRIDE

## Câu trả lời 30 giây

Vẽ data-flow với assets, actors, stores và trust boundaries; nêu abuse cases theo capability kẻ tấn công, ưu tiên risk, rồi chuyển mitigation thành requirement/test/telemetry có owner và deadline. STRIDE chỉ là prompt tìm threat.

## Câu trả lời chi tiết

Tôi chọn một critical flow, đánh dấu identity/authorization/data classification tại mỗi boundary, assumptions và third parties. Với từng threat, ghi precondition, asset impact, existing control, residual risk và verification: schema/authz test, rate limit, audit alert hoặc incident drill. Risk owner chấp nhận/giảm/chuyển/tránh. Model được review khi API, data flow, deployment hoặc trust thay đổi, không chỉ trước release.

## Deep Dive

Authentication thành công không giải object-level authorization; encryption không ngăn authorized abuse. Abuse case có business context thường tìm ra quota, replay, tenant isolation và recovery risk mà taxonomy thuần túy bỏ sót.

## Góc nhìn Production

Version-control diagram/decisions, link controls tới test và observable signal, red-team/tabletop critical paths. Findings không có owner/SLA sẽ thành tài liệu chết.

## Trade-offs

Authentication thành công không giải object-level authorization; encryption không ngăn authorized abuse. Abuse case có business context thường tìm ra quota, replay, tenant isolation và recovery risk mà taxonomy thuần túy bỏ sót.

## Câu trả lời sai thường gặp

Chạy STRIDE cho từng box, liệt kê mọi threat lý thuyết và đánh dấu đã có HTTPS/JWT là hoàn thành.

## Follow-up

- Trust boundary khác network boundary thế nào?

- Residual risk nên được ai chấp nhận?

## Nguồn chính thống

- [OWASP — OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [OWASP — OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP — OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
