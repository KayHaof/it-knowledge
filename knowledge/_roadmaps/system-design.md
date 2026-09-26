---
id: system-design
type: roadmap
title: "System Design: Fundamentals đến Case Study"
description: Capacity, data, cache, messaging, consistency, reliability và case end-to-end.
steps:
  - lessonId: system-design-method
    note: Clarify, estimate, API/data flow.
  - lessonId: performance-diagnosis
    note: Latency và measurement.
  - lessonId: high-concurrency
    note: Queueing, pool và load shedding.
  - lessonId: scaling-load-balancing-reverse-proxy
    note: Scale path, reverse proxy và load-balancing algorithms.
  - lessonId: distributed-load-balancing-service-discovery
    note: Service discovery, health và client/server-side balancing.
  - lessonId: technology-decision-evidence
    note: Capability bằng constraint và evidence.
  - lessonId: api-gateway-bff-service-mesh
    note: Gateway, BFF và service mesh theo ownership.
  - lessonId: api-contracts-rest-grpc-events
    note: REST, gRPC và events theo coupling/consistency.
  - lessonId: contract-testing-schema-evolution
    note: Compatibility, contract tests và schema rollout.
  - lessonId: relational-database
    note: Invariant/consistency foundation.
  - lessonId: cap-replication-sharding
    note: Replication, shard key và CAP.
  - lessonId: distributed-time-clocks-ordering
    note: Wall clock, logical clock và causal ordering.
  - lessonId: distributed-consensus-leader-election
    note: Quorum, term, leader election và fencing.
  - lessonId: redis-cache-aside
    note: Cache correctness.
  - lessonId: redis-coordination-rate-limiting
    note: Coordination, lease và quotas.
  - lessonId: system-design-rate-limiter
    note: Limiter, fairness và failure policy.
  - lessonId: kafka-delivery
    note: Streaming semantics.
  - lessonId: idempotency-retry-circuit-breaker
    note: Unknown outcome và resilience.
  - lessonId: saga-distributed-transactions
    note: Workflow và compensation.
  - lessonId: transactional-outbox
    note: Dual-write và CDC/polling.
  - lessonId: microservices-boundaries
    note: Service/data/team ownership.
  - lessonId: multi-region-disaster-recovery
    note: RPO/RTO, failover, data topology và recovery drills.
  - lessonId: observability
    note: SLI/SLO và signals.
  - lessonId: otel-context-propagation
    note: Causal path qua boundaries.
  - lessonId: system-design-url-shortener
    note: Read-heavy case.
  - lessonId: system-design-chat
    note: Realtime ordering/fan-out case.
---

# System Design: Fundamentals đến Case Study

## Tổng quan

Capacity, data, cache, messaging, consistency, reliability và case end-to-end.

## Lộ trình

1. **system-design-method** — Clarify, estimate, API/data flow.

2. **performance-diagnosis** — Latency và measurement.

3. **high-concurrency** — Queueing, pool và load shedding.

4. **scaling-load-balancing-reverse-proxy** — Scale path, reverse proxy và load-balancing algorithms.

5. **distributed-load-balancing-service-discovery** — Service discovery, health và client/server-side balancing.

6. **technology-decision-evidence** — Capability bằng constraint và evidence.

7. **api-gateway-bff-service-mesh** — Gateway, BFF và service mesh theo ownership.

8. **api-contracts-rest-grpc-events** — REST, gRPC và events theo coupling/consistency.

9. **contract-testing-schema-evolution** — Compatibility, contract tests và schema rollout.

10. **relational-database** — Invariant/consistency foundation.

11. **cap-replication-sharding** — Replication, shard key và CAP.

12. **distributed-time-clocks-ordering** — Wall clock, logical clock và causal ordering.

13. **distributed-consensus-leader-election** — Quorum, term, leader election và fencing.

14. **redis-cache-aside** — Cache correctness.

15. **redis-coordination-rate-limiting** — Coordination, lease và quotas.

16. **system-design-rate-limiter** — Limiter, fairness và failure policy.

17. **kafka-delivery** — Streaming semantics.

18. **idempotency-retry-circuit-breaker** — Unknown outcome và resilience.

19. **saga-distributed-transactions** — Workflow và compensation.

20. **transactional-outbox** — Dual-write và CDC/polling.

21. **microservices-boundaries** — Service/data/team ownership.

22. **multi-region-disaster-recovery** — RPO/RTO, failover, data topology và recovery drills.

23. **observability** — SLI/SLO và signals.

24. **otel-context-propagation** — Causal path qua boundaries.

25. **system-design-url-shortener** — Read-heavy case.

26. **system-design-chat** — Realtime ordering/fan-out case.
