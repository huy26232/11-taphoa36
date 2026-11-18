/**
 * Test Suite: Node.js REST API Server (server.js) & Dual-Mode Integration
 * Trường ĐH Giao Thông Vận Tải TP.HCM - UTH
 */

'use strict';

const http = require('http');
const assert = require('assert');
const { server } = require('../server');

const TEST_PORT = 3609;

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- KHỞI ĐỘNG TEST NODE.JS REST API SERVER ---');

  await new Promise((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Server test đang lắng nghe tại cổng ${TEST_PORT}`);
      resolve();
    });
  });

  try {
    // 1. Test Health Check
    console.log('1. Kiểm tra GET /api/health...');
    const health = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/health',
      method: 'GET'
    });
    assert.strictEqual(health.status, 200, 'Health check status phải là 200');
    assert.strictEqual(health.body.status, 'ok');
    assert.ok(health.body.institution.includes('UTH'), 'Chứa trường thông tin UTH');
    console.log('   ✓ GET /api/health PASSED');

    // 2. Test GET /api/products
    console.log('2. Kiểm tra GET /api/products...');
    const productsRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/products',
      method: 'GET'
    });
    assert.strictEqual(productsRes.status, 200);
    assert.ok(Array.isArray(productsRes.body), 'Products phải là một Array');
    assert.ok(productsRes.body.length >= 10, 'Phải có tối thiểu 10 sản phẩm mẫu UTH');
    console.log(`   ✓ GET /api/products PASSED (${productsRes.body.length} sản phẩm)`);

    // 3. Test POST /api/products
    console.log('3. Kiểm tra POST /api/products...');
    const newProd = {
      name: 'Nước tăng lực Sting Dâu 330ml',
      price: 12000,
      costPrice: 9000,
      stock: 48,
      category: 'Đồ uống'
    };
    const addProdRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/products',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newProd);
    assert.strictEqual(addProdRes.status, 201, 'Thêm sản phẩm thành công trả về 201');
    assert.strictEqual(addProdRes.body.success, true);
    assert.strictEqual(addProdRes.body.product.name, newProd.name);
    console.log('   ✓ POST /api/products PASSED');

    // 4. Test POST /api/orders (Tạo đơn bán hàng POS)
    console.log('4. Kiểm tra POST /api/orders...');
    const sampleOrder = {
      customerName: 'Sinh viên UTH Võ Oanh',
      customerPhone: '0988776655',
      items: [
        { id: 'prod_03', name: 'Mì gói Hảo Hảo', price: 5000, quantity: 4 }
      ],
      paymentMethod: 'vietqr'
    };
    const addOrderRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, sampleOrder);
    assert.strictEqual(addOrderRes.status, 201, 'Tạo đơn thành công trả về 201');
    assert.strictEqual(addOrderRes.body.success, true);
    assert.strictEqual(addOrderRes.body.total, 20000, 'Tổng tiền phải là 5000 * 4 = 20000');
    console.log(`   ✓ POST /api/orders PASSED (Đơn hàng ID: ${addOrderRes.body.orderId})`);

    // 5. Test GET /api/branches (Quản lý chi nhánh)
    console.log('5. Kiểm tra GET /api/branches...');
    const branchesRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/branches',
      method: 'GET'
    });
    assert.strictEqual(branchesRes.status, 200);
    assert.ok(Array.isArray(branchesRes.body));
    const mainBranch = branchesRes.body.find(b => b.id === 'branch_main');
    assert.ok(mainBranch, 'Phải có chi nhánh chính UTH');
    assert.ok(mainBranch.address.includes('Võ Oanh'), 'Địa chỉ cơ sở chính UTH chính xác');
    console.log('   ✓ GET /api/branches PASSED');

    // 6. Test POST /api/branches (Tự tạo chi nhánh mới)
    console.log('6. Kiểm tra POST /api/branches...');
    const newBranch = {
      name: 'Chi Nhánh Ký Túc Xá UTH (Quận 12)',
      address: 'Tô Ký, P. Trung Mỹ Tây, Q. 12, TP.HCM',
      type: 'store'
    };
    const addBranchRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/branches',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newBranch);
    assert.strictEqual(addBranchRes.status, 201);
    assert.strictEqual(addBranchRes.body.success, true);
    const createdBranchId = addBranchRes.body.branch.id;
    console.log(`   ✓ POST /api/branches PASSED (ID: ${createdBranchId})`);

    // 7. Test DELETE /api/branches/:id
    console.log('7. Kiểm tra DELETE /api/branches/:id...');
    const delRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: `/api/branches/${createdBranchId}`,
      method: 'DELETE'
    });
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.body.success, true);

    // Không cho phép xóa cơ sở chính UTH
    const delMainRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/branches/branch_main',
      method: 'DELETE'
    });
    assert.strictEqual(delMainRes.status, 403, 'Cơ sở chính UTH được bảo vệ, cấm xóa (403)');
    console.log('   ✓ DELETE /api/branches/:id PASSED (bảo vệ an toàn cơ sở chính UTH)');

    // 8. Test CORS Preflight OPTIONS
    console.log('8. Kiểm tra CORS Preflight OPTIONS...');
    const optionsRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/products',
      method: 'OPTIONS'
    });
    assert.strictEqual(optionsRes.status, 204);
    assert.strictEqual(optionsRes.headers['access-control-allow-origin'], '*');
    console.log('   ✓ CORS Preflight OPTIONS PASSED');

    console.log('\n======================================================');
    console.log('TẤT CẢ 8 ENDPOINTS BACKEND REST API KIỂM THỬ THÀNH CÔNG 100%!');
    console.log('======================================================');
  } finally {
    server.close();
  }
}

if (require.main === module) {
  runTests().catch(err => {
    console.error('TEST THẤT BẠI:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
