---
id: q-hashmap-contract
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - HashMap
  - equals
  - hashCode
relatedLessons:
  - java-hashmap-internals
  - java-object-contracts
sources:
  - title: HashMap API
    url: https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html
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
    - id: hashmap
      required: true
      aliases:
        - HashMap
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: equals
      required: true
      aliases:
        - equals
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: hashcode
      required: false
      aliases:
        - hashCode
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - HashMap so sánh key bằng địa chỉ bộ nhớ nên sửa field không ảnh hưởng lookup.
      penalty: 20
---

# Vì sao mutable key có thể làm HashMap không tìm thấy entry vừa put?

## Rubric

### Must Include

- HashMap

- equals

### Strong Answer Includes

- hashCode

## Câu trả lời 30 giây

HashMap chọn bucket từ hash và tìm key bằng equality. Nếu field tham gia equals/hashCode đổi sau khi put, lookup tính bucket hoặc equality khác nên entry vẫn tồn tại nhưng không tìm được theo key đã mutation.

## Câu trả lời chi tiết

Contract yêu cầu object equal phải có cùng hashCode và kết quả ổn định khi key nằm trong map. HashMap dùng hash để thu hẹp bucket rồi equals để xác nhận. Mutable key phá index nội bộ; fix là key immutable hoặc không mutation field identity. Collision không làm sai correctness nếu contract đúng, chỉ có thể ảnh hưởng performance.

## Deep Dive

Ngoài mutable key, equals bất đối xứng hoặc hashCode không nhất quán còn phá Set, cache và ORM entity behavior. Review identity lifecycle trước khi generate equals/hashCode.

## Góc nhìn Production

Dùng value object immutable làm key, test contract và theo dõi cardinality/collision khi key đến từ dữ liệu không tin cậy.

## Trade-offs

Ngoài mutable key, equals bất đối xứng hoặc hashCode không nhất quán còn phá Set, cache và ORM entity behavior. Review identity lifecycle trước khi generate equals/hashCode.

## Câu trả lời sai thường gặp

HashMap so sánh key bằng địa chỉ bộ nhớ nên sửa field không ảnh hưởng lookup.

## Follow-up

- HashMap khác ConcurrentHashMap về atomic compound operation thế nào?

- Tại sao chỉ override equals mà không override hashCode là lỗi?

## Nguồn chính thống

- [Oracle — HashMap API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html)
