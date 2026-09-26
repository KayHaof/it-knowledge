---
id: architecture-solid-dependency-inversion
type: interview-question
technology: Architecture
category: Architecture
difficulty: middle
topics:
  - SOLID
  - dependency-inversion
  - testing
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
    - id: solid
      required: true
      aliases:
        - SOLID
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: dependency-inversion
      required: true
      aliases:
        - dependency-inversion
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: testing
      required: false
      aliases:
        - testing
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - DIP yêu cầu mọi dependency phải là interface và không được dùng framework.
      penalty: 20
---

# Dependency Inversion giúp module nghiệp vụ độc lập infrastructure thế nào?

## Rubric

### Must Include

- SOLID

- dependency-inversion

### Strong Answer Includes

- testing

## Câu trả lời 30 giây

Domain phụ thuộc abstraction do nó sở hữu, còn adapter database/web implement abstraction. Điều này giảm coupling và làm test use case không cần khởi động hạ tầng.

## Câu trả lời chi tiết

DIP không đồng nghĩa tạo interface cho mọi class; abstraction nên phản ánh policy và boundary ổn định. Hexagonal/ports-and-adapters tách inbound/outbound, nhưng mapping/transaction vẫn cần kiểm integration. Interface sai abstraction chỉ đổi tên coupling.

## Góc nhìn Production

Review dependency direction và contract test adapter; tránh mock quá sâu che schema/query lỗi.

## Trade-offs

DIP không đồng nghĩa tạo interface cho mọi class; abstraction nên phản ánh policy và boundary ổn định. Hexagonal/ports-and-adapters tách inbound/outbound, nhưng mapping/transaction vẫn cần kiểm integration. Interface sai abstraction chỉ đổi tên coupling.

## Câu trả lời sai thường gặp

DIP yêu cầu mọi dependency phải là interface và không được dùng framework.

## Follow-up

- Port nên đặt ở domain hay infrastructure?

- Khi mock làm test kém tin cậy?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
