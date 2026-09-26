---
id: microservices-when-not
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - modular-monolith
  - service-boundary
  - trade-off
relatedLessons:
  - microservices-boundaries
sources:
  - title: AWS Prescriptive Guidance - decomposing monoliths
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/
    organization: Amazon Web Services
    type: vendor-documentation
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
    - id: modular-monolith
      required: true
      aliases:
        - modular-monolith
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: service-boundary
      required: true
      aliases:
        - service-boundary
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: trade-off
      required: false
      aliases:
        - trade-off
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Microservices luôn tốt hơn monolith vì service nhỏ dễ scale và deploy.
      penalty: 20
---

# Ở giai đoạn nào modular monolith đáng chọn hơn microservices?

## Rubric

### Must Include

- modular-monolith

- service-boundary

### Strong Answer Includes

- trade-off

## Câu trả lời 30 giây

Khi domain/team còn nhỏ, boundary chưa rõ hoặc vận hành phân tán vượt lợi ích độc lập deploy/scale, modular monolith thường tốt hơn. Tách service không tự tạo reliability hay tốc độ.

## Câu trả lời chi tiết

Microservices thêm network failure, observability, deployment và data consistency cost. Tôi đánh giá team ownership, release coupling, scaling profile và compliance trước khi tách. Modular monolith giữ module boundary trong một process để khám phá domain rồi tách khi có evidence.

## Góc nhìn Production

Theo dõi cross-service call graph, on-call load và deployment frequency; tránh distributed monolith.

## Trade-offs

Microservices thêm network failure, observability, deployment và data consistency cost. Tôi đánh giá team ownership, release coupling, scaling profile và compliance trước khi tách. Modular monolith giữ module boundary trong một process để khám phá domain rồi tách khi có evidence.

## Câu trả lời sai thường gặp

Microservices luôn tốt hơn monolith vì service nhỏ dễ scale và deploy.

## Follow-up

- Tín hiệu distributed monolith là gì?

- Khi nào tách database trước service?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
