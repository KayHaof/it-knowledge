---
id: q-typescript-runtime-contract
type: interview-question
technology: Angular
category: Angular
difficulty: senior
topics:
  - TypeScript
  - runtime-validation
  - API-contract
relatedLessons:
  - angular-api-contracts
sources:
  - title: Angular making HTTP requests
    url: https://angular.dev/guide/http/making-requests
    organization: Angular
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
    - id: typescript
      required: true
      aliases:
        - TypeScript
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: runtime-validation
      required: true
      aliases:
        - runtime-validation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: api-contract
      required: false
      aliases:
        - API-contract
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - TypeScript interface được Angular dùng để deserialize và reject field sai type.
      penalty: 20
---

# http.get<User>() có xác minh JSON runtime là User không?

## Rubric

### Must Include

- TypeScript

- runtime-validation

### Strong Answer Includes

- API-contract

## Câu trả lời 30 giây

Không. Generic là type assertion cho compile time và bị xóa ở runtime. Network là untrusted boundary; field quan trọng phải được validate rồi map từ DTO sang domain/UI model.

## Câu trả lời chi tiết

Contract gồm status, headers, nullability, pagination, version và failure semantics, không chỉ JSON shape. Tôi đặt validation/mapping sau API facade, test raw malformed payload và cân bằng validation cost theo rủi ro. Generated client giảm drift nhưng vẫn không tự chứng minh runtime payload.

## Deep Dive

Không render backend error thẳng như HTML và không để transport DTO lan khắp component vì nó khóa UI vào schema/version của server.

## Góc nhìn Production

Theo dõi contract violation không log PII; rollout backward-compatible và contract test producer-consumer.

## Trade-offs

Không render backend error thẳng như HTML và không để transport DTO lan khắp component vì nó khóa UI vào schema/version của server.

## Câu trả lời sai thường gặp

TypeScript interface được Angular dùng để deserialize và reject field sai type.

## Follow-up

- Generated OpenAPI client còn cần mapper không?

- Runtime validation nên fail open hay fail closed?

## Nguồn chính thống

- [Angular — Angular making HTTP requests](https://angular.dev/guide/http/making-requests)
