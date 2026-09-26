---
id: q-redis-distributed-lock
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - distributed-lock
  - lease
  - fencing
relatedLessons:
  - redis-coordination-rate-limiting
sources:
  - title: Distributed locks with Redis
    url: https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/
    organization: Redis
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
    - id: distributed-lock
      required: true
      aliases:
        - distributed-lock
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
    - id: fencing
      required: false
      aliases:
        - fencing
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis chạy command atomic nên distributed lock tự động an toàn trong mọi network failure.
      penalty: 20
---

# Tại sao có SET NX PX vẫn chưa đủ bảo vệ side effect quan trọng?

## Rubric

### Must Include

- distributed-lock

- lease

### Strong Answer Includes

- fencing

## Câu trả lời 30 giây

Lock là lease. Client có thể pause quá TTL, lease hết và owner mới vào; client cũ tỉnh lại vẫn ghi như stale owner. Cần token ownership khi unlock và thường cần fencing token/resource validation.

## Câu trả lời chi tiết

Acquire dùng unique random value và atomic compare-delete để không xóa lock người khác. TTL tránh lock vĩnh viễn nhưng tạo expiry race. Với correctness cao, downstream resource phải từ chối fencing token cũ; nếu không hỗ trợ, ưu tiên DB constraint, versioned compare-and-set hoặc single-writer design.

## Deep Dive

Clock, pause, network partition và failover đều làm client không biết chắc ownership hiện tại. Availability của lock service không đồng nghĩa linearizable critical section.

## Góc nhìn Production

Đo contention, lease extension/failure, stale attempts; chaos test pause và failover trước khi dùng cho tiền/quota.

## Trade-offs

Clock, pause, network partition và failover đều làm client không biết chắc ownership hiện tại. Availability của lock service không đồng nghĩa linearizable critical section.

## Câu trả lời sai thường gặp

Redis chạy command atomic nên distributed lock tự động an toàn trong mọi network failure.

## Follow-up

- Tại sao unlock phải compare value?

- Fencing token được enforcement ở đâu?

## Nguồn chính thống

- [Redis — Distributed locks with Redis](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
