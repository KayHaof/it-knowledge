# Content migration report

## Phạm vi và kết quả

Đợt migration chuyển toàn bộ nội dung runtime hiện có sang mô hình Markdown-authoritative dưới `knowledge/` mà không đổi lesson route/identity. Snapshot được đối chiếu ngày 2026-09-26 từ legacy source và artifact compiler hiện tại.

| Loại | Legacy | Sau migration | Kết quả |
| --- | ---: | ---: | --- |
| Lesson | 144 Markdown | 144 Markdown | bảo toàn đủ |
| Interview question | 383 object trong 17 JSON shard | 383 Markdown | bảo toàn đủ, 3 ID đổi prefix |
| Roadmap | 12 object trong một JSON | 12 Markdown | bảo toàn đủ |
| Flashcard | chưa có artifact first-class | 1.185 | 144 manual + 1.041 derived |
| Official source URL duy nhất | phân tán theo lesson/interview | 407 | compiler thống kê tập trung |

`public/generated/content-stats.json` hiện báo 144 lesson, 383 interview question, 1.185 flashcard, 407 source URL và 0 warning. `manifest.json` báo 12 roadmap.

## Kiến trúc cũ

```text
content/<category>/*.md            144 lesson, level legacy
content/interview/*.json           383 question trong 17 shard
content/roadmaps.json              12 roadmap
content-sources/official-sources.json
scripts/content/content-pipeline.mjs
public/generated/
  lessons.json
  interview.json
  roadmaps.json
  search-index.json
```

Lesson Markdown, interview JSON và roadmap JSON là ba authoring workflow khác nhau. Tác giả phải biết file JSON nào cần sửa; schema/identity giữa các loại chưa cùng một root. README cũ còn hướng dẫn sửa JSON trực tiếp.

## Kiến trúc mới

```text
knowledge/
├── _config/official-sources.json
├── _roadmaps/*.md
└── <technology>/
    ├── basic/*.md
    ├── advanced/*.md
    ├── extended/*.md
    └── interview/*.md
        ↓
scripts/content/
├── parsers/
├── validators/
├── compilers/
├── generators/
└── tests/
        ↓
public/generated/
├── lessons.json
├── interview.json
├── flashcards.json
├── search-index.json
├── roadmaps.json
├── manifest.json
└── content-stats.json
```

`knowledge/**/*.md` là authoring source duy nhất. Browser không parse hàng trăm Markdown file; mọi parse, validation, relation resolution, interview extraction và flashcard derivation diễn ra build-time. Angular chỉ fetch artifact JSON tối ưu theo feature.

## Identity được bảo toàn

Đối chiếu legacy source với output mới:

- 144/144 lesson ID giữ nguyên;
- 144/144 lesson slug giữ nguyên;
- không có lesson slug thay đổi;
- 380/383 interview ID giữ nguyên;
- 12/12 roadmap ID giữ nguyên.

Vì lesson ID/slug giữ nguyên, progress, bookmark, recently viewed, prerequisites, related links, roadmap step và route hiện có không cần remap. Filename/folder mới không tham gia identity.

### Ba interview ID thay đổi

Ba legacy interview ID trùng với lesson ID cùng tên. Schema mới yêu cầu identity toàn cục, nên chỉ ba ID interview được prefix; lesson ID/slug được ưu tiên giữ nguyên:

| Legacy interview ID | New interview ID | Lý do |
| --- | --- | --- |
| `system-design-job-scheduler` | `interview-system-design-job-scheduler` | tránh trùng lesson ID |
| `system-design-payment-ledger` | `interview-system-design-payment-ledger` | tránh trùng lesson ID |
| `system-design-search-autocomplete` | `interview-system-design-search-autocomplete` | tránh trùng lesson ID |

Các ID này chỉ định danh câu hỏi; lesson route tương ứng không đổi.

## Migration learning level

Level cũ được đọc theo nội dung, không map `intermediate` máy móc:

| Legacy level → New level | Số lesson |
| --- | ---: |
| `beginner` → `basic` | 5 |
| `intermediate` → `basic` | 15 |
| `intermediate` → `advanced` | 8 |
| `advanced` → `advanced` | 54 |
| `senior` → `extended` | 62 |

Phân bố mới: 20 `basic`, 62 `advanced`, 62 `extended`.

## Compatibility mappings

| Legacy contract | Contract mới | Compatibility |
| --- | --- | --- |
| lesson filename/path có thể được hiểu như identity | `id` + `slug` front matter | compiler route theo slug; đổi filename an toàn |
| `beginner/intermediate/advanced/senior` | `basic/advanced/extended` | toàn bộ 144 lesson đã migrate theo bảng trên |
| interview `answer2m` | `answerDetailed` | output vẫn phát sinh alias `answer2m` |
| interview `relatedLesson` route đơn | `relatedLessons` chứa lesson ID | output vẫn phát sinh `relatedLesson` route từ relation đầu tiên |
| interview JSON shards | `knowledge/<technology>/interview/*.md` | count/question/answer/source được bảo toàn |
| `content/roadmaps.json` | `knowledge/_roadmaps/*.md` | 12 ID và lesson step được validate |
| `content-sources/official-sources.json` | `knowledge/_config/official-sources.json` | config mới là nguồn duy nhất; compiler không đọc fallback legacy |
| bốn artifact runtime cũ | bảy artifact deterministic | giữ tên cũ, thêm flashcards/manifest/stats |

Runtime model mới còn giữ route đặc biệt hiện hành cho `architecture`, `distributed-systems`, `system-design`; các category khác tiếp tục dùng `/learn/<category>/<slug>`.

## Flashcard migration/derivation

Flashcard là capability mới nhưng vẫn trace về Markdown:

- 144 manual card (`generated: false`) nằm trong lesson;
- 1.041 derived card (`generated: true`) từ Key Takeaways, glossary và interview;
- tổng 1.185 card;
- manual card có precedence khi front trùng concept sau chuẩn hóa;
- mọi card mang `sourceLesson`/`sourcePath` để quay lại kiến thức gốc.

Derived card có ID deterministic; build lại cùng input cho output semantically identical.

## Generated artifact và commit policy

Generated JSON là output disposable, không phải authoring source. Repository chọn chính sách:

1. commit `knowledge/**/*.md` và source registry;
2. chạy `npm run content:build`;
3. commit `public/generated/*.json` để local development/GitHub Pages thuận tiện;
4. CI luôn validate và generate lại trước Angular build.

Xóa JSON rồi chạy `content:build` phải tái tạo đầy đủ runtime knowledge base. Không sửa JSON để “fix nhanh” vì thay đổi sẽ bị compiler ghi đè.

## Đo kích thước và quyết định chunk

Kích thước artifact tại snapshot:

| Artifact | Byte | MiB |
| --- | ---: | ---: |
| `lessons.json` | 5.050.280 | 4,82 |
| `interview.json` | 1.674.273 | 1,60 |
| `search-index.json` | 1.339.722 | 1,28 |
| `flashcards.json` | 780.434 | 0,74 |
| `roadmaps.json` | 35.169 | 0,03 |
| `content-stats.json` | 3.501 | <0,01 |
| `manifest.json` | 3.379 | <0,01 |
| **Tổng** | **8.886.758** | **8,48** |

Quyết định hiện tại là giữ artifact tách theo feature và fetch/cache khi feature cần. Chưa chia `lessons.json` thành per-domain chunk vì corpus vẫn có 144 lesson, file lớn nhất 4,82 MiB và chưa có profiling chứng minh chi phí của manifest/individual payload là cần thiết. Tuy nhiên, tổng output 8,48 MiB đã gần mốc đánh giá 10 MiB, nên lần mở rộng tiếp theo phải đo network transfer, JSON parse time và memory trước khi tiếp tục giữ nguyên kiến trúc.

Cần đo lại network transfer, JSON parse time, memory và thời gian mở lesson khi:

- tổng artifact tiến gần 10–20 MiB;
- lesson count tăng mạnh;
- profiling trên thiết bị chậm cho thấy parse/retention đáng kể;
- người dùng thường chỉ mở một domain nhưng phải tải phần lớn corpus.

Nếu trigger xuất hiện, bước tiếp theo là metadata manifest + per-domain lesson chunks hoặc individual lesson payload; search index tiếp tục là artifact lazy riêng.

## Validation và deployment compatibility

Production workflow thực hiện lint, test, content validation/compilation, Angular production build rồi deploy. GitHub Pages base href lấy động từ repository name; asset URL không hardcode username/repository hoặc `/generated/...` root-absolute. SPA fallback là `404.html` copy từ build index.

Content ERROR chặn deploy: malformed front matter/block, duplicate ID/slug/question, enum sai, relation/roadmap step hỏng, source invalid hoặc generated JSON hỏng. Remote link availability được kiểm bằng command riêng để timeout/rate-limit bên ngoài không làm build deterministic thất bại.

## Known warnings và technical debt

- Content compiler snapshot hiện có **0 WARNING**; đây không phải cam kết mọi URL từ xa đang online. `npm run content:check-links` cần mạng và phải được chạy riêng khi audit source.
- Legacy `content/`, `content-sources/` và one-time migration script đã được xóa sau khi xác nhận parity, route/search/roadmap, test và production build. Khi cần đối chiếu hoặc rollback, dùng lịch sử Git thay vì duy trì hai authoring root song song.
- 1.041 flashcard dẫn xuất deterministic giúp có coverage ngay nhưng không thay thế editorial review; ưu tiên viết manual card cho concept quan trọng hoặc khi wording dẫn xuất chưa tốt.
- 90 technology label đang phản ánh metadata lịch sử, gồm nhiều label kết hợp. Có thể chuẩn hóa taxonomy dần nếu filter trở nên nhiễu, nhưng không đổi hàng loạt nếu chưa có compatibility plan.
- Chưa có per-domain lesson chunk theo quyết định đo lường ở trên.
- Interview grader chỉ đánh giá coverage/rubric và proxy có thể đo; không đánh giá ngữ nghĩa như chuyên gia. AI semantic evaluation vẫn disabled và không có browser-side key.
- Flashcard schedule là heuristic local deterministic, không phải SM-2 và không đồng bộ cloud.
