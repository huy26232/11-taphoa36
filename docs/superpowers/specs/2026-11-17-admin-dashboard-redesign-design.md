# Thiết Kế Kỹ Thuật: Tái Cấu Trúc Bảng Quản Trị Tạp Hóa 36 (Admin Dashboard Redesign & ACL)

- **Dự án:** Tạp Hóa Số (Tạp Hóa 36) - Hệ thống Web Cửa hàng Tạp hóa Đa nền tảng
- **Môn học:** Lập trình website | Giảng viên hướng dẫn: ThS. Trần Thịnh Mạnh Đức (UTH)
- **Tác giả:** Antigravity Architect & Senior Frontend Team
- **Ngày lập:** 17/11/2026
- **Trạng thái:** Đã qua phản biện kỹ thuật - Chờ người dùng phê duyệt (Approved by Builder Reviewer, Pending User Approval)

---

## 1. Ý Định & Mục Tiêu (Intent & The Why)

Trang quản trị `admin.html` là trung tâm điều hành của toàn bộ hệ thống "Tạp Hóa 36". Trước đó, giao diện bị đánh giá là chắp vá với tone màu xanh KiotViet không phù hợp, nhồi nhét nhiều thông tin dữ liệu rác/bịa đặt ("Chào Cô Ba", "Bác Bảy", "31 Ung Văn Khiêm") và thiếu sự cá nhân hóa.

Mục tiêu của thiết kế này là:
1. **Thiết kế lại hoàn toàn (Redesign)** giao diện `admin.html` theo phong cách **Pastel Hồng (Soft Rose / Blush Pink)** thanh lịch, tối giản, sang trọng, đạt chuẩn tương phản WCAG và tối ưu điểm số **Google Lighthouse** (Performance, Accessibility, Best Practices, SEO) theo tiêu chí của ThS. Trần Thịnh Mạnh Đức.
2. **Loại bỏ 100% dữ liệu rác:** Áp dụng **Phương án 1 (Trắng sạch 100% - Pure Empty State)**. Ban đầu không có bất kỳ sản phẩm hay đơn hàng ảo nào; cung cấp Empty State trang nhã kèm nút bấm thao tác nhanh để chủ tiệm tự nạp dữ liệu thực tế.
3. **Bổ sung phân hệ ACL (Access Control List) & Quản lý Tài khoản (Account) chuyên sâu:** Cung cấp ma trận phân quyền chi tiết (Chủ tiệm, Quản lý, Thu ngân, Thủ kho), quản lý tài khoản nhân viên, đổi mật khẩu và nhật ký hoạt động.
4. **Tập trung hóa cấu hình:** Toàn bộ thông tin cửa hàng, máy in nhiệt K80, mã VietQR, sao lưu đám mây được đưa gọn vào **Modal Cài Đặt (⚙️ Settings)** để giữ màn hình chính sạch sẽ nhất có thể.

---

## 2. Mục Tiêu, Phi Mục Tiêu & Chống Mục Tiêu (Goals, Non-Goals, Anti-Goals)

### 2.1. Mục Tiêu (Goals)
- **Thương hiệu:** Hiển thị chuẩn xác tên **"Tạp Hóa 36"** trên thanh tiêu đề và toàn hệ thống.
- **Bố cục điều hướng ngang chuẩn mực:** 
  - Top Bar: Logo Tạp Hóa 36, chọn kho/chi nhánh tinh gọn, thông báo, Cài đặt ⚙️, thông tin tài khoản đang đăng nhập.
  - Menu Bar ngang Pastel Hồng: Tổng quan, Hàng hóa (Dropdown), Mua hàng (Dropdown), Đơn hàng (Dropdown), Khách hàng (Dropdown), Sổ quỹ, Báo cáo (Dropdown), ACL & Tài khoản.
  - Nút **`[🛒 Bán hàng]`** màu trắng viền hồng nổi bật ở góc phải, phím tắt F1 chuyển ngay sang `pos.html`.
- **Phân hệ ACL & Account đầy đủ tính năng:**
  - Danh sách tài khoản nhân viên (Avatar, Tên, Email, Vai trò, Trạng thái).
  - Ma trận quyền (Xem kho, Thêm/Sửa sản phẩm, Xem doanh thu, Tạo đơn, Sửa đơn, Xuất báo cáo, Quản trị hệ thống).
  - Quản lý hồ sơ cá nhân, đổi mật khẩu, nhật ký đăng nhập.
- **Trạng thái dữ liệu sạch:** Các bảng Hàng hóa, Đơn hàng, Sổ nợ đều có Empty State đẹp, hướng dẫn rõ ràng, có nút `[+ Thêm mới]` và `[📥 Nhập Excel]` / `[📤 Xuất Excel]`.
- **Tương thích:** Tích hợp trực tiếp với cơ chế lưu trữ IndexedDB/LocalStorage của `shared/core.js`, duy trì kiểm thử tự động đạt 100% PASS.

### 2.2. Phi Mục Tiêu (Non-Goals)
- Không can thiệp sửa đổi giao diện `pos.html` hay `store.html` trong phạm vi nhiệm vụ này (tập trung 100% vào `admin.html`).
- Không triển khai backend server phức tạp (Node/PHP/Python server riêng) mà vận hành theo kiến trúc Client-side SPA / IndexedDB + LocalStorage Offline-first sẵn sàng deploy lên hosting tĩnh hoặc InfinityFree.

### 2.3. Chống Mục Tiêu (Anti-Goals)
- **Tuyệt đối không** sử dụng màu xanh đậm KiotViet `#0070e0` gây chói và lệch tone màu chủ đạo.
- **Tuyệt đối không** tự ý bịa đặt tên công ty, chi nhánh, số hotline bên ngoài vào giao diện.
- **Tuyệt đối không** làm mất các hàm logic cốt lõi và các bài kiểm thử tự động của dự án.

---

## 3. Ràng Buộc & Tiêu Chuẩn (Constraints)
- **Hệ màu chủ đạo (Color Palette):**
  - Nền trang & Card: Hồng pastel siêu nhẹ `#fff8fa`, `#fff0f3`, trắng tuyết `#ffffff`.
  - Nền Navbar & Header: Soft Rose `#fce7f3` kết hợp đường viền hồng phấn `#fbcfe8`.
  - Màu nhấn (Accent/Primary): Deep Rose / Muted Berry `#e11d48` hoặc `#db2777` cho nút hành động chính, đảm bảo tương phản đạt chuẩn WCAG AA trên nền sáng.
  - Màu chữ: Xám than `#1f2937` và `#4b5563`, không dùng chữ hồng mờ khó đọc.
  - Nút Bán hàng POS: Nền trắng `#ffffff`, viền `#f472b6`, chữ hồng đậm, icon giỏ hàng.
- **Tiêu chuẩn Lighthouse:** Thẻ ngữ nghĩa HTML5, toàn bộ ảnh/icon có `alt`/`aria-label`, không có lỗi console runtime, tốc độ tải trang < 0.5s.
- **Cơ chế lưu trữ:** Single Source of Truth thông qua `localStorage` và `TapHoaSoDB` (IndexedDB) trong `shared/core.js`.

---

## 4. Các Phương Án Đã Cân Nhắc & Lựa Chọn (Approaches)

### Phương án A: Single-Page Application (SPA) Phân vùng Module (ĐÃ CHỌN)
- Toàn bộ các phân hệ chức năng (Tổng quan, Hàng hóa, Mua hàng, Đơn hàng, Khách hàng, Sổ quỹ, Báo cáo, ACL & Tài khoản) được cấu trúc thành các `<section class="admin-view hidden">`.
- Chuyển đổi qua lại mượt mà tức thì bằng JavaScript mà không tải lại trang.
- **Lý do chọn:** Tối ưu hóa trải nghiệm người dùng, duy trì kết nối BroadcastChannel liên tục giữa các tab POS và Web Khách, đạt điểm Performance cao nhất trên Lighthouse.

### Phương án B: Popup Modal lồng nhau (ĐÃ LOẠI BỎ)
- Giữ một màn hình chính và mở các tính năng khác trong cửa sổ popup đè lên.
- **Lý do loại bỏ:** Trải nghiệm bí bách, thao tác quản lý phân quyền ACL trong modal nhỏ rất khó nhìn và thiếu chuyên nghiệp.

### Phương án C: Tách thành các file HTML con rời rạc (ĐÃ LOẠI BỎ)
- Chia ra `admin-products.html`, `admin-acl.html`, v.v.
- **Lý do loại bỏ:** Bị chớp giật khi chuyển trang, reload lại toàn bộ CSS/JS, gián đoạn phiên làm việc.

---

## 5. Thiết Kế Chi Tiết Thành Phần (Detailed Design)

### 5.1. Cấu Trúc Khung Điều Hướng (Navigation Architecture)
1. **Top Bar (Thanh tiện ích trên cùng):**
   - Bên trái: Logo biểu tượng chiếc giỏ pastel xinh xắn + Chữ thương hiệu **"Tạp Hóa 36"** + Phiên bản `v2.5`.
   - Giữa: Chọn Kho / Chi nhánh (mặc định: "Kho & Cửa hàng chính"), có thể đổi hoặc thêm chi nhánh trong Settings.
   - Bên phải:
     - Badge Trạng thái mạng: "Trực tuyến" (xanh lá nhạt pastel) hoặc "Ngoại tuyến" (cam pastel).
     - Nút Chuông Thông Báo (hiển thị popup thông báo đơn mới, hàng sắp hết).
     - Nút Bánh Răng Cài Đặt (⚙️ Settings): Mở Modal Cài Đặt tổng thể.
     - Khối Profile Người Dùng: Avatar tròn + Tên "Ngọc Lâm (Chủ tiệm)" + Menu thả xuống (Hồ sơ cá nhân, Đổi mật khẩu, Phân quyền ACL, Đăng xuất).
2. **Menu Bar Ngang (Pastel Pink Navbar):**
   - Danh sách tab chính:
     - **Tổng quan:** Dashboard tổng hợp (Doanh thu, Đơn hàng, Tồn kho cảnh báo, Dòng tiền).
     - **Hàng hóa ▾:** Dropdown gồm *Danh mục hàng hóa*, *Kiểm kho & Cận date*, *Nhập/Xuất kho*.
     - **Mua hàng ▾:** Dropdown gồm *Nhà cung cấp*, *Phiếu nhập hàng*.
     - **Đơn hàng ▾:** Dropdown gồm *Danh sách đơn hàng*, *Hóa đơn bán tại quầy*, *Đơn trực tuyến*.
     - **Khách hàng ▾:** Dropdown gồm *Danh sách khách hàng*, *Sổ nợ thân quen*.
     - **Sổ quỹ:** Thu - Chi - Lợi nhuận và cân đối tiền mặt.
     - **Báo cáo ▾:** Dropdown gồm *Báo cáo cuối ngày*, *Báo cáo doanh thu & tồn kho*, *Xuất file Excel / PDF*.
     - **Phân quyền & ACL:** Quản lý thành viên và bảng phân quyền.
   - Góc phải: Nút **`[🛒 Bán hàng (F1)]`** màu trắng tinh khôi, viền hồng pastel, icon giỏ hàng nổi bật, click mở tab `pos.html`.

### 5.2. Phân Hệ ACL & Quản Lý Tài Khoản (Access Control & Account Module)
Phân hệ này nằm ở tab riêng và có thể truy cập nhanh từ menu avatar:
1. **Bảng Danh Sách Tài Khoản Nhân Viên:**
   - Cột: Avatar, Họ và tên, Email / Tên đăng nhập, Vai trò (Badge màu: *Chủ tiệm - Đỏ hồng*, *Quản lý - Tím nhạt*, *Thu ngân - Xanh ngọc*, *Thủ kho - Vàng hổ phách*), Trạng thái (Hoạt động / Tạm khóa), Hành động (Sửa quyền, Đổi mật khẩu, Xóa/Khóa).
   - Nút `[+ Thêm tài khoản mới]`.
2. **Ma Trận Phân Quyền Chi Tiết (ACL Permissions Matrix):**
   - Cho phép thiết lập quyền chi tiết cho từng nhóm vai trò hoặc tài khoản cụ thể:
     - *Nhóm Hàng hóa:* Xem danh sách, Thêm hàng mới, Sửa giá bán, Xóa hàng, Điều chỉnh tồn kho.
     - *Nhóm Bán hàng & Đơn hàng:* Tạo đơn POS, Hủy đơn, Chiết khấu giảm giá, Xem đơn online.
     - *Nhóm Tài chính & Báo cáo:* Xem doanh thu ngày, Xem lợi nhuận gộp, Xuất file Excel/PDF, Xem sổ nợ.
     - *Nhóm Quản trị:* Cấu hình cửa hàng, Quản lý tài khoản & phân quyền (chỉ dành cho Chủ tiệm/Admin).
3. **Modal Hồ Sơ & Đổi Mật Khẩu Cá Nhân:**
   - Cập nhật tên hiển thị, số điện thoại, mật khẩu mới, kiểm tra độ mạnh mật khẩu.
4. **Nhật Ký Hoạt Động (Audit Trail / Activity Log):**
   - Ghi lại các sự kiện quan trọng: Đăng nhập, Thêm sản phẩm, Xóa đơn hàng, Xuất báo cáo kèm thời gian và tên người thực hiện.

### 5.3. Trạng Thái Trắng Sạch 100% (Pure Empty State)
- Khi cửa hàng chưa có dữ liệu:
  - Bảng hàng hóa hiển thị card Empty State lịch sự: *"Kho hàng Tạp Hóa 36 hiện chưa có sản phẩm. Hãy bấm '+ Thêm sản phẩm' để bắt đầu quản lý hoặc nhập từ file Excel mẫu."*
  - Dashboard tổng quan hiển thị các thẻ KPI ở mức 0đ / 0 đơn, kèm lời chào mừng thân thiện đến với hệ thống quản trị Tạp Hóa 36.
  - Có 2 nút hành động trực tiếp: `[+ Thêm sản phẩm mới]` và `[📥 Nhập danh sách từ Excel]`.

### 5.4. Modal Cài Đặt Tập Trung (Centralized Settings ⚙️)
Toàn bộ cấu hình được nhóm thành các tab trong một Modal duy nhất:
1. **Thông tin cửa hàng:** Tên cửa hàng ("Tạp Hóa 36"), Địa chỉ, Số điện thoại hỗ trợ, Lời chúc trên chân trang hóa đơn.
2. **Cấu hình máy in & Hóa đơn:** Chọn mẫu in nhiệt K80 (80mm) hoặc A5, bật/tắt in logo, in mã VietQR thanh toán.
3. **Mã thanh toán VietQR NAPAS:** Nhập số tài khoản ngân hàng, tên ngân hàng thụ hưởng để sinh mã QR thanh toán động tại quầy.
4. **Sao lưu & Dữ liệu:**
   - Nút `[📤 Sao lưu dữ liệu ra file (.json)]` có mã hóa AES-GCM.
   - Nút `[📥 Phục hồi dữ liệu từ file]`.
   - Nút `[🗑️ Xóa sạch toàn bộ dữ liệu]` (yêu cầu gõ xác nhận "XOA" trước khi thực hiện để tránh bấm nhầm).
   - Nút `[⚡ Nạp 10 sản phẩm mẫu UTH]` (dành cho chấm điểm thực hành hoặc demo nhanh nếu cần).

---

## 6. Phần Dành Cho Lập Trình Viên (What's Left to the Builder)
- Tối ưu hóa việc chia tách template HTML trong file `admin.html` để mã nguồn sạch sẽ, chú thích rõ ràng từng phân hệ.
- Tận dụng tối đa CSS Utility của Tailwind kết hợp biến CSS tùy biến cho tone màu Pastel Hồng (`--rose-pastel-50: #fff5f7;`, `--rose-pastel-100: #fce7f3;`, `--rose-pastel-500: #f43f5e;`).
- Viết các hàm JavaScript xử lý hiển thị view: `switchAdminView(viewName)`, `openSettingsModal()`, `openAclModal()`, `renderProductTable()`, `renderUserTable()`.

---

## 7. Giải Quyết Các Điểm Kỹ Thuật Sau Phản Biện (Builder Reviewer Resolution & Technical Calls)

1. **Khởi tạo tài khoản Master Admin:**
   - Để đảm bảo người dùng có thể truy cập ngay vào hệ thống phân quyền ACL mà không bị vướng màn hình khóa, hệ thống mặc định nạp tài khoản Master Admin:
     * *Tên đăng nhập:* `admin` | *Mật khẩu:* `admin123`
     * *Tên hiển thị:* **Trần Ngọc Lâm (Chủ tiệm)** | *Quyền hạn:* Toàn quyền (Super Admin / All ACL Permissions).
2. **Xử lý trạng thái rỗng & Kiểm thử:**
   - Bảng sản phẩm và đơn hàng khởi tạo rỗng 100% trong `localStorage` và `TapHoaSoDB` để người dùng nhập liệu thực tế.
   - Trong Settings ⚙️ có sẵn nút `[⚡ Nạp sản phẩm mẫu]` để giáo viên hoặc người chấm bài có thể bật dữ liệu demo tức thì, và nút `[🗑️ Xóa trắng dữ liệu]` để đưa về 0 bất cứ khi nào.
3. **Lưu trữ dữ liệu các phân hệ mới (Mua hàng, Nhà cung cấp, Audit Log):**
   - Lưu trữ an toàn trong `localStorage` với các khóa chuẩn hóa: `taphoa36_accounts`, `taphoa36_acl`, `taphoa36_suppliers`, `taphoa36_purchase_orders`, `taphoa36_audit_logs`.
   - Tốc độ đọc ghi đồng bộ tức thì, không gây lỗi xung đột phiên bản IndexedDB.
4. **Phạm vi thực thi ACL:**
   - Tập trung kiểm soát toàn bộ trên `admin.html` (ẩn/hiện các tab, cấm thao tác sửa xóa nếu không có quyền).
   - Tích hợp thông tin tài khoản đang đăng nhập (`current_user`) vào `shared/core.js` để đồng bộ mượt mà sang `pos.html`.
5. **Cập nhật Test Suite:**
   - Tinh chỉnh các bài kiểm thử trong `tests/test_suite.js` để nghiệm thu đúng thương hiệu "Tạp Hóa 36", 8 phân hệ Pastel Hồng và tính năng ACL, đảm bảo 100% bài test PASS tuyệt đối.
