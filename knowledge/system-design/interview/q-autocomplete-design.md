---
id: q-autocomplete-design
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - autocomplete
  - ranking
  - Unicode
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
    - id: ranking
      required: true
      aliases:
        - ranking
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: unicode
      required: false
      aliases:
        - Unicode
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Lưu mọi query người dùng vào Redis sorted set theo prefix rồi trả top score; nhiều RAM hơn sẽ giải cả ranking và privacy.
      penalty: 20
---

# Thiết kế autocomplete đa ngôn ngữ, low-latency mà không rò dữ liệu nhạy cảm như thế nào?

## Rubric

### Must Include

- autocomplete

- ranking

### Strong Answer Includes

- Unicode

## Câu trả lời 30 giây

Tách corpus source khỏi serving index; normalize Unicode/locale có version, tạo prefix candidates, rank theo popularity/recency/personalization và lọc policy. Cache top prefixes nhưng có privacy suppression, freshness SLO và rebuild index versioned.

## Câu trả lời chi tiết

Tôi làm rõ QPS, prefix length, locale, typo tolerance và update/delete SLA. Offline/stream pipeline aggregate authorized terms, chống bot poisoning và build trie/FST/search index; online lấy bounded candidates rồi rank. Hot anonymous prefixes cache được, personalized result cần key/privacy khác. Empty/rare prefixes bị limit để chống enumeration. Reindex side-by-side, checksum/sample, switch alias và rollback; cursor không cần nếu top-k nhỏ.

## Deep Dive

Unicode normalization/case folding/transliteration là product decision, không chỉ lowercase; đổi algorithm làm key/index incompatibility. Popularity feedback loop cần abuse control và diversity.

## Góc nhìn Production

Đo p99, candidate count, cache hit/origin load, freshness, zero-result và unsafe-suggestion rate. Tombstone deletion phải propagate qua stream, index và cache; logs redact raw sensitive queries.

## Trade-offs

Unicode normalization/case folding/transliteration là product decision, không chỉ lowercase; đổi algorithm làm key/index incompatibility. Popularity feedback loop cần abuse control và diversity.

## Câu trả lời sai thường gặp

Lưu mọi query người dùng vào Redis sorted set theo prefix rồi trả top score; nhiều RAM hơn sẽ giải cả ranking và privacy.

## Follow-up

- Trie/FST khác database prefix index thế nào?

- Zero-downtime reindex và delete propagation thiết kế ra sao?

## Nguồn chính thống

- [Unicode Consortium — Unicode Standard Annex #15 — Normalization Forms](https://www.unicode.org/reports/tr15/)
- [PostgreSQL Global Development Group — PostgreSQL Full Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Global Development Group — PostgreSQL pg_trgm](https://www.postgresql.org/docs/current/pgtrgm.html)
- [Redis — Redis Sorted Sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/)
- [Redis — Redis Secondary Indexing](https://redis.io/docs/latest/develop/clients/patterns/indexes/)
