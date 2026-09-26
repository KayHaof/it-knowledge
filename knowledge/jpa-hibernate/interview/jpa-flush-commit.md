---
id: jpa-flush-commit
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - flush
  - commit
  - transaction
relatedLessons:
  - spring-jpa-persistence-context
sources:
  - title: Jakarta Persistence Specification
    url: https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2
    organization: Jakarta EE
    type: specification
    accessedAt: 2026-09-02
  - title: Hibernate ORM User Guide
    url: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html
    organization: Hibernate
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Data JPA Persisting Entities
    url: https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html
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
    - id: flush
      required: true
      aliases:
        - flush
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: commit
      required: true
      aliases:
        - commit
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: transaction
      required: false
      aliases:
        - transaction
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Flush là commit sớm nên sau flush không thể rollback.
      penalty: 20
---

# Flush khác commit thế nào trong JPA?

## Rubric

### Must Include

- flush

- commit

### Strong Answer Includes

- transaction

## Câu trả lời 30 giây

Flush đồng bộ thay đổi managed xuống database nhưng transaction vẫn có thể rollback. Commit kết thúc transaction và làm thay đổi durable theo database; flush có thể xảy ra trước commit để kiểm tra constraint hoặc phục vụ query.

## Câu trả lời chi tiết

Flush mode quyết định khi context synchronize: AUTO thường flush trước query ảnh hưởng, COMMIT trì hoãn hơn theo provider. SQL đã chạy không đồng nghĩa caller khác thấy dữ liệu nếu isolation chưa cho phép. Constraint/trigger có thể fail ở flush chứ không phải setter. Không gọi flush để giả lập commit hay mở transaction lâu.

## Góc nhìn Production

Đo flush duration, statement count và lock hold; đặt transaction timeout. Dùng `saveAndFlush` chỉ khi cần boundary rõ, không như optimization mặc định.

## Trade-offs

Flush mode quyết định khi context synchronize: AUTO thường flush trước query ảnh hưởng, COMMIT trì hoãn hơn theo provider. SQL đã chạy không đồng nghĩa caller khác thấy dữ liệu nếu isolation chưa cho phép. Constraint/trigger có thể fail ở flush chứ không phải setter. Không gọi flush để giả lập commit hay mở transaction lâu.

## Câu trả lời sai thường gặp

Flush là commit sớm nên sau flush không thể rollback.

## Follow-up

- Query có thể trigger flush khi nào?

- Constraint fail ở flush xử lý ra sao?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
