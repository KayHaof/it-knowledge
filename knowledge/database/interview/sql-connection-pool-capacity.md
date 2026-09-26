---
id: sql-connection-pool-capacity
type: interview-question
technology: SQL
category: SQL
difficulty: senior
topics:
  - connection-pool
  - Little-Law
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
    - id: little-law
      required: true
      aliases:
        - Little-Law
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
        - Đặt pool bằng số core database hoặc max_connections chia pod là công thức phổ quát.
      penalty: 20
---

# Pool size database nên suy ra từ công thức nào ngoài số CPU?

## Rubric

### Must Include

- connection-pool

- Little-Law

### Strong Answer Includes

- capacity

## Câu trả lời 30 giây

Cần tổng connection của mọi pod/job, database safe capacity, transaction hold time và throughput mục tiêu. Little’s Law giúp ước lượng concurrency, nhưng lock/I/O và failover headroom quyết định giới hạn thực.

## Câu trả lời chi tiết

Nếu QPS × average connection hold time cần 40 concurrent connections, pool không cần 200; pool quá lớn làm DB context switching/lock contention tăng. Tính rolling surge/autoscaling và admin connections, rồi load test p99. Acquire timeout, query timeout và caller deadline là budgets khác nhau.

## Góc nhìn Production

Dashboard active/idle/pending/acquire time cùng DB sessions/waits; test failover/reconnect storm. Không lấy `max_connections` làm safe throughput.

## Trade-offs

Nếu QPS × average connection hold time cần 40 concurrent connections, pool không cần 200; pool quá lớn làm DB context switching/lock contention tăng. Tính rolling surge/autoscaling và admin connections, rồi load test p99. Acquire timeout, query timeout và caller deadline là budgets khác nhau.

## Câu trả lời sai thường gặp

Đặt pool bằng số core database hoặc max_connections chia pod là công thức phổ quát.

## Follow-up

- Pool pending cao nhưng DB CPU thấp kiểm gì?

- Autoscaling làm connection budget thay đổi ra sao?

## Nguồn chính thống

- [PostgreSQL Global Development Group — PostgreSQL Connections and Authentication](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [PostgreSQL Global Development Group — PostgreSQL Resource Consumption](https://www.postgresql.org/docs/current/runtime-config-resource.html)
- [Oracle MySQL — MySQL Connection Management](https://dev.mysql.com/doc/refman/8.4/en/connection-management.html)
- [Spring — Spring Boot SQL Databases](https://docs.spring.io/spring-boot/reference/data/sql.html)
