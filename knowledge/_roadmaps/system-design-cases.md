---
id: system-design-cases
type: roadmap
title: System Design Case Practice
description: Chuỗi case có requirements, estimates, data model, bottleneck, failure, security, observability và trade-off.
steps:
  - lessonId: system-design-method
    note: Framework làm rõ đề và kiểm soát assumptions.
  - lessonId: technology-decision-evidence
    note: Không thêm Redis/Kafka/shard nếu chưa có constraint.
  - lessonId: load-testing-capacity-model
    note: Ước lượng và kiểm chứng capacity/queueing.
  - lessonId: system-design-rate-limiter
    note: Atomic quota, fairness và distributed failure.
  - lessonId: system-design-url-shortener
    note: Key generation, storage và read-heavy path.
  - lessonId: system-design-search-autocomplete
    note: Prefix retrieval, ranking, freshness và abuse control.
  - lessonId: system-design-file-storage
    note: Upload/download, metadata/blob, integrity và lifecycle.
  - lessonId: system-design-news-feed
    note: Hybrid fan-out, ranking, cursor và privacy.
  - lessonId: system-design-notification
    note: Multi-channel delivery, preference và idempotency.
  - lessonId: system-design-chat
    note: Realtime connection, ordering và offline sync.
  - lessonId: system-design-payment-ledger
    note: Ledger invariants, idempotency và reconciliation.
  - lessonId: system-design-job-scheduler
    note: Leases, fencing, retries và scheduler recovery.
  - lessonId: cap-replication-sharding
    note: Replication/sharding/multi-region trade-offs.
  - lessonId: overload-control-backpressure
    note: Degraded behavior khi demand vượt capacity.
  - lessonId: otel-context-propagation
    note: Trace và causal correlation qua boundaries.
---

# System Design Case Practice

## Tổng quan

Chuỗi case có requirements, estimates, data model, bottleneck, failure, security, observability và trade-off.

## Lộ trình

1. **system-design-method** — Framework làm rõ đề và kiểm soát assumptions.

2. **technology-decision-evidence** — Không thêm Redis/Kafka/shard nếu chưa có constraint.

3. **load-testing-capacity-model** — Ước lượng và kiểm chứng capacity/queueing.

4. **system-design-rate-limiter** — Atomic quota, fairness và distributed failure.

5. **system-design-url-shortener** — Key generation, storage và read-heavy path.

6. **system-design-search-autocomplete** — Prefix retrieval, ranking, freshness và abuse control.

7. **system-design-file-storage** — Upload/download, metadata/blob, integrity và lifecycle.

8. **system-design-news-feed** — Hybrid fan-out, ranking, cursor và privacy.

9. **system-design-notification** — Multi-channel delivery, preference và idempotency.

10. **system-design-chat** — Realtime connection, ordering và offline sync.

11. **system-design-payment-ledger** — Ledger invariants, idempotency và reconciliation.

12. **system-design-job-scheduler** — Leases, fencing, retries và scheduler recovery.

13. **cap-replication-sharding** — Replication/sharding/multi-region trade-offs.

14. **overload-control-backpressure** — Degraded behavior khi demand vượt capacity.

15. **otel-context-propagation** — Trace và causal correlation qua boundaries.
