---
id: network-websocket-sse-polling
type: interview-question
technology: WebSocket
category: WebSocket
difficulty: middle
topics:
  - WebSocket
  - SSE
  - long-polling
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
    - id: sse
      required: true
      aliases:
        - SSE
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: long-polling
      required: false
      aliases:
        - long-polling
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - WebSocket tự đảm bảo delivery exactly-once nên không cần resume.
      penalty: 20
---

# Chọn WebSocket, SSE hay long polling cho realtime update?

## Rubric

### Must Include

- WebSocket

- SSE

### Strong Answer Includes

- long-polling

## Câu trả lời 30 giây

WebSocket hai chiều; SSE một chiều qua HTTP dễ đi qua proxy; long polling đơn giản nhưng request churn cao. Chọn theo direction, reconnect và fan-out.

## Câu trả lời chi tiết

WebSocket cần heartbeat/backpressure/reconnect; SSE có Last-Event-ID và connection limits; long polling chịu proxy tốt hơn. Cả ba cần cursor/idempotency và auth refresh. Scale nhiều instance cần broker hoặc connection affinity.

## Góc nhìn Production

Theo dõi active connections, send queue, disconnect code và reconnect storm.

## Trade-offs

WebSocket cần heartbeat/backpressure/reconnect; SSE có Last-Event-ID và connection limits; long polling chịu proxy tốt hơn. Cả ba cần cursor/idempotency và auth refresh. Scale nhiều instance cần broker hoặc connection affinity.

## Câu trả lời sai thường gặp

WebSocket tự đảm bảo delivery exactly-once nên không cần resume.

## Follow-up

- Scale WebSocket qua nhiều instance thế nào?

- SSE reconnect mất event xử lý ra sao?

## Nguồn chính thống

- [IETF — RFC 6455 - The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455.html)
- [IETF — RFC 9110 - HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN — Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
