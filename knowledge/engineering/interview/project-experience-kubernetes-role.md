---
id: project-experience-kubernetes-role
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: middle
topics:
  - Kubernetes
  - operations
  - probes
relatedLessons:
  - kubernetes-reconciliation
sources:
  - title: Objects in Kubernetes
    url: https://kubernetes.io/docs/concepts/overview/working-with-objects/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Controllers
    url: https://kubernetes.io/docs/concepts/architecture/controller/
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
    - id: kubernetes
      required: true
      aliases:
        - Kubernetes
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: operations
      required: true
      aliases:
        - operations
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: probes
      required: false
      aliases:
        - probes
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chạy app trong Kubernetes tự động đảm bảo high availability và autoscaling đúng.
      penalty: 20
---

# Trả lời “Kubernetes giúp project ở đâu?” bằng ranh giới thực tế nào?

## Rubric

### Must Include

- Kubernetes

- operations

### Strong Answer Includes

- probes

## Câu trả lời 30 giây

Kubernetes cung cấp scheduling, reconciliation, service discovery và rollout primitives; app vẫn phải có probes, resource requests, graceful shutdown và observability. Nó không tự làm code stateless hay database HA.

## Câu trả lời chi tiết

Tôi mô tả workload/deployment, config/secret boundary, readiness/liveness, HPA và rollback evidence nếu có. Nêu failure Pending/CrashLoop/OOM và runbook. Nếu repo chỉ có manifest mẫu, phân biệt rõ sample với cluster production.

## Góc nhìn Production

Theo dõi events, restart, saturation và rollout; backup/stateful ownership ngoài scheduler.

## Trade-offs

Tôi mô tả workload/deployment, config/secret boundary, readiness/liveness, HPA và rollback evidence nếu có. Nêu failure Pending/CrashLoop/OOM và runbook. Nếu repo chỉ có manifest mẫu, phân biệt rõ sample với cluster production.

## Câu trả lời sai thường gặp

Chạy app trong Kubernetes tự động đảm bảo high availability và autoscaling đúng.

## Follow-up

- Readiness khác liveness thế nào?

- Kubernetes không cứu được dependency down ra sao?

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
