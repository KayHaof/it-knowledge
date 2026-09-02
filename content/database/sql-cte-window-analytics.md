---
id: sql-cte-window-analytics
slug: sql-subquery-cte-window-functions
title: Subquery, CTE và Window Functions
description: Chọn subquery, CTE hay window function theo grain dữ liệu; xây truy vấn phân tích rõ ràng mà không làm mất row.
category: database
technology: SQL / PostgreSQL / MySQL / Oracle
level: intermediate
estimatedMinutes: 48
tags: ["sql","subquery","cte","window-function","analytics"]
prerequisites: ["sql-logical-processing-joins"]
related: ["database-query-plan","composite-covering-index-explain"]
next: composite-covering-index-explain
learningObjectives: ["Phân biệt scalar, correlated và derived subquery","Dùng CTE để chia pipeline dữ liệu có kiểm soát","Chọn partition, order và frame đúng cho window function"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL WITH Queries","url":"https://www.postgresql.org/docs/current/queries-with.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"PostgreSQL Window Functions","url":"https://www.postgresql.org/docs/current/functions-window.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL Window Function Concepts","url":"https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Bắt đầu từ grain của dữ liệu
Trước khi chọn cú pháp, hãy viết một câu: "mỗi row kết quả đại diện cho gì?" Aggregation đổi nhiều row thành ít row; window function giữ nguyên số row và gắn thêm thông tin từ các row liên quan. Subquery/CTE là cách tổ chức scope, không tự động nhanh hay chậm.

## Các dạng subquery và chi phí tiềm ẩn
- Scalar subquery phải trả tối đa một giá trị cho mỗi row ngoài.
- Derived table trong `FROM` tạo một relation trung gian logic.
- Correlated subquery tham chiếu row ngoài; optimizer có thể decorrelate thành join, nhưng không nên giả định.
- `EXISTS`/`NOT EXISTS` biểu diễn semi-join/anti-join và có thể dừng khi biết kết quả tồn tại.

```sql title="Correlated subquery đúng nghĩa nhưng cần đọc plan"
SELECT e.id, e.salary,
       (SELECT AVG(x.salary)
        FROM employees x
        WHERE x.department_id = e.department_id) AS department_avg
FROM employees e;
```

Với dữ liệu lớn, window function diễn đạt phép tính này trực tiếp và chỉ giữ một logical scan:

```sql title="Window aggregate giữ nguyên từng employee"
SELECT id, department_id, salary,
       AVG(salary) OVER (PARTITION BY department_id) AS department_avg
FROM employees;
```

Đừng kết luận "window luôn nhanh hơn". Sort, partition size, memory grant và spill quyết định chi phí thật.

## CTE là tên cho một bước biến đổi
Non-recursive CTE giúp tách pipeline thành các relation có tên. Tùy engine/version và tùy chỉ dẫn, optimizer có thể inline hoặc materialize CTE. Vì vậy CTE không phải optimization fence phổ quát, cũng không phải temporary table có index.

```sql title="Pipeline cohort rõ grain"
WITH paid_orders AS (
  SELECT customer_id, created_at, total_amount
  FROM orders
  WHERE status = 'PAID'
), customer_month AS (
  SELECT customer_id,
         DATE_TRUNC('month', created_at) AS month,
         SUM(total_amount) AS revenue
  FROM paid_orders
  GROUP BY customer_id, DATE_TRUNC('month', created_at)
)
SELECT customer_id, month, revenue,
       SUM(revenue) OVER (
         PARTITION BY customer_id
         ORDER BY month
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS lifetime_revenue
FROM customer_month;
```

`DATE_TRUNC` là cú pháp PostgreSQL; MySQL/Oracle có hàm tương ứng khác. Hãy cô lập vendor-specific SQL và test dialect thay vì quảng cáo mọi SQL là portable.

## Recursive CTE: traversal có điểm dừng
Recursive CTE có anchor member và recursive member. Nó phù hợp hierarchy, graph traversal có giới hạn và sinh chuỗi; cần chống cycle và kiểm soát depth.

```sql title="Duyệt cây category có giới hạn"
WITH RECURSIVE tree AS (
  SELECT id, parent_id, name, 0 AS depth
  FROM categories
  WHERE id = :root_id
  UNION ALL
  SELECT c.id, c.parent_id, c.name, t.depth + 1
  FROM categories c
  JOIN tree t ON c.parent_id = t.id
  WHERE t.depth < 20
)
SELECT * FROM tree;
```

Với graph có cycle, depth limit chỉ giảm thiệt hại chứ không chứng minh đúng. Cần lưu path/visited set theo khả năng của engine hoặc enforce cấu trúc cây bằng constraint/application rule.

## Window gồm partition, order và frame
`PARTITION BY` chia tập row độc lập. `ORDER BY` trong `OVER` định nghĩa thứ tự tính, không đảm bảo thứ tự output cuối. Frame xác định hàng nào quanh current row tham gia phép tính.

| Hàm | Dùng cho | Bẫy chính |
|---|---|---|
| `ROW_NUMBER` | một thứ tự duy nhất | tie cần cột order ổn định |
| `RANK` | đồng hạng có khoảng trống | không giống `DENSE_RANK` |
| `LAG`/`LEAD` | so với row trước/sau | "trước" phụ thuộc `ORDER BY` |
| running `SUM` | số lũy kế | default frame có thể gom peer rows |
| `FIRST_VALUE`/`LAST_VALUE` | biên frame | `LAST_VALUE` thường bất ngờ với default frame |

```sql title="Top 3 mỗi nhóm với tie-break ổn định"
WITH ranked AS (
  SELECT p.*,
         ROW_NUMBER() OVER (
           PARTITION BY category_id
           ORDER BY revenue DESC, id ASC
         ) AS position
  FROM products p
)
SELECT * FROM ranked WHERE position <= 3;
```

Filter window result cần một lớp query bên ngoài vì window chạy sau `WHERE` của cùng query block. Một số dialect có `QUALIFY`, nhưng không phải lựa chọn portable.

## Performance và failure scenarios
- Partition cực lớn hoặc sort thiếu index làm spill ra disk.
- CTE được tham chiếu nhiều lần có thể bị tính lại hoặc materialize lớn, tùy engine.
- Correlated subquery chạy theo từng row nếu optimizer không decorrelate.
- Recursive CTE không có cycle protection làm tăng CPU/memory cho tới giới hạn engine.
- Running total sai vì dùng default `RANGE` thay vì frame `ROWS` rõ ràng.

:::production Quy trình kiểm chứng
Giữ query đúng và dễ đọc trước; so sánh estimated với actual rows; quan sát sort/hash spill, temp I/O và memory; test tie, NULL, partition rỗng/lớn; benchmark với warm/cold cache có ghi rõ; không biến CTE thành mẹo tối ưu dựa trên truyền miệng.
:::

## Góc phỏng vấn
"Window function khác GROUP BY thế nào?" — `GROUP BY` collapse các row thành group; window function tính trên một cửa sổ nhưng vẫn trả mỗi input row. Cần nói thêm `PARTITION`, `ORDER`, `frame` và nguy cơ sort/spill để câu trả lời đạt production level.

## Key Takeaways
- Grain quyết định dùng aggregation hay window.
- CTE là công cụ tổ chức query; materialization phụ thuộc engine và plan.
- Window `ORDER BY` không thay cho output `ORDER BY`.
- Khai báo frame rõ khi semantics phụ thuộc row lũy kế.
- Actual plan mới xác nhận optimizer đã biến đổi subquery như kỳ vọng.
