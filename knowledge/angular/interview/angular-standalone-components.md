---
id: angular-standalone-components
type: interview-question
technology: Angular
category: Angular
difficulty: junior
topics:
  - standalone
  - components
  - imports
relatedLessons:
  - angular-feature-workflow
sources:
  - title: Reactive forms
    url: https://angular.dev/guide/forms/reactive-forms
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Route loading strategies
    url: https://angular.dev/best-practices/performance/lazy-loaded-routes
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Control route access with guards
    url: https://angular.dev/guide/routing/route-guards
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Route data resolvers
    url: https://angular.dev/guide/routing/data-resolvers
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
    - id: standalone
      required: true
      aliases:
        - standalone
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: components
      required: true
      aliases:
        - components
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: imports
      required: false
      aliases:
        - imports
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Standalone component nghĩa là không còn dependency injection hoặc router module trong Angular.
      penalty: 20
---

# Standalone component thay đổi cách Angular quản lý dependency thế nào?

## Rubric

### Must Include

- standalone

- components

### Strong Answer Includes

- imports

## Câu trả lời 30 giây

Component khai báo trực tiếp imports thay vì cần NgModule declaration. Nó làm dependency gần template hơn và phù hợp lazy route, nhưng không tự giải quyết state hay architecture.

## Câu trả lời chi tiết

Standalone có thể import component, directive, pipe và provider; migration có thể dùng compatibility APIs. Tôi giữ feature boundary và route-level providers rõ ràng, tránh import cả barrel lớn gây bundle tăng. Compile template vẫn bắt lỗi thiếu import.

## Góc nhìn Production

Kiểm bundle graph và lazy chunk sau migration; test provider scope ở route.

## Trade-offs

Standalone có thể import component, directive, pipe và provider; migration có thể dùng compatibility APIs. Tôi giữ feature boundary và route-level providers rõ ràng, tránh import cả barrel lớn gây bundle tăng. Compile template vẫn bắt lỗi thiếu import.

## Câu trả lời sai thường gặp

Standalone component nghĩa là không còn dependency injection hoặc router module trong Angular.

## Follow-up

- Provider ở component khác root thế nào?

- Lazy load standalone route ra sao?

## Nguồn chính thống

- [Angular — Reactive forms](https://angular.dev/guide/forms/reactive-forms)
- [Angular — Route loading strategies](https://angular.dev/best-practices/performance/lazy-loaded-routes)
- [Angular — Control route access with guards](https://angular.dev/guide/routing/route-guards)
- [Angular — Route data resolvers](https://angular.dev/guide/routing/data-resolvers)
