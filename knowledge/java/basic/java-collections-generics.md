---
id: java-collections-generics
slug: java-collections-generics
title: Java Collections và Generics — Chọn cấu trúc theo Contract
description: Phân biệt array, Collection và Map; chọn List, Set, Queue, Deque, PriorityQueue theo contract, rồi thiết kế API generic an toàn bằng invariance và PECS.
technology: Java
domain: backend
category: backend
level: basic
contentType: core
order: 20
estimatedMinutes: 62
tags:
  - java
  - collections
  - generics
  - hashmap
  - queue
  - deque
  - priority-queue
  - pecs
prerequisites:
  - java-object-contracts
related:
  - java-hashmap-internals
  - java-streams-optional
  - java-concurrency
learningObjectives:
  - Phân biệt array, Collection, Map và các contract List, Set, Queue, Deque
  - Chọn implementation theo ordering, uniqueness, access pattern, memory và concurrency
  - Dùng Queue, Deque, PriorityQueue đúng semantics thay vì suy đoán từ tên kiểu
  - Áp dụng invariance và PECS tại API boundary
  - Chẩn đoán lỗi equality, iteration, mutation và tăng trưởng collection
sources:
  - title: Collections Framework Overview — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/doc-files/coll-overview.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: Storing Data Using the Collections Framework
    url: https://dev.java/learn/api/collections-and-streams/collections-framework/intro/
    organization: Oracle / Dev.java
    type: official-documentation
    accessedAt: 2026-09-26
  - title: Extending Collection with Set, SortedSet and NavigableSet
    url: https://dev.java/learn/api/collections-and-streams/collections-framework/sets/
    organization: Oracle / Dev.java
    type: official-documentation
    accessedAt: 2026-09-26
  - title: Storing Elements in Stacks and Queues
    url: https://dev.java/learn/api/collections-and-streams/collections-framework/stacks-queues/
    organization: Oracle / Dev.java
    type: official-documentation
    accessedAt: 2026-09-26
  - title: HashMap API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/HashMap.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: PriorityQueue API — Java SE 26
    url: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/PriorityQueue.html
    organization: Oracle
    type: official-documentation
    accessedAt: 2026-09-26
  - title: Java Language Specification — Type Arguments
    url: https://docs.oracle.com/javase/specs/jls/se26/html/jls-4.html#jls-4.5.1
    organization: Oracle
    type: specification
    accessedAt: 2026-09-26
lastReviewed: 2026-09-26
appliesTo:
  java: "21+; API references checked against Java SE 26"
---

# Java Collections và Generics — Chọn cấu trúc theo Contract

## Tổng quan

Collections Framework là tập interface, implementation và thuật toán để biểu diễn, lưu trữ và thao tác nhóm object. Điểm quan trọng không phải nhớ càng nhiều class càng tốt, mà là bắt đầu từ **contract dữ liệu**: có giữ thứ tự không, có cho trùng không, truy cập bằng index hay key, phần tử nào phải ra trước, collection có mutable không, cardinality tối đa là bao nhiêu và có được chia sẻ giữa nhiều thread không.

Một lựa chọn sai thường vẫn chạy đúng ở dữ liệu nhỏ rồi mới lộ ra dưới production load: `LinkedList` làm tăng allocation và pointer chasing, `PriorityQueue` bị hiểu nhầm là luôn duyệt theo thứ tự ưu tiên, `HashMap` phình không giới hạn, hoặc một iterator fail-fast bị dùng nhầm như cơ chế thread-safety.

## Array hay Collection

Array có độ dài cố định sau khi tạo, có thể chứa primitive trực tiếp như `int[]`, giữ runtime component type và cung cấp truy cập theo index. Nó phù hợp khi kích thước đã biết, API bắt buộc dùng array, dữ liệu primitive cần tránh boxing, hoặc hot path đã được profiling chứng minh cần layout đơn giản.

Collection quản lý số phần tử động, cung cấp contract chung cho thêm, xóa, kiểm tra membership, iteration và nhiều thuật toán. Generic collection chỉ chứa reference type, nên `List<Integer>` có boxing khác với `int[]`. Collection không tự động tốt hơn array: một buffer kích thước cố định hoặc bảng số nguyên lớn có thể dùng array rõ ràng và tiết kiệm hơn.

| Câu hỏi | Array | Collection |
|---|---|---|
| Kích thước | Cố định | Thường thay đổi được, tùy implementation |
| Primitive trực tiếp | Có | Không, phải dùng wrapper hoặc specialized API khác |
| Runtime component type | Có | Type argument phần lớn bị erasure |
| Thêm/xóa phần tử | Tự quản lý và copy | Có API theo contract implementation |
| Thuật toán/abstraction | `Arrays` và code theo index | Interface chung, iterator, stream, factory |

Đừng chuyển mọi array sang collection theo thói quen. Hãy chọn từ ownership, mutation, cardinality và profile memory/CPU thực tế.

## Hai nhánh chính: Collection và Map

`Collection<E>` và `Map<K,V>` là hai nhánh riêng. `Map` **không extends `Collection`** vì một mapping gồm key và value, với contract key duy nhất, không phải chỉ một nhóm phần tử đơn.

```text
Iterable
└── Collection
    ├── List
    ├── Set
    │   └── SortedSet / NavigableSet
    └── Queue
        └── Deque

Map
└── SortedMap / NavigableMap
```

`Collection` extends `Iterable`, nên có thể dùng enhanced `for`. `Map` cung cấp ba live view: `keySet()`, `values()` và `entrySet()`. Thay đổi hợp lệ qua view có thể phản ánh vào map; vì vậy đừng giả định chúng là snapshot độc lập.

## Chọn contract trước implementation

| Nhu cầu | Contract / implementation thường gặp | Điều phải trả giá hoặc kiểm tra |
|---|---|---|
| Sequence, truy cập index, append | `List` / `ArrayList` | Chèn/xóa giữa mảng phải dịch phần tử; resize có copy |
| Sequence cần chèn/xóa qua iterator đã có | `List` / `LinkedList` | Node allocation, O(n) khi tìm index, locality kém |
| Unique membership | `Set` / `HashSet` | Phụ thuộc `equals/hashCode`, không bảo đảm order |
| Unique và giữ insertion order | `Set` / `LinkedHashSet` | Thêm metadata liên kết cho mỗi entry |
| Unique có sorted/range navigation | `NavigableSet` / `TreeSet` | Phụ thuộc comparator/natural order nhất quán |
| Lookup theo key | `Map` / `HashMap` | Memory, resize, key contract, không bảo đảm order |
| Map giữ insertion/access order | `LinkedHashMap` | Thêm liên kết; access-order cần cấu hình rõ |
| Map sorted/range query in-memory | `NavigableMap` / `TreeMap` | Chi phí so sánh và cập nhật logarithmic |
| FIFO/LIFO hai đầu | `Deque` / `ArrayDeque` | Không thread-safe; không nhận `null` |
| Lấy phần tử ưu tiên trước | `Queue` / `PriorityQueue` | Iterator không sorted; cập nhật priority cần thiết kế lại |
| Producer-consumer có chờ và capacity | `BlockingQueue` | Semantics blocking, timeout và shutdown phải rõ |

Big-O chỉ là điểm bắt đầu. Cache locality, số allocation, kích thước object, chất lượng hash, cost của comparator và access pattern thật có thể đảo ngược lựa chọn trên dữ liệu production.

## List, Set và sorted collection

`List` giữ encounter order, cho phép duplicate và truy cập theo vị trí. `ArrayList` thường là mặc định tốt cho đọc tuần tự, random access và append. `LinkedList` chỉ có thao tác thêm/xóa O(1) khi code **đã giữ đúng node position qua iterator**; `get(index)` vẫn phải đi qua node và node riêng lẻ gây memory overhead. Với stack hoặc queue, `ArrayDeque` thường diễn đạt ý định rõ hơn.

`Set` cấm duplicate theo equality contract. `HashSet` phù hợp cho membership không yêu cầu order; nó được backing bởi `HashMap`, nên mutable element làm thay đổi `hashCode` có thể trở nên “không tìm thấy” sau khi thêm. `TreeSet` dùng ordering từ `Comparable` hoặc `Comparator` để xác định vị trí và uniqueness theo kết quả so sánh. Nếu comparator trả `0` cho hai object mà domain vẫn xem là khác, một phần tử có thể bị coi là trùng dù `equals` trả `false`.

:::warning Ordering không phải chi tiết trang trí
Nếu API hoặc test phụ thuộc order, hãy chọn contract có bảo đảm order. Không dựa vào thứ tự hiện quan sát được của `HashMap`/`HashSet`; implementation, dữ liệu hoặc resize có thể làm thứ tự thay đổi.
:::

## Queue, Deque và PriorityQueue

`Queue` biểu diễn phần tử chờ xử lý. Mỗi thao tác có hai nhóm semantics:

| Mục đích | Ném exception khi thất bại/rỗng | Trả special value |
|---|---|---|
| Thêm | `add(e)` | `offer(e)` trả `false` nếu không nhận được |
| Lấy và xóa head | `remove()` | `poll()` trả `null` nếu rỗng |
| Xem head | `element()` | `peek()` trả `null` nếu rỗng |

Với queue có giới hạn capacity, `offer` cho phép caller xử lý overload thay vì dùng exception như control flow. Vì `null` thường là sentinel cho queue rỗng, không đưa `null` vào queue ngay cả khi một implementation cũ có thể cho phép.

`Deque` thao tác ở cả hai đầu. `ArrayDeque` phù hợp cho FIFO bằng `offerLast/pollFirst` và LIFO bằng `push/pop`; dùng method name nhất quán để người đọc không phải giải mã head/tail. Nó không thay thế `BlockingQueue` khi producer và consumer cần chờ, timeout hoặc capacity coordination.

`PriorityQueue` là priority heap: `peek/poll` truy cập phần tử nhỏ nhất theo natural order hoặc comparator, không phải FIFO. Iterator của nó **không được bảo đảm duyệt theo priority order**. Nếu cần xuất toàn bộ theo thứ tự, phải poll trên một bản sao hoặc sort snapshot, chấp nhận chi phí tương ứng. Không mutate field tham gia comparator khi object đang ở trong queue; heap không tự định vị lại phần tử đó.

```java title="TaskQueue.java"
record Task(String id, int priority) {}

Queue<Task> tasks = new PriorityQueue<>(Comparator.comparingInt(Task::priority));
tasks.offer(new Task("report", 20));
tasks.offer(new Task("payment", 5));

Task next = tasks.poll(); // payment; không suy ra iterator cũng trả đúng thứ tự này
```

## HashMap ở mức contract

`HashMap` dùng hash để thu hẹp vùng tìm kiếm rồi dùng `equals` để xác định key. Khi số mapping vượt threshold dựa trên capacity và load factor, map có thể resize và rebuild cấu trúc. Capacity quá nhỏ gây resize lặp; quá lớn lãng phí memory và làm iteration qua view tốn theo cả capacity lẫn size.

Phần bucket, collision, resize, tree bin và ranh giới giữa API contract với OpenJDK implementation được trình bày riêng trong lesson `java-hashmap-internals`. Ở mức sử dụng, ba rule quan trọng là:

1. key phải có `equals/hashCode` nhất quán và ổn định trong thời gian nằm trong map;
2. không dựa vào iteration order của `HashMap`;
3. `HashMap` không thread-safe, nên không dùng nó cho concurrent structural mutation mà không có coordination.

## Generics, invariance và PECS

`List<Integer>` không phải subtype của `List<Number>`. Nếu điều đó được phép, một method nhận `List<Number>` có thể thêm `Double` vào list vốn chỉ nhận `Integer`. Wildcard diễn tả variance tại điểm sử dụng:

- `? extends T`: nguồn tạo ra `T`; đọc an toàn như `T`, nhưng không thêm một subtype cụ thể.
- `? super T`: đích nhận `T`; thêm `T` an toàn, nhưng đọc ra chỉ chắc chắn là `Object`.
- Không dùng wildcard nếu cùng cấu trúc vừa cần đọc vừa cần ghi theo một type cụ thể.

```java title="CollectionTransfer.java"
static <T> void copyAll(
    Collection<? extends T> source,
    Collection<? super T> destination) {
  destination.addAll(source);
}
```

PECS là mnemonic hữu ích, không phải luật áp dụng máy móc. Public input thường có thể dùng wildcard để tăng khả năng kết hợp; return type wildcard thường đẩy sự phức tạp cho caller. Tránh raw type vì nó chuyển lỗi type từ compile time sang runtime và có thể tạo heap pollution.

## Iterator, mutation và snapshot

Nhiều iterator của collection thông thường là fail-fast theo **best effort**: structural modification ngoài iterator có thể ném `ConcurrentModificationException`. Đây là tín hiệu phát hiện bug, không phải synchronization guarantee và cũng không được dùng làm nhánh logic nghiệp vụ.

Các contract snapshot/view cũng khác nhau:

- `Collections.unmodifiableList(list)` là view không sửa qua reference đó; owner vẫn có thể sửa backing list.
- `List.copyOf(list)` tạo unmodifiable snapshot nông tại thời điểm gọi; element mutable vẫn có thể đổi.
- `map.keySet()` là live view gắn với map.
- Iterator của concurrent collection có semantics riêng; không suy ra từ iterator fail-fast của `ArrayList` hay `HashMap`.

Khi xóa trong lúc duyệt collection thường, dùng `Iterator.remove`, `removeIf` hoặc thu key cần xóa rồi thực hiện theo contract. Không sửa trực tiếp collection từ một vòng enhanced `for` và hy vọng exception luôn xuất hiện.

## Khi nào không nên dùng collection in-memory

- Dữ liệu không có giới hạn hoặc lớn hơn memory budget: dùng paging, streaming, database/index hoặc external store phù hợp.
- Cần primitive density cao ở hot path đã đo được: array hay specialized structure có thể giảm boxing.
- Cần concurrent queue có capacity/backpressure: không thay bằng `ArrayDeque` bọc lock tùy tiện khi `BlockingQueue` đã diễn đạt contract.
- Cần durable ordering hoặc exactly-once processing: collection trong process không phải message broker hay transaction log.
- Cần range query trên dữ liệu rất lớn: `TreeMap`/`TreeSet` in-memory không thay thế index database.

## Failure scenarios và debugging

1. **Phần tử “biến mất” khỏi `HashSet`/`HashMap`:** log giá trị hash/equality trước và sau mutation; kiểm tra field mutable tham gia contract.
2. **PriorityQueue lấy sai task:** kiểm tra comparator, tie, `null`, field priority bị mutate và việc code nhầm iterator order với poll order.
3. **`ConcurrentModificationException`:** tìm structural mutation cùng vòng lặp; không “sửa” bằng catch/ignore. Xác định ownership và chọn iterator operation, snapshot hoặc concurrent collection đúng semantics.
4. **Latency spike khi batch lớn:** đo allocation, resize, comparator/hash cost, iteration và GC; pre-size chỉ khi có estimate đáng tin, không cấp capacity cực lớn theo input không tin cậy.
5. **Memory tăng liên tục:** tìm collection static/cache/listener registry không eviction, cardinality metric và retained path; collection giữ strong reference tới toàn bộ object graph.
6. **Kết quả sorted mất phần tử:** kiểm tra comparator có transitive, stable và nhất quán với domain equality hay không.

## Trade-offs và production checklist

Không có collection “nhanh nhất”. `ArrayList` tối ưu sequence phổ biến nhưng middle insert đắt; `HashMap` cho expected lookup tốt nhưng tốn memory và phụ thuộc hash; `TreeMap` trả order/range với chi phí comparison; `PriorityQueue` tối ưu head theo priority nhưng không cung cấp sorted iteration; concurrent collection giảm một số race nhưng không tự bảo vệ invariant xuyên nhiều operation.

Trước khi đưa vào production:

1. Ghi rõ order, duplicate, `null`, mutation, ownership và concurrency contract.
2. Ước lượng cardinality, giới hạn tăng trưởng và định nghĩa eviction/lifecycle.
3. Kiểm tra `equals/hashCode` hoặc comparator bằng test có property quan trọng.
4. Chọn bounded queue và overload policy khi producer có thể nhanh hơn consumer.
5. Theo dõi size, queue depth, reject/drop, allocation và latency theo operation quan trọng.
6. Benchmark bằng kích thước và read/write ratio gần workload thật; không kết luận chỉ từ Big-O.
7. Không expose mutable internal collection; trả snapshot, immutable view hoặc API nghiệp vụ rõ ownership.

## Key Takeaways

- Array phù hợp dữ liệu cố định/primitive; Collection phù hợp abstraction và kích thước động, nhưng cả hai phải được chọn theo workload.
- `Map` là hierarchy riêng, không phải subtype của `Collection`.
- Chọn List, Set, Queue, Deque hay Map từ semantic contract trước implementation.
- `PriorityQueue` chỉ bảo đảm head theo priority; iterator không phải sorted traversal.
- Fail-fast iterator phát hiện bug theo best effort, không tạo thread safety.
- Generic invariant; wildcard mô tả producer/consumer tại API boundary.
- Collection in-memory phải có ownership, cardinality và lifecycle rõ trong production.

:::flashcard
id: java-collections-array-vs-collection
front: Khi nào array hợp lý hơn Collection trong Java?
back: Khi kích thước cố định hoặc đã biết, cần giữ primitive trực tiếp, API yêu cầu array, hay profiling chứng minh layout đơn giản giảm boxing/allocation. Collection phù hợp hơn khi cần abstraction và kích thước động.
level: basic
tags:
  - java
  - collections
  - array
:::

:::flashcard
id: java-collections-map-not-collection
front: Vì sao Map không extends Collection?
back: Collection biểu diễn một nhóm element, còn Map biểu diễn mapping key-value với key duy nhất và các view key/value/entry; contract và kiểu phần tử của hai hierarchy khác nhau.
level: basic
tags:
  - java
  - collections
  - map
:::

:::flashcard
id: java-collections-queue-method-pairs
front: add/remove/element khác offer/poll/peek của Queue ở điểm nào?
back: Nhóm đầu ném exception khi thêm thất bại hoặc queue rỗng; nhóm sau trả false hoặc null, phù hợp hơn khi capacity/rỗng là trạng thái cần xử lý bình thường.
level: basic
tags:
  - java
  - queue
  - api-contract
:::

:::flashcard
id: java-collections-priorityqueue-order
front: Iterator của PriorityQueue có duyệt theo thứ tự ưu tiên không?
back: Không. Contract chỉ bảo đảm head được peek/poll theo natural order hoặc comparator; muốn toàn bộ kết quả sorted phải poll bản sao hoặc sort snapshot.
level: basic
tags:
  - java
  - priority-queue
  - ordering
:::

:::flashcard
id: java-generics-pecs-boundary
front: PECS hướng dẫn dùng wildcard như thế nào?
back: Producer Extends để đọc T từ nguồn; Consumer Super để ghi T vào đích. Nếu cấu trúc vừa đọc vừa ghi cùng type cụ thể thì thường không dùng wildcard.
level: basic
tags:
  - java
  - generics
  - pecs
:::

## Nguồn chính thống

- [Oracle — Collections Framework Overview, Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/doc-files/coll-overview.html)
- [Dev.java — Storing Data Using the Collections Framework](https://dev.java/learn/api/collections-and-streams/collections-framework/intro/)
- [Dev.java — Extending Collection with Set, SortedSet and NavigableSet](https://dev.java/learn/api/collections-and-streams/collections-framework/sets/)
- [Dev.java — Storing Elements in Stacks and Queues](https://dev.java/learn/api/collections-and-streams/collections-framework/stacks-queues/)
- [Oracle — HashMap API, Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/HashMap.html)
- [Oracle — PriorityQueue API, Java SE 26](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/PriorityQueue.html)
- [Oracle — Java Language Specification, Type Arguments](https://docs.oracle.com/javase/specs/jls/se26/html/jls-4.html#jls-4.5.1)
