---
id: angular-route-lazy-guard-resolver
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - router
  - lazy-loading
  - guards
relatedLessons:
  - angular-router-state-loading
sources:
  - title: Angular routing overview
    url: https://angular.dev/guide/routing
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
  - title: Router lifecycle and events
    url: https://angular.dev/guide/routing/lifecycle-and-events
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
    - id: router
      required: true
      aliases:
        - router
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: lazy-loading
      required: true
      aliases:
        - lazy-loading
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: guards
      required: false
      aliases:
        - guards
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Nếu route có `canActivate` thì API phía sau không cần kiểm quyền nữa.
      penalty: 20
---

# Route guard có phải cơ chế authorization cuối cùng không?

## Rubric

### Must Include

- router

- lazy-loading

### Strong Answer Includes

- guards

## Câu trả lời 30 giây

Guard chỉ kiểm ở client để điều hướng/UX; người dùng có thể bypass bundle hoặc gọi API trực tiếp. Backend vẫn phải xác thực và authorize resource.

## Câu trả lời chi tiết

Lazy route giảm initial bundle; guard có thể dùng auth state, resolver/loading strategy và redirect URL an toàn. Không fetch secret trong resolver trước khi quyền được kiểm. Khi deep link trên GitHub Pages, server fallback/base href cũng phải đúng.

## Góc nhìn Production

Đo chunk load/error và navigation cancel; backend policy là source of truth.

## Trade-offs

Lazy route giảm initial bundle; guard có thể dùng auth state, resolver/loading strategy và redirect URL an toàn. Không fetch secret trong resolver trước khi quyền được kiểm. Khi deep link trên GitHub Pages, server fallback/base href cũng phải đúng.

## Câu trả lời sai thường gặp

Nếu route có `canActivate` thì API phía sau không cần kiểm quyền nữa.

## Follow-up

- Guard và resolver thứ tự thế nào?

- Lazy chunk 404 khi deploy subpath xử lý sao?

## Nguồn chính thống

- [Angular — Angular routing overview](https://angular.dev/guide/routing)
- [Angular — Route loading strategies](https://angular.dev/best-practices/performance/lazy-loaded-routes)
- [Angular — Control route access with guards](https://angular.dev/guide/routing/route-guards)
- [Angular — Router lifecycle and events](https://angular.dev/guide/routing/lifecycle-and-events)
