---
id: q-microservices
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - architecture
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
    - id: architecture
      required: true
      aliases:
        - architecture
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: trade-off
      required: true
      aliases:
        - trade-off
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Microservices luôn scale tốt hơn monolith.
      penalty: 20
---

# Khi nào không nên dùng microservices?

## Rubric

### Must Include

- architecture

- trade-off

### Strong Answer Includes

## Câu trả lời 30 giây

Khi team/domain nhỏ, boundary chưa rõ, deploy/scale độc lập không tạo giá trị và chưa có năng lực vận hành distributed systems. Modular monolith thường đơn giản hơn.

## Câu trả lời chi tiết

Microservices đáng giá khi capability, data ownership, team autonomy, independent deployment/scaling và failure isolation rõ. Chi phí gồm network failure, consistency, contract, observability, CI/CD và on-call. Nếu mỗi release phối hợp toàn hệ thống hoặc dùng chung DB, ta có distributed monolith.

## Góc nhìn Production

Đánh giá total cost, incident ownership và migration strangler theo evidence thay vì big bang.

## Trade-offs

Microservices đáng giá khi capability, data ownership, team autonomy, independent deployment/scaling và failure isolation rõ. Chi phí gồm network failure, consistency, contract, observability, CI/CD và on-call. Nếu mỗi release phối hợp toàn hệ thống hoặc dùng chung DB, ta có distributed monolith.

## Câu trả lời sai thường gặp

Microservices luôn scale tốt hơn monolith.

## Follow-up

- Service boundary tìm bằng cách nào?

- Database per service có nghĩa gì?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
