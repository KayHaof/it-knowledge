---
id: q-mongodb-consistency-transaction
type: interview-question
technology: MongoDB
category: MongoDB
difficulty: senior
topics:
  - read-concern
  - write-concern
  - transactions
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
    - id: read-concern
      required: true
      aliases:
        - read-concern
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: write-concern
      required: true
      aliases:
        - write-concern
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
        - Mọi MongoDB read từ primary là linearizable; bật transaction làm toàn hệ thống exactly-once và không còn eventual consistency.
      penalty: 20
---

# MongoDB replica set có strong consistency và transaction giống relational database mặc định không?

## Rubric

### Must Include

- read-concern

- write-concern

### Strong Answer Includes

- transactions

## Câu trả lời 30 giây

Không thể trả lời chỉ bằng tên sản phẩm. Read preference chọn node, read concern chọn visibility/isolation, write concern chọn acknowledgement/durability. Majority không luôn là latest; transaction guarantees còn phụ thuộc read/write concern và topology.

## Câu trả lời chi tiết

Primary nhận writes, secondaries apply oplog async. Secondary/nearest read có thể stale. local có thể thấy data rollback; majority đọc majority-committed view nhưng không đồng nghĩa linearizable/latest; linearizable có restrictions. Causal session với supported majority concerns bảo vệ causal flow. Multi-document transaction atomic trong boundary; snapshot read + majority commit cho guarantee được tài liệu mô tả, không nên gọi serializable. Transaction reads dùng primary preference và cross-shard có coordination cost.

## Deep Dive

Write concern timeout hoặc unknown commit không chứng minh write thất bại; retry cần operation ID và driver error-label rules. Callback transaction có thể chạy lại, nên không charge/email bên trong.

## Góc nhìn Production

Pin server/driver defaults, monitor election/rollback, replication/majority lag, oplog window và transaction abort/retry. Test stepdown/partition; idempotency, backup restore và reconciliation vẫn cần.

## Trade-offs

Write concern timeout hoặc unknown commit không chứng minh write thất bại; retry cần operation ID và driver error-label rules. Callback transaction có thể chạy lại, nên không charge/email bên trong.

## Câu trả lời sai thường gặp

Mọi MongoDB read từ primary là linearizable; bật transaction làm toàn hệ thống exactly-once và không còn eventual consistency.

## Follow-up

- Read preference khác read concern thế nào?

- Vì sao transaction callback không nên gọi external API?

## Nguồn chính thống

- [MongoDB — MongoDB Replication](https://www.mongodb.com/docs/manual/replication/)
- [MongoDB — MongoDB Read Concern](https://www.mongodb.com/docs/manual/reference/read-concern/)
- [MongoDB — MongoDB Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/)
- [MongoDB — MongoDB Causal Consistency](https://www.mongodb.com/docs/manual/core/causal-consistency-read-write-concerns/)
- [MongoDB — MongoDB Transactions](https://www.mongodb.com/docs/manual/core/transactions/)
