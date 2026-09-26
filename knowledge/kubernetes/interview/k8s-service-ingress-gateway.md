---
id: k8s-service-ingress-gateway
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: middle
topics:
  - Service
  - Ingress
  - Gateway
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
    - id: service
      required: true
      aliases:
        - Service
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: ingress
      required: true
      aliases:
        - Ingress
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: gateway
      required: false
      aliases:
        - Gateway
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Service luôn public Internet và Ingress tự provision load balancer trong mọi cluster.
      penalty: 20
---

# Service, Ingress và Gateway API giải quyết các lớp traffic nào?

## Rubric

### Must Include

- Service

- Ingress

### Strong Answer Includes

- Gateway

## Câu trả lời 30 giây

Service cung cấp virtual IP/discovery nội cluster; Ingress/Gateway route HTTP từ ngoài vào. Gateway API biểu đạt role/route rõ hơn nhưng implementation/controller vẫn cần cấu hình.

## Câu trả lời chi tiết

ClusterIP/NodePort/LoadBalancer có semantics khác; Ingress controller terminate TLS và route host/path. Health/readiness, external DNS, source IP và timeout cần kiểm. Gateway resources tách infrastructure ownership khỏi app route.

## Góc nhìn Production

Theo dõi backend endpoints, 4xx/5xx/TLS và controller sync; canary route có rollback.

## Trade-offs

ClusterIP/NodePort/LoadBalancer có semantics khác; Ingress controller terminate TLS và route host/path. Health/readiness, external DNS, source IP và timeout cần kiểm. Gateway resources tách infrastructure ownership khỏi app route.

## Câu trả lời sai thường gặp

Service luôn public Internet và Ingress tự provision load balancer trong mọi cluster.

## Follow-up

- Headless Service dùng khi nào?

- Gateway API khác Ingress annotation ở đâu?

## Nguồn chính thống

- [Kubernetes — Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
