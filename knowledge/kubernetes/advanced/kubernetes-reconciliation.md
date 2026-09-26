---
id: kubernetes-reconciliation
slug: kubernetes-reconciliation
title: Kubernetes Reconciliation Model
description: Desired state, controller loop, Pod/Deployment/Service, probes, resource requests và failure troubleshooting.
technology: Kubernetes
domain: devops
category: devops
level: advanced
contentType: production
order: 100
estimatedMinutes: 34
tags:
  - kubernetes
  - reconciliation
  - deployment
  - service
  - probes
prerequisites:
  - docker-production
related:
  - observability
  - cicd-pipeline
learningObjectives:
  - Giải thích reconciliation thay vì chỉ kubectl
  - Chọn request/limit và probe
  - Debug từ event/status/log/metric
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
lastReviewed: 2026-09-02
---

# Kubernetes Reconciliation Model

## Tổng quan

Desired state, controller loop, Pod/Deployment/Service, probes, resource requests và failure troubleshooting.

## Desired và observed state
Kubernetes object là record of intent. spec mô tả desired state; status phản ánh observed state. Controller liên tục quan sát chênh lệch và hành động để hội tụ. kubectl chỉ là client gọi API, không phải bản chất hệ thống.

```mermaid
flowchart LR
  S[Desired state: spec] --> C[Controller]
  O[Observed state: status] --> C
  C --> A[Create / update / delete]
  A --> O
```

## Workload và networking
Pod là scheduling unit ngắn hạn. Deployment quản lý ReplicaSet/rolling update cho stateless workload; StatefulSet thêm stable identity/ordered behavior nhưng không tự vận hành database an toàn. Service tạo stable discovery/virtual endpoint cho Pod thay đổi.

## Requests, limits, probes
Scheduler dùng requests để placement; CPU limit throttles, memory limit có thể OOMKill. Request quá thấp gây overcommit, quá cao lãng phí/không schedule. Readiness bỏ Pod khỏi traffic; liveness restart. Probe sai có thể tạo cascading restart.

:::warning Secret object
Tên “Secret” không mặc định đồng nghĩa dữ liệu được mã hóa end-to-end. Cần encryption at rest, RBAC, workload identity/external secret manager và tránh expose qua log/env dump.
:::

## Troubleshooting flow
1. kubectl get/describe: phase, condition, event, scheduling.
2. logs của container hiện tại và previous.
3. requests/limits, probe, config/secret mount.
4. Service selector, EndpointSlice, NetworkPolicy, DNS.
5. Node pressure, rollout history và control-plane signal.

## Key Takeaways
- Controller hội tụ, không thực thi một lần.
- Pod là disposable; Service cho endpoint ổn định.
- Resource/probe config là behavior production.
- Autoscaling không sửa dependency bottleneck.

:::flashcard
id: kubernetes-reconciliation-learning-objective
front: Bài “Kubernetes Reconciliation Model” đặt ra mục tiêu cốt lõi nào?
back: Giải thích reconciliation thay vì chỉ kubectl
level: advanced
tags: ["kubernetes","reconciliation","deployment","service","probes"]
:::

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
