---
id: spring-kafka-consumer-ack
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - Spring Kafka
  - ack
  - transactions
relatedLessons:
  - spring-kafka-event-consumer-production
sources:
  - title: Spring Kafka — Message Listener Containers
    url: https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/message-listener-container.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Kafka — @KafkaListener Annotation
    url: https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/listener-annotation.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Kafka — Handling Exceptions
    url: https://docs.spring.io/spring-kafka/reference/kafka/annotation-error-handling.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Kafka — Transactions
    url: https://docs.spring.io/spring-kafka/reference/kafka/transactions.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Kafka — Exactly Once Semantics
    url: https://docs.spring.io/spring-kafka/reference/kafka/exactly-once.html
    organization: Spring
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
    - id: spring-kafka
      required: true
      aliases:
        - Spring Kafka
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: ack
      required: true
      aliases:
        - ack
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: transactions
      required: false
      aliases:
        - transactions
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Ack trước sẽ đảm bảo không duplicate vì Kafka biết consumer đã nhận message.
      penalty: 20
---

# Trong Spring Kafka, commit offset trước hay sau khi xử lý business?

## Rubric

### Must Include

- Spring Kafka

- ack

### Strong Answer Includes

- transactions

## Câu trả lời 30 giây

At-least-once thường commit sau khi side effect thành công để tránh mất message, nhưng có thể duplicate khi crash sau side effect trước commit. Consumer cần idempotency/unique key và transaction boundary phù hợp.

## Câu trả lời chi tiết

Ack mode quyết định khi container commit; async processing phải pause/track work chứ không ack sớm mù. Kafka transaction có thể atomically publish output và offset trong Kafka, nhưng không tự bao database. Error handler/DLT cần phân loại poison/transient, backoff và tránh seek loop vô hạn.

## Góc nhìn Production

Theo dõi lag, retry/DLT rate, rebalance và processing latency; test crash ở từng điểm. Giữ partition ordering nếu business yêu cầu và giới hạn concurrency.

## Trade-offs

Ack mode quyết định khi container commit; async processing phải pause/track work chứ không ack sớm mù. Kafka transaction có thể atomically publish output và offset trong Kafka, nhưng không tự bao database. Error handler/DLT cần phân loại poison/transient, backoff và tránh seek loop vô hạn.

## Câu trả lời sai thường gặp

Ack trước sẽ đảm bảo không duplicate vì Kafka biết consumer đã nhận message.

## Follow-up

- DB update và offset commit làm sao tránh mất event?

- Rebalance trong lúc async handler chạy xử lý thế nào?

## Nguồn chính thống

- [Spring — Spring Kafka — Message Listener Containers](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/message-listener-container.html)
- [Spring — Spring Kafka — @KafkaListener Annotation](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/listener-annotation.html)
- [Spring — Spring Kafka — Handling Exceptions](https://docs.spring.io/spring-kafka/reference/kafka/annotation-error-handling.html)
- [Spring — Spring Kafka — Transactions](https://docs.spring.io/spring-kafka/reference/kafka/transactions.html)
- [Spring — Spring Kafka — Exactly Once Semantics](https://docs.spring.io/spring-kafka/reference/kafka/exactly-once.html)
