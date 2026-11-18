const { webcrypto } = require('crypto');
if (!global.crypto) global.crypto = webcrypto;
global.window = global;
global.performance = performance;

const storage = new Map();
global.localStorage = {
  getItem: (k) => storage.has(k) ? storage.get(k) : null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k)
};

// Load core and test suite
require('../shared/core.js');
require('./test_suite.js');

async function run() {
  const registry = global.TAPHOA_TEST_REGISTRY;
  let passed = 0, failed = 0;
  for (const suite of registry) {
    console.log(`\n=== ${suite.title} ===`);
    for (const test of suite.tests) {
      const startTime = performance.now();
      try {
        if (test.fn.length > 0) {
          await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Timeout 3000ms')), 3000);
            test.fn((err) => {
              clearTimeout(timer);
              if (err) reject(err);
              else resolve();
            });
          });
        } else {
          const res = test.fn();
          if (res && res.then) await res;
        }
        passed++;
        const elapsed = Math.round(performance.now() - startTime);
        console.log(`  ✓ [PASS] ${test.acCode} (${elapsed}ms): ${test.title.substring(0, 70)}`);
      } catch (err) {
        failed++;
        console.error(`  ✕ [FAIL] ${test.acCode}: ${err.message}`);
      }
    }
  }
  console.log(`\n======================================================`);
  console.log(`KẾT QUẢ KIỂM THỬ: ${passed} PASSED / ${failed} FAILED / TỔNG CỘNG ${passed + failed}`);
  console.log(`======================================================`);
  setTimeout(() => {
    process.exit(failed > 0 ? 1 : 0);
  }, 50);
}

run();
