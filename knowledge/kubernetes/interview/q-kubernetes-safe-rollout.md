---
id: q-kubernetes-safe-rollout
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: senior
topics:
  - readiness
  - liveness
  - rollout
relatedLessons:
  - kubernetes-safe-rollouts
sources:
  - title: Kubernetes probes
    url: https://kubernetes.io/docs/concepts/workloads/pods/probes/
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
    - id: readiness
      required: true
      aliases:
        - readiness
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: liveness
      required: true
      aliases:
        - liveness
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: rollout
      required: false
      aliases:
        - rollout
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Liveness càng kiểm nhiều dependency càng đảm bảo high availability.
      penalty: 20
---

# Readiness, liveness và startup probe sai có thể gây outage thế nào?

## Rubric

### Must Include

- readiness

- liveness

### Strong Answer Includes

- rollout

## Câu trả lời 30 giây

Readiness quyết định Pod nhận traffic; liveness restart container; startup trì hoãn hai probe còn lại cho app khởi động chậm. Dùng liveness kiểm dependency có thể restart hàng loạt khi dependency down và làm sự cố nặng hơn.

## Câu trả lời chi tiết

Probe phải rẻ, có timeout/threshold theo startup và không tạo side effect. Readiness phản ánh khả năng phục vụ local request; liveness chỉ phát hiện process không thể tự phục hồi. Rollout còn cần surge/unavailable, graceful termination, preStop/termination budget, PDB và capacity cho hai versions.

## Deep Dive

Ready không chứng minh mọi downstream khỏe; đôi khi degrade có kiểm soát tốt hơn rút toàn bộ Pods khỏi service. PDB không bảo vệ mọi loại disruption.

## Góc nhìn Production

Canary metric theo version, watch rollout conditions/events, test SIGTERM/drain và rollback cả config/schema compatibility.

## Trade-offs

Ready không chứng minh mọi downstream khỏe; đôi khi degrade có kiểm soát tốt hơn rút toàn bộ Pods khỏi service. PDB không bảo vệ mọi loại disruption.

## Câu trả lời sai thường gặp

Liveness càng kiểm nhiều dependency càng đảm bảo high availability.

## Follow-up

- Readiness fail có restart Pod không?

- PDB bảo vệ voluntary disruption nào?

## Nguồn chính thống

- [Kubernetes — Kubernetes probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/)
