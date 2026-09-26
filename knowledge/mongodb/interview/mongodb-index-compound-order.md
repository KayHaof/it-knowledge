---
id: mongodb-index-compound-order
type: interview-question
technology: MongoDB
category: MongoDB
difficulty: middle
topics:
  - indexes
  - compound-index
  - ESR
relatedLessons:
  - mongodb-indexes-aggregation-performance
sources:
  - title: MongoDB Indexes
    url: https://www.mongodb.com/docs/manual/indexes/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB ESR Guideline
    url: https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Explain Results
    url: https://www.mongodb.com/docs/manual/reference/explain-results/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Aggregation Pipeline Optimization
    url: https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Aggregation Pipeline Limits
    url: https://www.mongodb.com/docs/manual/core/aggregation-pipeline-limits/
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
    - id: indexes
      required: true
      aliases:
        - indexes
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: compound-index
      required: true
      aliases:
        - compound-index
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: esr
      required: false
      aliases:
        - ESR
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - MongoDB tự đảo thứ tự field trong index để mọi predicate đều tối ưu như nhau.
      penalty: 20
---

# Thứ tự field trong compound index MongoDB ảnh hưởng query thế nào?

## Rubric

### Must Include

- indexes

- compound-index

### Strong Answer Includes

- ESR

## Câu trả lời 30 giây

Index prefix quan trọng; equality thường đặt trước rồi sort/range theo access pattern. Index sai thứ tự có thể scan nhiều hoặc không hỗ trợ sort.

## Câu trả lời chi tiết

Phân tích query shape, selectivity và sort; một index phục vụ nhiều query nhưng tăng write/storage cost. Multikey index với array có giới hạn và compound constraints. `explain('executionStats')` so docs examined/returned.

## Góc nhìn Production

Theo dõi index usage/size và plan regression sau data growth; tránh index trùng.

## Trade-offs

Phân tích query shape, selectivity và sort; một index phục vụ nhiều query nhưng tăng write/storage cost. Multikey index với array có giới hạn và compound constraints. `explain('executionStats')` so docs examined/returned.

## Câu trả lời sai thường gặp

MongoDB tự đảo thứ tự field trong index để mọi predicate đều tối ưu như nhau.

## Follow-up

- Multikey index có trade-off gì?

- Covered query cần điều kiện nào?

## Nguồn chính thống

- [MongoDB — MongoDB Indexes](https://www.mongodb.com/docs/manual/indexes/)
- [MongoDB — MongoDB ESR Guideline](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/)
- [MongoDB — MongoDB Explain Results](https://www.mongodb.com/docs/manual/reference/explain-results/)
- [MongoDB — MongoDB Aggregation Pipeline Optimization](https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/)
- [MongoDB — MongoDB Aggregation Pipeline Limits](https://www.mongodb.com/docs/manual/core/aggregation-pipeline-limits/)
