---
id: architecture-event-sourcing-vs-outbox
type: interview-question
technology: Architecture
category: Architecture
difficulty: senior
topics:
  - event-sourcing
  - outbox
  - audit
relatedLessons:
  - transactional-outbox
sources:
  - title: Debezium Outbox Event Router
    url: https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html
    organization: Debezium
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
    - id: event-sourcing
      required: true
      aliases:
        - event-sourcing
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: outbox
      required: true
      aliases:
        - outbox
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: audit
      required: false
      aliases:
        - audit
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Thêm bảng outbox vào CRUD database là đã chuyển hệ thống sang event sourcing.
      penalty: 20
---

# Event sourcing khác transactional outbox ở mục tiêu nào?

## Rubric

### Must Include

- event-sourcing

- outbox

### Strong Answer Includes

- audit

## Câu trả lời 30 giây

Event sourcing dùng event làm source of truth để dựng state; outbox vẫn dùng bảng state thông thường và ghi thêm event để phát ra đáng tin cậy. Có thể kết hợp nhưng không đồng nhất.

## Câu trả lời chi tiết

Event-sourced aggregate cần replay, snapshot, schema evolution và event immutability; outbox giải dual-write giữa CRUD DB và broker. Chọn event sourcing khi audit/history và temporal reconstruction là core, không chỉ vì muốn publish event.

## Góc nhìn Production

Đo replay time, snapshot age, event schema compatibility và storage growth.

## Trade-offs

Event-sourced aggregate cần replay, snapshot, schema evolution và event immutability; outbox giải dual-write giữa CRUD DB và broker. Chọn event sourcing khi audit/history và temporal reconstruction là core, không chỉ vì muốn publish event.

## Câu trả lời sai thường gặp

Thêm bảng outbox vào CRUD database là đã chuyển hệ thống sang event sourcing.

## Follow-up

- Snapshot event-sourced aggregate khi nào?

- Projection rebuild xử lý version thế nào?

## Nguồn chính thống

- [Debezium — Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
