---
id: mongodb-document-model-embedding
type: interview-question
technology: MongoDB
category: MongoDB
difficulty: junior
topics:
  - document-model
  - embedding
  - references
relatedLessons:
  - mongodb-document-model
sources:
  - title: MongoDB data modeling
    url: https://www.mongodb.com/docs/manual/data-modeling/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Replication
    url: https://www.mongodb.com/docs/manual/replication/
    organization: MongoDB
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
    - id: document-model
      required: true
      aliases:
        - document-model
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: embedding
      required: true
      aliases:
        - embedding
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: references
      required: false
      aliases:
        - references
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - MongoDB không hỗ trợ reference nên mọi quan hệ phải nhúng toàn bộ.
      penalty: 20
---

# MongoDB nên embed hay reference dữ liệu theo tiêu chí nào?

## Rubric

### Must Include

- document-model

- embedding

### Strong Answer Includes

- references

## Câu trả lời 30 giây

Embed khi dữ liệu cùng lifecycle, đọc cùng nhau và kích thước bounded; reference khi tăng trưởng lớn, chia sẻ hoặc cập nhật độc lập. Không có quy tắc “NoSQL luôn embed”.

## Câu trả lời chi tiết

Embed giảm join/round trip nhưng duplicate và document size tăng; reference yêu cầu multiple query/$lookup và consistency workflow. Thiết kế theo access pattern, write frequency và atomic update boundary. Schema linh hoạt vẫn cần validation/index.

## Góc nhìn Production

Theo dõi document size, hot document và query shape; migration schema versioned.

## Trade-offs

Embed giảm join/round trip nhưng duplicate và document size tăng; reference yêu cầu multiple query/$lookup và consistency workflow. Thiết kế theo access pattern, write frequency và atomic update boundary. Schema linh hoạt vẫn cần validation/index.

## Câu trả lời sai thường gặp

MongoDB không hỗ trợ reference nên mọi quan hệ phải nhúng toàn bộ.

## Follow-up

- Document size limit ảnh hưởng gì?

- $lookup có nên dùng như SQL join mọi lúc?

## Nguồn chính thống

- [MongoDB — MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/)
- [MongoDB — Replication](https://www.mongodb.com/docs/manual/replication/)
