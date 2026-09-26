---
id: system-design-api-gateway-resilience
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - gateway
  - resilience
  - rate-limit
relatedLessons:
  - api-gateway-bff-service-mesh
sources:
  - title: API integration — Backend for frontend
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/api-integration-data-fetching.html
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: What is Amazon API Gateway?
    url: https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html
    organization: Amazon Web Services
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Istio Traffic Management
    url: https://istio.io/latest/docs/concepts/traffic-management/
    organization: Istio
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Istio Security
    url: https://istio.io/latest/docs/concepts/security/
    organization: Istio
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Istio Observability
    url: https://istio.io/latest/docs/concepts/observability/
    organization: Istio
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
    - id: gateway
      required: true
      aliases:
        - gateway
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: resilience
      required: true
      aliases:
        - resilience
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: rate-limit
      required: false
      aliases:
        - rate-limit
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đưa mọi business rule vào gateway giúp service phía sau đơn giản và không có downside.
      penalty: 20
---

# API gateway nên làm gì và không nên làm gì trong kiến trúc microservices?

## Rubric

### Must Include

- gateway

- resilience

### Strong Answer Includes

- rate-limit

## Câu trả lời 30 giây

Gateway làm TLS/authn, routing, rate limit, request shaping và observability; business transaction phức tạp nên ở service. Fan-out cần timeout/budget/fallback.

## Câu trả lời chi tiết

Gateway là choke point nên scale stateless, config rollout và failure isolation. BFF có thể aggregate client-specific nhưng tránh domain coupling. Header trust, body size, WebSocket upgrade và retry policy phải rõ.

## Góc nhìn Production

Theo dõi route p99, config error, upstream saturation và gateway CPU.

## Trade-offs

Gateway là choke point nên scale stateless, config rollout và failure isolation. BFF có thể aggregate client-specific nhưng tránh domain coupling. Header trust, body size, WebSocket upgrade và retry policy phải rõ.

## Câu trả lời sai thường gặp

Đưa mọi business rule vào gateway giúp service phía sau đơn giản và không có downside.

## Follow-up

- Gateway down blast radius giảm thế nào?

- BFF khác gateway core ra sao?

## Nguồn chính thống

- [Amazon Web Services — API integration — Backend for frontend](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/api-integration-data-fetching.html)
- [Amazon Web Services — What is Amazon API Gateway?](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Istio — Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
- [Istio — Istio Security](https://istio.io/latest/docs/concepts/security/)
- [Istio — Istio Observability](https://istio.io/latest/docs/concepts/observability/)
