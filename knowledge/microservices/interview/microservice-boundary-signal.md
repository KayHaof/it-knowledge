---
id: microservice-boundary-signal
type: interview-question
technology: Microservices
category: Microservices
difficulty: middle
topics:
  - bounded-context
  - service-boundary
  - coupling
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
    - id: bounded-context
      required: true
      aliases:
        - bounded-context
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
    - id: coupling
      required: false
      aliases:
        - coupling
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mỗi bảng hoặc mỗi controller nên là một microservice để đạt loose coupling.
      penalty: 20
---

# Bạn tìm service boundary từ business capability hay từ bảng database?

## Rubric

### Must Include

- bounded-context

- service-boundary

### Strong Answer Includes

- coupling

## Câu trả lời 30 giây

Bắt đầu từ capability, invariant, ownership và team change cadence; bảng chỉ là một clue. Boundary tốt giữ transaction/data ownership rõ và giảm synchronous coupling, không chỉ chia package thành nhiều process.

## Câu trả lời chi tiết

Event storming/use-case change analysis giúp thấy aggregate và language boundaries. Nếu hai service luôn deploy/scale/transaction cùng nhau, đó có thể là distributed monolith. Database per service tăng autonomy nhưng cần API/event contract, migration và reconciliation. Boundary nên evolve theo evidence thay vì vẽ một lần.

## Góc nhìn Production

Đo cross-service call graph, deploy coupling, failure blast radius và team ownership. Review boundary sau incident/latency/data leakage.

## Trade-offs

Event storming/use-case change analysis giúp thấy aggregate và language boundaries. Nếu hai service luôn deploy/scale/transaction cùng nhau, đó có thể là distributed monolith. Database per service tăng autonomy nhưng cần API/event contract, migration và reconciliation. Boundary nên evolve theo evidence thay vì vẽ một lần.

## Câu trả lời sai thường gặp

Mỗi bảng hoặc mỗi controller nên là một microservice để đạt loose coupling.

## Follow-up

- Distributed monolith nhận biết bằng metric nào?

- Database per service làm report liên domain ra sao?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
