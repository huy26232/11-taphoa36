# Hệ Sinh Thái Tạp Hóa 36 - Kế Hoạch Triển Khai Toàn Diện

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện trọn bộ hệ sinh thái Tạp Hóa 36 gồm 3 phân hệ liên thông `admin.html`, `pos.html`, `store.html` theo chuẩn KiotViet Pastel Hồng, cơ chế tương tác Click-to-Pin đa cột với 100% mục menu hoạt động thực tế, tích hợp 6 nghiệp vụ quầy POS, đạt điểm tối đa theo tiêu chuẩn Google Lighthouse và sẵn sàng triển khai trên cPanel/InfinityFree.

**Architecture:** Mô hình Web 3 tầng decoupled client-side (Admin Quản trị, POS Quầy F1, Store Mua sắm online) liên thông dữ liệu qua `localStorage` và `BroadcastChannel` trong `shared/core.js`. Navbar KiotViet sử dụng kiến trúc Context Dispatcher kết hợp Modal/Drawer để giữ DOM siêu nhẹ, đảm bảo điểm hiệu năng Lighthouse > 90 và hoạt động bền vững 20–30 năm không phụ thuộc framework ngoài.

**Tech Stack:** HTML5 Semantic, CSS3 Variables + Tailwind CSS, Vanilla JavaScript (ES6+ Modules), Web Crypto API (AES-GCM), BroadcastChannel API, Google Material Symbols, VietQR API (Napas247).

**Spec:** [docs/superpowers/specs/2026-11-17-tap-hoa-36-ecosystem-design.md](file:///d:/download/LAP%20TRINH%20WEB/docs/superpowers/specs/2026-11-17-tap-hoa-36-ecosystem-design.md)

## Global Constraints

- Tone màu Pastel Hồng bắt buộc: `#fff1f2`, `#fce7f3`, `#f43f5e`, `#be123c`, nền trắng `#ffffff`, chữ than `#0f172a`.
- Tiêu chuẩn Lighthouse (Chương 4.4 UTH): FCP < 1.0s, LCP < 1.8s, CLS = 0, TBT < 100ms, 0 lỗi console, WCAG AA contrast (> 4.5:1).
- Cơ chế Click-to-Pin bắt buộc: Click vào tab thì ghim mở cố định dropdown, click lại hoặc click ra ngoài hoặc bấm `Esc` thì đóng.
- 100% mục trong menu dropdown đều phải có chức năng xử lý nghiệp vụ thực tế, không có link chết `#`.
- Thương hiệu Tạp Hóa 36 (31 Ung Văn Khiêm, Bình Thạnh - UTH), tài khoản quản lý: `Quản lý: Anh Lâm - Chủ tiệm`.
- Duy trì 100% bộ 49 unit test hiện tại (`tests/test_suite.js`) và kiểm thử giao diện (`tests/verify_ui.js`).

## Review Focus

1. **Click-to-Pin State Conflict:** Khi người dùng click tab này rồi click ngay tab khác, menu cũ phải đóng ngay lập tức và menu mới ghim mở mà không bị đè CSS hoặc giật layout.
2. **Esc Key & Backdrop Dismissal:** Bấm phím `Escape` hoặc click ra vùng tài liệu bên ngoài khi đang mở bất kỳ modal/dropdown nào phải đóng sạch sẽ mà không để lại overlay che màn hình.
3. **Cart Preservation in POS:** Khi thu ngân đang có 5 món trong giỏ F1 và bấm F3 (Kiểm date) hoặc F4 (Kết ca), giỏ hàng F1 phải được bảo toàn 100%, không bị reset.
4. **Offline & Empty State Resilience:** Khi người dùng xóa trắng kho trong Cài đặt, cả 3 trang Admin, POS, Store phải hiển thị Empty State tao nhã kèm nút nạp mẫu UTH tiện lợi, không phát sinh lỗi đọc mảng rỗng `undefined`.
5. **Real-time Stock Synchronization:** Khách đặt hàng từ `store.html` phải ngay lập tức làm giảm số lượng tồn kho khả dụng hiển thị tại quầy `pos.html` qua BroadcastChannel.

---

### Task 1: Mở rộng Lõi Nghiệp Vụ Kho & Nhà Cung Cấp trong `shared/core.js`

**Files:**
- Modify: `shared/core.js`
- Test: `tests/test_suite.js`

**Interfaces:**
- Produces:
  - `TapHoaCore.warehouse.transferStock({ fromBranch, toBranch, productId, quantity, note }) -> { success: boolean, transferId: string }`
  - `TapHoaCore.warehouse.produceCombo({ comboName, comboPrice, ingredients: [{ productId, quantity }], outputQty }) -> { success: boolean, comboId: string }`
  - `TapHoaCore.warehouse.internalUse({ productId, quantity, purpose, department }) -> { success: boolean, recordId: string }`
  - `TapHoaCore.warehouse.writeOff({ productId, quantity, reason }) -> { success: boolean, recordId: string }`
  - `TapHoaCore.suppliers.getAll() -> Array<Supplier>`
  - `TapHoaCore.suppliers.add({ name, phone, address, balance }) -> Supplier`
  - `TapHoaCore.finance.addServiceExpense({ serviceType, amount, provider, note }) -> { success: boolean, expenseId: string }`

- [ ] **Step 1: Viết test cho các hàm kho & nhà cung cấp trong `tests/test_suite.js`**
  Thêm các test case `AC-WH-01` (điều chuyển kho), `AC-WH-02` (sản xuất combo), `AC-WH-03` (xuất tiêu hao), `AC-WH-04` (xuất hủy hàng hỏng), `AC-SUPP-01` (danh bạ nhà cung cấp), `AC-EXP-01` (chi phí dịch vụ điện/nước).
- [ ] **Step 2: Chạy test để xác nhận FAIL**
  Lệnh: `node tests/run_cli_tests.js`
  Kết quả mong đợi: FAIL do các hàm warehouse/suppliers chưa được định nghĩa.
- [ ] **Step 3: Triển khai các hàm trong `shared/core.js`**
  Thêm module `warehouseModule`, `suppliersModule`, và phương thức `addServiceExpense` vào `TapHoaCore`.
- [ ] **Step 4: Chạy test xác nhận tất cả PASS**
  Lệnh: `node tests/run_cli_tests.js`
  Kết quả mong đợi: Toàn bộ 55+ test cases PASS (100%).
- [ ] **Step 5: Commit**
  ```bash
  git add shared/core.js tests/test_suite.js
  git commit -m "feat(core): add warehouse ledger, combo production, and supplier APIs"
  ```

---

### Task 2: Xây dựng Navbar KiotViet Đa Cột & Cơ Chế Click-to-Pin trong `admin.html`

**Files:**
- Modify: `admin.html`
- Test: `tests/verify_ui.js`

**Interfaces:**
- Consumes: `TapHoaCore.acl`, `TapHoaCore.auth`
- Produces: CSS classes `.nav-dropdown`, `.is-pinned`, `.nav-item.active`, JS handler `window.toggleNavDropdown(menuId, event)`

- [ ] **Step 1: Cấu trúc lại Markup Navbar KiotViet đa cột trong `admin.html`**
  - Tầng trên (Top Bar): Logo Tạp Hóa 36, hotline `1900 6522 (Kỹ thuật UTH)`, bộ chọn chi nhánh `TM02 - 31 Ung Văn Khiêm`, chuông thông báo, bánh răng Cài đặt, avatar Quản lý `Anh Lâm - Chủ tiệm`.
  - Tầng dưới (Main Nav): Nền Rose Pastel (`bg-rose-600`), gồm các tab:
    - `Tổng quan`
    - `Hàng hóa` (Dropdown 2 cột: Danh sách hàng hóa / Chuyển hàng, Sản xuất, Xuất dùng nội bộ, Xuất hủy)
    - `Mua hàng` (Dropdown 3 cột: Nhà cung cấp, Hóa đơn đầu vào / Nhập hàng, Trả hàng nhập / Mua dịch vụ)
    - `Đơn hàng` (Dropdown 2 cột: Đặt hàng, Hóa đơn, Trả hàng / Vận đơn, Quản lý giao hàng, Đối tác giao hàng)
    - `Khách hàng` (Khách hàng, Sổ nợ quen xóm)
    - `Sổ quỹ` (Thu chi tiền mặt & chuyển khoản)
    - `Báo cáo` (Bán hàng, Tài chính, Cận date)
    - `Phân quyền & ACL` (Tài khoản, Ma trận quyền)
    - Nút trắng viền hồng góc phải: `[🛒 Bán hàng (F1)]` mở `pos.html`.
- [ ] **Step 2: Cài đặt sự kiện Click-to-Pin trong JavaScript**
  - Thêm logic xử lý:
    ```javascript
    function toggleNavDropdown(menuId, event) {
      event.stopPropagation();
      const current = document.getElementById(menuId);
      const isPinned = current && current.classList.contains('is-pinned');
      // Đóng tất cả dropdown đang mở
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        d.classList.remove('is-pinned');
        d.classList.add('hidden');
      });
      // Nếu chưa ghim thì mở và ghim
      if (!isPinned && current) {
        current.classList.remove('hidden');
        current.classList.add('is-pinned');
      }
    }
    document.addEventListener('click', () => {
      document.querySelectorAll('.nav-dropdown.is-pinned').forEach(d => {
        d.classList.remove('is-pinned');
        d.classList.add('hidden');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dropdown').forEach(d => {
          d.classList.remove('is-pinned');
          d.classList.add('hidden');
        });
      }
    });
    ```
- [ ] **Step 3: Chạy kiểm tra UI**
  Lệnh: `node tests/verify_ui.js`
  Kết quả mong đợi: PASS trên ADMIN verification.
- [ ] **Step 4: Commit**
  ```bash
  git add admin.html
  git commit -m "feat(admin): implement KiotViet multi-column navbar with click-to-pin interaction"
  ```

---

### Task 3: Triển khai Modal & Chức Năng Hoạt Động Cho Từng Mục Menu trong `admin.html`

**Files:**
- Modify: `admin.html`

**Interfaces:**
- Consumes: `TapHoaCore.warehouse`, `TapHoaCore.suppliers`, `TapHoaCore.finance`, `TapHoaCore.dal`
- Produces:
  - `window.openTransferStockModal()`
  - `window.openProduceComboModal()`
  - `window.openInternalUseModal()`
  - `window.openWriteOffModal()`
  - `window.openSuppliersModal()`
  - `window.openServiceExpenseModal()`
  - `window.filterOrdersByWorkflow(type)`

- [ ] **Step 1: Viết mã HTML cho các Modal nghiệp vụ**
  Tạo template cho các hộp thoại tương tác:
  - Modal Chuyển hàng chi nhánh (`modal-transfer-stock`)
  - Modal Đóng gói combo (`modal-produce-combo`)
  - Modal Xuất dùng nội bộ tiệm (`modal-internal-use`)
  - Modal Xuất hủy hàng hỏng/hết date (`modal-write-off`)
  - Modal Danh bạ Nhà cung cấp & Công nợ (`modal-suppliers`)
  - Modal Mua dịch vụ điện/nước/mạng (`modal-service-expense`)
- [ ] **Step 2: Viết logic điều phối dữ liệu cho các modal**
  Liên kết các sự kiện submit form với `TapHoaCore` tương ứng, cập nhật số liệu kho và sổ quỹ ngay lập tức, hiển thị thông báo toast xác nhận thành công.
- [ ] **Step 3: Gắn sự kiện `onclick` cho tất cả các item trong dropdown**
  Đảm bảo mọi thẻ link/button trong dropdown đều trỏ đến hàm nghiệp vụ tương ứng, loại bỏ 100% link chết.
- [ ] **Step 4: Kiểm tra không lỗi console**
  Mở DevTools hoặc chạy script headless để kiểm tra không có lỗi cú pháp hay `ReferenceError`.
- [ ] **Step 5: Commit**
  ```bash
  git add admin.html
  git commit -m "feat(admin): wire up real operational modals and handlers for all dropdown items"
  ```

---

### Task 4: Hoàn Thiện Menu Tài Khoản & Popup Profile Quản Lý trong `admin.html`

**Files:**
- Modify: `admin.html`

**Interfaces:**
- Consumes: `TapHoaCore.acl`, `TapHoaCore.auth`
- Produces:
  - `window.toggleAccountMenu()`
  - `window.openChangePasswordModal()`
  - `window.handleLogout()`

- [ ] **Step 1: Cấu trúc popup Menu Tài khoản góc phải**
  Hiển thị avatar tròn `NL`, họ tên: `Trần Ngọc Lâm`, vai trò: `Quản lý (Chủ tiệm) - Tạp Hóa 36 (31 Ung Văn Khiêm)`.
  Các mục hành động:
  - 👤 Thông tin tài khoản
  - 🔑 Đổi mật khẩu
  - ⚙️ Cài đặt cửa hàng (mở Settings Modal: K80, VietQR, Sao lưu AES-GCM)
  - 🛡️ Phân quyền & Quản lý tài khoản (chuyển sang `view_acl`)
  - 🚪 Đăng xuất (xóa token phiên và mở modal đăng nhập)
- [ ] **Step 2: Viết logic đổi mật khẩu an toàn với ACL Engine**
  Cập nhật mật khẩu mới thông qua `TapHoaCore.acl.updatePassword(username, newPass)` có ghi lại Audit Log.
- [ ] **Step 3: Kiểm tra chuyển đổi chi nhánh**
  Gắn sự kiện cho menu Chi nhánh: chuyển đổi giữa `TM02 - 31 Ung Văn Khiêm`, `TM01 - Tiệm Trung Tâm`, `Kho Tổng UTH`, hiển thị thông báo toast chi nhánh đang làm việc.
- [ ] **Step 4: Commit**
  ```bash
  git add admin.html
  git commit -m "feat(admin): complete account profile popup and branch switching logic"
  ```

---

### Task 5: Hoàn Thiện Màn Hình POS 6-trong-1 trong `pos.html`

**Files:**
- Modify: `pos.html`
- Test: `tests/verify_ui.js`

**Interfaces:**
- Consumes: `TapHoaCore.dal`, `TapHoaCore.orders`, `TapHoaCore.sync`, `TapHoaCore.finance`
- Produces: 6 nghiệp vụ phím tắt F1–F6, giao diện Split-screen 58/42 pastel hồng.

- [ ] **Step 1: Đồng bộ thiết kế Pastel Hồng cho `pos.html`**
  Cập nhật header POS với nút quay về Admin, logo Tạp Hóa 36, badge ca làm việc, tên thu ngân/quản lý hiện tại, nút đăng xuất.
- [ ] **Step 2: Tích hợp 6 nghiệp vụ quầy thực chiến từ `stitch_remix_of_pastel_grocery_management_suite/code.html`**
  - `F1`: Quầy bán hàng (giữ cố định layout 58/42, quét barcode, giỏ hàng, in hóa đơn K80, tạo VietQR động).
  - `F2`: Nhập hàng nhanh tại quầy (Drawer/Modal nhập nhanh tăng kho tức thì).
  - `F3`: Khớp date & Kiểm kê kho nhanh (Drawer/Modal xem hạn dùng của các lô hàng).
  - `F4`: Kết ca & Đối soát tiền két (Modal nhập số tiền mặt thực tế, chênh lệch két, in biên bản bàn giao ca).
  - `F5`: Đổi trả hàng nhanh (Modal tìm hóa đơn cũ, chọn món khách trả, hoàn tiền).
  - `F6`: Sổ nợ thân mật xóm (Modal ghi sổ nợ cho khách quen, cập nhật hạn trả, nhắc nợ Zalo).
- [ ] **Step 3: Cài đặt phím tắt bàn phím toàn cục**
  Lắng nghe sự kiện `F1` đến `F6` để mở nhanh các nghiệp vụ; phím `Escape` đóng bất kỳ modal nào và đưa con trỏ quay lại ô tìm kiếm/quét mã vạch F1 mà không làm mất giỏ hàng.
- [ ] **Step 4: Chạy kiểm tra UI**
  Lệnh: `node tests/verify_ui.js`
  Kết quả mong đợi: POS verification = PASS (100%).
- [ ] **Step 5: Commit**
  ```bash
  git add pos.html
  git commit -m "feat(pos): port 6 core retail operations with pastel theme and shortcut keys"
  ```

---

### Task 6: Hoàn Thiện Cửa Hàng Online trong `store.html`

**Files:**
- Modify: `store.html`
- Test: `tests/verify_ui.js`

**Interfaces:**
- Consumes: `TapHoaCore.dal`, `TapHoaCore.orders`, `TapHoaCore.sync`
- Produces: Trải nghiệm đặt hàng online pastel hồng, đồng bộ kho theo thời gian thực.

- [ ] **Step 1: Đồng bộ giao diện Modern Pastel Grocery cho `store.html`**
  - Banner giới thiệu: "Tạp Hóa 36 - Cửa hàng tạp hóa ấm cúng tại 31 Ung Văn Khiêm, Bình Thạnh".
  - Bộ lọc danh mục hàng hóa (Bánh kẹo, Nước giải khát, Gia vị, Đồ hộp, Hóa mỹ phẩm).
  - Nút thêm vào giỏ tức thì kèm hiệu ứng tăng giảm số lượng.
- [ ] **Step 2: Giỏ hàng nổi & Modal Đặt Hàng**
  - Giỏ hàng nổi hiển thị tổng tiền và số món.
  - Modal checkout nhập thông tin: Họ tên, Số điện thoại, Địa chỉ giao trong xóm / KTX UTH, Ghi chú.
  - Hiển thị VietQR chuyển khoản với số tài khoản tiệm và mã đơn hàng.
- [ ] **Step 3: Kết nối đồng bộ BroadcastChannel với POS & Admin**
  Khi đặt hàng thành công, gọi `TapHoaCore.orders.createOrder({ channel: 'online', status: 'pending', ... })` để trừ tạm thời tồn kho khả dụng và bắn thông báo sang Admin & POS.
- [ ] **Step 4: Chạy kiểm tra UI**
  Lệnh: `node tests/verify_ui.js`
  Kết quả mong đợi: STORE verification = PASS (100%).
- [ ] **Step 5: Commit**
  ```bash
  git add store.html
  git commit -m "feat(store): finalize modern pastel online store with realtime sync"
  ```

---

### Task 7: Kiểm Thử Toàn Diện, Tối Ưu Lighthouse & Đồng Bộ Sang `grocery-app/`

**Files:**
- Modify: `admin.html`, `pos.html`, `store.html`
- Sync to: `grocery-app/`
- Test: `tests/run_cli_tests.js`, `tests/verify_ui.js`

**Interfaces:**
- Produces: 100% PASS trên tất cả các kịch bản kiểm thử, 0 lỗi console, sẵn sàng deploy InfinityFree/cPanel.

- [ ] **Step 1: Rà soát tối ưu Lighthouse (Performance, Accessibility, Best Practices, SEO)**
  - Thêm thẻ meta description, theme-color `#be123c`, viewport chuẩn trên cả 3 trang HTML.
  - Kiểm tra độ tương phản màu (WCAG AA), bổ sung `aria-label` cho tất cả các nút icon.
  - Đảm bảo 0 lỗi JavaScript trong DevTools Console.
- [ ] **Step 2: Chạy toàn bộ Unit Tests**
  Lệnh: `node tests/run_cli_tests.js`
  Kết quả mong đợi: 100% tests PASS (55+/55+).
- [ ] **Step 3: Chạy toàn bộ UI Verification Tests**
  Lệnh: `node tests/verify_ui.js`
  Kết quả mong đợi: POS=PASS | STORE=PASS | ADMIN=PASS (100%).
- [ ] **Step 4: Đồng bộ bản sao sang thư mục `grocery-app/`**
  Sao chép `admin.html`, `pos.html`, `store.html`, `shared/` sang `d:\download\LAP TRINH WEB\grocery-app\`.
- [ ] **Step 5: Commit cuối cùng**
  ```bash
  git add .
  git commit -m "chore: complete Tap Hoa 36 ecosystem with full Lighthouse optimization and tests"
  ```
