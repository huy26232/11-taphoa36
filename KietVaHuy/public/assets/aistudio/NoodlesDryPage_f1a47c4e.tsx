import React, { useRef, useState } from 'react';
import { PageId } from '../types';

interface NoodlesDryPageProps {
  onNavigate: (page: PageId) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

type NoodlesCategoryId = 'noodles' | 'rice' | 'canned' | 'dried' | 'paper';
type NoodlesPackTag = 'single' | 'pack' | 'case';
type NoodlesBrandGroup =
  | 'acecook'
  | 'omachi'
  | 'kokomi'
  | 'cungdinh'
  | 'st25'
  | 'vissan'
  | 'safoco'
  | 'rice_other'
  | 'noodle_other'
  | 'canned_other'
  | 'dried_other';
type RiceTraitTag = 'fragrant' | 'fluffy' | 'brown' | 'sticky';

interface NoodlesProductBadge {
  text: string;
  cls: string;
  icon?: string;
}

interface NoodlesDryProduct {
  id: string;
  category: NoodlesCategoryId;
  packTags: NoodlesPackTag[];
  brandGroup: NoodlesBrandGroup;
  flavorTags: string[];
  riceTraits: RiceTraitTag[];
  isBulkCase?: boolean;
  freshnessRank?: number;
  image: string;
  imageAlt: string;
  topBadges: NoodlesProductBadge[];
  brand: string;
  brandClass?: string;
  title: string;
  noteIcon: string;
  note: string;
  price: number;
  priceFormatted: string;
  unitLabel?: string;
  strikePrice?: string;
  subText: string;
  subTextStrong?: string;
  ctaLabel?: string;
  hasOmachiStepper?: boolean;
}

const SUBCATS: Array<{ id: 'all' | NoodlesCategoryId; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'noodles', label: '🍜 Mì ăn liền & Phở, Miến gói' },
  { id: 'rice', label: '🌾 Gạo thơm, Nếp & Ngũ cốc' },
  { id: 'canned', label: '🥫 Đồ hộp ăn liền & Xúc xích' },
  { id: 'dried', label: '🍄 Đồ khô: Nấm, Rong biển, Tôm' },
  { id: 'paper', label: '🥢 Bánh tráng cuốn & Bún khô' },
];

const FLAVORS = ['Chua cay kinh điển', 'Bò hầm xốt vang', 'Sườn hầm măng chua', 'Tôm chua cay', 'Mì trộn tương đen'];

const SORT_TABS = ['Bán Chạy Nhất', 'Giá Thùng Tiết Kiệm', 'Hạn Sử Dụng Mới Nhất', 'Giá Thấp → Cao'];

const PRODUCTS: NoodlesDryProduct[] = [
  {
    id: 'n1',
    category: 'noodles',
    packTags: ['single', 'pack', 'case'],
    brandGroup: 'acecook',
    flavorTags: ['Chua cay kinh điển', 'Tôm chua cay'],
    riceTraits: [],
    isBulkCase: true,
    freshnessRank: 10,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBR78igUJeBXI-ot31rNI1tfWTucOPkpLH1moyp4dBf8nCx9M0wS2wD7nJ0EEQ9_a7RHTJPd4AWa12RMQvOlDwU9F9HyoneJ0xi1wjOsjNtGEMUNxMN2nyw8wvoeyYnRG9ivniyJRNcnt50wkf_2YGcebpjV9VJMouff3PlhLF-WUz-t0taBPvTofHxo8RPQjS42v2CHPJ6XYhXWbDCbIakdYGwfXJQEnfMsaXsR4Qn',
    imageAlt: 'Mì tôm chua cay Hảo Hảo gói 75g',
    topBadges: [
      {
        text: '-12% Thùng',
        cls: 'bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide',
      },
      {
        text: 'Giao 30p',
        cls: 'bg-secondary text-on-secondary text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5',
        icon: 'bolt',
      },
    ],
    brand: 'Acecook Việt Nam',
    title: 'Mì tôm chua cay Hảo Hảo gói 75g',
    noteIcon: 'check_circle',
    note: 'HSD: 6 tháng (Mới xuất xưởng)',
    price: 125000,
    priceFormatted: '125.000đ',
    unitLabel: '/ Thùng 30g',
    subText: 'Lốc 5 gói: ',
    subTextStrong: '22.000đ',
    ctaLabel: 'Chọn Mua',
  },
  {
    id: 'n2',
    category: 'noodles',
    packTags: ['single', 'pack'],
    brandGroup: 'omachi',
    flavorTags: ['Bò hầm xốt vang'],
    riceTraits: [],
    freshnessRank: 9,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAquG2GKgdKOTDnok94FxoXb_L4aAQuMrIzW9nwkYsIiFoxnxhvB7pU5f-ftcRG9CNeknhU2JrEK02xgXDKEWnASI6PZs11kv3wgUAhgY45SQWY7JDqiCXVfJ85reZ5Y_KDUq_aoJ9vFpnOJUmSbHBDaiBLU3caprpb1HPoAaIfsmx-DL4pCbvwrX88VJojs9aCKH4tgXO6QWnRyeOoH2SkAqSliTwzTY5zxa4lsJg4',
    imageAlt: 'Mì khoai tây Omachi xốt bò hầm gói 80g',
    topBadges: [
      {
        text: 'Mì Khoai Tây',
        cls: 'bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Masan Consumer',
    title: 'Mì khoai tây Omachi xốt bò hầm gói 80g',
    noteIcon: 'check_circle',
    note: 'Sợi khoai tây không lo nóng',
    price: 42000,
    priceFormatted: '42.000đ',
    unitLabel: '/ Lốc 5 gói',
    subText: 'Gói lẻ: 8.800đ',
    hasOmachiStepper: true,
  },
  {
    id: 'n3',
    category: 'noodles',
    packTags: ['single'],
    brandGroup: 'noodle_other',
    flavorTags: ['Mì trộn tương đen'],
    riceTraits: [],
    freshnessRank: 8,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDb1je13XgcjRUIzDupkE7SVVz2TTkMMIKgWmzMCccAZP7eJ7NdqUnfx_yDxHwu3Htej-lveSjEQ9eG60tdv6aAmHqkd8P8AMtvznRr50DDAxGfeDRs7RdXIqwF3Y9XyaR32djAKXN6OvZYnD3ZvDSVTKN1AeNBICOojstCkO5GiAMwb_H4mHBwKf_RcUpOwR6pFk-MqQnmfKimnWJjI_5EyFXKWk0ewQGgVFeAwH0m',
    imageAlt: 'Mì trộn tương đen Koreno Jumbo gói 100g',
    topBadges: [
      {
        text: 'Mì Trộn Khô',
        cls: 'bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Paldo Koreno',
    title: 'Mì trộn tương đen Koreno Jumbo gói 100g',
    noteIcon: 'check_circle',
    note: 'Sợi mì dai chuẩn Hàn',
    price: 15000,
    priceFormatted: '15.000đ',
    strikePrice: '17.500đ',
    subText: 'Gói lớn 100g no lâu',
  },
  {
    id: 'n4',
    category: 'rice',
    packTags: [],
    brandGroup: 'st25',
    flavorTags: [],
    riceTraits: ['fragrant'],
    freshnessRank: 7,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8NcUZeuqIWTFaDkBHSyPhGJyQpHdZbw9nTFmw5qdpzP83as3NefjxmcgMy88Kae3iFYJHY5QC4CXH9O1ufUEAP3M108T-tkXpHvk7BfKV_LSzZQcgHmO2U99sasN91-3ktqFaNsh78Y8DrVbDLsl-qMvAm4w3gY2XriGudRx6UkSHHSldrO7vxKReuCuXeU960r5D5RdRF_cXI3vNGoQ3J-Qj2higgiYpl1zoXQ8O',
    imageAlt: 'Gạo thơm ST25 Ông Cua chuẩn xịn túi 5kg',
    topBadges: [
      {
        text: 'Top 1 Thế Giới',
        cls: 'bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5',
        icon: 'award_star',
      },
      {
        text: 'Tem Chống Giả',
        cls: 'bg-surface-container-highest text-on-surface text-[9px] font-bold px-1.5 py-0.5 rounded-md',
      },
    ],
    brand: 'DNTN Hồ Quang Cua',
    brandClass: 'font-label-sm text-[11px] text-secondary font-bold',
    title: 'Gạo thơm ST25 Ông Cua chuẩn xịn túi 5kg',
    noteIcon: 'verified',
    note: 'Cơm dẻo mềm mùi lá dứa',
    price: 175000,
    priceFormatted: '175.000đ',
    unitLabel: '/ Túi 5kg',
    subText: 'Chỉ 35.000đ / kg',
    ctaLabel: 'Chọn Mua',
  },
  {
    id: 'n5',
    category: 'canned',
    packTags: ['single'],
    brandGroup: 'vissan',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 12,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCy2P-cPwex2T_FlfZ_FGg4LsGdWroRgRIwXZiGJWkHCcOsBETYPUQyH4Albvn1HueG1nA5QIA0W1tjUFeNks7LCHZX9uj5nzrR_4rPBpkGLmXu2QC0roou9P0_BQH_i2h-DxsJwJZ7kt0QjJbF3SaDLZDenm1vZssIA-S1uIjhYBzIO26NKs4Mv58-a5Ajy_SRQGYZbkJR3ygPRdvRQW7SOgQw1BSlfUo4RPlMlfCL',
    imageAlt: 'Heo 2 lát Vissan hộp 150g',
    topBadges: [
      {
        text: 'Ăn Liền Tiện Lợi',
        cls: 'bg-primary-fixed-dim text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Vissan Sài Gòn',
    title: 'Heo 2 lát Vissan hộp 150g',
    noteIcon: 'check_circle',
    note: 'Date xa đến 2027',
    price: 29000,
    priceFormatted: '29.000đ',
    strikePrice: '32.000đ',
    subText: 'Mua lốc 3 lon giảm 5k',
  },
  {
    id: 'n6',
    category: 'canned',
    packTags: ['single'],
    brandGroup: 'canned_other',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 11,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ2te3vzDcefv4b7-2rMTtPCgJbLhl9SklqQOipyC7n2ABxlcY4UmJw-MPN_AygarBMdf93heshGm_o9xsL2MYiMNRmTx3oyy_xFv5N3k9eicIlW64cQqtligfhPxuI5s0iJQH_cpslgQ3SwJjD5dL5YcSMXwKjkDGcAbUDt4dbRm6N42pQ7at1NnbnCrRz6M7o6IYhNiIrU_Qg6aXO5kT4Jg1ELeYnKDFTQWl56tP',
    imageAlt: 'Cá sốt cà Ba Cô Gái hộp 155g',
    topBadges: [
      {
        text: 'Bán Chạy Nhất',
        cls: 'bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Ba Cô Gái (Thái Lan)',
    title: 'Cá sốt cà Ba Cô Gái hộp 155g',
    noteIcon: 'check_circle',
    note: 'Cá bùi béo đậm vị sốt cà',
    price: 21000,
    priceFormatted: '21.000đ',
    strikePrice: '23.500đ',
    subText: 'Lốc 10 hộp: 198.000đ',
  },
  {
    id: 'n7',
    category: 'noodles',
    packTags: ['single', 'case'],
    brandGroup: 'acecook',
    flavorTags: ['Bò hầm xốt vang'],
    riceTraits: [],
    isBulkCase: true,
    freshnessRank: 8,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtbPXAM2a2-QGFjsdbxxfcfWIuRGJREUCENUMsUbM8JPgCvhFMjs4RZ7Z2TOKbj0lSoJdre5UEO1Z1NAjUkSkY_fQMuSj77cCoI98t1jp4Ry5pyfLEJvtZm_6nyIX7Or1zgsc0swlbYWNH3IUQreQXzPqM8DzijpaNuu2u5fgLy5yI0D3vPYZCLuhA7Rb_lUMHrDgCtJrjHD55wjGwrrJy8QASLuLlwRlxE0NTx560',
    imageAlt: 'Phở bò Đệ Nhất gói 65g thơm lừng',
    topBadges: [
      {
        text: 'Nước Cốt Hầm',
        cls: 'bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Acecook Việt Nam',
    title: 'Phở bò Đệ Nhất gói 65g thơm lừng',
    noteIcon: 'check_circle',
    note: 'Gói xốt nước cốt thịt bò thật',
    price: 8500,
    priceFormatted: '8.500đ',
    strikePrice: '9.500đ',
    subText: 'Thùng 30 gói: 245.000đ',
  },
  {
    id: 'n8',
    category: 'paper',
    packTags: ['single'],
    brandGroup: 'safoco',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 7,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9iz5FNl_rM9djYdR90a4co5aC8NUSZGFhJ6MfUtZ0UnNKamG1bRZ_3DTvDd8wGYL9AuT4MiEvGIqB1YOnombZXG5ozpAoOnf0_dHAAlgPS3T3NBvMWR3t7Wi66u7m5zzz504Zru4J6bgXFIgLcCoVTKUuMDDvyHiZG77TR4j9dEEAJ0nHeQQDDZ0PDWjNcKbasM3TxAQmfXxFpsUwErC09R-UkiRH-J3JcLN21eq_',
    imageAlt: 'Bún tươi sấy khô Safoco gói 300g',
    topBadges: [
      {
        text: 'Chuẩn Xuất Khẩu',
        cls: 'bg-surface-container-high text-on-surface text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Safoco Lương Thực',
    title: 'Bún tươi sấy khô Safoco gói 300g',
    noteIcon: 'check_circle',
    note: 'Luộc 5 phút dẻo dai như bún tươi',
    price: 16000,
    priceFormatted: '16.000đ',
    strikePrice: '18.000đ',
    subText: 'Tiết kiệm khi mua 3 gói',
  },

  // === 12 SẢN PHẨM MÌ TÔM & ĐỒ KHÔ BỔ SUNG (TỔNG CỘNG 20 SẢN PHẨM) ===
  {
    id: 'n9',
    category: 'noodles',
    packTags: ['single', 'pack', 'case'],
    brandGroup: 'kokomi',
    flavorTags: ['Chua cay kinh điển', 'Tôm chua cay'],
    riceTraits: [],
    isBulkCase: true,
    freshnessRank: 10,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2565/212759/mi-kokomi-90-tom-chua-cay-goi-90g_202610280902183297.jpg',
    imageAlt: 'Mì Kokomi 90 tôm chua cay gói 90g',
    topBadges: [
      {
        text: 'Gói Lớn 90g',
        cls: 'bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Masan Consumer',
    title: 'Mì Kokomi 90 tôm chua cay gói 90g',
    noteIcon: 'check_circle',
    note: 'Sợi mì dai giòn, gói lớn ăn no',
    price: 4900,
    priceFormatted: '4.900đ',
    unitLabel: '/ Gói 90g',
    subText: 'Thùng 30 gói: 129.000đ',
  },
  {
    id: 'n10',
    category: 'noodles',
    packTags: ['single'],
    brandGroup: 'acecook',
    flavorTags: ['Chua cay kinh điển', 'Tôm chua cay'],
    riceTraits: [],
    freshnessRank: 9,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2565/77738/mi-ly-modern-lau-thai-tom-65g_202610271701544348.jpg',
    imageAlt: 'Mì ly Modern lẩu Thái tôm 67g',
    topBadges: [
      {
        text: 'Mì Ly Tiện Lợi',
        cls: 'bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Acecook Việt Nam',
    title: 'Mì ly Modern lẩu Thái tôm 67g',
    noteIcon: 'check_circle',
    note: 'Chế nước sôi 3 phút ăn ngay',
    price: 8500,
    priceFormatted: '8.500đ',
    unitLabel: '/ Ly 67g',
    subText: 'Tiện mang đi làm, du lịch',
  },
  {
    id: 'n11',
    category: 'noodles',
    packTags: ['case'],
    brandGroup: 'noodle_other',
    flavorTags: ['Mì trộn tương đen'],
    riceTraits: [],
    isBulkCase: true,
    freshnessRank: 10,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2565/175909/mi-goreng-xao-kho-vi-dac-biet-goi-85gr-thung-40_202610281049439490.jpg',
    imageAlt: 'Mì xào khô Indomie Mi Goreng vị đặc biệt thùng 40 gói 85g',
    topBadges: [
      {
        text: 'Thùng 40 Gói',
        cls: 'bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Indomie',
    title: 'Thùng 40 gói mì xào khô Indomie Mi Goreng đặc biệt 85g',
    noteIcon: 'check_circle',
    note: 'Mì xào khô vị đặc trưng Indonesia',
    price: 240000,
    priceFormatted: '240.000đ',
    unitLabel: '/ Thùng 40g',
    subText: 'Chỉ 6.000đ / gói 85g',
  },
  {
    id: 'n12',
    category: 'rice',
    packTags: [],
    brandGroup: 'rice_other',
    flavorTags: [],
    riceTraits: ['brown'],
    freshnessRank: 7,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/216076/bhx/216076_202410300938366065.jpg',
    imageAlt: 'Gạo lứt Vinh Hiển túi 2kg',
    topBadges: [
      {
        text: 'Giàu Chất Xơ',
        cls: 'bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Gạo Vinh Hiển',
    brandClass: 'font-label-sm text-[11px] text-secondary font-bold',
    title: 'Gạo lứt Vinh Hiển túi 2kg',
    noteIcon: 'verified',
    note: 'Phù hợp ăn kiêng & dưỡng sinh',
    price: 56000,
    priceFormatted: '56.000đ',
    unitLabel: '/ Túi 2kg',
    subText: '28.000đ / kg',
  },
  {
    id: 'n13',
    category: 'rice',
    packTags: [],
    brandGroup: 'rice_other',
    flavorTags: [],
    riceTraits: ['sticky'],
    freshnessRank: 7,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2513/229220/bhx/229220_202410301006430285.jpg',
    imageAlt: 'Gạo nếp chùm dẻo Vinh Hiển túi 1kg',
    topBadges: [
      {
        text: 'Nếp Dẻo Thơm',
        cls: 'bg-primary-fixed-dim text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Gạo Vinh Hiển',
    title: 'Gạo nếp chùm dẻo Vinh Hiển túi 1kg',
    noteIcon: 'check_circle',
    note: 'Hạt nếp mẩy dẻo nấu xôi chè',
    price: 29000,
    priceFormatted: '29.000đ',
    unitLabel: '/ Túi 1kg',
    subText: 'Đóng túi hút kín sạch sẽ',
  },
  {
    id: 'n14',
    category: 'canned',
    packTags: ['single'],
    brandGroup: 'canned_other',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 9,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/2564/80103/chao-gau-do-thit-bam-50g_202609111449572702.jpg',
    imageAlt: 'Cháo thịt bằm ăn liền Gấu Đỏ gói 50g',
    topBadges: [
      {
        text: 'Ăn Liền 3 Phút',
        cls: 'bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Gấu Đỏ (Asia Foods)',
    title: 'Cháo thịt bằm ăn liền Gấu Đỏ gói 50g',
    noteIcon: 'check_circle',
    note: 'Hạt cháo sánh mịn thơm ngon',
    price: 4200,
    priceFormatted: '4.200đ',
    unitLabel: '/ Gói 50g',
    subText: 'Bữa sáng nhẹ bụng tiện lợi',
  },
  {
    id: 'n15',
    category: 'paper',
    packTags: ['single'],
    brandGroup: 'safoco',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 8,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/8158/5366549/mi-trung-soi-lon-safoco-goi-500g_202609141601217619.jpg',
    imageAlt: 'Mì trứng sợi lớn Safoco gói 500g',
    topBadges: [
      {
        text: 'Mì Trứng Khô',
        cls: 'bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Safoco Lương Thực',
    title: 'Mì trứng sợi lớn Safoco gói 500g',
    noteIcon: 'check_circle',
    note: 'Sợi mì vàng dai nấu lẩu & xào',
    price: 34000,
    priceFormatted: '34.000đ',
    unitLabel: '/ Gói 500g',
    subText: 'Gói gia đình 500g tiết kiệm',
  },
  {
    id: 'n16',
    category: 'paper',
    packTags: ['single'],
    brandGroup: 'noodle_other',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 8,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/8158/5367173/mi-trung-meizan-cao-cap-goi-250g_202609141602351208.jpg',
    imageAlt: 'Mì trứng cao cấp Meizan gói 250g',
    topBadges: [
      {
        text: 'Sợi Dai Vàng',
        cls: 'bg-surface-container-high text-on-surface text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Meizan',
    title: 'Mì trứng cao cấp Meizan gói 250g',
    noteIcon: 'check_circle',
    note: 'Không chiên, giữ vị trứng tươi',
    price: 21000,
    priceFormatted: '21.000đ',
    unitLabel: '/ Gói 250g',
    subText: 'Phù hợp mì xào, hoành thánh',
  },
  {
    id: 'n17',
    category: 'paper',
    packTags: ['single'],
    brandGroup: 'safoco',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 8,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/3233/80557/banh-trang-goi-300g-22cmx20_202611031605348602.jpg',
    imageAlt: 'Bánh tráng 22cm Safoco gói 300g',
    topBadges: [
      {
        text: 'Dẻo Dai Dễ Cuốn',
        cls: 'bg-surface-container-high text-on-surface text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Safoco Lương Thực',
    title: 'Bánh tráng 22cm Safoco gói 300g',
    noteIcon: 'check_circle',
    note: 'Cỡ 22cm chuẩn cuốn gỏi cuốn',
    price: 22000,
    priceFormatted: '22.000đ',
    unitLabel: '/ Gói 300g',
    subText: 'Bánh tráng gạo dẻo mịn',
  },
  {
    id: 'n18',
    category: 'dried',
    packTags: ['single'],
    brandGroup: 'dried_other',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 11,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/3235/233827/nam-dong-co-kho-bach-hoa-xanh-goi-50g_202611031604031047.jpg',
    imageAlt: 'Nấm đông cô khô Bách hóa XANH gói 50g',
    topBadges: [
      {
        text: 'Đồ Khô Tuyển Chọn',
        cls: 'bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Bách hóa XANH',
    title: 'Nấm đông cô khô Bách hóa XANH gói 50g',
    noteIcon: 'check_circle',
    note: 'Thịt nấm dày, thơm ngọt tự nhiên',
    price: 38000,
    priceFormatted: '38.000đ',
    unitLabel: '/ Gói 50g',
    subText: 'Dùng nấu canh, súp, món kho',
  },
  {
    id: 'n19',
    category: 'dried',
    packTags: ['single'],
    brandGroup: 'dried_other',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 11,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/3235/200360/nam-meo-den-thai-soi-naita-goi-50g_202611031603214598.jpg',
    imageAlt: 'Nấm mèo đen thái sợi Naita gói 50g',
    topBadges: [
      {
        text: 'Thái Sợi Sẵn',
        cls: 'bg-primary-fixed-dim text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Naita',
    title: 'Nấm mèo đen thái sợi Naita gói 50g',
    noteIcon: 'check_circle',
    note: 'Giòn sần sật làm chả giò, xào',
    price: 15000,
    priceFormatted: '15.000đ',
    unitLabel: '/ Gói 50g',
    subText: 'Ngâm nở nhanh, tiện chế biến',
  },
  {
    id: 'n20',
    category: 'dried',
    packTags: ['single'],
    brandGroup: 'dried_other',
    flavorTags: [],
    riceTraits: [],
    freshnessRank: 10,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7083/338774/bhx/rong-bien-han-quoc-cat-san-bibigo-goi-20g_202506252007173486.jpg',
    imageAlt: 'Rong biển Hàn Quốc cắt sẵn Bibigo gói 20g',
    topBadges: [
      {
        text: 'Hàn Quốc',
        cls: 'bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
      },
    ],
    brand: 'Bibigo (CJ Foods)',
    title: 'Rong biển Hàn Quốc cắt sẵn Bibigo gói 20g',
    noteIcon: 'check_circle',
    note: 'Cắt sẵn nấu canh thanh mát',
    price: 27000,
    priceFormatted: '27.000đ',
    unitLabel: '/ Gói 20g',
    subText: 'Rong biển sạch chuẩn Hàn',
  },
];

const PACKAGING_OPTIONS: Array<{ tag: NoodlesPackTag; label: string; bold: boolean; primary: boolean }> = [
  { tag: 'single', label: 'Gói lẻ ăn thử', bold: false, primary: false },
  { tag: 'pack', label: 'Lốc 5 - 10 gói tiết kiệm', bold: true, primary: false },
  { tag: 'case', label: 'Mua nguyên thùng 30 gói (giá sỉ)', bold: true, primary: true },
];

const BRAND_OPTIONS: Array<{ group: NoodlesBrandGroup; label: string }> = [
  { group: 'acecook', label: 'Hảo Hảo (Acecook)' },
  { group: 'omachi', label: 'Omachi (Masan)' },
  { group: 'kokomi', label: 'Kokomi đại gia đình' },
  { group: 'cungdinh', label: 'Cung Đình Kool' },
  { group: 'st25', label: 'Gạo ST25 Ông Cua' },
  { group: 'vissan', label: 'Vissan Đồ Hộp' },
  { group: 'safoco', label: 'Ba Cây Tre / Safoco' },
  { group: 'rice_other', label: 'Gạo Vinh Hiển (Lứt & Nếp)' },
  { group: 'noodle_other', label: 'Koreno, Indomie & Meizan' },
  { group: 'canned_other', label: 'Ba Cô Gái & Cháo Gấu Đỏ' },
  { group: 'dried_other', label: 'Nấm khô, Mộc nhĩ & Bibigo' },
];

const RICE_TRAIT_OPTIONS: Array<{ trait: RiceTraitTag; label: string }> = [
  { trait: 'fragrant', label: 'Gạo dẻo thơm nhiều' },
  { trait: 'fluffy', label: 'Gạo xốp mềm cơm' },
  { trait: 'brown', label: 'Gạo lứt huyết rồng' },
  { trait: 'sticky', label: 'Gạo nếp cái hoa vàng' },
];

export const NoodlesDryPage: React.FC<NoodlesDryPageProps> = ({ onNavigate, onAddToCart }) => {
  const [activeSubcat, setActiveSubcat] = useState<'all' | NoodlesCategoryId>('all');
  const [packagingChecks, setPackagingChecks] = useState<boolean[]>([false, true, true]);
  const [brandChecks, setBrandChecks] = useState<boolean[]>(BRAND_OPTIONS.map(() => false));
  const [riceChecks, setRiceChecks] = useState<boolean[]>([false, false, false, false]);
  const [selectedFlavor, setSelectedFlavor] = useState('Chua cay kinh điển');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [flavorApplied, setFlavorApplied] = useState(false);
  const [sortTab, setSortTab] = useState('Bán Chạy Nhất');
  const [omachiQty, setOmachiQty] = useState(1);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const productListTopRef = useRef<HTMLDivElement>(null);

  const togglePackaging = (idx: number) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setBrandChecks(BRAND_OPTIONS.map(() => false));
      setRiceChecks([false, false, false, false]);
      setPackagingChecks(PACKAGING_OPTIONS.map((_, i) => i === idx));
    } else {
      setPackagingChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
    }
    setActivePage(1);
    setPageInput('1');
  };

  const toggleBrand = (idx: number) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setPackagingChecks([false, false, false]);
      setRiceChecks([false, false, false, false]);
      setBrandChecks(BRAND_OPTIONS.map((_, i) => i === idx));
    } else {
      setBrandChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
    }
    setActivePage(1);
    setPageInput('1');
  };

  const toggleRice = (idx: number) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setPackagingChecks([false, false, false]);
      setBrandChecks(BRAND_OPTIONS.map(() => false));
      setRiceChecks(RICE_TRAIT_OPTIONS.map((_, i) => i === idx));
    } else {
      setRiceChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
    }
    setActivePage(1);
    setPageInput('1');
  };

  const handleSelectFlavor = (flav: string) => {
    if (flavorApplied && selectedFlavor === flav) {
      setFlavorApplied(false);
    } else {
      setSelectedFlavor(flav);
      setFlavorApplied(true);
    }
    setActivePage(1);
    setPageInput('1');
  };

  const clearAllFilters = () => {
    setPackagingChecks([false, false, false]);
    setBrandChecks(BRAND_OPTIONS.map(() => false));
    setRiceChecks([false, false, false, false]);
    setSelectedFlavor('Chua cay kinh điển');
    setFiltersApplied(false);
    setFlavorApplied(false);
    setActiveSubcat('all');
    setActivePage(1);
    setPageInput('1');
  };

  const handleQuickAdd = (id: string, price: number) => {
    onAddToCart(price, 1);
    setAddedId(id);
    window.setTimeout(() => {
      setAddedId((curr) => (curr === id ? null : curr));
    }, 1000);
  };

  const selectedPackTags = PACKAGING_OPTIONS.filter((_, i) => packagingChecks[i]).map((o) => o.tag);
  const selectedBrands = BRAND_OPTIONS.filter((_, i) => brandChecks[i]).map((o) => o.group);
  const selectedRiceTraits = RICE_TRAIT_OPTIONS.filter((_, i) => riceChecks[i]).map((o) => o.trait);

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeSubcat !== 'all' && product.category !== activeSubcat) {
      return false;
    }
    if (filtersApplied) {
      if (
        selectedPackTags.length > 0 &&
        !selectedPackTags.some((tag) => product.packTags.includes(tag))
      ) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brandGroup)) {
        return false;
      }
      if (
        selectedRiceTraits.length > 0 &&
        !selectedRiceTraits.some((trait) => product.riceTraits.includes(trait))
      ) {
        return false;
      }
    }
    if (flavorApplied && !product.flavorTags.includes(selectedFlavor)) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortTab === 'Giá Thấp → Cao') return a.price - b.price;
    if (sortTab === 'Giá Thùng Tiết Kiệm') {
      const bulkDiff = Number(Boolean(b.isBulkCase)) - Number(Boolean(a.isBulkCase));
      return bulkDiff !== 0 ? bulkDiff : a.price - b.price;
    }
    if (sortTab === 'Hạn Sử Dụng Mới Nhất') {
      return (b.freshnessRank ?? 0) - (a.freshnessRank ?? 0);
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
    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > totalPages) {
      return;
    }
    setActivePage(nextPage);
    setPageInput(String(nextPage));
    window.requestAnimationFrame(() => {
      productListTopRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleGoToPageInput = () => {
    const trimmed = pageInput.trim();
    const parsed = Number(trimmed);
    if (trimmed === '' || !Number.isInteger(parsed) || parsed < 1 || parsed > totalPages) {
      setPageInput(String(currentPage));
      return;
    }
    handlePageChange(parsed);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Micro Breadcrumb & Notification Ticker */}
      <div className="max-w-7xl mx-auto w-full px-margin-desktop py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
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
          <span className="text-primary font-bold">Mì tôm &amp; Đồ khô</span>
        </nav>
        <div className="flex items-center gap-space-xs bg-surface-container-lowest px-3 py-1 rounded-full shadow-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-sm text-label-sm text-on-surface">
            Kho Tân Bình &amp; Q.1 còn <strong className="text-primary font-bold">840 thùng</strong> date mới tháng
            11/2025
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop mb-space-lg">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-fixed via-surface-container-low to-tertiary-fixed p-6 lg:p-8 shadow-sm">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-primary-container/20 blur-2xl pointer-events-none"></div>
          <div className="absolute right-1/3 -bottom-16 w-80 h-80 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-8 flex flex-col items-start gap-space-sm text-left">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_shipping
                  </span>
                  Giá thùng siêu rẻ
                </span>
                <span className="bg-secondary text-on-secondary font-label-sm text-label-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Hạn sử dụng xa tít tắp
                </span>
                <span className="bg-surface-container-lowest text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold">
                  Cam kết 100% chính hãng
                </span>
              </div>
              <h1 className="font-display-lg text-headline-lg lg:text-display-lg text-on-background font-bold tracking-tight mt-1">
                Mì Tôm Ăn Liền, Gạo Ngon ST25 &amp; Đồ Khô Dự Trữ
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                Nguồn dự trữ thơm ngon tiện lợi cho mọi gia đình. Đặt nguyên thùng freeship tận cửa, đủ loại mì ly,
                phở gói, miến dong, bún gạo, nấm khô, đồ hộp đậm đà cho mâm cơm nhà bạn.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-2">
                <div className="flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
                  <span className="font-label-md text-label-md text-on-surface">
                    Tiết kiệm đến <span className="text-primary font-bold">45.000đ/thùng</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px]">electric_bolt</span>
                  <span className="font-label-md text-label-md text-on-surface">Giao xách tận kệ bếp tầng lầu</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center">
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md flex flex-col gap-space-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      featured_seasonal_and_gifts
                    </span>
                    Quà Tặng Thùng
                  </span>
                  <span className="bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold px-2 py-0.5 rounded-full">
                    Có hạn
                  </span>
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface leading-snug">
                  Mua 1 Thùng Mì Tặng Ngay 1 Lốc Nước Ngọt Có Ga hoặc 2 Xúc Xích
                </p>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '72%' }}></div>
                </div>
                <div className="flex justify-between items-center text-outline font-label-sm text-label-sm">
                  <span>Đã tặng 360/500 suất</span>
                  <span className="text-primary font-semibold">Còn 140 suất</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategory Pill Tabs */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop mb-space-lg">
        <div className="flex items-center gap-space-xs overflow-x-auto pb-2 scrollbar-none">
          {SUBCATS.map((tab) => {
            const isActive = activeSubcat === tab.id;
            const count =
              tab.id === 'all'
                ? PRODUCTS.length
                : PRODUCTS.filter((product) => product.category === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveSubcat(tab.id);
                  setActivePage(1);
                  setPageInput('1');
                }}
                className={`shrink-0 px-4 py-2 rounded-full font-label-md text-label-md shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary active:scale-95'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Area: Sidebar Filters + 4-Column Product Grid */}
      <div className="max-w-7xl mx-auto w-full px-margin-desktop mb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* 1. LEFT SIDEBAR FILTER */}
          <aside className="lg:col-span-3 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-lg text-left">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Bộ Lọc Tìm Nhanh</span>
                </div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                >
                  Xóa lọc
                </button>
              </div>

              {/* Packaging */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-headline-sm text-label-md text-on-surface font-bold uppercase tracking-wider flex items-center justify-between">
                  Hình Thức Đóng Gói
                  <span className="material-symbols-outlined text-[16px] text-outline">expand_less</span>
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {PACKAGING_OPTIONS.map((item, idx) => {
                    const count = PRODUCTS.filter((p) => p.packTags.includes(item.tag)).length;
                    return (
                      <label
                        key={item.tag}
                        className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md cursor-pointer hover:text-primary transition-colors"
                      >
                        <input
                          checked={packagingChecks[idx]}
                          onChange={() => togglePackaging(idx)}
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                          type="checkbox"
                        />
                        <span
                          className={`flex-1 ${item.bold ? 'font-medium' : ''} ${item.primary ? 'text-primary' : ''}`}
                        >
                          {item.label}
                        </span>
                        <span
                          className={`font-label-sm text-label-sm ${
                            item.primary ? 'text-primary font-bold' : 'text-outline'
                          }`}
                        >
                          ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-surface-container-high w-full"></div>

              {/* Brands */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-headline-sm text-label-md text-on-surface font-bold uppercase tracking-wider flex items-center justify-between">
                  Thương Hiệu Nổi Bật
                  <span className="material-symbols-outlined text-[16px] text-outline">expand_less</span>
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {BRAND_OPTIONS.map((b, idx) => {
                    const count = PRODUCTS.filter((p) => p.brandGroup === b.group).length;
                    return (
                      <label
                        key={b.group}
                        className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md cursor-pointer hover:text-primary transition-colors"
                      >
                        <input
                          checked={brandChecks[idx]}
                          onChange={() => toggleBrand(idx)}
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                          type="checkbox"
                        />
                        <span className="flex-1">{b.label}</span>
                        <span className="text-outline font-label-sm text-label-sm">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-surface-container-high w-full"></div>

              {/* Flavors */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-headline-sm text-label-md text-on-surface font-bold uppercase tracking-wider flex items-center justify-between">
                  Hương Vị Yêu Thích
                  <span className="material-symbols-outlined text-[16px] text-outline">expand_less</span>
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {FLAVORS.map((flav) => (
                    <button
                      key={flav}
                      type="button"
                      onClick={() => handleSelectFlavor(flav)}
                      className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm cursor-pointer transition-colors ${
                        selectedFlavor === flav
                          ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {flav}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-surface-container-high w-full"></div>

              {/* Rice Types */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-headline-sm text-label-md text-on-surface font-bold uppercase tracking-wider flex items-center justify-between">
                  Đặc Tính Hạt Gạo
                  <span className="material-symbols-outlined text-[16px] text-outline">expand_less</span>
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {RICE_TRAIT_OPTIONS.map((opt, idx) => (
                    <label
                      key={opt.trait}
                      className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md cursor-pointer hover:text-primary transition-colors"
                    >
                      <input
                        checked={riceChecks[idx]}
                        onChange={() => toggleRice(idx)}
                        className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                        type="checkbox"
                      />
                      <span className="flex-1">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Helper Widget */}
            <div className="bg-gradient-to-br from-surface-container-low to-secondary-fixed/20 p-space-md rounded-2xl flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[22px]">inventory</span>
                <span className="font-headline-sm text-label-md font-bold">Chính Sách Gạo &amp; Mì Thùng</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                Tạp Hóa Số cam kết giao nguyên thùng nguyên đai kiện. Cho kiểm tra ngày sản xuất và bao bì trước khi
                thanh toán.
              </p>
            </div>
          </aside>

          {/* 2. PRODUCT GRID SECTION */}
          <div ref={productListTopRef} className="lg:col-span-9 flex flex-col gap-space-md scroll-mt-40">
            {/* Sorting Bar */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-sm px-space-md shadow-sm flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-label-md text-label-md text-outline">Sắp xếp theo:</span>
                {SORT_TABS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSortTab(s);
                      setActivePage(1);
                      setPageInput('1');
                    }}
                    className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                      sortTab === s
                        ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold shadow-xs'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                <span>
                  Hiển thị <strong className="text-on-surface">{displayedProducts.length}</strong> / {totalProducts} món
                </span>
              </div>
            </div>

            {/* 4-Column Product Shelf Grid */}
            {displayedProducts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-sm flex flex-col items-center gap-space-sm">
                <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer hover:bg-on-primary-container transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-space-md">
                {displayedProducts.map((product) => {
                  const isAdded = addedId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="bg-surface-container-lowest rounded-2xl p-space-sm flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group text-left"
                    >
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {product.topBadges.map((badge) => (
                          <span key={badge.text} className={badge.cls}>
                            {badge.icon && (
                              <span
                                className={`material-symbols-outlined ${
                                  badge.icon === 'bolt' ? 'text-[11px]' : 'text-[12px]'
                                }`}
                              >
                                {badge.icon}
                              </span>
                            )}
                            {badge.text}
                          </span>
                        ))}
                      </div>
                      <div className="relative w-full aspect-square bg-surface-container-low rounded-xl overflow-hidden mb-space-xs flex items-center justify-center">
                        <img
                          alt={product.imageAlt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={product.image}
                        />
                      </div>
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <span
                            className={
                              product.brandClass || 'font-label-sm text-[11px] text-outline font-medium'
                            }
                          >
                            {product.brand}
                          </span>
                          <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-2 mt-0.5 leading-snug">
                            {product.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-secondary font-medium">
                            <span className="material-symbols-outlined text-[13px]">{product.noteIcon}</span>
                            {product.note}
                          </div>
                        </div>
                        <div className="mt-space-sm pt-space-xs bg-surface-container-low/50 -mx-space-sm px-space-sm pb-1 rounded-b-xl">
                          <div className="flex flex-col mb-1.5">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-price-lg text-price-lg text-primary font-bold">
                                {product.priceFormatted}
                              </span>
                              {product.unitLabel && (
                                <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                                  {product.unitLabel}
                                </span>
                              )}
                              {product.strikePrice && (
                                <span className="font-price-strike text-price-strike text-outline line-through">
                                  {product.strikePrice}
                                </span>
                              )}
                            </div>
                            <span className="font-body-sm text-body-sm text-outline">
                              {product.subText}
                              {product.subTextStrong && (
                                <strong className="text-on-surface font-semibold">{product.subTextStrong}</strong>
                              )}
                            </span>
                          </div>
                          {product.hasOmachiStepper ? (
                            <div className="w-full flex items-center justify-between bg-primary text-on-primary rounded-full p-1 px-2 shadow-sm">
                              <button
                                type="button"
                                onClick={() => setOmachiQty((q) => Math.max(1, q - 1))}
                                className="w-6 h-6 rounded-full bg-on-primary/20 flex items-center justify-center hover:bg-on-primary/30 transition-colors cursor-pointer"
                                title="Giảm"
                              >
                                <span className="material-symbols-outlined text-[16px]">remove</span>
                              </button>
                              <span className="font-label-md text-label-md font-bold px-2">{omachiQty} lốc</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setOmachiQty((q) => q + 1);
                                  onAddToCart(product.price, 1);
                                }}
                                className="w-6 h-6 rounded-full bg-on-primary/20 flex items-center justify-center hover:bg-on-primary/30 transition-colors cursor-pointer"
                                title="Tăng"
                              >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleQuickAdd(product.id, product.price)}
                              className={`w-full flex items-center justify-between rounded-full p-1 px-3 transition-colors cursor-pointer ${
                                isAdded
                                  ? 'bg-secondary text-on-secondary'
                                  : 'bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary-fixed-dim'
                              }`}
                            >
                              <span className="font-label-sm text-label-sm font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">
                                  {isAdded ? 'check' : 'add_shopping_cart'}
                                </span>
                                {isAdded ? 'Đã thêm' : product.ctaLabel || 'Thêm vào giỏ'}
                              </span>
                              <span className="material-symbols-outlined text-[18px]">
                                {isAdded ? 'check_circle' : 'add_circle'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SPECIAL PROMO CALLOUT WIDGET */}
            <div className="mt-space-md p-space-md bg-gradient-to-r from-tertiary-fixed via-primary-fixed to-surface-container-low rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md text-left">
              <div className="flex items-center gap-space-md">
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[32px]">redeem</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-on-primary font-label-sm text-[10px] px-2 py-0.5 rounded-full font-bold">
                      ƯU ĐÃI ĐỘC QUYỀN TUẦN NÀY
                    </span>
                    <span className="text-secondary font-label-sm text-label-sm font-semibold">
                      Tự động thêm vào giỏ hàng
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-background font-bold mt-0.5">
                    Mua 1 Thùng Mì Tặng Ngay 1 Lốc Nước Ngọt Có Ga hoặc 2 Xúc Xích Tiệt Trùng
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Áp dụng cho mọi đơn hàng nguyên thùng từ Hảo Hảo, Omachi, Cung Đình, Kokomi. Số lượng có hạn theo
                    từng khu vực kho.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 px-6 py-2.5 bg-primary text-on-primary rounded-full font-headline-sm text-label-md font-bold shadow-md hover:bg-on-primary-container transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Khám Phá Danh Sách Thùng</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* PAGINATION SECTION */}
            <nav
              aria-label="Phân trang sản phẩm"
              className="mt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm"
            >
              <span className="font-body-sm text-body-sm text-outline">
                Trang <strong className="text-on-surface">{currentPage}</strong> trên{' '}
                <strong className="text-on-surface">{totalPages}</strong> trang ({totalProducts} sản phẩm đồ khô)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    currentPage <= 1
                      ? 'bg-surface-container text-outline opacity-50 cursor-not-allowed'
                      : 'bg-primary-fixed hover:bg-primary-fixed-dim text-primary shadow-xs cursor-pointer'
                  }`}
                  title="Trang trước"
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
                      className={`w-9 h-9 rounded-full font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary font-bold shadow-xs'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface font-medium'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    currentPage >= totalPages
                      ? 'bg-surface-container text-outline opacity-50 cursor-not-allowed'
                      : 'bg-primary-fixed hover:bg-primary-fixed-dim text-primary shadow-xs cursor-pointer'
                  }`}
                  title="Trang kế tiếp"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-outline">Đến trang:</span>
                <input
                  className="w-12 h-8 rounded-lg bg-surface-container-low text-center font-label-sm text-label-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  max={totalPages}
                  min={1}
                  type="number"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGoToPageInput();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleGoToPageInput}
                  className="px-3 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface transition-colors cursor-pointer"
                >
                  Đi
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* FLOATING QUICK CART NOTIFICATION BAR (Mobile & Tablet Sticky Helper) */}
      <aside
        aria-label="Giỏ hàng tóm tắt"
        className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-full shadow-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-2 pl-2">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-label-sm text-[11px] text-outline">
              Giỏ hàng: <strong>1 món</strong>
            </span>
            <span className="font-label-md text-label-md text-primary font-bold">42.000đ</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="px-5 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md font-bold shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>Xem Giỏ</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </aside>
    </div>
  );
};
