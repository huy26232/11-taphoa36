/**
 * Tạp Hóa 36 - High-Performance Node.js REST API Server
 * Môn học: Lập Trình Web - Trường Đại học Giao Thông Vận Tải TP.HCM (UTH)
 * Sinh viên thực hiện: Trần Ngọc Lâm - MSSV: 034206001749
 * GVHD: ThS. Trần Thịnh Mạnh Đức
 * 
 * Kiến trúc 3 tầng: Front-end (Vanilla JS/Tailwind) -> Back-end (Node.js REST API) -> Database (JSON/SQL)
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3600;
const DB_FILE = path.join(__dirname, 'data', 'taphoa36_db.json');

// Dữ liệu mẫu ban đầu chuẩn hóa trường UTH
const INITIAL_DATABASE = {
  branches: [
    {
      id: 'branch_main',
      name: 'Cửa Hàng Chính - Tạp Hóa 36 (UTH)',
      address: 'Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam',
      type: 'main',
      createdAt: new Date().toISOString()
    }
  ],
  categories: [
    { id: 'cat_food', name: 'Thực phẩm chế biến' },
    { id: 'cat_dairy', name: 'Sữa & Sản phẩm từ sữa' },
    { id: 'cat_spice', name: 'Gia vị & Dầu ăn' },
    { id: 'cat_grain', name: 'Gạo & Nông sản' },
    { id: 'cat_snack', name: 'Bánh kẹo & Đồ ăn vặt' }
  ],
  products: [
    {
      id: 'prod_01',
      name: 'Trứng gà tươi Ba Huân (Hộp 10 quả)',
      barcode: '893601111001',
      category: 'Thực phẩm khô',
      costPrice: 24000,
      price: 32000,
      stock: 45,
      unit: 'hộp',
      expiryDays: 15,
      branchId: 'branch_main'
    },
    {
      id: 'prod_02',
      name: 'Sữa tươi tiệt trùng Vinamilk 100% Không đường 1L',
      barcode: '893601111002',
      category: 'Sữa & Bơ trứng',
      costPrice: 28000,
      price: 36000,
      stock: 30,
      unit: 'hộp',
      expiryDays: 90,
      branchId: 'branch_main'
    },
    {
      id: 'prod_03',
      name: 'Mì gói Hảo Hảo tôm chua cay 75g',
      barcode: '893601111003',
      category: 'Thực phẩm khô',
      costPrice: 3800,
      price: 5000,
      stock: 120,
      unit: 'gói',
      expiryDays: 150,
      branchId: 'branch_main'
    },
    {
      id: 'prod_04',
      name: 'Nước tương đậu nành Nam Dương Đậm Đặc 500ml',
      barcode: '893601111004',
      category: 'Gia vị',
      costPrice: 15000,
      price: 21000,
      stock: 25,
      unit: 'chai',
      expiryDays: 240,
      branchId: 'branch_main'
    },
    {
      id: 'prod_05',
      name: 'Dầu ăn tinh luyện Simply Canola 1L',
      barcode: '893601111005',
      category: 'Gia vị',
      costPrice: 52000,
      price: 68000,
      stock: 18,
      unit: 'chai',
      expiryDays: 365,
      branchId: 'branch_main'
    },
    {
      id: 'prod_06',
      name: 'Gạo thơm đặc sản ST25 Ông Cua (Túi 5kg)',
      barcode: '893601111006',
      category: 'Gạo & Nông sản',
      costPrice: 165000,
      price: 210000,
      stock: 12,
      unit: 'túi',
      expiryDays: 180,
      branchId: 'branch_main'
    },
    {
      id: 'prod_07',
      name: 'Bánh quy bơ Cosy Marie Kinh Đô 336g',
      barcode: '893601111007',
      category: 'Bánh kẹo & Snack',
      costPrice: 32000,
      price: 45000,
      stock: 20,
      unit: 'hộp',
      expiryDays: 120,
      branchId: 'branch_main'
    },
    {
      id: 'prod_08',
      name: 'Nước mắm cá cơm Nam Ngư Đệ Nhị 900ml',
      barcode: '893601111008',
      category: 'Gia vị',
      costPrice: 22000,
      price: 30000,
      stock: 35,
      unit: 'chai',
      expiryDays: 300,
      branchId: 'branch_main'
    },
    {
      id: 'prod_09',
      name: 'Bột ngọt hạt lớn Ajinomoto 454g',
      barcode: '893601111009',
      category: 'Gia vị',
      costPrice: 28000,
      price: 37000,
      stock: 40,
      unit: 'gói',
      expiryDays: 700,
      branchId: 'branch_main'
    },
    {
      id: 'prod_10',
      name: 'Xúc xích tiệt trùng Vissan Heo Chuẩn Vị (Gói 5 cây 175g)',
      barcode: '893601111010',
      category: 'Thực phẩm khô',
      costPrice: 18000,
      price: 26000,
      stock: 50,
      unit: 'gói',
      expiryDays: 60,
      branchId: 'branch_main'
    }
  ],
  customers: [
    { id: 'cust_01', name: 'Khách Lẻ Vãng Lai', phone: '0900000000', group: 'retail', debt: 0 }
  ],
  orders: []
};

// Đảm bảo tệp database tồn tại
function ensureDatabase() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf-8');
  }
}

// Đọc toàn bộ CSDL
function readDatabase() {
  ensureDatabase();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DATABASE READ ERROR]', err);
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }
}

// Ghi CSDL an toàn
function writeDatabase(data) {
  ensureDatabase();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DATABASE WRITE ERROR]', err);
    return false;
  }
}

// Hàm gửi phản hồi JSON chuẩn RESTful
function sendJSON(res, statusCode, payload) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  };
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(payload));
}

// Helper phân giải body JSON bất đồng bộ
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body || body.trim() === '') {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON Payload'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// ==========================================
// SQL SERVER 2022 INTEGRATION (SSMS 20)
// ==========================================
const SQL_DB_NAME = 'TapHoa36';

function querySqlServer(sqlText, timeout = 5000) {
  try {
    const cleanSql = sqlText.replace(/\r?\n/g, ' ');
    const cmd = `sqlcmd -S . -E -d ${SQL_DB_NAME} -s "\t" -W -Q "${cleanSql}"`;
    const output = execSync(cmd, { encoding: 'utf-8', timeout });
    return { success: true, output };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function getSqlServerStatus() {
  try {
    const q = 'SET NOCOUNT ON; SELECT COUNT(*) FROM dbo.SAN_PHAM; SELECT COUNT(*) FROM dbo.HOA_DON; SELECT COUNT(*) FROM dbo.DANH_MUC;';
    const res = querySqlServer(q, 3000);
    if (!res.success) throw new Error(res.error);
    const nums = res.output.trim().split(/\r?\n/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    return {
      connected: true,
      rdbms: 'Microsoft SQL Server 2022 (Developer Edition)',
      server: 'localhost / .',
      database: SQL_DB_NAME,
      totalProducts: nums[0] !== undefined ? nums[0] : 0,
      totalOrders: nums[1] !== undefined ? nums[1] : 0,
      totalCategories: nums[2] !== undefined ? nums[2] : 0,
      managementStudio: 'SQL Server Management Studio 20 (SSMS 20)',
      connectionMode: 'Windows Authentication (Integrated Security)',
      status: 'ONLINE'
    };
  } catch (err) {
    return {
      connected: false,
      database: SQL_DB_NAME,
      error: err.message,
      status: 'OFFLINE'
    };
  }
}

function syncOrderToSqlServer(order) {
  try {
    const maHD = (order.id || 'HD_' + Date.now()).substring(0, 20);
    const thanhTien = Number(order.total) || 0;
    const pttt = order.paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR' : 'Tiền mặt';
    let sql = `SET NOCOUNT ON; IF NOT EXISTS (SELECT 1 FROM dbo.HOA_DON WHERE MaHD = '${maHD}') BEGIN INSERT INTO dbo.HOA_DON (MaHD, NgayLap, TongTienHang, ThanhTien, PhuongThucTT, MaNV) VALUES ('${maHD}', GETDATE(), ${thanhTien}, ${thanhTien}, N'${pttt}', 'admin'); END;`;
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const barcode = (item.barcode || '').substring(0, 15);
        const id = (item.id || '').substring(0, 15);
        const sl = Number(item.quantity) || Number(item.qty) || 1;
        const gia = Number(item.price) || 0;
        const tt = sl * gia;
        const rnd = Math.floor(Math.random() * 1000000);
        sql += ` DECLARE @Lo_${rnd} INT, @Sp_${rnd} VARCHAR(15); SELECT TOP 1 @Lo_${rnd} = MaLo, @Sp_${rnd} = MaSP FROM dbo.LO_HANG WHERE MaSP = '${barcode}' OR MaSP = '${id}'; IF @Lo_${rnd} IS NULL BEGIN SELECT TOP 1 @Sp_${rnd} = MaSP FROM dbo.SAN_PHAM WHERE MaSP = '${barcode}' OR MaSP = '${id}'; IF @Sp_${rnd} IS NOT NULL BEGIN SELECT TOP 1 @Lo_${rnd} = MaLo FROM dbo.LO_HANG WHERE MaSP = @Sp_${rnd}; END; END; IF @Lo_${rnd} IS NOT NULL BEGIN INSERT INTO dbo.CHI_TIET_HOA_DON (MaHD, MaSP, MaLo, SoLuong, DonGia, ThanhTien, SoTienGiam) VALUES ('${maHD}', @Sp_${rnd}, @Lo_${rnd}, ${sl}, ${gia}, ${tt}, 0); UPDATE dbo.LO_HANG SET SoLuongTon = CASE WHEN SoLuongTon >= ${sl} THEN SoLuongTon - ${sl} ELSE 0 END WHERE MaLo = @Lo_${rnd}; END;`;
      });
    }
    setTimeout(() => {
      querySqlServer(sql);
    }, 10);
  } catch (err) {
    console.warn('[SQL SERVER SYNC ORDER WARNING]', err.message);
  }
}

function mapCategoryToMaDM(category) {
  if (!category) return 'DM11';
  const c = category.toLowerCase();
  if (c.includes('thit') || c.includes('ca') || c.includes('trung') || c === 'thit_ca') return 'DM01';
  if (c.includes('rau') || c.includes('cu') || c.includes('trai_cay') || c === 'rau_cu') return 'DM02';
  if (c.includes('dau') || c.includes('mam') || c.includes('gia_vi')) return 'DM03';
  if (c.includes('gao') || c.includes('bot') || c.includes('kho')) return 'DM04';
  if (c.includes('mi') || c.includes('chao') || c.includes('pho') || c === 'mi_goi') return 'DM05';
  if (c.includes('sua') || c === 'sua_bo') return 'DM06';
  if (c.includes('dong_lanh') || c === 'hang_tuoi') return 'DM08';
  if (c.includes('nuoc') || c.includes('bia') || c === 'nuoc_ngot' || c === 'nuoc_giai_khat') return 'DM09';
  if (c.includes('ca_phe') || c.includes('tra')) return 'DM10';
  if (c.includes('banh') || c.includes('keo') || c === 'banh_keo') return 'DM11';
  if (c.includes('ve_sinh') || c.includes('hoa_pham')) return 'DM13';
  if (c.includes('me') || c.includes('be') || c === 'me_be') return 'DM14';
  return 'DM11';
}

function syncProductToSqlServer(product) {
  try {
    const maSP = (product.barcode || product.id || 'SP_' + Date.now()).substring(0, 15);
    const safeTen = (product.name || '').replace(/'/g, "''").substring(0, 145);
    const dvt = (product.unit || 'món').replace(/'/g, "''").substring(0, 18);
    const giaBan = Number(product.price) || 0;
    const tonKho = Number(product.stock) || 50;
    const giaNhap = Number(product.costPrice) || Math.round(giaBan * 0.75);
    const maDM = mapCategoryToMaDM(product.category);
    const laTuoiSong = (maDM === 'DM01' || maDM === 'DM02') ? 1 : 0;
    const expiryDays = Number(product.expiryDays) || Number(product.daysUntilExpiry) || 180;

    const sql = `SET NOCOUNT ON; 
IF NOT EXISTS (SELECT 1 FROM dbo.SAN_PHAM WHERE MaSP = '${maSP}')
BEGIN
  INSERT INTO dbo.SAN_PHAM (MaSP, TenSP, MaDanhMuc, DonViTinh, GiaBan, LaHangTuoiSong, MaNVSuaCuoi, NgaySuaCuoi) 
  VALUES ('${maSP}', N'${safeTen}', '${maDM}', N'${dvt}', ${giaBan}, ${laTuoiSong}, 'admin', GETDATE());
  INSERT INTO dbo.LO_HANG (MaSP, NgaySanXuat, HanSuDung, SoLuongTon, GiaNhap) 
  VALUES ('${maSP}', DATEADD(day, -30, GETDATE()), DATEADD(day, ${expiryDays}, GETDATE()), ${tonKho}, ${giaNhap});
END
ELSE
BEGIN
  UPDATE dbo.SAN_PHAM 
  SET TenSP = N'${safeTen}', MaDanhMuc = '${maDM}', DonViTinh = N'${dvt}', GiaBan = ${giaBan}, LaHangTuoiSong = ${laTuoiSong}, MaNVSuaCuoi = 'admin', NgaySuaCuoi = GETDATE()
  WHERE MaSP = '${maSP}';
  UPDATE dbo.LO_HANG 
  SET SoLuongTon = ${tonKho}, GiaNhap = ${giaNhap}, HanSuDung = DATEADD(day, ${expiryDays}, GETDATE())
  WHERE MaSP = '${maSP}';
END;`;

    setTimeout(() => {
      querySqlServer(sql);
    }, 10);
  } catch (err) {
    console.warn('[SQL SERVER SYNC PRODUCT WARNING]', err.message);
  }
}

// Khởi tạo máy chủ HTTP REST API
const server = http.createServer(async (req, res) => {
  // 1. Xử lý CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, 'http://' + (req.headers.host || 'localhost:3600'));
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // 2. Health check endpoint
  if (pathname === '/api/health' && method === 'GET') {
    sendJSON(res, 200, {
      status: 'ok',
      app: 'TapHoa36 Backend API',
      institution: 'Trường ĐH Giao Thông Vận Tải TP.HCM - UTH',
      student: 'Trần Ngọc Lâm - MSSV: 034206001749',
      course: 'Lập Trình Web (ThS. Trần Thịnh Mạnh Đức)',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // 3. Products Endpoints
  if (pathname === '/api/products') {
    const db = readDatabase();
    if (method === 'GET') {
      sendJSON(res, 200, db.products || []);
      return;
    }
    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.name || !body.price) {
          sendJSON(res, 400, { success: false, message: 'Thiếu tên hoặc giá sản phẩm' });
          return;
        }
        const barcode = (body.barcode || '').trim() || ('893601' + Math.floor(100000 + Math.random() * 900000));
        const id = body.id || barcode || ('prod_' + Date.now());
        const newProduct = {
          id: id,
          name: body.name.trim(),
          barcode: barcode,
          category: body.category || 'Tạp hóa',
          costPrice: Number(body.costPrice) || Math.round(Number(body.price) * 0.75),
          price: Number(body.price),
          stock: Number(body.stock) || 50,
          unit: body.unit || 'món',
          expiryDays: Number(body.expiryDays) || Number(body.daysUntilExpiry) || 180,
          branchId: body.branchId || 'branch_main'
        };

        const existingIdx = db.products.findIndex(p => p.id === newProduct.id || p.barcode === newProduct.barcode);
        if (existingIdx !== -1) {
          db.products[existingIdx] = { ...db.products[existingIdx], ...newProduct };
        } else {
          db.products.unshift(newProduct);
        }
        writeDatabase(db);
        syncProductToSqlServer(newProduct);
        sendJSON(res, 201, { success: true, product: newProduct });
        return;
      } catch (err) {
        sendJSON(res, 400, { success: false, message: err.message });
        return;
      }
    }
    if (method === 'DELETE') {
      const prodId = parsedUrl.searchParams.get('id') || '';
      if (!prodId) {
        sendJSON(res, 400, { success: false, message: 'Thiếu mã sản phẩm cần xóa' });
        return;
      }
      const existingIdx = db.products.findIndex(p => p.id === prodId || p.barcode === prodId);
      if (existingIdx !== -1) {
        const removed = db.products.splice(existingIdx, 1)[0];
        writeDatabase(db);
        const maSP = (removed.barcode || removed.id || prodId).substring(0, 15);
        querySqlServer(`SET NOCOUNT ON; DELETE FROM dbo.CHI_TIET_HOA_DON WHERE MaSP = '${maSP}'; DELETE FROM dbo.LO_HANG WHERE MaSP = '${maSP}'; DELETE FROM dbo.SAN_PHAM WHERE MaSP = '${maSP}';`);
        sendJSON(res, 200, { success: true, message: 'Đã xóa sản phẩm thành công', id: prodId });
        return;
      }
      sendJSON(res, 404, { success: false, message: 'Không tìm thấy sản phẩm' });
      return;
    }
  }

  // 4. Orders Endpoints
  if (pathname === '/api/orders') {
    const db = readDatabase();
    if (method === 'GET') {
      sendJSON(res, 200, db.orders || []);
      return;
    }
    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
          sendJSON(res, 400, { success: false, message: 'Hóa đơn rỗng không có mặt hàng nào' });
          return;
        }

        // Tính toán tổng tiền và trừ kho
        let calculatedTotal = 0;
        body.items.forEach(item => {
          calculatedTotal += (Number(item.price) || 0) * (Number(item.quantity) || 1);
          // Cập nhật trừ kho nếu có trong CSDL
          const prodInDb = db.products.find(p => p.id === item.id || p.barcode === item.barcode);
          if (prodInDb) {
            prodInDb.stock = Math.max(0, prodInDb.stock - (Number(item.quantity) || 1));
          }
        });

        const newOrder = {
          id: body.id || 'HD_' + Date.now(),
          branchId: body.branchId || 'branch_main',
          items: body.items,
          total: body.total !== undefined ? Number(body.total) : calculatedTotal,
          paymentMethod: body.paymentMethod || 'cash',
          customerName: body.customerName || 'Khách Vãng Lai',
          customerPhone: body.customerPhone || '',
          debtAmount: Number(body.debtAmount) || 0,
          createdAt: new Date().toISOString()
        };

        db.orders.unshift(newOrder);
        writeDatabase(db);
        syncOrderToSqlServer(newOrder);
        sendJSON(res, 201, {
          success: true,
          orderId: newOrder.id,
          total: newOrder.total,
          order: newOrder
        });
        return;
      } catch (err) {
        sendJSON(res, 400, { success: false, message: err.message });
        return;
      }
    }
  }

  // 5. Branches Endpoints (Tự tạo và quản lý chi nhánh UTH)
  if (pathname === '/api/branches') {
    const db = readDatabase();
    if (method === 'GET') {
      sendJSON(res, 200, db.branches || []);
      return;
    }
    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.name) {
          sendJSON(res, 400, { success: false, message: 'Thiếu tên chi nhánh' });
          return;
        }
        const newBranch = {
          id: body.id || 'branch_' + Date.now(),
          name: body.name,
          address: body.address || '02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh, Việt Nam',
          type: body.type || 'store',
          createdAt: new Date().toISOString()
        };
        db.branches.push(newBranch);
        writeDatabase(db);
        sendJSON(res, 201, { success: true, branch: newBranch });
        return;
      } catch (err) {
        sendJSON(res, 400, { success: false, message: err.message });
        return;
      }
    }
  }

  // 6. Delete Branch Endpoint
  if (pathname.startsWith('/api/branches/') && method === 'DELETE') {
    const branchId = pathname.replace('/api/branches/', '').trim();
    if (branchId === 'branch_main') {
      sendJSON(res, 403, { success: false, message: 'Không thể xóa cơ sở chính UTH' });
      return;
    }
    const db = readDatabase();
    const initialLen = db.branches.length;
    db.branches = db.branches.filter(b => b.id !== branchId);
    if (db.branches.length === initialLen) {
      sendJSON(res, 404, { success: false, message: 'Không tìm thấy chi nhánh cần xóa' });
      return;
    }
    writeDatabase(db);
    sendJSON(res, 200, { success: true, message: 'Đã xóa chi nhánh thành công' });
    return;
  }

  // 7. SQL Server Endpoints (Direct SSMS 20 Data Bridge)
  if (pathname === '/api/sql/status' && method === 'GET') {
    const status = getSqlServerStatus();
    sendJSON(res, 200, status);
    return;
  }

  if (pathname === '/api/sql/orders' && method === 'GET') {
    const q = `SET NOCOUNT ON; SELECT hd.MaHD, CONVERT(VARCHAR(19), hd.NgayLap, 120) AS NgayLap, hd.ThanhTien, hd.PhuongThucTT, ISNULL(hd.MaNV, 'admin') AS MaNV, ct.MaSP, ct.SoLuong, ct.DonGia, ct.ThanhTien AS Subtotal FROM dbo.HOA_DON hd LEFT JOIN dbo.CHI_TIET_HOA_DON ct ON hd.MaHD = ct.MaHD ORDER BY hd.NgayLap DESC;`;
    const resSql = querySqlServer(q);
    if (!resSql.success) {
      sendJSON(res, 500, { success: false, error: resSql.error });
      return;
    }
    const lines = resSql.output.trim().split(/\r?\n/).filter(l => l.trim().length > 0 && !l.startsWith('----'));
    const rows = [];
    if (lines.length > 1) {
      const headers = lines[0].split('\t');
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split('\t');
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = parts[idx]; });
        rows.push(obj);
      }
    }
    sendJSON(res, 200, { success: true, total: rows.length, orders: rows });
    return;
  }

  if (pathname === '/api/sql/products' && method === 'GET') {
    const q = `SET NOCOUNT ON; SELECT TOP 100 MaSP, TenSP, TenDanhMuc, DonViTinh, GiaBan, GiaKhuyenMai, TongTonKho FROM dbo.v_SanPhamSieuThi ORDER BY MaSP ASC;`;
    const resSql = querySqlServer(q);
    if (!resSql.success) {
      sendJSON(res, 500, { success: false, error: resSql.error });
      return;
    }
    const lines = resSql.output.trim().split(/\r?\n/).filter(l => l.trim().length > 0 && !l.startsWith('----'));
    const rows = [];
    if (lines.length > 1) {
      const headers = lines[0].split('\t');
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split('\t');
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = parts[idx]; });
        rows.push(obj);
      }
    }
    sendJSON(res, 200, { success: true, count: rows.length, products: rows });
    return;
  }

  // Phục vụ tệp tĩnh (Frontend SPA Static Files)
  if (method === 'GET') {
    let filePath = path.join(__dirname, pathname === '/' ? 'admin.html' : pathname);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html; charset=utf-8',
          '.js': 'application/javascript; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.json': 'application/json; charset=utf-8',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        sendJSON(res, 404, { error: 'Not Found', path: pathname });
      }
    });
    return;
  }

  // Fallback 404
  sendJSON(res, 404, { error: 'Endpoint Not Found', method, pathname });
});

// Xuất server hoặc khởi chạy trực tiếp
if (require.main === module) {
  server.listen(PORT, () => {
    const sqlStatus = getSqlServerStatus();
    console.log(`====================================================`);
    console.log(`🚀 Tạp Hóa 36 Node.js REST API Server đang chạy!`);
    console.log(`📍 Cổng Web: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💾 SQL Server: ${sqlStatus.status} (${sqlStatus.database || SQL_DB_NAME} - ${sqlStatus.totalProducts || 0} SP)`);
    console.log(`📦 REST Endpoints: /api/products, /api/orders, /api/branches, /api/sql/status`);
    console.log(`🏛️ Đơn vị: Trường ĐH Giao Thông Vận Tải TP.HCM - UTH`);
    console.log(`====================================================`);
  });
}

module.exports = { server, readDatabase, writeDatabase, ensureDatabase, PORT };
