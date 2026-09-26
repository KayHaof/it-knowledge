# Tiến độ mở rộng knowledge base từ nguồn chính thống

Tài liệu này là checkpoint để phiên Codex sau tiếp tục đúng chỗ, không phải nguồn số liệu runtime. `knowledge/**/*.md` vẫn là nguồn nội dung duy nhất; các count authoritative phải đọc từ `public/generated/content-stats.json` và `public/generated/manifest.json` sau khi chạy compiler.

## Baseline ngày 2026-09-26

| Chỉ số | Baseline |
| --- | ---: |
| Lesson | 144 |
| `basic` | 20 |
| `advanced` | 62 |
| `extended` | 62 |
| Interview question | 383 |
| Flashcard | 1.185 |
| Source URL duy nhất | 407 |
| Content warning | 0 |

Baseline trên là snapshot trước batch population hiện tại. `0 warnings` chỉ chứng minh compiler không báo warning ở snapshot đó; nó không thay thế việc kiểm tra URL còn sống, độ mới phiên bản, chất lượng diễn giải hoặc application build sau các thay đổi mới.

## Quy ước ma trận

- `Khá`: đã có chuỗi nội dung tương đối liền mạch nhưng vẫn có thể cần sâu hơn.
- `Một phần`: có lesson liên quan nhưng thiếu level, thiếu topic quan trọng hoặc mới dựa vào lesson dùng chung.
- `Thiếu`: chưa có lesson trực tiếp trong artifact.
- Cột `N/P/F`: **N**guồn chính thống / **P**hỏng vấn / **F**lashcard. `✓` là có coverage trực tiếp, `△` là coverage gián tiếp hoặc chưa audit chất lượng theo từng topic, `—` là chưa có.
- Dấu `—` trong cột level có nghĩa artifact hiện tại không có lesson phù hợp; không được thay bằng ID dự kiến chưa tồn tại.

## Ma trận coverage theo Section 68

Các ID dưới đây đã được đối chiếu với `public/generated/lessons.json` ngày 2026-09-26.

| Chủ đề | Basic | Advanced | Extended | N/P/F | Trạng thái | Gap chính | Hành động kế tiếp |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Java | `java-language-types-values-parameters`<br>`java-object-contracts`<br>`java-exceptions-resource-safety` | `java-object-model-immutability-records-sealed`<br>`java-generics-erasure-variance`<br>`java-string-internals-building`<br>`java-streams-optional`<br>`java-io-nio-files` | `java-performance-jfr-jmh-diagnostics` | ✓/✓/✓ | Khá | Packages/access modifiers, enum và functional-interface progression còn phân tán | Review tiếp sau các domain backend ưu tiên cao hơn; không tạo overview trùng |
| Java Collections | `java-collections-generics` | `java-hashmap-internals`<br>`java-concurrent-collections-coordination` | — | ✓/✓/✓ | Khá | TreeMap/ArrayList internals chưa có lesson riêng; chỉ tách khi đủ chiều sâu, tránh catalog | Giữ hiện trạng trong Batch 1; audit bằng scenario khi quay lại Java |
| Java Concurrency | — | `java-concurrency`<br>`java-memory-model-locks-atomics`<br>`java-concurrent-collections-coordination`<br>`java-executors-thread-pools`<br>`java-completable-future` | `java-virtual-threads-structured-concurrency` | ✓/✓/✓ | Khá | Chưa có lesson basic riêng về Thread/Runnable/Callable trước JMM nâng cao | Cân nhắc foundation basic sau Batch 2; không lặp executor production lesson |
| JVM / GC | `java-jvm-memory` | `java-platform-bytecode-classloading` | `java-jvm-gc-profiling`<br>`java-performance-jfr-jmh-diagnostics`<br>`jvm-container-resources` | ✓/✓/✓ | Khá | Cần rà soát GC collector/version và runbook CPU, memory, pause | Enrich troubleshooting bằng JFR/heap/thread dump evidence |
| Spring Core | `spring-ioc-bean-lifecycle` | `spring-aop-transactions` | `spring-transaction-failure-playbook` | ✓/✓/✓ | Một phần | Scope, circular dependency, proxy/AOP đang dựa nhiều vào một lesson | Tách/enrich DI, scope và proxy mechanism nếu lesson quá tải |
| Spring Boot | `spring-ioc-bean-lifecycle` | `spring-boot-configuration-conditions`<br>`spring-testing-strategy` | `spring-production-actuator-resources`<br>`spring-graceful-shutdown-kubernetes` | ✓/✓/✓ | Khá | Startup flow, embedded server và externalized configuration cần kiểm tra độ sâu | Rà version Spring Boot hiện hành và bổ sung production config |
| Spring MVC | `spring-rest-validation-errors` | `spring-mvc-request-lifecycle` | — | ✓/✓/✓ | Một phần | Thiếu file upload, pagination, converter/argument resolver sâu | Enrich request lifecycle và contract REST |
| Spring WebFlux | — | `spring-mvc-webflux` | — | ✓/✓/✓ | Một phần | Thiếu basic Reactor và extended production/event-loop diagnosis | Bổ sung blocking-call failure, R2DBC và virtual-thread trade-off |
| REST API | `spring-rest-validation-errors` | — | `api-contracts-rest-grpc-events` | ✓/△/✓ | Một phần | Thiếu lesson tập trung HTTP semantics, caching, ETag, idempotency key, versioning | Tạo REST/HTTP foundation từ RFC hiện hành |
| Spring Security | `security-fundamentals` | `spring-security-oauth2-jwt` | `spring-security-policy-boundaries` | ✓/✓/✓ | Khá | Cần nối filter chain, method/object authorization và token boundary | Rà 401/403, CORS/CSRF và authorization tests |
| OAuth2 / OIDC / Keycloak | — | `spring-security-oauth2-jwt` | `oauth2-oidc-jwt-security` | ✓/✓/✓ | Một phần | Chưa có Keycloak realm/client/scope/role và flow vận hành riêng | Thêm Keycloak integration, PKCE và token lifecycle |
| JPA / Hibernate | — | `spring-jpa-persistence-context` | `spring-jpa-fetching-batching-locking`<br>`spring-postgresql-production-boundary` | ✓/✓/✓ | Một phần | Thiếu ORM/JPA basic, mapping ownership/cascade/entity lifecycle thành lộ trình nhập môn | Thêm basic trước persistence-context internals |
| N+1 | — | `jpa-n-plus-one` | `spring-jpa-fetching-batching-locking` | ✓/✓/✓ | Khá | Cần query-count testing, pagination/fetch-join và production detection sâu hơn | Enrich lesson hiện có, không tạo bản N+1 trùng |
| SQL | `relational-database`<br>`sql-logical-processing-joins` | `sql-keyset-pagination`<br>`sql-cte-window-analytics`<br>`database-query-plan`<br>`composite-covering-index-explain` | `database-slow-api-investigation` | ✓/✓/✓ | Khá | Cần bài tập và phân biệt dialect rõ hơn | Bổ sung scenario query tuning theo vendor |
| Database Design | `normalization-denormalization` | `transactions-mvcc-deadlocks`<br>`composite-covering-index-explain` | `database-replication-sharding-decisions`<br>`database-engine-tradeoffs` | ✓/✓/✓ | Khá | ER modeling, constraint, migration/evolution chưa thành lesson riêng | Thêm schema design và migration safety |
| MySQL | `relational-database` | `mysql-innodb-clustered-secondary-indexes` | `mysql-innodb-locks-replication`<br>`database-engine-tradeoffs` | ✓/✓/✓ | Một phần | Basic hiện là lesson SQL dùng chung, chưa có MySQL operational basics | Bổ sung InnoDB transaction/index foundation |
| PostgreSQL | `relational-database` | `postgresql-planner-statistics`<br>`postgresql-index-types-jsonb` | `postgresql-mvcc-vacuum-bloat`<br>`postgresql-partitioning-operations`<br>`spring-postgresql-production-boundary` | ✓/✓/✓ | Khá | Thiếu backup/restore, replication/failover chuyên sâu | Tiếp tục batch database production |
| Oracle | `relational-database` | `transactions-mvcc-deadlocks`<br>`composite-covering-index-explain` | `oracle-undo-read-consistency-optimizer`<br>`database-engine-tradeoffs` | ✓/✓/✓ | Một phần | Chỉ có một lesson Oracle-specific | Bổ sung locking, optimizer và operations khi đến batch Oracle |
| MongoDB | `mongodb-document-model` | `mongodb-indexes-aggregation-performance` | `mongodb-replica-set-consistency-transactions`<br>`mongodb-sharding-schema-operations` | ✓/✓/✓ | Khá | Cần thêm troubleshooting/runbook và security | Review sau nhóm relational priority |
| Redis | `redis-data-structures-expiration` | `redis-cache-aside`<br>`redis-hot-big-key-latency`<br>`redis-streams-pubsub` | `redis-cache-consistency-stampede`<br>`redis-persistence-ha-cluster`<br>`redis-distributed-locks-leases-redlock`<br>`redis-coordination-rate-limiting` | ✓/✓/✓ | Khá | Basic mỏng; flashcard còn thiên về mục tiêu bài; cần runbook hit-ratio drop/outage | Enrich basic và scenario, tránh lặp cache-aside |
| Kafka | — | `kafka-delivery`<br>`kafka-kraft-partitions-ordering`<br>`kafka-broker-storage-replication`<br>`kafka-producer-durability-batching`<br>`kafka-schema-dlq-replay` | `kafka-capacity-retention-operations`<br>`kafka-consumer-lag-rebalance-operations`<br>`kafka-transactions-outbox`<br>`kafka-vs-rest-message-queue` | ✓/✓/✓ | Một phần | Không có basic; topic/partition/group/offset bắt đầu ở advanced | Chuyển hoặc viết foundation basic rồi audit hot partition/lag |
| Transactional Outbox | — | — | `transactional-outbox`<br>`kafka-transactions-outbox` | ✓/✓/✓ | Một phần | Thiếu progression; polling claim, CDC offset, cleanup và inbox cần sâu hơn | Enrich hai lesson, giữ rõ exactly-once boundary |
| WebSocket / STOMP | `realtime-protocols` | `angular-api-contracts` | `system-design-chat` | ✓/✓/✓ | Một phần | Chưa có lesson STOMP/Spring broker relay, authorization, ordering và drain chuyên sâu | Thêm WebSocket/STOMP production lesson và nối event-driven roadmap |
| TypeScript | — | — | — | —/△/— | Thiếu | Chưa có lesson TypeScript trực tiếp dù có câu hỏi rải rác | Tạo type system, narrowing, generics và runtime-boundary series |
| Angular | `angular-component-lifecycle` | `angular-dependency-injection`<br>`angular-signals`<br>`angular-feature-workflow`<br>`angular-router-state-loading`<br>`angular-validation-design`<br>`angular-change-detection-performance`<br>`angular-testing-performance` | `angular-state-management-ngrx-decision` | ✓/✓/✓ | Khá | Cần audit discoverability và tránh dồn nhiều concern ở advanced | Review version Angular và roadmap frontend |
| RxJS | — | `rxjs-stream-resilience`<br>`angular-http-rxjs` | — | ✓/△/✓ | Một phần | Thiếu basic Observable/operator mental model và extended production patterns | Thêm basic trước resilience |
| Angular Signals | — | `angular-signals`<br>`angular-change-detection-performance` | `angular-state-management-ngrx-decision` | ✓/△/✓ | Một phần | Chưa có basic signals/effect/computed progression | Enrich hoặc re-level sau audit Angular |
| Micro Frontend / Native Federation | — | — | — | —/—/— | Thiếu | Không có lesson, interview hay flashcard trực tiếp | Tạo foundations, runtime sharing, routing, deployment và failure isolation |
| Git / GitHub | — | — | — | —/—/— | Thiếu | CI/CD không thay thế kiến thức Git branching/rebase/conflict/PR | Tạo Git foundations và GitHub collaboration |
| Docker | `docker-production` | `docker-network-storage-isolation` | `docker-kubernetes-deployment-decision`<br>`jvm-container-resources` | ✓/✓/✓ | Khá | Cần image/cache/build provenance và runtime troubleshooting sâu hơn | Rà cùng supply-chain batch |
| Postman | — | — | — | —/—/— | Thiếu | Chưa có collection/environment/test/CLI workflow | Tạo supporting topic ở batch 14 |
| Kubernetes | — | `kubernetes-reconciliation`<br>`kubernetes-production-troubleshooting` | `kubernetes-safe-rollouts`<br>`docker-kubernetes-deployment-decision` | ✓/✓/✓ | Một phần | Thiếu basic Pod/Deployment/Service/Config/Secret progression | Tạo foundation trước troubleshooting |
| CI/CD | `cicd-pipeline` | `cicd-gitops-deployment-strategies` | `secure-cicd-supply-chain` | ✓/✓/✓ | Khá | Cần ví dụ quality gates, rollback evidence và secretless auth | Review cùng GitHub Actions hiện hành |
| Architecture | `source-code-architecture` | `scaling-load-balancing-reverse-proxy` | `modular-monolith-hexagonal-ddd`<br>`technology-decision-evidence`<br>`api-gateway-bff-service-mesh`<br>`api-contracts-rest-grpc-events` | ✓/✓/✓ | Khá | Cần cross-link decision records, patterns và operational constraints | Chuẩn hóa roadmap architecture |
| SOLID | `source-code-architecture` | — | — | ✓/△/✓ | Một phần | Chỉ được bao phủ như một phần architecture, chưa có ví dụ/trade-off riêng | Thêm SOLID theo failure/coupling, tránh học thuộc acronym |
| Design Patterns | — | — | — | —/△/— | Thiếu | Chưa có lesson patterns trực tiếp | Tạo pattern theo problem/constraint; không làm catalog học thuộc |
| CQRS | — | — | `cqrs-event-driven` | ✓/✓/✓ | Một phần | Thiếu foundation và projection/rebuild/runbook theo progression | Enrich lesson và liên kết outbox/schema evolution |
| Monolith / Modular Monolith / Microservices | — | — | `modular-monolith-hexagonal-ddd`<br>`microservices-boundaries` | ✓/✓/✓ | Một phần | Thiếu basic comparison và migration decision | Thêm progression, nhấn mạnh khi không nên dùng microservices |
| Distributed Systems | — | `distributed-load-balancing-service-discovery` | `distributed-failures`<br>`cap-replication-sharding`<br>`distributed-time-clocks-ordering`<br>`distributed-consensus-leader-election`<br>`idempotency-retry-circuit-breaker`<br>`saga-distributed-transactions`<br>`transactional-outbox` | ✓/✓/✓ | Một phần | Không có basic; `distributed-failures` còn ngắn so với vai trò foundation | Enrich failure model và tạo nhập môn trước internals |
| Security | `security-fundamentals` | `secrets-authorization-boundaries`<br>`tls-https-certificate-operations`<br>`spring-security-oauth2-jwt`<br>`angular-security-xss-trusted-types` | `threat-modeling-web-api`<br>`oauth2-oidc-jwt-security`<br>`spring-security-policy-boundaries`<br>`secure-cicd-supply-chain` | ✓/✓/✓ | Khá | Cần API abuse, SSRF, dependency/supply-chain và operational response liên kết rõ | Audit OWASP/ASVS freshness |
| Performance | — | `performance-diagnosis`<br>`load-testing-capacity-model`<br>`angular-change-detection-performance` | `high-concurrency`<br>`overload-control-backpressure`<br>`java-performance-jfr-jmh-diagnostics` | ✓/✓/✓ | Một phần | Không có basic; diagnosis và high-concurrency foundation còn mỏng | Enrich evidence-first troubleshooting và workload model |
| Observability | — | `observability`<br>`sli-slo-alert-design`<br>`otel-context-propagation` | `spring-production-actuator-resources` | ✓/✓/✓ | Một phần | Chưa có basic; cần log design, cardinality, sampling và incident workflow | Thêm foundation rồi liên kết troubleshooting |
| Resilience | — | — | `idempotency-retry-circuit-breaker`<br>`overload-control-backpressure`<br>`distributed-failures`<br>`multi-region-disaster-recovery` | ✓/✓/✓ | Một phần | Thiếu basic/advanced, bulkhead/deadline/degradation progression | Enrich scenario downstream timeout và retry storm |
| Scalability | — | `scaling-load-balancing-reverse-proxy`<br>`distributed-load-balancing-service-discovery` | `cap-replication-sharding`<br>`database-replication-sharding-decisions` | ✓/✓/✓ | Một phần | Thiếu scale-up/down foundation và capacity trigger | Nối capacity, load test, stateful/stateless và cost |
| High Concurrency | — | `load-testing-capacity-model` | `high-concurrency`<br>`overload-control-backpressure` | ✓/✓/✓ | Một phần | Thiếu foundation; cần flash-sale/hotspot scenario end-to-end | Enrich bounded resources, fairness và graceful degradation |
| System Design | `system-design-method` | `system-design-url-shortener` | `system-design-chat`<br>`system-design-file-storage`<br>`system-design-news-feed`<br>`system-design-notification`<br>`system-design-payment-ledger`<br>`system-design-job-scheduler`<br>`system-design-search-autocomplete`<br>`system-design-rate-limiter` | ✓/✓/✓ | Khá | Thiếu lesson E-commerce/Order/Inventory/Flash Sale và logging pipeline | Thêm case còn thiếu, mọi con số phải gắn assumption |
| Capacity Planning | `system-design-method` | `load-testing-capacity-model` | `kafka-capacity-retention-operations`<br>`database-connection-pool-capacity` | ✓/✓/✓ | Một phần | Storage/bandwidth/cache memory/partition budget chưa thành lộ trình riêng | Enrich worksheet và assumption sensitivity |
| Large-scale Systems | `system-design-method` | `scaling-load-balancing-reverse-proxy`<br>`distributed-load-balancing-service-discovery` | `high-concurrency`<br>`multi-region-disaster-recovery`<br>`cap-replication-sharding`<br>`overload-control-backpressure` | ✓/✓/✓ | Một phần | Chưa có roadmap progression riêng từ estimate đến multi-region failure | Nối capacity → bottleneck → resilience → DR |

## Coverage phỏng vấn và flashcard

Artifact interview hiện có coverage mạnh ở Java (50), Spring (43), JPA/Hibernate (35), SQL (31), Kafka (31), Redis (26), Distributed Systems (23), System Design (23), Microservices (21), Angular (16) và Security (14). Các nhóm chưa có category trực tiếp gồm TypeScript, RxJS, Git/GitHub, Postman, Native Federation và Design Patterns.

Sau Batch 1, `flashcards.json` có 1.231 card nhưng count không đồng nghĩa chất lượng. Bốn lesson mới và lesson Collections đã dùng card về mechanism, constraint, failure mode và decision; các domain còn lại vẫn cần thay dần card kiểu “mục tiêu cốt lõi của bài là gì”, khoảng 2–6 card hữu ích cho lesson quan trọng.

## Mapping theme phỏng vấn bắt buộc

| Cụm theme | Lesson nền | Interview đại diện / trạng thái |
| --- | --- | --- |
| Java pass-by-value; `==`/`equals`; HashMap | `java-language-types-values-parameters`, `java-object-contracts`, `java-hashmap-internals` | `java-pass-by-value-reference`, `java-equals-hashcode-contract`, `q-hashmap-contract`; các câu đã được nối tới lesson mới |
| `volatile`; synchronized/Lock; race/deadlock | `java-memory-model-locks-atomics`, `java-concurrency` | `java-volatile-vs-atomic`, `java-deadlock-detection` |
| GC và JVM diagnosis | `java-jvm-memory`, `java-jvm-gc-profiling` | `java-gc-generations`, `java-heap-stack-frame` |
| IoC/DI; bean lifecycle/scopes | `spring-ioc-bean-lifecycle` | `q-spring-ioc-junior`, `spring-bean-lifecycle`, `spring-bean-scopes` |
| Controller/request lifecycle; MVC vs WebFlux | `spring-mvc-request-lifecycle`, `spring-mvc-webflux` | `spring-mvc-dispatcherservlet-flow`, `q-mvc-webflux`, `spring-webflux-event-loop-blocking`; thiếu câu riêng `@RestController` vs `@Controller` |
| `@Transactional`, self-invocation, propagation/isolation | `spring-aop-transactions`, `spring-transaction-failure-playbook` | `q-spring-self-invocation`, `spring-transaction-rollback-rules`, `spring-transaction-isolation` |
| Authentication/Authorization; JWT; 401/403 | `security-fundamentals`, `oauth2-oidc-jwt-security`, `spring-security-policy-boundaries` | `security-jwt-signed-not-encrypted`, `spring-security-filter-chain`; thiếu câu 401 vs 403 trực tiếp |
| Persistence Context; LAZY/EAGER; N+1 | `spring-jpa-persistence-context`, `jpa-n-plus-one` | `jpa-entitymanager-role`, `jpa-lazy-proxy-boundary`, `q-n-plus-one` |
| Fetch Join/EntityGraph; optimistic/pessimistic lock | `jpa-n-plus-one`, `spring-jpa-fetching-batching-locking` | `q-jpa-locking-pagination`, `jpa-optimistic-version`, `jpa-pessimistic-lock` |
| ACID; isolation; MVCC; composite index | `relational-database`, `transactions-mvcc-deadlocks`, `composite-covering-index-explain` | `sql-acid-practical`, `spring-transaction-isolation`, `q-composite-index-order` |
| Redis cache-aside/stampede/outage | `redis-cache-aside`, `redis-cache-consistency-stampede` | `redis-cache-aside-flow`, `redis-outage-cache-fallback`, `redis-hot-big-key` |
| Kafka partition/order/group/lag/hot partition | `kafka-delivery`, `kafka-consumer-lag-rebalance-operations` | `q-kafka-partition-junior`, `kafka-key-partition-order`, `kafka-lag-diagnosis` |
| Kafka exactly-once; idempotent consumer; Outbox | `kafka-transactions-outbox`, `transactional-outbox` | `q-exactly-once`, `kafka-producer-idempotence`, `q-outbox` |
| WebSocket vs SSE; deploy drain | `realtime-protocols`, `system-design-chat` | `network-websocket-sse-polling`, `network-websocket-heartbeat-drain` |
| Monolith/microservices; khi không dùng microservices; CQRS | `microservices-boundaries`, `cqrs-event-driven` | `microservice-boundary-signal`, `q-cqrs-projection`; cần câu trực tiếp “khi không dùng microservices” |
| Timeout/retry/circuit breaker; retry storm/cascade | `idempotency-retry-circuit-breaker`, `overload-control-backpressure` | `q-retry-storm-idempotency`, `microservice-retry-storm`, `distributed-partial-failure-deadline` |
| Connection pool; p95/p99; evidence-first diagnosis | `database-connection-pool-capacity`, `performance-diagnosis` | `performance-db-pool-size`, `q-p99-diagnosis` |
| Stateless scale; load balancing; rate limiting; sharding | `scaling-load-balancing-reverse-proxy`, `system-design-rate-limiter`, `cap-replication-sharding` | `network-load-balancer-l4-l7`, `q-rate-limiter-design`, `q-cap-sharding` |
| Hot key/partition; graceful degradation | `redis-hot-big-key-latency`, `kafka-consumer-lag-rebalance-operations`, `overload-control-backpressure` | `redis-hot-big-key`, `kafka-key-partition-order`; thiếu câu graceful degradation trực tiếp |
| Bắt đầu câu trả lời System Design | `system-design-method` | `q-system-design`, `system-design-requirements-capacity` |

## Trạng thái batch

| Batch | Phạm vi | Trạng thái | Điều kiện đóng batch |
| --- | --- | --- | --- |
| 1 | Audit + coverage matrix + Java/JVM/Collections/Concurrency | **Hoàn thành 2026-09-26** | 148 lesson / 383 interview / 1.231 flashcard / 433 source; validate, link check, lint, test và production build được ghi ở checkpoint |
| 2–5 | Spring; REST/Security; JPA; SQL và relational vendors | Chờ | Đi theo priority, không viết đè lesson tốt |
| 6–7 | Redis/MongoDB; Kafka/Outbox/WebSocket | Chờ | Có runbook outage/lag/hotspot và production transport |
| 8–11 | Architecture; Distributed Systems; Performance; System Design | Chờ | Có failure model, capacity, case còn thiếu và roadmap link |
| 12–13 | Frontend; Git/Docker/Kubernetes/CI-CD/Postman | Chờ | Lấp các domain đang `Thiếu`, kiểm tra version hiện hành |
| 14–15 | Interview/flashcard audit; consistency/source/final validation | Chờ | Dedupe, rubric chất lượng, link freshness, lint/test/prod build đạt |

## Resume queue

1. Bắt đầu Batch 2: Spring Core/Boot/MVC/Transactions; ưu tiên `spring-boot-startup-embedded-server`, sau đó enrich MVC argument/return/file-upload boundary nếu audit xác nhận không trùng.
2. Batch 3–5 tiếp tục REST/Security/OAuth/Keycloak, JPA/Hibernate/N+1 và SQL/relational vendors theo priority; ứng viên sớm của JPA là association ownership và query/bulk-context.
3. Sau mỗi nhóm nhỏ, chạy `npm run content:validate` và `npm run content:build`; review `lessons.json`, `interview.json`, `flashcards.json`, `search-index.json`, `roadmaps.json` và `content-stats.json`.
4. Cập nhật ma trận bằng ID thực đã compile; không ghi ID dự kiến.
5. Ghi ngày review và phiên bản cho nguồn nhạy version. Chạy link checker ở checkpoint phù hợp; không suy diễn `0 warnings` là mọi URL đều hợp lệ.
6. Trước khi đóng batch, chạy lint, test và production build với base href GitHub Pages hiện hành; ghi kết quả thật, không kế thừa kết quả từ snapshot cũ.

## Checkpoint cần ghi sau mỗi batch

```text
Ngày/commit hoặc worktree:
Batch và domain:
Markdown tạo mới/cập nhật:
Lesson IDs mới:
Interview/flashcard thêm hoặc sửa:
Nguồn mới và phiên bản:
content:validate:
content:build:
lint/test/production build:
Generated counts sau batch:
Gap còn lại và file tiếp theo:
```

## Checkpoint Batch 1 — hoàn thành 2026-09-26

| Hạng mục | Kết quả |
| --- | --- |
| Domain | Java core, Generics, Collections/HashMap, Concurrency/Executors, JVM/GC audit |
| Lesson mới | `java-language-types-values-parameters`, `java-generics-erasure-variance`, `java-hashmap-internals`, `java-executors-thread-pools` |
| Lesson cập nhật | `java-collections-generics`; bổ sung prerequisite cho `java-object-contracts` và `java-jvm-memory` |
| Điều hướng | Java roadmap có đủ bốn lesson mới; các câu interview liên quan pass-by-value, boxing, generics, HashMap và executor trỏ tới lesson mới |
| Delta level | `basic` +1, `advanced` +3, `extended` +0 |
| Delta artifact | Lesson +4, interview +0, flashcard +46, source URL duy nhất +26 |
| Artifact cuối | 148 lesson: 21 basic / 65 advanced / 62 extended; 383 interview; 1.231 flashcard; 433 source; 0 content warning |
| Source check | `npm run content:check-links` đạt, kiểm đủ 433 URL khi chạy ngoài network sandbox |
| Validate/build content | `npm run content:validate` và `npm run content:build` đạt; 7 artifact deterministic |
| Lint | `npm run lint` đạt |
| Test | 18 content-pipeline tests và 63 Angular tests đạt; 16 test files |
| Production build | Đạt với `--configuration production --base-href /it-knowledge/`; còn cảnh báo tối ưu CommonJS/AMD từ Mermaid dependencies, không phải content error |
| Dist inspection | `<base href="/it-knowledge/">`; đủ lessons/interview/flashcards/search/roadmaps/manifest/stats trong `dist/it-learning-platform/browser/generated/`; bốn lesson mới xuất hiện trong lessons/search và Java roadmap |
| Gap Batch 1 còn lại | Basic Thread/Runnable/Callable, packages/access modifiers/enum và collector/version runbook có thể bổ sung sau các domain backend ưu tiên cao hơn |
| Batch kế tiếp | Batch 2 — Spring Core/Boot/MVC/Transactions; bắt đầu bằng startup/embedded-server flow sau duplicate audit |
