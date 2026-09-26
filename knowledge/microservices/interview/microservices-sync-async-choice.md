---
id: microservices-sync-async-choice
type: interview-question
technology: Microservices
category: Microservices
difficulty: middle
topics:
  - REST
  - events
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
    - id: rest
      required: true
      aliases:
        - REST
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: events
      required: true
      aliases:
        - events
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
        - Async luôn nhanh hơn REST vì không chờ network.
      penalty: 20
---

# Chọn synchronous REST hay asynchronous event theo tiêu chí nào?

## Rubric

### Must Include

- REST

- events

### Strong Answer Includes

- latency

## Câu trả lời 30 giây

Sync phù hợp query/command cần response ngay và dependency ít; async phù hợp workflow dài, fan-out và tách availability. Async đổi latency thấp thành eventual consistency và operational complexity.

## Câu trả lời chi tiết

Tôi xem user SLO, coupling, ordering, retry semantics và data ownership. Sync chain cần timeout/bulkhead; event cần schema, replay, idempotent consumer và DLQ. Có thể trả 202 + status resource thay vì giữ request mở.

## Góc nhìn Production

Trace cả message và request; đo queue age, timeout budget và duplicate handling.

## Trade-offs

Tôi xem user SLO, coupling, ordering, retry semantics và data ownership. Sync chain cần timeout/bulkhead; event cần schema, replay, idempotent consumer và DLQ. Có thể trả 202 + status resource thay vì giữ request mở.

## Câu trả lời sai thường gặp

Async luôn nhanh hơn REST vì không chờ network.

## Follow-up

- Khi nào event cần ordering key?

- 202 workflow API cần trạng thái nào?

## Nguồn chính thống

- [IETF / RFC Editor — RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [IETF / RFC Editor — RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [gRPC / CNCF — What is gRPC?](https://grpc.io/docs/what-is-grpc/)
- [gRPC / CNCF — gRPC core concepts, architecture and lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/)
- [Protocol Buffers — Protocol Buffers Language Guide](https://protobuf.dev/programming-guides/proto3/)
- [Apache Software Foundation — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
