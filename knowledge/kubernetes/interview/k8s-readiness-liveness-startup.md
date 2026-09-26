---
id: k8s-readiness-liveness-startup
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: middle
topics:
  - probes
  - readiness
  - liveness
relatedLessons:
  - kubernetes-production-troubleshooting
sources:
  - title: Debug running Pods
    url: https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Pod lifecycle
    url: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Debug Services
    url: https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Debugging DNS resolution
    url: https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/
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
    - id: probes
      required: true
      aliases:
        - probes
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: readiness
      required: true
      aliases:
        - readiness
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: liveness
      required: false
      aliases:
        - liveness
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Liveness fail khi database down luôn là cách bảo đảm pod tự hồi phục.
      penalty: 20
---

# Readiness, liveness và startup probe nên dùng cho failure nào?

## Rubric

### Must Include

- probes

- readiness

### Strong Answer Includes

- liveness

## Câu trả lời 30 giây

Readiness quyết định nhận traffic; liveness restart process kẹt; startup cho app khởi động chậm trước khi liveness bắt đầu. Probe sai có thể gây restart/readiness flapping.

## Câu trả lời chi tiết

Readiness nên phản ánh khả năng phục vụ request hiện tại, không nhất thiết fail khi một dependency optional down. Liveness tránh check downstream sâu để không restart storm. Timeout/period/failureThreshold phải dựa startup/latency thật.

## Góc nhìn Production

Monitor probe latency/failure reason và rollout events; test dependency degradation.

## Trade-offs

Readiness nên phản ánh khả năng phục vụ request hiện tại, không nhất thiết fail khi một dependency optional down. Liveness tránh check downstream sâu để không restart storm. Timeout/period/failureThreshold phải dựa startup/latency thật.

## Câu trả lời sai thường gặp

Liveness fail khi database down luôn là cách bảo đảm pod tự hồi phục.

## Follow-up

- Startup probe bảo vệ liveness thế nào?

- Readiness drain connection ra sao?

## Nguồn chính thống

- [Kubernetes — Debug running Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/)
- [Kubernetes — Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
- [Kubernetes — Debug Services](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/)
- [Kubernetes — Debugging DNS resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
