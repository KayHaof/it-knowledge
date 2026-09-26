---
id: database
type: roadmap
title: Database Engineering và Optimization
description: SQL semantics, modeling, MVCC, query planning, vendor trade-offs, ORM và caching.
steps:
  - lessonId: relational-database
    note: Schema, constraint và transaction foundation.
  - lessonId: sql-logical-processing-joins
    note: Logical order, joins, NULL và cardinality.
  - lessonId: sql-cte-window-analytics
    note: Subquery, CTE và window functions.
  - lessonId: sql-keyset-pagination
    note: Stable ordering và seek pagination ở quy mô lớn.
  - lessonId: normalization-denormalization
    note: Model invariant và denormalization cost.
  - lessonId: transactions-mvcc-deadlocks
    note: MVCC, anomalies, locks và deadlock.
  - lessonId: composite-covering-index-explain
    note: Index theo workload.
  - lessonId: database-query-plan
    note: EXPLAIN, statistics và estimates.
  - lessonId: database-slow-api-investigation
    note: Điều tra slow API từ budget đến query evidence.
  - lessonId: database-connection-pool-capacity
    note: Pool sizing theo concurrency, hold time và database budget.
  - lessonId: database-engine-tradeoffs
    note: MySQL, PostgreSQL và Oracle trade-offs.
  - lessonId: postgresql-mvcc-vacuum-bloat
    note: Tuple versions, VACUUM, freeze và bloat.
  - lessonId: postgresql-planner-statistics
    note: Statistics, cardinality estimate và planner diagnosis.
  - lessonId: postgresql-index-types-jsonb
    note: B-tree, GIN, GiST, BRIN và JSONB access paths.
  - lessonId: postgresql-partitioning-operations
    note: Partition pruning, lifecycle và operational trade-offs.
  - lessonId: mysql-innodb-clustered-secondary-indexes
    note: Clustered primary key và secondary lookup trong InnoDB.
  - lessonId: mysql-innodb-locks-replication
    note: Isolation, next-key locks và replication safety.
  - lessonId: oracle-undo-read-consistency-optimizer
    note: Undo, read consistency và execution plan trong Oracle.
  - lessonId: database-replication-sharding-decisions
    note: Chọn replica, partition hay shard theo bottleneck.
  - lessonId: spring-jpa-persistence-context
    note: ORM unit of work với transaction.
  - lessonId: spring-jpa-fetching-batching-locking
    note: Access shape, locking và batching.
  - lessonId: jpa-n-plus-one
    note: Round-trip/cardinality regression.
  - lessonId: spring-postgresql-production-boundary
    note: Pool, timeout, DDL và observability.
  - lessonId: mongodb-document-model
    note: Document access patterns.
  - lessonId: mongodb-indexes-aggregation-performance
    note: Index, aggregation pipeline và explain evidence.
  - lessonId: mongodb-replica-set-consistency-transactions
    note: Replica set, read/write concern và transaction boundary.
  - lessonId: mongodb-sharding-schema-operations
    note: Shard key, balancing và schema operations.
  - lessonId: redis-data-structures-expiration
    note: In-memory data và expiry.
  - lessonId: redis-cache-aside
    note: Cache là bản sao có consistency contract.
  - lessonId: redis-cache-consistency-stampede
    note: Invalidation, stampede và degraded cache behavior.
  - lessonId: redis-persistence-ha-cluster
    note: Persistence, replication, Sentinel và Cluster trade-offs.
  - lessonId: redis-streams-pubsub
    note: Streams, consumer groups và Pub/Sub delivery semantics.
  - lessonId: redis-distributed-locks-leases-redlock
    note: Lease, ownership token, fencing và Redlock trade-offs.
  - lessonId: sql-nosql-data-model-decision
    note: Chọn relational, document hay key-value theo invariants.
---

# Database Engineering và Optimization

## Tổng quan

SQL semantics, modeling, MVCC, query planning, vendor trade-offs, ORM và caching.

## Lộ trình

1. **relational-database** — Schema, constraint và transaction foundation.

2. **sql-logical-processing-joins** — Logical order, joins, NULL và cardinality.

3. **sql-cte-window-analytics** — Subquery, CTE và window functions.

4. **sql-keyset-pagination** — Stable ordering và seek pagination ở quy mô lớn.

5. **normalization-denormalization** — Model invariant và denormalization cost.

6. **transactions-mvcc-deadlocks** — MVCC, anomalies, locks và deadlock.

7. **composite-covering-index-explain** — Index theo workload.

8. **database-query-plan** — EXPLAIN, statistics và estimates.

9. **database-slow-api-investigation** — Điều tra slow API từ budget đến query evidence.

10. **database-connection-pool-capacity** — Pool sizing theo concurrency, hold time và database budget.

11. **database-engine-tradeoffs** — MySQL, PostgreSQL và Oracle trade-offs.

12. **postgresql-mvcc-vacuum-bloat** — Tuple versions, VACUUM, freeze và bloat.

13. **postgresql-planner-statistics** — Statistics, cardinality estimate và planner diagnosis.

14. **postgresql-index-types-jsonb** — B-tree, GIN, GiST, BRIN và JSONB access paths.

15. **postgresql-partitioning-operations** — Partition pruning, lifecycle và operational trade-offs.

16. **mysql-innodb-clustered-secondary-indexes** — Clustered primary key và secondary lookup trong InnoDB.

17. **mysql-innodb-locks-replication** — Isolation, next-key locks và replication safety.

18. **oracle-undo-read-consistency-optimizer** — Undo, read consistency và execution plan trong Oracle.

19. **database-replication-sharding-decisions** — Chọn replica, partition hay shard theo bottleneck.

20. **spring-jpa-persistence-context** — ORM unit of work với transaction.

21. **spring-jpa-fetching-batching-locking** — Access shape, locking và batching.

22. **jpa-n-plus-one** — Round-trip/cardinality regression.

23. **spring-postgresql-production-boundary** — Pool, timeout, DDL và observability.

24. **mongodb-document-model** — Document access patterns.

25. **mongodb-indexes-aggregation-performance** — Index, aggregation pipeline và explain evidence.

26. **mongodb-replica-set-consistency-transactions** — Replica set, read/write concern và transaction boundary.

27. **mongodb-sharding-schema-operations** — Shard key, balancing và schema operations.

28. **redis-data-structures-expiration** — In-memory data và expiry.

29. **redis-cache-aside** — Cache là bản sao có consistency contract.

30. **redis-cache-consistency-stampede** — Invalidation, stampede và degraded cache behavior.

31. **redis-persistence-ha-cluster** — Persistence, replication, Sentinel và Cluster trade-offs.

32. **redis-streams-pubsub** — Streams, consumer groups và Pub/Sub delivery semantics.

33. **redis-distributed-locks-leases-redlock** — Lease, ownership token, fencing và Redlock trade-offs.

34. **sql-nosql-data-model-decision** — Chọn relational, document hay key-value theo invariants.
