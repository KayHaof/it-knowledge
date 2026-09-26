---
id: redis-hot-big-key
type: interview-question
technology: Redis
category: Redis
difficulty: senior
topics:
  - hot-key
  - big-key
  - latency
relatedLessons:
  - redis-hot-big-key-latency
sources:
  - title: Redis Diagnosing Latency Issues
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis Latency Monitoring
    url: https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis MEMORY USAGE
    url: https://redis.io/docs/latest/commands/memory-usage/
    organization: Redis
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Redis SLOWLOG
    url: https://redis.io/docs/latest/commands/slowlog/
    organization: Redis
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
    - id: hot-key
      required: true
      aliases:
        - hot-key
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: big-key
      required: true
      aliases:
        - big-key
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: latency
      required: false
      aliases:
        - latency
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Redis Cluster tự chia một hot key ra mọi node và big key chỉ ảnh hưởng disk, không latency.
      penalty: 20
---

# Hot key và big key gây lỗi vận hành Redis khác nhau thế nào?

## Rubric

### Must Include

- hot-key

- big-key

### Strong Answer Includes

- latency

## Câu trả lời 30 giây

Hot key tập trung request vào một key gây CPU/network hotspot; big key tốn memory và command serialization/block time khi đọc/xóa. Shard hot access, split payload và thao tác incremental theo semantics.

## Câu trả lời chi tiết

Một key hot vẫn nằm một hash slot/primary dù thêm cluster node; local replicas/read routing chỉ đổi trade-off consistency. Big collection `DEL` có thể block, dùng UNLINK/chunk nhưng vẫn cần quota. Cache stampede quanh hot key còn nhân tải origin. Key cardinality/size inventory phải có sampling.

## Góc nhìn Production

Theo dõi command latency, keyspace frequency, object size, network egress và slowlog. Triage bằng `--bigkeys`/sampling cẩn trọng, không scan production vô hạn.

## Trade-offs

Một key hot vẫn nằm một hash slot/primary dù thêm cluster node; local replicas/read routing chỉ đổi trade-off consistency. Big collection `DEL` có thể block, dùng UNLINK/chunk nhưng vẫn cần quota. Cache stampede quanh hot key còn nhân tải origin. Key cardinality/size inventory phải có sampling.

## Câu trả lời sai thường gặp

Redis Cluster tự chia một hot key ra mọi node và big key chỉ ảnh hưởng disk, không latency.

## Follow-up

- Hot key sharding có đổi ordering không?

- UNLINK giải phóng memory ngay không?

## Nguồn chính thống

- [Redis — Redis Diagnosing Latency Issues](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)
- [Redis — Redis Latency Monitoring](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/)
- [Redis — Redis MEMORY USAGE](https://redis.io/docs/latest/commands/memory-usage/)
- [Redis — Redis SLOWLOG](https://redis.io/docs/latest/commands/slowlog/)
