---
id: q-websocket
type: interview-question
technology: WebSocket
category: WebSocket
difficulty: middle
topics:
  - realtime
  - scaling
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
    - id: realtime
      required: true
      aliases:
        - realtime
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: scaling
      required: true
      aliases:
        - scaling
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Socket.IO chỉ là wrapper mỏng của WebSocket nên client nào cũng tương thích.
      penalty: 20
---

# WebSocket khác SSE và Socket.IO thế nào?

## Rubric

### Must Include

- realtime

- scaling

### Strong Answer Includes

## Câu trả lời 30 giây

WebSocket là protocol hai chiều; SSE là server-to-client stream trên HTTP; Socket.IO là library/protocol bổ sung reconnect, room, fallback và không tương thích trực tiếp WebSocket thuần.

## Câu trả lời chi tiết

Tôi chọn theo direction, connection count, proxy/mobile behavior, message size và recovery. Cả persistent connection đều cần heartbeat, reconnect, authorization, resume/sync và backpressure. Khi scale ngang cần connection registry/message bus; sticky session không đồng bộ state.

## Góc nhìn Production

Drain connection lúc deploy, giới hạn outbound buffer và dùng cursor để bù gap sau reconnect.

## Trade-offs

Tôi chọn theo direction, connection count, proxy/mobile behavior, message size và recovery. Cả persistent connection đều cần heartbeat, reconnect, authorization, resume/sync và backpressure. Khi scale ngang cần connection registry/message bus; sticky session không đồng bộ state.

## Câu trả lời sai thường gặp

Socket.IO chỉ là wrapper mỏng của WebSocket nên client nào cũng tương thích.

## Follow-up

- SSE phù hợp use case nào?

- WebSocket ordering có đủ cho business không?

## Nguồn chính thống

- [IETF — RFC 6455 - The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455.html)
- [IETF — RFC 9110 - HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN — Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
