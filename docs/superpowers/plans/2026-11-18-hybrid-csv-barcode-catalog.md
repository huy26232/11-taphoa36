# Hybrid FMCG Barcode Catalog & Safe Harbor CSV Importer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng công cụ nhập hàng loạt từ Excel/CSV chuẩn KiotViet cho Admin, tích hợp Thư viện mã vạch FMCG Việt Nam (250+ sản phẩm) với cơ chế tự động nhận diện thông minh trên POS/Admin và điều khoản pháp lý Safe Harbor Disclaimer để chống tranh chấp/kiện tụng bản quyền cho phần mềm bán lẻ thương mại.

**Architecture:** Sử dụng kiến trúc module độc lập trong `TapHoaCore.barcode` (`shared/core.js`), lưu trữ từ điển mã vạch tham chiếu tại `data/master_barcodes.json`, đồng bộ với IndexedDB `TapHoaSoDB` và server REST API. Giao diện Modal chuẩn Quiet Chrome với bảng preview xem trước và cam kết miễn trừ trách nhiệm pháp lý.

**Tech Stack:** Vanilla JavaScript (ES6+), Web Workers / Async stream parsing, IndexedDB, Tailwind CSS, Material Symbols, Safe Harbor / Nominative Fair Use legal compliance.

**Spec:** [docs/superpowers/plans/2026-11-18-hybrid-csv-barcode-catalog.md](file:///d:/download/LAP%20TRINH%20WEB/docs/superpowers/plans/2026-11-18-hybrid-csv-barcode-catalog.md)

## Global Constraints

- **Bảo toàn nguyên vẹn thư mục `NguyenVaHieu/`:** TUYỆT ĐỐI KHÔNG sửa đổi, di chuyển, xóa hay ghi đè bất kỳ file nào bên trong `d:\download\LAP TRINH WEB\NguyenVaHieu`.
- **An toàn Pháp Lý & Bản Quyền:** Áp dụng nguyên tắc Safe Harbor & Nominative Fair Use; không sử dụng ảnh bao bì hay logo có bản quyền của các hãng sản xuất.
- **Tương thích TDD:** Giữ vững 57/57 tests xanh hiện tại; các tính năng mới phải có test chứng minh (RED -> GREEN).
- **Thương hiệu & Địa bàn:** Single Source of Truth `TapHoa36`, cơ sở chính `02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam (UTH)`.

## Review Focus

1. **CSV Parsing with Quotes & Comma:** Xử lý chuỗi CSV có dấu phẩy nằm trong dấu nháy kép (ví dụ: `"Đồ khô & Thực phẩm đóng gói>>Gia vị nêm, tẩm ướp, nước chấm, xốt trộn chấm"`).
2. **Missing Barcode Fallback:** Một số dòng thiếu mã vạch (`8935001720409,,Chupa Chups...`) phải tự động lấy `Mã hàng` làm mã vạch nếu là số EAN hợp lệ.
3. **Duplicate Prevention:** Khi nhập trùng mã vạch đã có trong kho, hệ thống hỏi hoặc cập nhật số lượng tồn kho chứ không tạo bản ghi rác trùng lặp.
4. **Performance with 250+ Items:** Thao tác nhập và tra cứu phải phản hồi tức thì ($< 50\text{ms}$), không gây giật lag trình duyệt.
5. **Safe Harbor Notice:** Luôn hiển thị dòng thông báo nguồn gốc dữ liệu mã vạch và quyền sở hữu nhãn hiệu trên giao diện người dùng.

---

### Task 1: Chuẩn hóa dữ liệu & Tạo Thư Viện Mã Vạch FMCG (`data/fmcg_catalog.csv` & `data/master_barcodes.json`)

**Files:**
- Create: `data/fmcg_catalog.csv`
- Create: `data/master_barcodes.json`
- Test: `tests/test_barcode_data.js`

**Interfaces:**
- Produces: `data/master_barcodes.json` chứa mảng các object:
  ```json
  {
    "code": "8936236471302",
    "barcode": "8936236471302",
    "name": "Omachi Mì ly hải sản chua cay 66gr",
    "unit": "ly",
    "category": "Đồ khô & Thực phẩm đóng gói>>Đồ ăn liền>>Mì ăn liền",
    "isFMCG": true
  }
  ```

- [ ] **Step 1: Viết test kiểm tra tệp dữ liệu mã vạch**
  Tạo `tests/test_barcode_data.js` kiểm tra tệp `data/master_barcodes.json` tồn tại, chứa tối thiểu 250 sản phẩm, không có mã vạch rỗng và có điều khoản disclaimer.
- [ ] **Step 2: Chạy test để xác nhận FAIL**
  Chạy: `node tests/test_barcode_data.js` (kỳ vọng FAIL vì file chưa được tạo).
- [ ] **Step 3: Tạo `data/fmcg_catalog.csv` và chuyển đổi sang `data/master_barcodes.json`**
  Lưu toàn bộ 256 dòng dữ liệu của user vào `data/fmcg_catalog.csv`. Viết kịch bản xử lý làm sạch, tự động gán barcode từ mã hàng nếu barcode rỗng, loại bỏ trùng lặp và xuất ra `data/master_barcodes.json`.
- [ ] **Step 4: Chạy lại test để xác nhận PASS**
  Chạy: `node tests/test_barcode_data.js` (kỳ vọng PASS 100%).
- [ ] **Step 5: Commit dữ liệu chuẩn hóa**
  ```bash
  git add data/fmcg_catalog.csv data/master_barcodes.json tests/test_barcode_data.js
  git commit -m "feat(data): add fmcg 250+ products catalog and master barcode database with safe harbor metadata"
  ```

---

### Task 2: Lập trình Động cơ Lõi `TapHoaCore.barcode` trong `shared/core.js` (TDD)

**Files:**
- Modify: `shared/core.js`
- Modify: `tests/test_suite.js`
- Test: `tests/run_cli_tests.js`

**Interfaces:**
- Consumes: `data/master_barcodes.json`
- Produces:
  * `TapHoaCore.barcode.lookup(code: string): object | null`
  * `TapHoaCore.barcode.parseCSV(csvText: string): Array<object>`
  * `TapHoaCore.barcode.importProducts(items: Array<object>, options: object): Promise<{ imported: number, skipped: number, errors: Array }>`
  * `TapHoaCore.barcode.getSafeHarborNotice(): string`

- [ ] **Step 1: Viết bài test thất bại cho Module Barcode trong `tests/test_suite.js`**
  Bổ sung Phân hệ 11: `=== Phân hệ 11: Thư Viện Mã Vạch FMCG & Safe Harbor CSV Importer (AC-BARCODE) ===`
  - `AC-BARCODE-01`: Parse CSV chuẩn xác với chuỗi có dấu nháy kép và phân tách cột.
  - `AC-BARCODE-02`: Tra cứu mã vạch nhanh trả về đúng tên hàng, đơn vị tính, nhóm hàng.
  - `AC-BARCODE-03`: Nhập danh sách sản phẩm vào DAL và IndexedDB kho hàng không bị lỗi.
  - `AC-BARCODE-04`: Cung cấp nội dung văn bản tuyên bố miễn trừ trách nhiệm pháp lý Safe Harbor.
- [ ] **Step 2: Chạy test để xác nhận FAIL**
  Chạy: `node tests/run_cli_tests.js` (kỳ vọng Phân hệ 11 báo FAIL vì chưa có code trong core.js).
- [ ] **Step 3: Triển khai `TapHoaCore.barcode` trong `shared/core.js`**
  Lập trình các hàm `lookup`, `parseCSV`, `importProducts`, `getSafeHarborNotice` và tích hợp master barcodes vào bộ nhớ đệm cache của core.
- [ ] **Step 4: Chạy test để xác nhận PASS**
  Chạy: `node tests/run_cli_tests.js` (kỳ vọng 61/61 tests PASS, bao gồm 57 bài cũ + 4 bài mới).
- [ ] **Step 5: Commit module lõi**
  ```bash
  git add shared/core.js tests/test_suite.js
  git commit -m "feat(core): implement TapHoaCore.barcode parser, lookup, and safe harbor legal notice"
  ```

---

### Task 3: Tích hợp Giao diện Modal Nhập CSV & Safe Harbor Disclaimer trên `admin.html`

**Files:**
- Modify: `admin.html`
- Modify: `grocery-app/admin.html`
- Test: `tests/verify_ui.js`

**Interfaces:**
- Consumes: `TapHoaCore.barcode`
- Produces:
  * Nút `btnOpenCsvImportModal` trên toolbar tab Hàng Hóa (`view-products`).
  * Modal `modalImportCsv`: vùng kéo thả `.csv`, bảng preview 5 dòng đầu tiên, thanh trạng thái tiến trình, nút xác nhận nhập.
  * Trong Modal Cài đặt (`modal-settings`): Nút "Nạp 250+ sản phẩm FMCG Việt Nam" kèm hộp thoại Safe Harbor Legal Disclaimer.

- [ ] **Step 1: Cập nhật `tests/verify_ui.js` để kiểm tra các phần tử giao diện mới**
  Bổ sung kiểm tra `btnOpenCsvImportModal`, `modalImportCsv`, và Safe Harbor notice.
- [ ] **Step 2: Chạy `node tests/verify_ui.js` để kiểm tra FAIL**
- [ ] **Step 3: Thêm UI Modal Nhập CSV & Trình nạp FMCG vào `admin.html`**
  - Thêm nút "📥 Nhập từ Excel/CSV" với style Quiet Chrome pastel pink.
  - Xây dựng Modal `modalImportCsv` với input type="file" nhận `.csv`, đọc file bằng `FileReader`, gọi `TapHoaCore.barcode.parseCSV()` và hiển thị preview.
  - Bổ sung nút "Nạp 250+ mã hàng FMCG" vào Modal Cài đặt có hiển thị hộp thoại cảnh báo bản quyền và miễn trừ kiện tụng.
- [ ] **Step 4: Chạy `node tests/verify_ui.js` để kiểm tra PASS**
- [ ] **Step 5: Commit thay đổi trên admin.html**
  ```bash
  git add admin.html tests/verify_ui.js
  git commit -m "feat(admin): add bulk CSV import modal and FMCG quick seed with safe harbor disclaimer"
  ```

---

### Task 4: Tự Động Nhận Diện Mã Vạch FMCG Thông Minh trên `pos.html` & `admin.html`

**Files:**
- Modify: `pos.html`
- Modify: `admin.html`
- Test: `tests/verify_ui.js`

**Interfaces:**
- Consumes: `TapHoaCore.barcode.lookup(code)`
- Produces:
  * POS: Khi nhập barcode chưa có trong giỏ/kho nhưng có trong Master Barcode, tự động hiện thông báo nhận diện và cho phép bán nhanh hoặc thêm giá bán.
  * Admin: Modal Thêm hàng mới (`modalProductForm`), khi nhập/quét barcode, tự động điền Tên sản phẩm, ĐVT và Nhóm hàng.

- [ ] **Step 1: Viết logic auto-fill trên `admin.html` cho ô `productBarcode`**
  Gắn sự kiện `input` / `change` trên ô nhập mã vạch để gọi `TapHoaCore.barcode.lookup(val)`. Nếu tìm thấy, tự động điền Tên hàng và Đơn vị tính.
- [ ] **Step 2: Viết logic auto-detect trên `pos.html` cho ô quét mã vạch `txtBarcode`**
  Nếu quét mã chưa có trong kho tiệm, tra cứu `TapHoaCore.barcode.lookup(code)`. Nếu có trong thư viện FMCG, tự động tạo tạm mặt hàng với giá mặc định hoặc mở hộp thoại đặt giá bán siêu tốc.
- [ ] **Step 3: Kiểm thử trên browser và verify_ui**
  Chạy: `node tests/verify_ui.js`
- [ ] **Step 4: Commit tính năng**
  ```bash
  git add pos.html admin.html
  git commit -m "feat(pos): smart barcode auto-detection and quick item lookup from fmcg catalog"
  ```

---

### Task 5: Bảo Toàn `NguyenVaHieu/`, Đồng Bộ `grocery-app` & Đóng Gói `Nhom_11.zip`

**Files:**
- Sync: `grocery-app/`
- Sync: `Nhom_11/`
- Archive: `Nhom_11.zip`, `Nhom11.zip`
- Documentation: `spec.md`, `plan.md`, `tasks.md`, `README.md`

- [ ] **Step 1: Kiểm tra tính toàn vẹn của thư mục `NguyenVaHieu/`**
  Chạy lệnh kiểm tra git status và diff để cam kết 100% không có bất kỳ file nào trong `NguyenVaHieu/` bị thay đổi.
- [ ] **Step 2: Cập nhật tài liệu quy trình kỹ thuật (`spec.md`, `plan.md`, `tasks.md`, `README.md`)**
  Ghi nhận tính năng Thư viện mã vạch FMCG 250+ sản phẩm và Trình nhập CSV Safe Harbor.
- [ ] **Step 3: Chạy toàn bộ bộ kiểm thử tự động**
  Chạy `node tests/run_cli_tests.js`, `node tests/test_server_api.js`, `node tests/verify_ui.js`.
- [ ] **Step 4: Đồng bộ sang `grocery-app/` và `Nhom_11/`**
  Sao chép các file `admin.html`, `pos.html`, `store.html`, `shared/core.js`, `data/` sang `grocery-app/` và `Nhom_11/`.
- [ ] **Step 5: Đóng gói lại `Nhom_11.zip` và commit**
  ```bash
  git add -A
  git commit -m "feat(release): release commercial retail build with FMCG master barcode database and safe harbor CSV import"
  ```
