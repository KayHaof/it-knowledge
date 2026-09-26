---
id: k8s-statefulset-storage
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: senior
topics:
  - StatefulSet
  - PVC
  - identity
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
    - id: statefulset
      required: true
      aliases:
        - StatefulSet
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: pvc
      required: true
      aliases:
        - PVC
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: identity
      required: false
      aliases:
        - identity
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chạy database trong StatefulSet tự động đảm bảo HA và backup.
      penalty: 20
---

# StatefulSet phù hợp workload nào và không tự giải quyết điều gì?

## Rubric

### Must Include

- StatefulSet

- PVC

### Strong Answer Includes

- identity

## Câu trả lời 30 giây

Nó cung cấp identity/order/storage claim ổn định cho stateful workload. Nó không tự tạo replication consistency, backup hay database failover đúng nghiệp vụ.

## Câu trả lời chi tiết

Headless Service + ordinal Pod + PVC hỗ trợ cluster member identity. Update/scale có ordering và disruption semantics; storage class/zone/failover cần database operator/runbook. Snapshot volume không luôn là consistent application backup.

## Góc nhìn Production

Test restore, node/zone loss và replication lag; PDB không thay quorum planning.

## Trade-offs

Headless Service + ordinal Pod + PVC hỗ trợ cluster member identity. Update/scale có ordering và disruption semantics; storage class/zone/failover cần database operator/runbook. Snapshot volume không luôn là consistent application backup.

## Câu trả lời sai thường gặp

Chạy database trong StatefulSet tự động đảm bảo HA và backup.

## Follow-up

- PVC binding theo zone thế nào?

- Operator thêm giá trị gì?

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
