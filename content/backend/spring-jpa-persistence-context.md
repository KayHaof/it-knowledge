---
id: spring-jpa-persistence-context
slug: spring-jpa-persistence-context
title: JPA Persistence Context — Entity State, Dirty Checking và Flush
description: Hiểu identity map, entity lifecycle, dirty checking, write-behind và ranh giới transaction để tránh bug detached entity và commit muộn.
category: backend
technology: JPA / Hibernate
level: advanced
estimatedMinutes: 54
tags: ["jpa","hibernate","persistence-context","dirty-checking","flush"]
prerequisites: ["spring-aop-transactions"]
related: ["jpa-n-plus-one","java-object-contracts"]
next: spring-jpa-fetching-batching-locking
learningObjectives: ["Phân biệt transient, managed, detached và removed","Giải thích first-level cache, dirty checking và flush","Thiết kế entity lifecycle không rò qua API boundary"]
lastReviewed: 2026-09-02
appliesTo: {"jakarta-persistence":"3+","hibernate-orm":"6+"}
sources: [{"title":"Jakarta Persistence Specification","url":"https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2","organization":"Jakarta EE","type":"specification","accessedAt":"2026-09-02"},{"title":"Hibernate ORM User Guide","url":"https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html","organization":"Hibernate","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Data JPA Persisting Entities","url":"https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Persistence context là unit of work
`EntityManager` quản lý một persistence context: tập entity instances gắn với một unit of work. Với mỗi entity identity, context giữ một managed instance — identity map. Nó theo dõi thay đổi và đồng bộ chúng xuống database khi flush.

| State | Ý nghĩa |
|---|---|
| Transient/new | Object chưa được context quản lý và chưa có row tương ứng |
| Managed | Được context theo dõi; thay đổi có thể được dirty-check |
| Detached | Từng managed nhưng context đã đóng/clear hoặc entity bị detach |
| Removed | Đã đánh dấu xóa, SQL có thể chờ tới flush |

```java title="PriceChangeService.java"
@Transactional
public void changePrice(ProductId id, Money newPrice) {
  Product product = entityManager.find(Product.class, id.value());
  product.changePrice(newPrice);
  // Không cần gọi update: managed entity được dirty-check khi flush.
}
```

Đoạn code không có SQL update tại dòng setter. Provider so state hiện tại với snapshot/strategy tracking và xếp write vào unit of work. Đó là write-behind, không phải “tự lưu tức thời”.

## Flush không phải commit
Flush đồng bộ pending changes thành SQL trong transaction để database có thể kiểm constraint hoặc query thấy state cần thiết. Commit kết thúc transaction và làm thay đổi durable/visible theo database semantics. Flush có thể thành công rồi commit thất bại; transaction có thể rollback sau flush.

Auto flush có thể xảy ra trước query liên quan, tại commit hoặc khi gọi `flush` rõ. Vì vậy exception constraint đôi khi xuất hiện trước một query tưởng chỉ đọc. Nếu API cần báo lỗi chính xác trước khi tạo side effect khác, có thể flush tại điểm có chủ đích nhưng vẫn phải xử lý rollback.

:::interview Câu bẫy
`repository.save(entity)` không bảo đảm SQL chạy ngay và càng không bảo đảm commit. Behavior phụ thuộc entity mới hay detached, context và transaction boundary.
:::

## Persist và merge
`persist` làm instance mới trở thành managed. `merge` copy state từ object detached vào một managed instance và trả instance managed; argument ban đầu vẫn detached. Bỏ qua giá trị trả về rồi tiếp tục sửa object cũ là lỗi phổ biến.

Đưa DTO từ client vào `merge` còn nguy hiểm hơn: field thiếu có thể ghi đè state, association bị thay ngoài ý muốn và mass assignment. Load managed aggregate trong transaction, áp command qua method domain, rồi để dirty checking làm việc.

## Cascade và orphan removal
Cascade truyền operation lifecycle, không đồng nghĩa authorization hay fetch. Chỉ cascade khi parent thật sự sở hữu lifecycle child. `CascadeType.ALL` trên mọi association có thể persist/xóa graph ngoài ý muốn. `orphanRemoval` diễn tả child bị loại khỏi owned collection thì được xóa; nó cần helper method giữ hai phía association nhất quán.

```java title="Order.java"
public void addLine(OrderLine line) {
  lines.add(line);
  line.attachTo(this);
}

public void removeLine(OrderLine line) {
  lines.remove(line);
  line.detach();
}
```

Database foreign key vẫn là hàng rào integrity. Mapping đúng trong Java không thay thế constraint.

## Entity equality và proxy
Generated ID chưa có trước persist làm equality khó. Dùng mutable business fields trong hash code lại làm entity biến mất khỏi set. Strategy cần nhất quán với domain, inheritance và proxy behavior; không có một template đúng cho mọi entity.

Entity proxy/lazy association có thể làm `getClass`, `toString`, mapper hoặc serializer kích hoạt SQL ngoài ý muốn. Không đưa entity trực tiếp qua REST. Map sang DTO trong use-case transaction với fetch plan rõ.

## Open Session in View
Giữ persistence context mở qua web rendering giúp lazy load “tiện”, nhưng che query tại serialization, gây N+1 và làm database access xảy ra ngoài service boundary. Tắt hay bật là quyết định kiến trúc; nếu tắt, application service phải fetch/map đủ dữ liệu. Nếu bật, vẫn phải quan sát query count và không xem đó là giải pháp fetch plan.

## First-level và second-level cache
First-level cache thuộc persistence context và luôn gắn với identity/dirty checking; gọi `find` cùng ID trong context có thể trả managed instance sẵn có. Second-level cache là optional, chia sẻ rộng hơn và có consistency/invalidation semantics riêng. Nó không sửa query tệ hay thay transaction isolation.

## Failure scenarios
- Truy cập lazy association sau khi context đóng: exception hoặc thiết kế query boundary sai.
- `clear()` trong batch nhưng tiếp tục dùng detached entity như managed.
- Bulk JPQL update bỏ qua state đang giữ trong context: memory state stale.
- Cascade remove qua association không sở hữu lifecycle: mất dữ liệu.
- Long transaction giữ hàng nghìn managed entities: memory và dirty-check cost tăng.

## Production checklist
1. Một use case có transaction/persistence-context boundary rõ.
2. Không bind entity trực tiếp từ request và không serialize entity.
3. Flush/clear theo batch khi xử lý cardinality lớn.
4. Dùng database constraints cho integrity cuối.
5. Test SQL/query count và exception tại flush/commit.
6. Document equality strategy và aggregate ownership.

## Câu hỏi phỏng vấn
**Dirty checking hoạt động với entity nào?** Với managed entity trong persistence context. Detached object không tự được theo dõi.

**`merge` trả gì?** Một managed instance chứa state đã merge; object truyền vào không tự biến thành managed.

## Key Takeaways
- Persistence context là identity map cộng unit of work.
- Flush phát SQL nhưng không đồng nghĩa commit.
- Merge copy state; nó không attach chính argument.
- Entity lifecycle không nên rò qua transport boundary.
