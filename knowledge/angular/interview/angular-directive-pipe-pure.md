---
id: angular-directive-pipe-pure
type: interview-question
technology: Angular
category: Angular
difficulty: junior
topics:
  - directives
  - pipes
  - pure-pipe
relatedLessons:
  - angular-change-detection-performance
sources:
  - title: Skipping component subtrees
    url: https://angular.dev/best-practices/skipping-subtrees
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Performance best practices
    url: https://angular.dev/best-practices/performance
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Control flow
    url: https://angular.dev/guide/templates/control-flow
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
    - id: directives
      required: true
      aliases:
        - directives
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: pipes
      required: true
      aliases:
        - pipes
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: pure-pipe
      required: false
      aliases:
        - pure-pipe
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Pure pipe luôn chạy mỗi change detection để đảm bảo dữ liệu mới nhất.
      penalty: 20
---

# Pure pipe và impure pipe ảnh hưởng change detection thế nào?

## Rubric

### Must Include

- directives

- pipes

### Strong Answer Includes

- pure-pipe

## Câu trả lời 30 giây

Pure pipe chỉ chạy lại khi input primitive đổi hoặc reference đổi, nên rẻ và dễ memoize. Impure pipe có thể chạy mỗi check, dễ gây CPU cao và nên tránh cho collection lớn.

## Câu trả lời chi tiết

Pipe transform không nên có side effect; pure pipe cần immutable input để thấy thay đổi. Directive phù hợp behavior/DOM interaction, pipe phù hợp presentation transform. Nếu filter/sort lớn, precompute ở component/computed thay vì impure pipe.

## Góc nhìn Production

Profile transform count và frame time; track list bằng stable key.

## Trade-offs

Pipe transform không nên có side effect; pure pipe cần immutable input để thấy thay đổi. Directive phù hợp behavior/DOM interaction, pipe phù hợp presentation transform. Nếu filter/sort lớn, precompute ở component/computed thay vì impure pipe.

## Câu trả lời sai thường gặp

Pure pipe luôn chạy mỗi change detection để đảm bảo dữ liệu mới nhất.

## Follow-up

- Mutable array làm pure pipe stale thế nào?

- Khi directive tốt hơn pipe?

## Nguồn chính thống

- [Angular — Skipping component subtrees](https://angular.dev/best-practices/skipping-subtrees)
- [Angular — Performance best practices](https://angular.dev/best-practices/performance)
- [Angular — Control flow](https://angular.dev/guide/templates/control-flow)
- [Angular — Deferred loading with @defer](https://angular.dev/guide/templates/defer)
