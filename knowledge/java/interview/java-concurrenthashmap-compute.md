---
id: java-concurrenthashmap-compute
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - ConcurrentHashMap
  - atomicity
  - compute
relatedLessons:
  - java-concurrent-collections-coordination
sources:
  - title: ConcurrentHashMap API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: BlockingQueue API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/BlockingQueue.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: CopyOnWriteArrayList API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/CopyOnWriteArrayList.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: ConcurrentSkipListMap API
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentSkipListMap.html
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
    - id: concurrenthashmap
      required: true
      aliases:
        - ConcurrentHashMap
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: atomicity
      required: true
      aliases:
        - atomicity
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: compute
      required: false
      aliases:
        - compute
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - ConcurrentHashMap biến mọi chuỗi thao tác nhiều key thành một transaction nhất quán.
      penalty: 20
---

# `ConcurrentHashMap.computeIfAbsent` giúp gì và callback cần lưu ý gì?

## Rubric

### Must Include

- ConcurrentHashMap

- atomicity

### Strong Answer Includes

- compute

## Câu trả lời 30 giây

Nó kết hợp kiểm tra và insert atomically cho một key, tránh race kiểu get-then-put. Mapping function nên ngắn, không blocking và không sửa map đệ quy vì có thể gây contention hoặc exception.

## Câu trả lời chi tiết

ConcurrentHashMap cho phép concurrent reads và cập nhật bucket/locking tùy implementation. `computeIfAbsent` không phải transaction nhiều key; callback có thể được gọi lại nếu thất bại và không nên phụ thuộc side effect. Với cache loading, cần timeout, size bound và negative-result policy.

## Góc nhìn Production

Theo dõi lock contention, loader latency và cache cardinality; dùng single-flight nếu downstream đắt.

## Trade-offs

ConcurrentHashMap cho phép concurrent reads và cập nhật bucket/locking tùy implementation. `computeIfAbsent` không phải transaction nhiều key; callback có thể được gọi lại nếu thất bại và không nên phụ thuộc side effect. Với cache loading, cần timeout, size bound và negative-result policy.

## Câu trả lời sai thường gặp

ConcurrentHashMap biến mọi chuỗi thao tác nhiều key thành một transaction nhất quán.

## Follow-up

- Atomic compound operation khác synchronized thế nào?

- Cache stampede khi loader chậm xử lý ra sao?

## Nguồn chính thống

- [Oracle — ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
- [Oracle — BlockingQueue API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/BlockingQueue.html)
- [Oracle — CopyOnWriteArrayList API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/CopyOnWriteArrayList.html)
- [Oracle — ConcurrentSkipListMap API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentSkipListMap.html)
