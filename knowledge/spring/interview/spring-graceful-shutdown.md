---
id: spring-graceful-shutdown
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - graceful-shutdown
  - readiness
  - Kubernetes
relatedLessons:
  - spring-graceful-shutdown-kubernetes
sources:
  - title: Spring Boot — Graceful Shutdown
    url: https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot Actuator — Kubernetes Probes
    url: https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Kubernetes — Pod Lifecycle
    url: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Kubernetes — Liveness, Readiness, and Startup Probes
    url: https://kubernetes.io/docs/concepts/workloads/pods/probes/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Kubernetes — Container Lifecycle Hooks
    url: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/
    organization: Kubernetes
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
    - id: graceful-shutdown
      required: true
      aliases:
        - graceful-shutdown
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: readiness
      required: true
      aliases:
        - readiness
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: kubernetes
      required: false
      aliases:
        - Kubernetes
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Kubernetes gửi SIGTERM nên Spring tự chờ vô hạn mọi request và message rồi mới kill.
      penalty: 20
---

# Spring Boot graceful shutdown cần phối hợp với Kubernetes như thế nào?

## Rubric

### Must Include

- graceful-shutdown

- readiness

### Strong Answer Includes

- Kubernetes

## Câu trả lời 30 giây

Đánh dấu readiness fail trước để ngừng traffic, chờ load balancer cập nhật, rồi drain request/consumer trong deadline và đóng pool. SIGTERM không tự bảo đảm request hay message hoàn tất.

## Câu trả lời chi tiết

Termination sequence cần preStop/terminationGracePeriod hợp lý, server shutdown mode và worker stop policy. Long request/stream có deadline; Kafka consumer commit/leave group và in-flight task cần bounded drain. Nếu pod bị kill trước deadline, durable queue/idempotent retry bảo vệ outcome. Readiness không nên phụ thuộc mọi downstream nếu làm rollout kẹt.

## Góc nhìn Production

Đo drain duration, forced kills, in-flight requests, lag và termination reason; test rolling update/node drain. Giữ shutdown hooks idempotent và không block vô hạn.

## Trade-offs

Termination sequence cần preStop/terminationGracePeriod hợp lý, server shutdown mode và worker stop policy. Long request/stream có deadline; Kafka consumer commit/leave group và in-flight task cần bounded drain. Nếu pod bị kill trước deadline, durable queue/idempotent retry bảo vệ outcome. Readiness không nên phụ thuộc mọi downstream nếu làm rollout kẹt.

## Câu trả lời sai thường gặp

Kubernetes gửi SIGTERM nên Spring tự chờ vô hạn mọi request và message rồi mới kill.

## Follow-up

- Readiness delay bao lâu sau khi fail?

- In-flight payment request xử lý outcome unknown thế nào?

## Nguồn chính thống

- [Spring — Spring Boot — Graceful Shutdown](https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html)
- [Spring — Spring Boot Actuator — Kubernetes Probes](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes)
- [Kubernetes — Kubernetes — Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
- [Kubernetes — Kubernetes — Liveness, Readiness, and Startup Probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/)
- [Kubernetes — Kubernetes — Container Lifecycle Hooks](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/)
