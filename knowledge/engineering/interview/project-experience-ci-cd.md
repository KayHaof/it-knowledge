---
id: project-experience-ci-cd
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: middle
topics:
  - CI/CD
  - delivery
  - rollback
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
    - id: ci-cd
      required: true
      aliases:
        - CI/CD
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: delivery
      required: true
      aliases:
        - delivery
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
        - Có pipeline build thành công nghĩa release production đã an toàn và rollback tự động.
      penalty: 20
---

# Mô tả CI/CD của một project mà không phóng đại mức độ automation?

## Rubric

### Must Include

- CI/CD

- delivery

### Strong Answer Includes

- rollback

## Câu trả lời 30 giây

Tôi tách những gate đã thấy (build/test/lint/artifact) khỏi đề xuất tương lai như canary hay signing. Tôi nói artifact nào được promote, secret boundary và cách rollback.

## Câu trả lời chi tiết

Khung gồm source trigger, reproducible build, test layers, image/artifact registry, environment promotion, approval, migration và telemetry. Nêu failure mode: flaky test, registry down, bad config, schema incompatibility. Nếu chưa chạy production deployment, nói rõ limitation và rehearsal plan.

## Góc nhìn Production

Đo lead time/change failure/rollback time; không gọi manual copy server là continuous deployment.

## Trade-offs

Khung gồm source trigger, reproducible build, test layers, image/artifact registry, environment promotion, approval, migration và telemetry. Nêu failure mode: flaky test, registry down, bad config, schema incompatibility. Nếu chưa chạy production deployment, nói rõ limitation và rehearsal plan.

## Câu trả lời sai thường gặp

Có pipeline build thành công nghĩa release production đã an toàn và rollback tự động.

## Follow-up

- Build once promote many vì sao?

- Rollback migration dữ liệu thế nào?

## Nguồn chính thống

- [GitHub — Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [GitHub — Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [GitHub — Workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts)
- [GitHub — Managing environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
- [Kubernetes — Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
