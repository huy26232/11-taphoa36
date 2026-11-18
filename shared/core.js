/**
 * ============================================================================
 * 🏪 TẠP HÓA SỐ - MODULE LÕI HẠT NHÂN DÙNG CHUNG (SHARED/CORE.JS)
 * ============================================================================
 * Đề tài: Ứng dụng Tạp Hóa theo Yêu Cầu cho Người Mới Bắt Đầu (TapHoa36)
 * Học phần: Lập trình Web | Khoa CNTT - UTH | Nhóm 11
 * Tác giả: @core-dev (Core Engine Developer)
 *
 * PHÂN HỆ VÀ TRÁCH NHIỆM KỸ THUẬT:
 * 1. TapHoaCore.auth: Xác thực người dùng, Mock OAuth2 (Google/Facebook),
 *    RBAC Matrix (Customer, Cashier, Admin), Route Guard (protectPage),
 *    Quick Switcher Renderer.
 * 2. TapHoaCore.sync: Real-time Multi-tab Sync Engine (BroadcastChannel 'taphoaso_bus')
 *    kết hợp StorageEvent fallback (< 50ms latency), Anti-race condition.
 * 3. TapHoaCore.dal: Data Access Layer Offline-first qua IndexedDB ('TapHoaSoDB')
 *    với 6 Object Stores, Seeding 36 sản phẩm 12 ngành hàng, Offline queue manager.
 * 4. TapHoaCore.crypto: E2E Encryption với Web Crypto API (AES-GCM 256-bit, PBKDF2)
 *    mã hóa bảo vệ Sổ nợ quen xóm và PII khách hàng.
 * 5. TapHoaCore.export: Xuất Excel/CSV chuẩn UTF-8 BOM (\uFEFF) chống Mojibake,
 *    In hóa đơn nhiệt K80 chuẩn 80mm, Báo cáo tài chính PDF.
 * 6. TapHoaCore.ai: Động cơ TapHoa36 AI NLP (khử dấu tiếng Việt Unicode NFD),
 *    phân loại 10 nhóm ý định người dùng (Intent Classifier), trích xuất thực thể,
 *    và thuật toán gợi ý cá nhân hóa Hybrid Recommender.
 * 7. TapHoaCore.pos: Nghiệp vụ POS bán lẻ (quét Barcode, tính tiền thối,
 *    VietQR NAPAS 247, Sổ nợ, Phím tắt F1-F4/ESC, RBAC button guard).
 * 8. TapHoaCore.admin: Nghiệp vụ Quản trị Dashboard Bento Grid 12 cột,
 *    chuyển đổi 6 Views (Non-destructive), Nhập nhanh +10 kho, Dark mode,
 *    4 chỉ số tài chính, TapHoa36 AI Dynamic Pricing Optimizer.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // Biến tham chiếu môi trường
  const isBrowser = typeof window !== 'undefined';
  const root = isBrowser ? window : (typeof global !== 'undefined' ? global : this);

  // ==========================================================================
  // UTILITIES & HELPER FUNCTIONS
  // ==========================================================================

  function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
    const rounded = Math.round(Number(amount));
    return new Intl.NumberFormat('vi-VN').format(rounded) + ' đ';
  }

  function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return new Intl.NumberFormat('vi-VN').format(Number(num));
  }

  function formatDate(date) {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      try { return crypto.randomUUID(); } catch (e) {}
    }
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }

  // ==========================================================================
  // PHÂN HỆ 1: AUTHENTICATION & RBAC MATRIX (AC-AUTH)
  // ==========================================================================

  const SEED_USERS = [
    {
      id: 'USR-001',
      username: 'admin',
      password: 'admin123',
      name: 'Quản lý: Anh Lâm',
      role: 'admin',
      phone: '0901234567',
      email: 'anhlam.taphoa@gmail.com',
      avatar: '👨‍💼'
    },
    {
      id: 'USR-002',
      username: 'staff',
      password: 'staff123',
      name: 'Thu ngân: Minh Tuấn',
      role: 'cashier',
      phone: '0912345678',
      email: 'minhtuan.staff@taphoaso.vn',
      avatar: '🧑‍💻'
    },
    {
      id: 'USR-003',
      username: 'khachhang1',
      password: '123',
      name: 'Khách hàng: Chị Lan',
      role: 'customer',
      phone: '0987654321',
      email: 'chilan.q1@gmail.com',
      avatar: '👩'
    },
    {
      id: 'USR-004',
      username: 'khachhang2',
      password: '123',
      name: 'Khách hàng: Bác Ba',
      role: 'customer',
      phone: '0933221100',
      email: 'bacba.nguyen@gmail.com',
      avatar: '👴'
    }
  ];

  let currentAuthUser = null;

  // Khôi phục session từ storage nếu có
  if (isBrowser && window.localStorage) {
    try {
      const savedUser = window.localStorage.getItem('taphoa_current_user');
      if (savedUser) {
        currentAuthUser = JSON.parse(savedUser);
      }
    } catch (e) {}
  }

  const authModule = {
    getUsers() {
      return SEED_USERS.map(u => ({ ...u, password: undefined }));
    },

    getCurrentUser() {
      return currentAuthUser;
    },

    login(username, password) {
      if (!username || !password) return null;
      const normalizedUser = username.trim().toLowerCase();

      // 1. Tra cứu trong module ACL Engine (nếu có tài khoản tùy biến)
      if (typeof TapHoaCore !== 'undefined' && TapHoaCore.acl && typeof TapHoaCore.acl.getAccounts === 'function') {
        const aclAccounts = TapHoaCore.acl.getAccounts();
        const aclFound = aclAccounts.find(
          u => u.username.toLowerCase() === normalizedUser && u.password === password
        );
        if (aclFound) {
          if (aclFound.status === 'inactive') {
            return null; // Tài khoản bị tạm khóa
          }
          const userProfile = {
            id: aclFound.id,
            username: aclFound.username,
            name: aclFound.fullName || aclFound.username,
            role: aclFound.role,
            phone: aclFound.phone || '',
            email: aclFound.username + '@taphoa36.local',
            avatar: '👤'
          };
          currentAuthUser = userProfile;
          if (isBrowser && window.localStorage) {
            try {
              window.localStorage.setItem('taphoa_current_user', JSON.stringify(userProfile));
            } catch (e) {}
          }
          if (TapHoaCore.sync) TapHoaCore.sync.broadcast('USER_AUTH_CHANGED', { user: userProfile });
          return userProfile;
        }
      }

      // 2. Tra cứu trong SEED_USERS mặc định
      const found = SEED_USERS.find(
        u => u.username.toLowerCase() === normalizedUser && u.password === password
      );

      if (!found) {
        return null;
      }
      if (found.status === 'inactive') return null;

      const userProfile = {
        id: found.id,
        username: found.username,
        name: found.name,
        role: found.role,
        phone: found.phone,
        email: found.email,
        avatar: found.avatar
      };

      currentAuthUser = userProfile;
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.setItem('taphoa_current_user', JSON.stringify(userProfile));
        } catch (e) {}
      }

      // Phát sự kiện đồng bộ
      if (TapHoaCore.sync) TapHoaCore.sync.broadcast('USER_AUTH_CHANGED', { user: userProfile });
      return userProfile;
    },

    async loginOAuth(provider) {
      const prov = (provider || 'google').toLowerCase();
      // Giả lập modal xác thực
      const timestamp = Date.now();
      let profile;

      if (prov === 'google') {
        profile = {
          id: 'OAUTH-GG-' + timestamp,
          username: 'google_user_' + timestamp.toString().slice(-4),
          name: 'Khách hàng Google: Chị Mai',
          email: 'mai.tran92@gmail.com',
          avatar: 'https://lh3.googleusercontent.com/a/default-avatar',
          role: 'customer',
          provider: 'google',
          phone: '0909998877'
        };
      } else {
        profile = {
          id: 'OAUTH-FB-' + timestamp,
          username: 'fb_user_' + timestamp.toString().slice(-4),
          name: 'Khách hàng Facebook: Hoàng Nam',
          email: 'nam.hoang@facebook.com',
          avatar: 'https://graph.facebook.com/default-avatar',
          role: 'customer',
          provider: 'facebook',
          phone: '0912223344'
        };
      }

      currentAuthUser = profile;
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.setItem('taphoa_current_user', JSON.stringify(profile));
        } catch (e) {}
      }

      TapHoaCore.sync.broadcast('USER_AUTH_CHANGED', { user: profile });
      return profile;
    },

    logout() {
      currentAuthUser = null;
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.removeItem('taphoa_current_user');
        } catch (e) {}
      }
      TapHoaCore.sync.broadcast('USER_AUTH_CHANGED', { user: null });
      return true;
    },

    hasRole(roles) {
      if (!currentAuthUser) return false;
      const roleList = Array.isArray(roles) ? roles : [roles];
      return roleList.includes(currentAuthUser.role);
    },

    protectPage(allowedRoles, redirectUrl = 'store.html', testMode = false) {
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      const isAllowed = currentAuthUser && roles.includes(currentAuthUser.role);

      if (!isAllowed) {
        if (!testMode && isBrowser && window.location) {
          // Hiển thị thông báo bảo mật ngắn và chuyển hướng
          console.warn(`[RBAC GUARD]: Truy cập bị từ chối. Bạn không có quyền truy cập trang này. Đang chuyển hướng về ${redirectUrl}...`);
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1200);
        }
        return false;
      }
      return true;
    },

    renderQuickSwitcher(containerId) {
      const user = currentAuthUser;
      let html = '';

      // Khách vãng lai hoặc vai trò customer: Ẩn hoàn toàn Quick Switcher
      if (!user || user.role === 'customer') {
        html = `<div id="quickSwitcher" style="display: none;" class="hidden"></div>`;
        if (typeof document !== 'undefined' && containerId) {
          const el = document.getElementById(containerId);
          if (el) {
            el.innerHTML = html;
            el.style.display = 'none';
          }
        }
        return html;
      }

      // Thu ngân (cashier): hiển thị Store + POS
      if (user.role === 'cashier') {
        html = `
          <div id="quickSwitcher" class="inline-flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 shadow-md">
            <a href="store.html" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition flex items-center gap-1.5">
              <span>🛍️</span> Cửa Hàng
            </a>
            <a href="pos.html" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white shadow-sm flex items-center gap-1.5">
              <span>💻</span> Bán Quầy (POS)
            </a>
          </div>
        `;
      } else if (user.role === 'admin') {
        // Quản lý (admin): hiển thị Store + POS + Admin
        html = `
          <div id="quickSwitcher" class="inline-flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 shadow-md">
            <a href="store.html" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition flex items-center gap-1.5">
              <span>🛍️</span> store.html
            </a>
            <a href="pos.html" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition flex items-center gap-1.5">
              <span>💻</span> pos.html
            </a>
            <a href="admin.html" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm flex items-center gap-1.5">
              <span>⚙️</span> admin.html
            </a>
          </div>
        `;
      }

      if (typeof document !== 'undefined' && containerId) {
        const el = document.getElementById(containerId);
        if (el) {
          el.innerHTML = html;
          el.style.display = 'inline-flex';
        }
      }
      return html;
    }
  };

  // ==========================================================================
  // PHÂN HỆ 2: REAL-TIME MULTI-TAB SYNCHRONIZATION ENGINE (AC-SYNC)
  // ==========================================================================

  const listeners = {};
  let broadcastChannel = null;
  const CHANNEL_NAME = 'taphoaso_bus';
  const FALLBACK_STORAGE_KEY = 'taphoaso_sync_event';

  const hasBroadcastChannel = typeof BroadcastChannel !== 'undefined';

  if (hasBroadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = function (event) {
        if (event && event.data) {
          const { type, payload } = event.data;
          dispatchLocalEvent(type, payload);
        }
      };
    } catch (e) {
      broadcastChannel = null;
    }
  }

  // Lắng nghe Storage Event cho Fallback cross-tab
  if (isBrowser && window.addEventListener) {
    window.addEventListener('storage', function (e) {
      if (e.key === FALLBACK_STORAGE_KEY && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data && data.type) {
            dispatchLocalEvent(data.type, data.payload);
          }
        } catch (err) {}
      }
    });
  }

  function dispatchLocalEvent(eventType, payload) {
    if (listeners[eventType] && listeners[eventType].length > 0) {
      // Sao chép mảng handler để tránh lỗi khi handler gọi unregister trong khi duyệt
      const list = listeners[eventType].slice();
      for (let i = 0; i < list.length; i++) {
        try {
          list[i](payload);
        } catch (err) {
          console.error(`[SYNC BUS ERROR] Handler cho sự kiện ${eventType} gặp lỗi:`, err);
        }
      }
    }
  }

  const syncModule = {
    listen(handler) {
      this.on('PRODUCT_STOCK_CHANGED', handler);
      this.on('ORDER_CREATED', handler);
      this.on('NETWORK_STATUS_CHANGED', handler);
      return () => {
        this.off('PRODUCT_STOCK_CHANGED', handler);
        this.off('ORDER_CREATED', handler);
        this.off('NETWORK_STATUS_CHANGED', handler);
      };
    },

    on(eventType, handler) {
      if (!listeners[eventType]) {
        listeners[eventType] = [];
      }
      listeners[eventType].push(handler);
    },

    off(eventType, handler) {
      if (!listeners[eventType]) return;
      const idx = listeners[eventType].indexOf(handler);
      if (idx !== -1) {
        listeners[eventType].splice(idx, 1);
      }
    },

    broadcast(eventType, payload) {
      // 1. Phục vụ tab hiện tại (local listeners) ngay tức thì
      dispatchLocalEvent(eventType, payload);

      // 2. Phục vụ các tab khác qua BroadcastChannel
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({ type: eventType, payload });
        } catch (e) {}
      }

      // 3. Fallback sang localStorage StorageEvent
      if (isBrowser && window.localStorage) {
        try {
          const eventRecord = JSON.stringify({
            type: eventType,
            payload: payload,
            _ts: Date.now() + Math.random()
          });
          window.localStorage.setItem(FALLBACK_STORAGE_KEY, eventRecord);
        } catch (e) {}
      }
    },

    checkOutOfStockStatus(stock) {
      const isOut = Number(stock) <= 0;
      return {
        isOutOfStock: isOut,
        buttonDisabled: isOut,
        badgeText: isOut ? '🔴 Hết hàng' : `🟢 Còn hàng (${stock})`,
        badgeClass: isOut ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      };
    },

    isUsingFallback() {
      return !hasBroadcastChannel;
    }
  };

  // ==========================================================================
  // PHÂN HỆ 3: OFFLINE-FIRST STORAGE & DATA ACCESS LAYER (AC-DAL)
  // ==========================================================================

  const DB_NAME = 'TapHoaSoDB';
  const DB_VERSION = 1;
  const OBJECT_STORES = ['products', 'orders', 'debts', 'cash_flows', 'settings', 'offline_queue'];

  let dbConnection = null;
  let isNetworkOnline = (typeof navigator !== 'undefined' && 'onLine' in navigator) ? navigator.onLine : true;
  let inMemoryOfflineQueue = [];
  let inMemoryProducts = [];

  // Lắng nghe sự kiện Online/Offline từ trình duyệt
  if (isBrowser && window.addEventListener) {
    window.addEventListener('online', () => {
      isNetworkOnline = true;
      syncModule.broadcast('NETWORK_STATUS_CHANGED', { online: true });
      dalModule.syncOfflineQueue().catch(() => {});
    });
    window.addEventListener('offline', () => {
      isNetworkOnline = false;
      syncModule.broadcast('NETWORK_STATUS_CHANGED', { online: false });
    });
  }

  // Danh mục 36 sản phẩm mẫu phong phú thuộc 12 ngành hàng thiết yếu
  const SEED_PRODUCT_CATALOG = [
  {
    "id": "SP_0001",
    "name": "Omachi Mì ly hải sản chua cay 66gr",
    "barcode": "8936236471302",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 27,
    "unit": "ly",
    "rating": 4.5,
    "sales": 50,
    "image": "🍜",
    "daysUntilExpiry": 90,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0002",
    "name": "Dars Socola đen 42g",
    "barcode": "4902888183447",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 34,
    "unit": "gói",
    "rating": 4.6,
    "sales": 63,
    "image": "🍫",
    "daysUntilExpiry": 97,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0003",
    "name": "O'Star Snack Khoai Tây Vị Tự Nhiên",
    "barcode": "8936029425956",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 41,
    "unit": "gói",
    "rating": 4.7,
    "sales": 76,
    "image": "🍿",
    "daysUntilExpiry": 104,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0004",
    "name": "Chupa Chups Kẹo dẻo Hươu cao cổ cầu vồng",
    "barcode": "8935001720409",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 48,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 89,
    "image": "🍬",
    "daysUntilExpiry": 111,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0005",
    "name": "Chupa Chups Kẹo dẻo Hươu cao cổ cầu vồng",
    "barcode": "8935001720416",
    "category": "banh_keo",
    "costPrice": 4000,
    "price": 5000,
    "originalPrice": 5500,
    "stock": 55,
    "unit": "thanh",
    "rating": 4.9,
    "sales": 102,
    "image": "🍬",
    "daysUntilExpiry": 118,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0006",
    "name": "Kẹo marshmallow ovaltine matcha 25gr",
    "barcode": "6974936461768",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 62,
    "unit": "gói",
    "rating": 4.5,
    "sales": 115,
    "image": "🍬",
    "daysUntilExpiry": 125,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0007",
    "name": "Umiki Bánh bông lan tam giác sữa dâu",
    "barcode": "6976611080394",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 69,
    "unit": "gói",
    "rating": 4.6,
    "sales": 128,
    "image": "🍪",
    "daysUntilExpiry": 132,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0008",
    "name": "Kenju Bánh quy rau củ 192gr",
    "barcode": "8936047443772",
    "category": "rau_cu",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 76,
    "unit": "Túi",
    "rating": 4.7,
    "sales": 141,
    "image": "🍪",
    "daysUntilExpiry": 139,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0009",
    "name": "Karo Bánh bơ trứng giòn 270g",
    "barcode": "8938506170779",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 83,
    "unit": "Túi",
    "rating": 4.8,
    "sales": 154,
    "image": "🍪",
    "daysUntilExpiry": 146,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0010",
    "name": "Kenju Bánh quy vị tôm 192g",
    "barcode": "8936047440290",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 90,
    "unit": "Túi",
    "rating": 4.9,
    "sales": 167,
    "image": "🍪",
    "daysUntilExpiry": 153,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0011",
    "name": "Syrup Giffard Bạc Hà Trắng (Ice mint) - Chai 1L",
    "barcode": "3180293501426",
    "category": "nuoc_ngot",
    "costPrice": 27500,
    "price": 35000,
    "originalPrice": 38500,
    "stock": 97,
    "unit": "chai",
    "rating": 4.5,
    "sales": 180,
    "image": "🥤",
    "daysUntilExpiry": 160,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0012",
    "name": "Kẹo sữa Relaxa Cuwi",
    "barcode": "8991002304277",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 24,
    "unit": "gói",
    "rating": 4.6,
    "sales": 193,
    "image": "🍬",
    "daysUntilExpiry": 167,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0013",
    "name": "Đường vàng 12kg/cây",
    "barcode": "TM00109",
    "category": "gia_vi",
    "costPrice": 281000,
    "price": 360000,
    "originalPrice": 396000,
    "stock": 31,
    "unit": "bao",
    "rating": 4.7,
    "sales": 206,
    "image": "🧂",
    "daysUntilExpiry": 174,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0014",
    "name": "CỐT LẨU THÁI ĐẬM ĐẶC 1KG",
    "barcode": "TM00106",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 38,
    "unit": "gói",
    "rating": 4.8,
    "sales": 219,
    "image": "🧂",
    "daysUntilExpiry": 181,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0015",
    "name": "Karo Bánh Tươi Sợi Gà 26G",
    "barcode": "8938506170748",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 45,
    "unit": "cái",
    "rating": 4.9,
    "sales": 232,
    "image": "🍪",
    "daysUntilExpiry": 188,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0016",
    "name": "Karo Bánh Tươi Sợi Gà 26G",
    "barcode": "8938506170892",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 52,
    "unit": "túi",
    "rating": 4.5,
    "sales": 245,
    "image": "🍪",
    "daysUntilExpiry": 195,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0017",
    "name": "Rosy Bánh quy kem chanh",
    "barcode": "8850332241365",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 59,
    "unit": "gói",
    "rating": 4.6,
    "sales": 258,
    "image": "🍪",
    "daysUntilExpiry": 202,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0018",
    "name": "Gói quà Trung thu 26 - PREMIUM MIX - LM (1 phần gồm: 5 Bánh trung thu, 1 Bịch trà, 1 Bộ dao nĩa)",
    "barcode": "TM00070",
    "category": "web_doc_quyen",
    "costPrice": 195000,
    "price": 250000,
    "originalPrice": 275000,
    "stock": 66,
    "unit": "Phần",
    "rating": 4.7,
    "sales": 271,
    "image": "🎁",
    "daysUntilExpiry": 209,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0019",
    "name": "Bánh trung thu Thập cẩm Gà quay xốt XO",
    "barcode": "8936047449682",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 73,
    "unit": "cái",
    "rating": 4.8,
    "sales": 284,
    "image": "🍪",
    "daysUntilExpiry": 216,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0020",
    "name": "Bánh trung thu Hạt sen Macca",
    "barcode": "8936047449231",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 80,
    "unit": "cái",
    "rating": 4.9,
    "sales": 297,
    "image": "🍪",
    "daysUntilExpiry": 223,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0021",
    "name": "Siukay Mì hương vị hải sản ớt ma 128g",
    "barcode": "8934563106263",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 87,
    "unit": "gói",
    "rating": 4.5,
    "sales": 310,
    "image": "🍜",
    "daysUntilExpiry": 230,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0022",
    "name": "Nuts Holic Hạt hạnh nhân Hàn Quốc vị mật ong 30gr",
    "barcode": "8807354215331",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 94,
    "unit": "gói",
    "rating": 4.6,
    "sales": 323,
    "image": "🥜",
    "daysUntilExpiry": 237,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0023",
    "name": "Nuts Holic Hạt hạnh nhân Hàn Quốc vị mật ong 30gr",
    "barcode": "TM00067",
    "category": "hang_tuoi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 21,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 336,
    "image": "🥜",
    "daysUntilExpiry": 244,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0024",
    "name": "Nuts Holic Hạt hạnh nhân Hàn Quốc vị dâu 30gr",
    "barcode": "8807354215317",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 28,
    "unit": "gói",
    "rating": 4.8,
    "sales": 349,
    "image": "🥜",
    "daysUntilExpiry": 251,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0025",
    "name": "Nuts Holic Hạt hạnh nhân Hàn Quốc vị dâu 30gr",
    "barcode": "TM00069",
    "category": "hang_tuoi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 35,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 362,
    "image": "🥜",
    "daysUntilExpiry": 258,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0026",
    "name": "Ponnie Xúc Xích Tiệt Trùng nhân Phô mai 58 gr",
    "barcode": "8936034878921",
    "category": "thit_ca",
    "costPrice": 4500,
    "price": 6000,
    "originalPrice": 6500,
    "stock": 42,
    "unit": "cây",
    "rating": 4.5,
    "sales": 375,
    "image": "🥩",
    "daysUntilExpiry": 265,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0027",
    "name": "Hộp quà - Phúc Nguyệt Sơn",
    "barcode": "8936047443925",
    "category": "web_doc_quyen",
    "costPrice": 195000,
    "price": 250000,
    "originalPrice": 275000,
    "stock": 49,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 388,
    "image": "🎁",
    "daysUntilExpiry": 272,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0028",
    "name": "Hộp quà - Thu Thanh An",
    "barcode": "8936047444878",
    "category": "web_doc_quyen",
    "costPrice": 195000,
    "price": 250000,
    "originalPrice": 275000,
    "stock": 56,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 401,
    "image": "🎁",
    "daysUntilExpiry": 279,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0029",
    "name": "Chupa Chups Kẹo dẻo Sour Belt hương trái cây 1M 45g",
    "barcode": "8935001714774",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 63,
    "unit": "dây",
    "rating": 4.8,
    "sales": 414,
    "image": "🍬",
    "daysUntilExpiry": 286,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0030",
    "name": "Chupa Chups Kẹo dẻo Sour Belt hương trái cây 8.4g",
    "barcode": "8935001713074",
    "category": "banh_keo",
    "costPrice": 4000,
    "price": 5000,
    "originalPrice": 5500,
    "stock": 70,
    "unit": "thanh",
    "rating": 4.9,
    "sales": 427,
    "image": "🍬",
    "daysUntilExpiry": 293,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0031",
    "name": "Chupa Chups Kẹo dẻo Sour Belt hương trái cây 8.4g",
    "barcode": "SP011413",
    "category": "web_doc_quyen",
    "costPrice": 14000,
    "price": 18000,
    "originalPrice": 20000,
    "stock": 77,
    "unit": "Combo2",
    "rating": 4.5,
    "sales": 440,
    "image": "🎁",
    "daysUntilExpiry": 300,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0032",
    "name": "Chupa Chups Kẹo dẻo Sour Belt hương trái cây 8.4g",
    "barcode": "SP011414",
    "category": "web_doc_quyen",
    "costPrice": 58500,
    "price": 75000,
    "originalPrice": 82500,
    "stock": 84,
    "unit": "Combo10",
    "rating": 4.6,
    "sales": 53,
    "image": "🎁",
    "daysUntilExpiry": 307,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0033",
    "name": "Hộp quà - Phúc Thanh Yên",
    "barcode": "8936047443949",
    "category": "web_doc_quyen",
    "costPrice": 195000,
    "price": 250000,
    "originalPrice": 275000,
    "stock": 91,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 66,
    "image": "🎁",
    "daysUntilExpiry": 314,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0034",
    "name": "Chân gà bà Tuyết",
    "barcode": "8938552123675",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 98,
    "unit": "gói",
    "rating": 4.8,
    "sales": 79,
    "image": "🥩",
    "daysUntilExpiry": 321,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0035",
    "name": "Chân gà bà Tuyết",
    "barcode": "SP011411",
    "category": "web_doc_quyen",
    "costPrice": 31000,
    "price": 40000,
    "originalPrice": 44000,
    "stock": 25,
    "unit": "Combo5",
    "rating": 4.9,
    "sales": 92,
    "image": "🎁",
    "daysUntilExpiry": 328,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0036",
    "name": "Chân gà bà Tuyết",
    "barcode": "SP011412",
    "category": "web_doc_quyen",
    "costPrice": 58500,
    "price": 75000,
    "originalPrice": 82500,
    "stock": 32,
    "unit": "Combo10",
    "rating": 4.5,
    "sales": 105,
    "image": "🎁",
    "daysUntilExpiry": 335,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0037",
    "name": "Kenju Nougat kem dẻo 186g",
    "barcode": "8938532962515",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 39,
    "unit": "túi",
    "rating": 4.6,
    "sales": 118,
    "image": "🍪",
    "daysUntilExpiry": 342,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0038",
    "name": "Kenju nhân gà phô mai nướng 216g",
    "barcode": "8936047444250",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 46,
    "unit": "túi",
    "rating": 4.7,
    "sales": 131,
    "image": "🍪",
    "daysUntilExpiry": 349,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0039",
    "name": "Hộp quà - Thu Phú Quý",
    "barcode": "8936047441563",
    "category": "web_doc_quyen",
    "costPrice": 195000,
    "price": 250000,
    "originalPrice": 275000,
    "stock": 53,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 144,
    "image": "🎁",
    "daysUntilExpiry": 356,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0040",
    "name": "Sedaap Mì trộn vị gà nướng lá chanh 89gr",
    "barcode": "8998866635134",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 60,
    "unit": "gói",
    "rating": 4.9,
    "sales": 157,
    "image": "🍜",
    "daysUntilExpiry": 93,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0041",
    "name": "Sedaap Mì trộn vị gà nướng lá chanh 89gr",
    "barcode": "8998866205054",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 67,
    "unit": "túi",
    "rating": 4.5,
    "sales": 170,
    "image": "🍜",
    "daysUntilExpiry": 100,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0042",
    "name": "MacCoffee Caphe Phố sữa đá 240gr",
    "barcode": "8936024241667",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 74,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 183,
    "image": "☕",
    "daysUntilExpiry": 107,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0043",
    "name": "G7 Café Trung Nguyên 3in1",
    "barcode": "8935024123287",
    "category": "nuoc_ngot",
    "costPrice": 40500,
    "price": 52000,
    "originalPrice": 57000,
    "stock": 81,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 196,
    "image": "☕",
    "daysUntilExpiry": 114,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0044",
    "name": "Aji-Mayo Xốt Mayonnaisse vị nguyên bản 130gr",
    "barcode": "8935039572520",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 88,
    "unit": "chai",
    "rating": 4.8,
    "sales": 209,
    "image": "🍶",
    "daysUntilExpiry": 121,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0045",
    "name": "Aji - Quick Gia vị nêm sẵn lẩu thái 50gr",
    "barcode": "8935039513257",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 95,
    "unit": "gói",
    "rating": 4.9,
    "sales": 222,
    "image": "🧂",
    "daysUntilExpiry": 128,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0046",
    "name": "Aji - Quick Bột tẩm khô chiên giòn 42gr",
    "barcode": "8935039514223",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 235,
    "image": "🧂",
    "daysUntilExpiry": 135,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0047",
    "name": "Miliket Mì giấy sate 75gr",
    "barcode": "8934579100408",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 248,
    "image": "🍜",
    "daysUntilExpiry": 142,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0048",
    "name": "Cholimex Sate ớt thủy tinh 150gr",
    "barcode": "8934637514284",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 36,
    "unit": "hủ",
    "rating": 4.7,
    "sales": 261,
    "image": "🧂",
    "daysUntilExpiry": 149,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0049",
    "name": "VIFON Bột canh",
    "barcode": "8935311120661",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 274,
    "image": "🧂",
    "daysUntilExpiry": 156,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0050",
    "name": "VIFON Phở Gà gói 75gr",
    "barcode": "8935311110068",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 50,
    "unit": "gói",
    "rating": 4.9,
    "sales": 287,
    "image": "🍜",
    "daysUntilExpiry": 163,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0051",
    "name": "VIFON Phở Bò gói 75gr",
    "barcode": "8935311110044",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 300,
    "image": "🍜",
    "daysUntilExpiry": 170,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0052",
    "name": "VIFON Phở Thịt Gà tô 120gr",
    "barcode": "8935311110303",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 64,
    "unit": "tô",
    "rating": 4.6,
    "sales": 313,
    "image": "🍜",
    "daysUntilExpiry": 177,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0053",
    "name": "VIFON Phở Thịt Bò tô 120gr",
    "barcode": "8935311110280",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 71,
    "unit": "tô",
    "rating": 4.7,
    "sales": 326,
    "image": "🍜",
    "daysUntilExpiry": 184,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0054",
    "name": "Alpenliebe Kẹo mút hương kem quả mọng 9.5g",
    "barcode": "8935001718369",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 78,
    "unit": "que",
    "rating": 4.8,
    "sales": 339,
    "image": "🍬",
    "daysUntilExpiry": 191,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0055",
    "name": "Alpenliebe Kẹo mút hương Dâu kem 9.5g",
    "barcode": "8935001708469",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 85,
    "unit": "que",
    "rating": 4.9,
    "sales": 352,
    "image": "🍬",
    "daysUntilExpiry": 198,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0056",
    "name": "Alpenliebe Kẹo mút sữa careamel 9.5g",
    "barcode": "8935001708452",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 92,
    "unit": "que",
    "rating": 4.5,
    "sales": 365,
    "image": "🍬",
    "daysUntilExpiry": 205,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0057",
    "name": "Omachi Mì cua xốt ớt Singapore",
    "barcode": "8936236472248",
    "category": "mi_goi",
    "costPrice": 6500,
    "price": 8500,
    "originalPrice": 9500,
    "stock": 99,
    "unit": "gói",
    "rating": 4.6,
    "sales": 378,
    "image": "🍜",
    "daysUntilExpiry": 212,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0058",
    "name": "Majestic Bánh Cookies thập cẩm HT 382gr",
    "barcode": "8936047447022",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 26,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 391,
    "image": "🍪",
    "daysUntilExpiry": 219,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0059",
    "name": "Festa Bánh mì hoa cúc ngàn lớp túi 120g",
    "barcode": "8938532962720",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 33,
    "unit": "túi",
    "rating": 4.8,
    "sales": 404,
    "image": "🍪",
    "daysUntilExpiry": 226,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0060",
    "name": "Alpenliebe Kẹo không nhân cà phê sữa",
    "barcode": "8935001719106",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 40,
    "unit": "gói",
    "rating": 4.9,
    "sales": 417,
    "image": "🍬",
    "daysUntilExpiry": 233,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0061",
    "name": "Alpenliebe Kẹo không nhân Dâu kem",
    "barcode": "8935001703129",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 47,
    "unit": "gói",
    "rating": 4.5,
    "sales": 430,
    "image": "🍬",
    "daysUntilExpiry": 240,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0062",
    "name": "Alpenliebe Kẹo không nhân sữa caramen",
    "barcode": "8935001701699",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 54,
    "unit": "gói",
    "rating": 4.6,
    "sales": 443,
    "image": "🍬",
    "daysUntilExpiry": 247,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0063",
    "name": "Chupa Chups Kẹo mút hương hỗn hợp sắc màu",
    "barcode": "TM00059",
    "category": "banh_keo",
    "costPrice": 4000,
    "price": 5000,
    "originalPrice": 5500,
    "stock": 61,
    "unit": "que",
    "rating": 4.7,
    "sales": 56,
    "image": "🍬",
    "daysUntilExpiry": 254,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0064",
    "name": "Chupa Chups Kẹo mút hương hỗn hợp sắc màu",
    "barcode": "8935001720560",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 68,
    "unit": "gói",
    "rating": 4.8,
    "sales": 69,
    "image": "🍬",
    "daysUntilExpiry": 261,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0065",
    "name": "Chupa Chups Kẹo mút hương hỗn hợp sắc màu",
    "barcode": "SP011417",
    "category": "web_doc_quyen",
    "costPrice": 14000,
    "price": 18000,
    "originalPrice": 20000,
    "stock": 75,
    "unit": "Combo2",
    "rating": 4.9,
    "sales": 82,
    "image": "🎁",
    "daysUntilExpiry": 268,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0066",
    "name": "Chupa Chups Kẹo mút hương hỗn hợp sắc màu",
    "barcode": "SP011418",
    "category": "web_doc_quyen",
    "costPrice": 58500,
    "price": 75000,
    "originalPrice": 82500,
    "stock": 82,
    "unit": "Combo10",
    "rating": 4.5,
    "sales": 95,
    "image": "🎁",
    "daysUntilExpiry": 275,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0067",
    "name": "Chupa Chups Kẹo mút hương hỗn hợp",
    "barcode": "TM00058",
    "category": "banh_keo",
    "costPrice": 4000,
    "price": 5000,
    "originalPrice": 5500,
    "stock": 89,
    "unit": "que",
    "rating": 4.6,
    "sales": 108,
    "image": "🍬",
    "daysUntilExpiry": 282,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0068",
    "name": "Chupa Chups Kẹo mút hương hỗn hợp",
    "barcode": "8935001720553",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 96,
    "unit": "gói",
    "rating": 4.7,
    "sales": 121,
    "image": "🍬",
    "daysUntilExpiry": 289,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0069",
    "name": "Chupa Chups Kẹo mút hương hỗn hợp",
    "barcode": "SP011415",
    "category": "web_doc_quyen",
    "costPrice": 14000,
    "price": 18000,
    "originalPrice": 20000,
    "stock": 23,
    "unit": "Combo2",
    "rating": 4.8,
    "sales": 134,
    "image": "🎁",
    "daysUntilExpiry": 296,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0070",
    "name": "Chupa Chups Kẹo mút hương hỗn hợp",
    "barcode": "SP011416",
    "category": "web_doc_quyen",
    "costPrice": 58500,
    "price": 75000,
    "originalPrice": 82500,
    "stock": 30,
    "unit": "Combo10",
    "rating": 4.9,
    "sales": 147,
    "image": "🎁",
    "daysUntilExpiry": 303,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0071",
    "name": "Mentos Kẹo quả mọng",
    "barcode": "8935001719977",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 37,
    "unit": "thỏi",
    "rating": 4.5,
    "sales": 160,
    "image": "🍬",
    "daysUntilExpiry": 310,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0072",
    "name": "Mentos Kẹo Cầu Vồng",
    "barcode": "8935001711483",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 44,
    "unit": "thỏi",
    "rating": 4.6,
    "sales": 173,
    "image": "🍬",
    "daysUntilExpiry": 317,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0073",
    "name": "Mentos Kẹo Bạc hà",
    "barcode": "8935001707165",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 51,
    "unit": "thỏi",
    "rating": 4.7,
    "sales": 186,
    "image": "🍬",
    "daysUntilExpiry": 324,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0074",
    "name": "Alpenliebe Kẹo mềm 2 chew Chanh dây hạt chia gói",
    "barcode": "8935001718567",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 58,
    "unit": "gói",
    "rating": 4.8,
    "sales": 199,
    "image": "🍬",
    "daysUntilExpiry": 331,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0075",
    "name": "Alpenliebe Kẹo mềm 2 chew Chanh dây hạt chia",
    "barcode": "8935001718130",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 65,
    "unit": "thỏi",
    "rating": 4.9,
    "sales": 212,
    "image": "🍬",
    "daysUntilExpiry": 338,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0076",
    "name": "Alpenliebe Kẹo mềm 2 chew Dâu gói",
    "barcode": "8935001713760",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 72,
    "unit": "gói",
    "rating": 4.5,
    "sales": 225,
    "image": "🍬",
    "daysUntilExpiry": 345,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0077",
    "name": "Alpenliebe Kẹo mềm 2 chew Dâu",
    "barcode": "8935001712411",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 79,
    "unit": "thỏi",
    "rating": 4.6,
    "sales": 238,
    "image": "🍬",
    "daysUntilExpiry": 352,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0078",
    "name": "Alpenliebe Kẹo mềm 2 chew Nho gói",
    "barcode": "8935001712343",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 86,
    "unit": "gói",
    "rating": 4.7,
    "sales": 251,
    "image": "🍬",
    "daysUntilExpiry": 359,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0079",
    "name": "Alpenliebe Kẹo mềm 2 chew Nho",
    "barcode": "8935001712336",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 93,
    "unit": "thỏi",
    "rating": 4.8,
    "sales": 264,
    "image": "🍬",
    "daysUntilExpiry": 96,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0080",
    "name": "Alpenlibe Kẹo cứng hương café sữa",
    "barcode": "8935001719892",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 20,
    "unit": "thỏi",
    "rating": 4.9,
    "sales": 277,
    "image": "🍬",
    "daysUntilExpiry": 103,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0081",
    "name": "Alpenlibe Kẹo cứng Golia Active plus nhân syro thảo dược",
    "barcode": "8935001704300",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 27,
    "unit": "thỏi",
    "rating": 4.5,
    "sales": 290,
    "image": "🍬",
    "daysUntilExpiry": 110,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0082",
    "name": "Alpenlibe Kẹo cứng bạc hà nhân socola",
    "barcode": "8935001714057",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 34,
    "unit": "thỏi",
    "rating": 4.6,
    "sales": 303,
    "image": "🍬",
    "daysUntilExpiry": 117,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0083",
    "name": "Alpenlibe Kẹo cứng xoài muối ớt",
    "barcode": "8935001714316",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 41,
    "unit": "thỏi",
    "rating": 4.7,
    "sales": 316,
    "image": "🍬",
    "daysUntilExpiry": 124,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0084",
    "name": "Alpenlibe Kẹo cứng Dâu kem",
    "barcode": "8935001703181",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 48,
    "unit": "thỏi",
    "rating": 4.8,
    "sales": 329,
    "image": "🍬",
    "daysUntilExpiry": 131,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0085",
    "name": "Alpenlibe Kẹo cứng sữa caramen",
    "barcode": "8935001704188",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 55,
    "unit": "thỏi",
    "rating": 4.9,
    "sales": 342,
    "image": "🍬",
    "daysUntilExpiry": 138,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0086",
    "name": "Alpenlibe Tim nho nhí nhảnh 24gr",
    "barcode": "8935001720010",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 62,
    "unit": "gói",
    "rating": 4.5,
    "sales": 355,
    "image": "🍪",
    "daysUntilExpiry": 145,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0087",
    "name": "Alpenlibe Kẹo dẻo Tim đào ngọt ngào 24gr",
    "barcode": "8935001719052",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 69,
    "unit": "gói",
    "rating": 4.6,
    "sales": 368,
    "image": "🍬",
    "daysUntilExpiry": 152,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0088",
    "name": "Alpenlibe Kẹo dẻo Biển xanh long lanh 24gr",
    "barcode": "8935001718857",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 76,
    "unit": "gói",
    "rating": 4.7,
    "sales": 381,
    "image": "🍬",
    "daysUntilExpiry": 159,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0089",
    "name": "Alpenlibe Kẹo dẻo Vũ trụ kỳ thú 24gr",
    "barcode": "8935001720423",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 83,
    "unit": "gói",
    "rating": 4.8,
    "sales": 394,
    "image": "🍬",
    "daysUntilExpiry": 166,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0090",
    "name": "Chupa Chups Kẹo dẻo maxi tubies 104gr",
    "barcode": "8935001719489",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 90,
    "unit": "gói",
    "rating": 4.9,
    "sales": 407,
    "image": "🍬",
    "daysUntilExpiry": 173,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0091",
    "name": "Chupa Chups Kẹo dẻo Bites 24gr",
    "barcode": "8935001714361",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 97,
    "unit": "gói",
    "rating": 4.5,
    "sales": 420,
    "image": "🍬",
    "daysUntilExpiry": 180,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0092",
    "name": "Chupa Chups Kẹo dẻo top mix 24gr",
    "barcode": "8935001717706",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 24,
    "unit": "gói",
    "rating": 4.6,
    "sales": 433,
    "image": "🍬",
    "daysUntilExpiry": 187,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0093",
    "name": "Chupa Chups Kẹo dẻo ống ngắn cầu vồng có nhân 24gr",
    "barcode": "8935001714545",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 31,
    "unit": "gói",
    "rating": 4.7,
    "sales": 446,
    "image": "🍬",
    "daysUntilExpiry": 194,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0094",
    "name": "Chupa Chups Kẹo dẻo sâu 24gr",
    "barcode": "8935001715856",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 38,
    "unit": "gói",
    "rating": 4.8,
    "sales": 59,
    "image": "🍬",
    "daysUntilExpiry": 201,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0095",
    "name": "Chupa Chups Kẹo dẻo vị Cola 24gr",
    "barcode": "8935001713555",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 45,
    "unit": "gói",
    "rating": 4.9,
    "sales": 72,
    "image": "🍬",
    "daysUntilExpiry": 208,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0096",
    "name": "Chupa Chups Kẹo dẻo gấu Panda 24gr",
    "barcode": "8935001713548",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 52,
    "unit": "gói",
    "rating": 4.5,
    "sales": 85,
    "image": "🍬",
    "daysUntilExpiry": 215,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0097",
    "name": "Tipo Cracker Rau Củ Chà Bông 265g",
    "barcode": "8934760129256",
    "category": "rau_cu",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 59,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 98,
    "image": "🍪",
    "daysUntilExpiry": 222,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0098",
    "name": "Tipo Cracker Rau Củ Chà Bông 132g",
    "barcode": "8934760129249",
    "category": "rau_cu",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 66,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 111,
    "image": "🍪",
    "daysUntilExpiry": 229,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0099",
    "name": "Tipo Bánh Trứng Sữa Chua Rắc Hạt Điều 126g",
    "barcode": "8934760210336",
    "category": "sua_bo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 73,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 124,
    "image": "🍪",
    "daysUntilExpiry": 236,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0100",
    "name": "Tipo Bánh Kem Xốp Phô Mai 180g",
    "barcode": "8934760039142",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 80,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 137,
    "image": "🍪",
    "daysUntilExpiry": 243,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0101",
    "name": "Tipo Bánh trứng kem sữa chua chanh leo 250gr",
    "barcode": "8934760210299",
    "category": "sua_bo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 87,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 150,
    "image": "🍪",
    "daysUntilExpiry": 250,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0102",
    "name": "Kendo Bánh trứng cuộn vị Socola Dừa 90g",
    "barcode": "8934760121861",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 94,
    "unit": "gói",
    "rating": 4.6,
    "sales": 163,
    "image": "🍫",
    "daysUntilExpiry": 257,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0103",
    "name": "Tipo Bánh trứng nướng 115g",
    "barcode": "8934760211913",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 21,
    "unit": "gói",
    "rating": 4.7,
    "sales": 176,
    "image": "🍪",
    "daysUntilExpiry": 264,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0104",
    "name": "Tipo Bánh trứng nướng 39g",
    "barcode": "8934760219278",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 28,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 189,
    "image": "🍪",
    "daysUntilExpiry": 271,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0105",
    "name": "Vifon Cháo thịt bằm 70gr",
    "barcode": "8935311110624",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 35,
    "unit": "gói",
    "rating": 4.9,
    "sales": 202,
    "image": "🍜",
    "daysUntilExpiry": 278,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0106",
    "name": "Enaak snack mì vị BBQ",
    "barcode": "8994834009754",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 42,
    "unit": "gói",
    "rating": 4.5,
    "sales": 215,
    "image": "🍪",
    "daysUntilExpiry": 285,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0107",
    "name": "Bento Snack Mực Vị Cay Nồng 5G",
    "barcode": "8935342400428",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 49,
    "unit": "gói",
    "rating": 4.6,
    "sales": 228,
    "image": "🍿",
    "daysUntilExpiry": 292,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0108",
    "name": "O'Star Snack Ngôi Sao Vị Tảo Biển 53G",
    "barcode": "8936036021646",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 56,
    "unit": "gói",
    "rating": 4.7,
    "sales": 241,
    "image": "🍿",
    "daysUntilExpiry": 299,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0109",
    "name": "O'Star Snack Ngôi Sao Vị Kim Chi 53G",
    "barcode": "8936036021653",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 63,
    "unit": "gói",
    "rating": 4.8,
    "sales": 254,
    "image": "🍿",
    "daysUntilExpiry": 306,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0110",
    "name": "Bánh quy hạnh nhân lát",
    "barcode": "TM00045",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 70,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 267,
    "image": "🍪",
    "daysUntilExpiry": 313,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0111",
    "name": "Chinsu Nước mắm Nam Ngư 500Ml",
    "barcode": "8936221048076",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 77,
    "unit": "chai",
    "rating": 4.5,
    "sales": 280,
    "image": "🍶",
    "daysUntilExpiry": 320,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0112",
    "name": "Zennut Hạt hướng dương Vị Vỏ Quýt 70G",
    "barcode": "8936241860078",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 84,
    "unit": "gói",
    "rating": 4.6,
    "sales": 293,
    "image": "🥜",
    "daysUntilExpiry": 327,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0113",
    "name": "Zennut Hạt hướng dương Vị Hoa Nhài 70G",
    "barcode": "8936241860092",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 91,
    "unit": "gói",
    "rating": 4.7,
    "sales": 306,
    "image": "🥜",
    "daysUntilExpiry": 334,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0114",
    "name": "Zennut Hạt hướng dương Vị Sữa 70G",
    "barcode": "8936241860085",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 98,
    "unit": "gói",
    "rating": 4.8,
    "sales": 319,
    "image": "🍪",
    "daysUntilExpiry": 341,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0115",
    "name": "Zennut Hạt Hướng Dương Vị Vỏ Quýt 30G",
    "barcode": "8936241860047",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 25,
    "unit": "gói",
    "rating": 4.9,
    "sales": 332,
    "image": "🥜",
    "daysUntilExpiry": 348,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0116",
    "name": "Zennut Hạt Hướng Dương Vị Hoa Nhài 30G",
    "barcode": "8936241860061",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 32,
    "unit": "gói",
    "rating": 4.5,
    "sales": 345,
    "image": "🥜",
    "daysUntilExpiry": 355,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0117",
    "name": "Zennut Hạt Hướng Dương Vị Sữa 30G",
    "barcode": "8936241860054",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 39,
    "unit": "gói",
    "rating": 4.6,
    "sales": 358,
    "image": "🍪",
    "daysUntilExpiry": 92,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0118",
    "name": "Ottogi Mì YEUL Cay",
    "barcode": "8936049051616",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 46,
    "unit": "ly",
    "rating": 4.7,
    "sales": 371,
    "image": "🍜",
    "daysUntilExpiry": 99,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0119",
    "name": "Ottogi Mini Mì Jin Cay 80G",
    "barcode": "8936049051371",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 53,
    "unit": "gói",
    "rating": 4.8,
    "sales": 384,
    "image": "🍜",
    "daysUntilExpiry": 106,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0120",
    "name": "Ottogi Mì Kim Chi",
    "barcode": "8936049051623",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 60,
    "unit": "ly",
    "rating": 4.9,
    "sales": 397,
    "image": "🍜",
    "daysUntilExpiry": 113,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0121",
    "name": "Ottogi Mì Bò Hầm Vị Cay",
    "barcode": "8936049051630",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 67,
    "unit": "ly",
    "rating": 4.5,
    "sales": 410,
    "image": "🍜",
    "daysUntilExpiry": 120,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0122",
    "name": "Nongshim Mì Champong Vị Mực 124G",
    "barcode": "31146151905",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 74,
    "unit": "gói",
    "rating": 4.6,
    "sales": 423,
    "image": "🍜",
    "daysUntilExpiry": 127,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0123",
    "name": "Tuấn Đạt Trái Cây Thập Cẩm Sấy",
    "barcode": "8935032201304",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 436,
    "image": "🥜",
    "daysUntilExpiry": 134,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0124",
    "name": "Haribo Kẹo Dẻo Happy Col",
    "barcode": "8691216098145",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 88,
    "unit": "gói",
    "rating": 4.8,
    "sales": 449,
    "image": "🍬",
    "daysUntilExpiry": 141,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0125",
    "name": "Hong Tai Kee Quả Thanh Mai Sấy Dẻ",
    "barcode": "6921716535034",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 95,
    "unit": "gói",
    "rating": 4.9,
    "sales": 62,
    "image": "🥜",
    "daysUntilExpiry": 148,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0126",
    "name": "Hong Tai Kee Mận Anh Đào Sấy Dẻ",
    "barcode": "6921716535027",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 75,
    "image": "🥜",
    "daysUntilExpiry": 155,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0127",
    "name": "Guodudu Đào Vàng Sấy Dẻo",
    "barcode": "6976949681102",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 88,
    "image": "🥜",
    "daysUntilExpiry": 162,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0128",
    "name": "Guodudu Mơ Sấy Dẻ",
    "barcode": "6976949681119",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 36,
    "unit": "gói",
    "rating": 4.7,
    "sales": 101,
    "image": "🥜",
    "daysUntilExpiry": 169,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0129",
    "name": "Snack Tôm Cuộn Hoàng Gia",
    "barcode": "8936204410418",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 114,
    "image": "🍿",
    "daysUntilExpiry": 176,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0130",
    "name": "Snack Bắp Nướng Hoàng Gia",
    "barcode": "8936204410425",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 50,
    "unit": "gói",
    "rating": 4.9,
    "sales": 127,
    "image": "🍿",
    "daysUntilExpiry": 183,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0131",
    "name": "Oreo Bánh Quy Nhân Vị Bánh Nướng Đường Nâu 105Gr",
    "barcode": "7622202838125",
    "category": "nhu_yeu_pham",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 57,
    "unit": "cái",
    "rating": 4.5,
    "sales": 140,
    "image": "🍚",
    "daysUntilExpiry": 190,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0132",
    "name": "C'Est Bon! Sandwich Sốt Bơ Phô Mai Chà Bông 5 Cái",
    "barcode": "8936036029376",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 64,
    "unit": "gói",
    "rating": 4.6,
    "sales": 153,
    "image": "🍪",
    "daysUntilExpiry": 197,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0133",
    "name": "C'Est Bon! Mochi Cốm Dừa 5 Cái",
    "barcode": "8936029425802",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 166,
    "image": "🍪",
    "daysUntilExpiry": 204,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0134",
    "name": "Orion Bánh Con Cá Bống Bang Cốm Xanh Đậu Đỏ 5 Cái",
    "barcode": "8936029424997",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 78,
    "unit": "gói",
    "rating": 4.8,
    "sales": 179,
    "image": "🍪",
    "daysUntilExpiry": 211,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0135",
    "name": "Orion Bánh Con Cá Bống Bang Socola Đậu Đỏ 5 Cái",
    "barcode": "8936029421781",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 192,
    "image": "🍫",
    "daysUntilExpiry": 218,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0136",
    "name": "Bông Lan Nướng Dừa 60G",
    "barcode": "8936142210033",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 92,
    "unit": "cái",
    "rating": 4.5,
    "sales": 205,
    "image": "🍪",
    "daysUntilExpiry": 225,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0137",
    "name": "Bánh Pound Nho 50G",
    "barcode": "8936142210408",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 99,
    "unit": "cái",
    "rating": 4.6,
    "sales": 218,
    "image": "🍪",
    "daysUntilExpiry": 232,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0138",
    "name": "Bánh Pound Hồng Trà Vanilla 50G",
    "barcode": "8936142211252",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 26,
    "unit": "cái",
    "rating": 4.7,
    "sales": 231,
    "image": "🍪",
    "daysUntilExpiry": 239,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0139",
    "name": "Bông Lan Chà Bông 60G",
    "barcode": "8936142210590",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 33,
    "unit": "cái",
    "rating": 4.8,
    "sales": 244,
    "image": "🍪",
    "daysUntilExpiry": 246,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0140",
    "name": "Bông Lan Nướng Socola 60G",
    "barcode": "8936142210026",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 40,
    "unit": "cái",
    "rating": 4.9,
    "sales": 257,
    "image": "🍫",
    "daysUntilExpiry": 253,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0141",
    "name": "Bông Lan Nướng Phô Mai 60G",
    "barcode": "8936142210279",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 47,
    "unit": "cái",
    "rating": 4.5,
    "sales": 270,
    "image": "🍪",
    "daysUntilExpiry": 260,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0142",
    "name": "Nhớ Phở Bò 74G",
    "barcode": "8934563221157",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 54,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 283,
    "image": "🍜",
    "daysUntilExpiry": 267,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0143",
    "name": "Meizan Bột Mì Đa Dụng Cao Cấp 500G",
    "barcode": "8936055280642",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 61,
    "unit": "gói",
    "rating": 4.7,
    "sales": 296,
    "image": "🍜",
    "daysUntilExpiry": 274,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0144",
    "name": "Meizan Bột Bắp 150G",
    "barcode": "8936231190154",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 68,
    "unit": "gói",
    "rating": 4.8,
    "sales": 309,
    "image": "📦",
    "daysUntilExpiry": 281,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0145",
    "name": "Meizan Bột Chiên Giòn 150Gr",
    "barcode": "8938509627010",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 75,
    "unit": "gói",
    "rating": 4.9,
    "sales": 322,
    "image": "📦",
    "daysUntilExpiry": 288,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0146",
    "name": "Meizan Bột Nếp 400Gr",
    "barcode": "8938509627379",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 82,
    "unit": "gói",
    "rating": 4.5,
    "sales": 335,
    "image": "📦",
    "daysUntilExpiry": 295,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0147",
    "name": "Meizan Bột Gạo 400Gr",
    "barcode": "8938509627263",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 89,
    "unit": "gói",
    "rating": 4.6,
    "sales": 348,
    "image": "🌾",
    "daysUntilExpiry": 302,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0148",
    "name": "Meizan Bột Năng 400G",
    "barcode": "8936231190123",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 96,
    "unit": "gói",
    "rating": 4.7,
    "sales": 361,
    "image": "📦",
    "daysUntilExpiry": 309,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0149",
    "name": "Meizan Nui Cao Cấp Chữ C 400G",
    "barcode": "8938509627171",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 23,
    "unit": "gói",
    "rating": 4.8,
    "sales": 374,
    "image": "📦",
    "daysUntilExpiry": 316,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0150",
    "name": "Meizan Nui Cao Cấp 400Gr",
    "barcode": "8938509627119",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 30,
    "unit": "gói",
    "rating": 4.9,
    "sales": 387,
    "image": "📦",
    "daysUntilExpiry": 323,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0151",
    "name": "Meizan Nui Xoắn Cao Cấp 300Gr",
    "barcode": "8938509627270",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 37,
    "unit": "gói",
    "rating": 4.5,
    "sales": 400,
    "image": "📦",
    "daysUntilExpiry": 330,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0152",
    "name": "Meizan Gạo Nàng Thơm Hảo Hạng 5Kg",
    "barcode": "8938516870355",
    "category": "nhu_yeu_pham",
    "costPrice": 121000,
    "price": 155000,
    "originalPrice": 170500,
    "stock": 44,
    "unit": "túi",
    "rating": 4.6,
    "sales": 413,
    "image": "🌾",
    "daysUntilExpiry": 337,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0153",
    "name": "Milo Sữa 3 Trong 1 Dạng Dây (10+1) 22G",
    "barcode": "8934804030913",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 51,
    "unit": "gói",
    "rating": 4.7,
    "sales": 426,
    "image": "🍪",
    "daysUntilExpiry": 344,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0154",
    "name": "Milo Sữa 3 Trong 1 Dạng Dây (10+1) 22G",
    "barcode": "SP000048",
    "category": "sua_bo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 58,
    "unit": "dây",
    "rating": 4.8,
    "sales": 439,
    "image": "🍪",
    "daysUntilExpiry": 351,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0155",
    "name": "Nescafe Cà Phê Hòa Tan 3In1 Vị Rang Đậm 16G",
    "barcode": "8934804044385",
    "category": "nuoc_ngot",
    "costPrice": 2500,
    "price": 3500,
    "originalPrice": 4000,
    "stock": 65,
    "unit": "gói",
    "rating": 4.9,
    "sales": 52,
    "image": "🥤",
    "daysUntilExpiry": 358,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0156",
    "name": "Nescafe Cà Phê Hòa Tan 3In1 Vị Rang Đậm 16G",
    "barcode": "8934804051512",
    "category": "nuoc_ngot",
    "costPrice": 37500,
    "price": 48000,
    "originalPrice": 53000,
    "stock": 72,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 65,
    "image": "🥤",
    "daysUntilExpiry": 95,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0157",
    "name": "Nescafe Cà Phê Hòa Tan Vị Nguyên Bản 16G",
    "barcode": "8934804030494",
    "category": "nuoc_ngot",
    "costPrice": 2500,
    "price": 3500,
    "originalPrice": 4000,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 78,
    "image": "🥤",
    "daysUntilExpiry": 102,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0158",
    "name": "Nescafe Cà Phê Hòa Tan Vị Nguyên Bản 16G",
    "barcode": "8934804051345",
    "category": "nuoc_ngot",
    "costPrice": 37500,
    "price": 48000,
    "originalPrice": 53000,
    "stock": 86,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 91,
    "image": "🥤",
    "daysUntilExpiry": 109,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0159",
    "name": "Nescafe Cà Phê Sữa Đá Hộp 10 Gói 24G",
    "barcode": "8934804030692",
    "category": "nuoc_ngot",
    "costPrice": 37500,
    "price": 48000,
    "originalPrice": 53000,
    "stock": 93,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 104,
    "image": "🥤",
    "daysUntilExpiry": 116,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0160",
    "name": "Nescafe Café Việt Hộp 15 Gói X 16G",
    "barcode": "8934804027388",
    "category": "nuoc_ngot",
    "costPrice": 37500,
    "price": 48000,
    "originalPrice": 53000,
    "stock": 20,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 117,
    "image": "☕",
    "daysUntilExpiry": 123,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0161",
    "name": "Cộng Cà Phê Sữa 204G",
    "barcode": "8938531133633",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 27,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 130,
    "image": "🥤",
    "daysUntilExpiry": 130,
    "branchId": "branch_main"
  },
  {
    "id": "prod_03",
    "name": "Hảo Hảo Muối Chấm Tôm Chua Cay 120G",
    "barcode": "8934563065249",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 34,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 143,
    "image": "🧂",
    "daysUntilExpiry": 137,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0163",
    "name": "Meizan Bơ Thực Vật 80G",
    "barcode": "8934988070101",
    "category": "sua_bo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 41,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 156,
    "image": "🍪",
    "daysUntilExpiry": 144,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0164",
    "name": "Simply Dầu Đậu Nành 400Ml",
    "barcode": "8934988020014",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 48,
    "unit": "chai",
    "rating": 4.8,
    "sales": 169,
    "image": "🛢️",
    "daysUntilExpiry": 151,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0165",
    "name": "Dầu Cái Lân 1 Lít",
    "barcode": "8934988030020",
    "category": "gia_vi",
    "costPrice": 27500,
    "price": 35000,
    "originalPrice": 38500,
    "stock": 55,
    "unit": "chai",
    "rating": 4.9,
    "sales": 182,
    "image": "🛢️",
    "daysUntilExpiry": 158,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0166",
    "name": "Nam Dương Nước Tương Đậu Nành Lên Men 280Ml",
    "barcode": "8936134360067",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 62,
    "unit": "chai",
    "rating": 4.5,
    "sales": 195,
    "image": "🧂",
    "daysUntilExpiry": 165,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0167",
    "name": "Nam Dương Sốt Dầu Dấm 250G",
    "barcode": "8936134362573",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 69,
    "unit": "chai",
    "rating": 4.6,
    "sales": 208,
    "image": "🛢️",
    "daysUntilExpiry": 172,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0168",
    "name": "Simply Xốt Mayonnaise Hương Gạo Rang 230Gr",
    "barcode": "8936134363648",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 76,
    "unit": "chai",
    "rating": 4.7,
    "sales": 221,
    "image": "🍶",
    "daysUntilExpiry": 179,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0169",
    "name": "Solite Bánh Cuộn Kem Vị Dâu 378G",
    "barcode": "8934680042895",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 83,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 234,
    "image": "🍪",
    "daysUntilExpiry": 186,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0170",
    "name": "Oreo Bánh Quy Nhân Kem Việt Quất Lạnh 110.4G",
    "barcode": "7622300442507",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 90,
    "unit": "gói",
    "rating": 4.9,
    "sales": 247,
    "image": "🍪",
    "daysUntilExpiry": 193,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0171",
    "name": "Oreo Bánh Quy Nhân Kem Socola 110.4G",
    "barcode": "8992760223015",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 97,
    "unit": "gói",
    "rating": 4.5,
    "sales": 260,
    "image": "🍫",
    "daysUntilExpiry": 200,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0172",
    "name": "Oreo Bánh Quy Nhân Kem Vani 110.4G",
    "barcode": "8992760221028",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 24,
    "unit": "gói",
    "rating": 4.6,
    "sales": 273,
    "image": "🍪",
    "daysUntilExpiry": 207,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0173",
    "name": "Meiji Sôcôla Macadamia 64G",
    "barcode": "4902777006284",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 31,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 286,
    "image": "🍫",
    "daysUntilExpiry": 214,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0174",
    "name": "Toppo Bánh Que Nhân Sô Cô La Hương Vani 40G",
    "barcode": "8852008510010",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 38,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 299,
    "image": "🍪",
    "daysUntilExpiry": 221,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0175",
    "name": "Hershey'S Socola Kem Sữa Hạnh Nhân 40G",
    "barcode": "6942836702403",
    "category": "sua_bo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 45,
    "unit": "thanh",
    "rating": 4.9,
    "sales": 312,
    "image": "🍫",
    "daysUntilExpiry": 228,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0176",
    "name": "Dairy Milk Socola Trái Cây Và Hạt 32G",
    "barcode": "9556182104049",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 52,
    "unit": "thanh",
    "rating": 4.5,
    "sales": 325,
    "image": "🍫",
    "daysUntilExpiry": 235,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0177",
    "name": "Dairy Milk Socola Sữa 34G",
    "barcode": "9556182104001",
    "category": "sua_bo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 59,
    "unit": "thanh",
    "rating": 4.6,
    "sales": 338,
    "image": "🍫",
    "daysUntilExpiry": 242,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0178",
    "name": "Dairy Milk Socola Hạnh Nhân 32G",
    "barcode": "9556182104018",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 66,
    "unit": "thanh",
    "rating": 4.7,
    "sales": 351,
    "image": "🍫",
    "daysUntilExpiry": 249,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0179",
    "name": "Dairy Milk Socola Sữa 11G",
    "barcode": "7622202243639",
    "category": "sua_bo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 73,
    "unit": "thanh",
    "rating": 4.8,
    "sales": 364,
    "image": "🍫",
    "daysUntilExpiry": 256,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0180",
    "name": "Cosy Bánh Xốp Kem Vị Dâu Thẹ Lạnh 49.9G",
    "barcode": "8934680033671",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 80,
    "unit": "gói",
    "rating": 4.9,
    "sales": 377,
    "image": "🍪",
    "daysUntilExpiry": 263,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0181",
    "name": "Cosy Bánh Xốp Kem Vị Dừa Lá Dứa 49.9G",
    "barcode": "8934680033657",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 87,
    "unit": "gói",
    "rating": 4.5,
    "sales": 390,
    "image": "🍪",
    "daysUntilExpiry": 270,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0182",
    "name": "Cosy Bánh Quế Kem Vị Lá Dứa 117.6G",
    "barcode": "8934680033107",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 94,
    "unit": "gói",
    "rating": 4.6,
    "sales": 403,
    "image": "🍪",
    "daysUntilExpiry": 277,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0183",
    "name": "Cosy Bánh Quế Kem Vị Socola 126G",
    "barcode": "8934680033114",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 21,
    "unit": "gói",
    "rating": 4.7,
    "sales": 416,
    "image": "🍫",
    "daysUntilExpiry": 284,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0184",
    "name": "Siukay Mì Vị Bò 127G",
    "barcode": "8934563131258",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 28,
    "unit": "gói",
    "rating": 4.8,
    "sales": 429,
    "image": "🍜",
    "daysUntilExpiry": 291,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0185",
    "name": "Simply Dầu Đậu Nành 1 Lít",
    "barcode": "8934988020021",
    "category": "gia_vi",
    "costPrice": 27500,
    "price": 35000,
    "originalPrice": 38500,
    "stock": 35,
    "unit": "chai",
    "rating": 4.9,
    "sales": 442,
    "image": "🛢️",
    "daysUntilExpiry": 298,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0186",
    "name": "Solite Bánh Cuộn Kem Bơ Sữa 378G",
    "barcode": "8934680042765",
    "category": "sua_bo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 42,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 55,
    "image": "🍪",
    "daysUntilExpiry": 305,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0187",
    "name": "Solite Bánh Cuộn Kem Lá Dứa 378G",
    "barcode": "8934680042888",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 49,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 68,
    "image": "🍪",
    "daysUntilExpiry": 312,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0188",
    "name": "Mini Oreo Nhân Kem Socola 20.4G",
    "barcode": "7622210515278",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 56,
    "unit": "gói",
    "rating": 4.7,
    "sales": 81,
    "image": "🍫",
    "daysUntilExpiry": 319,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0189",
    "name": "Mini Oreo Nhân Kem Vani 20.4",
    "barcode": "7622210515285",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 63,
    "unit": "gói",
    "rating": 4.8,
    "sales": 94,
    "image": "🍪",
    "daysUntilExpiry": 326,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0190",
    "name": "Crown Bánh Quế Kem Sô Cô La Trắng Hạt Phỉ White Heim 142G",
    "barcode": "8801111186247",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 70,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 107,
    "image": "🍪",
    "daysUntilExpiry": 333,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0191",
    "name": "Crown Bánh Quế Kem Sô Cô La Hạt Phỉ Choco Heim 142G",
    "barcode": "8801111186216",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 77,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 120,
    "image": "🍫",
    "daysUntilExpiry": 340,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0192",
    "name": "Crown Bánh Quy Kem Cà Phê Couque D'Asse 128G",
    "barcode": "8801111186087",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 84,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 133,
    "image": "🍪",
    "daysUntilExpiry": 347,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0193",
    "name": "Crown Bánh Quy Kem Sữa Couque D'Asse White 128G",
    "barcode": "8801111186117",
    "category": "sua_bo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 91,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 146,
    "image": "🍪",
    "daysUntilExpiry": 354,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0194",
    "name": "Biên Hòa Đường Túi Pure 1Kg",
    "barcode": "8935015510454",
    "category": "gia_vi",
    "costPrice": 27500,
    "price": 35000,
    "originalPrice": 38500,
    "stock": 98,
    "unit": "gói",
    "rating": 4.8,
    "sales": 159,
    "image": "🧂",
    "daysUntilExpiry": 91,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0195",
    "name": "Dilmah Trà Đen Hương Táo, Quế Và Va-Ni 30G",
    "barcode": "9312631142327",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 25,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 172,
    "image": "🍵",
    "daysUntilExpiry": 98,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0196",
    "name": "Ocv Cốt Hủ Tiếu Nam Vang 90Gr",
    "barcode": "8934781022604",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 32,
    "unit": "gói",
    "rating": 4.5,
    "sales": 185,
    "image": "🍜",
    "daysUntilExpiry": 105,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0197",
    "name": "Ocv Cốt Bún Bò Huế 90Gr",
    "barcode": "8934781022642",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 39,
    "unit": "gói",
    "rating": 4.6,
    "sales": 198,
    "image": "🧂",
    "daysUntilExpiry": 112,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0198",
    "name": "Ocv Bột Cà Ri 20Gr",
    "barcode": "8934781150116",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 46,
    "unit": "gói",
    "rating": 4.7,
    "sales": 211,
    "image": "🧂",
    "daysUntilExpiry": 119,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0199",
    "name": "Ocv Bột Ngũ Vị Hương 10Gr",
    "barcode": "8934781150406",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 53,
    "unit": "gói",
    "rating": 4.8,
    "sales": 224,
    "image": "🧂",
    "daysUntilExpiry": 126,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0200",
    "name": "Ocv Cốt Bún Riêu Cua 90Gr",
    "barcode": "8934781022635",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 60,
    "unit": "gói",
    "rating": 4.9,
    "sales": 237,
    "image": "🧂",
    "daysUntilExpiry": 133,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0201",
    "name": "Ocv Bột Ớt Siêu Cay 40Gr",
    "barcode": "8934781035000",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 67,
    "unit": "hủ",
    "rating": 4.5,
    "sales": 250,
    "image": "🧂",
    "daysUntilExpiry": 140,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0202",
    "name": "Ocv Muối Tiêu 100Gr",
    "barcode": "8934781118239",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 74,
    "unit": "hủ",
    "rating": 4.6,
    "sales": 263,
    "image": "🧂",
    "daysUntilExpiry": 147,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0203",
    "name": "Aji-Ngon Hạt Nêm Heo 400Gr",
    "barcode": "8935039508222",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 276,
    "image": "🧂",
    "daysUntilExpiry": 154,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0204",
    "name": "Ajinomoto Bột Ngọt Hạt Lớn 230Gr",
    "barcode": "8935039500967",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 88,
    "unit": "gói",
    "rating": 4.8,
    "sales": 289,
    "image": "🧂",
    "daysUntilExpiry": 161,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0205",
    "name": "Sosal Group Muối Tinh Sấy Iốt 1Kg",
    "barcode": "8936120311035",
    "category": "gia_vi",
    "costPrice": 27500,
    "price": 35000,
    "originalPrice": 38500,
    "stock": 95,
    "unit": "gói",
    "rating": 4.9,
    "sales": 302,
    "image": "🧂",
    "daysUntilExpiry": 168,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0206",
    "name": "Goblim Bánh Trứng Vị Socola 26G",
    "barcode": "6971533425322",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 315,
    "image": "🍫",
    "daysUntilExpiry": 175,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0207",
    "name": "Ohayo Bánh Tráng Vị Khô Bò Sa Tế 40G",
    "barcode": "8936204410050",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 328,
    "image": "📦",
    "daysUntilExpiry": 182,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0208",
    "name": "Ohayo Chân Gà Rút Xương Hồng Kông Dưa Muối Cay 80G",
    "barcode": "8936204410333",
    "category": "rau_cu",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 36,
    "unit": "gói",
    "rating": 4.7,
    "sales": 341,
    "image": "🍪",
    "daysUntilExpiry": 189,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0209",
    "name": "Ohayo Bánh Tráng Vị Khô Gà Siêu Cay 40G",
    "barcode": "8936204410043",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 354,
    "image": "📦",
    "daysUntilExpiry": 196,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0210",
    "name": "Ohayo Bò Nướng Miếng Vị Tiêu Xanh 25G",
    "barcode": "8936204410128",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 50,
    "unit": "gói",
    "rating": 4.9,
    "sales": 367,
    "image": "🥩",
    "daysUntilExpiry": 203,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0211",
    "name": "Ohayo Chân Gà Rút Xương Hồng Kông 60G",
    "barcode": "8936204410241",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 380,
    "image": "🍗",
    "daysUntilExpiry": 210,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0212",
    "name": "Ohayo Bánh Tráng Vị Phô Mai Cay 40G",
    "barcode": "8936204410036",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 64,
    "unit": "gói",
    "rating": 4.6,
    "sales": 393,
    "image": "📦",
    "daysUntilExpiry": 217,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0213",
    "name": "Ritz Bánh Quy Kem Phô Mai 106G",
    "barcode": "4547894640296",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 71,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 406,
    "image": "🍪",
    "daysUntilExpiry": 224,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0214",
    "name": "Chacheer Đậu Trái Cây Khô Tổng Hợp 26G",
    "barcode": "6937351707651",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 78,
    "unit": "gói",
    "rating": 4.8,
    "sales": 419,
    "image": "🍪",
    "daysUntilExpiry": 231,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0215",
    "name": "Nescafe Café Việt Dây 11 Gói X16G Km 1 Gói",
    "barcode": "8934804044415",
    "category": "nuoc_ngot",
    "costPrice": 2500,
    "price": 3500,
    "originalPrice": 4000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 432,
    "image": "☕",
    "daysUntilExpiry": 238,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0216",
    "name": "Nescafe Café Việt Dây 11 Gói X16G Km 1 Gói",
    "barcode": "SP001162",
    "category": "nuoc_ngot",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 92,
    "unit": "dây",
    "rating": 4.5,
    "sales": 445,
    "image": "☕",
    "daysUntilExpiry": 245,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0217",
    "name": "Nescafe Cfsd Dây 10X24G Myw",
    "barcode": "8934804031309",
    "category": "nuoc_ngot",
    "costPrice": 2500,
    "price": 3500,
    "originalPrice": 4000,
    "stock": 99,
    "unit": "gói",
    "rating": 4.6,
    "sales": 58,
    "image": "🥤",
    "daysUntilExpiry": 252,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0218",
    "name": "Nescafe Cfsd Dây 10X24G Myw",
    "barcode": "SP001161",
    "category": "nuoc_ngot",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 26,
    "unit": "dây",
    "rating": 4.7,
    "sales": 71,
    "image": "🥤",
    "daysUntilExpiry": 259,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0219",
    "name": "Crown Bánh Quế Kem Sô Cô La Hạt Phỉ Choco Heim 47G",
    "barcode": "8801111186209",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 33,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 84,
    "image": "🍫",
    "daysUntilExpiry": 266,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0220",
    "name": "Crown Bánh Quế Kem Sô Cô La Trắng Hạt Phỉ White Heim 47G",
    "barcode": "8801111186230",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 40,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 97,
    "image": "🍪",
    "daysUntilExpiry": 273,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0221",
    "name": "Meizan Bột Ngọt Cánh Vừa 400Gr",
    "barcode": "8936134364119",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 47,
    "unit": "gói",
    "rating": 4.5,
    "sales": 110,
    "image": "🧂",
    "daysUntilExpiry": 280,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0222",
    "name": "Hershey'S Socola Kem Sữa 40G",
    "barcode": "6942836701024",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 54,
    "unit": "gói",
    "rating": 4.6,
    "sales": 123,
    "image": "🍫",
    "daysUntilExpiry": 287,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0223",
    "name": "Hershey'S Nuggets Socola Kem Sữa 56G",
    "barcode": "6942836704346",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 61,
    "unit": "gói",
    "rating": 4.7,
    "sales": 136,
    "image": "🍫",
    "daysUntilExpiry": 294,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0224",
    "name": "Hershey'S Nuggets Socola Sữa Hạnh Nhân 56G",
    "barcode": "6942836704360",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 68,
    "unit": "gói",
    "rating": 4.8,
    "sales": 149,
    "image": "🍫",
    "daysUntilExpiry": 301,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0225",
    "name": "Umiki Bánh Mì Ngàn Lớp Vị Sữa 80G",
    "barcode": "6976611080097",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 75,
    "unit": "gói",
    "rating": 4.9,
    "sales": 162,
    "image": "🍪",
    "daysUntilExpiry": 308,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0226",
    "name": "Umiki Bánh Bông Lan Sữa Shougong 120G",
    "barcode": "6976611080493",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 82,
    "unit": "gói",
    "rating": 4.5,
    "sales": 175,
    "image": "🍪",
    "daysUntilExpiry": 315,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0227",
    "name": "Umiki Bánh Mì Hình Đĩa Nhạc 90G",
    "barcode": "6974682241126",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 89,
    "unit": "gói",
    "rating": 4.6,
    "sales": 188,
    "image": "🍜",
    "daysUntilExpiry": 322,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0228",
    "name": "Mayeef Bánh Bông Lan Cuộn Vị Sô Cô La 160G",
    "barcode": "6933661508667",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 96,
    "unit": "gói",
    "rating": 4.7,
    "sales": 201,
    "image": "🍪",
    "daysUntilExpiry": 329,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0229",
    "name": "Mayeef Bánh Bông Lan Cuộn Vị Sữa 160G",
    "barcode": "6933661508674",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 23,
    "unit": "gói",
    "rating": 4.8,
    "sales": 214,
    "image": "🍪",
    "daysUntilExpiry": 336,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0230",
    "name": "Umiki Bánh Bông Lan Tam Giác Vị Socola 75G",
    "barcode": "6976611080417",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 30,
    "unit": "gói",
    "rating": 4.9,
    "sales": 227,
    "image": "🍫",
    "daysUntilExpiry": 343,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0231",
    "name": "Mayeef Bánh Bông Lan Cuộn Vị Matcha 160G",
    "barcode": "6933661508681",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 37,
    "unit": "gói",
    "rating": 4.5,
    "sales": 240,
    "image": "🍪",
    "daysUntilExpiry": 350,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0232",
    "name": "Umiki Bánh Mì Ngàn Lớp Sữa Việt Quất 80G",
    "barcode": "6976611080318",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 44,
    "unit": "gói",
    "rating": 4.6,
    "sales": 253,
    "image": "🍪",
    "daysUntilExpiry": 357,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0233",
    "name": "Umiki Bánh Bông Lan Tam Giác Vị Matcha 75G",
    "barcode": "6976611080448",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 51,
    "unit": "gói",
    "rating": 4.7,
    "sales": 266,
    "image": "🍪",
    "daysUntilExpiry": 94,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0234",
    "name": "Dorkbua Bánh Que Vị Truyền Thống 20G",
    "barcode": "8935342400015",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 58,
    "unit": "gói",
    "rating": 4.8,
    "sales": 279,
    "image": "🍪",
    "daysUntilExpiry": 101,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0235",
    "name": "Hershey'S Nuggets Socola Trắng Bánh Quy 28G",
    "barcode": "6942836704308",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 65,
    "unit": "gói",
    "rating": 4.9,
    "sales": 292,
    "image": "🍫",
    "daysUntilExpiry": 108,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0236",
    "name": "Hershey'S Nuggets Socola Kem Sữa 28G",
    "barcode": "6942836704261",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 72,
    "unit": "gói",
    "rating": 4.5,
    "sales": 305,
    "image": "🍫",
    "daysUntilExpiry": 115,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0237",
    "name": "Hershey'S Nuggets Socola Đen Hạnh Nhân 28G",
    "barcode": "6942836704322",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 318,
    "image": "🍫",
    "daysUntilExpiry": 122,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0238",
    "name": "Hershey'S Nuggets Socola Trắng Bánh Quy 56G",
    "barcode": "6942836704384",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 86,
    "unit": "gói",
    "rating": 4.7,
    "sales": 331,
    "image": "🍫",
    "daysUntilExpiry": 129,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0239",
    "name": "Hershey'S Nuggets Socola Đen Hạnh Nhân 56G",
    "barcode": "6942836704421",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 93,
    "unit": "gói",
    "rating": 4.8,
    "sales": 344,
    "image": "🍫",
    "daysUntilExpiry": 136,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0240",
    "name": "Hershey'S Socola Viên Vị Cookies Choco 36G",
    "barcode": "6942836725020",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 20,
    "unit": "gói",
    "rating": 4.9,
    "sales": 357,
    "image": "🍫",
    "daysUntilExpiry": 143,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0241",
    "name": "Hershey'S Kisses Socola Sữa Hạnh Nhân 36G",
    "barcode": "6942836703288",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 27,
    "unit": "gói",
    "rating": 4.5,
    "sales": 370,
    "image": "🍫",
    "daysUntilExpiry": 150,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0242",
    "name": "Hershey'S Kisses Socola Kem Sữa 36G",
    "barcode": "6942836703226",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 34,
    "unit": "gói",
    "rating": 4.6,
    "sales": 383,
    "image": "🍫",
    "daysUntilExpiry": 157,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0243",
    "name": "Horsh Bánh Sandwich Chà Bông Rong Biển Vị Trứng Muối",
    "barcode": "6973202709306",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 41,
    "unit": "gói",
    "rating": 4.7,
    "sales": 396,
    "image": "🧂",
    "daysUntilExpiry": 164,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0244",
    "name": "Horsh Bánh Sandwich Nhân Kem Trứng",
    "barcode": "6973202709580",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 48,
    "unit": "gói",
    "rating": 4.8,
    "sales": 409,
    "image": "🍪",
    "daysUntilExpiry": 171,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0245",
    "name": "Bánh Bông Lan Tam Giác Sữa Dâu 100G",
    "barcode": "6976611081810",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 55,
    "unit": "gói",
    "rating": 4.9,
    "sales": 422,
    "image": "🍪",
    "daysUntilExpiry": 178,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0246",
    "name": "Kinh Đô Snack Vị Cua Xanh 29G",
    "barcode": "8934680012652",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 62,
    "unit": "gói",
    "rating": 4.5,
    "sales": 435,
    "image": "🍿",
    "daysUntilExpiry": 185,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0247",
    "name": "AFC Bánh Quy Vị Lúa Mì 86G",
    "barcode": "8934680025959",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 69,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 448,
    "image": "🍜",
    "daysUntilExpiry": 192,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0248",
    "name": "AFC Bánh Quy Vị Rau 86G",
    "barcode": "8934680025966",
    "category": "rau_cu",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 76,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 61,
    "image": "🍪",
    "daysUntilExpiry": 199,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0249",
    "name": "Slide Snack Khoai Tây Vị Thịt Nướng 145G",
    "barcode": "8934680011204",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 83,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 74,
    "image": "🍿",
    "daysUntilExpiry": 206,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0250",
    "name": "Slide Snack Khoai Tây Vị Kem Hành 145G",
    "barcode": "8934680011211",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 90,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 87,
    "image": "🍿",
    "daysUntilExpiry": 213,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0251",
    "name": "Slide Snack Khoai Tây Vị Thơm Cay 145G",
    "barcode": "8934680011228",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 97,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 100,
    "image": "🍿",
    "daysUntilExpiry": 220,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0252",
    "name": "Slide Snack Khoai Tây Sò Điệp Bào Ngư 145G",
    "barcode": "8934680016278",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 24,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 113,
    "image": "🍿",
    "daysUntilExpiry": 227,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0253",
    "name": "Slide Snack Khoai Tây Vị Phô Mai 145G",
    "barcode": "8934680011709",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 31,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 126,
    "image": "🍿",
    "daysUntilExpiry": 234,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0254",
    "name": "Slide Snack Khoai Tây Vị Kem Hành 90G",
    "barcode": "8934680011990",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 38,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 139,
    "image": "🍿",
    "daysUntilExpiry": 241,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0255",
    "name": "Slide Snack Khoai Tây Vị Thịt Nướng 90G",
    "barcode": "8934680011983",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 45,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 152,
    "image": "🍿",
    "daysUntilExpiry": 248,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0256",
    "name": "Slide Snack Khoai Tây Vị Thơm Cay 90G",
    "barcode": "8934680012027",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 52,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 165,
    "image": "🍿",
    "daysUntilExpiry": 255,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0257",
    "name": "Slide Snack Khoai Tây Vị Tự Nhiên Original 90G",
    "barcode": "8934680012010",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 59,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 178,
    "image": "🍿",
    "daysUntilExpiry": 262,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0258",
    "name": "Slide Snack Khoai Tây Vị Phô Mai 90G",
    "barcode": "8934680012003",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 66,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 191,
    "image": "🍿",
    "daysUntilExpiry": 269,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0259",
    "name": "AFC Bánh Quy Vị Rau Km Hạt Thảo Mộc",
    "barcode": "8934680025973",
    "category": "rau_cu",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 73,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 204,
    "image": "🍪",
    "daysUntilExpiry": 276,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0260",
    "name": "AFC Bánh Quy Vị Lúa Mì Km Hạt Thảo Mộc",
    "barcode": "8934680025980",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 80,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 217,
    "image": "🍜",
    "daysUntilExpiry": 283,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0261",
    "name": "Garden Club Mù Tạt Vàng 227G",
    "barcode": "71735080582",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 87,
    "unit": "chai",
    "rating": 4.5,
    "sales": 230,
    "image": "🧂",
    "daysUntilExpiry": 290,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0262",
    "name": "Crown Bơ Đậu Phộng Smooth & Creamy 510G",
    "barcode": "12656707394",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 94,
    "unit": "hủ",
    "rating": 4.6,
    "sales": 243,
    "image": "🍪",
    "daysUntilExpiry": 297,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0263",
    "name": "Cobi Bánh Que Sữa Mềm 33G",
    "barcode": "8935299654790",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 21,
    "unit": "gói",
    "rating": 4.7,
    "sales": 256,
    "image": "🍪",
    "daysUntilExpiry": 304,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0264",
    "name": "Tayo Snack Khoai Tây Vị Tảo Ngọt 28G",
    "barcode": "8936036025293",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 28,
    "unit": "gói",
    "rating": 4.8,
    "sales": 269,
    "image": "🍿",
    "daysUntilExpiry": 311,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0265",
    "name": "Doublemint Kẹo Sing Gum Vị Bạc Hà 58.4G",
    "barcode": "8936114080084",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 35,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 282,
    "image": "🍬",
    "daysUntilExpiry": 318,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0266",
    "name": "Doublemint Kẹo Ngậm Vị Chanh 23.8G X Hộ",
    "barcode": "8857122621376",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 42,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 295,
    "image": "🍬",
    "daysUntilExpiry": 325,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0267",
    "name": "Doublemint Kẹo Sing Gum Vị Bạc Hà 58.4G",
    "barcode": "9555192502630",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 49,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 308,
    "image": "🍬",
    "daysUntilExpiry": 332,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0268",
    "name": "Cool Air Kẹo Sing Gum Bạc Hà Khuynh Diệp 58.4G",
    "barcode": "8936114080022",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 56,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 321,
    "image": "🍬",
    "daysUntilExpiry": 339,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0269",
    "name": "M&M'S Kẹo Sôcôla Sữa 37G",
    "barcode": "93682961",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 63,
    "unit": "gói",
    "rating": 4.8,
    "sales": 334,
    "image": "🍫",
    "daysUntilExpiry": 346,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0270",
    "name": "Skittles Kẹo Trái Cây Vị Chua 15G",
    "barcode": "8936114080763",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 70,
    "unit": "gói",
    "rating": 4.9,
    "sales": 347,
    "image": "🍬",
    "daysUntilExpiry": 353,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0271",
    "name": "Snickers Sôcôla Nhân Đậu Phộng 51G",
    "barcode": "6914973600362",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 77,
    "unit": "thanh",
    "rating": 4.5,
    "sales": 360,
    "image": "🍫",
    "daysUntilExpiry": 90,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0272",
    "name": "Snickers Kẹo Sôcôla 20G",
    "barcode": "69025310",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 84,
    "unit": "thanh",
    "rating": 4.6,
    "sales": 373,
    "image": "🍫",
    "daysUntilExpiry": 97,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0273",
    "name": "M&M'S Kẹo Sôcôla Sữa 14,5G",
    "barcode": "6914973603516",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 91,
    "unit": "gói",
    "rating": 4.7,
    "sales": 386,
    "image": "🍫",
    "daysUntilExpiry": 104,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0274",
    "name": "Skittles Kẹo Trái Cây Vị Dâu Rừng 15G",
    "barcode": "8936227750232",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 98,
    "unit": "gói",
    "rating": 4.8,
    "sales": 399,
    "image": "🍬",
    "daysUntilExpiry": 111,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0275",
    "name": "Cool Air Kẹo Sing Gum Hương Quả Mọng 55.4G",
    "barcode": "8936114080961",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 25,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 412,
    "image": "🍬",
    "daysUntilExpiry": 118,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0276",
    "name": "Doublemint Kẹo Ngậm Vị Cam Bạc Hà 23.8G X Hộ",
    "barcode": "8997018484217",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 32,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 425,
    "image": "🍬",
    "daysUntilExpiry": 125,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0277",
    "name": "Doublemint Kẹo Ngậm Vị Bạc Hà Dịu Nhẹ 23.8G X Hộ",
    "barcode": "8997018480790",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 39,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 438,
    "image": "🍬",
    "daysUntilExpiry": 132,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0278",
    "name": "Doublemint Kẹo Ngậm Vị Bạc Hà Đậm Đà 23.8G X Hộ",
    "barcode": "8997018480769",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 46,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 51,
    "image": "🍬",
    "daysUntilExpiry": 139,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0279",
    "name": "Sugus Kẹo Mềm Vị Dâu 30G",
    "barcode": "8851929011590",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 53,
    "unit": "thanh",
    "rating": 4.8,
    "sales": 64,
    "image": "🍬",
    "daysUntilExpiry": 146,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0280",
    "name": "Sugus Kẹo Mềm Vị Cam 30G",
    "barcode": "8851929011613",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 60,
    "unit": "thanh",
    "rating": 4.9,
    "sales": 77,
    "image": "🍬",
    "daysUntilExpiry": 153,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0281",
    "name": "Sugus Kẹo Mềm Vị Nho 30G",
    "barcode": "8851929011606",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 67,
    "unit": "thanh",
    "rating": 4.5,
    "sales": 90,
    "image": "🍬",
    "daysUntilExpiry": 160,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0282",
    "name": "M&M'S Kẹo Sôcôla Đậu Phộng 37G",
    "barcode": "93682978",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 74,
    "unit": "gói",
    "rating": 4.6,
    "sales": 103,
    "image": "🍫",
    "daysUntilExpiry": 167,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0283",
    "name": "M&M'S Kẹo Sôcôla Sữa 90G",
    "barcode": "9300682001304",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 116,
    "image": "🍫",
    "daysUntilExpiry": 174,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0284",
    "name": "Doublemint Kẹo Sing Gum Vị Bạc Hà Đậm Đà 11.2G",
    "barcode": "8936114080107",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 88,
    "unit": "gói",
    "rating": 4.8,
    "sales": 129,
    "image": "🍬",
    "daysUntilExpiry": 181,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0285",
    "name": "Xylitol Kẹo Sing Gum Doraemon Vị Dâu 29G",
    "barcode": "8934677041016",
    "category": "me_be",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 95,
    "unit": "cái",
    "rating": 4.9,
    "sales": 142,
    "image": "🍬",
    "daysUntilExpiry": 188,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0286",
    "name": "Masita Rong Biển Sấy Vị Tảo Biển 28G",
    "barcode": "8936029423891",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 155,
    "image": "🥜",
    "daysUntilExpiry": 195,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0287",
    "name": "Karamucho Snack Bắp Vị Khô Bò 57G",
    "barcode": "8936135445206",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 168,
    "image": "🍿",
    "daysUntilExpiry": 202,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0288",
    "name": "Karamucho Snack Khoai Tây Rong Biển Cay 80G",
    "barcode": "8936135440447",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 36,
    "unit": "gói",
    "rating": 4.7,
    "sales": 181,
    "image": "🍿",
    "daysUntilExpiry": 209,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0289",
    "name": "Karamucho Snack Khoai Tây Rong Biển Cay 44G",
    "barcode": "8936135440430",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 194,
    "image": "🍿",
    "daysUntilExpiry": 216,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0290",
    "name": "Polinky Snack Bắp Vị Táo Mật Ong 52G",
    "barcode": "8936135447019",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 50,
    "unit": "gói",
    "rating": 4.9,
    "sales": 207,
    "image": "🍿",
    "daysUntilExpiry": 223,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0291",
    "name": "Polinky Snack Bắp Vị Táo Mật Ong 90G",
    "barcode": "8936135447026",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 220,
    "image": "🍿",
    "daysUntilExpiry": 230,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0292",
    "name": "Pati Da Cá Vị Ớt Xanh 50G",
    "barcode": "8936183001058",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 64,
    "unit": "gói",
    "rating": 4.6,
    "sales": 233,
    "image": "🍪",
    "daysUntilExpiry": 237,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0293",
    "name": "Pati Da Cá Vị Trứng Muối 50G",
    "barcode": "8936183001027",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 246,
    "image": "🧂",
    "daysUntilExpiry": 244,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0294",
    "name": "Kitkat Bánh Xốp Vị Milo 17G X 10 Tha",
    "barcode": "9556001317322",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 78,
    "unit": "gói",
    "rating": 4.8,
    "sales": 259,
    "image": "🍪",
    "daysUntilExpiry": 251,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0295",
    "name": "Kitkat Bánh Xốp Socola Sữa 15G X 10 Tha",
    "barcode": "9556001071750",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 272,
    "image": "🍫",
    "daysUntilExpiry": 258,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0296",
    "name": "Koreno Mì Xào Bulgogi Phô Mai Cay",
    "barcode": "8936028643153",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 92,
    "unit": "gói",
    "rating": 4.5,
    "sales": 285,
    "image": "🍜",
    "daysUntilExpiry": 265,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0297",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Xốt Trứng Muối",
    "barcode": "8936034877733",
    "category": "me_be",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 99,
    "unit": "ly",
    "rating": 4.6,
    "sales": 298,
    "image": "🍪",
    "daysUntilExpiry": 272,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0298",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Lắc Thịt Nướng Phô Mai",
    "barcode": "8936034877719",
    "category": "me_be",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 26,
    "unit": "ly",
    "rating": 4.7,
    "sales": 311,
    "image": "🍪",
    "daysUntilExpiry": 279,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0299",
    "name": "Koreno Mì Xào Bulgogi Vị Bò Xào Cay",
    "barcode": "8936028643061",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 33,
    "unit": "gói",
    "rating": 4.8,
    "sales": 324,
    "image": "🍜",
    "daysUntilExpiry": 286,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0300",
    "name": "Swing Snack Khoai Tây Vị Bò Bít Tết 53G",
    "barcode": "8936036021660",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 40,
    "unit": "gói",
    "rating": 4.9,
    "sales": 337,
    "image": "🍿",
    "daysUntilExpiry": 293,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0301",
    "name": "Orion Kẹo Họng Vị Gừng Mật Ong 84G",
    "barcode": "8936036028805",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 47,
    "unit": "gói",
    "rating": 4.5,
    "sales": 350,
    "image": "🍬",
    "daysUntilExpiry": 300,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0302",
    "name": "Orion Kẹo Họng Vị Quất Mật Ong 84G",
    "barcode": "8936036025453",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 54,
    "unit": "gói",
    "rating": 4.6,
    "sales": 363,
    "image": "🍬",
    "daysUntilExpiry": 307,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0303",
    "name": "Orion Bánh Gạo An Vị Cốm Fest 14G",
    "barcode": "8936029421033",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 61,
    "unit": "gói",
    "rating": 4.7,
    "sales": 376,
    "image": "🌾",
    "daysUntilExpiry": 314,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0304",
    "name": "Orion Bánh Gạo An Vị Khoai Tây Phô Mai 7.2G",
    "barcode": "8936036028300",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 68,
    "unit": "gói",
    "rating": 4.8,
    "sales": 389,
    "image": "🌾",
    "daysUntilExpiry": 321,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0305",
    "name": "Orion Bánh Gạo An Vị Tảo 7.95",
    "barcode": "8936036026191",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 75,
    "unit": "gói",
    "rating": 4.9,
    "sales": 402,
    "image": "🌾",
    "daysUntilExpiry": 328,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0306",
    "name": "Orion Bánh Gạo An Vị Chà Bông 10.4",
    "barcode": "8936036029932",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 82,
    "unit": "gói",
    "rating": 4.5,
    "sales": 415,
    "image": "🌾",
    "daysUntilExpiry": 335,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0307",
    "name": "Orion Bánh Gạo An Vị Tự Nhiên 10.8",
    "barcode": "8936036026177",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 89,
    "unit": "gói",
    "rating": 4.6,
    "sales": 428,
    "image": "🌾",
    "daysUntilExpiry": 342,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0308",
    "name": "Jboy Snack Gạo Vị Phô Mai 31.6G",
    "barcode": "8936036028591",
    "category": "nhu_yeu_pham",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 96,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 441,
    "image": "🌾",
    "daysUntilExpiry": 349,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0309",
    "name": "Jboy Snack Gạo Vị Bò Nướng 35G",
    "barcode": "8936029423761",
    "category": "nhu_yeu_pham",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 23,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 54,
    "image": "🌾",
    "daysUntilExpiry": 356,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0310",
    "name": "Marine Boy Snack Cá Vị Gà Nướng 35G",
    "barcode": "8936029425550",
    "category": "me_be",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 30,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 67,
    "image": "🍿",
    "daysUntilExpiry": 93,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0311",
    "name": "King Marine Boy Snack Cá Vị Tảo Biển 56G",
    "barcode": "8936036029031",
    "category": "me_be",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 37,
    "unit": "gói",
    "rating": 4.5,
    "sales": 80,
    "image": "🍿",
    "daysUntilExpiry": 100,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0312",
    "name": "Marine Boy Snack Cá Vị Tảo Biển 35G",
    "barcode": "8936036021172",
    "category": "me_be",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 44,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 93,
    "image": "🍿",
    "daysUntilExpiry": 107,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0313",
    "name": "Marine Boy Snack Cá Vị Tôm Nướng 35G",
    "barcode": "8936036021165",
    "category": "me_be",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 51,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 106,
    "image": "🍿",
    "daysUntilExpiry": 114,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0314",
    "name": "Toonies Snack Bắp Vị Gà Bbq 60G",
    "barcode": "8936036028836",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 58,
    "unit": "gói",
    "rating": 4.8,
    "sales": 119,
    "image": "🍿",
    "daysUntilExpiry": 121,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0315",
    "name": "Toonies Snack Bắp Vị Cay Mexico 60G",
    "barcode": "8936036028829",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 65,
    "unit": "gói",
    "rating": 4.9,
    "sales": 132,
    "image": "🍿",
    "daysUntilExpiry": 128,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0316",
    "name": "Toonies Snack Bắp Vị Phô Mai 60G",
    "barcode": "8936036028133",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 72,
    "unit": "gói",
    "rating": 4.5,
    "sales": 145,
    "image": "🍿",
    "daysUntilExpiry": 135,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0317",
    "name": "O'Star Snack Ngôi Sao Vị Phô Mai Tươi 55G",
    "barcode": "8936036026962",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 158,
    "image": "🍿",
    "daysUntilExpiry": 142,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0318",
    "name": "O'Star Snack Khoai Tây Vị Tự Nhiên 53G",
    "barcode": "8936036027082",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 86,
    "unit": "gói",
    "rating": 4.7,
    "sales": 171,
    "image": "🍿",
    "daysUntilExpiry": 149,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0319",
    "name": "O'Star Snack Ngôi Sao Vị Kim Chi 55G",
    "barcode": "8936029425918",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 93,
    "unit": "gói",
    "rating": 4.8,
    "sales": 184,
    "image": "🍿",
    "daysUntilExpiry": 156,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0320",
    "name": "O'Star Snack Ngôi Sao Vị Tảo Biển 55G",
    "barcode": "8936029425925",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 20,
    "unit": "gói",
    "rating": 4.9,
    "sales": 197,
    "image": "🍿",
    "daysUntilExpiry": 163,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0321",
    "name": "Swingmax Snack Khoai Tây Vị Bò Bít Tết 52G",
    "barcode": "8936036025576",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 27,
    "unit": "gói",
    "rating": 4.5,
    "sales": 210,
    "image": "🍿",
    "daysUntilExpiry": 170,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0322",
    "name": "Orion Bánh Quy Goute 36G",
    "barcode": "8936036024135",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 34,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 223,
    "image": "🍪",
    "daysUntilExpiry": 177,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0323",
    "name": "C'Est Bon Bánh Ăn Sáng Sợi Gà Phô Mai 101.5G",
    "barcode": "8936036027464",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 41,
    "unit": "túi",
    "rating": 4.7,
    "sales": 236,
    "image": "🍪",
    "daysUntilExpiry": 184,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0324",
    "name": "C'Est Bon Bánh Ăn Sáng Sợi Gà Bơ Tỏi 85G",
    "barcode": "8936036026153",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 48,
    "unit": "túi",
    "rating": 4.8,
    "sales": 249,
    "image": "🍪",
    "daysUntilExpiry": 191,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0325",
    "name": "Custas Bánh Bông Lan Kem Trứng 23.5G",
    "barcode": "8936036020274",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 55,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 262,
    "image": "🍪",
    "daysUntilExpiry": 198,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0326",
    "name": "Custas Bánh Bông Lan Kem Cốm Sen 23.5G",
    "barcode": "8936036027952",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 62,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 275,
    "image": "🍪",
    "daysUntilExpiry": 205,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0327",
    "name": "Custas Bánh Bông Lan Vị Tiramisu Mocha 23.5G",
    "barcode": "8936036026375",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 69,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 288,
    "image": "🍪",
    "daysUntilExpiry": 212,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0328",
    "name": "Custas Bánh Bông Lan Kem Trứng 23.5G",
    "barcode": "8936036020137",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 76,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 301,
    "image": "🍪",
    "daysUntilExpiry": 219,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0329",
    "name": "Chocopie Bánh Socola Nhân Marshmallow 36.3G",
    "barcode": "8936036020403",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 83,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 314,
    "image": "🍫",
    "daysUntilExpiry": 226,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0330",
    "name": "Chocopie Bánh Socola Đậm Vị Cacao 33G",
    "barcode": "8936036025170",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 90,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 327,
    "image": "🍫",
    "daysUntilExpiry": 233,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0331",
    "name": "Chocopie Bánh Socola Nhân Marshmallow 36.3G",
    "barcode": "8936036020380",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 97,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 340,
    "image": "🍫",
    "daysUntilExpiry": 240,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0332",
    "name": "Koreno Mì Trộn Tương Đen Chajang",
    "barcode": "8936028641616",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 24,
    "unit": "gói",
    "rating": 4.6,
    "sales": 353,
    "image": "🍜",
    "daysUntilExpiry": 247,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0333",
    "name": "Koreno Mì Xốt Kem Bulgogi Carbonara",
    "barcode": "8936028643252",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 31,
    "unit": "gói",
    "rating": 4.7,
    "sales": 366,
    "image": "🍜",
    "daysUntilExpiry": 254,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0334",
    "name": "Koreno Mì Vị Bò Cay",
    "barcode": "8936028640039",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 38,
    "unit": "gói",
    "rating": 4.8,
    "sales": 379,
    "image": "🍜",
    "daysUntilExpiry": 261,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0335",
    "name": "Koreno Mì Xào Bulgogi Phô Mai Cay",
    "barcode": "8936028643177",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 45,
    "unit": "ly",
    "rating": 4.9,
    "sales": 392,
    "image": "🍜",
    "daysUntilExpiry": 268,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0336",
    "name": "Lay'S Stax Snack Khoai Tây Vị Tự Nhiên 100G",
    "barcode": "8936079126018",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 52,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 405,
    "image": "🍿",
    "daysUntilExpiry": 275,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0337",
    "name": "Poca Đậu Phộng Da Cá Nước Cốt Dừa 68G",
    "barcode": "8936079122348",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 59,
    "unit": "gói",
    "rating": 4.6,
    "sales": 418,
    "image": "🍪",
    "daysUntilExpiry": 282,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0338",
    "name": "Poca Đậu Phộng Rắc Rắc Vị Mực Cay 68G",
    "barcode": "8936079125004",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 66,
    "unit": "gói",
    "rating": 4.7,
    "sales": 431,
    "image": "🍪",
    "daysUntilExpiry": 289,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0339",
    "name": "Lay'S Stax Snack Khoai Tây Tôm Hùm Nướng Ngũ Vị 100G",
    "barcode": "8936079125394",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 73,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 444,
    "image": "🍿",
    "daysUntilExpiry": 296,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0340",
    "name": "Lay'S Stax Snack Khoai Tây Vị Kem Chua Hành Tây 100G",
    "barcode": "8936079125417",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 80,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 57,
    "image": "🍿",
    "daysUntilExpiry": 303,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0341",
    "name": "Lay'S Stax Snack Khoai Tây Vị Thịt Nướng BBQ 100G",
    "barcode": "8936079125424",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 87,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 70,
    "image": "🍿",
    "daysUntilExpiry": 310,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0342",
    "name": "Lay'S Stax Snack Khoai Tây Vị Mực Sốt Cay 100G",
    "barcode": "8936079125400",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 94,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 83,
    "image": "🍿",
    "daysUntilExpiry": 317,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0343",
    "name": "Udon Mì Hương Vị Nhật Bản 75G",
    "barcode": "8934563146153",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 21,
    "unit": "gói",
    "rating": 4.7,
    "sales": 96,
    "image": "🍜",
    "daysUntilExpiry": 324,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0344",
    "name": "Doraemon Mì Ly Mini Hải Sản Chua Ngọt 53G",
    "barcode": "8934563680114",
    "category": "me_be",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 28,
    "unit": "ly",
    "rating": 4.8,
    "sales": 109,
    "image": "🍪",
    "daysUntilExpiry": 331,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0345",
    "name": "Doraemon Mì Ly Mini Hàu Sữa Phô Mai 48G",
    "barcode": "8934563679101",
    "category": "me_be",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 35,
    "unit": "ly",
    "rating": 4.9,
    "sales": 122,
    "image": "🍪",
    "daysUntilExpiry": 338,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0346",
    "name": "Hảo Hảo Mì Hương Vị Mì Sa Tế Hành Tím 75G",
    "barcode": "8934563183158",
    "category": "mi_goi",
    "costPrice": 3500,
    "price": 4500,
    "originalPrice": 5000,
    "stock": 42,
    "unit": "gói",
    "rating": 4.5,
    "sales": 135,
    "image": "🍜",
    "daysUntilExpiry": 345,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0347",
    "name": "Khay Táo Quân Mì Thập Cẩm 95G",
    "barcode": "8934563406172",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 49,
    "unit": "gói",
    "rating": 4.6,
    "sales": 148,
    "image": "🍜",
    "daysUntilExpiry": 352,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0348",
    "name": "Đệ Nhất Phở Trộn Thập Cẩm Cay 82G",
    "barcode": "8934563276164",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 56,
    "unit": "gói",
    "rating": 4.7,
    "sales": 161,
    "image": "🍜",
    "daysUntilExpiry": 359,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0349",
    "name": "Khay Táo Quân Mì Thịt Bằm Sốt Cà Chua 93G",
    "barcode": "8934563177171",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 63,
    "unit": "gói",
    "rating": 4.8,
    "sales": 174,
    "image": "🍜",
    "daysUntilExpiry": 96,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0350",
    "name": "Vidal Kẹo Dẻo Xoài Muối Ớt 80G",
    "barcode": "8413178364850",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 70,
    "unit": "gói",
    "rating": 4.9,
    "sales": 187,
    "image": "🧂",
    "daysUntilExpiry": 103,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0351",
    "name": "Vidal Kẹo Dẻo Hình Quả Chuối 80G",
    "barcode": "8413178366779",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 77,
    "unit": "gói",
    "rating": 4.5,
    "sales": 200,
    "image": "🍬",
    "daysUntilExpiry": 110,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0352",
    "name": "Vidal Kẹo Dẻo Hình Trứng Chiên 80G",
    "barcode": "8413178364843",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 84,
    "unit": "gói",
    "rating": 4.6,
    "sales": 213,
    "image": "🍬",
    "daysUntilExpiry": 117,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0353",
    "name": "Tuấn Đạt Hạt Điều Lụa 150G",
    "barcode": "8935032010739",
    "category": "hang_tuoi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 91,
    "unit": "Hộp",
    "rating": 4.7,
    "sales": 226,
    "image": "🥜",
    "daysUntilExpiry": 124,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0354",
    "name": "Tuấn Đạt Xoài Sấy Dẻo Muối Ớt 50G",
    "barcode": "8935032203223",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 98,
    "unit": "Gói",
    "rating": 4.8,
    "sales": 239,
    "image": "🧂",
    "daysUntilExpiry": 131,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0355",
    "name": "Tuấn Đạt Mít Sấy 100G",
    "barcode": "8935032201311",
    "category": "hang_tuoi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 25,
    "unit": "Gói",
    "rating": 4.9,
    "sales": 252,
    "image": "🥜",
    "daysUntilExpiry": 138,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0356",
    "name": "Tuấn Đạt Ổi Sấy Dẻo 50G",
    "barcode": "8935032203841",
    "category": "hang_tuoi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 32,
    "unit": "Gói",
    "rating": 4.5,
    "sales": 265,
    "image": "🥜",
    "daysUntilExpiry": 145,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0357",
    "name": "Tuấn Đạt Đu Đủ Sấy Dẻo 50G",
    "barcode": "8935032202660",
    "category": "hang_tuoi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 39,
    "unit": "Gói",
    "rating": 4.6,
    "sales": 278,
    "image": "🥜",
    "daysUntilExpiry": 152,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0358",
    "name": "Tuấn Đạt Xoài Sấy Dẻo 50G",
    "barcode": "8935032202530",
    "category": "hang_tuoi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 46,
    "unit": "Gói",
    "rating": 4.7,
    "sales": 291,
    "image": "🥜",
    "daysUntilExpiry": 159,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0359",
    "name": "Tuấn Đạt Thơm Sấy Dẻo 40G",
    "barcode": "8935032202608",
    "category": "hang_tuoi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 53,
    "unit": "Gói",
    "rating": 4.8,
    "sales": 304,
    "image": "🥜",
    "daysUntilExpiry": 166,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0360",
    "name": "Haribo Kẹo Xốp Nhân Socola Chamallows 62G",
    "barcode": "8691216106604",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 60,
    "unit": "gói",
    "rating": 4.9,
    "sales": 317,
    "image": "🍫",
    "daysUntilExpiry": 173,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0361",
    "name": "Ponnie Hotdog Giòn Ăn Liền Vị Cay 28Gr",
    "barcode": "8936034876491",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 67,
    "unit": "gói",
    "rating": 4.5,
    "sales": 330,
    "image": "🌭",
    "daysUntilExpiry": 180,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0362",
    "name": "Ponnie Hotdog Giòn Ăn Liền Vị Cay 28Gr",
    "barcode": "SP001135",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 74,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 343,
    "image": "🌭",
    "daysUntilExpiry": 187,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0363",
    "name": "Ponnie Hotdog Giòn Ăn Liền Sụn Vị BBQ 20Gr",
    "barcode": "8936034877399",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 356,
    "image": "🌭",
    "daysUntilExpiry": 194,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0364",
    "name": "Ponnie Hotdog Giòn Ăn Liền Sụn Vị BBQ 20Gr",
    "barcode": "SP001136",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 88,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 369,
    "image": "🌭",
    "daysUntilExpiry": 201,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0365",
    "name": "Nongshim Mì Xào Khô Shin Ramyun Toomba 137G",
    "barcode": "8801043018470",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 95,
    "unit": "gói",
    "rating": 4.9,
    "sales": 382,
    "image": "🍜",
    "daysUntilExpiry": 208,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0366",
    "name": "Nongshim Mì Shin Ramyun 120G",
    "barcode": "31146150601",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 395,
    "image": "🍜",
    "daysUntilExpiry": 215,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0367",
    "name": "Samyang Mì Trộn Tương Tàu 140G",
    "barcode": "8801073101524",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 408,
    "image": "🍜",
    "daysUntilExpiry": 222,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0368",
    "name": "Ottogi Mì Tô Jin Cay",
    "barcode": "8936049051647",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 36,
    "unit": "tô",
    "rating": 4.7,
    "sales": 421,
    "image": "🍜",
    "daysUntilExpiry": 229,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0369",
    "name": "Nongshim Mì Tô Shin 114G",
    "barcode": "31146254903",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 43,
    "unit": "tô",
    "rating": 4.8,
    "sales": 434,
    "image": "🍜",
    "daysUntilExpiry": 236,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0370",
    "name": "Nongshim Mì Tô Vị Gà Cay 100G",
    "barcode": "8801043055659",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 50,
    "unit": "tô",
    "rating": 4.9,
    "sales": 447,
    "image": "🍜",
    "daysUntilExpiry": 243,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0371",
    "name": "Nissin Mì Xào Hương Vị Gà Cay Hàn Quốc 71G",
    "barcode": "8936071070333",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 60,
    "image": "🍜",
    "daysUntilExpiry": 250,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0372",
    "name": "Nissin Mì Xào Hương Vị Gà Cay Phô Mai Hàn Quốc 72G",
    "barcode": "8936071070340",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 64,
    "unit": "gói",
    "rating": 4.6,
    "sales": 73,
    "image": "🍜",
    "daysUntilExpiry": 257,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0373",
    "name": "Ottogi Mini Mì Tương Đen Bắc Kinh 83G",
    "barcode": "8936049051395",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 86,
    "image": "🍜",
    "daysUntilExpiry": 264,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0374",
    "name": "Nongshim Mì Shin Xào Khô 131G",
    "barcode": "8801043061674",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 78,
    "unit": "gói",
    "rating": 4.8,
    "sales": 99,
    "image": "🍜",
    "daysUntilExpiry": 271,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0375",
    "name": "Ottogi Mì Xốt Tương Đen 135G",
    "barcode": "8936049051579",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 112,
    "image": "🍜",
    "daysUntilExpiry": 278,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0376",
    "name": "Ottogi Mì Xốt Tương Đen 75G",
    "barcode": "8936049052897",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 92,
    "unit": "gói",
    "rating": 4.5,
    "sales": 125,
    "image": "🍜",
    "daysUntilExpiry": 285,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0377",
    "name": "Ottogi Mì Tô Yeul Cay",
    "barcode": "8936049051654",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 99,
    "unit": "tô",
    "rating": 4.6,
    "sales": 138,
    "image": "🍜",
    "daysUntilExpiry": 292,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0378",
    "name": "Ottogi Mì Tô Jin Không Cay",
    "barcode": "8936049051708",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 26,
    "unit": "tô",
    "rating": 4.7,
    "sales": 151,
    "image": "🍜",
    "daysUntilExpiry": 299,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0379",
    "name": "Ottogi Mini Mì Trộn Phô Mai Vị Cay 80G",
    "barcode": "8936049052712",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 33,
    "unit": "gói",
    "rating": 4.8,
    "sales": 164,
    "image": "🍜",
    "daysUntilExpiry": 306,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0380",
    "name": "Nongshim Mì Tô Cay Yukgaejang 100G",
    "barcode": "8801043055604",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 40,
    "unit": "tô",
    "rating": 4.9,
    "sales": 177,
    "image": "🍜",
    "daysUntilExpiry": 313,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0381",
    "name": "Nongshim Mì Ly Shin Cup 68G",
    "barcode": "31146270606",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 47,
    "unit": "ly",
    "rating": 4.5,
    "sales": 190,
    "image": "🍜",
    "daysUntilExpiry": 320,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0382",
    "name": "Ottogi Mì Ly Jin Cay 65G",
    "barcode": "8936049051586",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 54,
    "unit": "ly",
    "rating": 4.6,
    "sales": 203,
    "image": "🍜",
    "daysUntilExpiry": 327,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0383",
    "name": "Ottogi Mì Ly Jin Không Cay 65G",
    "barcode": "8936049051593",
    "category": "mi_goi",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 61,
    "unit": "ly",
    "rating": 4.7,
    "sales": 216,
    "image": "🍜",
    "daysUntilExpiry": 334,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0384",
    "name": "Biên Hòa Đường Mía Thượng Hạng 1Kg",
    "barcode": "8935015510447",
    "category": "gia_vi",
    "costPrice": 27500,
    "price": 35000,
    "originalPrice": 38500,
    "stock": 68,
    "unit": "túi",
    "rating": 4.8,
    "sales": 229,
    "image": "🧂",
    "daysUntilExpiry": 341,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0385",
    "name": "Biên Hòa Đường Mía Thượng Hạng 500G",
    "barcode": "8935015510478",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 75,
    "unit": "túi",
    "rating": 4.9,
    "sales": 242,
    "image": "🧂",
    "daysUntilExpiry": 348,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0386",
    "name": "Biên Hòa Đường Tinh Luyện Đặc Biệt 800G",
    "barcode": "8935015511062",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 82,
    "unit": "hũ",
    "rating": 4.5,
    "sales": 255,
    "image": "🧂",
    "daysUntilExpiry": 355,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0387",
    "name": "Cô Ba Đường Sạch 1Kg",
    "barcode": "8935015513714",
    "category": "gia_vi",
    "costPrice": 27500,
    "price": 35000,
    "originalPrice": 38500,
    "stock": 89,
    "unit": "túi",
    "rating": 4.6,
    "sales": 268,
    "image": "🧂",
    "daysUntilExpiry": 92,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0388",
    "name": "Cô Ba Đường Sạch 1Kg",
    "barcode": "SP001130",
    "category": "web_doc_quyen",
    "costPrice": 27500,
    "price": 35000,
    "originalPrice": 38500,
    "stock": 96,
    "unit": "lốc",
    "rating": 4.7,
    "sales": 281,
    "image": "🎁",
    "daysUntilExpiry": 99,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0389",
    "name": "Biên Hòa Đường Organic 800G",
    "barcode": "8935015513745",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 23,
    "unit": "Hũ",
    "rating": 4.8,
    "sales": 294,
    "image": "🧂",
    "daysUntilExpiry": 106,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0390",
    "name": "Mom Cooks Nước Cốt Dừa Xim 200Ml",
    "barcode": "8935015521221",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 30,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 307,
    "image": "🧂",
    "daysUntilExpiry": 113,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0391",
    "name": "Naní Quế Cây Sạch Lụa (Túi Zip) 500Gr",
    "barcode": "8931406500431",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 37,
    "unit": "gói",
    "rating": 4.5,
    "sales": 320,
    "image": "🧂",
    "daysUntilExpiry": 120,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0392",
    "name": "Meizan Bánh Tráng 120Gr",
    "barcode": "8936202992862",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 44,
    "unit": "gói",
    "rating": 4.6,
    "sales": 333,
    "image": "📦",
    "daysUntilExpiry": 127,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0393",
    "name": "Safoco Nui Xoắn Rau Củ 300Gr",
    "barcode": "8934678010158",
    "category": "rau_cu",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 51,
    "unit": "gói",
    "rating": 4.7,
    "sales": 346,
    "image": "🍪",
    "daysUntilExpiry": 134,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0394",
    "name": "Safoco Mì Sợi Nhỏ Rau Củ 500Gr",
    "barcode": "8934678020102",
    "category": "rau_cu",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 58,
    "unit": "gói",
    "rating": 4.8,
    "sales": 359,
    "image": "🍪",
    "daysUntilExpiry": 141,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0395",
    "name": "Safoco Mì Sợi Lớn 500Gr",
    "barcode": "8934678020072",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 65,
    "unit": "gói",
    "rating": 4.9,
    "sales": 372,
    "image": "🍜",
    "daysUntilExpiry": 148,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0396",
    "name": "Safoco Nui Gạo Ống Lớn 400Gr",
    "barcode": "8934678010462",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 72,
    "unit": "gói",
    "rating": 4.5,
    "sales": 385,
    "image": "🌾",
    "daysUntilExpiry": 155,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0397",
    "name": "Safoco Bánh Tráng Sz 16 200Gr",
    "barcode": "8934678040018",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 398,
    "image": "📦",
    "daysUntilExpiry": 162,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0398",
    "name": "Safoco Mì Sợi Nhỏ 500Gr",
    "barcode": "8934678020065",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 86,
    "unit": "gói",
    "rating": 4.7,
    "sales": 411,
    "image": "🍜",
    "daysUntilExpiry": 169,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0399",
    "name": "Safoco Nui Xoắn 300Gr",
    "barcode": "8934678010110",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 93,
    "unit": "gói",
    "rating": 4.8,
    "sales": 424,
    "image": "📦",
    "daysUntilExpiry": 176,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0400",
    "name": "Safoco Nui Tôm Khô 500Gr",
    "barcode": "8934678010059",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 20,
    "unit": "gói",
    "rating": 4.9,
    "sales": 437,
    "image": "📦",
    "daysUntilExpiry": 183,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0401",
    "name": "Safoco Nui Lớn 400Gr",
    "barcode": "8934678010011",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 27,
    "unit": "gói",
    "rating": 4.5,
    "sales": 50,
    "image": "📦",
    "daysUntilExpiry": 190,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0402",
    "name": "Safoco Bánh Tráng Sz 22 300Gr",
    "barcode": "8934678040032",
    "category": "nhu_yeu_pham",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 34,
    "unit": "Gói",
    "rating": 4.6,
    "sales": 63,
    "image": "📦",
    "daysUntilExpiry": 197,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0403",
    "name": "Safoco Mì Chay Thượng Hạng 350Gr",
    "barcode": "8934678020201",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 41,
    "unit": "Gói",
    "rating": 4.7,
    "sales": 76,
    "image": "🍜",
    "daysUntilExpiry": 204,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0404",
    "name": "Safoco Mì Xào Cao Cấp 500Gr",
    "barcode": "8934678020232",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 48,
    "unit": "gói",
    "rating": 4.8,
    "sales": 89,
    "image": "🍜",
    "daysUntilExpiry": 211,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0405",
    "name": "Tong Garden Hỗn Hợp Hạt Trái Cây Sấy Trái Berry 28G",
    "barcode": "8850291111556",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 55,
    "unit": "gói",
    "rating": 4.9,
    "sales": 102,
    "image": "🥜",
    "daysUntilExpiry": 218,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0406",
    "name": "Tong Garden Xoài Sấy Vị Muối Ớt 30G",
    "barcode": "8850291114298",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 62,
    "unit": "gói",
    "rating": 4.5,
    "sales": 115,
    "image": "🧂",
    "daysUntilExpiry": 225,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0407",
    "name": "Tong Garden Hạt Dẻ Rang Tách Vỏ 120G",
    "barcode": "8850291101922",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 69,
    "unit": "gói",
    "rating": 4.6,
    "sales": 128,
    "image": "🥜",
    "daysUntilExpiry": 232,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0408",
    "name": "Tong Garden Hạt Dẻ Cười Rang Muối 30G",
    "barcode": "8850291010408",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 76,
    "unit": "gói",
    "rating": 4.7,
    "sales": 141,
    "image": "🧂",
    "daysUntilExpiry": 239,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0409",
    "name": "Tong Garden Hỗn Hợp Các Loại Hạt Party Snack 40G",
    "barcode": "8850291510717",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 83,
    "unit": "gói",
    "rating": 4.8,
    "sales": 154,
    "image": "🥜",
    "daysUntilExpiry": 246,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0410",
    "name": "Tong Garden Đậu Hà Lan Bao Mực 45G",
    "barcode": "8850291103094",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 90,
    "unit": "gói",
    "rating": 4.9,
    "sales": 167,
    "image": "🥜",
    "daysUntilExpiry": 253,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0411",
    "name": "Mitu Bánh Rong Biển Cuộn Vị Phô Mai 42G",
    "barcode": "6972886960539",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 97,
    "unit": "gói",
    "rating": 4.5,
    "sales": 180,
    "image": "🍪",
    "daysUntilExpiry": 260,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0412",
    "name": "Mitu Bánh Rong Biển Cuộn Vị Chà Bông 42G",
    "barcode": "6972886960553",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 24,
    "unit": "gói",
    "rating": 4.6,
    "sales": 193,
    "image": "🍪",
    "daysUntilExpiry": 267,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0413",
    "name": "Mitu Bánh Rong Biển Cuộn Vị Trứng Muối 42G",
    "barcode": "6972886960546",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 31,
    "unit": "gói",
    "rating": 4.7,
    "sales": 206,
    "image": "🧂",
    "daysUntilExpiry": 274,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0414",
    "name": "Goblim Bánh Trứng Vị Trứng Muối 26G",
    "barcode": "6971533425209",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 38,
    "unit": "gói",
    "rating": 4.8,
    "sales": 219,
    "image": "🧂",
    "daysUntilExpiry": 281,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0415",
    "name": "Goblim Bánh Trứng Vị Phô Mai 26G",
    "barcode": "6971533425346",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 45,
    "unit": "gói",
    "rating": 4.9,
    "sales": 232,
    "image": "🍪",
    "daysUntilExpiry": 288,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0416",
    "name": "Ohayo Rau Tiến Vua Muối Chua Cay 20G",
    "barcode": "6956405214136",
    "category": "rau_cu",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 52,
    "unit": "gói",
    "rating": 4.5,
    "sales": 245,
    "image": "🍪",
    "daysUntilExpiry": 295,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0417",
    "name": "Ohayo Dưa Chuột Muối Chua Cay 20G",
    "barcode": "6956405214112",
    "category": "rau_cu",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 59,
    "unit": "gói",
    "rating": 4.6,
    "sales": 258,
    "image": "🍪",
    "daysUntilExpiry": 302,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0418",
    "name": "Timii Food Chân Vịt Tê Cay 40G",
    "barcode": "8938549006004",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 66,
    "unit": "gói",
    "rating": 4.7,
    "sales": 271,
    "image": "🍗",
    "daysUntilExpiry": 309,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0419",
    "name": "Timii Food Cánh Vịt Tê Cay 40G",
    "barcode": "8938549006011",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 73,
    "unit": "gói",
    "rating": 4.8,
    "sales": 284,
    "image": "🍗",
    "daysUntilExpiry": 316,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0420",
    "name": "Ohayo Măng Non Muối Cay",
    "barcode": "8936204410395",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 80,
    "unit": "gói",
    "rating": 4.9,
    "sales": 297,
    "image": "🧂",
    "daysUntilExpiry": 323,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0421",
    "name": "Tiểu Mì Cay Tiao 20G",
    "barcode": "6970903433592",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 87,
    "unit": "gói",
    "rating": 4.5,
    "sales": 310,
    "image": "🍜",
    "daysUntilExpiry": 330,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0422",
    "name": "Tiểu Mì Cay Bang 20G",
    "barcode": "6970903433578",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 94,
    "unit": "gói",
    "rating": 4.6,
    "sales": 323,
    "image": "🍜",
    "daysUntilExpiry": 337,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0423",
    "name": "Tiểu Mì Cay Pian 20G",
    "barcode": "6970903433585",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 21,
    "unit": "gói",
    "rating": 4.7,
    "sales": 336,
    "image": "🍜",
    "daysUntilExpiry": 344,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0424",
    "name": "Mr Chef'S Bánh Phô Mai 105G",
    "barcode": "8801068038262",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 28,
    "unit": "gói",
    "rating": 4.8,
    "sales": 349,
    "image": "🍪",
    "daysUntilExpiry": 351,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0425",
    "name": "Mr Chef'S Bánh Phô Mai Dưa Lưới 105G",
    "barcode": "8801068931532",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 35,
    "unit": "gói",
    "rating": 4.9,
    "sales": 362,
    "image": "🍪",
    "daysUntilExpiry": 358,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0426",
    "name": "Gulu Râu Mực Chay Tê Cay 18G",
    "barcode": "8936221091096",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 42,
    "unit": "gói",
    "rating": 4.5,
    "sales": 375,
    "image": "🥩",
    "daysUntilExpiry": 95,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0427",
    "name": "Gulu Râu Mực Vị Lẩu Tứ Xuyên 18G",
    "barcode": "8936221091089",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 49,
    "unit": "gói",
    "rating": 4.6,
    "sales": 388,
    "image": "🥩",
    "daysUntilExpiry": 102,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0428",
    "name": "Gulu Râu Mực Chay Siêu Cay 18G",
    "barcode": "8936221091102",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 56,
    "unit": "gói",
    "rating": 4.7,
    "sales": 401,
    "image": "🥩",
    "daysUntilExpiry": 109,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0429",
    "name": "Topone Chân Gà Đôi 1+1 Vị Tê Cay 60G",
    "barcode": "8938561761028",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 63,
    "unit": "gói",
    "rating": 4.8,
    "sales": 414,
    "image": "🍗",
    "daysUntilExpiry": 116,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0430",
    "name": "Topone Chân Gà Vị Tê Cay 42G",
    "barcode": "8938561761011",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 70,
    "unit": "gói",
    "rating": 4.9,
    "sales": 427,
    "image": "🍗",
    "daysUntilExpiry": 123,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0431",
    "name": "Alishan Chân Gà Vị Cay 40G",
    "barcode": "8938557078147",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 77,
    "unit": "gói",
    "rating": 4.5,
    "sales": 440,
    "image": "🍗",
    "daysUntilExpiry": 130,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0432",
    "name": "Delizone Tai Heo Vị Cay 30G",
    "barcode": "8938549578334",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 84,
    "unit": "gói",
    "rating": 4.6,
    "sales": 53,
    "image": "🥩",
    "daysUntilExpiry": 137,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0433",
    "name": "Alishan Chân Gà Rút Xương Vị Tê Cay 30G",
    "barcode": "8938557078109",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 91,
    "unit": "gói",
    "rating": 4.7,
    "sales": 66,
    "image": "🍗",
    "daysUntilExpiry": 144,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0434",
    "name": "Pringles Snack Khoai Tây Vị Bò Nướng Khói 102G",
    "barcode": "8886467127038",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 98,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 79,
    "image": "🍿",
    "daysUntilExpiry": 151,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0435",
    "name": "Pringles Snack Khoai Tây Vị Phô Mai Đậm Đà 102G",
    "barcode": "8886467100031",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 25,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 92,
    "image": "🍿",
    "daysUntilExpiry": 158,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0436",
    "name": "Bento Snack Mực Vị Cay Ngọt 22G",
    "barcode": "8935342400480",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 32,
    "unit": "gói",
    "rating": 4.5,
    "sales": 105,
    "image": "🍿",
    "daysUntilExpiry": 165,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0437",
    "name": "Oishi Snack Vị Cà Chua 68G",
    "barcode": "8934803042634",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 39,
    "unit": "gói",
    "rating": 4.6,
    "sales": 118,
    "image": "🍿",
    "daysUntilExpiry": 172,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0438",
    "name": "Chacheer Đậu Hạt Tổng Hợp 26G",
    "barcode": "6937351707675",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 46,
    "unit": "gói",
    "rating": 4.7,
    "sales": 131,
    "image": "🥜",
    "daysUntilExpiry": 179,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0439",
    "name": "Bento Snack Mực Vị Sốt Ớt Nướng 18G",
    "barcode": "8850157405331",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 53,
    "unit": "gói",
    "rating": 4.8,
    "sales": 144,
    "image": "🍿",
    "daysUntilExpiry": 186,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0440",
    "name": "Dorkbua Bánh Que Vị Mala 62G",
    "barcode": "8850157527989",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 60,
    "unit": "gói",
    "rating": 4.9,
    "sales": 157,
    "image": "🍪",
    "daysUntilExpiry": 193,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0441",
    "name": "Talaethong Snack Mực Vị Truyền Thống 100G",
    "barcode": "8859470510074",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 67,
    "unit": "gói",
    "rating": 4.5,
    "sales": 170,
    "image": "🍿",
    "daysUntilExpiry": 200,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0442",
    "name": "Talaethong Snack Mực Vị Rong Biển 100G",
    "barcode": "8859470510081",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 74,
    "unit": "gói",
    "rating": 4.6,
    "sales": 183,
    "image": "🍿",
    "daysUntilExpiry": 207,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0443",
    "name": "Bento Snack Mực Vị Mexican Barbeque 20G",
    "barcode": "8850157403283",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 196,
    "image": "🍿",
    "daysUntilExpiry": 214,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0444",
    "name": "Dorkbua Bánh Que Vị Bò Bít Tết 62G",
    "barcode": "8935342400220",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 88,
    "unit": "gói",
    "rating": 4.8,
    "sales": 209,
    "image": "🍪",
    "daysUntilExpiry": 221,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0445",
    "name": "Dorkbua Bánh Que Vị Truyền Thống 110G",
    "barcode": "8935342400053",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 95,
    "unit": "gói",
    "rating": 4.9,
    "sales": 222,
    "image": "🍪",
    "daysUntilExpiry": 228,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0446",
    "name": "Bento Snack Mực Tẩm Gia Vị Ớt 20G",
    "barcode": "8850157403252",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 235,
    "image": "🍿",
    "daysUntilExpiry": 235,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0447",
    "name": "Dorkbua Bánh Que Vị Thịt Bò Nướng 62G",
    "barcode": "8935342400237",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 248,
    "image": "🍪",
    "daysUntilExpiry": 242,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0448",
    "name": "Dorkbua Bánh Que Vị Thịt Xông Khói 50G",
    "barcode": "8935342400084",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 36,
    "unit": "gói",
    "rating": 4.7,
    "sales": 261,
    "image": "🍪",
    "daysUntilExpiry": 249,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0449",
    "name": "Chacheer Hạt Hướng Dương Ngũ Vị Hương 130G",
    "barcode": "8859559600931",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 274,
    "image": "🍪",
    "daysUntilExpiry": 256,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0450",
    "name": "Bento Snack Mực Vị Namprik Thái 22G",
    "barcode": "8935342400459",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 50,
    "unit": "gói",
    "rating": 4.9,
    "sales": 287,
    "image": "🍿",
    "daysUntilExpiry": 263,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0451",
    "name": "Chacheer Hạt Hướng Dương Vị Dừa 130G",
    "barcode": "8859559600962",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 300,
    "image": "🥜",
    "daysUntilExpiry": 270,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0452",
    "name": "Chacheer Hạt Hướng Dương Nguyên Vị 130G",
    "barcode": "8859559601150",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 64,
    "unit": "gói",
    "rating": 4.6,
    "sales": 313,
    "image": "🥜",
    "daysUntilExpiry": 277,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0453",
    "name": "Bento Snack Mực Vị Cay Ngọt 5G",
    "barcode": "8935342400282",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 326,
    "image": "🍿",
    "daysUntilExpiry": 284,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0454",
    "name": "Bento Snack Mực Vị Cay Ngọt 5G",
    "barcode": "SP001126",
    "category": "web_doc_quyen",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 78,
    "unit": "lốc",
    "rating": 4.8,
    "sales": 339,
    "image": "🎁",
    "daysUntilExpiry": 291,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0455",
    "name": "Bento Snack Mực Vị Gỏi Larb Cay 18G",
    "barcode": "8850157401494",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 352,
    "image": "🍿",
    "daysUntilExpiry": 298,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0456",
    "name": "Bento Snack Mực Vị Namprik Thái 5G",
    "barcode": "8935342400312",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 92,
    "unit": "gói",
    "rating": 4.5,
    "sales": 365,
    "image": "🍿",
    "daysUntilExpiry": 305,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0457",
    "name": "Bento Snack Mực Vị Namprik Thái 5G",
    "barcode": "SP001125",
    "category": "web_doc_quyen",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 99,
    "unit": "lốc",
    "rating": 4.6,
    "sales": 378,
    "image": "🎁",
    "daysUntilExpiry": 312,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0458",
    "name": "Bento Snack Mực Vị Cay Nồng 5G",
    "barcode": "8850157000864",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 26,
    "unit": "gói",
    "rating": 4.7,
    "sales": 391,
    "image": "🍿",
    "daysUntilExpiry": 319,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0459",
    "name": "Bento Snack Mực Vị Cay Nồng 5G",
    "barcode": "SP001124",
    "category": "web_doc_quyen",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 33,
    "unit": "lốc",
    "rating": 4.8,
    "sales": 404,
    "image": "🎁",
    "daysUntilExpiry": 326,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0460",
    "name": "Bento Snack Mực Vị Sốt Cay Hàn Quốc 18G",
    "barcode": "8850157407007",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 40,
    "unit": "gói",
    "rating": 4.9,
    "sales": 417,
    "image": "🍿",
    "daysUntilExpiry": 333,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0461",
    "name": "Bento Snack Mực Vị Ớt Cực Cay 18G",
    "barcode": "8850157402231",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 47,
    "unit": "gói",
    "rating": 4.5,
    "sales": 430,
    "image": "🍿",
    "daysUntilExpiry": 340,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0462",
    "name": "Bento Snack Mực Vị Cay Nồng 22G",
    "barcode": "8935342400510",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 54,
    "unit": "gói",
    "rating": 4.6,
    "sales": 443,
    "image": "🍿",
    "daysUntilExpiry": 347,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0463",
    "name": "Bento Snack Mực Vị Sốt Gochujang 18G",
    "barcode": "8850157406956",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 61,
    "unit": "gói",
    "rating": 4.7,
    "sales": 56,
    "image": "🍿",
    "daysUntilExpiry": 354,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0464",
    "name": "Bento Snack Mực Vị Hải Sản Siêu Cay 18G",
    "barcode": "8850157403610",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 68,
    "unit": "gói",
    "rating": 4.8,
    "sales": 69,
    "image": "🍿",
    "daysUntilExpiry": 91,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0465",
    "name": "Dorkbua Bánh Que Vị Truyền Thống 60G",
    "barcode": "8935342400022",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 75,
    "unit": "gói",
    "rating": 4.9,
    "sales": 82,
    "image": "🍪",
    "daysUntilExpiry": 98,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0466",
    "name": "Dorkbua Bánh Que Vị Truyền Thống 60G",
    "barcode": "SP001127",
    "category": "web_doc_quyen",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 82,
    "unit": "lốc",
    "rating": 4.5,
    "sales": 95,
    "image": "🎁",
    "daysUntilExpiry": 105,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0467",
    "name": "Bauli Moonfils Bánh Sừng Bò Nhân Kem Vani 45G",
    "barcode": "8908009419651",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 89,
    "unit": "gói",
    "rating": 4.6,
    "sales": 108,
    "image": "🍪",
    "daysUntilExpiry": 112,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0468",
    "name": "Bauli Moonfils Bánh Sừng Bò Nhân Kem Dâu 45G",
    "barcode": "8908009419644",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 96,
    "unit": "gói",
    "rating": 4.7,
    "sales": 121,
    "image": "🍪",
    "daysUntilExpiry": 119,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0469",
    "name": "Oishi Snack Bắp Vị Socola 68G",
    "barcode": "8934803070347",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 23,
    "unit": "gói",
    "rating": 4.8,
    "sales": 134,
    "image": "🍫",
    "daysUntilExpiry": 126,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0470",
    "name": "Oishi Snack Chay Vị Da Heo Quay 68G",
    "barcode": "8934803042580",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 30,
    "unit": "gói",
    "rating": 4.9,
    "sales": 147,
    "image": "🍿",
    "daysUntilExpiry": 133,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0471",
    "name": "Oishi Snack Que Nhân Sữa 7G",
    "barcode": "8934803028409",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 37,
    "unit": "gói",
    "rating": 4.5,
    "sales": 160,
    "image": "🍿",
    "daysUntilExpiry": 140,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0472",
    "name": "Oishi Snack Que Nhân Cà Phê Moka 7G",
    "barcode": "8934803028393",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 44,
    "unit": "gói",
    "rating": 4.6,
    "sales": 173,
    "image": "🍿",
    "daysUntilExpiry": 147,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0473",
    "name": "Meiji Sôcôla Sữa 50G",
    "barcode": "4902777015927",
    "category": "sua_bo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 51,
    "unit": "thanh",
    "rating": 4.7,
    "sales": 186,
    "image": "🍫",
    "daysUntilExpiry": 154,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0474",
    "name": "Meiji Sôcôla Đen 50G",
    "barcode": "4902777090603",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 58,
    "unit": "thanh",
    "rating": 4.8,
    "sales": 199,
    "image": "🍫",
    "daysUntilExpiry": 161,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0475",
    "name": "Meiji Sôcôla Sữa 41G",
    "barcode": "4902777025902",
    "category": "sua_bo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 65,
    "unit": "thanh",
    "rating": 4.9,
    "sales": 212,
    "image": "🍫",
    "daysUntilExpiry": 168,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0476",
    "name": "Meiji Socola Đen Nguyên Chất 41G",
    "barcode": "4902777090115",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 72,
    "unit": "thanh",
    "rating": 4.5,
    "sales": 225,
    "image": "🍫",
    "daysUntilExpiry": 175,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0477",
    "name": "Hello Panda Bánh Gấu Nhân Sô Cô La 40G",
    "barcode": "8888077102023",
    "category": "me_be",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 79,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 238,
    "image": "🍪",
    "daysUntilExpiry": 182,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0478",
    "name": "Yan Yan Bánh Que Chấm Kem Ca Cao Hạt Phỉ 44G",
    "barcode": "8888077101378",
    "category": "banh_keo",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 86,
    "unit": "ly",
    "rating": 4.7,
    "sales": 251,
    "image": "🍪",
    "daysUntilExpiry": 189,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0479",
    "name": "Yan Yan Bánh Que Chấm Kem Dâu 50G",
    "barcode": "8888077101125",
    "category": "banh_keo",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 93,
    "unit": "ly",
    "rating": 4.8,
    "sales": 264,
    "image": "🍪",
    "daysUntilExpiry": 196,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0480",
    "name": "Yan Yan Bánh Que Chấm Kem Vani 50G",
    "barcode": "8888077101200",
    "category": "banh_keo",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 20,
    "unit": "ly",
    "rating": 4.9,
    "sales": 277,
    "image": "🍪",
    "daysUntilExpiry": 203,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0481",
    "name": "Yan Yan Bánh Que Chấm Kem Sô Cô La 50G",
    "barcode": "8888077101101",
    "category": "banh_keo",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 27,
    "unit": "ly",
    "rating": 4.5,
    "sales": 290,
    "image": "🍪",
    "daysUntilExpiry": 210,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0482",
    "name": "Dh Foods Xốt Phô Mai 100Gr",
    "barcode": "8936079287627",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 34,
    "unit": "chai",
    "rating": 4.6,
    "sales": 303,
    "image": "🍶",
    "daysUntilExpiry": 217,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0483",
    "name": "Dh Foods Xốt Trứng Muối 100Gr",
    "barcode": "8936079287610",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 41,
    "unit": "chai",
    "rating": 4.7,
    "sales": 316,
    "image": "🍶",
    "daysUntilExpiry": 224,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0484",
    "name": "Dh Foods Dầu Màu Điều 90Ml",
    "barcode": "8936079287221",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 48,
    "unit": "chai",
    "rating": 4.8,
    "sales": 329,
    "image": "🛢️",
    "daysUntilExpiry": 231,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0485",
    "name": "Dh Foods Muối Tiêu Lá Chanh 50G",
    "barcode": "8936079282264",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 55,
    "unit": "hũ",
    "rating": 4.9,
    "sales": 342,
    "image": "🧂",
    "daysUntilExpiry": 238,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0486",
    "name": "Dh Foods Muối Ớt Chanh Nha Trang 200G",
    "barcode": "8936079280208",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 62,
    "unit": "hũ",
    "rating": 4.5,
    "sales": 355,
    "image": "🧂",
    "daysUntilExpiry": 245,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0487",
    "name": "Dh Foods Tiêu Đen Xay 45G",
    "barcode": "8936079282301",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 69,
    "unit": "hũ",
    "rating": 4.6,
    "sales": 368,
    "image": "🧂",
    "daysUntilExpiry": 252,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0488",
    "name": "Dh Foods Muối Tôm Tây Ninh 110G",
    "barcode": "8936079280802",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 76,
    "unit": "hũ",
    "rating": 4.7,
    "sales": 381,
    "image": "🧂",
    "daysUntilExpiry": 259,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0489",
    "name": "Dh Foods Gia Vị Nấu Phở Bò Hà Nội Natural 24Gr",
    "barcode": "8936079284367",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 83,
    "unit": "gói",
    "rating": 4.8,
    "sales": 394,
    "image": "🍜",
    "daysUntilExpiry": 266,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0490",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Rong Biển Cuốn Thanh Hải Sản",
    "barcode": "8936034878334",
    "category": "me_be",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 90,
    "unit": "gói",
    "rating": 4.9,
    "sales": 407,
    "image": "🍪",
    "daysUntilExpiry": 273,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0491",
    "name": "Ponnie Hotdog Giòn Ăn Liền Vị Bắp 28Gr",
    "barcode": "8936034876507",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 97,
    "unit": "gói",
    "rating": 4.5,
    "sales": 420,
    "image": "🌭",
    "daysUntilExpiry": 280,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0492",
    "name": "Ponnie Hotdog Giòn Ăn Liền Vị Bắp 28Gr",
    "barcode": "SP001109",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 24,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 433,
    "image": "🌭",
    "daysUntilExpiry": 287,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0493",
    "name": "Chin-Su Tương Cà 250Gr",
    "barcode": "8936017367046",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 31,
    "unit": "chai",
    "rating": 4.7,
    "sales": 446,
    "image": "🧂",
    "daysUntilExpiry": 294,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0494",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Cuốn Cuốn Rong Biển",
    "barcode": "8936034876774",
    "category": "me_be",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 38,
    "unit": "gói",
    "rating": 4.8,
    "sales": 59,
    "image": "🍪",
    "daysUntilExpiry": 301,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0495",
    "name": "Ponnie Xúc Xích Dinh Dưỡng Bin & Bon Thịt Heo 35Gr",
    "barcode": "8936034877818",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 45,
    "unit": "gói",
    "rating": 4.9,
    "sales": 72,
    "image": "🥩",
    "daysUntilExpiry": 308,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0496",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Nhân Phô Mai 32Gr",
    "barcode": "8936034877214",
    "category": "me_be",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 52,
    "unit": "cây",
    "rating": 4.5,
    "sales": 85,
    "image": "🍪",
    "daysUntilExpiry": 315,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0497",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Nhân Phô Mai 32Gr",
    "barcode": "SP001106",
    "category": "me_be",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 59,
    "unit": "túi",
    "rating": 4.6,
    "sales": 98,
    "image": "🍪",
    "daysUntilExpiry": 322,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0498",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Nhân Phô Mai Vị Bắp 32Gr",
    "barcode": "8936034877207",
    "category": "me_be",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 66,
    "unit": "cây",
    "rating": 4.7,
    "sales": 111,
    "image": "🍿",
    "daysUntilExpiry": 329,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0499",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Nhân Phô Mai Vị Bắp 32Gr",
    "barcode": "SP001105",
    "category": "me_be",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 73,
    "unit": "túi",
    "rating": 4.8,
    "sales": 124,
    "image": "🍿",
    "daysUntilExpiry": 336,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0500",
    "name": "Ponnie Hotdog Giòn Ăn Liền Vị Phô Mai Bắp 20Gr",
    "barcode": "8936034877917",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 80,
    "unit": "gói",
    "rating": 4.9,
    "sales": 137,
    "image": "🌭",
    "daysUntilExpiry": 343,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0501",
    "name": "Ponnie Hotdog Giòn Ăn Liền Vị Phô Mai Bắp 20Gr",
    "barcode": "SP001103",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 87,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 150,
    "image": "🌭",
    "daysUntilExpiry": 350,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0502",
    "name": "Ponnie Xúc Xích Tiệt Trùng Thịt Phô Mai 45Gr",
    "barcode": "8936034875357",
    "category": "thit_ca",
    "costPrice": 4500,
    "price": 6000,
    "originalPrice": 6500,
    "stock": 94,
    "unit": "cây",
    "rating": 4.6,
    "sales": 163,
    "image": "🥩",
    "daysUntilExpiry": 357,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0503",
    "name": "Ponnie Xúc Xích Tiệt Trùng Thịt Phô Mai 45Gr",
    "barcode": "SP001102",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 21,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 176,
    "image": "🥩",
    "daysUntilExpiry": 94,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0504",
    "name": "Ponnie Xúc Xích Tiệt Trùng Cay Vị Ớt 120G",
    "barcode": "8936034878624",
    "category": "thit_ca",
    "costPrice": 4500,
    "price": 6000,
    "originalPrice": 6500,
    "stock": 28,
    "unit": "cây",
    "rating": 4.8,
    "sales": 189,
    "image": "🥩",
    "daysUntilExpiry": 101,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0505",
    "name": "Ponnie Xúc Xích Tiệt Trùng Cay Vị Ớt 120G",
    "barcode": "SP001101",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 35,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 202,
    "image": "🥩",
    "daysUntilExpiry": 108,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0506",
    "name": "Nam Ngư Nước Chấm Ớt Tỏi Lý Sơn 300Ml",
    "barcode": "8936221044382",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 42,
    "unit": "chai",
    "rating": 4.5,
    "sales": 215,
    "image": "🧂",
    "daysUntilExpiry": 115,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0507",
    "name": "Chin-Su Nước Tương Tỏi Ớt 330Ml",
    "barcode": "8936136163734",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 49,
    "unit": "chai",
    "rating": 4.6,
    "sales": 228,
    "image": "🧂",
    "daysUntilExpiry": 122,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0508",
    "name": "Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 67G",
    "barcode": "8936221043804",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 56,
    "unit": "ly",
    "rating": 4.7,
    "sales": 241,
    "image": "🍜",
    "daysUntilExpiry": 129,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0509",
    "name": "Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 67G",
    "barcode": "SP001100",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 63,
    "unit": "thùng",
    "rating": 4.8,
    "sales": 254,
    "image": "🎁",
    "daysUntilExpiry": 136,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0510",
    "name": "Omachi Mì Khoai Tây Xốt Bò Hầm 93G",
    "barcode": "8936221041794",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 70,
    "unit": "tô",
    "rating": 4.9,
    "sales": 267,
    "image": "🍜",
    "daysUntilExpiry": 143,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0511",
    "name": "Omachi Mì Khoai Tây Xốt Bò Hầm 93G",
    "barcode": "SP001099",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 77,
    "unit": "thùng",
    "rating": 4.5,
    "sales": 280,
    "image": "🎁",
    "daysUntilExpiry": 150,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0512",
    "name": "Omachi Mì Khoai Tây Sườn Hầm Ngũ Quả 96G",
    "barcode": "8936221041787",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 84,
    "unit": "tô",
    "rating": 4.6,
    "sales": 293,
    "image": "🍜",
    "daysUntilExpiry": 157,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0513",
    "name": "Omachi Mì Khoai Tây Sườn Hầm Ngũ Quả 96G",
    "barcode": "SP001098",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 91,
    "unit": "thùng",
    "rating": 4.7,
    "sales": 306,
    "image": "🎁",
    "daysUntilExpiry": 164,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0514",
    "name": "Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 92G",
    "barcode": "8936221041800",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 98,
    "unit": "tô",
    "rating": 4.8,
    "sales": 319,
    "image": "🍜",
    "daysUntilExpiry": 171,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0515",
    "name": "Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 92G",
    "barcode": "SP001097",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 25,
    "unit": "thùng",
    "rating": 4.9,
    "sales": 332,
    "image": "🎁",
    "daysUntilExpiry": 178,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0516",
    "name": "Nam Dương Tương Ớt",
    "barcode": "8936134362313",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 32,
    "unit": "Gói",
    "rating": 4.5,
    "sales": 345,
    "image": "🧂",
    "daysUntilExpiry": 185,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0517",
    "name": "Oh Teen Xxtt Vị Lạp Xưởng Nướng Đá Kiểu Đài Loan 40G",
    "barcode": "8936210415308",
    "category": "thit_ca",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 39,
    "unit": "cây",
    "rating": 4.6,
    "sales": 358,
    "image": "🥩",
    "daysUntilExpiry": 192,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0518",
    "name": "Oh Teen Xxtt Vị Lạp Xưởng Nướng Đá Kiểu Đài Loan 40G",
    "barcode": "SP001069",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 46,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 371,
    "image": "🥩",
    "daysUntilExpiry": 199,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0519",
    "name": "S&B Xốt Mù Tạt Tươi Wasabi Nhật Bản 43G",
    "barcode": "77377508132",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 53,
    "unit": "Hộp",
    "rating": 4.8,
    "sales": 384,
    "image": "🍶",
    "daysUntilExpiry": 206,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0520",
    "name": "Iyemon Cha Trà Xanh Rang",
    "barcode": "4901046361109",
    "category": "nuoc_ngot",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 60,
    "unit": "Hộp",
    "rating": 4.9,
    "sales": 397,
    "image": "🍵",
    "daysUntilExpiry": 213,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0521",
    "name": "Iyemon Cha Trà Matcha Iyemon",
    "barcode": "4901046661018",
    "category": "nuoc_ngot",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 67,
    "unit": "Hộp",
    "rating": 4.5,
    "sales": 410,
    "image": "🍵",
    "daysUntilExpiry": 220,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0522",
    "name": "Iyemon Cha Trà Gạo Lứt Matcha Iyemon",
    "barcode": "4901046661025",
    "category": "nuoc_ngot",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 74,
    "unit": "Hộp",
    "rating": 4.6,
    "sales": 423,
    "image": "🍵",
    "daysUntilExpiry": 227,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0523",
    "name": "Marumiya Gia Vị Rắc Cơm Rong Biển Thảo Mộc Wakame 29Gr",
    "barcode": "4902820112726",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 81,
    "unit": "Gói",
    "rating": 4.7,
    "sales": 436,
    "image": "🧂",
    "daysUntilExpiry": 234,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0524",
    "name": "Marumiya Gia Vị Rắc Cơm Rong Biển Wakame",
    "barcode": "4902820112702",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 88,
    "unit": "Gói",
    "rating": 4.8,
    "sales": 449,
    "image": "🧂",
    "daysUntilExpiry": 241,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0525",
    "name": "Sea Crown Cá Nục Sốt Cà Cay",
    "barcode": "8935105810150",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 95,
    "unit": "Lon",
    "rating": 4.9,
    "sales": 62,
    "image": "🐟",
    "daysUntilExpiry": 248,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0526",
    "name": "Sea Crown Cá Trích Sốt Cà",
    "barcode": "8935105810105",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 22,
    "unit": "Lon",
    "rating": 4.5,
    "sales": 75,
    "image": "🐟",
    "daysUntilExpiry": 255,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0527",
    "name": "Sea Crown Cá Nục Sốt Cà",
    "barcode": "8935105810099",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 29,
    "unit": "Lon",
    "rating": 4.6,
    "sales": 88,
    "image": "🐟",
    "daysUntilExpiry": 262,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0528",
    "name": "Sea Crown Cá Ngừ Sốt Ớt",
    "barcode": "8850229102793",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 36,
    "unit": "Lon",
    "rating": 4.7,
    "sales": 101,
    "image": "🐟",
    "daysUntilExpiry": 269,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0529",
    "name": "Sea Crown Cá Ngừ Xắt Khúc Ngâm Dầu 140Gr",
    "barcode": "8850229102601",
    "category": "thit_ca",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 43,
    "unit": "Lon",
    "rating": 4.8,
    "sales": 114,
    "image": "🐟",
    "daysUntilExpiry": 276,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0530",
    "name": "Oreo Bánh Quy Nhân Kem Vani 64.4G",
    "barcode": "6901668053121",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 50,
    "unit": "gói",
    "rating": 4.9,
    "sales": 127,
    "image": "🍪",
    "daysUntilExpiry": 283,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0531",
    "name": "Gấu Đỏ Cháo Thịt Bằm",
    "barcode": "8934679452407",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 140,
    "image": "🍜",
    "daysUntilExpiry": 290,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0532",
    "name": "Gấu Đỏ Cháo Thịt Bằm",
    "barcode": "SP001062",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 64,
    "unit": "thùng",
    "rating": 4.6,
    "sales": 153,
    "image": "🎁",
    "daysUntilExpiry": 297,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0533",
    "name": "Gấu Đỏ Mì Gà Sợi Phở",
    "barcode": "8934679840327",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 166,
    "image": "🍜",
    "daysUntilExpiry": 304,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0534",
    "name": "Gấu Đỏ Mì Gà Sợi Phở",
    "barcode": "SP001063",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 78,
    "unit": "thùng",
    "rating": 4.8,
    "sales": 179,
    "image": "🎁",
    "daysUntilExpiry": 311,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0535",
    "name": "Gấu Đỏ Mì Tôm Chua Cay",
    "barcode": "8934679941826",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 192,
    "image": "🍜",
    "daysUntilExpiry": 318,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0536",
    "name": "Gấu Đỏ Mì Tôm Chua Cay",
    "barcode": "SP001064",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 92,
    "unit": "thùng",
    "rating": 4.5,
    "sales": 205,
    "image": "🎁",
    "daysUntilExpiry": 325,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0537",
    "name": "Gấu Đỏ Mì Chay Rau Nấm",
    "barcode": "8934679940522",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 99,
    "unit": "gói",
    "rating": 4.6,
    "sales": 218,
    "image": "🍜",
    "daysUntilExpiry": 332,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0538",
    "name": "Gấu Đỏ Mì Chay Rau Nấm",
    "barcode": "SP001065",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 26,
    "unit": "thùng",
    "rating": 4.7,
    "sales": 231,
    "image": "🎁",
    "daysUntilExpiry": 339,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0539",
    "name": "Gấu Đỏ Mì Tôm Và Gà",
    "barcode": "8934679943325",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 33,
    "unit": "gói",
    "rating": 4.8,
    "sales": 244,
    "image": "🍜",
    "daysUntilExpiry": 346,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0540",
    "name": "Gấu Đỏ Mì Tôm Và Gà",
    "barcode": "SP001066",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 40,
    "unit": "thùng",
    "rating": 4.9,
    "sales": 257,
    "image": "🎁",
    "daysUntilExpiry": 353,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0541",
    "name": "Mix Bánh Que Vị Rong Biển 50G",
    "barcode": "8858223013039",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 47,
    "unit": "gói",
    "rating": 4.5,
    "sales": 270,
    "image": "🍪",
    "daysUntilExpiry": 90,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0542",
    "name": "Mix Bánh Que Vị Ớt Cay 50G",
    "barcode": "8858223008479",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 54,
    "unit": "gói",
    "rating": 4.6,
    "sales": 283,
    "image": "🍪",
    "daysUntilExpiry": 97,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0543",
    "name": "Oreo Bánh Quế Nhân Kem Vani 54G",
    "barcode": "8934680033428",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 61,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 296,
    "image": "🍪",
    "daysUntilExpiry": 104,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0544",
    "name": "Oreo Bánh Quế Nhân Kem Socola 54G",
    "barcode": "8934680033442",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 68,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 309,
    "image": "🍫",
    "daysUntilExpiry": 111,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0545",
    "name": "Oreo Bánh Pie Vị Socola Marshmallow 168G",
    "barcode": "8934680045971",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 75,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 322,
    "image": "🍫",
    "daysUntilExpiry": 118,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0546",
    "name": "Oreo Bánh Pie Vị Socola Dâu Marshmallow 168G",
    "barcode": "8934680046527",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 82,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 335,
    "image": "🍫",
    "daysUntilExpiry": 125,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0547",
    "name": "Oreo Bánh Quy Nhân Kem Socola 64.4G",
    "barcode": "7622210580276",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 89,
    "unit": "gói",
    "rating": 4.6,
    "sales": 348,
    "image": "🍫",
    "daysUntilExpiry": 132,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0548",
    "name": "Ritz Bánh Quy Kẹp Kem Phô Mai 118G",
    "barcode": "4893049120008",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 96,
    "unit": "gói",
    "rating": 4.7,
    "sales": 361,
    "image": "🍪",
    "daysUntilExpiry": 139,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0549",
    "name": "Poca Snack Hình Cua Vị Tảo Biển Nori 60G",
    "barcode": "8936079124908",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 23,
    "unit": "gói",
    "rating": 4.8,
    "sales": 374,
    "image": "🍿",
    "daysUntilExpiry": 146,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0550",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Xốt Spaghetti",
    "barcode": "8936034877726",
    "category": "me_be",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 30,
    "unit": "ly",
    "rating": 4.9,
    "sales": 387,
    "image": "🍪",
    "daysUntilExpiry": 153,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0551",
    "name": "Omachi Mì Khoai Tây Sườn Hầm Ngũ Quả 70G",
    "barcode": "8936221043798",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 37,
    "unit": "ly",
    "rating": 4.5,
    "sales": 400,
    "image": "🍜",
    "daysUntilExpiry": 160,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0552",
    "name": "Ponnie Xúc Xích Tiệt Trùng Vị Heo 35Gr",
    "barcode": "8936034875258",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 44,
    "unit": "gói",
    "rating": 4.6,
    "sales": 413,
    "image": "🥩",
    "daysUntilExpiry": 167,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0553",
    "name": "Kokomi Mì Tôm Chua Cay 65Gr",
    "barcode": "8936221044160",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 51,
    "unit": "gói",
    "rating": 4.7,
    "sales": 426,
    "image": "🍜",
    "daysUntilExpiry": 174,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0554",
    "name": "Omachi Mì Khoai Tây Xốt Bò Hầm 69G",
    "barcode": "8936221043781",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 58,
    "unit": "ly",
    "rating": 4.8,
    "sales": 439,
    "image": "🍜",
    "daysUntilExpiry": 181,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0555",
    "name": "Omachi Mì Trộn Xốt Spaghetti 105G",
    "barcode": "8936136164403",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 65,
    "unit": "tô",
    "rating": 4.9,
    "sales": 52,
    "image": "🍜",
    "daysUntilExpiry": 188,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0556",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Lắc Phô Mai 42.2G",
    "barcode": "8936034877740",
    "category": "me_be",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 72,
    "unit": "ly",
    "rating": 4.5,
    "sales": 65,
    "image": "🍪",
    "daysUntilExpiry": 195,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0557",
    "name": "Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 80G",
    "barcode": "8936221041763",
    "category": "mi_goi",
    "costPrice": 6500,
    "price": 8500,
    "originalPrice": 9500,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 78,
    "image": "🍜",
    "daysUntilExpiry": 202,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0558",
    "name": "Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 80G",
    "barcode": "SP001067",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 86,
    "unit": "thùng",
    "rating": 4.7,
    "sales": 91,
    "image": "🎁",
    "daysUntilExpiry": 209,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0559",
    "name": "Omachi Mì Khoai Tây Xốt Bò Hầm 81G",
    "barcode": "8936221041756",
    "category": "mi_goi",
    "costPrice": 6500,
    "price": 8500,
    "originalPrice": 9500,
    "stock": 93,
    "unit": "gói",
    "rating": 4.8,
    "sales": 104,
    "image": "🍜",
    "daysUntilExpiry": 216,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0560",
    "name": "Omachi Mì Khoai Tây Trộn Xốt Spaghetti 90G",
    "barcode": "8936136164397",
    "category": "mi_goi",
    "costPrice": 6500,
    "price": 8500,
    "originalPrice": 9500,
    "stock": 20,
    "unit": "gói",
    "rating": 4.9,
    "sales": 117,
    "image": "🍜",
    "daysUntilExpiry": 223,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0561",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Xốt Tôm Sữa 52.5G",
    "barcode": "8936034877764",
    "category": "me_be",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 27,
    "unit": "ly",
    "rating": 4.5,
    "sales": 130,
    "image": "🍪",
    "daysUntilExpiry": 230,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0562",
    "name": "Omachi Mì Trộn Xốt Tôm Phô Mai Trứng Muối 105G",
    "barcode": "8936221043897",
    "category": "mi_goi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 34,
    "unit": "tô",
    "rating": 4.6,
    "sales": 143,
    "image": "🍜",
    "daysUntilExpiry": 237,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0563",
    "name": "Omachi Mì Khoai Tây Sườn Hầm Ngũ Quả 80G",
    "barcode": "8936221041749",
    "category": "mi_goi",
    "costPrice": 6500,
    "price": 8500,
    "originalPrice": 9500,
    "stock": 41,
    "unit": "gói",
    "rating": 4.7,
    "sales": 156,
    "image": "🍜",
    "daysUntilExpiry": 244,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0564",
    "name": "Big Roll Rong Biển Cuộn Vị Mực 3G",
    "barcode": "8858702410878",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 48,
    "unit": "gói",
    "rating": 4.8,
    "sales": 169,
    "image": "🍪",
    "daysUntilExpiry": 251,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0565",
    "name": "Big Roll Rong Biển Cuộn Vị Mực 3G",
    "barcode": "8858702411790",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 55,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 182,
    "image": "🍪",
    "daysUntilExpiry": 258,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0566",
    "name": "Big Roll Rong Biển Cuộn Vị Cay 3G",
    "barcode": "8858702410847",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 62,
    "unit": "gói",
    "rating": 4.5,
    "sales": 195,
    "image": "🍪",
    "daysUntilExpiry": 265,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0567",
    "name": "Big Roll Rong Biển Cuộn Vị Cay 3G",
    "barcode": "8858702411783",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 69,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 208,
    "image": "🍪",
    "daysUntilExpiry": 272,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0568",
    "name": "Big Roll Rong Biển Cuộn Vị BBQ 3G",
    "barcode": "8858702414951",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 76,
    "unit": "gói",
    "rating": 4.7,
    "sales": 221,
    "image": "🍪",
    "daysUntilExpiry": 279,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0569",
    "name": "Big Roll Rong Biển Cuộn Vị BBQ 3G",
    "barcode": "8858702415002",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 83,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 234,
    "image": "🍪",
    "daysUntilExpiry": 286,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0570",
    "name": "Big Roll Rong Biển Cuộn Vị Truyền Thống 3G",
    "barcode": "8858702410816",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 90,
    "unit": "gói",
    "rating": 4.9,
    "sales": 247,
    "image": "🍪",
    "daysUntilExpiry": 293,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0571",
    "name": "Big Roll Rong Biển Cuộn Vị Truyền Thống 3G",
    "barcode": "8858702411776",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 97,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 260,
    "image": "🍪",
    "daysUntilExpiry": 300,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0572",
    "name": "Vinacafe Cà Phê Vcf 3In1 Gold Original 20Gr",
    "barcode": "8934683008614",
    "category": "nuoc_ngot",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 24,
    "unit": "túi",
    "rating": 4.6,
    "sales": 273,
    "image": "🥤",
    "daysUntilExpiry": 307,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0573",
    "name": "Chin-Su Tương Ớt Mn 250G",
    "barcode": "8936017363505",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 31,
    "unit": "chai",
    "rating": 4.7,
    "sales": 286,
    "image": "🧂",
    "daysUntilExpiry": 314,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0574",
    "name": "Nam Ngư Nước Mắm 500Ml",
    "barcode": "8936136163307",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 38,
    "unit": "chai",
    "rating": 4.8,
    "sales": 299,
    "image": "🧂",
    "daysUntilExpiry": 321,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0575",
    "name": "Heo Cao Bồi Xúc Xích Tiệt Trùng Lắc Phô Mai Bắp Bơ 42G",
    "barcode": "8936034877757",
    "category": "me_be",
    "costPrice": 11000,
    "price": 14000,
    "originalPrice": 15500,
    "stock": 45,
    "unit": "ly",
    "rating": 4.9,
    "sales": 312,
    "image": "🍿",
    "daysUntilExpiry": 328,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0576",
    "name": "Poca Snack Hình Mũ Pháp Sư Vị Phô Mai 58G",
    "barcode": "8936079125523",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 52,
    "unit": "gói",
    "rating": 4.5,
    "sales": 325,
    "image": "🍿",
    "daysUntilExpiry": 335,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0577",
    "name": "Meizan Bột Bánh Xèo 400G X 1",
    "barcode": "8938509627058",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 59,
    "unit": "gói",
    "rating": 4.6,
    "sales": 338,
    "image": "📦",
    "daysUntilExpiry": 342,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0578",
    "name": "Olivoila Mì Spaghetti N.5 500Gr",
    "barcode": "8938509627492",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 66,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 351,
    "image": "🍜",
    "daysUntilExpiry": 349,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0579",
    "name": "Dầu Olive Oil Pomace 750Ml",
    "barcode": "8436604400069",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 73,
    "unit": "chai",
    "rating": 4.8,
    "sales": 364,
    "image": "🛢️",
    "daysUntilExpiry": 356,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0580",
    "name": "Dầu Olive Olivoila Extra 750Ml",
    "barcode": "8436604400045",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 80,
    "unit": "chai",
    "rating": 4.9,
    "sales": 377,
    "image": "🛢️",
    "daysUntilExpiry": 93,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0581",
    "name": "Dầu Olive Olivoilà Extra Virgin 250Ml",
    "barcode": "8436604400021",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 87,
    "unit": "chai",
    "rating": 4.5,
    "sales": 390,
    "image": "🛢️",
    "daysUntilExpiry": 100,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0582",
    "name": "Kitkat Chunky Bánh Xốp Cookies Kem 38G",
    "barcode": "9556001216144",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 94,
    "unit": "thanh",
    "rating": 4.6,
    "sales": 403,
    "image": "🍪",
    "daysUntilExpiry": 107,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0583",
    "name": "Kitkat Chunky Bánh Xốp Vị Socola 38G",
    "barcode": "9556001198839",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 21,
    "unit": "thanh",
    "rating": 4.7,
    "sales": 416,
    "image": "🍫",
    "daysUntilExpiry": 114,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0584",
    "name": "Kitkat Bánh Xốp Vị Trà Xanh 1",
    "barcode": "9556001227560",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 28,
    "unit": "thanh",
    "rating": 4.8,
    "sales": 429,
    "image": "🍪",
    "daysUntilExpiry": 121,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0585",
    "name": "Oh Teen Xúc Xích Tiệt Trùng 35G",
    "barcode": "8936210411133",
    "category": "thit_ca",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 35,
    "unit": "cây",
    "rating": 4.9,
    "sales": 442,
    "image": "🥩",
    "daysUntilExpiry": 128,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0586",
    "name": "Oh Teen Xúc Xích Tiệt Trùng 35G",
    "barcode": "SP001068",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 42,
    "unit": "gói",
    "rating": 4.5,
    "sales": 55,
    "image": "🥩",
    "daysUntilExpiry": 135,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0587",
    "name": "Oh Teen Xúc Xích Tiệt Trùng 65G",
    "barcode": "8936210413816",
    "category": "thit_ca",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 49,
    "unit": "cây",
    "rating": 4.6,
    "sales": 68,
    "image": "🥩",
    "daysUntilExpiry": 142,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0588",
    "name": "Lipton Trà Nhãn Vàng 25 Túi X 2G_Chamber",
    "barcode": "4902203528236",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 56,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 81,
    "image": "🍵",
    "daysUntilExpiry": 149,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0589",
    "name": "Kitkat Bánh Xốp Vị Trà Xanh",
    "barcode": "9556001227539",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 63,
    "unit": "thanh",
    "rating": 4.8,
    "sales": 94,
    "image": "🍪",
    "daysUntilExpiry": 156,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0590",
    "name": "Kitkat Bánh Xốp Vị Socola",
    "barcode": "95506500",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 70,
    "unit": "thanh",
    "rating": 4.9,
    "sales": 107,
    "image": "🍫",
    "daysUntilExpiry": 163,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0591",
    "name": "Kitkat Thanh 4F Bánh Xốp Vị Socola 35G",
    "barcode": "9556001027252",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 77,
    "unit": "gói",
    "rating": 4.5,
    "sales": 120,
    "image": "🍫",
    "daysUntilExpiry": 170,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0592",
    "name": "Kitkat Bites Bánh Xốp Viên Socola 40G",
    "barcode": "9556001029362",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 84,
    "unit": "gói",
    "rating": 4.6,
    "sales": 133,
    "image": "🍫",
    "daysUntilExpiry": 177,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0593",
    "name": "Milo Sôcôla Viên Nuggets 25G",
    "barcode": "9556001222343",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 91,
    "unit": "gói",
    "rating": 4.7,
    "sales": 146,
    "image": "🍫",
    "daysUntilExpiry": 184,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0594",
    "name": "Milo Sôcôla Thanh Chocobar 30G",
    "barcode": "9556001216236",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 98,
    "unit": "thanh",
    "rating": 4.8,
    "sales": 159,
    "image": "🍫",
    "daysUntilExpiry": 191,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0595",
    "name": "Cholimex Tương Đen Phở 230Gr",
    "barcode": "8934637514772",
    "category": "mi_goi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 25,
    "unit": "chai",
    "rating": 4.9,
    "sales": 172,
    "image": "🍜",
    "daysUntilExpiry": 198,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0596",
    "name": "Cholimex Tương Ớt Pet 270G",
    "barcode": "8934637011523",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 32,
    "unit": "chai",
    "rating": 4.5,
    "sales": 185,
    "image": "🧂",
    "daysUntilExpiry": 205,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0597",
    "name": "Cholimex Tương Cà Chai Pet 270 G",
    "barcode": "8934637212531",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 39,
    "unit": "chai",
    "rating": 4.6,
    "sales": 198,
    "image": "🧂",
    "daysUntilExpiry": 212,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0598",
    "name": "Dầu Dấm Trộn Salad Pet 270 Gr",
    "barcode": "8934637513676",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 46,
    "unit": "chai",
    "rating": 4.7,
    "sales": 211,
    "image": "🛢️",
    "daysUntilExpiry": 219,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0599",
    "name": "Cholimex Tương Xí Muội Pet 270 G",
    "barcode": "8934637042534",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 53,
    "unit": "chai",
    "rating": 4.8,
    "sales": 224,
    "image": "🧂",
    "daysUntilExpiry": 226,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0600",
    "name": "Cholimex Sate Tôm Pet 90G",
    "barcode": "8934637514314",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 60,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 237,
    "image": "🧂",
    "daysUntilExpiry": 233,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0601",
    "name": "Cholimex Ớt Khô Sate Hũ Thủy Tinh 100G",
    "barcode": "8934637514291",
    "category": "gia_vi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 67,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 250,
    "image": "🧂",
    "daysUntilExpiry": 240,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0602",
    "name": "Cholimex Gia Vị Kho Cá 50G",
    "barcode": "8934637515441",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 74,
    "unit": "gói",
    "rating": 4.6,
    "sales": 263,
    "image": "🧂",
    "daysUntilExpiry": 247,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0603",
    "name": "Cholimex Gia Vị Kho Thịt 50G",
    "barcode": "8934637515465",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 276,
    "image": "🧂",
    "daysUntilExpiry": 254,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0604",
    "name": "Cholimex Xốt Ướp Thịt Nướng 70G",
    "barcode": "8934637514871",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 88,
    "unit": "gói",
    "rating": 4.8,
    "sales": 289,
    "image": "🍶",
    "daysUntilExpiry": 261,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0605",
    "name": "Cholimex Xốt Bò Kho 90G",
    "barcode": "8934637515731",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 95,
    "unit": "gói",
    "rating": 4.9,
    "sales": 302,
    "image": "🍶",
    "daysUntilExpiry": 268,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0606",
    "name": "Cholimex Xốt Bún Bò 90G",
    "barcode": "8934637515717",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 315,
    "image": "🍶",
    "daysUntilExpiry": 275,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0607",
    "name": "Indomie Mì Xào Khô Mi Goreng Vị Sườn",
    "barcode": "89686043686",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 328,
    "image": "🍜",
    "daysUntilExpiry": 282,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0608",
    "name": "Indomie Mì Xào Khô Mi Goreng Vị Sườn",
    "barcode": "10089686043683",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 36,
    "unit": "thùng",
    "rating": 4.7,
    "sales": 341,
    "image": "🎁",
    "daysUntilExpiry": 289,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0609",
    "name": "Indomie Mì Xào Khô Mi Goreng Vị Đặc Biệt",
    "barcode": "89686010947",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 354,
    "image": "🍜",
    "daysUntilExpiry": 296,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0610",
    "name": "Indomie Mì Xào Khô Mi Goreng Vị Đặc Biệt",
    "barcode": "10089686010944",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 50,
    "unit": "thùng",
    "rating": 4.9,
    "sales": 367,
    "image": "🎁",
    "daysUntilExpiry": 303,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0611",
    "name": "Indomie Mì Xào Khô Mi Goreng Vị Bò Cay",
    "barcode": "89686910704",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 380,
    "image": "🍜",
    "daysUntilExpiry": 310,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0612",
    "name": "Indomie Mì Xào Khô Mi Goreng Vị Bò Cay",
    "barcode": "10089686011187",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 64,
    "unit": "thùng",
    "rating": 4.6,
    "sales": 393,
    "image": "🎁",
    "daysUntilExpiry": 317,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0613",
    "name": "Indomie Mì Xào Khô Mi Goreng Vị Cay Nồng",
    "barcode": "89686011036",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 406,
    "image": "🍜",
    "daysUntilExpiry": 324,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0614",
    "name": "Indomie Mì Xào Khô Mi Goreng Vị Cay Nồng",
    "barcode": "10089686011033",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 78,
    "unit": "thùng",
    "rating": 4.8,
    "sales": 419,
    "image": "🎁",
    "daysUntilExpiry": 331,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0615",
    "name": "Cholimex Tương Ớt Chua Ngọt Pet 270G",
    "barcode": "8934637062525",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 85,
    "unit": "chai",
    "rating": 4.9,
    "sales": 432,
    "image": "🧂",
    "daysUntilExpiry": 338,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0616",
    "name": "Sachi Bánh Tráng Nướng Phủ Chà Bông Gà 45G",
    "barcode": "8936183002840",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 92,
    "unit": "gói",
    "rating": 4.5,
    "sales": 445,
    "image": "📦",
    "daysUntilExpiry": 345,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0617",
    "name": "Vfood Trứng Vịt Muối Ăn Liền",
    "barcode": "8936013686783",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 99,
    "unit": "gói",
    "rating": 4.6,
    "sales": 58,
    "image": "🥚",
    "daysUntilExpiry": 352,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0618",
    "name": "Vfood Trứng Vịt Kho",
    "barcode": "8936013680514",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 26,
    "unit": "gói",
    "rating": 4.7,
    "sales": 71,
    "image": "🥚",
    "daysUntilExpiry": 359,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0619",
    "name": "Vfood Trứng Gà Tiềm Vị Cay",
    "barcode": "8936013681122",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 33,
    "unit": "gói",
    "rating": 4.8,
    "sales": 84,
    "image": "🥚",
    "daysUntilExpiry": 96,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0620",
    "name": "Vfood Trứng Gà Ta Tiềm",
    "barcode": "8936013680538",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 40,
    "unit": "gói",
    "rating": 4.9,
    "sales": 97,
    "image": "🥚",
    "daysUntilExpiry": 103,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0621",
    "name": "Vfood Trứng Gà Tiềm",
    "barcode": "8936013680507",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 47,
    "unit": "gói",
    "rating": 4.5,
    "sales": 110,
    "image": "🥚",
    "daysUntilExpiry": 110,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0622",
    "name": "Vfood Trứng Cút Phá Lấu",
    "barcode": "8936013680521",
    "category": "thit_ca",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 54,
    "unit": "gói",
    "rating": 4.6,
    "sales": 123,
    "image": "🥚",
    "daysUntilExpiry": 117,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0623",
    "name": "Wonderfarm Nước Cốt Dừa 160Ml",
    "barcode": "8935001200468",
    "category": "gia_vi",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 61,
    "unit": "lon",
    "rating": 4.7,
    "sales": 136,
    "image": "🧂",
    "daysUntilExpiry": 124,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0624",
    "name": "Thạch Dừa Hương Đào 190G",
    "barcode": "8935117702177",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 68,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 149,
    "image": "🍪",
    "daysUntilExpiry": 131,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0625",
    "name": "Thạch Dừa Hương Dưa Lưới 190G",
    "barcode": "8935117702252",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 75,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 162,
    "image": "🍪",
    "daysUntilExpiry": 138,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0626",
    "name": "Thạch Dừa 190G",
    "barcode": "8935117702115",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 82,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 175,
    "image": "🍪",
    "daysUntilExpiry": 145,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0627",
    "name": "Thạch Dừa 400G",
    "barcode": "8935117702030",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 89,
    "unit": "gói",
    "rating": 4.6,
    "sales": 188,
    "image": "🍪",
    "daysUntilExpiry": 152,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0628",
    "name": "Bánh Flan Caramel Truyền Thống 100G *2 Hũ",
    "barcode": "8935117700098",
    "category": "web_doc_quyen",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 96,
    "unit": "lốc",
    "rating": 4.7,
    "sales": 201,
    "image": "🎁",
    "daysUntilExpiry": 159,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0629",
    "name": "Bánh Flan Caramel Vị Cafe Sữa Dừa 82G",
    "barcode": "8935117700135",
    "category": "sua_bo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 23,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 214,
    "image": "🍪",
    "daysUntilExpiry": 166,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0630",
    "name": "Bánh Flan Caramel Cao Cấp 80G",
    "barcode": "8935117700128",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 30,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 227,
    "image": "🍪",
    "daysUntilExpiry": 173,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0631",
    "name": "Lollipop Ice Kẹo Mút Vị Trái Cây Hỗn Hợp 11G",
    "barcode": "8801062880096",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 37,
    "unit": "cây",
    "rating": 4.5,
    "sales": 240,
    "image": "🍬",
    "daysUntilExpiry": 180,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0632",
    "name": "Haribo Kẹo Dẻo Vị Nho 80G",
    "barcode": "8691216098091",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 44,
    "unit": "gói",
    "rating": 4.6,
    "sales": 253,
    "image": "🍬",
    "daysUntilExpiry": 187,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0633",
    "name": "Haribo Kẹo Dẻo Vị Cola Chua 80G",
    "barcode": "8691216090491",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 51,
    "unit": "gói",
    "rating": 4.7,
    "sales": 266,
    "image": "🍬",
    "daysUntilExpiry": 194,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0634",
    "name": "Haribo Kẹo Dẻo Tổng Hợp Starmix 80G",
    "barcode": "8691216090477",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 58,
    "unit": "gói",
    "rating": 4.8,
    "sales": 279,
    "image": "🍬",
    "daysUntilExpiry": 201,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0635",
    "name": "Haribo Kẹo Dẻo Vị Cola 80G",
    "barcode": "8691216090446",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 65,
    "unit": "gói",
    "rating": 4.9,
    "sales": 292,
    "image": "🍬",
    "daysUntilExpiry": 208,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0636",
    "name": "Haribo Kẹo Dẻo Mềm Squishy 80G",
    "barcode": "8691216098947",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 72,
    "unit": "gói",
    "rating": 4.5,
    "sales": 305,
    "image": "🍬",
    "daysUntilExpiry": 215,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0637",
    "name": "Haribo Kẹo Dẻo Hình Con Trùng 80G",
    "barcode": "8691216090453",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 318,
    "image": "🍬",
    "daysUntilExpiry": 222,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0638",
    "name": "Haribo Kẹo Dẻo Hình Chú Gấu 80G",
    "barcode": "8691216090439",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 86,
    "unit": "gói",
    "rating": 4.7,
    "sales": 331,
    "image": "🍬",
    "daysUntilExpiry": 229,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0639",
    "name": "Anytime Kẹo Thảo Mộc Vị Bạc Hà Biển 74G",
    "barcode": "8801062332113",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 93,
    "unit": "gói",
    "rating": 4.8,
    "sales": 344,
    "image": "🍬",
    "daysUntilExpiry": 236,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0640",
    "name": "Anytime Kẹo Thảo Mộc Vị Mận Đào 74G",
    "barcode": "8801062335619",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 20,
    "unit": "gói",
    "rating": 4.9,
    "sales": 357,
    "image": "🍬",
    "daysUntilExpiry": 243,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0641",
    "name": "Anytime Kẹo Thảo Mộc Vị Chanh Bạc Hà 74G",
    "barcode": "8801062332250",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 27,
    "unit": "gói",
    "rating": 4.5,
    "sales": 370,
    "image": "🍬",
    "daysUntilExpiry": 250,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0642",
    "name": "Anytime Kẹo Thảo Mộc Vị Bạc Hà Mint 74G",
    "barcode": "8801062239078",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 34,
    "unit": "gói",
    "rating": 4.6,
    "sales": 383,
    "image": "🍬",
    "daysUntilExpiry": 257,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0643",
    "name": "Gingerbon Kẹo Gừng Dẻo 125G",
    "barcode": "8991002202719",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 41,
    "unit": "gói",
    "rating": 4.7,
    "sales": 396,
    "image": "🍬",
    "daysUntilExpiry": 264,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0644",
    "name": "Gingerbon Kẹo Gừng Dẻo Chanh Mật Ong 125G",
    "barcode": "8991002301436",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 48,
    "unit": "gói",
    "rating": 4.8,
    "sales": 409,
    "image": "🍬",
    "daysUntilExpiry": 271,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0645",
    "name": "Pringles Snack Khoai Tây Vị Tự Nhiên Original 102G",
    "barcode": "8886467100017",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 55,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 422,
    "image": "🍿",
    "daysUntilExpiry": 278,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0646",
    "name": "Pringles Snack Khoai Tây Vị Kem Chua Hành Tây 102G",
    "barcode": "8886467100024",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 62,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 435,
    "image": "🍿",
    "daysUntilExpiry": 285,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0647",
    "name": "Nutella Sản Phẩm Dạng Phết Chứa Hạt Phỉ Và Cacao 200G",
    "barcode": "80051671",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 69,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 448,
    "image": "🍪",
    "daysUntilExpiry": 292,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0648",
    "name": "Kinder Joy Socola Bé Trai T3 60G",
    "barcode": "80974482",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 76,
    "unit": "trái",
    "rating": 4.7,
    "sales": 61,
    "image": "🍫",
    "daysUntilExpiry": 299,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0649",
    "name": "Kinder Joy Socola Bé Trai T3 60G",
    "barcode": "8000500075708",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 83,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 74,
    "image": "🍫",
    "daysUntilExpiry": 306,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0650",
    "name": "Kinder Joy Socola Bé Gái T3 60G",
    "barcode": "80768258",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 90,
    "unit": "trái",
    "rating": 4.9,
    "sales": 87,
    "image": "🍫",
    "daysUntilExpiry": 313,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0651",
    "name": "Kinder Joy Socola Bé Gái T3 60G",
    "barcode": "8000500126325",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 97,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 100,
    "image": "🍫",
    "daysUntilExpiry": 320,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0652",
    "name": "Ferrero Rocher Socola Nhân Hạt Dẻ 37.5G",
    "barcode": "8000500010709",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 24,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 113,
    "image": "🍫",
    "daysUntilExpiry": 327,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0653",
    "name": "Kinder Bueno Bánh Socola 43G",
    "barcode": "8000500066027",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 31,
    "unit": "gói",
    "rating": 4.7,
    "sales": 126,
    "image": "🍫",
    "daysUntilExpiry": 334,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0654",
    "name": "Pocky Bánh Que Chocolate Nhân Đôi Kem 39G",
    "barcode": "8851019310244",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 38,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 139,
    "image": "🍫",
    "daysUntilExpiry": 341,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0655",
    "name": "Pocky Bánh Que Kem Trà Xanh Vị Sữa 35G",
    "barcode": "8851019500164",
    "category": "sua_bo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 45,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 152,
    "image": "🍪",
    "daysUntilExpiry": 348,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0656",
    "name": "Pocky Bánh Que Kem Cookies & Cream 40G",
    "barcode": "8851019500195",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 52,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 165,
    "image": "🍪",
    "daysUntilExpiry": 355,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0657",
    "name": "Pocky Bánh Que Kem Chocolate 40G",
    "barcode": "8851019310190",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 59,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 178,
    "image": "🍫",
    "daysUntilExpiry": 92,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0658",
    "name": "Kewpie Mayonnaise Hương Vị Nhật",
    "barcode": "8936066340021",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 66,
    "unit": "chai",
    "rating": 4.7,
    "sales": 191,
    "image": "🧂",
    "daysUntilExpiry": 99,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0659",
    "name": "Kewpie Xốt Mayonnaise Dịu Ngọt",
    "barcode": "8936066340076",
    "category": "gia_vi",
    "costPrice": 19500,
    "price": 25000,
    "originalPrice": 27500,
    "stock": 73,
    "unit": "chai",
    "rating": 4.8,
    "sales": 204,
    "image": "🍶",
    "daysUntilExpiry": 106,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0660",
    "name": "Dars Socola sữa 42G",
    "barcode": "4902888183430",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 80,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 217,
    "image": "🍫",
    "daysUntilExpiry": 113,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0661",
    "name": "Dars Socola Trà Xanh 42G",
    "barcode": "4902888205415",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 87,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 230,
    "image": "🍫",
    "daysUntilExpiry": 120,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0662",
    "name": "Dars Socola trắng 42G",
    "barcode": "4902888183454",
    "category": "banh_keo",
    "costPrice": 29500,
    "price": 38000,
    "originalPrice": 42000,
    "stock": 94,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 243,
    "image": "🍫",
    "daysUntilExpiry": 127,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0663",
    "name": "Gokochi Snack Khoai Tây Muối Tiêu Đen 65G",
    "barcode": "8936135440171",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 21,
    "unit": "gói",
    "rating": 4.7,
    "sales": 256,
    "image": "🧂",
    "daysUntilExpiry": 134,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0664",
    "name": "Gokochi Snack Khoai Tây Vị Rong Biển 65G",
    "barcode": "8936135440263",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 28,
    "unit": "gói",
    "rating": 4.8,
    "sales": 269,
    "image": "🍿",
    "daysUntilExpiry": 141,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0665",
    "name": "Gokochi Snack Khoai Tây Vị Muối Tự Nhiên 115G",
    "barcode": "8936135440195",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 35,
    "unit": "gói",
    "rating": 4.9,
    "sales": 282,
    "image": "🧂",
    "daysUntilExpiry": 148,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0666",
    "name": "Gokochi Snack Khoai Tây Vị Muối Tự Nhiên 65G",
    "barcode": "8936135440164",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 42,
    "unit": "gói",
    "rating": 4.5,
    "sales": 295,
    "image": "🧂",
    "daysUntilExpiry": 155,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0667",
    "name": "Karamucho Snack Khoai Tây Rong Biển Cay 44G",
    "barcode": "8936135440072",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 49,
    "unit": "gói",
    "rating": 4.6,
    "sales": 308,
    "image": "🍿",
    "daysUntilExpiry": 162,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0668",
    "name": "Karamucho Snack Khoai Tây Sốt Cay Ngọt Hàn Quốc 117G",
    "barcode": "8936135440324",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 56,
    "unit": "gói",
    "rating": 4.7,
    "sales": 321,
    "image": "🍿",
    "daysUntilExpiry": 169,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0669",
    "name": "Karamucho Snack Khoai Tây Sốt Cay Ngọt Hàn Quốc 80G",
    "barcode": "8936135440300",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 63,
    "unit": "gói",
    "rating": 4.8,
    "sales": 334,
    "image": "🍿",
    "daysUntilExpiry": 176,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0670",
    "name": "Karamucho Snack Khoai Tây Sốt Cay Ngọt Hàn Quốc 44G",
    "barcode": "8936135440294",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 70,
    "unit": "gói",
    "rating": 4.9,
    "sales": 347,
    "image": "🍿",
    "daysUntilExpiry": 183,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0671",
    "name": "Karamucho Snack Khoai Tây Vị Cay Đặc Biệt 120G",
    "barcode": "8936135440249",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 77,
    "unit": "gói",
    "rating": 4.5,
    "sales": 360,
    "image": "🍿",
    "daysUntilExpiry": 190,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0672",
    "name": "Karamucho Snack Khoai Tây Vị Cay Đặc Biệt 82G",
    "barcode": "8936135440034",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 84,
    "unit": "gói",
    "rating": 4.6,
    "sales": 373,
    "image": "🍿",
    "daysUntilExpiry": 197,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0673",
    "name": "Karamucho Snack Khoai Tây Vị Cay Đặc Biệt 44G",
    "barcode": "8936135440027",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 91,
    "unit": "gói",
    "rating": 4.7,
    "sales": 386,
    "image": "🍿",
    "daysUntilExpiry": 204,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0674",
    "name": "Karamucho Snack Khoai Tây Lát Dày Cay Đặc Biệt 80G",
    "barcode": "8936135441031",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 98,
    "unit": "gói",
    "rating": 4.8,
    "sales": 399,
    "image": "🍿",
    "daysUntilExpiry": 211,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0675",
    "name": "Karamucho Snack Khoai Tây Lát Dày Cay Đặc Biệt 44G",
    "barcode": "8936135441024",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 25,
    "unit": "gói",
    "rating": 4.9,
    "sales": 412,
    "image": "🍿",
    "daysUntilExpiry": 218,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0676",
    "name": "Karamucho Snack Bắp Vị Phô Mai Cay 57G",
    "barcode": "8936135445183",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 32,
    "unit": "gói",
    "rating": 4.5,
    "sales": 425,
    "image": "🍿",
    "daysUntilExpiry": 225,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0677",
    "name": "Karamucho Snack Bắp Vị Cay Đặc Biệt 57G",
    "barcode": "8936135445015",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 39,
    "unit": "gói",
    "rating": 4.6,
    "sales": 438,
    "image": "🍿",
    "daysUntilExpiry": 232,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0678",
    "name": "Karamucho Snack Khoai Tây Lát Dày Sốt Cay Hoàng Gia 80G",
    "barcode": "8936135441147",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 46,
    "unit": "gói",
    "rating": 4.7,
    "sales": 51,
    "image": "🍿",
    "daysUntilExpiry": 239,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0679",
    "name": "Hi-Chew Kẹo Mềm Vị Đào 57G",
    "barcode": "4902888210617",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 53,
    "unit": "thanh",
    "rating": 4.8,
    "sales": 64,
    "image": "🍬",
    "daysUntilExpiry": 246,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0680",
    "name": "Hi-Chew Kẹo Mềm Vị Táo Xanh 57G",
    "barcode": "4902888210211",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 60,
    "unit": "thanh",
    "rating": 4.9,
    "sales": 77,
    "image": "🍬",
    "daysUntilExpiry": 253,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0681",
    "name": "Hi-Chew Kẹo Mềm Vị Dâu 57G",
    "barcode": "4902888210372",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 67,
    "unit": "thanh",
    "rating": 4.5,
    "sales": 90,
    "image": "🍬",
    "daysUntilExpiry": 260,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0682",
    "name": "Hi-Chew Kẹo Mềm Vị Xoài 57G",
    "barcode": "4902888210587",
    "category": "banh_keo",
    "costPrice": 6000,
    "price": 8000,
    "originalPrice": 9000,
    "stock": 74,
    "unit": "thanh",
    "rating": 4.6,
    "sales": 103,
    "image": "🍬",
    "daysUntilExpiry": 267,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0683",
    "name": "Fisherman'S Friend Kẹo Ngậm Bạc Hà Spearmint 25G",
    "barcode": "96118528",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 116,
    "image": "🍬",
    "daysUntilExpiry": 274,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0684",
    "name": "Fisherman'S Friend Kẹo Ngậm Vị Quýt Không Đường 25G",
    "barcode": "96118504",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 88,
    "unit": "gói",
    "rating": 4.8,
    "sales": 129,
    "image": "🍚",
    "daysUntilExpiry": 281,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0685",
    "name": "Fisherman'S Friend Kẹo Ngậm Vị Cherry Không Đường 25G",
    "barcode": "96118511",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 95,
    "unit": "gói",
    "rating": 4.9,
    "sales": 142,
    "image": "🍚",
    "daysUntilExpiry": 288,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0686",
    "name": "Fisherman'S Friend Kẹo Ngậm Bạc Hà Không Đường 25G",
    "barcode": "50854011",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 155,
    "image": "🍚",
    "daysUntilExpiry": 295,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0687",
    "name": "Fisherman'S Friend Kẹo Ngậm Bạc Hà Khuynh Diệp 25G",
    "barcode": "50357680",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 168,
    "image": "🍬",
    "daysUntilExpiry": 302,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0688",
    "name": "Ovaltine Kẹo Xốp Nhân Socola 25G",
    "barcode": "6974936460327",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 36,
    "unit": "gói",
    "rating": 4.7,
    "sales": 181,
    "image": "🍫",
    "daysUntilExpiry": 309,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0689",
    "name": "Striking Kẹo Nổ Vị Việt Quất 15G",
    "barcode": "4895138305143",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 194,
    "image": "🍬",
    "daysUntilExpiry": 316,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0690",
    "name": "Striking Kẹo Nổ Vị Dâu 15G",
    "barcode": "4895138305082",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 50,
    "unit": "gói",
    "rating": 4.9,
    "sales": 207,
    "image": "🍬",
    "daysUntilExpiry": 323,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0691",
    "name": "Striking Kẹo Nổ Vị Dưa Hấu 15G",
    "barcode": "4895138305129",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 220,
    "image": "🍬",
    "daysUntilExpiry": 330,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0692",
    "name": "Striking Kẹo Nổ Vị Dứa 15G",
    "barcode": "4895138310765",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 64,
    "unit": "gói",
    "rating": 4.6,
    "sales": 233,
    "image": "🍬",
    "daysUntilExpiry": 337,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0693",
    "name": "Striking Kẹo Nổ Vị Đào 15G",
    "barcode": "4895138305204",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 246,
    "image": "🍬",
    "daysUntilExpiry": 344,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0694",
    "name": "Striking Kẹo Nổ Vị Cola 15G",
    "barcode": "4895138305105",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 78,
    "unit": "gói",
    "rating": 4.8,
    "sales": 259,
    "image": "🍬",
    "daysUntilExpiry": 351,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0695",
    "name": "Striking Kẹo Nổ Vị Táo Xanh 15G",
    "barcode": "4895138305068",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 272,
    "image": "🍬",
    "daysUntilExpiry": 358,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0696",
    "name": "Striking Kẹo Nổ Siêu Cấp Vitamin C 15G",
    "barcode": "4895138310376",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 92,
    "unit": "gói",
    "rating": 4.5,
    "sales": 285,
    "image": "🍬",
    "daysUntilExpiry": 95,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0697",
    "name": "Poca Đậu Phộng Da Cá Vị Mực Cay 68G",
    "barcode": "8936079123291",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 99,
    "unit": "gói",
    "rating": 4.6,
    "sales": 298,
    "image": "🥜",
    "daysUntilExpiry": 102,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0698",
    "name": "Poca Đậu Phộng Da Cá Vị Phô Mai 68G",
    "barcode": "8936079122331",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 26,
    "unit": "gói",
    "rating": 4.7,
    "sales": 311,
    "image": "🥜",
    "daysUntilExpiry": 109,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0699",
    "name": "Poca Đậu Phộng Rắc Rắc Vị Nước Cốt Dừa 70G",
    "barcode": "8936079125011",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 33,
    "unit": "gói",
    "rating": 4.8,
    "sales": 324,
    "image": "🥜",
    "daysUntilExpiry": 116,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0700",
    "name": "Lay'S Wavy Snack Khoai Tây Vị Phô Mai Cheddar 90G",
    "barcode": "8936079121167",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 40,
    "unit": "gói",
    "rating": 4.9,
    "sales": 337,
    "image": "🍿",
    "daysUntilExpiry": 123,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0701",
    "name": "Lay'S Snack Khoai Tây Vị Tự Nhiên Classic 90G",
    "barcode": "8936079120139",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 47,
    "unit": "gói",
    "rating": 4.5,
    "sales": 350,
    "image": "🍿",
    "daysUntilExpiry": 130,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0702",
    "name": "Lay'S Snack Khoai Tây Tôm Càng Đút Lò Phô Mai Cháy 90G",
    "barcode": "8936079124236",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 54,
    "unit": "gói",
    "rating": 4.6,
    "sales": 363,
    "image": "🍿",
    "daysUntilExpiry": 137,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0703",
    "name": "Lay'S Snack Khoai Tây Vị Tảo Biển Nori 90G",
    "barcode": "8936079121020",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 61,
    "unit": "gói",
    "rating": 4.7,
    "sales": 376,
    "image": "🍿",
    "daysUntilExpiry": 144,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0704",
    "name": "Lay'S Wavy Snack Khoai Tây Thăn Bò Nướng Texas 90G",
    "barcode": "8936079121778",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 68,
    "unit": "gói",
    "rating": 4.8,
    "sales": 389,
    "image": "🍿",
    "daysUntilExpiry": 151,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0705",
    "name": "Lay'S Snack Khoai Tây Vị Sườn Nướng BBQ 90G",
    "barcode": "8936079121013",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 75,
    "unit": "gói",
    "rating": 4.9,
    "sales": 402,
    "image": "🍿",
    "daysUntilExpiry": 158,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0706",
    "name": "Poca Snack Khoai Tây Vị Bò Lục Lắc 60G",
    "barcode": "8936079122249",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 82,
    "unit": "gói",
    "rating": 4.5,
    "sales": 415,
    "image": "🍿",
    "daysUntilExpiry": 165,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0707",
    "name": "Poca Snack Bắp Ngọt Xóc Bơ 60G",
    "barcode": "8936079123352",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 89,
    "unit": "gói",
    "rating": 4.6,
    "sales": 428,
    "image": "🍿",
    "daysUntilExpiry": 172,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0708",
    "name": "Poca Snack Khoai Tây Mực Lăn Muối Ớt 60G",
    "barcode": "8936079122256",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 96,
    "unit": "gói",
    "rating": 4.7,
    "sales": 441,
    "image": "🧂",
    "daysUntilExpiry": 179,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0709",
    "name": "Poca Snack Khoai Tây Tôm Hùm Nướng 60G",
    "barcode": "8936079122294",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 23,
    "unit": "gói",
    "rating": 4.8,
    "sales": 54,
    "image": "🍿",
    "daysUntilExpiry": 186,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0710",
    "name": "Samyang Mì Khô Gà Phô Mai Quattro 145G",
    "barcode": "8801073115088",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 30,
    "unit": "gói",
    "rating": 4.9,
    "sales": 67,
    "image": "🍜",
    "daysUntilExpiry": 193,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0711",
    "name": "Samyang Mì Khô Gà Cay Carbonara 130G",
    "barcode": "8801073113893",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 37,
    "unit": "gói",
    "rating": 4.5,
    "sales": 80,
    "image": "🍜",
    "daysUntilExpiry": 200,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0712",
    "name": "Samyang Mì Khô Gà Cay Vị Phô Mai 140G",
    "barcode": "8801073113268",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 44,
    "unit": "gói",
    "rating": 4.6,
    "sales": 93,
    "image": "🍜",
    "daysUntilExpiry": 207,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0713",
    "name": "Samyang Mì Tô Khô Gà Cay Hoa Hồng 105G",
    "barcode": "8801073215900",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 51,
    "unit": "Tô",
    "rating": 4.7,
    "sales": 106,
    "image": "🍜",
    "daysUntilExpiry": 214,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0714",
    "name": "Samyang Mì Ly Khô Gà Cay Vị Phô Mai 70G",
    "barcode": "8801073211254",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 58,
    "unit": "ly",
    "rating": 4.8,
    "sales": 119,
    "image": "🍜",
    "daysUntilExpiry": 221,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0715",
    "name": "Samyang Mì Ly Khô Gà Cay Carbonara 80G",
    "barcode": "8801073211667",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 65,
    "unit": "ly",
    "rating": 4.9,
    "sales": 132,
    "image": "🍜",
    "daysUntilExpiry": 228,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0716",
    "name": "Samyang Mì Ly Khô Gà Cay 70G",
    "barcode": "8801073210776",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 72,
    "unit": "ly",
    "rating": 4.5,
    "sales": 145,
    "image": "🍜",
    "daysUntilExpiry": 235,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0717",
    "name": "Samyang Mì Khô Gà Cay 140G",
    "barcode": "8801073110502",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 158,
    "image": "🍜",
    "daysUntilExpiry": 242,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0718",
    "name": "Cozy Trà Hương Đào",
    "barcode": "8936010530041",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 86,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 171,
    "image": "🍵",
    "daysUntilExpiry": 249,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0719",
    "name": "Bio Concept Trà Kombucha Vị Chanh Gừng",
    "barcode": "8936010533011",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 93,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 184,
    "image": "🍵",
    "daysUntilExpiry": 256,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0720",
    "name": "Cozy Trà Hương Nhài",
    "barcode": "8936010530096",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 20,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 197,
    "image": "🍵",
    "daysUntilExpiry": 263,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0721",
    "name": "Cozy Ice Tea Trà Đào",
    "barcode": "8936010530713",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 27,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 210,
    "image": "🍵",
    "daysUntilExpiry": 270,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0722",
    "name": "Cozy Ice Tea Trà Chanh",
    "barcode": "8936010530881",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 34,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 223,
    "image": "🍵",
    "daysUntilExpiry": 277,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0723",
    "name": "Cozy Ice Tea Trà Vải",
    "barcode": "8936010531307",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 41,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 236,
    "image": "🍵",
    "daysUntilExpiry": 284,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0724",
    "name": "Cozy Trà Gừng",
    "barcode": "8936010530775",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 48,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 249,
    "image": "🍵",
    "daysUntilExpiry": 291,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0725",
    "name": "Cozy Hồng trà",
    "barcode": "8936010533455",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 55,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 262,
    "image": "🥤",
    "daysUntilExpiry": 298,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0726",
    "name": "Cozy Ice Tea Trà Ôi Hồng",
    "barcode": "8936010531888",
    "category": "nuoc_ngot",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 62,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 275,
    "image": "🍵",
    "daysUntilExpiry": 305,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0727",
    "name": "Xylitol Kẹo Sing Gum Vị Bạc Hà 130.5G",
    "barcode": "8934677013419",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 69,
    "unit": "hủ",
    "rating": 4.6,
    "sales": 288,
    "image": "🍬",
    "daysUntilExpiry": 312,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0728",
    "name": "Sedaap Mì Vị Phô Mai Hàn Quốc 86G",
    "barcode": "8998866631174",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 76,
    "unit": "gói",
    "rating": 4.7,
    "sales": 301,
    "image": "🍜",
    "daysUntilExpiry": 319,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0729",
    "name": "Sedaap Mì Vị Phô Mai Hàn Quốc 86G",
    "barcode": "8998866631181",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 83,
    "unit": "túi",
    "rating": 4.8,
    "sales": 314,
    "image": "🍜",
    "daysUntilExpiry": 326,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0730",
    "name": "Sedaap Mì Vị Phô Mai Hàn Quốc 86G",
    "barcode": "18998866631188",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 90,
    "unit": "thùng",
    "rating": 4.9,
    "sales": 327,
    "image": "🎁",
    "daysUntilExpiry": 333,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0731",
    "name": "Sedaap Mì Vị Mì Xào 90G",
    "barcode": "8998866631136",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 97,
    "unit": "gói",
    "rating": 4.5,
    "sales": 340,
    "image": "🍜",
    "daysUntilExpiry": 340,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0732",
    "name": "Sedaap Mì Vị Mì Xào 90G",
    "barcode": "8998866631143",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 24,
    "unit": "túi",
    "rating": 4.6,
    "sales": 353,
    "image": "🍜",
    "daysUntilExpiry": 347,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0733",
    "name": "Sedaap Mì Vị Gà Cay Hàn Quốc 87G",
    "barcode": "8998866631150",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 31,
    "unit": "gói",
    "rating": 4.7,
    "sales": 366,
    "image": "🍜",
    "daysUntilExpiry": 354,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0734",
    "name": "Sedaap Mì Vị Gà Cay Hàn Quốc 87G",
    "barcode": "8998866631167",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 38,
    "unit": "túi",
    "rating": 4.8,
    "sales": 379,
    "image": "🍜",
    "daysUntilExpiry": 91,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0735",
    "name": "Sedaap Mì Vị Gà Cay Hàn Quốc 87G",
    "barcode": "18998866631164",
    "category": "web_doc_quyen",
    "costPrice": 93500,
    "price": 120000,
    "originalPrice": 132000,
    "stock": 45,
    "unit": "thùng",
    "rating": 4.9,
    "sales": 392,
    "image": "🎁",
    "daysUntilExpiry": 98,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0736",
    "name": "Bánh Dorayaki Nhân Socola 150G",
    "barcode": "8934952007355",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 52,
    "unit": "gói",
    "rating": 4.5,
    "sales": 405,
    "image": "🍫",
    "daysUntilExpiry": 105,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0737",
    "name": "Bánh Dorayaki Nhân Socola 150G",
    "barcode": "8934952007379",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 59,
    "unit": "túi",
    "rating": 4.6,
    "sales": 418,
    "image": "🍫",
    "daysUntilExpiry": 112,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0738",
    "name": "Bánh Dorayaki Nhân Đậu Đỏ 150Gr",
    "barcode": "8934952008116",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 66,
    "unit": "gói",
    "rating": 4.7,
    "sales": 431,
    "image": "🍪",
    "daysUntilExpiry": 119,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0739",
    "name": "Bánh Dorayaki Nhân Đậu Đỏ 150Gr",
    "barcode": "8934952008123",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 73,
    "unit": "túi",
    "rating": 4.8,
    "sales": 444,
    "image": "🍪",
    "daysUntilExpiry": 126,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0740",
    "name": "Bánh Dorayaki Nhân Chà Bông Xốt Trứng Muối 150G",
    "barcode": "8934952008727",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 80,
    "unit": "gói",
    "rating": 4.9,
    "sales": 57,
    "image": "🍶",
    "daysUntilExpiry": 133,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0741",
    "name": "Bánh Dorayaki Nhân Chà Bông Xốt Trứng Muối 150G",
    "barcode": "8934952008734",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 87,
    "unit": "túi",
    "rating": 4.5,
    "sales": 70,
    "image": "🍶",
    "daysUntilExpiry": 140,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0742",
    "name": "Bánh Dorayaki Nhân Chà Bông Xốt Phô Mai 150Gr",
    "barcode": "8934952008055",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 94,
    "unit": "gói",
    "rating": 4.6,
    "sales": 83,
    "image": "🍶",
    "daysUntilExpiry": 147,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0743",
    "name": "Bánh Dorayaki Nhân Chà Bông Xốt Phô Mai 150Gr",
    "barcode": "8934952008062",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 21,
    "unit": "túi",
    "rating": 4.7,
    "sales": 96,
    "image": "🍶",
    "daysUntilExpiry": 154,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0744",
    "name": "Bánh Dorayaki Nhân Chà Bông Xốt Bơ 150G",
    "barcode": "8934952007348",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 28,
    "unit": "gói",
    "rating": 4.8,
    "sales": 109,
    "image": "🍶",
    "daysUntilExpiry": 161,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0745",
    "name": "Bánh Dorayaki Nhân Chà Bông Xốt Bơ 150G",
    "barcode": "8934952007362",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 35,
    "unit": "túi",
    "rating": 4.9,
    "sales": 122,
    "image": "🍶",
    "daysUntilExpiry": 168,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0746",
    "name": "Bánh Dorayaki Nhân Chà Bông Xốt BBQ 150G",
    "barcode": "8934952008079",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 42,
    "unit": "gói",
    "rating": 4.5,
    "sales": 135,
    "image": "🍶",
    "daysUntilExpiry": 175,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0747",
    "name": "Bánh Dorayaki Nhân Chà Bông Xốt BBQ 150G",
    "barcode": "8934952008086",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 49,
    "unit": "túi",
    "rating": 4.6,
    "sales": 148,
    "image": "🍶",
    "daysUntilExpiry": 182,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0748",
    "name": "Xylitol Kẹo Sing Gum Vị Việt Quất 11.6G",
    "barcode": "8934677000310",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 56,
    "unit": "vỹ",
    "rating": 4.7,
    "sales": 161,
    "image": "🍬",
    "daysUntilExpiry": 189,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0749",
    "name": "Xylitol Kẹo Sing Gum Vị Chanh Bạc Hà 11.6G",
    "barcode": "8934677000327",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 63,
    "unit": "vỹ",
    "rating": 4.8,
    "sales": 174,
    "image": "🍬",
    "daysUntilExpiry": 196,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0750",
    "name": "Xylitol Kẹo Sing Gum Vị Bạc Hà Siêu Mát 11.6G",
    "barcode": "8934677020110",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 70,
    "unit": "vỹ",
    "rating": 4.9,
    "sales": 187,
    "image": "🍬",
    "daysUntilExpiry": 203,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0751",
    "name": "Xylitol Kẹo Sing Gum Vị Dâu Bạc Hà 11.6G",
    "barcode": "8934677000440",
    "category": "banh_keo",
    "costPrice": 11500,
    "price": 15000,
    "originalPrice": 16500,
    "stock": 77,
    "unit": "vỹ",
    "rating": 4.5,
    "sales": 200,
    "image": "🍬",
    "daysUntilExpiry": 210,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0752",
    "name": "Knorr Gia Vị Hoàn Chỉnh Canh Chua 30G",
    "barcode": "8934707010982",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 84,
    "unit": "gói",
    "rating": 4.6,
    "sales": 213,
    "image": "🧂",
    "daysUntilExpiry": 217,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0753",
    "name": "Knorr Gia Vị Hoàn Chỉnh Thịt Kho 28G",
    "barcode": "8934707011002",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 91,
    "unit": "gói",
    "rating": 4.7,
    "sales": 226,
    "image": "🧂",
    "daysUntilExpiry": 224,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0754",
    "name": "Knorr Gia Vị Hoàn Chỉnh Cá Kho 28G",
    "barcode": "8934707010944",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 98,
    "unit": "gói",
    "rating": 4.8,
    "sales": 239,
    "image": "🧂",
    "daysUntilExpiry": 231,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0755",
    "name": "Knorr Hạt Nêm Từ Thịt 400G",
    "barcode": "8934707029137",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 25,
    "unit": "gói",
    "rating": 4.9,
    "sales": 252,
    "image": "🧂",
    "daysUntilExpiry": 238,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0756",
    "name": "Knorr Hạt Nêm Từ Thịt 170G",
    "barcode": "8934707029144",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 32,
    "unit": "gói",
    "rating": 4.5,
    "sales": 265,
    "image": "🧂",
    "daysUntilExpiry": 245,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0757",
    "name": "Knorr Hạt Nêm Nấm Hương Organic 170G",
    "barcode": "8934707012122",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 39,
    "unit": "gói",
    "rating": 4.6,
    "sales": 278,
    "image": "🧂",
    "daysUntilExpiry": 252,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0758",
    "name": "Kopiko Kẹo Cứng Vị Cappuccino 140G",
    "barcode": "8996001320136",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 46,
    "unit": "gói",
    "rating": 4.7,
    "sales": 291,
    "image": "🍬",
    "daysUntilExpiry": 259,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0759",
    "name": "Nabati Bánh Ống Roll'S Nhân Sô Cô La Richoco 6G",
    "barcode": "8993175560801",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 53,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 304,
    "image": "🍪",
    "daysUntilExpiry": 266,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0760",
    "name": "Nabati Bánh Kem Xốp Nhân Phô Mai Richeese 6G",
    "barcode": "8993175531894",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 60,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 317,
    "image": "🍪",
    "daysUntilExpiry": 273,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0761",
    "name": "Nabati Bánh Kem Xốp Nhân Sô Cô La Richoco 6G",
    "barcode": "8993175532907",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 67,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 330,
    "image": "🍪",
    "daysUntilExpiry": 280,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0762",
    "name": "Nabati Bánh Ống Roll'S Nhân Phô Mai Richeese 6G",
    "barcode": "8993175559256",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 74,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 343,
    "image": "🍪",
    "daysUntilExpiry": 287,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0763",
    "name": "Matilde Vicenzi Bánh Ngàn Lớp Cuộn Kem Hạt Phỉ 125G",
    "barcode": "8000350008123",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 356,
    "image": "🍪",
    "daysUntilExpiry": 294,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0764",
    "name": "Matilde Vicenzi Bánh Ngàn Lớp Minisnack Nhân Kem Bánh Ngọt 125G",
    "barcode": "8000350008116",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 88,
    "unit": "gói",
    "rating": 4.8,
    "sales": 369,
    "image": "🍪",
    "daysUntilExpiry": 301,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0765",
    "name": "Go Choco Rollz Bánh Cuộn Chocolate 250G",
    "barcode": "8996001350812",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 95,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 382,
    "image": "🍫",
    "daysUntilExpiry": 308,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0766",
    "name": "Chocolatos Bánh Cuộn Socola 336G",
    "barcode": "8992775005637",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 22,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 395,
    "image": "🍫",
    "daysUntilExpiry": 315,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0767",
    "name": "Chocolatos Bánh Cuộn Socola Đen 336G",
    "barcode": "8992775005651",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 29,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 408,
    "image": "🍫",
    "daysUntilExpiry": 322,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0768",
    "name": "Chocolatos Bánh Cuộn Kem Vani 336G",
    "barcode": "8992775005699",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 36,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 421,
    "image": "🍫",
    "daysUntilExpiry": 329,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0769",
    "name": "Coffee Joy Bánh Quy Vị Cà Phê 156G",
    "barcode": "8996001301715",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 434,
    "image": "🍪",
    "daysUntilExpiry": 336,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0770",
    "name": "Coffee Joy Bánh Quy Vị Cà Phê 156G",
    "barcode": "8996001301777",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 50,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 447,
    "image": "🍪",
    "daysUntilExpiry": 343,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0771",
    "name": "Cal Cheese Bánh Xốp Vị Phô Mai 186G",
    "barcode": "8996001353592",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 57,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 60,
    "image": "🍪",
    "daysUntilExpiry": 350,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0772",
    "name": "Chocolatos Bánh Cuộn Kem Phô Mai 336G",
    "barcode": "8992775005675",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 64,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 73,
    "image": "🍫",
    "daysUntilExpiry": 357,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0773",
    "name": "Matilde Vicenzi Bánh Ngàn Lớp Phủ Đường Glassate 125G",
    "barcode": "8000350008109",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 86,
    "image": "🍚",
    "daysUntilExpiry": 94,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0774",
    "name": "Phú Hương Miến Sườn Heo 55G",
    "barcode": "8934563301156",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 78,
    "unit": "gói",
    "rating": 4.8,
    "sales": 99,
    "image": "🍜",
    "daysUntilExpiry": 101,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0775",
    "name": "Oishi Bánh Phồng Mực Indonesia 68G",
    "barcode": "8934803024814",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 112,
    "image": "🍪",
    "daysUntilExpiry": 108,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0776",
    "name": "Toppo Bánh Que Nhân Sô Cô La Hương Cacao 40G",
    "barcode": "8852008510492",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 92,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 125,
    "image": "🍪",
    "daysUntilExpiry": 115,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0777",
    "name": "Oishi Snack Bắp Vị Ngọt 68G",
    "barcode": "8934803026078",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 99,
    "unit": "gói",
    "rating": 4.6,
    "sales": 138,
    "image": "🍿",
    "daysUntilExpiry": 122,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0778",
    "name": "Toppo Bánh Que Nhân Kem Dâu 40G",
    "barcode": "8852008511239",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 26,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 151,
    "image": "🍪",
    "daysUntilExpiry": 129,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0779",
    "name": "Oishi Snack Vị Hành 68G",
    "barcode": "8934803026788",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 33,
    "unit": "gói",
    "rating": 4.8,
    "sales": 164,
    "image": "🍿",
    "daysUntilExpiry": 136,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0780",
    "name": "Oishi Snack Bí Đỏ Vị Bò Nướng 68G",
    "barcode": "8934803012880",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 40,
    "unit": "gói",
    "rating": 4.9,
    "sales": 177,
    "image": "🍿",
    "daysUntilExpiry": 143,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0781",
    "name": "Oishi Snack Bắp Vị Phô Mai 68G",
    "barcode": "8934803042818",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 47,
    "unit": "gói",
    "rating": 4.5,
    "sales": 190,
    "image": "🍿",
    "daysUntilExpiry": 150,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0782",
    "name": "Oishi Snack Cua Xốt Chua Ngọt 68G",
    "barcode": "8934803042283",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 54,
    "unit": "gói",
    "rating": 4.6,
    "sales": 203,
    "image": "🍶",
    "daysUntilExpiry": 157,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0783",
    "name": "Oishi Snack Viên Vị Mực Cay 68G",
    "barcode": "8934803070064",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 61,
    "unit": "gói",
    "rating": 4.7,
    "sales": 216,
    "image": "🍿",
    "daysUntilExpiry": 164,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0784",
    "name": "Oishi Snack Que Nhân Phô Mai 7G",
    "barcode": "8934803046090",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 68,
    "unit": "gói",
    "rating": 4.8,
    "sales": 229,
    "image": "🍿",
    "daysUntilExpiry": 171,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0785",
    "name": "Oishi Snack Đậu Xanh Nước Dừa 65G",
    "barcode": "8934803025927",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 75,
    "unit": "gói",
    "rating": 4.9,
    "sales": 242,
    "image": "🍿",
    "daysUntilExpiry": 178,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0786",
    "name": "Oishi Snack Tôm Xốt Tương Mật Ong 65G",
    "barcode": "8934803071337",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 82,
    "unit": "gói",
    "rating": 4.5,
    "sales": 255,
    "image": "🍶",
    "daysUntilExpiry": 185,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0787",
    "name": "Oishi Đậu Phộng Rang Vị Mực Cay 80G",
    "barcode": "8934803044027",
    "category": "hang_tuoi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 89,
    "unit": "gói",
    "rating": 4.6,
    "sales": 268,
    "image": "🥜",
    "daysUntilExpiry": 192,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0788",
    "name": "Oishi Snack Tôm Vị Cay Nồng 65G",
    "barcode": "8934803071085",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 96,
    "unit": "gói",
    "rating": 4.7,
    "sales": 281,
    "image": "🍿",
    "daysUntilExpiry": 199,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0789",
    "name": "Oishi Đậu Phộng Da Cá Nước Cốt Dừa 80G",
    "barcode": "8934803023732",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 23,
    "unit": "gói",
    "rating": 4.8,
    "sales": 294,
    "image": "🍪",
    "daysUntilExpiry": 206,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0790",
    "name": "Oishi Snack Nhân Sô Cô La Hạt Phỉ 80G",
    "barcode": "8934803071108",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 30,
    "unit": "gói",
    "rating": 4.9,
    "sales": 307,
    "image": "🍿",
    "daysUntilExpiry": 213,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0791",
    "name": "Oishi Snack Nhân Cookie Kem Vani 80G",
    "barcode": "8934803054590",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 37,
    "unit": "gói",
    "rating": 4.5,
    "sales": 320,
    "image": "🍿",
    "daysUntilExpiry": 220,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0792",
    "name": "Oishi Snack Nhân Sữa Dừa 80G",
    "barcode": "8934803044171",
    "category": "sua_bo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 44,
    "unit": "gói",
    "rating": 4.6,
    "sales": 333,
    "image": "🍿",
    "daysUntilExpiry": 227,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0793",
    "name": "Oishi Snack Nhân Sô Cô La 80G",
    "barcode": "8934803043891",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 51,
    "unit": "gói",
    "rating": 4.7,
    "sales": 346,
    "image": "🍿",
    "daysUntilExpiry": 234,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0794",
    "name": "Oishi Snack Nhân Khoai Môn 80G",
    "barcode": "8934803071160",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 58,
    "unit": "gói",
    "rating": 4.8,
    "sales": 359,
    "image": "🍿",
    "daysUntilExpiry": 241,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0795",
    "name": "Nabati Bánh Quế Long Stick Nhân Sô Cô La Richoco 105G",
    "barcode": "8993175551519",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 65,
    "unit": "gói",
    "rating": 4.9,
    "sales": 372,
    "image": "🍪",
    "daysUntilExpiry": 248,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0796",
    "name": "Nabati Bánh Quế Long Stick Nhân Phô Mai Richeese 105G",
    "barcode": "8993175556972",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 72,
    "unit": "gói",
    "rating": 4.5,
    "sales": 385,
    "image": "🍪",
    "daysUntilExpiry": 255,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0797",
    "name": "Cal Cheese Bánh Xốp Vị Phô Mai Túi 20G",
    "barcode": "8996001356661",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 398,
    "image": "🍪",
    "daysUntilExpiry": 262,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0798",
    "name": "Cal Cheese Bánh Xốp Vị Phô Mai Túi 20G",
    "barcode": "8996001357422",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 86,
    "unit": "túi",
    "rating": 4.7,
    "sales": 411,
    "image": "🍪",
    "daysUntilExpiry": 269,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0799",
    "name": "Nabati Bánh Kem Xốp Nhân Phô Mai Richeese 50G",
    "barcode": "8993175535878",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 93,
    "unit": "gói",
    "rating": 4.8,
    "sales": 424,
    "image": "🍪",
    "daysUntilExpiry": 276,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0800",
    "name": "Nabati Bánh Kem Xốp Nhân Sô Cô La Richoco 50G",
    "barcode": "8993175535885",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 20,
    "unit": "gói",
    "rating": 4.9,
    "sales": 437,
    "image": "🍪",
    "daysUntilExpiry": 283,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0801",
    "name": "Cal Cheese Bánh Xốp Vị Phô Mai 48G",
    "barcode": "8996001350584",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 27,
    "unit": "gói",
    "rating": 4.5,
    "sales": 50,
    "image": "🍪",
    "daysUntilExpiry": 290,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0802",
    "name": "Wafello Bánh Kem Xốp Vị Socola 48G",
    "barcode": "8996001350836",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 34,
    "unit": "gói",
    "rating": 4.6,
    "sales": 63,
    "image": "🍫",
    "daysUntilExpiry": 297,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0803",
    "name": "Enaak Snack Mì Vị Ớt Cấp Một 28G",
    "barcode": "8994834004728",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 41,
    "unit": "gói",
    "rating": 4.7,
    "sales": 76,
    "image": "🍜",
    "daysUntilExpiry": 304,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0804",
    "name": "Enaak Snack Mì Vị Gà 30G",
    "barcode": "8994834002595",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 48,
    "unit": "gói",
    "rating": 4.8,
    "sales": 89,
    "image": "🍜",
    "daysUntilExpiry": 311,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0805",
    "name": "Gery Bánh Quy Kem Phô Mai 90G",
    "barcode": "8992775343128",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 55,
    "unit": "gói",
    "rating": 4.9,
    "sales": 102,
    "image": "🍪",
    "daysUntilExpiry": 318,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0806",
    "name": "Roma Malkist Bánh Quy Phủ Đường 105G",
    "barcode": "8996001302026",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 62,
    "unit": "gói",
    "rating": 4.5,
    "sales": 115,
    "image": "🍚",
    "daysUntilExpiry": 325,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0807",
    "name": "Roma Malkist Bánh Quy Crackers 107G",
    "barcode": "8996001302033",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 69,
    "unit": "gói",
    "rating": 4.6,
    "sales": 128,
    "image": "🍪",
    "daysUntilExpiry": 332,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0808",
    "name": "Lotte Chocolat Bánh Socola Pie Vị Trà Xanh Matcha 169.8G",
    "barcode": "8935341301528",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 76,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 141,
    "image": "🍫",
    "daysUntilExpiry": 339,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0809",
    "name": "Xylitol Kẹo Sing Gum Vị Bạc Hà Mát Lạnh 130.5G",
    "barcode": "8934677020318",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 83,
    "unit": "hũ",
    "rating": 4.8,
    "sales": 154,
    "image": "🍬",
    "daysUntilExpiry": 346,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0810",
    "name": "Xylitol Kẹo Sing Gum Vị Chanh Bạc Hà 130.5G",
    "barcode": "8934677000358",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 90,
    "unit": "hũ",
    "rating": 4.9,
    "sales": 167,
    "image": "🍬",
    "daysUntilExpiry": 353,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0811",
    "name": "Xylitol Kẹo Sing Gum Vị Việt Quất 130.5G",
    "barcode": "8934677013112",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 97,
    "unit": "hũ",
    "rating": 4.5,
    "sales": 180,
    "image": "🍬",
    "daysUntilExpiry": 90,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0812",
    "name": "Xylitol Kẹo Sing Gum Vị Trái Cây Hỗn Hợp 130.5G",
    "barcode": "8934677038016",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 24,
    "unit": "hũ",
    "rating": 4.6,
    "sales": 193,
    "image": "🍬",
    "daysUntilExpiry": 97,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0813",
    "name": "Funmore Kẹo Dẻo Burger Khổng Lồ 50G",
    "barcode": "8859578604750",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 31,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 206,
    "image": "🍬",
    "daysUntilExpiry": 104,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0814",
    "name": "Playmore Kẹo Dẻo Chua Hình Khủng Long 64G",
    "barcode": "8859578600738",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 38,
    "unit": "gói",
    "rating": 4.8,
    "sales": 219,
    "image": "🍬",
    "daysUntilExpiry": 111,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0815",
    "name": "Playmore Kẹo Dẻo Hình Con Ếch 64G",
    "barcode": "8859578608345",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 45,
    "unit": "gói",
    "rating": 4.9,
    "sales": 232,
    "image": "🍬",
    "daysUntilExpiry": 118,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0816",
    "name": "Playmore Kẹo Dẻo Chua Hình Con Vịt 64G",
    "barcode": "8859578600165",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 52,
    "unit": "gói",
    "rating": 4.5,
    "sales": 245,
    "image": "🍬",
    "daysUntilExpiry": 125,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0817",
    "name": "Playmore Kẹo Dẻo Trái Cây Hỗn Hợp 64G",
    "barcode": "8859578600554",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 59,
    "unit": "gói",
    "rating": 4.6,
    "sales": 258,
    "image": "🍬",
    "daysUntilExpiry": 132,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0818",
    "name": "Playmore Kẹo Dẻo Hình Con Voi 64G",
    "barcode": "8859578608468",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 66,
    "unit": "gói",
    "rating": 4.7,
    "sales": 271,
    "image": "🍬",
    "daysUntilExpiry": 139,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0819",
    "name": "Playmore Kẹo Dẻo Quả Nho Bóc Vỏ 42G",
    "barcode": "8859578606297",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 73,
    "unit": "gói",
    "rating": 4.8,
    "sales": 284,
    "image": "🍬",
    "daysUntilExpiry": 146,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0820",
    "name": "Playmore Kẹo Ngậm Vị Táo Đỏ Không Đường 22G",
    "barcode": "8859578600318",
    "category": "nhu_yeu_pham",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 80,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 297,
    "image": "🍚",
    "daysUntilExpiry": 153,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0821",
    "name": "Playmore Kẹo Ngậm Vị Chanh Mật Ong Không Đường 22G",
    "barcode": "8859578600370",
    "category": "nhu_yeu_pham",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 87,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 310,
    "image": "🍚",
    "daysUntilExpiry": 160,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0822",
    "name": "Playmore Kẹo Ngậm Vị Nho 22G",
    "barcode": "8859578600820",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 94,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 323,
    "image": "🍬",
    "daysUntilExpiry": 167,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0823",
    "name": "Playmore Kẹo Ngậm Vị Bạc Hà Siêu Mát 22G",
    "barcode": "8859578600882",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 21,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 336,
    "image": "🍬",
    "daysUntilExpiry": 174,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0824",
    "name": "Playmore Kẹo Ngậm Vị Xí Muội 22G",
    "barcode": "8859578600288",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 28,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 349,
    "image": "🍬",
    "daysUntilExpiry": 181,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0825",
    "name": "Playmore Kẹo Ngậm Vị Đào Sakura 22G",
    "barcode": "8859578601421",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 35,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 362,
    "image": "🍬",
    "daysUntilExpiry": 188,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0826",
    "name": "Playmore Kẹo Ngậm Vị Dâu Tây Không Đường 22G",
    "barcode": "8859578602541",
    "category": "nhu_yeu_pham",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 42,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 375,
    "image": "🍚",
    "daysUntilExpiry": 195,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0827",
    "name": "Playmore Kẹo Ngậm Vị Dưa Hấu 22G",
    "barcode": "8859578600257",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 49,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 388,
    "image": "🍬",
    "daysUntilExpiry": 202,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0828",
    "name": "Xylitol Kẹo Sing Gum Vị Chanh Bạc Hà 55.1G",
    "barcode": "8934677000341",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 56,
    "unit": "hũ",
    "rating": 4.7,
    "sales": 401,
    "image": "🍬",
    "daysUntilExpiry": 209,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0829",
    "name": "Handy Hảo Hảo Mì Hộp Tôm Chua Cay 67G",
    "barcode": "8934563651138",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 63,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 414,
    "image": "🍜",
    "daysUntilExpiry": 216,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0830",
    "name": "Modern Mì Ly Hương Vị Gà Ớt Hiểm 63G",
    "barcode": "8934563660130",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 70,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 427,
    "image": "🍜",
    "daysUntilExpiry": 223,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0831",
    "name": "Siukay Mì Tô Tía Chớp Vị Hải Sản 96G",
    "barcode": "8934563544201",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 77,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 440,
    "image": "🍜",
    "daysUntilExpiry": 230,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0832",
    "name": "Handy Hảo Hảo Mì Tô Trộn Tôm Chua Cay 93G",
    "barcode": "8934563550196",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 84,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 53,
    "image": "🍜",
    "daysUntilExpiry": 237,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0833",
    "name": "Handy Hảo Hảo Mì Ly Tomyum 67G",
    "barcode": "8934563653132",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 91,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 66,
    "image": "🍜",
    "daysUntilExpiry": 244,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0834",
    "name": "Modern Mì Ly Lẩu Thái Tôm 67G",
    "barcode": "8934563619138",
    "category": "mi_goi",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 98,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 79,
    "image": "🍜",
    "daysUntilExpiry": 251,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0835",
    "name": "Fres Kẹo The Bạc Hà Lúa Mạch Barley 150G",
    "barcode": "8996001338063",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 25,
    "unit": "gói",
    "rating": 4.9,
    "sales": 92,
    "image": "🍬",
    "daysUntilExpiry": 258,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0836",
    "name": "Phú Hương Miến Thịt Bằm 55G",
    "barcode": "8934563303150",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 32,
    "unit": "gói",
    "rating": 4.5,
    "sales": 105,
    "image": "🍜",
    "daysUntilExpiry": 265,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0837",
    "name": "Đệ Nhất Phở Bò 68G",
    "barcode": "8934563215132",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 39,
    "unit": "gói",
    "rating": 4.6,
    "sales": 118,
    "image": "🍜",
    "daysUntilExpiry": 272,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0838",
    "name": "Fres Kẹo The Bạc Hà Táo Đào 150G",
    "barcode": "8996001346365",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 46,
    "unit": "gói",
    "rating": 4.7,
    "sales": 131,
    "image": "🍬",
    "daysUntilExpiry": 279,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0839",
    "name": "Nhịp Sống Hủ Tiếu Hương Vị Hủ Tiếu Nam Vang 71G",
    "barcode": "8934563455149",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 53,
    "unit": "gói",
    "rating": 4.8,
    "sales": 144,
    "image": "🍜",
    "daysUntilExpiry": 286,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0840",
    "name": "Tamarin Kẹo Me 135G",
    "barcode": "8996001338056",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 60,
    "unit": "gói",
    "rating": 4.9,
    "sales": 157,
    "image": "🍬",
    "daysUntilExpiry": 293,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0841",
    "name": "Phú Hương Miến Lẩu Thái Tôm 60G",
    "barcode": "8934563304157",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 67,
    "unit": "gói",
    "rating": 4.5,
    "sales": 170,
    "image": "🍜",
    "daysUntilExpiry": 300,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0842",
    "name": "Kopiko Kẹo Cứng Vị Cà Phê 140G",
    "barcode": "8996001320051",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 74,
    "unit": "gói",
    "rating": 4.6,
    "sales": 183,
    "image": "🍬",
    "daysUntilExpiry": 307,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0843",
    "name": "Hảo Hảo Mì Big 100 Tôm Chua Cay 100G",
    "barcode": "8934563122201",
    "category": "mi_goi",
    "costPrice": 3500,
    "price": 4500,
    "originalPrice": 5000,
    "stock": 81,
    "unit": "gói",
    "rating": 4.7,
    "sales": 196,
    "image": "🍜",
    "daysUntilExpiry": 314,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0844",
    "name": "3 Miền Mì Tôm Chua Cay (2X) 65G",
    "barcode": "8936048471248",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 88,
    "unit": "gói",
    "rating": 4.8,
    "sales": 209,
    "image": "🍜",
    "daysUntilExpiry": 321,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0845",
    "name": "3 Miền Mì Gold Bò Hầm Rau Thơm 75G",
    "barcode": "8936048470524",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 95,
    "unit": "gói",
    "rating": 4.9,
    "sales": 222,
    "image": "🍜",
    "daysUntilExpiry": 328,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0846",
    "name": "Phú Hương Miến Hương Vị Gà 53G",
    "barcode": "8934563358112",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 22,
    "unit": "gói",
    "rating": 4.5,
    "sales": 235,
    "image": "🍜",
    "daysUntilExpiry": 335,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0847",
    "name": "Thế Giới Mì Mì Lẩu Thái Tôm 81G",
    "barcode": "8934563102166",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 29,
    "unit": "gói",
    "rating": 4.6,
    "sales": 248,
    "image": "🍜",
    "daysUntilExpiry": 342,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0848",
    "name": "Hảo Hảo Mì Chay Rau Nấm 74G",
    "barcode": "8934563198152",
    "category": "mi_goi",
    "costPrice": 3500,
    "price": 4500,
    "originalPrice": 5000,
    "stock": 36,
    "unit": "gói",
    "rating": 4.7,
    "sales": 261,
    "image": "🍜",
    "daysUntilExpiry": 349,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0849",
    "name": "Đệ Nhất Phở Thịt Bằm 83G",
    "barcode": "8934563165161",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 43,
    "unit": "gói",
    "rating": 4.8,
    "sales": 274,
    "image": "🍜",
    "daysUntilExpiry": 356,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0850",
    "name": "Hảo Hảo Mì Tôm Chua Cay 75G",
    "barcode": "8934563138165",
    "category": "mi_goi",
    "costPrice": 3500,
    "price": 4500,
    "originalPrice": 5000,
    "stock": 50,
    "unit": "gói",
    "rating": 4.9,
    "sales": 287,
    "image": "🍜",
    "daysUntilExpiry": 93,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0851",
    "name": "Hảo Hảo Mì 100 Tôm Chua Cay 65G",
    "barcode": "8934563123130",
    "category": "mi_goi",
    "costPrice": 3500,
    "price": 4500,
    "originalPrice": 5000,
    "stock": 57,
    "unit": "gói",
    "rating": 4.5,
    "sales": 300,
    "image": "🍜",
    "daysUntilExpiry": 100,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0852",
    "name": "Xylitol Kẹo Sing Gum Vị Chanh Bạc Hà 26.1G",
    "barcode": "8934677013310",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 64,
    "unit": "hũ",
    "rating": 4.6,
    "sales": 313,
    "image": "🍬",
    "daysUntilExpiry": 107,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0853",
    "name": "Siukay Mì hương vị hải sản 128G",
    "barcode": "8934563193263",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 71,
    "unit": "gói",
    "rating": 4.7,
    "sales": 326,
    "image": "🍜",
    "daysUntilExpiry": 114,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0854",
    "name": "Playmore Kẹo Ngậm Vị Dưa Hấu 12G",
    "barcode": "8859578600400",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 78,
    "unit": "gói",
    "rating": 4.8,
    "sales": 339,
    "image": "🍬",
    "daysUntilExpiry": 121,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0855",
    "name": "Siukay Mì Hương Vị Gà Xốt Phô Mai 131G",
    "barcode": "8934563116262",
    "category": "mi_goi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 85,
    "unit": "gói",
    "rating": 4.9,
    "sales": 352,
    "image": "🍜",
    "daysUntilExpiry": 128,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0856",
    "name": "Xylitol Kẹo Sing Gum Vị Việt Quất 26.1G",
    "barcode": "8934677013211",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 92,
    "unit": "hũ",
    "rating": 4.5,
    "sales": 365,
    "image": "🍬",
    "daysUntilExpiry": 135,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0857",
    "name": "Xylitol Kẹo Sing Gum Vị Việt Quất 55.1G",
    "barcode": "8934677000334",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 99,
    "unit": "hũ",
    "rating": 4.6,
    "sales": 378,
    "image": "🍬",
    "daysUntilExpiry": 142,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0858",
    "name": "Xylitol Kẹo Sing Gum Vị Trái Cây Hỗn Hợp 55.1G",
    "barcode": "8934677038115",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 26,
    "unit": "hũ",
    "rating": 4.7,
    "sales": 391,
    "image": "🍬",
    "daysUntilExpiry": 149,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0859",
    "name": "Xylitol Kẹo Sing Gum Vị Dâu Bạc Hà 55.1G",
    "barcode": "8934677000457",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 33,
    "unit": "hũ",
    "rating": 4.8,
    "sales": 404,
    "image": "🍬",
    "daysUntilExpiry": 156,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0860",
    "name": "Lotte Chocolat Bánh Socola Pie 169.8G",
    "barcode": "8935341300422",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 40,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 417,
    "image": "🍫",
    "daysUntilExpiry": 163,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0861",
    "name": "Xylitol Kẹo Sing Gum Vị Bạc Hà 55.1G",
    "barcode": "8934677000372",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 47,
    "unit": "hũ",
    "rating": 4.5,
    "sales": 430,
    "image": "🍬",
    "daysUntilExpiry": 170,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0862",
    "name": "Lotte Chocolat Bánh Bouchee Vị Socola 162G",
    "barcode": "8935341300224",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 54,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 443,
    "image": "🍫",
    "daysUntilExpiry": 177,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0863",
    "name": "Xylitol Kẹo Sing Gum Vị Bạc Hà Siêu Mát 55.1G",
    "barcode": "8934677020219",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 61,
    "unit": "hũ",
    "rating": 4.7,
    "sales": 56,
    "image": "🍬",
    "daysUntilExpiry": 184,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0864",
    "name": "Lotte Chocolat Bánh Bouchee Vị Phô Mai 162G",
    "barcode": "8935341301122",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 68,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 69,
    "image": "🍫",
    "daysUntilExpiry": 191,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0865",
    "name": "Koala'S March Bánh Gấu Nhân Sô Cô La Trắng 37G",
    "barcode": "8852008304879",
    "category": "me_be",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 75,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 82,
    "image": "🍪",
    "daysUntilExpiry": 198,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0866",
    "name": "Koala'S March Bánh Gấu Nhân Sô Cô La 37G",
    "barcode": "8852008300116",
    "category": "me_be",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 82,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 95,
    "image": "🍪",
    "daysUntilExpiry": 205,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0867",
    "name": "Koala'S March Bánh Gấu Nhân Kem Dâu 37G",
    "barcode": "8852008300130",
    "category": "me_be",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 89,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 108,
    "image": "🍪",
    "daysUntilExpiry": 212,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0868",
    "name": "Koala'S March Bánh Gấu Vỏ Và Nhân Sô Cô La 37G",
    "barcode": "8852008304848",
    "category": "me_be",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 96,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 121,
    "image": "🍪",
    "daysUntilExpiry": 219,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0869",
    "name": "Pepero Bánh Que Hạnh Nhân 32G",
    "barcode": "8801062267712",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 23,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 134,
    "image": "🍪",
    "daysUntilExpiry": 226,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0870",
    "name": "Pepero Bánh Que Choco Cookie 32G",
    "barcode": "8801062641260",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 30,
    "unit": "hộp",
    "rating": 4.9,
    "sales": 147,
    "image": "🍫",
    "daysUntilExpiry": 233,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0871",
    "name": "Pepero Bánh Que Snowy Almond 32G",
    "barcode": "8801062880140",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 37,
    "unit": "hộp",
    "rating": 4.5,
    "sales": 160,
    "image": "🍪",
    "daysUntilExpiry": 240,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0872",
    "name": "Pepero Bánh Que White Cookie 32G",
    "barcode": "8801062636358",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 44,
    "unit": "hộp",
    "rating": 4.6,
    "sales": 173,
    "image": "🍪",
    "daysUntilExpiry": 247,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0873",
    "name": "Pepero Bánh Que Sô Cô La 47G",
    "barcode": "8801062267675",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 51,
    "unit": "hộp",
    "rating": 4.7,
    "sales": 186,
    "image": "🍪",
    "daysUntilExpiry": 254,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0874",
    "name": "Pepero Bánh Que Crunchy 39G",
    "barcode": "8801062881741",
    "category": "banh_keo",
    "costPrice": 22000,
    "price": 28000,
    "originalPrice": 31000,
    "stock": 58,
    "unit": "hộp",
    "rating": 4.8,
    "sales": 199,
    "image": "🍪",
    "daysUntilExpiry": 261,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0875",
    "name": "Oishi Snack Tôm Vị Cay Đặc Biệt 68G",
    "barcode": "8934803042276",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 65,
    "unit": "gói",
    "rating": 4.9,
    "sales": 212,
    "image": "🍿",
    "daysUntilExpiry": 268,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0876",
    "name": "Oishi Snack Viên Vị Takoyaki 68G",
    "barcode": "8934803070071",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 72,
    "unit": "gói",
    "rating": 4.5,
    "sales": 225,
    "image": "🍿",
    "daysUntilExpiry": 275,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0877",
    "name": "Oishi Snack Tôm Vị Mực Nướng Muối Ớt 68G",
    "barcode": "8934803070187",
    "category": "gia_vi",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 79,
    "unit": "gói",
    "rating": 4.6,
    "sales": 238,
    "image": "🧂",
    "daysUntilExpiry": 282,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0878",
    "name": "Oishi Snack Phô Mai Miếng 68G",
    "barcode": "8934803026122",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 86,
    "unit": "gói",
    "rating": 4.7,
    "sales": 251,
    "image": "🍿",
    "daysUntilExpiry": 289,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0879",
    "name": "Oishi Snack Khoai Tây Vị Dưa Leo 65G",
    "barcode": "8934803053524",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 93,
    "unit": "gói",
    "rating": 4.8,
    "sales": 264,
    "image": "🍿",
    "daysUntilExpiry": 296,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0880",
    "name": "Oishi Snack Tôm Vị Cay 68G",
    "barcode": "8934803012255",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 20,
    "unit": "gói",
    "rating": 4.9,
    "sales": 277,
    "image": "🍿",
    "daysUntilExpiry": 303,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0881",
    "name": "Oishi Snack Khoai Tây Vị Tảo Biển 65G",
    "barcode": "8934803053531",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 27,
    "unit": "gói",
    "rating": 4.5,
    "sales": 290,
    "image": "🍿",
    "daysUntilExpiry": 310,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0882",
    "name": "Pati Kẹo Dẻo Bất Ngờ Vị Nho 63G",
    "barcode": "8936183006343",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 34,
    "unit": "gói",
    "rating": 4.6,
    "sales": 303,
    "image": "🍬",
    "daysUntilExpiry": 317,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0883",
    "name": "Pati Kẹo Dẻo Lột Vỏ Vị Đào 80G",
    "barcode": "8936183006312",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 41,
    "unit": "gói",
    "rating": 4.7,
    "sales": 316,
    "image": "🍬",
    "daysUntilExpiry": 324,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0884",
    "name": "Pati Kẹo Dẻo Lột Vỏ Vị Nho Mẫu Đơn 80G",
    "barcode": "8936183006329",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 48,
    "unit": "gói",
    "rating": 4.8,
    "sales": 329,
    "image": "🍬",
    "daysUntilExpiry": 331,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0885",
    "name": "Pati Kẹo Dẻo Bất Ngờ Vị Dâu 63G",
    "barcode": "8936183006336",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 55,
    "unit": "gói",
    "rating": 4.9,
    "sales": 342,
    "image": "🍬",
    "daysUntilExpiry": 338,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0886",
    "name": "Sachi Bánh Tráng Nướng Phủ Mực Nướng 45G",
    "barcode": "8936183003076",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 62,
    "unit": "gói",
    "rating": 4.5,
    "sales": 355,
    "image": "📦",
    "daysUntilExpiry": 345,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0887",
    "name": "Big Bang Rong Biển Vị Mực 6G",
    "barcode": "8858702403689",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 69,
    "unit": "gói",
    "rating": 4.6,
    "sales": 368,
    "image": "🍪",
    "daysUntilExpiry": 352,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0888",
    "name": "Sachi Bánh Tráng Nướng Phủ Khô Bò Cay 45G",
    "barcode": "8936183002857",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 76,
    "unit": "gói",
    "rating": 4.7,
    "sales": 381,
    "image": "📦",
    "daysUntilExpiry": 359,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0889",
    "name": "Big Bang Rong Biển Vị Truyền Thống 6G",
    "barcode": "8858702403672",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 83,
    "unit": "gói",
    "rating": 4.8,
    "sales": 394,
    "image": "🍪",
    "daysUntilExpiry": 96,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0890",
    "name": "Sachi Bánh Tráng Nướng Phủ Phô Mai 45G",
    "barcode": "8936183002833",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 90,
    "unit": "gói",
    "rating": 4.9,
    "sales": 407,
    "image": "📦",
    "daysUntilExpiry": 103,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0891",
    "name": "Crispy Seaweed Rong Biển Vị Cay 15G",
    "barcode": "8857107231057",
    "category": "banh_keo",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 97,
    "unit": "gói",
    "rating": 4.5,
    "sales": 420,
    "image": "🍪",
    "daysUntilExpiry": 110,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0892",
    "name": "Sachi Bánh Tráng Nướng Phủ Rong Biển 45G",
    "barcode": "8936183003069",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 24,
    "unit": "gói",
    "rating": 4.6,
    "sales": 433,
    "image": "📦",
    "daysUntilExpiry": 117,
    "branchId": "branch_main"
  },
  {
    "id": "SP_0893",
    "name": "Sachi Bánh Tráng Nướng Phủ Tôm Nướng Cay 45G",
    "barcode": "8936183003083",
    "category": "nhu_yeu_pham",
    "costPrice": 9500,
    "price": 12000,
    "originalPrice": 13000,
    "stock": 31,
    "unit": "gói",
    "rating": 4.7,
    "sales": 446,
    "image": "📦",
    "daysUntilExpiry": 124,
    "branchId": "branch_main"
  }
];

  const dalModule = {
    setOnlineStatus(status) {
      isNetworkOnline = Boolean(status);
    },

    isOnline() {
      return isNetworkOnline;
    },

    async initDB() {
      if (dbConnection) return dbConnection;

      // Hỗ trợ môi trường trình duyệt với native IndexedDB
      if (typeof indexedDB !== 'undefined') {
        return new Promise((resolve, reject) => {
          const req = indexedDB.open(DB_NAME, DB_VERSION);

          req.onupgradeneeded = function (event) {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('products')) {
              const pStore = db.createObjectStore('products', { keyPath: 'id' });
              pStore.createIndex('category', 'category', { unique: false });
              pStore.createIndex('barcode', 'barcode', { unique: false });
              pStore.createIndex('name', 'name', { unique: false });
            }
            if (!db.objectStoreNames.contains('orders')) {
              const oStore = db.createObjectStore('orders', { keyPath: 'id' });
              oStore.createIndex('status', 'status', { unique: false });
              oStore.createIndex('customerPhone', 'customerPhone', { unique: false });
              oStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            if (!db.objectStoreNames.contains('debts')) {
              const dStore = db.createObjectStore('debts', { keyPath: 'id' });
              dStore.createIndex('customerName', 'customerName', { unique: false });
              dStore.createIndex('status', 'status', { unique: false });
            }
            if (!db.objectStoreNames.contains('cash_flows')) {
              const cStore = db.createObjectStore('cash_flows', { keyPath: 'id' });
              cStore.createIndex('type', 'type', { unique: false });
              cStore.createIndex('date', 'date', { unique: false });
            }
            if (!db.objectStoreNames.contains('settings')) {
              db.createObjectStore('settings', { keyPath: 'key' });
            }
            if (!db.objectStoreNames.contains('offline_queue')) {
              db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
            }
          };

          req.onsuccess = function (event) {
            dbConnection = event.target.result;
            resolve(dbConnection);
          };

          req.onerror = function (err) {
            console.warn('[DAL]: IndexedDB open thất bại, chuyển sang mock in-memory DAL:', err);
            dbConnection = dalModule._createMockDB();
            resolve(dbConnection);
          };
        });
      } else {
        // Mock in-memory DAL cho Node.js hoặc môi trường kiểm thử
        dbConnection = dalModule._createMockDB();
        return Promise.resolve(dbConnection);
      }
    },

    _createMockDB() {
      const stores = new Set(OBJECT_STORES);
      return {
        name: DB_NAME,
        version: DB_VERSION,
        objectStoreNames: {
          contains: name => stores.has(name)
        }
      };
    },

    async seedProducts(force = false) {
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.removeItem('taphoaso_data_cleared');
        } catch (e) {}
      }
      inMemoryProducts = SEED_PRODUCT_CATALOG.map(p => ({ ...p }));
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.setItem('taphoaso_products', JSON.stringify(inMemoryProducts));
        } catch (e) {}
      }

      // Nạp vào IndexedDB nếu có kết nối
      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          return new Promise((resolve) => {
            const tx = db.transaction(['products'], 'readwrite');
            const store = tx.objectStore('products');
            for (const item of inMemoryProducts) {
              store.put(item);
            }
            tx.oncomplete = () => resolve(inMemoryProducts);
            tx.onerror = () => resolve(inMemoryProducts);
          });
        }
      } catch (e) {}

      syncModule.broadcast('PRODUCT_STOCK_CHANGED', { source: 'seed', count: inMemoryProducts.length });
      return inMemoryProducts;
    },

    async getProducts() {
      // 1. Kiểm tra cache RAM
      if (inMemoryProducts.length > 0) {
        return inMemoryProducts;
      }

      const isCleared = isBrowser && window.localStorage && window.localStorage.getItem('taphoaso_data_cleared') === 'true';

      // 2. Kiểm tra LocalStorage
      if (isBrowser && window.localStorage) {
        try {
          const cached = window.localStorage.getItem('taphoaso_products');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length >= 50) {
              inMemoryProducts = parsed;
              return inMemoryProducts;
            }
          }
        } catch (e) {}
      }

      // 3. Đọc từ IndexedDB
      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          const items = await new Promise((resolve) => {
            const tx = db.transaction(['products'], 'readonly');
            const store = tx.objectStore('products');
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
          });
          if (items && items.length > 0) {
            inMemoryProducts = items;
            return items;
          }
        }
      } catch (e) {}

      // Nếu người dùng đã chọn xóa sạch dữ liệu, trả về mảng rỗng
      if (isCleared) {
        return [];
      }

      // 4. Mặc định tự động seed
      return await this.seedProducts();
    },

    async clearAllData() {
      inMemoryProducts = [];
      inMemoryOfflineQueue = [];

      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.setItem('taphoaso_data_cleared', 'true');
          window.localStorage.removeItem('taphoaso_products');
          window.localStorage.removeItem('taphoaso_offline_queue');
          window.localStorage.removeItem('taphoaso_orders');
          window.localStorage.removeItem('taphoaso_debts');
          window.localStorage.removeItem('taphoaso_cashflows');
        } catch (e) {}
      }

      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          await new Promise((resolve) => {
            const tx = db.transaction(['products', 'orders', 'debts', 'cash_flows', 'offline_queue'], 'readwrite');
            tx.objectStore('products').clear();
            tx.objectStore('orders').clear();
            tx.objectStore('debts').clear();
            tx.objectStore('cash_flows').clear();
            tx.objectStore('offline_queue').clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          });
        }
      } catch (e) {}

      syncModule.broadcast('DATA_CLEARED', { timestamp: Date.now() });
      syncModule.broadcast('PRODUCT_STOCK_CHANGED', { source: 'admin', clear: true });
      return true;
    },

    async addProduct(product) {
      if (!product.id) {
        product.id = 'SP' + Date.now().toString().slice(-6) + '_' + Math.floor(100 + Math.random() * 900);
      }
      if (!product.barcode) {
        product.barcode = '893' + Math.floor(1000000000 + Math.random() * 9000000000);
      }
      product.price = Number(product.price || 0);
      product.originalPrice = Number(product.originalPrice || product.price);
      product.stock = Number(product.stock || 0);
      product.unit = product.unit || 'Cái';
      product.rating = product.rating || 5.0;
      product.sales = product.sales || 0;
      product.category = product.category || 'nhu_yeu_pham';
      product.daysUntilExpiry = Number(product.daysUntilExpiry || 90);

      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.removeItem('taphoaso_data_cleared');
        } catch (e) {}
      }

      inMemoryProducts.push(product);
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.setItem('taphoaso_products', JSON.stringify(inMemoryProducts));
        } catch (e) {}
      }

      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          await new Promise((resolve) => {
            const tx = db.transaction(['products'], 'readwrite');
            tx.objectStore('products').put(product);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          });
        }
      } catch (e) {}

      syncModule.broadcast('PRODUCT_STOCK_CHANGED', {
        productId: product.id,
        newStock: product.stock,
        delta: product.stock,
        source: 'add_product',
        product: product
      });

      return product;
    },

    async deleteProduct(productId) {
      inMemoryProducts = inMemoryProducts.filter(p => p.id !== productId);
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.setItem('taphoaso_products', JSON.stringify(inMemoryProducts));
        } catch (e) {}
      }

      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          await new Promise((resolve) => {
            const tx = db.transaction(['products'], 'readwrite');
            tx.objectStore('products').delete(productId);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          });
        }
      } catch (e) {}

      syncModule.broadcast('PRODUCT_STOCK_CHANGED', {
        productId: productId,
        newStock: 0,
        delta: 0,
        source: 'delete_product'
      });

      return true;
    },

    async getProductById(id) {
      const all = await this.getProducts();
      return all.find(p => String(p.id) === String(id)) || null;
    },

    async updateProduct(product) {
      if (!product || !product.id) return null;
      product.price = Number(product.price || 0);
      product.stock = Number(product.stock || 0);

      const idx = inMemoryProducts.findIndex(p => String(p.id) === String(product.id));
      if (idx !== -1) {
        inMemoryProducts[idx] = Object.assign({}, inMemoryProducts[idx], product);
      } else {
        inMemoryProducts.push(product);
      }

      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.setItem('taphoaso_products', JSON.stringify(inMemoryProducts));
        } catch (e) {}
      }

      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          await new Promise((resolve) => {
            const tx = db.transaction(['products'], 'readwrite');
            tx.objectStore('products').put(product);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          });
        }
      } catch (e) {}

      syncModule.broadcast('PRODUCT_STOCK_CHANGED', {
        productId: product.id,
        newStock: product.stock,
        delta: product.stock,
        source: 'update_product',
        product: product
      });

      return product;
    },

    async resetToSeedData() {
      return await this.seedProducts(true);
    },

    async saveOrder(order) {
      if (!order.id) {
        order.id = 'DH-' + Date.now();
      }
      if (!order.timestamp) {
        order.timestamp = new Date().toISOString();
      }

      // Ngoại tuyến: thêm vào offline_queue
      if (!isNetworkOnline) {
        inMemoryOfflineQueue.push({ ...order });
        if (isBrowser && window.localStorage) {
          try {
            window.localStorage.setItem('taphoaso_offline_queue', JSON.stringify(inMemoryOfflineQueue));
          } catch (e) {}
        }

        try {
          const db = await this.initDB();
          if (db && db.transaction && typeof indexedDB !== 'undefined') {
            await new Promise((resolve) => {
              const tx = db.transaction(['offline_queue'], 'readwrite');
              tx.objectStore('offline_queue').put(order);
              tx.oncomplete = () => resolve();
              tx.onerror = () => resolve();
            });
          }
        } catch (e) {}

        return { success: true, offline: true, orderId: order.id };
      }

      // Trực tuyến: lưu vào bảng orders
      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          await new Promise((resolve) => {
            const tx = db.transaction(['orders'], 'readwrite');
            tx.objectStore('orders').put(order);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          });
        }
      } catch (e) {}

      syncModule.broadcast('ORDER_CREATED', {
        orderId: order.id,
        orderType: order.orderType || 'pos',
        total: order.total,
        customerName: order.customerName,
        timestamp: order.timestamp
      });

      return { success: true, offline: false, orderId: order.id };
    },

    async getOfflineQueue() {
      if (inMemoryOfflineQueue.length > 0) {
        return inMemoryOfflineQueue;
      }
      if (isBrowser && window.localStorage) {
        try {
          const cached = window.localStorage.getItem('taphoaso_offline_queue');
          if (cached) {
            inMemoryOfflineQueue = JSON.parse(cached);
            return inMemoryOfflineQueue;
          }
        } catch (e) {}
      }

      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          return new Promise((resolve) => {
            const tx = db.transaction(['offline_queue'], 'readonly');
            const req = tx.objectStore('offline_queue').getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
          });
        }
      } catch (e) {}

      return inMemoryOfflineQueue;
    },

    async syncOfflineQueue() {
      const queue = await this.getOfflineQueue();
      if (!queue || queue.length === 0) return 0;

      let syncedCount = 0;
      for (const order of queue) {
        await this.saveOrder({ ...order, isOfflineSynced: true });
        syncedCount++;
      }

      // Làm sạch hàng đợi
      inMemoryOfflineQueue = [];
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.removeItem('taphoaso_offline_queue');
        } catch (e) {}
      }

      try {
        const db = await this.initDB();
        if (db && db.transaction && typeof indexedDB !== 'undefined') {
          await new Promise((resolve) => {
            const tx = db.transaction(['offline_queue'], 'readwrite');
            tx.objectStore('offline_queue').clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          });
        }
      } catch (e) {}

      return syncedCount;
    },

    async getAllProducts() {
      return this.getProducts();
    }
  };

  // ==========================================================================
  // PHÂN HỆ 4: WEB CRYPTO API AES-GCM 256-BIT ENCRYPTION (AC-CRYPTO)
  // ==========================================================================

  const cryptoSubtle = (typeof window !== 'undefined' && window.crypto && window.crypto.subtle)
    ? window.crypto.subtle
    : (typeof global !== 'undefined' && global.crypto && global.crypto.subtle)
    ? global.crypto.subtle
    : null;

  function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function hexToBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  const cryptoModule = {
    async encryptData(data, passphrase) {
      if (!cryptoSubtle) {
        throw new Error('[CRYPTO ERROR]: Web Crypto API subtle không khả dụng.');
      }
      const enc = new TextEncoder();
      const rawPlain = enc.encode(JSON.stringify(data));

      // Sinh Salt 16 bytes và IV 12 bytes ngẫu nhiên
      const salt = new Uint8Array(16);
      const iv = new Uint8Array(12);
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(salt);
        crypto.getRandomValues(iv);
      } else {
        for (let i = 0; i < 16; i++) salt[i] = Math.floor(Math.random() * 256);
        for (let i = 0; i < 12; i++) iv[i] = Math.floor(Math.random() * 256);
      }

      // PBKDF2 Key Derivation (SHA-256, 100.000 vòng lặp)
      const baseKey = await cryptoSubtle.importKey(
        'raw',
        enc.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const aesKey = await cryptoSubtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      const cipherBuffer = await cryptoSubtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        aesKey,
        rawPlain
      );

      return JSON.stringify({
        salt: bufferToHex(salt),
        iv: bufferToHex(iv),
        cipher: bufferToHex(cipherBuffer),
        alg: 'AES-GCM-256'
      });
    },

    async decryptData(ciphertext, passphrase) {
      if (!cryptoSubtle) {
        throw new Error('[CRYPTO ERROR]: Web Crypto API subtle không khả dụng.');
      }

      const parsed = typeof ciphertext === 'string' ? JSON.parse(ciphertext) : ciphertext;
      if (!parsed || !parsed.salt || !parsed.iv || !parsed.cipher) {
        throw new Error('[CRYPTO ERROR]: Bản mã ciphertext không đúng định dạng.');
      }

      const enc = new TextEncoder();
      const salt = hexToBuffer(parsed.salt);
      const iv = hexToBuffer(parsed.iv);
      const cipherBytes = hexToBuffer(parsed.cipher);

      const baseKey = await cryptoSubtle.importKey(
        'raw',
        enc.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const aesKey = await cryptoSubtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      // Giải mã với AES-GCM (nếu sai passphrase sẽ ném OperationError)
      const decryptedBuffer = await cryptoSubtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        aesKey,
        cipherBytes
      );

      const dec = new TextDecoder();
      const plainStr = dec.decode(decryptedBuffer);
      return JSON.parse(plainStr);
    }
  };

  // ==========================================================================
  // PHÂN HỆ 5: EXPORT & RECEIPT PRINT SERVICES (AC-EXPORT)
  // ==========================================================================

  const exportModule = {
    generateCSVContent(data) {
      if (!Array.isArray(data) || data.length === 0) {
        return '\uFEFF';
      }
      const headers = Object.keys(data[0]);
      const lines = [headers.join(',')];

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const line = headers.map(h => {
          let val = item[h] !== undefined && item[h] !== null ? String(item[h]) : '';
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            val = '"' + val.replace(/"/g, '""') + '"';
          }
          return val;
        });
        lines.push(line.join(','));
      }

      // Tiền tố UTF-8 BOM (\uFEFF) đảm bảo mở trên Microsoft Excel không bị lỗi font tiếng Việt
      return '\uFEFF' + lines.join('\r\n');
    },

    exportProductsExcel(data, filename = 'taphoa36_sanpham.csv') {
      return this.exportExcel(data, filename);
    },

    printFinancialReport(summary) {
      if (typeof window !== 'undefined' && window.print) {
        window.print();
      }
      return this.formatPDFReportData(summary);
    },

    exportExcel(data, filename = 'taphoaso_export.csv') {
      const csv = this.generateCSVContent(data);
      if (isBrowser) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return csv;
    },

    generateK80ReceiptHtml(order) {
      let branchName = 'TẠP HÓA 36 - UTH';
      let branchAddress = 'Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam';
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem('taphoa36_active_branch');
          if (stored) branchName = stored;
        }
      } catch (e) {}

      const store = order.storeInfo || {
        name: branchName,
        address: branchAddress,
        hotline: '1900 6522'
      };

      const itemsHtml = (order.items || []).map(item => `
        <tr>
          <td style="padding: 2px 0;">${item.name}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${formatNumber(item.price)}</td>
          <td style="text-align: right;">${formatNumber(item.subtotal || item.price * item.quantity)}</td>
        </tr>
      `).join('');

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Hóa đơn bán lẻ - ${order.orderId}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            @media print {
              html, body {
                width: 80mm;
                margin: 0;
                padding: 4mm;
              }
            }
            body {
              width: 80mm;
              font-family: 'Courier New', Courier, monospace;
              font-size: 11px;
              line-height: 1.35;
              color: #000;
              padding: 4mm;
              margin: 0 auto;
              box-sizing: border-box;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
            th { border-bottom: 1px solid #000; padding: 2px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 13px;">${store.name}</div>
          <div class="center">${store.address}</div>
          <div class="center">Hotline: ${store.hotline}</div>
          <div class="divider"></div>
          <div>HÓA ĐƠN BÁN LẺ: #${order.orderId}</div>
          <div>Ngày: ${order.date || formatDate(new Date())}</div>
          <div>Thu ngân: ${order.cashierName || 'Minh Tuấn'}</div>
          <div class="divider"></div>
          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Tên hàng</th>
                <th style="text-align: center;">SL</th>
                <th style="text-align: right;">Đơn giá</th>
                <th style="text-align: right;">T.Tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="divider"></div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng tiền hàng:</span>
            <span>${formatNumber(order.subtotal || order.total)} đ</span>
          </div>
          ${order.discount ? `
          <div style="display: flex; justify-content: space-between;">
            <span>Giảm giá / KM:</span>
            <span>-${formatNumber(order.discount)} đ</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-top: 2px;">
            <span>TỔNG CỘNG:</span>
            <span>${formatNumber(order.total)} đ</span>
          </div>
          <div class="divider"></div>
          ${order.cashTendered !== undefined ? `
          <div style="display: flex; justify-content: space-between;">
            <span>Tiền khách đưa:</span>
            <span>${formatNumber(order.cashTendered)} đ</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tiền thối lại:</span>
            <span>${formatNumber(order.change !== undefined ? order.change : (order.cashTendered - order.total))} đ</span>
          </div>` : ''}
          <div class="divider"></div>
          <div class="center bold" style="margin-top: 4px;">[ MÃ VIETQR QUÉT XÁC NHẬN ]</div>
          <div class="center" style="font-size: 10px; margin-top: 2px;">Cảm ơn Quý khách - Hẹn gặp lại!</div>
        </body>
        </html>
      `;
    },

    printK80Receipt(order) {
      const receiptHtml = this.generateK80ReceiptHtml(order);
      if (isBrowser) {
        const printWindow = window.open('', '_blank', 'width=380,height=600');
        if (printWindow) {
          printWindow.document.write(receiptHtml);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      }
      return receiptHtml;
    },

    formatPDFReportData(financialSummary) {
      return {
        ...financialSummary,
        totalRevenueFormatted: formatCurrency(financialSummary.totalRevenue),
        totalExpenseFormatted: formatCurrency(financialSummary.totalExpense),
        netProfitFormatted: formatCurrency(financialSummary.netProfit),
        activeDebtsFormatted: formatCurrency(financialSummary.activeDebts)
      };
    }
  };

  // ==========================================================================
  // PHÂN HỆ 6: TAPHOA36 AI NLP & RECOMMENDER ENGINE (AC-AI)
  // ==========================================================================

  const aiModule = {
    removeAccents(str) {
      if (!str) return '';
      return String(str)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, m => (m === 'đ' ? 'd' : 'D'))
        .trim();
    },

    classifyIntent(query) {
      if (!query) return { intent: 'GREETING', confidence: 0.95 };

      const clean = this.removeAccents(query).toLowerCase();

      // 1. THANKS
      if (/(cam on|thank|da ta|biet on|tuyet voi qua|hay qua co)/i.test(clean)) {
        return { intent: 'THANKS', confidence: 0.95 };
      }

      // 2. DEBT_INQUIRY
      if (/(no bao nhieu|con no|so no|tien no|mua no|mua chiu|ghi no|thieu no)/i.test(clean)) {
        return { intent: 'DEBT_INQUIRY', confidence: 0.95 };
      }

      // 3. CHECK_ORDER
      if (/(don hang|dh-|ma don|tra cuu don|kiem tra don|da giao chua|van don|hanh trinh)/i.test(clean)) {
        return { intent: 'CHECK_ORDER', confidence: 0.95 };
      }

      // 4. RETURN_POLICY
      if (/(doi lai|doi tra|bi dap|hu hong|tra hang|hoan tien|be vo|thoi chua|het han|hang loi)/i.test(clean)) {
        return { intent: 'RETURN_POLICY', confidence: 0.95 };
      }

      // 5. PROMOTION_DEALS
      if (/(ma giam gia|khuyen mai|voucher|giam gia|ma giam|uu dai|sale|tang kem)/i.test(clean)) {
        return { intent: 'PROMOTION_DEALS', confidence: 0.95 };
      }

      // 6. PAYMENT_METHODS
      if (/(quet ma|ma qr|vietqr|momo|zalopay|chuyen khoan|tra qua|tien mat|the ngan hang|thanh toan)/i.test(clean)) {
        return { intent: 'PAYMENT_METHODS', confidence: 0.95 };
      }

      // 7. SHIPPING_POLICY
      if (/(freeship|phi ship|phi van chuyen|giao hang|ship den|giao tan nha|giao 2h|giao nhanh)/i.test(clean)) {
        return { intent: 'SHIPPING_POLICY', confidence: 0.95 };
      }

      // 8. PRICE_INQUIRY
      if (/(gia bao nhieu|bao nhieu tien|nhieu tien|gia ca|gia cua|gia ban|bao gia)/i.test(clean)) {
        return { intent: 'PRICE_INQUIRY', confidence: 0.95 };
      }

      // 9. FIND_PRODUCT
      if (/(con .* khong|co ban|tim mua|con hang|co .* khong|tim kiem|co mat hang|con gao|con trung|con sua|con mi)/i.test(clean)) {
        return { intent: 'FIND_PRODUCT', confidence: 0.95 };
      }

      // 10. GREETING
      if (/(chao|hello|hi tap hoa 36|hi taphoa36|hi shop|buon may ban dat|chuc mot ngay|xin chao)/i.test(clean)) {
        return { intent: 'GREETING', confidence: 0.95 };
      }

      // Fallback mặc định
      return { intent: 'FIND_PRODUCT', confidence: 0.85 };
    },

    extractEntities(query, catalog = []) {
      if (!query) return { matchedProduct: null, quantity: 1 };

      const cleanQuery = this.removeAccents(query).toLowerCase();

      // Bóc tách số lượng (ví dụ: "2 chai", "5 gói", "3 kg" hoặc số 2, 5, 3)
      let quantity = 1;
      const numMatch = query.match(/\b(\d+)\s*(chai|hop|goi|kg|lon|vi|tui|qua|cai|bup)?\b/i);
      if (numMatch && numMatch[1]) {
        quantity = parseInt(numMatch[1], 10);
      }

      let matchedProduct = null;
      let maxScore = 0;

      for (let i = 0; i < catalog.length; i++) {
        const prod = catalog[i];
        const cleanName = this.removeAccents(prod.name).toLowerCase();

        // 1. Khớp chuỗi con chính xác
        if (cleanQuery.includes(cleanName) || cleanName.includes(cleanQuery)) {
          matchedProduct = prod;
          break;
        }

        // 2. Khớp từ khóa từng từ
        const tokens = cleanName.split(/\s+/).filter(t => t.length > 2);
        let matchCount = 0;
        tokens.forEach(t => {
          if (cleanQuery.includes(t)) matchCount++;
        });

        if (matchCount > maxScore) {
          maxScore = matchCount;
          matchedProduct = prod;
        }
      }

      return {
        matchedProduct: matchedProduct,
        quantity: quantity,
        productName: matchedProduct ? matchedProduct.name : ''
      };
    },

    recommendProducts(userInteractions = [], catalog = [], limit = 3) {
      const affinityMap = {};

      for (let i = 0; i < userInteractions.length; i++) {
        const inter = userInteractions[i];
        let weight = 1;
        if (inter.action === 'purchase') weight = 5;
        else if (inter.action === 'cart') weight = 3;

        const count = inter.count || 1;
        const addScore = count * weight;
        affinityMap[inter.category] = (affinityMap[inter.category] || 0) + addScore;
      }

      const scored = catalog.map(item => {
        const affinity = affinityMap[item.category] || 0;
        const rating = item.rating || 0;
        const sales = item.sales || 0;
        // Điểm xếp hạng = (Affinity * 0.5) + (Rating * 2) + (Sales * 0.05)
        const score = (affinity * 0.5) + (rating * 2) + (sales * 0.05);
        return {
          ...item,
          _score: score
        };
      });

      scored.sort((a, b) => b._score - a._score);
      return scored.slice(0, limit);
    }
  };

  // ==========================================================================
  // PHÂN HỆ 7: CASHIER POINT OF SALE (AC-POS)
  // ==========================================================================

  const posModule = {
    scanBarcode(barcode, catalog = [], currentCart = []) {
      const code = String(barcode).trim();
      const product = catalog.find(p => String(p.barcode) === code || p.id === code);
      if (!product) {
        return currentCart;
      }

      const cart = currentCart.map(item => ({ ...item }));
      const foundIdx = cart.findIndex(i => i.id === product.id);

      if (foundIdx >= 0) {
        cart[foundIdx].quantity = (cart[foundIdx].quantity || 1) + 1;
        cart[foundIdx].subtotal = cart[foundIdx].quantity * cart[foundIdx].price;
      } else {
        cart.push({
          ...product,
          quantity: 1,
          subtotal: product.price
        });
      }

      return cart;
    },

    calculateChange(cashTendered, totalAmount) {
      const tendered = Number(cashTendered) || 0;
      const total = Number(totalAmount) || 0;
      const change = tendered - total;

      return {
        change: change,
        isValid: change >= 0,
        formattedChange: formatCurrency(change)
      };
    },

    generateVietQRData({ bankBin = '970422', accountNo = '034206001749', amount = 0, memo = '', accountName = 'TRAN NGOC LAM' } = {}) {
      const memoEncoded = encodeURIComponent(memo);
      const nameEncoded = encodeURIComponent(accountName);
      const qrUrl = `https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.png?amount=${amount}&addInfo=${memoEncoded}&accountName=${nameEncoded}`;
      const payload = `VietQR:${bankBin}:${accountNo}:${amount}:${memo}`;

      return {
        bankBin,
        accountNo,
        accountName,
        amount,
        memo,
        qrUrl,
        payload
      };
    },

    createDebtRecord(data) {
      return {
        id: 'DEBT-' + Date.now(),
        customerName: data.customerName || 'Khách quen',
        phone: data.phone || '',
        amount: Number(data.amount || 0),
        orderId: data.orderId || '',
        note: data.note || '',
        status: 'UNPAID',
        createdAt: new Date().toISOString()
      };
    },

    handleHotkey(event, callbacks = {}) {
      if (!event || !event.key) return;
      const key = event.key;

      if (key === 'F1' && typeof callbacks.onF1 === 'function') {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        callbacks.onF1();
      } else if (key === 'F2' && typeof callbacks.onF2 === 'function') {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        callbacks.onF2();
      } else if (key === 'F3' && typeof callbacks.onF3 === 'function') {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        callbacks.onF3();
      } else if (key === 'F4' && typeof callbacks.onF4 === 'function') {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        callbacks.onF4();
      } else if ((key === 'Escape' || key === 'Esc') && typeof callbacks.onESC === 'function') {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        callbacks.onESC();
      }
    },

    canAccessAdminButton(user) {
      return Boolean(user && user.role === 'admin');
    }
  };

  // ==========================================================================
  // PHÂN HỆ 8: ADMIN DASHBOARD INTEGRATION (AC-ADMIN)
  // ==========================================================================

  let currentAdminTab = 'view_dashboard';
  let isDarkModeActive = false;

  if (isBrowser && window.localStorage) {
    try {
      const savedDark = window.localStorage.getItem('taphoaso_dark_mode');
      if (savedDark !== null) {
        isDarkModeActive = savedDark === 'true';
      }
    } catch (e) {}
  }

  const adminModule = {
    getRegisteredViews() {
      return [
        'view_dashboard',  // Từ Image 2
        'view_inventory',  // Từ Image 4
        'view_orders',     // Từ Image 6
        'view_finance',    // Từ Image 8
        'view_settings',   // Từ Image 10
        'view_catalog_ai'  // Từ Image 12
      ];
    },

    switchTab(tabId) {
      const views = this.getRegisteredViews();
      if (views.includes(tabId)) {
        currentAdminTab = tabId;
      }
      return currentAdminTab;
    },

    getActiveTab() {
      return currentAdminTab;
    },

    getBentoGridConfig() {
      return {
        columns: 12,
        gap: '1.25rem',
        responsiveBreakpoints: {
          mobile: 1,
          tablet: 6,
          desktop: 12
        }
      };
    },

    async quickAddStock(productId, delta = 10, initialStock = 0) {
      const updated = Number(initialStock) + Number(delta);
      syncModule.broadcast('PRODUCT_STOCK_CHANGED', {
        productId: productId,
        newStock: updated,
        delta: delta,
        source: 'admin'
      });
      return updated;
    },

    isDarkMode() {
      if (isBrowser && window.localStorage) {
        try {
          const saved = window.localStorage.getItem('taphoaso_dark_mode');
          if (saved !== null) return saved === 'true';
        } catch (e) {}
      }
      return isDarkModeActive;
    },

    toggleDarkMode() {
      isDarkModeActive = !this.isDarkMode();
      if (isBrowser && window.localStorage) {
        try {
          window.localStorage.setItem('taphoaso_dark_mode', String(isDarkModeActive));
        } catch (e) {}
      }
      if (typeof document !== 'undefined' && document.documentElement) {
        if (isDarkModeActive) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return isDarkModeActive;
    },

    computeFinancialMetrics(cashFlows = [], debts = []) {
      const totalInflow = cashFlows
        .filter(c => c.type === 'IN')
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);

      const totalOutflow = cashFlows
        .filter(c => c.type === 'OUT')
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);

      const cashInDrawer = totalInflow - totalOutflow;

      const totalReceivableDebt = debts
        .filter(d => d.status === 'UNPAID')
        .reduce((sum, d) => sum + Number(d.amount || 0), 0);

      return {
        totalInflow,
        totalOutflow,
        cashInDrawer,
        totalReceivableDebt
      };
    },

    suggestNearExpiryDiscount({ name = '', daysUntilExpiry = 5, currentStock = 0 } = {}) {
      let percent = 20;
      if (daysUntilExpiry <= 2) {
        percent = 25; // 15% - 30%
      } else if (daysUntilExpiry <= 5) {
        percent = 18; // 15% - 30%
      } else {
        percent = 10;
      }

      return {
        suggestedDiscountPercent: percent,
        reason: `Sản phẩm ${name} còn ${daysUntilExpiry} ngày hết hạn (tồn kho: ${currentStock}). Đề xuất giảm ${percent}% để kích cầu và xả hàng nhanh thu hồi vốn.`
      };
    },

    getQuickSwitcherTargets() {
      return ['store.html', 'pos.html', 'admin.html'];
    },

    getTapHoa36NavConfig() {
      return {
        brand: 'Tạp Hóa 36',
        hotline: '1900 6522',
        branch: 'Cửa Hàng Chính - Tạp Hóa 36 (Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam)',
        posLink: 'pos.html',
        storeLink: 'store.html',
        adminLink: 'admin.html',
        primaryColor: '#be123c',
        menuTabs: [
          { id: 'view_dashboard', title: 'Tổng quan', icon: 'grid_view' },
          { id: 'view_inventory', title: 'Hàng hóa', icon: 'inventory_2' },
          { id: 'view_orders', title: 'Đơn hàng', icon: 'receipt_long' },
          { id: 'view_finance', title: 'Sổ quỹ', icon: 'payments' },
          { id: 'view_catalog_ai', title: 'Báo cáo & AI', icon: 'analytics' },
          { id: 'view_settings', title: 'Cài đặt', icon: 'settings' }
        ]
      };
    }
  };

  // ==========================================================================
  // MODULE MỞ RỘNG: KHO & NHÀ CUNG CẤP & TÀI CHÍNH (TAPHOA36)
  // ==========================================================================

  const BRANCHES_STORAGE_KEY = 'taphoa36_custom_branches';
  const DEFAULT_MAIN_BRANCH = {
    id: 'branch_main',
    name: 'Cửa Hàng Chính - Tạp Hóa 36 (UTH)',
    address: 'Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam',
    phone: '1900 6522',
    type: 'store',
    isDefault: true
  };

  let inMemoryBranches = [DEFAULT_MAIN_BRANCH];

  function getStoredBranches() {
    try {
      if (typeof localStorage === 'undefined') return inMemoryBranches;
      const raw = localStorage.getItem(BRANCHES_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify([DEFAULT_MAIN_BRANCH]));
        return [DEFAULT_MAIN_BRANCH];
      }
      let list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) return [DEFAULT_MAIN_BRANCH];
      // Tự động dọn sạch mọi kho ảo cũ (KhoDC, TM01, TM02, TM03, TM04, Nguyễn Thanh Sơn, Lương Định Của...)
      list = list.filter(b => b && b.name && !b.name.includes('KhoDC') && !b.name.includes('TM01') && !b.name.includes('TM02') && !b.name.includes('TM03') && !b.name.includes('TM04') && !b.name.includes('Nguyễn Thanh Sơn') && !b.name.includes('Lương Định Của') && !b.name.includes('Huỳnh Khương Ninh'));
      if (list.length === 0 || !list.some(b => b.id === 'branch_main')) {
        list = [DEFAULT_MAIN_BRANCH, ...list.filter(b => b.id !== 'branch_main')];
      }
      localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(list));
      return list;
    } catch (e) {
      return inMemoryBranches;
    }
  }

  function saveStoredBranches(list) {
    inMemoryBranches = list;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(list));
      }
    } catch (e) {}
  }

  const WAREHOUSE_STORAGE_KEY = 'taphoa36_warehouse_ledger';
  function getWarehouseLedger(type) {
    try {
      const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(WAREHOUSE_STORAGE_KEY) : null;
      const list = raw ? JSON.parse(raw) : [];
      if (!type) return list;
      return list.filter(item => item.type === type);
    } catch (e) {
      return [];
    }
  }
  function saveWarehouseLedger(entry) {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(WAREHOUSE_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      if (list.length > 500) list.length = 500;
      localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  const warehouseModule = {
    getBranches() {
      return getStoredBranches();
    },

    addBranch({ name, address, phone, type }) {
      if (!name || !name.trim()) throw new Error('Tên chi nhánh/kho không được để trống');
      const branches = getStoredBranches();
      const newBranch = {
        id: 'branch_' + Date.now() + '_' + Math.floor(100 + Math.random() * 900),
        name: name.trim(),
        address: (address || '').trim() || 'Trường ĐH Giao Thông Vận Tải TP.HCM - UTH',
        phone: phone || '1900 6522',
        type: type || 'warehouse',
        isDefault: false,
        createdAt: new Date().toISOString()
      };
      branches.push(newBranch);
      saveStoredBranches(branches);
      return newBranch;
    },

    deleteBranch(id) {
      if (!id || id === 'branch_main') throw new Error('Không thể xóa chi nhánh chính mặc định');
      let branches = getStoredBranches();
      branches = branches.filter(b => b.id !== id && !b.isDefault);
      if (branches.length === 0) branches = [DEFAULT_MAIN_BRANCH];
      saveStoredBranches(branches);
      return { success: true };
    },

    async transferStock({ fromBranch, toBranch, productId, quantity, note }) {
      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty <= 0) throw new Error('Số lượng chuyển không hợp lệ');
      const product = await dalModule.getProductById(productId);
      if (!product) throw new Error('Không tìm thấy sản phẩm');
      if (product.stock < qty) throw new Error('Số lượng tồn kho không đủ để điều chuyển');

      product.stock -= qty;
      await dalModule.updateProduct(product);

      const transferId = 'TRF_' + Date.now();
      const record = {
        id: transferId,
        type: 'transfer',
        fromBranch: fromBranch || 'Cửa Hàng Chính - Tạp Hóa 36 (UTH)',
        toBranch: toBranch || 'Kho KTX UTH',
        productId,
        productName: product.name,
        quantity: qty,
        note: note || '',
        timestamp: new Date().toISOString()
      };
      saveWarehouseLedger(record);
      return { success: true, transferId, record };
    },

    async produceCombo({ comboName, comboPrice, ingredients, outputQty }) {
      const outQty = parseInt(outputQty, 10) || 1;
      if (!comboName) throw new Error('Tên combo không được để trống');
      if (!ingredients || !ingredients.length) throw new Error('Thiếu danh sách nguyên liệu');

      for (const ing of ingredients) {
        const prod = await dalModule.getProductById(ing.productId);
        if (!prod) throw new Error('Không tìm thấy nguyên liệu id: ' + ing.productId);
        const need = (ing.quantity || 1) * outQty;
        if (prod.stock < need) {
          throw new Error('Nguyên liệu ' + prod.name + ' không đủ tồn kho (cần ' + need + ', còn ' + prod.stock + ')');
        }
        prod.stock -= need;
        await dalModule.updateProduct(prod);
      }

      const comboProd = await dalModule.addProduct({
        name: comboName,
        price: comboPrice || 50000,
        stock: outQty,
        category: 'Combo / Đóng gói',
        barcode: 'CB_' + Math.floor(100000 + Math.random() * 900000)
      });

      const recordId = 'PRD_' + Date.now();
      const record = {
        id: recordId,
        type: 'production',
        comboId: comboProd.id,
        comboName,
        outputQty: outQty,
        ingredients,
        timestamp: new Date().toISOString()
      };
      saveWarehouseLedger(record);
      return { success: true, comboId: comboProd.id, recordId };
    },

    async internalUse({ productId, quantity, purpose, department }) {
      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty <= 0) throw new Error('Số lượng không hợp lệ');
      const product = await dalModule.getProductById(productId);
      if (!product) throw new Error('Không tìm thấy sản phẩm');
      if (product.stock < qty) throw new Error('Tồn kho không đủ');

      product.stock -= qty;
      await dalModule.updateProduct(product);

      const recordId = 'INT_' + Date.now();
      const record = {
        id: recordId,
        recordId,
        type: 'internal',
        productId,
        productName: product.name,
        quantity: qty,
        purpose: purpose || 'Tiêu hao nội bộ',
        department: department || 'Quầy Thu Ngân',
        timestamp: new Date().toISOString()
      };
      saveWarehouseLedger(record);
      return { success: true, recordId };
    },

    async writeOff({ productId, quantity, reason }) {
      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty <= 0) throw new Error('Số lượng không hợp lệ');
      const product = await dalModule.getProductById(productId);
      if (!product) throw new Error('Không tìm thấy sản phẩm');
      if (product.stock < qty) throw new Error('Tồn kho không đủ để hủy');

      product.stock -= qty;
      await dalModule.updateProduct(product);

      const recordId = 'WRO_' + Date.now();
      const record = {
        id: recordId,
        recordId,
        type: 'writeoff',
        productId,
        productName: product.name,
        quantity: qty,
        reason: reason || 'Hết hạn sử dụng / hư hỏng',
        timestamp: new Date().toISOString()
      };
      saveWarehouseLedger(record);
      return { success: true, recordId };
    },

    getLedger(type) {
      return getWarehouseLedger(type);
    }
  };

  const SUPPLIERS_STORAGE_KEY = 'taphoa36_suppliers';
  const DEFAULT_SUPPLIERS = [
    { id: 'sup_1', name: 'Đại Lý Bánh Kẹo Kinh Đô Bình Thạnh', phone: '0903112233', address: '15 Ung Văn Khiêm, P.25, Bình Thạnh', balance: 1500000 },
    { id: 'sup_2', name: 'Nhà Phân Phối Nước Giải Khát Tân Hiệp Phát', phone: '0918223344', address: 'Quốc Lộ 13, Hiệp Bình Phước, Thủ Đức', balance: 0 },
    { id: 'sup_3', name: 'Kho Gia Vị & Nông Sản Chợ Bà Chiểu', phone: '0977334455', address: 'Chợ Bà Chiểu, Bình Thạnh', balance: 450000 }
  ];

  const suppliersModule = {
    getAll() {
      try {
        if (typeof localStorage === 'undefined') return DEFAULT_SUPPLIERS.slice();
        const raw = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
        if (!raw) {
          localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(DEFAULT_SUPPLIERS));
          return DEFAULT_SUPPLIERS.slice();
        }
        return JSON.parse(raw);
      } catch (e) {
        return DEFAULT_SUPPLIERS.slice();
      }
    },
    add(supp) {
      const list = this.getAll();
      const newSupp = {
        id: 'sup_' + Date.now(),
        name: supp.name || 'Nhà cung cấp mới',
        phone: supp.phone || '',
        address: supp.address || '',
        balance: parseInt(supp.balance, 10) || 0,
        createdAt: new Date().toISOString()
      };
      list.push(newSupp);
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(list));
        }
      } catch (e) {}
      return newSupp;
    }
  };

  const FINANCE_STORAGE_KEY = 'taphoa36_finance_transactions';
  const financeModule = {
    getTransactions() {
      try {
        if (typeof localStorage === 'undefined') return [];
        const raw = localStorage.getItem(FINANCE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },
    async addServiceExpense({ serviceType, amount, provider, note }) {
      const val = parseInt(amount, 10);
      if (isNaN(val) || val <= 0) throw new Error('Số tiền không hợp lệ');
      const expenseId = 'EXP_' + Date.now();
      const tx = {
        id: expenseId,
        type: 'expense',
        category: serviceType || 'Dịch vụ tiện ích',
        amount: val,
        description: 'Chi phí: ' + (serviceType || '') + ' - ' + (provider || '') + ' (' + (note || '') + ')',
        provider: provider || '',
        timestamp: new Date().toISOString()
      };
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(FINANCE_STORAGE_KEY);
          const list = raw ? JSON.parse(raw) : [];
          list.unshift(tx);
          if (list.length > 500) list.length = 500;
          localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(list));
        }
      } catch (e) {}
      return { success: true, expenseId, transaction: tx };
    }
  };

  // ==========================================================================
  // ĐỐI TƯỢNG HẠT NHÂN CHÍNH: TAPHOA_CORE
  // ==========================================================================

  let aclModule;
  if (typeof require !== 'undefined') {
    try {
      aclModule = require('./acl_engine.js');
    } catch (e) {}
  }
  if (!aclModule && typeof root !== 'undefined' && root.TapHoaCore && root.TapHoaCore.acl) {
    aclModule = root.TapHoaCore.acl;
  }
  if (!aclModule) {
    // Fallback embedded ACL Engine
    var STORAGE_KEYS = { ACCOUNTS: 'taphoa36_accounts', MATRIX: 'taphoa36_acl_matrix', LOGS: 'taphoa36_audit_logs' };
    var DEFAULT_MASTER_ADMIN = {
      id: 'acc_master_admin', username: 'admin', password: 'admin123',
      fullName: 'Trần Ngọc Lâm (Anh Lâm - Chủ tiệm)', role: 'admin', status: 'active',
      phone: '0900000036', createdAt: new Date().toISOString()
    };
    var DEFAULT_MATRIX = {
      admin: ['view_products', 'create_product', 'edit_product', 'delete_product', 'view_orders', 'create_order', 'edit_order', 'cancel_order', 'view_finance', 'export_reports', 'manage_users', 'store_settings', 'stock_in_out', 'print_receipt'],
      manager: ['view_products', 'create_product', 'edit_product', 'view_orders', 'create_order', 'edit_order', 'view_finance', 'export_reports', 'stock_in_out', 'print_receipt'],
      warehouse: ['view_products', 'create_product', 'edit_product', 'stock_in_out'],
      cashier: ['view_products', 'view_orders', 'create_order', 'print_receipt']
    };
    function getStore() {
      if (typeof localStorage !== 'undefined') return localStorage;
      return { _d: {}, getItem: function(k){return this._d[k]||null;}, setItem: function(k,v){this._d[k]=String(v);}, removeItem: function(k){delete this._d[k];} };
    }
    aclModule = {
      ROLES: { ADMIN: 'admin', MANAGER: 'manager', WAREHOUSE: 'warehouse', CASHIER: 'cashier' },
      DEFAULT_MATRIX: DEFAULT_MATRIX,
      getAccounts: function() {
        var s = getStore(), raw = s.getItem(STORAGE_KEYS.ACCOUNTS);
        if (!raw) { s.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([DEFAULT_MASTER_ADMIN])); return [DEFAULT_MASTER_ADMIN]; }
        try { var p = JSON.parse(raw); if (!Array.isArray(p)||p.length===0){p=[DEFAULT_MASTER_ADMIN]; s.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(p));} return p; } catch(e){ return [DEFAULT_MASTER_ADMIN]; }
      },
      saveAccount: function(accData) {
        if (!accData || !accData.username) throw new Error('Missing username');
        var s = getStore(), accounts = this.getAccounts();
        var idx = accounts.findIndex(function(a){ return a.id === accData.id || a.username === accData.username; });
        var saved;
        if (idx >= 0) { saved = Object.assign({}, accounts[idx], accData, { updatedAt: new Date().toISOString() }); accounts[idx] = saved; }
        else { saved = Object.assign({ id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5), status: 'active', role: 'cashier', createdAt: new Date().toISOString() }, accData); accounts.push(saved); }
        s.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
        this.addAuditLog('SAVE_ACCOUNT', 'Lưu tài khoản: ' + saved.username, 'System');
        return saved;
      },
      deleteAccount: function(id) {
        if (id === 'acc_master_admin' || id === 'admin') return false;
        var s = getStore(), accounts = this.getAccounts();
        var f = accounts.filter(function(a){ return a.id !== id && a.username !== id; });
        if (f.length === accounts.length) return false;
        s.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(f));
        this.addAuditLog('DELETE_ACCOUNT', 'Xóa tài khoản ID: ' + id, 'System');
        return true;
      },
      getAclMatrix: function() {
        var s = getStore(), raw = s.getItem(STORAGE_KEYS.MATRIX);
        if (!raw) { s.setItem(STORAGE_KEYS.MATRIX, JSON.stringify(DEFAULT_MATRIX)); return DEFAULT_MATRIX; }
        try { return JSON.parse(raw) || DEFAULT_MATRIX; } catch(e){ return DEFAULT_MATRIX; }
      },
      checkPermission: function(role, permKey) {
        if (!role || !permKey) return false;
        if (role === 'admin') return true;
        var perms = (this.getAclMatrix()[role]) || [];
        return perms.indexOf(permKey) !== -1;
      },
      changePassword: function(uId, oldPass, newPass) {
        var s = getStore(), accounts = this.getAccounts();
        var target = accounts.find(function(a){ return a.id === uId || a.username === uId; });
        if (!target || target.password !== oldPass) return false;
        target.password = newPass;
        target.updatedAt = new Date().toISOString();
        s.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
        this.addAuditLog('CHANGE_PASSWORD', 'Đổi mật khẩu: ' + target.username, target.fullName || target.username);
        return true;
      },
      getAuditLogs: function() {
        var s = getStore(), raw = s.getItem(STORAGE_KEYS.LOGS);
        if (!raw) return [];
        try { return JSON.parse(raw) || []; } catch(e){ return []; }
      },
      addAuditLog: function(action, detail, performedBy) {
        var s = getStore(), logs = this.getAuditLogs();
        logs.unshift({ id: 'log_' + Date.now(), action: action, detail: detail || '', performedBy: performedBy || 'Hệ thống', timestamp: new Date().toISOString() });
        if (logs.length > 100) logs.length = 100;
        s.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
      }
    };
  }

  // =========================================================================
  // MODULE 13: REST API CLIENT BRIDGE (DUAL-MODE FRONT-END <-> BACK-END)
  // =========================================================================
  const apiModule = {
    baseUrl: 'http://localhost:3600',

    async isServerOnline(timeoutMs = 600) {
      if (typeof fetch === 'undefined') return false;
      try {
        const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
        const res = await fetch(`${this.baseUrl}/api/health`, {
          method: 'GET',
          signal: controller ? controller.signal : undefined
        });
        if (timer) clearTimeout(timer);
        return res.ok;
      } catch (e) {
        return false;
      }
    },

    async getProducts() {
      if (await this.isServerOnline()) {
        try {
          const res = await fetch(`${this.baseUrl}/api/products`);
          if (res.ok) return await res.json();
        } catch (e) {}
      }
      return dalModule.getAllProducts();
    },

    async saveProduct(product) {
      if (await this.isServerOnline()) {
        try {
          const res = await fetch(`${this.baseUrl}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
          });
          if (res.ok) {
            const data = await res.json();
            return data.product;
          }
        } catch (e) {}
      }
      return dalModule.addProduct(product);
    },

    async createOrder(orderData) {
      if (await this.isServerOnline()) {
        try {
          const res = await fetch(`${this.baseUrl}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          });
          if (res.ok) {
            const result = await res.json();
            return result;
          }
        } catch (e) {}
      }
      return dalModule.createOrder(orderData);
    },

    async getBranches() {
      if (await this.isServerOnline()) {
        try {
          const res = await fetch(`${this.baseUrl}/api/branches`);
          if (res.ok) return await res.json();
        } catch (e) {}
      }
      return warehouseModule.getBranches();
    },

    async createBranch(branchData) {
      if (await this.isServerOnline()) {
        try {
          const res = await fetch(`${this.baseUrl}/api/branches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(branchData)
          });
          if (res.ok) {
            const data = await res.json();
            return data.branch;
          }
        } catch (e) {}
      }
      return warehouseModule.addBranch(branchData);
    },

    async deleteBranch(id) {
      if (await this.isServerOnline()) {
        try {
          const res = await fetch(`${this.baseUrl}/api/branches/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            return await res.json();
          }
        } catch (e) {}
      }
      return warehouseModule.deleteBranch(id);
    }
  };

  const TapHoaCore = {
    version: '2.5.0',
    auth: authModule,
    sync: syncModule,
    dal: dalModule,
    crypto: cryptoModule,
    export: exportModule,
    ai: aiModule,
    pos: posModule,
    admin: adminModule,
    acl: aclModule,
    warehouse: warehouseModule,
    suppliers: suppliersModule,
    finance: financeModule,
    api: apiModule,
    clearAllData: () => dalModule.clearAllData(),
    initCleanStoreState: async () => {
      await dalModule.clearAllData();
      inMemoryProducts = [];
      return true;
    },
    seedSampleStoreData: async () => {
      await dalModule.clearAllData();
      const sample10 = SEED_PRODUCT_CATALOG.slice(0, 10);
      for (const item of sample10) {
        await dalModule.addProduct(Object.assign({}, item));
      }
      return true;
    },
    clearStoreData: async (confirmCode) => {
      if (confirmCode !== 'XOA') return false;
      await dalModule.clearAllData();
      inMemoryProducts = [];
      if (TapHoaCore.acl) {
        TapHoaCore.acl.getAccounts();
        TapHoaCore.acl.addAuditLog('CLEAR_STORE_DATA', 'Xóa trắng toàn bộ kho hàng và đơn hàng', 'Master Admin');
      }
      return true;
    },
    addProduct: (p) => dalModule.addProduct(p),
    deleteProduct: (id) => dalModule.deleteProduct(id),
    resetToSeedData: () => dalModule.resetToSeedData(),
    formatCurrency,
    formatNumber,
    formatDate,
    generateUUID
  };

  // Đăng ký toàn cục
  root.TapHoaCore = TapHoaCore;

  // Hỗ trợ module CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TapHoaCore;
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
