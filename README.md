# IT Knowledge & Interview Learning Platform

Ứng dụng Angular local-first để học kiến thức kỹ thuật từ mental model đến production trade-off và luyện trả lời phỏng vấn. Đây là learning tool có nội dung local được curated, không phải landing page và không cần backend, database hay đăng nhập.

## Tính năng

- Dashboard, catalog theo 13 category, technology/lesson pages và TOC.
- 144 bài Markdown tiếng Việt có metadata, knowledge relation và official references.
- Renderer AST an toàn cho heading, paragraph, list, table, callout, code và Mermaid.
- Syntax highlighting, tên file và copy code.
- Full-text search trên title, description, tag, technology, heading và content; ưu tiên exact phrase/đủ query terms; `Ctrl/Cmd + K` mở nhanh.
- 12 roadmaps với 245 bước và 76 câu phỏng vấn có câu trả lời 30 giây/2 phút, deep dive, production perspective và follow-up.
- Progress, bookmark, recently viewed, interview mastery/review lưu localStorage.
- Light/Dark/System theme; export/import/reset dữ liệu có confirmation.
- Responsive layout, semantic landmarks, visible focus, skip link và keyboard navigation.
- Content validation/index generation độc lập với Internet; link check là command riêng.

## Stack và yêu cầu

- Angular 21, standalone components, router, signals, strict TypeScript, SCSS.
- Node.js `^20.19.0 || ^22.12.0 || ^24.0.0`; môi trường phát triển hiện dùng Node 22.18.0.
- npm 11+.
- Mermaid chỉ lazy-load khi bài có diagram; highlight.js chỉ đăng ký ngôn ngữ đang dùng.

Angular 22 là stable mới hơn tại thời điểm khởi tạo nhưng yêu cầu Node `^22.22.3`; dự án chọn Angular 21 để tương thích Node đang cài và vẫn ở nhánh được hỗ trợ.

## Chạy dự án

```bash
npm install
npm start
```

Mở `http://localhost:4200`. `npm start` tạo lại content manifest/search index trước khi serve.

## Quality commands

```bash
npm run content:validate
npm run content:index
npm run content:check-links
npm run lint
npm test
npm run build
```

`content:check-links` cần Internet và được tách khỏi build để build/offline reading không phụ thuộc website nguồn đang online.

## Kiến trúc

```text
content/                         Curated Markdown, interview, roadmaps
content-sources/                 Official source allowlist
scripts/content/                 Parser, validator, manifest/search generator
public/generated/                Build-time generated data
src/app/core/                    Models, storage, content/search/state/AI services
src/app/shared/components/       Renderer, code, diagram, lesson card
src/app/layouts/                 Responsive application shell
src/app/features/                Lazy route features
docs/                            Content authoring and templates
```

Content pipeline parse tập Markdown được hỗ trợ thành typed JSON AST. Angular render từng block bằng template; nội dung bài không được biến thành Angular template hoặc trusted raw HTML. Mermaid chạy `securityLevel: strict`; SVG được đóng trong một Blob URL và hiển thị như ảnh thay vì chèn raw HTML vào DOM. Official source domain được kiểm ở build time.

## Content architecture

Mỗi file `.md` có JSON-compatible YAML frontmatter. Các relation `prerequisites`, `related`, `next` dùng lesson ID. Validator phát hiện thiếu metadata, duplicate `id`/`slug`, level không hợp lệ, relation không tồn tại, source URL sai hoặc hostname ngoài registry.

Xem [hướng dẫn authoring](docs/content-authoring.md), [lesson template](docs/templates/lesson-template.md) và [audit độ phủ nội dung](docs/content-coverage.md).

### Thêm câu phỏng vấn, roadmap và source

- Interview: thêm object theo schema trong `content/interview/questions.json`; không nhúng answer vào component.
- Roadmap: thêm definition/step trong `content/roadmaps.json`; `lessonId` phải tồn tại.
- Source: ưu tiên official/spec/primary vendor. Nếu technology mới, thêm domain có review vào `content-sources/official-sources.json`, sau đó chạy validate và link check.

## LocalStorage

Toàn bộ dữ liệu cá nhân nằm dưới key versioned `it-learning-platform:v1:data`. UI Settings hỗ trợ export/import JSON và reset có xác nhận. Không lưu credential hay dữ liệu nhạy cảm.

## AI tùy chọn

`AiProvider`/`AiService` là boundary sẵn cho tương lai nhưng provider mặc định bị vô hiệu hóa. Không có API key phía browser. Tích hợp vendor thật phải đi qua backend/proxy giữ secret, rate limit, audit và ground câu trả lời bằng lesson/source hiện tại; core website không phụ thuộc AI.

## Security notes

- Không dùng `bypassSecurityTrustHtml`.
- Markdown chỉ tạo typed blocks; text đi qua Angular interpolation.
- Source URL phải thuộc registry; external link có `noopener noreferrer`.
- Không commit key/secret; `npm audit` và content validation nên chạy trong CI.
- Dependency warning cần được phân tích trước khi major upgrade, không tự động `audit fix --force`.

## Cập nhật nội dung

Research official source, ghi chú version-specific behavior, paraphrase bằng lời của tác giả, cập nhật `lastReviewed`, chạy validate/index/link check và review diff. Pipeline không tự scrape hoặc overwrite bài curated.

## Giới hạn hiện tại

- 144 bài đã phủ sâu phần lớn Tier 1, nhưng chỉ có 5 bài Beginner; distributed systems, DevOps/security và một số bài legacy vẫn còn gap được ghi rõ trong `docs/content-coverage.md`.
- Search dùng ranking client-side, phù hợp 144 documents; chưa có inverted index, worker hoặc chunked index cho corpus lớn hơn nhiều.
- Không có PWA/full offline shell; core content đã local sau khi ứng dụng được tải.
- Không có backend/auth/cloud sync; đây là chủ ý local-first.
- AI chỉ có abstraction disabled, không gửi key từ client.

## Mở rộng hợp lý tiếp theo

Ưu tiên nâng trực tiếp các overview legacy còn mỏng (`high-concurrency`, `performance-diagnosis`, `distributed-failures`, System Design method/cases), thêm entry-level bridge và các nhánh distributed consistency, Kubernetes autoscaling/policy cùng session/MFA/SSRF. Runnable labs và benchmark harness chỉ nên được thêm khi có dataset, assumptions và quy trình tái lập rõ; không dùng số benchmark giả để lấp coverage.
