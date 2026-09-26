---
id: angular-subject-behaviorsubject
type: interview-question
technology: Angular
category: Angular
difficulty: junior
topics:
  - Subject
  - BehaviorSubject
  - state
relatedLessons:
  - rxjs-stream-resilience
sources:
  - title: RxJS Observable guide
    url: https://rxjs.dev/guide/observable
    organization: RxJS
    type: official-documentation
    accessedAt: 2026-09-02
  - title: RxJS catchError operator
    url: https://rxjs.dev/api/operators/catchError
    organization: RxJS
    type: official-documentation
    accessedAt: 2026-09-02
  - title: RxJS share operator
    url: https://rxjs.dev/api/operators/share
    organization: RxJS
    type: official-documentation
    accessedAt: 2026-09-02
  - title: RxJS shareReplay operator
    url: https://rxjs.dev/api/operators/shareReplay
    organization: RxJS
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
    - id: subject
      required: true
      aliases:
        - Subject
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: behaviorsubject
      required: true
      aliases:
        - BehaviorSubject
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: state
      required: false
      aliases:
        - state
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Subject luôn giữ giá trị cuối nên subscriber mới nhận được state hiện tại.
      penalty: 20
---

# BehaviorSubject khác Subject ở semantics khởi tạo và replay thế nào?

## Rubric

### Must Include

- Subject

- BehaviorSubject

### Strong Answer Includes

- state

## Câu trả lời 30 giây

BehaviorSubject giữ một giá trị hiện tại và phát ngay cho subscriber mới; Subject chỉ phát từ lúc subscribe. Dùng BehaviorSubject làm store nhỏ cần kiểm soát mutation và lifecycle.

## Câu trả lời chi tiết

ReplaySubject có thể replay nhiều giá trị nhưng tốn memory; signal hoặc dedicated state store thường rõ hơn cho UI hiện đại. Subject không tự xử lý backpressure/error recovery. Expose readonly observable/signal thay vì cho component gọi next tùy ý.

## Góc nhìn Production

Đặt bounded replay và cleanup; tránh giữ component instance trong stream lâu.

## Trade-offs

ReplaySubject có thể replay nhiều giá trị nhưng tốn memory; signal hoặc dedicated state store thường rõ hơn cho UI hiện đại. Subject không tự xử lý backpressure/error recovery. Expose readonly observable/signal thay vì cho component gọi next tùy ý.

## Câu trả lời sai thường gặp

Subject luôn giữ giá trị cuối nên subscriber mới nhận được state hiện tại.

## Follow-up

- Signal khác BehaviorSubject ở đâu?

- ReplaySubject buffer lớn gây gì?

## Nguồn chính thống

- [RxJS — RxJS Observable guide](https://rxjs.dev/guide/observable)
- [RxJS — RxJS catchError operator](https://rxjs.dev/api/operators/catchError)
- [RxJS — RxJS share operator](https://rxjs.dev/api/operators/share)
- [RxJS — RxJS shareReplay operator](https://rxjs.dev/api/operators/shareReplay)
