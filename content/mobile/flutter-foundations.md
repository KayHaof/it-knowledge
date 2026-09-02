---
id: flutter-foundations
slug: flutter-architecture-foundations
title: Flutter Architecture Foundations
description: Widget tree, immutable configuration, state, navigation, networking và boundary cho ứng dụng mobile dễ mở rộng.
category: mobile
technology: Flutter / Dart
level: beginner
estimatedMinutes: 22
tags: ["flutter","dart","widgets","state","navigation"]
prerequisites: []
related: ["source-code-architecture"]
next: 
learningObjectives: ["Phân biệt Widget, Element và State","Đặt state đúng ownership","Tách UI khỏi data source"]
lastReviewed: 2026-09-02
sources: [{"title":"Flutter architectural overview","url":"https://docs.flutter.dev/resources/architectural-overview","organization":"Flutter","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Dart language overview","url":"https://dart.dev/language","organization":"Dart","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Widget là configuration
Widget immutable mô tả một phần UI. Framework giữ Element để nối widget tree với render tree; StatefulWidget tách immutable configuration khỏi State có lifecycle. Build có thể chạy nhiều lần nên không đặt network call hoặc side effect tùy ý trong build.

## State ownership
Local transient state ở gần widget dùng nó. Shared/app state đặt ở boundary feature/service phù hợp. Không chọn state library trước khi hiểu lifetime, source of truth và event flow.

## Architecture
Feature chứa presentation, application state/use case và data abstraction khi complexity cần. Repository cô lập API/cache; model phân biệt DTO với domain khi mapping có giá trị. Navigation và deep link là contract, không chỉ push screen.

:::production Mobile constraints
Mạng gián đoạn, app background/kill, battery, memory và version client cũ là failure mode bình thường. Thiết kế timeout, retry bounded, offline state, schema compatibility và telemetry có privacy.
:::

## Key Takeaways
- Widget immutable; State có lifecycle.
- build phải nhanh và không chứa uncontrolled side effect.
- State đặt theo ownership/lifetime.
- Mobile client cũ buộc API backward compatible.
