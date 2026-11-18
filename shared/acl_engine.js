/**
 * =============================================================================
 * MODULE: AC-ACL - ACCESS CONTROL LIST & ACCOUNT MANAGEMENT ENGINE
 * Hệ Thống: Tạp Hóa 36 (Hệ Thống Web Cửa Hàng Tạp Hóa Đa Nền Tảng)
 * =============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    if (!root.TapHoaCore) root.TapHoaCore = {};
    root.TapHoaCore.acl = factory();
  }
})(typeof window !== 'undefined' ? window : global, function () {
  'use strict';

  var STORAGE_KEYS = {
    ACCOUNTS: 'taphoa36_accounts',
    MATRIX: 'taphoa36_acl_matrix',
    LOGS: 'taphoa36_audit_logs'
  };

  var DEFAULT_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    WAREHOUSE: 'warehouse',
    CASHIER: 'cashier'
  };

  var DEFAULT_MATRIX = {
    admin: [
      'view_products', 'create_product', 'edit_product', 'delete_product',
      'view_orders', 'create_order', 'edit_order', 'cancel_order',
      'view_finance', 'export_reports', 'manage_users', 'store_settings',
      'stock_in_out', 'print_receipt'
    ],
    manager: [
      'view_products', 'create_product', 'edit_product',
      'view_orders', 'create_order', 'edit_order',
      'view_finance', 'export_reports', 'stock_in_out', 'print_receipt'
    ],
    warehouse: [
      'view_products', 'create_product', 'edit_product', 'stock_in_out'
    ],
    cashier: [
      'view_products', 'view_orders', 'create_order', 'print_receipt'
    ]
  };

  var DEFAULT_MASTER_ADMIN = {
    id: 'acc_master_admin',
    username: 'admin',
    password: 'admin123',
    fullName: 'Trần Ngọc Lâm (Anh Lâm - Chủ tiệm)',
    role: 'admin',
    status: 'active',
    phone: '0900000036',
    createdAt: new Date().toISOString()
  };

  function getStorage() {
    if (typeof localStorage !== 'undefined') return localStorage;
    return {
      _data: {},
      getItem: function (k) { return this._data[k] || null; },
      setItem: function (k, v) { this._data[k] = String(v); },
      removeItem: function (k) { delete this._data[k]; }
    };
  }

  function getAccounts() {
    var storage = getStorage();
    var raw = storage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      var initial = [DEFAULT_MASTER_ADMIN];
      storage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initial));
      return initial;
    }
    try {
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        parsed = [DEFAULT_MASTER_ADMIN];
        storage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return [DEFAULT_MASTER_ADMIN];
    }
  }

  function saveAccount(accData) {
    if (!accData || !accData.username) {
      throw new Error('Dữ liệu tài khoản không hợp lệ: thiếu username');
    }
    var storage = getStorage();
    var accounts = getAccounts();
    var existingIndex = accounts.findIndex(function (a) {
      return a.id === accData.id || a.username === accData.username;
    });

    var savedAccount;
    if (existingIndex >= 0) {
      savedAccount = Object.assign({}, accounts[existingIndex], accData, {
        updatedAt: new Date().toISOString()
      });
      accounts[existingIndex] = savedAccount;
    } else {
      savedAccount = Object.assign({
        id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        status: 'active',
        role: DEFAULT_ROLES.CASHIER,
        createdAt: new Date().toISOString()
      }, accData);
      accounts.push(savedAccount);
    }

    storage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    addAuditLog('SAVE_ACCOUNT', 'Lưu tài khoản: ' + savedAccount.username + ' (' + savedAccount.role + ')', 'System');
    return savedAccount;
  }

  function deleteAccount(accountId) {
    if (accountId === 'acc_master_admin' || accountId === 'admin') {
      return false; // Không thể xóa tài khoản Master Admin
    }
    var storage = getStorage();
    var accounts = getAccounts();
    var filtered = accounts.filter(function (a) {
      return a.id !== accountId && a.username !== accountId;
    });
    if (filtered.length === accounts.length) return false;
    storage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(filtered));
    addAuditLog('DELETE_ACCOUNT', 'Xóa tài khoản ID: ' + accountId, 'System');
    return true;
  }

  function getAclMatrix() {
    var storage = getStorage();
    var raw = storage.getItem(STORAGE_KEYS.MATRIX);
    if (!raw) {
      storage.setItem(STORAGE_KEYS.MATRIX, JSON.stringify(DEFAULT_MATRIX));
      return DEFAULT_MATRIX;
    }
    try {
      return JSON.parse(raw) || DEFAULT_MATRIX;
    } catch (e) {
      return DEFAULT_MATRIX;
    }
  }

  function checkPermission(role, permissionKey) {
    if (!role || !permissionKey) return false;
    if (role === 'admin') return true; // Super admin luôn có mọi quyền
    var matrix = getAclMatrix();
    var permissions = matrix[role] || [];
    return permissions.indexOf(permissionKey) !== -1;
  }

  function changePassword(usernameOrId, oldPassword, newPassword) {
    var storage = getStorage();
    var accounts = getAccounts();
    var target = accounts.find(function (a) {
      return a.id === usernameOrId || a.username === usernameOrId;
    });
    if (!target) return false;
    if (target.password !== oldPassword) return false;

    target.password = newPassword;
    target.updatedAt = new Date().toISOString();
    storage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    addAuditLog('CHANGE_PASSWORD', 'Đổi mật khẩu tài khoản: ' + target.username, target.fullName || target.username);
    return true;
  }

  function getAuditLogs() {
    var storage = getStorage();
    var raw = storage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) return [];
    try {
      return JSON.parse(raw) || [];
    } catch (e) {
      return [];
    }
  }

  function addAuditLog(action, detail, performedBy) {
    var storage = getStorage();
    var logs = getAuditLogs();
    var entry = {
      id: 'log_' + Date.now(),
      action: action,
      detail: detail || '',
      performedBy: performedBy || 'Hệ thống',
      timestamp: new Date().toISOString()
    };
    logs.unshift(entry);
    if (logs.length > 100) logs.length = 100; // Giữ tối đa 100 logs
    storage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }

  return {
    ROLES: DEFAULT_ROLES,
    DEFAULT_MATRIX: DEFAULT_MATRIX,
    getAccounts: getAccounts,
    saveAccount: saveAccount,
    deleteAccount: deleteAccount,
    checkPermission: checkPermission,
    getAclMatrix: getAclMatrix,
    changePassword: changePassword,
    getAuditLogs: getAuditLogs,
    addAuditLog: addAuditLog
  };
});
