/**
 * ============================================================================
 * 🧪 BỘ KIỂM THỬ TỰ ĐỘNG TDD TOÀN DIỆN CHO HỆ THỐNG "TẠP HÓA SỐ" (TEST SUITE)
 * ============================================================================
 * Đề tài: Ứng dụng Tạp Hóa theo Yêu Cầu cho Người Mới Bắt Đầu (TapHoa36)
 * Học phần: Lập trình Web | Khoa CNTT - UTH | Nhóm 11
 * Tác giả: @qa-planner (Task Planner & QA Engineer)
 *
 * MỤC TIÊU KIỂM THỬ:
 * Kiểm chứng 100% Acceptance Criteria được quy định trong spec.md:
 *  - AC-AUTH-01 -> AC-AUTH-05: Xác thực, Mock OAuth2, RBAC, Quick Switcher
 *  - AC-SYNC-01 -> AC-SYNC-04: Đồng bộ đa tab BroadcastChannel, Fallback Storage
 *  - AC-DAL-01  -> AC-DAL-04:  IndexedDB 6 Stores, Seeding 30 món, Offline Queue
 *  - AC-CRYPTO-01 -> AC-CRYPTO-03: Web Crypto API AES-GCM 256-bit, Sổ nợ
 *  - AC-EXPORT-01 -> AC-EXPORT-03: Xuất Excel UTF-8 BOM, In Hóa đơn K80, Báo cáo PDF
 *  - AC-AI-01   -> AC-AI-04:   NLP Khử dấu tiếng Việt, 10 Intents, Recommender
 *  - AC-POS-01  -> AC-POS-06:  Barcode, Tiền thối, VietQR, Ghi nợ, Phím tắt, Admin btn
 *  - AC-ADMIN-01 -> AC-ADMIN-08: Non-destructive 6 Image views, Bento, +10 kho, Dark mode
 * ============================================================================
 */

(function (global) {
  'use strict';

  // Khung đăng ký Test Runner nội tại
  const testRegistry = [];
  let currentSuite = null;

  function describe(suiteTitle, suiteFn) {
    const suite = {
      id: 'suite_' + (testRegistry.length + 1),
      title: suiteTitle,
      tests: [],
      beforeEachFn: null,
      afterEachFn: null
    };
    currentSuite = suite;
    testRegistry.push(suite);
    try {
      suiteFn();
    } catch (err) {
      console.error(`Lỗi khi định nghĩa suite "${suiteTitle}":`, err);
    }
    currentSuite = null;
  }

  function it(testTitle, testFn) {
    if (!currentSuite) {
      throw new Error(`"it" phải được gọi bên trong một block "describe"`);
    }
    // Trích xuất mã AC nếu có (ví dụ AC-AUTH-01)
    const acMatch = testTitle.match(/AC-[A-Z]+-[0-9]+/);
    const acCode = acMatch ? acMatch[0] : 'AC-GENERAL';
    const testCase = {
      id: 'test_' + (currentSuite.tests.length + 1),
      title: testTitle,
      acCode: acCode,
      fn: testFn,
      status: 'pending', // pending, passed, failed
      duration: 0,
      error: null
    };
    currentSuite.tests.push(testCase);
  }

  function beforeEach(fn) {
    if (currentSuite) currentSuite.beforeEachFn = fn;
  }

  function afterEach(fn) {
    if (currentSuite) currentSuite.afterEachFn = fn;
  }

  // Assertion Engine chuẩn BDD / TDD
  function expect(actual) {
    const matchers = {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`Mong đợi: [${expected}] (kiểu ${typeof expected}), nhưng nhận được: [${actual}] (kiểu ${typeof actual})`);
        }
      },
      toEqual(expected) {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
          throw new Error(`Dữ liệu không khớp:\nMong đợi: ${expectedStr}\nThực tế:  ${actualStr}`);
        }
      },
      toBeTruthy() {
        if (!actual) {
          throw new Error(`Mong đợi giá trị truthy, nhưng nhận được: [${actual}]`);
        }
      },
      toBeFalsy() {
        if (actual) {
          throw new Error(`Mong đợi giá trị falsy, nhưng nhận được: [${actual}]`);
        }
      },
      toBeDefined() {
        if (typeof actual === 'undefined') {
          throw new Error(`Mong đợi giá trị được định nghĩa (defined), nhưng là undefined`);
        }
      },
      toBeNull() {
        if (actual !== null) {
          throw new Error(`Mong đợi giá trị null, nhưng nhận được: [${actual}]`);
        }
      },
      toBeGreaterThan(val) {
        if (!(actual > val)) {
          throw new Error(`Mong đợi [${actual}] > [${val}]`);
        }
      },
      toBeGreaterThanOrEqual(val) {
        if (!(actual >= val)) {
          throw new Error(`Mong đợi [${actual}] >= [${val}]`);
        }
      },
      toBeLessThan(val) {
        if (!(actual < val)) {
          throw new Error(`Mong đợi [${actual}] < [${val}]`);
        }
      },
      toBeLessThanOrEqual(val) {
        if (!(actual <= val)) {
          throw new Error(`Mong đợi [${actual}] <= [${val}]`);
        }
      },
      toContain(item) {
        if (typeof actual === 'string') {
          if (!actual.includes(item)) {
            throw new Error(`Chuỗi "${actual}" không chứa "${item}"`);
          }
        } else if (Array.isArray(actual)) {
          if (!actual.includes(item)) {
            throw new Error(`Mảng không chứa phần tử: ${JSON.stringify(item)}`);
          }
        } else {
          throw new Error(`Kiểu dữ liệu [${typeof actual}] không hỗ trợ toContain`);
        }
      },
      toMatch(regex) {
        const r = typeof regex === 'string' ? new RegExp(regex) : regex;
        if (!r.test(String(actual))) {
          throw new Error(`Giá trị "${actual}" không khớp biểu thức chính quy ${regex}`);
        }
      },
      toThrow(expectedMsg) {
        if (typeof actual !== 'function') {
          throw new Error(`toThrow yêu cầu giá trị kiểm tra là một function`);
        }
        let threw = false;
        let caughtErr = null;
        try {
          actual();
        } catch (e) {
          threw = true;
          caughtErr = e;
        }
        if (!threw) {
          throw new Error(`Hàm được mong đợi sẽ ném ra lỗi nhưng đã thực thi thành công`);
        }
        if (expectedMsg && !caughtErr.message.includes(expectedMsg)) {
          throw new Error(`Lỗi ném ra "${caughtErr.message}" không chứa thông điệp mong đợi "${expectedMsg}"`);
        }
      }
    };

    matchers.not = {
      toBe(expected) {
        if (actual === expected) {
          throw new Error(`Mong đợi giá trị khác [${expected}], nhưng nhận được đúng [${actual}]`);
        }
      },
      toEqual(expected) {
        if (JSON.stringify(actual) === JSON.stringify(expected)) {
          throw new Error(`Dữ liệu không được bằng nhau`);
        }
      },
      toContain(item) {
        if (typeof actual === 'string') {
          if (actual.includes(item)) {
            throw new Error(`Chuỗi "${actual}" không được phép chứa "${item}"`);
          }
        } else if (Array.isArray(actual)) {
          if (actual.includes(item)) {
            throw new Error(`Mảng không được phép chứa phần tử: ${JSON.stringify(item)}`);
          }
        }
      },
      toBeTruthy() {
        if (actual) {
          throw new Error(`Mong đợi giá trị falsy nhưng nhận được [${actual}]`);
        }
      },
      toBeFalsy() {
        if (!actual) {
          throw new Error(`Mong đợi giá trị truthy nhưng nhận được [${actual}]`);
        }
      }
    };

    return matchers;
  }

  // Export các hàm DSL kiểm thử ra toàn cục
  global.describe = describe;
  global.it = it;
  global.beforeEach = beforeEach;
  global.afterEach = afterEach;
  global.expect = expect;
  global.TAPHOA_TEST_REGISTRY = testRegistry;

  // Helper an toàn kiểm tra sự tồn tại của Core Module
  function getCore() {
    if (!global.TapHoaCore) {
      throw new Error(`[TDD RED PHẢI XẢY RA]: Module 'window.TapHoaCore' chưa được định nghĩa. @core-dev cần triển khai 'shared/core.js'.`);
    }
    return global.TapHoaCore;
  }

  /* ==========================================================================
   * SUITE 1: AUTHENTICATION, RBAC & ROUTE PROTECTION (AC-AUTH)
   * ========================================================================== */
  describe('Phân hệ 1: Xác Thực, Phân Quyền RBAC & Bảo Vệ Trang (AC-AUTH)', function () {

    it('AC-AUTH-01: Xác thực đúng 4 tài khoản mặc định và gán đúng vai trò RBAC', function () {
      const core = getCore();
      expect(core.auth).toBeDefined();

      // 1. Tài khoản admin
      const adminUser = core.auth.login('admin', 'admin123');
      expect(adminUser).toBeTruthy();
      expect(adminUser.role).toBe('admin');
      expect(adminUser.username).toBe('admin');
      expect(adminUser.name).toContain('Anh Lâm');

      // 2. Tài khoản thu ngân staff
      const staffUser = core.auth.login('staff', 'staff123');
      expect(staffUser).toBeTruthy();
      expect(staffUser.role).toBe('cashier');
      expect(staffUser.name).toContain('Minh Tuấn');

      // 3. Khách hàng 1
      const cust1 = core.auth.login('khachhang1', '123');
      expect(cust1).toBeTruthy();
      expect(cust1.role).toBe('customer');

      // 4. Khách hàng 2
      const cust2 = core.auth.login('khachhang2', '123');
      expect(cust2).toBeTruthy();
      expect(cust2.role).toBe('customer');

      // 5. Đăng nhập sai mật khẩu phải trả về null hoặc ném lỗi
      let failedLogin = null;
      try {
        failedLogin = core.auth.login('admin', 'wrong_pass');
      } catch (e) {
        failedLogin = null;
      }
      expect(failedLogin).toBeFalsy();
    });

    it('AC-AUTH-02: Đăng nhập xã hội Mock OAuth2 (Google & Facebook) trả về vai trò customer', async function () {
      const core = getCore();
      expect(core.auth.loginOAuth).toBeDefined();

      // Giả lập OAuth Google
      const googleProfile = await core.auth.loginOAuth('google');
      expect(googleProfile).toBeTruthy();
      expect(googleProfile.role).toBe('customer');
      expect(googleProfile.provider).toBe('google');
      expect(googleProfile.email).toContain('@');

      // Giả lập OAuth Facebook
      const fbProfile = await core.auth.loginOAuth('facebook');
      expect(fbProfile).toBeTruthy();
      expect(fbProfile.role).toBe('customer');
      expect(fbProfile.provider).toBe('facebook');
    });

    it('AC-AUTH-03: Hàm protectPage() phải từ chối vai trò customer khi vào trang Admin/POS và chuyển hướng về store.html', function () {
      const core = getCore();
      expect(core.auth.protectPage).toBeDefined();

      // Đăng nhập tài khoản khách hàng
      core.auth.login('khachhang1', '123');

      // Thử truy cập trang chỉ dành cho admin
      const allowAccess = core.auth.protectPage(['admin'], 'store.html', true /* testMode: không redirect thật */);
      expect(allowAccess).toBe(false);

      // Đăng nhập quyền admin
      core.auth.login('admin', 'admin123');
      const allowAdmin = core.auth.protectPage(['admin'], 'store.html', true);
      expect(allowAdmin).toBe(true);

      // Thu ngân vào trang POS
      core.auth.login('staff', 'staff123');
      const allowCashierPOS = core.auth.protectPage(['cashier', 'admin'], 'store.html', true);
      expect(allowCashierPOS).toBe(true);
    });

    it('AC-AUTH-04: Ẩn hoàn toàn Quick Switcher hoặc link Admin/POS đối với khách mua hoặc khách vãng lai', function () {
      const core = getCore();
      expect(core.auth.renderQuickSwitcher).toBeDefined();

      // Khách vãng lai chưa đăng nhập
      core.auth.logout();
      const guestSwitcherHtml = core.auth.renderQuickSwitcher('virtual-container');
      expect(!guestSwitcherHtml || guestSwitcherHtml === '' || guestSwitcherHtml.includes('style="display: none;"') || guestSwitcherHtml.includes('hidden')).toBeTruthy();

      // Đăng nhập vai trò customer
      core.auth.login('khachhang1', '123');
      const customerSwitcherHtml = core.auth.renderQuickSwitcher('virtual-container');
      expect(!customerSwitcherHtml || customerSwitcherHtml === '' || customerSwitcherHtml.includes('style="display: none;"') || customerSwitcherHtml.includes('hidden')).toBeTruthy();
    });

    it('AC-AUTH-05: Hiển thị đầy đủ 3 tùy chọn (Store, POS, Admin) trên Quick Switcher khi đăng nhập vai trò Admin', function () {
      const core = getCore();
      core.auth.login('admin', 'admin123');
      const adminSwitcherHtml = core.auth.renderQuickSwitcher('virtual-container');
      expect(adminSwitcherHtml).toBeTruthy();
      expect(adminSwitcherHtml).toContain('store.html');
      expect(adminSwitcherHtml).toContain('pos.html');
      expect(adminSwitcherHtml).toContain('admin.html');
    });

    it('AC-AUTH-06: auth.login cho phép đăng nhập bằng tài khoản tạo từ ACL Engine và từ chối tài khoản inactive', function () {
      const core = getCore();
      // Tạo tài khoản mới qua ACL
      core.acl.saveAccount({
        username: 'nv_kho_test',
        password: 'pass123',
        fullName: 'Lê Văn Kho',
        role: 'warehouse',
        status: 'active'
      });
      const user = core.auth.login('nv_kho_test', 'pass123');
      expect(user).toBeDefined();
      expect(user.role).toBe('warehouse');

      // Tạo tài khoản inactive
      core.acl.saveAccount({
        username: 'acc_khoa',
        password: '123',
        fullName: 'Tài Khoản Bị Khóa',
        role: 'cashier',
        status: 'inactive'
      });
      const blocked = core.auth.login('acc_khoa', '123');
      expect(blocked).toBe(null);
    });

  });

  /* ==========================================================================
   * SUITE 2: REAL-TIME MULTI-TAB SYNCHRONIZATION (AC-SYNC)
   * ========================================================================== */
  describe('Phân hệ 2: Đồng Bộ Đa Tab Thời Gian Thực (AC-SYNC)', function () {

    it('AC-SYNC-01: Phát sự kiện PRODUCT_STOCK_CHANGED với đúng cấu trúc payload khi tồn kho thay đổi', function (done) {
      const core = getCore();
      expect(core.sync).toBeDefined();
      expect(core.sync.broadcast).toBeDefined();
      expect(core.sync.on).toBeDefined();

      const testPayload = {
        productId: 'SP001',
        newStock: 15,
        delta: -2,
        source: 'pos'
      };

      const handler = function (data) {
        try {
          expect(data.productId).toBe('SP001');
          expect(data.newStock).toBe(15);
          expect(data.delta).toBe(-2);
          core.sync.off('PRODUCT_STOCK_CHANGED', handler);
          done();
        } catch (err) {
          done(err);
        }
      };

      core.sync.on('PRODUCT_STOCK_CHANGED', handler);
      core.sync.broadcast('PRODUCT_STOCK_CHANGED', testPayload);
    });

    it('AC-SYNC-02: Nhận và xử lý sự kiện đồng bộ với độ trễ cực thấp (< 50ms)', function (done) {
      const core = getCore();
      const startTime = performance.now();

      const handler = function () {
        const elapsed = performance.now() - startTime;
        core.sync.off('SPEED_BENCHMARK_EVENT', handler);
        try {
          expect(elapsed).toBeLessThan(50);
          done();
        } catch (e) {
          done(e);
        }
      };

      core.sync.on('SPEED_BENCHMARK_EVENT', handler);
      core.sync.broadcast('SPEED_BENCHMARK_EVENT', { timestamp: startTime });
    });

    it('AC-SYNC-03: Cập nhật trạng thái hết hàng và khóa nút mua khi số lượng tồn kho giảm về 0', function () {
      const core = getCore();
      expect(core.sync.checkOutOfStockStatus).toBeDefined();

      const inStock = core.sync.checkOutOfStockStatus(5);
      expect(inStock.isOutOfStock).toBe(false);
      expect(inStock.buttonDisabled).toBe(false);

      const outOfStock = core.sync.checkOutOfStockStatus(0);
      expect(outOfStock.isOutOfStock).toBe(true);
      expect(outOfStock.buttonDisabled).toBe(true);
      expect(outOfStock.badgeText).toContain('Hết hàng');
    });

    it('AC-SYNC-04: Tự động kích hoạt cơ chế Fallback sang StorageEvent khi không có BroadcastChannel', function () {
      const core = getCore();
      expect(core.sync.isUsingFallback).toBeDefined();
      // Kiểm tra hệ thống có bộ đệm và phương thức lưu trữ fallback
      const supported = typeof BroadcastChannel !== 'undefined';
      if (!supported) {
        expect(core.sync.isUsingFallback()).toBe(true);
      } else {
        expect(core.sync.isUsingFallback()).toBe(false);
      }
    });

  });

  /* ==========================================================================
   * SUITE 3: OFFLINE-FIRST STORAGE & DATA ACCESS LAYER (AC-DAL)
   * ========================================================================== */
  describe('Phân hệ 3: Lưu Trữ Ngoại Tuyến & DAL Engine (AC-DAL)', function () {

    it('AC-DAL-01: Khởi tạo IndexedDB TapHoaSoDB thành công với đầy đủ 6 Object Stores', async function () {
      const core = getCore();
      expect(core.dal).toBeDefined();
      expect(core.dal.initDB).toBeDefined();

      const db = await core.dal.initDB();
      expect(db).toBeTruthy();

      const requiredStores = ['products', 'orders', 'debts', 'cash_flows', 'settings', 'offline_queue'];
      requiredStores.forEach(function (storeName) {
        expect(db.objectStoreNames.contains(storeName)).toBe(true);
      });
    });

    it('AC-DAL-02: Tự động nạp tối thiểu 30 sản phẩm mẫu trải dài trên 12 ngành hàng thiết yếu', async function () {
      const core = getCore();
      expect(core.dal.seedProducts).toBeDefined();
      expect(core.dal.getProducts).toBeDefined();

      await core.dal.seedProducts();
      const allProducts = await core.dal.getProducts();

      expect(Array.isArray(allProducts)).toBe(true);
      expect(allProducts.length).toBeGreaterThanOrEqual(30);

      // Thu thập danh sách các ngành hàng hiện diện
      const categories = new Set(allProducts.map(p => p.category));
      expect(categories.size).toBeGreaterThanOrEqual(10); // Phải có ít nhất 10-12 ngành hàng
    });

    it('AC-DAL-03: Lưu trữ đơn hàng vào offline_queue khi mất kết nối mạng', async function () {
      const core = getCore();
      expect(core.dal.saveOrder).toBeDefined();
      expect(core.dal.getOfflineQueue).toBeDefined();

      // Giả lập trạng thái ngoại tuyến
      core.dal.setOnlineStatus(false);

      const offlineOrder = {
        id: 'DH-OFFLINE-' + Date.now(),
        customerName: 'Bác Tư đầu hẻm',
        items: [{ id: 'SP001', name: 'Gạo ST25', quantity: 1, price: 185000 }],
        total: 185000,
        createdAt: new Date().toISOString()
      };

      await core.dal.saveOrder(offlineOrder);
      const queue = await core.dal.getOfflineQueue();

      expect(queue.length).toBeGreaterThan(0);
      const found = queue.find(o => o.id === offlineOrder.id);
      expect(found).toBeTruthy();

      // Khôi phục trạng thái mạng
      core.dal.setOnlineStatus(true);
    });

    it('AC-DAL-04: Tự động đồng bộ và làm sạch offline_queue khi mạng phục hồi', async function () {
      const core = getCore();
      expect(core.dal.syncOfflineQueue).toBeDefined();

      // Đảm bảo mạng trực tuyến và gọi sync
      core.dal.setOnlineStatus(true);
      const syncedCount = await core.dal.syncOfflineQueue();
      expect(typeof syncedCount).toBe('number');

      const remainingQueue = await core.dal.getOfflineQueue();
      expect(remainingQueue.length).toBe(0);
    });

    it('AC-DAL-05: Hàm clearAllData() xóa sạch dữ liệu trong các bảng để người dùng nhập mới', async function () {
      const core = getCore();
      expect(core.dal.clearAllData).toBeDefined();
      await core.dal.clearAllData();
      const products = await core.dal.getProducts();
      expect(products.length).toBe(0);
      // Nạp lại dữ liệu để các bài test và môi trường tiếp tục hoạt động bình thường
      await core.dal.seedProducts();
    });

  });

  /* ==========================================================================
   * SUITE 4: WEB CRYPTO API AES-GCM ENCRYPTION (AC-CRYPTO)
   * ========================================================================== */
  describe('Phân hệ 4: Bảo Mật Mã Hóa Web Crypto API AES-GCM (AC-CRYPTO)', function () {

    it('AC-CRYPTO-01: Mã hóa AES-GCM 256-bit tạo ra chuỗi mã hóa kèm IV không thể đọc dạng plain text', async function () {
      const core = getCore();
      expect(core.crypto).toBeDefined();
      expect(core.crypto.encryptData).toBeDefined();

      const sensitiveData = {
        debtor: 'Bác Hai thợ mộc',
        phone: '0918765432',
        amount: 250000,
        note: 'Nợ tiền gạo và nước mắm tuần trước'
      };

      const masterKey = 'TapHoaSoSecretPassphrase2026';
      const encrypted = await core.crypto.encryptData(sensitiveData, masterKey);

      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toContain('Bác Hai thợ mộc');
      expect(encrypted).not.toContain('0918765432');
      expect(encrypted).not.toContain('250000');
    });

    it('AC-CRYPTO-02: Giải mã chính xác dữ liệu ban đầu 100% nguyên vẹn khi có đúng passphrase', async function () {
      const core = getCore();
      expect(core.crypto.decryptData).toBeDefined();

      const originalData = {
        customerName: 'Chị Ba bán bún',
        phone: '0908889999',
        debtAmount: 480000
      };

      const masterKey = 'SecretKey@2026';
      const ciphertext = await core.crypto.encryptData(originalData, masterKey);
      const decrypted = await core.crypto.decryptData(ciphertext, masterKey);

      expect(decrypted.customerName).toBe('Chị Ba bán bún');
      expect(decrypted.phone).toBe('0908889999');
      expect(decrypted.debtAmount).toBe(480000);
    });

    it('AC-CRYPTO-03: Thất bại khi giải mã với passphrase sai, bảo vệ an toàn Sổ nợ quen xóm', async function () {
      const core = getCore();
      const secret = { debtId: 'NO-001', amount: 500000 };
      const ciphertext = await core.crypto.encryptData(secret, 'DungPassphrase');

      let failed = false;
      try {
        await core.crypto.decryptData(ciphertext, 'SaiPassphrase123');
      } catch (e) {
        failed = true;
      }
      expect(failed).toBe(true);
    });

  });

  /* ==========================================================================
   * SUITE 5: EXPORT SERVICES & RECEIPT PRINTING (AC-EXPORT)
   * ========================================================================== */
  describe('Phân hệ 5: Xuất Báo Cáo & In Hóa Đơn Nhiệt K80 (AC-EXPORT)', function () {

    it('AC-EXPORT-01: Xuất Excel/CSV chứa Byte Order Mark (\\uFEFF) đảm bảo không lỗi font tiếng Việt', function () {
      const core = getCore();
      expect(core.export).toBeDefined();
      expect(core.export.generateCSVContent).toBeDefined();

      const testData = [
        { Ma: 'SP01', Ten: 'Nước mắm Nam Ngư', DonGia: 38000, Ton: 45 },
        { Ma: 'SP02', Ten: 'Gạo ST25 Ông Cua 5kg', DonGia: 185000, Ton: 12 },
        { Ma: 'SP03', Ten: 'Dầu ăn Tường An 1L', DonGia: 52000, Ton: 8 }
      ];

      const csvContent = core.export.generateCSVContent(testData);
      expect(csvContent.charCodeAt(0)).toBe(0xFEFF); // Chứa UTF-8 BOM
      expect(csvContent).toContain('Nước mắm Nam Ngư');
      expect(csvContent).toContain('Gạo ST25 Ông Cua');
    });

    it('AC-EXPORT-02: Tạo mẫu hóa đơn K80 đạt chuẩn khổ in nhiệt 80mm với đầy đủ thông tin bắt buộc', function () {
      const core = getCore();
      expect(core.export.generateK80ReceiptHtml).toBeDefined();

      const mockOrder = {
        orderId: 'HD-20261113-001',
        cashierName: 'Minh Tuấn',
        date: '13/11/2026 10:30',
        items: [
          { name: 'Gạo ST25 (5kg)', quantity: 1, price: 185000, subtotal: 185000 },
          { name: 'Nước mắm Nam Ngư', quantity: 2, price: 38000, subtotal: 76000 }
        ],
        subtotal: 261000,
        discount: 10000,
        total: 251000,
        cashTendered: 300000,
        change: 49000,
        storeInfo: {
          name: 'TẠP HÓA 36 - UTH',
          address: 'Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam',
          hotline: '1900 6522'
        }
      };

      const receiptHtml = core.export.generateK80ReceiptHtml(mockOrder);

      // Kiểm tra các thuộc tính K80 quan trọng
      expect(receiptHtml).toContain('80mm');
      expect(receiptHtml).toContain('TẠP HÓA 36');
      expect(receiptHtml).toContain('Võ Oanh');
      expect(receiptHtml).toContain('HD-20261113-001');
      expect(receiptHtml).toContain('Gạo ST25 (5kg)');
      expect(receiptHtml).toContain('251.000');
      expect(receiptHtml).toContain('49.000');
    });

    it('AC-EXPORT-03: Định dạng cấu trúc báo cáo PDF tài chính cân đối thu - chi', function () {
      const core = getCore();
      expect(core.export.formatPDFReportData).toBeDefined();

      const financialSummary = {
        period: 'Tháng 11/2026',
        totalRevenue: 45200000,
        totalExpense: 31500000,
        netProfit: 13700000,
        activeDebts: 2100000
      };

      const formatted = core.export.formatPDFReportData(financialSummary);
      expect(formatted).toBeTruthy();
      expect(formatted.netProfitFormatted).toContain('13.700.000');
    });

    it('AC-EXPORT-04: export.exportProductsExcel, printFinancialReport và sync.listen được định nghĩa và gọi an toàn', function () {
      const core = getCore();
      expect(core.export.exportProductsExcel).toBeDefined();
      expect(core.export.printFinancialReport).toBeDefined();
      expect(core.sync.listen).toBeDefined();
    });

  });

  /* ==========================================================================
   * SUITE 6: TAPHOA36 AI NLP & RECOMMENDER ENGINE (AC-AI)
   * ========================================================================== */
  describe('Phân hệ 6: Động Cơ Trí Tuệ Nhân Tạo TapHoa36 AI (AC-AI)', function () {

    it('AC-AI-01: Chuẩn hóa và khử dấu tiếng Việt chính xác (normalize/removeAccents)', function () {
      const core = getCore();
      expect(core.ai).toBeDefined();
      expect(core.ai.removeAccents).toBeDefined();

      const input1 = 'Thịt ba rọi rút sườn';
      const output1 = core.ai.removeAccents(input1);
      expect(output1.toLowerCase()).toBe('thit ba roi rut suon');

      const input2 = 'Nước mắm Nam Ngư Đệ Nhị';
      const output2 = core.ai.removeAccents(input2);
      expect(output2.toLowerCase()).toBe('nuoc mam nam ngu de nhi');
    });

    it('AC-AI-02: Phân loại câu hỏi tự nhiên vào 10 nhóm ý định (Intents) với Confidence >= 0.85', function () {
      const core = getCore();
      expect(core.ai.classifyIntent).toBeDefined();

      const samples = [
        { query: 'Chào TapHoa36, chúc một ngày buôn may bán đắt', expected: 'GREETING' },
        { query: 'Tiệm mình còn gạo ST25 không shop ơi?', expected: 'FIND_PRODUCT' },
        { query: 'Dầu ăn Tường An một lít giá bao nhiêu tiền vậy?', expected: 'PRICE_INQUIRY' },
        { query: 'Kiểm tra giúp tôi đơn hàng DH-12345 đã giao chưa', expected: 'CHECK_ORDER' },
        { query: 'Giao hàng qua hẻm 45 có được freeship không?', expected: 'SHIPPING_POLICY' },
        { query: 'Ở đây có quẹt mã QR hay trả qua MoMo được không?', expected: 'PAYMENT_METHODS' },
        { query: 'Hôm nay tiệm có mã giảm giá hoặc khuyến mãi gì không?', expected: 'PROMOTION_DEALS' },
        { query: 'Trứng gà bị dập có được đổi lại hộp mới không?', expected: 'RETURN_POLICY' },
        { query: 'Cho tôi hỏi tháng này nhà tôi còn nợ tiệm bao nhiêu?', expected: 'DEBT_INQUIRY' },
        { query: 'Cảm ơn TapHoa36 nhiều nhé, hàng giao nhanh lắm', expected: 'THANKS' }
      ];

      samples.forEach(function (s) {
        const result = core.ai.classifyIntent(s.query);
        expect(result.intent).toBe(s.expected);
        expect(result.confidence).toBeGreaterThanOrEqual(0.85);
      });
    });

    it('AC-AI-03: Trích xuất thực thể tên sản phẩm và tra cứu thời gian thực trong cơ sở dữ liệu', function () {
      const core = getCore();
      expect(core.ai.extractEntities).toBeDefined();

      const mockCatalog = [
        { id: 'SP01', name: 'Nước mắm Nam Ngư', price: 38000, stock: 20 },
        { id: 'SP02', name: 'Gạo thơm lài ST25', price: 185000, stock: 15 },
        { id: 'SP03', name: 'Bột giặt OMO Matic', price: 145000, stock: 8 }
      ];

      const entities = core.ai.extractEntities('Tìm cho tôi 2 chai nước mắm Nam Ngư', mockCatalog);
      expect(entities).toBeTruthy();
      expect(entities.matchedProduct).toBeTruthy();
      expect(entities.matchedProduct.id).toBe('SP01');
      expect(entities.quantity).toBe(2);
    });

    it('AC-AI-04: Thuật toán gợi ý cá nhân hóa chấm điểm sản phẩm theo hành vi tương tác', function () {
      const core = getCore();
      expect(core.ai.recommendProducts).toBeDefined();

      const userInteractions = [
        { productId: 'SP_RAU_01', category: 'rau_cu', action: 'purchase', count: 3 }, // 3 * 5 = 15
        { productId: 'SP_THIT_01', category: 'thit_ca', action: 'cart', count: 2 },    // 2 * 3 = 6
        { productId: 'SP_SNACK_01', category: 'banh_keo', action: 'view', count: 1 }   // 1 * 1 = 1
      ];

      const catalog = [
        { id: 'SP_RAU_02', name: 'Cà chua Đà Lạt', category: 'rau_cu', rating: 4.8, sales: 120 },
        { id: 'SP_THIT_02', name: 'Cá nục bông', category: 'thit_ca', rating: 4.2, sales: 50 },
        { id: 'SP_SNACK_02', name: 'Bim bim Oishi', category: 'banh_keo', rating: 3.9, sales: 30 }
      ];

      const recommendations = core.ai.recommendProducts(userInteractions, catalog, 3);
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      // Ngành hàng rau củ có tương tác purchase cao nhất nên sản phẩm rau_cu phải đứng đầu
      expect(recommendations[0].category).toBe('rau_cu');
    });

  });

  /* ==========================================================================
   * SUITE 7: CASHIER POINT OF SALE (AC-POS)
   * ========================================================================== */
  describe('Phân hệ 7: Màn Hình Bán Hàng Tại Quầy POS (AC-POS)', function () {

    it('AC-POS-01: Quét hoặc nhập mã vạch Barcode lập tức thêm sản phẩm vào giỏ hàng POS', function () {
      const core = getCore();
      expect(core.pos).toBeDefined();
      expect(core.pos.scanBarcode).toBeDefined();

      const mockCatalog = [
        { barcode: '8934567890123', id: 'SP01', name: 'Sữa tươi Vinamilk 1L', price: 34000 }
      ];

      let currentCart = [];
      currentCart = core.pos.scanBarcode('8934567890123', mockCatalog, currentCart);

      expect(currentCart.length).toBe(1);
      expect(currentCart[0].id).toBe('SP01');
      expect(currentCart[0].quantity).toBe(1);

      // Quét thêm 1 lần nữa tăng số lượng lên 2
      currentCart = core.pos.scanBarcode('8934567890123', mockCatalog, currentCart);
      expect(currentCart[0].quantity).toBe(2);
    });

    it('AC-POS-02: Tính toán chính xác số tiền thối trả lại cho khách hàng tức thì', function () {
      const core = getCore();
      expect(core.pos.calculateChange).toBeDefined();

      // Tổng đơn 273.000, khách đưa tờ 500.000
      const res1 = core.pos.calculateChange(500000, 273000);
      expect(res1.change).toBe(227000);
      expect(res1.isValid).toBe(true);

      // Khách đưa thiếu tiền
      const res2 = core.pos.calculateChange(200000, 273000);
      expect(res2.isValid).toBe(false);
      expect(res2.change).toBeLessThan(0);
    });

    it('AC-POS-03: Tạo mã VietQR động chuẩn định dạng NAPAS 247 chứa đúng số tiền và mã hóa đơn', function () {
      const core = getCore();
      expect(core.pos.generateVietQRData).toBeDefined();

      const qrData = core.pos.generateVietQRData({
        bankBin: '970422', // MBBank
        accountNo: '0901234567',
        amount: 273000,
        memo: 'HD20261113001'
      });

      expect(qrData).toBeTruthy();
      expect(qrData.qrUrl || qrData.payload).toContain('273000');
      expect(qrData.qrUrl || qrData.payload).toContain('0901234567');
    });

    it('AC-POS-04: Tạo bản ghi Ghi nợ Sổ quen với đầy đủ thông tin tên và số điện thoại khách hàng', function () {
      const core = getCore();
      expect(core.pos.createDebtRecord).toBeDefined();

      const debt = core.pos.createDebtRecord({
        customerName: 'Bác Sáu xe ôm',
        phone: '0934112233',
        amount: 125000,
        orderId: 'HD-999',
        note: 'Mua mì tôm và dầu gió'
      });

      expect(debt.id).toBeTruthy();
      expect(debt.customerName).toBe('Bác Sáu xe ôm');
      expect(debt.amount).toBe(125000);
      expect(debt.status).toBe('UNPAID');
    });

    it('AC-POS-05: Bắt sự kiện phím tắt thu ngân: F1, F2, F3, F4, ESC điều hướng chính xác', function () {
      const core = getCore();
      expect(core.pos.handleHotkey).toBeDefined();

      let triggered = null;
      const callbacks = {
        onF1: () => { triggered = 'F1'; },
        onF2: () => { triggered = 'F2'; },
        onF3: () => { triggered = 'F3'; },
        onF4: () => { triggered = 'F4'; },
        onESC: () => { triggered = 'ESC'; }
      };

      core.pos.handleHotkey({ key: 'F2', preventDefault: () => {} }, callbacks);
      expect(triggered).toBe('F2');

      core.pos.handleHotkey({ key: 'Escape', preventDefault: () => {} }, callbacks);
      expect(triggered).toBe('ESC');
    });

    it('AC-POS-06: Ẩn nút "Về Quản Trị Admin" trên màn hình POS khi người dùng là Cashier', function () {
      const core = getCore();
      expect(core.pos.canAccessAdminButton).toBeDefined();

      // Quyền thu ngân
      const cashierUser = { role: 'cashier', name: 'Minh Tuấn' };
      expect(core.pos.canAccessAdminButton(cashierUser)).toBe(false);

      // Quyền admin
      const adminUser = { role: 'admin', name: 'Anh Lâm' };
      expect(core.pos.canAccessAdminButton(adminUser)).toBe(true);
    });

  });

  /* ==========================================================================
   * SUITE 8: ADMIN DASHBOARD INTEGRATION (AC-ADMIN)
   * ========================================================================== */
  describe('Phân hệ 8: Quản Trị Cửa Hàng & Bento Grid (AC-ADMIN)', function () {

    it('AC-ADMIN-01: Tuân thủ Non-Destructive Rule: 6 views gốc hiện diện đầy đủ định danh', function () {
      const core = getCore();
      expect(core.admin).toBeDefined();
      expect(core.admin.getRegisteredViews).toBeDefined();

      const views = core.admin.getRegisteredViews();
      const requiredViews = [
        'view_dashboard',  // Từ Image 2
        'view_inventory',  // Từ Image 4
        'view_orders',     // Từ Image 6
        'view_finance',    // Từ Image 8
        'view_settings',   // Từ Image 10
        'view_catalog_ai'  // Từ Image 12
      ];

      requiredViews.forEach(function (v) {
        expect(views.includes(v)).toBe(true);
      });
    });

    it('AC-ADMIN-02: Chuyển đổi trạng thái tab giữa 6 phân hệ giao diện mượt mà', function () {
      const core = getCore();
      expect(core.admin.switchTab).toBeDefined();

      const activeTab1 = core.admin.switchTab('view_inventory');
      expect(activeTab1).toBe('view_inventory');

      const activeTab2 = core.admin.switchTab('view_finance');
      expect(activeTab2).toBe('view_finance');
    });

    it('AC-ADMIN-03: Cấu trúc Bento Grid 12 cột Widescreen đáp ứng hiển thị trên Desktop và Tablet', function () {
      const core = getCore();
      expect(core.admin.getBentoGridConfig).toBeDefined();

      const config = core.admin.getBentoGridConfig();
      expect(config.columns).toBe(12);
      expect(config.responsiveBreakpoints).toBeTruthy();
    });

    it('AC-ADMIN-04: Thao tác nhập kho nhanh +10 tăng số lượng tồn kho sản phẩm ngay lập tức', async function () {
      const core = getCore();
      expect(core.admin.quickAddStock).toBeDefined();

      const initialStock = 14;
      const updatedStock = await core.admin.quickAddStock('SP_TEST_01', 10, initialStock);
      expect(updatedStock).toBe(24);
    });

    it('AC-ADMIN-05: Lưu trữ và chuyển đổi chế độ Dark Mode toàn cục', function () {
      const core = getCore();
      expect(core.admin.toggleDarkMode).toBeDefined();
      expect(core.admin.isDarkMode).toBeDefined();

      // Đảo trạng thái
      const prevState = core.admin.isDarkMode();
      const newState = core.admin.toggleDarkMode();
      expect(newState).toBe(!prevState);

      // Đảo lại
      core.admin.toggleDarkMode();
    });

    it('AC-ADMIN-06: Báo cáo tài chính tính đúng 4 chỉ số: Tổng thu, Tổng chi, Tiền két, Tổng nợ', function () {
      const core = getCore();
      expect(core.admin.computeFinancialMetrics).toBeDefined();

      const mockCashFlows = [
        { type: 'IN', amount: 500000 },
        { type: 'IN', amount: 350000 },
        { type: 'OUT', amount: 150000 }
      ];
      const mockDebts = [
        { amount: 200000, status: 'UNPAID' },
        { amount: 100000, status: 'UNPAID' },
        { amount: 50000, status: 'PAID' }
      ];

      const metrics = core.admin.computeFinancialMetrics(mockCashFlows, mockDebts);

      expect(metrics.totalInflow).toBe(850000);
      expect(metrics.totalOutflow).toBe(150000);
      expect(metrics.cashInDrawer).toBe(700000); // 850k - 150k
      expect(metrics.totalReceivableDebt).toBe(300000); // Chỉ tính UNPAID
    });

    it('AC-ADMIN-07: TapHoa36 AI Dynamic Pricing đề xuất mức giảm giá từ 15% - 30% cho hàng cận date (<= 5 ngày)', function () {
      const core = getCore();
      expect(core.admin.suggestNearExpiryDiscount).toBeDefined();

      // Sản phẩm còn 2 ngày hết hạn
      const discountSuggestion = core.admin.suggestNearExpiryDiscount({
        name: 'Sữa tươi tiệt trùng',
        daysUntilExpiry: 2,
        currentStock: 15
      });

      expect(discountSuggestion.suggestedDiscountPercent).toBeGreaterThanOrEqual(15);
      expect(discountSuggestion.suggestedDiscountPercent).toBeLessThanOrEqual(30);
      expect(discountSuggestion.reason).toBeTruthy();
    });

    it('AC-ADMIN-08: Quick Switcher trên Admin cho phép chuyển tức thì sang store.html và pos.html', function () {
      const core = getCore();
      expect(core.admin.getQuickSwitcherTargets).toBeDefined();

      const targets = core.admin.getQuickSwitcherTargets();
      expect(targets).toContain('store.html');
      expect(targets).toContain('pos.html');
    });

    it('AC-ADMIN-09: Cung cấp thông tin điều hướng TapHoa36 Navbar với hotline 1900 6522 và nút Bán hàng', function () {
      const core = getCore();
      expect(core.admin.getTapHoa36NavConfig).toBeDefined();
      const config = core.admin.getTapHoa36NavConfig();
      expect(config.hotline).toContain('1900 6522');
      expect(config.branch).toContain('Võ Oanh');
      expect(config.posLink).toBe('pos.html');
    });

  });

  // =========================================================================
  // Phân hệ 9: Quản Lý Tài Khoản & Phân Quyền Access Control List (AC-ACL)
  // =========================================================================
  describe('Phân hệ 9: Quản Lý Tài Khoản & Phân Quyền Access Control List (AC-ACL)', function () {

    it('AC-ACL-01: Khởi tạo Master Admin mặc định (admin/admin123 - Trần Ngọc Lâm) với toàn quyền', function () {
      const core = getCore();
      expect(core.acl).toBeDefined();
      const accounts = core.acl.getAccounts();
      expect(accounts.length).toBeGreaterThanOrEqual(1);
      const admin = accounts.find(a => a.username === 'admin');
      expect(admin).toBeDefined();
      expect(admin.role).toBe('admin');
      expect(admin.fullName).toContain('Trần Ngọc Lâm');
      expect(core.acl.checkPermission('admin', 'manage_users')).toBe(true);
      expect(core.acl.checkPermission('admin', 'delete_product')).toBe(true);
      expect(core.acl.checkPermission('admin', 'view_finance')).toBe(true);
    });

    it('AC-ACL-02: Thêm tài khoản nhân viên mới và gán vai trò (cashier, warehouse, manager)', function () {
      const core = getCore();
      expect(core.acl.saveAccount).toBeDefined();
      const newAcc = core.acl.saveAccount({
        username: 'thungan01',
        password: '123',
        fullName: 'Nguyễn Văn Thu Ngân',
        role: 'cashier',
        status: 'active'
      });
      expect(newAcc.id).toBeDefined();
      const accounts = core.acl.getAccounts();
      const found = accounts.find(a => a.username === 'thungan01');
      expect(found).toBeDefined();
      expect(found.role).toBe('cashier');
    });

    it('AC-ACL-03: Kiểm tra ma trận quyền: cashier không được xóa sản phẩm hoặc xem doanh thu lợi nhuận', function () {
      const core = getCore();
      expect(core.acl.checkPermission('cashier', 'create_order')).toBe(true);
      expect(core.acl.checkPermission('cashier', 'view_products')).toBe(true);
      expect(core.acl.checkPermission('cashier', 'delete_product')).toBe(false);
      expect(core.acl.checkPermission('cashier', 'view_finance')).toBe(false);
      expect(core.acl.checkPermission('cashier', 'manage_users')).toBe(false);
    });

    it('AC-ACL-04: Đổi mật khẩu tài khoản thành công khi nhập đúng pass cũ, từ chối khi nhập sai pass cũ', function () {
      const core = getCore();
      expect(core.acl.changePassword).toBeDefined();
      const changeOk = core.acl.changePassword('admin', 'admin123', 'newadmin456');
      expect(changeOk).toBe(true);
      // Thử đổi lại với pass cũ sai
      const changeFail = core.acl.changePassword('admin', 'wrong_pass', 'another_pass');
      expect(changeFail).toBe(false);
      // Reset lại pass cũ cho các test khác
      core.acl.changePassword('admin', 'newadmin456', 'admin123');
    });

    it('AC-ACL-05: Ghi nhận nhật ký Audit log chính xác thời gian, hành động và người thực hiện', function () {
      const core = getCore();
      expect(core.acl.addAuditLog).toBeDefined();
      core.acl.addAuditLog('CREATE_PRODUCT', 'Thêm sản phẩm Mì Hảo Hảo', 'Trần Ngọc Lâm');
      const logs = core.acl.getAuditLogs();
      expect(logs.length).toBeGreaterThanOrEqual(1);
      const lastLog = logs[0];
      expect(lastLog.action).toBe('CREATE_PRODUCT');
      expect(lastLog.performedBy).toBe('Trần Ngọc Lâm');
      expect(lastLog.timestamp).toBeDefined();
    });

  });

  // =========================================================================
  // Phân hệ 10: Quản Lý Dữ Liệu Sạch & Vòng Đời Trạng Thái Trống (AC-CLEAN)
  // =========================================================================
  describe('Phân hệ 10: Quản Lý Dữ Liệu Sạch & Vòng Đời Trạng Thái Trống (AC-CLEAN)', function () {

    it('AC-CLEAN-01: initCleanStoreState đảm bảo kho hàng và đơn hàng ở trạng thái rỗng 0 bản ghi khi khởi tạo', async function () {
      const core = getCore();
      expect(core.initCleanStoreState).toBeDefined();
      await core.initCleanStoreState();
      const products = await core.dal.getAllProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(0);
    });

    it('AC-CLEAN-02: seedSampleStoreData nạp 10 sản phẩm mẫu UTH khi người dùng kích hoạt thủ công trong Settings', async function () {
      const core = getCore();
      expect(core.seedSampleStoreData).toBeDefined();
      await core.seedSampleStoreData();
      const products = await core.dal.getAllProducts();
      expect(products.length).toBeGreaterThanOrEqual(10);
      const haoHao = products.find(p => p.name.includes('Hảo Hảo') || p.name.includes('Mì'));
      expect(haoHao).toBeDefined();
    });

    it('AC-CLEAN-03: clearStoreData yêu cầu mã xác nhận XOA để làm sạch kho hàng và đơn hàng nhưng bảo toàn tài khoản admin', async function () {
      const core = getCore();
      expect(core.clearStoreData).toBeDefined();

      // Từ chối nếu mã xác nhận sai
      const rejected = await core.clearStoreData('SAI_MA');
      expect(rejected).toBe(false);

      // Chấp nhận khi gõ đúng 'XOA'
      const success = await core.clearStoreData('XOA');
      expect(success).toBe(true);

      const productsAfter = await core.dal.getAllProducts();
      expect(productsAfter.length).toBe(0);

      // Tài khoản Master Admin vẫn nguyên vẹn
      const adminAcc = core.acl.getAccounts().find(a => a.username === 'admin');
      expect(adminAcc).toBeDefined();
      expect(adminAcc.role).toBe('admin');
    });

  });

  describe('Module Mở Rộng: Quản Lý Kho & Nhà Cung Cấp Thực Tế (TapHoa36)', function () {

    it('AC-WH-01: transferStock điều chuyển kho giữa các chi nhánh có ghi log lịch sử', async function () {
      const core = getCore();
      expect(core.warehouse).toBeDefined();
      expect(core.warehouse.transferStock).toBeDefined();

      const products = await core.dal.getAllProducts();
      const p = products[0] || await core.dal.addProduct({ name: 'Nước Tương Tam Thái Tử', price: 18000, stock: 20 });
      const initialStock = p.stock;

      const res = await core.warehouse.transferStock({
        fromBranch: 'Cửa Hàng Chính - Tạp Hóa 36 (UTH)',
        toBranch: 'Kho Tiếp Vận KTX UTH',
        productId: p.id,
        quantity: 5,
        note: 'Tiếp tế khẩn cấp quầy KTX UTH'
      });

      expect(res.success).toBe(true);
      expect(res.transferId).toBeDefined();

      const pAfter = await core.dal.getProductById(p.id);
      expect(pAfter.stock).toBe(initialStock - 5);

      const history = core.warehouse.getLedger('transfer');
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].toBranch).toBe('Kho Tiếp Vận KTX UTH');
    });

    it('AC-WH-02: produceCombo đóng gói combo trừ nguyên liệu lẻ và tăng tồn kho combo', async function () {
      const core = getCore();
      expect(core.warehouse.produceCombo).toBeDefined();

      const p1 = await core.dal.addProduct({ name: 'Đường cát Biên Hòa 1kg', price: 26000, stock: 30 });
      const p2 = await core.dal.addProduct({ name: 'Muối sấy I-ốt 500g', price: 8000, stock: 30 });

      const res = await core.warehouse.produceCombo({
        comboName: 'Combo Gia Vị Tiết Kiệm (Đường + Muối)',
        comboPrice: 32000,
        ingredients: [
          { productId: p1.id, quantity: 2 },
          { productId: p2.id, quantity: 2 }
        ],
        outputQty: 5
      });

      expect(res.success).toBe(true);
      expect(res.comboId).toBeDefined();

      const p1After = await core.dal.getProductById(p1.id);
      expect(p1After.stock).toBe(20); // 30 - 2*5 = 20

      const comboProd = await core.dal.getProductById(res.comboId);
      expect(comboProd).toBeDefined();
      expect(comboProd.stock).toBe(5);
    });

    it('AC-WH-03: internalUse ghi giảm tồn kho vật tư tiêu hao và hạch toán chi phí', async function () {
      const core = getCore();
      expect(core.warehouse.internalUse).toBeDefined();

      const p = await core.dal.addProduct({ name: 'Bao bì xốp bóng mỡ 1kg', price: 35000, stock: 15 });

      const res = await core.warehouse.internalUse({
        productId: p.id,
        quantity: 2,
        purpose: 'Đóng gói hàng mang về quầy thu ngân',
        department: 'Quầy Thu Ngân F1'
      });

      expect(res.success).toBe(true);
      const pAfter = await core.dal.getProductById(p.id);
      expect(pAfter.stock).toBe(13);

      const internalLogs = core.warehouse.getLedger('internal');
      expect(internalLogs.some(log => log.recordId === res.recordId)).toBe(true);
    });

    it('AC-WH-04: writeOff xuất hủy hàng hết hạn hoặc hư hỏng ghi log hao hụt', async function () {
      const core = getCore();
      expect(core.warehouse.writeOff).toBeDefined();

      const p = await core.dal.addProduct({ name: 'Sữa chua men sống Probi (Hết hạn)', price: 28000, stock: 10 });

      const res = await core.warehouse.writeOff({
        productId: p.id,
        quantity: 4,
        reason: 'Quá hạn sử dụng, bao bì căng phồng'
      });

      expect(res.success).toBe(true);
      const pAfter = await core.dal.getProductById(p.id);
      expect(pAfter.stock).toBe(6);

      const writeOffLogs = core.warehouse.getLedger('writeoff');
      expect(writeOffLogs.some(log => log.recordId === res.recordId)).toBe(true);
    });

    it('AC-SUPP-01: Quản lý danh bạ Nhà cung cấp thực tế và công nợ', function () {
      const core = getCore();
      expect(core.suppliers).toBeDefined();
      expect(core.suppliers.getAll).toBeDefined();

      const supp = core.suppliers.add({
        name: 'Đại Lý Bánh Kẹo Kinh Đô Bình Thạnh',
        phone: '0903112233',
        address: '15 Ung Văn Khiêm, P.25, Bình Thạnh',
        balance: 1500000
      });

      expect(supp.id).toBeDefined();
      const list = core.suppliers.getAll();
      expect(list.some(s => s.name.includes('Kinh Đô'))).toBe(true);
    });

    it('AC-EXP-01: finance.addServiceExpense ghi nhận hóa đơn điện nước dịch vụ vào sổ quỹ', async function () {
      const core = getCore();
      expect(core.finance.addServiceExpense).toBeDefined();

      const res = await core.finance.addServiceExpense({
        serviceType: 'Tiền điện thắp sáng & tủ đông',
        amount: 850000,
        provider: 'Điện Lực Gia Định',
        note: 'Tiền điện kỳ 11/2026'
      });

      expect(res.success).toBe(true);
      expect(res.expenseId).toBeDefined();

      const txs = core.finance.getTransactions ? core.finance.getTransactions() : [];
      expect(txs.some(t => t.description && t.description.includes('Điện Lực Gia Định'))).toBe(true);
    });

    it('AC-WH-05: Tự tạo chi nhánh mới và lưu trữ động vào hệ thống', function () {
      const core = getCore();
      expect(core.warehouse.getBranches).toBeDefined();
      expect(core.warehouse.addBranch).toBeDefined();

      const initialBranches = core.warehouse.getBranches();
      expect(initialBranches.length).toBeGreaterThan(0);
      expect(initialBranches[0].name).toContain('Tạp Hóa 36');
      expect(initialBranches[0].address).toContain('Giao Thông Vận Tải');

      const newB = core.warehouse.addBranch({
        name: 'Kho Tiếp Vận KTX UTH',
        address: 'Ký Túc Xá ĐH GTVT TP.HCM, Đường D3, P.25, Bình Thạnh',
        type: 'warehouse'
      });

      expect(newB.id).toBeDefined();
      expect(newB.name).toBe('Kho Tiếp Vận KTX UTH');

      const updated = core.warehouse.getBranches();
      expect(updated.some(b => b.id === newB.id)).toBe(true);

      // Xóa chi nhánh vừa tạo
      core.warehouse.deleteBranch(newB.id);
      const afterDel = core.warehouse.getBranches();
      expect(afterDel.some(b => b.id === newB.id)).toBe(false);
    });

    it('AC-API-01: Dual-Mode Client Bridge tự động fallback an toàn khi server offline', async function () {
      const core = getCore();
      expect(core.api).toBeDefined();
      expect(core.api.isServerOnline).toBeDefined();
      expect(core.api.getProducts).toBeDefined();
      expect(core.api.createOrder).toBeDefined();

      // Khi không có server chạy hoặc timeout, isServerOnline() trả về false
      const online = await core.api.isServerOnline(50);
      expect(typeof online).toBe('boolean');

      // getProducts fallback thành công về danh mục offline
      const prods = await core.api.getProducts();
      expect(Array.isArray(prods)).toBe(true);

      // getBranches fallback thành công về danh sách chi nhánh
      const branches = await core.api.getBranches();
      expect(Array.isArray(branches)).toBe(true);
      expect(branches[0].name).toContain('Tạp Hóa 36');
    });

  });

  /* ==========================================================================
   * SUITE 11: PROGRESSIVE WEB APP & OFFLINE-FIRST (AC-PWA)
   * ========================================================================== */
  describe('Phân hệ 11: Progressive Web App & Offline-First (AC-PWA)', function () {

    it('AC-PWA-01: File manifest.json đầy đủ thông tin chuẩn PWA và cấu hình standalone', function () {
      const core = getCore();
      expect(core.pwa).toBeDefined();
      expect(core.pwa.getManifestConfig).toBeDefined();

      const manifest = core.pwa.getManifestConfig();
      expect(manifest.name).toContain('Tạp Hóa 36');
      expect(manifest.short_name).toBe('TapHoa36');
      expect(manifest.display).toBe('standalone');
      expect(manifest.theme_color).toBe('#0284c7');
      expect(manifest.background_color).toBe('#f8fafc');
      expect(Array.isArray(manifest.icons)).toBe(true);
      expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
      expect(Array.isArray(manifest.shortcuts)).toBe(true);
    });

    it('AC-PWA-02: Cấu hình Service Worker sw.js precaching App Shell đảm bảo mở trang offline', async function () {
      const core = getCore();
      expect(core.pwa).toBeDefined();
      expect(core.pwa.getPrecacheUrls).toBeDefined();

      const precacheList = core.pwa.getPrecacheUrls();
      expect(Array.isArray(precacheList)).toBe(true);
      expect(precacheList.some(u => u.includes('store.html'))).toBe(true);
      expect(precacheList.some(u => u.includes('pos.html'))).toBe(true);
      expect(precacheList.some(u => u.includes('admin.html'))).toBe(true);
      expect(precacheList.some(u => u.includes('shared/core.js'))).toBe(true);
    });

    it('AC-PWA-03: Caching Strategy Stale-While-Revalidate và Hàng đợi Offline Mutation Retry Queue', async function () {
      const core = getCore();
      expect(core.pwa).toBeDefined();
      expect(core.pwa.queueOfflineMutation).toBeDefined();
      expect(core.pwa.processOfflineMutationQueue).toBeDefined();

      // Giả lập đưa mutation đơn hàng vào hàng đợi khi offline
      const mockMutation = {
        type: 'CREATE_ORDER',
        payload: { orderId: 'DH-PWA-TEST-01', total: 150000 },
        retryCount: 0,
        createdAt: Date.now()
      };

      const qResult = core.pwa.queueOfflineMutation(mockMutation);
      expect(qResult.queued).toBe(true);

      const queue = core.pwa.getOfflineMutationQueue();
      expect(queue.length).toBeGreaterThan(0);
      expect(queue.some(m => m.payload.orderId === 'DH-PWA-TEST-01')).toBe(true);
    });

  });

  /* ==========================================================================
   * SUITE 12: SINH TEM MÃ VẠCH DÁN KỆ HÀNG (AC-LABEL)
   * ========================================================================== */
  describe('Phân hệ 12: Sinh Tem Mã Vạch Dán Kệ Hàng (AC-LABEL)', function () {

    it('AC-LABEL-01: Barcode SVG Generator sinh mã vạch vector thuần chuẩn Code 128 / EAN-13', function () {
      const core = getCore();
      expect(core.barcode).toBeDefined();
      expect(core.barcode.generateSVG).toBeDefined();

      const svgString = core.barcode.generateSVG('8935001701234', {
        format: 'CODE128',
        width: 2,
        height: 40,
        displayValue: true
      });

      expect(typeof svgString).toBe('string');
      expect(svgString.includes('<svg')).toBe(true);
      expect(svgString.includes('</svg>')).toBe(true);
      expect(svgString.includes('<rect') || svgString.includes('<path')).toBe(true);
      // Dung lượng nhẹ < 2KB (2048 bytes)
      expect(svgString.length).toBeLessThan(2048);
    });

    it('AC-LABEL-02: Định dạng tem nhãn dán kệ 35x22mm chứa tên tiệm, giá bán to đậm và mã vạch', function () {
      const core = getCore();
      expect(core.barcode).toBeDefined();
      expect(core.barcode.formatShelfLabelHtml).toBeDefined();

      const sampleProduct = {
        id: 'SP_LABEL_01',
        name: 'Nước khoáng LaVie 500ml',
        barcode: '8934567890123',
        price: 6000,
        unit: 'Chai'
      };

      const labelHtml = core.barcode.formatShelfLabelHtml(sampleProduct, {
        storeName: 'TẠP HÓA 36',
        size: '35x22mm'
      });

      expect(labelHtml).toContain('TẠP HÓA 36');
      expect(labelHtml).toContain('Nước khoáng LaVie 500ml');
      expect(labelHtml).toContain('6.000');
      expect(labelHtml).toContain('Chai');
      expect(labelHtml).toContain('<svg');
      expect(labelHtml).toContain('35mm');
      expect(labelHtml).toContain('22mm');
    });

    it('AC-LABEL-03: Dàn trang in hàng loạt tem nhãn dán kệ (Batch Shelf Label Printing)', function () {
      const core = getCore();
      expect(core.barcode).toBeDefined();
      expect(core.barcode.formatBatchLabelsHtml).toBeDefined();

      const printItems = [
        { product: { id: 'SP1', name: 'Mì Omachi Xốt Bò Hầm', barcode: '8936011770012', price: 9500, unit: 'Gói' }, quantity: 3 },
        { product: { id: 'SP2', name: 'Cà phê Highlands Lon 235ml', barcode: '8936079010023', price: 16000, unit: 'Lon' }, quantity: 2 }
      ];

      const batchHtml = core.barcode.formatBatchLabelsHtml(printItems, { layout: 'a4_grid' });
      expect(batchHtml).toContain('@media print');
      expect(batchHtml).toContain('Mì Omachi');
      expect(batchHtml).toContain('Cà phê Highlands');
      // Tổng số tem tạo ra phải bằng 3 + 2 = 5 tem
      const labelCount = (batchHtml.match(/shelf-label-card/g) || []).length;
      expect(labelCount).toBe(5);
    });

  });

  /* ==========================================================================
   * SUITE 13: QUẢN LÝ ĐƠN NHẬP HÀNG NHÀ CUNG CẤP (AC-PO)
   * ========================================================================== */
  describe('Phân hệ 13: Quản Lý Đơn Nhập Hàng Nhà Cung Cấp (AC-PO)', function () {

    it('AC-PO-01: Tạo đơn nhập hàng Nhà cung cấp tính toán chính xác tổng tiền, trả trước và công nợ', async function () {
      const core = getCore();
      expect(core.po).toBeDefined();
      expect(core.po.createPurchaseOrder).toBeDefined();

      const poData = {
        supplierId: 'NCC_UNILEVER',
        supplierName: 'Unilever Việt Nam',
        items: [
          { productId: 'SP_OMO_01', productName: 'Bột giặt Omo 3kg', quantity: 20, importPrice: 120000 },
          { productId: 'SP_SUN_01', productName: 'Nước rửa chén Sunlight 750g', quantity: 30, importPrice: 25000 }
        ],
        paidAmount: 2000000,
        paymentMethod: 'CASH',
        note: 'Nhập hàng đầu tháng 12/2026'
      };

      const po = await core.po.createPurchaseOrder(poData);
      expect(po.id).toBeDefined();
      expect(po.status).toBe('ordered');
      // Tổng tiền = (20 * 120k) + (30 * 25k) = 2.400.000 + 750.000 = 3.150.000 đ
      expect(po.totalAmount).toBe(3150000);
      expect(po.paidAmount).toBe(2000000);
      // Nợ NCC = 3.150.000 - 2.000.000 = 1.150.000 đ
      expect(po.debtAmount).toBe(1150000);
    });

    it('AC-PO-02: Cập nhật tồn kho và tính lại giá vốn bình quân gia quyền khi PO chuyển sang received', async function () {
      const core = getCore();
      expect(core.po).toBeDefined();
      expect(core.po.receivePurchaseOrder).toBeDefined();

      // Giả sử SP_TEST_WAC có tồn kho cũ 10 cái, giá vốn cũ 50.000đ
      // Nhập thêm 20 cái, giá nhập 56.000đ
      // Giá vốn mới = (10 * 50.000 + 20 * 56.000) / (10 + 20) = (500.000 + 1.120.000) / 30 = 1.620.000 / 30 = 54.000đ
      const testPo = await core.po.createPurchaseOrder({
        supplierId: 'NCC_TEST',
        supplierName: 'Nhà phân phối An Bình',
        items: [
          { productId: 'SP_TEST_WAC', productName: 'Hạt nêm Knorr 400g', quantity: 20, importPrice: 56000 }
        ],
        paidAmount: 1120000,
        paymentMethod: 'BANK'
      });

      const receiveResult = await core.po.receivePurchaseOrder(testPo.id, {
        initialStockMap: { 'SP_TEST_WAC': { stock: 10, costPrice: 50000 } }
      });

      expect(receiveResult.success).toBe(true);
      expect(receiveResult.items['SP_TEST_WAC'].newStock).toBe(30);
      expect(receiveResult.items['SP_TEST_WAC'].newCostPrice).toBe(54000);
    });

    it('AC-PO-03: Tự động hạch toán phiếu Chi trong Sổ Quỹ tiền mặt khi thanh toán PO', async function () {
      const core = getCore();
      expect(core.po).toBeDefined();
      expect(core.po.recordPurchaseOrderPayment).toBeDefined();

      const paymentRes = await core.po.recordPurchaseOrderPayment({
        poId: 'PO-20261124-001',
        supplierName: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
        amount: 5000000,
        paymentMethod: 'CASH',
        note: 'Thanh toán tiền nhập sữa đặc và sữa chua kỳ 2'
      });

      expect(paymentRes.success).toBe(true);
      expect(paymentRes.voucherId).toBeDefined();
      expect(paymentRes.amount).toBe(5000000);

      // Sổ quỹ tiền mặt phải ghi nhận một phiếu Chi
      const flows = core.dal.getCashFlows ? await core.dal.getCashFlows() : [];
      const found = flows.find(f => f.type === 'OUT' && f.amount === 5000000);
      expect(found).toBeDefined();
    });

  });

  /* ==========================================================================
   * SUITE 14: CÂN ĐIỆN TỬ POS & HÀNG BÁN THEO TRỌNG LƯỢNG (AC-SCALE)
   * ========================================================================== */
  describe('Phân hệ 14: Cân Điện Tử POS & Hàng Bán Theo Trọng Lượng (AC-SCALE)', function () {

    it('AC-SCALE-01: Bóc tách mã vạch cân điện tử GS1 tiền tố 20/21 trích xuất mã hàng, trọng lượng và tính thành tiền', function () {
      const core = getCore();
      expect(core.pos).toBeDefined();
      expect(core.pos.parseWeighingBarcode).toBeDefined();

      const mockScaleCatalog = [
        { id: 'SP_THIT_HEO', itemCode: '00123', name: 'Thịt Ba Rọi Rút Sườn', pricePerKg: 160000, unit: 'kg' },
        { id: 'SP_RAU_MUONG', itemCode: '00456', name: 'Rau Muống Nước', pricePerKg: 20000, unit: 'kg' }
      ];

      // Mã vạch cân điện tử: 20 + 00123 (mã hàng) + 01500 (1.500 kg) + 8 (checksum)
      const parsed = core.pos.parseWeighingBarcode('2000123015008', mockScaleCatalog);

      expect(parsed).toBeDefined();
      expect(parsed.isWeighingItem).toBe(true);
      expect(parsed.productId).toBe('SP_THIT_HEO');
      expect(parsed.productName).toBe('Thịt Ba Rọi Rút Sườn');
      expect(parsed.weightKg).toBe(1.5);
      // Thành tiền = 1.5 * 160.000 = 240.000 đ
      expect(parsed.subtotal).toBe(240000);
      expect(parsed.pricePerKg).toBe(160000);
    });

  });

})(typeof window !== 'undefined' ? window : global);
