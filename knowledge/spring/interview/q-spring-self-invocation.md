---
id: q-spring-self-invocation
type: interview-question
technology: Spring
category: Spring
difficulty: middle
topics:
  - AOP
  - proxy
  - transaction
relatedLessons:
  - spring-aop-transactions
sources:
  - title: Spring AOP proxying mechanisms
    url: https://docs.spring.io/spring-framework/reference/core/aop/proxying.html
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
    - id: aop
      required: true
      aliases:
        - AOP
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: proxy
      required: true
      aliases:
        - proxy
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
        - Spring scan annotation rồi sửa bytecode mọi lời gọi nên self-invocation luôn hoạt động.
      penalty: 20
---

# Vì sao gọi method @Transactional từ method khác trong cùng bean có thể không mở transaction mới?

## Rubric

### Must Include

- AOP

- proxy

### Strong Answer Includes

- transaction

## Câu trả lời 30 giây

Ở proxy mode phổ biến, advice chạy khi call đi qua Spring proxy. Self-invocation dùng this gọi trực tiếp target nên bypass proxy; annotation trên method được gọi có thể không có hiệu lực như mong đợi.

## Câu trả lời chi tiết

Tôi xác minh bean/proxy type và transaction log thay vì chỉ nhìn annotation. Fix thường là đặt transaction boundary ở application service được caller khác gọi, tách collaborator hoặc dùng AspectJ mode khi thật sự cần. Không nên self-inject chỉ để lách thiết kế vì tăng coupling và vẫn dễ sai propagation.

## Deep Dive

Cùng nguyên tắc áp dụng cho nhiều proxy-based advice như caching, async và method security; visibility/final method còn tùy proxy mechanism và version.

## Góc nhìn Production

Thêm integration test kiểm commit/rollback thật và bật transaction observation có kiểm soát cho critical path.

## Trade-offs

Cùng nguyên tắc áp dụng cho nhiều proxy-based advice như caching, async và method security; visibility/final method còn tùy proxy mechanism và version.

## Câu trả lời sai thường gặp

Spring scan annotation rồi sửa bytecode mọi lời gọi nên self-invocation luôn hoạt động.

## Follow-up

- JDK proxy khác class-based proxy thế nào?

- Propagation REQUIRES_NEW có resource cost gì?

## Nguồn chính thống

- [Spring — Spring AOP proxying mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
