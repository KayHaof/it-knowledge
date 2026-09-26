---
id: system-design-file-storage-upload
type: interview-question
technology: System Design
category: System Design
difficulty: system-design
topics:
  - object-storage
  - multipart
  - CDN
relatedLessons:
  - system-design-file-storage
sources:
  - title: Amazon S3 data consistency model
    url: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel
    organization: Amazon Web Services
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Uploading and copying objects using multipart upload
    url: https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html
    organization: Amazon Web Services
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Download and upload objects with presigned URLs
    url: https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html
    organization: Amazon Web Services
    type: official-documentation
    accessedAt: 2026-09-02
  - title: RFC 9110 — HTTP Semantics
    url: https://www.rfc-editor.org/rfc/rfc9110.html
    organization: IETF
    type: standard
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
    - id: object-storage
      required: true
      aliases:
        - object-storage
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: multipart
      required: true
      aliases:
        - multipart
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: cdn
      required: false
      aliases:
        - CDN
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Lưu binary trực tiếp trong relational row luôn đơn giản và scale tốt nhất.
      penalty: 20
---

# Thiết kế file storage upload lớn và download an toàn?

## Rubric

### Must Include

- object-storage

- multipart

### Strong Answer Includes

- CDN

## Câu trả lời 30 giây

API cấp presigned URL, client upload multipart tới object storage; metadata DB giữ owner/checksum/status. Download qua signed URL/CDN với authorization và virus/content validation.

## Câu trả lời chi tiết

Resumable multipart giảm retry bandwidth; finalize transaction ghi manifest sau parts đủ. Quota, dedup, lifecycle/retention và orphan cleanup cần worker. Không proxy toàn file qua app nếu không cần; range request và CDN phục vụ hot downloads.

## Góc nhìn Production

Theo dõi orphan bytes, upload completion, checksum failures và egress cost; scan async trước publish.

## Trade-offs

Resumable multipart giảm retry bandwidth; finalize transaction ghi manifest sau parts đủ. Quota, dedup, lifecycle/retention và orphan cleanup cần worker. Không proxy toàn file qua app nếu không cần; range request và CDN phục vụ hot downloads.

## Câu trả lời sai thường gặp

Lưu binary trực tiếp trong relational row luôn đơn giản và scale tốt nhất.

## Follow-up

- Multipart finalize crash xử lý thế nào?

- Presigned URL leak giảm impact ra sao?

## Nguồn chính thống

- [Amazon Web Services — Amazon S3 data consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)
- [Amazon Web Services — Uploading and copying objects using multipart upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)
- [Amazon Web Services — Download and upload objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [IETF — RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
