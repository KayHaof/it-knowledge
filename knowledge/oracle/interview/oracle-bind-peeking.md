---
id: oracle-bind-peeking
type: interview-question
technology: Oracle
category: Oracle
difficulty: senior
topics:
  - Oracle
  - optimizer
  - bind-peeking
relatedLessons:
  - oracle-undo-read-consistency-optimizer
sources:
  - title: Oracle Data Concurrency and Consistency
    url: https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Oracle Query Optimizer Concepts
    url: https://docs.oracle.com/en/database/oracle/oracle-database/23/tgsql/query-optimizer-concepts.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Oracle Explaining and Displaying Execution Plans
    url: https://docs.oracle.com/en/database/oracle/oracle-database/23/tgsql/generating-and-displaying-execution-plans.html
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
    - id: oracle
      required: true
      aliases:
        - Oracle
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: optimizer
      required: true
      aliases:
        - optimizer
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: bind-peeking
      required: false
      aliases:
        - bind-peeking
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Bind variable luôn làm Oracle dùng một execution plan tối ưu cho mọi giá trị.
      penalty: 20
---

# Bind variable peeking của Oracle có thể tạo plan không ổn định ra sao?

## Rubric

### Must Include

- Oracle

- optimizer

### Strong Answer Includes

- bind-peeking

## Câu trả lời 30 giây

Optimizer có thể nhìn giá trị bind đầu để chọn plan rồi reuse cho giá trị phân bố khác. Skew khiến một plan tốt cho tenant lớn nhưng tệ cho tenant nhỏ; adaptive cursor/statistics có thể giúp nhưng cần đo.

## Câu trả lời chi tiết

Hard parse/soft parse, histogram và cursor sharing ảnh hưởng plan cache. Literal peeking khác bind behavior theo version/settings; forcing plan che triệu chứng nhưng có risk. SQL Plan Management, stats và query shape phải được review cùng workload skew.

## Góc nhìn Production

Theo dõi child cursors, parse CPU, plan hash và p99 theo bind distribution. Không flush shared pool tùy tiện trong incident.

## Trade-offs

Hard parse/soft parse, histogram và cursor sharing ảnh hưởng plan cache. Literal peeking khác bind behavior theo version/settings; forcing plan che triệu chứng nhưng có risk. SQL Plan Management, stats và query shape phải được review cùng workload skew.

## Câu trả lời sai thường gặp

Bind variable luôn làm Oracle dùng một execution plan tối ưu cho mọi giá trị.

## Follow-up

- Histogram phù hợp column nào?

- Plan baseline rollback thế nào?

## Nguồn chính thống

- [Oracle — Oracle Data Concurrency and Consistency](https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html)
- [Oracle — Oracle Query Optimizer Concepts](https://docs.oracle.com/en/database/oracle/oracle-database/23/tgsql/query-optimizer-concepts.html)
- [Oracle — Oracle Explaining and Displaying Execution Plans](https://docs.oracle.com/en/database/oracle/oracle-database/23/tgsql/generating-and-displaying-execution-plans.html)
