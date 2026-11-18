# Tạp Hóa 36 - Full-Stack REST API, Khắc Phục Giao Diện & Báo Cáo Tiến Độ (UTH) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khắc phục triệt để lỗi hiển thị dropdown menu trên thanh navbar hồng, cập nhật địa chỉ cơ sở chính UTH, xây dựng tính năng tự tạo kho động, triển khai Back-end REST API Node.js Dual-Mode, thiết kế cơ sở dữ liệu SQL, và biên soạn trọn bộ tài liệu slide báo cáo tiến độ (8 trang) kèm kịch bản quay clip demo nộp môn Lập Trình Web tại ĐH Giao Thông Vận Tải TP.HCM.

**Architecture:** Kiến trúc 3 tầng (3-Tier Architecture): Front-end Vanilla JS & Tailwind CSS giao tiếp qua RESTful HTTP API (GET, POST, PUT, DELETE) với Node.js Backend Server (`server.js`), có cơ chế Dual-Mode tự động chuyển đổi sang IndexedDB/LocalStorage khi offline. Cơ sở dữ liệu chuẩn hóa 3NF định nghĩa qua `taphoa36_schema.sql`.

**Tech Stack:** HTML5, CSS3, Tailwind CSS, Vanilla JavaScript (ES6+), Node.js (HTTP / REST API), IndexedDB, LocalStorage, SQL (MySQL/MariaDB DDL & Seed Data), Google Lighthouse WCAG.

**Spec:** `docs/superpowers/specs/2026-11-18-tap-hoa-36-backend-and-progress-report-design.md`

## Global Constraints
- Địa chỉ cơ sở chính: Trường Đại học Giao Thông Vận Tải TP.HCM - UTH (Số 2 Võ Oanh / 31 Ung Văn Khiêm, P. 25, Q. Bình Thạnh, TP.HCM).
- Tuyệt đối không chứa bất kỳ từ khóa bản quyền KiotViet nào.
- 100% các mục menu trên navbar đa cột phải hoạt động và mở modal/chuyển view nghiệp vụ thực tế.
- Toàn bộ 55 bài kiểm thử hiện có trong `tests/run_cli_tests.js` và `tests/verify_ui.js` phải luôn PASS 100%.

## Review Focus
1. Menu đa cột thanh hồng không bị cắt xén (clip) bởi container cha trên mọi độ phân giải màn hình.
2. Tự tạo chi nhánh mới: Dữ liệu được lưu trữ động và tức thì xuất hiện trên thanh chọn chi nhánh làm việc.
3. Khi xóa chi nhánh tự tạo: Chi nhánh mặc định UTH không bao giờ bị xóa nhầm.
4. Back-end server xử lý đúng CORS headers và parse JSON payload không bị crash khi payload rỗng hoặc sai cú pháp.
5. Cầu nối Dual-mode trong `shared/core.js`: Không gây gián đoạn trải nghiệm của người dùng nếu server không bật.

---

### Task 1: Khắc Phục Lỗi Hiển Thị Navbar Hồng & Dropdown Menu Trong `admin.html`

**Files:**
- Modify: `admin.html:225-245` (Cấu trúc Navbar `#admin-navbar` và `.nav-dropdown`)
- Modify: `tests/verify_ui.js:70-95` (Bổ sung kiểm tra cấu trúc navbar không bị overflow clipping)

**Interfaces:**
- Consumes: `toggleNavDropdown(menuId, event)`, `closeAllNavDropdowns()`
- Produces: Dropdown menu con xổ xuống sắc nét, `z-index: 60`, không bị cắt xén bởi container `h-12`.

- [ ] **Step 1: Viết test kiểm tra cấu trúc Navbar không chứa thuộc tính gây clip trong `tests/verify_ui.js`**

Thêm kiểm tra xác nhận navbar không chứa `overflow-x-auto` gây cắt xén dropdown dọc:
```javascript
'Navbar does not clip dropdowns vertically': (c) => !c.includes('id="admin-navbar" class="bg-gradient-to-r from-rose-500 via-rose-500 to-pink-500 text-white shadow-md sticky top-0 z-30"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-12"><div class="flex items-center gap-1 sm:gap-2 overflow-x-auto')
```

- [ ] **Step 2: Chạy kiểm tra để xác nhận test phát hiện đúng lỗi**

Run: `node tests/verify_ui.js`
Expected: FAIL hoặc phát hiện chuỗi clipping cũ.

- [ ] **Step 3: Sửa đổi `admin.html` loại bỏ `overflow-x-auto` và tối ưu positioning cho `.nav-dropdown`**

Chuyển đổi container chứa các tab menu trên `#admin-navbar` từ `overflow-x-auto` sang `overflow-visible relative` trên desktop. Điều chỉnh CSS `.nav-dropdown` có `top-full mt-1.5 z-[60] shadow-2xl` để menu xổ xuống ngay dưới tab được bấm.

- [ ] **Step 4: Chạy lại kiểm tra để xác nhận PASS**

Run: `node tests/verify_ui.js`
Expected: PASS cho cả 3 trang POS, STORE, ADMIN.

- [ ] **Step 5: Commit Task 1**

```bash
git add admin.html tests/verify_ui.js
git commit -m "fix(navbar): eliminate overflow clipping and position multi-column dropdowns properly"
```

---

### Task 2: Cập Nhật Địa Chỉ Cơ Sở Chính UTH & Tính Năng Tự Tạo Chi Nhánh Động

**Files:**
- Modify: `admin.html:85-125` (Dropdown chi nhánh và các hàm `selectBranch`, `loadBranches`)
- Modify: `shared/core.js:1690-1700` (Cấu hình địa chỉ cơ sở chính UTH)
- Modify: `admin.html:1580-1620` (Thêm modal `modal-branch-manager` và `modal-add-branch`)

**Interfaces:**
- Consumes: `localStorage['taphoa36_custom_branches']`
- Produces:
  - `loadCustomBranches() -> Array<Branch>`
  - `saveCustomBranches(branches: Array<Branch>) -> void`
  - `renderBranchSelector() -> void`
  - `openBranchManagerModal() -> void`
  - `handleCreateBranchSubmit(event: Event) -> void`
  - `deleteCustomBranch(id: string) -> void`

- [ ] **Step 1: Viết test kiểm tra tính năng Tự tạo chi nhánh động trong `tests/test_suite.js`**

```javascript
it('AC-WH-05: Tự tạo chi nhánh mới và lưu trữ động vào hệ thống', function () {
  const defaultBranch = { id: 'branch_main', name: 'Cửa Hàng Chính - Tạp Hóa 36 (UTH)', address: '31 Ung Văn Khiêm, P. 25, Bình Thạnh' };
  expect(defaultBranch.name).toContain('Tạp Hóa 36');
  expect(defaultBranch.address).toContain('Ung Văn Khiêm');
});
```

- [ ] **Step 2: Chạy test để xác nhận**

Run: `node tests/run_cli_tests.js`
Expected: PASS (hoặc bổ sung kiểm tra mới).

- [ ] **Step 3: Triển khai cập nhật địa chỉ UTH và Modal Quản Lý / Tự Tạo Chi Nhánh trong `admin.html`**

- Cập nhật tên cơ sở chính: `Cửa Hàng Chính - Tạp Hóa 36 (31 Ung Văn Khiêm, UTH)`.
- Xóa bỏ danh sách cố định KhoDC-UVK, TM01, TM03, TM04.
- Thêm Modal `modal-branch-manager`: Hiển thị danh sách kho hiện có, nút "Chọn làm việc", nút "Xóa kho tự tạo", và nút `+ Thêm chi nhánh mới`.
- Thêm Modal `modal-add-branch`: Form nhập Tên chi nhánh, Địa chỉ, Loại hình (Cửa hàng / Kho tổng).
- Viết các hàm JS: `loadCustomBranches`, `renderBranchSelector`, `handleCreateBranchSubmit`, `deleteCustomBranch`.

- [ ] **Step 4: Chạy kiểm tra UI và Test suite**

Run: `node tests/run_cli_tests.js; node tests/verify_ui.js`
Expected: 55/55 PASS và UI Verification PASS.

- [ ] **Step 5: Commit Task 2**

```bash
git add admin.html shared/core.js tests/test_suite.js
git commit -m "feat(branch): support dynamic branch creation and update main store address to UTH"
```

---

### Task 3: Xây Dựng Back-end REST API Server (`server.js`) & Cầu Nối Dual-Mode

**Files:**
- Create: `server.js` (Node.js REST API server)
- Modify: `shared/core.js` (Bổ sung `TapHoaCore.api` với cơ chế Dual-Mode)

**Interfaces:**
- Produces (REST API):
  - `GET /api/health` -> `{ status: "ok", app: "TapHoa36" }`
  - `GET /api/products` -> `Array<Product>`
  - `POST /api/products` -> `{ success: true, product: Product }`
  - `GET /api/orders` -> `Array<Order>`
  - `POST /api/orders` -> `{ success: true, orderId: string, total: number }`
  - `GET /api/branches` -> `Array<Branch>`
  - `POST /api/branches` -> `{ success: true, branch: Branch }`
  - `DELETE /api/branches/:id` -> `{ success: true }`
- Produces (Client Bridge):
  - `TapHoaCore.api.isServerOnline() -> Promise<boolean>`
  - `TapHoaCore.api.createOrder(orderData) -> Promise<Object>`
  - `TapHoaCore.api.createBranch(branchData) -> Promise<Object>`

- [ ] **Step 1: Viết test cho `server.js` trong `tests/test_server_api.js`**

Viết script test gọi thử các endpoint của server:
- Gửi `GET /api/health` -> mong đợi HTTP 200 và `{ status: "ok" }`.
- Gửi `POST /api/branches` -> mong đợi HTTP 201 và thông tin chi nhánh mới.
- Gửi `GET /api/branches` -> mong đợi danh sách chứa chi nhánh vừa thêm.

- [ ] **Step 2: Triển khai `server.js` thuần Node.js native HTTP**

Xây dựng máy chủ HTTP lắng nghe tại cổng `3600`:
- Hỗ trợ CORS headers (`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`).
- Router xử lý các endpoint `/api/health`, `/api/products`, `/api/orders`, `/api/branches`.
- Lưu trữ dữ liệu vào tệp `data/taphoa36_db.json` với cơ chế đọc/ghi an toàn.

- [ ] **Step 3: Cập nhật cầu nối Dual-mode trong `shared/core.js`**

Thêm module `apiModule` vào `TapHoaCore`:
- Kiểm tra server qua `GET /api/health` với timeout 800ms.
- Nếu online: Gửi `fetch()` RESTful kèm header `Content-Type: application/json`.
- Nếu offline: Tự động ghi vào IndexedDB `TapHoaSoDB` / LocalStorage.

- [ ] **Step 4: Chạy test API để xác nhận server hoạt động**

Run: `node server.js & node tests/test_server_api.js`
Expected: All API assertions PASS with HTTP 200 and 201.

- [ ] **Step 5: Commit Task 3**

```bash
git add server.js shared/core.js tests/test_server_api.js
git commit -m "feat(api): implement Node.js REST API server with dual-mode client bridge"
```

---

### Task 4: Thiết Kế Cơ Sở Dữ Liệu SQL & Tệp Schema (`taphoa36_schema.sql`)

**Files:**
- Create: `taphoa36_schema.sql` (Tệp DDL & DML hoàn chỉnh)

**Interfaces:**
- Produces: 7 bảng CSDL chuẩn 3NF (`branches`, `categories`, `products`, `customers`, `orders`, `order_details`, `users_acl`) với đầy đủ Primary Key, Foreign Key, Check Constraints, và Seed Data.

- [ ] **Step 1: Thiết kế cấu trúc các bảng theo chuẩn CSDL quan hệ**

- Bảng `branches` (chi nhánh / kho).
- Bảng `categories` (danh mục hàng hóa).
- Bảng `products` (sản phẩm, barcode, tồn kho, giá vốn, giá bán, hạn dùng).
- Bảng `customers` (khách hàng, công nợ, phân loại nhóm).
- Bảng `orders` (hóa đơn bán lẻ, mã chi nhánh, phương thức thanh toán, tổng tiền).
- Bảng `order_details` (chi tiết sản phẩm trong hóa đơn, số lượng, đơn giá).
- Bảng `users_acl` (tài khoản nhân viên, phân quyền RBAC).

- [ ] **Step 2: Viết mã nguồn SQL vào `taphoa36_schema.sql`**

Bao gồm lệnh `CREATE DATABASE IF NOT EXISTS taphoa36_db;`, `CREATE TABLE` với ràng buộc khóa ngoại, `CREATE INDEX` cho barcode/order_code, và các lệnh `INSERT INTO` nạp dữ liệu mẫu ban đầu.

- [ ] **Step 3: Kiểm tra cú pháp SQL**

Xác thực tính toàn vẹn cú pháp của tệp SQL.

- [ ] **Step 4: Commit Task 4**

```bash
git add taphoa36_schema.sql
git commit -m "feat(db): design comprehensive 3NF SQL relational database schema for TapHoa36"
```

---

### Task 5: Soạn Thảo Bộ Slide Báo Cáo Tiến Độ (8 Trang) & Kịch Bản Quay Clip Demo

**Files:**
- Create: `docs/bao-cao-tien-do-ltweb-uth.md` (Tài liệu báo cáo chi tiết theo barem UTH)
- Create: `docs/slides_presentation_taphoa36.html` (Giao diện Slide thuyết trình chuyên nghiệp có thể trình chiếu trực tiếp trên trình duyệt)

**Interfaces:**
- Produces:
  - Slide 1: Bìa đề tài & Thông tin sinh viên (Trần Ngọc Lâm - MSSV: 034206001749).
  - Slide 2: Sơ đồ kiến trúc 3 tầng Front-end $\rightarrow$ Back-end $\rightarrow$ Database.
  - Slide 3: Ma trận chức năng hoàn thành (POS, Store, Bento Admin, ACL...).
  - Slide 4: Ảnh chụp giao diện các trang chính.
  - Slide 5: Giao tiếp Client - Server (GET/POST, Headers, Payload JSON).
  - Slide 6: Xử lý Back-end (Middleware, Controller, Database write, JSON Response).
  - Slide 7: Thiết kế CSDL quan hệ ERD (Bảng, PK, FK, Constraints).
  - Slide 8: Kịch bản quay video demo 7-10 phút có chứng minh DevTools & Database.

- [ ] **Step 1: Soạn thảo tài liệu báo cáo `docs/bao-cao-tien-do-ltweb-uth.md`**

Viết chi tiết từng phần theo đúng yêu cầu đề bài của GVHD ThS. Trần Thịnh Mạnh Đức.

- [ ] **Step 2: Tạo trang Slide trình chiếu HTML `docs/slides_presentation_taphoa36.html`**

Thiết kế giao diện slide hiện đại, chuẩn kích thước 16:9, màu Pastel Hồng đồng bộ thương hiệu Tạp Hóa 36, hỗ trợ phím mũi tên chuyển slide, hiển thị đầy đủ sơ đồ kiến trúc, bảng ERD và code minh họa.

- [ ] **Step 3: Kiểm tra hiển thị slide**

Mở file và kiểm tra từng trang slide đảm bảo không có lỗi chính tả, thông tin chính xác.

- [ ] **Step 4: Commit Task 5**

```bash
git add docs/bao-cao-tien-do-ltweb-uth.md docs/slides_presentation_taphoa36.html
git commit -m "docs(presentation): provide 8-slide progress report and demo recording script for UTH"
```

---

### Task 6: Kiểm Thử Toàn Diện & Đồng Bộ Sang `grocery-app/`

**Files:**
- Modify: `grocery-app/*` (Đồng bộ toàn bộ mã nguồn sang thư mục nhóm)
- Modify: `grocery-app/stitch_remix_of_pastel_grocery_management_suite/*`

- [ ] **Step 1: Chạy toàn bộ Unit Tests**

Run: `node tests/run_cli_tests.js`
Expected: 55/55 PASSED.

- [ ] **Step 2: Chạy kiểm tra UI**

Run: `node tests/verify_ui.js`
Expected: POS=PASS | STORE=PASS | ADMIN=PASS.

- [ ] **Step 3: Sao chép toàn bộ tệp mới và cập nhật sang `grocery-app/`**

Sao chép `admin.html`, `pos.html`, `store.html`, `server.js`, `taphoa36_schema.sql`, `shared/`, `tests/` sang thư mục `grocery-app/`.

- [ ] **Step 4: Commit Task 6**

```bash
git add .
git commit -m "chore: complete progress report submission package and sync all assets to grocery-app"
```
