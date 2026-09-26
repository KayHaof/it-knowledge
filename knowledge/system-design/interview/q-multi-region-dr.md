---
id: q-multi-region-dr
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - multi-region
  - RTO
  - RPO
relatedLessons:
  - multi-region-disaster-recovery
sources:
  - title: Disaster Recovery (DR) objectives
    url: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Disaster recovery options in the cloud
    url: https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
  - title: Configuring DNS failover
    url: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html
    organization: Amazon Web Services
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Log-Shipping Standby Servers
    url: https://www.postgresql.org/docs/current/warm-standby.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Geo-Replication (Cross-Cluster Data Mirroring)
    url: https://kafka.apache.org/43/operations/geo-replication-cross-cluster-data-mirroring/
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
    - id: multi-region
      required: true
      aliases:
        - multi-region
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: rto
      required: true
      aliases:
        - RTO
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: rpo
      required: false
      aliases:
        - RPO
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Triển khai hai regions sau global DNS là active-active; replication và autoscaling tự đảm bảo zero RPO/RTO.
      penalty: 20
---

# Bạn thiết kế multi-region DR và chứng minh RTO/RPO thay vì chỉ vẽ active-active thế nào?

## Rubric

### Must Include

- multi-region

- RTO

### Strong Answer Includes

- RPO

## Câu trả lời 30 giây

Chuyển business impact thành RTO/RPO theo capability, rồi chọn backup-restore, pilot-light, warm standby hay active-active. Thiết kế data ownership/replication, quorum/fencing, traffic failover và failback; đo bằng restore drill/game day.

## Câu trả lời chi tiết

Tôi inventory stateful dependencies, external DNS/identity/secrets và data sovereignty. Async replication có nonzero RPO; sync cross-region tăng latency/availability coupling. Active-passive cần promotion, old-primary fencing, DNS/connection drain và capacity warm-up. Active-active chỉ hợp khi write ownership/conflict semantics rõ, không phải hai writable replicas tự động. Kafka offsets/topic configs, database logs và object stores có recovery mechanisms riêng; backup vẫn cần vì corruption/delete cũng replicate.

## Deep Dive

RTO tính từ detection/decision tới user service restored, gồm cache warm, credential, DNS/client connection và reconciliation; không chỉ thời gian promote DB. Failback thường rủi ro hơn failover vì histories/capacity đã lệch.

## Góc nhìn Production

Runbook có authority, stop conditions và communication; synthetic probes từ region thật. Game day đo data loss, stale/duplicate outcomes và recovery load; restore backup định kỳ, audit evidence và sửa capacity gaps.

## Trade-offs

RTO tính từ detection/decision tới user service restored, gồm cache warm, credential, DNS/client connection và reconciliation; không chỉ thời gian promote DB. Failback thường rủi ro hơn failover vì histories/capacity đã lệch.

## Câu trả lời sai thường gặp

Triển khai hai regions sau global DNS là active-active; replication và autoscaling tự đảm bảo zero RPO/RTO.

## Follow-up

- Khi nào synchronous replication làm availability xấu hơn?

- Failback cần những bước reconciliation nào?

## Nguồn chính thống

- [Amazon Web Services — Disaster Recovery (DR) objectives](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html)
- [Amazon Web Services — Disaster recovery options in the cloud](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html)
- [Amazon Web Services — Configuring DNS failover](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html)
- [PostgreSQL Global Development Group — Log-Shipping Standby Servers](https://www.postgresql.org/docs/current/warm-standby.html)
- [Apache Software Foundation — Geo-Replication (Cross-Cluster Data Mirroring)](https://kafka.apache.org/43/operations/geo-replication-cross-cluster-data-mirroring/)
