---
id: angular-signal-computed-effect
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - signals
  - computed
  - effect
relatedLessons:
  - angular-signals
sources:
  - title: Angular Signals guide
    url: https://angular.dev/guide/signals
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Angular security best practices
    url: https://angular.dev/best-practices/security
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
    - id: signals
      required: true
      aliases:
        - signals
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: computed
      required: true
      aliases:
        - computed
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: effect
      required: false
      aliases:
        - effect
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi derived state nên cập nhật bằng effect vì computed chỉ dùng cho primitive.
      penalty: 20
---

# Computed và effect khác nhau trong Signals?

## Rubric

### Must Include

- signals

- computed

### Strong Answer Includes

- effect

## Câu trả lời 30 giây

computed tạo derived value memoized và không nên có side effect; effect chạy side effect khi dependency đổi. Dùng computed cho state derivation, effect cho bridge như persistence/logging có cleanup.

## Câu trả lời chi tiết

Signal tracking chỉ ghi dependency được đọc trong execution. Effect async/feedback loop có thể gây update cycle; tránh dùng effect để đồng bộ state mà computed/model làm được. Scope effect theo injector/component và hủy đúng lifecycle.

## Góc nhìn Production

Profile recomputation, tránh effect gọi API mỗi keystroke không debounce; test cleanup.

## Trade-offs

Signal tracking chỉ ghi dependency được đọc trong execution. Effect async/feedback loop có thể gây update cycle; tránh dùng effect để đồng bộ state mà computed/model làm được. Scope effect theo injector/component và hủy đúng lifecycle.

## Câu trả lời sai thường gặp

Mọi derived state nên cập nhật bằng effect vì computed chỉ dùng cho primitive.

## Follow-up

- Effect cleanup khi request đổi ra sao?

- Signal bridge với Observable thế nào?

## Nguồn chính thống

- [Angular — Angular Signals guide](https://angular.dev/guide/signals)
- [Angular — Angular security best practices](https://angular.dev/best-practices/security)
