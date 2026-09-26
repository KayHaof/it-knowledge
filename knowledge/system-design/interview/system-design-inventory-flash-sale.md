---
id: system-design-inventory-flash-sale
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - inventory
  - flash-sale
  - oversell
relatedLessons:
  - system-design-method
sources:
  - title: AWS Well-Architected Framework
    url: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
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
    - id: inventory
      required: true
      aliases:
        - inventory
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: flash-sale
      required: true
      aliases:
        - flash-sale
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: oversell
      required: false
      aliases:
        - oversell
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cache stock count rồi trừ ở client là đủ ngăn oversell.
      penalty: 20
---

# Giảm oversell trong flash sale khi traffic burst?

## Rubric

### Must Include

- inventory

- flash-sale

### Strong Answer Includes

- oversell

## Câu trả lời 30 giây

Admission control/rate limit trước DB, reservation có TTL và atomic decrement/conditional update. Queue async order processing nhưng phải hiển thị trạng thái pending rõ.

## Câu trả lời chi tiết

Pre-warm cache không đủ vì source of truth inventory cần atomicity. Partition hot SKU, single-writer/serial queue hoặc DB lock tùy scale; reservation expiry/reconciliation xử lý abandoned cart. Backpressure và fairness tránh một client chiếm hết.

## Góc nhìn Production

Đo rejected/queued orders, reservation age, DB lock và oversell invariant; load test burst.

## Trade-offs

Pre-warm cache không đủ vì source of truth inventory cần atomicity. Partition hot SKU, single-writer/serial queue hoặc DB lock tùy scale; reservation expiry/reconciliation xử lý abandoned cart. Backpressure và fairness tránh một client chiếm hết.

## Câu trả lời sai thường gặp

Chỉ cache stock count rồi trừ ở client là đủ ngăn oversell.

## Follow-up

- Reservation crash recovery thế nào?

- Hot SKU partitioning trade-off?

## Nguồn chính thống

- [Amazon Web Services — AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
