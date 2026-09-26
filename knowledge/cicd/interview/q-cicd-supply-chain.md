---
id: q-cicd-supply-chain
type: interview-question
technology: CI/CD
category: CI/CD
difficulty: senior
topics:
  - OIDC
  - actions
  - supply-chain
relatedLessons:
  - secure-cicd-supply-chain
sources:
  - title: Secure use reference for GitHub Actions
    url: https://docs.github.com/en/actions/reference/security/secure-use
    organization: GitHub
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
    - id: oidc
      required: true
      aliases:
        - OIDC
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: actions
      required: true
      aliases:
        - actions
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: supply-chain
      required: false
      aliases:
        - supply-chain
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Repository private và test pass nên third-party action dùng tag latest là an toàn.
      penalty: 20
---

# Pipeline CI/CD chạy xanh đã đủ chứng minh artifact an toàn để deploy chưa?

## Rubric

### Must Include

- OIDC

- actions

### Strong Answer Includes

- supply-chain

## Câu trả lời 30 giây

Không. Pipeline có thể dùng action/dependency bị compromise, secret quyền quá rộng hoặc artifact không truy xuất được nguồn. Cần least privilege, pin dependency/action, ephemeral OIDC, artifact provenance/signing và policy promotion.

## Câu trả lời chi tiết

Tôi tách build một lần khỏi promote nhiều môi trường, bảo vệ branch/review, pin immutable refs, giới hạn token permissions và environment approval. OIDC cấp credential ngắn hạn theo claims thay long-lived cloud secret. Artifact digest/provenance nối source, workflow và deployment; verify tại admission/deploy.

## Deep Dive

Cache và pull request từ fork là trust boundary. Không cho untrusted code chạy với write token/secrets; generated logs/artifacts cần redaction và retention.

## Góc nhìn Production

Audit permission, rotate/revoke, simulate compromised dependency và chứng minh rollback dùng artifact đã biết chứ không rebuild.

## Trade-offs

Cache và pull request từ fork là trust boundary. Không cho untrusted code chạy với write token/secrets; generated logs/artifacts cần redaction và retention.

## Câu trả lời sai thường gặp

Repository private và test pass nên third-party action dùng tag latest là an toàn.

## Follow-up

- Pin SHA giải quyết và không giải quyết gì?

- OIDC trust policy nên ràng buộc claims nào?

## Nguồn chính thống

- [GitHub — Secure use reference for GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use)
