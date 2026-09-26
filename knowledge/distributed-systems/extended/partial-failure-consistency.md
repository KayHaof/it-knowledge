---
id: distributed-failures
slug: partial-failure-consistency
title: Distributed Systems — Partial Failure và Consistency
description: Network không đáng tin, timeout không cho biết kết quả, idempotency, CAP/PACELC và reconciliation.
technology: Distributed Systems
domain: distributed-systems
category: distributed-systems
level: extended
contentType: troubleshooting
order: 160
estimatedMinutes: 38
tags:
  - distributed-systems
  - partial-failure
  - idempotency
  - cap
  - consistency
prerequisites:
  - microservices-boundaries
related:
  - transactional-outbox
  - kafka-delivery
learningObjectives:
  - Mô hình hóa trạng thái unknown sau timeout
  - Thiết kế idempotency key
  - Nói đúng phạm vi CAP
sources:
  - title: AWS Builders Library - timeouts, retries and backoff
    url: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
    organization: Amazon Web Services
    type: vendor-documentation
    accessedAt: 2026-09-02
lastReviewed: 2026-09-02
---

# Distributed Systems — Partial Failure và Consistency

## Tổng quan

Network không đáng tin, timeout không cho biết kết quả, idempotency, CAP/PACELC và reconciliation.

## Partial failure
Trong một process, function trả về hoặc throw thường cho trạng thái rõ hơn. Qua network, caller timeout trong khi server có thể chưa nhận, đang xử lý hoặc đã commit nhưng response mất. Kết quả là unknown, không đơn giản là failed.

## Timeout, retry, idempotency
Mọi remote call cần timeout theo latency budget. Retry thêm tải đúng lúc hệ thống đang yếu, nên cần giới hạn attempt, exponential backoff, jitter và retry budget. Operation tạo side effect cần idempotency key lưu cùng kết quả để retry không nhân đôi.

```mermaid
stateDiagram-v2
  [*] --> Requested
  Requested --> Committed: server commits
  Requested --> Unknown: caller timeout
  Unknown --> Committed: query by idempotency key
  Unknown --> Requested: bounded retry
```

## CAP và PACELC
Khi network partition xảy ra, hệ thống phải trade availability với strong consistency cho operation liên quan. CAP không nói database luôn chỉ có hai trong ba ở mọi thời điểm. PACELC nhắc thêm trade latency/consistency ngay cả khi không partition.

:::warning Clock và order
Timestamp từ nhiều machine không tạo total order đáng tin tuyệt đối. Dùng sequence/version theo aggregate, logical clock hoặc consensus service khi requirement thật sự cần order mạnh.
:::

## Reconciliation
Eventual consistency không có nghĩa “chờ rồi tự đúng”. Cần invariant monitor, retry queue, dead-letter/quarantine, audit trail và job reconciliation so sánh desired với observed state rồi sửa sai lệch.

## Trả lời phỏng vấn
Tôi bắt đầu từ failure model: timeout tạo trạng thái unknown, retry có thể duplicate. Tôi đặt deadline, bounded retry với jitter, idempotency key và reconciliation. Consistency level là quyết định theo invariant nghiệp vụ, không theo khẩu hiệu CAP.

## Key Takeaways
- Timeout không chứng minh server chưa commit.
- Retry phải có budget và idempotency.
- Eventual consistency cần repair loop.
- Chọn consistency theo invariant và hậu quả sai lệch.

:::flashcard
id: distributed-failures-learning-objective
front: Bài “Distributed Systems — Partial Failure và Consistency” đặt ra mục tiêu cốt lõi nào?
back: Mô hình hóa trạng thái unknown sau timeout
level: extended
tags: ["distributed-systems","partial-failure","idempotency","cap","consistency"]
:::

## Nguồn chính thống

- [Amazon Web Services — AWS Builders Library - timeouts, retries and backoff](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
