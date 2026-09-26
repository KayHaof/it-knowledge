---
id: microservice-gateway-bff
type: interview-question
technology: Microservices
category: Microservices
difficulty: middle
topics:
  - API-Gateway
  - BFF
  - aggregation
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
    - id: api-gateway
      required: true
      aliases:
        - API-Gateway
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: bff
      required: true
      aliases:
        - BFF
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: aggregation
      required: false
      aliases:
        - aggregation
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - BFF chỉ là tên mới của load balancer nên không có business ownership.
      penalty: 20
---

# API Gateway và BFF khác nhau về ownership nào?

## Rubric

### Must Include

- API-Gateway

- BFF

### Strong Answer Includes

- aggregation

## Câu trả lời 30 giây

Gateway xử lý cross-cutting như routing, authn, rate limit; BFF tối ưu API shape cho một client/team và có domain aggregation. Nhồi business logic vào gateway làm boundary khó sở hữu.

## Câu trả lời chi tiết

Một gateway chung giảm client complexity nhưng dễ thành bottleneck/release coupling. BFF có thể compose calls, cache và adapt mobile/web, đổi lại thêm deployment/observability. Authorization object-level vẫn ở service owner; gateway không được tin header client.

## Góc nhìn Production

Theo dõi per-route latency, fan-out, error budget, config drift và gateway saturation. Test partial downstream response và fail-open/closed policy.

## Trade-offs

Một gateway chung giảm client complexity nhưng dễ thành bottleneck/release coupling. BFF có thể compose calls, cache và adapt mobile/web, đổi lại thêm deployment/observability. Authorization object-level vẫn ở service owner; gateway không được tin header client.

## Câu trả lời sai thường gặp

BFF chỉ là tên mới của load balancer nên không có business ownership.

## Follow-up

- Gateway retry có thể nhân tải thế nào?

- Khi nào không cần BFF?

## Nguồn chính thống

- [Amazon Web Services — API integration — Backend for frontend](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/api-integration-data-fetching.html)
- [Amazon Web Services — What is Amazon API Gateway?](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Istio — Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
- [Istio — Istio Security](https://istio.io/latest/docs/concepts/security/)
- [Istio — Istio Observability](https://istio.io/latest/docs/concepts/observability/)
