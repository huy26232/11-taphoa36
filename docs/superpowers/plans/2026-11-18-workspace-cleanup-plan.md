# Workspace Cleanup & Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the workspace by isolating academic lecture materials into `Tai_Lieu_Hoc_Tap/`, moving obsolete temporary builder scripts and drafts into `_rac_tam_thoi/`, while strictly preserving the `spec.md -> plan.md -> tasks.md` pipeline, student submissions, and core TapHoa36 retail system files.

**Architecture:** PowerShell file system operations with automated verification passes. Non-destructive moves into isolated directories, followed by full test suite regression verification (`tests/verify_ui.js` and `tests/run_cli_tests.js`).

**Tech Stack:** PowerShell, Node.js test harness.

**Spec:** [docs/superpowers/specs/2026-11-18-workspace-cleanup-design.md](file:///d:/download/LAP%20TRINH%20WEB/docs/superpowers/specs/2026-11-18-workspace-cleanup-design.md)

## Global Constraints

- Never delete or move `spec.md`, `plan.md`, `tasks.md` from the workspace root (Pipeline requirement).
- Never modify or delete student homework (`034206001749_TranNgocLam/`, `*.rar`, `*.zip`) or Group 11 Portfolio (`Group11_Portfolio/`, `Group11_Portfolio.rar`).
- Never modify core web files in place (`admin.html`, `pos.html`, `store.html`, `server.js`, `taphoa36_schema.sql`, `data/`, `shared/`, `tests/`, `docs/`).
- All 57 CLI unit tests and 3 UI verifications must remain 100% green after file relocation.

## Review Focus

- Lecture materials referenced by relative links from other documents: Moved into `Tai_Lieu_Hoc_Tap/` without modifying file contents.
- Python or JS builder scripts required for build: Verify whether any CI or npm scripts depend on `generate_admin.py` or `builder_admin.js` (None; `server.js` and `tests/` are standalone).
- Git tracking status: Check git status after file moves to ensure no unintended tracked files are lost.
- Local server functionality: Verify `server.js` starts and passes API tests.
- UI static files: Confirm `admin.html`, `pos.html`, and `store.html` open and pass verification.

---

### Task 1: Organize Academic & Lecture Materials into `Tai_Lieu_Hoc_Tap/`

**Files:**
- Create Directory: `Tai_Lieu_Hoc_Tap/`
- Move Targets:
  - `Giới thiệu môn học.pptx`
  - `Chương 2.2. CSS  CSS3.pptx`
  - `Chương 2.2. CSS  CSS3 (tt).pptx`
  - `BAITAP_LTWEB_DH.pdf`
  - `css-cheat-sheet.pdf`
  - `Bai_Tap_SQL_SSMS.sql`
  - `theory-lectures-v2-BEST.pdf`
  - `theory-lectures-v2-BEST.md`
  - `theory_lectures_by_section/`
  - `vandap_hough.html`
  - `vandap_hough_backup.html`

**Interfaces:**
- Consumes: Existing lecture and academic reference files in root.
- Produces: Clean consolidated directory `Tai_Lieu_Hoc_Tap/`.

- [x] **Step 1: Create `Tai_Lieu_Hoc_Tap` directory if not exists**
- [x] **Step 2: Move lecture slides, PDFs, SQL practice, and theory folders into `Tai_Lieu_Hoc_Tap/`**
- [x] **Step 3: Verify all items exist inside `Tai_Lieu_Hoc_Tap/`**
- [x] **Step 4: Commit changes to git**

---

### Task 2: Isolate Candidate Temporary & Obsolete Files into `_rac_tam_thoi/`

**Files:**
- Create Directory: `_rac_tam_thoi/`
- Move Targets (10 obsolete/draft files):
  - `test_check_files.js`
  - `test_extract.js`
  - `verify_admin.js`
  - `builder_admin.js`
  - `builder_admin_taphoa36.js`
  - `generate_admin.py`
  - `patch_admin.py`
  - `TapHoa36.html` (Old green prototype at root)
  - `backup_grocery_store_phong_khi_can.zip`
  - `grocery-app.rar`

**Interfaces:**
- Consumes: One-off scripts and obsolete build artifacts at root.
- Produces: Isolated folder `_rac_tam_thoi/` for human review prior to permanent removal.

- [x] **Step 1: Create `_rac_tam_thoi` directory**
- [x] **Step 2: Move the 10 temporary/obsolete files into `_rac_tam_thoi/`**
- [x] **Step 3: Confirm root directory no longer contains temporary scripts, while `spec.md`, `plan.md`, `tasks.md` remain at root**
- [x] **Step 4: Commit changes to git**

---

### Task 3: Regression Testing & System Integrity Verification

**Files:**
- Test: `tests/verify_ui.js`
- Test: `tests/run_cli_tests.js`
- Test: `tests/test_server_api.js`

**Interfaces:**
- Consumes: `admin.html`, `pos.html`, `store.html`, `server.js`, `shared/core.js`.
- Produces: Verified green test status for all UI and server endpoints.

- [x] **Step 1: Run `node tests/verify_ui.js` and verify POS=PASS, STORE=PASS, ADMIN=PASS**
- [x] **Step 2: Run `node tests/run_cli_tests.js` and verify 57 PASSED / 0 FAILED**
- [x] **Step 3: Run `node tests/test_server_api.js` and verify 8/8 ENDPOINTS PASSED**
- [x] **Step 4: Confirm root directory listing shows only clean, essential project files**
