# CODEX CONTENT POPULATION PROMPT — OFFICIAL-SOURCE IT KNOWLEDGE BASE

## PURPOSE

Continue working on the CURRENT EXISTING repository.

The content architecture has already been refactored so that Markdown is the authoritative source of technical knowledge. Your task is now to **populate and expand the platform with high-quality technical content researched from official/primary Internet sources**, using the repository's EXISTING Markdown schema, compiler, validators, generated artifacts, routes, interview system, flashcard system, search, and roadmaps.

Do NOT rebuild the application. Do NOT create a parallel content system. Do NOT hardcode technical knowledge into Angular/TypeScript. Do NOT manually maintain generated JSON as source content.

The intended flow is:

```text
Official / Primary Internet Sources
        ↓
Research + verification
        ↓
Paraphrased / synthesized technical knowledge
        ↓
knowledge/**/*.md
        ↓
existing content validator/compiler
        ↓
generated runtime artifacts
        ↓
Angular platform
```

The platform should become a serious study/reference/interview-preparation knowledge base for Backend Engineering, Java/Spring, Databases, Redis, Kafka, realtime communication, Microservices, Distributed Systems, Security, Performance, Scalability, System Design, Angular/TypeScript, Git, Docker, Kubernetes, CI/CD, Postman, observability, troubleshooting, and production engineering.

The final content must help the learner answer not only **what a technology is**, but also **how it works, when to use it, when not to use it, why to choose it over alternatives, trade-offs, common failures, debugging, optimization, scaling, production operation, and interview follow-ups**.

---

# 1. INSPECT THE CURRENT REPOSITORY FIRST

Before creating content, inspect the actual repository and determine the current authoritative implementation for:

- `knowledge/` or the actual knowledge root;
- Markdown front matter;
- allowed `level` values;
- allowed `contentType` values;
- required headings;
- official-source metadata;
- custom Markdown blocks;
- interview-question authoring;
- flashcard authoring;
- roadmaps;
- source registry;
- validators;
- content compiler;
- generated artifacts;
- routes;
- ID/slug rules;
- related/prerequisite validation;
- build commands.

Do NOT assume an earlier architecture prompt is still exactly current. The repository is the source of truth. Adapt this task to the implementation that actually exists.

Do NOT weaken validation just to make new content pass.

---

# 2. CONTENT SOURCE OF TRUTH

All authoritative educational content must be Markdown under the repository's existing knowledge root.

Conceptually the tree should cover domains such as:

```text
knowledge/
├── java/
│   ├── basic/
│   ├── advanced/
│   └── extended/
├── spring/
├── rest-api/
├── spring-security/
├── jpa-hibernate/
├── database/
├── mysql/
├── postgresql/
├── oracle/
├── mongodb/
├── redis/
├── kafka/
├── websocket/
├── typescript/
├── angular/
├── git/
├── docker/
├── kubernetes/
├── cicd/
├── architecture/
├── microservices/
├── distributed-systems/
├── performance/
├── security/
├── observability/
├── testing/
├── system-design/
└── ...
```

If the current repository uses a different but coherent taxonomy, follow the repository instead of duplicating directories.

---

# 3. LEARNING LEVELS

Use the platform's three primary levels:

```text
basic      = Cơ bản
advanced   = Nâng cao
extended   = Mở rộng
```

Interpret them as:

## basic

Core concepts required to use and understand the technology correctly: definitions, mental models, standard APIs, standard workflows, essential examples, and common mistakes.

## advanced

Mechanisms, internals, performance, concurrency, framework/database behavior, non-trivial failure cases, and deeper engineering trade-offs.

## extended

Production, architecture, distributed systems, scalability, resilience, security, observability, troubleshooting, capacity planning, system design, comparative analysis, and senior-level operational concerns.

Use the repository's existing `contentType` metadata to further distinguish production, internals, troubleshooting, performance, security, architecture, system-design, integration, comparison, reference, interview, or similar categories.

---

# 4. OFFICIAL-SOURCE POLICY

This task MUST be research-driven.

Use sources in this priority order:

1. official language/framework/database/product documentation;
2. official specifications and standards;
3. official project/maintainer documentation;
4. official vendor engineering documentation;
5. official cloud/provider architecture documentation where no vendor-neutral specification exists;
6. standards organizations;
7. primary academic papers when useful;
8. high-quality secondary sources only when a primary source cannot adequately support the claim.

Do NOT use random blogs, SEO tutorial sites, content farms, Medium posts, Stack Overflow as authoritative truth, social posts, or unverified summaries as the primary basis of technical content.

If a secondary source is necessary, label it as secondary and cross-check important claims with a primary source.

---

# 5. COPYRIGHT / SYNTHESIS RULE

Do NOT copy large sections from documentation. Do NOT mirror vendor docs verbatim. Do NOT paste long quotations.

Use this process:

```text
research
→ understand
→ cross-check
→ synthesize
→ paraphrase
→ explain in Vietnamese
→ preserve precise English technical terms
→ cite official sources
```

The final Markdown should read like a carefully written engineering study guide, not copied documentation.

---

# 6. PREFERRED OFFICIAL SOURCES

Use and/or extend the repository's official-source registry. Verify current URLs instead of inventing deep links.

## Java / JVM

- `dev.java`
- `docs.oracle.com`
- `openjdk.org`
- official OpenJDK JEP pages

## Spring / Spring Boot / Spring Security / Spring WebSocket

- `spring.io`
- `docs.spring.io`

## Jakarta Persistence / JPA / Hibernate

- `jakarta.ee`
- official Jakarta Persistence specification
- `hibernate.org`
- current official Hibernate ORM documentation

## HTTP / REST / Web

- `rfc-editor.org`
- `ietf.org`
- relevant HTTP RFCs
- `developer.mozilla.org` as a trusted web reference
- Roy Fielding dissertation only where REST architectural constraints are discussed

## Keycloak / OAuth2 / OIDC

- `keycloak.org`
- IETF OAuth RFCs
- OpenID Foundation specifications
- Spring Security docs

## MySQL

- `dev.mysql.com/doc`

## PostgreSQL

- `postgresql.org/docs`

## Oracle Database

- `docs.oracle.com/en/database/`

## MongoDB

- `mongodb.com/docs`

## Redis

- `redis.io/docs`

## Kafka

- `kafka.apache.org/documentation`
- Apache Kafka KIPs when directly relevant

## WebSocket / STOMP

- RFC 6455
- official STOMP specification
- Spring WebSocket/STOMP docs

## TypeScript

- `typescriptlang.org/docs`

## Angular

- `angular.dev`

## RxJS

- official RxJS documentation / repository documentation

## Git / GitHub

- `git-scm.com/docs`
- `docs.github.com`

## Docker

- `docs.docker.com`

## Kubernetes

- `kubernetes.io/docs`

## Postman

- `learning.postman.com`

## Security

- `owasp.org`
- OWASP ASVS
- OWASP Cheat Sheet Series
- relevant IETF/RFC standards

## Observability

- `opentelemetry.io/docs`
- `prometheus.io/docs`
- `grafana.com/docs`

## Large-scale architecture

When no canonical vendor-neutral source exists, use official architecture documentation from major providers as examples, for example AWS Architecture Center / Builders' Library, Google Cloud Architecture Framework, Microsoft Azure Architecture Center, or Cloudflare technical documentation.

Clearly distinguish **general engineering principles** from **provider-specific implementation choices**.

---

# 7. SOURCE VERIFICATION

For every new Markdown file:

- use real URLs;
- verify that URLs resolve;
- prefer stable official documentation URLs;
- avoid invented deep links;
- avoid obsolete docs when current docs exist;
- record applicable versions when behavior is version-sensitive;
- do not present implementation-specific behavior as universal.

If exact behavior differs across versions, explain the difference.

---

# 8. WRITING LANGUAGE

Primary explanation language: **Vietnamese**.

Keep precise English technical terms where useful, for example:

```text
garbage collection
persistence context
dirty checking
backpressure
consumer lag
connection pool
eventual consistency
load shedding
```

The target reader is a Vietnamese software engineer preparing for Fresher/Junior interviews, practical backend work, Intermediate follow-ups, and System Design foundations.

---

# 9. STANDARD LESSON QUALITY

For each substantial topic, explain where relevant:

1. Khái niệm là gì?
2. Mental model.
3. Nó giải quyết vấn đề gì?
4. Cơ chế hoạt động.
5. Thành phần chính.
6. Luồng xử lý.
7. Ví dụ.
8. Khi nào dùng?
9. Khi nào không nên dùng?
10. Ưu điểm.
11. Nhược điểm.
12. Trade-offs.
13. Common mistakes / misconceptions.
14. Debugging / troubleshooting.
15. Performance implications.
16. Security implications.
17. Production considerations.
18. Scaling considerations.
19. So sánh với giải pháp gần nhất.
20. Interview questions.
21. Flashcards.
22. Key takeaways.
23. Official sources.

Do NOT force irrelevant sections into every lesson. Use engineering judgment.

---

# 10. CONTENT GRANULARITY

Do NOT create one giant `java.md` or `backend.md`. Do NOT create hundreds of tiny files containing only one definition.

Create topic-sized lessons with clear scope.

Good examples:

```text
java-object-memory-model.md
java-equals-hashcode.md
java-hashmap-internals.md
java-concurrency-basics.md
java-memory-model-volatile.md
spring-bean-lifecycle.md
spring-transaction-proxy.md
jpa-persistence-context.md
jpa-n-plus-one.md
mysql-index-query-plan.md
redis-cache-aside.md
kafka-consumer-groups.md
transactional-outbox.md
```

Avoid vague names such as `advanced-1.md`, `misc-backend.md`, or `important-things.md`.

---

# 11. AUTHORING PROCESS

For each domain:

```text
audit existing Markdown
↓
build topic coverage matrix
↓
identify missing topics
↓
research official sources
↓
write/update Markdown
↓
add interview blocks
↓
add flashcards
↓
add source metadata
↓
validate
↓
compile
↓
review generated output
```

Never blindly replace high-quality existing content. Prefer enriching and correcting it.

---

# 12. PROGRESS TRACKING

This is a large content task. Create or maintain:

```text
docs/content-generation-progress.md
```

Track:

- domain;
- basic coverage;
- advanced coverage;
- extended coverage;
- files completed;
- files remaining;
- interview coverage;
- flashcard coverage;
- source review status;
- validation status;
- known gaps.

The file must make future Codex sessions resumable instead of restarting from zero.

---

# 13. JAVA / JAVA CORE COVERAGE

Create comprehensive coverage across basic, advanced, and extended levels.

## Core Java

Cover:

- Java ecosystem overview;
- JDK vs JRE vs JVM;
- source → `javac` → bytecode → JVM execution;
- primitive types;
- reference types;
- variables and scope;
- Stack vs Heap mental model;
- local variables;
- object references;
- Java pass-by-value;
- `==` vs `.equals()`;
- `hashCode()`;
- `Object`;
- String;
- String pool;
- immutability;
- wrapper types;
- autoboxing/unboxing;
- null / NullPointerException;
- OOP;
- encapsulation;
- inheritance;
- polymorphism;
- composition;
- abstract class;
- interface;
- records;
- sealed classes where applicable;
- enum;
- packages;
- access modifiers.

## Collections

Cover:

- Array vs Collection;
- Collection hierarchy;
- List;
- ArrayList;
- LinkedList;
- Set;
- HashSet;
- TreeSet;
- Map;
- HashMap;
- LinkedHashMap;
- TreeMap;
- Queue;
- Deque;
- PriorityQueue;
- Iterator;
- fail-fast behavior;
- ConcurrentModificationException;
- equals/hashCode contract.

## Generics

Cover generic classes/methods, bounded type parameters, wildcards, PECS, type erasure, invariance/covariance concepts, and common pitfalls.

## Exceptions

Cover Throwable hierarchy, checked vs unchecked exceptions, Error, try/catch/finally, try-with-resources, custom exceptions, and exception-design practices.

## Functional Java

Cover functional interfaces, lambdas, method references, Stream, lazy evaluation, intermediate/terminal operations, map/filter/reduce, `flatMap`, collectors, parallel stream trade-offs, Optional, `orElse`, `orElseGet`, `orElseThrow`, and Optional misuse.

## Collections internals

Cover HashMap hashing, bucket structure, collision, resize, load factor, treeification, HashSet relationship to HashMap, TreeMap balancing concepts, and ConcurrentHashMap architecture/thread-safety concepts.

## Concurrency

Cover:

- process vs thread;
- Thread;
- Runnable;
- Callable;
- Future;
- Executor;
- ExecutorService;
- ThreadPoolExecutor;
- pool sizing;
- CompletableFuture;
- Virtual Threads;
- `synchronized`;
- monitor concepts;
- `volatile`;
- visibility;
- atomicity;
- ordering;
- Java Memory Model;
- happens-before;
- Atomic classes;
- CAS;
- Lock / ReentrantLock / ReadWriteLock;
- concurrent collections;
- race condition;
- deadlock;
- livelock;
- starvation;
- thread safety;
- safe publication;
- immutable objects in concurrency.

## JVM / Memory / GC

Cover runtime memory areas, heap, thread stacks, stack frames, metaspace, class loading, ClassLoader, object allocation concepts, GC roots, reachability, GC, stop-the-world, generational concepts, G1, ZGC, memory leaks in managed languages, OutOfMemoryError, StackOverflowError, heap dump, thread dump, JFR, JMH, and profiling principles.

## Production Java

Cover CPU-bound vs I/O-bound workloads, thread-pool exhaustion, virtual-thread trade-offs, connection-pool waits, memory/GC pressure, high CPU, deadlock diagnosis, concurrency debugging, production JVM observability, and graceful shutdown concepts.

Use Java/OpenJDK/Oracle primary sources.

---

# 14. SPRING FRAMEWORK / SPRING BOOT

## Spring Core

Cover IoC, Dependency Injection, IoC Container, BeanFactory, ApplicationContext, Bean, Bean lifecycle, singleton/prototype/request/session scopes, constructor/setter/field injection trade-offs, component scanning, `@Component`, `@Service`, `@Repository`, `@Controller`, `@RestController`, `@Configuration`, `@Bean`, `@Primary`, `@Qualifier`, circular dependencies, proxies, and AOP fundamentals.

## Spring Boot

Cover Spring Boot purpose, starters, auto-configuration, conditional configuration, configuration properties, profiles, externalized configuration, embedded server, startup flow, Actuator, graceful shutdown, and production configuration principles.

## Spring MVC

Cover Servlet model, DispatcherServlet, request lifecycle, Filter, Interceptor, Controller, argument resolution concepts, HttpMessageConverter, serialization, DTO, validation, Bean Validation, exception handling, `@ControllerAdvice`, REST response design, file upload basics, and pagination.

## MVC vs WebFlux

Cover blocking vs non-blocking models, Servlet stack, Reactor, Mono, Flux, Reactive Streams, event loop, Netty, backpressure, blocking calls on event loops, JDBC/JPA with WebFlux pitfalls, R2DBC, WebFlux vs MVC trade-offs, and virtual threads vs reactive programming.

## Transactions

Cover `@Transactional`, transaction boundaries, proxy behavior, self-invocation, rollback rules, propagation, isolation, readOnly, service-layer boundaries, transaction + external call risks, and long-running transactions.

Use current Spring official documentation.

---

# 15. RESTFUL API

Create a dedicated domain for HTTP/API design.

Cover:

- resource and URI design;
- GET/POST/PUT/PATCH/DELETE;
- safe methods;
- idempotency;
- status codes;
- request/response headers;
- content type;
- content negotiation;
- statelessness;
- HTTP caching semantics;
- pagination;
- filtering;
- sorting;
- versioning;
- validation errors;
- API error response;
- Problem Details where appropriate;
- idempotency keys;
- ETag / optimistic concurrency concepts;
- rate limiting;
- REST architectural constraints vs common "REST API" usage;
- REST vs RPC;
- REST vs asynchronous messaging.

Use HTTP RFCs and primary sources. Do not present conventions as protocol requirements unless they actually are.

---

# 16. SPRING SECURITY / KEYCLOAK / OAUTH2 / OIDC

Cover authentication, authorization, principal, role, authority, SecurityFilterChain, SecurityContext, AuthenticationManager/AuthenticationProvider concepts, UserDetailsService, PasswordEncoder, password hashing, method security, session-based vs stateless auth, JWT structure, signature vs encryption, access token, refresh token, expiration, revocation trade-offs, bearer tokens, OAuth2 roles, Authorization Code flow, PKCE, OpenID Connect, ID token, Keycloak realm/client/user/role/scope concepts, Spring Resource Server, 401 vs 403, CORS, CSRF, XSS, broken access control, IDOR, secure cookies, TLS, secrets management, and token-storage trade-offs.

Use Spring Security, Keycloak, OAuth/IETF, OpenID Foundation, and OWASP primary sources.

---

# 17. JPA / HIBERNATE

Make this one of the strongest domains.

Cover:

- ORM;
- Jakarta Persistence;
- JPA vs Hibernate;
- EntityManager;
- Persistence Context;
- unit-of-work mental model;
- first-level cache;
- entity lifecycle: transient, managed, detached, removed;
- `persist`;
- `merge`;
- `flush`;
- commit;
- dirty checking;
- entity identity;
- `@Id` and identifier generation;
- OneToOne / OneToMany / ManyToOne / ManyToMany;
- owning/inverse side;
- `mappedBy`;
- join columns / join tables;
- LAZY / EAGER;
- proxies;
- LazyInitializationException;
- cascade;
- orphanRemoval;
- JPQL;
- native query;
- Criteria concepts;
- projection;
- DTO projection;
- EntityGraph;
- fetch join;
- batch fetching;
- optimistic locking / `@Version`;
- pessimistic locking;
- batch insert/update;
- pagination;
- OSIV;
- bulk update behavior;
- persistence-context synchronization;
- query-count testing.

## N+1 Query — required deep coverage

Cover:

- what N+1 means;
- access-pattern origin;
- ORM examples;
- why EAGER is not an automatic fix;
- lazy loading;
- secondary selects;
- JOIN FETCH;
- EntityGraph;
- projection;
- batch fetching;
- query redesign;
- trade-offs;
- pagination + collection fetch issues;
- Cartesian-product risks;
- SQL log/APM/query-count detection;
- regression tests;
- N+1 without ORM, such as JDBC loops, API calls in loops, and remote calls in loops;
- decision matrix for choosing a mitigation.

Use Jakarta Persistence and Hibernate official documentation.

---

# 18. SQL / RELATIONAL DATABASE FUNDAMENTALS

Cover relational modeling, PK/FK, constraints, candidate keys, normalization, 1NF/2NF/3NF concepts, denormalization trade-offs, SELECT, WHERE, JOINs, GROUP BY, HAVING, ORDER BY, aggregate functions, subqueries, correlated subqueries, EXISTS, IN, UNION, UNION ALL, CTE, window functions, NULL semantics, transaction, ACID, isolation, anomalies, locking, deadlocks, and MVCC concepts.

Keep vendor-specific behavior separate from general SQL concepts.

---

# 19. MYSQL / INNODB

Use MySQL official docs and cover:

- MySQL architecture overview;
- InnoDB;
- clustered index concepts;
- secondary indexes;
- B-tree/B+tree mental model;
- composite indexes;
- leftmost-prefix concepts;
- covering indexes;
- selectivity/cardinality;
- optimizer/statistics;
- EXPLAIN / EXPLAIN ANALYZE where applicable;
- full table scan vs index scan;
- sargability;
- transactions;
- InnoDB locking;
- record/gap/next-key locking where relevant;
- MVCC;
- deadlocks;
- isolation behavior;
- connection management;
- slow-query analysis;
- OFFSET vs keyset pagination;
- read replicas;
- replication lag;
- partitioning;
- sharding as an application/system concern;
- schema design for scale.

Do not claim MySQL-specific behavior is universal database behavior.

---

# 20. POSTGRESQL

Use PostgreSQL official docs and cover architecture basics, MVCC, VACUUM/autovacuum, B-tree, Hash, GIN, GiST, BRIN, query planner/statistics, EXPLAIN, EXPLAIN ANALYZE, buffers, index-only scan, sequential scan, nested loop, hash join, merge join, locking, transaction isolation, deadlocks, partitioning, replication, connection considerations, and JSON/JSONB basics where relevant.

---

# 21. ORACLE DATABASE

Use Oracle official docs and cover Oracle architecture basics, transactions, undo, redo, read consistency/MVCC concepts, indexes, optimizer, execution plans, sequences, locking, isolation behavior, partitioning concepts, and connection/session concepts.

Avoid duplicating generic SQL lessons; focus on Oracle-specific behavior and differences.

---

# 22. MONGODB

Use official MongoDB docs and cover document/BSON model, collections, `_id`, embedding vs references, schema design, indexes, compound indexes, query planner concepts, aggregation pipeline, replica sets, replication, sharding, read concern/write concern, transactions, TTL indexes where relevant, and when MongoDB is or is not a good fit compared with relational databases.

---

# 23. REDIS

Make Redis production-oriented.

Cover strings, hashes, lists, sets, sorted sets, Streams, TTL, expiration, eviction, maxmemory, RDB, AOF, replication, Sentinel, Cluster, hash slots, Pub/Sub, atomic commands, transaction concepts, and Lua scripting concepts.

## Caching

Cover cache-aside, TTL strategy, invalidation, hit/miss, stale cache, penetration, stampede, avalanche, hot key, big key, memory pressure, cache warming, cache-aside race conditions, and consistency trade-offs.

## Redis + MySQL

Explain source of truth, invalidation, write ordering, stale data, DB fallback risk, cache failure, and preventing DB overload.

## Distributed lock

Explain lock use cases, atomic acquisition, expiration, ownership tokens, safe release, fencing-token concept, limitations, and when DB constraints/idempotency are better.

Use official Redis docs.

---

# 24. KAFKA

Make Kafka one of the deepest domains.

Cover broker, cluster, topic, partition, record, key, offset, producer, consumer, consumer group, leader, follower/replica, ISR, KRaft, partition assignment, ordering guarantees, lack of global ordering, producer batching, compression, `acks`, retries, idempotent producer, partitioning strategy, and hot partitions.

## Consumers

Cover poll loop, offset, commit, auto/manual commit, consumer group, rebalance, partition ownership, consumer lag, slow consumers, and application backpressure.

## Delivery semantics

Cover at-most-once, at-least-once, duplicates, exactly-once semantics, Kafka transaction scope, `read_committed`, external side effects, and idempotent consumers.

## Operations

Cover replication factor, retention, log compaction, partition count, broker failure, consumer lag, retry/retry topics, DLQ, poison messages, schema evolution concepts, and observability.

## Architecture

Cover Kafka vs REST, Kafka vs traditional queues, Kafka vs Redis Pub/Sub, event-driven architecture, distinction from Event Sourcing, CDC, eventual consistency, choreography vs orchestration concepts.

Use Apache Kafka official docs and KIPs where appropriate.

---

# 25. TRANSACTIONAL OUTBOX

Create a dedicated deep series covering:

- dual-write problem;
- DB commit succeeds but publish fails;
- publish succeeds but DB change fails/rolls back;
- why naive retry is insufficient;
- outbox table;
- writing business row + outbox row in one local transaction;
- polling publisher;
- CDC;
- duplicate publish;
- idempotent consumer;
- event IDs;
- aggregate ordering;
- version/sequence;
- retry;
- poison events;
- cleanup/archival;
- monitoring oldest unpublished event;
- publish latency;
- polling vs CDC;
- Outbox vs Kafka transactions;
- Outbox vs 2PC;
- limitations;
- exactly-once misconceptions.

---

# 26. WEBSOCKET / STOMP / REALTIME

Cover HTTP upgrade/handshake, WebSocket protocol, full-duplex communication, frames, lifecycle, heartbeat, reconnect, authorization, session/connection identity, outbound buffers/backpressure, scaling multiple instances, sticky sessions, shared brokers/message buses, connection draining, and reconnect recovery.

For STOMP cover protocol purpose, frame structure, CONNECT/SEND/SUBSCRIBE/MESSAGE/ACK concepts, destinations, `/ws`, `/app`, `/topic`, `/queue`, Spring `@MessageMapping`, `@SendTo`, `SimpMessagingTemplate`, user destinations, Simple Broker, Broker Relay, authentication, and authorization.

Compare WebSocket with REST, SSE, long polling, Kafka, and Redis Pub/Sub, making clear that these solve different layers/problems.

---

# 27. TYPESCRIPT

Cover structural typing, primitive types, unions, intersections, literal types, interface, type alias, generics, narrowing, type guards, utility types, `unknown` vs `any`, `never`, async/await, Promise, modules, decorators only where current/relevant, type-erasure concepts, and compile-time vs runtime behavior.

Use TypeScript official docs.

---

# 28. ANGULAR / RXJS / SIGNALS / MICRO FRONTEND

Use current Angular official documentation.

Cover components, standalone components, templates, interpolation, property/event/two-way binding, directives, pipes, DI/services, lifecycle, routing, lazy loading, guards, HttpClient, interceptors, Reactive Forms, validation, and RxJS integration.

## RxJS

Cover Observable, Subject, BehaviorSubject, map/filter, switchMap, mergeMap, concatMap, exhaustMap, combineLatest, forkJoin, error handling, subscription lifecycle, and current Angular integration patterns.

## Signals

Cover `signal`, `computed`, `effect`, derived state, Signals vs RxJS responsibilities, and common misuse.

## Change Detection

Cover the mental model, OnPush, immutable update patterns, Signals integration, list tracking, and performance implications.

## Micro Frontend / Native Federation

Cover motivation, boundaries, deployment independence, runtime/build-time federation concepts, Native Federation, shared dependencies, versioning, communication patterns, routing, drawbacks, and distributed-frontend complexity.

Use official Angular and relevant official Native Federation documentation where available.

---

# 29. GIT / GITHUB

Use `git-scm.com` and GitHub docs.

Cover repository, working tree, staging, commit, branch, HEAD, merge, fast-forward, merge commit, rebase, fetch, pull, push, remote, reset, revert, restore, stash, cherry-pick, tags, conflicts, reflog, `.gitignore`, team workflows, safe history rewriting, pull requests, code review, and GitHub Actions fundamentals.

---

# 30. DOCKER / DOCKER DESKTOP

Use Docker official docs.

Cover containers vs VMs, Docker Engine/Desktop, images, containers, registry, Dockerfile, layers, build context, build cache, multi-stage build, COPY/ADD differences where relevant, environment variables, ports, networks, volumes, bind mounts, Docker Compose, resource limits, health checks, non-root containers, image-size optimization, secrets concerns, lifecycle, logging, and production misconceptions.

---

# 31. POSTMAN

Use Postman Learning Center.

Cover request builder, methods, query/path params, headers, body, authorization, environments, variables, collections, scripts, tests, chaining requests, extracting tokens, JWT testing, collection runner, and practical API-testing workflows.

---

# 32. MONOLITH / MODULAR MONOLITH / MICROSERVICES

Create strong architecture coverage.

Explain Monolith, Modular Monolith, Distributed Monolith, and Microservices.

For Microservices cover service boundaries, bounded-context concepts, independent deployment/scaling, team ownership, database-per-service, data ownership, REST/gRPC concepts, asynchronous messaging, API Gateway, Service Discovery, configuration, secrets, versioning, distributed failures, observability, CI/CD, and operational/on-call cost.

Explicitly teach:

> When should you NOT use microservices?

Explain distributed-monolith failure mode and why architecture choice depends on organizational and operational capabilities.

---

# 33. SYNCHRONOUS VS ASYNCHRONOUS COMMUNICATION

Cover request/response, REST, gRPC concepts, messaging, event-driven communication, latency, temporal coupling, availability coupling, retries, timeout, ordering, consistency, failure handling, observability, and workflow implications.

---

# 34. CQRS

Cover command/query separation, simple CQRS vs separate read/write models, read models, write models, event-driven projections, eventual consistency, operational complexity, when useful, when overkill, CQRS vs CRUD, and CQRS vs Event Sourcing.

Do not equate CQRS with Event Sourcing.

---

# 35. SOLID / DESIGN PATTERNS / SOURCE ARCHITECTURE

For SOLID, explain each principle with intent, practical Java example, misuse, and trade-offs.

Cover enterprise-relevant patterns such as Strategy, Factory, Builder, Adapter, Facade, Decorator, Observer, Template Method, Chain of Responsibility, State, and Proxy. Do not teach patterns as mandatory solutions.

Cover Layered Architecture, Clean Architecture concepts, Hexagonal / Ports and Adapters, dependency direction, domain/service/repository boundaries, DTO, mapping, transaction boundaries, package organization, module boundaries, and feature-vs-layer packaging trade-offs.

Cover MapStruct and Lombok using official project documentation, including benefits and build/debugging trade-offs.

---

# 36. SECURITY

Create broad defensive-security content using OWASP and official specifications.

Cover threat-modeling basics, authentication, authorization, least privilege, broken access control, IDOR, password hashing, session security, JWT security, OAuth/OIDC, TLS/HTTPS, CORS, CSRF, XSS, SQL injection, command injection concepts, SSRF, secrets management, secure headers, dependency vulnerabilities, rate limiting, audit logging, sensitive-data logging, input validation, output encoding, file-upload security, API security, and service-to-service authentication concepts.

---

# 37. PERFORMANCE ENGINEERING

Create a dedicated performance domain covering latency, throughput, RPS/QPS, concurrency, p50/p95/p99, averages vs tail latency, CPU, memory, disk/network I/O, blocking/non-blocking, asynchronous processing, queues, thread pools, connection pools, queueing, batching, pagination, caching, serialization, compression, database optimization, N+1, external API latency, GC, load testing, profiling, benchmark methodology, and bottleneck identification.

Teach the principle:

> Optimize based on measurement under representative workloads.

Avoid unsupported universal performance claims.

---

# 38. RESILIENCE PATTERNS

Cover timeout, retries, exponential backoff, jitter, retry budget, retry storm, Circuit Breaker, Bulkhead, Rate Limiting, Load Shedding, backpressure, fallback, stale data, graceful degradation, idempotency, and deduplication.

Explain interactions, for example:

```text
timeout too long
+ retries
+ high concurrency
= cascading-failure risk
```

---

# 39. OBSERVABILITY

Use official OpenTelemetry/Prometheus/Grafana documentation where applicable.

Cover structured logs, log levels, correlation ID, trace ID, metrics, counters, gauges, histograms, latency distributions, traces/spans, distributed tracing, RED method concepts, USE method concepts where appropriate, dashboards, alerts, SLI, SLO, error budgets, OpenTelemetry, Prometheus concepts, and Grafana concepts.

---

# 40. DISTRIBUTED SYSTEMS

Make this a major extended-level domain.

Cover partial failure, unreliable networks, latency, timeouts, retries, duplicate requests, clocks/clock drift, ordering, consistency, availability, CAP, PACELC, eventual consistency, strong-consistency concepts, replication, leader/follower, quorum concepts, leader election, split brain, partitioning, sharding, consistent hashing, idempotency, deduplication, distributed locks, fencing tokens, cross-service transactions, 2PC, Saga, Outbox, CDC, reconciliation, compensating actions, and exactly-once misconceptions.

Prefer primary papers/specifications/official engineering documentation where possible. Clearly distinguish theoretical models from product-specific behavior.

---

# 41. SYSTEMS FOR MILLIONS OF USERS

Create a focused high-scale series.

Teach first:

```text
total registered users
≠ daily active users
≠ peak concurrent users
≠ requests per second
```

Cover requirements clarification, traffic assumptions, RPS/QPS estimation, read/write ratio, request/response sizes, storage growth, bandwidth, concurrency, latency targets, p95/p99, throughput, capacity planning, headroom, and peak traffic.

## Stateless application layer

Cover stateless services, horizontal scaling, Load Balancer, health checks, Auto Scaling, and session externalization.

## Edge

Cover DNS concepts, CDN, caching, static assets, reverse proxy, and TLS termination concepts.

## Caching

Cover browser/client cache, CDN cache, application cache, Redis/distributed cache, invalidation, cache stampede, thundering herd, and hot keys.

## Database scaling

Cover indexes/query optimization first, connection pools, read replicas, replication lag, partitioning, sharding, hot shards, resharding concepts, data locality, and consistency trade-offs.

## Async processing

Cover queues, Kafka, background workers, batch jobs, smoothing traffic spikes, backpressure, and consumer lag.

## Protection

Cover rate limiting, quotas, load shedding, admission control, circuit breakers, and concurrency limits.

## Failure modes

Cover database overload, connection exhaustion, cache outage/stampede, retry storm, consumer lag, hot partition, hot key, downstream timeout, thread-pool exhaustion, memory pressure, GC pressure, cascading failure, single point of failure, noisy neighbor, deployment failure, and dependency outage.

## Graceful degradation

Teach examples such as disabling non-critical recommendations, serving stale cache, reducing expensive enrichment, queueing non-critical work, and protecting critical write paths.

---

# 42. LOAD BALANCING / AUTOSCALING

Create focused lessons on L4 vs L7 conceptual differences, routing, health checks, round-robin/least-connections concepts, sticky sessions, connection draining, stateless services, autoscaling signals, CPU-based scaling limitations, queue-depth scaling, latency-based signals, scaling lag, cold starts, and downstream bottlenecks.

Use official provider docs as concrete examples while keeping general principles vendor-neutral.

---

# 43. RATE LIMITING

Cover fixed window, sliding window log/counter, token bucket, leaky bucket, distributed rate limiting, Redis-based concepts, consistency trade-offs, burst allowance, per-user/per-IP/per-token limits, HTTP 429, `Retry-After`, and rate limiting vs load shedding.

---

# 44. BACKPRESSURE / LOAD SHEDDING

Cover producer-faster-than-consumer scenarios, queue growth, memory growth, latency explosion, bounded queues, rejection, load shedding, drop strategies, retry-after, adaptive-concurrency concepts, and messaging consumer flow control where applicable.

---

# 45. CONNECTION POOLING

Create dedicated content covering why connection pools exist, cost of DB connections, pool size, waiting queues, acquisition timeout, max lifetime, idle timeout, leaks, saturation, why more DB connections can reduce performance, Little's Law intuition where useful, HikariCP concepts in Spring, and monitoring active/idle/pending/acquisition time.

Use HikariCP and database/vendor official docs where appropriate.

---

# 46. FAILURE ANALYSIS PLAYBOOKS

Create troubleshooting-oriented lessons.

## Slow API

Teach investigation flow:

```text
symptom
→ latency breakdown
→ application metrics
→ DB time
→ cache time
→ downstream time
→ CPU/memory
→ thread pool
→ connection pool
→ traces
→ logs
```

## Database overloaded

Cover slow queries, locks, connections, pool saturation, CPU, disk I/O, missing indexes, large scans, retry storms, read traffic, and cache failures.

## Kafka consumer lag

Cover producer rate, consumer throughput, partition count, processing latency, downstream calls, rebalances, failures, and hot partitions.

## Redis latency/outage

Cover network, big/hot keys, eviction, memory, blocking operations, failover, and fallback pressure on DB.

## JVM high CPU

Cover profiling, thread dumps, hot loops, GC, lock contention, serialization, regex, and excessive logging.

## JVM memory growth

Cover heap/GC, retained objects, heap dumps, caches, unbounded collections, ThreadLocal misuse, listeners/subscriptions, and leak diagnosis.

Use official troubleshooting documentation where possible.

---

# 47. INTERVIEW CONTENT

Populate interview questions from the same Markdown knowledge base.

Questions should cover:

```text
What?
Why?
How?
When?
When not?
Trade-offs?
What can fail?
How to debug?
How to optimize?
What changes at scale?
Production scenario?
```

Interview difficulty may remain:

```text
junior
middle
senior
system-design
```

Do not confuse this with lesson levels `basic`, `advanced`, `extended`.

---

# 48. FRESHER / JUNIOR INTERVIEW STYLE

For important questions provide, using the repository's existing interview schema:

- 30-second answer;
- detailed answer;
- common wrong answer;
- follow-up questions;
- production perspective;
- trade-offs;
- official sources;
- related lesson IDs;
- automatic-grading rubric where supported.

The 30-second answer should be concise enough to learn, but technically correct.

---

# 49. ESCALATING INTERVIEW FOLLOW-UPS

Create follow-up chains that deepen the same concept.

Example:

```text
What is N+1?
↓
Why can EAGER still be problematic?
↓
Fetch Join vs EntityGraph?
↓
What happens with pagination?
↓
How do you detect it in production?
↓
How does it affect a high-traffic endpoint?
```

This should support growth from Fresher answers to Intermediate/System Design discussions.

---

# 50. INTERVIEW RUBRICS

Where automatic scoring is supported, provide meaningful rubric metadata:

- required concepts;
- strong/optional concepts;
- misconceptions;
- production concepts;
- trade-off concepts;
- aliases/synonyms.

Do not design rubrics as naive keyword stuffing. They should reflect actual conceptual understanding.

---

# 51. FLASHCARDS

Use the existing flashcard syntax.

For useful lessons add approximately 2–6 high-value flashcards depending on complexity.

Good cards test definitions, mechanisms, differences, constraints, pitfalls, and production decisions.

Avoid low-value cards unless they encode a useful mental model.

Example:

```text
Front:
Java truyền object theo pass-by-reference đúng không?

Back:
Không. Java luôn pass-by-value. Với object, giá trị được copy là reference value, nên hai biến có thể cùng trỏ tới một object nhưng việc gán lại parameter không thay đổi reference ở caller.
```

---

# 52. SOURCE CITATION QUALITY

Every substantial lesson must have official sources using the repository's existing source metadata and/or source section.

Prefer 2–6 directly relevant high-quality sources instead of 20 weak links.

Do not add unrelated official URLs merely to satisfy validation.

---

# 53. SOURCE FRESHNESS / VERSION AWARENESS

Verify freshness especially for Angular, Spring Boot, Spring Security, Keycloak, Kafka, Kubernetes, Docker, TypeScript, and modern Java features.

Do not teach deprecated APIs as the preferred modern approach. If a legacy concept is interview-relevant, clearly label it historical/legacy.

---

# 54. DATABASE-SPECIFIC PRECISION

Do NOT merge MySQL, PostgreSQL, and Oracle implementation details into one generic lesson when behavior differs.

Separate general relational theory from vendor-specific topics such as locking, MVCC, isolation, indexes, query operators, replication, and partitioning.

---

# 55. PERFORMANCE CLAIMS

Never make context-free claims such as:

```text
X is faster.
Y is better.
Z scales better.
```

Always tie claims to workload, data size, cardinality, concurrency, latency, throughput, CPU, memory, network, and operational complexity. Recommend measurement/benchmarking where appropriate.

---

# 56. ARCHITECTURE MISCONCEPTIONS TO CORRECT

Explicitly avoid and correct claims such as:

```text
microservices automatically scale better
Kafka is always better than REST
Redis is always faster and safe to fall back from
WebFlux is always faster
NoSQL is always more scalable
Kubernetes automatically gives high availability
more threads always improve throughput
more DB connections always improve throughput
EAGER always solves N+1
JWT is encrypted by default
Kafka exactly-once means no duplicate external side effects
```

Teach conditions and trade-offs instead.

---

# 57. PRODUCTION CONTENT

Extended lessons should frequently include:

- metrics to watch;
- logs;
- tracing;
- timeouts;
- retries;
- limits;
- capacity;
- failure behavior;
- recovery;
- deployment concerns;
- rollback;
- data consistency;
- observability.

The learner should understand what happens after code reaches production.

---

# 58. SYSTEM DESIGN LESSONS

Create both concept lessons and scenario lessons.

## Concepts

Cover requirements clarification, assumptions, estimation, APIs, data modeling, high-level architecture, scaling, caching, storage, consistency, availability, reliability, resilience, observability, security, cost awareness, bottleneck analysis, and failure modes.

## Scenarios

Create Markdown lessons for examples such as:

- URL Shortener;
- Notification System;
- Chat System;
- Rate Limiter;
- File Upload / Storage;
- E-commerce;
- Order System;
- Inventory System;
- Payment Workflow;
- News Feed;
- Logging/Metrics pipeline;
- Real-time notification;
- Flash Sale / Traffic Spike;
- High-concurrency API.

Each scenario should cover requirements, non-functional requirements, traffic assumptions, APIs, data model, architecture, critical path, cache, database, messaging, scaling, failure handling, observability, security, trade-offs, and interview discussion.

---

# 59. LARGE-SCALE NUMBERS

Any numerical system-design example must be clearly labeled as an assumption.

Example:

```text
Assumption:
10 million registered users
1 million DAU
50k peak concurrent users
5k write RPS
30k read RPS
```

Do not present invented example traffic as a universal fact. Teach how to derive estimates from assumptions.

---

# 60. CAPACITY PLANNING

Create lessons on RPS estimation, concurrency estimation, Little's Law intuition, storage growth, bandwidth, peak factors, read/write ratios, replication-factor cost, cache memory, partition-count estimation concepts, and connection budgets.

Avoid false precision.

---

# 61. CODE / SQL EXAMPLES

Code examples must be minimal, correct, focused, and aligned with current APIs. Prefer modern Java/Spring/Angular practices where applicable.

SQL examples must clearly identify the dialect when vendor-specific.

Do not present vendor syntax as portable SQL.

---

# 62. DIAGRAMS

Use Mermaid when it materially improves understanding.

Good candidates include request lifecycle, Spring Security filter chain, JPA persistence context, Kafka flow, Redis cache-aside, Transactional Outbox, Saga, microservice communication, load balancer/stateless service layout, cache layers, replicas, sharding, retry/circuit-breaker flows, and system-design diagrams.

Do not add decorative diagrams with little learning value.

---

# 63. LESSON RELATIONSHIPS

Use the existing `prerequisites` and `related` metadata.

Examples:

```text
java-hashmap-internals
requires:
- java-equals-hashcode
- java-collections-overview
```

```text
jpa-n-plus-one
related:
- jpa-fetching
- sql-query-plan
- database-indexes
```

Do not create broken references.

---

# 64. ROADMAPS

Update/expand roadmaps using stable lesson IDs.

Recommended roadmaps:

- Java Backend Fresher;
- Spring Boot Backend;
- Database Fundamentals;
- Backend Performance;
- Microservices;
- Distributed Systems;
- System Design Foundations;
- High-Scale Backend;
- Interview Preparation.

Roadmaps should reference lessons rather than duplicate their content.

---

# 65. SEARCH / UI INTEGRATION

Ensure generated search indexes include title, description, tags, technology, category, level, contentType, headings, and important body terms.

New content must be discoverable.

Audit `src/` for hardcoded technical content. UI labels may remain hardcoded, but educational prose, interview answers, and flashcard answers should come from Markdown-derived data.

---

# 66. DUPLICATE CONTENT CONTROL

Before adding a lesson, search existing coverage.

Do not create near-duplicates unless their scope is intentionally distinct, for example overview vs internals vs production/troubleshooting.

Prefer updating an existing good lesson over creating a duplicate.

---

# 67. QUALITY REVIEW CHECKLIST

Before marking a lesson complete, verify:

- technical accuracy;
- primary-source grounding;
- correct level;
- correct contentType;
- clear Vietnamese;
- precise English terminology;
- correct examples;
- no unsupported universal claims;
- trade-offs where relevant;
- misconceptions where relevant;
- production notes where relevant;
- interview content where relevant;
- flashcards where relevant;
- valid sources;
- valid related/prerequisite IDs.

---

# 68. DOMAIN COVERAGE MATRIX

Create an explicit coverage matrix mapping the requested subject set to lesson IDs.

At minimum include:

```text
Java
Java Collections
Java Concurrency
JVM/GC
Spring Core
Spring Boot
Spring MVC
Spring WebFlux
REST API
Spring Security
OAuth2/OIDC/Keycloak
JPA/Hibernate
N+1
SQL
Database Design
MySQL
PostgreSQL
Oracle
MongoDB
Redis
Kafka
Transactional Outbox
WebSocket/STOMP
TypeScript
Angular
RxJS
Angular Signals
Micro Frontend / Native Federation
Git/GitHub
Docker
Postman
Kubernetes
CI/CD
Architecture
SOLID
Design Patterns
CQRS
Monolith/Modular Monolith/Microservices
Distributed Systems
Security
Performance
Observability
Resilience
Scalability
High Concurrency
System Design
Capacity Planning
Large-scale Systems
```

Track coverage for basic, advanced, and extended levels.

---

# 69. PRIORITY ORDER

If the work cannot finish in one run, prioritize:

1. Java / JVM / Collections / Concurrency
2. Spring Core / Boot / MVC / Transactions
3. JPA / Hibernate / N+1
4. REST / Spring Security / OAuth2 / Keycloak
5. SQL / Database Design / MySQL / PostgreSQL
6. Redis
7. Kafka / Transactional Outbox
8. Microservices / Distributed Systems
9. Performance / Scalability / Resilience / Observability
10. System Design / Capacity Planning
11. WebSocket/STOMP
12. Docker / Git / CI/CD / Kubernetes
13. Angular / TypeScript / RxJS / Signals / Micro Frontend
14. MongoDB / Oracle / Postman / supporting topics

Record unfinished work in the progress file rather than pretending it is complete.

---

# 70. INTERVIEW COVERAGE — REQUIRED THEMES

Ensure the interview bank covers, at minimum:

- Java pass-by-value;
- `==` vs `equals`;
- HashMap internals;
- `volatile`;
- synchronized vs Lock;
- race condition/deadlock;
- GC;
- IoC/DI;
- Bean lifecycle/scopes;
- `@RestController` vs `@Controller`;
- Spring MVC vs WebFlux;
- `@Transactional`;
- transaction propagation;
- Authentication vs Authorization;
- JWT misconceptions;
- 401 vs 403;
- Persistence Context;
- LAZY vs EAGER;
- N+1;
- JOIN FETCH vs EntityGraph;
- optimistic vs pessimistic locking;
- ACID;
- isolation;
- MVCC;
- index/composite index;
- Redis cache-aside/stampede/outage;
- Kafka partition/order/consumer group/lag;
- Kafka exactly-once misconception;
- idempotent consumer;
- Transactional Outbox;
- WebSocket vs SSE;
- monolith vs microservices;
- when NOT to use microservices;
- CQRS;
- timeout/retry/circuit breaker;
- connection pooling;
- p95/p99;
- stateless scaling;
- load balancing;
- rate limiting;
- sharding;
- hot key/hot partition;
- retry storm;
- cascading failure;
- graceful degradation;
- how to start a System Design answer.

---

# 71. TROUBLESHOOTING / SCENARIO QUESTIONS

Create lessons/interview questions around:

- API suddenly has high p99;
- DB CPU is high;
- connection pool is saturated;
- Redis is down;
- Redis hit ratio dropped;
- Kafka lag keeps growing;
- one Kafka partition is hot;
- JVM memory grows continuously;
- GC pauses increased;
- CPU is 100%;
- WebSocket clients disconnect during deploy;
- downstream API times out;
- retries amplify traffic;
- deployment triggers cascading failures.

Answers should teach investigation order and evidence-based debugging, not just list tools.

---

# 72. NO PROJECT-SPECIFIC FABRICATION

Do not invent facts about the user's personal project.

If creating project-interview guidance, label it as an **example answer framework** unless the repository itself proves the implementation details.

---

# 73. BUILD-TIME VALIDATION

After every significant content batch, run the repository's actual equivalent of:

```bash
npm run content:validate
npm run content:build
```

Fix invalid front matter, duplicate IDs/slugs, broken related/prerequisite links, malformed source metadata, malformed custom blocks, interview extraction problems, and flashcard extraction problems immediately.

Do not wait until hundreds of files are written before validating.

---

# 74. PERIODIC APPLICATION BUILD

Periodically run the current equivalents of:

```bash
npm run lint
npm test
npm run build -- --configuration production --base-href "/it-knowledge/"
```

Adapt the base href to the actual repository/deployment configuration if it has changed.

Content additions must not break GitHub Pages.

---

# 75. GENERATED OUTPUT VERIFICATION

Verify that Markdown changes correctly flow into generated/runtime artifacts:

```text
lessons
search index
interview data
flashcards
roadmaps
content stats
```

Do not assume parser success means the Angular UI can actually consume the data.

If browser tooling is available, smoke-test catalog filters, lesson rendering, code blocks, Mermaid, official sources, related lessons, search, interview questions, flashcards, and GitHub Pages subpath behavior.

---

# 76. NO EMPTY PLACEHOLDERS

Do NOT create files containing only `TODO`, `Coming soon`, or filler content just to populate the directory tree.

Only commit a Markdown lesson when it contains meaningful educational content.

---

# 77. CONSISTENCY / CONTRADICTION REVIEW

Review content for contradictions, especially around:

- Java pass-by-value;
- Java memory/JMM;
- Kafka ordering;
- Kafka exactly-once;
- Spring transaction behavior;
- JPA EAGER/N+1;
- JWT signing vs encryption;
- Redis consistency;
- HTTP idempotency;
- database isolation;
- WebFlux performance;
- microservices scalability.

Use consistent terminology across lessons.

---

# 78. CROSS-DOMAIN LINKS

Create meaningful cross-domain relationships, for example:

```text
Spring @Transactional
→ database transactions
→ isolation
→ JPA Persistence Context
```

```text
Kafka consumer
→ idempotency
→ Outbox
→ eventual consistency
```

```text
Redis cache-aside
→ cache stampede
→ DB overload
→ rate limiting/load shedding
```

```text
WebSocket scaling
→ broker/pub-sub
→ load balancer
→ connection draining
```

```text
High-scale API
→ stateless service
→ load balancer
→ cache
→ database scaling
→ queue
→ observability
```

---

# 79. FINAL CONTENT STYLE

A strong lesson should help the learner reason through:

```text
WHAT
WHY
HOW
WHEN
WHEN NOT
TRADE-OFFS
FAILURES
DEBUG
OPTIMIZE
SCALE
INTERVIEW
```

Avoid shallow encyclopedia-style writing.

---

# 80. EXECUTION IN BATCHES

Recommended batches:

```text
BATCH 1  — Audit + coverage matrix + Java/JVM/Collections/Concurrency
BATCH 2  — Spring Core/Boot/MVC/Transactions
BATCH 3  — REST/Security/OAuth/Keycloak
BATCH 4  — JPA/Hibernate/N+1
BATCH 5  — SQL/MySQL/PostgreSQL/Oracle
BATCH 6  — Redis/MongoDB
BATCH 7  — Kafka/Outbox/WebSocket
BATCH 8  — Architecture/Microservices/CQRS/Patterns
BATCH 9  — Distributed Systems/Resilience/Observability
BATCH 10 — Performance/High Concurrency/Scalability
BATCH 11 — System Design/Large-scale scenarios
BATCH 12 — Angular/TypeScript/RxJS/Micro Frontend
BATCH 13 — Git/Docker/Kubernetes/CI-CD/Postman
BATCH 14 — Interview/Flashcard coverage audit
BATCH 15 — Final consistency/source/validation review
```

After each batch:

```text
research
→ write
→ validate
→ compile
→ test
→ update progress
```

---

# 81. DEFINITION OF DONE

This task is complete only when:

- the requested domains are represented in the coverage matrix;
- important concepts exist as Markdown lessons;
- lessons are classified into basic/advanced/extended;
- official/primary sources are present;
- source URLs are valid;
- content is synthesized/paraphrased rather than copied;
- no major educational content is hardcoded in Angular;
- interview questions exist for major domains;
- grading rubrics exist where supported;
- flashcards exist for major lessons;
- related/prerequisite links are valid;
- search indexes include the new content;
- roadmaps reference the new lessons;
- content validation passes;
- lint/tests pass;
- production build passes;
- GitHub Pages asset paths still work;
- progress/coverage documentation is updated;
- remaining gaps are explicitly documented.

---

# 82. FINAL REPORT

At the end, report concisely:

```text
1. domains audited
2. domains expanded
3. Markdown files created
4. Markdown files updated
5. counts by basic / advanced / extended
6. interview questions added
7. flashcards added
8. official sources added
9. validation status
10. test status
11. production build status
12. major remaining knowledge gaps
13. recommended next content batch
```

Do not report success based only on file creation. Verify generated/runtime behavior.

---

# 83. CRITICAL EXECUTION DIRECTIVE

Do NOT merely return a curriculum.

Do NOT only list URLs.

Do NOT only create a few example files.

ACTUALLY RESEARCH OFFICIAL SOURCES AND CREATE/UPDATE THE MARKDOWN FILES IN THE REPOSITORY.

The goal is to populate the existing Markdown-driven platform with a deep, maintainable, source-backed knowledge base.

Continue until the highest-priority domains are meaningfully covered.

When execution constraints prevent completion in one run:

1. finish the current coherent batch;
2. validate it;
3. update `docs/content-generation-progress.md`;
4. clearly record what remains;
5. preserve a clean state so the next Codex run can continue safely.

START BY INSPECTING THE CURRENT CONTENT ARCHITECTURE AND BUILDING THE COVERAGE MATRIX.

THEN BEGIN WITH:

```text
Java
→ JVM
→ Collections
→ Concurrency
→ Spring
→ JPA/Hibernate
→ Database
→ Redis
→ Kafka
→ Distributed Systems
→ Performance
→ System Design
```

while continuing later through the full technology list above.
