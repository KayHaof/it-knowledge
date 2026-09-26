---
id: q-distributed-clock-order
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: middle
topics:
  - clock-skew
  - Lamport
  - ordering
relatedLessons:
  - distributed-time-clocks-ordering
sources:
  - title: RFC 5905 - Network Time Protocol Version 4
    url: https://www.rfc-editor.org/rfc/rfc5905.html
    organization: IETF
    type: standard
    accessedAt: 2026-09-02
  - title: "RFC 3339 - Date and Time on the Internet: Timestamps"
    url: https://www.rfc-editor.org/rfc/rfc3339.html
    organization: IETF
    type: standard
    accessedAt: 2026-09-02
  - title: Challenges with distributed systems
    url: https://aws.amazon.com/builders-library/challenges-with-distributed-systems/
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka documentation
    url: https://kafka.apache.org/documentation/
    organization: Apache Kafka
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
    - id: clock-skew
      required: true
      aliases:
        - clock-skew
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: lamport
      required: true
      aliases:
        - Lamport
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ordering
      required: false
      aliases:
        - ordering
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - NTP đồng bộ tới milliseconds nên timestamp lớn hơn luôn là event xảy ra sau trên toàn hệ thống.
      penalty: 20
---

# Có thể dùng timestamp từ các server để quyết định chính xác event nào xảy ra trước không?

## Rubric

### Must Include

- clock-skew

- Lamport

### Strong Answer Includes

- ordering

## Câu trả lời 30 giây

Không nói chung. Wall clocks có skew/jump và hai events concurrent không có causal order. Monotonic clock đo elapsed time cục bộ; logical clock/version biểu diễn happens-before nhưng không tự cho thời gian thực.

## Câu trả lời chi tiết

Tôi tách requirements: TTL/deadline dùng monotonic elapsed time trong process; audit hiển thị wall time kèm uncertainty; per-aggregate ordering dùng sequence/version; distributed causality dùng Lamport/vector/HLC tùy cần. Last-write-wins bằng client timestamp có thể làm mất write khi clock sai. NTP giảm skew nhưng không tạo global perfect clock, và leap/adjustment vẫn phải được xem xét.

## Deep Dive

Lamport clock bảo đảm nếu A happens-before B thì L(A) nhỏ hơn L(B), nhưng chiều ngược không chứng minh causality. Total-order tie-breaker có thể deterministic mà vẫn không phải thời gian thật.

## Góc nhìn Production

Monitor clock offset/sync health, từ chối hoặc quarantine timestamp bất thường, ghi event ID + source + sequence. Test clock jump, delayed message và process pause cho lease/deadline logic.

## Trade-offs

Lamport clock bảo đảm nếu A happens-before B thì L(A) nhỏ hơn L(B), nhưng chiều ngược không chứng minh causality. Total-order tie-breaker có thể deterministic mà vẫn không phải thời gian thật.

## Câu trả lời sai thường gặp

NTP đồng bộ tới milliseconds nên timestamp lớn hơn luôn là event xảy ra sau trên toàn hệ thống.

## Follow-up

- Wall clock và monotonic clock dùng cho việc gì?

- Lamport clock không phát hiện concurrency ở điểm nào?

## Nguồn chính thống

- [IETF — RFC 5905 - Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html)
- [IETF — RFC 3339 - Date and Time on the Internet: Timestamps](https://www.rfc-editor.org/rfc/rfc3339.html)
- [Amazon Web Services — Challenges with distributed systems](https://aws.amazon.com/builders-library/challenges-with-distributed-systems/)
- [Apache Kafka — Apache Kafka documentation](https://kafka.apache.org/documentation/)
