---
id: q-cap-sharding
type: interview-question
technology: Distributed Systems
category: Distributed Systems
difficulty: system-design
topics:
  - CAP
  - replication
  - sharding
relatedLessons:
  - cap-replication-sharding
sources:
  - title: CAP theorem and distributed systems
    url: https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html
    organization: Amazon Web Services
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
    - id: cap
      required: true
      aliases:
        - CAP
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: replication
      required: true
      aliases:
        - replication
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: sharding
      required: false
      aliases:
        - sharding
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Thêm replica làm write scale tuyến tính, còn sharding tự đảm bảo high availability.
      penalty: 20
---

# Replication và sharding giải quyết hai vấn đề khác nhau thế nào?

## Rubric

### Must Include

- CAP

- replication

### Strong Answer Includes

- sharding

## Câu trả lời 30 giây

Replication tạo nhiều bản sao cho availability/read locality/durability trade-off; sharding chia dataset/write load theo key để tăng capacity. Kết hợp chúng tạo nhiều replicas cho từng shard nhưng không loại consistency hay reshard complexity.

## Câu trả lời chi tiết

Tôi bắt đầu từ bottleneck và failure domain. Replica async có lag/stale/loss window; synchronous tăng latency/availability cost. Shard key quyết định distribution, query locality và hot shard; cross-shard transaction/query khó hơn. CAP chỉ buộc trade-off khi network partition xảy ra, không phải chọn hai chữ trong mọi lúc.

## Deep Dive

Read replica không scale write và sharding không tự tăng reliability nếu mỗi shard là single point. Rebalancing cần headroom và dual-routing/data verification.

## Góc nhìn Production

Theo dõi lag per replica, skew/hot shard, reshard progress và test minority/majority partition behavior.

## Trade-offs

Read replica không scale write và sharding không tự tăng reliability nếu mỗi shard là single point. Rebalancing cần headroom và dual-routing/data verification.

## Câu trả lời sai thường gặp

Thêm replica làm write scale tuyến tính, còn sharding tự đảm bảo high availability.

## Follow-up

- Shard key tốt có thuộc tính nào?

- Read-your-writes trên replica làm sao?

## Nguồn chính thống

- [Amazon Web Services — CAP theorem and distributed systems](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/cap-theorem.html)
