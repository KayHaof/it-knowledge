---
id: spring-testing-strategy
slug: spring-testing-strategy
title: Spring Testing — Test Slice, Integration và Failure Contract
description: Xây test portfolio nhanh nhưng đáng tin, dùng Spring context đúng mức và bắt các lỗi transaction, SQL, security, time cùng concurrency.
category: backend
technology: Spring Boot
level: advanced
estimatedMinutes: 51
tags: ["spring","testing","test-slice","integration-test","contract-test"]
prerequisites: ["spring-ioc-bean-lifecycle"]
related: ["testing-strategy","spring-security-oauth2-jwt"]
next: spring-mvc-webflux
learningObjectives: ["Chọn test level theo loại rủi ro","Hiểu context caching và transactional test trap","Kiểm chứng failure/security contract bằng hạ tầng gần production"]
lastReviewed: 2026-09-02
appliesTo: {"spring-framework":"6+","spring-boot":"3+"}
sources: [{"title":"Spring Framework Testing","url":"https://docs.spring.io/spring-framework/reference/testing.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Boot Testing","url":"https://docs.spring.io/spring-boot/reference/testing/index.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Security Testing","url":"https://docs.spring.io/spring-security/reference/servlet/test/index.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Test theo risk, không theo annotation
Một portfolio tốt trả lời nhiều loại câu hỏi với vòng phản hồi khác nhau:

| Loại | Chứng minh | Không chứng minh |
|---|---|---|
| Plain unit test | Domain rule, branch, state transition | Wiring, serialization, SQL |
| Web slice | Routing, binding, validation, error/security filter | Database mapping, full graph |
| Data slice | Mapping, query, constraint, repository | HTTP contract, full startup |
| Full integration | Bean graph và luồng qua nhiều adapter | Hành vi của dependency thật nếu vẫn mock |
| Contract/end-to-end | Boundary giữa processes, deploy/runtime flow | Mọi edge case nội bộ |

Đẩy mọi test lên `@SpringBootTest` làm suite chậm, failure khó định vị và dễ che thiết kế coupling. Nhưng chỉ mock repository/client lại bỏ qua lỗi có giá trị nhất: query sai, constraint, serialization, filter order và config.

## Domain test không cần Spring
Domain object nên test bằng constructor/method bình thường. Dùng fixed clock và fake port nhỏ để giữ determinism.

```java title="OrderTest.java"
@Test
void cannot_confirm_an_empty_order() {
  var order = Order.draft();

  assertThatThrownBy(order::confirm)
      .isInstanceOf(EmptyOrder.class);
}
```

Test đặt tên bằng behavior/outcome. Không assert private method hoặc thứ tự gọi nội bộ trừ khi đó là observable protocol. Mutation/refactor hợp lệ không nên phá hàng trăm test.

## Slice test
`@WebMvcTest` tải phần MVC liên quan để kiểm request mapping, JSON, validation, exception handling và security. Collaborator ngoài slice được thay bằng test double có chủ đích. `@DataJpaTest` tập trung entity/repository và thường transaction rollback sau test.

```java title="CreateOrderWebTest.java"
@Test
@WithMockUser(authorities = "SCOPE_orders.write")
void rejects_empty_lines() throws Exception {
  mvc.perform(post("/orders")
          .contentType(APPLICATION_JSON)
          .content("""{"customerId":"c-1","lines":[]}"""))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
}
```

Luôn có negative authorization tests: anonymous, sai scope, sai tenant/owner. Test “happy path với admin” không bắt endpoint vô tình public.

## Context cache và suite performance
Spring TestContext cache tái sử dụng context có cùng cấu hình. Profile/property/mock tùy biến khác nhau tạo cache key mới và context startup mới. `@DirtiesContext` làm mất cache; chỉ dùng khi test thực sự làm hỏng shared context state.

Theo dõi số context được tạo và thời gian test. Gom cấu hình integration chung, reset state ở data boundary, và tránh dynamic property ngẫu nhiên không cần thiết. Parallel test chỉ bật khi database/port/static state đã được cô lập.

## Transactional test trap
Test method chạy trong transaction và rollback có thể không giống production:

- Code chưa flush nên unique/FK constraint chưa nổ.
- Lazy association vẫn mở trong test nhưng production mapper chạy sau transaction.
- Event after-commit không chạy vì test rollback.
- Server thread trong full HTTP test không chia transaction với test thread.

Khi cần chứng minh constraint, gọi flush có chủ đích. Khi cần chứng minh commit listener/outbox, commit transaction hoặc kiểm bằng boundary thực. Không phụ thuộc thứ tự test.

:::warning In-memory database
Database thay thế có thể khác production về SQL dialect, collation, locking, isolation và execution plan. Query quan trọng nên chạy với engine/version tương thích production trong môi trường test có thể tái tạo.
:::

## Mock ở boundary có failure model
Mock phù hợp để kích hoạt timeout, 4xx/5xx, malformed payload và retry policy ở outbound port. Đừng mock class nội bộ chỉ để đạt coverage. Fake quá “thông minh” dễ khác dependency thật; contract test hoặc stub theo schema giúp phát hiện drift.

Clock, UUID/random và scheduler phải inject hoặc kiểm soát. Không dùng sleep để “đợi async”; chờ condition/event với deadline và failure message. Concurrency test cần lặp/coordination có chủ đích, nhưng vẫn không thay stress test.

## Database isolation và fixture
Fixture nhỏ, có ý nghĩa nghiệp vụ và được tạo qua builder/factory. Mỗi test sở hữu schema/database/tenant hoặc cleanup đáng tin. Cleanup `DELETE` theo bảng có thể bỏ sót sequence, trigger, cache; transaction rollback nhanh nhưng có trap như trên.

Migration phải được chạy trong integration pipeline, không chỉ để ORM tự tạo schema. Kiểm cả upgrade từ schema gần production khi migration có data transformation.

## Failure contract
Test không chỉ status thành công:

1. Invalid input không gây side effect.
2. Duplicate/idempotency trả cùng outcome.
3. Optimistic conflict không ghi đè.
4. Downstream timeout không giữ transaction/connection vô hạn.
5. Retry chỉ áp dụng lỗi retryable và không lặp side effect.
6. Log/error response không lộ secret.

## Production checklist
1. Mapping mỗi risk quan trọng tới test level nhỏ nhất đủ chứng minh.
2. Theo dõi flaky rate, suite duration và context count.
3. Dùng database tương thích cho query/lock/migration.
4. Test flush, commit và after-commit khi semantic yêu cầu.
5. Có negative security và tenant isolation tests.
6. Giữ test deterministic bằng clock/random/resource ownership.

## Câu hỏi phỏng vấn
**Tại sao test repository pass nhưng production lỗi constraint?** Test có thể rollback mà chưa flush, dùng database khác hoặc fixture không tái hiện collation/concurrency thật.

**Khi nào dùng full context?** Khi rủi ro nằm ở wiring/config/filter/transaction xuyên components; domain rule đơn lẻ không cần trả chi phí đó.

## Key Takeaways
- Test portfolio được thiết kế theo risk và boundary.
- Slice test cho feedback nhanh; integration bắt wiring/SQL thật.
- Transaction rollback có thể tạo false confidence.
- Failure, security và concurrency contract quan trọng ngang happy path.
