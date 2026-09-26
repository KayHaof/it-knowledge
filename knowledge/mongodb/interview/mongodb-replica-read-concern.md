---
id: mongodb-replica-read-concern
type: interview-question
technology: MongoDB
category: MongoDB
difficulty: senior
topics:
  - replica-set
  - read-concern
  - write-concern
relatedLessons:
  - mongodb-replica-set-consistency-transactions
sources:
  - title: MongoDB Replication
    url: https://www.mongodb.com/docs/manual/replication/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Read Concern
    url: https://www.mongodb.com/docs/manual/reference/read-concern/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Write Concern
    url: https://www.mongodb.com/docs/manual/reference/write-concern/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Causal Consistency
    url: https://www.mongodb.com/docs/manual/core/causal-consistency-read-write-concerns/
    organization: MongoDB
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MongoDB Transactions
    url: https://www.mongodb.com/docs/manual/core/transactions/
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
    - id: replica-set
      required: true
      aliases:
        - replica-set
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: read-concern
      required: true
      aliases:
        - read-concern
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: write-concern
      required: false
      aliases:
        - write-concern
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đọc từ secondary luôn giống primary vì replication đồng bộ tức thời.
      penalty: 20
---

# Read concern và write concern điều chỉnh consistency/latency MongoDB thế nào?

## Rubric

### Must Include

- replica-set

- read-concern

### Strong Answer Includes

- write-concern

## Câu trả lời 30 giây

Write concern quyết định mức xác nhận ghi; read concern quyết định dữ liệu đọc có thể stale/majority đến đâu. Mức mạnh hơn tăng latency và có thể giảm availability khi replica lỗi.

## Câu trả lời chi tiết

Primary read không tự đảm bảo read-after-write qua mọi client nếu route đổi; causal consistency/session có semantics riêng. Majority acknowledgment không là backup thảm họa. Chọn theo invariant, failover và transaction boundary.

## Góc nhìn Production

Theo dõi replication lag, write timeout và stale-read rate; test elections/rollback.

## Trade-offs

Primary read không tự đảm bảo read-after-write qua mọi client nếu route đổi; causal consistency/session có semantics riêng. Majority acknowledgment không là backup thảm họa. Chọn theo invariant, failover và transaction boundary.

## Câu trả lời sai thường gặp

Đọc từ secondary luôn giống primary vì replication đồng bộ tức thời.

## Follow-up

- Retryable write duplicate xử lý thế nào?

- Transaction multi-document có giới hạn gì?

## Nguồn chính thống

- [MongoDB — MongoDB Replication](https://www.mongodb.com/docs/manual/replication/)
- [MongoDB — MongoDB Read Concern](https://www.mongodb.com/docs/manual/reference/read-concern/)
- [MongoDB — MongoDB Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/)
- [MongoDB — MongoDB Causal Consistency](https://www.mongodb.com/docs/manual/core/causal-consistency-read-write-concerns/)
- [MongoDB — MongoDB Transactions](https://www.mongodb.com/docs/manual/core/transactions/)
