---
id: jpa-n-plus-one
slug: n-plus-one
title: JPA N+1 Query — Nhận diện và xử lý
description: Từ 1 parent query cộng N child queries đến fetch join, EntityGraph, batch fetching và DTO projection.
category: database
technology: JPA / Hibernate
level: advanced
estimatedMinutes: 38
tags: ["jpa","hibernate","n+1","fetch-join","entitygraph"]
prerequisites: ["database-query-plan"]
related: ["spring-mvc-webflux","performance-diagnosis"]
next: redis-cache-aside
learningObjectives: ["Tái hiện N+1 bằng SQL log","Chọn fetch strategy theo use case","Giải thích tại sao EAGER không phải đáp án chung"]
lastReviewed: 2026-09-02
sources: [{"title":"Hibernate ORM User Guide","url":"https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html","organization":"Hibernate","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## N+1 là gì
Ứng dụng chạy một query lấy N parent, sau đó khi truy cập association lại chạy một query cho mỗi parent. Tổng số là 1 + N. Vấn đề không nằm ở cú pháp Java mà ở fetch plan không khớp dữ liệu màn hình/use case cần.

```sql title="Observed SQL"
SELECT id, customer_id, total FROM orders ORDER BY created_at DESC LIMIT 50;
SELECT id, name FROM customers WHERE id = 101;
SELECT id, name FROM customers WHERE id = 102;
-- ... lặp tới 50 lần
```

```java title="OrderQueryService.java"
List<Order> orders = orderRepository.findRecent();
return orders.stream()
    .map(order -> new OrderRow(order.getId(), order.getCustomer().getName()))
    .toList();
```

## Tại sao EAGER không giải quyết tổng quát
EAGER nói association phải sẵn sàng, không bảo đảm Hibernate luôn dùng một SQL join tối ưu. Nó có thể phát secondary selects, over-fetch ở use case khác và làm entity graph khó kiểm soát. Fetch plan nên được thiết kế theo từng query boundary.

## Các giải pháp và trade-off
| Giải pháp | Điểm mạnh | Rủi ro |
|---|---|---|
| JOIN FETCH | Một round trip, rõ trong query | Cartesian explosion khi nhiều collection |
| EntityGraph | Fetch plan tách khỏi query text | Cần quản lý graph theo use case |
| Batch fetching | Giảm N query thành vài batch | Vẫn nhiều query, phụ thuộc batch size |
| DTO projection | Chỉ lấy field cần, tốt cho read model | Không trả entity để update trực tiếp |

```java title="OrderRepository.java"
@Query("""
  select o from Order o
  join fetch o.customer
  where o.createdAt < :cursor
  order by o.createdAt desc
  """)
List<Order> findPageWithCustomer(Instant cursor, Pageable page);
```

:::production Kiểm chứng, đừng đoán
Bật SQL statistics trong test/integration, assert số query cho critical path, theo dõi database calls trên trace. Dev data có 3 row có thể che N+1; hãy test cardinality gần production.
:::

## Khi fetch join gây vấn đề khác
Fetch nhiều to-many association có thể nhân row và dùng memory lớn. Pagination với collection fetch join có thể cần hai bước: page IDs trước rồi fetch graph theo IDs. DTO projection thường tốt cho list/report; entity phù hợp khi cần domain behavior và dirty checking.

## Troubleshooting flow
1. Xác định endpoint và số SQL mỗi request.
2. Map query lặp về association access.
3. Viết rõ dữ liệu response thật sự cần.
4. Chọn fetch join, graph, batch hay projection.
5. Đo query count, result row, latency và memory sau sửa.

## Trả lời phỏng vấn
N+1 là một parent query cộng N association queries. Tôi xác minh bằng SQL log/APM, sau đó thiết kế fetch plan theo use case. EAGER không phải đáp án mặc định vì có thể over-fetch hoặc vẫn secondary select; JOIN FETCH, EntityGraph, batch và DTO projection có trade-off riêng.

## Key Takeaways
- N+1 là mismatch giữa access pattern và fetch plan.
- Quan sát SQL/query count trong test và production trace.
- Tránh “fix toàn cục” bằng EAGER.
- Kiểm tra cartesian product và pagination sau khi join fetch.
