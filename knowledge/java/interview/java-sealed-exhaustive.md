---
id: java-sealed-exhaustive
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - sealed
  - pattern-matching
  - evolution
relatedLessons:
  - java-object-model-immutability-records-sealed
sources:
  - title: JLS 26 — Classes
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 395 — Records
    url: https://openjdk.org/jeps/395
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 409 — Sealed Classes
    url: https://openjdk.org/jeps/409
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: Record API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html
    organization: Oracle
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
    - id: sealed
      required: true
      aliases:
        - sealed
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: pattern-matching
      required: true
      aliases:
        - pattern-matching
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: evolution
      required: false
      aliases:
        - evolution
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Sealed class nghĩa object không thể mutate và mọi subclass đều private.
      penalty: 20
---

# Sealed class giúp gì cho model domain và switch?

## Rubric

### Must Include

- sealed

- pattern-matching

### Strong Answer Includes

- evolution

## Câu trả lời 30 giây

Sealed type giới hạn tập subtype được phép, làm boundary rõ và giúp compiler kiểm tra exhaustiveness trong pattern matching/switch phù hợp version. Nó không tự enforce business authorization hay ngăn reflection mọi cách.

## Câu trả lời chi tiết

Khi subtype nằm cùng module/package theo rule, code consumer biết closed set như Success, RetryableFailure, FatalFailure. Switch exhaustive giảm default branch nuốt case mới. Khi thêm subtype, downstream source phải xử lý lại; đó là compile-time signal nhưng binary/runtime rollout vẫn cần compatibility plan.

## Góc nhìn Production

Dùng sealed hierarchy cho state/error taxonomy nhỏ, log unknown state và version contract khi serialize. Không dùng cho plugin ecosystem cần extension tự do.

## Trade-offs

Khi subtype nằm cùng module/package theo rule, code consumer biết closed set như Success, RetryableFailure, FatalFailure. Switch exhaustive giảm default branch nuốt case mới. Khi thêm subtype, downstream source phải xử lý lại; đó là compile-time signal nhưng binary/runtime rollout vẫn cần compatibility plan.

## Câu trả lời sai thường gặp

Sealed class nghĩa object không thể mutate và mọi subclass đều private.

## Follow-up

- Sealed interface khác enum ở điểm nào?

- Thêm subtype ảnh hưởng consumer deployment ra sao?

## Nguồn chính thống

- [Oracle — JLS 26 — Classes](https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html)
- [OpenJDK — JEP 395 — Records](https://openjdk.org/jeps/395)
- [OpenJDK — JEP 409 — Sealed Classes](https://openjdk.org/jeps/409)
- [Oracle — Record API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html)
