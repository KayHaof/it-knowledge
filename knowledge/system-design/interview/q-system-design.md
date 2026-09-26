---
id: q-system-design
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - requirements
  - trade-off
relatedLessons:
  - system-design-method
sources:
  - title: AWS Well-Architected Framework
    url: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
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
    - id: requirements
      required: true
      aliases:
        - requirements
      points:
        technicalCorrectness: 20
        completeness: 10
    - id: trade-off
      required: true
      aliases:
        - trade-off
      points:
        technicalCorrectness: 20
        completeness: 10
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bắt đầu bằng vẽ load balancer, Redis và Kafka vì hệ thống nào cũng cần.
      penalty: 20
---

# Bạn bắt đầu một câu System Design như thế nào?

## Rubric

### Must Include

- requirements

- trade-off

### Strong Answer Includes

## Câu trả lời 30 giây

Tôi clarify feature và SLO, chốt assumptions, estimate order of magnitude, thiết kế API/data/high-level flow rồi deep dive vào bottleneck và failure lớn nhất.

## Câu trả lời chi tiết

Tôi hỏi user/traffic, consistency, latency, availability, retention, region và security. Sau estimate QPS/storage, tôi chọn critical flow, API và invariant/data model. Mỗi cache/queue/shard phải giải quyết requirement. Cuối cùng tôi bàn overload, observability, rollout, disaster recovery và alternative.

## Góc nhìn Production

Không fake precision và không glorify complexity; nói metric dùng để kiểm chứng design.

## Trade-offs

Tôi hỏi user/traffic, consistency, latency, availability, retention, region và security. Sau estimate QPS/storage, tôi chọn critical flow, API và invariant/data model. Mỗi cache/queue/shard phải giải quyết requirement. Cuối cùng tôi bàn overload, observability, rollout, disaster recovery và alternative.

## Câu trả lời sai thường gặp

Bắt đầu bằng vẽ load balancer, Redis và Kafka vì hệ thống nào cũng cần.

## Follow-up

- Estimate dùng để quyết định gì?

- Bạn chọn consistency theo cách nào?

## Nguồn chính thống

- [Amazon Web Services — AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
