---
id: k8s-crashloop-pending-debug
type: interview-question
technology: Kubernetes
category: Kubernetes
difficulty: middle
topics:
  - CrashLoopBackOff
  - Pending
  - kubectl
relatedLessons:
  - kubernetes-production-troubleshooting
sources:
  - title: Debug running Pods
    url: https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Pod lifecycle
    url: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Debug Services
    url: https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Debugging DNS resolution
    url: https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/
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
    - id: crashloopbackoff
      required: true
      aliases:
        - CrashLoopBackOff
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: pending
      required: true
      aliases:
        - Pending
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: kubectl
      required: false
      aliases:
        - kubectl
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Xóa Pod vài lần là cách điều tra chuẩn vì Kubernetes sẽ tự sửa cấu hình sai.
      penalty: 20
---

# Phân biệt debug Pending Pod và CrashLoopBackOff bắt đầu từ đâu?

## Rubric

### Must Include

- CrashLoopBackOff

- Pending

### Strong Answer Includes

- kubectl

## Câu trả lời 30 giây

Pending thường do scheduling/resource/taint/PVC; CrashLoop là container đã start rồi exit/restart. Xem `describe`, events, logs hiện tại và `--previous`.

## Câu trả lời chi tiết

Pending kiểm requests/limits, node selector, affinity, quota và volume binding. CrashLoop kiểm exit code, probe, config/secret và OOMKilled. Không chỉ xóa Pod vì controller sẽ tạo lại cùng lỗi; sửa desired spec hoặc dependency.

## Góc nhìn Production

Giữ event/log retention và alert restart rate; tránh debug bằng privileged shell trên production.

## Trade-offs

Pending kiểm requests/limits, node selector, affinity, quota và volume binding. CrashLoop kiểm exit code, probe, config/secret và OOMKilled. Không chỉ xóa Pod vì controller sẽ tạo lại cùng lỗi; sửa desired spec hoặc dependency.

## Câu trả lời sai thường gặp

Xóa Pod vài lần là cách điều tra chuẩn vì Kubernetes sẽ tự sửa cấu hình sai.

## Follow-up

- OOMKilled xác nhận ở đâu?

- PVC Pending do zone mismatch thế nào?

## Nguồn chính thống

- [Kubernetes — Debug running Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/)
- [Kubernetes — Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
- [Kubernetes — Debug Services](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/)
- [Kubernetes — Debugging DNS resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
