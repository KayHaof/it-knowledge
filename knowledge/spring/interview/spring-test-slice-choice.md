---
id: spring-test-slice-choice
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - testing
  - test-slice
  - integration
relatedLessons:
  - spring-testing-strategy
sources:
  - title: Spring Framework Testing
    url: https://docs.spring.io/spring-framework/reference/testing.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot Testing
    url: https://docs.spring.io/spring-boot/reference/testing/index.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Security Testing
    url: https://docs.spring.io/spring-security/reference/servlet/test/index.html
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
    - id: testing
      required: true
      aliases:
        - testing
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: test-slice
      required: true
      aliases:
        - test-slice
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: integration
      required: false
      aliases:
        - integration
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Full `@SpringBootTest` luôn tốt nhất vì mô phỏng production hoàn toàn.
      penalty: 20
---

# Bạn chọn `@WebMvcTest`, `@DataJpaTest` hay full context khi nào?

## Rubric

### Must Include

- testing

- test-slice

### Strong Answer Includes

- integration

## Câu trả lời 30 giây

Test slice nhanh và cô lập boundary: MVC controller, JPA mapping/query. Full context hoặc Testcontainers dùng khi cần wiring/transaction/database behavior thật; không dùng một loại test cho mọi lỗi.

## Câu trả lời chi tiết

Slice giới hạn auto-config và thường mock dependency ngoài boundary, nên bắt contract nhanh nhưng không phát hiện config/bean integration. Full context kiểm startup, security/filter/wiring; container kiểm engine/version/locking. Giữ test pyramid: nhiều unit/slice, ít integration/e2e nhưng đại diện failure path.

## Góc nhìn Production

Theo dõi test duration/flakiness và chạy migration/schema version đúng. Không dùng H2 để kết luận PostgreSQL/MySQL locking/query plan.

## Trade-offs

Slice giới hạn auto-config và thường mock dependency ngoài boundary, nên bắt contract nhanh nhưng không phát hiện config/bean integration. Full context kiểm startup, security/filter/wiring; container kiểm engine/version/locking. Giữ test pyramid: nhiều unit/slice, ít integration/e2e nhưng đại diện failure path.

## Câu trả lời sai thường gặp

Full `@SpringBootTest` luôn tốt nhất vì mô phỏng production hoàn toàn.

## Follow-up

- Khi nào cần Testcontainers?

- Test slice có kiểm Security filter chain không?

## Nguồn chính thống

- [Spring — Spring Framework Testing](https://docs.spring.io/spring-framework/reference/testing.html)
- [Spring — Spring Boot Testing](https://docs.spring.io/spring-boot/reference/testing/index.html)
- [Spring — Spring Security Testing](https://docs.spring.io/spring-security/reference/servlet/test/index.html)
