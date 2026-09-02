---
id: spring-security-policy-boundaries
slug: spring-security-policy-boundaries
title: Spring Security Policy Boundaries — CORS, CSRF và Method Authorization
description: Thiết kế nhiều lớp authorization nhất quán từ filter chain tới domain resource, cấu hình CORS/CSRF theo credential model và test denial paths.
category: backend
technology: Spring Security
level: senior
estimatedMinutes: 58
tags: ["spring-security","authorization","csrf","cors","method-security"]
prerequisites: ["spring-security-oauth2-jwt"]
related: ["security-fundamentals","spring-mvc-request-lifecycle"]
next: spring-testing-strategy
learningObjectives: ["Chọn security boundary theo threat và execution path","Phân tích CSRF từ credential transport","Kiểm resource ownership/tenant ở method và data layers"]
lastReviewed: 2026-09-02
appliesTo: {"spring-security":"6.4+ and 7.x"}
sources: [{"title":"Authorize HTTP Requests","url":"https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Method Security","url":"https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Cross Site Request Forgery","url":"https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Security CORS","url":"https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Một request có nhiều policy boundaries
Security không kết thúc ở `authenticated()`. Request có thể qua:

1. Edge/gateway network policy.
2. Spring Security filter chain.
3. HTTP request authorization.
4. Method/application-use-case authorization.
5. Domain resource/tenant/state policy.
6. Repository query scope và database constraints/policy.

Mỗi lớp có thông tin khác. Filter biết credential/path; service biết action/resource state; repository biết tenant predicate. Defense in depth không nghĩa copy cùng role check ở mọi nơi, mà đặt invariant ở lớp không thể bị bypass bởi entry point mới.

## Nhiều SecurityFilterChain và first match
Ứng dụng có thể tách actuator, API và browser UI thành nhiều chains với matcher/order khác nhau. Chain đầu tiên match sẽ xử lý request; rule trong chain khác không cứu request đã match nhầm.

```java title="ApiSecurity.java"
@Bean
@Order(1)
SecurityFilterChain api(HttpSecurity http) throws Exception {
  return http
      .securityMatcher("/api/**")
      .authorizeHttpRequests(auth -> auth
          .requestMatchers(HttpMethod.GET, "/api/catalog/**")
              .hasAuthority("SCOPE_catalog.read")
          .anyRequest().authenticated())
      .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
      .build();
}
```

Luôn có fallback chain rõ, và test endpoint không match chain dự kiến. `permitAll` cho static/public path phải hẹp; thứ tự matcher từ cụ thể đến tổng quát.

URL normalization, encoded separator, proxy prefix và trailing slash có thể khiến security matcher và MVC mapping hiểu khác. Dùng framework matchers tương thích và normalize tại trusted boundary; không tự regex raw URI cho authorization quan trọng.

## Request rule khác resource authorization
`hasAuthority("SCOPE_orders.write")` chứng minh capability tổng quát, chưa chứng minh principal sở hữu order hoặc cùng tenant.

```java title="OrderPolicy.java"
@PreAuthorize("hasAuthority('SCOPE_orders.write')")
public void cancel(OrderId id, PrincipalId actor) {
  Order order = orders.findInTenant(id, tenantContext.requiredTenant())
      .orElseThrow(OrderNotFound::new);
  authorization.requireCanCancel(actor, order);
  order.cancel();
}
```

Tenant phải lấy từ trusted identity/context và đưa vào query, không chỉ filter sau khi load. Trả `404` thay `403` có thể giảm resource enumeration, nhưng audit nội bộ vẫn ghi denial reason an toàn.

Method security bảo vệ use case gọi từ controller, message consumer hoặc scheduler, nhưng self-invocation/proxy boundary vẫn cần hiểu. Domain policy thuần Java dễ test và không phụ thuộc expression string cho rule phức tạp.

## CSRF bắt đầu từ cách browser gửi credential
CSRF xảy ra khi browser tự gửi credential tới site đích trong request do attacker kích hoạt. Cookie session là ví dụ điển hình; token trong cookie vẫn có risk tương tự nếu browser auto-attach.

Bearer token chỉ nằm trong `Authorization` header do trusted JavaScript thêm có exposure CSRF khác vì cross-site form/image không tự đặt header đó. Nhưng XSS có thể đánh cắp token/call API; tắt CSRF không giải quyết XSS.

Spring Security bật CSRF protection mặc định cho unsafe methods trong servlet application. Quyết định disable phải dựa trên:

- API có dùng session/cookie/basic/client certificate tự attach không?
- Browser và non-browser clients nào gọi?
- Login/logout/token endpoints có state change không?
- SPA lấy/gửi CSRF token thế nào?

:::danger “JWT nên tắt CSRF”
JWT chỉ là format token. Nếu JWT nằm trong cookie browser tự gửi, CSRF vẫn là threat. Hãy phân tích transport/storage, không suy từ format.
:::

## CORS không phải authentication
CORS là browser enforcement cho cross-origin script. Non-browser client/curl không bị CORS ngăn. Allow origin không chứng minh user; deny CORS không bảo vệ API khỏi server-to-server attacker.

Preflight `OPTIONS` thường không chứa session cookie mong đợi; CORS phải được xử lý trước Spring Security authorization phù hợp để browser nhận policy. Không dùng wildcard origins với credentials. Origin matching phải exact theo scheme/host/port hoặc pattern được review; phản chiếu tùy ý `Origin` là lỗi.

Giới hạn methods, headers và exposed headers. `Access-Control-Allow-Origin` là response policy, không thay CSRF token hoặc authorization.

## Method authorization và expression complexity
`@PreAuthorize` tốt cho rule ngắn, ổn định. Expression dài truy cập nhiều beans/repositories làm policy khó refactor, khó profile và có side effect trong authorization.

Tách policy:

```java title="DocumentAuthorization.java"
@PreAuthorize("@documentPolicy.canRead(authentication, #documentId)")
public DocumentView read(DocumentId documentId) {
  return query.load(documentId);
}
```

Policy method phải fail closed khi data/dependency lỗi, tránh remote I/O dài trước controller timeout, và cache chỉ khi key gồm đầy đủ principal/resource/version/tenant. Authorization result stale có thể nguy hiểm.

`@PostAuthorize` kiểm sau khi method chạy; không phù hợp method đã side effect. Filter collection sau load có thể vừa leak timing/count vừa tốn tài nguyên; query scope ở data layer tốt hơn.

## Async, scheduler và message consumer
Security context thường gắn execution context/thread. Async executor cần explicit propagation và cleanup; không truyền toàn mutable authentication tùy tiện vào job sống lâu. Durable job nên lưu actor ID, granted intent/scope cần thiết và re-authorize theo policy tại execution time nếu quyền có thể đổi.

Scheduler/system actor phải có identity/capability riêng, không chạy như “admin mặc định”. Message từ broker không tự trusted; verify producer/tenant/schema và authorize command.

## Denial và error contract
Unauthenticated credential failure là `401` với challenge phù hợp; authenticated nhưng denied là `403`; resource-hiding policy có thể trả `404`. Đừng trả claim/rule nội bộ trong body.

Audit decision có actor, action, resource reference an toàn, policy version, outcome và correlation. Không log token/secret. Metric denial reason dùng tập code hữu hạn để tránh high cardinality.

## Security testing matrix
Cho mỗi endpoint/use case quan trọng:

| Case | Kỳ vọng |
|---|---|
| Anonymous | 401 hoặc public contract |
| Token invalid/expired/wrong audience | 401 |
| Authenticated thiếu authority | 403 |
| Đúng authority, sai owner/tenant | deny không leak |
| Đúng principal/resource/state | success |
| CORS disallowed origin | browser không được grant |
| Unsafe cookie request thiếu CSRF | reject |
| Async/alternate entry point | policy vẫn áp dụng |

Test cả filter chain selection và method call qua proxy. Unit-test domain policy với state transitions; integration-test matcher/CORS/CSRF.

## Failure scenarios
- Endpoint mới rơi vào fallback `permitAll`.
- UI ẩn nút nhưng backend không object-authorize.
- Tenant ID lấy từ request body/header không trusted.
- Preflight bị auth chặn nên browser báo lỗi CORS mơ hồ.
- Disable CSRF vì dùng JWT trong cookie.
- `@PostAuthorize` chạy sau method đã gửi tiền.
- Cache authorization thiếu resource version/tenant.

## Production checklist
1. Default deny và fallback filter chain.
2. Contract-test matcher/order/normalization.
3. Phân tích credential transport trước cấu hình CSRF.
4. CORS origin/method/header tối thiểu.
5. Resource/tenant/state policy ở service/data boundary.
6. Context propagation explicit cho async.
7. Audit denial không token/PII và có policy version.

## Câu hỏi phỏng vấn
**CORS có ngăn Postman gọi API không?** Không. CORS là browser policy; API vẫn cần authentication/authorization.

**Có scope write thì đã được sửa mọi order chưa?** Chưa. Scope là capability tổng quát; server còn phải kiểm ownership, tenant và state của resource.

## Key Takeaways
- HTTP rule và object authorization là hai lớp khác nhau.
- CSRF phụ thuộc credential transport, không phụ thuộc tên JWT.
- CORS không phải access control cho non-browser clients.
- Alternate entry point và async context phải giữ policy tương đương.
