---
id: k8s-pod-deployment-replicaset
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: junior
topics:
  - Pod
  - Deployment
  - ReplicaSet
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
    - id: pod
      required: true
      aliases:
        - Pod
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: deployment
      required: true
      aliases:
        - Deployment
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: replicaset
      required: false
      aliases:
        - ReplicaSet
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Deployment là một Pod đặc biệt và tự chứa IP ổn định cho client.
      penalty: 20
---

# Pod, ReplicaSet và Deployment có trách nhiệm khác nhau nào?

## Rubric

### Must Include

- Pod

- Deployment

### Strong Answer Includes

- ReplicaSet

## Câu trả lời 30 giây

Pod là đơn vị chạy; ReplicaSet giữ số replica; Deployment quản revision/rollout/rollback của ReplicaSet. Pod không nên quản lý trực tiếp cho workload stateless.

## Câu trả lời chi tiết

Deployment selector/template tạo ReplicaSet mới khi spec đổi và scale theo desired state. Pod có lifecycle ephemeral nên dùng labels/service discovery. Stateful workload cần identity/storage ổn định qua StatefulSet.

## Góc nhìn Production

Kiểm selector immutable, rollout status và surge/unavailable; không sửa Pod thủ công.

## Trade-offs

Deployment selector/template tạo ReplicaSet mới khi spec đổi và scale theo desired state. Pod có lifecycle ephemeral nên dùng labels/service discovery. Stateful workload cần identity/storage ổn định qua StatefulSet.

## Câu trả lời sai thường gặp

Deployment là một Pod đặc biệt và tự chứa IP ổn định cho client.

## Follow-up

- Service chọn Pod bằng gì?

- Rollback image khi config drift thế nào?

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
