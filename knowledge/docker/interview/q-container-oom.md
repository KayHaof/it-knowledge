---
id: q-container-oom
type: interview-question
technology: Docker
category: Docker
difficulty: senior
topics:
  - JVM
  - cgroup
  - OOMKilled
relatedLessons:
  - jvm-container-resources
sources:
  - title: Docker resource constraints
    url: https://docs.docker.com/engine/containers/resource_constraints/
    organization: Docker
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
    - id: jvm
      required: true
      aliases:
        - JVM
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: cgroup
      required: true
      aliases:
        - cgroup
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: oomkilled
      required: false
      aliases:
        - OOMKilled
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - JVM chỉ dùng heap nên Xmx thấp hơn limit vài MB là luôn an toàn.
      penalty: 20
---

# Vì sao container Java bị OOMKilled khi heap chưa chạm Xmx?

## Rubric

### Must Include

- JVM

- cgroup

### Strong Answer Includes

- OOMKilled

## Câu trả lời 30 giây

Memory limit áp lên process/cgroup, còn Xmx chỉ giới hạn Java heap. Metaspace, code cache, direct buffers, thread stacks, GC/JIT/native và sidecar vẫn dùng memory; kernel có thể kill trước khi JVM ném OOME.

## Câu trả lời chi tiết

Tôi kiểm container last state/events, RSS/working set và flags thực tế, rồi đối chiếu heap, GC, Native Memory Tracking, direct buffer và thread count. Lập budget có headroom thay vì đặt Xmx bằng limit. Heap dump cũng cần disk/memory nên phải chuẩn bị trước.

## Deep Dive

CPU quota/throttling còn làm GC và request p99 xấu; tăng thread hoặc replica có thể dồn bottleneck vào DB.

## Góc nhìn Production

Soak test dưới đúng cgroup, alert headroom/restart/throttling và ghi runbook dump destination/restore behavior.

## Trade-offs

CPU quota/throttling còn làm GC và request p99 xấu; tăng thread hoặc replica có thể dồn bottleneck vào DB.

## Câu trả lời sai thường gặp

JVM chỉ dùng heap nên Xmx thấp hơn limit vài MB là luôn an toàn.

## Follow-up

- Java OOME khác OOMKilled ở evidence nào?

- Platform thread và virtual thread dùng memory khác nhau ra sao?

## Nguồn chính thống

- [Docker — Docker resource constraints](https://docs.docker.com/engine/containers/resource_constraints/)
