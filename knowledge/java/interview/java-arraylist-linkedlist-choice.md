---
id: java-arraylist-linkedlist-choice
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - ArrayList
  - LinkedList
  - locality
relatedLessons:
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
    - id: arraylist
      required: true
      aliases:
        - ArrayList
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: linkedlist
      required: true
      aliases:
        - LinkedList
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: locality
      required: false
      aliases:
        - locality
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - LinkedList luôn O(1) cho get(index) và ít memory hơn ArrayList.
      penalty: 20
---

# Khi nào ArrayList phù hợp hơn LinkedList dù cả hai đều là List?

## Rubric

### Must Include

- ArrayList

- LinkedList

### Strong Answer Includes

- locality

## Câu trả lời 30 giây

ArrayList có random access và locality tốt, thường nhanh hơn cho iteration/append amortized. LinkedList chỉ hữu ích trong pattern chèn/xóa qua node iterator đã có, không tự làm index access nhanh.

## Câu trả lời chi tiết

ArrayList resize bằng copy khi vượt capacity và có contiguous references; LinkedList thêm node allocation, pointer chasing và memory overhead. Với queue/deque, ArrayDeque thường phù hợp hơn LinkedList. Chọn theo access pattern và benchmark dữ liệu thật.

## Góc nhìn Production

Đo allocation/cache miss và kích thước collection; tránh mặc định LinkedList cho mọi queue.

## Trade-offs

ArrayList resize bằng copy khi vượt capacity và có contiguous references; LinkedList thêm node allocation, pointer chasing và memory overhead. Với queue/deque, ArrayDeque thường phù hợp hơn LinkedList. Chọn theo access pattern và benchmark dữ liệu thật.

## Câu trả lời sai thường gặp

LinkedList luôn O(1) cho get(index) và ít memory hơn ArrayList.

## Follow-up

- ArrayList resize gây pause thế nào?

- Deque nào nên dùng cho producer-consumer?

## Nguồn chính thống

- [Oracle — Collections Framework Overview](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html)
- [Oracle — HashMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [Oracle — Java Language Specification — Type Arguments](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1)
