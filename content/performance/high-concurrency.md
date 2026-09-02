---
id: high-concurrency
slug: concurrency-at-scale
title: High Concurrency — Từ 1.000 user đến 100.000 connection
description: Phân biệt concurrent users với RPS, quản lý queue, pool, backpressure, rate limit và load shedding.
category: performance
technology: Concurrent Systems
level: senior
estimatedMinutes: 34
tags: ["concurrency","rps","backpressure","load-shedding","pools"]
prerequisites: ["performance-diagnosis"]
related: ["java-concurrency","realtime-protocols"]
next: security-fundamentals
learningObjectives: ["Quy đổi user behavior sang workload","Thiết kế bounded queue/pool","Phân biệt rate limit và load shedding"]
lastReviewed: 2026-09-02
sources: [{"title":"AWS Builders Library - avoiding overload","url":"https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/","organization":"Amazon Web Services","type":"primary-vendor","accessedAt":"2026-09-02"}]
---
## Concurrent users không bằng RPS
10.000 user online nhưng mỗi người gửi một request/phút chỉ khoảng 167 RPS average. Ngược lại flash sale vài giây có burst lớn. WebSocket connection mostly idle tiêu thụ connection/memory nhưng không đồng nghĩa request throughput cao.

## Bounded everything
Thread pool, connection pool, queue và retry đều cần limit. Queue lớn hấp thụ burst ngắn nhưng biến overload kéo dài thành backlog và stale work. Admission control từ biên giúp fail fast trước khi giữ resource đắt.

| Cơ chế | Mục tiêu |
|---|---|
| Rate limit | Fairness/quota theo client hoặc tenant |
| Concurrency limit | Giới hạn in-flight work |
| Backpressure | Truyền demand/capacity ngược upstream |
| Load shedding | Bỏ work ít giá trị để giữ core SLO |

## Flash sale
Precompute eligibility, rate limit theo account/device, idempotency key cho order, atomic inventory invariant và queue khi business chấp nhận asynchronous confirmation. Distributed lock toàn cục thường là bottleneck; partition inventory hoặc database atomic update có thể rõ correctness hơn.

:::production Capacity plan
Load test tới saturation rồi xác định safe operating point, không đặt production limit đúng bằng maximum test. Theo dõi queue age, pool wait và rejected work; CPU chưa đầy không có nghĩa downstream còn capacity.
:::

## Key Takeaways
- Mô hình arrival rate, service time và burst.
- Queue không giới hạn chỉ trì hoãn thất bại.
- Giới hạn càng gần entry point càng rẻ.
- Correctness của inventory/payment đứng trước throughput.
