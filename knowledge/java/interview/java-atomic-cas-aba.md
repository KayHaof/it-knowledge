---
id: java-atomic-cas-aba
type: interview-question
technology: Java
category: Java
difficulty: senior
topics:
  - CAS
  - ABA
  - atomics
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
    - id: cas
      required: true
      aliases:
        - CAS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: aba
      required: true
      aliases:
        - ABA
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: atomics
      required: false
      aliases:
        - atomics
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - CAS so sánh mọi lịch sử của biến nên ABA không thể xảy ra.
      penalty: 20
---

# ABA problem trong CAS là gì và khi nào cần versioned reference?

## Rubric

### Must Include

- CAS

- ABA

### Strong Answer Includes

- atomics

## Câu trả lời 30 giây

CAS chỉ thấy giá trị hiện tại giống A, không biết nó đã đổi A→B→A. Với cấu trúc lock-free, thay đổi trung gian có thể mất; dùng AtomicStampedReference/version counter hoặc invariant khác để phát hiện.

## Câu trả lời chi tiết

Thread đọc pointer A, bị pause, thread khác thay A bằng B rồi lại A. CAS của thread đầu thành công dù state đã qua transition. Version stamp tăng mỗi update biến cặp (reference,version) thành identity; nhưng wraparound và memory reclamation vẫn phải xét. Atomic primitive không tự làm algorithm lock-free đúng nếu multi-field invariant chưa được chứng minh.

## Góc nhìn Production

Load test contention, retry count và starvation; dùng library/concurrency proof trước khi tự viết lock-free structure. Fallback lock đơn giản thường an toàn hơn cho business path.

## Trade-offs

Thread đọc pointer A, bị pause, thread khác thay A bằng B rồi lại A. CAS của thread đầu thành công dù state đã qua transition. Version stamp tăng mỗi update biến cặp (reference,version) thành identity; nhưng wraparound và memory reclamation vẫn phải xét. Atomic primitive không tự làm algorithm lock-free đúng nếu multi-field invariant chưa được chứng minh.

## Câu trả lời sai thường gặp

CAS so sánh mọi lịch sử của biến nên ABA không thể xảy ra.

## Follow-up

- Atomic update function có thể chạy lại side effect không?

- Khi nào lock tốt hơn lock-free?

## Nguồn chính thống

- [Oracle — Java Language Specification — Threads and Locks](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html)
- [Oracle — java.util.concurrent Package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/package-summary.html)
- [Oracle — ReentrantLock API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle — VarHandle API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/invoke/VarHandle.html)
