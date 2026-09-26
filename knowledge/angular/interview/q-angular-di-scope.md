---
id: q-angular-di-scope
type: interview-question
technology: Angular
category: Angular
difficulty: middle
topics:
  - DI
  - provider-scope
  - lifecycle
relatedLessons:
  - angular-dependency-injection
sources:
  - title: Angular dependency injection guide
    url: https://angular.dev/guide/di
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
    - id: di
      required: true
      aliases:
        - DI
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: provider-scope
      required: true
      aliases:
        - provider-scope
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
        - "@Injectable luôn đảm bảo chỉ có đúng một instance trong toàn ứng dụng."
      penalty: 20
---

# Provider scope sai trong Angular gây bug gì?

## Rubric

### Must Include

- DI

- provider-scope

### Strong Answer Includes

- lifecycle

## Câu trả lời 30 giây

Cùng token có thể tạo instance khác nhau theo injector hierarchy. Provider đặt ở component làm state/service bị nhân bản theo component; root provider lại có thể giữ state quá lâu qua user/session nếu không reset.

## Câu trả lời chi tiết

Tôi xác định ownership và lifetime trước: app singleton, route/feature scope hay component instance. Debug bằng nơi khai báo provider và injector boundary, không giả định service luôn singleton. Cleanup subscription/resource theo lifecycle và tránh lưu tenant-sensitive state vô hạn ở root.

## Deep Dive

Resolution đi từ injector hiện tại lên parent; lazy/route environment injector có thể tạo boundary hữu ích nhưng cũng làm behavior khác test nếu provider setup không giống production.

## Góc nhìn Production

Document scope, test navigation/recreation và logout; tránh provider trùng vô tình trong reusable component.

## Trade-offs

Resolution đi từ injector hiện tại lên parent; lazy/route environment injector có thể tạo boundary hữu ích nhưng cũng làm behavior khác test nếu provider setup không giống production.

## Câu trả lời sai thường gặp

@Injectable luôn đảm bảo chỉ có đúng một instance trong toàn ứng dụng.

## Follow-up

- InjectionToken giải quyết gì?

- Route-level provider phù hợp khi nào?

## Nguồn chính thống

- [Angular — Angular dependency injection guide](https://angular.dev/guide/di)
