---
id: q-angular-observable-junior
type: interview-question
technology: Angular
category: Angular
difficulty: junior
topics:
  - Observable
  - subscription
  - lifecycle
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
    - id: observable
      required: true
      aliases:
        - Observable
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: subscription
      required: true
      aliases:
        - subscription
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: lifecycle
      required: false
      aliases:
        - lifecycle
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Observable luôn chạy nền và nhanh hơn Promise.
      penalty: 20
---

# Observable khác Promise ở điểm nào quan trọng với Angular HTTP và UI events?

## Rubric

### Must Include

- Observable

- subscription

### Strong Answer Includes

- lifecycle

## Câu trả lời 30 giây

Observable là lazy stream có thể phát nhiều giá trị và hủy qua unsubscribe; Promise đại diện một kết quả eventual đã bắt đầu theo producer. Angular HTTP observable thường phát một response rồi complete, còn form/router events là streams dài.

## Câu trả lời chi tiết

Operator cho phép compose cancellation, concurrency và error. Nhưng mỗi subscription có thể kích hoạt cold producer/request mới; share cần lifecycle/cache policy. Template async/toSignal hoặc destroy-aware subscription giúp cleanup; không nested subscribe khi có thể compose.

## Deep Dive

Unsubscribe có thể abort transport nhưng không đảm bảo server side effect chưa xảy ra. Error kết thúc stream trừ khi được catch/recover.

## Góc nhìn Production

Theo dõi duplicate requests/subscriptions, tránh shareReplay giữ state user cũ và test navigation cleanup.

## Trade-offs

Unsubscribe có thể abort transport nhưng không đảm bảo server side effect chưa xảy ra. Error kết thúc stream trừ khi được catch/recover.

## Câu trả lời sai thường gặp

Observable luôn chạy nền và nhanh hơn Promise.

## Follow-up

- Cold và hot observable là gì?

- Khi nào switchMap phù hợp?

## Nguồn chính thống

- [Angular — Angular HTTP client guide](https://angular.dev/guide/http)
