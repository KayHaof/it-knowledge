---
id: microservice-sync-async
type: interview-question
technology: Microservices
category: Microservices
difficulty: middle
topics:
  - sync
  - async
  - latency
relatedLessons:
  - api-contracts-rest-grpc-events
sources:
  - title: RFC 9110 — HTTP Semantics
    url: https://www.rfc-editor.org/rfc/rfc9110.html
    organization: IETF / RFC Editor
    type: standard
    accessedAt: 2026-09-02
  - title: RFC 9457 — Problem Details for HTTP APIs
    url: https://www.rfc-editor.org/rfc/rfc9457.html
    organization: IETF / RFC Editor
    type: standard
    accessedAt: 2026-09-02
  - title: What is gRPC?
    url: https://grpc.io/docs/what-is-grpc/
    organization: gRPC / CNCF
    type: official-documentation
    accessedAt: 2026-09-02
  - title: gRPC core concepts, architecture and lifecycle
    url: https://grpc.io/docs/what-is-grpc/core-concepts/
    organization: gRPC / CNCF
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Protocol Buffers Language Guide
    url: https://protobuf.dev/programming-guides/proto3/
    organization: Protocol Buffers
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Design
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Software Foundation
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
    - id: sync
      required: true
      aliases:
        - sync
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: async
      required: true
      aliases:
        - async
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: latency
      required: false
      aliases:
        - latency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Async luôn nhanh hơn sync vì không chờ, nên mọi internal call nên qua Kafka.
      penalty: 20
---

# Khi nào communication giữa service nên synchronous và khi nào asynchronous?

## Rubric

### Must Include

- sync

- async

### Strong Answer Includes

- latency

## Câu trả lời 30 giây

Sync phù hợp query/command cần response trong deadline và caller có thể xử lý failure; async phù hợp temporal decoupling, fan-out và work kéo dài. Async đổi latency thành eventual consistency/backlog, không miễn phí.

## Câu trả lời chi tiết

Sync chain dễ reasoning nhưng latency/failure multiply và tạo retry storm; async broker cần event schema, idempotency, ordering, DLQ và status query. User-facing command có thể trả 202 operation resource khi workflow dài. Đừng dùng broker request-reply nếu business vẫn cần synchronous answer ngay.

## Góc nhìn Production

Đo dependency depth, deadline, queue age, lag và unknown outcomes. Trace async correlation và đặt backpressure.

## Trade-offs

Sync chain dễ reasoning nhưng latency/failure multiply và tạo retry storm; async broker cần event schema, idempotency, ordering, DLQ và status query. User-facing command có thể trả 202 operation resource khi workflow dài. Đừng dùng broker request-reply nếu business vẫn cần synchronous answer ngay.

## Câu trả lời sai thường gặp

Async luôn nhanh hơn sync vì không chờ, nên mọi internal call nên qua Kafka.

## Follow-up

- 202 + operation resource thiết kế thế nào?

- Sync chain dài gây tail latency ra sao?

## Nguồn chính thống

- [IETF / RFC Editor — RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [IETF / RFC Editor — RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [gRPC / CNCF — What is gRPC?](https://grpc.io/docs/what-is-grpc/)
- [gRPC / CNCF — gRPC core concepts, architecture and lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/)
- [Protocol Buffers — Protocol Buffers Language Guide](https://protobuf.dev/programming-guides/proto3/)
- [Apache Software Foundation — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
