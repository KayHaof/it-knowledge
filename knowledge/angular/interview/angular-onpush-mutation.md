---
id: angular-onpush-mutation
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - OnPush
  - change-detection
  - immutability
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
    - id: onpush
      required: true
      aliases:
        - OnPush
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: change-detection
      required: true
      aliases:
        - change-detection
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: immutability
      required: false
      aliases:
        - immutability
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - OnPush cấm mọi mutation và Angular luôn clone input tự động.
      penalty: 20
---

# OnPush có thể không render khi input object bị mutate vì sao?

## Rubric

### Must Include

- OnPush

- change-detection

### Strong Answer Includes

- immutability

## Câu trả lời 30 giây

OnPush ưu tiên kiểm reference; mutate nested field giữ nguyên reference nên child có thể không được check như mong đợi. Tạo object/array mới hoặc signal update immutable.

## Câu trả lời chi tiết

Angular vẫn có các trigger khác như event trong view, observable/async pipe và markForCheck, nhưng dựa vào chúng làm behavior khó đoán. State container nên enforce immutable update. `track` ổn định giúp DOM reuse, không chữa mutation semantics.

## Góc nhìn Production

Kiểm render count và memory trade-off; dùng dev freeze hoặc lint cho mutation.

## Trade-offs

Angular vẫn có các trigger khác như event trong view, observable/async pipe và markForCheck, nhưng dựa vào chúng làm behavior khó đoán. State container nên enforce immutable update. `track` ổn định giúp DOM reuse, không chữa mutation semantics.

## Câu trả lời sai thường gặp

OnPush cấm mọi mutation và Angular luôn clone input tự động.

## Follow-up

- markForCheck khác detectChanges thế nào?

- track key không ổn định gây gì?

## Nguồn chính thống

- [Angular — Skipping component subtrees](https://angular.dev/best-practices/skipping-subtrees)
- [Angular — Performance best practices](https://angular.dev/best-practices/performance)
- [Angular — Control flow](https://angular.dev/guide/templates/control-flow)
- [Angular — Deferred loading with @defer](https://angular.dev/guide/templates/defer)
