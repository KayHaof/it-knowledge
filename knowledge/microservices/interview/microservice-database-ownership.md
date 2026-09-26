---
id: microservice-database-ownership
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - data-ownership
  - database-per-service
  - consistency
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
    - id: data-ownership
      required: true
      aliases:
        - data-ownership
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: database-per-service
      required: true
      aliases:
        - database-per-service
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: consistency
      required: false
      aliases:
        - consistency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Tách service nhưng cho mọi service quyền SELECT/UPDATE tất cả bảng vẫn là database per service đúng nghĩa.
      penalty: 20
---

# Database per service có nghĩa service không bao giờ đọc data service khác không?

## Rubric

### Must Include

- data-ownership

- database-per-service

### Strong Answer Includes

- consistency

## Câu trả lời 30 giây

Service nên sở hữu write model và không bypass bằng query trực tiếp. Read model/CDC/API/event có thể chia sẻ dữ liệu có chủ đích, với freshness, schema và privacy contract rõ.

## Câu trả lời chi tiết

Shared database tạo coupling schema/transaction và khiến boundary danh nghĩa. Tách DB cần duplicate projection, API composition hoặc workflow eventual consistency; ownership service là authority cho mutation. Cross-service join realtime có latency/failure cost, còn local projection cần backfill/reconciliation.

## Góc nhìn Production

Audit DB credentials/schema access, projection lag, divergence và cross-service query rate. Migration phải backward-compatible với consumers.

## Trade-offs

Shared database tạo coupling schema/transaction và khiến boundary danh nghĩa. Tách DB cần duplicate projection, API composition hoặc workflow eventual consistency; ownership service là authority cho mutation. Cross-service join realtime có latency/failure cost, còn local projection cần backfill/reconciliation.

## Câu trả lời sai thường gặp

Tách service nhưng cho mọi service quyền SELECT/UPDATE tất cả bảng vẫn là database per service đúng nghĩa.

## Follow-up

- Projection stale chấp nhận trong use case nào?

- Reconciliation khi event mất làm sao?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
