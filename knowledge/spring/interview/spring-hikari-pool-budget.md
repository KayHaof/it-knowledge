---
id: spring-hikari-pool-budget
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - HikariCP
  - connection-pool
  - capacity
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
    - id: hikaricp
      required: true
      aliases:
        - HikariCP
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: connection-pool
      required: true
      aliases:
        - connection-pool
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: capacity
      required: false
      aliases:
        - capacity
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần tăng maximumPoolSize tới max_connections của database là pending sẽ hết.
      penalty: 20
---

# HikariCP pending tăng nhưng CPU database thấp: bạn kiểm tra gì trước?

## Rubric

### Must Include

- HikariCP

- connection-pool

### Strong Answer Includes

- capacity

## Câu trả lời 30 giây

Kiểm acquire wait, connection hold time, leak/transaction scope, pool max và downstream latency; CPU thấp không nghĩa connection available. Có thể app giữ connection quá lâu hoặc pool quá nhỏ so với concurrency burst.

## Câu trả lời chi tiết

Pool chỉ điều tiết số session, không tạo database capacity. Transaction ôm remote call, slow lock hoặc result streaming làm hold time tăng; pending threads chờ dù DB CPU thấp. So sánh throughput, active/idle/pending, query/lock wait và database session cap trên mọi pod. Tăng pool mù có thể làm DB saturated và p99 tệ hơn.

## Góc nhìn Production

Dashboard pool metrics, timeout reason, DB waits và request deadlines; test rolling surge/failover. Set acquire/statement/transaction timeout và leak detection có sampling.

## Trade-offs

Pool chỉ điều tiết số session, không tạo database capacity. Transaction ôm remote call, slow lock hoặc result streaming làm hold time tăng; pending threads chờ dù DB CPU thấp. So sánh throughput, active/idle/pending, query/lock wait và database session cap trên mọi pod. Tăng pool mù có thể làm DB saturated và p99 tệ hơn.

## Câu trả lời sai thường gặp

Chỉ cần tăng maximumPoolSize tới max_connections của database là pending sẽ hết.

## Follow-up

- Tổng pool khi autoscaling tính ra sao?

- Connection leak khác slow query thế nào?

## Nguồn chính thống

- [Spring — Spring Boot — SQL Databases](https://docs.spring.io/spring-boot/reference/data/sql.html)
- [Spring — Spring Framework — Controlling Database Connections](https://docs.spring.io/spring-framework/reference/data-access/jdbc/connections.html)
- [Spring — Spring Framework — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Hibernate — Hibernate ORM User Guide — Database Access](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#database-access)
