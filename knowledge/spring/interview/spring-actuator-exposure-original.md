---
id: spring-actuator-exposure-original
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - Actuator
  - health
  - security
relatedLessons:
  - spring-production-actuator-resources
sources:
  - title: Spring Boot Actuator Endpoints
    url: https://docs.spring.io/spring-boot/reference/actuator/endpoints.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot Metrics
    url: https://docs.spring.io/spring-boot/reference/actuator/metrics.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot Kubernetes Probes
    url: https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot Graceful Shutdown
    url: https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html
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
    - id: health
      required: true
      aliases:
        - health
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
        - Actuator an toàn mặc định nên expose `*` để team debug production nhanh hơn.
      penalty: 20
---

# Có nên expose toàn bộ Spring Boot Actuator endpoints ra public ingress không?

## Rubric

### Must Include

- Actuator

- health

### Strong Answer Includes

- security

## Câu trả lời 30 giây

Không. Chỉ expose health/info tối thiểu qua endpoint được bảo vệ; metrics và env/config/heapdump cần mạng quản trị, authz và redaction. Liveness/readiness cũng phải tách semantics.

## Câu trả lời chi tiết

Actuator endpoint có thể chứa property, bean, thread hoặc diagnostic data nhạy cảm và tạo tải. Health group phân biệt liveness không phụ thuộc downstream với readiness phản ánh nhận traffic. Metrics scrape nội bộ qua mTLS/authn và cardinality budget. Endpoint exposure, management port/context và proxy path phải kiểm tra sau deployment.

## Góc nhìn Production

Audit route/ACL, failed access, scrape latency và health flapping; test ingress bypass và secret redaction. Không dùng health ping dày để gọi dependency nặng.

## Trade-offs

Actuator endpoint có thể chứa property, bean, thread hoặc diagnostic data nhạy cảm và tạo tải. Health group phân biệt liveness không phụ thuộc downstream với readiness phản ánh nhận traffic. Metrics scrape nội bộ qua mTLS/authn và cardinality budget. Endpoint exposure, management port/context và proxy path phải kiểm tra sau deployment.

## Câu trả lời sai thường gặp

Actuator an toàn mặc định nên expose `*` để team debug production nhanh hơn.

## Follow-up

- Readiness khác liveness khi database down thế nào?

- Health indicator timeout nên đặt bao nhiêu?

## Nguồn chính thống

- [Spring — Spring Boot Actuator Endpoints](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html)
- [Spring — Spring Boot Metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)
- [Spring — Spring Boot Kubernetes Probes](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes)
- [Spring — Spring Boot Graceful Shutdown](https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html)
