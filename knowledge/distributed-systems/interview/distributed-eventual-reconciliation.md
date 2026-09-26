---
id: distributed-eventual-reconciliation
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: senior
topics:
  - eventual-consistency
  - reconciliation
  - repair
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
    - id: eventual-consistency
      required: true
      aliases:
        - eventual-consistency
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: reconciliation
      required: true
      aliases:
        - reconciliation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: repair
      required: false
      aliases:
        - repair
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Eventual consistency tự hội tụ nên không cần kiểm tra hoặc reconciliation thủ công.
      penalty: 20
---

# Reconciliation job nên làm gì khi projection eventual consistency bị lệch?

## Rubric

### Must Include

- eventual-consistency

- reconciliation

### Strong Answer Includes

- repair

## Câu trả lời 30 giây

Định kỳ so projection với source-of-truth bằng version/checksum, phát hiện missing/duplicate và sửa idempotent theo policy. Reconciliation không được âm thầm ghi đè dữ liệu nghiệp vụ chưa xác định.

## Câu trả lời chi tiết

Chọn key/range, snapshot isolation và tolerance để tránh false positive khi source đang đổi. Repair có thể replay event, rebuild projection hoặc tạo manual exception; lưu audit và retry bounded. Version/sequence giúp bỏ update cũ và phát hiện gap.

## Góc nhìn Production

Theo dõi divergence count/age, repair rate, source load và unresolved queue. Thử event loss/out-of-order và migration.

## Trade-offs

Chọn key/range, snapshot isolation và tolerance để tránh false positive khi source đang đổi. Repair có thể replay event, rebuild projection hoặc tạo manual exception; lưu audit và retry bounded. Version/sequence giúp bỏ update cũ và phát hiện gap.

## Câu trả lời sai thường gặp

Eventual consistency tự hội tụ nên không cần kiểm tra hoặc reconciliation thủ công.

## Follow-up

- Checksum snapshot nhất quán thế nào?

- Repair sai có thể gây cascade gì?

## Nguồn chính thống

- [Amazon Web Services — AWS Builders Library - timeouts, retries and backoff](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
