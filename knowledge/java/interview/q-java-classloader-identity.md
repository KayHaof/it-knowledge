---
id: q-java-classloader-identity
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - classloader
  - linking
  - initialization
relatedLessons:
  - java-platform-bytecode-classloading
sources:
  - title: JVMS 26 — The class File Format
    url: https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: JVMS 26 — Loading, Linking, and Initializing
    url: https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: ClassLoader API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-02
  - title: JEP 261 — Module System
    url: https://openjdk.org/jeps/261
    organization: OpenJDK
    type: specification
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
    - id: classloader
      required: true
      aliases:
        - classloader
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: linking
      required: true
      aliases:
        - linking
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: initialization
      required: false
      aliases:
        - initialization
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Tên package + class là identity duy nhất; nếu cast lỗi thì chắc chắn bytecode khác version.
      penalty: 20
---

# Hai class có cùng fully qualified name có luôn là cùng một type trong JVM không?

## Rubric

### Must Include

- classloader

- linking

### Strong Answer Includes

- initialization

## Câu trả lời 30 giây

Không. Runtime type identity gồm binary name và defining class loader. Cùng bytecode/name do hai loader khác nhau định nghĩa vẫn là hai type khác, nên cast có thể thất bại dù tên trong lỗi giống hệt.

## Câu trả lời chi tiết

Tôi tách loading, linking và initialization. Loader tìm/định nghĩa class; linking verify, prepare và resolve symbolic references; initialization chạy static initializers khi có active use phù hợp. Parent delegation giúp tránh duplicate platform types nhưng plugin/container có loader topology riêng. ClassNotFoundException thường là explicit load không tìm thấy; NoClassDefFoundError có thể do dependency hoặc initialization trước đó thất bại; LinkageError báo incompatibility ở linking.

## Deep Dive

Một class được load chưa chắc đã initialize. Static initialization failure được ghi nhận cho class đó; lần dùng sau có thể thấy lỗi khác. Context ClassLoader và JPMS readability/export còn ảnh hưởng discovery/access.

## Góc nhìn Production

Ghi class name, defining loader, code source và dependency tree; không chỉ thêm JAR ngẫu nhiên. Khi hot reload/plugin, kiểm ThreadLocal, thread, listener và cache giữ loader cũ gây metaspace leak.

## Trade-offs

Một class được load chưa chắc đã initialize. Static initialization failure được ghi nhận cho class đó; lần dùng sau có thể thấy lỗi khác. Context ClassLoader và JPMS readability/export còn ảnh hưởng discovery/access.

## Câu trả lời sai thường gặp

Tên package + class là identity duy nhất; nếu cast lỗi thì chắc chắn bytecode khác version.

## Follow-up

- Loading khác initialization ở điểm nào?

- Vì sao classloader leak thường biểu hiện ở metaspace?

## Nguồn chính thống

- [Oracle — JVMS 26 — The class File Format](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html)
- [Oracle — JVMS 26 — Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html)
- [Oracle — ClassLoader API — Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html)
- [OpenJDK — JEP 261 — Module System](https://openjdk.org/jeps/261)
