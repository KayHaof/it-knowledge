---
id: q-modular-monolith
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - modular-monolith
  - hexagonal
  - DDD
relatedLessons:
  - modular-monolith-hexagonal-ddd
sources:
  - title: Hexagonal architecture overview
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/hexagonal-architectures/overview.html
    organization: Amazon Web Services
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
    - id: modular-monolith
      required: true
      aliases:
        - modular-monolith
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: hexagonal
      required: true
      aliases:
        - hexagonal
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ddd
      required: false
      aliases:
        - DDD
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Modular monolith không scale và luôn phải viết lại thành microservices khi traffic tăng.
      penalty: 20
---

# Làm sao biết modular monolith là bước tốt hơn microservices lúc này?

## Rubric

### Must Include

- modular-monolith

- hexagonal

### Strong Answer Includes

- DDD

## Câu trả lời 30 giây

Khi domain/team còn nhỏ, boundary chưa được chứng minh và deploy/scale độc lập chưa tạo giá trị, module trong một process giữ transaction/debug đơn giản. Nó vẫn cần ownership, dependency rule và data boundary, không phải monolith tùy tiện.

## Câu trả lời chi tiết

Tôi phân ranh business capability, đặt port/adapters và cấm import/query xuyên module bằng test/tooling. Theo dõi change coupling, scaling, release và team ownership. Chỉ extract service khi evidence cho thấy independent lifecycle/failure isolation đáng trả network, consistency, observability và on-call cost.

## Deep Dive

Nếu module dùng chung entity/table và release lockstep, tách process tạo distributed monolith. Strangler extraction cần contract, data migration và rollback.

## Góc nhìn Production

Architecture fitness test, dependency visualization và incident ownership; không coi package convention là enforcement đủ.

## Trade-offs

Nếu module dùng chung entity/table và release lockstep, tách process tạo distributed monolith. Strangler extraction cần contract, data migration và rollback.

## Câu trả lời sai thường gặp

Modular monolith không scale và luôn phải viết lại thành microservices khi traffic tăng.

## Follow-up

- Hexagonal boundary khác layer truyền thống thế nào?

- Dấu hiệu service boundary sai là gì?

## Nguồn chính thống

- [Amazon Web Services — Hexagonal architecture overview](https://docs.aws.amazon.com/prescriptive-guidance/latest/hexagonal-architectures/overview.html)
