---
id: postgresql-jsonb-index
type: interview-question
technology: PostgreSQL
category: PostgreSQL
difficulty: middle
topics:
  - JSONB
  - GIN
  - expression-index
relatedLessons:
  - postgresql-index-types-jsonb
sources:
  - title: PostgreSQL Index Types
    url: https://www.postgresql.org/docs/current/indexes-types.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL JSON Types and Indexing
    url: https://www.postgresql.org/docs/current/datatype-json.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL GIN Indexes
    url: https://www.postgresql.org/docs/current/gin.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL BRIN Indexes
    url: https://www.postgresql.org/docs/current/brin.html
    organization: PostgreSQL Global Development Group
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
    - id: jsonb
      required: true
      aliases:
        - JSONB
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: gin
      required: true
      aliases:
        - GIN
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: expression-index
      required: false
      aliases:
        - expression-index
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - JSONB có GIN nên mọi truy vấn nested field nhanh như cột B-tree và không cần schema.
      penalty: 20
---

# Khi nào JSONB GIN index phù hợp hơn normalize column?

## Rubric

### Must Include

- JSONB

- GIN

### Strong Answer Includes

- expression-index

## Câu trả lời 30 giây

GIN hỗ trợ containment/key queries trên JSONB linh hoạt, nhưng index lớn và write/update cost cao. Trường truy vấn ổn định, selective nên cân nhắc generated/expression hoặc cột quan hệ để constraint/type rõ.

## Câu trả lời chi tiết

`jsonb_ops` và `jsonb_path_ops` có coverage/size khác; exact operator và workload quyết định. GIN có pending list/maintenance và update document lớn có thể tốn. JSONB không thay schema: business invariant, foreign key và reporting thường cần columns chuẩn.

## Góc nhìn Production

EXPLAIN operator class, index size/bloat, write latency và vacuum. Benchmark payload skew, không kết luận từ một document nhỏ.

## Trade-offs

`jsonb_ops` và `jsonb_path_ops` có coverage/size khác; exact operator và workload quyết định. GIN có pending list/maintenance và update document lớn có thể tốn. JSONB không thay schema: business invariant, foreign key và reporting thường cần columns chuẩn.

## Câu trả lời sai thường gặp

JSONB có GIN nên mọi truy vấn nested field nhanh như cột B-tree và không cần schema.

## Follow-up

- jsonb_ops khác path_ops khi nào?

- Generated column giúp constraint thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Index Types](https://www.postgresql.org/docs/current/indexes-types.html)
- [PostgreSQL Global Development Group — PostgreSQL JSON Types and Indexing](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL Global Development Group — PostgreSQL GIN Indexes](https://www.postgresql.org/docs/current/gin.html)
- [PostgreSQL Global Development Group — PostgreSQL BRIN Indexes](https://www.postgresql.org/docs/current/brin.html)
