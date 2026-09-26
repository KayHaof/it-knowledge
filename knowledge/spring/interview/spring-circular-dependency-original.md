---
id: spring-circular-dependency-original
type: interview-question
technology: Spring
category: Spring
difficulty: senior
topics:
  - dependency-graph
  - design
  - lazy
relatedLessons:
  - spring-ioc-bean-lifecycle
sources:
  - title: Spring IoC Container
    url: https://docs.spring.io/spring-framework/reference/core/beans.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Customizing the Nature of a Bean
    url: https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html
    organization: Spring
    type: official-documentation
    accessedAt: 2026-09-02
  - title: Spring Boot Auto-configuration
    url: https://docs.spring.io/spring-boot/reference/using/auto-configuration.html
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
    - id: dependency-graph
      required: true
      aliases:
        - dependency-graph
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: design
      required: true
      aliases:
        - design
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: lazy
      required: false
      aliases:
        - lazy
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Thêm `@Lazy` cho một bean luôn là fix an toàn và không có trade-off.
      penalty: 20
---

# Bạn xử lý circular dependency giữa hai Spring service thế nào?

## Rubric

### Must Include

- dependency-graph

- design

### Strong Answer Includes

- lazy

## Câu trả lời 30 giây

Đó thường là dấu hiệu boundary sai. Tách interface/use case, đưa orchestration vào service thứ ba hoặc đổi event/port; `@Lazy` chỉ trì hoãn lỗi và không giải quyết coupling hay runtime cycle.

## Câu trả lời chi tiết

Constructor injection làm cycle fail ở context startup, điều tốt để phát hiện. Phân tích chiều dependency: domain service không nên gọi ngược adapter, và read/query port có thể tách khỏi command. Nếu cycle thật sự do callback lifecycle, provider/event có thể phá cycle nhưng phải định nghĩa ordering/failure. Không dùng setter injection chỉ để làm context start.

## Góc nhìn Production

Kiểm tra architecture dependency graph trong CI và log bean creation failure rõ. Test startup với profile production, không chỉ unit test từng service.

## Trade-offs

Constructor injection làm cycle fail ở context startup, điều tốt để phát hiện. Phân tích chiều dependency: domain service không nên gọi ngược adapter, và read/query port có thể tách khỏi command. Nếu cycle thật sự do callback lifecycle, provider/event có thể phá cycle nhưng phải định nghĩa ordering/failure. Không dùng setter injection chỉ để làm context start.

## Câu trả lời sai thường gặp

Thêm `@Lazy` cho một bean luôn là fix an toàn và không có trade-off.

## Follow-up

- Event phá cycle nhưng tạo consistency nào?

- Làm sao phát hiện distributed circular call?

## Nguồn chính thống

- [Spring — Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)
- [Spring — Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring — Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
