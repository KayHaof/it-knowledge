---
id: microservices-database-ownership
type: interview-question
technology: Microservices
category: Microservices
difficulty: senior
topics:
  - database-per-service
  - ownership
  - contracts
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
    - id: database-per-service
      required: true
      aliases:
        - database-per-service
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: ownership
      required: true
      aliases:
        - ownership
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: contracts
      required: false
      aliases:
        - contracts
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Database per service nghĩa là mỗi service phải dùng một công nghệ database khác nhau.
      penalty: 20
---

# Database per service bảo vệ boundary nhưng gây khó khăn nào?

## Rubric

### Must Include

- database-per-service

- ownership

### Strong Answer Includes

- contracts

## Câu trả lời 30 giây

Service sở hữu schema và invariant của mình, tránh truy vấn chéo trực tiếp. Đổi lại cần API/event, eventual consistency và quy trình migration/reconciliation.

## Câu trả lời chi tiết

Shared database làm transaction dễ nhưng coupling schema và deploy tăng. Database per service buộc thiết kế read model, outbox và workflow bù. Không nhất thiết mỗi service phải có loại DB riêng; ownership và access policy mới là cốt lõi.

## Góc nhìn Production

Audit cross-schema access, replication lag và reconciliation metrics; migration backward-compatible.

## Trade-offs

Shared database làm transaction dễ nhưng coupling schema và deploy tăng. Database per service buộc thiết kế read model, outbox và workflow bù. Không nhất thiết mỗi service phải có loại DB riêng; ownership và access policy mới là cốt lõi.

## Câu trả lời sai thường gặp

Database per service nghĩa là mỗi service phải dùng một công nghệ database khác nhau.

## Follow-up

- Join dữ liệu liên service giải quyết ra sao?

- Ownership chuyển giao cần migration nào?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
