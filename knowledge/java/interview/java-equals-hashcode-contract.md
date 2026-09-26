---
id: java-equals-hashcode-contract
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - equals
  - hashCode
  - collections
relatedLessons:
  - java-object-contracts
sources:
  - title: Java Language Specification — Classes
    url: https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: Object API
    url: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Record Classes
    url: https://docs.oracle.com/en/java/javase/21/language/records.html
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
    - id: equals
      required: true
      aliases:
        - equals
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: hashcode
      required: true
      aliases:
        - hashCode
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: collections
      required: false
      aliases:
        - collections
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần equals đúng; HashMap luôn quét tất cả entry để tìm key.
      penalty: 20
---

# Nếu override equals mà quên hashCode thì HashMap/HashSet lỗi thế nào?

## Rubric

### Must Include

- equals

- hashCode

### Strong Answer Includes

- collections

## Câu trả lời 30 giây

Hai object equals phải có cùng hashCode; nếu không, chúng rơi vào bucket khác và lookup/set membership có thể thất bại. HashCode bằng nhau không đảm bảo equals.

## Câu trả lời chi tiết

HashMap dùng hash để chọn bucket rồi equals để xác nhận key. Field dùng cho equality phải ổn định khi key đang nằm trong map; thay đổi field làm entry “thất lạc”. Với entity, tránh field mutable hoặc dùng identity ổn định theo lifecycle.

## Góc nhìn Production

Test contract đối xứng, bắc cầu, nhất quán; kiểm tra mutation của key trong cache.

## Trade-offs

HashMap dùng hash để chọn bucket rồi equals để xác nhận key. Field dùng cho equality phải ổn định khi key đang nằm trong map; thay đổi field làm entry “thất lạc”. Với entity, tránh field mutable hoặc dùng identity ổn định theo lifecycle.

## Câu trả lời sai thường gặp

Chỉ cần equals đúng; HashMap luôn quét tất cả entry để tìm key.

## Follow-up

- Hash collision được xử lý thế nào?

- Entity JPA nên chọn equality field nào?

## Nguồn chính thống

- [Oracle — Java Language Specification — Classes](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html)
- [Oracle — Object API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)
- [Oracle — Record Classes](https://docs.oracle.com/en/java/javase/21/language/records.html)
