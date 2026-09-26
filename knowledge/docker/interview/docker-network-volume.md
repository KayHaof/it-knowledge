---
id: docker-network-volume
type: interview-question
technology: Docker
category: Docker
difficulty: middle
topics:
  - network
  - volume
  - ports
relatedLessons:
  - docker-network-storage-isolation
sources:
  - title: Docker networking overview
    url: https://docs.docker.com/engine/network/
    organization: Docker
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Docker volumes
    url: https://docs.docker.com/engine/storage/volumes/
    organization: Docker
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Docker Engine security
    url: https://docs.docker.com/engine/security/
    organization: Docker
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Docker seccomp profiles
    url: https://docs.docker.com/engine/security/seccomp/
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
    - id: network
      required: true
      aliases:
        - network
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: volume
      required: true
      aliases:
        - volume
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ports
      required: false
      aliases:
        - ports
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Khai báo EXPOSE tự mở port trên host và writable layer luôn bền vững.
      penalty: 20
---

# Docker port publish và volume mount khác network/storage semantics nào?

## Rubric

### Must Include

- network

- volume

### Strong Answer Includes

- ports

## Câu trả lời 30 giây

Publish map port host tới container; service-to-service thường dùng network nội bộ. Volume lưu dữ liệu ngoài writable layer để sống qua container replacement.

## Câu trả lời chi tiết

Bind mount phụ thuộc host path/quyền; named volume do runtime quản lý. Expose không tự public port. Network isolation, DNS service name và backup/restore volume phải thiết kế riêng.

## Góc nhìn Production

Không publish database ra Internet; encrypt/backup volume và kiểm UID/GID.

## Trade-offs

Bind mount phụ thuộc host path/quyền; named volume do runtime quản lý. Expose không tự public port. Network isolation, DNS service name và backup/restore volume phải thiết kế riêng.

## Câu trả lời sai thường gặp

Khai báo EXPOSE tự mở port trên host và writable layer luôn bền vững.

## Follow-up

- Container restart mất dữ liệu nào?

- Network namespace cô lập ra sao?

## Nguồn chính thống

- [Docker — Docker networking overview](https://docs.docker.com/engine/network/)
- [Docker — Docker volumes](https://docs.docker.com/engine/storage/volumes/)
- [Docker — Docker Engine security](https://docs.docker.com/engine/security/)
- [Docker — Docker seccomp profiles](https://docs.docker.com/engine/security/seccomp/)
