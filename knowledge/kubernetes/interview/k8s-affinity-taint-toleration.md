---
id: k8s-affinity-taint-toleration
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: middle
topics:
  - affinity
  - taint
  - toleration
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
    - id: affinity
      required: true
      aliases:
        - affinity
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: taint
      required: true
      aliases:
        - taint
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: toleration
      required: false
      aliases:
        - toleration
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Toleration bắt scheduler đặt Pod lên node có taint.
      penalty: 20
---

# Taint/toleration khác node affinity thế nào?

## Rubric

### Must Include

- affinity

- taint

### Strong Answer Includes

- toleration

## Câu trả lời 30 giây

Taint đẩy Pod khỏi node trừ khi Pod có toleration; affinity kéo Pod về node phù hợp. Toleration không tự yêu cầu schedule lên node bị taint.

## Câu trả lời chi tiết

Required affinity có thể làm Pod Pending; preferred chỉ là ưu tiên. Topology spread/anti-affinity phân tán replica theo zone/host. Kết hợp taint cho node chuyên dụng và toleration/affinity để tránh workload ngoài ý muốn.

## Góc nhìn Production

Audit unschedulable events và zone skew; đừng tạo constraint không có capacity dự phòng.

## Trade-offs

Required affinity có thể làm Pod Pending; preferred chỉ là ưu tiên. Topology spread/anti-affinity phân tán replica theo zone/host. Kết hợp taint cho node chuyên dụng và toleration/affinity để tránh workload ngoài ý muốn.

## Câu trả lời sai thường gặp

Toleration bắt scheduler đặt Pod lên node có taint.

## Follow-up

- NoExecute toleration ảnh hưởng Pod đang chạy thế nào?

- Anti-affinity có thể gây deadlock rollout không?

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
