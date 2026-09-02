---
id: relational-database
slug: relational-database-fundamentals
title: Relational Database Fundamentals
description: Table, key, constraint, join, ACID, isolation, MVCC và lock qua góc nhìn bảo vệ invariant.
category: database
technology: SQL / PostgreSQL / MySQL / Oracle
level: beginner
estimatedMinutes: 30
tags: ["sql","acid","transaction","mvcc","locks"]
prerequisites: []
related: ["database-query-plan","jpa-n-plus-one"]
next: database-query-plan
learningObjectives: ["Dùng constraint để bảo vệ dữ liệu","Giải thích isolation anomaly","Phân biệt MVCC với không có lock"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL concurrency control","url":"https://www.postgresql.org/docs/current/mvcc.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL InnoDB transaction model","url":"https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Oracle Database concepts","url":"https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Relational model giải quyết gì
Table biểu diễn relation có schema; primary key nhận diện row; foreign key và constraint bảo vệ invariant tại nơi mọi writer đều phải đi qua. Application validation cải thiện UX nhưng không thay UNIQUE, NOT NULL, CHECK hoặc FK khi correctness quan trọng.

## Transaction và ACID
Atomicity là all-or-nothing; consistency nghĩa transaction hợp lệ giữ invariant; isolation kiểm soát ảnh hưởng giữa transaction đồng thời; durability là commit tồn tại theo guarantee của engine/configuration. ACID không nói hệ thống phân tán tự có strong consistency.

## Isolation anomaly
| Anomaly | Ý nghĩa |
|---|---|
| Dirty read | Đọc dữ liệu chưa commit |
| Non-repeatable read | Cùng row, hai lần đọc khác nhau |
| Phantom | Query predicate thấy tập row thay đổi |
| Lost update/write skew | Invariant hỏng do concurrent decision |

MVCC giữ nhiều version để reader/writer ít chặn nhau hơn. Nó không đồng nghĩa “không lock”; write conflict, DDL và explicit locking vẫn tồn tại, chi tiết phụ thuộc engine/isolation.

```sql title="Protect an invariant"
BEGIN;
SELECT balance FROM accounts WHERE id = 42 FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 42;
COMMIT;
```

:::production Transaction boundary
Giữ transaction ngắn, không gọi remote API trong lúc giữ lock. Theo dõi deadlock, lock wait, long transaction, connection pool và replication lag.
:::

## Trả lời phỏng vấn
Database relational mạnh khi cần schema, constraint, join và transaction bảo vệ invariant. Tôi chọn isolation theo anomaly cần ngăn, rồi kiểm tra behavior cụ thể của engine; isolation cao hơn có thể giảm concurrency hoặc tạo retry.

## Key Takeaways
- Constraint là lớp phòng thủ correctness trung tâm.
- MVCC giảm contention đọc/ghi nhưng không xóa lock.
- Transaction dài gây bloat, lock wait và pool exhaustion.
- Isolation được chọn theo invariant, không theo “mức cao nhất luôn tốt”.
