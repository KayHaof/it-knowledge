---
id: q-jpa-persistence-context
type: interview-question
technology: JPA/Hibernate
category: JPA/Hibernate
difficulty: middle
topics:
  - persistence-context
  - dirty-checking
  - flush
relatedLessons:
  - spring-jpa-persistence-context
sources:
  - title: Jakarta Persistence specification
    url: https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2
    organization: Jakarta EE
    type: specification
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
    - id: persistence-context
      required: true
      aliases:
        - persistence-context
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: dirty-checking
      required: true
      aliases:
        - dirty-checking
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
        - repository.save luôn execute INSERT ngay và transaction đã hoàn tất trước khi method trả về.
      penalty: 20
---

# Gọi save có đồng nghĩa SQL đã chạy và commit chưa?

## Rubric

### Must Include

- persistence-context

- dirty-checking

### Strong Answer Includes

- flush

## Câu trả lời 30 giây

Không. Entity có thể chỉ trở thành managed; dirty checking và flush phát SQL trước query/commit tùy context. Flush đưa thay đổi tới DB connection nhưng transaction chỉ bền vững khi commit thành công.

## Câu trả lời chi tiết

Persistence Context là identity map và unit of work. Entity có transient/managed/detached/removed states; managed changes được phát hiện khi flush. Constraint exception có thể xuất hiện cuối boundary. Bulk update bypass managed state nên cần clear/refresh để tránh stale object.

## Deep Dive

Flush mode và ID generation ảnh hưởng thời điểm SQL, nhưng application không nên dựa vào accidental timing. Test commit/rollback qua integration database.

## Góc nhìn Production

Giữ context nhỏ, batch flush/clear, tránh serialize lazy entity và quan sát query/row count.

## Trade-offs

Flush mode và ID generation ảnh hưởng thời điểm SQL, nhưng application không nên dựa vào accidental timing. Test commit/rollback qua integration database.

## Câu trả lời sai thường gặp

repository.save luôn execute INSERT ngay và transaction đã hoàn tất trước khi method trả về.

## Follow-up

- Flush khác commit ra sao?

- Detached entity merge có chi phí/rủi ro gì?

## Nguồn chính thống

- [Jakarta EE — Jakarta Persistence specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
