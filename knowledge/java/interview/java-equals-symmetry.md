---
id: java-equals-symmetry
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - equals
  - hashCode
  - contracts
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
    - id: contracts
      required: false
      aliases:
        - contracts
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ cần override equals; hashCode là tùy chọn vì HashMap sẽ gọi equals trên mọi phần tử.
      penalty: 20
---

# Một implementation equals đúng phải bảo đảm những property nào?

## Rubric

### Must Include

- equals

- hashCode

### Strong Answer Includes

- contracts

## Câu trả lời 30 giây

`equals` cần reflexive, symmetric, transitive, consistent và false với null. Nếu hai object equals thì hashCode phải giống nhau; hashCode giống nhau không bắt buộc equals. Class/value boundary phải nhất quán với mutation và inheritance.

## Câu trả lời chi tiết

Collection dùng equals/hashCode để tìm key và phần tử. Việc dùng `instanceof` hay `getClass` là quyết định semantic giữa subtype/value, nhưng phải tránh symmetry break khi subclass thêm field. Field tham gia equality nên ổn định khi object đang ở HashMap/HashSet. IDE-generated method không giải quyết identity domain, proxy ORM hoặc floating-point semantics.

## Góc nhìn Production

Test contract property bằng nhiều subtype và mutation; không dùng entity đang mutable làm map key trước khi có stable identifier. Review equality khi thêm field hoặc proxy framework.

## Trade-offs

Collection dùng equals/hashCode để tìm key và phần tử. Việc dùng `instanceof` hay `getClass` là quyết định semantic giữa subtype/value, nhưng phải tránh symmetry break khi subclass thêm field. Field tham gia equality nên ổn định khi object đang ở HashMap/HashSet. IDE-generated method không giải quyết identity domain, proxy ORM hoặc floating-point semantics.

## Câu trả lời sai thường gặp

Chỉ cần override equals; hashCode là tùy chọn vì HashMap sẽ gọi equals trên mọi phần tử.

## Follow-up

- Vì sao mutable key làm HashMap mất entry?

- Entity JPA nên dùng equals theo id hay business key?

## Nguồn chính thống

- [Oracle — Java Language Specification — Classes](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html)
- [Oracle — Object API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)
- [Oracle — Record Classes](https://docs.oracle.com/en/java/javase/21/language/records.html)
