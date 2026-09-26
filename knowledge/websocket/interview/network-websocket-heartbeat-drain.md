---
id: network-websocket-heartbeat-drain
type: interview-question
technology: WebSocket
category: WebSocket
difficulty: senior
topics:
  - WebSocket
  - heartbeat
  - drain
relatedLessons:
  - realtime-protocols
sources:
  - title: RFC 6455 - The WebSocket Protocol
    url: https://www.rfc-editor.org/rfc/rfc6455.html
    organization: IETF
    type: standard
    accessedAt: 2026-09-02
  - title: RFC 9110 - HTTP Semantics
    url: https://www.rfc-editor.org/rfc/rfc9110.html
    organization: IETF
    type: standard
    accessedAt: 2026-09-02
  - title: WebSocket API
    url: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
    organization: MDN
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Using server-sent events
    url: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
    organization: MDN
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
    - id: websocket
      required: true
      aliases:
        - WebSocket
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: heartbeat
      required: true
      aliases:
        - heartbeat
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: drain
      required: false
      aliases:
        - drain
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - TCP keepalive luôn phát hiện application half-open nhanh và thay được ping/pong.
      penalty: 20
---

# Thiết kế heartbeat và graceful drain cho WebSocket production?

## Rubric

### Must Include

- WebSocket

- heartbeat

### Strong Answer Includes

- drain

## Câu trả lời 30 giây

Ping/pong phát hiện half-open; server phải đóng connection quá hạn và ngừng nhận session mới khi drain. Client reconnect với backoff+jitter, không reconnect storm.

## Câu trả lời chi tiết

Heartbeat interval dưới proxy idle timeout nhưng không quá dày; ghi last-seen và close reason. Khi rollout, mark not-ready, stop subscribe, gửi close code/reconnect hint rồi chờ grace period. Event resume cursor/idempotency xử lý gap sau reconnect.

## Góc nhìn Production

Metric ping latency, close codes, drain duration và reconnect rate; load test thousands connections.

## Trade-offs

Heartbeat interval dưới proxy idle timeout nhưng không quá dày; ghi last-seen và close reason. Khi rollout, mark not-ready, stop subscribe, gửi close code/reconnect hint rồi chờ grace period. Event resume cursor/idempotency xử lý gap sau reconnect.

## Câu trả lời sai thường gặp

TCP keepalive luôn phát hiện application half-open nhanh và thay được ping/pong.

## Follow-up

- Resume cursor lưu ở client hay server?

- Drain khi node crash không thể làm gì?

## Nguồn chính thống

- [IETF — RFC 6455 - The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455.html)
- [IETF — RFC 9110 - HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN — Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
