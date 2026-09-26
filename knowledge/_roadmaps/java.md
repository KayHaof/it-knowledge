---
id: java
type: roadmap
title: Java Core, JVM và Concurrency
description: Java từ type/value và object contract đến collections internals, GC/profiling và concurrent execution trong production.
steps:
  - lessonId: java-language-types-values-parameters
    note: Type, value, scope, pass-by-value, boxing và null.
  - lessonId: java-object-contracts
    note: Identity, value, invariant và equality contract.
  - lessonId: java-object-model-immutability-records-sealed
    note: Immutable value, records và sealed hierarchy.
  - lessonId: java-collections-generics
    note: Collection hierarchy và lựa chọn cấu trúc theo contract.
  - lessonId: java-generics-erasure-variance
    note: Bounds, variance, PECS, erasure và heap pollution.
  - lessonId: java-hashmap-internals
    note: Bucket, collision, resize, mutable key và map trade-offs.
  - lessonId: java-string-internals-building
    note: String, Unicode, compact storage và xây chuỗi hiệu quả.
  - lessonId: java-exceptions-resource-safety
    note: Exception taxonomy, try-with-resources và failure contract.
  - lessonId: java-io-nio-files
    note: I/O, NIO.2, atomic publish và resource safety.
  - lessonId: java-streams-optional
    note: Laziness, collector, Optional và side effects.
  - lessonId: java-platform-bytecode-classloading
    note: Bytecode, class identity, loading, linking và initialization.
  - lessonId: java-jvm-memory
    note: Stack, heap, metaspace và object reachability.
  - lessonId: java-jvm-gc-profiling
    note: Collectors, GC evidence, heap và native-memory diagnosis.
  - lessonId: java-performance-jfr-jmh-diagnostics
    note: JFR production evidence và JMH microbenchmark đáng tin.
  - lessonId: java-concurrency
    note: Concurrency foundation và virtual-thread mental model.
  - lessonId: java-memory-model-locks-atomics
    note: Happens-before, safe publication, locks và atomics.
  - lessonId: java-concurrent-collections-coordination
    note: Concurrent maps, queues, coordination và backpressure.
  - lessonId: java-executors-thread-pools
    note: Pool capacity, queue saturation, cancellation và shutdown.
  - lessonId: java-completable-future
    note: Async composition, timeout và executor ownership.
  - lessonId: java-virtual-threads-structured-concurrency
    note: Adoption virtual thread và structured concurrency version-aware.
  - lessonId: high-concurrency
    note: Queue, backpressure và admission ở quy mô hệ thống.
  - lessonId: jvm-container-resources
    note: Memory và CPU budget của JVM trong container.
  - lessonId: performance-diagnosis
    note: Đo rồi mới tối ưu runtime.
---

# Java Core, JVM và Concurrency

## Tổng quan

Java từ type/value và object contract đến collections internals, GC/profiling và concurrent execution trong production.

## Lộ trình

1. **java-language-types-values-parameters** — Type, value, scope, pass-by-value, boxing và null.

2. **java-object-contracts** — Identity, value, invariant và equality contract.

3. **java-object-model-immutability-records-sealed** — Immutable value, records và sealed hierarchy.

4. **java-collections-generics** — Collection hierarchy và lựa chọn cấu trúc theo contract.

5. **java-generics-erasure-variance** — Bounds, variance, PECS, erasure và heap pollution.

6. **java-hashmap-internals** — Bucket, collision, resize, mutable key và map trade-offs.

7. **java-string-internals-building** — String, Unicode, compact storage và xây chuỗi hiệu quả.

8. **java-exceptions-resource-safety** — Exception taxonomy, try-with-resources và failure contract.

9. **java-io-nio-files** — I/O, NIO.2, atomic publish và resource safety.

10. **java-streams-optional** — Laziness, collector, Optional và side effects.

11. **java-platform-bytecode-classloading** — Bytecode, class identity, loading, linking và initialization.

12. **java-jvm-memory** — Stack, heap, metaspace và object reachability.

13. **java-jvm-gc-profiling** — Collectors, GC evidence, heap và native-memory diagnosis.

14. **java-performance-jfr-jmh-diagnostics** — JFR production evidence và JMH microbenchmark đáng tin.

15. **java-concurrency** — Concurrency foundation và virtual-thread mental model.

16. **java-memory-model-locks-atomics** — Happens-before, safe publication, locks và atomics.

17. **java-concurrent-collections-coordination** — Concurrent maps, queues, coordination và backpressure.

18. **java-executors-thread-pools** — Pool capacity, queue saturation, cancellation và shutdown.

19. **java-completable-future** — Async composition, timeout và executor ownership.

20. **java-virtual-threads-structured-concurrency** — Adoption virtual thread và structured concurrency version-aware.

21. **high-concurrency** — Queue, backpressure và admission ở quy mô hệ thống.

22. **jvm-container-resources** — Memory và CPU budget của JVM trong container.

23. **performance-diagnosis** — Đo rồi mới tối ưu runtime.
