---
id: spring-jpa-fetching-batching-locking
slug: spring-jpa-fetching-batching-locking
title: JPA Fetching, Batching và Locking trong Production
description: Thiết kế fetch plan, pagination, JDBC batching và optimistic/pessimistic concurrency dựa trên use case và SQL quan sát được.
category: backend
technology: Spring Data JPA / Hibernate
level: senior
estimatedMinutes: 58
tags: ["jpa","fetching","batching","optimistic-locking","pagination"]
prerequisites: ["spring-jpa-persistence-context"]
related: ["jpa-n-plus-one","database-query-plan"]
next: spring-testing-strategy
learningObjectives: ["Chọn fetch plan theo read use case","Batch write mà không làm persistence context tăng vô hạn","Chọn optimistic hoặc pessimistic locking theo contention"]
lastReviewed: 2026-09-02
appliesTo: {"spring-data-jpa":"3+","hibernate-orm":"6+"}
sources: [{"title":"Hibernate ORM User Guide","url":"https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html","organization":"Hibernate","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Data JPA Locking","url":"https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Data JPA Projections","url":"https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Fetch plan là một phần của use case
Mapping association mô tả quan hệ; fetch plan mô tả dữ liệu một use case cần. Không có một graph “load đúng cho mọi màn hình”. List page cần vài cột; detail cần graph khác; command update có thể chỉ cần aggregate và version.

`LAZY` trì hoãn load tới lúc truy cập. `EAGER` yêu cầu dữ liệu sẵn có nhưng không đảm bảo một SQL join tối ưu. Đổi tất cả sang EAGER thường chuyển N+1 thành over-fetch hoặc cartesian product. Hãy nhìn SQL thật.

| Kỹ thuật | Phù hợp | Rủi ro |
|---|---|---|
| Fetch join | Graph nhỏ, bounded, cần entity | Nhân row, khó page collection |
| EntityGraph | Fetch plan khai báo theo repository/use case | Graph phức tạp vẫn over-fetch |
| DTO projection | Read model/list/report | Không dùng như managed aggregate |
| Batch fetching | Nhiều lazy association cùng loại | Vẫn nhiều round trips, cần tune |
| Hai bước IDs rồi graph | Page parent kèm to-many | Thêm query nhưng cardinality kiểm soát |

## Pagination và to-many
Fetch join collection nhân mỗi parent theo số child. SQL pagination trên row có thể cắt sai parent hoặc buộc provider page trong memory. Pattern an toàn hơn:

1. Query page IDs với sort deterministic.
2. Fetch graph cho tập IDs.
3. Khôi phục đúng thứ tự của page.

Keyset/cursor pagination tránh scan offset lớn nhưng cần sort key unique/stable, ví dụ `(created_at, id)`. Không ghép cursor từ dữ liệu chưa ký/validate nếu nó mang filter hoặc tenant scope.

## Projection và query boundary
DTO projection giảm cột, tránh dirty checking và làm data contract rõ. Interface/class projection vẫn phải xem SQL sinh ra, đặc biệt nested association có thể kéo join. Không dùng entity cho read-only report chỉ vì mapper tiện.

```java title="OrderSummaryRepository.java"
@Query("""
  select new com.example.OrderSummary(o.id, c.name, o.total, o.version)
  from Order o join o.customer c
  where o.status = :status and o.id > :afterId
  order by o.id
  """)
List<OrderSummary> findPage(OrderStatus status, Long afterId, Pageable page);
```

Index phải khớp predicate/order và được xác minh bằng execution plan; ORM không thể tạo capacity ngoài database.

## JDBC batching
Batching gom nhiều statement tương tự vào ít round trips. Nó chỉ hiệu quả khi driver/provider hỗ trợ, SQL có thể batch và application flush hợp lý. ID generation strategy, statement ordering và generated keys có thể ảnh hưởng khả năng batch.

```java title="ImportService.java"
@Transactional
public void importRows(List<Row> rows) {
  for (int i = 0; i < rows.size(); i++) {
    entityManager.persist(map(rows.get(i)));
    if ((i + 1) % batchSize == 0) {
      entityManager.flush();
      entityManager.clear();
    }
  }
}
```

`flush/clear` ngăn persistence context giữ toàn bộ batch, nhưng `batchSize` phải đến từ measurement/resource limits chứ không hard-code theo ví dụ. Sau `clear`, mọi entity cũ là detached. Batch lớn cũng tăng lock duration, rollback cost và replication lag.

:::production Batch API khác bulk SQL
JDBC batching vẫn thực thi nhiều row operations với entity lifecycle. Bulk JPQL/native update có semantic khác, bỏ qua managed state/callback và có thể cần clear cache/context. Chọn theo correctness trước throughput.
:::

## Optimistic locking
`@Version` thêm version vào predicate update/delete. Nếu writer khác đã đổi row, affected rows bằng zero và provider ném optimistic locking exception. Nó phát hiện lost update mà không giữ lock dài, phù hợp contention thấp và interaction có thể retry/reload.

```java title="Inventory.java"
@Entity
class Inventory {
  @Id private Long productId;
  @Version private long version;
  private int available;

  void reserve(int quantity) {
    if (quantity <= 0 || available < quantity) throw new InsufficientStock();
    available -= quantity;
  }
}
```

Retry toàn use case chỉ an toàn khi command idempotent và đọc lại state mới. Không retry mù side effect như charge payment.

## Pessimistic locking và conditional update
Pessimistic lock nhờ database giữ lock, hữu ích khi contention cao và conflict retry đắt. Đổi lại, nó tăng wait/deadlock risk; transaction phải ngắn và lock rows theo thứ tự nhất quán. Lock timeout là failure bình thường cần policy.

Đôi khi atomic conditional SQL tốt hơn load-lock-save:

```sql title="ReserveStock.sql"
UPDATE inventory
SET available = available - :quantity
WHERE product_id = :id
  AND available >= :quantity;
```

Affected row count bằng một nghĩa reserve thành công; zero nghĩa không đủ hàng hoặc ID không tồn tại, cần phân loại nếu API yêu cầu. Đây là cách đưa invariant vào một atomic database statement.

## Deadlock và hot row
Deadlock không hoàn toàn tránh được; database chọn victim để phá vòng. Application cần transaction ngắn, lock ordering, bounded retry cho operation idempotent và metric. Một counter/inventory row nóng có thể serialize throughput dù query có index; partitioning, reservation ledger hoặc queue có thể cần ở quy mô cao.

## Production checklist
1. Query-count test cho endpoint quan trọng.
2. Fetch graph theo từng use case, không global EAGER.
3. Page to-many bằng chiến lược hai bước khi cần.
4. Đo JDBC batch bằng SQL/round trips và kiểm memory.
5. Bảo vệ update bằng version, conditional SQL hoặc lock.
6. Theo dõi lock wait, deadlock, optimistic conflict và pool wait.

## Câu hỏi phỏng vấn
**Optimistic lock có khóa row khi đọc không?** Thông thường không; nó phát hiện conflict lúc write bằng version/check condition.

**Vì sao fetch join hai collection nguy hiểm?** Row count có thể nhân theo tích cardinality, gây duplicate transfer, memory lớn và pagination sai.

## Key Takeaways
- Fetching là query/use-case decision.
- Batching giảm round trip nhưng không miễn phí về memory/lock.
- Optimistic locking phát hiện conflict; pessimistic locking ngăn/tuần tự hóa.
- Conditional update thường là công cụ concurrency đơn giản và mạnh.
