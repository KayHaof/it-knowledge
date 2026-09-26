---
id: kafka-leader-replica-isr
type: interview-question
technology: Kafka
category: Kafka
difficulty: middle
topics:
  - leader
  - replica
  - ISR
relatedLessons:
  - kafka-broker-storage-replication
sources:
  - title: Apache Kafka Design
    url: https://kafka.apache.org/43/design/design/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Broker Configs
    url: https://kafka.apache.org/43/configuration/broker-configs/
    organization: Apache Kafka
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Apache Kafka Monitoring
    url: https://kafka.apache.org/43/operations/monitoring/
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
    - id: leader
      required: true
      aliases:
        - leader
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: replica
      required: true
      aliases:
        - replica
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: isr
      required: false
      aliases:
        - ISR
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi replica xử lý produce đồng thời và ISR chỉ là danh sách consumer.
      penalty: 20
---

# Leader, follower replica và ISR trong một Kafka partition khác nhau thế nào?

## Rubric

### Must Include

- leader

- replica

### Strong Answer Includes

- ISR

## Câu trả lời 30 giây

Leader nhận produce/fetch; follower replicate log. ISR là replicas bắt kịp đủ điều kiện để tham gia acknowledge/leader election theo config. Follower lag có thể bị loại khỏi ISR.

## Câu trả lời chi tiết

Mỗi partition chỉ có một leader tại thời điểm, consumer thường fetch leader (trừ rack-aware configs). High watermark quyết định records consumer thấy đã replicated đủ; log end offset của follower có thể khác. Reassignment/recovery dùng bandwidth/disk và ảnh hưởng p99.

## Góc nhìn Production

Theo dõi ISR churn, HW/LEO lag, disk, network và controller events. Không coi replica count là healthy nếu under-replicated.

## Trade-offs

Mỗi partition chỉ có một leader tại thời điểm, consumer thường fetch leader (trừ rack-aware configs). High watermark quyết định records consumer thấy đã replicated đủ; log end offset của follower có thể khác. Reassignment/recovery dùng bandwidth/disk và ảnh hưởng p99.

## Câu trả lời sai thường gặp

Mọi replica xử lý produce đồng thời và ISR chỉ là danh sách consumer.

## Follow-up

- High watermark bảo vệ visibility ra sao?

- Follower lag do disk hay network phân biệt thế nào?

## Nguồn chính thống

- [Apache Kafka — Apache Kafka Design](https://kafka.apache.org/43/design/design/)
- [Apache Kafka — Apache Kafka Broker Configs](https://kafka.apache.org/43/configuration/broker-configs/)
- [Apache Kafka — Apache Kafka Monitoring](https://kafka.apache.org/43/operations/monitoring/)
