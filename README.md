# 🛒 TạpHóa Online — README

> **Đề tài:** Ứng dụng Tạp Hóa theo Yêu Cầu cho Người Mới Bắt Đầu  
> **Môn học:** Lập trình Web  
> **Công nghệ:** HTML5 · CSS3 · JavaScript (thuần)  
> **Nhóm:** 6 thành viên

---

## 📌 Giới thiệu

**TạpHóa Online** là ứng dụng cửa hàng tạp hóa trực tuyến được xây dựng bằng HTML, CSS và JavaScript thuần — không sử dụng bất kỳ framework hay thư viện nào. Toàn bộ ứng dụng nằm trong **1 file `index.html` duy nhất**, dễ quản lý và trình bày.

### ✨ Tính năng chính

| Nhóm tính năng | Mô tả |
|----------------|-------|
| 🛍️ **Mua sắm** | Duyệt 30+ sản phẩm theo danh mục, lọc và sắp xếp |
| 🔍 **Tìm kiếm** | Tìm kiếm văn bản + tìm kiếm bằng giọng nói (Voice Search) |
| 🛒 **Giỏ hàng** | Thêm/xóa/cập nhật số lượng, tính tổng tự động |
| 💳 **Thanh toán** | 5 phương thức: COD, MoMo, ZaloPay, VNPay, Chuyển khoản |
| 📋 **Đơn hàng** | Xem lịch sử, theo dõi trạng thái, hủy đơn, mua lại |
| ⚙️ **Quản trị (Admin)** | Dashboard doanh thu, quản lý kho tự động, duyệt đơn |
| 📥 **Xuất dữ liệu** | Xuất danh sách kho hàng & đơn hàng ra Excel/CSV (UTF-8 BOM) |
| 🔐 **Xác thực** | Đăng nhập, Đăng ký, Đăng xuất, Phân quyền Admin/Staff/Khách, 2FA |
| 🔔 **Thông báo** | Thông báo real-time (WebSocket simulation), push notification |
| 🤖 **Chatbot AI** | Trợ lý ảo trả lời tự động bằng NLP đơn giản |
| 🎯 **Gợi ý SP** | Gợi ý dựa trên lịch sử duyệt xem (Recommendation Engine) |
| 🌙 **Dark Mode** | Chuyển đổi giao diện sáng/tối |
| 🌐 **Đa ngôn ngữ** | Hỗ trợ Tiếng Việt và English |
| 📱 **Responsive** | Tương thích mọi thiết bị (desktop, tablet, mobile) |

---

## 🚀 Cách chạy ứng dụng

### Cách 1: Mở trực tiếp (đơn giản nhất)
```
1. Tìm file: grocery-app/index.html
2. Double-click để mở bằng trình duyệt
3. Ứng dụng hoạt động ngay!
```

### Cách 2: Dùng Live Server (VS Code)
```
1. Cài extension "Live Server" trong VS Code
2. Click phải vào index.html → "Open with Live Server"
3. Trình duyệt tự động mở tại http://127.0.0.1:5500
```

> ⚠️ **Lưu ý:** Tính năng Voice Search yêu cầu HTTPS hoặc localhost. Dùng Live Server để test tính năng này.

---

## 📁 Cấu trúc file dự án

```
LAP TRINH WEB/
│
├── grocery-app/                ← Thư mục dự án chính
│   ├── index.html              ← 🌟 FILE CHÍNH DUY NHẤT
│   ├── README.md               ← File này (hướng dẫn)
│   ├── phan-cong-nhiem-vu.md  ← Phân công nhiệm vụ 6 thành viên
│   └── thiet-ke-nop-lan-1.md  ← Báo cáo thiết kế nộp lần 1
│
└── (tài liệu khác)
    ├── BAITAP_LTWEB_DH.pdf
    └── theory-lectures-v2-BEST.pdf
```

### Cấu trúc bên trong `index.html`
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* ===== CSS VARIABLES =====    → TV2 phụ trách */
    /* ===== NAVBAR CSS =====       → TV2 phụ trách */
    /* ===== PRODUCT CARD CSS ===== → TV3 phụ trách */
    /* ===== CART SIDEBAR CSS ===== → TV3 phụ trách */
    /* ===== MODAL CSS =====        → TV3 phụ trách */
    /* ===== CHATBOT CSS =====      → TV6 phụ trách */
    /* ===== RESPONSIVE CSS =====   → TV2 phụ trách */
    /* ===== DARK MODE CSS =====    → TV2 phụ trách */
  </style>
</head>
<body>
  <!-- NAVBAR HTML            → TV2 -->
  <!-- CART SIDEBAR HTML      → TV3 -->
  <!-- AUTH MODAL HTML        → TV3 -->
  <!-- PRODUCT MODAL HTML     → TV3 -->
  <!-- HOME SECTION HTML      → TV2, TV3 -->
  <!-- SHOP SECTION HTML      → TV3 -->
  <!-- CHECKOUT SECTION HTML  → TV3 -->
  <!-- ORDERS SECTION HTML    → TV3 -->
  <!-- FOOTER HTML            → TV2 -->
  <!-- CHATBOT HTML           → TV6 -->

  <script>
    // DATA STORE (DB)         → TV1
    // INITIAL DATA            → TV1
    // HELPER FUNCTIONS        → TV1
    // AUTH FUNCTIONS          → TV4
    // CATEGORIES + PRODUCTS   → TV4
    // CART FUNCTIONS          → TV5
    // CHECKOUT + ORDERS       → TV5
    // NOTIFICATIONS           → TV5
    // CHATBOT                 → TV6
    // RECOMMENDATIONS         → TV6
    // SETUP & INIT            → TV1
  </script>
</body>
</html>
```

---

## 👥 Thành viên nhóm

| STT | Thành viên | Vai trò | Phụ trách chính |
|-----|-----------|---------|-----------------|
| 1 | **[Tên TV1]** | Leader · Backend Core | DB Store, initData, Helper functions, Tích hợp |
| 2 | **[Tên TV2]** | Frontend — Layout | Navbar, Hero, Footer, CSS Variables, Responsive |
| 3 | **[Tên TV3]** | Frontend — Components | Product cards, Cart UI, Modal, Checkout UI |
| 4 | **[Tên TV4]** | Backend JS — Auth & Products | Đăng nhập/ký, Lọc sản phẩm, Voice Search |
| 5 | **[Tên TV5]** | Backend JS — Cart & Orders | Giỏ hàng, Đặt hàng, Đơn hàng, Thông báo |
| 6 | **[Tên TV6]** | AI Features · Tài liệu | Chatbot, Gợi ý SP, README, Kiểm thử |

> 📝 Điền tên thành viên thực tế vào bảng trên.

---

## 🔑 Tài khoản Demo

| Tài khoản | Mật khẩu | Quyền |
|-----------|---------|-------|
| `admin` | `admin123` | Quản trị viên |
| `staff` | `staff123` | Nhân viên |
| `khachhang1` | `123` | Khách hàng |
| `khachhang2` | `123` | Khách hàng |

> Tài khoản demo được khởi tạo sẵn trong localStorage. Xóa dữ liệu trình duyệt (Ctrl+Shift+Delete) để reset.

---

## 🛠️ Công nghệ sử dụng

### HTML5
- Semantic tags: `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`
- Form elements: `<input>`, `<textarea>`, `<select>`
- `data-*` attributes cho payment methods
- `<meta viewport>` cho responsive

### CSS3
- **CSS Custom Properties** (`:root { --primary: #10b981; ... }`)
- **Flexbox** (navbar, cart items, buttons)
- **CSS Grid** (products-grid, checkout-grid, footer-grid)
- **CSS Animations** (`@keyframes fadeIn, slideUp, pulse, spin, bounce`)
- **Media Queries** (responsive breakpoints: 900px, 768px, 480px)
- **CSS Pseudo-elements** (`.hero::before`, `.hero::after`)
- **CSS Transitions** (`transition: all 0.3s cubic-bezier(...)`)

### JavaScript (ES6+)
- **localStorage API** — lưu trữ dữ liệu
- **DOM Manipulation** — `getElementById`, `querySelector`, `innerHTML`
- **Event Listeners** — `addEventListener`, event delegation
- **Arrow Functions, Template Literals, Destructuring**
- **Array Methods** — `filter`, `map`, `reduce`, `find`, `sort`
- **Web Speech API** — giọng nói (Voice Search)
- **Notification API** — push notification
- **Intl API** — định dạng tiền tệ và ngày giờ

---

## 📊 Dữ liệu mẫu

### Sản phẩm (30 mặt hàng)
| Danh mục | Số sản phẩm | Ví dụ |
|----------|-------------|-------|
| 🥦 Rau củ | 6 | Cà chua, Cà rốt, Dưa leo... |
| 🍎 Trái cây | 5 | Táo, Chuối, Cam, Nho... |
| 🥩 Thịt cá | 4 | Thịt bò, Gà, Cá hồi, Tôm |
| 🥛 Sữa & Trứng | 4 | Sữa tươi, Phô mai, Trứng, Bơ |
| 🍚 Đồ khô | 2 | Gạo ST25, Mì gói |
| 🧃 Nước uống | 4 | Cà phê, Coca, Nước ép, Trà sữa |
| 🧂 Gia vị | 2 | Muối, Tiêu |
| 🍪 Bánh kẹo | 3 | Bánh quy, Socola, Bánh kem |

---

## 🧪 Kiểm thử (Test Cases)

### Tính năng cần kiểm tra

**Auth:**
- [ ] Đăng nhập với admin/admin123 → thành công
- [ ] Đăng nhập sai mật khẩu → thông báo lỗi
- [ ] Đăng ký tài khoản mới → thành công
- [ ] Đăng xuất → xóa session

**Giỏ hàng:**
- [ ] Thêm sản phẩm → số lượng trên icon tăng
- [ ] Tăng/giảm số lượng trong giỏ → cập nhật tổng tiền
- [ ] Xóa sản phẩm → khỏi giỏ hàng
- [ ] Thêm > tồn kho → thông báo lỗi

**Đặt hàng:**
- [ ] Điền form → đặt hàng thành công
- [ ] Không điền địa chỉ → thông báo lỗi
- [ ] Sau khi đặt → giỏ hàng trống, chuyển sang đơn hàng

**Tìm kiếm:**
- [ ] Nhập "cà chua" → hiển thị đúng
- [ ] Tìm tiếng Anh "apple" → hiển thị Táo
- [ ] Voice search (cần HTTPS)

**Chatbot:**
- [ ] Hỏi "giá bao nhiêu" → trả lời thông tin
- [ ] Hỏi "đơn hàng của tôi" khi chưa đăng nhập → nhắc đăng nhập

---

## ❓ Câu hỏi vấn đáp thường gặp

**Q: Tại sao chọn localStorage thay vì server/database?**  
A: Vì đây là môn Lập trình Web cơ bản, không yêu cầu backend. localStorage giúp dữ liệu tồn tại giữa các lần reload mà không cần server.

**Q: Tại sao dùng 1 file HTML thay vì tách CSS/JS riêng?**  
A: Dễ quản lý, dễ nộp bài, không cần cấu hình server. Chỉ cần mở file là chạy được ngay.

**Q: Chatbot có dùng AI thật không?**  
A: Không. Chatbot dùng pattern matching (kiểm tra từ khóa) với `if/else`. Đây gọi là rule-based chatbot.

**Q: WebSocket có thật không?**  
A: Không. Chúng tôi mô phỏng (simulate) bằng `setTimeout` và `setInterval`. Trong thực tế, WebSocket cần server backend.

**Q: Voice Search hoạt động thế nào?**  
A: Dùng `Web Speech API` của trình duyệt (chỉ Chrome hỗ trợ tốt). Khi người dùng nói, API chuyển thành text, rồi dùng text đó để tìm kiếm.

**Q: Recommendation Engine hoạt động thế nào?**  
A: Theo dõi lịch sử xem sản phẩm, tính điểm theo danh mục (xem = 1 điểm, thêm giỏ = 3 điểm, mua = 5 điểm), sau đó gợi ý sản phẩm từ danh mục được xem nhiều nhất.

---

## 📝 Ghi chú nộp bài

- File nộp: `TapHoa36.html` (và các file tài liệu .md) 
- Không cần cài đặt thêm bất kỳ phần mềm nào
- Mở bằng Google Chrome để có trải nghiệm tốt nhất
- Dữ liệu lưu trong localStorage của trình duyệt

---

*📅 Cập nhật lần cuối: Tháng 10, 2024 | Nhóm 6 — Môn Lập trình Web*
