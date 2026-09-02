---
id: java-platform-bytecode-classloading
slug: java-platform-bytecode-classloading
title: Java Platform — Bytecode, Class File và Class Loading
description: Theo dấu từ source tới bytecode, constant pool, class identity và vòng đời loading-linking-initialization để chẩn đoán lỗi dependency trong production.
category: backend
technology: Java / JVM
level: intermediate
estimatedMinutes: 54
tags: ["java","jvm","bytecode","classloader","linkage","jpms"]
prerequisites: ["java-object-contracts"]
related: ["java-jvm-memory","java-jvm-gc-profiling","spring-boot-configuration-conditions"]
next: java-object-model-immutability-records-sealed
learningObjectives: ["Đọc cấu trúc class file và bytecode ở mức đủ để debug","Phân biệt loading, linking và initialization","Điều tra ClassNotFoundException, LinkageError và class-loader leak có hệ thống"]
lastReviewed: 2026-09-02
appliesTo: {"java":"21+; examples and links reviewed against Java SE 26"}
sources: [{"title":"JVMS 26 — The class File Format","url":"https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-4.html","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"},{"title":"JVMS 26 — Loading, Linking, and Initializing","url":"https://docs.oracle.com/javase/specs/jvms/se26/html/jvms-5.html","organization":"Oracle","type":"specification","accessedAt":"2026-09-02"},{"title":"ClassLoader API — Java SE 26","url":"https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ClassLoader.html","organization":"Oracle","type":"official-api-reference","accessedAt":"2026-09-02"},{"title":"JEP 261 — Module System","url":"https://openjdk.org/jeps/261","organization":"OpenJDK","type":"specification","accessedAt":"2026-09-02"}]
---
## Mental model: Java source không chạy trực tiếp

`javac` chuyển source thành một hoặc nhiều `class` files. JVM đọc định dạng nhị phân này, tạo runtime representation, liên kết symbolic references rồi thực thi bằng interpreter và JIT compiler. Bytecode là instruction set có kiểu, dùng local-variable array và operand stack; nó không phải machine code dành riêng cho CPU.

Điểm quan trọng trong production là ranh giới giữa **language**, **class file** và **runtime**. Java Language Specification định nghĩa ý nghĩa source; Java Virtual Machine Specification định nghĩa class file và hành vi máy ảo; HotSpot là một implementation có thể tối ưu mà vẫn giữ semantics. Ví dụ constant pool là phần của class file contract, còn quyết định inline một method là runtime optimization và có thể thay đổi theo profile.

```mermaid
flowchart LR
  A[Java source] -->|javac| B[class file]
  B --> C[ClassLoader]
  C --> D[Verify + Prepare + Resolve]
  D --> E[Initialize]
  E --> F[Interpret + JIT]
```

## Bên trong class file

Mỗi class file bắt đầu bằng magic number, version, constant pool, flags, tên class/superclass, interfaces, fields, methods và attributes. Constant pool chứa literals và symbolic references tới class, field, method. Method thường có `Code` attribute chứa bytecode, exception table và metadata hỗ trợ verification/debug.

Major version tạo compatibility boundary. Class được compile cho JDK mới hơn runtime có thể gây `UnsupportedClassVersionError`; bật preview trên runtime hiện tại cũng không làm class preview của release cũ trở nên hợp lệ. Vì vậy CI nên pin toolchain và đặt `--release` theo runtime thấp nhất thực sự hỗ trợ, thay vì chỉ dựa vào JDK đang cài trên máy build.

`javap` là công cụ nhanh để kiểm tra artifact thật:

```text title="InspectCommands.txt"
javap -classpath app.jar -verbose com.example.PriceService
javap -classpath app.jar -c -p com.example.PriceService
```

`-verbose` cho thấy version, constant pool và attributes; `-c` disassemble bytecode. Đây là evidence hữu ích khi source trong IDE khác binary đã deploy, annotation processor không chạy, hoặc compiler sinh bridge/synthetic method ngoài dự đoán.

## Loading, linking và initialization

Ba phase trả lời ba câu khác nhau:

| Phase | Công việc chính | Failure điển hình |
|---|---|---|
| Loading | Tìm bytes và tạo `Class` | `ClassNotFoundException`, `NoClassDefFoundError` |
| Linking | Verify, prepare static storage, resolve references khi cần | `VerifyError`, `NoSuchMethodError`, `IllegalAccessError` |
| Initialization | Chạy `<clinit>` và gán static initializers | `ExceptionInInitializerError` |

Resolution có thể lazy: lỗi binary incompatibility chỉ xuất hiện khi path cụ thể lần đầu dùng symbol. Điều đó giải thích vì sao application start bình thường nhưng endpoint hiếm lại ném `NoSuchMethodError`.

Initialization được đồng bộ theo class. Static initializer gọi network, lấy lock hoặc phụ thuộc circular initialization có thể làm startup treo hay nhiều request chờ một thread. Giữ static initialization deterministic, ngắn và không I/O; đưa lifecycle resource sang framework-managed component có timeout và health state rõ.

## Class identity gồm tên và defining loader

Hai class cùng binary name nhưng do hai defining class loaders khác nhau tạo ra là hai runtime types khác nhau. Cast giữa chúng có thể ném `ClassCastException` với thông báo trông như “X cannot be cast to X”. Pattern này hay gặp ở plugin container, application server, test isolation và development hot reload.

Class loader mặc định thường delegation cho parent trước. Cơ chế đó giúp core platform classes có identity nhất quán và hạn chế application giả mạo chúng. Custom child-first loader có ích để cô lập plugin dependency, nhưng đổi trade-off: duplicate libraries, API type mismatch, package access và security surface đều phức tạp hơn.

```java title="PluginBoundary.java"
ClassLoader loader = createIsolatedPluginLoader(pluginJar);
Class<?> pluginType = Class.forName("example.InvoicePlugin", true, loader);
Object candidate = pluginType.getConstructor().newInstance();

// Interface này phải được parent/shared loader định nghĩa.
InvoicePlugin plugin = (InvoicePlugin) candidate;
```

Contract type ở boundary phải đến từ loader chung; implementation và dependency riêng có thể nằm trong loader con. Truyền DTO class riêng của plugin qua boundary thường tạo identity conflict; dùng shared API, primitive/standard types hoặc serialized contract được kiểm soát.

## JPMS không thay thế class loader

Java Platform Module System thêm module readability, exports/opens và module layers. Module giúp diễn đạt dependency/access rõ hơn, nhưng class vẫn do loader định nghĩa. Reflection có thể thất bại vì package chưa `opens` dù class đã load; thêm `--add-opens` toàn cục chỉ là workaround có rủi ro, không phải thiết kế module lâu dài.

Khi migrate, phân biệt lỗi “không tìm thấy class” với “module không đọc/export/open”. Ghi module path/classpath thực tế của process, vì IDE configuration không chứng minh command runtime giống production.

## Failure taxonomy thực dụng

- `ClassNotFoundException` là checked exception từ API tìm class theo tên; caller chủ động load nhưng loader không tìm thấy.
- `NoClassDefFoundError` thường xuất hiện khi JVM cần definition từng tồn tại lúc compile nhưng không có hoặc class initialization trước đó đã thất bại.
- `NoSuchMethodError`/`NoSuchFieldError` báo binary runtime không khớp binary mà caller được compile cùng.
- `ServiceConfigurationError` có thể đến từ provider metadata sai, constructor/provider failure hoặc loader context sai.
- `ExceptionInInitializerError` bọc exception trong static initialization; lần dùng sau có thể chỉ còn `NoClassDefFoundError`, nên phải giữ log của failure đầu tiên.

Đừng xử lý `LinkageError` bằng retry request. Đây thường là packaging/deployment defect cần rollback hoặc sửa dependency graph.

## Class-loader leak

Loader chỉ được garbage collect khi loader, mọi class do nó định nghĩa và object liên quan không còn reachable. Thread sống lâu, `ThreadLocal`, static registry, scheduler, JDBC driver, logging cache hoặc thread context class loader có thể giữ loader của deployment cũ. Kết quả là metaspace tăng sau mỗi redeploy dù heap business object trông ổn.

Playbook: so sánh class count/metaspace trước và sau redeploy; lấy heap dump/JFR khi an toàn; tìm đường reference tới loader cũ; đóng executor/resource; xóa registry/listener; restore context loader trong `finally`. Không “sửa” bằng tăng MaxMetaspaceSize trước khi tìm owner.

:::production Artifact evidence
Ghi build commit, JDK toolchain, dependency lock/BOM và checksum artifact. Khi có linkage failure, kiểm binary trong image/container thật bằng `jar`, `jdeps`, `javap`; đừng kết luận từ dependency tree trên laptop.
:::

## Quy trình troubleshooting

1. Ghi exception class, cause đầu tiên và symbol bị thiếu.
2. Xác nhận runtime JDK và class-file version.
3. Xác định class đến từ JAR/module nào và defining loader nào.
4. So sánh compile-time với runtime dependency, tìm duplicate/shaded JAR.
5. Kiểm module readability/exports/opens nếu reflection thất bại.
6. Reproduce với command/image production tối giản.
7. Rollback artifact không tương thích; thêm compatibility test vào CI.

## Câu hỏi phỏng vấn

**Loading khác initialization thế nào?** Loading tạo runtime class từ binary; linking verify/prepare/resolve; initialization chạy static initialization. Class có thể được load mà chưa initialized.

**Vì sao hai class cùng tên không cast được?** Runtime identity là binary name cộng defining class loader. Hai loader khác nhau tạo hai type khác nhau.

## Key Takeaways

- Bytecode là portable JVM instruction, không phải native machine code.
- Class-file version và dependency binary là deployment contract.
- Loading, linking và initialization có failure semantics khác nhau.
- Class identity gồm cả defining loader; plugin boundary phải dùng shared contract.
- Debug artifact đang chạy bằng evidence từ runtime, không chỉ source tree.

