---
id: q-spring-actuator-security
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - Actuator
  - metrics
  - security
relatedLessons:
  - spring-production-actuator-resources
sources:
  - title: Spring Boot Actuator endpoints
    url: https://docs.spring.io/spring-boot/reference/actuator/endpoints.html
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
    - id: actuator
      required: true
      aliases:
        - Actuator
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: metrics
      required: true
      aliases:
        - metrics
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: security
      required: false
      aliases:
        - security
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Actuator chỉ đọc metric nên mọi endpoint đều an toàn và management port tự động private.
      penalty: 20
---

# Có nên expose toàn bộ Spring Boot Actuator endpoints ra public ingress để dễ vận hành?

## Rubric

### Must Include

- Actuator

- metrics

### Strong Answer Includes

- security

## Câu trả lời 30 giây

Không. Endpoints có thể lộ environment, mappings, heap/thread data hoặc cho thao tác quản trị. Chỉ expose endpoint cần thiết qua management boundary, authentication/authorization và network policy; health response cũng tối thiểu cho audience.

## Câu trả lời chi tiết

Tôi inventory endpoint và consumers, tách liveness/readiness/public status khỏi admin diagnostics. Metrics/traces đi qua authenticated scrape/export path; heapdump/env/configprops đặc biệt nhạy cảm. Management port riêng không tự là security nếu network vẫn mở. Cardinality và diagnostic overhead cũng cần budget.

## Deep Dive

Health group không nên gọi mọi downstream trong liveness vì outage dependency có thể restart fleet. Readiness/degradation policy theo khả năng local phục vụ.

## Góc nhìn Production

Audit exposure sau upgrade, least privilege, redact secrets, rate limit diagnostics và log access không chứa payload nhạy cảm.

## Trade-offs

Health group không nên gọi mọi downstream trong liveness vì outage dependency có thể restart fleet. Readiness/degradation policy theo khả năng local phục vụ.

## Câu trả lời sai thường gặp

Actuator chỉ đọc metric nên mọi endpoint đều an toàn và management port tự động private.

## Follow-up

- Liveness khác readiness trong Spring/Kubernetes?

- Metric tag nào gây cardinality explosion?

## Nguồn chính thống

- [Spring — Spring Boot Actuator endpoints](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html)
