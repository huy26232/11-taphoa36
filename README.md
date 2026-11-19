# 🛒 HỆ THỐNG QUẢN LÝ BÁN LẺ & THƯƠNG MẠI ĐIỆN TỬ TẠP HÓA 36 (UTH)
### ĐỒ ÁN MÔN HỌC: LẬP TRÌNH WEB — TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI TP.HCM (UTH)
**Giảng viên hướng dẫn:** ThS. Trần Thịnh Mạnh Đức  
**Nhóm thực hiện:** Nhóm 11 | **Sinh viên phụ trách chính:** Trần Ngọc Lâm (MSSV: 034206001749)  
**Cơ sở thực nghiệm:** Cửa Hàng Chính - Tạp Hóa 36 (UTH), 02 Võ Oanh, Thạnh Mỹ Tây, Bình Thạnh, TP.HCM  
**Kho GitHub chính thức:** `https://github.com/huy26232/11-taphoa36.git`

---

## ⚡ HƯỚNG DẪN KHỞI CHẠY DỰ ÁN DÙNG BÌNH THƯỜNG (3 BƯỚC SIÊU TỐC)

### Cách 1: Khởi động 1-Click bằng tệp `run.bat` (Dành cho Windows - Khuyên dùng)
1. Tải hoặc Clone dự án về máy:
   ```bash
   git clone https://github.com/huy26232/11-taphoa36.git
   cd 11-taphoa36
   ```
2. Nhấp đúp chuột vào tệp **`run.bat`**.
3. Hệ thống sẽ tự động khởi động máy chủ Node.js cổng 3600 và tự động bật cả 3 giao diện trên trình duyệt (Store, POS, Admin) để sử dụng ngay!

---

### Cách 2: Khởi động bằng dòng lệnh Terminal / PowerShell (Windows, macOS, Linux)
1. **Yêu cầu môi trường:** Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản v16 trở lên).  
   *(Dự án dùng toàn bộ module native của Node.js: `http`, `fs`, `path`, `url`, nên **KHÔNG CẦN** gõ `npm install`, không sợ lỗi thiếu package)*.
2. **Khởi động Server:**
   ```bash
   node server.js
   ```
3. **Mở trình duyệt truy cập:**
   - 🛍️ **Cửa Hàng Trực Tuyến (Khách mua hàng):** [http://localhost:3600/store.html](http://localhost:3600/store.html)
   - ⚡ **Quầy Thu Ngân Bán Lẻ (POS thu ngân):** [http://localhost:3600/pos.html](http://localhost:3600/pos.html)
   - 🛡️ **Bảng Quản Trị Hệ Thống (Chủ tiệm Admin):** [http://localhost:3600/admin.html](http://localhost:3600/admin.html)
   - 🏪 **Chuyên Trang Ngành Hàng Kiệt & Huy:** [http://localhost:3600/kietvahuy](http://localhost:3600/kietvahuy)

---

### Cách 3: Chạy trực tiếp tệp HTML không cần bật Server (Chế độ Client-Side Standalone)
Nhờ kiến trúc **Offline-First Resilience**, bạn có thể nhấp đúp trực tiếp mở các file HTML mà không cần server:
- Mở `store.html`, `pos.html`, `admin.html` bằng trình duyệt Chrome, Edge, Safari hoặc Firefox.
- Dữ liệu sẽ tự động lưu trữ vào IndexedDB (`TapHoaSoDB`) và đồng bộ đa tab qua `BroadcastChannel` (<50ms).

---

## 💾 CƠ CHẾ CƠ SỞ DỮ LIỆU (DATABASE DUAL-MODE)

Hệ thống hỗ trợ cơ chế lưu trữ kép thông minh, phù hợp cho mọi máy tính chấm thi:

1. **Chế độ 1: CSDL Tệp Bền Vững Tích Hợp Sẵn (Mặc định)**
   - Toàn bộ 896 sản phẩm và 12 đơn hàng sạch được lưu trữ tại `data/taphoa36_db.json`.
   - Bất kỳ máy tính nào clone về cũng có sẵn toàn bộ dữ liệu mẫu, thêm/sửa/xóa đều được lưu vĩnh viễn trên đĩa cứng mà **không bắt buộc phải cài Microsoft SQL Server**.
2. **Chế độ 2: Microsoft SQL Server 2022 (Nếu máy có cài đặt)**
   - Cơ sở dữ liệu: `TapHoa36`.
   - File nạp CSDL đầy đủ: `taphoa36_populate_full.sql` hoặc `taphoa36_sqlserver_ssms.sql`.
   - Khi phát hiện SQL Server đang chạy, `server.js` sẽ tự động kết nối và đồng bộ 2 chiều qua ODBC Driver 18.

---

## 🧪 LỆNH CHẠY KIỂM THỬ TỰ ĐỘNG CHẤM ĐIỂM (TDD TEST SUITE)

```bash
# 1. Chạy 57 Unit Tests kiểm chứng toàn bộ nghiệp vụ (100% Xanh)
node tests/run_cli_tests.js

# 2. Chạy 8 bài test kiểm tra kết nối REST API Server
node tests/test_server_api.js

# 3. Kiểm định tiêu chuẩn giao diện và chống AI Slop
node tests/verify_ui.js
```

---

## 👥 THÀNH VIÊN NHÓM 11
- **Trần Ngọc Lam** (MSSV: 034206001749) — Phụ trách Quản trị Admin, CSDL SQL Server, Node.js REST API & Kiến trúc Lõi.
- **Nguyễn Vương Quốc Huy** (Leader) — Phụ trách Cửa hàng Online & Showcase E-commerce `store.html`.
- **Võ Tuấn Kiệt** — Phụ trách Cửa hàng Online & Phân loại ngành hàng `KietVaHuy`.
- **Phạm Chấn Nguyên** — Phụ trách Quầy thu ngân POS đa tab & Cân điện tử `pos.html`.
- **Nguyễn Minh Hiếu** — Phụ trách Quầy thu ngân POS, Quản lý ca & In nhiệt K80.
