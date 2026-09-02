---
id: sql-logical-processing-joins
slug: sql-logical-processing-and-joins
title: SQL Logical Processing, JOIN và NULL
description: Đọc SELECT theo thứ tự xử lý logic, chọn đúng JOIN và tránh các lỗi NULL làm sai kết quả trước khi tối ưu hiệu năng.
category: database
technology: SQL / PostgreSQL / MySQL / Oracle
level: beginner
estimatedMinutes: 42
tags: ["sql","join","null","aggregation","query-model"]
prerequisites: ["relational-database"]
related: ["sql-cte-window-analytics","database-query-plan"]
next: sql-cte-window-analytics
learningObjectives: ["Mô phỏng thứ tự xử lý logic của SELECT","Phân biệt INNER, OUTER và semi-join theo cardinality","Xử lý NULL và aggregation mà không làm sai nghĩa truy vấn"]
lastReviewed: 2026-09-02
sources: [{"title":"PostgreSQL Table Expressions","url":"https://www.postgresql.org/docs/current/queries-table-expressions.html","organization":"PostgreSQL Global Development Group","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"MySQL SELECT Statement Optimization","url":"https://dev.mysql.com/doc/refman/8.4/en/select-optimization.html","organization":"Oracle MySQL","type":"official-documentation","accessedAt":"2026-09-02"},{"title":"Oracle SQL Language Reference - SELECT","url":"https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html","organization":"Oracle","type":"official-documentation","accessedAt":"2026-09-02"}]
---
## Mental model: SQL mô tả kết quả, không mô tả vòng lặp
SQL là declarative: ta mô tả tập kết quả mong muốn, còn optimizer chọn access path, join order và join algorithm. Thứ tự câu chữ `SELECT ... FROM ... WHERE ...` không phải thứ tự xử lý logic. Một mô hình hữu ích là `FROM/JOIN` tạo tập row, `WHERE` lọc row, `GROUP BY` tạo group, `HAVING` lọc group, `SELECT` tạo projection, `DISTINCT` loại trùng, rồi `ORDER BY` và giới hạn kết quả.

Mô hình này giải thích vì sao alias định nghĩa trong `SELECT` thường chưa dùng được trong `WHERE`, và vì sao filter đặt trong `ON` hay `WHERE` có thể làm một `LEFT JOIN` đổi nghĩa.

```sql title="Thứ tự logic của một báo cáo"
SELECT d.name, COUNT(e.id) AS active_count
FROM departments d
LEFT JOIN employees e
  ON e.department_id = d.id
 AND e.status = 'ACTIVE'
WHERE d.archived = false
GROUP BY d.id, d.name
HAVING COUNT(e.id) >= 5
ORDER BY active_count DESC;
```

Ở đây điều kiện trạng thái nằm trong `ON`, vì ta vẫn muốn giữ department không có employee active. Nếu chuyển `e.status = 'ACTIVE'` xuống `WHERE`, row có phía phải là `NULL` bị loại và truy vấn hành xử gần như `INNER JOIN`.

## JOIN là phép nhân cardinality có điều kiện
`INNER JOIN` chỉ giữ cặp row khớp. `LEFT JOIN` giữ mọi row bên trái và điền `NULL` khi không khớp. `FULL OUTER JOIN` giữ cả hai phía nhưng mức hỗ trợ/cú pháp khác nhau giữa engine; MySQL không có toán tử `FULL OUTER JOIN` trực tiếp. `CROSS JOIN` tạo tích Descartes và chỉ nên dùng khi đó thật sự là ý định.

Một row cha có ba row con thì join tạo ba row cha logic. Nếu join tiếp collection thứ hai có bốn row, có thể thành mười hai row trước aggregation. Đây là nguyên nhân phổ biến của tổng bị nhân lên, page sai và object graph phình to.

| Nhu cầu | Cấu trúc thường phù hợp | Câu hỏi kiểm tra |
|---|---|---|
| Lấy row có ít nhất một match | `EXISTS` | Có cần cột phía con không? |
| Lấy dữ liệu cả hai phía | `JOIN` | Quan hệ 1-1 hay 1-N làm tăng bao nhiêu row? |
| Giữ mọi row bên trái | `LEFT JOIN` | Filter phía phải đặt ở `ON` hay `WHERE`? |
| Tìm row không có match | `NOT EXISTS` | Có bị bẫy `NULL` của `NOT IN` không? |

```sql title="Semi-join thể hiện đúng ý định tồn tại"
SELECT c.id, c.name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
    AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
);
```

`EXISTS` không yêu cầu loại duplicate như `JOIN` rồi `DISTINCT`. Optimizer có thể biến đổi hai dạng, nhưng biểu đạt đúng cardinality giúp người đọc và thường mở ra plan tốt hơn.

## NULL là unknown, không phải empty hay zero
So sánh với `NULL` cho kết quả `UNKNOWN`, vì vậy dùng `IS NULL`/`IS NOT NULL`, không dùng `= NULL`. Trong `WHERE`, chỉ biểu thức `TRUE` được giữ; cả `FALSE` và `UNKNOWN` bị loại. `NOT IN` đặc biệt nguy hiểm nếu subquery chứa `NULL`.

```sql title="NOT EXISTS an toàn hơn khi tập con có thể có NULL"
SELECT p.id
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM discontinued_products d WHERE d.product_id = p.id
);
```

`COUNT(*)` đếm row; `COUNT(column)` bỏ qua `NULL`. `SUM` và `AVG` cũng bỏ qua `NULL`, nhưng có thể trả `NULL` nếu không có input phù hợp. Chỉ dùng `COALESCE` khi business meaning thực sự xem missing là giá trị thay thế.

## GROUP BY và lỗi "đếm sau join"
Aggregation chạy trên tập row sau join/filter. Nếu cần hai aggregate độc lập trên hai collection, hãy aggregate từng phía trong subquery/CTE trước rồi join kết quả.

```sql title="Pre-aggregate để tránh fan-out"
WITH order_totals AS (
  SELECT customer_id, SUM(total_amount) AS revenue
  FROM orders
  GROUP BY customer_id
), ticket_totals AS (
  SELECT customer_id, COUNT(*) AS tickets
  FROM support_tickets
  GROUP BY customer_id
)
SELECT c.id,
       COALESCE(o.revenue, 0) AS revenue,
       COALESCE(t.tickets, 0) AS tickets
FROM customers c
LEFT JOIN order_totals o ON o.customer_id = c.id
LEFT JOIN ticket_totals t ON t.customer_id = c.id;
```

## Failure scenarios thường gặp
- `LEFT JOIN` vô tình thành inner join do filter phía phải trong `WHERE`.
- `JOIN` 1-N làm duplicate entity rồi dùng `DISTINCT` để che lỗi cardinality.
- `NOT IN (subquery)` trả rỗng vì subquery có một `NULL`.
- Page bằng `LIMIT/OFFSET` nhưng thiếu `ORDER BY` ổn định, khiến row nhảy giữa lần gọi.
- So sánh timestamp theo timezone/application conversion không nhất quán.

:::production Checklist trước khi đưa query vào production
Viết ra grain của mỗi row đầu ra; dự đoán cardinality sau từng join; kiểm tra data có NULL/duplicate/skew; dùng deterministic ordering khi paginate; chạy với dữ liệu có kích thước và phân bố gần production; đọc actual plan thay vì kết luận từ query text.
:::

## Góc phỏng vấn
Một câu trả lời tốt cho "JOIN hoạt động thế nào?" tách ba lớp: relational meaning, logical cardinality và physical algorithm. `INNER/LEFT/EXISTS` nói về kết quả; nested loop/hash/merge join là lựa chọn vật lý; index và statistics ảnh hưởng lựa chọn nhưng không đổi nghĩa SQL.

## Key Takeaways
- Hiểu logical order trước khi tối ưu physical plan.
- JOIN có thể nhân row; luôn xác định grain và cardinality.
- `NULL` tuân theo three-valued logic.
- `EXISTS`/`NOT EXISTS` thường biểu đạt đúng bài toán existence.
- Correctness của query phải được chứng minh bằng edge case trước benchmark.
