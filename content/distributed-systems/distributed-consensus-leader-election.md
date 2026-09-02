---
id: distributed-consensus-leader-election
slug: distributed-consensus-leader-election
title: Consensus, Leader Election và Fencing trong Distributed Systems
description: Hiểu đúng failure detector, quorum, replicated log, term/epoch, commit, leader lease và cách vận hành consensus group an toàn khi partition hoặc node pause.
category: distributed-systems
technology: Distributed Consensus
level: senior
estimatedMinutes: 55
tags: ["distributed-systems","consensus","leader-election","quorum","replicated-log","fencing"]
prerequisites: ["distributed-time-clocks-ordering","cap-replication-sharding"]
related: ["kafka-broker-storage-replication","idempotency-retry-circuit-breaker","distributed-load-balancing-service-discovery"]
next: distributed-load-balancing-service-discovery
learningObjectives: ["Phân biệt leader election với consensus và replicated log","Lập luận safety/liveness dưới partition và process pause","Thiết kế fencing, membership và vận hành quorum production"]
lastReviewed: 2026-09-02
appliesTo: {"scope":"protocol-neutral; đối chiếu tài liệu implementation/version cụ thể trước khi cấu hình quorum"}
sources: [{"title":"Leader election in distributed systems","url":"https://aws.amazon.com/builders-library/leader-election-in-distributed-systems/","organization":"Amazon Web Services","type":"primary-vendor","accessedAt":"2026-09-02"},{"title":"Challenges with distributed systems","url":"https://aws.amazon.com/builders-library/challenges-with-distributed-systems/","organization":"Amazon Web Services","type":"primary-vendor","accessedAt":"2026-09-02"},{"title":"Leases","url":"https://kubernetes.io/docs/concepts/architecture/leases/","organization":"Kubernetes","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Apache Kafka design documentation","url":"https://kafka.apache.org/design/","organization":"Apache Kafka","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: bốn vấn đề khác nhau

Một hệ thống báo “đã elect leader” chưa đủ để kết luận state nhất quán. Cần tách:

- **Failure detection:** node nghi peer chết vì timeout; đây là phán đoán, không phải sự thật chắc chắn.
- **Leader election:** các participant chọn ai đóng vai coordinator trong một epoch/term.
- **Consensus:** các participant còn sống đồng thuận một giá trị hoặc chuỗi quyết định theo protocol, với điều kiện failure model cụ thể.
- **Replicated state machine/log:** mọi replica áp dụng cùng committed commands theo cùng order để đạt cùng state.

Election có thể thực hiện bằng consensus, nhưng một lock row hay heartbeat đơn lẻ không biến mọi write thành consensual. Trong partition, hai phía có thể cùng “thấy” phía kia chết. Safety phải đến từ quorum/epoch/commit rule và fencing ở resource, không từ niềm tin của process.

```mermaid
sequenceDiagram
  participant C as Client
  participant L1 as Leader term 8
  participant F1 as Follower A
  participant F2 as Follower B
  C->>L1: command X
  L1->>F1: append(term=8,index=51)
  L1->>F2: append(term=8,index=51)
  F1-->>L1: persisted
  Note over L1,F1: quorum acknowledges; protocol may commit
  L1-->>C: success after required commit rule
  Note over L1: partition/pause
  F1->>F2: elect leader term 9
  Note over L1: old term 8 must be fenced
```

## Quorum intersection, không phải “đa số là phép màu”

Với một cấu hình cố định thường gặp, majority read/write quorum giao nhau, nên quyết định mới có thể quan sát lịch sử đã commit. Nhưng câu “có `2f+1` node thì chịu được `f` lỗi” chỉ đúng dưới assumptions của protocol: loại lỗi (crash hay Byzantine), network eventually delivers, storage durability, membership và commit algorithm. Ba node không bảo đảm availability nếu hai node cùng fault hoặc latency giữa zones vượt election timeout; năm node không sửa được software bug đồng loạt.

Consensus protocol thường gắn mỗi leadership với term/epoch tăng đơn điệu và mỗi log entry với index. Candidate cần thỏa freshness rule trước khi được bầu. Leader replicate entry, và entry chỉ committed khi đạt commit rule của protocol; “leader đã ghi local disk” chưa chắc committed. Client acknowledgment phải gắn với durability/commit semantics thật. Sau failover, uncommitted suffix có thể bị overwrite; API không được tuyên bố success trước boundary đã hứa.

Safety nghĩa là không có hai committed decisions mâu thuẫn theo model. Liveness nghĩa là hệ thống cuối cùng tiến lên khi điều kiện cần trở lại. Khi partition không còn quorum, dừng write thường là lựa chọn giữ safety. Tăng election timeout có thể giảm false election nhưng kéo dài failover; giảm quá thấp khiến latency spike/GC pause tạo election storm. Timeout là tuning dựa trên distribution và failure drill, không phải proof.

## Leader lease và fencing

Lease giảm coordination cho một số operation nếu protocol có clock/error assumptions rõ. Kubernetes Lease object được dùng cho node heartbeat và component leader election, nhưng object Lease tự thân không thay transaction/consensus của datastore phía sau. Một holder bị pause có thể tỉnh lại sau khi lease đã chuyển chủ.

Do đó mỗi leadership cần token/epoch. Mọi write tới database, storage, scheduler hoặc downstream quan trọng phải mang token; resource từ chối token thấp hơn token cao nhất:

```sql
UPDATE job_control
SET last_token = :token, checkpoint = :checkpoint
WHERE job_id = :jobId AND last_token < :token;
```

Ví dụ chỉ minh họa compare-and-set; production cần transaction, uniqueness và semantics khi cùng token phù hợp. Nếu resource không thể validate fencing, side effect như gửi email cần idempotency key/outbox và reconciliation. “Leader cũ tự kiểm tra lease trước mỗi vòng” vẫn có race giữa check và effect.

## Read semantics cũng cần contract

Follower read có thể giảm tải leader và latency theo locality nhưng có thể stale. Read-your-writes, monotonic reads hay linearizable read là các guarantee khác nhau. Linearizable read thường cần xác nhận leadership/quorum hoặc read index theo implementation; đọc local leader cache không mặc nhiên linearizable vì leader có thể đã mất quorum mà chưa biết.

Client phải giữ deadline và retry sang leader mới, nhưng retry command sau timeout có thể duplicate. Dùng request ID/idempotency record tại state-machine boundary. Redirect “not leader” cần kèm epoch/hint có thời hạn; cache leader endpoint quá lâu sẽ tạo retry storm vào node cũ.

## Membership, snapshot và phạm vi group

Thay member không phải sửa một danh sách tùy tiện. Nếu old và new quorum không giao nhau đúng cách, hai cấu hình có thể commit hai lịch sử. Dùng membership-change workflow mà implementation hỗ trợ, thường có joint/overlap phase hoặc giới hạn một thay đổi mỗi lần. Không remove nhiều voter đồng thời vì maintenance tưởng rằng “còn pod khác”. Kiểm tra failure-domain placement: ba replicas trên cùng host/zone không bảo vệ sự cố chung.

Log tăng vô hạn nên implementation dùng snapshot/checkpoint và log compaction. Snapshot phải tương ứng committed index/term, checksum/validate trước install và giữ đường recovery. Replica quá chậm có thể cần snapshot thay vì replay toàn log. Disk full, fsync latency và corrupt state đều là consensus incidents, không chỉ “storage issue”.

Một consensus group toàn cầu dễ thành bottleneck và tăng blast radius. Shard theo key để nhiều group độc lập khi domain cho phép, nhưng transaction/read cross-shard phức tạp hơn. Metadata/control plane cần quorum mạnh; data plane có thể dùng consistency khác. Không đưa mọi cache, counter hay telemetry vào consensus chỉ để “an toàn”.

## Failure scenarios và troubleshooting

**Election loop:** term tăng liên tục, leader tenure ngắn. So latency/packet loss giữa voters, CPU throttling/GC pause, disk fsync và timeout distribution; kiểm tra duplicate node identity hoặc asymmetric firewall. Đừng chỉ tăng timeout rồi đóng incident.

**Có leader nhưng không commit:** leader liên lạc được client nhưng không đủ voter, hoặc disk follower chậm. Kiểm tra quorum connectivity theo hai chiều, replication lag, in-sync/voter state và storage. Health endpoint “process alive” không chứng minh consensus healthy.

**Split-brain side effect:** hai worker cùng chạy job dù log chỉ có một leader. Resource ngoài consensus chưa kiểm tra epoch. Dừng effect, fence/revoke credential nếu có thể, deduplicate/reconcile và bổ sung token tại điểm cuối.

**Mất dữ liệu sau failover:** acknowledgment được trả trước commit/durable boundary hoặc replica được cấu hình/replace sai. Xác định last committed index, không tự ghép log bằng timestamp; theo recovery procedure của sản phẩm và giữ artifact để forensic.

**Quorum mất trong maintenance:** operator restart/remove quá nhiều voter hoặc topology rollout cùng lúc. Dùng disruption budget/quorum-aware sequence, preflight health và abort condition.

Telemetry tối thiểu gồm current term/leader, leader changes, election duration, committed/applied index, replication lag, quorum reachability, append/fsync latency, snapshot/install, rejected stale epoch và membership config hash. Alert trên inability to commit và election churn, không chỉ leader count.

## Production checklist

- [ ] Failure model, voter count, zone placement và tolerated failure được ghi rõ.
- [ ] Client success gắn với documented commit/durability rule của đúng version.
- [ ] Mọi external side effect có fencing hoặc idempotency + reconciliation.
- [ ] Read path công bố stale/bounded/linearizable semantics, không gọi chung là “consistent”.
- [ ] Election/heartbeat timeout được load/failure-test với GC, disk và network tail latency.
- [ ] Membership change theo supported workflow; backup/snapshot đã restore-test.
- [ ] Rolling upgrade kiểm tra protocol/version compatibility và luôn giữ quorum.
- [ ] Runbook bao phủ lost quorum, bad member, disk full, stale leader và rollback.

## Góc phỏng vấn

**Leader election có đồng nghĩa consensus không?** Không. Election chọn vai trò; consensus còn quy định lịch sử/giá trị nào được chấp nhận và committed. Cần term, quorum, log rule và fencing.

**Vì sao old leader nguy hiểm?** Failure detector chỉ suspect. Node cũ có thể bị pause/partition rồi tiếp tục. Epoch/fencing khiến resource nhận ra quyền cũ đã hết.

**Thêm replica có luôn tốt?** Không. Có thể tăng fault tolerance theo model nhưng cũng tăng coordination latency, operational surface và yêu cầu placement. Non-voter/read replica có trade-off khác voter.

## Key Takeaways

- Failure detection, election, consensus và replication là bốn lớp liên quan nhưng không đồng nhất.
- Majority hữu ích nhờ quorum intersection trong protocol/configuration cụ thể, không phải khẩu hiệu phổ quát.
- Commit index/term quyết định lịch sử; local append và timestamp không đủ.
- Fencing phải được kiểm tra tại resource cuối để chặn stale leader.
- Vận hành consensus là quản lý network, disk, membership, upgrade và recovery như một invariant sống.
