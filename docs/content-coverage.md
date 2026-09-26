# Ma trận độ phủ nội dung

Tài liệu audit cũ dùng taxonomy `Beginner / Intermediate / Advanced / Senior` và snapshot interview trước migration nên không còn là nguồn số liệu hiện hành.

Nguồn thống kê authoritative sau refactor:

- `public/generated/content-stats.json`: count theo technology, level, contentType, interview, flashcard, source và warning;
- `public/generated/manifest.json`: schema version, enum và tổng artifact;
- [content migration report](content-migration-report.md): đối chiếu trước/sau, identity, compatibility và technical debt;
- [content authoring guide](content-authoring.md): taxonomy/schema hiện hành.
- [content generation progress](content-generation-progress.md): ma trận domain và checkpoint mới nhất sau từng batch.

Snapshot compiler **trước Batch 1** ngày 2026-09-26:

| Chỉ số | Giá trị |
| --- | ---: |
| Lesson | 144 |
| `basic` / Cơ bản | 20 |
| `advanced` / Nâng cao | 62 |
| `extended` / Mở rộng | 62 |
| Interview question | 383 |
| Flashcard | 1.185 |
| Roadmap | 12 |
| Source URL duy nhất | 407 |
| Content warning | 0 |

Không cập nhật count bằng tay trong file này. Chạy `npm run content:stats` sau khi đổi Markdown và review `content-stats.json`; nếu cần một audit chất lượng theo domain, tạo báo cáo có ngày snapshot và dẫn lại artifact thay vì biến báo cáo thành metadata song song.
