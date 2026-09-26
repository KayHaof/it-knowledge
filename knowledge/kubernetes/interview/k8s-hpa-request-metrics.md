---
id: k8s-hpa-request-metrics
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: senior
topics:
  - HPA
  - requests
  - autoscaling
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
    - id: hpa
      required: true
      aliases:
        - HPA
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: requests
      required: true
      aliases:
        - requests
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: autoscaling
      required: false
      aliases:
        - autoscaling
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - HPA luôn biết số user và scale chính xác theo traffic dù request/metric không cấu hình.
      penalty: 20
---

# HPA dựa CPU utilization có thể scale sai khi nào?

## Rubric

### Must Include

- HPA

- requests

### Strong Answer Includes

- autoscaling

## Câu trả lời 30 giây

Utilization tính theo request; request đặt sai làm target méo. CPU cũng không phản ánh queue age, I/O wait hoặc downstream capacity.

## Câu trả lời chi tiết

HPA có stabilization/cooldown và metrics pipeline delay; scale out không vượt partition/DB capacity. Kết hợp custom metric như queue age/RPS per pod với maxReplicas và PDB. Load test burst/cooldown tránh oscillation.

## Góc nhìn Production

Theo dõi desired/current replicas, metric freshness và scale events; capacity plan node pool.

## Trade-offs

HPA có stabilization/cooldown và metrics pipeline delay; scale out không vượt partition/DB capacity. Kết hợp custom metric như queue age/RPS per pod với maxReplicas và PDB. Load test burst/cooldown tránh oscillation.

## Câu trả lời sai thường gặp

HPA luôn biết số user và scale chính xác theo traffic dù request/metric không cấu hình.

## Follow-up

- Scale-to-zero có rủi ro gì?

- PDB ảnh hưởng voluntary disruption thế nào?

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
