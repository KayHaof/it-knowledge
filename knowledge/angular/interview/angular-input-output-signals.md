---
id: angular-input-output-signals
type: interview-question
technology: Angular
category: Angular
difficulty: junior
topics:
  - input
  - output
  - signals
relatedLessons:
  - angular-component-lifecycle
sources:
  - title: Component lifecycle
    url: https://angular.dev/guide/components/lifecycle
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Binding dynamic text, properties and attributes
    url: https://angular.dev/guide/templates/binding
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Referencing component children with queries
    url: https://angular.dev/guide/components/queries
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
    - id: input
      required: true
      aliases:
        - input
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: output
      required: true
      aliases:
        - output
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: signals
      required: false
      aliases:
        - signals
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Child có thể sửa input object tùy ý vì Angular tự đồng bộ ngược lên parent.
      penalty: 20
---

# Input signal và Output event nên dùng boundary component thế nào?

## Rubric

### Must Include

- input

- output

### Strong Answer Includes

- signals

## Câu trả lời 30 giây

Input là dữ liệu parent truyền xuống; output phát intent/user event lên. Input signal giúp đọc reactive, nhưng không nên mutate trực tiếp object parent sở hữu.

## Câu trả lời chi tiết

Component presentational nhận immutable view model và emit command payload nhỏ; parent giữ state/side effect. Với value model, signal/computed hỗ trợ derive nhưng không thay service store. Kiểm type và event naming để tránh component thành mini-service.

## Góc nhìn Production

OnPush + immutable update giảm render surprise; test event contract và large object churn.

## Trade-offs

Component presentational nhận immutable view model và emit command payload nhỏ; parent giữ state/side effect. Với value model, signal/computed hỗ trợ derive nhưng không thay service store. Kiểm type và event naming để tránh component thành mini-service.

## Câu trả lời sai thường gặp

Child có thể sửa input object tùy ý vì Angular tự đồng bộ ngược lên parent.

## Follow-up

- Khi nào dùng model() two-way binding?

- Output nên emit entity hay command?

## Nguồn chính thống

- [Angular — Component lifecycle](https://angular.dev/guide/components/lifecycle)
- [Angular — Binding dynamic text, properties and attributes](https://angular.dev/guide/templates/binding)
- [Angular — Referencing component children with queries](https://angular.dev/guide/components/queries)
