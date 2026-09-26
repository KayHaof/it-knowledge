---
id: jpa-dirty-checking
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - dirty-checking
  - snapshot
  - flush
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
    - id: dirty-checking
      required: true
      aliases:
        - dirty-checking
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: snapshot
      required: true
      aliases:
        - snapshot
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
        - Mỗi setter của entity lập tức gửi một UPDATE tới database.
      penalty: 20
---

# Dirty checking của Hibernate hoạt động ra sao và khi nào không chạy?

## Rubric

### Must Include

- dirty-checking

- snapshot

### Strong Answer Includes

- flush

## Câu trả lời 30 giây

Hibernate chụp state entity managed rồi so sánh lúc flush để phát hiện thay đổi và sinh UPDATE. Entity detached, bulk SQL hoặc native update không đi qua cơ chế này; field phải được mutate trong context.

## Câu trả lời chi tiết

Persistent context giữ managed instance và loaded state; flush duyệt dirty entities, tính SQL theo dynamic-update/config và bind values. Setter không bắt buộc nếu field access, nhưng mutation phải đúng instance. Bulk JPQL bypass context nên entity đang cache có thể stale; clear/refresh sau đó. Dirty checking không có nghĩa update ngay khi setter gọi.

## Góc nhìn Production

Giới hạn số entity managed, flush/clear theo batch và đo dirty-check time. Không load graph lớn chỉ để sửa một column; dùng command query có invariant rõ.

## Trade-offs

Persistent context giữ managed instance và loaded state; flush duyệt dirty entities, tính SQL theo dynamic-update/config và bind values. Setter không bắt buộc nếu field access, nhưng mutation phải đúng instance. Bulk JPQL bypass context nên entity đang cache có thể stale; clear/refresh sau đó. Dirty checking không có nghĩa update ngay khi setter gọi.

## Câu trả lời sai thường gặp

Mỗi setter của entity lập tức gửi một UPDATE tới database.

## Follow-up

- Dynamic update có trade-off gì?

- Bulk update làm context stale thế nào?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
- [Hibernate — Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring — Spring Data JPA Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html)
