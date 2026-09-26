---
id: performance-db-pool-size
type: interview-question
technology: Performance
category: Performance
difficulty: senior
topics:
  - connection-pool
  - database
  - capacity
relatedLessons:
  - database-connection-pool-capacity
sources:
  - title: PostgreSQL Connections and Authentication
    url: https://www.postgresql.org/docs/current/runtime-config-connection.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: PostgreSQL Resource Consumption
    url: https://www.postgresql.org/docs/current/runtime-config-resource.html
    organization: PostgreSQL Global Development Group
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Connection Management
    url: https://dev.mysql.com/doc/refman/8.4/en/connection-management.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot SQL Databases
    url: https://docs.spring.io/spring-boot/reference/data/sql.html
    organization: Spring
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
    - id: connection-pool
      required: true
      aliases:
        - connection-pool
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: database
      required: true
      aliases:
        - database
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
        - DB tận dụng tốt nhất khi mở connection bằng số concurrent user.
      penalty: 20
---

# Vì sao tăng DB connection pool có thể làm DB chậm hơn?

## Rubric

### Must Include

- connection-pool

- database

### Strong Answer Includes

- capacity

## Câu trả lời 30 giây

DB có CPU/lock/I/O hữu hạn; quá nhiều connection tăng context switch, memory và concurrent work. Tổng pool của mọi app instance mới là giới hạn thực.

## Câu trả lời chi tiết

Pool là admission control; connection chờ lâu làm latency và timeout tăng. Đặt acquire timeout, leak detection, transaction ngắn và pool tổng dưới DB capacity. Tăng pool chỉ có ích khi DB còn headroom và app đang thiếu concurrency hữu ích.

## Góc nhìn Production

Theo dõi active/pending, DB CPU/locks, p95 và số instance.

## Trade-offs

Pool là admission control; connection chờ lâu làm latency và timeout tăng. Đặt acquire timeout, leak detection, transaction ngắn và pool tổng dưới DB capacity. Tăng pool chỉ có ích khi DB còn headroom và app đang thiếu concurrency hữu ích.

## Câu trả lời sai thường gặp

DB tận dụng tốt nhất khi mở connection bằng số concurrent user.

## Follow-up

- Connection leak phát hiện ra sao?

- Pool size thay đổi theo read replica thế nào?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Connections and Authentication](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [PostgreSQL Global Development Group — PostgreSQL Resource Consumption](https://www.postgresql.org/docs/current/runtime-config-resource.html)
- [Oracle MySQL — MySQL Connection Management](https://dev.mysql.com/doc/refman/8.4/en/connection-management.html)
- [Spring — Spring Boot SQL Databases](https://docs.spring.io/spring-boot/reference/data/sql.html)
