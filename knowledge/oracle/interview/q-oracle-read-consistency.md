---
id: q-oracle-read-consistency
type: interview-question
technology: Oracle
category: Oracle
difficulty: senior
topics:
  - undo
  - read-consistency
  - ORA-01555
relatedLessons:
  - database-engine-tradeoffs
sources:
  - title: Oracle data concurrency and consistency
    url: https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html
    organization: Oracle
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
    - id: undo
      required: true
      aliases:
        - undo
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: read-consistency
      required: true
      aliases:
        - read-consistency
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: ora-01555
      required: false
      aliases:
        - ORA-01555
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Consistent read copy toàn database lúc query bắt đầu nên không phụ thuộc undo.
      penalty: 20
---

# Oracle dùng undo cho read consistency như thế nào và ORA-01555 gợi ý điều gì?

## Rubric

### Must Include

- undo

- read-consistency

### Strong Answer Includes

- ORA-01555

## Câu trả lời 30 giây

Query đọc snapshot theo SCN và có thể dùng undo để dựng phiên bản cũ khi row đã đổi. ORA-01555 cho thấy phiên bản undo cần thiết không còn sẵn cho query, thường liên quan query dài, undo pressure/retention và workload update.

## Câu trả lời chi tiết

Tôi xác định query duration/plan, undo tablespace/retention, commit/update rate và thời điểm lỗi. Tăng retention/space có thể cần nhưng cũng tối ưu query hoặc giảm churn. Không kết luận chỉ từ message; read consistency và locking là hai cơ chế khác nhau.

## Deep Dive

Frequent commit trong loop không phải fix phổ quát và có thể làm consistency/business transaction sai; cần thiết kế unit of work và capacity undo.

## Góc nhìn Production

Theo dõi long query, undo usage và change rate; thử recovery/peak workload trước thay đổi retention.

## Trade-offs

Frequent commit trong loop không phải fix phổ quát và có thể làm consistency/business transaction sai; cần thiết kế unit of work và capacity undo.

## Câu trả lời sai thường gặp

Consistent read copy toàn database lúc query bắt đầu nên không phụ thuộc undo.

## Follow-up

- SCN đóng vai trò gì?

- Read consistency khác serializable isolation?

## Nguồn chính thống

- [Oracle — Oracle data concurrency and consistency](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html)
