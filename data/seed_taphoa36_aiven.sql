-- ========================================================
-- DỰ ÁN TẠP HÓA 36 (UTH) - SEED DATA 300+ SẢN PHẨM THẬT
-- Sinh viên: Trần Ngọc Lâm - Nhóm 11
-- ========================================================

-- 1. BẢNG CHI NHÁNH
CREATE TABLE IF NOT EXISTS branches (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'branch',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO branches (id, name, address, type)
VALUES ('branch_main', 'Cửa Hàng Chính - Tạp Hóa 36 (UTH)', 'Trường ĐH Giao Thông Vận Tải TP.HCM - UTH, 02 Võ Oanh, Thạnh Mỹ Tây, Hồ Chí Minh', 'main')
ON CONFLICT (id) DO NOTHING;

-- 2. BẢNG SẢN PHẨM
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    barcode VARCHAR(50),
    category VARCHAR(100),
    cost_price NUMERIC(12, 2) DEFAULT 0,
    price NUMERIC(12, 2) NOT NULL,
    stock INT DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'cái',
    expiry_days INT DEFAULT 180,
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE SET NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG HÓA ĐƠN
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE SET NULL,
    customer_phone VARCHAR(20),
    customer_name VARCHAR(100),
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'CASH',
    status VARCHAR(50) DEFAULT 'COMPLETED',
    items JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. IMPORT 300+ SẢN PHẨM THẬT VÀO POSTGRESQL
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936236471302', 'Omachi Mì ly hải sản chua cay 66gr', '8936236471302', 'Thực phẩm ăn liền', 10500, 14000, 57, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902888183447', 'Dars Socola đen 42g', '4902888183447', 'Bánh kẹo & Ăn vặt', 25000, 33500, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029425956', 'O''Star Snack Khoai Tây Vị Tự Nhiên', '8936029425956', 'Bánh kẹo & Ăn vặt', 8500, 11000, 69, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001720409', 'Chupa Chups Kẹo dẻo Hươu cao cổ cầu vồng', '8935001720409', 'Bánh kẹo & Ăn vặt', 8500, 11500, 23, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001720416', 'Chupa Chups Kẹo dẻo Hươu cao cổ cầu vồng', '8935001720416', 'Bánh kẹo & Ăn vặt', 10000, 13000, 40, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6974936461768', 'Kẹo marshmallow ovaltine matcha 25gr', '6974936461768', 'Bánh kẹo & Ăn vặt', 9000, 12000, 42, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976611080394', 'Umiki Bánh bông lan tam giác sữa dâu', '6976611080394', 'Bánh kẹo & Ăn vặt', 16500, 22000, 99, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047443772', 'Kenju Bánh quy rau củ 192gr', '8936047443772', 'Bánh kẹo & Ăn vặt', 13000, 17500, 25, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938506170779', 'Karo Bánh bơ trứng giòn 270g', '8938506170779', 'Bánh kẹo & Ăn vặt', 12000, 16000, 22, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047440290', 'Kenju Bánh quy vị tôm 192g', '8936047440290', 'Bánh kẹo & Ăn vặt', 6000, 8000, 59, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_3180293501426', 'Syrup Giffard Bạc Hà Trắng (Ice mint) - Chai 1L', '3180293501426', 'Đồ uống & Trà Cà phê', 88000, 117500, 62, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8991002304277', 'Kẹo sữa Relaxa Cuwi', '8991002304277', 'Bánh kẹo & Ăn vặt', 10000, 13500, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_TM00109', 'Đường vàng 12kg/cây', 'TM00109', 'Gia vị & Nước chấm', 11500, 15000, 51, 'bao', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_TM00106', 'CỐT LẨU THÁI ĐẬM ĐẶC 1KG', 'TM00106', 'Gia vị & Nước chấm', 14500, 19000, 93, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938506170748', 'Karo Bánh Tươi Sợi Gà 26G', '8938506170748', 'Bánh kẹo & Ăn vặt', 15500, 20500, 66, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938506170892', 'Karo Bánh Tươi Sợi Gà 26G', '8938506170892', 'Bánh kẹo & Ăn vặt', 15000, 20000, 26, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850332241365', 'Rosy Bánh quy kem chanh', '8850332241365', 'Bánh kẹo & Ăn vặt', 13500, 18000, 47, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_TM00070', 'Gói quà Trung thu 26 - PREMIUM MIX - LM (1 phần gồm: 5 Bánh trung thu, 1 Bịch trà, 1 Bộ dao nĩa)', 'TM00070', 'Bánh kẹo & Ăn vặt', 180000, 240000, 69, 'phần', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047449682', 'Bánh trung thu Thập cẩm Gà quay xốt XO', '8936047449682', 'Bánh kẹo & Ăn vặt', 204500, 272500, 93, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047449231', 'Bánh trung thu Hạt sen Macca', '8936047449231', 'Bánh kẹo & Ăn vặt', 142000, 189500, 70, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563106263', 'Siukay Mì hương vị hải sản ớt ma 128g', '8934563106263', 'Thực phẩm ăn liền', 7000, 9500, 38, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8807354215331', 'Nuts Holic Hạt hạnh nhân Hàn Quốc vị mật ong 30gr', '8807354215331', 'Bánh kẹo & Ăn vặt', 13000, 17000, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_TM00067', 'Nuts Holic Hạt hạnh nhân Hàn Quốc vị mật ong 30gr', 'TM00067', 'Bánh kẹo & Ăn vặt', 17500, 23500, 71, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8807354215317', 'Nuts Holic Hạt hạnh nhân Hàn Quốc vị dâu 30gr', '8807354215317', 'Bánh kẹo & Ăn vặt', 16000, 21000, 36, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_TM00069', 'Nuts Holic Hạt hạnh nhân Hàn Quốc vị dâu 30gr', 'TM00069', 'Bánh kẹo & Ăn vặt', 15000, 20000, 28, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034878921', 'Ponnie Xúc Xích Tiệt Trùng nhân Phô mai 58 gr', '8936034878921', 'Thực phẩm ăn liền', 11000, 14500, 27, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047443925', 'Hộp quà - Phúc Nguyệt Sơn', '8936047443925', 'Bánh kẹo & Ăn vặt', 199000, 265500, 91, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047444878', 'Hộp quà - Thu Thanh An', '8936047444878', 'Bánh kẹo & Ăn vặt', 155500, 207000, 92, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001714774', 'Chupa Chups Kẹo dẻo Sour Belt hương trái cây 1M 45g', '8935001714774', 'Bánh kẹo & Ăn vặt', 17000, 22500, 39, 'dây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001713074', 'Chupa Chups Kẹo dẻo Sour Belt hương trái cây 8.4g', '8935001713074', 'Bánh kẹo & Ăn vặt', 11500, 15000, 85, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP011413', 'Chupa Chups Kẹo dẻo Sour Belt hương trái cây 8.4g', 'SP011413', 'Bánh kẹo & Ăn vặt', 12500, 16500, 39, 'combo2', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP011414', 'Chupa Chups Kẹo dẻo Sour Belt hương trái cây 8.4g', 'SP011414', 'Bánh kẹo & Ăn vặt', 15500, 20500, 40, 'combo10', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047443949', 'Hộp quà - Phúc Thanh Yên', '8936047443949', 'Bánh kẹo & Ăn vặt', 173500, 231500, 93, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938552123675', 'Chân gà bà Tuyết', '8938552123675', 'Bánh kẹo & Ăn vặt', 10000, 13500, 57, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP011411', 'Chân gà bà Tuyết', 'SP011411', 'Bánh kẹo & Ăn vặt', 13500, 18000, 48, 'combo5', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP011412', 'Chân gà bà Tuyết', 'SP011412', 'Bánh kẹo & Ăn vặt', 13000, 17500, 44, 'combo10', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938532962515', 'Kenju Nougat kem dẻo 186g', '8938532962515', 'Bánh kẹo & Ăn vặt', 8000, 10500, 80, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047444250', 'Kenju nhân gà phô mai nướng 216g', '8936047444250', 'Bánh kẹo & Ăn vặt', 11000, 14500, 88, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047441563', 'Hộp quà - Thu Phú Quý', '8936047441563', 'Bánh kẹo & Ăn vặt', 208000, 277000, 32, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8998866635134', 'Sedaap Mì trộn vị gà nướng lá chanh 89gr', '8998866635134', 'Thực phẩm ăn liền', 5000, 6500, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8998866205054', 'Sedaap Mì trộn vị gà nướng lá chanh 89gr', '8998866205054', 'Thực phẩm ăn liền', 8500, 11000, 31, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936024241667', 'MacCoffee Caphe Phố sữa đá 240gr', '8936024241667', 'Đồ uống & Trà Cà phê', 53000, 70500, 52, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935024123287', 'G7 Café Trung Nguyên 3in1', '8935024123287', 'Đồ uống & Trà Cà phê', 39500, 52500, 89, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935039572520', 'Aji-Mayo Xốt Mayonnaisse vị nguyên bản 130gr', '8935039572520', 'Gia vị & Nước chấm', 13000, 17500, 21, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935039513257', 'Aji - Quick Gia vị nêm sẵn lẩu thái 50gr', '8935039513257', 'Gia vị & Nước chấm', 14000, 18500, 36, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935039514223', 'Aji - Quick Bột tẩm khô chiên giòn 42gr', '8935039514223', 'Gia vị & Nước chấm', 14500, 19000, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934579100408', 'Miliket Mì giấy sate 75gr', '8934579100408', 'Thực phẩm ăn liền', 7000, 9500, 37, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637514284', 'Cholimex Sate ớt thủy tinh 150gr', '8934637514284', 'Gia vị & Nước chấm', 21500, 28500, 95, 'hủ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935311120661', 'VIFON Bột canh', '8935311120661', 'Gia vị & Nước chấm', 17000, 22500, 86, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935311110068', 'VIFON Phở Gà gói 75gr', '8935311110068', 'Thực phẩm ăn liền', 5000, 6500, 68, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935311110044', 'VIFON Phở Bò gói 75gr', '8935311110044', 'Thực phẩm ăn liền', 8000, 10500, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935311110303', 'VIFON Phở Thịt Gà tô 120gr', '8935311110303', 'Thực phẩm ăn liền', 5500, 7500, 71, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935311110280', 'VIFON Phở Thịt Bò tô 120gr', '8935311110280', 'Thực phẩm ăn liền', 8500, 11000, 47, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001718369', 'Alpenliebe Kẹo mút hương kem quả mọng 9.5g', '8935001718369', 'Bánh kẹo & Ăn vặt', 3500, 4500, 49, 'que', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001708469', 'Alpenliebe Kẹo mút hương Dâu kem 9.5g', '8935001708469', 'Bánh kẹo & Ăn vặt', 3500, 4500, 72, 'que', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001708452', 'Alpenliebe Kẹo mút sữa careamel 9.5g', '8935001708452', 'Bánh kẹo & Ăn vặt', 2500, 3500, 27, 'que', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936236472248', 'Omachi Mì cua xốt ớt Singapore', '8936236472248', 'Thực phẩm ăn liền', 5500, 7500, 68, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936047447022', 'Majestic Bánh Cookies thập cẩm HT 382gr', '8936047447022', 'Bánh kẹo & Ăn vặt', 8500, 11000, 70, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938532962720', 'Festa Bánh mì hoa cúc ngàn lớp túi 120g', '8938532962720', 'Bánh kẹo & Ăn vặt', 7000, 9000, 60, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001719106', 'Alpenliebe Kẹo không nhân cà phê sữa', '8935001719106', 'Bánh kẹo & Ăn vặt', 37000, 49000, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001703129', 'Alpenliebe Kẹo không nhân Dâu kem', '8935001703129', 'Bánh kẹo & Ăn vặt', 13500, 18000, 62, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001701699', 'Alpenliebe Kẹo không nhân sữa caramen', '8935001701699', 'Bánh kẹo & Ăn vặt', 14500, 19000, 87, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_TM00059', 'Chupa Chups Kẹo mút hương hỗn hợp sắc màu', 'TM00059', 'Bánh kẹo & Ăn vặt', 3000, 4000, 40, 'que', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001720560', 'Chupa Chups Kẹo mút hương hỗn hợp sắc màu', '8935001720560', 'Bánh kẹo & Ăn vặt', 4000, 5000, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP011417', 'Chupa Chups Kẹo mút hương hỗn hợp sắc màu', 'SP011417', 'Bánh kẹo & Ăn vặt', 3000, 4000, 75, 'combo2', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP011418', 'Chupa Chups Kẹo mút hương hỗn hợp sắc màu', 'SP011418', 'Bánh kẹo & Ăn vặt', 3000, 4000, 33, 'combo10', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_TM00058', 'Chupa Chups Kẹo mút hương hỗn hợp', 'TM00058', 'Bánh kẹo & Ăn vặt', 3000, 4000, 68, 'que', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001720553', 'Chupa Chups Kẹo mút hương hỗn hợp', '8935001720553', 'Bánh kẹo & Ăn vặt', 2500, 3000, 88, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP011415', 'Chupa Chups Kẹo mút hương hỗn hợp', 'SP011415', 'Bánh kẹo & Ăn vặt', 2500, 3500, 34, 'combo2', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP011416', 'Chupa Chups Kẹo mút hương hỗn hợp', 'SP011416', 'Bánh kẹo & Ăn vặt', 4000, 5000, 48, 'combo10', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001719977', 'Mentos Kẹo quả mọng', '8935001719977', 'Bánh kẹo & Ăn vặt', 15000, 20000, 67, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001711483', 'Mentos Kẹo Cầu Vồng', '8935001711483', 'Bánh kẹo & Ăn vặt', 15000, 20000, 22, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001707165', 'Mentos Kẹo Bạc hà', '8935001707165', 'Bánh kẹo & Ăn vặt', 13000, 17500, 50, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001718567', 'Alpenliebe Kẹo mềm 2 chew Chanh dây hạt chia gói', '8935001718567', 'Bánh kẹo & Ăn vặt', 13000, 17500, 50, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001718130', 'Alpenliebe Kẹo mềm 2 chew Chanh dây hạt chia', '8935001718130', 'Bánh kẹo & Ăn vặt', 11000, 14500, 43, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001713760', 'Alpenliebe Kẹo mềm 2 chew Dâu gói', '8935001713760', 'Bánh kẹo & Ăn vặt', 8500, 11000, 69, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001712411', 'Alpenliebe Kẹo mềm 2 chew Dâu', '8935001712411', 'Bánh kẹo & Ăn vặt', 12000, 16000, 52, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001712343', 'Alpenliebe Kẹo mềm 2 chew Nho gói', '8935001712343', 'Bánh kẹo & Ăn vặt', 13000, 17000, 75, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001712336', 'Alpenliebe Kẹo mềm 2 chew Nho', '8935001712336', 'Bánh kẹo & Ăn vặt', 9000, 12000, 63, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001719892', 'Alpenlibe Kẹo cứng hương café sữa', '8935001719892', 'Bánh kẹo & Ăn vặt', 14000, 18500, 65, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001704300', 'Alpenlibe Kẹo cứng Golia Active plus nhân syro thảo dược', '8935001704300', 'Bánh kẹo & Ăn vặt', 19000, 25000, 35, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001714057', 'Alpenlibe Kẹo cứng bạc hà nhân socola', '8935001714057', 'Bánh kẹo & Ăn vặt', 36000, 48000, 33, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001714316', 'Alpenlibe Kẹo cứng xoài muối ớt', '8935001714316', 'Bánh kẹo & Ăn vặt', 18000, 24000, 33, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001703181', 'Alpenlibe Kẹo cứng Dâu kem', '8935001703181', 'Bánh kẹo & Ăn vặt', 16000, 21500, 39, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001704188', 'Alpenlibe Kẹo cứng sữa caramen', '8935001704188', 'Bánh kẹo & Ăn vặt', 10000, 13000, 25, 'thỏi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001720010', 'Alpenlibe Tim nho nhí nhảnh 24gr', '8935001720010', 'Bánh kẹo & Ăn vặt', 9000, 12000, 51, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001719052', 'Alpenlibe Kẹo dẻo Tim đào ngọt ngào 24gr', '8935001719052', 'Bánh kẹo & Ăn vặt', 18000, 24000, 26, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001718857', 'Alpenlibe Kẹo dẻo Biển xanh long lanh 24gr', '8935001718857', 'Bánh kẹo & Ăn vặt', 7500, 10000, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001720423', 'Alpenlibe Kẹo dẻo Vũ trụ kỳ thú 24gr', '8935001720423', 'Bánh kẹo & Ăn vặt', 15000, 20000, 96, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001719489', 'Chupa Chups Kẹo dẻo maxi tubies 104gr', '8935001719489', 'Bánh kẹo & Ăn vặt', 15000, 20000, 29, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001714361', 'Chupa Chups Kẹo dẻo Bites 24gr', '8935001714361', 'Bánh kẹo & Ăn vặt', 8500, 11000, 40, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001717706', 'Chupa Chups Kẹo dẻo top mix 24gr', '8935001717706', 'Bánh kẹo & Ăn vặt', 18000, 24000, 48, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001714545', 'Chupa Chups Kẹo dẻo ống ngắn cầu vồng có nhân 24gr', '8935001714545', 'Bánh kẹo & Ăn vặt', 12000, 16000, 29, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001715856', 'Chupa Chups Kẹo dẻo sâu 24gr', '8935001715856', 'Bánh kẹo & Ăn vặt', 9500, 12500, 56, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001713555', 'Chupa Chups Kẹo dẻo vị Cola 24gr', '8935001713555', 'Bánh kẹo & Ăn vặt', 8500, 11000, 25, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001713548', 'Chupa Chups Kẹo dẻo gấu Panda 24gr', '8935001713548', 'Bánh kẹo & Ăn vặt', 14500, 19000, 65, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934760129256', 'Tipo Cracker Rau Củ Chà Bông 265g', '8934760129256', 'Bánh kẹo & Ăn vặt', 17500, 23500, 70, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934760129249', 'Tipo Cracker Rau Củ Chà Bông 132g', '8934760129249', 'Bánh kẹo & Ăn vặt', 9000, 12000, 42, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934760210336', 'Tipo Bánh Trứng Sữa Chua Rắc Hạt Điều 126g', '8934760210336', 'Bánh kẹo & Ăn vặt', 14500, 19000, 87, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934760039142', 'Tipo Bánh Kem Xốp Phô Mai 180g', '8934760039142', 'Bánh kẹo & Ăn vặt', 9000, 12000, 61, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934760210299', 'Tipo Bánh trứng kem sữa chua chanh leo 250gr', '8934760210299', 'Bánh kẹo & Ăn vặt', 10000, 13000, 39, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934760121861', 'Kendo Bánh trứng cuộn vị Socola Dừa 90g', '8934760121861', 'Bánh kẹo & Ăn vặt', 27000, 36000, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934760211913', 'Tipo Bánh trứng nướng 115g', '8934760211913', 'Bánh kẹo & Ăn vặt', 11000, 14500, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934760219278', 'Tipo Bánh trứng nướng 39g', '8934760219278', 'Bánh kẹo & Ăn vặt', 12000, 16000, 68, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935311110624', 'Vifon Cháo thịt bằm 70gr', '8935311110624', 'Thực phẩm ăn liền', 8000, 10500, 24, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8994834009754', 'Enaak snack mì vị BBQ', '8994834009754', 'Bánh kẹo & Ăn vặt', 5000, 6500, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400428', 'Bento Snack Mực Vị Cay Nồng 5G', '8935342400428', 'Bánh kẹo & Ăn vặt', 6500, 8500, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036021646', 'O''Star Snack Ngôi Sao Vị Tảo Biển 53G', '8936036021646', 'Bánh kẹo & Ăn vặt', 15000, 20000, 64, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036021653', 'O''Star Snack Ngôi Sao Vị Kim Chi 53G', '8936036021653', 'Bánh kẹo & Ăn vặt', 14000, 18500, 79, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_TM00045', 'Bánh quy hạnh nhân lát', 'TM00045', 'Bánh kẹo & Ăn vặt', 11500, 15500, 59, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221048076', 'Chinsu Nước mắm Nam Ngư 500Ml', '8936221048076', 'Gia vị & Nước chấm', 35000, 46500, 91, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936241860078', 'Zennut Hạt hướng dương Vị Vỏ Quýt 70G', '8936241860078', 'Bánh kẹo & Ăn vặt', 8000, 10500, 71, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936241860092', 'Zennut Hạt hướng dương Vị Hoa Nhài 70G', '8936241860092', 'Bánh kẹo & Ăn vặt', 14000, 18500, 62, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936241860085', 'Zennut Hạt hướng dương Vị Sữa 70G', '8936241860085', 'Bánh kẹo & Ăn vặt', 9000, 12000, 65, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936241860047', 'Zennut Hạt Hướng Dương Vị Vỏ Quýt 30G', '8936241860047', 'Bánh kẹo & Ăn vặt', 17000, 22500, 32, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936241860061', 'Zennut Hạt Hướng Dương Vị Hoa Nhài 30G', '8936241860061', 'Bánh kẹo & Ăn vặt', 16500, 22000, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936241860054', 'Zennut Hạt Hướng Dương Vị Sữa 30G', '8936241860054', 'Bánh kẹo & Ăn vặt', 16000, 21500, 21, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051616', 'Ottogi Mì YEUL Cay', '8936049051616', 'Thực phẩm ăn liền', 8000, 10500, 24, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051371', 'Ottogi Mini Mì Jin Cay 80G', '8936049051371', 'Thực phẩm ăn liền', 4500, 6000, 75, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051623', 'Ottogi Mì Kim Chi', '8936049051623', 'Thực phẩm ăn liền', 5500, 7500, 61, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051630', 'Ottogi Mì Bò Hầm Vị Cay', '8936049051630', 'Thực phẩm ăn liền', 8500, 11000, 40, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_31146151905', 'Nongshim Mì Champong Vị Mực 124G', '31146151905', 'Thực phẩm ăn liền', 5000, 6500, 98, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935032201304', 'Tuấn Đạt Trái Cây Thập Cẩm Sấy', '8935032201304', 'Bánh kẹo & Ăn vặt', 10000, 13000, 55, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216098145', 'Haribo Kẹo Dẻo Happy Col', '8691216098145', 'Bánh kẹo & Ăn vặt', 10500, 14000, 83, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6921716535034', 'Hong Tai Kee Quả Thanh Mai Sấy Dẻ', '6921716535034', 'Bánh kẹo & Ăn vặt', 11500, 15000, 79, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6921716535027', 'Hong Tai Kee Mận Anh Đào Sấy Dẻ', '6921716535027', 'Bánh kẹo & Ăn vặt', 15000, 20000, 95, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976949681102', 'Guodudu Đào Vàng Sấy Dẻo', '6976949681102', 'Bánh kẹo & Ăn vặt', 15000, 20000, 80, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976949681119', 'Guodudu Mơ Sấy Dẻ', '6976949681119', 'Bánh kẹo & Ăn vặt', 12000, 16000, 82, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410418', 'Snack Tôm Cuộn Hoàng Gia', '8936204410418', 'Bánh kẹo & Ăn vặt', 8500, 11000, 31, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410425', 'Snack Bắp Nướng Hoàng Gia', '8936204410425', 'Bánh kẹo & Ăn vặt', 8500, 11500, 91, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_7622202838125', 'Oreo Bánh Quy Nhân Vị Bánh Nướng Đường Nâu 105Gr', '7622202838125', 'Bánh kẹo & Ăn vặt', 10500, 14000, 93, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036029376', 'C''Est Bon! Sandwich Sốt Bơ Phô Mai Chà Bông 5 Cái', '8936036029376', 'Bánh kẹo & Ăn vặt', 11500, 15000, 59, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029425802', 'C''Est Bon! Mochi Cốm Dừa 5 Cái', '8936029425802', 'Bánh kẹo & Ăn vặt', 9000, 12000, 76, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029424997', 'Orion Bánh Con Cá Bống Bang Cốm Xanh Đậu Đỏ 5 Cái', '8936029424997', 'Bánh kẹo & Ăn vặt', 7500, 10000, 22, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029421781', 'Orion Bánh Con Cá Bống Bang Socola Đậu Đỏ 5 Cái', '8936029421781', 'Bánh kẹo & Ăn vặt', 19500, 26000, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936142210033', 'Bông Lan Nướng Dừa 60G', '8936142210033', 'Bánh kẹo & Ăn vặt', 10000, 13000, 28, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936142210408', 'Bánh Pound Nho 50G', '8936142210408', 'Bánh kẹo & Ăn vặt', 16000, 21000, 81, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936142211252', 'Bánh Pound Hồng Trà Vanilla 50G', '8936142211252', 'Bánh kẹo & Ăn vặt', 13000, 17000, 83, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936142210590', 'Bông Lan Chà Bông 60G', '8936142210590', 'Bánh kẹo & Ăn vặt', 15500, 20500, 63, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936142210026', 'Bông Lan Nướng Socola 60G', '8936142210026', 'Bánh kẹo & Ăn vặt', 19000, 25500, 62, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936142210279', 'Bông Lan Nướng Phô Mai 60G', '8936142210279', 'Bánh kẹo & Ăn vặt', 17500, 23500, 30, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563221157', 'Nhớ Phở Bò 74G', '8934563221157', 'Thực phẩm ăn liền', 8000, 10500, 65, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936055280642', 'Meizan Bột Mì Đa Dụng Cao Cấp 500G', '8936055280642', 'Gạo, Bột & Đồ khô', 8500, 11000, 42, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936231190154', 'Meizan Bột Bắp 150G', '8936231190154', 'Gạo, Bột & Đồ khô', 14500, 19500, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938509627010', 'Meizan Bột Chiên Giòn 150Gr', '8938509627010', 'Gạo, Bột & Đồ khô', 20000, 26500, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938509627379', 'Meizan Bột Nếp 400Gr', '8938509627379', 'Gạo, Bột & Đồ khô', 17500, 23000, 78, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938509627263', 'Meizan Bột Gạo 400Gr', '8938509627263', 'Gạo, Bột & Đồ khô', 14500, 19500, 45, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936231190123', 'Meizan Bột Năng 400G', '8936231190123', 'Gạo, Bột & Đồ khô', 19000, 25500, 31, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938509627171', 'Meizan Nui Cao Cấp Chữ C 400G', '8938509627171', 'Thực phẩm ăn liền', 5500, 7500, 40, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938509627119', 'Meizan Nui Cao Cấp 400Gr', '8938509627119', 'Thực phẩm ăn liền', 5000, 6500, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938509627270', 'Meizan Nui Xoắn Cao Cấp 300Gr', '8938509627270', 'Thực phẩm ăn liền', 7000, 9500, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938516870355', 'Meizan Gạo Nàng Thơm Hảo Hạng 5Kg', '8938516870355', 'Thực phẩm ăn liền', 134500, 179000, 57, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804030913', 'Milo Sữa 3 Trong 1 Dạng Dây (10+1) 22G', '8934804030913', 'Đồ uống & Trà Cà phê', 10000, 13000, 21, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP000048', 'Milo Sữa 3 Trong 1 Dạng Dây (10+1) 22G', 'SP000048', 'Đồ uống & Trà Cà phê', 11500, 15500, 70, 'dây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804044385', 'Nescafe Cà Phê Hòa Tan 3In1 Vị Rang Đậm 16G', '8934804044385', 'Đồ uống & Trà Cà phê', 54500, 72500, 64, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804051512', 'Nescafe Cà Phê Hòa Tan 3In1 Vị Rang Đậm 16G', '8934804051512', 'Đồ uống & Trà Cà phê', 45500, 60500, 46, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804030494', 'Nescafe Cà Phê Hòa Tan Vị Nguyên Bản 16G', '8934804030494', 'Đồ uống & Trà Cà phê', 42000, 56000, 38, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804051345', 'Nescafe Cà Phê Hòa Tan Vị Nguyên Bản 16G', '8934804051345', 'Đồ uống & Trà Cà phê', 36000, 48000, 30, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804030692', 'Nescafe Cà Phê Sữa Đá Hộp 10 Gói 24G', '8934804030692', 'Đồ uống & Trà Cà phê', 42000, 56000, 52, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804027388', 'Nescafe Café Việt Hộp 15 Gói X 16G', '8934804027388', 'Đồ uống & Trà Cà phê', 54000, 72000, 85, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938531133633', 'Cộng Cà Phê Sữa 204G', '8938531133633', 'Đồ uống & Trà Cà phê', 41500, 55500, 27, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563065249', 'Hảo Hảo Muối Chấm Tôm Chua Cay 120G', '8934563065249', 'Gia vị & Nước chấm', 17500, 23000, 38, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934988070101', 'Meizan Bơ Thực Vật 80G', '8934988070101', 'Gia vị & Nước chấm', 18500, 24500, 68, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934988020014', 'Simply Dầu Đậu Nành 400Ml', '8934988020014', 'Gia vị & Nước chấm', 11500, 15500, 40, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934988030020', 'Dầu Cái Lân 1 Lít', '8934988030020', 'Gia vị & Nước chấm', 22500, 30000, 63, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936134360067', 'Nam Dương Nước Tương Đậu Nành Lên Men 280Ml', '8936134360067', 'Gia vị & Nước chấm', 23500, 31000, 46, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936134362573', 'Nam Dương Sốt Dầu Dấm 250G', '8936134362573', 'Gia vị & Nước chấm', 21000, 28000, 53, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936134363648', 'Simply Xốt Mayonnaise Hương Gạo Rang 230Gr', '8936134363648', 'Gia vị & Nước chấm', 14000, 18500, 84, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680042895', 'Solite Bánh Cuộn Kem Vị Dâu 378G', '8934680042895', 'Bánh kẹo & Ăn vặt', 14500, 19000, 46, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_7622300442507', 'Oreo Bánh Quy Nhân Kem Việt Quất Lạnh 110.4G', '7622300442507', 'Bánh kẹo & Ăn vặt', 9500, 12500, 87, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8992760223015', 'Oreo Bánh Quy Nhân Kem Socola 110.4G', '8992760223015', 'Bánh kẹo & Ăn vặt', 26500, 35000, 83, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8992760221028', 'Oreo Bánh Quy Nhân Kem Vani 110.4G', '8992760221028', 'Bánh kẹo & Ăn vặt', 10000, 13000, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902777006284', 'Meiji Sôcôla Macadamia 64G', '4902777006284', 'Bánh kẹo & Ăn vặt', 22500, 30000, 31, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8852008510010', 'Toppo Bánh Que Nhân Sô Cô La Hương Vani 40G', '8852008510010', 'Bánh kẹo & Ăn vặt', 14500, 19000, 93, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836702403', 'Hershey''S Socola Kem Sữa Hạnh Nhân 40G', '6942836702403', 'Bánh kẹo & Ăn vặt', 30000, 40000, 88, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556182104049', 'Dairy Milk Socola Trái Cây Và Hạt 32G', '9556182104049', 'Bánh kẹo & Ăn vặt', 19500, 26000, 22, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556182104001', 'Dairy Milk Socola Sữa 34G', '9556182104001', 'Bánh kẹo & Ăn vặt', 29500, 39500, 32, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556182104018', 'Dairy Milk Socola Hạnh Nhân 32G', '9556182104018', 'Bánh kẹo & Ăn vặt', 31000, 41000, 52, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_7622202243639', 'Dairy Milk Socola Sữa 11G', '7622202243639', 'Bánh kẹo & Ăn vặt', 33500, 44500, 80, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680033671', 'Cosy Bánh Xốp Kem Vị Dâu Thẹ Lạnh 49.9G', '8934680033671', 'Bánh kẹo & Ăn vặt', 8500, 11000, 98, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680033657', 'Cosy Bánh Xốp Kem Vị Dừa Lá Dứa 49.9G', '8934680033657', 'Bánh kẹo & Ăn vặt', 13500, 18000, 61, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680033107', 'Cosy Bánh Quế Kem Vị Lá Dứa 117.6G', '8934680033107', 'Bánh kẹo & Ăn vặt', 17500, 23000, 74, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680033114', 'Cosy Bánh Quế Kem Vị Socola 126G', '8934680033114', 'Bánh kẹo & Ăn vặt', 37000, 49500, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563131258', 'Siukay Mì Vị Bò 127G', '8934563131258', 'Thực phẩm ăn liền', 7000, 9000, 67, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934988020021', 'Simply Dầu Đậu Nành 1 Lít', '8934988020021', 'Gia vị & Nước chấm', 21000, 28000, 78, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680042765', 'Solite Bánh Cuộn Kem Bơ Sữa 378G', '8934680042765', 'Bánh kẹo & Ăn vặt', 17500, 23000, 74, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680042888', 'Solite Bánh Cuộn Kem Lá Dứa 378G', '8934680042888', 'Bánh kẹo & Ăn vặt', 9000, 12000, 39, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_7622210515278', 'Mini Oreo Nhân Kem Socola 20.4G', '7622210515278', 'Bánh kẹo & Ăn vặt', 34000, 45500, 69, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_7622210515285', 'Mini Oreo Nhân Kem Vani 20.4', '7622210515285', 'Bánh kẹo & Ăn vặt', 11000, 14500, 95, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801111186247', 'Crown Bánh Quế Kem Sô Cô La Trắng Hạt Phỉ White Heim 142G', '8801111186247', 'Bánh kẹo & Ăn vặt', 15000, 20000, 61, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801111186216', 'Crown Bánh Quế Kem Sô Cô La Hạt Phỉ Choco Heim 142G', '8801111186216', 'Bánh kẹo & Ăn vặt', 14000, 18500, 62, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801111186087', 'Crown Bánh Quy Kem Cà Phê Couque D''Asse 128G', '8801111186087', 'Bánh kẹo & Ăn vặt', 38000, 50500, 79, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801111186117', 'Crown Bánh Quy Kem Sữa Couque D''Asse White 128G', '8801111186117', 'Bánh kẹo & Ăn vặt', 12500, 16500, 93, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935015510454', 'Biên Hòa Đường Túi Pure 1Kg', '8935015510454', 'Gia vị & Nước chấm', 14000, 18500, 81, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9312631142327', 'Dilmah Trà Đen Hương Táo, Quế Và Va-Ni 30G', '9312631142327', 'Đồ uống & Trà Cà phê', 10000, 13000, 42, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934781022604', 'Ocv Cốt Hủ Tiếu Nam Vang 90Gr', '8934781022604', 'Gia vị & Nước chấm', 19500, 26000, 26, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934781022642', 'Ocv Cốt Bún Bò Huế 90Gr', '8934781022642', 'Gia vị & Nước chấm', 20500, 27500, 40, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934781150116', 'Ocv Bột Cà Ri 20Gr', '8934781150116', 'Gia vị & Nước chấm', 19000, 25000, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934781150406', 'Ocv Bột Ngũ Vị Hương 10Gr', '8934781150406', 'Gia vị & Nước chấm', 20000, 26500, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934781022635', 'Ocv Cốt Bún Riêu Cua 90Gr', '8934781022635', 'Gia vị & Nước chấm', 21000, 28000, 82, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934781035000', 'Ocv Bột Ớt Siêu Cay 40Gr', '8934781035000', 'Gia vị & Nước chấm', 14000, 18500, 76, 'hủ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934781118239', 'Ocv Muối Tiêu 100Gr', '8934781118239', 'Gia vị & Nước chấm', 19000, 25500, 85, 'hủ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935039508222', 'Aji-Ngon Hạt Nêm Heo 400Gr', '8935039508222', 'Gia vị & Nước chấm', 19000, 25500, 53, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935039500967', 'Ajinomoto Bột Ngọt Hạt Lớn 230Gr', '8935039500967', 'Gia vị & Nước chấm', 21000, 28000, 61, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936120311035', 'Sosal Group Muối Tinh Sấy Iốt 1Kg', '8936120311035', 'Gia vị & Nước chấm', 20000, 26500, 91, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6971533425322', 'Goblim Bánh Trứng Vị Socola 26G', '6971533425322', 'Bánh kẹo & Ăn vặt', 32500, 43000, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410050', 'Ohayo Bánh Tráng Vị Khô Bò Sa Tế 40G', '8936204410050', 'Bánh kẹo & Ăn vặt', 8500, 11500, 73, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410333', 'Ohayo Chân Gà Rút Xương Hồng Kông Dưa Muối Cay 80G', '8936204410333', 'Thực phẩm ăn liền', 14500, 19000, 64, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410043', 'Ohayo Bánh Tráng Vị Khô Gà Siêu Cay 40G', '8936204410043', 'Bánh kẹo & Ăn vặt', 18500, 24500, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410128', 'Ohayo Bò Nướng Miếng Vị Tiêu Xanh 25G', '8936204410128', 'Thực phẩm ăn liền', 10000, 13500, 40, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410241', 'Ohayo Chân Gà Rút Xương Hồng Kông 60G', '8936204410241', 'Thực phẩm ăn liền', 14500, 19500, 73, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410036', 'Ohayo Bánh Tráng Vị Phô Mai Cay 40G', '8936204410036', 'Bánh kẹo & Ăn vặt', 8500, 11000, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4547894640296', 'Ritz Bánh Quy Kem Phô Mai 106G', '4547894640296', 'Bánh kẹo & Ăn vặt', 7500, 10000, 70, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6937351707651', 'Chacheer Đậu Trái Cây Khô Tổng Hợp 26G', '6937351707651', 'Bánh kẹo & Ăn vặt', 7000, 9500, 88, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804044415', 'Nescafe Café Việt Dây 11 Gói X16G Km 1 Gói', '8934804044415', 'Đồ uống & Trà Cà phê', 43000, 57500, 94, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001162', 'Nescafe Café Việt Dây 11 Gói X16G Km 1 Gói', 'SP001162', 'Đồ uống & Trà Cà phê', 37000, 49500, 92, 'dây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934804031309', 'Nescafe Cfsd Dây 10X24G Myw', '8934804031309', 'Đồ uống & Trà Cà phê', 41000, 54500, 63, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001161', 'Nescafe Cfsd Dây 10X24G Myw', 'SP001161', 'Đồ uống & Trà Cà phê', 46500, 62000, 51, 'dây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801111186209', 'Crown Bánh Quế Kem Sô Cô La Hạt Phỉ Choco Heim 47G', '8801111186209', 'Bánh kẹo & Ăn vặt', 13500, 18000, 63, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801111186230', 'Crown Bánh Quế Kem Sô Cô La Trắng Hạt Phỉ White Heim 47G', '8801111186230', 'Bánh kẹo & Ăn vặt', 13000, 17500, 84, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936134364119', 'Meizan Bột Ngọt Cánh Vừa 400Gr', '8936134364119', 'Gia vị & Nước chấm', 17000, 22500, 47, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836701024', 'Hershey''S Socola Kem Sữa 40G', '6942836701024', 'Bánh kẹo & Ăn vặt', 20500, 27500, 62, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836704346', 'Hershey''S Nuggets Socola Kem Sữa 56G', '6942836704346', 'Bánh kẹo & Ăn vặt', 33000, 44000, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836704360', 'Hershey''S Nuggets Socola Sữa Hạnh Nhân 56G', '6942836704360', 'Bánh kẹo & Ăn vặt', 22500, 30000, 20, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976611080097', 'Umiki Bánh Mì Ngàn Lớp Vị Sữa 80G', '6976611080097', 'Bánh kẹo & Ăn vặt', 5000, 6500, 26, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976611080493', 'Umiki Bánh Bông Lan Sữa Shougong 120G', '6976611080493', 'Bánh kẹo & Ăn vặt', 8000, 10500, 24, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6974682241126', 'Umiki Bánh Mì Hình Đĩa Nhạc 90G', '6974682241126', 'Bánh kẹo & Ăn vặt', 8500, 11000, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6933661508667', 'Mayeef Bánh Bông Lan Cuộn Vị Sô Cô La 160G', '6933661508667', 'Bánh kẹo & Ăn vặt', 16000, 21000, 92, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6933661508674', 'Mayeef Bánh Bông Lan Cuộn Vị Sữa 160G', '6933661508674', 'Bánh kẹo & Ăn vặt', 10500, 14000, 25, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976611080417', 'Umiki Bánh Bông Lan Tam Giác Vị Socola 75G', '6976611080417', 'Bánh kẹo & Ăn vặt', 22500, 30000, 20, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6933661508681', 'Mayeef Bánh Bông Lan Cuộn Vị Matcha 160G', '6933661508681', 'Bánh kẹo & Ăn vặt', 8000, 10500, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976611080318', 'Umiki Bánh Mì Ngàn Lớp Sữa Việt Quất 80G', '6976611080318', 'Bánh kẹo & Ăn vặt', 7500, 10000, 74, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976611080448', 'Umiki Bánh Bông Lan Tam Giác Vị Matcha 75G', '6976611080448', 'Bánh kẹo & Ăn vặt', 11500, 15500, 29, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400015', 'Dorkbua Bánh Que Vị Truyền Thống 20G', '8935342400015', 'Bánh kẹo & Ăn vặt', 11500, 15500, 48, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836704308', 'Hershey''S Nuggets Socola Trắng Bánh Quy 28G', '6942836704308', 'Bánh kẹo & Ăn vặt', 19500, 26000, 25, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836704261', 'Hershey''S Nuggets Socola Kem Sữa 28G', '6942836704261', 'Bánh kẹo & Ăn vặt', 20000, 26500, 38, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836704322', 'Hershey''S Nuggets Socola Đen Hạnh Nhân 28G', '6942836704322', 'Bánh kẹo & Ăn vặt', 34000, 45000, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836704384', 'Hershey''S Nuggets Socola Trắng Bánh Quy 56G', '6942836704384', 'Bánh kẹo & Ăn vặt', 29500, 39000, 77, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836704421', 'Hershey''S Nuggets Socola Đen Hạnh Nhân 56G', '6942836704421', 'Bánh kẹo & Ăn vặt', 37000, 49000, 35, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836725020', 'Hershey''S Socola Viên Vị Cookies Choco 36G', '6942836725020', 'Bánh kẹo & Ăn vặt', 23000, 30500, 59, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836703288', 'Hershey''S Kisses Socola Sữa Hạnh Nhân 36G', '6942836703288', 'Bánh kẹo & Ăn vặt', 17000, 22500, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6942836703226', 'Hershey''S Kisses Socola Kem Sữa 36G', '6942836703226', 'Bánh kẹo & Ăn vặt', 22500, 30000, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6973202709306', 'Horsh Bánh Sandwich Chà Bông Rong Biển Vị Trứng Muối', '6973202709306', 'Bánh kẹo & Ăn vặt', 16000, 21000, 59, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6973202709580', 'Horsh Bánh Sandwich Nhân Kem Trứng', '6973202709580', 'Bánh kẹo & Ăn vặt', 19000, 25000, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6976611081810', 'Bánh Bông Lan Tam Giác Sữa Dâu 100G', '6976611081810', 'Bánh kẹo & Ăn vặt', 18000, 24000, 56, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680012652', 'Kinh Đô Snack Vị Cua Xanh 29G', '8934680012652', 'Bánh kẹo & Ăn vặt', 12000, 16000, 47, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680025959', 'AFC Bánh Quy Vị Lúa Mì 86G', '8934680025959', 'Bánh kẹo & Ăn vặt', 5500, 7000, 42, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680025966', 'AFC Bánh Quy Vị Rau 86G', '8934680025966', 'Bánh kẹo & Ăn vặt', 11500, 15500, 91, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680011204', 'Slide Snack Khoai Tây Vị Thịt Nướng 145G', '8934680011204', 'Bánh kẹo & Ăn vặt', 7000, 9500, 88, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680011211', 'Slide Snack Khoai Tây Vị Kem Hành 145G', '8934680011211', 'Bánh kẹo & Ăn vặt', 11500, 15500, 25, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680011228', 'Slide Snack Khoai Tây Vị Thơm Cay 145G', '8934680011228', 'Bánh kẹo & Ăn vặt', 12500, 16500, 72, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680016278', 'Slide Snack Khoai Tây Sò Điệp Bào Ngư 145G', '8934680016278', 'Bánh kẹo & Ăn vặt', 13500, 18000, 65, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680011709', 'Slide Snack Khoai Tây Vị Phô Mai 145G', '8934680011709', 'Bánh kẹo & Ăn vặt', 9500, 12500, 22, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680011990', 'Slide Snack Khoai Tây Vị Kem Hành 90G', '8934680011990', 'Bánh kẹo & Ăn vặt', 6500, 8500, 23, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680011983', 'Slide Snack Khoai Tây Vị Thịt Nướng 90G', '8934680011983', 'Bánh kẹo & Ăn vặt', 14500, 19000, 78, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680012027', 'Slide Snack Khoai Tây Vị Thơm Cay 90G', '8934680012027', 'Bánh kẹo & Ăn vặt', 10500, 14000, 27, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680012010', 'Slide Snack Khoai Tây Vị Tự Nhiên Original 90G', '8934680012010', 'Bánh kẹo & Ăn vặt', 10000, 13000, 25, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680012003', 'Slide Snack Khoai Tây Vị Phô Mai 90G', '8934680012003', 'Bánh kẹo & Ăn vặt', 13000, 17000, 90, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680025973', 'AFC Bánh Quy Vị Rau Km Hạt Thảo Mộc', '8934680025973', 'Bánh kẹo & Ăn vặt', 6500, 8500, 40, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680025980', 'AFC Bánh Quy Vị Lúa Mì Km Hạt Thảo Mộc', '8934680025980', 'Bánh kẹo & Ăn vặt', 6500, 8500, 96, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_71735080582', 'Garden Club Mù Tạt Vàng 227G', '71735080582', 'Gia vị & Nước chấm', 16000, 21500, 86, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_12656707394', 'Crown Bơ Đậu Phộng Smooth & Creamy 510G', '12656707394', 'Thực phẩm ăn liền', 53000, 70500, 66, 'hủ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935299654790', 'Cobi Bánh Que Sữa Mềm 33G', '8935299654790', 'Bánh kẹo & Ăn vặt', 6500, 8500, 31, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036025293', 'Tayo Snack Khoai Tây Vị Tảo Ngọt 28G', '8936036025293', 'Bánh kẹo & Ăn vặt', 7500, 10000, 99, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936114080084', 'Doublemint Kẹo Sing Gum Vị Bạc Hà 58.4G', '8936114080084', 'Bánh kẹo & Ăn vặt', 16500, 22000, 80, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8857122621376', 'Doublemint Kẹo Ngậm Vị Chanh 23.8G X Hộ', '8857122621376', 'Bánh kẹo & Ăn vặt', 13000, 17000, 96, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9555192502630', 'Doublemint Kẹo Sing Gum Vị Bạc Hà 58.4G', '9555192502630', 'Bánh kẹo & Ăn vặt', 18500, 24500, 83, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936114080022', 'Cool Air Kẹo Sing Gum Bạc Hà Khuynh Diệp 58.4G', '8936114080022', 'Bánh kẹo & Ăn vặt', 10000, 13500, 44, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_93682961', 'M&M''S Kẹo Sôcôla Sữa 37G', '93682961', 'Bánh kẹo & Ăn vặt', 23500, 31500, 84, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936114080763', 'Skittles Kẹo Trái Cây Vị Chua 15G', '8936114080763', 'Bánh kẹo & Ăn vặt', 15500, 20500, 48, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6914973600362', 'Snickers Sôcôla Nhân Đậu Phộng 51G', '6914973600362', 'Bánh kẹo & Ăn vặt', 18500, 24500, 86, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_69025310', 'Snickers Kẹo Sôcôla 20G', '69025310', 'Bánh kẹo & Ăn vặt', 17500, 23500, 54, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6914973603516', 'M&M''S Kẹo Sôcôla Sữa 14,5G', '6914973603516', 'Bánh kẹo & Ăn vặt', 31000, 41500, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936227750232', 'Skittles Kẹo Trái Cây Vị Dâu Rừng 15G', '8936227750232', 'Bánh kẹo & Ăn vặt', 16000, 21500, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936114080961', 'Cool Air Kẹo Sing Gum Hương Quả Mọng 55.4G', '8936114080961', 'Bánh kẹo & Ăn vặt', 16000, 21000, 85, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8997018484217', 'Doublemint Kẹo Ngậm Vị Cam Bạc Hà 23.8G X Hộ', '8997018484217', 'Bánh kẹo & Ăn vặt', 8000, 10500, 75, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8997018480790', 'Doublemint Kẹo Ngậm Vị Bạc Hà Dịu Nhẹ 23.8G X Hộ', '8997018480790', 'Bánh kẹo & Ăn vặt', 11500, 15500, 93, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8997018480769', 'Doublemint Kẹo Ngậm Vị Bạc Hà Đậm Đà 23.8G X Hộ', '8997018480769', 'Bánh kẹo & Ăn vặt', 16000, 21000, 60, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8851929011590', 'Sugus Kẹo Mềm Vị Dâu 30G', '8851929011590', 'Bánh kẹo & Ăn vặt', 9500, 12500, 37, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8851929011613', 'Sugus Kẹo Mềm Vị Cam 30G', '8851929011613', 'Bánh kẹo & Ăn vặt', 9500, 12500, 33, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8851929011606', 'Sugus Kẹo Mềm Vị Nho 30G', '8851929011606', 'Bánh kẹo & Ăn vặt', 18500, 24500, 96, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_93682978', 'M&M''S Kẹo Sôcôla Đậu Phộng 37G', '93682978', 'Bánh kẹo & Ăn vặt', 33500, 44500, 63, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9300682001304', 'M&M''S Kẹo Sôcôla Sữa 90G', '9300682001304', 'Bánh kẹo & Ăn vặt', 25000, 33500, 91, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936114080107', 'Doublemint Kẹo Sing Gum Vị Bạc Hà Đậm Đà 11.2G', '8936114080107', 'Bánh kẹo & Ăn vặt', 17000, 22500, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677041016', 'Xylitol Kẹo Sing Gum Doraemon Vị Dâu 29G', '8934677041016', 'Bánh kẹo & Ăn vặt', 19000, 25000, 75, 'cái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029423891', 'Masita Rong Biển Sấy Vị Tảo Biển 28G', '8936029423891', 'Bánh kẹo & Ăn vặt', 13000, 17000, 98, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135445206', 'Karamucho Snack Bắp Vị Khô Bò 57G', '8936135445206', 'Bánh kẹo & Ăn vặt', 13000, 17500, 83, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440447', 'Karamucho Snack Khoai Tây Rong Biển Cay 80G', '8936135440447', 'Bánh kẹo & Ăn vặt', 12000, 16000, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440430', 'Karamucho Snack Khoai Tây Rong Biển Cay 44G', '8936135440430', 'Bánh kẹo & Ăn vặt', 11500, 15500, 62, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135447019', 'Polinky Snack Bắp Vị Táo Mật Ong 52G', '8936135447019', 'Bánh kẹo & Ăn vặt', 9500, 12500, 87, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135447026', 'Polinky Snack Bắp Vị Táo Mật Ong 90G', '8936135447026', 'Bánh kẹo & Ăn vặt', 8500, 11500, 31, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183001058', 'Pati Da Cá Vị Ớt Xanh 50G', '8936183001058', 'Thực phẩm ăn liền', 18000, 24000, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183001027', 'Pati Da Cá Vị Trứng Muối 50G', '8936183001027', 'Thực phẩm ăn liền', 17500, 23000, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001317322', 'Kitkat Bánh Xốp Vị Milo 17G X 10 Tha', '9556001317322', 'Bánh kẹo & Ăn vặt', 37000, 49500, 29, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001071750', 'Kitkat Bánh Xốp Socola Sữa 15G X 10 Tha', '9556001071750', 'Bánh kẹo & Ăn vặt', 20500, 27000, 68, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936028643153', 'Koreno Mì Xào Bulgogi Phô Mai Cay', '8936028643153', 'Thực phẩm ăn liền', 4500, 6000, 25, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877733', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Xốt Trứng Muối', '8936034877733', 'Thực phẩm ăn liền', 11500, 15500, 25, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877719', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Lắc Thịt Nướng Phô Mai', '8936034877719', 'Thực phẩm ăn liền', 11500, 15000, 45, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936028643061', 'Koreno Mì Xào Bulgogi Vị Bò Xào Cay', '8936028643061', 'Thực phẩm ăn liền', 7000, 9000, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036021660', 'Swing Snack Khoai Tây Vị Bò Bít Tết 53G', '8936036021660', 'Bánh kẹo & Ăn vặt', 10000, 13000, 80, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036028805', 'Orion Kẹo Họng Vị Gừng Mật Ong 84G', '8936036028805', 'Bánh kẹo & Ăn vặt', 11000, 14500, 29, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036025453', 'Orion Kẹo Họng Vị Quất Mật Ong 84G', '8936036025453', 'Bánh kẹo & Ăn vặt', 17500, 23500, 57, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029421033', 'Orion Bánh Gạo An Vị Cốm Fest 14G', '8936029421033', 'Bánh kẹo & Ăn vặt', 8000, 10500, 70, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036028300', 'Orion Bánh Gạo An Vị Khoai Tây Phô Mai 7.2G', '8936036028300', 'Bánh kẹo & Ăn vặt', 14500, 19500, 84, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036026191', 'Orion Bánh Gạo An Vị Tảo 7.95', '8936036026191', 'Bánh kẹo & Ăn vặt', 11500, 15500, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036029932', 'Orion Bánh Gạo An Vị Chà Bông 10.4', '8936036029932', 'Bánh kẹo & Ăn vặt', 16500, 22000, 23, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036026177', 'Orion Bánh Gạo An Vị Tự Nhiên 10.8', '8936036026177', 'Bánh kẹo & Ăn vặt', 16000, 21000, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036028591', 'Jboy Snack Gạo Vị Phô Mai 31.6G', '8936036028591', 'Bánh kẹo & Ăn vặt', 7500, 10000, 37, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029423761', 'Jboy Snack Gạo Vị Bò Nướng 35G', '8936029423761', 'Bánh kẹo & Ăn vặt', 7500, 10000, 97, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029425550', 'Marine Boy Snack Cá Vị Gà Nướng 35G', '8936029425550', 'Bánh kẹo & Ăn vặt', 14500, 19000, 97, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036029031', 'King Marine Boy Snack Cá Vị Tảo Biển 56G', '8936036029031', 'Bánh kẹo & Ăn vặt', 13000, 17000, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036021172', 'Marine Boy Snack Cá Vị Tảo Biển 35G', '8936036021172', 'Bánh kẹo & Ăn vặt', 10500, 14000, 21, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036021165', 'Marine Boy Snack Cá Vị Tôm Nướng 35G', '8936036021165', 'Bánh kẹo & Ăn vặt', 11500, 15500, 66, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036028836', 'Toonies Snack Bắp Vị Gà Bbq 60G', '8936036028836', 'Bánh kẹo & Ăn vặt', 12500, 16500, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036028829', 'Toonies Snack Bắp Vị Cay Mexico 60G', '8936036028829', 'Bánh kẹo & Ăn vặt', 12000, 16000, 87, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036028133', 'Toonies Snack Bắp Vị Phô Mai 60G', '8936036028133', 'Bánh kẹo & Ăn vặt', 10000, 13500, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036026962', 'O''Star Snack Ngôi Sao Vị Phô Mai Tươi 55G', '8936036026962', 'Bánh kẹo & Ăn vặt', 10000, 13500, 39, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036027082', 'O''Star Snack Khoai Tây Vị Tự Nhiên 53G', '8936036027082', 'Bánh kẹo & Ăn vặt', 11000, 14500, 91, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029425918', 'O''Star Snack Ngôi Sao Vị Kim Chi 55G', '8936029425918', 'Bánh kẹo & Ăn vặt', 11500, 15000, 88, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936029425925', 'O''Star Snack Ngôi Sao Vị Tảo Biển 55G', '8936029425925', 'Bánh kẹo & Ăn vặt', 13500, 18000, 28, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036025576', 'Swingmax Snack Khoai Tây Vị Bò Bít Tết 52G', '8936036025576', 'Bánh kẹo & Ăn vặt', 8500, 11500, 26, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036024135', 'Orion Bánh Quy Goute 36G', '8936036024135', 'Bánh kẹo & Ăn vặt', 7000, 9500, 68, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036027464', 'C''Est Bon Bánh Ăn Sáng Sợi Gà Phô Mai 101.5G', '8936036027464', 'Bánh kẹo & Ăn vặt', 12500, 16500, 74, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036026153', 'C''Est Bon Bánh Ăn Sáng Sợi Gà Bơ Tỏi 85G', '8936036026153', 'Bánh kẹo & Ăn vặt', 11500, 15000, 55, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036020274', 'Custas Bánh Bông Lan Kem Trứng 23.5G', '8936036020274', 'Bánh kẹo & Ăn vặt', 16000, 21000, 43, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036027952', 'Custas Bánh Bông Lan Kem Cốm Sen 23.5G', '8936036027952', 'Bánh kẹo & Ăn vặt', 17500, 23000, 77, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036026375', 'Custas Bánh Bông Lan Vị Tiramisu Mocha 23.5G', '8936036026375', 'Bánh kẹo & Ăn vặt', 10500, 14000, 51, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036020137', 'Custas Bánh Bông Lan Kem Trứng 23.5G', '8936036020137', 'Bánh kẹo & Ăn vặt', 11500, 15000, 84, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036020403', 'Chocopie Bánh Socola Nhân Marshmallow 36.3G', '8936036020403', 'Bánh kẹo & Ăn vặt', 31000, 41000, 24, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036025170', 'Chocopie Bánh Socola Đậm Vị Cacao 33G', '8936036025170', 'Bánh kẹo & Ăn vặt', 25500, 34000, 73, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936036020380', 'Chocopie Bánh Socola Nhân Marshmallow 36.3G', '8936036020380', 'Bánh kẹo & Ăn vặt', 24500, 32500, 33, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936028641616', 'Koreno Mì Trộn Tương Đen Chajang', '8936028641616', 'Thực phẩm ăn liền', 6500, 8500, 73, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936028643252', 'Koreno Mì Xốt Kem Bulgogi Carbonara', '8936028643252', 'Thực phẩm ăn liền', 8500, 11000, 81, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936028640039', 'Koreno Mì Vị Bò Cay', '8936028640039', 'Thực phẩm ăn liền', 8500, 11000, 84, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936028643177', 'Koreno Mì Xào Bulgogi Phô Mai Cay', '8936028643177', 'Thực phẩm ăn liền', 8000, 10500, 33, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079126018', 'Lay''S Stax Snack Khoai Tây Vị Tự Nhiên 100G', '8936079126018', 'Bánh kẹo & Ăn vặt', 11500, 15000, 37, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079122348', 'Poca Đậu Phộng Da Cá Nước Cốt Dừa 68G', '8936079122348', 'Bánh kẹo & Ăn vặt', 13000, 17000, 68, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079125004', 'Poca Đậu Phộng Rắc Rắc Vị Mực Cay 68G', '8936079125004', 'Bánh kẹo & Ăn vặt', 11500, 15000, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079125394', 'Lay''S Stax Snack Khoai Tây Tôm Hùm Nướng Ngũ Vị 100G', '8936079125394', 'Bánh kẹo & Ăn vặt', 9000, 12000, 43, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079125417', 'Lay''S Stax Snack Khoai Tây Vị Kem Chua Hành Tây 100G', '8936079125417', 'Bánh kẹo & Ăn vặt', 11000, 14500, 76, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079125424', 'Lay''S Stax Snack Khoai Tây Vị Thịt Nướng BBQ 100G', '8936079125424', 'Bánh kẹo & Ăn vặt', 13000, 17500, 21, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079125400', 'Lay''S Stax Snack Khoai Tây Vị Mực Sốt Cay 100G', '8936079125400', 'Bánh kẹo & Ăn vặt', 6500, 8500, 20, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563146153', 'Udon Mì Hương Vị Nhật Bản 75G', '8934563146153', 'Thực phẩm ăn liền', 7000, 9500, 23, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563680114', 'Doraemon Mì Ly Mini Hải Sản Chua Ngọt 53G', '8934563680114', 'Thực phẩm ăn liền', 10500, 14000, 56, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563679101', 'Doraemon Mì Ly Mini Hàu Sữa Phô Mai 48G', '8934563679101', 'Thực phẩm ăn liền', 10500, 14000, 87, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563183158', 'Hảo Hảo Mì Hương Vị Mì Sa Tế Hành Tím 75G', '8934563183158', 'Thực phẩm ăn liền', 8000, 10500, 67, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563406172', 'Khay Táo Quân Mì Thập Cẩm 95G', '8934563406172', 'Thực phẩm ăn liền', 7500, 10000, 54, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563276164', 'Đệ Nhất Phở Trộn Thập Cẩm Cay 82G', '8934563276164', 'Thực phẩm ăn liền', 8500, 11000, 67, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563177171', 'Khay Táo Quân Mì Thịt Bằm Sốt Cà Chua 93G', '8934563177171', 'Thực phẩm ăn liền', 8500, 11000, 95, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8413178364850', 'Vidal Kẹo Dẻo Xoài Muối Ớt 80G', '8413178364850', 'Bánh kẹo & Ăn vặt', 16000, 21000, 77, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8413178366779', 'Vidal Kẹo Dẻo Hình Quả Chuối 80G', '8413178366779', 'Bánh kẹo & Ăn vặt', 12000, 16000, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8413178364843', 'Vidal Kẹo Dẻo Hình Trứng Chiên 80G', '8413178364843', 'Bánh kẹo & Ăn vặt', 18000, 24000, 33, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935032010739', 'Tuấn Đạt Hạt Điều Lụa 150G', '8935032010739', 'Bánh kẹo & Ăn vặt', 9000, 12000, 20, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935032203223', 'Tuấn Đạt Xoài Sấy Dẻo Muối Ớt 50G', '8935032203223', 'Bánh kẹo & Ăn vặt', 8500, 11500, 57, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935032201311', 'Tuấn Đạt Mít Sấy 100G', '8935032201311', 'Bánh kẹo & Ăn vặt', 12500, 16500, 32, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935032203841', 'Tuấn Đạt Ổi Sấy Dẻo 50G', '8935032203841', 'Bánh kẹo & Ăn vặt', 18000, 24000, 96, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935032202660', 'Tuấn Đạt Đu Đủ Sấy Dẻo 50G', '8935032202660', 'Bánh kẹo & Ăn vặt', 12500, 16500, 90, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935032202530', 'Tuấn Đạt Xoài Sấy Dẻo 50G', '8935032202530', 'Bánh kẹo & Ăn vặt', 13000, 17500, 69, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935032202608', 'Tuấn Đạt Thơm Sấy Dẻo 40G', '8935032202608', 'Bánh kẹo & Ăn vặt', 17500, 23000, 34, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216106604', 'Haribo Kẹo Xốp Nhân Socola Chamallows 62G', '8691216106604', 'Bánh kẹo & Ăn vặt', 35500, 47000, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034876491', 'Ponnie Hotdog Giòn Ăn Liền Vị Cay 28Gr', '8936034876491', 'Thực phẩm ăn liền', 9500, 12500, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001135', 'Ponnie Hotdog Giòn Ăn Liền Vị Cay 28Gr', 'SP001135', 'Thực phẩm ăn liền', 7000, 9000, 65, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877399', 'Ponnie Hotdog Giòn Ăn Liền Sụn Vị BBQ 20Gr', '8936034877399', 'Thực phẩm ăn liền', 12000, 16000, 56, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001136', 'Ponnie Hotdog Giòn Ăn Liền Sụn Vị BBQ 20Gr', 'SP001136', 'Thực phẩm ăn liền', 9500, 12500, 45, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801043018470', 'Nongshim Mì Xào Khô Shin Ramyun Toomba 137G', '8801043018470', 'Thực phẩm ăn liền', 5500, 7000, 26, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_31146150601', 'Nongshim Mì Shin Ramyun 120G', '31146150601', 'Thực phẩm ăn liền', 4500, 6000, 98, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073101524', 'Samyang Mì Trộn Tương Tàu 140G', '8801073101524', 'Thực phẩm ăn liền', 4500, 6000, 29, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051647', 'Ottogi Mì Tô Jin Cay', '8936049051647', 'Thực phẩm ăn liền', 12000, 16000, 79, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_31146254903', 'Nongshim Mì Tô Shin 114G', '31146254903', 'Thực phẩm ăn liền', 11500, 15500, 84, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801043055659', 'Nongshim Mì Tô Vị Gà Cay 100G', '8801043055659', 'Thực phẩm ăn liền', 12500, 16500, 34, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936071070333', 'Nissin Mì Xào Hương Vị Gà Cay Hàn Quốc 71G', '8936071070333', 'Thực phẩm ăn liền', 8000, 10500, 81, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936071070340', 'Nissin Mì Xào Hương Vị Gà Cay Phô Mai Hàn Quốc 72G', '8936071070340', 'Thực phẩm ăn liền', 5000, 6500, 36, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051395', 'Ottogi Mini Mì Tương Đen Bắc Kinh 83G', '8936049051395', 'Thực phẩm ăn liền', 7000, 9500, 82, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801043061674', 'Nongshim Mì Shin Xào Khô 131G', '8801043061674', 'Thực phẩm ăn liền', 5500, 7500, 88, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051579', 'Ottogi Mì Xốt Tương Đen 135G', '8936049051579', 'Thực phẩm ăn liền', 8500, 11000, 76, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049052897', 'Ottogi Mì Xốt Tương Đen 75G', '8936049052897', 'Thực phẩm ăn liền', 7000, 9000, 31, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051654', 'Ottogi Mì Tô Yeul Cay', '8936049051654', 'Thực phẩm ăn liền', 9500, 12500, 26, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051708', 'Ottogi Mì Tô Jin Không Cay', '8936049051708', 'Thực phẩm ăn liền', 12000, 16000, 43, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049052712', 'Ottogi Mini Mì Trộn Phô Mai Vị Cay 80G', '8936049052712', 'Thực phẩm ăn liền', 6500, 8500, 81, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801043055604', 'Nongshim Mì Tô Cay Yukgaejang 100G', '8801043055604', 'Thực phẩm ăn liền', 12500, 16500, 44, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_31146270606', 'Nongshim Mì Ly Shin Cup 68G', '31146270606', 'Thực phẩm ăn liền', 11500, 15500, 44, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051586', 'Ottogi Mì Ly Jin Cay 65G', '8936049051586', 'Thực phẩm ăn liền', 10000, 13000, 47, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936049051593', 'Ottogi Mì Ly Jin Không Cay 65G', '8936049051593', 'Thực phẩm ăn liền', 13000, 17000, 55, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935015510447', 'Biên Hòa Đường Mía Thượng Hạng 1Kg', '8935015510447', 'Gia vị & Nước chấm', 16000, 21500, 88, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935015510478', 'Biên Hòa Đường Mía Thượng Hạng 500G', '8935015510478', 'Gia vị & Nước chấm', 21000, 28000, 30, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935015511062', 'Biên Hòa Đường Tinh Luyện Đặc Biệt 800G', '8935015511062', 'Gia vị & Nước chấm', 21500, 28500, 68, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935015513714', 'Cô Ba Đường Sạch 1Kg', '8935015513714', 'Gia vị & Nước chấm', 19000, 25000, 83, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001130', 'Cô Ba Đường Sạch 1Kg', 'SP001130', 'Gia vị & Nước chấm', 21000, 28000, 78, 'lốc', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935015513745', 'Biên Hòa Đường Organic 800G', '8935015513745', 'Gia vị & Nước chấm', 21500, 28500, 69, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935015521221', 'Mom Cooks Nước Cốt Dừa Xim 200Ml', '8935015521221', 'Gia vị & Nước chấm', 15500, 20500, 94, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8931406500431', 'Naní Quế Cây Sạch Lụa (Túi Zip) 500Gr', '8931406500431', 'Gia vị & Nước chấm', 17500, 23500, 75, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936202992862', 'Meizan Bánh Tráng 120Gr', '8936202992862', 'Bánh kẹo & Ăn vặt', 11000, 14500, 75, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678010158', 'Safoco Nui Xoắn Rau Củ 300Gr', '8934678010158', 'Thực phẩm ăn liền', 7000, 9500, 86, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678020102', 'Safoco Mì Sợi Nhỏ Rau Củ 500Gr', '8934678020102', 'Thực phẩm ăn liền', 8000, 10500, 61, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678020072', 'Safoco Mì Sợi Lớn 500Gr', '8934678020072', 'Thực phẩm ăn liền', 8500, 11000, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678010462', 'Safoco Nui Gạo Ống Lớn 400Gr', '8934678010462', 'Thực phẩm ăn liền', 7500, 10000, 85, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678040018', 'Safoco Bánh Tráng Sz 16 200Gr', '8934678040018', 'Bánh kẹo & Ăn vặt', 11500, 15500, 31, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678020065', 'Safoco Mì Sợi Nhỏ 500Gr', '8934678020065', 'Thực phẩm ăn liền', 5500, 7500, 70, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678010110', 'Safoco Nui Xoắn 300Gr', '8934678010110', 'Thực phẩm ăn liền', 7500, 10000, 70, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678010059', 'Safoco Nui Tôm Khô 500Gr', '8934678010059', 'Thực phẩm ăn liền', 8500, 11000, 30, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678010011', 'Safoco Nui Lớn 400Gr', '8934678010011', 'Thực phẩm ăn liền', 7000, 9500, 68, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678040032', 'Safoco Bánh Tráng Sz 22 300Gr', '8934678040032', 'Bánh kẹo & Ăn vặt', 15500, 20500, 42, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678020201', 'Safoco Mì Chay Thượng Hạng 350Gr', '8934678020201', 'Thực phẩm ăn liền', 7000, 9000, 50, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934678020232', 'Safoco Mì Xào Cao Cấp 500Gr', '8934678020232', 'Thực phẩm ăn liền', 8000, 10500, 40, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850291111556', 'Tong Garden Hỗn Hợp Hạt Trái Cây Sấy Trái Berry 28G', '8850291111556', 'Bánh kẹo & Ăn vặt', 12000, 16000, 94, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850291114298', 'Tong Garden Xoài Sấy Vị Muối Ớt 30G', '8850291114298', 'Bánh kẹo & Ăn vặt', 16000, 21500, 95, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850291101922', 'Tong Garden Hạt Dẻ Rang Tách Vỏ 120G', '8850291101922', 'Bánh kẹo & Ăn vặt', 17500, 23000, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850291010408', 'Tong Garden Hạt Dẻ Cười Rang Muối 30G', '8850291010408', 'Bánh kẹo & Ăn vặt', 8000, 10500, 90, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850291510717', 'Tong Garden Hỗn Hợp Các Loại Hạt Party Snack 40G', '8850291510717', 'Bánh kẹo & Ăn vặt', 13000, 17000, 28, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850291103094', 'Tong Garden Đậu Hà Lan Bao Mực 45G', '8850291103094', 'Bánh kẹo & Ăn vặt', 16000, 21000, 85, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6972886960539', 'Mitu Bánh Rong Biển Cuộn Vị Phô Mai 42G', '6972886960539', 'Bánh kẹo & Ăn vặt', 13000, 17000, 48, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6972886960553', 'Mitu Bánh Rong Biển Cuộn Vị Chà Bông 42G', '6972886960553', 'Bánh kẹo & Ăn vặt', 11500, 15500, 85, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6972886960546', 'Mitu Bánh Rong Biển Cuộn Vị Trứng Muối 42G', '6972886960546', 'Bánh kẹo & Ăn vặt', 8500, 11500, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6971533425209', 'Goblim Bánh Trứng Vị Trứng Muối 26G', '6971533425209', 'Bánh kẹo & Ăn vặt', 19000, 25000, 43, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6971533425346', 'Goblim Bánh Trứng Vị Phô Mai 26G', '6971533425346', 'Bánh kẹo & Ăn vặt', 11500, 15500, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6956405214136', 'Ohayo Rau Tiến Vua Muối Chua Cay 20G', '6956405214136', 'Thực phẩm ăn liền', 10000, 13500, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6956405214112', 'Ohayo Dưa Chuột Muối Chua Cay 20G', '6956405214112', 'Thực phẩm ăn liền', 14500, 19000, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938549006004', 'Timii Food Chân Vịt Tê Cay 40G', '8938549006004', 'Thực phẩm ăn liền', 10000, 13500, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938549006011', 'Timii Food Cánh Vịt Tê Cay 40G', '8938549006011', 'Thực phẩm ăn liền', 13000, 17500, 83, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936204410395', 'Ohayo Măng Non Muối Cay', '8936204410395', 'Thực phẩm ăn liền', 13000, 17000, 34, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6970903433592', 'Tiểu Mì Cay Tiao 20G', '6970903433592', 'Bánh kẹo & Ăn vặt', 6000, 8000, 20, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6970903433578', 'Tiểu Mì Cay Bang 20G', '6970903433578', 'Bánh kẹo & Ăn vặt', 5500, 7000, 61, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6970903433585', 'Tiểu Mì Cay Pian 20G', '6970903433585', 'Bánh kẹo & Ăn vặt', 8000, 10500, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801068038262', 'Mr Chef''S Bánh Phô Mai 105G', '8801068038262', 'Bánh kẹo & Ăn vặt', 12000, 16000, 80, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801068931532', 'Mr Chef''S Bánh Phô Mai Dưa Lưới 105G', '8801068931532', 'Bánh kẹo & Ăn vặt', 7500, 10000, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221091096', 'Gulu Râu Mực Chay Tê Cay 18G', '8936221091096', 'Thực phẩm ăn liền', 15000, 20000, 65, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221091089', 'Gulu Râu Mực Vị Lẩu Tứ Xuyên 18G', '8936221091089', 'Thực phẩm ăn liền', 10000, 13000, 93, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221091102', 'Gulu Râu Mực Chay Siêu Cay 18G', '8936221091102', 'Thực phẩm ăn liền', 15500, 20500, 81, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938561761028', 'Topone Chân Gà Đôi 1+1 Vị Tê Cay 60G', '8938561761028', 'Thực phẩm ăn liền', 16000, 21500, 78, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938561761011', 'Topone Chân Gà Vị Tê Cay 42G', '8938561761011', 'Thực phẩm ăn liền', 10000, 13500, 35, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938557078147', 'Alishan Chân Gà Vị Cay 40G', '8938557078147', 'Thực phẩm ăn liền', 13500, 18000, 68, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938549578334', 'Delizone Tai Heo Vị Cay 30G', '8938549578334', 'Thực phẩm ăn liền', 16000, 21000, 47, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938557078109', 'Alishan Chân Gà Rút Xương Vị Tê Cay 30G', '8938557078109', 'Thực phẩm ăn liền', 11500, 15000, 37, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8886467127038', 'Pringles Snack Khoai Tây Vị Bò Nướng Khói 102G', '8886467127038', 'Bánh kẹo & Ăn vặt', 10500, 14000, 85, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8886467100031', 'Pringles Snack Khoai Tây Vị Phô Mai Đậm Đà 102G', '8886467100031', 'Bánh kẹo & Ăn vặt', 11000, 14500, 86, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400480', 'Bento Snack Mực Vị Cay Ngọt 22G', '8935342400480', 'Bánh kẹo & Ăn vặt', 7500, 10000, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803042634', 'Oishi Snack Vị Cà Chua 68G', '8934803042634', 'Bánh kẹo & Ăn vặt', 9000, 12000, 82, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6937351707675', 'Chacheer Đậu Hạt Tổng Hợp 26G', '6937351707675', 'Bánh kẹo & Ăn vặt', 13500, 18000, 96, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157405331', 'Bento Snack Mực Vị Sốt Ớt Nướng 18G', '8850157405331', 'Bánh kẹo & Ăn vặt', 6500, 8500, 24, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157527989', 'Dorkbua Bánh Que Vị Mala 62G', '8850157527989', 'Bánh kẹo & Ăn vặt', 14000, 18500, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859470510074', 'Talaethong Snack Mực Vị Truyền Thống 100G', '8859470510074', 'Bánh kẹo & Ăn vặt', 12500, 16500, 63, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859470510081', 'Talaethong Snack Mực Vị Rong Biển 100G', '8859470510081', 'Bánh kẹo & Ăn vặt', 7500, 10000, 57, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157403283', 'Bento Snack Mực Vị Mexican Barbeque 20G', '8850157403283', 'Bánh kẹo & Ăn vặt', 13000, 17000, 34, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400220', 'Dorkbua Bánh Que Vị Bò Bít Tết 62G', '8935342400220', 'Bánh kẹo & Ăn vặt', 7000, 9500, 24, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400053', 'Dorkbua Bánh Que Vị Truyền Thống 110G', '8935342400053', 'Bánh kẹo & Ăn vặt', 7500, 10000, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157403252', 'Bento Snack Mực Tẩm Gia Vị Ớt 20G', '8850157403252', 'Bánh kẹo & Ăn vặt', 12000, 16000, 53, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400237', 'Dorkbua Bánh Que Vị Thịt Bò Nướng 62G', '8935342400237', 'Bánh kẹo & Ăn vặt', 10000, 13500, 34, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400084', 'Dorkbua Bánh Que Vị Thịt Xông Khói 50G', '8935342400084', 'Bánh kẹo & Ăn vặt', 6000, 8000, 48, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859559600931', 'Chacheer Hạt Hướng Dương Ngũ Vị Hương 130G', '8859559600931', 'Bánh kẹo & Ăn vặt', 9500, 12500, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400459', 'Bento Snack Mực Vị Namprik Thái 22G', '8935342400459', 'Bánh kẹo & Ăn vặt', 8000, 10500, 87, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859559600962', 'Chacheer Hạt Hướng Dương Vị Dừa 130G', '8859559600962', 'Bánh kẹo & Ăn vặt', 13500, 18000, 50, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859559601150', 'Chacheer Hạt Hướng Dương Nguyên Vị 130G', '8859559601150', 'Bánh kẹo & Ăn vặt', 11000, 14500, 92, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400282', 'Bento Snack Mực Vị Cay Ngọt 5G', '8935342400282', 'Bánh kẹo & Ăn vặt', 11500, 15000, 42, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001126', 'Bento Snack Mực Vị Cay Ngọt 5G', 'SP001126', 'Bánh kẹo & Ăn vặt', 7000, 9000, 98, 'lốc', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157401494', 'Bento Snack Mực Vị Gỏi Larb Cay 18G', '8850157401494', 'Bánh kẹo & Ăn vặt', 15000, 20000, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400312', 'Bento Snack Mực Vị Namprik Thái 5G', '8935342400312', 'Bánh kẹo & Ăn vặt', 7000, 9500, 26, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001125', 'Bento Snack Mực Vị Namprik Thái 5G', 'SP001125', 'Bánh kẹo & Ăn vặt', 12000, 16000, 42, 'lốc', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157000864', 'Bento Snack Mực Vị Cay Nồng 5G', '8850157000864', 'Bánh kẹo & Ăn vặt', 12000, 16000, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001124', 'Bento Snack Mực Vị Cay Nồng 5G', 'SP001124', 'Bánh kẹo & Ăn vặt', 13500, 18000, 65, 'lốc', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157407007', 'Bento Snack Mực Vị Sốt Cay Hàn Quốc 18G', '8850157407007', 'Bánh kẹo & Ăn vặt', 8500, 11500, 56, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157402231', 'Bento Snack Mực Vị Ớt Cực Cay 18G', '8850157402231', 'Bánh kẹo & Ăn vặt', 11500, 15000, 24, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400510', 'Bento Snack Mực Vị Cay Nồng 22G', '8935342400510', 'Bánh kẹo & Ăn vặt', 6500, 8500, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157406956', 'Bento Snack Mực Vị Sốt Gochujang 18G', '8850157406956', 'Bánh kẹo & Ăn vặt', 8500, 11000, 67, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850157403610', 'Bento Snack Mực Vị Hải Sản Siêu Cay 18G', '8850157403610', 'Bánh kẹo & Ăn vặt', 14000, 18500, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935342400022', 'Dorkbua Bánh Que Vị Truyền Thống 60G', '8935342400022', 'Bánh kẹo & Ăn vặt', 7500, 10000, 69, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001127', 'Dorkbua Bánh Que Vị Truyền Thống 60G', 'SP001127', 'Bánh kẹo & Ăn vặt', 13000, 17500, 60, 'lốc', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8908009419651', 'Bauli Moonfils Bánh Sừng Bò Nhân Kem Vani 45G', '8908009419651', 'Bánh kẹo & Ăn vặt', 12000, 16000, 50, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8908009419644', 'Bauli Moonfils Bánh Sừng Bò Nhân Kem Dâu 45G', '8908009419644', 'Bánh kẹo & Ăn vặt', 9000, 12000, 91, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803070347', 'Oishi Snack Bắp Vị Socola 68G', '8934803070347', 'Bánh kẹo & Ăn vặt', 34000, 45500, 57, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803042580', 'Oishi Snack Chay Vị Da Heo Quay 68G', '8934803042580', 'Bánh kẹo & Ăn vặt', 7500, 10000, 97, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803028409', 'Oishi Snack Que Nhân Sữa 7G', '8934803028409', 'Bánh kẹo & Ăn vặt', 10000, 13000, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803028393', 'Oishi Snack Que Nhân Cà Phê Moka 7G', '8934803028393', 'Bánh kẹo & Ăn vặt', 50500, 67000, 69, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902777015927', 'Meiji Sôcôla Sữa 50G', '4902777015927', 'Bánh kẹo & Ăn vặt', 24500, 32500, 90, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902777090603', 'Meiji Sôcôla Đen 50G', '4902777090603', 'Bánh kẹo & Ăn vặt', 37500, 50000, 94, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902777025902', 'Meiji Sôcôla Sữa 41G', '4902777025902', 'Bánh kẹo & Ăn vặt', 30000, 40000, 30, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902777090115', 'Meiji Socola Đen Nguyên Chất 41G', '4902777090115', 'Bánh kẹo & Ăn vặt', 25000, 33500, 66, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8888077102023', 'Hello Panda Bánh Gấu Nhân Sô Cô La 40G', '8888077102023', 'Bánh kẹo & Ăn vặt', 11000, 14500, 43, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8888077101378', 'Yan Yan Bánh Que Chấm Kem Ca Cao Hạt Phỉ 44G', '8888077101378', 'Bánh kẹo & Ăn vặt', 7000, 9000, 97, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8888077101125', 'Yan Yan Bánh Que Chấm Kem Dâu 50G', '8888077101125', 'Bánh kẹo & Ăn vặt', 7000, 9500, 65, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8888077101200', 'Yan Yan Bánh Que Chấm Kem Vani 50G', '8888077101200', 'Bánh kẹo & Ăn vặt', 11500, 15500, 51, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8888077101101', 'Yan Yan Bánh Que Chấm Kem Sô Cô La 50G', '8888077101101', 'Bánh kẹo & Ăn vặt', 14500, 19000, 46, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079287627', 'Dh Foods Xốt Phô Mai 100Gr', '8936079287627', 'Gia vị & Nước chấm', 13000, 17000, 59, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079287610', 'Dh Foods Xốt Trứng Muối 100Gr', '8936079287610', 'Gia vị & Nước chấm', 17500, 23500, 29, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079287221', 'Dh Foods Dầu Màu Điều 90Ml', '8936079287221', 'Gia vị & Nước chấm', 20500, 27000, 79, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079282264', 'Dh Foods Muối Tiêu Lá Chanh 50G', '8936079282264', 'Gia vị & Nước chấm', 20500, 27500, 42, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079280208', 'Dh Foods Muối Ớt Chanh Nha Trang 200G', '8936079280208', 'Gia vị & Nước chấm', 18500, 24500, 76, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079282301', 'Dh Foods Tiêu Đen Xay 45G', '8936079282301', 'Gia vị & Nước chấm', 13000, 17500, 65, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079280802', 'Dh Foods Muối Tôm Tây Ninh 110G', '8936079280802', 'Gia vị & Nước chấm', 18000, 24000, 31, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079284367', 'Dh Foods Gia Vị Nấu Phở Bò Hà Nội Natural 24Gr', '8936079284367', 'Gia vị & Nước chấm', 22500, 30000, 29, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034878334', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Rong Biển Cuốn Thanh Hải Sản', '8936034878334', 'Thực phẩm ăn liền', 7000, 9000, 75, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034876507', 'Ponnie Hotdog Giòn Ăn Liền Vị Bắp 28Gr', '8936034876507', 'Thực phẩm ăn liền', 9000, 12000, 55, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001109', 'Ponnie Hotdog Giòn Ăn Liền Vị Bắp 28Gr', 'SP001109', 'Thực phẩm ăn liền', 8000, 10500, 31, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936017367046', 'Chin-Su Tương Cà 250Gr', '8936017367046', 'Gia vị & Nước chấm', 13000, 17500, 47, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034876774', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Cuốn Cuốn Rong Biển', '8936034876774', 'Thực phẩm ăn liền', 7000, 9500, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877818', 'Ponnie Xúc Xích Dinh Dưỡng Bin & Bon Thịt Heo 35Gr', '8936034877818', 'Thực phẩm ăn liền', 7000, 9500, 86, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877214', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Nhân Phô Mai 32Gr', '8936034877214', 'Thực phẩm ăn liền', 7500, 10000, 31, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001106', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Nhân Phô Mai 32Gr', 'SP001106', 'Thực phẩm ăn liền', 11000, 14500, 41, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877207', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Nhân Phô Mai Vị Bắp 32Gr', '8936034877207', 'Thực phẩm ăn liền', 9500, 12500, 59, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001105', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Nhân Phô Mai Vị Bắp 32Gr', 'SP001105', 'Thực phẩm ăn liền', 11500, 15000, 75, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877917', 'Ponnie Hotdog Giòn Ăn Liền Vị Phô Mai Bắp 20Gr', '8936034877917', 'Thực phẩm ăn liền', 8500, 11500, 42, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001103', 'Ponnie Hotdog Giòn Ăn Liền Vị Phô Mai Bắp 20Gr', 'SP001103', 'Thực phẩm ăn liền', 10500, 14000, 55, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034875357', 'Ponnie Xúc Xích Tiệt Trùng Thịt Phô Mai 45Gr', '8936034875357', 'Thực phẩm ăn liền', 8500, 11000, 37, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001102', 'Ponnie Xúc Xích Tiệt Trùng Thịt Phô Mai 45Gr', 'SP001102', 'Thực phẩm ăn liền', 7000, 9000, 74, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034878624', 'Ponnie Xúc Xích Tiệt Trùng Cay Vị Ớt 120G', '8936034878624', 'Thực phẩm ăn liền', 8500, 11500, 20, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001101', 'Ponnie Xúc Xích Tiệt Trùng Cay Vị Ớt 120G', 'SP001101', 'Thực phẩm ăn liền', 10500, 14000, 89, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221044382', 'Nam Ngư Nước Chấm Ớt Tỏi Lý Sơn 300Ml', '8936221044382', 'Gia vị & Nước chấm', 17500, 23500, 62, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936136163734', 'Chin-Su Nước Tương Tỏi Ớt 330Ml', '8936136163734', 'Gia vị & Nước chấm', 26500, 35000, 96, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221043804', 'Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 67G', '8936221043804', 'Thực phẩm ăn liền', 7000, 9000, 98, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001100', 'Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 67G', 'SP001100', 'Thực phẩm ăn liền', 95000, 126500, 44, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221041794', 'Omachi Mì Khoai Tây Xốt Bò Hầm 93G', '8936221041794', 'Thực phẩm ăn liền', 6000, 8000, 97, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001099', 'Omachi Mì Khoai Tây Xốt Bò Hầm 93G', 'SP001099', 'Thực phẩm ăn liền', 92000, 122500, 46, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221041787', 'Omachi Mì Khoai Tây Sườn Hầm Ngũ Quả 96G', '8936221041787', 'Thực phẩm ăn liền', 5500, 7000, 43, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001098', 'Omachi Mì Khoai Tây Sườn Hầm Ngũ Quả 96G', 'SP001098', 'Thực phẩm ăn liền', 92500, 123500, 71, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221041800', 'Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 92G', '8936221041800', 'Thực phẩm ăn liền', 5500, 7000, 58, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001097', 'Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 92G', 'SP001097', 'Thực phẩm ăn liền', 137500, 183500, 21, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936134362313', 'Nam Dương Tương Ớt', '8936134362313', 'Gia vị & Nước chấm', 16000, 21500, 50, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936210415308', 'Oh Teen Xxtt Vị Lạp Xưởng Nướng Đá Kiểu Đài Loan 40G', '8936210415308', 'Thực phẩm ăn liền', 8500, 11500, 81, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001069', 'Oh Teen Xxtt Vị Lạp Xưởng Nướng Đá Kiểu Đài Loan 40G', 'SP001069', 'Thực phẩm ăn liền', 8000, 10500, 80, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_77377508132', 'S&B Xốt Mù Tạt Tươi Wasabi Nhật Bản 43G', '77377508132', 'Gia vị & Nước chấm', 16500, 22000, 90, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4901046361109', 'Iyemon Cha Trà Xanh Rang', '4901046361109', 'Đồ uống & Trà Cà phê', 11500, 15500, 30, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4901046661018', 'Iyemon Cha Trà Matcha Iyemon', '4901046661018', 'Đồ uống & Trà Cà phê', 11000, 14500, 78, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4901046661025', 'Iyemon Cha Trà Gạo Lứt Matcha Iyemon', '4901046661025', 'Đồ uống & Trà Cà phê', 15000, 20000, 65, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902820112726', 'Marumiya Gia Vị Rắc Cơm Rong Biển Thảo Mộc Wakame 29Gr', '4902820112726', 'Gia vị & Nước chấm', 15500, 20500, 99, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902820112702', 'Marumiya Gia Vị Rắc Cơm Rong Biển Wakame', '4902820112702', 'Gia vị & Nước chấm', 21500, 28500, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935105810150', 'Sea Crown Cá Nục Sốt Cà Cay', '8935105810150', 'Thực phẩm ăn liền', 10000, 13500, 24, 'lon', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935105810105', 'Sea Crown Cá Trích Sốt Cà', '8935105810105', 'Thực phẩm ăn liền', 16000, 21500, 77, 'lon', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935105810099', 'Sea Crown Cá Nục Sốt Cà', '8935105810099', 'Thực phẩm ăn liền', 11000, 14500, 57, 'lon', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850229102793', 'Sea Crown Cá Ngừ Sốt Ớt', '8850229102793', 'Thực phẩm ăn liền', 10000, 13500, 42, 'lon', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8850229102601', 'Sea Crown Cá Ngừ Xắt Khúc Ngâm Dầu 140Gr', '8850229102601', 'Thực phẩm ăn liền', 14500, 19500, 98, 'lon', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6901668053121', 'Oreo Bánh Quy Nhân Kem Vani 64.4G', '6901668053121', 'Bánh kẹo & Ăn vặt', 9000, 12000, 70, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934679452407', 'Gấu Đỏ Cháo Thịt Bằm', '8934679452407', 'Thực phẩm ăn liền', 7500, 10000, 94, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001062', 'Gấu Đỏ Cháo Thịt Bằm', 'SP001062', 'Thực phẩm ăn liền', 130000, 173500, 26, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934679840327', 'Gấu Đỏ Mì Gà Sợi Phở', '8934679840327', 'Thực phẩm ăn liền', 7500, 10000, 85, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001063', 'Gấu Đỏ Mì Gà Sợi Phở', 'SP001063', 'Thực phẩm ăn liền', 119500, 159000, 62, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934679941826', 'Gấu Đỏ Mì Tôm Chua Cay', '8934679941826', 'Thực phẩm ăn liền', 13000, 17000, 62, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001064', 'Gấu Đỏ Mì Tôm Chua Cay', 'SP001064', 'Thực phẩm ăn liền', 146500, 195500, 85, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934679940522', 'Gấu Đỏ Mì Chay Rau Nấm', '8934679940522', 'Thực phẩm ăn liền', 5500, 7000, 97, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001065', 'Gấu Đỏ Mì Chay Rau Nấm', 'SP001065', 'Thực phẩm ăn liền', 106500, 142000, 61, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934679943325', 'Gấu Đỏ Mì Tôm Và Gà', '8934679943325', 'Thực phẩm ăn liền', 11500, 15000, 95, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001066', 'Gấu Đỏ Mì Tôm Và Gà', 'SP001066', 'Thực phẩm ăn liền', 134500, 179500, 86, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858223013039', 'Mix Bánh Que Vị Rong Biển 50G', '8858223013039', 'Bánh kẹo & Ăn vặt', 11500, 15000, 76, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858223008479', 'Mix Bánh Que Vị Ớt Cay 50G', '8858223008479', 'Bánh kẹo & Ăn vặt', 13000, 17000, 51, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680033428', 'Oreo Bánh Quế Nhân Kem Vani 54G', '8934680033428', 'Bánh kẹo & Ăn vặt', 14000, 18500, 21, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680033442', 'Oreo Bánh Quế Nhân Kem Socola 54G', '8934680033442', 'Bánh kẹo & Ăn vặt', 16500, 22000, 21, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680045971', 'Oreo Bánh Pie Vị Socola Marshmallow 168G', '8934680045971', 'Bánh kẹo & Ăn vặt', 24000, 32000, 34, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934680046527', 'Oreo Bánh Pie Vị Socola Dâu Marshmallow 168G', '8934680046527', 'Bánh kẹo & Ăn vặt', 37000, 49000, 43, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_7622210580276', 'Oreo Bánh Quy Nhân Kem Socola 64.4G', '7622210580276', 'Bánh kẹo & Ăn vặt', 31000, 41000, 84, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4893049120008', 'Ritz Bánh Quy Kẹp Kem Phô Mai 118G', '4893049120008', 'Bánh kẹo & Ăn vặt', 12500, 16500, 75, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079124908', 'Poca Snack Hình Cua Vị Tảo Biển Nori 60G', '8936079124908', 'Bánh kẹo & Ăn vặt', 9000, 12000, 40, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877726', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Xốt Spaghetti', '8936034877726', 'Thực phẩm ăn liền', 7000, 9000, 55, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221043798', 'Omachi Mì Khoai Tây Sườn Hầm Ngũ Quả 70G', '8936221043798', 'Thực phẩm ăn liền', 5000, 6500, 40, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034875258', 'Ponnie Xúc Xích Tiệt Trùng Vị Heo 35Gr', '8936034875258', 'Thực phẩm ăn liền', 7500, 10000, 56, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221044160', 'Kokomi Mì Tôm Chua Cay 65Gr', '8936221044160', 'Thực phẩm ăn liền', 12500, 16500, 38, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221043781', 'Omachi Mì Khoai Tây Xốt Bò Hầm 69G', '8936221043781', 'Thực phẩm ăn liền', 7000, 9000, 42, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936136164403', 'Omachi Mì Trộn Xốt Spaghetti 105G', '8936136164403', 'Thực phẩm ăn liền', 5000, 6500, 22, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877740', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Lắc Phô Mai 42.2G', '8936034877740', 'Thực phẩm ăn liền', 10500, 14000, 92, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221041763', 'Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 80G', '8936221041763', 'Thực phẩm ăn liền', 5500, 7000, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001067', 'Omachi Mì Khoai Tây Hương Vị Lẩu Tôm Càng 80G', 'SP001067', 'Thực phẩm ăn liền', 106000, 141000, 59, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221041756', 'Omachi Mì Khoai Tây Xốt Bò Hầm 81G', '8936221041756', 'Thực phẩm ăn liền', 7500, 10000, 73, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936136164397', 'Omachi Mì Khoai Tây Trộn Xốt Spaghetti 90G', '8936136164397', 'Thực phẩm ăn liền', 8000, 10500, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877764', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Xốt Tôm Sữa 52.5G', '8936034877764', 'Thực phẩm ăn liền', 7000, 9000, 76, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221043897', 'Omachi Mì Trộn Xốt Tôm Phô Mai Trứng Muối 105G', '8936221043897', 'Thực phẩm ăn liền', 6500, 8500, 76, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936221041749', 'Omachi Mì Khoai Tây Sườn Hầm Ngũ Quả 80G', '8936221041749', 'Thực phẩm ăn liền', 7000, 9000, 76, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702410878', 'Big Roll Rong Biển Cuộn Vị Mực 3G', '8858702410878', 'Bánh kẹo & Ăn vặt', 14000, 18500, 62, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702411790', 'Big Roll Rong Biển Cuộn Vị Mực 3G', '8858702411790', 'Bánh kẹo & Ăn vặt', 17500, 23500, 20, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702410847', 'Big Roll Rong Biển Cuộn Vị Cay 3G', '8858702410847', 'Bánh kẹo & Ăn vặt', 13000, 17000, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702411783', 'Big Roll Rong Biển Cuộn Vị Cay 3G', '8858702411783', 'Bánh kẹo & Ăn vặt', 10500, 14000, 41, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702414951', 'Big Roll Rong Biển Cuộn Vị BBQ 3G', '8858702414951', 'Bánh kẹo & Ăn vặt', 10000, 13500, 80, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702415002', 'Big Roll Rong Biển Cuộn Vị BBQ 3G', '8858702415002', 'Bánh kẹo & Ăn vặt', 12500, 16500, 26, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702410816', 'Big Roll Rong Biển Cuộn Vị Truyền Thống 3G', '8858702410816', 'Bánh kẹo & Ăn vặt', 9000, 12000, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702411776', 'Big Roll Rong Biển Cuộn Vị Truyền Thống 3G', '8858702411776', 'Bánh kẹo & Ăn vặt', 13000, 17500, 67, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934683008614', 'Vinacafe Cà Phê Vcf 3In1 Gold Original 20Gr', '8934683008614', 'Đồ uống & Trà Cà phê', 52500, 70000, 90, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936017363505', 'Chin-Su Tương Ớt Mn 250G', '8936017363505', 'Gia vị & Nước chấm', 22000, 29000, 60, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936136163307', 'Nam Ngư Nước Mắm 500Ml', '8936136163307', 'Gia vị & Nước chấm', 37000, 49000, 22, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936034877757', 'Heo Cao Bồi Xúc Xích Tiệt Trùng Lắc Phô Mai Bắp Bơ 42G', '8936034877757', 'Thực phẩm ăn liền', 10000, 13000, 62, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079125523', 'Poca Snack Hình Mũ Pháp Sư Vị Phô Mai 58G', '8936079125523', 'Bánh kẹo & Ăn vặt', 10500, 14000, 25, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938509627058', 'Meizan Bột Bánh Xèo 400G X 1', '8938509627058', 'Gạo, Bột & Đồ khô', 19000, 25000, 87, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8938509627492', 'Olivoila Mì Spaghetti N.5 500Gr', '8938509627492', 'Thực phẩm ăn liền', 7000, 9000, 26, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8436604400069', 'Dầu Olive Oil Pomace 750Ml', '8436604400069', 'Gia vị & Nước chấm', 92000, 122500, 31, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8436604400045', 'Dầu Olive Olivoila Extra 750Ml', '8436604400045', 'Gia vị & Nước chấm', 88000, 117500, 62, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8436604400021', 'Dầu Olive Olivoilà Extra Virgin 250Ml', '8436604400021', 'Gia vị & Nước chấm', 91500, 122000, 34, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001216144', 'Kitkat Chunky Bánh Xốp Cookies Kem 38G', '9556001216144', 'Bánh kẹo & Ăn vặt', 31000, 41500, 53, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001198839', 'Kitkat Chunky Bánh Xốp Vị Socola 38G', '9556001198839', 'Bánh kẹo & Ăn vặt', 29500, 39500, 85, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001227560', 'Kitkat Bánh Xốp Vị Trà Xanh 1', '9556001227560', 'Bánh kẹo & Ăn vặt', 25500, 34000, 57, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936210411133', 'Oh Teen Xúc Xích Tiệt Trùng 35G', '8936210411133', 'Thực phẩm ăn liền', 11000, 14500, 71, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_SP001068', 'Oh Teen Xúc Xích Tiệt Trùng 35G', 'SP001068', 'Thực phẩm ăn liền', 7000, 9500, 38, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936210413816', 'Oh Teen Xúc Xích Tiệt Trùng 65G', '8936210413816', 'Thực phẩm ăn liền', 6500, 8500, 89, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902203528236', 'Lipton Trà Nhãn Vàng 25 Túi X 2G_Chamber', '4902203528236', 'Đồ uống & Trà Cà phê', 13000, 17000, 78, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001227539', 'Kitkat Bánh Xốp Vị Trà Xanh', '9556001227539', 'Bánh kẹo & Ăn vặt', 31500, 42000, 83, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_95506500', 'Kitkat Bánh Xốp Vị Socola', '95506500', 'Bánh kẹo & Ăn vặt', 22500, 30000, 75, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001027252', 'Kitkat Thanh 4F Bánh Xốp Vị Socola 35G', '9556001027252', 'Bánh kẹo & Ăn vặt', 27000, 36000, 98, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001029362', 'Kitkat Bites Bánh Xốp Viên Socola 40G', '9556001029362', 'Bánh kẹo & Ăn vặt', 23000, 30500, 63, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001222343', 'Milo Sôcôla Viên Nuggets 25G', '9556001222343', 'Bánh kẹo & Ăn vặt', 32500, 43500, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_9556001216236', 'Milo Sôcôla Thanh Chocobar 30G', '9556001216236', 'Bánh kẹo & Ăn vặt', 21000, 28000, 66, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637514772', 'Cholimex Tương Đen Phở 230Gr', '8934637514772', 'Gia vị & Nước chấm', 16500, 22000, 62, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637011523', 'Cholimex Tương Ớt Pet 270G', '8934637011523', 'Gia vị & Nước chấm', 14500, 19000, 25, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637212531', 'Cholimex Tương Cà Chai Pet 270 G', '8934637212531', 'Gia vị & Nước chấm', 22000, 29000, 53, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637513676', 'Dầu Dấm Trộn Salad Pet 270 Gr', '8934637513676', 'Gia vị & Nước chấm', 11500, 15500, 62, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637042534', 'Cholimex Tương Xí Muội Pet 270 G', '8934637042534', 'Gia vị & Nước chấm', 14500, 19500, 85, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637514314', 'Cholimex Sate Tôm Pet 90G', '8934637514314', 'Gia vị & Nước chấm', 20500, 27500, 98, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637514291', 'Cholimex Ớt Khô Sate Hũ Thủy Tinh 100G', '8934637514291', 'Gia vị & Nước chấm', 16000, 21500, 91, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637515441', 'Cholimex Gia Vị Kho Cá 50G', '8934637515441', 'Gia vị & Nước chấm', 13500, 18000, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637515465', 'Cholimex Gia Vị Kho Thịt 50G', '8934637515465', 'Gia vị & Nước chấm', 14500, 19500, 21, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637514871', 'Cholimex Xốt Ướp Thịt Nướng 70G', '8934637514871', 'Gia vị & Nước chấm', 14000, 18500, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637515731', 'Cholimex Xốt Bò Kho 90G', '8934637515731', 'Gia vị & Nước chấm', 19000, 25500, 64, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637515717', 'Cholimex Xốt Bún Bò 90G', '8934637515717', 'Gia vị & Nước chấm', 20500, 27000, 96, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_89686043686', 'Indomie Mì Xào Khô Mi Goreng Vị Sườn', '89686043686', 'Thực phẩm ăn liền', 5500, 7500, 59, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_10019686043623', 'Indomie Mì Xào Khô Mi Goreng Vị Sườn', '10089686043683', 'Thực phẩm ăn liền', 133000, 177000, 75, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_89686010947', 'Indomie Mì Xào Khô Mi Goreng Vị Đặc Biệt', '89686010947', 'Thực phẩm ăn liền', 8500, 11000, 93, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_10089686010944', 'Indomie Mì Xào Khô Mi Goreng Vị Đặc Biệt', '10089686010944', 'Thực phẩm ăn liền', 100000, 133000, 49, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_89686910704', 'Indomie Mì Xào Khô Mi Goreng Vị Bò Cay', '89686910704', 'Thực phẩm ăn liền', 7000, 9000, 33, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_10089686011187', 'Indomie Mì Xào Khô Mi Goreng Vị Bò Cay', '10089686011187', 'Thực phẩm ăn liền', 92000, 122500, 96, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_89686011036', 'Indomie Mì Xào Khô Mi Goreng Vị Cay Nồng', '89686011036', 'Thực phẩm ăn liền', 7000, 9500, 90, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_10089686011033', 'Indomie Mì Xào Khô Mi Goreng Vị Cay Nồng', '10089686011033', 'Thực phẩm ăn liền', 104500, 139000, 65, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934637062525', 'Cholimex Tương Ớt Chua Ngọt Pet 270G', '8934637062525', 'Gia vị & Nước chấm', 17500, 23000, 52, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183002840', 'Sachi Bánh Tráng Nướng Phủ Chà Bông Gà 45G', '8936183002840', 'Bánh kẹo & Ăn vặt', 9000, 12000, 32, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936013686783', 'Vfood Trứng Vịt Muối Ăn Liền', '8936013686783', 'Thực phẩm ăn liền', 16000, 21000, 53, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936013680514', 'Vfood Trứng Vịt Kho', '8936013680514', 'Thực phẩm ăn liền', 16000, 21500, 24, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936013681122', 'Vfood Trứng Gà Tiềm Vị Cay', '8936013681122', 'Thực phẩm ăn liền', 16000, 21500, 54, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936013680538', 'Vfood Trứng Gà Ta Tiềm', '8936013680538', 'Thực phẩm ăn liền', 15000, 20000, 93, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936013680507', 'Vfood Trứng Gà Tiềm', '8936013680507', 'Thực phẩm ăn liền', 11500, 15500, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936013680521', 'Vfood Trứng Cút Phá Lấu', '8936013680521', 'Thực phẩm ăn liền', 16000, 21000, 37, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935001200468', 'Wonderfarm Nước Cốt Dừa 160Ml', '8935001200468', 'Gia vị & Nước chấm', 14000, 18500, 24, 'lon', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935117702177', 'Thạch Dừa Hương Đào 190G', '8935117702177', 'Bánh kẹo & Ăn vặt', 9000, 12000, 52, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935117702252', 'Thạch Dừa Hương Dưa Lưới 190G', '8935117702252', 'Bánh kẹo & Ăn vặt', 14500, 19500, 32, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935117702115', 'Thạch Dừa 190G', '8935117702115', 'Bánh kẹo & Ăn vặt', 10500, 14000, 44, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935117702030', 'Thạch Dừa 400G', '8935117702030', 'Bánh kẹo & Ăn vặt', 13500, 18000, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935117700098', 'Bánh Flan Caramel Truyền Thống 100G *2 Hũ', '8935117700098', 'Bánh kẹo & Ăn vặt', 8500, 11000, 23, 'lốc', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935117700135', 'Bánh Flan Caramel Vị Cafe Sữa Dừa 82G', '8935117700135', 'Bánh kẹo & Ăn vặt', 41500, 55500, 20, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935117700128', 'Bánh Flan Caramel Cao Cấp 80G', '8935117700128', 'Bánh kẹo & Ăn vặt', 16000, 21500, 70, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062880096', 'Lollipop Ice Kẹo Mút Vị Trái Cây Hỗn Hợp 11G', '8801062880096', 'Bánh kẹo & Ăn vặt', 3500, 4500, 77, 'cây', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216098091', 'Haribo Kẹo Dẻo Vị Nho 80G', '8691216098091', 'Bánh kẹo & Ăn vặt', 14500, 19500, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216090491', 'Haribo Kẹo Dẻo Vị Cola Chua 80G', '8691216090491', 'Bánh kẹo & Ăn vặt', 7500, 10000, 51, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216090477', 'Haribo Kẹo Dẻo Tổng Hợp Starmix 80G', '8691216090477', 'Bánh kẹo & Ăn vặt', 12000, 16000, 54, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216090446', 'Haribo Kẹo Dẻo Vị Cola 80G', '8691216090446', 'Bánh kẹo & Ăn vặt', 11000, 14500, 47, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216098947', 'Haribo Kẹo Dẻo Mềm Squishy 80G', '8691216098947', 'Bánh kẹo & Ăn vặt', 8000, 10500, 59, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216090453', 'Haribo Kẹo Dẻo Hình Con Trùng 80G', '8691216090453', 'Bánh kẹo & Ăn vặt', 13000, 17500, 70, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8691216090439', 'Haribo Kẹo Dẻo Hình Chú Gấu 80G', '8691216090439', 'Bánh kẹo & Ăn vặt', 11500, 15000, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062332113', 'Anytime Kẹo Thảo Mộc Vị Bạc Hà Biển 74G', '8801062332113', 'Bánh kẹo & Ăn vặt', 18500, 24500, 96, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062335619', 'Anytime Kẹo Thảo Mộc Vị Mận Đào 74G', '8801062335619', 'Bánh kẹo & Ăn vặt', 11500, 15000, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062332250', 'Anytime Kẹo Thảo Mộc Vị Chanh Bạc Hà 74G', '8801062332250', 'Bánh kẹo & Ăn vặt', 18000, 24000, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062239078', 'Anytime Kẹo Thảo Mộc Vị Bạc Hà Mint 74G', '8801062239078', 'Bánh kẹo & Ăn vặt', 18500, 24500, 91, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8991002202719', 'Gingerbon Kẹo Gừng Dẻo 125G', '8991002202719', 'Bánh kẹo & Ăn vặt', 16000, 21500, 64, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8991002301436', 'Gingerbon Kẹo Gừng Dẻo Chanh Mật Ong 125G', '8991002301436', 'Bánh kẹo & Ăn vặt', 11500, 15000, 86, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8886467100017', 'Pringles Snack Khoai Tây Vị Tự Nhiên Original 102G', '8886467100017', 'Bánh kẹo & Ăn vặt', 11000, 14500, 44, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8886467100024', 'Pringles Snack Khoai Tây Vị Kem Chua Hành Tây 102G', '8886467100024', 'Bánh kẹo & Ăn vặt', 10000, 13000, 79, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_80051671', 'Nutella Sản Phẩm Dạng Phết Chứa Hạt Phỉ Và Cacao 200G', '80051671', 'Thực phẩm ăn liền', 66500, 88500, 93, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_80974482', 'Kinder Joy Socola Bé Trai T3 60G', '80974482', 'Bánh kẹo & Ăn vặt', 21000, 28000, 70, 'trái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8000500075708', 'Kinder Joy Socola Bé Trai T3 60G', '8000500075708', 'Bánh kẹo & Ăn vặt', 23500, 31500, 94, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_80768258', 'Kinder Joy Socola Bé Gái T3 60G', '80768258', 'Bánh kẹo & Ăn vặt', 34000, 45500, 64, 'trái', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8000500126325', 'Kinder Joy Socola Bé Gái T3 60G', '8000500126325', 'Bánh kẹo & Ăn vặt', 18500, 24500, 79, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8000500010709', 'Ferrero Rocher Socola Nhân Hạt Dẻ 37.5G', '8000500010709', 'Bánh kẹo & Ăn vặt', 33500, 44500, 81, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8000500066027', 'Kinder Bueno Bánh Socola 43G', '8000500066027', 'Bánh kẹo & Ăn vặt', 23500, 31500, 78, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8851019310244', 'Pocky Bánh Que Chocolate Nhân Đôi Kem 39G', '8851019310244', 'Bánh kẹo & Ăn vặt', 31000, 41000, 78, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8851019500164', 'Pocky Bánh Que Kem Trà Xanh Vị Sữa 35G', '8851019500164', 'Bánh kẹo & Ăn vặt', 14000, 18500, 81, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8851019500195', 'Pocky Bánh Que Kem Cookies & Cream 40G', '8851019500195', 'Bánh kẹo & Ăn vặt', 12500, 16500, 32, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8851019310190', 'Pocky Bánh Que Kem Chocolate 40G', '8851019310190', 'Bánh kẹo & Ăn vặt', 21000, 28000, 65, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936066340021', 'Kewpie Mayonnaise Hương Vị Nhật', '8936066340021', 'Gia vị & Nước chấm', 19500, 26000, 46, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936066340076', 'Kewpie Xốt Mayonnaise Dịu Ngọt', '8936066340076', 'Gia vị & Nước chấm', 20500, 27500, 73, 'chai', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902888183430', 'Dars Socola sữa 42G', '4902888183430', 'Bánh kẹo & Ăn vặt', 34000, 45000, 34, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902888205415', 'Dars Socola Trà Xanh 42G', '4902888205415', 'Bánh kẹo & Ăn vặt', 29000, 38500, 35, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902888183454', 'Dars Socola trắng 42G', '4902888183454', 'Bánh kẹo & Ăn vặt', 36000, 48000, 30, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440171', 'Gokochi Snack Khoai Tây Muối Tiêu Đen 65G', '8936135440171', 'Bánh kẹo & Ăn vặt', 8000, 10500, 48, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440263', 'Gokochi Snack Khoai Tây Vị Rong Biển 65G', '8936135440263', 'Bánh kẹo & Ăn vặt', 11500, 15000, 23, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440195', 'Gokochi Snack Khoai Tây Vị Muối Tự Nhiên 115G', '8936135440195', 'Bánh kẹo & Ăn vặt', 14500, 19000, 97, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440164', 'Gokochi Snack Khoai Tây Vị Muối Tự Nhiên 65G', '8936135440164', 'Bánh kẹo & Ăn vặt', 10000, 13000, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440072', 'Karamucho Snack Khoai Tây Rong Biển Cay 44G', '8936135440072', 'Bánh kẹo & Ăn vặt', 8500, 11500, 54, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440324', 'Karamucho Snack Khoai Tây Sốt Cay Ngọt Hàn Quốc 117G', '8936135440324', 'Bánh kẹo & Ăn vặt', 8500, 11500, 20, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440300', 'Karamucho Snack Khoai Tây Sốt Cay Ngọt Hàn Quốc 80G', '8936135440300', 'Bánh kẹo & Ăn vặt', 7000, 9000, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440294', 'Karamucho Snack Khoai Tây Sốt Cay Ngọt Hàn Quốc 44G', '8936135440294', 'Bánh kẹo & Ăn vặt', 11000, 14500, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440249', 'Karamucho Snack Khoai Tây Vị Cay Đặc Biệt 120G', '8936135440249', 'Bánh kẹo & Ăn vặt', 12500, 16500, 24, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440034', 'Karamucho Snack Khoai Tây Vị Cay Đặc Biệt 82G', '8936135440034', 'Bánh kẹo & Ăn vặt', 9000, 12000, 93, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135440027', 'Karamucho Snack Khoai Tây Vị Cay Đặc Biệt 44G', '8936135440027', 'Bánh kẹo & Ăn vặt', 11000, 14500, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135441031', 'Karamucho Snack Khoai Tây Lát Dày Cay Đặc Biệt 80G', '8936135441031', 'Bánh kẹo & Ăn vặt', 7000, 9500, 59, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135441024', 'Karamucho Snack Khoai Tây Lát Dày Cay Đặc Biệt 44G', '8936135441024', 'Bánh kẹo & Ăn vặt', 10000, 13500, 80, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135445183', 'Karamucho Snack Bắp Vị Phô Mai Cay 57G', '8936135445183', 'Bánh kẹo & Ăn vặt', 6000, 8000, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135445015', 'Karamucho Snack Bắp Vị Cay Đặc Biệt 57G', '8936135445015', 'Bánh kẹo & Ăn vặt', 9000, 12000, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936135441147', 'Karamucho Snack Khoai Tây Lát Dày Sốt Cay Hoàng Gia 80G', '8936135441147', 'Bánh kẹo & Ăn vặt', 7000, 9500, 69, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902888210617', 'Hi-Chew Kẹo Mềm Vị Đào 57G', '4902888210617', 'Bánh kẹo & Ăn vặt', 10000, 13500, 78, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902888210211', 'Hi-Chew Kẹo Mềm Vị Táo Xanh 57G', '4902888210211', 'Bánh kẹo & Ăn vặt', 17500, 23500, 24, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902888210372', 'Hi-Chew Kẹo Mềm Vị Dâu 57G', '4902888210372', 'Bánh kẹo & Ăn vặt', 13000, 17000, 27, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4902888210587', 'Hi-Chew Kẹo Mềm Vị Xoài 57G', '4902888210587', 'Bánh kẹo & Ăn vặt', 18000, 24000, 47, 'thanh', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_96118528', 'Fisherman''S Friend Kẹo Ngậm Bạc Hà Spearmint 25G', '96118528', 'Bánh kẹo & Ăn vặt', 17500, 23500, 85, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_96118504', 'Fisherman''S Friend Kẹo Ngậm Vị Quýt Không Đường 25G', '96118504', 'Bánh kẹo & Ăn vặt', 10000, 13000, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_96118511', 'Fisherman''S Friend Kẹo Ngậm Vị Cherry Không Đường 25G', '96118511', 'Bánh kẹo & Ăn vặt', 9000, 12000, 95, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_50854011', 'Fisherman''S Friend Kẹo Ngậm Bạc Hà Không Đường 25G', '50854011', 'Bánh kẹo & Ăn vặt', 14000, 18500, 88, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_50357680', 'Fisherman''S Friend Kẹo Ngậm Bạc Hà Khuynh Diệp 25G', '50357680', 'Bánh kẹo & Ăn vặt', 12000, 16000, 94, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_6974936460327', 'Ovaltine Kẹo Xốp Nhân Socola 25G', '6974936460327', 'Bánh kẹo & Ăn vặt', 20000, 26500, 21, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4895138305143', 'Striking Kẹo Nổ Vị Việt Quất 15G', '4895138305143', 'Bánh kẹo & Ăn vặt', 17000, 22500, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4895138305082', 'Striking Kẹo Nổ Vị Dâu 15G', '4895138305082', 'Bánh kẹo & Ăn vặt', 17000, 22500, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4895138305129', 'Striking Kẹo Nổ Vị Dưa Hấu 15G', '4895138305129', 'Bánh kẹo & Ăn vặt', 13500, 18000, 76, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4895138310765', 'Striking Kẹo Nổ Vị Dứa 15G', '4895138310765', 'Bánh kẹo & Ăn vặt', 11500, 15000, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4895138305204', 'Striking Kẹo Nổ Vị Đào 15G', '4895138305204', 'Bánh kẹo & Ăn vặt', 9000, 12000, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4895138305105', 'Striking Kẹo Nổ Vị Cola 15G', '4895138305105', 'Bánh kẹo & Ăn vặt', 11500, 15000, 83, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4895138305068', 'Striking Kẹo Nổ Vị Táo Xanh 15G', '4895138305068', 'Bánh kẹo & Ăn vặt', 8000, 10500, 94, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_4895138310376', 'Striking Kẹo Nổ Siêu Cấp Vitamin C 15G', '4895138310376', 'Bánh kẹo & Ăn vặt', 9500, 12500, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079123291', 'Poca Đậu Phộng Da Cá Vị Mực Cay 68G', '8936079123291', 'Bánh kẹo & Ăn vặt', 19000, 25000, 99, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079122331', 'Poca Đậu Phộng Da Cá Vị Phô Mai 68G', '8936079122331', 'Bánh kẹo & Ăn vặt', 14500, 19500, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079125011', 'Poca Đậu Phộng Rắc Rắc Vị Nước Cốt Dừa 70G', '8936079125011', 'Bánh kẹo & Ăn vặt', 14000, 18500, 30, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079121167', 'Lay''S Wavy Snack Khoai Tây Vị Phô Mai Cheddar 90G', '8936079121167', 'Bánh kẹo & Ăn vặt', 9000, 12000, 94, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079120139', 'Lay''S Snack Khoai Tây Vị Tự Nhiên Classic 90G', '8936079120139', 'Bánh kẹo & Ăn vặt', 12000, 16000, 79, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079124236', 'Lay''S Snack Khoai Tây Tôm Càng Đút Lò Phô Mai Cháy 90G', '8936079124236', 'Bánh kẹo & Ăn vặt', 10000, 13500, 54, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079121020', 'Lay''S Snack Khoai Tây Vị Tảo Biển Nori 90G', '8936079121020', 'Bánh kẹo & Ăn vặt', 11000, 14500, 70, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079121778', 'Lay''S Wavy Snack Khoai Tây Thăn Bò Nướng Texas 90G', '8936079121778', 'Bánh kẹo & Ăn vặt', 8000, 10500, 84, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079121013', 'Lay''S Snack Khoai Tây Vị Sườn Nướng BBQ 90G', '8936079121013', 'Bánh kẹo & Ăn vặt', 6000, 8000, 35, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079122249', 'Poca Snack Khoai Tây Vị Bò Lục Lắc 60G', '8936079122249', 'Bánh kẹo & Ăn vặt', 11500, 15500, 98, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079123352', 'Poca Snack Bắp Ngọt Xóc Bơ 60G', '8936079123352', 'Bánh kẹo & Ăn vặt', 12000, 16000, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079122256', 'Poca Snack Khoai Tây Mực Lăn Muối Ớt 60G', '8936079122256', 'Bánh kẹo & Ăn vặt', 11500, 15000, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936079122294', 'Poca Snack Khoai Tây Tôm Hùm Nướng 60G', '8936079122294', 'Bánh kẹo & Ăn vặt', 9500, 12500, 34, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073115088', 'Samyang Mì Khô Gà Phô Mai Quattro 145G', '8801073115088', 'Thực phẩm ăn liền', 8500, 11000, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073113893', 'Samyang Mì Khô Gà Cay Carbonara 130G', '8801073113893', 'Thực phẩm ăn liền', 6000, 8000, 76, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073113268', 'Samyang Mì Khô Gà Cay Vị Phô Mai 140G', '8801073113268', 'Thực phẩm ăn liền', 5000, 6500, 63, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073215900', 'Samyang Mì Tô Khô Gà Cay Hoa Hồng 105G', '8801073215900', 'Thực phẩm ăn liền', 10500, 14000, 69, 'tô', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073211254', 'Samyang Mì Ly Khô Gà Cay Vị Phô Mai 70G', '8801073211254', 'Thực phẩm ăn liền', 13000, 17000, 88, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073211667', 'Samyang Mì Ly Khô Gà Cay Carbonara 80G', '8801073211667', 'Thực phẩm ăn liền', 13500, 18000, 53, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073210776', 'Samyang Mì Ly Khô Gà Cay 70G', '8801073210776', 'Thực phẩm ăn liền', 12000, 16000, 83, 'ly', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801073110502', 'Samyang Mì Khô Gà Cay 140G', '8801073110502', 'Thực phẩm ăn liền', 6000, 8000, 64, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010530041', 'Cozy Trà Hương Đào', '8936010530041', 'Đồ uống & Trà Cà phê', 13000, 17500, 65, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010533011', 'Bio Concept Trà Kombucha Vị Chanh Gừng', '8936010533011', 'Đồ uống & Trà Cà phê', 10500, 14000, 32, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010530096', 'Cozy Trà Hương Nhài', '8936010530096', 'Đồ uống & Trà Cà phê', 16000, 21500, 65, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010530713', 'Cozy Ice Tea Trà Đào', '8936010530713', 'Đồ uống & Trà Cà phê', 14000, 18500, 21, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010530881', 'Cozy Ice Tea Trà Chanh', '8936010530881', 'Đồ uống & Trà Cà phê', 10000, 13500, 28, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010531307', 'Cozy Ice Tea Trà Vải', '8936010531307', 'Đồ uống & Trà Cà phê', 16000, 21500, 55, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010530775', 'Cozy Trà Gừng', '8936010530775', 'Đồ uống & Trà Cà phê', 15000, 20000, 48, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010533455', 'Cozy Hồng trà', '8936010533455', 'Đồ uống & Trà Cà phê', 14500, 19000, 93, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936010531888', 'Cozy Ice Tea Trà Ôi Hồng', '8936010531888', 'Đồ uống & Trà Cà phê', 11500, 15500, 34, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677013419', 'Xylitol Kẹo Sing Gum Vị Bạc Hà 130.5G', '8934677013419', 'Bánh kẹo & Ăn vặt', 11500, 15500, 95, 'hủ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8998866631174', 'Sedaap Mì Vị Phô Mai Hàn Quốc 86G', '8998866631174', 'Thực phẩm ăn liền', 7500, 10000, 56, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8998866631181', 'Sedaap Mì Vị Phô Mai Hàn Quốc 86G', '8998866631181', 'Thực phẩm ăn liền', 7000, 9000, 43, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_18998866631188', 'Sedaap Mì Vị Phô Mai Hàn Quốc 86G', '18998866631188', 'Thực phẩm ăn liền', 103000, 137000, 99, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8998866631136', 'Sedaap Mì Vị Mì Xào 90G', '8998866631136', 'Thực phẩm ăn liền', 7000, 9000, 65, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8998866631143', 'Sedaap Mì Vị Mì Xào 90G', '8998866631143', 'Thực phẩm ăn liền', 6500, 8500, 39, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8998866631150', 'Sedaap Mì Vị Gà Cay Hàn Quốc 87G', '8998866631150', 'Thực phẩm ăn liền', 5500, 7000, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8998866631167', 'Sedaap Mì Vị Gà Cay Hàn Quốc 87G', '8998866631167', 'Thực phẩm ăn liền', 7500, 10000, 81, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_18998866631164', 'Sedaap Mì Vị Gà Cay Hàn Quốc 87G', '18998866631164', 'Thực phẩm ăn liền', 98000, 130500, 79, 'thùng', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952007355', 'Bánh Dorayaki Nhân Socola 150G', '8934952007355', 'Bánh kẹo & Ăn vặt', 28500, 38000, 59, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952007379', 'Bánh Dorayaki Nhân Socola 150G', '8934952007379', 'Bánh kẹo & Ăn vặt', 19500, 26000, 41, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952008116', 'Bánh Dorayaki Nhân Đậu Đỏ 150Gr', '8934952008116', 'Bánh kẹo & Ăn vặt', 16000, 21000, 27, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952008123', 'Bánh Dorayaki Nhân Đậu Đỏ 150Gr', '8934952008123', 'Bánh kẹo & Ăn vặt', 10000, 13500, 64, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952008727', 'Bánh Dorayaki Nhân Chà Bông Xốt Trứng Muối 150G', '8934952008727', 'Bánh kẹo & Ăn vặt', 11500, 15500, 89, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952008734', 'Bánh Dorayaki Nhân Chà Bông Xốt Trứng Muối 150G', '8934952008734', 'Bánh kẹo & Ăn vặt', 10500, 14000, 21, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952008055', 'Bánh Dorayaki Nhân Chà Bông Xốt Phô Mai 150Gr', '8934952008055', 'Bánh kẹo & Ăn vặt', 18000, 24000, 32, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952008062', 'Bánh Dorayaki Nhân Chà Bông Xốt Phô Mai 150Gr', '8934952008062', 'Bánh kẹo & Ăn vặt', 13500, 18000, 51, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952007348', 'Bánh Dorayaki Nhân Chà Bông Xốt Bơ 150G', '8934952007348', 'Bánh kẹo & Ăn vặt', 12500, 16500, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952007362', 'Bánh Dorayaki Nhân Chà Bông Xốt Bơ 150G', '8934952007362', 'Bánh kẹo & Ăn vặt', 14500, 19000, 69, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952008079', 'Bánh Dorayaki Nhân Chà Bông Xốt BBQ 150G', '8934952008079', 'Bánh kẹo & Ăn vặt', 16000, 21500, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934952008086', 'Bánh Dorayaki Nhân Chà Bông Xốt BBQ 150G', '8934952008086', 'Bánh kẹo & Ăn vặt', 11500, 15500, 87, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677000310', 'Xylitol Kẹo Sing Gum Vị Việt Quất 11.6G', '8934677000310', 'Bánh kẹo & Ăn vặt', 7500, 10000, 77, 'vỹ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677000327', 'Xylitol Kẹo Sing Gum Vị Chanh Bạc Hà 11.6G', '8934677000327', 'Bánh kẹo & Ăn vặt', 17500, 23000, 60, 'vỹ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677020110', 'Xylitol Kẹo Sing Gum Vị Bạc Hà Siêu Mát 11.6G', '8934677020110', 'Bánh kẹo & Ăn vặt', 8000, 10500, 54, 'vỹ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677000440', 'Xylitol Kẹo Sing Gum Vị Dâu Bạc Hà 11.6G', '8934677000440', 'Bánh kẹo & Ăn vặt', 18000, 24000, 37, 'vỹ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934707010982', 'Knorr Gia Vị Hoàn Chỉnh Canh Chua 30G', '8934707010982', 'Gia vị & Nước chấm', 19000, 25000, 31, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934707011002', 'Knorr Gia Vị Hoàn Chỉnh Thịt Kho 28G', '8934707011002', 'Gia vị & Nước chấm', 16000, 21500, 50, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934707010944', 'Knorr Gia Vị Hoàn Chỉnh Cá Kho 28G', '8934707010944', 'Gia vị & Nước chấm', 13500, 18000, 47, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934707029137', 'Knorr Hạt Nêm Từ Thịt 400G', '8934707029137', 'Gia vị & Nước chấm', 19000, 25500, 96, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934707029144', 'Knorr Hạt Nêm Từ Thịt 170G', '8934707029144', 'Gia vị & Nước chấm', 16000, 21000, 56, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934707012122', 'Knorr Hạt Nêm Nấm Hương Organic 170G', '8934707012122', 'Gia vị & Nước chấm', 19500, 26000, 65, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001320136', 'Kopiko Kẹo Cứng Vị Cappuccino 140G', '8996001320136', 'Bánh kẹo & Ăn vặt', 13500, 18000, 65, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8993175560801', 'Nabati Bánh Ống Roll''S Nhân Sô Cô La Richoco 6G', '8993175560801', 'Bánh kẹo & Ăn vặt', 8500, 11000, 52, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8993175531894', 'Nabati Bánh Kem Xốp Nhân Phô Mai Richeese 6G', '8993175531894', 'Bánh kẹo & Ăn vặt', 13000, 17000, 91, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8993175532907', 'Nabati Bánh Kem Xốp Nhân Sô Cô La Richoco 6G', '8993175532907', 'Bánh kẹo & Ăn vặt', 8000, 10500, 94, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8993175559256', 'Nabati Bánh Ống Roll''S Nhân Phô Mai Richeese 6G', '8993175559256', 'Bánh kẹo & Ăn vặt', 11500, 15500, 65, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8000350008123', 'Matilde Vicenzi Bánh Ngàn Lớp Cuộn Kem Hạt Phỉ 125G', '8000350008123', 'Bánh kẹo & Ăn vặt', 14500, 19000, 64, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8000350008116', 'Matilde Vicenzi Bánh Ngàn Lớp Minisnack Nhân Kem Bánh Ngọt 125G', '8000350008116', 'Bánh kẹo & Ăn vặt', 8500, 11000, 77, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001350812', 'Go Choco Rollz Bánh Cuộn Chocolate 250G', '8996001350812', 'Bánh kẹo & Ăn vặt', 32000, 42500, 76, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8992775005637', 'Chocolatos Bánh Cuộn Socola 336G', '8992775005637', 'Bánh kẹo & Ăn vặt', 22000, 29500, 40, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8992775005651', 'Chocolatos Bánh Cuộn Socola Đen 336G', '8992775005651', 'Bánh kẹo & Ăn vặt', 22500, 30000, 54, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8992775005699', 'Chocolatos Bánh Cuộn Kem Vani 336G', '8992775005699', 'Bánh kẹo & Ăn vặt', 19500, 26000, 35, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001301715', 'Coffee Joy Bánh Quy Vị Cà Phê 156G', '8996001301715', 'Bánh kẹo & Ăn vặt', 41000, 54500, 31, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001301777', 'Coffee Joy Bánh Quy Vị Cà Phê 156G', '8996001301777', 'Bánh kẹo & Ăn vặt', 53500, 71500, 74, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001353592', 'Cal Cheese Bánh Xốp Vị Phô Mai 186G', '8996001353592', 'Bánh kẹo & Ăn vặt', 8500, 11000, 27, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8992775005675', 'Chocolatos Bánh Cuộn Kem Phô Mai 336G', '8992775005675', 'Bánh kẹo & Ăn vặt', 23000, 30500, 84, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8000350008109', 'Matilde Vicenzi Bánh Ngàn Lớp Phủ Đường Glassate 125G', '8000350008109', 'Bánh kẹo & Ăn vặt', 12000, 16000, 62, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563301156', 'Phú Hương Miến Sườn Heo 55G', '8934563301156', 'Thực phẩm ăn liền', 8000, 10500, 71, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803024814', 'Oishi Bánh Phồng Mực Indonesia 68G', '8934803024814', 'Bánh kẹo & Ăn vặt', 14500, 19500, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8852008510492', 'Toppo Bánh Que Nhân Sô Cô La Hương Cacao 40G', '8852008510492', 'Bánh kẹo & Ăn vặt', 13000, 17000, 89, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803026078', 'Oishi Snack Bắp Vị Ngọt 68G', '8934803026078', 'Bánh kẹo & Ăn vặt', 9000, 12000, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8852008511239', 'Toppo Bánh Que Nhân Kem Dâu 40G', '8852008511239', 'Bánh kẹo & Ăn vặt', 14000, 18500, 86, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803026788', 'Oishi Snack Vị Hành 68G', '8934803026788', 'Bánh kẹo & Ăn vặt', 8000, 10500, 80, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803012880', 'Oishi Snack Bí Đỏ Vị Bò Nướng 68G', '8934803012880', 'Bánh kẹo & Ăn vặt', 6500, 8500, 73, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803042818', 'Oishi Snack Bắp Vị Phô Mai 68G', '8934803042818', 'Bánh kẹo & Ăn vặt', 12500, 16500, 70, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803042283', 'Oishi Snack Cua Xốt Chua Ngọt 68G', '8934803042283', 'Bánh kẹo & Ăn vặt', 9000, 12000, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803070064', 'Oishi Snack Viên Vị Mực Cay 68G', '8934803070064', 'Bánh kẹo & Ăn vặt', 8500, 11500, 90, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803046090', 'Oishi Snack Que Nhân Phô Mai 7G', '8934803046090', 'Bánh kẹo & Ăn vặt', 9000, 12000, 75, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803025927', 'Oishi Snack Đậu Xanh Nước Dừa 65G', '8934803025927', 'Bánh kẹo & Ăn vặt', 8000, 10500, 37, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803071337', 'Oishi Snack Tôm Xốt Tương Mật Ong 65G', '8934803071337', 'Bánh kẹo & Ăn vặt', 11500, 15000, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803044027', 'Oishi Đậu Phộng Rang Vị Mực Cay 80G', '8934803044027', 'Bánh kẹo & Ăn vặt', 16000, 21500, 67, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803071085', 'Oishi Snack Tôm Vị Cay Nồng 65G', '8934803071085', 'Bánh kẹo & Ăn vặt', 14500, 19500, 23, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803023732', 'Oishi Đậu Phộng Da Cá Nước Cốt Dừa 80G', '8934803023732', 'Bánh kẹo & Ăn vặt', 13000, 17500, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803071108', 'Oishi Snack Nhân Sô Cô La Hạt Phỉ 80G', '8934803071108', 'Bánh kẹo & Ăn vặt', 12500, 16500, 48, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803054590', 'Oishi Snack Nhân Cookie Kem Vani 80G', '8934803054590', 'Bánh kẹo & Ăn vặt', 13500, 18000, 96, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803044171', 'Oishi Snack Nhân Sữa Dừa 80G', '8934803044171', 'Bánh kẹo & Ăn vặt', 12500, 16500, 65, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803043891', 'Oishi Snack Nhân Sô Cô La 80G', '8934803043891', 'Bánh kẹo & Ăn vặt', 12500, 16500, 90, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803071160', 'Oishi Snack Nhân Khoai Môn 80G', '8934803071160', 'Bánh kẹo & Ăn vặt', 14000, 18500, 32, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8993175551519', 'Nabati Bánh Quế Long Stick Nhân Sô Cô La Richoco 105G', '8993175551519', 'Bánh kẹo & Ăn vặt', 17500, 23500, 50, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8993175556972', 'Nabati Bánh Quế Long Stick Nhân Phô Mai Richeese 105G', '8993175556972', 'Bánh kẹo & Ăn vặt', 14500, 19000, 90, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001356661', 'Cal Cheese Bánh Xốp Vị Phô Mai Túi 20G', '8996001356661', 'Bánh kẹo & Ăn vặt', 17500, 23000, 85, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001357422', 'Cal Cheese Bánh Xốp Vị Phô Mai Túi 20G', '8996001357422', 'Bánh kẹo & Ăn vặt', 17500, 23000, 93, 'túi', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8993175535878', 'Nabati Bánh Kem Xốp Nhân Phô Mai Richeese 50G', '8993175535878', 'Bánh kẹo & Ăn vặt', 10500, 14000, 55, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8993175535885', 'Nabati Bánh Kem Xốp Nhân Sô Cô La Richoco 50G', '8993175535885', 'Bánh kẹo & Ăn vặt', 11500, 15000, 96, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001350584', 'Cal Cheese Bánh Xốp Vị Phô Mai 48G', '8996001350584', 'Bánh kẹo & Ăn vặt', 18000, 24000, 43, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001350836', 'Wafello Bánh Kem Xốp Vị Socola 48G', '8996001350836', 'Bánh kẹo & Ăn vặt', 19000, 25500, 30, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8994834004728', 'Enaak Snack Mì Vị Ớt Cấp Một 28G', '8994834004728', 'Bánh kẹo & Ăn vặt', 5500, 7500, 79, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8994834002595', 'Enaak Snack Mì Vị Gà 30G', '8994834002595', 'Bánh kẹo & Ăn vặt', 6500, 8500, 58, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8992775343128', 'Gery Bánh Quy Kem Phô Mai 90G', '8992775343128', 'Bánh kẹo & Ăn vặt', 9500, 12500, 22, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001302026', 'Roma Malkist Bánh Quy Phủ Đường 105G', '8996001302026', 'Bánh kẹo & Ăn vặt', 7500, 10000, 20, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001302033', 'Roma Malkist Bánh Quy Crackers 107G', '8996001302033', 'Bánh kẹo & Ăn vặt', 6000, 8000, 38, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935341301528', 'Lotte Chocolat Bánh Socola Pie Vị Trà Xanh Matcha 169.8G', '8935341301528', 'Bánh kẹo & Ăn vặt', 29000, 38500, 81, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677020318', 'Xylitol Kẹo Sing Gum Vị Bạc Hà Mát Lạnh 130.5G', '8934677020318', 'Bánh kẹo & Ăn vặt', 8500, 11000, 86, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677000358', 'Xylitol Kẹo Sing Gum Vị Chanh Bạc Hà 130.5G', '8934677000358', 'Bánh kẹo & Ăn vặt', 15000, 20000, 38, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677013112', 'Xylitol Kẹo Sing Gum Vị Việt Quất 130.5G', '8934677013112', 'Bánh kẹo & Ăn vặt', 9000, 12000, 66, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677038016', 'Xylitol Kẹo Sing Gum Vị Trái Cây Hỗn Hợp 130.5G', '8934677038016', 'Bánh kẹo & Ăn vặt', 10000, 13000, 40, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578604750', 'Funmore Kẹo Dẻo Burger Khổng Lồ 50G', '8859578604750', 'Bánh kẹo & Ăn vặt', 19000, 25000, 94, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600738', 'Playmore Kẹo Dẻo Chua Hình Khủng Long 64G', '8859578600738', 'Bánh kẹo & Ăn vặt', 9500, 12500, 71, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578608345', 'Playmore Kẹo Dẻo Hình Con Ếch 64G', '8859578608345', 'Bánh kẹo & Ăn vặt', 11500, 15000, 68, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600165', 'Playmore Kẹo Dẻo Chua Hình Con Vịt 64G', '8859578600165', 'Bánh kẹo & Ăn vặt', 14500, 19000, 87, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600554', 'Playmore Kẹo Dẻo Trái Cây Hỗn Hợp 64G', '8859578600554', 'Bánh kẹo & Ăn vặt', 13000, 17000, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578608468', 'Playmore Kẹo Dẻo Hình Con Voi 64G', '8859578608468', 'Bánh kẹo & Ăn vặt', 18000, 24000, 85, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578606297', 'Playmore Kẹo Dẻo Quả Nho Bóc Vỏ 42G', '8859578606297', 'Bánh kẹo & Ăn vặt', 16000, 21000, 32, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600318', 'Playmore Kẹo Ngậm Vị Táo Đỏ Không Đường 22G', '8859578600318', 'Bánh kẹo & Ăn vặt', 11500, 15500, 59, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600370', 'Playmore Kẹo Ngậm Vị Chanh Mật Ong Không Đường 22G', '8859578600370', 'Bánh kẹo & Ăn vặt', 9500, 12500, 30, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600820', 'Playmore Kẹo Ngậm Vị Nho 22G', '8859578600820', 'Bánh kẹo & Ăn vặt', 13000, 17500, 44, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600882', 'Playmore Kẹo Ngậm Vị Bạc Hà Siêu Mát 22G', '8859578600882', 'Bánh kẹo & Ăn vặt', 8500, 11000, 32, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600288', 'Playmore Kẹo Ngậm Vị Xí Muội 22G', '8859578600288', 'Bánh kẹo & Ăn vặt', 13500, 18000, 87, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578601421', 'Playmore Kẹo Ngậm Vị Đào Sakura 22G', '8859578601421', 'Bánh kẹo & Ăn vặt', 10000, 13000, 91, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578602541', 'Playmore Kẹo Ngậm Vị Dâu Tây Không Đường 22G', '8859578602541', 'Bánh kẹo & Ăn vặt', 11500, 15500, 49, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600257', 'Playmore Kẹo Ngậm Vị Dưa Hấu 22G', '8859578600257', 'Bánh kẹo & Ăn vặt', 12500, 16500, 59, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677000341', 'Xylitol Kẹo Sing Gum Vị Chanh Bạc Hà 55.1G', '8934677000341', 'Bánh kẹo & Ăn vặt', 9500, 12500, 59, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563651138', 'Handy Hảo Hảo Mì Hộp Tôm Chua Cay 67G', '8934563651138', 'Thực phẩm ăn liền', 6000, 8000, 22, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563660130', 'Modern Mì Ly Hương Vị Gà Ớt Hiểm 63G', '8934563660130', 'Thực phẩm ăn liền', 11000, 14500, 49, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563544201', 'Siukay Mì Tô Tía Chớp Vị Hải Sản 96G', '8934563544201', 'Thực phẩm ăn liền', 13000, 17000, 50, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563550196', 'Handy Hảo Hảo Mì Tô Trộn Tôm Chua Cay 93G', '8934563550196', 'Thực phẩm ăn liền', 10500, 14000, 37, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563653132', 'Handy Hảo Hảo Mì Ly Tomyum 67G', '8934563653132', 'Thực phẩm ăn liền', 11500, 15000, 27, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563619138', 'Modern Mì Ly Lẩu Thái Tôm 67G', '8934563619138', 'Thực phẩm ăn liền', 11500, 15000, 68, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001338063', 'Fres Kẹo The Bạc Hà Lúa Mạch Barley 150G', '8996001338063', 'Bánh kẹo & Ăn vặt', 16500, 22000, 45, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563303150', 'Phú Hương Miến Thịt Bằm 55G', '8934563303150', 'Thực phẩm ăn liền', 5000, 6500, 53, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563215132', 'Đệ Nhất Phở Bò 68G', '8934563215132', 'Thực phẩm ăn liền', 5000, 6500, 36, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001346365', 'Fres Kẹo The Bạc Hà Táo Đào 150G', '8996001346365', 'Bánh kẹo & Ăn vặt', 10000, 13000, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563455149', 'Nhịp Sống Hủ Tiếu Hương Vị Hủ Tiếu Nam Vang 71G', '8934563455149', 'Thực phẩm ăn liền', 6000, 8000, 23, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001338056', 'Tamarin Kẹo Me 135G', '8996001338056', 'Bánh kẹo & Ăn vặt', 8500, 11000, 38, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563304157', 'Phú Hương Miến Lẩu Thái Tôm 60G', '8934563304157', 'Thực phẩm ăn liền', 5500, 7000, 28, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8996001320051', 'Kopiko Kẹo Cứng Vị Cà Phê 140G', '8996001320051', 'Bánh kẹo & Ăn vặt', 45500, 60500, 99, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563122201', 'Hảo Hảo Mì Big 100 Tôm Chua Cay 100G', '8934563122201', 'Thực phẩm ăn liền', 7500, 10000, 41, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936048471248', '3 Miền Mì Tôm Chua Cay (2X) 65G', '8936048471248', 'Thực phẩm ăn liền', 13000, 17500, 66, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936048470524', '3 Miền Mì Gold Bò Hầm Rau Thơm 75G', '8936048470524', 'Thực phẩm ăn liền', 7000, 9500, 94, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563358112', 'Phú Hương Miến Hương Vị Gà 53G', '8934563358112', 'Thực phẩm ăn liền', 7000, 9000, 80, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563102166', 'Thế Giới Mì Mì Lẩu Thái Tôm 81G', '8934563102166', 'Thực phẩm ăn liền', 7000, 9000, 73, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563198152', 'Hảo Hảo Mì Chay Rau Nấm 74G', '8934563198152', 'Thực phẩm ăn liền', 8500, 11000, 21, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563165161', 'Đệ Nhất Phở Thịt Bằm 83G', '8934563165161', 'Thực phẩm ăn liền', 5500, 7000, 22, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563138165', 'Hảo Hảo Mì Tôm Chua Cay 75G', '8934563138165', 'Thực phẩm ăn liền', 13000, 17000, 52, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563123130', 'Hảo Hảo Mì 100 Tôm Chua Cay 65G', '8934563123130', 'Thực phẩm ăn liền', 7500, 10000, 29, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677013310', 'Xylitol Kẹo Sing Gum Vị Chanh Bạc Hà 26.1G', '8934677013310', 'Bánh kẹo & Ăn vặt', 14500, 19000, 90, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563193263', 'Siukay Mì hương vị hải sản 128G', '8934563193263', 'Thực phẩm ăn liền', 4500, 6000, 45, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8859578600400', 'Playmore Kẹo Ngậm Vị Dưa Hấu 12G', '8859578600400', 'Bánh kẹo & Ăn vặt', 12500, 16500, 46, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934563116262', 'Siukay Mì Hương Vị Gà Xốt Phô Mai 131G', '8934563116262', 'Thực phẩm ăn liền', 8000, 10500, 88, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677013211', 'Xylitol Kẹo Sing Gum Vị Việt Quất 26.1G', '8934677013211', 'Bánh kẹo & Ăn vặt', 12500, 16500, 36, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677000334', 'Xylitol Kẹo Sing Gum Vị Việt Quất 55.1G', '8934677000334', 'Bánh kẹo & Ăn vặt', 12500, 16500, 90, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677038115', 'Xylitol Kẹo Sing Gum Vị Trái Cây Hỗn Hợp 55.1G', '8934677038115', 'Bánh kẹo & Ăn vặt', 11500, 15000, 94, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677000457', 'Xylitol Kẹo Sing Gum Vị Dâu Bạc Hà 55.1G', '8934677000457', 'Bánh kẹo & Ăn vặt', 11500, 15000, 42, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935341300422', 'Lotte Chocolat Bánh Socola Pie 169.8G', '8935341300422', 'Bánh kẹo & Ăn vặt', 28500, 38000, 88, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677000372', 'Xylitol Kẹo Sing Gum Vị Bạc Hà 55.1G', '8934677000372', 'Bánh kẹo & Ăn vặt', 16000, 21500, 65, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935341300224', 'Lotte Chocolat Bánh Bouchee Vị Socola 162G', '8935341300224', 'Bánh kẹo & Ăn vặt', 35000, 46500, 86, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934677020219', 'Xylitol Kẹo Sing Gum Vị Bạc Hà Siêu Mát 55.1G', '8934677020219', 'Bánh kẹo & Ăn vặt', 10500, 14000, 70, 'hũ', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8935341301122', 'Lotte Chocolat Bánh Bouchee Vị Phô Mai 162G', '8935341301122', 'Bánh kẹo & Ăn vặt', 19000, 25000, 48, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8852008304879', 'Koala''S March Bánh Gấu Nhân Sô Cô La Trắng 37G', '8852008304879', 'Bánh kẹo & Ăn vặt', 7000, 9500, 55, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8852008300116', 'Koala''S March Bánh Gấu Nhân Sô Cô La 37G', '8852008300116', 'Bánh kẹo & Ăn vặt', 12000, 16000, 87, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8852008300130', 'Koala''S March Bánh Gấu Nhân Kem Dâu 37G', '8852008300130', 'Bánh kẹo & Ăn vặt', 11000, 14500, 70, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8852008304848', 'Koala''S March Bánh Gấu Vỏ Và Nhân Sô Cô La 37G', '8852008304848', 'Bánh kẹo & Ăn vặt', 8500, 11000, 90, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062267712', 'Pepero Bánh Que Hạnh Nhân 32G', '8801062267712', 'Bánh kẹo & Ăn vặt', 11500, 15000, 52, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062641260', 'Pepero Bánh Que Choco Cookie 32G', '8801062641260', 'Bánh kẹo & Ăn vặt', 7000, 9500, 95, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062880140', 'Pepero Bánh Que Snowy Almond 32G', '8801062880140', 'Bánh kẹo & Ăn vặt', 8000, 10500, 84, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062636358', 'Pepero Bánh Que White Cookie 32G', '8801062636358', 'Bánh kẹo & Ăn vặt', 8500, 11500, 64, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062267675', 'Pepero Bánh Que Sô Cô La 47G', '8801062267675', 'Bánh kẹo & Ăn vặt', 9000, 12000, 77, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8801062881741', 'Pepero Bánh Que Crunchy 39G', '8801062881741', 'Bánh kẹo & Ăn vặt', 6500, 8500, 67, 'hộp', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803042276', 'Oishi Snack Tôm Vị Cay Đặc Biệt 68G', '8934803042276', 'Bánh kẹo & Ăn vặt', 7000, 9000, 47, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803070071', 'Oishi Snack Viên Vị Takoyaki 68G', '8934803070071', 'Bánh kẹo & Ăn vặt', 15000, 20000, 35, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803070187', 'Oishi Snack Tôm Vị Mực Nướng Muối Ớt 68G', '8934803070187', 'Bánh kẹo & Ăn vặt', 6500, 8500, 36, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803026122', 'Oishi Snack Phô Mai Miếng 68G', '8934803026122', 'Bánh kẹo & Ăn vặt', 14500, 19500, 61, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803053524', 'Oishi Snack Khoai Tây Vị Dưa Leo 65G', '8934803053524', 'Bánh kẹo & Ăn vặt', 9500, 12500, 73, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803012255', 'Oishi Snack Tôm Vị Cay 68G', '8934803012255', 'Bánh kẹo & Ăn vặt', 11500, 15500, 38, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8934803053531', 'Oishi Snack Khoai Tây Vị Tảo Biển 65G', '8934803053531', 'Bánh kẹo & Ăn vặt', 11500, 15000, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183006343', 'Pati Kẹo Dẻo Bất Ngờ Vị Nho 63G', '8936183006343', 'Bánh kẹo & Ăn vặt', 13000, 17000, 21, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183006312', 'Pati Kẹo Dẻo Lột Vỏ Vị Đào 80G', '8936183006312', 'Bánh kẹo & Ăn vặt', 18500, 24500, 44, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183006329', 'Pati Kẹo Dẻo Lột Vỏ Vị Nho Mẫu Đơn 80G', '8936183006329', 'Bánh kẹo & Ăn vặt', 13000, 17500, 78, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183006336', 'Pati Kẹo Dẻo Bất Ngờ Vị Dâu 63G', '8936183006336', 'Bánh kẹo & Ăn vặt', 12000, 16000, 77, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183003076', 'Sachi Bánh Tráng Nướng Phủ Mực Nướng 45G', '8936183003076', 'Bánh kẹo & Ăn vặt', 17000, 22500, 26, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702403689', 'Big Bang Rong Biển Vị Mực 6G', '8858702403689', 'Bánh kẹo & Ăn vặt', 10000, 13000, 32, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183002857', 'Sachi Bánh Tráng Nướng Phủ Khô Bò Cay 45G', '8936183002857', 'Bánh kẹo & Ăn vặt', 13500, 18000, 67, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8858702403672', 'Big Bang Rong Biển Vị Truyền Thống 6G', '8858702403672', 'Bánh kẹo & Ăn vặt', 13000, 17500, 98, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183002833', 'Sachi Bánh Tráng Nướng Phủ Phô Mai 45G', '8936183002833', 'Bánh kẹo & Ăn vặt', 16000, 21500, 60, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8857107231057', 'Crispy Seaweed Rong Biển Vị Cay 15G', '8857107231057', 'Bánh kẹo & Ăn vặt', 13500, 18000, 49, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183003069', 'Sachi Bánh Tráng Nướng Phủ Rong Biển 45G', '8936183003069', 'Bánh kẹo & Ăn vặt', 8000, 10500, 72, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO products (id, name, barcode, category, cost_price, price, stock, unit, expiry_days, branch_id)
VALUES ('SP_8936183003083', 'Sachi Bánh Tráng Nướng Phủ Tôm Nướng Cay 45G', '8936183003083', 'Bánh kẹo & Ăn vặt', 8000, 10500, 59, 'gói', 180, 'branch_main')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
