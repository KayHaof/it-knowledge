---
id: k8s-control-plane-components
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: junior
topics:
  - API Server
  - etcd
  - scheduler
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
    - id: api-server
      required: true
      aliases:
        - API Server
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: etcd
      required: true
      aliases:
        - etcd
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: scheduler
      required: false
      aliases:
        - scheduler
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Scheduler trực tiếp chạy container và etcd chỉ là log tùy chọn.
      penalty: 20
---

# Các control-plane component Kubernetes phối hợp thế nào?

## Rubric

### Must Include

- API Server

- etcd

### Strong Answer Includes

- scheduler

## Câu trả lời 30 giây

API server là cửa vào; etcd lưu desired/cluster state; scheduler chọn node; controller manager reconcile actual với desired. Kubelet trên node thực thi Pod.

## Câu trả lời chi tiết

Controllers watch API và tạo/update resource, scheduler ghi binding, kubelet báo status và runtime chạy container. etcd consistency/backup là critical; API availability không đồng nghĩa workload healthy. RBAC/audit bảo vệ control plane.

## Góc nhìn Production

Monitor API latency, etcd fsync/space, controller queue và scheduler errors; backup/restore etcd định kỳ.

## Trade-offs

Controllers watch API và tạo/update resource, scheduler ghi binding, kubelet báo status và runtime chạy container. etcd consistency/backup là critical; API availability không đồng nghĩa workload healthy. RBAC/audit bảo vệ control plane.

## Câu trả lời sai thường gặp

Scheduler trực tiếp chạy container và etcd chỉ là log tùy chọn.

## Follow-up

- Reconciliation loop là gì?

- Etcd quorum mất thì cluster làm sao?

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
