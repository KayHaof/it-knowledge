# Generated runtime artifacts

**Không chỉnh sửa các file JSON trong thư mục này bằng tay.**

Nguồn có thẩm quyền là `knowledge/**/*.md` và `knowledge/_config/official-sources.json`. Tạo lại artifact bằng:

```bash
npm run content:validate
npm run content:build
```

Compiler tạo deterministic output:

- `lessons.json`: metadata, typed content blocks, TOC và relation của lesson;
- `interview.json`: câu hỏi/đáp án/rubric/source từ interview Markdown và embedded block;
- `flashcards.json`: manual card cùng derived card;
- `search-index.json`: dữ liệu search chỉ từ Markdown;
- `roadmaps.json`: roadmap đã resolve/validate lesson ID;
- `manifest.json`: schema version, enum, technology và count;
- `content-stats.json`: thống kê corpus và warning.

Chính sách repository: commit source Markdown và commit generated JSON để local development/GitHub Pages dùng thuận tiện. CI vẫn luôn validate và generate lại trước Angular build; JSON committed không trở thành authoring source.

Angular phải tải file bằng URL tôn trọng `<base href>`, ví dụ `generated/lessons.json` qua `AssetUrlService`; không dùng root-absolute `/generated/lessons.json` và không hardcode repository path.
