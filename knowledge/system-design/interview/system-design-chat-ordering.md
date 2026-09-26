---
id: system-design-chat-ordering
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - chat
  - ordering
  - WebSocket
relatedLessons:
  - system-design-chat
sources:
  - title: WebSocket API
    url: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
    organization: MDN
    type: official-documentation
    accessedAt: 2026-09-02
  - title: AWS Reliability Pillar
    url: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html
    organization: Amazon Web Services
    type: vendor-documentation
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
    - id: chat
      required: true
      aliases:
        - chat
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: ordering
      required: true
      aliases:
        - ordering
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: websocket
      required: false
      aliases:
        - WebSocket
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Timestamp client đủ để sắp xếp message toàn hệ thống và WebSocket tự lưu history.
      penalty: 20
---

# Thiết kế chat đảm bảo thứ tự và reconnect thế nào?

## Rubric

### Must Include

- chat

- ordering

### Strong Answer Includes

- WebSocket

## Câu trả lời 30 giây

Partition theo conversation và gán sequence server-side; client giữ cursor, reconnect từ cursor và dedup message ID. WebSocket chỉ là transport, durable store/broker mới giữ history.

## Câu trả lời chi tiết

Tách send, persist, fan-out và read receipt; message status unknown cần idempotency. Per-conversation order không cần global order; offline delivery dùng cursor/retention. Presence ephemeral có TTL, scale connection qua gateway/broker.

## Góc nhìn Production

Theo dõi send-to-deliver p99, reconnect storm, backlog và poison payload; encrypt/authz conversation.

## Trade-offs

Tách send, persist, fan-out và read receipt; message status unknown cần idempotency. Per-conversation order không cần global order; offline delivery dùng cursor/retention. Presence ephemeral có TTL, scale connection qua gateway/broker.

## Câu trả lời sai thường gặp

Timestamp client đủ để sắp xếp message toàn hệ thống và WebSocket tự lưu history.

## Follow-up

- Multi-device read receipt model thế nào?

- Conversation hot partition xử lý ra sao?

## Nguồn chính thống

- [MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Amazon Web Services — AWS Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
