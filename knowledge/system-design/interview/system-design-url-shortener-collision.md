---
id: system-design-url-shortener-collision
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - URL-shortener
  - id-generation
  - collision
relatedLessons:
  - system-design-url-shortener
sources:
  - title: AWS Well-Architected Reliability Pillar
    url: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html
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
    - id: url-shortener
      required: true
      aliases:
        - URL-shortener
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: id-generation
      required: true
      aliases:
        - id-generation
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: collision
      required: false
      aliases:
        - collision
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Hash toàn bộ URL một lần là luôn ngắn, unique và không cần database kiểm tra.
      penalty: 20
---

# Thiết kế ID cho URL shortener để tránh collision và hot spot?

## Rubric

### Must Include

- URL-shortener

- id-generation

### Strong Answer Includes

- collision

## Câu trả lời 30 giây

Dùng sequence/snowflake hoặc random ID với unique constraint; encode base62 để ngắn. Cache redirect theo code và rate-limit create, nhưng phải xử lý collision retry và abuse.

## Câu trả lời chi tiết

Random code cần entropy và retry khi conflict; sequence tập trung dễ bottleneck và lộ volume. Distributed ID cần clock/worker uniqueness và không dùng timestamp client mù. Create path ghi durable mapping, redirect path cache/CDN, expiry/deletion và safe URL validation.

## Góc nhìn Production

Theo dõi collision, cache hit, DB p99, hot keys và abuse; backup mapping.

## Trade-offs

Random code cần entropy và retry khi conflict; sequence tập trung dễ bottleneck và lộ volume. Distributed ID cần clock/worker uniqueness và không dùng timestamp client mù. Create path ghi durable mapping, redirect path cache/CDN, expiry/deletion và safe URL validation.

## Câu trả lời sai thường gặp

Hash toàn bộ URL một lần là luôn ngắn, unique và không cần database kiểm tra.

## Follow-up

- Link create idempotency thế nào?

- Redirect cache invalidation ra sao?

## Nguồn chính thống

- [Amazon Web Services — AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
