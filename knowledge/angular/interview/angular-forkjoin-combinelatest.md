---
id: angular-forkjoin-combinelatest
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - forkJoin
  - combineLatest
  - loading
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
    - id: forkjoin
      required: true
      aliases:
        - forkJoin
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: combinelatest
      required: true
      aliases:
        - combineLatest
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: loading
      required: false
      aliases:
        - loading
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - forkJoin phát kết quả ngay khi request đầu tiên xong và combineLatest chỉ chạy một lần.
      penalty: 20
---

# forkJoin và combineLatest khác nhau khi tải dữ liệu dashboard?

## Rubric

### Must Include

- forkJoin

- combineLatest

### Strong Answer Includes

- loading

## Câu trả lời 30 giây

forkJoin đợi mọi observable complete rồi phát một lần, hợp HTTP finite calls. combineLatest phát lại khi bất kỳ nguồn nào đổi sau khi tất cả đã emit, hợp state sống.

## Câu trả lời chi tiết

Nếu một source không complete, forkJoin không emit; nếu source error, cả aggregate lỗi trừ khi catch cục bộ. combineLatest cần initial emission và có thể tạo nhiều render. Tách critical/optional data và fallback từng widget.

## Góc nhìn Production

Đo slowest dependency, partial failure và cancellation; không để một widget treo cả màn hình.

## Trade-offs

Nếu một source không complete, forkJoin không emit; nếu source error, cả aggregate lỗi trừ khi catch cục bộ. combineLatest cần initial emission và có thể tạo nhiều render. Tách critical/optional data và fallback từng widget.

## Câu trả lời sai thường gặp

forkJoin phát kết quả ngay khi request đầu tiên xong và combineLatest chỉ chạy một lần.

## Follow-up

- HTTP error một nhánh xử lý thế nào?

- Loading state cho combineLatest thiết kế ra sao?

## Nguồn chính thống

- [Angular — Making HTTP requests](https://angular.dev/guide/http/making-requests)
- [Angular — Interceptors](https://angular.dev/guide/http/interceptors)
- [Angular — RxJS interop with Angular signals](https://angular.dev/ecosystem/rxjs-interop)
- [Angular — Testing HTTP requests](https://angular.dev/guide/http/testing)
