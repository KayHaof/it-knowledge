---
id: interview-system-design-job-scheduler
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - job-scheduler
  - leases
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
    - id: job-scheduler
      required: true
      aliases:
        - job-scheduler
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: leases
      required: true
      aliases:
        - leases
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
        - Distributed lock đảm bảo job chỉ chạy một lần dù worker pause vô thời hạn.
      penalty: 20
---

# Thiết kế distributed job scheduler có retry và failover?

## Rubric

### Must Include

- job-scheduler

- leases

### Strong Answer Includes

- idempotency

## Câu trả lời 30 giây

Lưu job state/next_run durable, worker claim bằng lease/fencing và heartbeat. Retry exponential+jitter, idempotent handler và DLQ/manual retry cho poison job.

## Câu trả lời chi tiết

Scheduler scan/index hoặc time wheel tạo due work, queue phân phối; lease expiry không chứng minh worker cũ đã dừng nên fencing token bảo vệ commit. At-least-once execution là mặc định; exactly-once business cần idempotency. Misfire policy và timezone phải rõ.

## Góc nhìn Production

Theo dõi due lag, lease age, attempt, dead jobs và clock skew.

## Trade-offs

Scheduler scan/index hoặc time wheel tạo due work, queue phân phối; lease expiry không chứng minh worker cũ đã dừng nên fencing token bảo vệ commit. At-least-once execution là mặc định; exactly-once business cần idempotency. Misfire policy và timezone phải rõ.

## Câu trả lời sai thường gặp

Distributed lock đảm bảo job chỉ chạy một lần dù worker pause vô thời hạn.

## Follow-up

- Fencing token đặt ở đâu?

- Cron timezone/DST xử lý sao?

## Nguồn chính thống

- [Kubernetes — Kubernetes CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
- [Kubernetes — Kubernetes Job](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
- [PostgreSQL Global Development Group — PostgreSQL SELECT locking clause](https://www.postgresql.org/docs/current/sql-select.html)
- [PostgreSQL Global Development Group — PostgreSQL Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Apache Software Foundation — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
