---
id: microservices-api-gateway-bff
type: interview-question
technology: Microservices
category: Microservices
difficulty: middle
topics:
  - API Gateway
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
        - API Gateway
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
        - BFF chỉ là tên khác của load balancer nên không chứa aggregation logic.
      penalty: 20
---

# API Gateway và BFF khác nhau ra sao?

## Rubric

### Must Include

- API Gateway

- BFF

### Strong Answer Includes

- aggregation

## Câu trả lời 30 giây

Gateway cung cấp cross-cutting như auth/routing/rate limit; BFF tối ưu contract cho từng client và có thể aggregate dữ liệu. BFF quá nhiều logic domain sẽ thành gateway monolith.

## Câu trả lời chi tiết

Gateway nên stateless và policy-oriented; BFF chịu trách nhiệm shape dữ liệu/mobile-web khác nhau nhưng cần cache/timeout cho fan-out. Không đẩy transaction nghiệp vụ xuyên service vào gateway. Version contract và ownership rõ.

## Góc nhìn Production

Theo dõi per-route latency, fan-out failures và config rollout; rate limit trước backend saturation.

## Trade-offs

Gateway nên stateless và policy-oriented; BFF chịu trách nhiệm shape dữ liệu/mobile-web khác nhau nhưng cần cache/timeout cho fan-out. Không đẩy transaction nghiệp vụ xuyên service vào gateway. Version contract và ownership rõ.

## Câu trả lời sai thường gặp

BFF chỉ là tên khác của load balancer nên không chứa aggregation logic.

## Follow-up

- Fan-out partial failure trả response thế nào?

- Khi nào service mesh thay gateway?

## Nguồn chính thống

- [Amazon Web Services — API integration — Backend for frontend](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/api-integration-data-fetching.html)
- [Amazon Web Services — What is Amazon API Gateway?](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Istio — Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
- [Istio — Istio Security](https://istio.io/latest/docs/concepts/security/)
- [Istio — Istio Observability](https://istio.io/latest/docs/concepts/observability/)
