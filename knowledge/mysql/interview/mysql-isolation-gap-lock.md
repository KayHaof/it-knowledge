---
id: mysql-isolation-gap-lock
type: interview-question
technology: MySQL
category: MySQL
difficulty: senior
topics:
  - InnoDB
  - gap-lock
  - next-key
relatedLessons:
  - mysql-innodb-locks-replication
sources:
  - title: MySQL InnoDB Locking and Transaction Model
    url: https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-transaction-model.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Transaction Isolation Levels
    url: https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Replication Implementation
    url: https://dev.mysql.com/doc/refman/8.4/en/replication-implementation.html
    organization: Oracle MySQL
    type: official-documentation
    accessedAt: 2026-09-02
  - title: MySQL Replication with GTIDs
    url: https://dev.mysql.com/doc/refman/8.4/en/replication-gtids-concepts.html
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
    - id: gap-lock
      required: true
      aliases:
        - gap-lock
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: next-key
      required: false
      aliases:
        - next-key
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - InnoDB chỉ khóa rows đã tồn tại nên INSERT vào khoảng trống luôn không bị block.
      penalty: 20
---

# Gap/next-key lock của InnoDB bảo vệ range predicate nhưng tạo rủi ro nào?

## Rubric

### Must Include

- InnoDB

- gap-lock

### Strong Answer Includes

- next-key

## Câu trả lời 30 giây

Nó khóa record và khoảng giữa record để ngăn insert phantom theo isolation/statement. Range rộng hoặc index không phù hợp có thể chặn insert không chạm row hiện hữu và gây deadlock.

## Câu trả lời chi tiết

Under REPEATABLE READ, InnoDB dùng next-key locking cho locking reads/updates theo access path; exact behavior phụ thuộc index, isolation và query. Secondary index range có thể lock nhiều gap hơn expected. Covering/index predicate và transaction order giảm footprint; READ COMMITTED thay semantics một phần.

## Góc nhìn Production

Capture `SHOW ENGINE INNODB STATUS`, performance_schema waits và lock graph; test concurrent insert/range. Đặt index đúng và transaction ngắn.

## Trade-offs

Under REPEATABLE READ, InnoDB dùng next-key locking cho locking reads/updates theo access path; exact behavior phụ thuộc index, isolation và query. Secondary index range có thể lock nhiều gap hơn expected. Covering/index predicate và transaction order giảm footprint; READ COMMITTED thay semantics một phần.

## Câu trả lời sai thường gặp

InnoDB chỉ khóa rows đã tồn tại nên INSERT vào khoảng trống luôn không bị block.

## Follow-up

- READ COMMITTED thay gap lock thế nào?

- Deadlock detector xử lý cycle ra sao?

## Nguồn chính thống

- [Oracle MySQL — MySQL InnoDB Locking and Transaction Model](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-transaction-model.html)
- [Oracle MySQL — MySQL Transaction Isolation Levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html)
- [Oracle MySQL — MySQL Replication Implementation](https://dev.mysql.com/doc/refman/8.4/en/replication-implementation.html)
- [Oracle MySQL — MySQL Replication with GTIDs](https://dev.mysql.com/doc/refman/8.4/en/replication-gtids-concepts.html)
