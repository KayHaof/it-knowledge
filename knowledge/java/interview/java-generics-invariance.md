---
id: java-generics-invariance
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - generics
  - invariance
  - type-safety
relatedLessons:
  - java-generics-erasure-variance
  - java-collections-generics
sources:
  - title: Collections Framework Overview
    url: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: HashMap API
    url: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Java Language Specification — Type Arguments
    url: https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1
    organization: Oracle
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
    - id: generics
      required: true
      aliases:
        - generics
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: invariance
      required: true
      aliases:
        - invariance
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: type-safety
      required: false
      aliases:
        - type-safety
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Java generics invariant vì JVM không hiểu object inheritance.
      penalty: 20
---

# Vì sao `List<Dog>` không phải là `List<Animal>`?

## Rubric

### Must Include

- generics

- invariance

### Strong Answer Includes

- type-safety

## Câu trả lời 30 giây

Generics Java invariant để ngăn ghi Cat vào list chỉ chứa Dog. Dùng `List<? extends Animal>` cho producer chỉ đọc hoặc `List<? super Dog>` cho consumer nhận Dog theo PECS.

## Câu trả lời chi tiết

Nếu covariance tự động, hàm nhận List<Animal> có thể thêm Cat vào List<Dog>. Wildcard biểu diễn giới hạn an toàn: extends cho phép lấy Animal nhưng không thêm Animal cụ thể; super cho phép thêm Dog nhưng đọc chỉ chắc chắn Object. Type erasure diễn ra runtime nên generic safety chủ yếu được compiler kiểm tra.

## Góc nhìn Production

Thiết kế API collection theo hướng dữ liệu đi vào/ra, tránh wildcard lồng khó đọc. Dùng immutable view khi muốn ngăn caller mutate collection.

## Trade-offs

Nếu covariance tự động, hàm nhận List<Animal> có thể thêm Cat vào List<Dog>. Wildcard biểu diễn giới hạn an toàn: extends cho phép lấy Animal nhưng không thêm Animal cụ thể; super cho phép thêm Dog nhưng đọc chỉ chắc chắn Object. Type erasure diễn ra runtime nên generic safety chủ yếu được compiler kiểm tra.

## Câu trả lời sai thường gặp

Java generics invariant vì JVM không hiểu object inheritance.

## Follow-up

- `? super Dog` đọc được kiểu gì?

- Khi nào generic method tốt hơn wildcard?

## Nguồn chính thống

- [Oracle — Collections Framework Overview](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html)
- [Oracle — HashMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [Oracle — Java Language Specification — Type Arguments](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1)
