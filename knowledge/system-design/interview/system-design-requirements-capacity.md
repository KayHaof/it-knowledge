---
id: system-design-requirements-capacity
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - requirements
  - capacity
  - SLO
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
        technicalCorrectness: 14
        completeness: 7
    - id: capacity
      required: true
      aliases:
        - capacity
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: slo
      required: false
      aliases:
        - SLO
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - System design tốt bắt đầu bằng chọn database phổ biến nhất rồi mới hỏi requirement.
      penalty: 20
---

# Bạn bắt đầu một system-design interview bằng những câu hỏi nào?

## Rubric

### Must Include

- requirements

- capacity

### Strong Answer Includes

- SLO

## Câu trả lời 30 giây

Tôi chốt functional scope, traffic/read-write mix, latency/availability/freshness SLO và dữ liệu cần giữ. Sau đó nêu assumptions và capacity estimate trước khi vẽ component.

## Câu trả lời chi tiết

Tôi hỏi user/tenant scale, peak factor, payload size, consistency, abuse/compliance và multi-region. Estimate QPS, storage, bandwidth và fan-out giúp loại thiết kế không khả thi. Mỗi trade-off liên kết requirement, failure mode và operational owner.

## Góc nhìn Production

Ghi assumptions và đo lại sau launch; SLO là contract chứ không chỉ con số trên slide.

## Trade-offs

Tôi hỏi user/tenant scale, peak factor, payload size, consistency, abuse/compliance và multi-region. Estimate QPS, storage, bandwidth và fan-out giúp loại thiết kế không khả thi. Mỗi trade-off liên kết requirement, failure mode và operational owner.

## Câu trả lời sai thường gặp

System design tốt bắt đầu bằng chọn database phổ biến nhất rồi mới hỏi requirement.

## Follow-up

- Peak traffic giả định thế nào?

- SLO nào cần hỏi thêm?

## Nguồn chính thống

- [Amazon Web Services — AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
