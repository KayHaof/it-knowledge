---
id: q-cqrs-projection
type: interview-question
technology: Architecture
category: Architecture
difficulty: senior
topics:
  - CQRS
  - projection
  - eventual-consistency
relatedLessons:
  - cqrs-event-driven
sources:
  - title: CQRS pattern
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/cqrs-pattern.html
    organization: Amazon Web Services
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
    - id: cqrs
      required: true
      aliases:
        - CQRS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: projection
      required: true
      aliases:
        - projection
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: eventual-consistency
      required: false
      aliases:
        - eventual-consistency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CQRS luôn cần hai database và tự động tăng performance/consistency.
      penalty: 20
---

# Khi nào CQRS tạo giá trị và read projection hỏng thì phục hồi thế nào?

## Rubric

### Must Include

- CQRS

- projection

### Strong Answer Includes

- eventual-consistency

## Câu trả lời 30 giây

CQRS hữu ích khi read/write model và scaling thật sự khác; CRUD thường không cần. Projection là derived state: phải idempotent, checkpoint được, quan sát lag và rebuild/replay từ source đáng tin.

## Câu trả lời chi tiết

Tôi bắt đầu bằng DTO/read query riêng trước khi thêm store/event. Nếu dùng async projection, event có schema/version/order, consumer dedupe và atomic checkpoint với update. Rebuild chạy side-by-side vào version mới, kiểm count/checksum/sample rồi switch alias; không truncate production read model mù.

## Deep Dive

Event sourcing không đồng nghĩa CQRS và làm event thành source of truth có migration/privacy/retention cost lớn hơn outbox integration event.

## Góc nhìn Production

Lag SLO, poison-event quarantine, replay throttle, dual-run validation và UI contract cho dữ liệu chưa hội tụ.

## Trade-offs

Event sourcing không đồng nghĩa CQRS và làm event thành source of truth có migration/privacy/retention cost lớn hơn outbox integration event.

## Câu trả lời sai thường gặp

CQRS luôn cần hai database và tự động tăng performance/consistency.

## Follow-up

- Projection checkpoint atomic thế nào?

- CQRS khác event sourcing?

## Nguồn chính thống

- [Amazon Web Services — CQRS pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/cqrs-pattern.html)
