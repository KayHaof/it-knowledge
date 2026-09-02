---
id: mongodb-document-model
slug: mongodb-document-model
title: MongoDB Document Model và Production Trade-offs
description: Thiết kế document theo access pattern, hiểu index, replication, transaction và giới hạn consistency.
category: nosql
technology: MongoDB
level: intermediate
estimatedMinutes: 24
tags: ["mongodb","document","index","replica-set","sharding"]
prerequisites: []
related: ["relational-database","distributed-failures"]
next: redis-cache-aside
learningObjectives: ["Chọn embed hay reference","Hiểu role của replica set","Tránh áp mô hình relational máy móc"]
lastReviewed: 2026-09-02
sources: [{"title":"MongoDB data modeling","url":"https://www.mongodb.com/docs/manual/data-modeling/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Replication","url":"https://www.mongodb.com/docs/manual/replication/","organization":"MongoDB","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Document model
MongoDB lưu BSON document. Thiết kế bắt đầu từ query và update pattern, không từ việc chuyển mỗi SQL table thành một collection. Embed dữ liệu được đọc cùng và có vòng đời chung; reference khi quan hệ lớn, thay đổi độc lập hoặc cần tránh document tăng không giới hạn.

## Index và aggregation
Index tăng tốc predicate/sort nhưng tăng write cost và RAM working set. Compound index cũng phụ thuộc prefix và query shape. Aggregation pipeline đưa filter càng sớm càng tốt, nhưng phải xem explain và document count thay vì giả định pipeline luôn tối ưu.

:::warning Schema flexible không có nghĩa schema-free
Ứng dụng vẫn cần validation, migration strategy, version field và contract giữa producer/consumer. Dữ liệu không nhất quán chỉ chuyển chi phí từ write-time sang read-time.
:::

## Replication, transaction, consistency
Replica set cung cấp redundancy và election. Write concern/read concern là quyết định durability/visibility, không phải checkbox. Multi-document transaction tồn tại nhưng không biến data model nhiều join thành lựa chọn tốt; transaction dài tăng contention và resource usage.

## Production concerns
- Chọn shard key tránh hotspot và hỗ trợ query routing.
- Theo dõi working set, page fault, replication lag và slow query.
- Giới hạn array/document tăng theo thời gian.
- Thiết kế retry idempotent khi primary election hoặc network timeout.

## Trả lời phỏng vấn
Tôi chọn MongoDB khi aggregate document và access pattern phù hợp, cần schema evolution linh hoạt và scale model của document store. Tôi vẫn đánh giá consistency, indexing, shard key, transaction boundaries và operational skill; “JSON nên dùng MongoDB” không đủ là lý do.

## Key Takeaways
- Model theo aggregate và access pattern.
- Flexible schema vẫn cần governance.
- Replica không xóa bỏ partial failure.
- Shard key là quyết định dài hạn ảnh hưởng routing và hotspot.
