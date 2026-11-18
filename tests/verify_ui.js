const fs = require('fs');

function verifyHTML(filePath, checks, warnOnly = false) {
  if (!fs.existsSync(filePath)) {
    console.error('  [FAIL] File does not exist: ' + filePath);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('=== Verifying ' + filePath + ' (' + content.length + ' bytes) ===');
  let allPass = true;
  for (const [desc, pattern] of Object.entries(checks)) {
    let pass = false;
    if (typeof pattern === 'string') {
      pass = content.includes(pattern);
    } else if (typeof pattern === 'function') {
      pass = pattern(content);
    } else if (pattern instanceof RegExp) {
      pass = pattern.test(content);
    }
    if (pass) {
      console.log('  [OK] ' + desc);
    } else {
      if (warnOnly) {
        console.warn('  [WARN - Pending Implementation] ' + desc);
      } else {
        console.error('  [FAIL] ' + desc);
        allPass = false;
      }
    }
  }
  return allPass;
}

const posChecks = {
  'Loads shared/core.js': 'shared/core.js',
  'Split screen left column 58%': 'lg:w-[58%]',
  'Split screen right column 42%': 'lg:w-[42%]',
  'Barcode scanner input': 'id="txtBarcode"',
  'Barcode scan logic via TapHoaCore.pos': 'TapHoaCore.pos.scanBarcode',
  'Change calculation via TapHoaCore.pos': 'TapHoaCore.pos.calculateChange',
  'Dynamic VietQR via TapHoaCore.pos': 'TapHoaCore.pos.generateVietQRData',
  'VietQR Bank BIN & Account': '970422',
  'Debt record via TapHoaCore.pos': 'TapHoaCore.pos.createDebtRecord',
  'Debt encryption via TapHoaCore.crypto': 'TapHoaCore.crypto.encryptData',
  'K80 receipt HTML generation': 'TapHoaCore.export.generateK80ReceiptHtml',
  'K80 print receipt execution': 'TapHoaCore.export.printK80Receipt',
  'K80 80mm print size CSS': '@page',
  'Hotkeys F1-F4 & ESC': 'TapHoaCore.pos.handleHotkey',
  'Back to Admin button guarded': 'TapHoaCore.pos.canAccessAdminButton',
  'Real-time sync broadcast on sale': 'PRODUCT_STOCK_CHANGED'
};

const storeChecks = {
  'Loads shared/core.js': 'shared/core.js',
  'Voice search Web Speech API': 'SpeechRecognition',
  'Vietnamese accent normalization': 'TapHoaCore.ai.removeAccents',
  'Product catalog rendering': 'storeProductGrid',
  'Real-time sync listener on PRODUCT_STOCK_CHANGED': 'PRODUCT_STOCK_CHANGED',
  'Button disabled when out of stock': 'isOutOfStock',
  'Slide-out Cart Drawer': 'id="cartDrawer"',
  'Free Shipping 200k threshold': '200000',
  'Single-step checkout modal': 'id="modalCheckout"',
  'Mock OAuth2 Google & Facebook': 'TapHoaCore.auth.loginOAuth',
  'Quick Switcher guarded for Customer': 'TapHoaCore.auth.renderQuickSwitcher',
  'Floating Chatbot TapHoa36 AI': 'btnToggleChatbot',
  'TapHoa36 AI classifyIntent': 'TapHoaCore.ai.classifyIntent',
  'TapHoa36 AI extractEntities': 'TapHoaCore.ai.extractEntities'
};

const adminCoreChecks = {
  'Loads shared/core.js': 'shared/core.js',
  'Loads shared/acl_engine.js or core acl': (c) => c.includes('acl_engine.js') || c.includes('TapHoaCore.acl'),
  'Brand name Tạp Hóa 36 present': 'Tạp Hóa 36',
  'Pastel Pink theme classes present': (c) => c.includes('rose-50') || c.includes('rose-100') || c.includes('rose-500') || c.includes('#fce7f3'),
  'White POS Switcher button on header': 'btn-pos-switcher',
  'Horizontal navbar with 8 views present': 'admin-navbar',
  'View Overview present': 'view-overview',
  'View Products present': 'view-products',
  'View Purchases present': 'view-purchases',
  'View Orders present': 'view-orders',
  'View Customers present': 'view-customers',
  'View Cashflow present': 'view-cashflow',
  'View Reports present': 'view-reports',
  'View ACL & Accounts present': 'view-acl',
  'Centralized Settings Modal present': 'modal-settings',
  'Pure Empty State support present': (c) => c.includes('chưa có sản phẩm') || c.includes('empty-state'),
  'No junk text: No Chào Cô Ba': (c) => !c.includes('Chào Cô Ba!'),
  'No junk text: No Bác Bảy Hẻm 128': (c) => !c.includes('Bác Bảy (Hẻm 128)'),
  'No junk text: No TM02 31 Ung Văn Khiêm in navbar': (c) => !c.includes('TM02 - 31 Ung Văn Khiêm'),
  'Navbar does not clip dropdowns with overflow-x-auto': (c) => !c.includes('overflow-x-auto no-scrollbar py-1')
};

const posOk = verifyHTML('pos.html', posChecks);
const storeOk = verifyHTML('store.html', storeChecks);
const adminOk = verifyHTML('admin.html', adminCoreChecks);

// Verify AGENTS.md Project Rules
let ruleOk = true;
console.log('=== Verifying AGENTS.md Project Rules ===');
if (fs.existsSync('AGENTS.md')) {
  const content = fs.readFileSync('AGENTS.md', 'utf-8');
  if (content.includes('Specification (spec.md) ➔ Plan (plan.md) ➔ Tasks (tasks.md) ➔ Tests (tests/) ➔ Code')) {
    console.log('  [OK] Core Pipeline Invariant verified');
  } else {
    console.error('  [FAIL] Missing Core Pipeline Invariant');
    ruleOk = false;
  }
  if (content.includes('Baoyu Design')) {
    console.log('  [OK] Baoyu Design rule verified');
  } else {
    console.error('  [FAIL] Missing Baoyu Design rule');
    ruleOk = false;
  }
} else {
  console.error('  [FAIL] Missing AGENTS.md');
  ruleOk = false;
}

console.log('\nVERIFICATION RESULT: POS=' + (posOk ? 'PASS' : 'FAIL') + ' | STORE=' + (storeOk ? 'PASS' : 'FAIL') + ' | ADMIN=' + (adminOk ? 'PASS' : 'FAIL') + ' | RULES=' + (ruleOk ? 'PASS' : 'FAIL'));
if (!posOk || !storeOk || !adminOk || !ruleOk) process.exit(1);
