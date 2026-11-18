# Design Spec: Tạp Hóa 36 - Kiến Trúc Full-Stack REST API, Khắc Phục Giao Diện & Báo Cáo Tiến Độ (UTH)

- **Ngày ban hành:** 18/11/2026
- **Tác giả:** Antigravity Engineering & Nhóm sinh viên Tạp Hóa 36 (Trần Ngọc Lâm - MSSV: 034206001749)
- **Môn học:** Lập Trình Web - Trường Đại học Giao Thông Vận Tải TP.HCM (UTH)
- **Trạng thái:** Chờ phê duyệt (Pending Approval)

---

## 1. Bối cảnh & Mục tiêu (Intent & The Why)

Theo yêu cầu nộp bài báo cáo tiến độ môn học, nhóm sinh viên phải chứng minh website đã hoàn thiện các chức năng chính, Front-end có thể giao tiếp hai chiều với Back-end và lưu trữ dữ liệu vào Database, kèm bài thuyết trình Slide (7-10 slides) và clip quay demo minh chứng (7-10 phút).

Đồng thời trên giao diện thực tế của dự án, người dùng đã phát hiện 2 điểm cần giải quyết dứt điểm:
1. **Lỗi menu thanh màu hồng (Ảnh 2):** Khi click vào các tab "Hàng hóa", "Mua hàng", "Đơn hàng", "Khách hàng", "Báo cáo" trên thanh navbar hồng, các mục menu không hiển thị ra do thuộc tính CSS `overflow-x-auto` trên khung chứa đã cắt xén (`clip`) toàn bộ các dropdown menu con rơi xuống theo chiều dọc.
2. **Quản lý chi nhánh & kho hàng (Ảnh 1):** Xóa bỏ các kho mẫu demo fix cứng (KhoDC-UVK, TM01, TM03, TM04). Cập nhật địa chỉ cơ sở chính thành **Trường Đại học Giao Thông Vận Tải TP.HCM - UTH (Số 2 Võ Oanh / 31 Ung Văn Khiêm, P. 25, Q. Bình Thạnh)**, đồng thời cung cấp tính năng **Tự tạo & Quản lý kho** (Thêm, Sửa, Xóa, Chọn kho làm việc) lưu trữ động trong hệ thống.

---

## 2. Mục tiêu, Giới hạn & Chống mục tiêu (Goals, Non-Goals, Anti-Goals)

### 2.1. Mục tiêu (Goals)
1. **Sửa lỗi hiển thị Navbar hồng:** Gỡ bỏ vùng cắt xén `overflow-x-auto`, đảm bảo khi click hoặc hover vào bất kỳ tab nào trên thanh navbar, menu đa cột sẽ lập tức xổ xuống đẹp mắt, nổi bật với `z-index: 60`, tương tác mượt mà.
2. **Tính năng Tự Tạo Kho Động:**
   - Cơ sở mặc định duy nhất: `Cửa Hàng Chính - Tạp Hóa 36 (UTH)`.
   - Modal `+ Thêm chi nhánh / kho mới`: Nhập Tên chi nhánh, Địa chỉ, Loại hình (Cửa hàng / Kho tổng).
   - Danh sách chi nhánh lưu trữ động (`localStorage['taphoa36_custom_branches']` hoặc Back-end API), có nút chọn kích hoạt và nút xóa kho tùy ý.
3. **Cung cấp Back-end REST API chuẩn mực (`server.js`):**
   - Xây dựng Node.js REST API server siêu nhẹ hỗ trợ đầy đủ các phương thức HTTP: `GET`, `POST`, `PUT`, `DELETE`.
   - Hỗ trợ CORS, JSON payload body parser, HTTP response codes (200 OK, 201 Created, 400 Bad Request, 500 Server Error).
   - Cơ chế Dual-Mode: Front-end ưu tiên gọi API `/api/...` khi server online (hiện rõ trong Chrome DevTools Network tab), và tự động fallback sang IndexedDB/LocalStorage khi offline.
4. **Cơ sở dữ liệu & Tệp SQL minh chứng (`taphoa36_schema.sql`):**
   - Thiết kế ERD chuẩn 3NF: Bảng `categories`, `products`, `customers`, `branches`, `orders`, `order_details`, `users_acl`.
   - Có đầy đủ khóa chính (PK), khóa ngoại (FK), và dữ liệu mẫu UTH sẵn sàng nộp hoặc import vào MySQL/phpMyAdmin.
5. **Bộ Slide thuyết trình báo cáo tiến độ (8 slides) & Kịch bản quay clip demo 7-10 phút:**
   - Trình bày trực quan đáp ứng 100% barem chấm điểm của Giảng viên.

### 2.2. Giới hạn (Non-Goals)
- Không can thiệp sửa đổi các logic kiểm thử đã pass (55/55 test cases).
- Không đưa bất kỳ từ khóa nào vi phạm bản quyền thương hiệu KiotViet.

### 2.3. Chống mục tiêu (Anti-Goals)
- Tránh việc phụ thuộc cứng vào server khiến người dùng không mở được web khi không chạy terminal (nhờ cơ chế Dual-Mode an toàn).

---

## 3. Các phương án kiến trúc & Lựa chọn (Approaches)

### Phương án A (Được chọn): Full-Stack REST API Node.js + Dual Mode Bridge + Dynamic Storage
- **Ưu điểm:**
  - Chạy cực nhanh bằng lệnh `node server.js` không cần cài đặt XAMPP phức tạp.
  - Sinh viên mở tab Network trong DevTools sẽ thấy rõ các request `POST /api/orders`, `POST /api/branches`, `GET /api/products` với Status `201 Created`, Headers `Content-Type: application/json` và JSON payload.
  - Nếu tắt server hoặc đem nộp file tĩnh cho thầy, cơ chế Dual-Mode tự động chuyển sang IndexedDB không bao giờ phát sinh lỗi màn hình trắng.
- **Nhược điểm:** Cần cài sẵn Node.js trên máy (máy dev đã có sẵn Node.js v20+).

### Phương án B: Thuần PHP + MySQL Server
- **Ưu điểm:** Quen thuộc với mô hình thực hành phòng máy nếu yêu cầu nộp file `.php`.
- **Nhược điểm:** Phải bật Apache & MySQL qua XAMPP mới chạy được, không thể mở trực tiếp bằng trình duyệt.

$\Rightarrow$ **Quyết định:** Chọn **Phương án A**, đồng thời cung cấp sẵn file `taphoa36_schema.sql` chuẩn MySQL để sinh viên có đầy đủ tài liệu nộp theo cả 2 hình thức nếu cần.

---

## 4. Chi tiết Thiết Kế Kỹ Thuật (Technical Design)

### 4.1. Khắc phục lỗi CSS Navbar Thanh Hồng
- **Vị trí:** `#admin-navbar` trong `admin.html`.
- **Nguyên nhân:** Khung chứa `.flex.items-center.overflow-x-auto` chứa các button menu đã cắt xén các dropdown menu con `position: absolute; left: 0; mt-1`.
- **Giải pháp:**
  - Chuyển `overflow-x-auto` thành `overflow-visible` trên màn hình desktop.
  - Bổ sung cấu trúc định vị `relative` cho từng `.nav-item` và gán `z-index: 60` cho `.nav-dropdown.is-pinned` và `.nav-item:hover .nav-dropdown`.
  - Giữ nguyên sự kiện `toggleNavDropdown(menuId, event)` và `closeAllNavDropdowns()` đảm bảo click để ghim mở và click ngoài / Esc để đóng.

### 4.2. Quản Lý Chi Nhánh Động (Dynamic Branch Manager)
- **Cấu trúc dữ liệu chi nhánh:**
  ```json
  [
    {
      "id": "branch_main",
      "name": "Cửa Hàng Chính - Tạp Hóa 36",
      "address": "Trường ĐH Giao Thông Vận Tải TP.HCM - UTH (31 Ung Văn Khiêm, P. 25, Bình Thạnh)",
      "type": "main",
      "phone": "1900 6522",
      "isDefault": true
    }
  ]
  ```
- **Modal quản lý chi nhánh (`modal-branch-manager`):**
  - Hiển thị danh sách các kho/chi nhánh hiện có kèm nút "Chọn làm việc" và nút "Xóa" (cho các kho người dùng tự tạo).
  - Nút "+ Thêm chi nhánh mới" mở form nhập Tên, Địa chỉ, Loại hình.
  - Lưu trữ động vào `localStorage['taphoa36_custom_branches']` và đồng bộ qua API `POST /api/branches` nếu server online.

### 4.3. Kiến Trúc Back-end Node.js REST API (`server.js`)
- **Port:** `3600` (http://localhost:3600)
- **Endpoints:**
  - `GET /api/health`: Kiểm tra trạng thái máy chủ (Healthcheck).
  - `GET /api/products`: Trả về danh sách hàng hóa trong kho.
  - `POST /api/products`: Thêm mới sản phẩm (Validate barcode, name, price, stock).
  - `PUT /api/products/:id`: Cập nhật thông tin / tồn kho sản phẩm.
  - `DELETE /api/products/:id`: Xóa sản phẩm.
  - `GET /api/orders`: Lấy lịch sử đơn hàng bán ra.
  - `POST /api/orders`: Nhận đơn hàng mới từ POS hoặc Store online, trừ tồn kho tự động, trả về ID hóa đơn và mã VietQR.
  - `GET /api/branches`: Lấy danh sách chi nhánh hoạt động.
  - `POST /api/branches`: Thêm chi nhánh mới do người dùng tự tạo.
  - `DELETE /api/branches/:id`: Xóa chi nhánh tự tạo.

### 4.4. Cơ Sở Dữ Liệu SQL & Mô Hình ERD (`taphoa36_schema.sql`)
1. **Bảng `branches`**: `branch_id` (PK), `branch_name`, `address`, `phone`, `type`, `created_at`.
2. **Bảng `categories`**: `category_id` (PK), `category_name`, `description`.
3. **Bảng `products`**: `product_id` (PK), `barcode`, `product_name`, `category_id` (FK), `unit`, `cost_price`, `selling_price`, `stock_quantity`, `expiry_date`.
4. **Bảng `customers`**: `customer_id` (PK), `customer_name`, `phone`, `debt_amount`, `customer_group`.
5. **Bảng `orders`**: `order_id` (PK), `order_code`, `created_at`, `branch_id` (FK), `cashier_username`, `total_amount`, `payment_method`, `status`.
6. **Bảng `order_details`**: `order_detail_id` (PK), `order_id` (FK), `product_id` (FK), `quantity`, `unit_price`, `subtotal`.
7. **Bảng `users_acl`**: `user_id` (PK), `username`, `password_hash`, `full_name`, `role`, `status`.

---

## 5. Cấu Trúc Slide Báo Cáo Tiến Độ (8 Trang Chuẩn Barem UTH)

- **Slide 1:** Trang bìa đề tài: HỆ SINH THÁI QUẢN LÝ BÁN LẺ VÀ ĐI CHỢ ONLINE TẠP HÓA 36 (UTH).
- **Slide 2:** Sơ đồ kiến trúc 3 tầng: Front-end $\leftrightarrow$ REST API Server $\leftrightarrow$ Database (IndexedDB & SQL).
- **Slide 3:** Ma trận chức năng: 10 phân hệ đã hoàn thành 100% (POS, Store, Admin, VietQR, AI, ACL, Sync...).
- **Slide 4:** Giao diện các trang chính: Màn hình Bán hàng POS (`pos.html`), Chợ Online (`store.html`), Dashboard Bento Grid (`admin.html`).
- **Slide 5:** Cơ chế giao tiếp Client $\rightarrow$ Server: Minh họa lệnh `fetch()` gửi phương thức POST/GET, Request Headers, và JSON Payload.
- **Slide 6:** Quy trình xử lý phía Back-end: Nhận Request $\rightarrow$ Kiểm tra quyền & tồn kho $\rightarrow$ Ghi Database $\rightarrow$ Trả kết quả JSON HTTP 201/200.
- **Slide 7:** Thiết kế Cơ sở dữ liệu: Sơ đồ thực thể quan hệ ERD, các bảng, khóa chính, khóa ngoại.
- **Slide 8:** Kịch bản Demo thực hành quay video:
  - *Demo 1:* Bán hàng POS tạo đơn $\rightarrow$ Gửi POST $\rightarrow$ Lưu Database $\rightarrow$ In bill K80.
  - *Demo 2:* Tự tạo chi nhánh mới & Quản lý kho hàng trong Admin $\rightarrow$ Chứng minh dữ liệu thực lưu trong Database.

---

## 6. Kế Hoạch Triển Khai

1. Sửa CSS navbar và dropdown trên `admin.html` (khắc phục lỗi không hiện menu).
2. Tích hợp tính năng Tự tạo chi nhánh động và cập nhật địa chỉ cơ sở chính UTH trên `admin.html`.
3. Xây dựng Back-end server `server.js` (Node.js REST API) và tệp `taphoa36_schema.sql`.
4. Cập nhật cầu nối `shared/core.js` hỗ trợ Dual-Mode (Fetch API + Local fallback).
5. Soạn thảo tài liệu Slide báo cáo tiến độ chuẩn Markdown/HTML sẵn sàng import vào Canva.
6. Chạy kiểm thử toàn bộ `run_cli_tests.js` và `verify_ui.js` đảm bảo 100% PASS, đồng bộ sang `grocery-app/`.
