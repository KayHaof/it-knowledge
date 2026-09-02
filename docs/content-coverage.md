# Ma trận độ phủ nội dung

> Audit cuối: 2026-09-02. Số liệu được đọc từ Markdown nguồn và `public/generated/*.json` sau khi chạy validator/indexer. Lesson-count signals trong yêu cầu được dùng để phát hiện breadth gap, không dùng làm quota tạo filler.

## Baseline trước khi mở rộng

- 27 lesson Markdown, 14 câu phỏng vấn và 5 roadmaps.
- Phân bố level: 2 Beginner, 10 Intermediate, 10 Advanced, 5 Senior.
- 45 source references, 41 URL duy nhất; 11/27 bài chỉ có một nguồn.
- Không có duplicate `id`/`slug` hoặc relation ID hỏng.
- 17/27 bài dưới 350 indexed words; nhiều bài mới dừng ở overview và thiếu failure/troubleshooting/production depth.
- Khoảng trống lớn nhất: Java platform/JVM/concurrency, Spring Core/Boot/Security/JPA, SQL và vendor internals, Redis/Kafka operations, Angular/RxJS production, distributed systems, security, DevOps/observability và System Design cases.

## Kết quả tổng thể

| Chỉ số | Baseline | Sau mở rộng | Thay đổi |
|---|---:|---:|---:|
| Lesson Markdown / generated lessons | 27 | 144 | +117 |
| Search documents | 27 | 144 | +117 |
| Beginner | 2 | 5 | +3 |
| Intermediate | 10 | 23 | +13 |
| Advanced | 10 | 54 | +44 |
| Senior | 5 | 62 | +57 |
| Interview questions | 14 | 76 | +62 |
| Roadmaps | 5 | 12 | +7 |
| Roadmap steps | Chưa ghi baseline | 245 | — |
| Lessons được roadmap bao phủ | Chưa ghi baseline | 143/144 | Chỉ còn Flutter Tier 3 |
| System Design lessons | 3 | 10 | +7 |
| System Design case studies | 2 | 9 | +7 |
| Source references trong lessons | 45 | 513 | +468 |
| URL lesson-source duy nhất | 41 | 401 | +360 |
| Bài dưới 350 indexed words | 17 | 12 | -5 |

Search index có khoảng **151.268 whitespace tokens**, median **1.091 tokens/bài**. Có 122/144 bài đạt ít nhất 700 tokens và 86/144 bài đạt ít nhất 1.000 tokens. Đây là chỉ báo phát hiện bài mỏng, không thay thế review correctness hoặc chất lượng sư phạm.

## Ma trận category × level

| Category | Beginner | Intermediate | Advanced | Senior | Tổng |
|---|---:|---:|---:|---:|---:|
| architecture | 0 | 1 | 1 | 10 | 12 |
| backend | 2 | 10 | 11 | 11 | 34 |
| database | 2 | 2 | 8 | 8 | 20 |
| devops | 0 | 2 | 7 | 4 | 13 |
| distributed-systems | 0 | 0 | 2 | 7 | 9 |
| frontend | 0 | 2 | 11 | 1 | 14 |
| messaging | 0 | 1 | 5 | 3 | 9 |
| mobile | 1 | 0 | 0 | 0 | 1 |
| nosql | 0 | 2 | 4 | 6 | 12 |
| performance | 0 | 0 | 2 | 2 | 4 |
| security | 0 | 1 | 2 | 2 | 5 |
| system-design | 0 | 1 | 1 | 8 | 10 |
| testing | 0 | 1 | 0 | 0 | 1 |
| **Tổng** | **5** | **23** | **54** | **62** | **144** |

Advanced/Senior đã trở thành trọng tâm đúng với mục tiêu production và interview. Điểm yếu rõ ràng là progression đầu vào: chỉ 5 bài Beginner; nhiều curriculum giả định người học đã có nền tảng lập trình/web/database.

## Ma trận năng lực sau mở rộng

Ký hiệu: ✅ có learning tree/depth đáng kể; ⚠️ có nội dung tốt nhưng còn gap; ❌ chưa có độ phủ đáng kể.

| Domain | Beginner | Intermediate | Advanced | Senior | Interview | Production | Trạng thái / bằng chứng |
|---|---:|---:|---:|---:|---:|---:|---|
| Java / JVM | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong — platform/bytecode/class loading, object/string/collections, exceptions/IO, JMM/locks, concurrent collections, virtual threads, GC/JFR/JMH |
| Spring / JPA / Hibernate | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong — IoC/proxy/config/MVC/WebFlux/Security/testing/transactions, persistence context, fetching/locking, Redis/Kafka/Kubernetes integration |
| Angular / RxJS | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong nhưng top-heavy — DI/lifecycle/forms/router/HTTP, Signals/RxJS, change detection, SSR/hydration, state/NgRx, XSS/Trusted Types |
| SQL / relational database | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong — logical SQL, CTE/window, MVCC/locks, plans/indexes, keyset pagination, pools, slow-API runbook, replication/sharding |
| PostgreSQL / MySQL / Oracle | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | PostgreSQL sâu nhất; MySQL InnoDB và Oracle undo/optimizer có bài vendor-specific nhưng breadth chưa cân bằng |
| Redis | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong — structures/TTL, persistence/HA/Cluster, cache consistency/stampede, hot/big keys, Streams/PubSub, leases/fencing/Redlock |
| Kafka | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong — KRaft/log/replication, producer durability, consumer lag/rebalance, schema/DLQ/replay, transactions/outbox, capacity/retention |
| MongoDB | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Expanded — document model, indexes/aggregation, replica/read-write concerns/transactions, sharding operations |
| Architecture / microservices | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong — modular monolith/DDD, boundaries, CQRS, API contracts, gateway/BFF/mesh, scale/load balancing, schema evolution, multi-region DR |
| Distributed systems | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | Partial/top-heavy — CAP, replication/sharding, clocks/order, consensus/leader election, saga/outbox, idempotency/resilience; thiếu entry-level bridge |
| Performance / concurrency | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | Strong cross-domain — JVM/concurrency, query/pool, load model, overload/backpressure và p99 diagnosis |
| Security | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong cross-domain — web controls, OAuth2/OIDC/JWT, secrets/authorization, threat modeling, TLS/PKI, Spring/Angular/supply chain |
| Docker / Kubernetes / CI-CD | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Strong — container isolation/JVM resources, K8s rollout/troubleshooting, GitOps, supply chain, Linux/container debugging; autoscaling/policy còn mỏng |
| Observability | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Logs/metrics/traces, OpenTelemetry context, SLI/SLO/alerts và incident troubleshooting |
| Realtime / networking | ❌ | ✅ | ✅ | ⚠️ | ✅ | ✅ | WebSocket/SSE/long polling đã được đào sâu; TCP/DNS/HTTP internals vẫn phân tán trong API/TLS/load-balancing lessons |
| Testing | ❌ | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ | Một foundation lesson sâu + Spring/Angular/contract/performance tests; chưa thành learning tree riêng |
| System Design | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Method + 9 cases: URL Shortener, Chat, Rate Limiter, File Storage, News Feed, Notification, Payment Ledger, Autocomplete, Job Scheduler |
| Flutter / mobile | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Weak, giữ backlog Tier 3; không dùng tài nguyên Tier 1 để tạo filler |

## Đối chiếu lesson-count signals

Cách đếm dưới đây ưu tiên lesson chuyên biệt, ID/prefix/category và các integration lesson có chủ đề chính rõ ràng. Việc một case chỉ nhắc một công nghệ không tự được tính.

| Curriculum signal | Độ phủ đếm được | Signal | Audit |
|---|---:|---:|---|
| Java / JVM | 17 | 15+ | Đạt; gồm 16 bài Java trực tiếp và JVM/container production |
| Spring / JPA / Hibernate | 19 | 15+ | Đạt; gồm Spring Core/Boot/MVC/Security/testing/data và JPA chuyên biệt |
| Angular / RxJS | 14 | 12+ | Đạt; đã có một bài Senior về state-management decision |
| SQL / database / optimization | 20 | 20+ | Đạt trực tiếp theo category database |
| Redis | 9 | 8+ | Đạt khi tính 8 bài Redis trực tiếp và Spring/Redis integration |
| Kafka | 10 | 10+ | Đạt khi tính Kafka trực tiếp, Spring/Kafka integration và decision guide |
| Architecture / microservices | 12 | 12+ | Đạt trực tiếp theo category architecture |
| Distributed systems | 9 trực tiếp | 12+ | Chưa đạt bảo thủ; Job Scheduler, multi-region DR và payment workflow bổ trợ nhưng không được dùng để làm đẹp số |
| Docker / K8s / CI-CD / observability | 14 | 15+ | Gần đạt; còn thiếu một learning branch rõ về autoscaling/capacity/policy |
| Security | 9 | 10+ | Gần đạt; đếm 5 security lessons + Spring Security, Angular security và supply-chain |
| Performance / concurrency | 11 | 10+ | Đạt bằng mapping trực tiếp performance + Java/JVM concurrency/profiling |
| System Design | 10 | 10+ | Đạt: một method và chín case end-to-end |

Phần lớn numeric signals đã đạt hoặc rất gần, nhưng không vì vậy gắn nhãn “complete”. Distributed systems, DevOps và security vẫn còn conceptual boundaries đáng viết; progression Beginner cũng chưa cân bằng.

## Interview, roadmap và discovery

- **76/76** câu phỏng vấn có schema đầy đủ, `relatedLesson` hợp lệ và source references sau bước inheritance từ lesson.
- Difficulty: 7 Junior, 18 Middle, 41 Senior, 10 System Design.
- 22 nhóm câu hỏi; nhóm lớn gồm System Design 8, Java 7, Spring 7, Kafka 7, Distributed Systems 6, Redis/Security/Angular 5 mỗi nhóm.
- **12 roadmaps, 245 steps**, không duplicate lesson ID trong cùng roadmap và không dangling ID.
- Roadmaps bao phủ **143/144** bài; ngoại lệ duy nhất là `flutter-foundations` thuộc Tier 3.
- Inline Markdown renderer hỗ trợ an toàn `**bold**` và `` `inline code` `` trong paragraph/list/table/callout; không cần raw HTML.
- Search ranking đã được bổ sung bonus cho exact phrase và tài liệu chứa đủ mọi query terms; test regression bảo vệ multi-term ranking.

### Search quality audit

| Query | Kết quả đứng đầu |
|---|---|
| N+1 | `jpa-n-plus-one` |
| volatile | `java-concurrency` |
| HashMap | `java-collections-generics` |
| MVCC | `postgresql-mvcc-vacuum-bloat` |
| EXPLAIN ANALYZE | `composite-covering-index-explain` |
| connection pool | `database-connection-pool-capacity` |
| consumer lag | `kafka-consumer-lag-rebalance-operations` |
| idempotency | `idempotency-retry-circuit-breaker` |
| transactional outbox | `transactional-outbox` |
| cache stampede | `redis-cache-consistency-stampede` |
| backpressure | `java-concurrent-collections-coordination` |
| circuit breaker | `idempotency-retry-circuit-breaker` |
| JWT | `oauth2-oidc-jwt-security` |
| OAuth | `oauth2-oidc-jwt-security` |
| OOMKilled | `jvm-container-resources` |
| p99 | `load-testing-capacity-model` |

Cả 16 truy vấn đều có kết quả hữu ích ở đầu. Search vẫn chạy client-side và giữ các partial-term matches phía sau; đây là lựa chọn chấp nhận được ở 144 documents, nhưng có thể cần inverted index/worker nếu corpus tăng lớn hơn nhiều.

## Source traceability và validation

- 513 source references trong lessons, 401 URL lesson-source duy nhất trên 38 hostname.
- Loại nguồn: 427 official documentation, 23 specifications, 9 standards, 8 Internet standards, 8 official API references, 8 security guidance, 29 primary-vendor references/guidance/whitepapers và 1 best-current-practice. Không có secondary source.
- Link checker tính cả explicit interview sources và đã kiểm tra thành công **407 URL duy nhất**.
- Version-sensitive content được đối chiếu với documentation hiện hành; ví dụ Structured Concurrency được ghi rõ preview, TLS service identity dùng RFC 9525 thay RFC 6125 đã obsolete, Kafka dùng đường dẫn 4.3 và Angular feature có applicability metadata.

Final gates:

| Gate | Kết quả |
|---|---|
| `npm.cmd run content:validate` | PASS — 144 lessons; metadata, relation và source domains hợp lệ |
| `npm.cmd run content:index` | PASS — 144 lessons và 144 search documents |
| `npm.cmd run content:check-links` | PASS — 407 URL được kiểm tra trực tiếp |
| `npm.cmd run lint` | PASS |
| `npm.cmd test` | PASS — 5 test files, 11 tests |
| `npm.cmd run build` | PASS — production output tại `dist/it-learning-platform` |

Build còn cảnh báo optimization bailout do một số dependency CommonJS/AMD bên trong Mermaid (`dayjs`, `fastdom`, `cytoscape-*`, `@braintree/sanitize-url`). Đây không phải lỗi compile/content; nên theo dõi upstream hoặc cấu hình budget/allowlist có chủ đích, không che cảnh báo bằng tuyên bố build hoàn toàn warning-free.

## Các bài legacy còn mỏng

Sau khi mở rộng trực tiếp `realtime-protocols`, `testing-strategy`, `cicd-pipeline`, `observability` và `security-fundamentals`, còn 12 bài dưới 350 indexed tokens:

| Lesson ID | Indexed tokens |
|---|---:|
| flutter-foundations | 172 |
| high-concurrency | 221 |
| kubernetes-reconciliation | 233 |
| docker-production | 236 |
| performance-diagnosis | 244 |
| system-design-method | 250 |
| system-design-chat | 274 |
| relational-database | 283 |
| mongodb-document-model | 287 |
| distributed-failures | 294 |
| system-design-url-shortener | 298 |
| source-code-architecture | 315 |

Các node này đã được bao quanh bởi lessons sâu hơn, nhưng bản thân chúng vẫn là overview. Vòng tiếp theo nên ưu tiên nâng trực tiếp `high-concurrency`, `performance-diagnosis`, `distributed-failures`, `system-design-method` và hai case legacy; Flutter giữ ở Tier 3.

## Gaps và giới hạn còn lại

- Chỉ 5 Beginner lessons; Angular, distributed systems, DevOps, security và performance thiếu entry-level bridge.
- Distributed systems mới có 9 bài trực tiếp; consistency models/quorum, leases/fencing tổng quát và stream-processing time/watermarks còn nên tách sâu.
- Kubernetes autoscaling/network policy/storage/backup và security session/MFA/SSRF/privacy chưa thành các learning branches riêng.
- MySQL và Oracle có độ sâu tốt ở các lát cắt đã viết nhưng chưa rộng bằng PostgreSQL.
- Runnable labs, exercise datasets và benchmark harness tái lập chưa được xây; snippet không được trình bày như bằng chứng benchmark.
- Relation graph hợp lệ về ID và roadmap phủ gần toàn bộ, nhưng prerequisite difficulty vẫn cần human review định kỳ.
- 401 URL lesson-source tạo maintenance burden; link/version drift cần chạy định kỳ trong CI.

## Kết luận

Đợt expansion biến repository từ 27 bài foundation thành 144 bài có trọng tâm internals, failure modes, production troubleshooting, trade-offs, interview và System Design. Mức tăng 117 bài đi kèm source traceability, knowledge graph, 76 câu phỏng vấn và roadmap gần như phủ toàn kho; đây là mở rộng thực chất, không phải nhân số bằng placeholder.

Kho tri thức chưa “hoàn tất”: progression Beginner còn yếu, 11 bài Tier 1/2 legacy vẫn mỏng và ba curriculum signals còn dưới ngưỡng bảo thủ. Các gap được giữ công khai để vòng tiếp theo tiếp tục theo conceptual boundary và evidence thay vì tạo filler.
