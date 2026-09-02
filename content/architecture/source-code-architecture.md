---
id: source-code-architecture
slug: package-by-feature
title: Source Code Architecture — Package by Feature
description: Tổ chức boundary theo capability, giữ dependency direction rõ và tránh shared/core trở thành thùng rác.
category: architecture
technology: Software Architecture
level: intermediate
estimatedMinutes: 25
tags: ["architecture","package-by-feature","coupling","cohesion","solid"]
prerequisites: []
related: ["microservices-boundaries","angular-signals"]
next: microservices-boundaries
learningObjectives: ["Nhận diện boundary theo feature","Đánh giá coupling và cohesion","Dùng dependency inversion có mục đích"]
lastReviewed: 2026-09-02
sources: [{"title":"Angular style guide - project structure","url":"https://angular.dev/style-guide","organization":"Angular","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Package by layer và package by feature
Package by layer gom controller/service/repository toàn hệ thống; lúc feature lớn, thay đổi một capability chạm nhiều thư mục và boundary mờ. Package by feature đặt code cùng thay đổi gần nhau, còn layer nhỏ tồn tại bên trong feature khi cần.

```text title="Feature-oriented tree"
src/app/
  core/          # cross-cutting singleton + infrastructure boundary
  shared/        # presentational, stateless, reusable
  features/
    lesson/      # route, page, lesson-specific UI
    search/      # query, ranking, result UI
    roadmap/     # roadmap state and presentation
```

## Dependency direction
UI phụ thuộc application contract; infrastructure implement contract; domain rule không cần biết HTTP, database hay framework nếu độ phức tạp đáng để tách. Dependency inversion hữu ích ở volatile boundary hoặc khi cần test substitute, không phải tạo interface cho mọi class.

:::warning Shared không phải thùng rác
Nếu component chỉ dùng trong một feature, giữ nó trong feature. Chỉ đưa vào shared khi semantics ổn định và có nhiều consumer thật.
:::

## Module boundary thực dụng
- Public API nhỏ; file nội bộ không import xuyên feature tùy ý.
- State ownership nằm ở feature tạo ra invariant.
- Core chứa cross-cutting thật sự như configuration/storage, không chứa business feature.
- Test architecture rule nếu monorepo/team đủ lớn.

## Khi không cần Clean Architecture đầy đủ
CRUD nhỏ không cần nhiều adapter/interface ceremony. Bắt đầu boundary theo feature, tách domain khi rule độc lập và thay đổi thường xuyên. Architecture tốt làm thay đổi dự kiến rẻ hơn; số folder không phải thước đo.

## Trả lời phỏng vấn
Tôi chọn package by feature để tăng cohesion và làm boundary nhìn thấy được. Tôi kiểm soát dependency direction qua public API, giữ shared nhỏ, và chỉ thêm abstraction tại boundary biến động hoặc cần thay thế trong test.

## Key Takeaways
- Code cùng thay đổi nên ở gần nhau.
- Boundary quan trọng hơn số layer.
- Interface là công cụ cô lập biến động, không phải nghi thức.
- Đánh giá architecture bằng cost of change.
