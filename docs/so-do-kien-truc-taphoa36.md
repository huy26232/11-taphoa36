# SƠ ĐỒ KIẾN TRÚC HỆ THỐNG TẠP HÓA 36 (TAPHOA36 AI)
**Môn học:** Lập Trình Web — Trường Đại học Giao Thông Vận Tải TP.HCM (UTH)  
**Sinh viên thực hiện:** Trần Ngọc Lâm — MSSV: 034206001749  
**Cơ sở thực nghiệm:** Cửa Hàng Chính - Tạp Hóa 36 (UTH), 02 Võ Oanh, Thạnh Mỹ Tây, Bình Thạnh, TP.HCM  
**Công nghệ cốt lõi:** Multi-SPA Vanilla JS & Tailwind CSS | Node.js REST API | Microsoft SQL Server 2022 Developer Edition  

---

## 1. Sơ Đồ Khối Kiến Trúc Tổng Thể 3 Tầng (High-Performance 3-Tier Architecture)

Hệ thống được thiết kế theo mô hình 3 tầng hiện đại, phân tách độc lập giữa Tầng Trình Diễn (Presentation Layer), Tầng Dịch Vụ Nghiệp Vụ (Application / Service Layer) và Tầng Lưu Trữ Kép (Dual-Persistence Layer).

```mermaid
flowchart TD
    subgraph CLIENT["TẦNG TRÌNH DIỄN / MULTI-SPA CLIENT (Front-End)"]
        direction TB
        subgraph APPS["Các Ứng Dụng Độc Lập"]
            STORE["Store Online (store.html)<br/>- Khách hàng đặt mua 2H<br/>- Chatbot AI tìm kiếm<br/>- Giỏ hàng & Thanh toán"]
            POS["Quầy Thu Ngân (pos.html)<br/>- Giao diện 58/42% Widescreen<br/>- Barcode F1-F4, Cân điện tử<br/>- In nhiệt K80 & VietQR"]
            ADMIN["Quản Trị Trung Tâm (admin.html)<br/>- Bento Grid 12 cột, 8 Views<br/>- Quản lý 896 SP & 12 đơn<br/>- Điều khiển CSDL SQL Server"]
            KIETVAHUY["Chuyên Trang Kiệt & Huy<br/>- 8 Ngành hàng tĩnh chuyên sâu<br/>- React/Vite tích hợp sẵn"]
        end

        subgraph CORE["Lõi Dùng Chung (shared/core.js & acl_engine.js)"]
            SYNC_BUS["Real-Time Sync Bus<br/>BroadcastChannel & StorageEvent<br/>(Độ trễ dưới 50ms)"]
            DAL_ENGINE["Offline DAL Engine<br/>IndexedDB TapHoaSoDB<br/>Offline Queue tự động đồng bộ"]
            CRYPTO["Bảo Mật AES-GCM 256-bit<br/>Web Crypto API mã hóa sổ nợ"]
            AI_NLP["Động Cơ NLP TapHoa36 AI<br/>Khử dấu tiếng Việt, 10 Intents"]
        end
    end

    subgraph BACKEND["TẦNG DỊCH VỤ / BACKEND REST API (server.js - Cổng 3600)"]
        direction TB
        ROUTER["HTTP Request Router & CORS Handler"]
        AUTH_MW["RBAC & ACL Middleware<br/>Kiểm tra quyền Admin / Thu ngân"]
        
        subgraph ENDPOINTS["RESTful API Endpoints"]
            EP_PROD["/api/products<br/>GET / POST / DELETE<br/>(Quản lý 896 SP)"]
            EP_ORD["/api/orders<br/>GET / POST / DELETE<br/>(Đồng bộ hóa đơn)"]
            EP_BRANCH["/api/branches<br/>GET / POST / DELETE<br/>(Chi nhánh UTH)"]
            EP_SQL["/api/sql/status & /api/sql/orders<br/>(Cầu nối trực tiếp SQL Server)"]
            EP_STATIC["Static File Server<br/>HTML / JS / CSS / WebP / TSX"]
        end
    end

    subgraph DATA_TIER["TẦNG CƠ SỞ DỮ LIỆU / DUAL-PERSISTENCE LAYER"]
        direction TB
        subgraph RDBMS["Microsoft SQL Server 2022 (Developer Edition)"]
            SQL_MAIN[("Database: TapHoa36")]
            T_SP["dbo.SAN_PHAM (896 SP)"]
            T_LO["dbo.LO_HANG (Lô & Hạn Dùng)"]
            T_HD["dbo.HOA_DON (Hóa Đơn Bán)"]
            T_CT["dbo.CHI_TIET_HOA_DON"]
            T_DM["dbo.DANH_MUC (15 Ngành)"]
            T_VIEW["dbo.v_SanPhamSieuThi"]
        end

        subgraph FILE_DB["Cơ Sở Dữ Liệu Tệp / Dual-Write"]
            JSON_DB[("data/taphoa36_db.json<br/>Sao lưu đồng bộ tức thì")]
        end
    end

    subgraph EXTERNAL["DỊCH VỤ NGOÀI & PHẦN CỨNG BÁN LẺ"]
        VIETQR["VietQR / NAPAS 247<br/>MB Bank 034206001749"]
        K80_PRINTER["Máy In Nhiệt K80 (80mm)<br/>Trình điều khiển nhiệt ESC/POS"]
        SPEECH["Web Speech API<br/>Nhận dạng giọng nói tiếng Việt"]
        GITHUB["GitHub Repository<br/>huy26232/11-taphoa36.git"]
    end

    %% Client interconnections
    APPS <--> CORE

    %% Client to Backend
    STORE <--"HTTP REST / JSON"--> ROUTER
    POS <--"HTTP REST / JSON"--> ROUTER
    ADMIN <--"HTTP REST / JSON"--> ROUTER
    KIETVAHUY <--"HTTP Static & Bridge"--> ROUTER

    %% Backend internal
    ROUTER --> AUTH_MW
    AUTH_MW --> ENDPOINTS

    %% Backend to Database
    EP_PROD <--"Dual-Write CRUD"--> SQL_MAIN
    EP_PROD <--"Sync"--> JSON_DB
    EP_ORD <--"Trừ kho & Thêm hóa đơn"--> SQL_MAIN
    EP_ORD <--"Lưu vết đơn"--> JSON_DB
    EP_SQL <--"Truy vấn view/tables"--> T_VIEW
    SQL_MAIN --- T_SP & T_LO & T_HD & T_CT & T_DM

    %% External
    POS --> K80_PRINTER
    POS & STORE --> VIETQR
    STORE --> SPEECH
    CLIENT & BACKEND -.-> GITHUB
```

---

## 2. Sơ Đồ Luồng Dữ Liệu Giao Dịch & Đồng Bộ Thời Gian Thực (Transaction Sequence)

Quy trình xử lý một giao dịch bán hàng tại quầy POS hoặc đặt hàng trực tuyến trên Store Online, tự động trừ tồn kho và đồng bộ đa tab trong vòng dưới 50ms:

```mermaid
sequenceDiagram
    autonumber
    actor NV as Thu Ngân / Khách Hàng
    participant UI as Màn hình POS / Store Online
    participant Core as TapHoaCore (Sync & Dal)
    participant API as Node.js Backend (server.js:3600)
    participant SQL as MS SQL Server 2022 (TapHoa36)
    participant Admin as Màn hình Quản Trị (admin.html)

    NV->>UI: Quét mã vạch Barcode (F1) / Thêm vào giỏ
    UI->>Core: Tra cứu sản phẩm trong danh mục CSDL
    Core-->>UI: Trả về thông tin: Tên, Đơn giá, Tồn kho
    NV->>UI: Bấm Thanh Toán (F4) / Đặt Hàng (VietQR/Tiền mặt)
    
    rect rgb(240, 253, 244)
    Note over UI,API: Bước 1: Gửi đơn hàng vào Backend REST API
    UI->>API: POST /api/orders (id, items, total, paymentMethod)
    API->>API: Tính toán tổng tiền & Kiểm tra số lượng tồn kho
    API->>SQL: INSERT INTO dbo.HOA_DON (MaHD, TongTien, PhuongThucTT, NgayLap)
    API->>SQL: INSERT INTO dbo.CHI_TIET_HOA_DON & UPDATE dbo.LO_HANG (Trừ SoLuongTon)
    API->>API: Cập nhật tệp JSON sao lưu (data/taphoa36_db.json)
    API-->>UI: 201 Created (success: true, orderId)
    end

    rect rgb(254, 242, 242)
    Note over UI,Admin: Bước 2: Đồng bộ thời gian thực đa tab (<50ms)
    UI->>Core: TapHoaCore.sync.broadcast('PRODUCT_STOCK_CHANGED', payload)
    Core->>Admin: Phát tín hiệu qua BroadcastChannel / StorageEvent
    Admin->>Admin: Tự động gọi syncOrdersFromDatabase() & refreshProducts()
    Admin->>Admin: Làm mới bảng Hóa Đơn (12 đơn) & KPI Doanh Thu
    end

    rect rgb(248, 250, 252)
    Note over UI,NV: Bước 3: Xuất hóa đơn nhiệt K80 & Hoàn tất
    UI->>UI: In hóa đơn nhiệt K80 chuẩn 80mm có địa chỉ UTH
    UI-->>NV: Hiển thị thông báo: Thanh toán thành công, Đã lưu SQL Server!
    end
```

---

## 3. Sơ Đồ Thực Thể Quan Hệ Cơ Sở Dữ Liệu (Database ERD — SQL Server 2022)

Cơ sở dữ liệu quan hệ **`TapHoa36`** chuẩn hóa theo chuẩn Dạng Chuẩn 3 (3NF), gồm 6 thực thể chính đảm bảo toàn vẹn tham chiếu và kiểm toán dữ liệu:

```mermaid
erDiagram
    DANH_MUC ||--o{ SAN_PHAM : "chứa (1-n)"
    SAN_PHAM ||--o{ LO_HANG : "có lô nhập (1-n)"
    SAN_PHAM ||--o{ CHI_TIET_HOA_DON : "được bán trong (1-n)"
    LO_HANG ||--o{ CHI_TIET_HOA_DON : "xuất từ lô (1-n)"
    HOA_DON ||--|{ CHI_TIET_HOA_DON : "bao gồm chi tiết (1-n)"
    NHAN_VIEN ||--o{ HOA_DON : "lập hóa đơn (1-n)"
    NHAN_VIEN ||--o{ SAN_PHAM : "cập nhật cuối (1-n)"

    DANH_MUC {
        varchar(10) MaDanhMuc PK "Mã ngành hàng (DM01-DM15)"
        nvarchar(50) TenDanhMuc "Tên ngành hàng (Rau củ, Thịt cá, Gia vị...)"
        nvarchar(200) MoTa "Mô tả chi tiết nhóm hàng"
    }

    SAN_PHAM {
        varchar(15) MaSP PK "Mã vạch Barcode (EAN-13: 8936...)"
        nvarchar(150) TenSP "Tên mặt hàng tiêu dùng"
        varchar(10) MaDanhMuc FK "Tham chiếu bảng DANH_MUC"
        nvarchar(20) DonViTinh "Đơn vị tính (Hộp, Chai, Kg, Gói...)"
        decimal(18_2) GiaBan "Giá bán niêm yết tại quầy"
        bit LaHangTuoiSong "Cờ đánh dấu hàng tươi cần bảo quản lạnh"
        varchar(20) MaNVSuaCuoi FK "Mã nhân viên sửa đổi gần nhất"
        datetime NgaySuaCuoi "Dấu thời gian cập nhật"
    }

    LO_HANG {
        int MaLo PK "Mã lô hàng tự tăng (IDENTITY)"
        varchar(15) MaSP FK "Mã sản phẩm trong lô"
        date NgaySanXuat "Ngày sản xuất từ nhà cung cấp"
        date HanSuDung "Hạn sử dụng cảnh báo hết hạn"
        int SoLuongTon "Số lượng thực tế còn trong kho"
        decimal(18_2) GiaNhap "Giá vốn nhập kho từ NCC"
    }

    HOA_DON {
        varchar(20) MaHD PK "Mã hóa đơn duy nhất (HD_... hoặc #DH-...)"
        datetime NgayLap "Thời điểm thanh toán chính xác"
        decimal(18_2) TongTienHang "Tổng tiền trước chiết khấu"
        decimal(18_2) ThanhTien "Tổng tiền thực thu từ khách"
        nvarchar(50) PhuongThucTT "VietQR Napas 247 hoặc Tiền mặt COD"
        varchar(20) MaNV FK "Thu ngân thực hiện giao dịch"
    }

    CHI_TIET_HOA_DON {
        varchar(20) MaHD PK_FK "Tham chiếu HOA_DON"
        varchar(15) MaSP PK_FK "Tham chiếu SAN_PHAM"
        int MaLo FK "Tham chiếu lô xuất LO_HANG"
        decimal(10_2) SoLuong "Số lượng mua (hỗ trợ số thập phân cân ký)"
        decimal(18_2) DonGia "Đơn giá tại thời điểm bán"
        decimal(18_2) ThanhTien "Thành tiền của từng dòng hàng"
        decimal(18_2) SoTienGiam "Số tiền giảm giá / khuyến mãi"
    }

    NHAN_VIEN {
        varchar(20) MaNV PK "Tài khoản đăng nhập (admin, cashier...)"
        nvarchar(100) TenNV "Họ tên nhân viên UTH"
        varchar(20) VaiTro "Phân quyền: admin, cashier, warehouse, staff"
        varchar(100) MatKhau "Mật khẩu mã hóa / băm an toàn"
    }
```

---

## 4. Ma Trận Phân Quyền & Bảo Mật Hệ Thống (RBAC & Cryptography)

```mermaid
flowchart LR
    subgraph ROLES["Vai Trò Người Dùng (RBAC - shared/acl_engine.js)"]
        ADMIN_ROLE["Master Admin<br/>(admin / admin123)<br/>Anh Lâm - Chủ tiệm"]
        CASHIER_ROLE["Cashier (Thu ngân)<br/>(cashier / cashier123)<br/>Bán hàng quầy UTH"]
        WAREHOUSE_ROLE["Warehouse (Thủ kho)<br/>(kho / kho123)<br/>Nhập hàng & Nhà CC"]
        CUSTOMER_ROLE["Customer (Khách hàng)<br/>(Khách quen / Khách trọ)<br/>Store Online UTH"]
    end

    subgraph PERMISSIONS["Ma Trận Quyền Hạn Nghiệp Vụ"]
        P_ADMIN["Toàn quyền: Quản trị CSDL SQL Server,<br/>Phân quyền ACL, Xem Báo cáo tài chính,<br/>Xóa sản phẩm, Xóa đơn hàng"]
        P_POS["Quyền thu ngân: Quét Barcode, Mở đơn tạm,<br/>Thu tiền VietQR/Tiền mặt, In hóa đơn K80"]
        P_STOCK["Quyền kho: Nhập hàng +10, Kiểm lô,<br/>Xuất hủy hàng hỏng, Quản lý nhà cung cấp"]
        P_STORE["Quyền mua sắm: Xem 896 sản phẩm,<br/>Thêm giỏ hàng, Chatbot AI, Đặt giao 2H"]
    end

    subgraph SECURITY["Bảo Mật Dữ Liệu Cốt Lõi"]
        AES["Web Crypto API AES-GCM 256-bit<br/>Mã hóa thông tin sổ nợ thân quen"]
        INVARIANT["Bảo Vệ Không Phá Vỡ (Non-Destructive)<br/>Giữ vững 57/57 unit tests tự động"]
    end

    ADMIN_ROLE --> P_ADMIN & P_POS & P_STOCK & P_STORE
    CASHIER_ROLE --> P_POS & P_STORE
    WAREHOUSE_ROLE --> P_STOCK & P_STORE
    CUSTOMER_ROLE --> P_STORE

    P_ADMIN & P_POS & P_STOCK & P_STORE --- SECURITY
```

---

## 5. Bảng Đo Lường Chỉ Số Kỹ Thuật Thực Tế

| Thành Phần | Chỉ Số Thực Tế Đo Lường | Trạng Thái Kiểm Nghiệm |
| :--- | :--- | :--- |
| **Hệ Quản Trị CSDL** | Microsoft SQL Server 2022 (Developer Edition) | `ONLINE` (Cơ sở UTH) |
| **Tổng Danh Mục SP** | 896 sản phẩm thực tế thuộc 15 ngành hàng tiêu dùng | Đã nạp đầy đủ trong `dbo.SAN_PHAM` |
| **Tổng Số Hóa Đơn** | 12 hóa đơn thực tế (Đã làm sạch toàn bộ đơn rác) | Đồng bộ chuẩn trong `dbo.HOA_DON` |
| **Độ Trễ Đồng Bộ Đa Tab** | $< 50\text{ ms}$ qua `BroadcastChannel` | `AC-SYNC-02` (0ms measured) |
| **Thuật Toán Mã Hóa** | AES-GCM 256-bit qua chuẩn Web Crypto API | `AC-CRYPTO-01` to `03` PASS |
| **Bộ Kiểm Thử Tự Động** | **57/57 Unit Tests PASS (100% Xanh)** | `tests/run_cli_tests.js` |
| **Quy Chuẩn Giao Diện** | POS=PASS \| STORE=PASS \| ADMIN=PASS \| RULES=PASS | `tests/verify_ui.js` |
| **Phiên Bản Git Remote** | `https://github.com/huy26232/11-taphoa36.git` (Nhánh `main`) | Commit `5204bc6` |
