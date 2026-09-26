---
id: microservice-config-secret
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - configuration
  - secrets
  - deployment
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
    - id: configuration
      required: true
      aliases:
        - configuration
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: secrets
      required: true
      aliases:
        - secrets
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: deployment
      required: false
      aliases:
        - deployment
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mã hóa secret trong Git là đủ vì mọi pod đều có thể giải mã bằng key nằm cùng repository.
      penalty: 20
---

# Configuration và secret nên phân phối thế nào để rolling deploy an toàn?

## Rubric

### Must Include

- configuration

- secrets

### Strong Answer Includes

- deployment

## Câu trả lời 30 giây

Tách config không nhạy cảm khỏi secret, version và audit thay đổi, rotate có overlap và không log plaintext. App phải validate immutable config lúc startup hoặc refresh atomically có chủ ý.

## Câu trả lời chi tiết

Secret manager/KMS cấp credential short-lived hoặc mounted secret; env/file có leak surface khác nhau. Rolling deploy cần old/new key trust overlap, backward-compatible config và rollback. Dynamic refresh có thể làm cùng workflow dùng hai config nếu không snapshot.

## Góc nhìn Production

Theo dõi access audit, expiry, rotation success, config hash và rollback. Least privilege theo service/tenant; không commit secret trong image.

## Trade-offs

Secret manager/KMS cấp credential short-lived hoặc mounted secret; env/file có leak surface khác nhau. Rolling deploy cần old/new key trust overlap, backward-compatible config và rollback. Dynamic refresh có thể làm cùng workflow dùng hai config nếu không snapshot.

## Câu trả lời sai thường gặp

Mã hóa secret trong Git là đủ vì mọi pod đều có thể giải mã bằng key nằm cùng repository.

## Follow-up

- Key rotation overlap bao lâu?

- Config refresh giữa request nên atomic thế nào?

## Nguồn chính thống

- [Amazon Web Services — API integration — Backend for frontend](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/api-integration-data-fetching.html)
- [Amazon Web Services — What is Amazon API Gateway?](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Istio — Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
- [Istio — Istio Security](https://istio.io/latest/docs/concepts/security/)
- [Istio — Istio Observability](https://istio.io/latest/docs/concepts/observability/)
