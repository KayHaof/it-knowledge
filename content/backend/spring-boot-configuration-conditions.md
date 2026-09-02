---
id: spring-boot-configuration-conditions
slug: spring-boot-configuration-conditions
title: Spring Boot Configuration — Precedence, Profiles và Conditions
description: Quản lý external configuration có type, hiểu property precedence, profile activation và debug auto-configuration bằng condition report.
category: backend
technology: Spring Boot
level: advanced
estimatedMinutes: 56
tags: ["spring-boot","configuration-properties","profiles","auto-configuration","conditions"]
prerequisites: ["spring-ioc-bean-lifecycle"]
related: ["spring-testing-strategy","observability"]
next: spring-mvc-request-lifecycle
learningObjectives: ["Truy nguồn giá trị theo PropertySource precedence","Bind và validate configuration theo type","Thiết kế auto-configuration có back-off và diagnostic rõ"]
lastReviewed: 2026-09-02
appliesTo: {"spring-boot":"3.5+ and 4.x"}
sources: [{"title":"Spring Boot Externalized Configuration","url":"https://docs.spring.io/spring-boot/reference/features/external-config.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Spring Boot Auto-configuration","url":"https://docs.spring.io/spring-boot/reference/using/auto-configuration.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Creating Your Own Auto-configuration","url":"https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html","organization":"Spring","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Configuration là runtime input có schema
Configuration quyết định endpoint, timeout, pool, feature và credential; sai config có thể nguy hiểm như sai code. Treat config như input: có type, validation, origin, ownership, deployment history và rollback.

Spring Boot hợp nhất property files, YAML, environment variables, system properties, command-line arguments, test overrides và config imports thành `Environment`. Các nguồn có precedence; nguồn ưu tiên sau có thể override trước. Không debug bằng cách chỉ mở `application.yml`.

## Precedence và origin
Khi value bất ngờ:

1. Ghi canonical property name.
2. Xác định active profiles và config locations/imports.
3. Tìm mọi nguồn có thể override, gồm environment/CLI.
4. Dùng property origin/condition diagnostics an toàn.
5. Kiểm tra relaxed binding của tên biến môi trường.

`spring.config.location` thay thế default locations, còn `spring.config.additional-location` bổ sung chúng. Cả hai được đọc rất sớm nên phải được cung cấp bằng environment/system/CLI phù hợp; đặt chúng trong file mà chính chúng dùng để tìm có thể quá muộn.

:::warning Secret exposure
Endpoint/config dump, startup log và support bundle có thể lộ password/token. Sanitize không phải bằng chứng tuyệt đối; giới hạn endpoint, quyền truy cập, network exposure và dữ liệu được log.
:::

## Type-safe ConfigurationProperties
Rải `@Value` tạo parsing/default/validation không nhất quán. `@ConfigurationProperties` gom namespace thành schema có type và có thể validate startup.

```java title="PaymentClientProperties.java"
@ConfigurationProperties("clients.payment")
@Validated
public record PaymentClientProperties(
    @NotNull URI baseUrl,
    @NotNull Duration connectTimeout,
    @NotNull Duration readTimeout,
    @Min(1) int maxConcurrentRequests) {}
```

```yaml title="application.yml"
clients:
  payment:
    base-url: https://payments.internal
    connect-timeout: 500ms
    read-timeout: 2s
    max-concurrent-requests: 40
```

Dùng `Duration`, `DataSize`, enum và nested type thay string/int không đơn vị. Validate quan hệ chéo như read timeout lớn hơn connect timeout bằng class-level validation hoặc factory. Secret bắt buộc không nên có default giả làm app khởi động với credential yếu.

Immutability giúp bean config an toàn sau startup. Spring Boot core binding không tự hứa dynamic reload mọi bean; nếu cần refresh, phải thiết kế snapshot/version/validation/rollback và xác định component nào nhận giá trị mới.

## Profiles dùng cho composition, không cho mọi feature
Profile-specific file override base config; nhiều profiles có last-wins theo location-group rules. Profile groups có thể gom tên logical. `spring.config.activate.on-profile` kích hoạt document theo expression.

Profiles hữu ích cho composition thô như local integration hoặc cloud platform. Nếu mọi feature có profile riêng, tổ hợp tăng bùng nổ và khó biết runtime thực sự bật gì. Feature flags có lifecycle/audit/targeting khác; secret manager có security model khác; không nhồi tất cả vào profiles.

Không đặt `prod` behavior chỉ trong code `@Profile("prod")` nếu thiếu profile sẽ vô tình bật implementation unsafe. Default nên fail closed/fail startup khi config bắt buộc vắng.

## Config import và config tree
`spring.config.import` chèn nguồn bổ sung với precedence được định nghĩa; `optional:` cho phép vắng. Chỉ dùng optional khi absence thật sự là state hợp lệ. Nếu database credential là required mà import optional, failure bị đẩy tới connection timeout khó hiểu.

`configtree:` phù hợp secret/config được mount thành nhiều files như container secret. File permissions, rotation và backup vẫn là concern platform. Đừng log content để debug binding.

## Auto-configuration là conditional graph
Auto-configuration kích hoạt dựa trên classpath, beans, properties, web application type và resources. Nó thường back off khi application cung cấp bean. `--debug`/condition evaluation report cho biết condition match hoặc không match.

```java title="LedgerAutoConfiguration.java"
@AutoConfiguration
@ConditionalOnClass(LedgerClient.class)
@EnableConfigurationProperties(LedgerProperties.class)
public class LedgerAutoConfiguration {
  @Bean
  @ConditionalOnMissingBean
  LedgerClient ledgerClient(LedgerProperties properties) {
    return new HttpLedgerClient(properties.baseUrl(), properties.timeout());
  }
}
```

Auto-config library được liệt kê trong `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` theo cơ chế hiện đại. Conditions phải được đặt sao cho class optional không bị JVM load trước khi condition kiểm tra. Return type `@Bean` càng cụ thể càng giúp bean conditions thấy type đúng.

## Back-off và override contract
`@ConditionalOnMissingBean` cho consumer thay default, nhưng contract phải rõ họ cần override type/name nào. Nếu condition phụ thuộc thứ tự config chưa xác định, starter có thể hoạt động trong app A nhưng mất bean trong app B.

Không dùng `matchIfMissing=true` cho capability có side effect/nguy hiểm trừ khi default-on thật sự có chủ đích. Flag string phải định nghĩa accepted value; property tồn tại nhưng value sai có thể match khác intuition nếu không ghi `havingValue`.

## Test configuration như product code
Test:

- Binding thành công với unit/format hợp lệ.
- Startup fail khi required property thiếu/sai.
- Condition match khi class/property/bean có mặt.
- Auto-config back off khi user bean được cung cấp.
- Không tạo bean khi dependency optional vắng.
- Metadata/documentation có key/default/deprecation.

Application context runner hoặc focused context test nhanh hơn full app cho auto-config matrix. Test property source precedence riêng khi deployment phụ thuộc override.

## Failure scenarios
- Environment variable tên gần đúng nhưng relaxed binding map sang key khác kỳ vọng.
- Dùng cả `.properties` và YAML cùng location rồi đoán sai precedence.
- `spring.config.location` vô tình thay vì additional location làm mất base config.
- Profile order khác giữa environments.
- Auto-config tạo bean dù credential thiếu và chỉ fail ở request đầu.
- Endpoint `/env` được expose rộng làm rò config.

## Production checklist
1. Mỗi namespace có owner, typed schema, validation và documentation.
2. Fail startup khi required config/secret thiếu.
3. Record active profiles, config version và non-secret effective settings.
4. Protect config/conditions actuator endpoints.
5. Test precedence và auto-config back-off.
6. Tách feature flag, secret và environment composition.
7. Có rollback khi config deploy gây lỗi.

## Câu hỏi phỏng vấn
**`spring.config.location` khác `spring.config.additional-location`?** `location` thay thế các default locations; `additional-location` thêm nguồn vào ngoài default và có thể override theo precedence.

**Vì sao bean auto-config không được tạo?** Cần đọc condition report: class/property/web type có thể không match hoặc user bean khiến auto-config back off.

## Key Takeaways
- Effective config là kết quả merge có precedence và origin.
- ConfigurationProperties biến config thành schema có type.
- Profile order và location group là một phần runtime contract.
- Auto-configuration là graph conditions có thể quan sát và test.
