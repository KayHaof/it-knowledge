---
id: spring-retry-timeout-order
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - retry
  - timeout
  - resilience
relatedLessons:
  - spring-data-access-pooling-timeouts
sources:
  - title: Spring Boot — SQL Databases
    url: https://docs.spring.io/spring-boot/reference/data/sql.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Framework — Controlling Database Connections
    url: https://docs.spring.io/spring-framework/reference/data-access/jdbc/connections.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Framework — Using @Transactional
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Hibernate ORM User Guide — Database Access
    url: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#database-access
    organization: Hibernate
    type: official-documentation
    accessedAt: 2026-09-02
rubric:
  dimensions:
    technicalCorrectness: 40
    completeness: 20
    reasoning: 15
    production: 10
    tradeoffs: 10
    communication: 5
  concepts:
    - id: retry
      required: true
      aliases:
        - retry
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: timeout
      required: true
      aliases:
        - timeout
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: resilience
      required: false
      aliases:
        - resilience
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bật retry 3 lần với timeout 30 giây luôn tăng reliability mà không cần tính tổng latency.
      penalty: 20
---

# Vì sao timeout phải được thiết kế trước retry trong Spring client?

## Rubric

### Must Include

- retry

- timeout

### Strong Answer Includes

- resilience

## Câu trả lời 30 giây

Mỗi attempt phải nằm trong deadline tổng; retry không được kéo dài request vô hạn. Timeout mà downstream không cancel có thể tạo orphan work và retry storm, nên cần budget, backoff/jitter và idempotency.

## Câu trả lời chi tiết

Tách connect, read, pool-acquire và overall deadline; số retry × attempt timeout + backoff phải <= caller budget. Chỉ retry lỗi transient và method idempotent hoặc có idempotency key. Circuit breaker/bulkhead giảm fan-out khi dependency fail, còn fallback phải phân biệt stale/unknown outcome.

## Góc nhìn Production

Đo attempts/request, retry delay, open circuit, timeout cause và downstream load; thử partition/slow response. Propagate correlation/deadline headers và cancel reactive/HTTP request đúng.

## Trade-offs

Tách connect, read, pool-acquire và overall deadline; số retry × attempt timeout + backoff phải <= caller budget. Chỉ retry lỗi transient và method idempotent hoặc có idempotency key. Circuit breaker/bulkhead giảm fan-out khi dependency fail, còn fallback phải phân biệt stale/unknown outcome.

## Câu trả lời sai thường gặp

Bật retry 3 lần với timeout 30 giây luôn tăng reliability mà không cần tính tổng latency.

## Follow-up

- HTTP POST retry an toàn khi nào?

- Circuit breaker mở nhưng health check vẫn xanh vì sao?

## Nguồn chính thống

- [Spring — Spring Boot — SQL Databases](https://docs.spring.io/spring-boot/reference/data/sql.html)
- [Spring — Spring Framework — Controlling Database Connections](https://docs.spring.io/spring-framework/reference/data-access/jdbc/connections.html)
- [Spring — Spring Framework — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Hibernate — Hibernate ORM User Guide — Database Access](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#database-access)
