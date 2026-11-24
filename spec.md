# 📑 ĐẶC TẢ KỸ THUẬT HỆ THỐNG "TẠP HÓA 36" (SYSTEM SPECIFICATION)
## Đề tài: Ứng dụng Tạp Hóa theo Yêu Cầu cho Người Mới Bắt Đầu (TapHoa36 / TapHoa36 AI)
### Học phần: Lập trình Web | Khoa CNTT - Trường Đại học Giao thông vận tải TP.HCM (UTH) | Nhóm 11

---

## 1. TỔNG QUAN DỰ ÁN & MỤC TIÊU NGHIỆP VỤ (PROJECT OVERVIEW)

### 1.1. Tầm nhìn & Mục tiêu Phát triển
Trong bối cảnh chuyển đổi số của ngành bán lẻ tiêu dùng, các tiệm tạp hóa truyền thống tại các khu dân cư và ngõ hẻm đô thị Việt Nam đang đối mặt với sự cạnh tranh gay gắt từ các chuỗi tiện lợi và sàn thương mại điện tử. Các giải pháp phần mềm hiện hành thường quá phức tạp, chi phí cao, đòi hỏi máy chủ cồng kềnh và khó tiếp cận với người tiêu dùng phổ thông cũng như chủ tiệm cao tuổi.

Dự án **"Tạp Hóa 36" (TapHoa36)** được xây dựng nhằm giải quyết toàn diện bài toán này:
1. **Dành cho Chủ tiệm & Thu ngân:** Cung cấp giải pháp bán lẻ và quản trị toàn diện:
   - Bán hàng tại quầy (POS) siêu tốc bằng phím tắt `F1` - `F8`, hỗ trợ đầu đọc mã vạch Barcode và cân điện tử hàng tươi sống.
   - Quản lý tồn kho thời gian thực, quản lý đơn nhập hàng Nhà cung cấp (Purchase Order) tự động cập nhật giá vốn bình quân và hạch toán Sổ Quỹ.
   - Mô-đun sinh tem mã vạch dán kệ hàng chuẩn kích thước decal 35x22mm hoặc trang A4 bằng SVG thuần.
   - In hóa đơn nhiệt K80 chuẩn 80mm ngay trên trình duyệt mà không cần cài đặt driver phức tạp.
2. **Dành cho Khách hàng dân cư:** Mang đến giao diện cửa hàng trực tuyến (`store.html`) tối giản, thân thiện, tải trang trong chớp mắt (< 0.2 giây), hỗ trợ tìm kiếm bằng giọng nói tiếng Việt, bộ lọc trượt khoảng giá, giỏ hàng trực quan, thanh toán linh hoạt (COD, VietQR NAPAS 247, ví điện tử), khả năng cài đặt ứng dụng PWA Native App, và trợ lý ảo thông minh **"TapHoa36 AI"** hỗ trợ 24/7.
3. **Tiêu chuẩn Kỹ thuật & Học thuật UTH:**
   - Tuân thủ quy trình phần mềm bất biến: `spec.md ➔ plan.md ➔ tasks.md ➔ tests/ ➔ Code`.
   - Mô hình dữ liệu Single Source of Truth (SSOT), bảo mật phân quyền Role-Based Access Control (RBAC).
   - Đồng bộ đa tab tức thì qua `BroadcastChannel` (< 50ms) và lưu trữ ngoại tuyến Offline-First PWA (Service Worker + Web App Manifest + IndexedDB).
   - Mã hóa dữ liệu nhạy cảm E2E bằng Web Crypto API (AES-GCM 256-bit).
   - Quy chuẩn thương hiệu duy nhất: `TapHoa36` / `Tạp Hóa 36` / `TapHoa36 AI`. Cơ sở chính UTH: `Cửa Hàng Chính - Tạp Hóa 36 (UTH)`, địa chỉ `Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam`, Hotline `1900 6522`.

---

## 2. KIẾN TRÚC HỆ THỐNG & TỔ CHỨC FILE (SYSTEM ARCHITECTURE)

Hệ thống được tổ chức theo kiến trúc **Modular Multi-Page Application (MPA) kết hợp Offline-First Progressive Web App (PWA) và Single Source of Truth (SSOT)**:

```
d:\download\LAP TRINH WEB\
├── store.html                ← Cửa hàng mua sắm trực tuyến cho khách hàng dân cư (PWA enabled)
├── pos.html                  ← Giao diện thu ngân bán lẻ tại quầy (Desktop 2 cột Widescreen / Tablet)
├── admin.html                ← Cổng quản trị Bento Grid Widescreen (Top Horizontal Navbar)
├── sw.js                     ← Service Worker PWA (Cache-First, Stale-While-Revalidate, Background Sync)
├── manifest.json             ← Web App Manifest chuẩn PWA Native App
├── shared/
│   └── core.js               ← Lõi hạt nhân dùng chung (Auth, Storage DAL, Sync, Crypto, Barcode SVG, AI)
├── server.js                 ← Backend REST API (Node.js + SQL Server 2022 & JSON DB Fallback)
├── tests/
│   ├── test_suite.js         ← Bộ kiểm thử TDD tự động kiểm chứng 100% Acceptance Criteria
│   ├── run_cli_tests.js      ← Test runner trên môi trường CLI Node.js
│   ├── verify_ui.js          ← Kịch bản kiểm thử giao diện tự động
│   └── test_runner.html      ← Trình chạy kiểm thử giao diện trực quan trên trình duyệt
├── spec.md                   ← Bản đặc tả kỹ thuật này (Product Specification)
├── plan.md                   ← Kế hoạch triển khai & Ma trận RACI (Implementation Plan)
└── tasks.md                  ← Danh mục nhiệm vụ WBS & Test plan (Task Planner)
```

### 2.1. Sơ đồ Luồng Dữ Liệu & Kiến Trúc Phân Lớp

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              TẦNG GIAO DIỆN & PWA (UI LAYER)                           │
│                                                                                        │
│   ┌─────────────────────┐      ┌─────────────────────┐      ┌──────────────────────┐   │
│   │     store.html      │      │      pos.html       │      │      admin.html      │   │
│   │  (Khách mua hàng)   │      │  (Thu ngân tại quầy)│      │  (Chủ tiệm quản trị) │   │
│   │                     │      │                     │      │  Top Navbar 2 Tầng   │   │
│   │ • Trưng bày 12 ngành│      │ • Màn hình chia đôi │      │ • Tổng quan (Img 2)  │   │
│   │ • Price Slider      │      │ • Barcode scanner   │      │ • Kho & Tem (Img 4)  │   │
│   │ • Giỏ hàng & Ship 2H│      │ • Cân điện tử F6    │      │ • In Tem Kệ 35x22mm  │   │
│   │ • Chatbot TapHoa36AI│      │ • Hàng không mã F7  │      │ • Đơn đa kênh(Img 6) │   │
│   │ • PWA Install Banner│      │ • Đổi trả hàng F8   │      │ • Thu chi & Nợ(Img 8)│   │
│   │ • Ẩn nút Admin/POS  │      │ • Tiền mặt / VietQR │      │ • Đơn Nhập Hàng (PO) │   │
│   │   với khách thường  │      │ • In Bill nhiệt K80 │      │ • Settings Modal ⚙️  │   │
│   └──────────┬──────────┘      └──────────┬──────────┘      └──────────┬───────────┘   │
└──────────────┼────────────────────────────┼────────────────────────────┼───────────────┘
               │                            │                            │
               ▼                            ▼                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TẦNG SERVICE WORKER & OFFLINE PWA (SW.JS)                       │
│                                                                                        │
│  • Precache App Shell (HTML, CSS, JS, Fonts, Manifest)                                 │
│  • Dynamic Caching (Stale-While-Revalidate cho /api/products, /api/branches)           │
│  • Background Sync & Offline Mutation Retry Queue (Exponential Backoff: 1s, 2s, 4s...) │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           TẦNG LÕI HẠT NHÂN (SHARED/CORE.JS)                           │
│                                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────────┐  │
│  │   Auth & RBAC Module  │  │   Real-time Sync Bus  │  │   Storage DAL Engine      │  │
│  │ • Mock OAuth2 Google  │  │ • BroadcastChannel    │  │ • IndexedDB (TapHoaSoDB)  │  │
│  │ • Mock OAuth2 Facebk  │  │   'taphoaso_bus'      │  │   (Products, Orders,      │  │
│  │ • RBAC Guard 4 roles: │  │ • Fallback to storage │  │    Debts, Flows, POs,     │  │
│  │   Customer, Cashier,  │  │   events (< 50ms)     │  │    Branches, Suppliers)   │  │
│  │   Warehouse, Admin    │  │ • Mutex & Anti-race   │  │ • Dual-Mode REST Client   │  │
│  └───────────────────────┘  └───────────────────────┘  └───────────────────────────┘  │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────────┐  │
│  │  E2E Encryption API   │  │  Export & Print Engine│  │    TapHoa36 AI Engine     │  │
│  │ • Web Crypto API      │  │ • SheetJS / CSV BOM   │  │ • NLP tiếng Việt chuẩn hóa│  │
│  │ • AES-GCM 256-bit     │  │ • Barcode SVG Gen     │  │ • Tokenizer & 10 Intents  │  │
│  │ • Bảo vệ Sổ nợ & PII  │  │ • Tem Kệ Decal 35x22mm│  │ • Affinity Recommender    │  │
│  │   khách quen          │  │ • In hóa đơn K80 80mm │  │ • Dynamic Price Optimizer │  │
│  └───────────────────────┘  └───────────────────────┘  └───────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ĐẶC TẢ CHI TIẾT TỪNG PHÂN HỆ NGHIỆP VỤ (MODULE SPECIFICATIONS)

---

### MODULE 1: THƯ VIỆN LÕI HẠT NHÂN DÙNG CHUNG (`shared/core.js`)

`shared/core.js` là hạt nhân dữ liệu và nghiệp vụ của toàn bộ hệ thống, phơi bày đối tượng toàn cục `window.TapHoaCore`.

#### 1.1. Phân hệ Xác thực & Phân quyền (Auth & RBAC Service)
- **Tài khoản mặc định (Hardcoded Seed Users):**
  1. `admin` / `admin123`: Tên "Trần Ngọc Lâm", vai trò `admin`, SĐT: `0901234567`.
  2. `staff` / `staff123`: Tên "Thu ngân: Minh Tuấn", vai trò `cashier`, SĐT: `0912345678`.
  3. `khachhang1` / `123`: Tên "Khách hàng: Chị Lan", vai trò `customer`, SĐT: `0987654321`.
  4. `khachhang2` / `123`: Tên "Khách hàng: Bác Ba", vai trò `customer`, SĐT: `0933221100`.
- **Cơ chế Mock OAuth2 Social Login:**
  - `TapHoaCore.auth.loginOAuth(provider)` (`'google'` | `'facebook'`):
    - Mở popup/modal giả lập xác thực OAuth2, trả về hồ sơ người dùng hợp lệ với vai trò mặc định `customer`.
    - Tự động lưu vào session hiện tại và phát sự kiện `USER_AUTH_CHANGED`.
- **Phân quyền truy cập (RBAC Matrix):**
  | Quyền hạn / Tính năng | Customer (Khách mua) | Cashier (Thu ngân) | Admin (Chủ tiệm) |
  |---|:---:|:---:|:---:|
  | Xem hàng, đặt hàng trên `store.html` | ✅ | ✅ | ✅ |
  | Chat với TapHoa36 AI trên `store.html` | ✅ | ✅ | ✅ |
  | Truy cập màn hình thu ngân `pos.html` | ❌ (Chặn/Redirect) | ✅ | ✅ |
  | Quét barcode, cân điện tử, tạo đơn POS | ❌ | ✅ | ✅ |
  | Ghi sổ nợ khách quen tại quầy POS | ❌ | ✅ | ✅ |
  | In hóa đơn nhiệt K80 | ❌ | ✅ | ✅ |
  | Truy cập bảng quản trị `admin.html` | ❌ (Chặn/Redirect) | ❌ (Chặn/Redirect) | ✅ |
  | Quản lý Đơn nhập hàng (PO) & Sổ Quỹ | ❌ | ❌ | ✅ |
  | In tem mã vạch dán kệ hàng loạt | ❌ | ❌ | ✅ |
  | Xem và giải mã Sổ nợ quen xóm | ❌ | ❌ | ✅ |
  | Cài đặt cấu hình tiệm, máy in, chi nhánh | ❌ | ❌ | ✅ |
  | Hiển thị Quick Switcher (Chuyển nhanh) | ❌ (ẨN HOÀN TOÀN) | ✅ (Store/POS) | ✅ (Store/POS/Admin)|

#### 1.2. Phân hệ Đồng bộ Đa Tab Thời Gian Thực (Real-time Sync Engine)
- Sử dụng API `BroadcastChannel('taphoaso_bus')` kèm fallback `StorageEvent`.
- **Các loại sự kiện đồng bộ chuẩn:**
  1. `PRODUCT_STOCK_CHANGED`: `{ productId, newStock, delta, source }` (Cập nhật tồn kho đa tab < 50ms).
  2. `ORDER_CREATED`: `{ orderId, orderType, total, customerName, timestamp }`.
  3. `DEBT_RECORD_UPDATED`: `{ debtId, customerName, amount, status }`.
  4. `PURCHASE_ORDER_UPDATED`: `{ poId, status, totalAmount }`.
  5. `INVENTORY_MIN_STOCK_ALERT`: `{ productId, productName, currentStock, minStock }`.
  6. `DATA_CLEARED`: Phát khi chủ tiệm dọn sạch kho dữ liệu.
  7. `USER_AUTH_CHANGED`: Đồng bộ trạng thái phiên làm việc giữa tất cả các tab.

#### 1.3. Phân hệ Lưu trữ Ngoại tuyến & DAL Engine (Storage DAL)
- **IndexedDB `TapHoaSoDB` (Version 1):**
  - `products`: Mã barcode, tên, ngành hàng, giá vốn, giá bán, tồn kho, minStock, HSD, đơn vị tính.
  - `orders`: Mã đơn, danh sách món, tổng tiền, phương thức thanh toán, trạng thái, ngày tạo.
  - `debts`: Mã nợ, tên khách, SĐT, số tiền, ngày mua, trạng thái (mã hóa AES-GCM).
  - `cash_flows`: Mã phiếu, loại (thu/chi), số tiền, lý do, ngày lập, người lập.
  - `purchase_orders`: Mã đơn PO, nhà cung cấp, danh sách món nhập, tổng tiền, trạng thái nhập kho, công nợ.
  - `suppliers`: Mã NCC, tên NCC, điện thoại, địa chỉ, công nợ hiện tại.
  - `branches`: Danh sách chi nhánh (hỗ trợ tạo chi nhánh mới tự động).
  - `settings`: Cấu hình thông tin tiệm, máy in, máy quét.
  - `offline_queue`: Hàng đợi thao tác ngoại tuyến tự động retry khi có mạng.
- **Dual-Mode Client Bridge:**
  - Tự động kiểm tra backend REST API (`/api/health`, `/api/products`).
  - Nếu backend Node.js + SQL Server 2022 đang chạy: Ưu tiên đồng bộ hai chiều REST API.
  - Nếu backend ngoại tuyến: Hoạt động trơn tru 100% trên IndexedDB + LocalStorage mà không hề gián đoạn nghiệp vụ.

#### 1.4. Phân hệ Sinh Mã Vạch SVG Thuần (Barcode Shelf Label Generator)
- Hàm `TapHoaCore.barcode.generateSVG(code, type = 'CODE128', options)`:
  - Sinh chuỗi mã vạch `<svg>` vector thuần túy, siêu nhẹ (< 2KB), sắc nét tuyệt đối trên mọi độ phân giải máy in.
  - Hỗ trợ chuẩn Code 128 (mã nội bộ tiệm) và EAN-13 (sản phẩm thương mại Việt Nam đầu số 893).
  - Khổ in tem nhãn chuẩn kệ hàng: **35mm x 22mm** và **trang A4 (lưới 3 tem x 10 hàng)**.

#### 1.5. Phân hệ Bảo mật Mã hóa Đầu Cuối (E2E Web Crypto API)
- Sử dụng thuật toán AES-GCM 256-bit qua `window.crypto.subtle`.
- Dẫn xuất khóa PBKDF2 (SHA-256, 100.000 vòng lặp) từ passphrase bí mật.
- Mã hóa toàn bộ dữ liệu Sổ nợ quen xóm (`debts`) và PII khách hàng trước khi lưu trữ.

#### 1.6. Động cơ Trí tuệ Nhân tạo TapHoa36 AI (`TapHoa36 AI Engine`)
- **NLP Pipeline Tiếng Việt:**
  - `normalize(text)`: Khử dấu thanh Unicode NFD chuẩn xác.
  - `tokenize(text)`: Tách cụm từ và loại bỏ stop words.
  - `classifyIntent(text)`: Nhận diện 10 nhóm ý định người dùng (GREETING, FIND_PRODUCT, PRICE_INQUIRY, CHECK_ORDER, SHIPPING_POLICY, PAYMENT_METHODS, PROMOTION_DEALS, RETURN_POLICY, DEBT_INQUIRY, THANKS) với độ tin cậy $\ge 0.85$.
  - `extractEntities(text, catalog)`: Bóc tách tên sản phẩm, số lượng, tầm giá.
- **Gợi ý Cá nhân hóa (Hybrid Recommender):**
  - Tính điểm theo ma trận trọng số hành vi (View = 1, Cart = 3, Purchase = 5) và vector sở thích ngành hàng.
- **Tối ưu Giá Bán Động (Dynamic Pricing):**
  - Quét hàng cận hạn sử dụng ($\le 5$ ngày) để đề xuất mức chiết khấu tối ưu (15% - 30%) giúp xả hàng nhanh thu hồi vốn.

---

### MODULE 2: BẢNG ĐIỀU KHIỂN QUẢN TRỊ BENTO GRID (`admin.html`)

Được thiết kế theo phong cách **Menu Hàng Ngang (Top Horizontal Navbar) chuẩn bán lẻ hiện đại (TapHoa36 Navbar)**, tuân thủ nguyên tắc **NON-DESTRUCTIVE RULE** (bảo lưu và tích hợp đầy đủ 100% nội dung, bảng biểu từ 6 file mẫu gốc `Image 2, 4, 6, 8, 10, 12.html`):

#### 2.1. Cấu trúc Giao diện Menu Hàng Ngang 2 Tầng
- **Tầng 1 - Utility Header (Thanh tiện ích trên cùng):**
  - Logo thương hiệu `TẠP HÓA 36` kèm nhãn UTH Web v2.4.
  - Hotline hỗ trợ: `📞 1900 6522` (Hỗ trợ 24/7).
  - Chi nhánh hoạt động: `🏢 Cửa Hàng Chính - Tạp Hóa 36 (UTH) ▼` (hỗ trợ chuyển đổi hoặc tự tạo chi nhánh mới).
  - Trạng thái mạng: Network Status Pill "🟢 Trực tuyến" / "🔴 Ngoại tuyến".
  - Nút chuyển Dark Mode toàn cục.
  - Nút Bánh Răng Cài Đặt (⚙️ Settings): Mở Modal Cài Đặt hệ thống toàn diện.
  - Chuông thông báo (🔔) & User Profile (👤 Trần Ngọc Lâm - Admin).
- **Tầng 2 - Main Navigation Bar (Thanh Menu Xanh Dương `#0070e0`):**
  - Các tab ngang có dropdown chuẩn chỉ:
    1. **📊 Tổng quan:** Bento Grid Dashboard (Doanh thu, nhịp bán theo giờ, đơn giao nhanh 2H, hàng cận date từ `Image 2.html`).
    2. **📦 Hàng hóa ▼:** Quản lý kho thời gian thực, Quét mã vạch, Cây 12 ngành hàng (`Image 4.html` + `Image 12.html`).
    3. **🏷️ In Tem Mã Vạch:** Chức năng in hàng loạt tem nhãn dán kệ hàng kích thước chuẩn 35x22mm hoặc trang A4 bằng SVG thuần.
    4. **📥 Nhập hàng (PO) ▼:** Quản lý Đơn nhập hàng Nhà cung cấp (Purchase Order), kiểm đếm nhập kho, cập nhật giá vốn bình quân và hạch toán Sổ Quỹ.
    5. **📋 Đơn hàng ▼:** Đơn hàng đa kênh, Cảnh báo quá hạn 2H, Gom đơn theo hẻm (`Image 6.html`).
    6. **👥 Khách hàng ▼:** Sổ nợ quen xóm (mã hóa AES-GCM), Danh sách khách quen.
    7. **💰 Sổ quỹ ▼:** Báo cáo thu chi & dòng tiền tiệm, Lập phiếu thu/chi, Kiểm két kết ca F4 (`Image 8.html`).
    8. **📈 Báo cáo ▼:** Báo cáo doanh thu lọc theo Ngày/Tháng, Xuất file Excel (UTF-8 BOM) và PDF.
    9. **🌐 Bán online:** Trạng thái đồng bộ với `store.html`, Gợi ý tối ưu giá TapHoa36 AI.
  - **GÓC PHẢI THANH XANH: NÚT TRẮNG NỔI BẬT "🛒 Bán hàng" (F1):**
    - Phím tắt `F1`, liên kết chuyển tức thì sang màn hình thu ngân quầy `pos.html`.

#### 2.2. Modal Cài Đặt Hệ Thống (Settings Modal ⚙️) & Quản Lý Dữ Liệu
- Toàn bộ cấu hình phức tạp (kết nối máy in hóa đơn K80 Xprinter XP-Q80I, máy in tem XP-350B, cấu hình cổng barcode scanner, tạo chi nhánh mới) được gom gọn vào Modal Settings.
- Chức năng Quản lý Dữ liệu:
  - Nút **"🧹 Xóa sạch dữ liệu mẫu"** (`clearAllData()`): Cho phép dọn trống kho dữ liệu để tự nhập danh mục hàng thực tế.
  - Nút **"🔄 Nạp lại dữ liệu chuẩn UTH"**: Khôi phục lại dữ liệu mẫu chất lượng cao.
  - Form popup **"+ Thêm mới sản phẩm"**: Nhập nhanh tên hàng, barcode, giá vốn, giá bán, tồn kho ban đầu.

---

### MODULE 3: MÀN HÌNH THU NGÂN BÁN LẺ TẠI QUẦY (`pos.html`)

Màn hình bán hàng tối ưu cho PC màn hình ngang Widescreen và máy tính bảng Tablet:

#### 3.1. Thiết kế Giao diện Chia đôi (Desktop Split Screen)
- **Cột Trái (Catalog & Quick-Pick Grid - 58% chiều rộng):**
  - Thanh chọn nhanh 12 ngành hàng có biểu tượng trực quan.
  - Lưới phím tắt các món bán chạy nhất (Quick Sale items).
  - Ô tìm kiếm và quét mã vạch Barcode Scanner input.
  - **Tích hợp Cân điện tử (Phím tắt F6):**
    - Hỗ trợ nhập trọng lượng trực tiếp từ cân điện tử hoặc bàn phím.
    - Hỗ trợ bóc tách mã vạch cân điện tử GS1 có tiền tố `20` hoặc `21` (vd: `20 00123 01500 8`: mã hàng `00123`, trọng lượng `1.500 kg`) để tự động tính thành tiền.
  - **Phím tắt F7 (Hàng không mã):** Bán nhanh các mặt hàng dân dã không có bao bì tem nhãn (hành ngò, đá lạnh, túi xốp).
  - **Phím tắt F8 (Đổi trả hàng):** Xử lý nhập hoàn trả hàng lỗi và hoàn tiền hoặc đổi món mới.
- **Cột Phải (Hóa đơn hiện tại & Thanh toán - 42% chiều rộng):**
  - Danh sách mặt hàng khách mua: Tên hàng, Đơn vị, Đơn giá, Tăng giảm số lượng, Thành tiền.
  - 3 hình thức thanh toán linh hoạt:
    1. **Tiền mặt (Cash):** Các nút bấm mệnh giá nhanh (`20k`, `50k`, `100k`, `200k`, `500k`, `Đưa đủ`), tự động tính tiền thối trả lại khách hàng tức thì.
    2. **VietQR Động:** Tạo mã QR chuẩn NAPAS 247 chứa đúng số tiền và mã hóa đơn để khách quét thanh toán chuyển khoản.
    3. **Ghi nợ Sổ quen:** Ghi nhận vào bảng công nợ mã hóa AES-GCM.
  - In hóa đơn nhiệt K80 chuẩn 80mm ngay khi hoàn tất đơn.
  - Phím tắt bán hàng: `F1` (POS), `F2` (Thanh toán), `F3` (Focus Barcode), `F4` (Kiểm két), `F6` (Cân điện tử), `F7` (Hàng không mã), `F8` (Đổi trả), `ESC` (Hủy bill).
  - Nút `[⚙️ Về Quản Trị Admin]` (chỉ hiển thị khi người đăng nhập có vai trò `admin`).

---

### MODULE 4: CỬA HÀNG MUA SẮM TRỰC TUYẾN DÂN CƯ (`store.html`)

Cửa hàng trực tuyến tối giản, thân thiện cho mọi đối tượng khách hàng:
- Tải trang siêu tốc (< 0.2s), hỗ trợ đầy đủ tính năng PWA cài đặt về màn hình chính.
- Trưng bày 12 ngành hàng thiết yếu, đồng bộ tồn kho thực thời gian thực (< 50ms).
- **Bộ lọc trượt khoảng giá (Price Slider):** Cho phép lọc sản phẩm theo tầm giá mong muốn (từ 0đ đến 500.000đ).
- **Tìm kiếm bằng giọng nói tiếng Việt (Web Speech API Bridge)** & Tìm kiếm mờ không dấu.
- **Giỏ hàng trượt (Cart Drawer) & Đặt hàng 1 màn hình:**
  - Hỗ trợ giao nhanh 2H, miễn phí ship đơn $\ge 200.000₫$.
  - Tự động ghi nhớ thông tin giao hàng khách quen vào LocalStorage giúp đặt hàng nhanh lần sau.
  - Đăng nhập xã hội Mock OAuth2 (Google & Facebook).
- **BẢO MẬT RBAC:** Khách hàng thông thường hoặc khách vãng lai **TUYỆT ĐỐI KHÔNG THẤY** nút bấm hay liên kết chuyển sang Admin/POS.
- **Widget Trợ lý ảo TapHoa36 AI:** Giải đáp thắc mắc, báo giá và gợi ý sản phẩm 24/7.
- **PWA Install Banner:** Khuyến khích người dùng cài đặt ứng dụng về màn hình chính để mở nhanh và duyệt hàng offline.

---

### MODULE 5: KIẾN TRÚC OFFLINE-FIRST PWA (`sw.js` & `manifest.json`)

- **Web App Manifest (`manifest.json`):**
  - Name: `Tạp Hóa 36 - Quản Lý Bán Lẻ & POS`
  - Short Name: `TapHoa36`
  - Display: `standalone` (trải nghiệm không thanh URL như app native).
  - Theme Color: `#0284c7`, Background Color: `#f8fafc`.
  - Icons: Icon đa kích cỡ (192x192, 512x512, maskable).
  - Shortcuts: POS Bán hàng (`pos.html`), Quản trị (`admin.html`), Cửa hàng (`store.html`).
- **Service Worker (`sw.js`):**
  - Precaching App Shell: Caching toàn bộ mã HTML, JS, CSS, fonts tĩnh để ứng dụng mở được ngay cả khi hoàn toàn mất mạng.
  - Caching Strategy: Stale-While-Revalidate đối với dữ liệu sản phẩm và danh mục.
  - Offline Mutation Queue: Thuật toán Exponential Backoff tự động retry đẩy đơn hàng lên máy chủ khi kết nối mạng phục hồi.

---

### MODULE 6: QUẢN LÝ ĐƠN NHẬP HÀNG NHÀ CUNG CẤP (PURCHASE ORDER WORKFLOW)

- Vòng đời đơn nhập PO: `draft` ➔ `ordered` ➔ `received` ➔ `completed` / `cancelled`.
- **Tự động tăng tồn kho:** Khi đơn nhập chuyển sang trạng thái `received`, DAL tự động cộng dồn số lượng tồn kho của các mặt hàng tương ứng.
- **Tính toán Giá vốn Bình quân Gia quyền (Weighted Average Cost):**
  $$\text{Giá vốn mới} = \frac{(\text{Tồn cũ} \times \text{Giá vốn cũ}) + (\text{Số lượng nhập} \times \text{Giá nhập})}{\text{Tồn cũ} + \text{Số lượng nhập}}$$
- **Hạch toán Sổ Quỹ tự động:**
  - Khi thanh toán tiền mặt hoặc chuyển khoản, tự động tạo phiếu Chi trong Sổ Quỹ làm giảm số dư tồn quỹ tiền mặt.
  - Khi mua chịu hoặc thanh toán một phần, tự động ghi nhận số tiền còn thiếu vào Sổ công nợ Nhà cung cấp (`suppliers`).

---

## 4. BẢNG TIÊU CHÍ NGHIỆM THU CHI TIẾT (ACCEPTANCE CRITERIA - AC)

Bộ tiêu chí nghiệm thu được mở rộng toàn diện (67+ test cases) làm căn cứ để `@qa-planner` triển khai TDD:

### 4.1. Nhóm Xác thực, Phân quyền & Bảo mật (AC-AUTH)
- **AC-AUTH-01:** Xác thực đúng 4 tài khoản mặc định và gán đúng vai trò RBAC (`admin`, `cashier`, `customer`).
- **AC-AUTH-02:** Đăng nhập xã hội Mock OAuth2 (Google & Facebook) trả về vai trò mặc định `customer`.
- **AC-AUTH-03:** Hàm `protectPage()` từ chối vai trò `customer` khi truy cập trang Admin/POS và redirect về `store.html`.
- **AC-AUTH-04:** Ẩn hoàn toàn Quick Switcher hoặc link Admin/POS đối với khách hàng thông thường trên `store.html`.
- **AC-AUTH-05:** Hiển thị đầy đủ 3 tùy chọn (Store, POS, Admin) trên Quick Switcher khi đăng nhập tài khoản `admin`.
- **AC-AUTH-06:** Cho phép đăng nhập bằng tài khoản tạo mới từ ACL Engine.

### 4.2. Nhóm Đồng bộ Thời Gian Thực (AC-SYNC)
- **AC-SYNC-01:** Phát sự kiện `PRODUCT_STOCK_CHANGED` với đúng cấu trúc payload khi có giao dịch bán hoặc nhập hàng.
- **AC-SYNC-02:** Nhận và xử lý sự kiện đồng bộ đa tab với độ trễ cực thấp (< 50ms).
- **AC-SYNC-03:** Cập nhật trạng thái hết hàng và khóa nút mua khi số lượng tồn kho giảm về 0.
- **AC-SYNC-04:** Tự động kích hoạt cơ chế Fallback sang `StorageEvent` khi môi trường không có `BroadcastChannel`.

### 4.3. Nhóm Lưu trữ Ngoại tuyến & DAL Engine (AC-DAL)
- **AC-DAL-01:** Khởi tạo IndexedDB `TapHoaSoDB` thành công với đầy đủ các Object Stores.
- **AC-DAL-02:** Tự động nạp tối thiểu 30 sản phẩm mẫu trải dài trên 12 ngành hàng thiết yếu.
- **AC-DAL-03:** Lưu trữ đơn hàng vào `offline_queue` khi mất kết nối mạng.
- **AC-DAL-04:** Tự động đồng bộ và làm sạch `offline_queue` khi kết nối mạng phục hồi.
- **AC-DAL-05:** Hàm `clearAllData()` xóa sạch dữ liệu trong các bảng để người dùng tự nhập dữ liệu thực tế.

### 4.4. Nhóm Bảo mật Mã hóa Web Crypto API (AC-CRYPTO)
- **AC-CRYPTO-01:** Mã hóa AES-GCM 256-bit tạo ra chuỗi mã hóa kèm IV không thể đọc dạng plain text.
- **AC-CRYPTO-02:** Giải mã chính xác dữ liệu ban đầu 100% nguyên vẹn khi có passphrase hợp lệ.
- **AC-CRYPTO-03:** Thất bại khi giải mã với passphrase sai, bảo vệ an toàn tuyệt đối Sổ nợ khách quen.

### 4.5. Nhóm Báo cáo, Xuất Dữ liệu & In Hóa Đơn Nhiệt K80 (AC-EXPORT)
- **AC-EXPORT-01:** Xuất Excel/CSV chứa Byte Order Mark (`\uFEFF`) đảm bảo không bị lỗi font tiếng Việt.
- **AC-EXPORT-02:** Tạo mẫu hóa đơn K80 đạt chuẩn khổ in nhiệt 80mm với đầy đủ thông tin cửa hàng, tiền hàng, tiền thối và mã QR.
- **AC-EXPORT-03:** Định dạng cấu trúc báo cáo PDF tài chính cân đối thu - chi - tồn quỹ.
- **AC-EXPORT-04:** Hàm `exportProductsExcel` và `printFinancialReport` vận hành chính xác.

### 4.6. Nhóm Động Cơ Trí Tuệ Nhân Tạo TapHoa36 AI (AC-AI)
- **AC-AI-01:** Chuẩn hóa và khử dấu tiếng Việt chính xác (`removeAccents`).
- **AC-AI-02:** Phân loại câu hỏi tự nhiên vào 10 nhóm ý định (Intents) với độ tin cậy $\ge 0.85$.
- **AC-AI-03:** Trích xuất thực thể tên sản phẩm và tra cứu tồn kho thời gian thực.
- **AC-AI-04:** Thuật toán gợi ý cá nhân hóa chấm điểm sản phẩm theo ma trận tương tác hành vi.

### 4.7. Nhóm Bán Hàng Tại Quầy POS (AC-POS)
- **AC-POS-01:** Quét hoặc nhập mã vạch Barcode lập tức thêm sản phẩm vào giỏ hàng POS.
- **AC-POS-02:** Tính toán chính xác số tiền thối trả lại cho khách hàng tức thì.
- **AC-POS-03:** Tạo mã VietQR động chuẩn định dạng NAPAS 247 chứa đúng số tiền thanh toán.
- **AC-POS-04:** Tạo bản ghi Ghi nợ Sổ quen với đầy đủ thông tin tên và số điện thoại.
- **AC-POS-05:** Bắt sự kiện phím tắt thu ngân: `F1`, `F2`, `F3`, `F4`, `ESC`.
- **AC-POS-06:** Ẩn nút "Về Quản Trị Admin" trên màn hình POS khi người dùng không có vai trò `admin`.

### 4.8. Nhóm Quản Trị Cửa Hàng & Bento Grid (AC-ADMIN)
- **AC-ADMIN-01:** Tuân thủ Non-Destructive Rule: 6 views gốc hiện diện đầy đủ trong `admin.html`.
- **AC-ADMIN-02:** Chuyển đổi trạng thái tab giữa các phân hệ giao diện mượt mà.
- **AC-ADMIN-03:** Cấu trúc Bento Grid 12 cột Widescreen đáp ứng hiển thị trực quan.
- **AC-ADMIN-04:** Thao tác nhập kho nhanh `+10` tăng số lượng tồn kho sản phẩm ngay lập tức.
- **AC-ADMIN-05:** Lưu trữ và chuyển đổi chế độ Dark Mode toàn cục.
- **AC-ADMIN-06:** Báo cáo tài chính tính đúng 4 chỉ số: Tổng thu, Tổng chi, Tồn két, Tổng nợ.
- **AC-ADMIN-07:** TapHoa36 AI Dynamic Pricing đề xuất mức giảm giá từ 15% - 30% cho hàng cận hạn sử dụng.
- **AC-ADMIN-08:** Quick Switcher trên Admin cho phép chuyển tức thì sang `store.html` và `pos.html`.
- **AC-ADMIN-09:** Cung cấp thông tin điều hướng TapHoa36 Navbar với hotline `1900 6522`, chi nhánh UTH và phím tắt F1.

### 4.9. Nhóm Quản Lý Tài Khoản & Phân Quyền ACL (AC-ACL)
- **AC-ACL-01:** Khởi tạo Master Admin mặc định (`admin` / `admin123` - Trần Ngọc Lâm).
- **AC-ACL-02:** Thêm tài khoản nhân viên mới và gán vai trò (`cashier`, `warehouse`, `staff`).
- **AC-ACL-03:** Kiểm tra ma trận quyền: cashier không được xóa sản phẩm hoặc xem báo cáo tài chính.
- **AC-ACL-04:** Đổi mật khẩu tài khoản thành công khi nhập đúng mật khẩu cũ.
- **AC-ACL-05:** Ghi nhận nhật ký Audit log chính xác thời gian, hành động và người thực hiện.

### 4.10. Nhóm Quản Lý Dữ Liệu Sạch & Vòng Đời Kho Hàng (AC-CLEAN)
- **AC-CLEAN-01:** `initCleanStoreState` đảm bảo kho hàng và đơn hàng ở trạng thái rỗng an toàn khi cần.
- **AC-CLEAN-02:** `seedSampleStoreData` nạp danh mục sản phẩm mẫu chuẩn UTH.
- **AC-CLEAN-03:** `clearStoreData` yêu cầu mã xác nhận `XOA` để làm sạch kho hàng, chống xóa nhầm.

### 4.11. Nhóm Quản Lý Kho & Nhà Cung Cấp Mở Rộng (AC-WH / AC-SUPP / AC-EXP / AC-API)
- **AC-WH-01:** Điều chuyển kho giữa các chi nhánh có ghi nhận log chi tiết.
- **AC-WH-02:** Đóng gói combo sản phẩm: trừ tồn kho nguyên liệu lẻ và tăng tồn kho combo.
- **AC-WH-03:** Ghi giảm tồn kho vật tư tiêu hao nội bộ và hạch toán vào chi phí vận hành.
- **AC-WH-04:** Xuất hủy hàng hết hạn hoặc hư hỏng, ghi log hao hụt rõ ràng.
- **AC-SUPP-01:** Quản lý danh bạ Nhà cung cấp thực tế và công nợ.
- **AC-EXP-01:** Ghi nhận hóa đơn điện nước dịch vụ vào Sổ Quỹ chi phí.
- **AC-WH-05:** Cho phép người dùng tự tạo chi nhánh mới và lưu trữ động vào hệ thống.
- **AC-API-01:** Dual-Mode Client Bridge tự động fallback an toàn giữa SQL Server và IndexedDB.

### 4.12. Nhóm Progressive Web App & Offline-First (AC-PWA)
- **AC-PWA-01 (Manifest):** File `manifest.json` đầy đủ thông tin chuẩn PWA: name, short_name, display `standalone`, theme_color, background_color, icons đa kích thước và shortcuts điều hướng nhanh.
- **AC-PWA-02 (Service Worker Registration & Precaching):** File `sw.js` đăng ký thành công, tự động precache App Shell (`store.html`, `pos.html`, `admin.html`, `shared/core.js`) đảm bảo mở trang ngoại tuyến 100%.
- **AC-PWA-03 (Caching Strategy & Offline Mutation Queue):** Áp dụng Stale-While-Revalidate cho dữ liệu API động và lưu trữ các request thay đổi vào hàng đợi retry với thuật toán Exponential Backoff khi ngoại tuyến.

### 4.13. Nhóm Sinh Tem Mã Vạch Dán Kệ Hàng (AC-LABEL)
- **AC-LABEL-01 (Barcode SVG Generator):** Hàm `generateBarcodeSVG` sinh ra chuỗi `<svg>` chuẩn Code 128 / EAN-13 hợp lệ, không phụ thuộc thư viện ngoài, dung lượng < 2KB.
- **AC-LABEL-02 (Shelf Label Layout 35x22mm):** Định dạng tem nhãn chuẩn 35mm x 22mm chứa tên tiệm `TẠP HÓA 36`, tên sản phẩm, giá bán to đậm (`12pt - 14pt`), mã vạch SVG và đơn vị tính.
- **AC-LABEL-03 (Batch Shelf Label Printing):** Chức năng in hàng loạt tem nhãn trong `admin.html` hỗ trợ chọn số lượng tem cho từng sản phẩm và dàn trang in `@media print` không vỡ lề.

### 4.14. Nhóm Quản Lý Đơn Nhập Hàng Nhà Cung Cấp (AC-PO)
- **AC-PO-01 (Purchase Order Calculation):** Tạo đơn nhập hàng Nhà cung cấp tính toán chính xác tổng tiền hàng, số tiền đã trả và số dư công nợ NCC.
- **AC-PO-02 (Inventory & Weighted Average Cost Update):** Khi đơn nhập chuyển trạng thái sang `received`, tự động tăng số lượng tồn kho trong DAL và cập nhật lại đơn giá vốn bình quân gia quyền.
- **AC-PO-03 (Cash Flow Expense Integration):** Khi hoàn tất đơn nhập có thanh toán tiền mặt hoặc chuyển khoản, tự động tạo phiếu Chi trong Sổ Quỹ làm giảm số dư tồn quỹ tiền mặt.

### 4.15. Nhóm Cân Điện Tử POS & Hàng Bán Theo Trọng Lượng (AC-SCALE)
- **AC-SCALE-01 (Weight-Embedded Barcode Parsing):** Nhận diện và bóc tách chính xác mã vạch cân điện tử GS1 có tiền tố `20` hoặc `21` (vd: `20 00123 01500 8`), tự động trích xuất mã hàng `00123`, trọng lượng `1.500 kg` và tính thành tiền tức thì theo đơn giá/kg.

---

*Tài liệu đặc tả này là căn cứ kỹ thuật chính thức và toàn diện nhất của dự án Tạp Hóa 36 UTH.*
