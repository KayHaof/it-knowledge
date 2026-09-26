---
id: distributed-partial-failure
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: middle
topics:
  - partial-failure
  - timeouts
  - uncertainty
relatedLessons:
  - distributed-failures
sources:
  - title: AWS Builders Library - timeouts, retries and backoff
    url: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
    organization: Amazon Web Services
    type: vendor-documentation
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
    - id: partial-failure
      required: true
      aliases:
        - partial-failure
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: timeouts
      required: true
      aliases:
        - timeouts
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: uncertainty
      required: false
      aliases:
        - uncertainty
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - HTTP timeout chứng minh server chưa thực hiện request nên retry payload mới luôn an toàn.
      penalty: 20
---

# Vì sao distributed system phải coi timeout là outcome unknown?

## Rubric

### Must Include

- partial-failure

- timeouts

### Strong Answer Includes

- uncertainty

## Câu trả lời 30 giây

Client không biết server chưa nhận, đang xử lý hay đã commit nhưng response mất. Retry mù có thể duplicate; dùng idempotency key, status query và reconciliation để xác định outcome.

## Câu trả lời chi tiết

Network partition/queue delay khiến absence of response không phải failure proof. Deadline chỉ ngừng chờ local, không rollback remote work. API nên expose operation ID/state và durable event; caller retry cùng key, không tạo command mới.

## Góc nhìn Production

Đo unknown-age, timeout vs server completion, reconciliation backlog và duplicate conflicts. Test packet loss, half-open connection và client crash.

## Trade-offs

Network partition/queue delay khiến absence of response không phải failure proof. Deadline chỉ ngừng chờ local, không rollback remote work. API nên expose operation ID/state và durable event; caller retry cùng key, không tạo command mới.

## Câu trả lời sai thường gặp

HTTP timeout chứng minh server chưa thực hiện request nên retry payload mới luôn an toàn.

## Follow-up

- Status endpoint cần lưu state bao lâu?

- Reconciliation dùng nguồn authority nào?

## Nguồn chính thống

- [Amazon Web Services — AWS Builders Library - timeouts, retries and backoff](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
