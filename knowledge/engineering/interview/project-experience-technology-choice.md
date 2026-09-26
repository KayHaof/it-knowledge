---
id: project-experience-technology-choice
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: junior
topics:
  - project-story
  - trade-off
  - communication
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
    - id: project-story
      required: true
      aliases:
        - project-story
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: trade-off
      required: true
      aliases:
        - trade-off
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: communication
      required: false
      aliases:
        - communication
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chọn framework phổ biến nhất là đủ, không cần nói constraint hay trade-off.
      penalty: 20
---

# Khi được hỏi “Vì sao em chọn công nghệ này?”, nên trả lời an toàn thế nào khi chưa có benchmark đầy đủ?

## Rubric

### Must Include

- project-story

- trade-off

### Strong Answer Includes

- communication

## Câu trả lời 30 giây

Tôi nói rõ context và constraint đã biết, công nghệ giải quyết nhu cầu nào, rồi nêu trade-off và cách kiểm chứng. Tôi phân biệt điều repo chứng minh với ví dụ/framework tôi đang đề xuất.

## Câu trả lời chi tiết

Khung trả lời gồm: problem, options considered, decision criteria, evidence, operational cost và điều sẽ cải thiện. Không nói “công nghệ tốt nhất” tuyệt đối; nếu quyết định inherited, nói rõ tôi hiểu và có thể challenge bằng benchmark/ADR. Kết luận bằng metric hoặc risk còn mở.

## Góc nhìn Production

Chuẩn bị link ADR/metric nếu có; không tiết lộ secret hay claim chưa kiểm chứng.

## Trade-offs

Khung trả lời gồm: problem, options considered, decision criteria, evidence, operational cost và điều sẽ cải thiện. Không nói “công nghệ tốt nhất” tuyệt đối; nếu quyết định inherited, nói rõ tôi hiểu và có thể challenge bằng benchmark/ADR. Kết luận bằng metric hoặc risk còn mở.

## Câu trả lời sai thường gặp

Chọn framework phổ biến nhất là đủ, không cần nói constraint hay trade-off.

## Follow-up

- Nếu interviewer hỏi option bị loại thì sao?

- Khi nào bạn đổi quyết định?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
