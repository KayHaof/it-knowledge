---
id: java-immutable-collection
type: interview-question
technology: Java
category: Java
difficulty: junior
topics:
  - List.copyOf
  - immutability
  - defensive-copy
relatedLessons:
  - java-object-model-immutability-records-sealed
sources:
  - title: JLS 26 — Classes
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 395 — Records
    url: https://openjdk.org/jeps/395
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: JEP 409 — Sealed Classes
    url: https://openjdk.org/jeps/409
    organization: OpenJDK
    type: specification
    accessedAt: 2026-09-02
  - title: Record API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html
    organization: Oracle
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
    - id: list-copyof
      required: true
      aliases:
        - List.copyOf
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: immutability
      required: true
      aliases:
        - immutability
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: defensive-copy
      required: false
      aliases:
        - defensive-copy
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Unmodifiable view làm list gốc immutable sâu và copyOf sao chép mọi object bên trong.
      penalty: 20
---

# `List.copyOf` khác `Collections.unmodifiableList` ở điểm nào?

## Rubric

### Must Include

- List.copyOf

- immutability

### Strong Answer Includes

- defensive-copy

## Câu trả lời 30 giây

Cả hai ngăn mutation qua view trả về, nhưng `unmodifiableList` có thể phản ánh thay đổi của list gốc. `List.copyOf` tạo snapshot immutable và từ chối null element, nên phù hợp boundary muốn tách ownership.

## Câu trả lời chi tiết

Unmodifiable view chỉ chặn đường dẫn mutate qua view; caller còn giữ list gốc vẫn sửa được và reader thấy thay đổi. CopyOf có thể tối ưu reuse immutable input nhưng semantic là không cho caller sửa cấu trúc. Nó không deep-copy object elements, nên element mutable vẫn cần policy riêng.

## Góc nhìn Production

Defensive-copy request/response collections để tránh shared mutation giữa thread và cache. Đo memory nếu copy list rất lớn và dùng pagination/stream thay vì giữ toàn bộ.

## Trade-offs

Unmodifiable view chỉ chặn đường dẫn mutate qua view; caller còn giữ list gốc vẫn sửa được và reader thấy thay đổi. CopyOf có thể tối ưu reuse immutable input nhưng semantic là không cho caller sửa cấu trúc. Nó không deep-copy object elements, nên element mutable vẫn cần policy riêng.

## Câu trả lời sai thường gặp

Unmodifiable view làm list gốc immutable sâu và copyOf sao chép mọi object bên trong.

## Follow-up

- Khi nào cần deep copy?

- Null element trong immutable collection có ý nghĩa gì?

## Nguồn chính thống

- [Oracle — JLS 26 — Classes](https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html)
- [OpenJDK — JEP 395 — Records](https://openjdk.org/jeps/395)
- [OpenJDK — JEP 409 — Sealed Classes](https://openjdk.org/jeps/409)
- [Oracle — Record API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Record.html)
