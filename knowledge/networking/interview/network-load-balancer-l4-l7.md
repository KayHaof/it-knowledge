---
id: network-load-balancer-l4-l7
type: interview-question
technology: Networking
category: Networking
difficulty: middle
topics:
  - load-balancer
  - L4
  - L7
relatedLessons:
  - scaling-load-balancing-reverse-proxy
sources:
  - title: Using nginx as HTTP load balancer
    url: https://nginx.org/en/docs/http/load_balancing.html
    organization: NGINX
    type: official-documentation
    accessedAt: 2026-09-02
  - title: NGINX Reverse Proxy
    url: https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/
    organization: F5 NGINX
    type: official-documentation
    accessedAt: 2026-09-02
  - title: TCP and UDP Load Balancing
    url: https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/
    organization: F5 NGINX
    type: official-documentation
    accessedAt: 2026-09-02
  - title: HTTP Health Checks
    url: https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/
    organization: F5 NGINX
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Service
    url: https://kubernetes.io/docs/concepts/services-networking/service/
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
    - id: load-balancer
      required: true
      aliases:
        - load-balancer
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: l4
      required: true
      aliases:
        - L4
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: l7
      required: false
      aliases:
        - L7
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - L4 nhìn được URL path vì TCP chứa HTTP semantics.
      penalty: 20
---

# L4 và L7 load balancer khác nhau ở quyết định route?

## Rubric

### Must Include

- load-balancer

- L4

### Strong Answer Includes

- L7

## Câu trả lời 30 giây

L4 route theo TCP/UDP connection; L7 hiểu HTTP host/path/header và có thể terminate TLS. L7 nhiều policy hơn nhưng thêm CPU/state và privacy boundary.

## Câu trả lời chi tiết

L4 giữ protocol end-to-end; L7 hỗ trợ canary, auth, compression nhưng là bottleneck/policy point. WebSocket upgrade, idle timeout và source IP preservation cần kiểm. Health check phải phản ánh readiness thật.

## Góc nhìn Production

Đo backend error, drain, TLS CPU và zone failure; không health-check dependency nặng.

## Trade-offs

L4 giữ protocol end-to-end; L7 hỗ trợ canary, auth, compression nhưng là bottleneck/policy point. WebSocket upgrade, idle timeout và source IP preservation cần kiểm. Health check phải phản ánh readiness thật.

## Câu trả lời sai thường gặp

L4 nhìn được URL path vì TCP chứa HTTP semantics.

## Follow-up

- Connection draining khi deploy ra sao?

- Readiness khác process liveness thế nào?

## Nguồn chính thống

- [NGINX — Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html)
- [F5 NGINX — NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [F5 NGINX — TCP and UDP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)
- [F5 NGINX — HTTP Health Checks](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/)
- [Kubernetes — Service](https://kubernetes.io/docs/concepts/services-networking/service/)
