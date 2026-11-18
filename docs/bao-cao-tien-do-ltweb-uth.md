# BÁO CÁO TIẾN ĐỘ ĐỀ TÀI MÔN LẬP TRÌNH WEB
## HỆ THỐNG QUẢN LÝ BÁN LẺ & CỬA HÀNG SỐ TẠP HÓA 36 (TAPHOA36)

---

- **Trường:** Đại học Giao Thông Vận Tải TP.HCM (UTH)
- **Khoa:** Công Nghệ Thông Tin
- **Môn học:** Lập Trình Web
- **Giảng viên hướng dẫn:** ThS. Trần Thịnh Mạnh Đức
- **Sinh viên thực hiện:** Trần Ngọc Lâm
- **Mã số sinh viên (MSSV):** 034206001749
- **Địa chỉ cơ sở thử nghiệm:** Trường ĐH Giao Thông Vận Tải TP.HCM - UTH (Số 2 Võ Oanh / 31 Ung Văn Khiêm, P. 25, Q. Bình Thạnh, TP.HCM)
- **Thời gian báo cáo:** Học kỳ I - Năm học 2026 - 2027

---

## 1. SƠ ĐỒ KIẾN TRÚC WEBSITE (3-TIER ARCHITECTURE)

Hệ thống được xây dựng theo kiến trúc 3 tầng chuẩn mực (3-Tier Enterprise Architecture), phân tách độc lập giữa tầng Giao diện (Presentation Tier), tầng Xử lý nghiệp vụ (Application / Business Logic Tier) và tầng Dữ liệu (Data Tier):

```
+-----------------------------------------------------------------------------------+
|                           1. TẦNG GIAO DIỆN (FRONT-END CLIENT)                    |
|                                                                                   |
|  [ POS Bán Hàng Tại Quầy ]      [ Cửa Hàng Trực Tuyến ]      [ Bento Admin 12 Cột ]|
|          (pos.html)                  (store.html)                 (admin.html)    |
|   • Quét Barcode máy tính bảng   • Tìm kiếm giọng nói tiếng Việt  • Quản lý 8 views |
|   • Tạo VietQR động NAPAS 247    • Giỏ hàng Drawer trượt         • Tự tạo kho UTH |
|   • In hóa đơn nhiệt K80 chuẩn   • Phân tích TapHoa36 AI Intent   • Phân quyền ACL |
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTP / HTTPS RESTful API
                                         | (GET, POST, DELETE, OPTIONS)
                                         | Headers: Content-Type: application/json
                                         v
+-----------------------------------------------------------------------------------+
|                        2. TẦNG XỬ LÝ NGHIỆP VỤ (BACK-END SERVER)                  |
|                                                                                   |
|                                Node.js REST API Server                            |
|                                      (server.js)                                  |
|   • CORS Preflight Handler (OPTIONS 204, Allow-Origin: *)                          |
|   • Asynchronous Body Parser (An toàn, chống Crash khi JSON rỗng/sai cú pháp)    |
|   • Products Controller: GET /api/products, POST /api/products                    |
|   • Orders Controller: GET /api/orders, POST /api/orders (Trừ kho tự động)       |
|   • Branches Controller: GET /api/branches, POST /api/branches, DELETE /api/...    |
|   • Cầu nối Dual-Mode Fallback: Tự động chuyển IndexedDB/LocalStorage khi offline |
+-----------------------------------------------------------------------------------+
                                         |
                                         | Data Access Layer (DAL)
                                         | Transaction / File I/O / SQL Queries
                                         v
+-----------------------------------------------------------------------------------+
|                            3. TẦNG CƠ SỞ DỮ LIỆU (DATABASE TIER)                   |
|                                                                                   |
|      [ JSON Database Engine ]                 [ CSDL Quan Hệ SQL Chuẩn 3NF ]      |
|       (data/taphoa36_db.json)                      (taphoa36_schema.sql)          |
|   • branches (Kho & Chi nhánh UTH)         • branches: id(PK), name, address...   |
|   • categories (Danh mục chuẩn 3NF)        • categories: id(PK), name, desc...    |
|   • products (Hàng hóa & Tồn kho)          • products: id(PK), barcode(UK), FK... |
|   • customers (Khách quen & Sổ nợ)         • customers: id(PK), phone, debt...    |
|   • orders & order_details (Hóa đơn)       • orders & order_details: PK, FK 1-N   |
|   • users_acl (Tài khoản RBAC)             • users_acl: username(UK), role...     |
+-----------------------------------------------------------------------------------+
```

---

## 2. DANH SÁCH CHỨC NĂNG ĐÃ HOÀN THÀNH VÀ CHƯA HOÀN THÀNH

### A. Các Chức Năng ĐÃ HOÀN THÀNH (100% Sẵn Sàng Vận Hành):
1. **Màn hình Bán hàng tại quầy POS (`pos.html`):**
   - Quét mã vạch tự động qua Camera / Máy quét Barcode USB, tự động nhảy số lượng vào giỏ.
   - Bắt phím tắt thu ngân chuẩn siêu thị: `F1` (Bán hàng), `F2` (Tìm kiếm), `F3` (Thanh toán), `ESC` (Hủy đơn).
   - Tự động tính tiền thừa trả khách tức thời với các phím gợi ý tiền mặt lẻ (10k, 20k, 50k, 100k, 200k, 500k).
   - Sinh mã VietQR động chuẩn NAPAS 247 khớp đúng số tiền của từng hóa đơn.
   - Chức năng Ghi nợ Sổ quen xóm, mã hóa bảo mật chuẩn Web Crypto AES-GCM 256-bit.
   - Xuất và in hóa đơn nhiệt K80 chuẩn khổ giấy 80mm ngay tại quầy.
2. **Cửa hàng mua sắm trực tuyến (`store.html`):**
   - Tìm kiếm hàng hóa bằng Giọng nói tiếng Việt (Web Speech API) và khử dấu tiếng Việt thông minh.
   - Giỏ hàng dạng Drawer trượt mượt mà, thanh tiến trình tự động nhắc "Mua thêm X để Freeship 200K".
   - Form đặt hàng đơn giản 1 bước (Single-step Checkout).
   - Đăng nhập xã hội Mock OAuth2 (Google & Facebook).
   - Trợ lý ảo TapHoa36 AI phân tích ý định tự nhiên (Intents & Entities).
3. **Bảng điều khiển Quản trị Bento Grid (`admin.html`):**
   - Cấu trúc Bento Grid 12 cột Widescreen hiện đại, hỗ trợ chuyển đổi Dark Mode toàn cục.
   - Thanh điều hướng hồng (Navbar) 8 phân hệ không bị cắt xén (clip), mở menu đa cột sắc nét.
   - **Tự tạo và quản lý kho linh hoạt:** Xóa bỏ danh sách fix cứng, cho phép thêm mới kho/chi nhánh động, xóa chi nhánh tự tạo, và bảo vệ an toàn cơ sở chính UTH.
   - Địa chỉ cơ sở chính được chuẩn hóa theo UTH: `Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 31 Ung Văn Khiêm, P. 25, Q. Bình Thạnh`.
   - Phân quyền người dùng Access Control List (ACL/RBAC): Master Admin, Quản lý, Thu ngân, Thủ kho.
   - Nghiệp vụ kho thực tế: Chuyển hàng giữa các kho, Đóng gói combo, Xuất dùng nội bộ, Xuất hủy hàng hao hụt, Quản lý nhà cung cấp, Sổ quỹ thu chi.
4. **Hệ thống Back-end Server & Cầu Nối API (`server.js` & `shared/core.js`):**
   - Server Node.js thuần native HTTP, xử lý CORS, Body Parser bất đồng bộ an toàn.
   - Cung cấp đầy đủ 8 REST API Endpoints chuẩn mực.
   - Cơ chế Dual-Mode Client Bridge: Tự động gọi API khi Server online, tự động fallback an toàn sang IndexedDB/LocalStorage khi offline.
5. **Cơ sở dữ liệu quan hệ (`taphoa36_schema.sql`):**
   - 7 bảng quan hệ chuẩn 3NF, ràng buộc khóa ngoại (Foreign Keys), Unique Keys, và nạp sẵn 10 sản phẩm mẫu UTH.
6. **Kiểm thử tự động:**
   - 57/57 Unit Tests PASSED (`tests/run_cli_tests.js`).
   - 100% UI Checks PASSED trên cả 3 trang (`tests/verify_ui.js`).

### B. Các Chức Năng ĐANG TIẾP TỤC PHÁT TRIỂN (Giai Đoạn Kế Tiếp):
1. Tích hợp thanh toán trực tuyến thực tế qua cổng PayOS / VNPay Sandbox.
2. Tích hợp WebRTC gọi video hỗ trợ trực tiếp giữa Thu ngân và Quản lý khi có khiếu nại tại quầy.
3. Đồng bộ hóa với API sàn thương mại điện tử (Shopee / TikTok Shop).

---

## 3. GIAO DIỆN CÁC TRANG CHÍNH

### Trang 1: Bán Hàng Tại Quầy Siêu Thị POS (`pos.html`)
- **Đặc điểm giao diện:** Chia cột công thái học (Trái 58% danh mục & giỏ hàng - Phải 42% bảng thanh toán). Nổi bật với nút chuyển nhanh tài khoản, ô quét Barcode to rõ, bảng tính tiền thối tự động, nút sinh mã VietQR và xem trước hóa đơn K80.

### Trang 2: Cửa Hàng Trực Tuyến Đa Năng (`store.html`)
- **Đặc điểm giao diện:** Gam màu Pastel ấm áp, banner Flash Sale, thanh tìm kiếm giọng nói kèm micro, danh mục thẻ sản phẩm có hiển thị trạng thái tồn kho thực tế, giỏ hàng Drawer trượt mượt mà từ cạnh phải, chatbot TapHoa36 AI lơ lửng góc phải dưới.

### Trang 3: Bảng Quản Trị Hệ Thống Bento Grid (`admin.html`)
- **Đặc điểm giao diện:** Header tích hợp chọn chi nhánh động UTH, thanh menu màu hồng Pastel gồm 8 phân hệ: Tổng quan, Hàng hóa, Mua hàng, Đơn hàng, Khách hàng, Sổ quỹ, Báo cáo, Phân quyền ACL. Dropdown menu hiển thị đa cột dạng lưới rõ ràng, có các Modal quản lý kho, nhập hàng, đổi mật khẩu và xuất Excel K80.

---

## 4. CÁC CHỨC NĂNG ĐÃ KẾT NỐI VỚI BACK-END

| STT | Chức Năng | Giao Diện Gửi (Front-end) | Endpoint Back-end | Phương Thức | Dữ Liệu Lưu CSDL |
|:---:|:---|:---|:---|:---:|:---|
| 1 | **Kiểm tra trạng thái máy chủ** | Client Ping định kỳ | `/api/health` | `GET` | Trả về thông tin UTH và thời gian Server |
| 2 | **Tải danh mục sản phẩm** | Mở trang POS / Store / Admin | `/api/products` | `GET` | Đọc bảng `products` |
| 3 | **Thêm sản phẩm mới vào kho** | Modal "Thêm hàng hóa" (Admin) | `/api/products` | `POST` | Ghi thêm bản ghi vào `products` |
| 4 | **Tạo đơn hàng & Trừ kho** | Nhấn "Thanh toán" (POS / Store) | `/api/orders` | `POST` | Ghi bảng `orders`, `order_details`, trừ tồn `products` |
| 5 | **Lấy danh sách đơn hàng** | Phân hệ Đơn hàng (Admin) | `/api/orders` | `GET` | Đọc toàn bộ lịch sử từ bảng `orders` |
| 6 | **Tải danh sách chi nhánh / kho** | Dropdown Header (Admin) | `/api/branches` | `GET` | Đọc bảng `branches` |
| 7 | **Tự tạo chi nhánh mới** | Modal "Thêm chi nhánh" (Admin) | `/api/branches` | `POST` | Ghi thêm chi nhánh vào `branches` |
| 8 | **Xóa chi nhánh tự tạo** | Modal "Quản lý chi nhánh" | `/api/branches/:id` | `DELETE` | Xóa bản ghi trong `branches` (Bảo vệ UTH) |

---

## 5. CÁCH GỬI DỮ LIỆU TỪ FRONT-END LÊN SERVER

Front-end sử dụng API chuẩn `fetch()` của trình duyệt (thông qua tầng trung gian `TapHoaCore.api`) để gửi các yêu cầu HTTP bất đồng bộ:

### A. Phương thức GET (Lấy dữ liệu):
```javascript
// Gửi yêu cầu lấy danh sách sản phẩm từ Back-end
async function fetchProductsFromBackend() {
  const response = await fetch('http://localhost:3600/api/products', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  if (response.ok) {
    const products = await response.json();
    return products;
  }
}
```

### B. Phương thức POST (Gửi dữ liệu tạo mới kèm JSON Payload):
```javascript
// Gửi dữ liệu đơn hàng khi thu ngân nhấn Hoàn tất thanh toán
async function submitOrderToBackend(orderData) {
  const payload = {
    customerName: 'Sinh viên UTH Võ Oanh',
    customerPhone: '0988776655',
    items: [
      { id: 'prod_03', barcode: '893601111003', name: 'Mì gói Hảo Hảo', price: 5000, quantity: 4 }
    ],
    paymentMethod: 'vietqr',
    branchId: 'branch_main'
  };

  const response = await fetch('http://localhost:3600/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  console.log('Đơn hàng được lưu trên Server với mã:', result.orderId);
  return result;
}
```

---

## 6. CÁCH BACK-END XỬ LÝ DỮ LIỆU VÀ TRẢ KẾT QUẢ VỀ FRONT-END

Mã nguồn Back-end (`server.js`) xử lý các yêu cầu theo quy trình chuẩn:
1. **Thiết lập CORS Headers:** Cho phép trình duyệt gọi API từ các cổng hoặc tệp tĩnh khác nhau (`Access-Control-Allow-Origin: *`).
2. **Thu thập Stream Dữ liệu (Asynchronous Body Parser):** Lắng nghe các chunk dữ liệu trên luồng HTTP request, ghép chuỗi và phân giải `JSON.parse(body)` an toàn trong khối `try...catch`.
3. **Thực thi Nghiệp vụ & Kiểm Tra Hợp Lệ (Validation & Business Logic):**
   - Với đơn hàng: Kiểm tra danh sách mặt hàng không được rỗng, tính toán tổng tiền, tự động cập nhật trừ tồn kho `stock = Math.max(0, stock - quantity)`.
   - Với chi nhánh: Kiểm tra tên chi nhánh, sinh mã UUID/ID mới, ghi vào CSDL.
4. **Ghi Dữ Liệu Vào Cơ Sở Dữ Liệu:** Cập nhật tệp JSON (`data/taphoa36_db.json`) hoặc câu lệnh SQL tương ứng.
5. **Đóng gói Phản hồi HTTP (Response):**
   - Trả về mã trạng thái `201 Created` kèm payload JSON kết quả:
```json
{
  "success": true,
  "orderId": "HD_1794979560955",
  "total": 20000,
  "order": {
    "id": "HD_1794979560955",
    "branchId": "branch_main",
    "items": [...],
    "total": 20000,
    "paymentMethod": "vietqr",
    "customerName": "Sinh viên UTH Võ Oanh",
    "createdAt": "2026-11-18T05:26:00.955Z"
  }
}
```

---

## 7. THIẾT KẾ CƠ SỞ DỮ LIỆU (RELATIONAL DATABASE SCHEMA 3NF)

Cơ sở dữ liệu bao gồm 7 bảng liên kết chặt chẽ qua các quan hệ 1-N (One-to-Many):

```
+------------------+         +--------------------+         +------------------+
|     branches     | 1     N |      products      | N     1 |    categories    |
|------------------+---------+--------------------+---------+------------------|
| id (PK)          |         | id (PK)            |         | id (PK)          |
| name             |         | barcode (UK)       |         | name             |
| address          |         | name               |         | description      |
| phone            |         | category_id (FK)   |         +------------------+
| type             |         | branch_id (FK)     |
| is_default       |         | cost_price         |
| created_at       |         | price              |
+------------------+         | stock              |
         | 1                 | unit               |
         |                   | expiry_days        |
         |                   | created_at         |
         |                   +--------------------+
         |                             | 1
         |                             |
         |                             | N
         | N                 +--------------------+
+------------------+ 1     N |   order_details    |
|      orders      |---------+--------------------+
|------------------+         | id (PK)            |
| id (PK)          |         | order_id (FK)      |
| order_code (UK)  |         | product_id (FK)    |
| branch_id (FK)   |         | quantity           |
| customer_id (FK) |         | unit_price         |
| total_amount     |         | subtotal           |
| discount_amount  |         +--------------------+
| final_amount     |
| payment_method   |
| status           |
| created_at       |
+------------------+
         | N
         |
         | 1
+------------------+
|    customers     |
|------------------|
| id (PK)          |
| name             |
| phone (UK)       |
| group_code       |
| debt_amount      |
| created_at       |
+------------------+
```

---

## 8. MINH CHỨNG THỰC HÀNH: KỊCH BẢN QUAY CLIP DEMO (7 - 10 PHÚT)

### Chuẩn Bị Trước Khi Bấm Quay:
1. Mở Terminal 1: Chạy `node server.js` (Server hiển thị thông báo lắng nghe tại `http://localhost:3600`).
2. Mở trình duyệt Chrome: Mở 2 tab:
   - Tab 1: `http://localhost:3600/pos.html` (Màn hình POS) kèm mở sẵn `F12` -> tab **Network**.
   - Tab 2: `http://localhost:3600/admin.html` (Bảng quản trị Admin).
3. Mở VS Code / Notepad: Mở tệp `data/taphoa36_db.json` để chứng minh dữ liệu được ghi vào ổ cứng.

---

### Kịch Bản Chi Tiết Từng Phút (7-10 Phút):

#### Phút 00:00 - 01:30 | Giới Thiệu Đề Tài & Sơ Đồ Kiến Trúc
- Sinh viên giới thiệu: *"Kính chào thầy ThS. Trần Thịnh Mạnh Đức và các bạn, em là Trần Ngọc Lâm, MSSV 034206001749. Hôm nay em xin báo cáo tiến độ đề tài Hệ Thống Quản Lý Bán Lẻ & Cửa Hàng Số Tạp Hóa 36."*
- Trình chiếu Slide: Giải thích kiến trúc 3 tầng Front-end Vanilla JS $\rightarrow$ Back-end Node.js REST API $\rightarrow$ Database JSON/SQL chuẩn 3NF.
- Nêu rõ địa chỉ cơ sở chính được áp dụng thực tế tại **Trường ĐH Giao Thông Vận Tải TP.HCM - UTH (31 Ung Văn Khiêm, Bình Thạnh)**.

#### Phút 01:30 - 04:30 | DEMO 1: Bán Hàng Tại Quầy POS & Giao Tiếp Back-end (POST /api/orders)
1. **Thực hiện thao tác:**
   - Trên màn hình POS, sinh viên gõ mã vạch `893601111003` (Mì gói Hảo Hảo), giỏ hàng lập tức thêm 1 món (giá 5.000đ). Nhấn nút `+` để tăng số lượng lên 4 gói (Tổng: 20.000đ).
   - Chọn phương thức thanh toán "Chuyển khoản VietQR". Hệ thống tự sinh mã QR NAPAS 247 khớp đúng 20.000đ.
   - Nhấn nút **"Thanh toán ngay (F3)"**.
2. **Chứng minh giao tiếp Back-end trong DevTools Network:**
   - Chỉ vào tab Network trên DevTools: Xuất hiện request `POST /api/orders` với mã HTTP `201 Created`.
   - Bấm vào tab **Payload**: Chỉ rõ dữ liệu gửi lên gồm `items: [{id: "prod_03", quantity: 4, price: 5000}]`, `customerName`, `paymentMethod`.
   - Bấm vào tab **Response**: Server trả về `{ success: true, orderId: "HD_...", total: 20000 }`.
3. **Chứng minh dữ liệu thực sự được lưu vào Database:**
   - Chuyển sang VS Code mở file `data/taphoa36_db.json`.
   - Kéo xuống mảng `orders`: Bản ghi đơn hàng mới tạo xuất hiện nguyên vẹn với đúng timestamp, mã đơn và các mặt hàng.
   - Kéo lên mảng `products`: Tồn kho của Mì Hảo Hảo đã tự động giảm từ 120 gói xuống còn 116 gói!

#### Phút 04:30 - 07:30 | DEMO 2: Quản Trị Viên Tự Tạo Chi Nhánh Mới (POST /api/branches)
1. **Thực hiện thao tác trên `admin.html`:**
   - Sinh viên bấm vào nút chọn chi nhánh trên góc trái Header: Menu dropdown xổ xuống, hiển thị danh sách chi nhánh hiện có kèm cơ sở chính UTH.
   - Bấm vào nút **"+ Thêm chi nhánh / kho mới"**.
   - Nhập thông tin chi nhánh mới:
     - Tên chi nhánh: `Chi Nhánh Ký Túc Xá UTH (Quận 12)`
     - Địa chỉ: `Đường Tô Ký, P. Trung Mỹ Tây, Quận 12, TP.HCM`
     - Loại hình: `Cửa hàng bán lẻ & Điểm bán`
   - Nhấn nút **"Tạo chi nhánh"**.
2. **Chứng minh kết nối Back-end trong DevTools Network:**
   - Tab Network ghi nhận request `POST /api/branches` trả về HTTP `201 Created`.
   - Dropdown trên Header tức thì đổi sang làm việc tại chi nhánh mới vừa tạo.
3. **Chứng minh dữ liệu lưu trong Database:**
   - Mở tệp `data/taphoa36_db.json`: Mảng `branches` xuất hiện chi nhánh mới vừa tạo với đầy đủ địa chỉ.
   - Tải lại trang (F5 Refresh): Dữ liệu chi nhánh mới vẫn tồn tại 100%, chứng minh không bị mất khi reload.
   - Bấm nút **"Xóa"** chi nhánh tự tạo: Server gửi request `DELETE /api/branches/:id` trả về `200 OK`, chi nhánh được xóa sạch và hệ thống tự động quay về cơ sở chính UTH an toàn.

#### Phút 07:30 - 09:00 | Tổng Kết & Minh Chứng Kiểm Thử Tự Động
- Mở Terminal chạy lệnh: `node tests/run_cli_tests.js`.
- Màn hình hiển thị: **57 PASSED / 0 FAILED / TỔNG CỘNG 57**.
- Chạy lệnh: `node tests/verify_ui.js` -> hiển thị **POS=PASS | STORE=PASS | ADMIN=PASS**.
- Sinh viên kết luận: *"Hệ thống Tạp Hóa 36 đã hoàn thành xuất sắc các mục tiêu của đợt báo cáo tiến độ, minh chứng toàn diện từ Front-end, Back-end API đến CSDL quan hệ. Em xin chân thành cảm ơn thầy đã theo dõi!"*
