---
id: distributed-clock-causality
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: middle
topics:
  - clock
  - causality
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
    - id: clock
      required: true
      aliases:
        - clock
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: causality
      required: true
      aliases:
        - causality
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
        - NTP đồng bộ đủ chính xác nên timestamp lớn hơn luôn chứng minh event xảy ra sau.
      penalty: 20
---

# Wall-clock timestamp và logical clock dùng cho quyết định nào?

## Rubric

### Must Include

- clock

- causality

### Strong Answer Includes

- ordering

## Câu trả lời 30 giây

Wall clock tiện hiển thị/audit nhưng có skew/jump; monotonic clock đo elapsed timeout. Logical clock biểu diễn happens-before, không cho thời gian thực hoặc phát hiện mọi concurrent event.

## Câu trả lời chi tiết

Lamport clock tăng theo message và bảo đảm A→B thì timestamp nhỏ hơn; ngược lại không chứng minh causality. Vector/HLC thêm thông tin concurrency/physical approximation với cost metadata. Lease/deadline nên dùng monotonic/bounded assumptions, không so timestamp client mù.

## Góc nhìn Production

Monitor NTP offset, clock jumps và deadline expiry; ghi source/sequence cùng timestamp. Test delayed event và process pause.

## Trade-offs

Lamport clock tăng theo message và bảo đảm A→B thì timestamp nhỏ hơn; ngược lại không chứng minh causality. Vector/HLC thêm thông tin concurrency/physical approximation với cost metadata. Lease/deadline nên dùng monotonic/bounded assumptions, không so timestamp client mù.

## Câu trả lời sai thường gặp

NTP đồng bộ đủ chính xác nên timestamp lớn hơn luôn chứng minh event xảy ra sau.

## Follow-up

- HLC trade-off metadata nào?

- Clock jump phá lease ra sao?

## Nguồn chính thống

- [IETF — RFC 5905 - Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html)
- [IETF — RFC 3339 - Date and Time on the Internet: Timestamps](https://www.rfc-editor.org/rfc/rfc3339.html)
- [Amazon Web Services — Challenges with distributed systems](https://aws.amazon.com/builders-library/challenges-with-distributed-systems/)
- [Apache Kafka — Apache Kafka documentation](https://kafka.apache.org/documentation/)
