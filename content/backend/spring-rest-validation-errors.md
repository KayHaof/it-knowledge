---
id: spring-rest-validation-errors
slug: spring-rest-validation-errors
title: Spring REST Contract — Validation và Error Handling
description: Thiết kế HTTP API ổn định với DTO boundary, validation nhiều lớp, Problem Details, idempotency và concurrency contract.
category: backend
technology: Spring MVC
level: intermediate
estimatedMinutes: 47
tags: ["spring","rest","validation","problem-detail","http"]
prerequisites: ["spring-ioc-bean-lifecycle"]
related: ["spring-mvc-webflux","security-fundamentals"]
next: spring-security-oauth2-jwt
learningObjectives: ["Tách transport DTO khỏi domain invariant","Thiết kế error response máy đọc được","Dùng HTTP method/status/idempotency đúng semantic"]
lastReviewed: 2026-09-02
appliesTo: {"spring-framework":"6+"}
sources: [{"title":"Spring MVC Validation","url":"https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring MVC REST Exceptions","url":"https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring HTTP Interface","url":"https://docs.spring.io/spring-framework/reference/integration/rest-clients.html#rest-http-interface","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## API là contract quan sát được
REST API không chỉ là controller gọi service. Contract gồm method, path, media type, schema, status, headers, error model, authorization và idempotency. Client có thể phụ thuộc cả việc field vắng khác `null`; đổi serialization tưởng nhỏ vẫn có thể breaking.

Transport DTO giữ concern của HTTP/JSON ở boundary. Domain model giữ invariant và behavior. Bind request trực tiếp vào JPA entity làm client điều khiển field không nên sửa, kéo lazy association vào serialization và ghép version API với schema persistence.

```java title="CreateOrderRequest.java"
public record CreateOrderRequest(
    @NotBlank String customerId,
    @NotEmpty List<@Valid OrderLineRequest> lines) {}

@PostMapping("/orders")
ResponseEntity<OrderView> create(@Valid @RequestBody CreateOrderRequest request) {
  OrderView created = application.create(mapper.toCommand(request));
  URI location = URI.create("/orders/" + created.id());
  return ResponseEntity.created(location).body(created);
}
```

## Ba lớp validation
Syntactic validation kiểm tra shape: required, length, format. Semantic validation kiểm tra quy tắc domain: đơn có ít nhất một dòng hợp lệ, trạng thái cho phép thao tác. Consistency validation dựa trên state/resource: customer tồn tại, version chưa đổi, quota còn.

Bean Validation hữu ích ở transport boundary nhưng annotation không thay domain invariant. Race vẫn tồn tại giữa “check unique” và insert; database unique constraint là hàng rào cuối, sau đó map violation thành conflict phù hợp.

:::warning Information leak
Không trả raw exception message, SQL, stack trace hay tên class nội bộ. Error response cần đủ để client sửa request và operator correlation, nhưng không tiết lộ implementation/secret.
:::

## Error model ổn định
Spring hỗ trợ `ProblemDetail` theo Problem Details. Một error contract hữu ích có:

- HTTP status đúng lớp lỗi.
- Type/code ổn định cho machine handling.
- Title/detail an toàn cho người dùng.
- Instance hoặc correlation ID để truy trace.
- Danh sách field violations có path và code, không chỉ message đã dịch.

```java title="ApiExceptionHandler.java"
@RestControllerAdvice
class ApiExceptionHandler {
  @ExceptionHandler(OrderNotFound.class)
  ProblemDetail notFound(OrderNotFound error) {
    ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
    problem.setTitle("Order not found");
    problem.setProperty("code", "ORDER_NOT_FOUND");
    return problem;
  }
}
```

Không map mọi lỗi thành `400`. `401` nói chưa xác thực hợp lệ, `403` nói đã xác thực nhưng không được phép, `404` cho resource không tồn tại theo disclosure policy, `409` cho state conflict, `422` có thể dùng cho semantic request tùy API convention, và `500/503` cho server/dependency failure.

## Idempotency và retry
GET, PUT, DELETE có idempotent semantics theo HTTP, nhưng implementation vẫn phải giữ side effect phù hợp. POST tạo payment/order thường cần `Idempotency-Key` hoặc business key khi client có thể retry sau timeout. Server lưu fingerprint request và kết quả đủ lâu theo risk window; cùng key với payload khác phải bị từ chối.

Timeout tạo trạng thái “unknown outcome”: client không biết server đã commit chưa. Retry mù có thể tạo duplicate. API nên cung cấp operation/resource ID để query trạng thái, hoặc idempotency protocol.

## Update và concurrent writer
PUT thường thay representation; PATCH áp dụng partial change và cần media type/merge semantics rõ. Với nhiều writer, dùng version trong payload, `If-Match`/ETag hoặc conditional update để phát hiện lost update. Last-write-wins chỉ đúng khi nghiệp vụ chấp nhận.

Pagination offset dễ dùng nhưng chậm/không ổn định khi dataset đổi lớn. Cursor/keyset cần sort key deterministic và token opaque. Response phải định nghĩa order; database không bảo đảm order nếu query không có `ORDER BY`.

## Boundary với serialization
Giới hạn request body, nesting, collection cardinality và upload size trước khi mapping object graph lớn. Quy định timezone/precision cho thời gian và số tiền. Không dùng floating point cho amount cần decimal exact. Backward compatibility nên ưu tiên thêm field optional; xóa/đổi meaning cần version hoặc migration window.

## Production checklist
1. Contract test schema, status và error code của critical APIs.
2. Validate size/cardinality trước xử lý tốn tài nguyên.
3. Giữ domain invariant ngoài controller annotation.
4. Map exception theo taxonomy, log một lần với correlation ID.
5. Thiết kế idempotency cho operation được retry.
6. Có optimistic concurrency cho update không được mất.

## Câu hỏi phỏng vấn
**Validation ở controller đã đủ chưa?** Chưa. Nó kiểm shape tại transport boundary; domain invariant phải sống trong domain/application layer và consistency cần database constraint/transaction chống race.

**Client timeout có nghĩa request thất bại?** Không. Kết quả có thể đã commit nhưng response bị mất; cần idempotency key hoặc endpoint tra trạng thái.

## Key Takeaways
- API contract gồm cả failure và concurrency semantics.
- DTO bảo vệ boundary giữa transport, domain và persistence.
- Validation nhiều lớp; constraint database vẫn cần cho race.
- Retry an toàn đòi idempotency, không chỉ exponential backoff.
