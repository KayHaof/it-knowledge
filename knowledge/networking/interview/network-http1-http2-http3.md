---
id: network-http1-http2-http3
type: interview-question
technology: Networking
category: Networking
difficulty: middle
topics:
  - HTTP/1.1
  - HTTP/2
  - HTTP/3
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
    - id: http-1-1
      required: true
      aliases:
        - HTTP/1.1
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: http-2
      required: true
      aliases:
        - HTTP/2
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: http-3
      required: false
      aliases:
        - HTTP/3
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - HTTP/2 nhanh gấp đôi mọi request và HTTP/3 không cần TLS.
      penalty: 20
---

# HTTP/2 và HTTP/3 cải thiện gì, không cải thiện gì?

## Rubric

### Must Include

- HTTP/1.1

- HTTP/2

### Strong Answer Includes

- HTTP/3

## Câu trả lời 30 giây

HTTP/2 multiplex stream trên TCP; HTTP/3 dùng QUIC để giảm head-of-line giữa stream khi mất packet. Payload, server queue và DB vẫn quyết định phần lớn latency.

## Câu trả lời chi tiết

HTTP/2 vẫn bị TCP loss ảnh hưởng nhiều stream; QUIC quản lý stream độc lập và tích hợp TLS 1.3 nhưng cần UDP path. Proxy/browser support và fallback phải kiểm. Benchmark mobile loss thay vì suy ra từ protocol name.

## Góc nhìn Production

Theo dõi protocol negotiation, retransmission và tail latency; giữ fallback.

## Trade-offs

HTTP/2 vẫn bị TCP loss ảnh hưởng nhiều stream; QUIC quản lý stream độc lập và tích hợp TLS 1.3 nhưng cần UDP path. Proxy/browser support và fallback phải kiểm. Benchmark mobile loss thay vì suy ra từ protocol name.

## Câu trả lời sai thường gặp

HTTP/2 nhanh gấp đôi mọi request và HTTP/3 không cần TLS.

## Follow-up

- HPACK/QPACK làm gì?

- Firewall UDP ảnh hưởng QUIC ra sao?

## Nguồn chính thống

- [NGINX — Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html)
- [F5 NGINX — NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [F5 NGINX — TCP and UDP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)
- [F5 NGINX — HTTP Health Checks](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/)
- [Kubernetes — Service](https://kubernetes.io/docs/concepts/services-networking/service/)
