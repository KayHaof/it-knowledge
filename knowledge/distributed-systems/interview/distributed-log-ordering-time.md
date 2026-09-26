---
id: distributed-log-ordering-time
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - logical-clock
  - ordering
  - timestamps
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
    - id: logical-clock
      required: true
      aliases:
        - logical-clock
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
    - id: timestamps
      required: false
      aliases:
        - timestamps
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - So sánh millisecond timestamp giữa server luôn cho thứ tự nhân quả chính xác.
      penalty: 20
---

# Vì sao timestamp wall-clock không đủ để suy ra thứ tự event?

## Rubric

### Must Include

- logical-clock

- ordering

### Strong Answer Includes

- timestamps

## Câu trả lời 30 giây

Clock drift, NTP step và network delay khiến timestamp có thể đảo thứ tự. Dùng sequence per aggregate, logical/vector clock hoặc broker offset tùy invariant.

## Câu trả lời chi tiết

Lamport clock biểu diễn happens-before một phần; vector clock phát hiện concurrency nhưng metadata lớn. Event time khác processing time, đặc biệt stream lateness. Ordering toàn cục đắt và thường không cần; xác định scope ordering trước.

## Góc nhìn Production

Theo dõi clock offset/late events và watermark; không dùng client timestamp cho dedup duy nhất.

## Trade-offs

Lamport clock biểu diễn happens-before một phần; vector clock phát hiện concurrency nhưng metadata lớn. Event time khác processing time, đặc biệt stream lateness. Ordering toàn cục đắt và thường không cần; xác định scope ordering trước.

## Câu trả lời sai thường gặp

So sánh millisecond timestamp giữa server luôn cho thứ tự nhân quả chính xác.

## Follow-up

- Lamport clock không phát hiện được điều gì?

- Late event update aggregate ra sao?

## Nguồn chính thống

- [IETF — RFC 5905 - Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html)
- [IETF — RFC 3339 - Date and Time on the Internet: Timestamps](https://www.rfc-editor.org/rfc/rfc3339.html)
- [Amazon Web Services — Challenges with distributed systems](https://aws.amazon.com/builders-library/challenges-with-distributed-systems/)
- [Apache Kafka — Apache Kafka documentation](https://kafka.apache.org/documentation/)
