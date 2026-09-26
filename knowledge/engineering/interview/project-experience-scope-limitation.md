---
id: project-experience-scope-limitation
type: interview-question
technology: Project Experience
category: Project Experience
difficulty: senior
topics:
  - limitations
  - repository-evidence
  - honesty
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
    - id: limitations
      required: true
      aliases:
        - limitations
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: repository-evidence
      required: true
      aliases:
        - repository-evidence
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: honesty
      required: false
      aliases:
        - honesty
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Nên đoán một con số hợp lý để thể hiện seniority dù không kiểm chứng được.
      penalty: 20
---

# Khi interviewer hỏi chi tiết repository không chứng minh được, bạn trả lời thế nào?

## Rubric

### Must Include

- limitations

- repository-evidence

### Strong Answer Includes

- honesty

## Câu trả lời 30 giây

Tôi nói thẳng “em chưa có evidence cho chi tiết đó”, chỉ ra điều đã kiểm và đưa cách verify/thiết kế. Sự chính xác đáng tin hơn việc đoán cấu hình production.

## Câu trả lời chi tiết

Tôi phân lớp: fact từ source/config/test; inference hợp lý; proposal cần benchmark/ADR. Sau đó trả lời trade-off và experiment plan. Không bịa topology, traffic, SLA, security control hay metric để làm câu chuyện nghe lớn hơn.

## Góc nhìn Production

Giữ architecture decision record và link evidence; cập nhật câu trả lời sau mỗi experiment.

## Trade-offs

Tôi phân lớp: fact từ source/config/test; inference hợp lý; proposal cần benchmark/ADR. Sau đó trả lời trade-off và experiment plan. Không bịa topology, traffic, SLA, security control hay metric để làm câu chuyện nghe lớn hơn.

## Câu trả lời sai thường gặp

Nên đoán một con số hợp lý để thể hiện seniority dù không kiểm chứng được.

## Follow-up

- Nếu interviewer ép một câu trả lời yes/no thì sao?

- Bạn biến limitation thành kế hoạch nào?

## Nguồn chính thống

- [Amazon Web Services — AWS Prescriptive Guidance - decomposing monoliths](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/)
