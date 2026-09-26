---
id: k8s-rbac-secret-configmap
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: middle
topics:
  - RBAC
  - Secret
  - ConfigMap
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
    - id: rbac
      required: true
      aliases:
        - RBAC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: secret
      required: true
      aliases:
        - Secret
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: configmap
      required: false
      aliases:
        - ConfigMap
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Base64 trong Secret đã mã hóa nên ai đọc object cũng không thể giải mã.
      penalty: 20
---

# ConfigMap và Secret khác nhau ở security boundary nào?

## Rubric

### Must Include

- RBAC

- Secret

### Strong Answer Includes

- ConfigMap

## Câu trả lời 30 giây

Cả hai đều config object; Secret mặc định chỉ base64, không phải encryption nếu cluster at rest chưa bật. RBAC, encryption at rest và external secret manager mới bảo vệ secret.

## Câu trả lời chi tiết

ConfigMap phù hợp non-sensitive config; Secret cần least-privilege ServiceAccount, audit và rotation. Mount/env có thể lộ qua process/debug. RBAC Role/RoleBinding giới hạn namespace, ClusterRole rộng hơn.

## Góc nhìn Production

Bật etcd encryption, scan manifest/log và rotate credential; kiểm quyền bằng impersonation.

## Trade-offs

ConfigMap phù hợp non-sensitive config; Secret cần least-privilege ServiceAccount, audit và rotation. Mount/env có thể lộ qua process/debug. RBAC Role/RoleBinding giới hạn namespace, ClusterRole rộng hơn.

## Câu trả lời sai thường gặp

Base64 trong Secret đã mã hóa nên ai đọc object cũng không thể giải mã.

## Follow-up

- Secret rotation không restart app được không?

- RBAC deny-by-default thiết kế thế nào?

## Nguồn chính thống

- [OWASP — OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP — OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
