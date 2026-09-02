# Hướng dẫn viết nội dung

## Quy trình

1. Xác định learning objective và level dựa trên độ sâu/trade-off, không dựa trên độ dài.
2. Research specification hoặc official documentation; không dùng blog SEO làm nguồn mặc định.
3. Viết lại bằng tiếng Việt, không mirror/copy dài tài liệu gốc.
4. Ghi frontmatter theo template; URL thật, ngày review thật, version chỉ khi behavior phụ thuộc version.
5. Nối `prerequisites`, `related`, `next` bằng ID tồn tại.
6. Chạy `npm run content:validate`, `npm run content:index`, `npm run content:check-links` và review diff.

## Markdown subset

Pipeline cố ý hỗ trợ subset nhỏ để không render raw HTML:

- `##`, `###` cho heading/TOC;
- paragraph, ordered/unordered list; inline `code` và `**nhấn mạnh**` được render bằng token an toàn, không qua raw HTML;
- GitHub-style table;
- code fence có language và `title="OrderService.java"`;
- Mermaid code fence;
- callout: `:::production Tiêu đề` đến `:::`.

Callout hợp lệ: `note`, `tip`, `info`, `warning`, `danger`, `best-practice`, `interview`, `production`.

Raw HTML không được hỗ trợ. Điều này là ràng buộc bảo mật có chủ ý.

## Interview question schema

`content/interview/questions.json` giữ các field bắt buộc hiện có: `id`, `category`, `difficulty`, `topics`, `question`, `answer30s`, `answer2m`, `production`, `wrongAnswer`, `followUps`, `relatedLesson`. Câu mới nên thêm:

- `deepDive`: cơ chế hoặc trade-off sâu hơn phần trả lời hai phút;
- `sources`: mảng source cùng shape với lesson metadata để UI hiển thị Official References.

`relatedLesson` phải là route lesson thật. Validator kiểm duplicate ID, route, source fields, source type và allowlisted domain. Các câu legacy chưa có `sources` được content build kế thừa references từ `relatedLesson`; câu mới vẫn nên ghi source trực tiếp để traceability không phụ thuộc fallback này.

## Cấu trúc chất lượng

Bài quan trọng nên trả lời: là gì, giải quyết gì, cơ chế, ví dụ, production failure, performance/security, trade-off, khi dùng/không dùng, interview answer, misconception và key takeaways. Không cần ép mọi bài đủ 30 heading nếu không tạo thêm giá trị.

Nguồn cuối bài do UI dựng từ metadata. Nội dung kỹ thuật có thay đổi theo version phải ghi `appliesTo` và review lại khi nâng dependency/platform.

## Source registry

Validator chỉ cho hostname thuộc `content-sources/official-sources.json`. Thêm domain mới cần ghi organization, technology và priority; secondary source phải được đánh dấu đúng `type` và có lý do review. Các source type hợp lệ được khai báo tập trung trong content pipeline; không tự tạo nhãn mới vì validator sẽ từ chối.
