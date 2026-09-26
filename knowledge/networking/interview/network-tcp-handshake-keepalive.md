---
id: network-tcp-handshake-keepalive
type: interview-question
technology: Networking
category: Networking
difficulty: junior
topics:
  - TCP
  - handshake
  - keep-alive
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
    - id: tcp
      required: true
      aliases:
        - TCP
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: handshake
      required: true
      aliases:
        - handshake
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: keep-alive
      required: false
      aliases:
        - keep-alive
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mỗi HTTP request luôn tạo TCP connection mới để an toàn.
      penalty: 20
---

# TCP handshake và connection reuse ảnh hưởng latency ra sao?

## Rubric

### Must Include

- TCP

- handshake

### Strong Answer Includes

- keep-alive

## Câu trả lời 30 giây

TCP cần SYN/SYN-ACK/ACK trước payload, HTTPS còn TLS handshake. Keep-alive và connection pool amortize chi phí nhưng idle timeout mismatch gây reset.

## Câu trả lời chi tiết

Pool reuse socket tới origin; LB/server/client có timeout khác nhau nên cần max lifetime và drain. SYN backlog hoặc ephemeral port exhaustion làm connect fail. HTTP/2 multiplexing giảm connection count nhưng không xóa mọi transport bottleneck.

## Góc nhìn Production

Đo connect/TLS/request latency, reset và pool wait; align idle timeouts.

## Trade-offs

Pool reuse socket tới origin; LB/server/client có timeout khác nhau nên cần max lifetime và drain. SYN backlog hoặc ephemeral port exhaustion làm connect fail. HTTP/2 multiplexing giảm connection count nhưng không xóa mọi transport bottleneck.

## Câu trả lời sai thường gặp

Mỗi HTTP request luôn tạo TCP connection mới để an toàn.

## Follow-up

- TLS session resumption giúp gì?

- Ephemeral ports cạn nhận biết ra sao?

## Nguồn chính thống

- [NGINX — Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html)
- [F5 NGINX — NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [F5 NGINX — TCP and UDP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)
- [F5 NGINX — HTTP Health Checks](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/)
- [Kubernetes — Service](https://kubernetes.io/docs/concepts/services-networking/service/)
