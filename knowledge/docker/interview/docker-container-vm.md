---
id: docker-container-vm
type: interview-question
technology: Docker
category: Docker
difficulty: junior
topics:
  - container
  - VM
  - isolation
relatedLessons:
  - docker-production
sources:
  - title: What is a container?
    url: https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/
    organization: Docker
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Multi-stage builds
    url: https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/
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
    - id: container
      required: true
      aliases:
        - container
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: vm
      required: true
      aliases:
        - VM
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: isolation
      required: false
      aliases:
        - isolation
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Container chứa một kernel riêng nên isolation luôn tương đương VM.
      penalty: 20
---

# Container khác VM ở lớp isolation và chi phí thế nào?

## Rubric

### Must Include

- container

- VM

### Strong Answer Includes

- isolation

## Câu trả lời 30 giây

Container chia sẻ kernel host qua namespaces/cgroups nên khởi động nhẹ hơn; VM có guest kernel và isolation mạnh hơn. Container không phải security boundary tuyệt đối.

## Câu trả lời chi tiết

Image chứa user-space layers, còn runtime dùng kernel host; kernel mismatch/capability cần cân nhắc. VM phù hợp kernel/tenant isolation khác, container phù hợp density/deploy speed. Cả hai cần patch, least privilege và resource limits.

## Góc nhìn Production

Pin image digest, scan CVE và test kernel/runtime compatibility.

## Trade-offs

Image chứa user-space layers, còn runtime dùng kernel host; kernel mismatch/capability cần cân nhắc. VM phù hợp kernel/tenant isolation khác, container phù hợp density/deploy speed. Cả hai cần patch, least privilege và resource limits.

## Câu trả lời sai thường gặp

Container chứa một kernel riêng nên isolation luôn tương đương VM.

## Follow-up

- Namespace và cgroup làm gì?

- Khi nào chọn VM cho workload?

## Nguồn chính thống

- [Docker — What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
- [Docker — Multi-stage builds](https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/)
