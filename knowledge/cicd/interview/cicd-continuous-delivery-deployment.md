---
id: cicd-continuous-delivery-deployment
type: interview-question
technology: CI/CD
category: CI/CD
difficulty: junior
topics:
  - CI
  - continuous-delivery
  - pipeline
relatedLessons:
  - cicd-pipeline
sources:
  - title: Understanding GitHub Actions
    url: https://docs.github.com/en/actions/get-started/understand-github-actions
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Workflow syntax for GitHub Actions
    url: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Workflow artifacts
    url: https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Managing environments for deployment
    url: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments
    organization: GitHub
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Deployments
    url: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
    organization: Kubernetes
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
    - id: ci
      required: true
      aliases:
        - CI
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: continuous-delivery
      required: true
      aliases:
        - continuous-delivery
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: pipeline
      required: false
      aliases:
        - pipeline
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Continuous Delivery nghĩa là mọi commit tự động lên production giống Deployment.
      penalty: 20
---

# Continuous Delivery khác Continuous Deployment ở gate nào?

## Rubric

### Must Include

- CI

- continuous-delivery

### Strong Answer Includes

- pipeline

## Câu trả lời 30 giây

Delivery giữ artifact luôn sẵn sàng nhưng production deploy cần phê duyệt/gate; Deployment tự động promote khi pipeline đạt policy. Cả hai cần test và rollback.

## Câu trả lời chi tiết

Pipeline nên build once, promote immutable artifact qua env, không rebuild khác nhau. Gate gồm tests, security scan, approval hoặc progressive metric. Deployment frequency không nên đánh đổi change failure rate.

## Góc nhìn Production

Track lead time, failure rate, rollback time và artifact provenance.

## Trade-offs

Pipeline nên build once, promote immutable artifact qua env, không rebuild khác nhau. Gate gồm tests, security scan, approval hoặc progressive metric. Deployment frequency không nên đánh đổi change failure rate.

## Câu trả lời sai thường gặp

Continuous Delivery nghĩa là mọi commit tự động lên production giống Deployment.

## Follow-up

- Build once promote many vì sao?

- Rollback schema migration thế nào?

## Nguồn chính thống

- [GitHub — Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [GitHub — Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [GitHub — Workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts)
- [GitHub — Managing environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
- [Kubernetes — Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
