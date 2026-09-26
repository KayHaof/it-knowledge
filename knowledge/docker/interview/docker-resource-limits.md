---
id: docker-resource-limits
type: interview-question
technology: Docker
category: Docker
difficulty: senior
topics:
  - cgroups
  - CPU
  - memory
relatedLessons:
  - jvm-container-resources
sources:
  - title: Java HotSpot Virtual Machine Garbage Collection Tuning Guide
    url: https://docs.oracle.com/en/java/javase/25/gctuning/
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Docker resource constraints
    url: https://docs.docker.com/engine/containers/resource_constraints/
    organization: Docker
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Resource Management for Pods and Containers
    url: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
    organization: Kubernetes
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Pod Quality of Service Classes
    url: https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/
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
    - id: cgroups
      required: true
      aliases:
        - cgroups
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: cpu
      required: true
      aliases:
        - CPU
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: memory
      required: false
      aliases:
        - memory
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - "-Xmx bằng đúng memory limit là an toàn vì JVM chỉ dùng heap."
      penalty: 20
---

# Resource limit Docker ảnh hưởng JVM/container thế nào?

## Rubric

### Must Include

- cgroups

- CPU

### Strong Answer Includes

- memory

## Câu trả lời 30 giây

cgroups giới hạn CPU/memory; JVM hiện đại đọc container limits nhưng heap/thread pool vẫn cần tune theo limit. Memory vượt limit có thể OOMKill ngoài JVM heap.

## Câu trả lời chi tiết

CPU quota gây throttling, làm latency tăng dù process không 100% host CPU; memory gồm heap, metaspace, direct/native, page cache. Đặt -Xmx có headroom và monitor throttled time/working set. Limit quá thấp gây restart loop, quá cao làm noisy neighbor.

## Góc nhìn Production

Alert OOMKilled, throttling và RSS/heap gap; load test với limit thật.

## Trade-offs

CPU quota gây throttling, làm latency tăng dù process không 100% host CPU; memory gồm heap, metaspace, direct/native, page cache. Đặt -Xmx có headroom và monitor throttled time/working set. Limit quá thấp gây restart loop, quá cao làm noisy neighbor.

## Câu trả lời sai thường gặp

-Xmx bằng đúng memory limit là an toàn vì JVM chỉ dùng heap.

## Follow-up

- OOMKilled khác OutOfMemoryError thế nào?

- CPU request/limit Kubernetes khác Docker flag ra sao?

## Nguồn chính thống

- [Oracle — Java HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/25/gctuning/)
- [Docker — Docker resource constraints](https://docs.docker.com/engine/containers/resource_constraints/)
- [Kubernetes — Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Kubernetes — Pod Quality of Service Classes](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/)
