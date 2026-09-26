---
id: q-angular-http-cancellation
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - HttpClient
  - RxJS
  - switchMap
relatedLessons:
  - angular-http-rxjs
sources:
  - title: Angular HTTP client guide
    url: https://angular.dev/guide/http
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
    - id: httpclient
      required: true
      aliases:
        - HttpClient
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
    - id: switchmap
      required: false
      aliases:
        - switchMap
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - unsubscribe đảm bảo backend chưa chạy nên có thể retry mọi POST an toàn.
      penalty: 20
---

# Khi nào dùng switchMap và tại sao cancel request không đồng nghĩa rollback server?

## Rubric

### Must Include

- HttpClient

- RxJS

### Strong Answer Includes

- switchMap

## Câu trả lời 30 giây

switchMap hợp latest-wins như search: unsubscribe request cũ để response cũ không ghi đè. Nhưng request có thể đã tới server và side effect đã commit; client cancel chỉ dừng quan tâm/transport theo khả năng, không tạo rollback nghiệp vụ.

## Câu trả lời chi tiết

Tôi chọn flattening operator theo ordering và concurrency semantics: switchMap latest, concatMap serialize, mergeMap concurrent, exhaustMap bỏ trigger mới. Mutation quan trọng cần idempotency key hoặc status reconciliation; UI disable button không đủ chống duplicate.

## Deep Dive

Cancellation phải được truyền qua từng layer mới tiết kiệm server work; dù vậy transaction/outcome có thể đã qua điểm không thể hủy.

## Góc nhìn Production

Test network delay, rapid navigation, duplicate submit và out-of-order response; telemetry correlation theo operation ID.

## Trade-offs

Cancellation phải được truyền qua từng layer mới tiết kiệm server work; dù vậy transaction/outcome có thể đã qua điểm không thể hủy.

## Câu trả lời sai thường gặp

unsubscribe đảm bảo backend chưa chạy nên có thể retry mọi POST an toàn.

## Follow-up

- exhaustMap khác concatMap thế nào?

- Idempotency key được lưu và hết hạn ra sao?

## Nguồn chính thống

- [Angular — Angular HTTP client guide](https://angular.dev/guide/http)
