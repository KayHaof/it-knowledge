---
id: network-http-streaming-backpressure
type: interview-question
technology: WebSocket
category: WebSocket
difficulty: senior
topics:
  - streaming
  - backpressure
  - HTTP
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
    - id: streaming
      required: true
      aliases:
        - streaming
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: backpressure
      required: true
      aliases:
        - backpressure
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: http
      required: false
      aliases:
        - HTTP
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - TCP tự backpressure toàn bộ application nên không cần giới hạn buffer.
      penalty: 20
---

# HTTP streaming response cần backpressure ở những boundary nào?

## Rubric

### Must Include

- streaming

- backpressure

### Strong Answer Includes

- HTTP

## Câu trả lời 30 giây

Producer, server buffer, socket và client đọc với tốc độ khác nhau; buffer vô hạn gây memory. Phải giới hạn queue, cancel khi client disconnect và xử lý slow consumer.

## Câu trả lời chi tiết

Reactive stream/flow-control báo demand nhưng proxy có thể buffer; SSE/WebSocket send queue cần per-client limit và drop policy. Cancellation không đảm bảo upstream đã dừng, nên propagate deadline. Chọn drop latest/oldest theo semantics.

## Góc nhìn Production

Theo dõi buffer bytes, slow-client count và cancelled upstream work.

## Trade-offs

Reactive stream/flow-control báo demand nhưng proxy có thể buffer; SSE/WebSocket send queue cần per-client limit và drop policy. Cancellation không đảm bảo upstream đã dừng, nên propagate deadline. Chọn drop latest/oldest theo semantics.

## Câu trả lời sai thường gặp

TCP tự backpressure toàn bộ application nên không cần giới hạn buffer.

## Follow-up

- Client disconnect phát hiện ở server thế nào?

- Event nào được phép drop?

## Nguồn chính thống

- [IETF — RFC 6455 - The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455.html)
- [IETF — RFC 9110 - HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN — Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
