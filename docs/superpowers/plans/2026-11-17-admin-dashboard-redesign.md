# Tái Cấu Trúc Bảng Quản Trị Tạp Hóa 36 (Admin Dashboard Redesign & ACL) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng lại hoàn chỉnh giao diện và logic quản trị `admin.html` cho thương hiệu **Tạp Hóa 36** theo tone màu **Pastel Hồng (Soft Rose / Blush Pink)** thanh lịch, trạng thái dữ liệu trắng sạch 100% (Pure Empty State), tích hợp phân hệ **ACL (Access Control List) & Quản lý Tài khoản (Account)** đa cấp độ, menu điều hướng ngang chuyên nghiệp với nút Bán hàng POS màu trắng viền hồng, và Modal Cài Đặt tập trung.

**Architecture:** Áp dụng kiến trúc **Single-Page Application (SPA) Phân vùng Module** trên `admin.html`. 8 phân hệ chức năng (`Tổng quan`, `Hàng hóa`, `Mua hàng`, `Đơn hàng`, `Khách hàng`, `Sổ quỹ`, `Báo cáo`, `ACL & Tài khoản`) chuyển đổi mượt mà bằng JavaScript mà không tải lại trang. Dữ liệu tài khoản và ma trận phân quyền được lưu trữ bền vững qua `localStorage`, tích hợp với Single Source of Truth `TapHoaSoDB` (IndexedDB) và `shared/core.js`.

**Tech Stack:** HTML5 Semantic, Tailwind CSS CDN, CSS Custom Properties (Pastel Palette), Vanilla JavaScript ES6+, Web Crypto API (AES-GCM), IndexedDB / LocalStorage, BroadcastChannel.

**Spec:** [docs/superpowers/specs/2026-11-17-admin-dashboard-redesign-design.md](file:///d:/download/LAP%20TRINH%20WEB/docs/superpowers/specs/2026-11-17-admin-dashboard-redesign-design.md)

## Global Constraints

- **Thương hiệu:** Bắt buộc hiển thị tên **"Tạp Hóa 36"** trên thanh tiêu đề và thương hiệu cửa hàng.
- **Tone màu chủ đạo:** Bắt buộc là **Pastel Hồng (Soft Rose / Blush Pink)** (`#fff5f7`, `#fce7f3`, viền `#fbcfe8`), chữ xám than dễ đọc, không dùng màu xanh KiotViet `#0070e0`.
- **Nút POS:** Nút **`[🛒 Bán hàng]`** trên thanh menu bắt buộc là **nền trắng**, viền hồng pastel, click mở `pos.html`.
- **Dữ liệu sạch:** Tuyệt đối không chứa bất kỳ dữ liệu rác/bịa đặt nào ("Chào Cô Ba", "Bác Bảy", "31 Ung Văn Khiêm", "1900 6522"). Khởi đầu với kho hàng 0 sản phẩm và có Empty State lịch sự.
- **Phân quyền ACL:** Bắt buộc có bảng tài khoản nhân viên (4 vai trò: Chủ tiệm, Quản lý, Thu ngân, Thủ kho), ma trận phân quyền chi tiết, đổi mật khẩu và nhật ký thao tác (Audit log). Tài khoản Master Admin mặc định: `admin` / `admin123`.
- **Chuẩn Lighthouse UTH:** Không có lỗi JavaScript trong console, mọi thẻ img/button có alt/aria-label, cấu trúc thẻ ngữ nghĩa chuẩn SEO và Accessibility.
- **Bảo toàn kiểm thử:** Duy trì 100% bài test PASS trong `tests/run_cli_tests.js`.

## Review Focus

- Nhập sai mật khẩu khi đổi mật khẩu tài khoản trong ACL: Phải báo lỗi rõ ràng và không thay đổi dữ liệu.
- Tài khoản bị tạm khóa (inactive) đăng nhập: Hệ thống phải từ chối truy cập và thông báo tài khoản bị khóa.
- Người dùng bấm nút "Xóa trắng dữ liệu": Bắt buộc hiển thị hộp thoại xác nhận gõ "XOA" trước khi thực hiện để chống mất dữ liệu ngoài ý muốn.
- Xuất file Excel / CSV khi danh sách trống: Phải xuất file có dòng tiêu đề UTF-8 BOM chuẩn mà không bị lỗi crash script.
- Responsive trên màn hình nhỏ: Thanh menu ngang chuyển đổi mượt mà sang thanh cuộn ngang hoặc menu thu gọn để không vỡ giao diện trên tablet.

---

### Task 1: Động Cơ Quản Lý Tài Khoản & Phân Quyền ACL (Data Schema & ACL Engine)

**Files:**
- Create/Modify: `shared/acl_engine.js` (Module chuyên trách ACL & Account)
- Modify: `shared/core.js` (Nhúng hoặc tích hợp ACL engine vào `TapHoaCore`)
- Modify: `tests/test_suite.js:650-750` (Thêm nhóm test case `AC-ACL` kiểm thử phân quyền)

**Interfaces:**
- Produces:
  - `TapHoaCore.acl.getAccounts(): Array<Account>`
  - `TapHoaCore.acl.saveAccount(accountData): Object`
  - `TapHoaCore.acl.deleteAccount(accountId): Boolean`
  - `TapHoaCore.acl.checkPermission(role, permissionKey): Boolean`
  - `TapHoaCore.acl.changePassword(userId, oldPass, newPass): Boolean`
  - `TapHoaCore.acl.getAuditLogs(): Array<LogEntry>`
  - `TapHoaCore.acl.addAuditLog(action, detail, performedBy): void`

- [ ] **Step 1: Viết test case tự động kiểm chứng ACL Engine trong `tests/test_suite.js`**

Thêm phân hệ kiểm thử `AC-ACL`:
1. `AC-ACL-01`: Khởi tạo tài khoản Master Admin mặc định (`admin` / `admin123` - Trần Ngọc Lâm) với toàn quyền.
2. `AC-ACL-02`: Thêm tài khoản mới và gán vai trò (`cashier`, `warehouse`, `manager`).
3. `AC-ACL-03`: Kiểm tra ma trận quyền: `cashier` không có quyền xóa sản phẩm hoặc xem lợi nhuận gộp.
4. `AC-ACL-04`: Đổi mật khẩu thành công khi nhập đúng mật khẩu cũ và từ chối khi nhập sai.
5. `AC-ACL-05`: Ghi nhận nhật ký Audit log chính xác thời gian và hành động.

- [ ] **Step 2: Chạy kiểm thử để xác nhận test FAIL**

Run: `node tests/run_cli_tests.js`
Expected: FAIL với lỗi `TapHoaCore.acl is undefined` hoặc `AC-ACL` tests fail.

- [ ] **Step 3: Triển khai `shared/acl_engine.js` và tích hợp vào `shared/core.js`**

Xây dựng module ACL Engine:
- Quản lý storage key: `taphoa36_accounts`, `taphoa36_acl_matrix`, `taphoa36_audit_logs`.
- Danh sách quyền chuẩn hóa: `view_products`, `create_product`, `edit_product`, `delete_product`, `view_orders`, `create_order`, `cancel_order`, `view_finance`, `export_reports`, `manage_users`, `store_settings`.
- Ma trận quyền mặc định cho 4 vai trò.

- [ ] **Step 4: Chạy kiểm thử để xác nhận toàn bộ test PASS**

Run: `node tests/run_cli_tests.js`
Expected: PASS toàn bộ các bài test cũ + 5 bài test mới của `AC-ACL`.

---

### Task 2: Cơ Chế Trạng Thái Trắng Sạch 100% & Quản Lý Dữ Liệu (Clean State & Data Lifecycle)

**Files:**
- Modify: `shared/core.js`
- Modify: `tests/test_suite.js`

**Interfaces:**
- Consumes: `TapHoaCore.storage`
- Produces:
  - `TapHoaCore.storage.initCleanStoreState(): Promise<void>`
  - `TapHoaCore.storage.seedSampleStoreData(): Promise<void>`
  - `TapHoaCore.storage.clearStoreData(confirmCode): Promise<Boolean>`

- [ ] **Step 1: Viết test case cho Clean State Lifecycle trong `tests/test_suite.js`**

Thêm các test case:
1. `AC-CLEAN-01`: `initCleanStoreState()` đảm bảo kho hàng bắt đầu với đúng 0 sản phẩm nếu chưa có dữ liệu.
2. `AC-CLEAN-02`: `seedSampleStoreData()` nạp 10 sản phẩm mẫu tạp hóa Việt Nam khi người dùng kích hoạt thủ công.
3. `AC-CLEAN-03`: `clearStoreData('XOA')` làm sạch toàn bộ kho hàng và đơn hàng nhưng giữ nguyên tài khoản Master Admin.

- [ ] **Step 2: Chạy kiểm thử xác nhận test FAIL**

Run: `node tests/run_cli_tests.js`
Expected: FAIL vì các hàm `initCleanStoreState`, `seedSampleStoreData` chưa có.

- [ ] **Step 3: Triển khai các hàm quản lý vòng đời dữ liệu sạch trong `shared/core.js`**

- Cập nhật hàm khởi tạo để không tự động nạp ép buộc 30 sản phẩm nếu người dùng đã chọn Pure Empty State.
- Cung cấp hàm nạp mẫu 10 sản phẩm UTH phổ thông khi cần.

- [ ] **Step 4: Chạy kiểm thử xác nhận PASS**

Run: `node tests/run_cli_tests.js`
Expected: PASS toàn bộ.

---

### Task 3: Tái Cấu Trúc Giao Diện `admin.html` Với Hệ Màu Pastel Hồng & Menu Ngang

**Files:**
- Modify: `admin.html` (Viết lại giao diện hoàn chỉnh theo tone Pastel Hồng)
- Test: `tests/verify_ui.js`

**Interfaces:**
- Consumes: `TapHoaCore` từ `shared/core.js`, `TapHoaCore.acl` từ `shared/acl_engine.js`
- Produces:
  - Giao diện Pastel Hồng: CSS classes `bg-rose-50`, `border-rose-100`, `text-rose-600`, `bg-white`, v.v.
  - Cấu trúc thanh điều hướng: Top Bar (`#top-bar`), Horizontal Menu (`#admin-navbar`), White POS Button (`#btn-pos-switcher`).
  - 8 Phân hệ Views: `#view-overview`, `#view-products`, `#view-purchases`, `#view-orders`, `#view-customers`, `#view-cashflow`, `#view-reports`, `#view-acl`.
  - Hàm điều hướng: `window.switchAdminView(viewName)`.

- [ ] **Step 1: Cập nhật kịch bản kiểm tra giao diện `tests/verify_ui.js`**

Kiểm tra:
1. Sự tồn tại của thương hiệu "Tạp Hóa 36".
2. Sự tồn tại của nút Bán hàng POS màu trắng (`#btn-pos-switcher`).
3. Sự tồn tại của 8 views phân hệ chuẩn.
4. Không còn chứa các chuỗi văn bản rác: "Chào Cô Ba", "Bác Bảy", "31 Ung Văn Khiêm", "1900 6522".

- [ ] **Step 2: Chạy kiểm thử giao diện để xác nhận FAIL**

Run: `node tests/verify_ui.js`
Expected: FAIL do các thành phần và text cũ đang hiện diện.

- [ ] **Step 3: Viết lại cấu trúc giao diện `admin.html` hoàn chỉnh**

Thực hiện:
1. Header & Top Bar: Logo Tạp Hóa 36 pastel, badge Online/Offline, chuông thông báo, nút Settings ⚙️, thông tin người dùng "Trần Ngọc Lâm (Chủ tiệm)".
2. Thanh menu ngang Pastel Hồng: 8 danh mục chính kèm Mega Dropdowns thanh nhã, nút `[🛒 Bán hàng (F1)]` màu trắng viền hồng nổi bật ở góc phải.
3. 8 Section Views với trạng thái Empty State tinh tế khi chưa có dữ liệu.
4. Định nghĩa biến CSS Pastel Hồng và Tailwind utility classes tối ưu.

- [ ] **Step 4: Chạy kiểm thử giao diện để xác nhận PASS**

Run: `node tests/verify_ui.js`
Expected: PASS 100%.

---

### Task 4: Hiện Thực Hóa Phân Hệ ACL & Quản Lý Tài Khoản Trên Giao Diện

**Files:**
- Modify: `admin.html` (Thêm view `#view-acl` và các Modal tương tác)

**Interfaces:**
- Consumes: `TapHoaCore.acl`
- Produces:
  - Bảng danh sách tài khoản `#table-users` với badge vai trò màu sắc pastel.
  - Modal Thêm / Chỉnh sửa tài khoản `#modal-user-form`.
  - Modal Ma trận phân quyền ACL `#modal-acl-matrix`.
  - Modal Đổi mật khẩu cá nhân `#modal-change-password`.
  - Bảng Nhật ký hoạt động `#table-audit-logs`.

- [ ] **Step 1: Viết hàm JavaScript render và tương tác cho View ACL trong `admin.html`**

Các hàm xử lý:
- `renderUserTable()`: Đổ danh sách tài khoản vào bảng.
- `openUserModal(userId)`: Mở form thêm/sửa tài khoản.
- `saveUserFromForm()`: Lưu tài khoản và phân quyền vào `TapHoaCore.acl`.
- `openPasswordModal()`: Mở modal đổi mật khẩu cá nhân.
- `renderAuditLogs()`: Đổ danh sách nhật ký hoạt động.

- [ ] **Step 2: Kiểm tra tương tác tạo mới tài khoản và phân quyền qua script test**

Run: Kiểm tra luồng thêm tài khoản mới và đổi vai trò bằng node runner.
Expected: Tài khoản được lưu bền vững vào `localStorage` key `taphoa36_accounts`.

---

### Task 5: Modal Cài Đặt Tập Trung & Kiểm Tra Chuẩn Lighthouse (Settings & Final Verification)

**Files:**
- Modify: `admin.html` (Modal `#modal-settings` với 4 tab: Cửa hàng, Máy in K80, VietQR, Sao lưu)
- Modify: `grocery-app/admin.html` (Đồng bộ bản hoàn thiện sang thư mục ứng dụng)
- Test: Toàn bộ bộ test `tests/run_cli_tests.js` và `tests/verify_ui.js`

**Interfaces:**
- Produces:
  - Modal Cài đặt ⚙️ tập trung 4 nhóm cấu hình.
  - Nút Sao lưu mã hóa AES-GCM và phục hồi file JSON.
  - Nút Nạp 10 sản phẩm mẫu UTH và nút Xóa trắng dữ liệu.
  - Toàn bộ mã nguồn đạt chuẩn Google Lighthouse của ThS. Trần Thịnh Mạnh Đức.

- [ ] **Step 1: Xây dựng Modal Cài Đặt `#modal-settings` trong `admin.html`**

Bao gồm 4 tabs cấu hình:
1. *Thông tin tiệm:* Tên tiệm ("Tạp Hóa 36"), Địa chỉ, Hotline, Lời chúc hóa đơn.
2. *Máy in & K80:* Khổ giấy 80mm, in mã vạch, in logo.
3. *Thanh toán VietQR:* Ngân hàng thụ hưởng, số tài khoản.
4. *Dữ liệu & Sao lưu:* Tải bản sao lưu mã hóa AES-GCM, nạp mẫu 10 sản phẩm UTH, xóa trắng kho.

- [ ] **Step 2: Chạy kiểm thử tự động toàn diện**

Run: `node tests/run_cli_tests.js`
Expected: 44/44 test PASS (hoặc 100% PASS không lỗi).

- [ ] **Step 3: Chạy kiểm thử giao diện `tests/verify_ui.js`**

Run: `node tests/verify_ui.js`
Expected: PASS toàn bộ tiêu chí về giao diện sạch, tone Pastel Hồng, thương hiệu Tạp Hóa 36 và không có dữ liệu rác.

- [ ] **Step 4: Đồng bộ mã nguồn hoàn thiện vào `grocery-app/admin.html`**
