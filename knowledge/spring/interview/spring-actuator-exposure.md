---
id: spring-actuator-exposure
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - Actuator
  - observability
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
    - id: observability
      required: true
      aliases:
        - observability
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
        - Actuator endpoint chỉ đọc nên có thể public toàn bộ mà không ảnh hưởng bảo mật.
      penalty: 20
---

# Expose Actuator production an toàn cần cân nhắc gì?

## Rubric

### Must Include

- Actuator

- observability

### Strong Answer Includes

- security

## Câu trả lời 30 giây

Chỉ mở endpoint cần thiết, bind management port/network riêng nếu phù hợp và bảo vệ bằng authentication/authorization. Health/readiness nên tách thông tin nhạy cảm khỏi diagnostics.

## Câu trả lời chi tiết

Metrics và liveness/readiness phục vụ khác nhau; env, heapdump, threaddump có thể lộ secret hoặc dữ liệu. Kiểm `show-details`, management exposure, ingress policy và audit access. Endpoint health không nên phụ thuộc mọi downstream nếu làm orchestrator restart loop.

## Góc nhìn Production

Alert probe failure riêng với dependency degradation; scrub tags/cardinality và restrict management traffic.

## Trade-offs

Metrics và liveness/readiness phục vụ khác nhau; env, heapdump, threaddump có thể lộ secret hoặc dữ liệu. Kiểm `show-details`, management exposure, ingress policy và audit access. Endpoint health không nên phụ thuộc mọi downstream nếu làm orchestrator restart loop.

## Câu trả lời sai thường gặp

Actuator endpoint chỉ đọc nên có thể public toàn bộ mà không ảnh hưởng bảo mật.

## Follow-up

- Readiness khác liveness thế nào?

- Metric cardinality nguy hiểm ra sao?

## Nguồn chính thống

- [Spring — Spring Boot Actuator Endpoints](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html)
- [Spring — Spring Boot Metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)
- [Spring — Spring Boot Kubernetes Probes](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes)
- [Spring — Spring Boot Graceful Shutdown](https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html)
