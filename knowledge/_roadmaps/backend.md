---
id: backend
type: roadmap
title: "Backend Developer: Java đến hệ thống production"
description: Learning tree chính từ Java language/runtime, Spring/JPA và dữ liệu đến messaging, distributed systems, vận hành và System Design.
steps:
  - lessonId: java-object-contracts
    note: Identity, immutability, equals/hashCode và exception boundary.
  - lessonId: java-collections-generics
    note: Collection/generic theo complexity, contract và concurrency.
  - lessonId: java-streams-optional
    note: Functional pipeline không che side effect hoặc allocation.
  - lessonId: java-jvm-memory
    note: Bytecode, runtime data areas và object reachability.
  - lessonId: java-jvm-gc-profiling
    note: Đọc GC, heap/native memory và profile trước tuning.
  - lessonId: java-concurrency
    note: Happens-before, synchronization và virtual threads.
  - lessonId: java-completable-future
    note: Async composition, executor và cancellation.
  - lessonId: spring-ioc-bean-lifecycle
    note: IoC, DI, scope và bean lifecycle.
  - lessonId: spring-aop-transactions
    note: Proxy, advice, self-invocation và transaction boundary.
  - lessonId: spring-rest-validation-errors
    note: REST contract, validation và error taxonomy.
  - lessonId: spring-mvc-webflux
    note: Execution model theo toàn call chain.
  - lessonId: spring-jpa-persistence-context
    note: Entity state, dirty checking, flush và commit.
  - lessonId: relational-database
    note: Invariant ở schema, constraint và transaction.
  - lessonId: sql-logical-processing-joins
    note: Row set, join, NULL và aggregation.
  - lessonId: transactions-mvcc-deadlocks
    note: Isolation, MVCC, locks và deadlock recovery.
  - lessonId: spring-jpa-fetching-batching-locking
    note: Fetch, batching, pagination và locking.
  - lessonId: jpa-n-plus-one
    note: Phát hiện N+1 bằng SQL/query count.
  - lessonId: composite-covering-index-explain
    note: Composite/covering index bằng access pattern.
  - lessonId: database-query-plan
    note: Estimate/actual, buffers và optimizer evidence.
  - lessonId: spring-postgresql-production-boundary
    note: Request, connection, timeout, migration và DB capacity.
  - lessonId: redis-data-structures-expiration
    note: Redis structure, TTL và eviction semantics.
  - lessonId: redis-cache-aside
    note: Cache consistency, stampede và degraded path.
  - lessonId: kafka-broker-storage-replication
    note: Append log, broker storage và replication.
  - lessonId: kafka-delivery
    note: Partition, consumer group, offset và delivery.
  - lessonId: kafka-transactions-outbox
    note: Kafka transaction và DB outbox boundary.
  - lessonId: idempotency-retry-circuit-breaker
    note: Retry budget, idempotency và resilience.
  - lessonId: transactional-outbox
    note: Dual-write bằng local atomicity và reconciliation.
  - lessonId: spring-security-oauth2-jwt
    note: Resource Server và token validation.
  - lessonId: docker-production
    note: Immutable runtime và health contract.
  - lessonId: jvm-container-resources
    note: Heap/native/CPU với cgroup và OOMKilled.
  - lessonId: kubernetes-safe-rollouts
    note: Rollout, probes và graceful termination.
  - lessonId: otel-context-propagation
    note: Trace qua HTTP, executor và Kafka.
  - lessonId: performance-diagnosis
    note: Từ symptom tới measurement và verification.
  - lessonId: modular-monolith-hexagonal-ddd
    note: Củng cố boundary trước khi phân tán.
  - lessonId: microservices-boundaries
    note: Tách service khi ownership tạo giá trị.
  - lessonId: system-design-method
    note: Requirement, estimate, trade-off và failure model.
---

# Backend Developer: Java đến hệ thống production

## Tổng quan

Learning tree chính từ Java language/runtime, Spring/JPA và dữ liệu đến messaging, distributed systems, vận hành và System Design.

## Lộ trình

1. **java-object-contracts** — Identity, immutability, equals/hashCode và exception boundary.

2. **java-collections-generics** — Collection/generic theo complexity, contract và concurrency.

3. **java-streams-optional** — Functional pipeline không che side effect hoặc allocation.

4. **java-jvm-memory** — Bytecode, runtime data areas và object reachability.

5. **java-jvm-gc-profiling** — Đọc GC, heap/native memory và profile trước tuning.

6. **java-concurrency** — Happens-before, synchronization và virtual threads.

7. **java-completable-future** — Async composition, executor và cancellation.

8. **spring-ioc-bean-lifecycle** — IoC, DI, scope và bean lifecycle.

9. **spring-aop-transactions** — Proxy, advice, self-invocation và transaction boundary.

10. **spring-rest-validation-errors** — REST contract, validation và error taxonomy.

11. **spring-mvc-webflux** — Execution model theo toàn call chain.

12. **spring-jpa-persistence-context** — Entity state, dirty checking, flush và commit.

13. **relational-database** — Invariant ở schema, constraint và transaction.

14. **sql-logical-processing-joins** — Row set, join, NULL và aggregation.

15. **transactions-mvcc-deadlocks** — Isolation, MVCC, locks và deadlock recovery.

16. **spring-jpa-fetching-batching-locking** — Fetch, batching, pagination và locking.

17. **jpa-n-plus-one** — Phát hiện N+1 bằng SQL/query count.

18. **composite-covering-index-explain** — Composite/covering index bằng access pattern.

19. **database-query-plan** — Estimate/actual, buffers và optimizer evidence.

20. **spring-postgresql-production-boundary** — Request, connection, timeout, migration và DB capacity.

21. **redis-data-structures-expiration** — Redis structure, TTL và eviction semantics.

22. **redis-cache-aside** — Cache consistency, stampede và degraded path.

23. **kafka-broker-storage-replication** — Append log, broker storage và replication.

24. **kafka-delivery** — Partition, consumer group, offset và delivery.

25. **kafka-transactions-outbox** — Kafka transaction và DB outbox boundary.

26. **idempotency-retry-circuit-breaker** — Retry budget, idempotency và resilience.

27. **transactional-outbox** — Dual-write bằng local atomicity và reconciliation.

28. **spring-security-oauth2-jwt** — Resource Server và token validation.

29. **docker-production** — Immutable runtime và health contract.

30. **jvm-container-resources** — Heap/native/CPU với cgroup và OOMKilled.

31. **kubernetes-safe-rollouts** — Rollout, probes và graceful termination.

32. **otel-context-propagation** — Trace qua HTTP, executor và Kafka.

33. **performance-diagnosis** — Từ symptom tới measurement và verification.

34. **modular-monolith-hexagonal-ddd** — Củng cố boundary trước khi phân tán.

35. **microservices-boundaries** — Tách service khi ownership tạo giá trị.

36. **system-design-method** — Requirement, estimate, trade-off và failure model.
