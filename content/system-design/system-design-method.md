---
id: system-design-method
slug: system-design-framework
title: Framework giải System Design Interview
description: Clarify requirement, estimate bằng giả định, thiết kế API/data/high-level flow rồi deep dive theo bottleneck.
category: system-design
technology: System Design
level: intermediate
estimatedMinutes: 32
tags: ["system-design","requirements","qps","capacity","trade-offs"]
prerequisites: ["distributed-failures"]
related: ["system-design-url-shortener","system-design-chat"]
next: system-design-url-shortener
learningObjectives: ["Dẫn dắt buổi thiết kế có cấu trúc","Ước lượng không fake precision","Chọn deep dive theo risk"]
lastReviewed: 2026-09-02
sources: [{"title":"AWS Well-Architected Framework","url":"https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html","organization":"Amazon Web Services","type":"primary-vendor","accessedAt":"2026-09-02"}]
---
## Bắt đầu bằng câu hỏi
Không vẽ cache, queue hay microservice trước khi rõ người dùng và SLO. Xác nhận feature chính, consistency, availability, latency, privacy, region, retention và phần ngoài scope. Chốt 2–3 critical user flow để dẫn thiết kế.

## Capacity estimate có giả định
Giả sử 10 triệu DAU, mỗi user 5 read/ngày và peak gấp 5 average: average khoảng 579 read/s; peak khoảng 2.9k read/s. Số có một chữ số có nghĩa đủ để chọn order of magnitude. Ghi rõ giả định và sensitivity thay vì tạo precision giả.

```text title="Estimation worksheet"
DAU × actions per day / 86,400 = average QPS
average QPS × peak factor = peak QPS
writes per day × bytes × retention × replication = storage
```

## Trình tự thiết kế
1. API contract và idempotency.
2. Data model, invariant và access pattern.
3. High-level request/data flow.
4. Bottleneck theo estimate: database, fan-out, hot key hay connection.
5. Failure handling, security, observability và rollout.

:::interview Senior signal
Nói “tôi chọn X vì requirement Y; đổi lại chịu Z; tôi sẽ kiểm chứng bằng metric/test W” mạnh hơn liệt kê công nghệ.
:::

## Deep dive có mục tiêu
Read-heavy mới bàn cache/CDN/read replica. Write ordering mới bàn partition key. Long task mới bàn queue. Không thêm Kafka chỉ để sơ đồ trông lớn. Mỗi component phải liên kết với requirement hoặc failure mode.

## Key Takeaways
- Requirement và invariant đứng trước solution.
- Estimate là công cụ tìm bottleneck, không phải bói chính xác.
- Deep dive vào risk lớn nhất.
- Kết thúc bằng failure, operations, security và trade-off.
