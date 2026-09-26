---
id: q-api-style-decision
type: interview-question
technology: Architecture
category: Architecture
difficulty: system-design
topics:
  - REST
  - gRPC
  - events
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
    - id: rest
      required: true
      aliases:
        - REST
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: grpc
      required: true
      aliases:
        - gRPC
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: events
      required: false
      aliases:
        - events
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Dùng gRPC cho mọi internal call và Kafka cho mọi async task vì chúng luôn nhanh/decoupled hơn REST.
      penalty: 20
---

# Trong một hệ thống mới, bạn quyết định boundary nào dùng REST, gRPC hay event như thế nào?

## Rubric

### Must Include

- REST

- gRPC

### Strong Answer Includes

- events

## Câu trả lời 30 giây

Tôi bắt đầu từ interaction contract: caller cần response trong deadline, streaming typed RPC, hay fact durable cho nhiều consumers/replay. Sau đó so coupling, compatibility, retry/idempotency, ordering, security và năng lực vận hành; hệ thống thực tế thường hybrid.

## Câu trả lời chi tiết

REST/HTTP phù hợp resource/query và public interoperability; gRPC phù hợp internal typed low-latency/streaming khi client/server ecosystem hỗ trợ; event phù hợp temporal decoupling, fan-out và replay nhưng đổi failure thành backlog/eventual state. Tôi định nghĩa deadlines/status/error cho sync, schema evolution và unknown outcome; với events có event identity, partition/order, retention, DLQ/replay. Không dùng request-reply qua broker nếu caller vẫn cần synchronous result.

## Deep Dive

Protocol choice không xác định service boundary. Additive field có thể vẫn phá consumer nếu semantics/validation đổi; compatibility phải xét old producer/new consumer và dữ liệu retained.

## Góc nhìn Production

Contract tests, version inventory, deprecation telemetry, per-boundary SLO và tracing. Với dual write DB+event dùng outbox/idempotent consumers; threat model authn/authz cho từng hop.

## Trade-offs

Protocol choice không xác định service boundary. Additive field có thể vẫn phá consumer nếu semantics/validation đổi; compatibility phải xét old producer/new consumer và dữ liệu retained.

## Câu trả lời sai thường gặp

Dùng gRPC cho mọi internal call và Kafka cho mọi async task vì chúng luôn nhanh/decoupled hơn REST.

## Follow-up

- Khi nào 202 + operation resource hợp hơn event reply?

- Event compatibility khác HTTP compatibility ra sao?

## Nguồn chính thống

- [IETF / RFC Editor — RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [IETF / RFC Editor — RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [gRPC / CNCF — What is gRPC?](https://grpc.io/docs/what-is-grpc/)
- [gRPC / CNCF — gRPC core concepts, architecture and lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/)
- [Protocol Buffers — Protocol Buffers Language Guide](https://protobuf.dev/programming-guides/proto3/)
- [Apache Software Foundation — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
