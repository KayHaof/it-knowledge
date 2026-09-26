---
id: q-mongodb-schema
type: interview-question
technology: MongoDB
category: MongoDB
difficulty: middle
topics:
  - document-model
  - schema
  - transactions
relatedLessons:
  - mongodb-document-model
sources:
  - title: MongoDB data modeling
    url: https://www.mongodb.com/docs/manual/data-modeling/
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
    - id: schema
      required: true
      aliases:
        - schema
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: transactions
      required: false
      aliases:
        - transactions
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - MongoDB schemaless nên có thể lưu object bất kỳ mà không cần version hoặc validation.
      penalty: 20
---

# NoSQL có nghĩa MongoDB không cần schema hay transaction không?

## Rubric

### Must Include

- document-model

- schema

### Strong Answer Includes

- transactions

## Câu trả lời 30 giây

Không. Document vẫn có shape và invariant, chỉ được enforce/evolve khác relational. MongoDB hỗ trợ validation và transactions; thiết kế embed/reference phải theo access pattern, consistency và document growth.

## Câu trả lời chi tiết

Embed cho atomic/local read khi data cùng lifecycle và bounded; reference giảm duplication/document growth nhưng thêm lookup/consistency work. Tôi ghi schema version/migration, index theo query, size/cardinality và shard-key implications. Multi-document transaction có cost, không chữa data model lệch access pattern.

## Deep Dive

Flexible schema dễ tạo nhiều historical shapes; application phải đọc tương thích hoặc migrate có kiểm soát.

## Góc nhìn Production

Theo dõi document size, working set, slow query/index, replication lag và test backup/restore.

## Trade-offs

Flexible schema dễ tạo nhiều historical shapes; application phải đọc tương thích hoặc migrate có kiểm soát.

## Câu trả lời sai thường gặp

MongoDB schemaless nên có thể lưu object bất kỳ mà không cần version hoặc validation.

## Follow-up

- Khi nào embed thay vì reference?

- Shard key xấu tạo hot shard thế nào?

## Nguồn chính thống

- [MongoDB — MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/)
