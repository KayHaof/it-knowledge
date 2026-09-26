---
id: microservice-discovery-health
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - service-discovery
  - health
  - load-balancing
relatedLessons:
  - distributed-load-balancing-service-discovery
sources:
  - title: Service
    url: https://kubernetes.io/docs/concepts/services-networking/service/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: DNS for Services and Pods
    url: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: EndpointSlice API reference
    url: https://kubernetes.io/docs/reference/kubernetes-api/discovery/endpoint-slice-v1/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Topology Aware Routing
    url: https://kubernetes.io/docs/concepts/services-networking/topology-aware-routing/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Edit target group attributes for your Application Load Balancer
    url: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html
    organization: Amazon Web Services
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
    - id: service-discovery
      required: true
      aliases:
        - service-discovery
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: health
      required: true
      aliases:
        - health
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: load-balancing
      required: false
      aliases:
        - load-balancing
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Nếu process trả HTTP 200 ở `/health` thì instance luôn đủ khả năng nhận mọi traffic.
      penalty: 20
---

# Service discovery nên đăng ký instance khi nào và health check nên đo gì?

## Rubric

### Must Include

- service-discovery

- health

### Strong Answer Includes

- load-balancing

## Câu trả lời 30 giây

Instance chỉ nhận traffic sau khi dependency tối thiểu và readiness đạt; liveness chỉ kiểm process có tiến triển. Discovery stale cần TTL/heartbeat và client retry có budget.

## Câu trả lời chi tiết

Client-side/server-side discovery có trade-off topology, cache và failure. Health check quá sâu làm dependency outage cascade thành mọi pod unready; quá nông gửi traffic vào pod hỏng. Connection pools/DNS caching có thể giữ endpoint cũ sau deregister.

## Góc nhìn Production

Đo registration TTL, stale endpoint, readiness flapping, discovery latency và routing errors. Test rolling deploy, partition và zone failure.

## Trade-offs

Client-side/server-side discovery có trade-off topology, cache và failure. Health check quá sâu làm dependency outage cascade thành mọi pod unready; quá nông gửi traffic vào pod hỏng. Connection pools/DNS caching có thể giữ endpoint cũ sau deregister.

## Câu trả lời sai thường gặp

Nếu process trả HTTP 200 ở `/health` thì instance luôn đủ khả năng nhận mọi traffic.

## Follow-up

- Liveness phụ thuộc database có nguy hiểm gì?

- DNS TTL ảnh hưởng failover thế nào?

## Nguồn chính thống

- [Kubernetes — Service](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes — DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- [Kubernetes — EndpointSlice API reference](https://kubernetes.io/docs/reference/kubernetes-api/discovery/endpoint-slice-v1/)
- [Kubernetes — Topology Aware Routing](https://kubernetes.io/docs/concepts/services-networking/topology-aware-routing/)
- [Amazon Web Services — Edit target group attributes for your Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html)
