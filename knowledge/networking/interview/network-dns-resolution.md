---
id: network-dns-resolution
type: interview-question
technology: Networking
category: Networking
difficulty: junior
topics:
  - DNS
  - TTL
  - resolver
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
    - id: dns
      required: true
      aliases:
        - DNS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: ttl
      required: true
      aliases:
        - TTL
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: resolver
      required: false
      aliases:
        - resolver
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - DNS luôn trả IP mới ngay khi record thay đổi vì client không cache.
      penalty: 20
---

# DNS lookup có những bước và failure mode nào?

## Rubric

### Must Include

- DNS

- TTL

### Strong Answer Includes

- resolver

## Câu trả lời 30 giây

Client/resolver tra cache rồi có thể truy vấn recursive và authoritative server. Stale TTL, NXDOMAIN, SERVFAIL, timeout hoặc split-horizon đều có thể làm request lỗi.

## Câu trả lời chi tiết

Process còn có thể cache IP và connection pool ngoài DNS TTL, nên rollout LB chưa có hiệu lực ngay. Debug từ cùng network namespace, kiểm record A/AAAA, search domain và resolver. DNS không phải health check tức thời.

## Góc nhìn Production

Theo dõi lookup latency, SERVFAIL/NXDOMAIN và cache age; chuẩn bị resolver dự phòng.

## Trade-offs

Process còn có thể cache IP và connection pool ngoài DNS TTL, nên rollout LB chưa có hiệu lực ngay. Debug từ cùng network namespace, kiểm record A/AAAA, search domain và resolver. DNS không phải health check tức thời.

## Câu trả lời sai thường gặp

DNS luôn trả IP mới ngay khi record thay đổi vì client không cache.

## Follow-up

- TTL dài gây lỗi deploy thế nào?

- A record và CNAME khác gì?

## Nguồn chính thống

- [NGINX — Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html)
- [F5 NGINX — NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [F5 NGINX — TCP and UDP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)
- [F5 NGINX — HTTP Health Checks](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/)
- [Kubernetes — Service](https://kubernetes.io/docs/concepts/services-networking/service/)
