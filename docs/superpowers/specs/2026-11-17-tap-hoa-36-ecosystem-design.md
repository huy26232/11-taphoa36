# Thiết Kế Hệ Sinh Thái Tạp Hóa 36 - Đồ Án Nhóm UTH & Vận Hành Thực Tế Bền Vững

**Ngày lập:** 17/11/2026  
**Chủ tiệm / Quản trị viên:** Trần Ngọc Lâm (Anh Lâm - Chủ tiệm)  
**Đơn vị đào tạo:** Trường ĐH Giao Thông Vận Tải TP.HCM (UTH) - Môn Lập Trình Website (GVHD: ThS. Trần Thịnh Mạnh Đức)  
**Phạm vi:** Trọn bộ 3 phân hệ `admin.html`, `pos.html`, `store.html` kết hợp lõi `shared/core.js` & `shared/acl_engine.js`.

---

## 1. Mục Đích & Bối Cảnh (Intent & Why)

1. **Bối cảnh học tập & bài tập nhóm:** Hoàn thiện dự án nhóm môn Lập trình Web tại UTH, đáp ứng 100% các tiêu chí kiểm thử trong tài liệu học tập **Chương 4.4. Lighthouse & Hosting (InfinityFree / cPanel)**: Điểm số Lighthouse xanh (>90) trên cả 4 trục: Hiệu năng (Performance), Khả năng tiếp cận (Accessibility), Thực tiễn tốt nhất (Best Practices), Tối ưu công cụ tìm kiếm (SEO) và hỗ trợ PWA offline.
2. **Bối cảnh thực tế thương mại:** Dự án được thiết kế chuẩn chỉ để chủ tiệm (Anh Lâm) có thể đem vào sử dụng thực tế ngay cho tiệm Tạp Hóa 36 tại địa chỉ 31 Ung Văn Khiêm, Bình Thạnh. Hệ thống phải đảm bảo tính **bền vững 20–30 năm** (Longevity), không phụ thuộc vào framework bên ngoài dễ bị lỗi thời hay ngừng bảo trì, vận hành mượt mà trên bất kỳ hosting tĩnh nào (InfinityFree, GitHub Pages, cPanel Apache/Nginx).

---

## 2. Mục Tiêu, Phi Mục Tiêu & Chống Mục Tiêu (Goals, Non-Goals, Anti-Goals)

### Mục tiêu (Goals)
* **Navbar KiotViet Pastel Hồng với cơ chế Click-to-Pin:** Tái hiện menu ngang đa cột chuẩn KiotViet với bảng màu Pastel Hồng tao nhã. Cung cấp tương tác **Click-to-Pin**: khi click chuột vào tab, dropdown menu đa cột ghim mở cố định (pinned), cho phép thao tác nhấp chuột chính xác vào các mục con mà không sợ bị trượt mất menu; menu chỉ đóng khi click lại tab đó, click ra ngoài (click-outside), hoặc bấm phím `Esc`.
* **100% Mục Menu Đều Hoạt Động Được (Fully Functional Menu Items):** Tất cả các mục trong dropdown (Hàng hóa, Chuyển hàng, Sản xuất, Xuất nội bộ, Xuất hủy; Nhà cung cấp, Hóa đơn đầu vào, Nhập hàng, Trả hàng nhập, Mua dịch vụ; Đặt hàng, Hóa đơn, Trả hàng, Vận đơn, Quản lý giao hàng, Đối tác giao hàng; Sổ nợ, Sổ quỹ, Báo cáo, ACL...) đều có modal hoặc giao diện chức năng xử lý nghiệp vụ thực tế, không có link chết `#`.
* **Menu Tài Khoản Cá Nhân Hóa (Account Profile Popup):** Avatar góc phải hiển thị "Quản lý: Anh Lâm - Chủ tiệm". Nhấn vào mở popup tài khoản chuẩn KiotViet: thông tin cá nhân, Đổi mật khẩu, Cài đặt hệ thống (K80, VietQR, Sao lưu bảo mật AES-GCM), Phân quyền ACL và Đăng xuất.
* **Bộ chọn chi nhánh trực quan (Branch Selector):** Hỗ trợ chuyển đổi nhanh chi nhánh làm việc (`TM02 - 31 Ung Văn Khiêm, Bình Thạnh - UTH`, `TM01 - Tiệm Tạp Hóa 36 Trung Tâm`, `Kho Tổng UTH`).
* **Hoàn thiện POS Quầy 6 Nghiệp Vụ (`pos.html`):** Tích hợp đầy đủ 6 phân hệ quầy thực chiến từ file `code.html` của nhóm (`F1 Bán quầy`, `F2 Nhập hàng`, `F3 Kiểm kho/Khớp date`, `F4 Kết ca két tiền`, `F5 Đổi trả`, `F6 Sổ nợ quen xóm`) với phím tắt nhanh và in hóa đơn K80.
* **Hoàn thiện Cửa Hàng Online (`store.html`):** Giao diện mua sắm trực tuyến thân thiện, bảng màu Pastel Hồng ấm áp, liên thông giỏ hàng và đồng bộ tồn kho tức thì qua `TapHoaCore.sync`.
* **Bảo toàn 100% Kiểm Thử:** Duy trì 49/49 unit test PASS (`tests/test_suite.js`) và 100% kịch bản kiểm tra giao diện (`tests/verify_ui.js`).

### Phi mục tiêu (Non-Goals)
* Không tích hợp cổng thanh toán trực tuyến bên thứ 3 có tính phí (MoMo Sandbox / VNPay API) cần server backend trung gian phức tạp; thay vào đó sử dụng **VietQR tĩnh/động chuẩn Napas247** hiển thị mã QR kèm số tiền và nội dung chuyển khoản tự động, hoạt động 100% client-side vĩnh viễn.

### Chống mục tiêu (Anti-Goals)
* **Chống dữ liệu rác:** Giữ nguyên trạng thái trắng sạch (Pure Empty State) mặc định, không tự ý chèn dữ liệu bừa bãi. Cung cấp nút tiện ích `[⚡ Nạp 10 sản phẩm mẫu UTH]` để chấm bài/demo khi cần.
* **Chống dependency mong manh:** Không dùng các framework build-step nặng (Webpack, Vite, React, Vue) dễ hỏng node_modules sau 2-3 năm; sử dụng Vanilla Web Platform (HTML5 Semantic, CSS Variables, ES6+ Modules) chạy mượt trên mọi trình duyệt trong 20-30 năm tới.

---

## 3. Các Giới Hạn & Ràng Buộc Kỹ Thuật (Constraints)

1. **Tiêu chuẩn Lighthouse (UTH):**
   * *Performance:* FCP < 1.0s, LCP < 1.8s, CLS = 0, TBT < 100ms. Tất cả script không chặn render.
   * *Accessibility:* Màu chữ trên nền đạt độ tương phản WCAG AA (tối thiểu 4.5:1). Tất cả nút bấm/icon/thẻ input đều có `aria-label`, thẻ `img` có thuộc tính `alt`.
   * *Best Practices:* 0 lỗi cảnh báo console (`console.error = 0`), dùng HTTPS khi deploy, an toàn bảo mật không dùng `eval()` hoặc `document.write()`.
   * *SEO:* Đầy đủ `<meta name="description">`, OpenGraph, semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
2. **Môi trường Hosting:** Đảm bảo chạy trực tiếp khi upload toàn bộ thư mục lên cPanel / InfinityFree qua File Manager hoặc FTP mà không cần cấu hình rewrite phức tạp.
3. **Bảng màu:** Pastel Hồng chủ đạo (`#fff1f2`, `#fce7f3`, `#f43f5e`, `#be123c`) kết hợp nền trắng ngọc `#ffffff` và màu chữ than đậm `#0f172a` dễ đọc.

---

## 4. Các Phương Án Kiến Trúc & Quyết Định (Approaches & Decision)

* **Phương án A (Hệ sinh thái 3 trang chuyên biệt liên thông - ĐÃ CHỌN):**
  * Chia tách độc lập: `admin.html` (Quản trị & Báo cáo), `pos.html` (Thu ngân tại quầy), `store.html` (Cửa hàng trực tuyến).
  * Liên thông dữ liệu thông qua `localStorage` và `BroadcastChannel` trong `shared/core.js`.
  * *Lý do chọn:* Tối ưu hóa tuyệt đối điểm số Lighthouse do DOM từng trang gọn nhẹ, phân tách vai trò máy trạm thu ngân và máy quản lý đúng chuẩn thực tế các chuỗi bán lẻ.
* **Phương án B (All-in-One Single Page Portal - ĐÃ BỊ TỪ CHỐI):**
  * Gộp cả 3 màn hình vào một file duy nhất. Bị từ chối vì DOM quá nặng, ảnh hưởng lớn đến chỉ số LCP/CLS của Lighthouse và khó phân quyền sử dụng thiết bị thực tế.

---

## 5. Thiết Kế Chi Tiết Thành Phần (Detailed Design)

### 5.1. Header & Navbar KiotViet với Cơ Chế Click-to-Pin (`admin.html`)

1. **Top Bar (Tầng trên):**
   * Logo thương hiệu: "Tạp Hóa 36" (biểu tượng giỏ hàng hồng).
   * Hotline: `Hỗ trợ: 1900 6522 (Kỹ thuật UTH)`.
   * Chi nhánh Selector: Dropdown chọn `TM02 - 31 Ung Văn Khiêm, Bình Thạnh - UTH` (có tích xanh chi nhánh đang kích hoạt).
   * Chuông thông báo (cảnh báo tồn kho / cận date).
   * Nút Bánh răng Cài đặt: Mở modal Cài Đặt Tập Trung (K80, VietQR, Sao lưu mã hóa AES-GCM, Xóa trắng kho).
   * Avatar Profile: Khối bo tròn `NL` màu hồng gradient, nhãn `Quản lý: Anh Lâm - Chủ tiệm`. Nhấp vào mở popup tài khoản.

2. **Main Navigation Bar (Tầng điều hướng chính):**
   * Nền xanh biển KiotViet hoặc Pastel Rose đậm (`bg-rose-600` / `brand-600`) tương phản cao.
   * Các tab điều hướng:
     1. **Tổng quan:** Nhấp vào chuyển về Dashboard tổng quan (Doanh thu, đơn hàng, cảnh báo kho, biểu đồ bán hàng, sổ nợ).
     2. **Hàng hóa (Dropdown 2 cột):**
        * *Cột 1 (Hàng hóa):* Danh sách hàng hóa (mở bảng hàng hóa, lọc nhóm, thêm mới, xuất Excel).
        * *Cột 2 (Kho hàng):* Chuyển hàng (modal điều chuyển giữa các chi nhánh), Sản xuất (modal đóng gói combo/gia vị), Xuất dùng nội bộ (modal xuất vật tư tiệm dùng), Xuất hủy (modal hủy hàng hết hạn/hư hỏng).
     3. **Mua hàng (Dropdown 3 cột):**
        * *Cột 1 (Nhà cung cấp):* Nhà cung cấp (danh sách NCC & công nợ), Hóa đơn đầu vào (quản lý chứng từ).
        * *Cột 2 (Mua hàng):* Nhập hàng (modal tạo phiếu nhập hàng tăng tồn kho), Trả hàng nhập (modal trả hàng NCC).
        * *Cột 3 (Mua dịch vụ):* Mua dịch vụ (chi phí điện, nước, internet, rác).
     4. **Đơn hàng (Dropdown 2 cột):**
        * *Cột 1 (Đơn hàng):* Đặt hàng (đơn đặt trước/Zalo), Hóa đơn (danh sách hóa đơn quầy), Trả hàng (khách trả hàng/hoàn tiền).
        * *Cột 2 (Giao hàng):* Vận đơn (danh sách mã vận đơn), Quản lý giao hàng (tiến độ ship), Đối tác giao hàng (Grab, Ahamove, shipper quen).
     5. **Khách hàng (Dropdown 1 cột):**
        * Khách hàng (danh sách khách hàng thân thiết, tích điểm).
        * Sổ nợ thân mật (sổ nợ làng xóm, tính năng nhắc nợ khéo qua Zalo).
     6. **Sổ quỹ (Dropdown 1 cột):**
        * Sổ quỹ thu chi (phiếu thu, phiếu chi, dòng tiền mặt vs chuyển khoản).
     7. **Báo cáo (Dropdown 1 cột):**
        * Báo cáo bán hàng (doanh thu ngày/tháng, top bán chạy).
        * Báo cáo tài chính (lợi nhuận, chi phí).
        * Báo cáo cận date & xả kho (danh sách hàng sắp hết hạn < 15 ngày).
     8. **Phân quyền & ACL (Dropdown 1 cột):**
        * Danh sách tài khoản nhân viên (thêm/sửa/khóa).
        * Ma trận phân quyền 14 quyền hạn & 4 vai trò.
   * Góc phải Navbar: Nút trắng nổi bật **`[🛒 Bán hàng (F1)]`** - click mở `pos.html` trong tab mới hoặc chuyển hướng trực tiếp.

3. **Thuật toán & Cơ chế sự kiện Click-to-Pin:**
   * Mỗi dropdown item có `data-dropdown="id"`.
   * Sự kiện `click` trên tab: Nếu menu đang mở và đã ghim -> đóng menu; nếu chưa ghim hoặc đang mở menu khác -> đóng menu cũ, mở menu mới và gắn class `.is-pinned` (cố định hiển thị, không bị CSS hover tự tắt).
   * Sự kiện `document.addEventListener('click', (e) => { ... })`: Nếu click ngoài vùng header và menu dropdown -> gỡ bỏ class `.is-pinned` và ẩn menu.
   * Sự kiện `keydown`: Nhấn `Escape` lập tức đóng toàn bộ dropdown đang ghim.

### 5.2. Chức Năng Hoạt Động Của Từng Mục Menu (Full Functionality)

Không có menu chết. Mỗi mục khi nhấp vào sẽ thực hiện một hành động cụ thể:
* **Chuyển hàng:** Mở modal "Phiếu chuyển kho chi nhánh" cho phép chọn chi nhánh nguồn (`TM02`), chi nhánh đích (`TM01`/`Kho Tổng`), chọn mặt hàng và số lượng chuyển. Ghi nhận vào nhật ký kho.
* **Sản xuất / Đóng gói:** Mở modal "Lệnh đóng gói combo" (ví dụ: Combo gia vị nấu lẩu, Giỏ quà Tết) tự động trừ nguyên liệu lẻ và cộng vào tồn kho sản phẩm combo.
* **Xuất dùng nội bộ:** Mở modal "Phiếu xuất tiêu hao" (xuất bao bì, khăn giấy, băng keo dùng tại quầy), tự động ghi giảm tồn kho và ghi nhận chi phí vào Sổ Quỹ.
* **Xuất hủy:** Mở modal "Phiếu xuất hủy hàng hỏng/hết date", cập nhật trạng thái kho và xuất biên bản hủy hàng.
* **Nhà cung cấp & Hóa đơn đầu vào:** Mở bảng danh bạ nhà cung cấp, hỗ trợ thêm mới NCC, theo dõi công nợ NCC.
* **Nhập hàng:** Mở modal tạo phiếu nhập hàng thực tế, cập nhật giá vốn và tăng tồn kho.
* **Trả hàng nhập:** Mở modal tạo phiếu trả hàng cho nhà cung cấp, giảm công nợ NCC.
* **Mua dịch vụ:** Mở modal ghi nhận chi phí dịch vụ điện/nước/mạng, tự động sinh phiếu chi trong Sổ Quỹ.
* **Đơn đặt hàng & Vận đơn & Quản lý giao hàng:** Mở bộ lọc đơn hàng theo trạng thái (Đặt trước, Đang giao, Hoàn tất), kết nối danh bạ đối tác vận chuyển (Ahamove, Viettel Post, Tự giao).
* **Khách hàng & Sổ nợ:** Điều hướng trực tiếp đến bảng khách hàng và module sổ nợ thân mật xóm.
* **Sổ quỹ:** Mở bảng thu chi với form tạo nhanh Phiếu Thu / Phiếu Chi.
* **Báo cáo:** Mở các bảng biểu phân tích doanh thu, lợi nhuận và xuất file Excel chuẩn.

### 5.3. Hoàn Thiện Màn Hình Bán Hàng Quầy POS (`pos.html`)

* **Giao diện:** Tông màu Pastel Hồng thương hiệu Tạp Hóa 36.
* **Trọn bộ 6 nghiệp vụ quầy (F1–F6):**
  * `F1`: Bán hàng quầy (quét mã vạch/tìm tên, chọn số lượng, tính tiền, in hóa đơn K80, tạo mã VietQR thanh toán).
  * `F2`: Nhập hàng nhanh tại quầy khi có hàng giao gấp.
  * `F3`: Kiểm kho & Khớp date nhanh theo hạn sử dụng.
  * `F4`: Kết ca & Kiểm đếm tiền két (đối soát tiền mặt bàn giao ca sáng/tối).
  * `F5`: Đổi trả hàng nhanh cho khách quen kèm lý do hoàn tiền.
  * `F6`: Ghi nợ sổ xóm (chọn khách quen, ghi số tiền nợ, cập nhật hạn trả).
* **Header POS:** Nút quay về Quản trị Admin, nhãn hiển thị ca làm việc, tên thu ngân/quản lý hiện tại, đồng hồ thời gian thực.

### 5.4. Hoàn Thiện Cửa Hàng Mua Sắm Online (`store.html`)

* **Giao diện:** Thân thiện, bắt mắt theo chuẩn Modern Pastel Grocery.
* **Trải nghiệm khách hàng:**
  * Banner chào đón ấm cúng: "Tạp Hóa 36 - 31 Ung Văn Khiêm, Bình Thạnh".
  * Danh mục hàng hóa trực quan (Bánh kẹo, Nước giải khát, Gia vị, Đồ khô, Hóa mỹ phẩm).
  * Giỏ hàng nổi (Floating Cart) có badge số lượng.
  * Modal Đặt Hàng: Nhập tên khách, số điện thoại, địa chỉ nhận hàng, ghi chú giao hàng.
  * Đồng bộ: Đơn hàng tạo từ Store tự động đẩy sang Admin và POS thông qua `TapHoaCore.sync`.

### 5.5. Tối Ưu Lighthouse & Hosting cPanel (Chuẩn Chương 4.4 UTH)

1. **Hiệu năng (Performance > 90):**
   * Inline critical CSS, tận dụng bộ nhớ cache trình duyệt.
   * Icon dùng Google Material Symbols hoặc inline SVG nhẹ, không load thư viện nặng.
   * Lazy load cho modal và hình ảnh, giữ CLS = 0 tuyệt đối.
2. **Khả năng tiếp cận (Accessibility > 90):**
   * Các nút icon đều có `aria-label` và `title`.
   * Tương phản văn bản đạt chuẩn WCAG AA: chữ than `#0f172a` trên nền trắng `#ffffff`, chữ trắng `#ffffff` trên nền hồng đậm `#be123c`.
   * Hỗ trợ điều hướng bằng bàn phím (phím tắt F1-F6, phím `Esc`, phím `Enter`).
3. **Thực tiễn tốt nhất (Best Practices > 90):**
   * Không có bất kỳ lỗi JavaScript nào trong DevTools Console.
   * Không dùng `document.write()` hay `eval()`.
   * Mã hóa bảo mật client-side với Web Crypto API (AES-GCM 256-bit).
4. **SEO (> 90):**
   * Meta tags đầy đủ: `description`, `viewport`, `robots`, `theme-color`.
   * Cấu trúc thẻ tiêu đề phân cấp chuẩn: `<h1>`, `<h2>`, `<h3>`.

---

## 6. Những Phần Trao Quyền Cho Builder (What's Left to Builder)

* Tinh chỉnh chi tiết các trường dữ liệu trong các modal nghiệp vụ phụ (Chuyển hàng, Sản xuất, Mua dịch vụ) sao cho ngắn gọn, thực tế nhất với tiệm tạp hóa Việt Nam.
* Định dạng mẫu in phiếu chuyển kho và biên bản hủy hàng đồng bộ với mẫu in hóa đơn K80 hiện có.
* Cấu hình đồng bộ `BroadcastChannel` và `window.addEventListener('storage', ...)` đảm bảo không bị xung đột khóa dữ liệu khi mở nhiều tab song song.

---

## 7. Kết Quả Rà Soát Kỹ Thuật (Builder Review & Architectural Calls)

Sau khi rà soát độc lập cùng kỹ sư kiến trúc, các quyết định kỹ thuật cốt lõi được chốt như sau:

1. **Kiến trúc Dữ liệu Chi Nhánh:** Giữ nguyên mô hình schema phẳng chuẩn của `TapHoaCore.dal` để bảo toàn 100% 49 unit test. "Chi nhánh" (`TM02 - 31 Ung Văn Khiêm`) đóng vai trò là ngữ cảnh làm việc hiện hành (`currentBranch`). Các nghiệp vụ chuyển hàng sẽ ghi nhận bút toán điều chuyển (`branchTransfers`) lưu lịch sử xuất - nhập giữa các điểm bán mà không làm phân mảnh cơ sở dữ liệu.
2. **Dung hòa Pure Empty State & Unit Tests:** Mặc định hệ thống ở trạng thái trắng sạch 100% phục vụ nhập liệu thực tế. Trong môi trường kiểm thử tự động (`tests/test_suite.js`), bộ nạp mẫu được kích hoạt để đảm bảo đạt 100% tiêu chí `AC-DAL-02`. Tại giao diện người dùng, nút `[⚡ Nạp 10 sản phẩm mẫu UTH]` luôn sẵn sàng để giảng viên chấm bài hoặc chủ tiệm muốn nạp dữ liệu demo.
3. **Mô hình Điều Hướng Navbar KiotViet (Bảo toàn Điểm Lighthouse):** Navbar sử dụng bộ điều phối ngữ cảnh (Context Dispatcher): các tab chính chuyển đổi mượt mà giữa các View Bento gốc, trong khi các nghiệp vụ chuyên sâu (Chuyển hàng, Sản xuất, Xuất hủy, Mua dịch vụ, v.v.) mở dưới dạng Modal/Drawer độc lập. Cơ chế này giữ DOM của `admin.html` cực nhẹ, đảm bảo chỉ số FCP < 1.0s, TBT < 100ms trên cPanel/InfinityFree.
4. **Kiến trúc POS 6-trong-1 (F1–F6):** F1 duy trì layout chia đôi tiêu chuẩn (58% danh mục / 42% giỏ hàng hóa đơn) để thỏa mãn `verify_ui.js` và giữ nguyên giỏ hàng đang quét dở của thu ngân. Các phím F2 (Nhập nhanh), F3 (Kiểm kho/date), F4 (Kết ca), F5 (Đổi trả), F6 (Sổ nợ) mở các Drawer/Modal tương tác nhanh, nhấn `Esc` đóng lại và tiếp tục thanh toán F1 mà không bao giờ mất dữ liệu giỏ hàng.
5. **Vòng Đời Đơn Hàng Từ Store Online:** Đơn hàng từ `store.html` được ghi nhận với trạng thái `Đơn mới (Chờ soạn)` và trừ tạm thời tồn kho khả dụng để đảm bảo khách không bị đặt trùng mặt hàng đã hết (thỏa mãn `AC-SYNC-01`). Tại quầy POS hoặc Admin, nếu khách hủy nhận, thu ngân/chủ tiệm chỉ cần bấm `[Hủy đơn]` là hệ thống lập tức tự động hoàn lại số lượng vào kho.

