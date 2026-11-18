# Thiết Kế Quy Hoạch Thư Mục & Phân Loại File Dự Án (Workspace Organization Design)

## 1. Bối cảnh & Mục tiêu (Context & Objectives)
- **Mục tiêu:** Quy hoạch lại toàn bộ không gian làm việc `LAP TRINH WEB` cho gọn gàng, chuyên nghiệp, giữ gìn trọn vẹn dữ liệu học tập và quy trình kỹ thuật phần mềm.
- **Yêu cầu cốt lõi từ người dùng:**
  - Tuyệt đối giữ nguyên bộ ba file tài liệu quy trình phát triển TDD tại thư mục gốc: `spec.md` -> `plan.md` -> `tasks.md` -> `tests/` -> `code` (Pipeline chuẩn).
  - Gom toàn bộ tài liệu học tập, bài giảng, slide của trường UTH vào một thư mục riêng: `Tai_Lieu_Hoc_Tap/`.
  - Giữ nguyên vẹn 100% bài tập cá nhân (`034206001749_TranNgocLam`) và đồ án nhóm (`Group11_Portfolio`).
  - Chuyển các file nháp / script tạm vào thư mục cách ly `_rac_tam_thoi/` để người dùng kiểm tra trực quan trước khi xóa hẳn (Phương án 1 an toàn).

---

## 2. Kiến trúc Thư mục Mục tiêu (Target Directory Structure)

```
LAP TRINH WEB/
├── Tai_Lieu_Hoc_Tap/                     # [MỚI] Gom tài liệu học tập & slide UTH
│   ├── Giới thiệu môn học.pptx
│   ├── Chương 2.2. CSS  CSS3.pptx
│   ├── Chương 2.2. CSS  CSS3 (tt).pptx
│   ├── BAITAP_LTWEB_DH.pdf
│   ├── css-cheat-sheet.pdf
│   ├── Bai_Tap_SQL_SSMS.sql
│   ├── theory-lectures-v2-BEST.pdf
│   ├── theory-lectures-v2-BEST.md
│   ├── theory_lectures_by_section/
│   ├── vandap_hough.html
│   └── vandap_hough_backup.html
│
├── _rac_tam_thoi/                         # [TẠM] Thư mục cách ly file rác/nháp
│   ├── test_check_files.js
│   ├── test_extract.js
│   ├── verify_admin.js
│   ├── builder_admin.js
│   ├── builder_admin_taphoa36.js
│   ├── generate_admin.py
│   ├── patch_admin.py
│   ├── TapHoa36.html (Bản nháp xanh lá cũ)
│   ├── backup_grocery_store_phong_khi_can.zip
│   └── grocery-app.rar
│
├── 034206001749_TranNgocLam/             # Bài tập tuần cá nhân (Giữ nguyên)
├── 034206001749_TranNgocLam.rar          # Nén nộp cá nhân (Giữ nguyên)
├── 034206001749_TranNgocLam_CaNhan.zip   # Zip nộp cá nhân (Giữ nguyên)
├── Group11_Portfolio/                    # Portfolio Nhóm 11 (Giữ nguyên)
├── Group11_Portfolio.rar                 # Nén nộp nhóm (Giữ nguyên)
│
├── spec.md                               # [PIPELINE] Đặc tả hệ thống (Giữ tại root)
├── plan.md                               # [PIPELINE] Kế hoạch triển khai (Giữ tại root)
├── tasks.md                              # [PIPELINE] Danh sách nhiệm vụ TDD (Giữ tại root)
│
├── admin.html                            # Trang Quản trị Pastel Rose chuẩn
├── pos.html                              # Màn hình Bán hàng Thu ngân POS
├── store.html                            # Cửa hàng Bán lẻ Trực tuyến TapHoa36
├── server.js                             # Node.js REST API Server
├── taphoa36_schema.sql                   # Thiết kế CSDL quan hệ 3NF
├── data/                                 # CSDL taphoa36_db.json
├── shared/                               # core.js, acl_engine.js
├── tests/                                # Bộ kiểm thử tự động 57 test cases
├── docs/                                 # Báo cáo tiến độ & Slide thuyết trình
├── grocery-app/                          # Bản đồng bộ phân phối
└── .gitignore                            # Cấu hình git
```

---

## 3. Các bước thực hiện (Execution Plan)
1. Tạo thư mục `Tai_Lieu_Hoc_Tap` và chuyển an toàn 11 file/thư mục tài liệu lý thuyết vào đó.
2. Tạo thư mục `_rac_tam_thoi` và chuyển 10 file nháp/script tạm cũ vào đó.
3. Giữ nguyên vẹn 100% `spec.md`, `plan.md`, `tasks.md` cùng toàn bộ mã nguồn `admin.html`, `pos.html`, `store.html`, `server.js`, `tests/` ở thư mục gốc.
4. Chạy kiểm thử tự động xác minh: `verify_ui.js` và `run_cli_tests.js` đảm bảo hệ thống ứng dụng TapHoa36 vẫn hoạt động hoàn hảo 100%.
