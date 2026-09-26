---
id: project-experience-microservices-boundary
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: senior
topics:
  - microservices
  - boundary
  - ownership
relatedLessons:
  - microservices-boundaries
sources:
  - title: AWS Prescriptive Guidance - decomposing monoliths
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/
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
    - id: microservices
      required: true
      aliases:
        - microservices
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: boundary
      required: true
      aliases:
        - boundary
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ownership
      required: false
      aliases:
        - ownership
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mỗi bảng database là một microservice và microservices tự scale tốt hơn.
      penalty: 20
---

# Giải thích “Vì sao dùng microservices?” mà không biến câu trả lời thành buzzword thế nào?

## Rubric

### Must Include

- microservices

- boundary

### Strong Answer Includes

- ownership

## Câu trả lời 30 giây

Tôi bắt đầu từ bounded context, team ownership, data boundary và nhu cầu deploy/scale độc lập; sau đó thừa nhận network/consistency/on-call cost. Nếu repository không chứng minh topology, tôi trình bày khung đánh giá, không nhận đó là fact.

## Câu trả lời chi tiết

Tôi nêu boundary và contract cụ thể, sync/async choice, database ownership, resilience và observability. So sánh modular monolith, chỉ ra migration/rollback và failure isolation. Một câu trả lời senior phải nói khi nào không tách service.

## Góc nhìn Production

Nêu SLO liên service, timeout/retry/bulkhead và incident ownership; tránh claim HA chỉ từ số service.

## Trade-offs

Tôi nêu boundary và contract cụ thể, sync/async choice, database ownership, resilience và observability. So sánh modular monolith, chỉ ra migration/rollback và failure isolation. Một câu trả lời senior phải nói khi nào không tách service.

## Câu trả lời sai thường gặp

Mỗi bảng database là một microservice và microservices tự scale tốt hơn.

## Follow-up

- Dấu hiệu distributed monolith là gì?

- Data consistency giữa service xử lý ra sao?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
