---
id: q-angular-ngrx-decision
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - Signals
  - RxJS
  - NgRx
relatedLessons:
  - angular-state-management-ngrx-decision
sources:
  - title: Angular Signals
    url: https://angular.dev/guide/signals
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: RxJS interop with Angular signals
    url: https://angular.dev/ecosystem/rxjs-interop
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Why use NgRx Store for State Management?
    url: https://ngrx.io/guide/store/why
    organization: NgRx
    type: official-documentation
    accessedAt: 2026-09-02
  - title: NgRx SignalStore
    url: https://ngrx.io/guide/signals/signal-store
    organization: NgRx
    type: official-documentation
    accessedAt: 2026-09-02
  - title: NgRx Effects
    url: https://ngrx.io/guide/effects
    organization: NgRx
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
        - Signals
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: rxjs
      required: true
      aliases:
        - RxJS
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ngrx
      required: false
      aliases:
        - NgRx
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - NgRx bắt buộc cho mọi enterprise Angular app, và mọi biến UI nên đưa vào một global store.
      penalty: 20
---

# Khi nào Angular application thật sự cần NgRx Store thay vì chỉ dùng Signals hoặc RxJS?

## Rubric

### Must Include

- Signals

- RxJS

### Strong Answer Includes

- NgRx

## Câu trả lời 30 giây

Chọn theo owner, lifetime và coordination của state. Signals hợp local synchronous derived state; RxJS hợp async event streams; NgRx Store đáng giá khi shared state/workflow phức tạp cần event discipline, effects, trace/debug và team conventions. Không phải app lớn là tự động cần global store.

## Câu trả lời chi tiết

Tôi phân loại server state, URL state, form draft, component UI state và cross-feature workflow. Giữ state ở owner nhỏ nhất; computed state được derive, không copy. HTTP/cancellation ở RxJS hoặc resource layer; side effect có boundary rõ. NgRx hữu ích khi nhiều features phản ứng cùng events, transitions phức tạp và replayable tooling/testability bù được action/reducer/effect overhead. SignalStore có thể là middle ground nhưng version/API phải kiểm tra.

## Deep Dive

Global store dễ biến cache server data thành second source of truth và tạo stale duplication. Effect không được sửa state vòng kín; action name nên mô tả event/intent thay vì setter tùy tiện.

## Góc nhìn Production

Đo render/subscription leaks và inspect state chứa PII. Reset user-scoped state khi logout/tenant switch; test cancellation, navigation và failed effect, không chỉ reducer happy path.

## Trade-offs

Global store dễ biến cache server data thành second source of truth và tạo stale duplication. Effect không được sửa state vòng kín; action name nên mô tả event/intent thay vì setter tùy tiện.

## Câu trả lời sai thường gặp

NgRx bắt buộc cho mọi enterprise Angular app, và mọi biến UI nên đưa vào một global store.

## Follow-up

- Server state khác client workflow state ra sao?

- Khi nào SignalStore đủ thay Global Store?

## Nguồn chính thống

- [Angular — Angular Signals](https://angular.dev/guide/signals)
- [Angular — RxJS interop with Angular signals](https://angular.dev/ecosystem/rxjs-interop)
- [NgRx — Why use NgRx Store for State Management?](https://ngrx.io/guide/store/why)
- [NgRx — NgRx SignalStore](https://ngrx.io/guide/signals/signal-store)
- [NgRx — NgRx Effects](https://ngrx.io/guide/effects)
