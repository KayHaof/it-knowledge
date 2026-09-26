---
id: performance-reliability
type: roadmap
title: Performance, Capacity và Reliability
description: Từ measurement/JVM/DB tới load model, overload control, SLO, troubleshooting và distributed resilience.
steps:
  - lessonId: performance-diagnosis
    note: Symptom, timeline, hypothesis và verification.
  - lessonId: observability
    note: Logs, metrics, traces và signals có mục tiêu.
  - lessonId: sli-slo-alert-design
    note: SLI/SLO, error budget và actionable alerts.
  - lessonId: java-jvm-gc-profiling
    note: GC/JFR/heap/native evidence.
  - lessonId: java-memory-model-locks-atomics
    note: Visibility, contention và synchronization cost.
  - lessonId: java-concurrent-collections-coordination
    note: Concurrent structures và coordination trade-offs.
  - lessonId: spring-production-actuator-resources
    note: Actuator, HTTP/DB pools và resource diagnosis.
  - lessonId: database-query-plan
    note: Query plan/cardinality before scaling.
  - lessonId: redis-hot-big-key-latency
    note: Hot/big keys và latency investigation.
  - lessonId: kafka-consumer-lag-rebalance-operations
    note: Lag, rebalance và sustainable drain rate.
  - lessonId: load-testing-capacity-model
    note: Representative load, p99 và capacity envelope.
  - lessonId: overload-control-backpressure
    note: Admission, bounded queues, shedding và recovery.
  - lessonId: idempotency-retry-circuit-breaker
    note: Retry budget và ambiguous outcome.
  - lessonId: jvm-container-resources
    note: cgroup memory/CPU, throttling và OOMKilled.
  - lessonId: kubernetes-production-troubleshooting
    note: CrashLoop, probes, DNS/resource evidence.
---

# Performance, Capacity và Reliability

## Tổng quan

Từ measurement/JVM/DB tới load model, overload control, SLO, troubleshooting và distributed resilience.

## Lộ trình

1. **performance-diagnosis** — Symptom, timeline, hypothesis và verification.

2. **observability** — Logs, metrics, traces và signals có mục tiêu.

3. **sli-slo-alert-design** — SLI/SLO, error budget và actionable alerts.

4. **java-jvm-gc-profiling** — GC/JFR/heap/native evidence.

5. **java-memory-model-locks-atomics** — Visibility, contention và synchronization cost.

6. **java-concurrent-collections-coordination** — Concurrent structures và coordination trade-offs.

7. **spring-production-actuator-resources** — Actuator, HTTP/DB pools và resource diagnosis.

8. **database-query-plan** — Query plan/cardinality before scaling.

9. **redis-hot-big-key-latency** — Hot/big keys và latency investigation.

10. **kafka-consumer-lag-rebalance-operations** — Lag, rebalance và sustainable drain rate.

11. **load-testing-capacity-model** — Representative load, p99 và capacity envelope.

12. **overload-control-backpressure** — Admission, bounded queues, shedding và recovery.

13. **idempotency-retry-circuit-breaker** — Retry budget và ambiguous outcome.

14. **jvm-container-resources** — cgroup memory/CPU, throttling và OOMKilled.

15. **kubernetes-production-troubleshooting** — CrashLoop, probes, DNS/resource evidence.
