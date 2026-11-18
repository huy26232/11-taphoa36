import React, { useRef, useState } from 'react';
import { PageId } from '../types';

interface DairySnacksPageProps {
  onNavigate: (page: PageId) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

type DairyCategoryId = 'milk' | 'yogurt' | 'biscuits' | 'candy';
type PackTag = 'loc4' | 'thung48' | 'hop180' | 'bich220';
type BrandGroupId =
  | 'th'
  | 'vinamilk'
  | 'milo'
  | 'orion'
  | 'kinhdo'
  | 'oishi'
  | 'dutch_fami'
  | 'yakult'
  | 'oreo_choco'
  | 'candy_snack';
type TargetGroupId = 'family' | 'kids' | 'diet';

const SUBCATEGORIES: Array<{ id: 'all' | DairyCategoryId; icon: string; label: string }> = [
  { id: 'all', icon: 'inventory_2', label: 'Tất cả' },
  { id: 'milk', icon: 'local_drink', label: 'Sữa tươi & Sữa hạt tiệt trùng' },
  { id: 'yogurt', icon: 'icecream', label: 'Sữa chua ăn & Sữa chua uống men sống' },
  { id: 'biscuits', icon: 'cookie', label: 'Bánh quy, Bánh xốp & Bánh tươi' },
  { id: 'candy', icon: 'bakery_dining', label: 'Kẹo dẻo, Chocolate & Snack bim bim' },
];

const SWEETNESS_CHIPS = ['Ít đường', 'Có đường', 'Không đường', 'Tách béo', 'Thêm Canxi & D3'];

interface DairyProduct {
  id: string;
  category: DairyCategoryId;
  packTags: PackTag[];
  brandGroup: BrandGroupId;
  sweetnessTags: string[];
  targetGroups: TargetGroupId[];
  discountPct?: number;
  image: string;
  leftBadge: string;
  leftBadgeClass: string;
  rightBadge?: string;
  brand: string;
  meta: string;
  title: string;
  subMeta: string;
  subMetaClass?: string;
  strikePrice?: string;
  price: number;
  priceFormatted: string;
}

const PRODUCTS: DairyProduct[] = [
  {
    id: 'd1',
    category: 'milk',
    packTags: ['loc4', 'thung48', 'hop180'],
    brandGroup: 'th',
    sweetnessTags: ['Ít đường', 'Thêm Canxi & D3'],
    targetGroups: ['family', 'kids', 'diet'],
    discountPct: 6,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxKfi76nXJ4NGare0QG39_4YgWahGCEj5FAzUnUg7Y2Zs8E1webP2HwAvnm1d2Y-eP6vHN9Tdl1HoNPkWKD5hXOjfaDjnDsFEdCk7O71a4FlfiYxTGC2F3WmbhXL-Ruf7Kvfymi_p39aC2awhrUN-LjREvCjdzQNd46XyXC2CO8Exd7EgkPCOo0Q7hBsjdAUYh59kElFbahV5aP6UP6DVLVwM4HnX7g6ka4eDSU5-v',
    leftBadge: 'Ít đường',
    leftBadgeClass: 'bg-secondary text-on-secondary',
    rightBadge: 'Bán chạy #1',
    brand: 'TH true MILK',
    meta: 'HSD: 180 ngày',
    title: 'Sữa tươi tiệt trùng TH true MILK ít đường lốc 4 hộp 180ml',
    subMeta: 'Lốc 4 x 180ml',
    strikePrice: '39.000đ',
    price: 36500,
    priceFormatted: '36.500đ',
  },
  {
    id: 'd2',
    category: 'milk',
    packTags: ['thung48', 'bich220'],
    brandGroup: 'vinamilk',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family', 'kids'],
    discountPct: 11,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWKipJyNRqrrVoZ0yNqfdF0YMNEm7AQBdXFhIrUBfAc2sdPK3AAQefVMV59oL78szhoeuQYoyYegV53MemCKE90VtxYja1CmdqlXT_851HHpWvj3qr67SarRl0XFYyursvFfHm60jB8ejbqERHXPyXKYCurtohLqJ-XOtIuJPIhfKw_lKWJlrO7KeJ6l8Noalen68cJCdHMYg-OsNQmdyoNd0R2DN2aRAtlRD30EP8',
    leftBadge: 'Thùng -15%',
    leftBadgeClass: 'bg-primary-container text-on-primary',
    brand: 'Vinamilk',
    meta: 'Có đường',
    title: 'Sữa tươi Vinamilk 100% có đường bịch 220ml',
    subMeta: 'Thùng 48 bịch: 345.000đ',
    subMetaClass: 'text-secondary font-semibold',
    strikePrice: '9.000đ',
    price: 8000,
    priceFormatted: '8.000đ',
  },
  {
    id: 'd3',
    category: 'milk',
    packTags: ['loc4', 'thung48', 'hop180'],
    brandGroup: 'milo',
    sweetnessTags: ['Có đường', 'Thêm Canxi & D3'],
    targetGroups: ['family', 'kids'],
    discountPct: 6,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAy-4NeWCYcONhLTaWWge6cK-xhwyXEN2SbAttSeFDqyjoBHo5an5dBe5GQO01jhe5NBz3xx4JfS2aICE2XrM88M0pQGZ3TCGMXVp9pXO5iTxZl36xvAtvMU9Ce9dDD2cl6msrl4WumR3sxVZi4Ro90p6oHVA9pe7DraiNdDS5c4ulxD0k4zUmwpLLl6UsS4Lnd32rJoQ9SvEko9rLGNB90b9J4Vjz1TuD2z74Ut3d',
    leftBadge: 'Năng lượng Pro',
    leftBadgeClass: 'bg-secondary-container text-on-secondary-container',
    brand: 'Nestlé Milo',
    meta: 'Lúa mạch',
    title: 'Thức uống lúa mạch Milo lốc 4 hộp 180ml tiếp năng lượng',
    subMeta: 'Lốc 4 x 180ml',
    strikePrice: '35.000đ',
    price: 33000,
    priceFormatted: '33.000đ',
  },
  {
    id: 'd4',
    category: 'yogurt',
    packTags: ['loc4'],
    brandGroup: 'vinamilk',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family', 'kids'],
    discountPct: 7,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5wY_ddfX4P65iKDQUXeDZc2KmTHov0e5Lfmso1pMG_4Lw8AjtLDkAZKudoi5cZ1BEUboFuw-PdFKlsziQj6D058bUx8Kab7m5YK1PHSnTE6pd4J6eEwYjEdfK0eFeadeA3OrO7nTbWH1bIqo2TLrbAnsHzlOy2FV0hxJXwA9iW31QV30p6iUaBtQ88Z8EUxGIptXlXbRdpm4QPXeQK9f-26UDkB2p5Lo7ehPYbqkp',
    leftBadge: 'Lên men tự nhiên',
    leftBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Vinamilk',
    meta: 'Bảo quản lạnh 4-8°C',
    title: 'Sữa chua Vinamilk có đường lốc 4 hộp 100g',
    subMeta: 'Lốc 4 x 100g',
    strikePrice: '29.000đ',
    price: 27000,
    priceFormatted: '27.000đ',
  },
  {
    id: 'd5',
    category: 'biscuits',
    packTags: [],
    brandGroup: 'orion',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family', 'kids'],
    discountPct: 10,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZHh0kU55nfeoZfB-05dVHp6QANdvdSf5_YIa5diP4H0f4T_WCK6dzlORD4DYtJRPBBy7bkmDROIZt3OFDNeAN79R7r5bwg09hC7N-sVYDXrk9PIO2l5XdLL_iDXFK-cEBcpGvudYnDO0FdKh-YUWNR37da714xkkanApDzu0vSj26-EBp-TpGDbl2FqrEYBNxzBJccZbY7sHXHrP9Sjga01gcGkcwlHt50c-i1T-y',
    leftBadge: 'Quà Tặng Bé',
    leftBadgeClass: 'bg-primary text-on-primary',
    brand: 'Orion',
    meta: 'Hộp 12 cái',
    title: 'Bánh Chocopie Orion hộp 12 cái 396g',
    subMeta: 'Khối lượng 396g',
    strikePrice: '62.000đ',
    price: 56000,
    priceFormatted: '56.000đ',
  },
  {
    id: 'd6',
    category: 'biscuits',
    packTags: [],
    brandGroup: 'kinhdo',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family'],
    discountPct: 10,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYOyf7QGDS0_FU7UFdC1bqgFLsKFDPDp1PwBFcAqvkl5PdCXAvBZy2CMAn0Yo6u3UR3VdzJuTlFASdH1Xx7kdCYSN56JYbLPsb_T0NknjjhZBT0krSmcnuUO4A9-I97YK1cE_7Bu-h23XNhphv_TnU5aViokNTBkPM086eYsWP2b2TbEf-cWaEIZEW88pOmg7oEydd5hal63bjEIcOyNXU1QsjGLw6a-saqEijQPv5',
    leftBadge: 'Thơm Béo',
    leftBadgeClass: 'bg-tertiary text-on-tertiary',
    brand: 'Kinh Đô',
    meta: 'Gói 336g',
    title: 'Bánh quy sữa Cosy Marie Kinh Đô gói 336g',
    subMeta: 'Giòn rụm bổ dưỡng',
    strikePrice: '42.000đ',
    price: 38000,
    priceFormatted: '38.000đ',
  },
  {
    id: 'd7',
    category: 'candy',
    packTags: [],
    brandGroup: 'oishi',
    sweetnessTags: [],
    targetGroups: ['family'],
    discountPct: 13,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAUwIF45bO9v6CPT_DrfCSFyfvuJWC4IuRJ56AwLLx2OTorX9iUXO0aS7CHBE47qNPDhah5c7z6InpNBH_l1O2fjAjl4rqJG0tUCD6ubj1v2DyE0CXKgSAy4ltNOK5ujS5ODWkVQTvp4zfgVjsgYUYLZHIfpdFNaMNvu_ZQ2Beh6wA4QlP2md0AxTyXHlzofW9VvDi3FTO-PAgisvlL71S6i2VwRHkW83jezgFC0kHp',
    leftBadge: 'Ăn Vặt 6.5k',
    leftBadgeClass: 'bg-secondary-container text-on-secondary-container',
    brand: 'Oishi',
    meta: 'Gói 40g',
    title: 'Snack Oishi tôm cay bắp ngọt gói 40g',
    subMeta: 'Vị đậm đà cay ngọt',
    strikePrice: '7.500đ',
    price: 6500,
    priceFormatted: '6.500đ',
  },
  {
    id: 'd8',
    category: 'candy',
    packTags: [],
    brandGroup: 'candy_snack',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family', 'kids'],
    discountPct: 11,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJPos0qX5BniaFnsp-mDu8qKlPcMlAcbW0whh8r0z-RsVPRzU9vqLYs6DGbCfCOnWhX6FmLyXyjY23J76dG9zaAgcU412ZVyNTQUxrA2jvgHXPxQZ-1p2DiVXfVDTuzyrFR3nL9qXXolgvukiAj-we_P9jqg_05vQipp1kcjYpG-H53hDEGCXfugvhUMpV1E6CWjtHVJx0FXzAemvf2QWcJ2LcMDEi6RQu1BEdeKyd',
    leftBadge: 'Chua Ngọt',
    leftBadgeClass: 'bg-tertiary-container text-on-tertiary',
    brand: 'Chupa Chups',
    meta: 'Gói 90g',
    title: 'Kẹo dẻo Chupa Chups Cầu Vồng gói 90g',
    subMeta: 'Kẹo dẻo hương trái cây',
    strikePrice: '18.000đ',
    price: 16000,
    priceFormatted: '16.000đ',
  },

  // === 12 SẢN PHẨM SỮA, BÁNH KẸO & ĐỒ ĂN VẶT BỔ SUNG (TỔNG CỘNG 20 SẢN PHẨM) ===
  {
    id: 'd9',
    category: 'milk',
    packTags: ['loc4', 'thung48', 'hop180'],
    brandGroup: 'dutch_fami',
    sweetnessTags: ['Có đường', 'Thêm Canxi & D3'],
    targetGroups: ['family', 'kids'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/2386/80466/sua-tt-cghl-duong-180ml-loc_202608210927364817.jpg',
    leftBadge: 'Giàu Canxi',
    leftBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Dutch Lady',
    meta: 'Có đường',
    title: 'Sữa tươi tiệt trùng Dutch Lady có đường lốc 4 hộp 180ml',
    subMeta: 'Lốc 4 x 180ml',
    price: 33500,
    priceFormatted: '33.500đ',
  },
  {
    id: 'd10',
    category: 'milk',
    packTags: ['loc4', 'hop180'],
    brandGroup: 'dutch_fami',
    sweetnessTags: ['Ít đường', 'Thêm Canxi & D3'],
    targetGroups: ['family', 'diet'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/2943/80495/sua-dau-nanh-fami-hop-200ml-loc_202608211313003127.jpg',
    leftBadge: 'Đạm thực vật',
    leftBadgeClass: 'bg-secondary-container text-on-secondary-container',
    brand: 'Fami',
    meta: 'Đậu nành',
    title: 'Sữa đậu nành nguyên chất Fami lốc 6 hộp 200ml',
    subMeta: 'Lốc 6 x 200ml',
    price: 29500,
    priceFormatted: '29.500đ',
  },
  {
    id: 'd11',
    category: 'yogurt',
    packTags: ['loc4'],
    brandGroup: 'yakult',
    sweetnessTags: ['Ít đường'],
    targetGroups: ['family', 'kids', 'diet'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/7558/323707/loc-5-chai-sua-uong-len-men-yakultt-65ml_202610291012540833.jpg',
    leftBadge: 'Lợi khuẩn',
    leftBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Yakult',
    meta: 'Bảo quản lạnh 4-8°C',
    title: 'Sữa uống lên men Yakult lốc 5 chai 65ml',
    subMeta: 'Lốc 5 x 65ml',
    price: 26500,
    priceFormatted: '26.500đ',
  },
  {
    id: 'd12',
    category: 'yogurt',
    packTags: ['loc4'],
    brandGroup: 'vinamilk',
    sweetnessTags: ['Ít đường'],
    targetGroups: ['family', 'kids'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/7558/216067/loc-5-chai-sua-chua-uong-men-song-huong-dau-vinamilk-65ml_202610291002524185.jpg',
    leftBadge: 'Men sống',
    leftBadgeClass: 'bg-primary text-on-primary',
    brand: 'Vinamilk',
    meta: 'Hương dâu',
    title: 'Sữa chua uống men sống hương dâu Vinamilk lốc 5 chai 65ml',
    subMeta: 'Lốc 5 x 65ml',
    price: 27000,
    priceFormatted: '27.000đ',
  },
  {
    id: 'd13',
    category: 'milk',
    packTags: [],
    brandGroup: 'vinamilk',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2526/77412/bhx/77412-thumb-moi_202411221658191476.jpg',
    leftBadge: 'Thơm béo',
    leftBadgeClass: 'bg-tertiary text-on-tertiary',
    brand: 'Vinamilk Ông Thọ',
    meta: 'Lon 380g',
    title: 'Sữa đặc có đường Ông Thọ Đỏ lon 380g',
    subMeta: 'Lon thiếc 380g',
    price: 25500,
    priceFormatted: '25.500đ',
  },
  {
    id: 'd14',
    category: 'biscuits',
    packTags: [],
    brandGroup: 'oreo_choco',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/3357/79860/banh-quy-nhan-kem-vani-oreo-goi-133g_202609050917111672.jpg',
    leftBadge: 'Bánh quy kem',
    leftBadgeClass: 'bg-primary-container text-on-primary',
    brand: 'Oreo',
    meta: 'Gói 105g',
    title: 'Bánh quy socola nhân kem vani Oreo gói 105g',
    subMeta: 'Giòn rụm vị kem vani',
    price: 17500,
    priceFormatted: '17.500đ',
  },
  {
    id: 'd15',
    category: 'biscuits',
    packTags: [],
    brandGroup: 'orion',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family', 'kids'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/3358/77008/banh-custas-pie-6p-138g_202609042206183822.jpg',
    leftBadge: 'Bánh tươi mềm',
    leftBadgeClass: 'bg-tertiary text-on-tertiary',
    brand: 'Orion',
    meta: 'Hộp 6 cái',
    title: 'Bánh bông lan kem trứng Custas Orion hộp 6 cái 141g',
    subMeta: 'Hộp 6 x 23.5g',
    price: 32500,
    priceFormatted: '32.500đ',
  },
  {
    id: 'd16',
    category: 'biscuits',
    packTags: [],
    brandGroup: 'kinhdo',
    sweetnessTags: ['Ít đường', 'Thêm Canxi & D3'],
    targetGroups: ['family', 'diet'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/3357/77012/banh-dd-afc-rau-cai-hop-200g_202609062337416815.jpg',
    leftBadge: 'Giòn dinh dưỡng',
    leftBadgeClass: 'bg-secondary-container text-on-secondary-container',
    brand: 'Kinh Đô',
    meta: 'Hộp 172g',
    title: 'Bánh cracker dinh dưỡng AFC vị rau cải hộp 172g',
    subMeta: '8 gói x 21.5g',
    price: 30500,
    priceFormatted: '30.500đ',
  },
  {
    id: 'd17',
    category: 'candy',
    packTags: [],
    brandGroup: 'oreo_choco',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/3360/79745/socola-kitkat-tra-xanh-4f_202609062324557338.jpg',
    leftBadge: 'Matcha Nhật',
    leftBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'KitKat',
    meta: 'Gói 35g',
    title: 'Bánh xốp phủ trà xanh KitKat gói 35g',
    subMeta: 'Bánh xốp phủ matcha giòn',
    price: 30000,
    priceFormatted: '30.000đ',
  },
  {
    id: 'd18',
    category: 'candy',
    packTags: [],
    brandGroup: 'oreo_choco',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/6597/79449/keo-chocolate-snickers-51g_202609062303423985.jpg',
    leftBadge: 'Socola Mỹ',
    leftBadgeClass: 'bg-primary text-on-primary',
    brand: 'Snickers',
    meta: 'Thanh 51g',
    title: 'Kẹo socola nhân đậu phộng Snickers thanh 51g',
    subMeta: 'Caramel & đậu phộng rang',
    price: 30000,
    priceFormatted: '30.000đ',
  },
  {
    id: 'd19',
    category: 'candy',
    packTags: [],
    brandGroup: 'candy_snack',
    sweetnessTags: ['Có đường'],
    targetGroups: ['family', 'kids'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/2687/275044/keo-nhai-mentos-cau-vong-huong-trai-cay-3-vien-goi-120g_202609062301169398.jpg',
    leftBadge: 'Kẹo trái cây',
    leftBadgeClass: 'bg-tertiary-container text-on-tertiary',
    brand: 'Mentos',
    meta: 'Gói 120g',
    title: 'Kẹo nhai Mentos Cầu Vồng hương trái cây gói 120g',
    subMeta: 'Nhiều hương trái cây tươi mát',
    price: 18900,
    priceFormatted: '18.900đ',
  },
  {
    id: 'd20',
    category: 'candy',
    packTags: [],
    brandGroup: 'candy_snack',
    sweetnessTags: [],
    targetGroups: ['family'],
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/3364/193606/snack-poca-khoai-tay-tu-nhien-goi-52g_202609062318344414.jpg',
    leftBadge: 'Giòn tan',
    leftBadgeClass: 'bg-secondary-container text-on-secondary-container',
    brand: "Lay's",
    meta: 'Gói 53g',
    title: "Snack khoai tây vị tự nhiên Classic Lay's gói 53g",
    subMeta: 'Khoai tây cắt lát tự nhiên',
    price: 12000,
    priceFormatted: '12.000đ',
  },
];

const PACK_FILTER_OPTIONS: Array<{ tag: PackTag; label: string }> = [
  { tag: 'loc4', label: 'Lốc 4 hộp tiện lợi' },
  { tag: 'thung48', label: 'Thùng 48 hộp tiết kiệm' },
  { tag: 'hop180', label: 'Hộp lẻ 180ml' },
  { tag: 'bich220', label: 'Bịch giấy 220ml kinh tế' },
];

const BRAND_FILTER_OPTIONS: Array<{ group: BrandGroupId; label: string }> = [
  { group: 'th', label: 'TH true MILK' },
  { group: 'vinamilk', label: 'Vinamilk' },
  { group: 'milo', label: 'Nestle Milo' },
  { group: 'orion', label: 'Orion' },
  { group: 'kinhdo', label: 'Kinh Đô' },
  { group: 'oishi', label: 'Oishi & Alpenliebe' },
  { group: 'dutch_fami', label: 'Dutch Lady & Fami' },
  { group: 'yakult', label: 'Yakult' },
  { group: 'oreo_choco', label: 'Oreo, KitKat & Snickers' },
  { group: 'candy_snack', label: "Chupa Chups, Mentos & Lay's" },
];

export const DairySnacksPage: React.FC<DairySnacksPageProps> = ({ onNavigate, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'all' | DairyCategoryId>('all');
  const [packChecks, setPackChecks] = useState<boolean[]>([true, false, false, false]);
  const [brandChecks, setBrandChecks] = useState<boolean[]>([
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [selectedSweetness, setSelectedSweetness] = useState('Ít đường');
  const [targetGroup, setTargetGroup] = useState<TargetGroupId>('family');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [sweetnessApplied, setSweetnessApplied] = useState(false);
  const [sortBy, setSortBy] = useState('Bán chạy nhất');
  const [activePage, setActivePage] = useState(1);
  const [cartQtys, setCartQtys] = useState<Record<string, number>>({});
  const productListTopRef = useRef<HTMLElement>(null);

  const togglePackCheck = (idx: number) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setBrandChecks(BRAND_FILTER_OPTIONS.map(() => false));
      setPackChecks(PACK_FILTER_OPTIONS.map((_, i) => i === idx));
    } else {
      setPackChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
    }
    setActivePage(1);
  };

  const toggleBrandCheck = (idx: number) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setPackChecks(PACK_FILTER_OPTIONS.map(() => false));
      setBrandChecks(BRAND_FILTER_OPTIONS.map((_, i) => i === idx));
    } else {
      setBrandChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
    }
    setActivePage(1);
  };

  const handleSelectSweetness = (chip: string) => {
    setSelectedSweetness(chip);
    setSweetnessApplied(true);
    setActivePage(1);
  };

  const handleSelectTarget = (value: TargetGroupId) => {
    setTargetGroup(value);
    setFiltersApplied(true);
    setActivePage(1);
  };

  const resetFilters = () => {
    setPackChecks(PACK_FILTER_OPTIONS.map(() => false));
    setBrandChecks(BRAND_FILTER_OPTIONS.map(() => false));
    setSelectedSweetness('Ít đường');
    setTargetGroup('family');
    setFiltersApplied(false);
    setSweetnessApplied(false);
    setActiveTab('all');
    setActivePage(1);
  };

  const handleActivateStepper = (product: DairyProduct) => {
    setCartQtys((prev) => ({ ...prev, [product.id]: 1 }));
    onAddToCart(product.price, 1);
  };

  const handleDeltaQty = (product: DairyProduct, delta: number) => {
    const current = cartQtys[product.id] || 0;
    const next = current + delta;
    if (delta > 0) {
      onAddToCart(product.price, 1);
    }
    setCartQtys((prev) => {
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }
      return { ...prev, [product.id]: next };
    });
  };

  const selectedPackTags = PACK_FILTER_OPTIONS.filter((_, idx) => packChecks[idx]).map((o) => o.tag);
  const selectedBrandGroups = BRAND_FILTER_OPTIONS.filter((_, idx) => brandChecks[idx]).map(
    (o) => o.group,
  );

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeTab !== 'all' && product.category !== activeTab) {
      return false;
    }
    if (filtersApplied) {
      if (
        selectedPackTags.length > 0 &&
        !selectedPackTags.some((tag) => product.packTags.includes(tag))
      ) {
        return false;
      }
      if (
        selectedBrandGroups.length > 0 &&
        !selectedBrandGroups.includes(product.brandGroup)
      ) {
        return false;
      }
      if (!product.targetGroups.includes(targetGroup)) {
        return false;
      }
    }
    if (sweetnessApplied && !product.sweetnessTags.includes(selectedSweetness)) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Giá thấp') return a.price - b.price;
    if (sortBy === 'Khuyến mãi sâu') return (b.discountPct ?? 0) - (a.discountPct ?? 0);
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
      {/* BREADCRUMB & METADATA BAR */}
      <div className="w-full bg-surface-container-lowest shadow-sm">
        <div className="max-w-7xl mx-auto px-margin-desktop py-space-sm flex items-center justify-between">
          <nav className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Trang chủ
            </button>
            <span className="text-outline-variant">/</span>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Danh mục thường mua
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">Sữa &amp; Bánh kẹo</span>
          </nav>
          <div className="hidden md:flex items-center gap-space-md font-label-sm text-label-sm text-secondary">
            <span className="flex items-center gap-1 bg-secondary-fixed/30 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Hẹn giờ giao: 8h - 21h hôm nay
            </span>
            <span className="flex items-center gap-1 bg-primary-fixed text-primary px-3 py-1 rounded-full font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Cam kết Date xa &gt; 6 tháng
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-margin-desktop w-full py-space-lg flex flex-col gap-space-xl">
        {/* HERO PROMO BANNER */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-fixed via-tertiary-fixed to-surface-container-low shadow-sm p-space-lg md:p-space-xl">
          <div className="relative z-10 max-w-2xl flex flex-col gap-space-sm">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-sm">
                <span className="material-symbols-outlined text-[15px]">eco</span>
                100% Sữa tươi nguyên chất
              </span>
              <span className="inline-flex items-center gap-1 bg-primary-container text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-sm">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                Date luôn mới nhất
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest text-tertiary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[15px]">bolt</span>
                Lốc tặng lốc tuần này
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Sữa Tươi Dinh Dưỡng, Bánh Kẹo &amp; Đồ Ăn Vặt Bé Mê
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Tiếp năng lượng mỗi ngày với các thương hiệu sữa hàng đầu Vinamilk, TH true MILK, Milo, Dutch Lady cùng
              các món snack giòn rụm, bánh ngọt ngào cho cả gia đình.
            </p>
            <div className="pt-space-xs flex items-center gap-space-md overflow-x-auto">
              <span className="font-label-sm text-label-sm text-outline uppercase font-bold tracking-wider shrink-0">
                Đối tác chính hãng:
              </span>
              <div className="flex items-center gap-space-xs">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm">
                  TH true MILK
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm">
                  Vinamilk
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md shadow-sm">
                  Nestlé Milo
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm">
                  Orion
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-tertiary font-label-md text-label-md shadow-sm">
                  Kinh Đô
                </span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 w-80 h-48 rounded-xl overflow-hidden shadow-md">
            <img
              alt="Sữa tươi và bánh kẹo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkGvgVITs5EE9lpSJMj-97T1ZzIHyqBYFptmDWVVXILujpEPPb_A3SzYpvGeIrmx8lLYvsMdv62Q7bv19gp96sL9xVcJ0zkd64T0PkmtexjI6HOfLpLeL4KxSn_RSDAWZezvMhfcR1rpExr_rqg-ZWP4JF8if9a-hpJ1vRQyI5HlB6X0GCX-qGPxKkUy18qRpdxXsjTwiCbybi8CTRdogEmpESG14iXZ8_fsQPHsT0"
            />
          </div>
        </section>

        {/* PILL TABS SUB-CATEGORIES */}
        <nav aria-label="Nhóm sản phẩm" className="flex items-center gap-space-sm overflow-x-auto pb-1">
          {SUBCATEGORIES.map((tab) => {
            const isActive = activeTab === tab.id;
            const count =
              tab.id === 'all'
                ? PRODUCTS.length
                : PRODUCTS.filter((product) => product.category === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setActivePage(1);
                }}
                className={`px-4 py-2 rounded-full font-label-md text-label-md shadow-sm shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container-lowest hover:bg-primary-fixed text-on-surface hover:text-on-primary-fixed-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label} ({count})
              </button>
            );
          })}
        </nav>

        {/* MAIN TWO-COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          {/* SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 flex flex-col gap-space-lg bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs font-headline-sm text-headline-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                Bộ Lọc Tìm Kiếm
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
              >
                Đặt lại
              </button>
            </div>

            {/* Filter 1: Đóng gói */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                Quy Cách Đóng Gói
              </span>
              <div className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                {PACK_FILTER_OPTIONS.map((item, idx) => {
                  const count = PRODUCTS.filter((p) => p.packTags.includes(item.tag)).length;
                  return (
                    <label key={item.tag} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                      <input
                        checked={packChecks[idx]}
                        onChange={() => togglePackCheck(idx)}
                        className="rounded accent-primary w-4 h-4"
                        type="checkbox"
                      />
                      <span>{item.label}</span>
                      <span className="ml-auto font-label-sm text-label-sm text-outline">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 2: Thương hiệu */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                Thương Hiệu Nổi Bật
              </span>
              <div className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                {BRAND_FILTER_OPTIONS.map((item, idx) => {
                  const count = PRODUCTS.filter((p) => p.brandGroup === item.group).length;
                  return (
                    <label key={item.group} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                      <input
                        checked={brandChecks[idx]}
                        onChange={() => toggleBrandCheck(idx)}
                        className="rounded accent-primary w-4 h-4"
                        type="checkbox"
                      />
                      <span>{item.label}</span>
                      <span className="ml-auto font-label-sm text-label-sm text-outline">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Vị & Dinh dưỡng */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                Độ Ngọt &amp; Dinh Dưỡng
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SWEETNESS_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSelectSweetness(chip)}
                    className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm cursor-pointer transition-colors ${
                      selectedSweetness === chip
                        ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 4: Đối tượng sử dụng */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                Đối Tượng Phù Hợp
              </span>
              <div className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                {[
                  { value: 'family' as const, label: 'Cả gia đình thưởng thức' },
                  { value: 'kids' as const, label: 'Bé trên 1 tuổi phát triển' },
                  { value: 'diet' as const, label: 'Người ăn kiêng / tiểu đường' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input
                      checked={targetGroup === opt.value}
                      onChange={() => handleSelectTarget(opt.value)}
                      className="accent-primary"
                      name="target_group"
                      type="radio"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Help Card */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[22px]">health_and_safety</span>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">Tạp Hóa Số cam kết</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  Hàng bảo quản phòng mát, lốc sữa nguyên vẹn không móp méo, đổi trả 100% tại nhà.
                </p>
              </div>
            </div>
          </aside>

          {/* PRODUCT SHELF */}
          <section ref={productListTopRef} className="lg:col-span-9 flex flex-col gap-space-lg scroll-mt-40">
            {/* Filter Bar & Sorting Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Hiển thị {displayedProducts.length} trong số {totalProducts} sản phẩm
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">
                  Kho gần bạn: Q.1 (Có hàng sẵn)
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="font-label-sm text-label-sm text-outline">Sắp xếp theo:</span>
                <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full">
                  {['Bán chạy nhất', 'Giá thấp', 'Khuyến mãi sâu'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSortBy(s);
                        setActivePage(1);
                      }}
                      className={`px-3 py-1 rounded-full font-label-sm text-label-sm cursor-pointer transition-colors ${
                        sortBy === s
                          ? 'bg-surface-container-lowest font-semibold text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4-COLUMN PRODUCT GRID */}
            {displayedProducts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center shadow-sm flex flex-col items-center gap-space-sm">
                <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer hover:bg-on-primary-container transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-gutter-desktop">
                {displayedProducts.map((product) => {
                  const qty = cartQtys[product.id] || 0;
                  return (
                    <div
                      key={product.id}
                      className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all group relative"
                    >
                      <div className="flex flex-col">
                        <div className="relative w-full aspect-square rounded-lg bg-surface-container-low overflow-hidden mb-space-sm flex items-center justify-center">
                          <span
                            className={`absolute top-2 left-2 z-10 font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold shadow-sm ${product.leftBadgeClass}`}
                          >
                            {product.leftBadge}
                          </span>
                          {product.rightBadge && (
                            <span className="absolute top-2 right-2 z-10 bg-primary-fixed text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                              {product.rightBadge}
                            </span>
                          )}
                          <img
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            src={product.image}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-outline font-label-sm text-label-sm mb-1">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span>{product.meta}</span>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {product.title}
                        </h2>
                        <span
                          className={`font-body-sm text-body-sm mt-1 ${product.subMetaClass || 'text-on-surface-variant'}`}
                        >
                          {product.subMeta}
                        </span>
                      </div>
                      <div className="mt-space-md pt-space-xs flex items-end justify-between">
                        <div>
                          {product.strikePrice && (
                            <span className="font-price-strike text-price-strike text-outline line-through block">
                              {product.strikePrice}
                            </span>
                          )}
                          <span className="font-price-lg text-price-lg text-primary font-bold">
                            {product.priceFormatted}
                          </span>
                        </div>
                        {qty > 0 ? (
                          <div className="h-10 px-2 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center gap-2 shadow-sm transition-all">
                            <button
                              type="button"
                              onClick={() => handleDeltaQty(product, -1)}
                              className="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary"
                            >
                              remove
                            </button>
                            <span className="font-label-md text-label-md font-bold text-primary px-1">{qty}</span>
                            <button
                              type="button"
                              onClick={() => handleDeltaQty(product, 1)}
                              className="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary"
                            >
                              add
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleActivateStepper(product)}
                            className="w-10 h-10 rounded-full bg-primary-fixed hover:bg-primary-container text-primary hover:text-on-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                            title="Thêm vào giỏ"
                          >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* RECURRING MILK SUBSCRIPTION FEATURE */}
            <div className="rounded-xl bg-gradient-to-r from-surface-container to-tertiary-fixed p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-sm">
              <div className="flex items-start gap-space-md max-w-xl">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">autorenew</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                      TIỆN ÍCH MẸ BỈM
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Đặt Sữa Giao Định Kỳ Hằng Tuần
                    </h3>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Bé uống đều đặn mỗi ngày không lo hết sữa đột ngột. Tự động giao thứ Hai hoặc thứ Năm hằng tuần,
                    chiết khấu thêm <strong className="text-primary font-bold">5%</strong> trên mọi thùng sữa và tặng
                    thêm túi bảo quản lạnh.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-sm shrink-0">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full bg-primary hover:bg-on-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Đăng Ký Giao Định Kỳ
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-full bg-surface-container-lowest text-on-surface hover:text-primary font-label-md text-label-md font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Xem Lịch Giao
                </button>
              </div>
            </div>

            {/* PAGINATION SECTION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-md border-t border-surface-container pb-space-lg">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Trang <strong className="text-on-surface">{currentPage}</strong> trên tổng số{' '}
                <strong>{totalPages}</strong> trang ({totalProducts} sản phẩm)
              </span>
              <nav aria-label="Phân trang" className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Trang trước"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    currentPage <= 1
                      ? 'bg-surface-container-low text-outline cursor-not-allowed'
                      : 'bg-surface-container-lowest hover:bg-primary-fixed text-on-surface hover:text-primary shadow-sm cursor-pointer'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => {
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container-lowest hover:bg-primary-fixed text-on-surface hover:text-primary shadow-sm'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-label="Trang sau"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    currentPage >= totalPages
                      ? 'bg-surface-container-low text-outline cursor-not-allowed'
                      : 'bg-surface-container-lowest hover:bg-primary-fixed text-on-surface hover:text-primary shadow-sm cursor-pointer'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </nav>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
