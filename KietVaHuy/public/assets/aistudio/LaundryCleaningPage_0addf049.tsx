import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';

interface LaundryCleaningPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

interface LaundryProduct {
  id: string;
  category: 'detergent' | 'softener' | 'dishwash' | 'sanitary';
  brand: string;
  pack: 'pouch' | 'can' | 'bottle';
  washer: 'top-load' | 'front-load' | 'hand-wash';
  badgeLeft: { text: string; cls: string };
  badgeRight?: string;
  discountPct?: number;
  img: string;
  alt: string;
  statIcon: string;
  statColor: string;
  statText: string;
  title: string;
  subtitle: string;
  price: number;
  priceStr: string;
  strikeStr?: string;
  points: string;
}

const PRODUCTS: LaundryProduct[] = [
  // === 8 SẢN PHẨM GỐC (GIỮ NGUYÊN 100%) ===
  {
    id: 'omo-matic',
    category: 'detergent',
    brand: 'OMO',
    pack: 'pouch',
    washer: 'top-load',
    badgeLeft: { text: 'Hay Mua Nhất', cls: 'bg-primary text-on-primary text-label-sm px-2 py-0.5 rounded-full font-bold shadow-sm' },
    badgeRight: '-18%',
    discountPct: 18,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj72g2ZvUBiJjcoqdOwzLCc7RfqmJLC8vJ2Xo5-aSpYwcavFKfB2Lz0kLwFWdh9nI1ud0AN727TuRwg5MJl5mbvFHfPzafJ5O3q_6Lr1Yveyap7oKGMIxgkRNiRs70Qw4hkjFOlAJyNF4XKXBXdokdvn6l-w-YilSxfDwQgtzsnlM82BxWskyChZjwWWOldtvy06LGau7xV9envdOWauoWyTLfZqkzr7kQHY5Pn5Hn',
    alt: 'Nước giặt OMO Matic cửa trên túi 3.6kg',
    statIcon: 'local_fire_department',
    statColor: 'text-secondary',
    statText: 'Đã bán 4.8k túi/tháng',
    title: 'Nước giặt OMO Matic Cửa Trên Chuyên Sâu Túi 3.6kg',
    subtitle: 'Túi có nắp rót tiết kiệm',
    price: 178000,
    priceStr: '178.000đ',
    strikeStr: '215.000đ',
    points: 'Tích +5.340đ',
  },
  {
    id: 'comfort-ban-mai',
    category: 'softener',
    brand: 'Comfort',
    pack: 'pouch',
    washer: 'top-load',
    badgeLeft: { text: 'Hương 48h', cls: 'bg-secondary text-on-secondary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    discountPct: 10,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-s9BvMxWIK4-WQGi8DLkxBDZdkVqK7qamwvftGlQeHcZjiUPJ8z5NSM2Fq1pYvvnainPTV9sc_BIEreX-v8YrpQ5ntegCVnWezzb5ZEkil-GVgLYNuZkQaxsyPv4gVhGy2f24n0rIgwV2oFRkCC8zqkf1mh32QJAxAuM3PYl2Ym9_ri3LzN7eZyz6h5HtMmki_mLgFEvWa1LlGS-s-BQyxbHzPU-zrJT3foCn317z',
    alt: 'Nước xả vải Comfort Một Lần Xả hương ban mai túi 3.2L',
    statIcon: 'spa',
    statColor: 'text-tertiary',
    statText: 'Hương ban mai sớm',
    title: 'Nước Xả Vải Comfort Một Lần Xả Hương Ban Mai Túi 3.2L',
    subtitle: 'Chống xơ vải & tĩnh điện',
    price: 185000,
    priceStr: '185.000đ',
    strikeStr: '205.000đ',
    points: 'Tích +5.550đ',
  },
  {
    id: 'downy-huyen-bi',
    category: 'softener',
    brand: 'Downy',
    pack: 'pouch',
    washer: 'top-load',
    badgeLeft: { text: 'Nước Hoa Quý Phái', cls: 'bg-tertiary text-on-tertiary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    discountPct: 12,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBci_Y0y8H-FlfKKooKiWZp2wzAHjq7xkoKy7XrDvnN4a6_0R0jNarYNP8YhImKkcZAracxftvqjQg-Ol-J5vCI7vO8ZunoEzgU87Lpn3VpsRpzVkrnxwG4sLBmrzZaYNG3wk_0oyiXgWqU6Je928Sn_EDiCVnorCQ06-1PbMZkJ85HmdD215-YiAjDnvzKMyCw0eKeWVtXlDq7Bxlpd2u1XiOdCdm9vN2468JWpuA7',
    alt: 'Nước xả vải Downy Nước Hoa Huyền Bí túi 3L',
    statIcon: 'auto_awesome',
    statColor: 'text-on-surface-variant',
    statText: 'Hạt lưu hương bung tỏa',
    title: 'Nước Xả Vải Downy Nước Hoa Đóa Hoa Huyền Bí Túi 3L',
    subtitle: 'Lưu hương sang trọng cả ngày',
    price: 192000,
    priceStr: '192.000đ',
    strikeStr: '219.000đ',
    points: 'Tích +5.760đ',
  },
  {
    id: 'sunlight-chanh',
    category: 'dishwash',
    brand: 'Sunlight',
    pack: 'bottle',
    washer: 'hand-wash',
    badgeLeft: { text: 'Sạch Dầu Mỡ', cls: 'bg-secondary text-on-secondary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    discountPct: 13,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkt80s6ZDh6IJcmEN4W6E8shVmXEE2et_jkKA0Yzewpv353l-LK0Q7i0wf4bkaPVfVW-i7k2rS6n1_ErjTpEqZbgPrOuwAy8RzVx1qY8hKlnZZjrAEfkQhpvjVbcSKpSoHHVJUSjQZk-16INw_Kob2MCUd7CIgDqbsR9doQDYDPTZddkXeBhzpdRTSz7UlpT9tj1mtqA1dkTj0lJYUnNQ9MHg2Jy5Ljr1jADWch5KV',
    alt: 'Nước rửa chén Sunlight Chanh 100 túi 750g',
    statIcon: 'eco',
    statColor: 'text-secondary',
    statText: 'Chiết xuất chanh thật 100%',
    title: 'Nước Rửa Chén Sunlight Chanh 100 Túi Tiết Kiệm 750g',
    subtitle: 'Tùy chọn: Túi 2.1kg (68.000đ)',
    price: 27000,
    priceStr: '27.000đ',
    strikeStr: '31.000đ',
    points: 'Tích +810đ',
  },
  {
    id: 'sunlight-lau-san',
    category: 'dishwash',
    brand: 'Sunlight',
    pack: 'bottle',
    washer: 'hand-wash',
    badgeLeft: { text: 'Sạch Bóng Kin Kít', cls: 'bg-primary-fixed text-on-primary-fixed-variant text-label-sm px-2 py-0.5 rounded-full font-bold' },
    discountPct: 13,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHJycrbcURNTH9G7ylxDRz93WRCPMQfvrE6wNQ8xZrDigeM8mQoCWzw7mybbDrfFAzb5bMSL3LXNFgy4NbtJ1sMVPMWK0k54HoeGROYwjiql4abH0MOHtDCeI9-0qxdY-WK_7bZxLhWnHxgZ2QxKBm3neZ1dwgT56148pGBqwgGjdrTLWZbHmi_ZI9wUjsLw8-8Z4wZ-dzWFLAdOTF5Kk2zivab-6NTSXpP0nGw_B_',
    alt: 'Nước lau sàn Sunlight Tinh Dầu Hoa Hạ chai 1kg',
    statIcon: 'local_florist',
    statColor: 'text-on-surface-variant',
    statText: 'Tinh dầu hoa tự nhiên',
    title: 'Nước Lau Sàn Sunlight Tinh Dầu Hoa Hạ Chai 1kg',
    subtitle: 'Khô nhanh, không trơn rít chân',
    price: 34000,
    priceStr: '34.000đ',
    strikeStr: '39.000đ',
    points: 'Tích +1.020đ',
  },
  {
    id: 'vim-bon-cau',
    category: 'sanitary',
    brand: 'Vim',
    pack: 'bottle',
    washer: 'hand-wash',
    badgeLeft: { text: 'Diệt 99.9% Khuẩn', cls: 'bg-error text-on-error text-label-sm px-2 py-0.5 rounded-full font-bold' },
    discountPct: 13,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr-IhJzq9aSb7DcKGELXlDxC4J1LvMInD5-yWJj1LGicbnnWerZtOq_jqaMMCaH9EVbPbp13DFFK85r5cFED97GxQbXwhbI3GioLSemHom-JlCDAeQGebsv65T4hGixVqgKhri3aZ7Unt2rXaANIaSY7GWUZMGKwRjuS2-ZkM8Hxk50zSMtbDWerwAKeQaTPQxfdPnhLP9VblB3H3fs6CkDeJ1uqkeov9WRs0yP2Wp',
    alt: 'Nước tẩy bồn cầu Vim Diệt Khuẩn chai 900ml',
    statIcon: 'security',
    statColor: 'text-error',
    statText: 'Công thức đậm đặc Sodium Hypochlorite',
    title: 'Nước Tẩy Bồn Cầu Vim Diệt Khuẩn Đậm Đặc Chai 900ml',
    subtitle: 'Đầu vòi xịt góc khuất tiện lợi',
    price: 39000,
    priceStr: '39.000đ',
    strikeStr: '45.000đ',
    points: 'Tích +1.170đ',
  },
  {
    id: 'omo-800g',
    category: 'detergent',
    brand: 'OMO',
    pack: 'bottle',
    washer: 'hand-wash',
    badgeLeft: { text: 'Sạch Nhanh', cls: 'bg-secondary text-on-secondary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    discountPct: 14,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLPuuTvJEtDot_6dMD82-dGmwC44OagTsHX-ri0MkI6gUW8KeShs5Yl8o6_lgMiUFf5r9Djn7k8u-SXfi1ASKFkj_TVGxw5-ItkE3CSq_RTs2FAQ16flFCWK59GJ4TUnXy-u9OpG1-ayEjvVu4QsE_1Tm0Y1g0mUr6ErtTgjvzXgAYKLWKGkacPTW9HHj_OxOaM0magrgY09tf152ImZ-c7j8uF8TX7a0WC7FO6G5G',
    alt: 'Bột giặt OMO sạch cực nhanh gói 800g',
    statIcon: 'flash_on',
    statColor: 'text-secondary',
    statText: 'Hạt năng lượng xoáy sâu',
    title: 'Bột Giặt OMO Sạch Cực Nhanh Gói Tiện Lợi 800g',
    subtitle: 'Thích hợp giặt tay & ngâm',
    price: 36000,
    priceStr: '36.000đ',
    strikeStr: '42.000đ',
    points: 'Tích +1.080đ',
  },
  {
    id: 'tui-rac-opec',
    category: 'sanitary',
    brand: 'Opec',
    pack: 'bottle',
    washer: 'hand-wash',
    badgeLeft: { text: 'Tự Hủy 100%', cls: 'bg-secondary text-on-secondary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    discountPct: 16,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdP06H112SfVns44f6zICNpEYdHTUajLS70sjCqiwV8WJz06OMPaZ5JFrcS3dwuIDu1g2Oju4_qFCU_ftPVenzwMvhVsCZrg9LLDH2P9lV7QRB6BBsytgwVPji3zqG6QfJdujfsfmVa0NkXLt2QmrZXoMJQn1a0umH86qUEA1YG7ijRbDlFNS2xe8DS6khT8nHBexY6-BQsOfM-nzDwAQWY_iU0iTAIKbN9c0XbPVk',
    alt: 'Túi rác tự hủy sinh học Opec 3 cuộn màu xanh',
    statIcon: 'recycling',
    statColor: 'text-secondary',
    statText: 'Thân thiện môi trường',
    title: 'Túi Rác Tự Hủy Sinh Học Opec Lốc 3 Cuộn Xanh (55x65cm)',
    subtitle: 'Độ dẻo dai cao, không rách đáy',
    price: 32000,
    priceStr: '32.000đ',
    strikeStr: '38.000đ',
    points: 'Tích +960đ',
  },

  // === 10 SẢN PHẨM MỚI BỔ SUNG (TỔNG CỘNG 18 SẢN PHẨM) ===
  {
    id: 'ariel-cua-truoc-31l',
    category: 'detergent',
    brand: 'Ariel',
    pack: 'pouch',
    washer: 'front-load',
    badgeLeft: { text: 'Cửa Trước', cls: 'bg-primary text-on-primary text-label-sm px-2 py-0.5 rounded-full font-bold shadow-sm' },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2464/237563/nuoc-giat-ariel-matic-cua-truoc-tuoi-mat-ruc-ro-31-lit_202610010200348350.jpg',
    alt: 'Nước giặt Ariel Matic cửa trước Tươi Mát Rực Rỡ túi 3.1 lít',
    statIcon: 'local_laundry_service',
    statColor: 'text-secondary',
    statText: 'Chuyên dụng máy giặt cửa trước',
    title: 'Nước Giặt Ariel Matic Cửa Trước Tươi Mát Rực Rỡ Túi 3.1 Lít',
    subtitle: 'Công thức ít bọt, sạch sâu vết bẩn',
    price: 239000,
    priceStr: '239.000đ',
    points: 'Tích +7.170đ',
  },
  {
    id: 'surf-nuoc-hoa-3l',
    category: 'detergent',
    brand: 'Surf',
    pack: 'pouch',
    washer: 'top-load',
    badgeLeft: { text: 'Tiết Kiệm', cls: 'bg-secondary text-on-secondary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/2464/221049/nuoc-giat-surf-huong-nuoc-hoa-tui-3-lit_202609221356400166.jpg',
    alt: 'Nước giặt Surf hương nước hoa say đắm túi 3 lít',
    statIcon: 'spa',
    statColor: 'text-tertiary',
    statText: 'Hương nước hoa say đắm',
    title: 'Nước Giặt Surf Hương Nước Hoa Say Đắm Túi 3 Lít',
    subtitle: 'Dùng cho giặt tay & máy cửa trên',
    price: 105000,
    priceStr: '105.000đ',
    points: 'Tích +3.150đ',
  },
  {
    id: 'ariel-vien-giat-4d',
    category: 'detergent',
    brand: 'Ariel',
    pack: 'bottle',
    washer: 'front-load',
    badgeLeft: { text: 'Viên Giặt 4D', cls: 'bg-tertiary text-on-tertiary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    badgeRight: '-25%',
    discountPct: 25,
    img: 'https://product.hstatic.net/200000833669/product/soukai_4987176140180_i_202301241_84e76a7228c64a6aa4fdf3d7684bad62_grande.png',
    alt: 'Viên giặt xả P&G Ariel 4D Gel hương hoa ngọt ngào hộp 11 viên',
    statIcon: 'auto_awesome',
    statColor: 'text-primary',
    statText: 'Nội địa Nhật Bản tiện lợi',
    title: 'Viên Giặt Xả P&G Ariel 4D Gel Hương Hoa Ngọt Ngào Hộp 11 Viên',
    subtitle: '1 viên dùng cho 6kg quần áo khô',
    price: 73500,
    priceStr: '73.500đ',
    strikeStr: '98.000đ',
    points: 'Tích +2.205đ',
  },
  {
    id: 'dnee-lovely-sky-3l',
    category: 'detergent',
    brand: 'D-nee',
    pack: 'can',
    washer: 'hand-wash',
    badgeLeft: { text: 'Cho Trẻ Em', cls: 'bg-secondary text-on-secondary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    img: 'https://cdnv2.tgdd.vn/pim/cdn/images/202508/nuoc-giat-cho-be-d-nee-lovely-sky-xanh-ban-mai-can-3-lit-thumb100333.jpg',
    alt: 'Nước giặt cho bé D-nee Lovely Sky xanh ban mai can 3 lít',
    statIcon: 'child_care',
    statColor: 'text-secondary',
    statText: 'pH trung tính dịu nhẹ da bé',
    title: 'Nước Giặt Cho Bé D-nee Lovely Sky Xanh Ban Mai Can 3 Lít',
    subtitle: 'Giặt sạch dịu nhẹ đồ trẻ sơ sinh',
    price: 245000,
    priceStr: '245.000đ',
    points: 'Tích +7.350đ',
  },
  {
    id: 'lix-bot-giat-24h-55kg',
    category: 'detergent',
    brand: 'Lix',
    pack: 'can',
    washer: 'top-load',
    badgeLeft: { text: 'Túi Đại 5.5kg', cls: 'bg-primary-fixed text-on-primary-fixed-variant text-label-sm px-2 py-0.5 rounded-full font-bold' },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2463/310730/bot-giat-lix-sach-thom-24h-ngat-huong_202610010127331283.jpg',
    alt: 'Bột giặt Lix Sạch Thơm 24h Ngát Hương túi 5.5kg',
    statIcon: 'bolt',
    statColor: 'text-secondary',
    statText: 'Hòa tan nhanh, sạch bọt',
    title: 'Bột Giặt Lix Sạch Thơm 24h Ngát Hương Túi 5.5kg',
    subtitle: 'Dùng cho giặt tay & máy cửa trên',
    price: 175000,
    priceStr: '175.000đ',
    points: 'Tích +5.250đ',
  },
  {
    id: 'hygiene-hoa-tu-dang-3l',
    category: 'softener',
    brand: 'Hygiene',
    pack: 'pouch',
    washer: 'top-load',
    badgeLeft: { text: 'Thái Lan', cls: 'bg-tertiary text-on-tertiary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2465/5369078/nuoc-xa-vai-hygiene-huong-hoa-tu-dang-tui-3-lit_202610230128090757.png',
    alt: 'Nước xả vải Hygiene hương hoa tử đằng túi 3 lít',
    statIcon: 'local_florist',
    statColor: 'text-tertiary',
    statText: 'Hương hoa tử đằng dịu ngọt',
    title: 'Nước Xả Vải Hygiene Hương Hoa Tử Đằng Túi 3 Lít',
    subtitle: 'Túi vòi lớn làm mềm sợi vải',
    price: 248000,
    priceStr: '248.000đ',
    points: 'Tích +7.440đ',
  },
  {
    id: 'maxkleen-huyen-dieu-38kg',
    category: 'detergent',
    brand: 'MaxKleen',
    pack: 'can',
    washer: 'front-load',
    badgeLeft: { text: 'Giặt Xả 2in1', cls: 'bg-primary text-on-primary text-label-sm px-2 py-0.5 rounded-full font-bold shadow-sm' },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2464/224595/nuoc-giat-xa-maxkleen-huong-nuoc-hoa-huyen-dieu-tui-38kg_202610010122140690.jpg',
    alt: 'Nước giặt xả MaxKleen hương nước hoa huyền diệu túi 3.8kg',
    statIcon: 'auto_awesome',
    statColor: 'text-secondary',
    statText: 'Ultra Kép sạch sâu & lưu hương',
    title: 'Nước Giặt Xả MaxKleen Hương Nước Hoa Huyền Diệu Túi 3.8kg',
    subtitle: 'Dùng cho máy cửa trên & cửa trước',
    price: 210000,
    priceStr: '210.000đ',
    points: 'Tích +6.300đ',
  },
  {
    id: 'lix-matic-32kg',
    category: 'detergent',
    brand: 'Lix',
    pack: 'pouch',
    washer: 'top-load',
    badgeLeft: { text: 'Cửa Trên', cls: 'bg-secondary text-on-secondary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2464/330909/nuoc-giat-lix-matic-huong-nuoc-hoa-tui-32kg_202610010115276057.jpg',
    alt: 'Nước giặt Lix Matic hương nước hoa túi 3.2kg',
    statIcon: 'local_fire_department',
    statColor: 'text-secondary',
    statText: 'Chuyên dụng máy giặt cửa trên',
    title: 'Nước Giặt Lix Matic Hương Nước Hoa Túi 3.2kg',
    subtitle: 'Đậm đặc sạch nhanh, thơm ngát lâu',
    price: 115000,
    priceStr: '115.000đ',
    points: 'Tích +3.450đ',
  },
  {
    id: 'axo-tay-do-mau-800ml',
    category: 'sanitary',
    brand: 'AXO',
    pack: 'bottle',
    washer: 'hand-wash',
    badgeLeft: { text: 'Tẩy Đồ Màu', cls: 'bg-primary-fixed text-on-primary-fixed-variant text-label-sm px-2 py-0.5 rounded-full font-bold' },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2493/76532/axo-trang-white-breeze-800ml_202610010137217419.jpg',
    alt: 'Nước tẩy quần áo màu AXO hương thanh khiết chai 800ml',
    statIcon: 'verified',
    statColor: 'text-secondary',
    statText: 'Không làm phai màu sợi vải',
    title: 'Nước Tẩy Quần Áo Màu AXO Thanh Khiết Chai 800ml',
    subtitle: 'Đánh bay vết bẩn cứng đầu trên đồ màu',
    price: 58000,
    priceStr: '58.000đ',
    points: 'Tích +1.740đ',
  },
  {
    id: 'downy-xit-vai-370ml',
    category: 'softener',
    brand: 'Downy',
    pack: 'bottle',
    washer: 'hand-wash',
    badgeLeft: { text: 'Khử Mùi Vải', cls: 'bg-secondary text-on-secondary text-label-sm px-2 py-0.5 rounded-full font-bold' },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2465/278982/nuoc-xit-vai-downy-huong-nang-mai-370ml_202610010124544127.jpg',
    alt: 'Nước xịt vải khử mùi Downy hương nắng mai chai 370ml',
    statIcon: 'air',
    statColor: 'text-secondary',
    statText: 'Khử mùi hôi ẩm mốc tức thì',
    title: 'Nước Xịt Vải Khử Mùi Downy Hương Nắng Mai Chai 370ml',
    subtitle: 'Xịt trực tiếp lên quần áo, rèm, sofa',
    price: 109000,
    priceStr: '109.000đ',
    points: 'Tích +3.270đ',
  },
];

export const LaundryCleaningPage: React.FC<LaundryCleaningPageProps> = ({
  onNavigate,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [packFilters, setPackFilters] = useState<string[]>(['pouch']);
  const [washerFilters, setWasherFilters] = useState<string[]>(['top-load']);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [selectedScent, setSelectedScent] = useState('Hương ban mai tinh khiết');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('Bán chạy & Thường mua nhất');
  const [activePage, setActivePage] = useState(1);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const timersRef = useRef<Record<string, number>>({});
  const productListTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const togglePackFilter = (key: string) => {
    setFiltersApplied(true);
    setPackFilters((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
    setActivePage(1);
  };

  const toggleWasherFilter = (key: string) => {
    setFiltersApplied(true);
    setWasherFilters((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
    setActivePage(1);
  };

  const handleResetFilters = () => {
    setPackFilters([]);
    setWasherFilters([]);
    setFiltersApplied(false);
    setSelectedBrand(null);
    setActiveTab('all');
    setActivePage(1);
  };

  const handleAddProduct = (id: string, price: number) => {
    onAddToCart(price, 1);
    setAddedIds((prev) => ({ ...prev, [id]: true }));
    if (timersRef.current[id]) {
      window.clearTimeout(timersRef.current[id]);
    }
    timersRef.current[id] = window.setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeTab !== 'all' && p.category !== activeTab) {
      return false;
    }
    if (selectedBrand) {
      if (selectedBrand === 'OMO Matic' && p.brand !== 'OMO') return false;
      if (selectedBrand === 'Vim & Gift' && p.brand !== 'Vim') return false;
      if (
        selectedBrand !== 'OMO Matic' &&
        selectedBrand !== 'Vim & Gift' &&
        p.brand !== selectedBrand
      ) {
        return false;
      }
    }
    if (filtersApplied) {
      if (packFilters.length > 0 && !packFilters.includes(p.pack)) return false;
      if (washerFilters.length > 0 && !washerFilters.includes(p.washer)) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Giá: Thấp đến Cao') return a.price - b.price;
    if (sortOption === 'Giá: Cao đến Thấp') return b.price - a.price;
    if (sortOption === 'Ưu đãi nhiều nhất (%)') {
      return (b.discountPct ?? 0) - (a.discountPct ?? 0);
    }
    return 0;
  });

  const ITEMS_PER_PAGE = 8;
  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, activePage), totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(1, nextPage), totalPages);
    setActivePage(clampedPage);
    window.requestAnimationFrame(() => {
      productListTopRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* BREADCRUMB & PROMO CALLOUT BAR */}
      <section className="w-full bg-surface-container-low py-space-sm">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-wrap items-center justify-between gap-space-sm text-label-md">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-label-md">
            <a
              className="hover:text-primary transition-colors flex items-center gap-1"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              Trang chủ
            </a>
            <span className="text-outline-variant font-body-sm">/</span>
            <a
              className="hover:text-primary transition-colors"
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
            >
              Danh mục thường mua
            </a>
            <span className="text-outline-variant font-body-sm">/</span>
            <span className="text-primary font-bold">Hóa phẩm giặt xả</span>
          </nav>
          <div className="flex items-center gap-2 bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[15px] text-primary">local_shipping</span>
            <span>Cam kết: Giao xách tận bếp - Can to nặng không lo leo lầu!</span>
          </div>
        </div>
      </section>

      {/* CATEGORY HERO BANNER */}
      <section className="max-w-7xl mx-auto px-margin-desktop w-full pt-space-lg">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-fixed via-surface-container-low to-tertiary-fixed p-6 md:p-10 shadow-sm">
          <div className="relative z-10 max-w-2xl flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest text-primary px-3 py-1 rounded-full font-label-sm shadow-sm">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Chính hãng OMO, Downy, Sunlight, Ariel
              </span>
              <span className="inline-flex items-center gap-1 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm">
                <span className="material-symbols-outlined text-[14px]">cloud_download</span>
                Hương thơm bền lâu 48h
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight">
              Hóa Phẩm Giặt Xả &amp; Vệ Sinh Chăm Sóc Nhà Cửa
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Nước giặt sạch sâu mọi vết bẩn, nước xả thơm mát mềm vải, nước rửa chén đánh bay dầu mỡ và tẩy rửa phòng tắm diệt khuẩn bảo vệ cả gia đình. Đóng thùng chống móp méo, bọc màng co chống rò rỉ 100%.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2 text-on-surface font-label-md">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                Đầy đủ tem niêm phong
              </div>
              <div className="flex items-center gap-2 text-on-surface font-label-md">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Đổi trả nếu rách vỡ khi nhận
              </div>
              <div className="flex items-center gap-2 text-on-surface font-label-md">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                Tích lũy 3% cho đơn sau
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-10 w-96 h-96 opacity-30 md:opacity-90 pointer-events-none">
            <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 200 200">
              <path
                d="M48.2,-61.2C61.4,-52.1,70.5,-37.2,74.7,-20.9C78.9,-4.6,78.2,13.2,71.2,28.3C64.2,43.4,50.8,55.7,35.7,64.2C20.6,72.7,3.8,77.3,-12.3,74.9C-28.4,72.5,-43.8,63,-56.3,50.1C-68.8,37.2,-78.4,20.8,-79.8,3.5C-81.2,-13.7,-74.3,-31.8,-62.4,-44.6C-50.6,-57.4,-33.7,-64.9,-16.9,-65.7C-0.1,-66.6,35,-60.4,48.2,-61.2Z"
                opacity="0.12"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* SUB-CATEGORY PILL TABS */}
      <section className="max-w-7xl mx-auto px-margin-desktop w-full pt-space-lg">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'Tất cả hóa phẩm', count: String(PRODUCTS.length) },
            {
              id: 'detergent',
              label: '🧺 Nước giặt & Bột giặt',
              count: String(PRODUCTS.filter((p) => p.category === 'detergent').length),
            },
            {
              id: 'softener',
              label: '🌸 Nước xả vải thơm mềm',
              count: String(PRODUCTS.filter((p) => p.category === 'softener').length),
            },
            {
              id: 'dishwash',
              label: '🍋 Nước rửa chén & Lau sàn',
              count: String(PRODUCTS.filter((p) => p.category === 'dishwash').length),
            },
            {
              id: 'sanitary',
              label: '🛡️ Xịt diệt khuẩn & Bồn cầu',
              count: String(PRODUCTS.filter((p) => p.category === 'sanitary').length),
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setActivePage(1);
                }}
                className={`shrink-0 px-4 py-2 rounded-full font-label-md shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest hover:bg-primary-fixed text-on-surface hover:text-on-primary-fixed-variant'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={
                    isActive
                      ? 'bg-surface-container-lowest text-primary text-[11px] font-bold px-1.5 py-0.5 rounded-full'
                      : 'bg-surface-container text-on-surface-variant text-[11px] px-1.5 py-0.5 rounded-full font-medium'
                  }
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* MAIN LISTING: SIDEBAR + PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-margin-desktop w-full py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-lg lg:sticky lg:top-40">
            <div className="flex items-center justify-between pb-space-sm border-b-0">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Bộ Lọc Chọn Nhanh
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-primary hover:underline font-label-sm cursor-pointer"
              >
                Xóa lọc
              </button>
            </div>

            {/* Filter 1 */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface font-bold flex items-center justify-between">
                <span>Quy Cách &amp; Định Lượng</span>
                <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
              </label>
              <div className="flex flex-col gap-1.5 text-body-md">
                {[
                  { id: 'pouch', label: 'Túi nắp rót 2kg - 3.6kg', count: `(${PRODUCTS.filter((p) => p.pack === 'pouch').length})` },
                  { id: 'can', label: 'Can lớn tiết kiệm 3L - 5.5kg', count: `(${PRODUCTS.filter((p) => p.pack === 'can').length})` },
                  { id: 'bottle', label: 'Chai / Hộp tiện lợi', count: `(${PRODUCTS.filter((p) => p.pack === 'bottle').length})` },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input
                      checked={packFilters.includes(opt.id)}
                      onChange={() => togglePackFilter(opt.id)}
                      className="accent-primary rounded w-4 h-4 cursor-pointer"
                      type="checkbox"
                    />
                    <span className="flex-1 text-on-surface font-body-sm">{opt.label}</span>
                    <span className="text-outline text-label-sm">{opt.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 2 */}
            <div className="flex flex-col gap-2 pt-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-bold flex items-center justify-between">
                <span>Loại Máy Giặt Sử Dụng</span>
                <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
              </label>
              <div className="flex flex-col gap-1.5 text-body-md">
                {[
                  { id: 'top-load', label: 'Máy giặt cửa trên', count: `(${PRODUCTS.filter((p) => p.washer === 'top-load').length})` },
                  { id: 'front-load', label: 'Cửa trước chống trào bọt', count: `(${PRODUCTS.filter((p) => p.washer === 'front-load').length})` },
                  { id: 'hand-wash', label: 'Giặt tay dịu nhẹ & gia dụng', count: `(${PRODUCTS.filter((p) => p.washer === 'hand-wash').length})` },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input
                      checked={washerFilters.includes(opt.id)}
                      onChange={() => toggleWasherFilter(opt.id)}
                      className="accent-primary rounded w-4 h-4 cursor-pointer"
                      type="checkbox"
                    />
                    <span className="flex-1 text-on-surface font-body-sm">{opt.label}</span>
                    <span className="text-outline text-label-sm">{opt.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 3 */}
            <div className="flex flex-col gap-2 pt-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-bold flex items-center justify-between">
                <span>Mùi Hương Yêu Thích</span>
                <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Hương ban mai tinh khiết',
                  'Hương nước hoa cao cấp',
                  'Oải hương Lavender',
                  'Hương chanh tươi thanh mát',
                ].map((scent) => {
                  const isActive = selectedScent === scent;
                  return (
                    <button
                      key={scent}
                      type="button"
                      onClick={() => setSelectedScent(scent)}
                      className={`px-2.5 py-1 rounded-full text-label-sm cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {scent}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 4 */}
            <div className="flex flex-col gap-2 pt-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-bold flex items-center justify-between">
                <span>Thương Hiệu Đáng Tin Cậy</span>
                <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-label-sm font-medium">
                {[
                  'OMO Matic',
                  'Comfort',
                  'Downy',
                  'Sunlight',
                  'Ariel',
                  'Vim & Gift',
                  'Surf',
                  'D-nee',
                  'Lix',
                  'Hygiene',
                  'MaxKleen',
                  'AXO',
                ].map((brand) => {
                  const isSelected = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => {
                        setSelectedBrand(isSelected ? null : brand);
                        setActivePage(1);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary-fixed text-on-primary-fixed-variant font-bold'
                          : 'bg-surface-container-low hover:bg-primary-fixed hover:text-on-primary-fixed-variant'
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Banner cam kết vận chuyển an toàn */}
            <div className="rounded-xl bg-surface-container-low p-3 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">inventory_2</span>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Bọc túi chống tràn khí
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Mỗi chai, can nắp rót đều quấn màng co và dán băng keo niêm phong miệng vòi.
                </span>
              </div>
            </div>
          </aside>

          {/* PRODUCTS CONTAINER */}
          <div
            ref={productListTopRef}
            className="lg:col-span-9 flex flex-col gap-space-lg scroll-mt-40"
          >
            {/* Sorting bar */}
            <div className="bg-surface-container-lowest rounded-2xl px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-body-sm text-on-surface">
                <span>
                  Hiển thị <strong className="text-primary font-bold">{displayedProducts.length}</strong> trên{' '}
                  <strong className="font-bold">{totalProducts}</strong> sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant font-label-sm">Sắp xếp theo:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setActivePage(1);
                  }}
                  className="bg-surface-container-low text-on-surface font-label-md rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Bán chạy &amp; Thường mua nhất</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                  <option>Ưu đãi nhiều nhất (%)</option>
                </select>
              </div>
            </div>

            {/* 4-Column Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-gutter-desktop">
              {displayedProducts.map((item) => {
                const isAdded = Boolean(addedIds[item.id]);
                return (
                  <article
                    key={item.id}
                    className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group relative"
                  >
                    <div>
                      <div className="relative w-full aspect-square rounded-xl bg-surface-container-low overflow-hidden mb-space-sm flex items-center justify-center">
                        <span className={`absolute top-2 left-2 z-10 ${item.badgeLeft.cls}`}>
                          {item.badgeLeft.text}
                        </span>
                        {item.badgeRight && (
                          <span className="absolute top-2 right-2 z-10 bg-secondary text-on-secondary text-label-sm px-1.5 py-0.5 rounded-md font-bold">
                            {item.badgeRight}
                          </span>
                        )}
                        <img
                          alt={item.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          src={item.img}
                        />
                      </div>
                      <div className={`flex items-center gap-1 text-label-sm ${item.statColor} font-semibold mb-1`}>
                        <span className="material-symbols-outlined text-[14px]">{item.statIcon}</span>
                        <span>{item.statText}</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h2>
                      <p className="font-body-sm text-body-sm text-outline mb-2">{item.subtitle}</p>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="font-price-lg text-price-lg text-primary font-bold">
                          {item.priceStr}
                        </span>
                        {item.strikeStr && (
                          <span className="font-price-strike text-price-strike text-outline line-through">
                            {item.strikeStr}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-label-sm text-label-sm text-secondary font-medium">
                          {item.points}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddProduct(item.id, item.price)}
                          className={`${
                            isAdded
                              ? 'bg-secondary'
                              : 'bg-primary hover:bg-on-primary-container'
                          } text-on-primary p-2 rounded-xl flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer`}
                          title="Thêm vào giỏ"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isAdded ? 'check' : 'add_shopping_cart'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* SPECIAL SERVICE COMMITMENT CALLOUT BANNER */}
            <div className="rounded-2xl bg-gradient-to-r from-primary-fixed/60 via-surface-container-lowest to-secondary-fixed/40 p-space-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">stairs</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Dịch vụ vác nặng tận cửa &amp; góc bếp
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Shipper Tạp Hóa Số sẵn sàng xách can nước giặt 4kg lên chung cư tầng cao, đặt đúng vị trí máy giặt cho gia đình bạn.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest font-label-md text-primary font-bold shadow-sm">
                  Miễn phí dịch vụ
                </span>
              </div>
            </div>

            {/* PAGINATION SECTION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-space-md border-t-0">
              <span className="font-body-sm text-body-sm text-outline">
                Trang {currentPage} / {totalPages} (Tổng cộng {totalProducts} sản phẩm)
              </span>
              <div className="flex items-center gap-1.5 font-label-md">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-9 h-9 rounded-full bg-surface-container-low text-outline flex items-center justify-center disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === p
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
