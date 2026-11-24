# TAPHOA36 - PROJECT ENGINEERING RULES & INVARIANTS

## 1. Quy Trình Kỹ Thuật Phần Mềm Cốt Lõi (Core Pipeline Invariants)
- **Chuỗi liên kết bất biến:** Mọi tính năng, mô-đun và chức năng trong hệ thống bắt buộc phải tuân thủ nghiêm ngặt quy trình:
  `Specification (spec.md) ➔ Plan (plan.md) ➔ Tasks (tasks.md) ➔ Tests (tests/) ➔ Code`
- **Bộ ba tệp thiêng liêng:** `spec.md`, `plan.md`, `tasks.md` tại thư mục gốc là tài liệu quy trình kỹ thuật phần mềm chính thức của dự án. TUYỆT ĐỐI KHÔNG ĐƯỢC XÓA, DI CHUYỂN, ĐỔI TÊN HAY COI LÀ RÁC/NHÁP trong mọi trường hợp dọn dẹp thư mục.
- **Phương pháp TDD (Test-Driven Development):** Luôn viết test trước (RED) ➔ Triển khai tối giản (GREEN) ➔ Tối ưu hóa (REFACTOR) ➔ Giữ vững 57/57 tests xanh.

## 2. Chuẩn Hóa Thương Hiệu & Địa Bàn (Single Source of Truth)
- **Thương hiệu duy nhất:** 100% quy chuẩn về `TapHoa36` / `Tạp Hóa 36` / `TapHoa36 AI`. Tuyệt đối không để sót tên cũ (như Cô Ba, KiotViet, Bách Hóa Online cũ).
- **Cơ sở chính UTH:**
  - Tên: `Cửa Hàng Chính - Tạp Hóa 36 (UTH)`
  - Địa chỉ: `Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam`
  - Hotline: `1900 6522`
- **Tự tạo chi nhánh:** Cho phép người dùng tự tạo kho/chi nhánh mới trên giao diện. Không bao giờ hardcode các kho ảo cũ (KhoDC-UVK, TM01, TM03, TM04).

## 3. An Toàn Dữ Liệu & Vệ Sinh Không Gian Làm Việc (Workspace Safety)
- **Bảo vệ tài liệu học tập & bài tập UTH:**
  - `Tai_Lieu_Hoc_Tap/`: Nơi lưu trữ duy nhất các slide bài giảng, lý thuyết, tài liệu ôn tập UTH.
  - `034206001749_TranNgocLam/` & `Group11_Portfolio/` kèm các tệp nén: Tuyệt đối không xâm phạm hay sửa đổi cấu trúc.
- **Cơ chế cách ly rác an toàn:** Khi dọn dẹp, các tệp nghi ngờ là rác phải được chuyển vào `_rac_tam_thoi/` để người dùng xác nhận trực quan trước khi xóa vĩnh viễn.

## 4. Tiêu Chuẩn Bố Cục Giao Diện (UI Layout Standards)
- **Navbar & Mega Dropdowns:** Tuyệt đối không dùng `overflow-x-auto` gây clip/ẩn menu; sử dụng `overflow-visible`, `z-50+` và cơ chế click-to-pin để ghim mở menu đa cột khi người dùng tương tác.
- **Tính đồng bộ POS & Hóa đơn K80:** Template in nhiệt K80 phải luôn lấy địa chỉ từ chi nhánh hoạt động thực tế (`Cửa Hàng Chính - Tạp Hóa 36 (UTH)`).

## 5. Tiêu Chuẩn Thiết Kế Tinh Chỉnh & Chống AI Slop (Unslopping Design Standards - unslop)
- **Triết lý Quiet Chrome vs. Rich Content:** Giữ khung viền, thanh menu, nút bấm ở sắc thái trung tính, điềm tĩnh (Quiet Chrome). Dồn sự sắc nét và màu sắc vào đúng 1-2 điểm nhấn nội dung thực tế (Rich Content: thẻ sản phẩm thật, biểu đồ trực quan, mã VietQR).
- **Loại bỏ triệt để AI Slop (signs.md):**
  - Tuyệt đối không dùng chữ gradient lòe loẹt (`bg-clip-text text-transparent`) trên tiêu đề hay logo; dùng chữ một màu sắc nét (`text-rose-700 font-bold`).
  - Không lạm dụng icon cảm xúc / emoji làm icon điều hướng hay nhãn hàng (bỏ 🏠 🚀 🔥 ✨; dùng icon Material Symbols / Lucide với stroke 1.5).
  - Không dùng viền phát sáng neon, khối mờ lòe loẹt hay hiệu ứng co giãn giật cục (`hover:scale-125`, `animate-bounce`).
- **Nhịp lưới chuẩn 4px:** Mọi khoảng cách lề (margin, padding, gap) phải tuân thủ nghiêm ngặt bội số của 4px (thang đo 4, 8, 12, 16, 20, 24px); không dùng giá trị tùy tiện (`mt-[13px]`, `py-[11px]`).
- **Văn phong bán lẻ tự nhiên:** Tránh câu từ quảng cáo sáo rỗng, hô hào AI; dùng tiếng Việt gần gũi, chuẩn mực của tiệm tạp hóa dân cư.

## 6. Tiêu Chuẩn Trình Chiếu & Thiết Kế Baoyu Design (baoyu-design)
- **Tỷ lệ chuẩn 16:9 (1920×1080):** Mọi slide thuyết trình phải tuân thủ nghiêm ngặt kích thước chuẩn 1920×1080, lưới 12 cột khoa học, tích hợp phím tắt trình chiếu (Mũi tên, Space, F - Fullscreen) và hỗ trợ in ấn xuất PDF chuẩn không vỡ trang.
- **Thực chứng dự án (Evidence-Based Presentations):** Nội dung slide phải phản ánh 100% dữ liệu thực tế của đồ án TapHoa36 UTH: 57/57 unit tests xanh, ảnh chụp màn hình thật của POS, Admin Bento Grid và Store Online; tuyệt đối không dùng số liệu giả lập chung chung hay template rác trôi nổi.
- **Kế thừa tinh hoa Unslopping:** Áp dụng triệt để Quiet Chrome (nền than sâu, khung viền hairline 1px) và dồn điểm nhấn vào biểu đồ kiến trúc, mã VietQR và số liệu đo lường kỹ thuật.
