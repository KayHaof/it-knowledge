---
id: spring-data
type: roadmap
title: Spring Boot, Security và JPA/Hibernate
description: Spring internals và data access từ container/proxy đến transaction, ORM performance và operations.
steps:
  - lessonId: spring-ioc-bean-lifecycle
    note: IoC container, scopes và hooks.
  - lessonId: spring-boot-configuration-conditions
    note: Configuration precedence, profiles, binding và conditions.
  - lessonId: spring-aop-transactions
    note: Proxy/AOP và transaction semantics.
  - lessonId: spring-transaction-failure-playbook
    note: Rollback rules, propagation, retry và unknown transaction outcome.
  - lessonId: spring-mvc-request-lifecycle
    note: Filter, security chain, DispatcherServlet và async lifecycle.
  - lessonId: spring-rest-validation-errors
    note: Request lifecycle, validation và errors.
  - lessonId: spring-mvc-webflux
    note: Servlet và reactive trade-off.
  - lessonId: spring-security-oauth2-jwt
    note: Filter chain và authorization.
  - lessonId: spring-security-policy-boundaries
    note: CORS, CSRF, method authorization và tenant policy.
  - lessonId: spring-jpa-persistence-context
    note: Entity lifecycle, dirty checking và flush.
  - lessonId: spring-jpa-fetching-batching-locking
    note: Fetch plan, batching, locks và pagination.
  - lessonId: jpa-n-plus-one
    note: Diagnose/fix N+1 theo use case.
  - lessonId: transactions-mvcc-deadlocks
    note: DB concurrency dưới @Transactional.
  - lessonId: database-query-plan
    note: Evidence cho query/index decisions.
  - lessonId: spring-data-access-pooling-timeouts
    note: Connection pool budget và deadline xuyên data-access path.
  - lessonId: spring-postgresql-production-boundary
    note: Connection budget, timeout và migration.
  - lessonId: spring-redis-cache-consistency
    note: Cache consistency, invalidation và degraded path trong Spring.
  - lessonId: spring-kafka-event-consumer-production
    note: Consumer lifecycle, offset, retry và idempotent processing.
  - lessonId: spring-graceful-shutdown-kubernetes
    note: Readiness drain, in-flight work và shutdown trên Kubernetes.
  - lessonId: spring-testing-strategy
    note: Test proxy, web và database boundary.
---

# Spring Boot, Security và JPA/Hibernate

## Tổng quan

Spring internals và data access từ container/proxy đến transaction, ORM performance và operations.

## Lộ trình

1. **spring-ioc-bean-lifecycle** — IoC container, scopes và hooks.

2. **spring-boot-configuration-conditions** — Configuration precedence, profiles, binding và conditions.

3. **spring-aop-transactions** — Proxy/AOP và transaction semantics.

4. **spring-transaction-failure-playbook** — Rollback rules, propagation, retry và unknown transaction outcome.

5. **spring-mvc-request-lifecycle** — Filter, security chain, DispatcherServlet và async lifecycle.

6. **spring-rest-validation-errors** — Request lifecycle, validation và errors.

7. **spring-mvc-webflux** — Servlet và reactive trade-off.

8. **spring-security-oauth2-jwt** — Filter chain và authorization.

9. **spring-security-policy-boundaries** — CORS, CSRF, method authorization và tenant policy.

10. **spring-jpa-persistence-context** — Entity lifecycle, dirty checking và flush.

11. **spring-jpa-fetching-batching-locking** — Fetch plan, batching, locks và pagination.

12. **jpa-n-plus-one** — Diagnose/fix N+1 theo use case.

13. **transactions-mvcc-deadlocks** — DB concurrency dưới @Transactional.

14. **database-query-plan** — Evidence cho query/index decisions.

15. **spring-data-access-pooling-timeouts** — Connection pool budget và deadline xuyên data-access path.

16. **spring-postgresql-production-boundary** — Connection budget, timeout và migration.

17. **spring-redis-cache-consistency** — Cache consistency, invalidation và degraded path trong Spring.

18. **spring-kafka-event-consumer-production** — Consumer lifecycle, offset, retry và idempotent processing.

19. **spring-graceful-shutdown-kubernetes** — Readiness drain, in-flight work và shutdown trên Kubernetes.

20. **spring-testing-strategy** — Test proxy, web và database boundary.
