---
id: interview-system-design-search-autocomplete
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - autocomplete
  - index
  - ranking
relatedLessons:
  - system-design-search-autocomplete
sources:
  - title: "Unicode Standard Annex #15 — Normalization Forms"
    url: https://www.unicode.org/reports/tr15/
    organization: Unicode Consortium
    type: standard
    accessedAt: 2026-09-02
  - title: PostgreSQL Full Text Search
    url: https://www.postgresql.org/docs/current/textsearch.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL pg_trgm
    url: https://www.postgresql.org/docs/current/pgtrgm.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Sorted Sets
    url: https://redis.io/docs/latest/develop/data-types/sorted-sets/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Secondary Indexing
    url: https://redis.io/docs/latest/develop/clients/patterns/indexes/
    organization: Redis
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
    - id: autocomplete
      required: true
      aliases:
        - autocomplete
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: index
      required: true
      aliases:
        - index
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ranking
      required: false
      aliases:
        - ranking
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Dùng SQL `LIKE '%term%'` trên bảng lớn luôn đủ nhanh cho autocomplete.
      penalty: 20
---

# Thiết kế search autocomplete latency thấp và cập nhật dữ liệu?

## Rubric

### Must Include

- autocomplete

- index

### Strong Answer Includes

- ranking

## Câu trả lời 30 giây

Client debounce, prefix index/trie hoặc search engine, cache hot prefix và giới hạn result. Update async qua event, version index và fallback khi index lag.

## Câu trả lời chi tiết

Normalize Unicode/case, prefix popularity/ranking và tenant authorization; không trả dữ liệu private từ cache key thiếu scope. Read path bounded, timeout/fallback; write path rebuild/shard theo prefix. Measure keystroke-to-result p95/p99.

## Góc nhìn Production

Theo dõi index freshness, cache hit, hot prefix và query abuse; blue-green index swap.

## Trade-offs

Normalize Unicode/case, prefix popularity/ranking và tenant authorization; không trả dữ liệu private từ cache key thiếu scope. Read path bounded, timeout/fallback; write path rebuild/shard theo prefix. Measure keystroke-to-result p95/p99.

## Câu trả lời sai thường gặp

Dùng SQL `LIKE '%term%'` trên bảng lớn luôn đủ nhanh cho autocomplete.

## Follow-up

- Index rebuild zero-downtime thế nào?

- Prefix hot spot xử lý ra sao?

## Nguồn chính thống

- [Unicode Consortium — Unicode Standard Annex #15 — Normalization Forms](https://www.unicode.org/reports/tr15/)
- [PostgreSQL Global Development Group — PostgreSQL Full Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Global Development Group — PostgreSQL pg_trgm](https://www.postgresql.org/docs/current/pgtrgm.html)
- [Redis — Redis Sorted Sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/)
- [Redis — Redis Secondary Indexing](https://redis.io/docs/latest/develop/clients/patterns/indexes/)
