---
id: q-distributed-scheduler-design
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - scheduler
  - lease
  - idempotency
relatedLessons:
  - system-design-job-scheduler
sources:
  - title: Kubernetes CronJob
    url: https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Kubernetes Job
    url: https://kubernetes.io/docs/concepts/workloads/controllers/job/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL SELECT locking clause
    url: https://www.postgresql.org/docs/current/sql-select.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Explicit Locking
    url: https://www.postgresql.org/docs/current/explicit-locking.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Design
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Software Foundation
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
    - id: scheduler
      required: true
      aliases:
        - scheduler
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: lease
      required: true
      aliases:
        - lease
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: idempotency
      required: false
      aliases:
        - idempotency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bầu một leader bằng Redis TTL là đủ đảm bảo mỗi cron chạy đúng một lần; worker cũ chắc chắn dừng khi TTL hết.
      penalty: 20
---

# Bạn thiết kế distributed job scheduler để không bỏ job và không overclaim exactly-once thế nào?

## Rubric

### Must Include

- scheduler

- lease

### Strong Answer Includes

- idempotency

## Câu trả lời 30 giây

Giữ schedule/job state durable; nhiều schedulers claim due jobs bằng atomic transition hoặc lease kèm fencing. Delivery/execution là at-least-once, nên handler idempotent, retry bounded và có reconciliation cho stuck/expired jobs.

## Câu trả lời chi tiết

Model one-off/cron timezone, misfire/catch-up và cancellation semantics trước. Partition timing horizon, scan/index dueAt, claim batch với owner/token/expiry rồi enqueue execution. Scheduler và workers có heartbeats nhưng stale worker bị fence tại result store. Completion ghi attempt/result/checkpoint atomically phù hợp; recurring run có deterministic run ID để dedupe. Backlog dùng oldest-due age, admission/throttle và DLQ/manual repair, không tạo vô hạn retries.

## Deep Dive

Clock chỉ giúp tìm candidate due; correctness không dựa vào các nodes có wall clock hoàn hảo. Lease expiry không dừng old worker, nên fencing/conditional completion và idempotent side effect là bắt buộc cho critical job.

## Góc nhìn Production

Monitor schedule-to-start, run duration, lease expiry/steal, duplicate prevented, retry/DLQ và shard skew. Test leader pause, clock jump, broker/DB outage, deploy drain và replay; manual rerun có audit.

## Trade-offs

Clock chỉ giúp tìm candidate due; correctness không dựa vào các nodes có wall clock hoàn hảo. Lease expiry không dừng old worker, nên fencing/conditional completion và idempotent side effect là bắt buộc cho critical job.

## Câu trả lời sai thường gặp

Bầu một leader bằng Redis TTL là đủ đảm bảo mỗi cron chạy đúng một lần; worker cũ chắc chắn dừng khi TTL hết.

## Follow-up

- Misfire policy cho recurring job gồm lựa chọn nào?

- Lease và fencing bảo vệ những failure khác nhau ra sao?

## Nguồn chính thống

- [Kubernetes — Kubernetes CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
- [Kubernetes — Kubernetes Job](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
- [PostgreSQL Global Development Group — PostgreSQL SELECT locking clause](https://www.postgresql.org/docs/current/sql-select.html)
- [PostgreSQL Global Development Group — PostgreSQL Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Apache Software Foundation — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
