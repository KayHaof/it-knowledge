---
id: network-reverse-proxy-forwarded
type: interview-question
technology: Networking
category: Networking
difficulty: middle
topics:
  - reverse-proxy
  - Forwarded
  - trust
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
    - id: reverse-proxy
      required: true
      aliases:
        - reverse-proxy
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: forwarded
      required: true
      aliases:
        - Forwarded
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: trust
      required: false
      aliases:
        - trust
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - X-Forwarded-For luôn chứa IP thật nên có thể trust trực tiếp.
      penalty: 20
---

# Ứng dụng nên tin Forwarded/X-Forwarded-For thế nào?

## Rubric

### Must Include

- reverse-proxy

- Forwarded

### Strong Answer Includes

- trust

## Câu trả lời 30 giây

Chỉ trust header do proxy trong allowlist ghi hoặc strip; client Internet có thể giả mạo. Sai trust làm rate-limit, audit IP và scheme redirect sai.

## Câu trả lời chi tiết

Chuỗi proxy có nhiều hop, framework cần trusted proxy count/network. IP không phải identity; dùng header cho observability/routing sau khi normalize. Test spoofing, IPv6 và direct-bypass.

## Góc nhìn Production

Audit raw/normalized headers ở edge và đồng bộ config môi trường.

## Trade-offs

Chuỗi proxy có nhiều hop, framework cần trusted proxy count/network. IP không phải identity; dùng header cho observability/routing sau khi normalize. Test spoofing, IPv6 và direct-bypass.

## Câu trả lời sai thường gặp

X-Forwarded-For luôn chứa IP thật nên có thể trust trực tiếp.

## Follow-up

- Rate limit theo IP có hạn chế nào?

- Forwarded header chuẩn khác gì?

## Nguồn chính thống

- [NGINX — Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html)
- [F5 NGINX — NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [F5 NGINX — TCP and UDP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)
- [F5 NGINX — HTTP Health Checks](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/)
- [Kubernetes — Service](https://kubernetes.io/docs/concepts/services-networking/service/)
