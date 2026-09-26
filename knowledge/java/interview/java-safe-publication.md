---
id: java-safe-publication
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - happens-before
  - safe-publication
  - immutability
relatedLessons:
  - java-memory-model-locks-atomics
sources:
  - title: Java Language Specification — Threads and Locks
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: java.util.concurrent Package
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: ReentrantLock API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: VarHandle API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html
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
    - id: happens-before
      required: true
      aliases:
        - happens-before
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: safe-publication
      required: true
      aliases:
        - safe-publication
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: immutability
      required: false
      aliases:
        - immutability
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Nếu object được tạo trong heap thì mọi thread tự thấy đầy đủ field sau một thời gian.
      penalty: 20
---

# Những cách nào safe-publish một object immutable cho nhiều thread?

## Rubric

### Must Include

- happens-before

- safe-publication

### Strong Answer Includes

- immutability

## Câu trả lời 30 giây

Publish qua static initialization, volatile field, synchronized/lock, concurrent collection hoặc final-field construction đúng cách. Object phải hoàn tất invariant trước khi reference lộ; chỉ đánh dấu reference volatile không sửa mutation bên trong.

## Câu trả lời chi tiết

Happens-before bảo đảm reader thấy writes trước publication. Final fields có guarantees đặc biệt sau constructor nhưng constructor không được leak `this`; mutable referenced graph vẫn cần publish/immutability. Double-checked locking cần volatile reference. ConcurrentHashMap put/get tạo boundary visibility cho value được publish.

## Góc nhìn Production

Review lazy singleton, cache refresh và config reload bằng memory-model reasoning; stress test không thay proof. Dùng immutable snapshot swap để cập nhật config atomically.

## Trade-offs

Happens-before bảo đảm reader thấy writes trước publication. Final fields có guarantees đặc biệt sau constructor nhưng constructor không được leak `this`; mutable referenced graph vẫn cần publish/immutability. Double-checked locking cần volatile reference. ConcurrentHashMap put/get tạo boundary visibility cho value được publish.

## Câu trả lời sai thường gặp

Nếu object được tạo trong heap thì mọi thread tự thấy đầy đủ field sau một thời gian.

## Follow-up

- Vì sao constructor không được publish this?

- Immutable snapshot giúp config reload thế nào?

## Nguồn chính thống

- [Oracle — Java Language Specification — Threads and Locks](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html)
- [Oracle — java.util.concurrent Package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html)
- [Oracle — ReentrantLock API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle — VarHandle API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html)
