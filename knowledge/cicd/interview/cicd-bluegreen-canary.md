---
id: cicd-bluegreen-canary
type: interview-question
technology: CI/CD
category: CI/CD
difficulty: middle
topics:
  - blue-green
  - canary
  - rollback
relatedLessons:
  - cicd-gitops-deployment-strategies
sources:
  - title: Managing environments for deployment
    url: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: OpenID Connect
    url: https://docs.github.com/en/actions/concepts/security/openid-connect
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Using artifact attestations to establish provenance for builds
    url: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Deployments
    url: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: git-revert
    url: https://git-scm.com/docs/git-revert.html
    organization: Git project
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
    - id: blue-green
      required: true
      aliases:
        - blue-green
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: canary
      required: true
      aliases:
        - canary
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: rollback
      required: false
      aliases:
        - rollback
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Canary chỉ cần gửi 1% traffic vài phút là chứng minh release an toàn.
      penalty: 20
---

# Blue-green và canary phù hợp risk profile nào?

## Rubric

### Must Include

- blue-green

- canary

### Strong Answer Includes

- rollback

## Câu trả lời 30 giây

Blue-green chuyển traffic giữa hai môi trường nên rollback nhanh nhưng tốn gấp đôi capacity. Canary gửi tỷ lệ nhỏ theo metric, giảm blast radius nhưng routing/analysis phức tạp.

## Câu trả lời chi tiết

Canary cần cohort ổn định, guardrail error/latency và đủ duration để bắt async/background effects. Blue-green cần database backward compatibility và session/cache handling. Rolling update tiết kiệm hơn nhưng rollback chậm hơn.

## Góc nhìn Production

Automate abort/rollback, phân biệt metric canary với control và giữ migration reversible.

## Trade-offs

Canary cần cohort ổn định, guardrail error/latency và đủ duration để bắt async/background effects. Blue-green cần database backward compatibility và session/cache handling. Rolling update tiết kiệm hơn nhưng rollback chậm hơn.

## Câu trả lời sai thường gặp

Canary chỉ cần gửi 1% traffic vài phút là chứng minh release an toàn.

## Follow-up

- Session sticky ảnh hưởng canary thế nào?

- DB migration expand-contract là gì?

## Nguồn chính thống

- [GitHub — Managing environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
- [GitHub — OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)
- [GitHub — Using artifact attestations to establish provenance for builds](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
- [Kubernetes — Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Git project — git-revert](https://git-scm.com/docs/git-revert.html)
