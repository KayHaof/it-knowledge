---
id: kafka-retention-compaction-original
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - retention
  - compaction
  - tombstone
relatedLessons:
  - kafka-capacity-retention-operations
sources:
  - title: Apache Kafka Topic Configs
    url: https://kafka.apache.org/43/configuration/topic-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Hardware and OS
    url: https://kafka.apache.org/43/operations/hardware-and-os/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Monitoring
    url: https://kafka.apache.org/43/operations/monitoring/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Basic Operations
    url: https://kafka.apache.org/43/operations/basic-kafka-operations/
    organization: Apache Kafka
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
    - id: retention
      required: true
      aliases:
        - retention
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: compaction
      required: true
      aliases:
        - compaction
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: tombstone
      required: false
      aliases:
        - tombstone
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Compaction lập tức chỉ giữ một record mỗi key và retention time không còn ý nghĩa.
      penalty: 20
---

# Retention và log compaction phục vụ hai loại stream nào?

## Rubric

### Must Include

- retention

- compaction

### Strong Answer Includes

- tombstone

## Câu trả lời 30 giây

Retention theo time/size giữ lịch sử trong cửa sổ; compaction giữ record mới nhất theo key, phù hợp changelog/state recovery. Compaction không xóa ngay và tombstone có retention riêng.

## Câu trả lời chi tiết

Segment roll/delete policy xác định storage reclaim; compactor chọn dirty ratio và key duplicates. Compacted topic vẫn có duplicate trước khi clean, ordering theo partition giữ nhưng replay state cần xử lý tombstone. Event audit cần retention đầy đủ, không dùng compact-only làm lịch sử pháp lý.

## Góc nhìn Production

Theo dõi log bytes, segment age, cleaner backlog, delete lag và disk headroom. Test restore consumer mới và tombstone expiry.

## Trade-offs

Segment roll/delete policy xác định storage reclaim; compactor chọn dirty ratio và key duplicates. Compacted topic vẫn có duplicate trước khi clean, ordering theo partition giữ nhưng replay state cần xử lý tombstone. Event audit cần retention đầy đủ, không dùng compact-only làm lịch sử pháp lý.

## Câu trả lời sai thường gặp

Compaction lập tức chỉ giữ một record mỗi key và retention time không còn ý nghĩa.

## Follow-up

- Tombstone tồn tại bao lâu?

- Changelog compact topic dùng để rebuild state thế nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Topic Configs](https://kafka.apache.org/43/configuration/topic-configs/)
- [Apache Kafka — Apache Kafka Hardware and OS](https://kafka.apache.org/43/operations/hardware-and-os/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
