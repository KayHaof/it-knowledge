# IT Knowledge & Interview Learning Platform

Ứng dụng Angular local-first để học kiến thức kỹ thuật, luyện phỏng vấn và ôn flashcard. Nguồn nội dung có thẩm quyền duy nhất là Markdown dưới `knowledge/`; Angular chỉ đọc các artifact được compiler tạo trong `public/generated/`. Không cần backend, database hoặc tài khoản.

## Trạng thái nội dung

Snapshot hiện tại được compiler xác nhận:

- 144 bài học;
- 383 câu hỏi phỏng vấn;
- 1.185 flashcard, gồm 144 thẻ viết tay và 1.041 thẻ dẫn xuất;
- 12 roadmap;
- 407 URL nguồn duy nhất;
- 0 content warning trong `content-stats.json`.

Ba level học duy nhất là `basic` (Cơ bản), `advanced` (Nâng cao) và `extended` (Mở rộng). Độ khó phỏng vấn là taxonomy riêng: `junior`, `middle`, `senior`, `system-design`.

## Tính năng

- Catalog/filter theo metadata Markdown, lesson page có TOC, relation và nguồn chính thống.
- Renderer typed-block an toàn cho heading, paragraph, list, table, callout, code và Mermaid; không render raw HTML.
- Search sinh hoàn toàn từ Markdown; `Ctrl/Cmd + K` mở nhanh.
- Interview Lab có câu trả lời curated, follow-up, lịch sử local và chấm điểm deterministic theo rubric 100 điểm.
- Flashcard có filter, shuffle, bookmark, các mode ôn tập và lịch `Again / Hard / Good / Easy` lưu local.
- Dashboard, 12 roadmap, progress, bookmark, recently viewed và theme Light/Dark/System.
- URL artifact tôn trọng Angular base href, dùng được ở localhost và GitHub Pages subpath.

## Cài đặt và chạy

Yêu cầu Node.js `^20.19.0 || ^22.12.0 || ^24.0.0`, npm 11+.

```bash
npm install
npm start
```

Mở `http://localhost:4200/`. `npm start` chạy `content:build` trước Angular dev server.

## Các lệnh kiểm tra

```bash
npm run content:validate    # validate toàn bộ knowledge/, không ghi artifact
npm run content:build       # validate và tạo lại toàn bộ public/generated/*.json
npm run content:index       # chỉ tạo lại search-index.json
npm run content:stats       # tạo/in content-stats.json
npm run content:test        # unit test content compiler
npm run content:check-links # kiểm tra URL qua mạng; không nằm trong production build
npm run lint
npm test                    # content:test + Angular tests
npm run build
```

Kiểm tra đúng cấu hình GitHub Pages:

```bash
npm run build -- --configuration production --base-href "/it-knowledge/"
```

## Kiến trúc nội dung

```text
knowledge/**/*.md
        ↓ parse + schema/source/relation validation
scripts/content/
        ↓ deterministic compilation
public/generated/*.json
        ↓ base-href-aware HTTP loading
Angular routes/features
```

```text
knowledge/
├── _config/official-sources.json
├── _roadmaps/*.md
└── <technology>/
    ├── basic/*.md
    ├── advanced/*.md
    ├── extended/*.md
    └── interview/*.md
```

Mỗi lesson bắt buộc có front matter gồm `id`, `slug`, `title`, `description`, `technology`, `domain`, `category`, `level`, `contentType`, `order`, `estimatedMinutes`, `tags`, `learningObjectives`, `sources`, `lastReviewed`. `id` và `slug` là identity ổn định, không phụ thuộc tên file.

`contentType` hợp lệ: `core`, `internals`, `production`, `troubleshooting`, `performance`, `security`, `architecture`, `system-design`, `integration`, `comparison`, `reference`, `interview`, `supplementary`.

Structured block hợp lệ: `note`, `info`, `warning`, `danger`, `tip`, `best-practice`, `production`, `interview`, `flashcard`, `quiz`, `misconception`, `glossary`. Chi tiết schema, rubric và ví dụ nằm trong [hướng dẫn authoring](docs/content-authoring.md) và [knowledge template](docs/templates/knowledge-template.md).

## Quy trình authoring

Thêm lesson:

1. Sao chép `docs/templates/knowledge-template.md` vào `knowledge/<technology>/<level>/`.
2. Chọn `id`/`slug` kebab-case duy nhất và điền metadata thật.
3. Thêm ít nhất một nguồn chính thống; đăng ký domain mới trong `knowledge/_config/official-sources.json` khi cần.
4. Viết đủ `# title`, `## Tổng quan`, `## Key Takeaways`, `## Nguồn chính thống`.
5. Chạy `npm run content:validate`, `npm run content:build`, `npm test` và `npm run build`.
6. Review diff của Markdown lẫn artifact rồi commit/push.

Thay một lesson mà vẫn giữ bookmark, progress, relation và route: thay nội dung/file nhưng giữ nguyên `id` và `slug`, sau đó chạy lại pipeline. Đổi tên file không đổi identity.

Thêm technology thường không cần sửa Angular: tạo `knowledge/<technology>/basic`, `advanced`, `extended` và `interview` khi cần, thêm Markdown đúng schema, cập nhật source registry rồi build. Filter và thống kê lấy từ metadata sinh ra.

Đây cũng là workflow “admin”: sửa Markdown → commit → push → GitHub Actions validate/compile/test/build → GitHub Pages cập nhật. Không có và không cần `/admin` UI.

## Interview, rubric và AI

Câu hỏi chính nằm ở `knowledge/<technology>/interview/*.md`; quick question có thể dùng `:::interview` trong lesson. Mỗi câu standalone có đáp án 30 giây, đáp án chi tiết, production, trade-off, lỗi thường gặp, follow-up, related lesson, sources và rubric.

Rubric mặc định chia 100 điểm: correctness 40, completeness 20, reasoning 15, production 10, trade-offs 10, communication 5. Engine local chuẩn hóa text, match concept/alias có trọng số, phát hiện misconception và giải thích cách tính. Đây là **rubric-based automatic evaluation**, không phải đánh giá ngữ nghĩa bằng AI.

AI semantic evaluation hiện **disabled/not configured**. Không đặt API key trong Angular environment, source code, localStorage hay GitHub Pages. Nếu tích hợp AI thật về sau, request phải đi qua backend/serverless proxy giữ secret, rate-limit và audit; browser không được gọi vendor bằng private key.

## Flashcard và lịch ôn

`:::flashcard` là thẻ authoritative (`generated: false`). Compiler còn tạo thẻ bổ sung từ Key Takeaways, `:::glossary` và interview (`generated: true`); thẻ viết tay thắng khi trùng concept.

Lịch local deterministic dùng số lần review đã hoàn thành trước rating:

- `Again`: luôn 10 phút;
- `Hard`: 1 ngày, tăng từng ngày, tối đa 7 ngày;
- `Good`: 3 ngày rồi nhân đôi, tối đa 60 ngày;
- `Easy`: 7 ngày rồi nhân đôi, tối đa 120 ngày.

Đây là gợi ý ôn đơn giản, minh bạch, không phải SM-2 và không được tuyên bố là tối ưu khoa học. Trạng thái chỉ nằm trong localStorage của trình duyệt, không có đồng bộ cloud.

## Generated artifact và hiệu năng

Không sửa thủ công `public/generated/*.json`. Chính sách repository là commit Markdown authoritative và commit generated JSON để local/GitHub Pages dùng thuận tiện; CI vẫn luôn tạo lại và validate trước build. Xem [ghi chú generated](public/generated/README.md).

Snapshot hiện tại của bảy JSON là 8.886.758 byte (8,48 MiB): `lessons.json` 4,82 MiB, `interview.json` 1,60 MiB, `search-index.json` 1,28 MiB, `flashcards.json` 0,74 MiB, phần còn lại khoảng 0,04 MiB. Repository giữ các artifact tách theo feature và chỉ tải khi service tương ứng cần; chưa chia lesson theo domain vì corpus vẫn có 144 lesson và file lớn nhất là 4,82 MiB. Vì tổng output đã gần mốc đánh giá 10 MiB, lần mở rộng tiếp theo cần đo navigation latency, JSON parse time và memory thay vì chỉ dựa vào count. Khi corpus tiến vào khoảng 10–20 MiB hoặc profiling cho thấy bottleneck, ưu tiên metadata manifest và per-domain/individual lesson chunks.

## CI và GitHub Pages

`.github/workflows/deploy-pages.yml` chạy lint, test và production build. Base href được lấy động từ tên repository; code không hardcode username/repository và không dùng root-absolute `/generated/...`. Workflow tạo `404.html` cho SPA rồi deploy `dist/it-learning-platform/browser`.

Content ERROR như front matter sai, duplicate identity, level/contentType sai, relation hỏng, malformed block hoặc source không hợp lệ làm build/deploy dừng. Kiểm tra URL từ xa được tách ở `content:check-links` để website nguồn timeout không làm production build offline thất bại.

## Security và local data

- Markdown được compile thành typed blocks; Angular interpolation render text, không dùng `bypassSecurityTrustHtml`.
- Mermaid dùng chế độ strict; source URL được validate theo registry.
- Không commit key/secret và không gửi credential từ GitHub Pages.
- Progress, bookmark, history phỏng vấn và flashcard review là dữ liệu local-only; Settings hỗ trợ export/import/reset.

Chi tiết migration và compatibility: [content migration report](docs/content-migration-report.md).
