---
id: angular-rxjs-switchmap-mergemap
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - RxJS
  - switchMap
  - mergeMap
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
    - id: rxjs
      required: true
      aliases:
        - RxJS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: switchmap
      required: true
      aliases:
        - switchMap
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: mergemap
      required: false
      aliases:
        - mergeMap
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - switchMap luôn hủy HTTP request trên server và là lựa chọn tốt nhất cho mọi luồng.
      penalty: 20
---

# Chọn switchMap, mergeMap, concatMap hay exhaustMap cho search và submit?

## Rubric

### Must Include

- RxJS

- switchMap

### Strong Answer Includes

- mergeMap

## Câu trả lời 30 giây

Search typeahead thường switchMap để hủy kết quả cũ; mergeMap cho task độc lập; concatMap giữ thứ tự; exhaustMap bỏ submit mới khi một submit đang chạy. Operator thể hiện concurrency policy.

## Câu trả lời chi tiết

Hủy observable không luôn hủy server work nếu backend không nhận abort, nhưng ngăn stale response render. mergeMap concurrency vô hạn gây overload; concatMap tạo queue; exhaustMap phù hợp chống double-click. Chọn theo idempotency, ordering và UX.

## Góc nhìn Production

Đo in-flight, cancellation và downstream QPS; debounce search và đặt timeout.

## Trade-offs

Hủy observable không luôn hủy server work nếu backend không nhận abort, nhưng ngăn stale response render. mergeMap concurrency vô hạn gây overload; concatMap tạo queue; exhaustMap phù hợp chống double-click. Chọn theo idempotency, ordering và UX.

## Câu trả lời sai thường gặp

switchMap luôn hủy HTTP request trên server và là lựa chọn tốt nhất cho mọi luồng.

## Follow-up

- concatMap queue phình xử lý thế nào?

- Khi nào exhaustMap làm mất thao tác hợp lệ?

## Nguồn chính thống

- [RxJS — RxJS Observable guide](https://rxjs.dev/guide/observable)
- [RxJS — RxJS catchError operator](https://rxjs.dev/api/operators/catchError)
- [RxJS — RxJS share operator](https://rxjs.dev/api/operators/share)
- [RxJS — RxJS shareReplay operator](https://rxjs.dev/api/operators/shareReplay)
