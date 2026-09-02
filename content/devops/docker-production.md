---
id: docker-production
slug: docker-production-basics
title: Docker từ Image đến Production
description: Container không phải VM nhẹ; hiểu layer, build cache, multi-stage, non-root, health check và resource limit.
category: devops
technology: Docker
level: intermediate
estimatedMinutes: 28
tags: ["docker","container","image","multistage","security"]
prerequisites: []
related: ["kubernetes-reconciliation","cicd-pipeline"]
next: kubernetes-reconciliation
learningObjectives: ["Phân biệt image và container","Tối ưu Dockerfile theo layer cache","Chuẩn bị runtime an toàn"]
lastReviewed: 2026-09-02
sources: [{"title":"What is a container?","url":"https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/","organization":"Docker","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Multi-stage builds","url":"https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/","organization":"Docker","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Container và image
Image là package immutable theo layer chứa filesystem/config cần chạy. Container là isolated process tạo từ image với writable layer riêng; nhiều container trên host chia sẻ kernel. Vì vậy container không phải một VM đầy đủ thu nhỏ.

## Dockerfile thực dụng
```text title="Dockerfile"
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/it-learning-platform/browser /usr/share/nginx/html
```

Copy lockfile trước source tận dụng build cache khi dependency không đổi. Multi-stage không mang compiler/node_modules build vào runtime, giảm size và attack surface.

:::production Production hardening
Pin base image theo policy, scan image, chạy non-root nếu image hỗ trợ, read-only filesystem khi có thể, resource limit, graceful shutdown, health/readiness đúng nghĩa và log ra stdout/stderr.
:::

## Volume, network và secret
Container filesystem là disposable; durable data dùng volume/external store theo lifecycle. Không bake secret vào image layer vì xóa ở layer sau vẫn có thể lộ trong history. Runtime env/secret mount cần least privilege và rotation.

## Health check không phải một loại
Liveness trả lời process có cần restart; readiness trả lời có nhận traffic không; startup bảo vệ app khởi động chậm. Một endpoint luôn trả 200 che dependency failure; kiểm quá nhiều dependency ở liveness tạo restart cascade.

## Key Takeaways
- Image immutable; container là process instance.
- Layer order ảnh hưởng cache và leak.
- Multi-stage giảm runtime artifact.
- Health check phải gắn với hành động controller sẽ làm.
