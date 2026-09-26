---
id: angular-defer-hydration
type: interview-question
technology: Angular
category: Angular
difficulty: senior
topics:
  - defer
  - SSR
  - hydration
relatedLessons:
  - angular-ssr-hydration-defer
sources:
  - title: Server-side and hybrid rendering
    url: https://angular.dev/guide/ssr
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Hydration
    url: https://angular.dev/guide/hydration
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Incremental Hydration
    url: https://angular.dev/guide/incremental-hydration
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Deferred loading with @defer
    url: https://angular.dev/guide/templates/defer
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
    - id: defer
      required: true
      aliases:
        - defer
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: ssr
      required: true
      aliases:
        - SSR
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: hydration
      required: false
      aliases:
        - hydration
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bọc mọi component trong @defer luôn làm initial load nhanh mà không ảnh hưởng UX.
      penalty: 20
---

# `@defer` và hydration giúp performance nhưng có trade-off gì?

## Rubric

### Must Include

- defer

- SSR

### Strong Answer Includes

- hydration

## Câu trả lời 30 giây

Defer trì hoãn tải/render phần không critical; hydration tái sử dụng HTML SSR để tránh render lại. Nếu trigger/đảo state sai, người dùng thấy placeholder hoặc mismatch.

## Câu trả lời chi tiết

Chọn viewport/interaction/idle trigger theo UX và chunk graph; defer component phải có loading/error/placeholder ổn định. Hydration yêu cầu server/client render deterministic, tránh đọc window/random trong template. Đo LCP, INP và hydration errors.

## Góc nhìn Production

Canary SSR/hydration, log chunk 404 và monitor web vitals theo route.

## Trade-offs

Chọn viewport/interaction/idle trigger theo UX và chunk graph; defer component phải có loading/error/placeholder ổn định. Hydration yêu cầu server/client render deterministic, tránh đọc window/random trong template. Đo LCP, INP và hydration errors.

## Câu trả lời sai thường gặp

Bọc mọi component trong @defer luôn làm initial load nhanh mà không ảnh hưởng UX.

## Follow-up

- Hydration mismatch thường do nguồn dữ liệu nào?

- Khi nào không nên defer?

## Nguồn chính thống

- [Angular — Server-side and hybrid rendering](https://angular.dev/guide/ssr)
- [Angular — Hydration](https://angular.dev/guide/hydration)
- [Angular — Incremental Hydration](https://angular.dev/guide/incremental-hydration)
- [Angular — Deferred loading with @defer](https://angular.dev/guide/templates/defer)
