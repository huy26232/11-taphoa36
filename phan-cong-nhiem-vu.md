# 📋 PHÂN CÔNG NHIỆM VỤ NHÓM 6 THÀNH VIÊN
## Đề tài: Ứng dụng Tạp Hóa theo Yêu Cầu cho Người Mới Bắt Đầu
### Môn: Lập trình Web | File chính: `index.html` (single-file)

---

## 🎯 Tổng quan dự án

| Thông tin | Chi tiết |
|-----------|----------|
| **Tên dự án** | TạpHóa Online |
| **Công nghệ** | HTML5 · CSS3 · JavaScript (thuần) |
| **Cơ sở dữ liệu** | localStorage (lưu dữ liệu trên trình duyệt) |
| **File chính** | `index.html` (1 file duy nhất, tích hợp CSS + JS) |
| **Giao diện** | Màu xanh `#10b981`, Responsive, Dark Mode |
| **Số thành viên** | 6 người |

---

## 👥 BẢNG PHÂN CÔNG CHI TIẾT

### 🔴 THÀNH VIÊN 1 — LEADER / Tích hợp tổng thể

| Mục | Nội dung |
|-----|----------|
| **Vai trò** | Trưởng nhóm, Kiến trúc hệ thống, Tích hợp module |
| **Loại công việc** | Backend JavaScript (Core) |
| **Phần phụ trách trong index.html** | Khối `DB`, `initData()`, `generateId()`, `formatCurrency()`, `formatDate()`, `showToast()`, `showSection()` |

**Nhiệm vụ cụ thể:**
- ✅ Thiết kế kiến trúc toàn bộ ứng dụng (cấu trúc data, flow)
- ✅ Xây dựng **DB Store** (`const DB = {...}`) — hệ thống lưu trữ localStorage
- ✅ Khởi tạo dữ liệu mẫu `initData()` — 30 sản phẩm, 4 người dùng
- ✅ Viết các hàm tiện ích: `formatCurrency()`, `formatDate()`, `generateId()`
- ✅ Hàm `showToast()` — thông báo popup góc màn hình
- ✅ Hàm `showSection()` — điều hướng giữa các trang
- ✅ Phối hợp, gộp code các thành viên vào 1 file duy nhất
- ✅ Quản lý repo GitHub (nếu có) hoặc phân chia file tạm
- ✅ Kiểm tra toàn bộ ứng dụng trước khi nộp

**Mục tiêu học:** Hiểu cách tổ chức kiến trúc ứng dụng web frontend, mô hình lưu trữ dữ liệu client-side.

---

### 🟠 THÀNH VIÊN 2 — Frontend: Trang chủ & Navbar

| Mục | Nội dung |
|-----|----------|
| **Vai trò** | Frontend Developer — Giao diện trang chủ |
| **Loại công việc** | HTML + CSS (Thiết kế UI) |
| **Phần phụ trách** | CSS Variables, Navbar, Hero Banner, Phần cuối (Footer), Responsive |

**Nhiệm vụ cụ thể:**
- ✅ Thiết kế **Navbar** (logo, ô tìm kiếm, biểu tượng thông báo, giỏ hàng, nút đăng nhập)
- ✅ Thiết kế **Hero Banner** — banner lớn màu xanh gradient với nút CTA
- ✅ Thiết kế **CSS Variables** — bảng màu, font, shadow, radius (phần `:root {...}`)
- ✅ Thiết kế **Footer** — 4 cột thông tin
- ✅ Responsive CSS cho mobile (max-width: 768px, 480px)
- ✅ Dark Mode CSS (`[data-theme='dark'] {...}`)
- ✅ Các animation: `fadeIn`, `slideInRight`, `slideUp`, `pulse`, `spin`
- ✅ Viết CSS Scrollbar tùy chỉnh

**CSS phụ trách:**
```css
/* Phụ trách từ :root đến .hero__btn */
/* Phụ trách .footer, .toast-container, .toast */
/* Phụ trách @media queries */
/* Phụ trách [data-theme='dark'], @keyframes */
```

**Mục tiêu học:** Nắm vững CSS Variables, Flexbox, Responsive Design, CSS Animations.

---

### 🟡 THÀNH VIÊN 3 — Frontend: Sản phẩm & Giỏ hàng UI

| Mục | Nội dung |
|-----|----------|
| **Vai trò** | Frontend Developer — Giao diện sản phẩm và giỏ hàng |
| **Loại công việc** | HTML + CSS (Components) |
| **Phần phụ trách** | Product Cards, Cart Sidebar, Checkout UI, Modal UI |

**Nhiệm vụ cụ thể:**
- ✅ Thiết kế **Product Card** (`.product-card`, `.product-card__image`, `.product-badge`, ...)
- ✅ Thiết kế **Category Cards** (`.category-card`, `.categories-grid`)
- ✅ Thiết kế **Cart Sidebar** (`.cart-sidebar`, `.cart-item`, `.cart-summary-box`)
- ✅ Thiết kế **Checkout Form** (`.checkout-grid`, `.payment-method`, `.checkout-form`)
- ✅ Thiết kế **Modal** (`.modal-overlay`, `.modal`, `.modal-header`, `.modal-body`)
- ✅ Thiết kế **Auth Modal** (form đăng nhập / đăng ký, tabs)
- ✅ Thiết kế **Trang Đơn hàng** (`.order-card`, `.order-badge`, `.tracking-timeline`)
- ✅ HTML cấu trúc của tất cả các section (homeSection, shopSection, checkoutSection, ordersSection)

**CSS phụ trách:**
```css
/* .product-card, .product-grid, .product-badge */
/* .category-card, .categories-grid */
/* .cart-overlay, .cart-sidebar, .cart-item, .qty-btn */
/* .modal-overlay, .modal, .auth-tabs, .form-* */
/* .order-card, .tracking-timeline, .payment-method */
```

**Mục tiêu học:** Nắm vững CSS Grid, component design, UI states (active/hover/disabled).

---

### 🟢 THÀNH VIÊN 4 — Backend JS: Xác thực & Quản lý sản phẩm

| Mục | Nội dung |
|-----|----------|
| **Vai trò** | Backend JavaScript Developer |
| **Loại công việc** | JavaScript (Logic nghiệp vụ) |
| **Phần phụ trách** | Auth, Products, Categories, Search, Voice Search |

**Nhiệm vụ cụ thể:**
- ✅ Xây dựng **Auth system**: `doLogin()`, `doRegister()`, `doLogout()`, `completeLogin()`, `getCurrentUser()`, `setCurrentUser()`
- ✅ Xây dựng **User Menu**: `renderUserMenu()`, `toggleUserDropdown()`
- ✅ Xây dựng **2FA**: `verifyTwoFA()`, `setup2FAInputs()`
- ✅ Xây dựng **Category system**: mảng `CATEGORIES`, `renderCategories()`, `filterByCategory()`
- ✅ Xây dựng **Products**: `getProducts()`, `saveProducts()`, `makeProductCard()`, `renderFeaturedProducts()`, `showProductDetail()`
- ✅ Xây dựng **Search**: `removeAccents()`, `filterAndSort()`, `setupSearch()`
- ✅ Xây dựng **Voice Search**: `setupVoiceSearch()` (Web Speech API)
- ✅ Xây dựng **Settings**: `setupSettings()` (ngôn ngữ EN/VI, dark mode)

**JavaScript phụ trách:**
```js
// const CATEGORIES = [...];
// function doLogin(), doRegister(), doLogout(), completeLogin(), verifyTwoFA()
// function renderUserMenu(), toggleUserDropdown(), switchAuthTab()
// function renderCategories(), filterByCategory(), makeProductCard()
// function renderFeaturedProducts(), showProductDetail()
// function removeAccents(), filterAndSort(), setupSearch(), setupFilters()
// function setupVoiceSearch(), setupSettings(), setup2FAInputs()
```

**Mục tiêu học:** Nắm vững JavaScript functions, DOM manipulation, localStorage, Web Speech API.

---

### 🔵 THÀNH VIÊN 5 — Backend JS: Quản lý Kho Hàng, Đơn Hàng & Báo Cáo Quản Trị

| Mục | Nội dung |
|-----|----------|
| **Vai trò** | Backend JavaScript Developer — Vận hành & Quản trị |
| **Loại công việc** | JavaScript (Logic nghiệp vụ & Admin System) |
| **Phần phụ trách** | Cart, Orders, Admin Dashboard, Kho hàng, Báo cáo & Xuất file CSV |

**Nhiệm vụ cụ thể:**
- ✅ Xây dựng **Cart Logic**: `addToCart()`, `removeFromCart()`, `updateQty()`, `clearCart()`, `getCartTotal()`, `getCart()`, `saveCart()`
- ✅ Xây dựng **Checkout & Đặt hàng**: `renderCheckoutItems()`, `prefillCheckoutForm()`, `placeOrder()`
- ✅ Xây dựng **Đơn hàng khách**: `renderOrders()`, `cancelOrder()`, `reorder()`, `simulateOrderProgress()`, `getStatusNote()`
- ✅ Xây dựng **Bảng điều khiển Quản trị (Admin Dashboard)**: `openAdminDashboard()`, `renderAdminDashboard()`, `switchAdminTab()`
- ✅ Xây dựng **Quản lý Kho hàng tự động**: `renderAdminInventoryTable()`, `adminQuickRestock()`, `adminDeleteProduct()`, `adminAddNewProduct()`
- ✅ Xây dựng **Duyệt & Quản lý đơn hàng chủ tiệm**: `renderAdminOrdersTable()`, `adminUpdateOrderStatus()`
- ✅ Xây dựng **Thống kê doanh thu & Báo cáo**: `renderAdminReports()` (Top bán chạy, tỷ lệ trạng thái đơn)
- ✅ Xây dựng **Xuất dữ liệu Excel/CSV (UTF-8 BOM)**: `exportData()`, `downloadCSV()`
- ✅ Xây dựng **Thông báo thời gian thực & Mô phỏng WebSocket**: `getNotifications()`, `addNotification()`, `renderNotifications()`, `markNotifRead()`, `markAllRead()`, `startWebSocketSim()`

**JavaScript phụ trách:**
```js
// function addToCart(), removeFromCart(), updateQty(), clearCart(), getCartTotal()
// function renderCheckoutItems(), prefillCheckoutForm(), placeOrder()
// function renderOrders(), cancelOrder(), reorder(), simulateOrderProgress()
// function openAdminDashboard(), renderAdminDashboard(), switchAdminTab()
// function renderAdminInventoryTable(), adminQuickRestock(), adminDeleteProduct(), adminAddNewProduct()
// function renderAdminOrdersTable(), adminUpdateOrderStatus(), renderAdminReports()
// function exportData(), downloadCSV(), getNotifications(), addNotification(), startWebSocketSim()
```

**Mục tiêu học:** Nắm vững logic quản lý kho bãi, cập nhật trạng thái đơn hàng thời gian thực, thuật toán thống kê doanh thu và kỹ thuật tạo file CSV client-side.

---

### 🟣 THÀNH VIÊN 6 — Chatbot AI & Gợi ý sản phẩm + Tài liệu

| Mục | Nội dung |
|-----|----------|
| **Vai trò** | Feature Developer + Documentation |
| **Loại công việc** | JavaScript (AI features) + Markdown documentation |
| **Phần phụ trách** | Chatbot, Recommendations, README, Báo cáo |

**Nhiệm vụ cụ thể:**
- ✅ Xây dựng **Chatbot AI**: `toggleChatbot()`, `sendChatMessage()`, `getBotResponse()`, `addUserMessage()`, `addBotMessage()`, `showTypingIndicator()`, `hideTypingIndicator()`
- ✅ Xây dựng **Recommendation Engine**: `trackHistory()`, `renderRecommendations()`
- ✅ Thiết kế **Chatbot UI**: `.chatbot-widget`, `.chatbot-panel`, `.chatbot-messages`, `.chatbot-input-row`
- ✅ Viết file **README.md** chi tiết
- ✅ Viết file **phân công nhiệm vụ** (file này)
- ✅ Cập nhật file **thiet-ke-nop-lan-1.md**
- ✅ Kiểm thử tất cả tính năng trên các trình duyệt: Chrome, Firefox, Edge
- ✅ Ghi lại các lỗi gặp phải và cách sửa (nhật ký kiểm thử)

**JavaScript phụ trách:**
```js
// let chatOpen, chatMessages;
// function toggleChatbot(), sendChatMessage(), getBotResponse()
// function addUserMessage(), addBotMessage(), showTypingIndicator(), hideTypingIndicator()
// function trackHistory(), renderRecommendations()
```

**CSS phụ trách:**
```css
/* .chatbot-widget, .chatbot-btn, .chatbot-panel, .chatbot-panel-header */
/* .chatbot-messages, .chatbot-input-row, .chatbot-input, .chatbot-send-btn */
```

**Mục tiêu học:** Nắm vững pattern matching (NLP đơn giản), thuật toán gợi ý, cách viết tài liệu kỹ thuật.

---

## 📅 GỢI Ý LỊCH LÀM VIỆC (3 tuần)

| Tuần | Mục tiêu | Thành viên phụ trách |
|------|----------|----------------------|
| **Tuần 1** | Dựng cấu trúc HTML, CSS cơ bản, DB Store | TV1, TV2, TV3 |
| **Tuần 2** | Hoàn thiện JavaScript logic (Auth, Cart, Orders) | TV4, TV5 |
| **Tuần 3** | Chatbot, Recommendations, Tích hợp, Kiểm thử | TV6, TV1 tổng hợp |

---

## 🔄 QUY TRÌNH LÀM VIỆC NHÓM

### Bước 1: Mỗi thành viên làm phần của mình
```
Mỗi người tạo 1 file .txt hoặc file riêng ghi phần HTML/CSS/JS của mình
```

### Bước 2: Leader (TV1) tổng hợp
```
TV1 copy code của từng người vào đúng vị trí trong index.html:
- CSS → vào trong thẻ <style>
- HTML → vào trong <body>
- JS → vào trong thẻ <script>
```

### Bước 3: Kiểm thử
```
TV6 mở index.html trên Chrome → test từng tính năng
Ghi lỗi vào bảng theo dõi → TV tương ứng sửa → TV1 cập nhật file
```

---

## 🎯 MÔ TẢ TÍNH NĂNG THEO TỪNG THÀNH VIÊN

| Tính năng | TV phụ trách | Trạng thái |
|-----------|-------------|-----------|
| Giao diện Navbar, Hero | TV2 | ✅ |
| Dark mode, Responsive | TV2 | ✅ |
| Product Card, Category | TV3 | ✅ |
| Cart Sidebar UI | TV3 | ✅ |
| Checkout form, Modal | TV3 | ✅ |
| Auth (Login/Register) | TV4 | ✅ |
| Voice Search | TV4 | ✅ |
| Lọc sản phẩm, Tìm kiếm | TV4 | ✅ |
| Giỏ hàng logic | TV5 | ✅ |
| Đặt hàng, Theo dõi | TV5 | ✅ |
| Thông báo push | TV5 | ✅ |
| Chatbot AI | TV6 | ✅ |
| Gợi ý sản phẩm | TV6 | ✅ |
| Tài liệu báo cáo | TV6 | ✅ |
| Kiến trúc, Data Store | TV1 | ✅ |
| Tích hợp tổng thể | TV1 | ✅ |

---

## 📦 CÁC FILE TRONG DỰ ÁN

```
grocery-app/
├── TapHoa36.html          ← File ứng dụng chính (1 file duy nhất)
├── README.md           ← Hướng dẫn dự án
├── phan-cong-nhiem-vu.md   ← File này
└── thiet-ke-nop-lan-1.md  ← Báo cáo thiết kế nộp lần 1
```

---

> 💡 **Lưu ý cho nhóm:** Vì chỉ dùng 1 file HTML duy nhất, hãy dùng comment (`<!-- -->` cho HTML, `/* */` cho CSS, `//` cho JS) để đánh dấu phần của từng người. Điều này giúp dễ phân biệt và kiểm tra khi bảo vệ.
