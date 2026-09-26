---
id: cicd-artifact-provenance
type: interview-question
technology: CI/CD
category: CI/CD
difficulty: middle
topics:
  - artifact
  - provenance
  - supply-chain
relatedLessons:
  - secure-cicd-supply-chain
sources:
  - title: Secure use reference for GitHub Actions
    url: https://docs.github.com/en/actions/reference/security/secure-use
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OpenID Connect reference for GitHub Actions
    url: https://docs.github.com/en/actions/reference/security/oidc
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Docker build best practices
    url: https://docs.docker.com/build/building/best-practices/
    organization: Docker
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
    - id: artifact
      required: true
      aliases:
        - artifact
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: provenance
      required: true
      aliases:
        - provenance
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
        - Tag `latest` đã chứng minh image được build từ source hiện tại.
      penalty: 20
---

# Artifact provenance giúp ngăn rủi ro supply chain ra sao?

## Rubric

### Must Include

- artifact

- provenance

### Strong Answer Includes

- supply-chain

## Câu trả lời 30 giây

Metadata liên kết artifact với source commit, builder, dependencies và policy, giúp verify artifact được build từ pipeline tin cậy. Nó không thay scan/runtime least privilege.

## Câu trả lời chi tiết

Pin action/dependency digest, tạo SBOM/signature và verify khi deploy. Reproducible build giảm nhưng không luôn tuyệt đối do toolchain/time. Tách build identity và deploy identity, restrict registry mutation.

## Góc nhìn Production

Audit attestations, rejected unsigned images và dependency drift; có incident revoke key.

## Trade-offs

Pin action/dependency digest, tạo SBOM/signature và verify khi deploy. Reproducible build giảm nhưng không luôn tuyệt đối do toolchain/time. Tách build identity và deploy identity, restrict registry mutation.

## Câu trả lời sai thường gặp

Tag `latest` đã chứng minh image được build từ source hiện tại.

## Follow-up

- SBOM hỗ trợ incident response thế nào?

- Runner compromise containment ra sao?

## Nguồn chính thống

- [GitHub — Secure use reference for GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub — OpenID Connect reference for GitHub Actions](https://docs.github.com/en/actions/reference/security/oidc)
- [Docker — Docker build best practices](https://docs.docker.com/build/building/best-practices/)
