---
id: docker-image-layer-cache
type: interview-question
technology: Docker
category: Docker
difficulty: junior
topics:
  - Dockerfile
  - layers
  - build-cache
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
    - id: dockerfile
      required: true
      aliases:
        - Dockerfile
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: layers
      required: true
      aliases:
        - layers
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: build-cache
      required: false
      aliases:
        - build-cache
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Xóa file secret trong Dockerfile cuối cùng sẽ loại bỏ secret khỏi image history.
      penalty: 20
---

# Docker layer order ảnh hưởng build cache và security thế nào?

## Rubric

### Must Include

- Dockerfile

- layers

### Strong Answer Includes

- build-cache

## Câu trả lời 30 giây

Mỗi instruction tạo layer; đổi layer làm các layer sau rebuild. Đặt dependency ổn định trước source giúp cache, nhưng không copy secret vào layer vì xóa ở layer sau vẫn để lại trong history.

## Câu trả lời chi tiết

Multi-stage build tách toolchain khỏi runtime; `.dockerignore` giảm context. Pin base digest và tạo non-root user. Cache mount tăng tốc CI nhưng cần trust/eviction policy.

## Góc nhìn Production

Inspect image history/size, scan mỗi digest và rebuild base định kỳ.

## Trade-offs

Multi-stage build tách toolchain khỏi runtime; `.dockerignore` giảm context. Pin base digest và tạo non-root user. Cache mount tăng tốc CI nhưng cần trust/eviction policy.

## Câu trả lời sai thường gặp

Xóa file secret trong Dockerfile cuối cùng sẽ loại bỏ secret khỏi image history.

## Follow-up

- Multi-stage giảm attack surface ra sao?

- Build cache poisoning phòng thế nào?

## Nguồn chính thống

- [Docker — What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
- [Docker — Multi-stage builds](https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/)
