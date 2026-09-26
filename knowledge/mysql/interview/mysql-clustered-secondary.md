---
id: mysql-clustered-secondary
type: interview-question
technology: MySQL
category: MySQL
difficulty: middle
topics:
  - InnoDB
  - clustered-index
  - secondary-index
relatedLessons:
  - mysql-innodb-clustered-secondary-indexes
sources:
  - title: MySQL Clustered and Secondary Indexes
    url: https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Physical Structure of an InnoDB Index
    url: https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Use of Index Extensions
    url: https://dev.mysql.com/doc/refman/8.4/en/index-extensions.html
    organization: Oracle MySQL
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
    - id: innodb
      required: true
      aliases:
        - InnoDB
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: clustered-index
      required: true
      aliases:
        - clustered-index
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: secondary-index
      required: false
      aliases:
        - secondary-index
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Secondary index InnoDB luôn chứa toàn bộ row nên không bao giờ lookup lần hai.
      penalty: 20
---

# InnoDB clustered primary key làm secondary index lookup khác heap table thế nào?

## Rubric

### Must Include

- InnoDB

- clustered-index

### Strong Answer Includes

- secondary-index

## Câu trả lời 30 giây

InnoDB lưu row theo clustered primary key; secondary index leaf chứa secondary key và primary key, rồi có thể phải lookup clustered record. Primary key dài làm mọi secondary index lớn hơn.

## Câu trả lời chi tiết

Nếu query chỉ cần secondary columns có thể covering, nếu không cần back-to-clustered lookup. Random UUID primary key gây page split/fragmentation hơn ordered key tùy pattern; đổi sang surrogate không miễn phí về locality/semantic. Table không có PK sẽ chọn unique non-null hoặc hidden clustered key theo engine behavior.

## Góc nhìn Production

Đo page fill, buffer misses, write amplification và index size. Chọn key theo insert/order/replication, không theo lý thuyết UUID vs int đơn giản.

## Trade-offs

Nếu query chỉ cần secondary columns có thể covering, nếu không cần back-to-clustered lookup. Random UUID primary key gây page split/fragmentation hơn ordered key tùy pattern; đổi sang surrogate không miễn phí về locality/semantic. Table không có PK sẽ chọn unique non-null hoặc hidden clustered key theo engine behavior.

## Câu trả lời sai thường gặp

Secondary index InnoDB luôn chứa toàn bộ row nên không bao giờ lookup lần hai.

## Follow-up

- Primary key dài ảnh hưởng storage thế nào?

- UUIDv7/ordered key có trade-off gì?

## Nguồn chính thống

- [Oracle MySQL — MySQL Clustered and Secondary Indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html)
- [Oracle MySQL — MySQL Physical Structure of an InnoDB Index](https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html)
- [Oracle MySQL — MySQL Use of Index Extensions](https://dev.mysql.com/doc/refman/8.4/en/index-extensions.html)
