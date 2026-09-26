---
id: q-spring-pool-budget
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - connection-pool
  - capacity
  - timeouts
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
    - id: connection-pool
      required: true
      aliases:
        - connection-pool
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: capacity
      required: true
      aliases:
        - capacity
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: timeouts
      required: false
      aliases:
        - timeouts
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Đặt pool bằng max_connections chia số pod hiện tại, rồi tăng pool khi pending request xuất hiện.
      penalty: 20
---

# Bạn đặt connection pool cho Spring Boot theo số CPU hay theo database max connections?

## Rubric

### Must Include

- connection-pool

- capacity

### Strong Answer Includes

- timeouts

## Câu trả lời 30 giây

Không dùng một công thức đơn. Pool là admission control; phải tính tổng pool của mọi pod, jobs và deployment surge dưới database safe budget, rồi đo connection hold time, acquire wait, query waits và throughput dưới tải đại diện.

## Câu trả lời chi tiết

Tôi lập bất đẳng thức maxPods × poolPerPod + batch/admin/headroom không vượt safe DB capacity, không mặc nhiên lấy max_connections làm safe. Little’s Law giúp ước lượng concurrency từ throughput × hold time. Nếu acquire wait cao nhưng DB còn headroom, xem pool/hold scope; nếu query waits tăng và throughput phẳng, DB đã saturated nên tăng pool làm tail tệ hơn. Transaction không ôm remote call/CPU work; caller concurrency và queue phải bounded.

## Deep Dive

Autoscaling và rolling surge có thể nhân connections đúng lúc DB đang nghẽn. Acquisition, connect, statement, lock và request timeout là các budgets khác nhau; timeout ngoài ngắn hơn nhưng query không cancel sẽ tạo orphan work.

## Góc nhìn Production

Dashboard active/idle/pending, acquire/hold time, create failures, DB sessions/waits và request deadlines trên cùng timeline. Test failover/reconnect storm, leak, surge và credential rotation.

## Trade-offs

Autoscaling và rolling surge có thể nhân connections đúng lúc DB đang nghẽn. Acquisition, connect, statement, lock và request timeout là các budgets khác nhau; timeout ngoài ngắn hơn nhưng query không cancel sẽ tạo orphan work.

## Câu trả lời sai thường gặp

Đặt pool bằng max_connections chia số pod hiện tại, rồi tăng pool khi pending request xuất hiện.

## Follow-up

- Pool full khi nào là bảo vệ đúng?

- Giữ connection trong remote call gây cascade ra sao?

## Nguồn chính thống

- [Spring — Spring Boot — SQL Databases](https://docs.spring.io/spring-boot/reference/data/sql.html)
- [Spring — Spring Framework — Controlling Database Connections](https://docs.spring.io/spring-framework/reference/data-access/jdbc/connections.html)
- [Spring — Spring Framework — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Hibernate — Hibernate ORM User Guide — Database Access](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#database-access)
