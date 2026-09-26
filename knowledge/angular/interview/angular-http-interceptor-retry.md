---
id: angular-http-interceptor-retry
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - HttpClient
  - interceptor
  - retry
relatedLessons:
  - angular-http-rxjs
sources:
  - title: Making HTTP requests
    url: https://angular.dev/guide/http/making-requests
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Interceptors
    url: https://angular.dev/guide/http/interceptors
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: RxJS interop with Angular signals
    url: https://angular.dev/ecosystem/rxjs-interop
    organization: Angular
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Testing HTTP requests
    url: https://angular.dev/guide/http/testing
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
    - id: interceptor
      required: true
      aliases:
        - interceptor
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: retry
      required: false
      aliases:
        - retry
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Interceptor có thể retry mọi POST ba lần vì server sẽ tự deduplicate.
      penalty: 20
---

# HTTP interceptor nên xử lý retry và auth refresh với giới hạn nào?

## Rubric

### Must Include

- HttpClient

- interceptor

### Strong Answer Includes

- retry

## Câu trả lời 30 giây

Interceptor phù hợp gắn header, trace id và map lỗi chung; retry chỉ cho request idempotent với backoff/deadline. Auth refresh cần chống nhiều request refresh đồng thời và không retry 401 vô hạn.

## Câu trả lời chi tiết

Clone immutable request khi thêm header; tránh log token/body nhạy cảm. Một refresh coordinator chia sẻ promise/token, queue request có giới hạn rồi logout khi refresh fail. Network retry phải tôn trọng Retry-After và user cancellation.

## Góc nhìn Production

Metric retry count, refresh lock, 401 loop và request latency; test offline/expiry.

## Trade-offs

Clone immutable request khi thêm header; tránh log token/body nhạy cảm. Một refresh coordinator chia sẻ promise/token, queue request có giới hạn rồi logout khi refresh fail. Network retry phải tôn trọng Retry-After và user cancellation.

## Câu trả lời sai thường gặp

Interceptor có thể retry mọi POST ba lần vì server sẽ tự deduplicate.

## Follow-up

- Refresh token race xử lý thế nào?

- Abort request khi component destroy ra sao?

## Nguồn chính thống

- [Angular — Making HTTP requests](https://angular.dev/guide/http/making-requests)
- [Angular — Interceptors](https://angular.dev/guide/http/interceptors)
- [Angular — RxJS interop with Angular signals](https://angular.dev/ecosystem/rxjs-interop)
- [Angular — Testing HTTP requests](https://angular.dev/guide/http/testing)
