---
id: spring-transaction-readonly-original
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - transaction
  - readOnly
  - flush
relatedLessons:
  - spring-transaction-failure-playbook
sources:
  - title: Using @Transactional
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Transaction Propagation
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Rolling Back a Declarative Transaction
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Programmatic Transaction Management
    url: https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html
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
    - id: transaction
      required: true
      aliases:
        - transaction
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: readonly
      required: true
      aliases:
        - readOnly
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: flush
      required: false
      aliases:
        - flush
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - readOnly=true luôn làm mọi INSERT/UPDATE trong call chain ném exception ở mọi database.
      penalty: 20
---

# `readOnly=true` trong Spring transaction có phải database luôn chặn write không?

## Rubric

### Must Include

- transaction

- readOnly

### Strong Answer Includes

- flush

## Câu trả lời 30 giây

Không phải mọi driver/database đều enforce read-only như nhau. Nó là hint có thể tối ưu flush/route connection, nhưng code vẫn cần authorization và invariant; write ngoài transaction riêng có thể vẫn xảy ra.

## Câu trả lời chi tiết

Spring truyền read-only hint tới transaction manager; Hibernate có thể đổi flush behavior, database có thể set session read-only hoặc bỏ qua. Query method gọi nested write có semantics propagation riêng. Không dùng annotation để thay test database permission, và đừng giữ read-only transaction lâu khi stream lớn.

## Góc nhìn Production

Kiểm tra actual SQL/flush và connection state trên database thật. Theo dõi transaction duration, pool usage và accidental writes bằng audit/constraint.

## Trade-offs

Spring truyền read-only hint tới transaction manager; Hibernate có thể đổi flush behavior, database có thể set session read-only hoặc bỏ qua. Query method gọi nested write có semantics propagation riêng. Không dùng annotation để thay test database permission, và đừng giữ read-only transaction lâu khi stream lớn.

## Câu trả lời sai thường gặp

readOnly=true luôn làm mọi INSERT/UPDATE trong call chain ném exception ở mọi database.

## Follow-up

- Propagation REQUIRED ảnh hưởng nested read/write thế nào?

- Streaming result giữ connection bao lâu?

## Nguồn chính thống

- [Spring — Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Spring — Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
- [Spring — Rolling Back a Declarative Transaction](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html)
- [Spring — Programmatic Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html)
