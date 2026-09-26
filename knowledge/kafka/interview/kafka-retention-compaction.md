---
id: kafka-retention-compaction
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - retention
  - log-compaction
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
    - id: log-compaction
      required: true
      aliases:
        - log-compaction
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
        - Compaction giữ toàn bộ lịch sử và xóa message ngay khi key có bản ghi mới.
      penalty: 20
---

# Retention và log compaction phục vụ use case nào?

## Rubric

### Must Include

- retention

- log-compaction

### Strong Answer Includes

- tombstone

## Câu trả lời 30 giây

Retention xóa record theo thời gian/kích thước; compaction giữ bản ghi mới nhất theo key để tạo changelog. Compaction không đảm bảo xóa ngay và tombstone có thời gian tồn tại.

## Câu trả lời chi tiết

Event stream cần history dùng delete policy; state snapshot/changelog dùng compact policy hoặc kết hợp. Cleaner chạy nền, segment/dirty ratio ảnh hưởng thời điểm compact. Key null/tombstone biểu thị delete và consumer restore phải hiểu semantics.

## Góc nhìn Production

Theo dõi disk usage, cleaner lag, segment age và restore time; đặt retention theo replay SLO.

## Trade-offs

Event stream cần history dùng delete policy; state snapshot/changelog dùng compact policy hoặc kết hợp. Cleaner chạy nền, segment/dirty ratio ảnh hưởng thời điểm compact. Key null/tombstone biểu thị delete và consumer restore phải hiểu semantics.

## Câu trả lời sai thường gặp

Compaction giữ toàn bộ lịch sử và xóa message ngay khi key có bản ghi mới.

## Follow-up

- Tombstone tồn tại bao lâu?

- Compact topic có đảm bảo thứ tự restore không?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Topic Configs](https://kafka.apache.org/43/configuration/topic-configs/)
- [Apache Kafka — Apache Kafka Hardware and OS](https://kafka.apache.org/43/operations/hardware-and-os/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
- [Apache Kafka — Apache Kafka Basic Operations](https://kafka.apache.org/43/operations/basic-kafka-operations/)
