---
id: q-kubernetes
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: middle
topics:
  - controller
  - reconciliation
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
    - id: controller
      required: true
      aliases:
        - controller
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: reconciliation
      required: true
      aliases:
        - reconciliation
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - kubectl apply chạy tuần tự các lệnh cho tới khi app khỏe.
      penalty: 20
---

# Kubernetes hoạt động theo reconciliation nghĩa là gì?

## Rubric

### Must Include

- controller

- reconciliation

### Strong Answer Includes

## Câu trả lời 30 giây

spec mô tả desired state, status phản ánh observed state; controller lặp liên tục để giảm sai lệch bằng create/update/delete resource.

## Câu trả lời chi tiết

API server lưu object. Controller watch state, so với intent và hành động idempotent để hội tụ. Vì là loop eventual, command apply thành công không đồng nghĩa workload ready ngay. Conditions, events, probes, scheduling và rollout status mới cho observed result.

## Góc nhìn Production

Controller phải xử lý retry/idempotency; probe/resource sai có thể khiến reconciliation tạo vòng restart.

## Trade-offs

API server lưu object. Controller watch state, so với intent và hành động idempotent để hội tụ. Vì là loop eventual, command apply thành công không đồng nghĩa workload ready ngay. Conditions, events, probes, scheduling và rollout status mới cho observed result.

## Câu trả lời sai thường gặp

kubectl apply chạy tuần tự các lệnh cho tới khi app khỏe.

## Follow-up

- Readiness khác liveness?

- Deployment quản lý Pod qua object nào?

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
