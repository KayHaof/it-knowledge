---
id: java-heap-stack-frame
type: interview-question
technology: Java
category: Java
difficulty: middle
topics:
  - heap
  - stack
  - stack-frame
relatedLessons:
  - java-jvm-memory
sources:
  - title: Java Virtual Machine Specification
    url: https://docs.oracle.com/javase/specs/jvms/se21/html/
    organization: Oracle
    type: specification
    accessedAt: 2026-09-02
  - title: Java troubleshooting guide
    url: https://docs.oracle.com/en/java/javase/21/troubleshoot/
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
    - id: heap
      required: true
      aliases:
        - heap
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: stack
      required: true
      aliases:
        - stack
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: stack-frame
      required: false
      aliases:
        - stack-frame
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Mọi biến local đều nằm trên heap và mọi object bị giải phóng ngay khi method return.
      penalty: 20
---

# Stack frame và heap object khác nhau thế nào khi một method được gọi?

## Rubric

### Must Include

- heap

- stack

### Strong Answer Includes

- stack-frame

## Câu trả lời 30 giây

Mỗi lời gọi tạo stack frame chứa local variables, operand stack và return state; object thường sống trên heap và frame giữ reference. Frame kết thúc khi method return, còn object tồn tại tới khi không còn GC root.

## Câu trả lời chi tiết

Một thread có stack riêng, nên local primitive/reference không tự chia sẻ giữa thread; object được nhiều frame hoặc field tham chiếu thì chia sẻ và cần thread-safety. Escape analysis có thể tối ưu allocation nhưng không nên dựa vào vị trí vật lý tuyệt đối. Stack sâu gây StackOverflowError, heap giữ graph lớn gây GC pressure/OOM.

## Góc nhìn Production

Đọc heap dump và thread dump riêng; đừng kết luận leak chỉ từ committed heap.

## Trade-offs

Một thread có stack riêng, nên local primitive/reference không tự chia sẻ giữa thread; object được nhiều frame hoặc field tham chiếu thì chia sẻ và cần thread-safety. Escape analysis có thể tối ưu allocation nhưng không nên dựa vào vị trí vật lý tuyệt đối. Stack sâu gây StackOverflowError, heap giữ graph lớn gây GC pressure/OOM.

## Câu trả lời sai thường gặp

Mọi biến local đều nằm trên heap và mọi object bị giải phóng ngay khi method return.

## Follow-up

- GC root gồm những gì?

- Escape analysis ảnh hưởng allocation thế nào?

## Nguồn chính thống

- [Oracle — Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se21/html/)
- [Oracle — Java troubleshooting guide](https://docs.oracle.com/en/java/javase/21/troubleshoot/)
