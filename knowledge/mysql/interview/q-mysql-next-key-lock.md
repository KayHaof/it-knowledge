---
id: q-mysql-next-key-lock
type: interview-question
technology: MySQL
category: MySQL
difficulty: senior
topics:
  - InnoDB
  - next-key-lock
  - deadlock
relatedLessons:
  - transactions-mvcc-deadlocks
sources:
  - title: InnoDB next-key locking
    url: https://dev.mysql.com/doc/refman/8.4/en/innodb-next-key-locking.html
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
    - id: next-key-lock
      required: true
      aliases:
        - next-key-lock
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: deadlock
      required: false
      aliases:
        - deadlock
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - InnoDB chỉ khóa các row đã tồn tại nên INSERT mới không bao giờ bị UPDATE range chặn.
      penalty: 20
---

# Vì sao một UPDATE range trong InnoDB có thể chặn INSERT tưởng như không đụng row nào?

## Rubric

### Must Include

- InnoDB

- next-key-lock

### Strong Answer Includes

- deadlock

## Câu trả lời 30 giây

Tùy isolation và index access, InnoDB có thể dùng next-key lock gồm record plus gap để ngăn phantom. INSERT vào gap bị khóa phải chờ dù chưa có row cùng key.

## Câu trả lời chi tiết

Tôi lấy transaction/lock report và execution plan để biết index range thực tế. Thiếu index có thể làm scan và lock footprint rộng. Fix có thể là index/predicate chính xác hơn, transaction ngắn, lock order nhất quán hoặc isolation khác sau khi kiểm invariant; không tắt locking mù.

## Deep Dive

Unique lookup trên unique index có behavior hẹp hơn range scan. Deadlock vẫn có thể xảy ra và InnoDB chọn victim để rollback.

## Góc nhìn Production

Theo dõi lock wait/deadlock, transaction age và retry toàn transaction có giới hạn nếu idempotent.

## Trade-offs

Unique lookup trên unique index có behavior hẹp hơn range scan. Deadlock vẫn có thể xảy ra và InnoDB chọn victim để rollback.

## Câu trả lời sai thường gặp

InnoDB chỉ khóa các row đã tồn tại nên INSERT mới không bao giờ bị UPDATE range chặn.

## Follow-up

- Gap lock giải quyết phantom thế nào?

- Index thiếu làm lock footprint đổi ra sao?

## Nguồn chính thống

- [Oracle MySQL — InnoDB next-key locking](https://dev.mysql.com/doc/refman/8.4/en/innodb-next-key-locking.html)
