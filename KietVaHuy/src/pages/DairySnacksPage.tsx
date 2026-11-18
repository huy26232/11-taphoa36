import React, { useEffect, useMemo, useRef, useState } from 'react';
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

interface DairyProductVariant {
  id: string;
  label: string;
  price: number;
  priceStr: string;
  strikeStr?: string;
  discountBadge?: string;
  unitPriceText: string;
}

const formatDairyVnd = (amount: number): string =>
  `${Math.round(amount).toLocaleString('vi-VN')}đ`;

const parseDairyVnd = (str?: string): number | null => {
  if (!str) return null;
  const digits = str.replace(/[^\d]/g, '');
  if (!digits) return null;
  const val = Number(digits);
  return Number.isFinite(val) ? val : null;
};

const roundHalfThousandDairy = (amount: number): number =>
  Math.round(amount / 500) * 500;

const getDairyVariants = (product: DairyProduct): DairyProductVariant[] => {
  const strikeNum = parseDairyVnd(product.strikePrice);
  const basePct =
    product.discountPct ??
    (strikeNum && strikeNum > product.price
      ? Math.round(((strikeNum - product.price) / strikeNum) * 100)
      : 0);
  const baseDiscountBadge = basePct > 0 ? `-${basePct}%` : undefined;

  if (product.id === 'd2') {
    return [
      {
        id: 'standard',
        label: 'Bịch 220ml',
        price: 8000,
        priceStr: '8.000đ',
        strikeStr: '9.000đ',
        discountBadge: '-11%',
        unitPriceText: '~36.400đ / Lít',
      },
      {
        id: 'pack-6',
        label: 'Combo 6 bịch',
        price: 46000,
        priceStr: '46.000đ',
        strikeStr: '54.000đ',
        discountBadge: '-15%',
        unitPriceText: '~7.667đ / bịch 220ml',
      },
      {
        id: 'case-48',
        label: 'Thùng 48 bịch',
        price: 345000,
        priceStr: '345.000đ',
        strikeStr: '432.000đ',
        discountBadge: '-20%',
        unitPriceText: '~7.188đ / bịch 220ml',
      },
    ];
  }

  const locMatch = product.title.match(/lốc\s+(\d+)\s+(hộp|chai)\s+(\d+)(ml|g)/i);
  if (locMatch) {
    const countPerLoc = parseInt(locMatch[1], 10);
    const containerUnit = locMatch[2].toLowerCase();
    const sizeText = `${locMatch[3]}${locMatch[4].toLowerCase()}`;
    const perUnit = Math.round(product.price / countPerLoc);

    const standardVariant: DairyProductVariant = {
      id: 'standard',
      label: `Lốc ${countPerLoc} ${containerUnit} (${sizeText})`,
      price: product.price,
      priceStr: product.priceFormatted,
      strikeStr: product.strikePrice,
      discountBadge: baseDiscountBadge,
      unitPriceText: `~${formatDairyVnd(perUnit)} / ${containerUnit} ${sizeText}`,
    };

    const combo2Price = roundHalfThousandDairy(product.price * 2 * 0.96);
    const combo2Strike = (strikeNum ?? product.price) * 2;
    const combo2Pct = Math.round(((combo2Strike - combo2Price) / combo2Strike) * 100);

    if (product.category === 'milk') {
      const locCountInCase = countPerLoc === 6 ? 8 : 12;
      const totalItemsInCase = locCountInCase * countPerLoc;
      const casePrice = roundHalfThousandDairy(product.price * locCountInCase * 0.92);
      const caseStrike = (strikeNum ?? product.price) * locCountInCase;
      const casePct = Math.round(((caseStrike - casePrice) / caseStrike) * 100);

      return [
        standardVariant,
        {
          id: 'combo-2',
          label: 'Combo 2 lốc',
          price: combo2Price,
          priceStr: formatDairyVnd(combo2Price),
          strikeStr: formatDairyVnd(combo2Strike),
          discountBadge: combo2Pct > 0 ? `-${combo2Pct}%` : undefined,
          unitPriceText: `~${formatDairyVnd(Math.round(combo2Price / (countPerLoc * 2)))} / ${containerUnit}`,
        },
        {
          id: 'case',
          label: `Thùng ${totalItemsInCase} ${containerUnit}`,
          price: casePrice,
          priceStr: formatDairyVnd(casePrice),
          strikeStr: formatDairyVnd(caseStrike),
          discountBadge: casePct > 0 ? `-${casePct}%` : undefined,
          unitPriceText: `~${formatDairyVnd(Math.round(casePrice / totalItemsInCase))} / ${containerUnit}`,
        },
      ];
    }

    const combo4Price = roundHalfThousandDairy(product.price * 4 * 0.92);
    const combo4Strike = (strikeNum ?? product.price) * 4;
    const combo4Pct = Math.round(((combo4Strike - combo4Price) / combo4Strike) * 100);

    return [
      standardVariant,
      {
        id: 'combo-2',
        label: 'Combo 2 lốc',
        price: combo2Price,
        priceStr: formatDairyVnd(combo2Price),
        strikeStr: formatDairyVnd(combo2Strike),
        discountBadge: combo2Pct > 0 ? `-${combo2Pct}%` : undefined,
        unitPriceText: `~${formatDairyVnd(Math.round(combo2Price / (countPerLoc * 2)))} / ${containerUnit}`,
      },
      {
        id: 'combo-4',
        label: 'Combo 4 lốc',
        price: combo4Price,
        priceStr: formatDairyVnd(combo4Price),
        strikeStr: formatDairyVnd(combo4Strike),
        discountBadge: combo4Pct > 0 ? `-${combo4Pct}%` : undefined,
        unitPriceText: `~${formatDairyVnd(Math.round(combo4Price / (countPerLoc * 4)))} / ${containerUnit}`,
      },
    ];
  }

  const titleLower = product.title.toLowerCase();
  const unitWord = titleLower.includes('lon ')
    ? 'Lon'
    : titleLower.includes('hộp ')
      ? 'Hộp'
      : titleLower.includes('thanh ')
        ? 'Thanh'
        : 'Gói';
  const weightMatch = product.title.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
  const weightNum = weightMatch ? parseFloat(weightMatch[1].replace(',', '.')) : null;
  const standardLabel = weightMatch ? `${unitWord} ${weightMatch[1]}g` : product.meta;

  const unitPriceText =
    weightNum && weightNum > 0
      ? `~${formatDairyVnd(roundHalfThousandDairy((product.price / weightNum) * 100))} / 100g`
      : `${product.priceFormatted} / ${unitWord.toLowerCase()}`;

  const standardVariant: DairyProductVariant = {
    id: 'standard',
    label: standardLabel,
    price: product.price,
    priceStr: product.priceFormatted,
    strikeStr: product.strikePrice,
    discountBadge: baseDiscountBadge,
    unitPriceText,
  };

  const combo2Price = roundHalfThousandDairy(product.price * 2 * 0.95);
  const combo2Strike = (strikeNum ?? product.price) * 2;
  const combo2Pct = Math.round(((combo2Strike - combo2Price) / combo2Strike) * 100);

  const thirdCount = product.category === 'candy' ? 5 : 4;
  const thirdPrice = roundHalfThousandDairy(product.price * thirdCount * 0.9);
  const thirdStrike = (strikeNum ?? product.price) * thirdCount;
  const thirdPct = Math.round(((thirdStrike - thirdPrice) / thirdStrike) * 100);

  return [
    standardVariant,
    {
      id: 'combo-2',
      label: `Combo 2 ${unitWord.toLowerCase()}`,
      price: combo2Price,
      priceStr: formatDairyVnd(combo2Price),
      strikeStr: formatDairyVnd(combo2Strike),
      discountBadge: combo2Pct > 0 ? `-${combo2Pct}%` : undefined,
      unitPriceText: `~${formatDairyVnd(Math.round(combo2Price / 2))} / ${unitWord.toLowerCase()}`,
    },
    {
      id: 'combo-bulk',
      label: `Combo ${thirdCount} ${unitWord.toLowerCase()}`,
      price: thirdPrice,
      priceStr: formatDairyVnd(thirdPrice),
      strikeStr: formatDairyVnd(thirdStrike),
      discountBadge: thirdPct > 0 ? `-${thirdPct}%` : undefined,
      unitPriceText: `~${formatDairyVnd(Math.round(thirdPrice / thirdCount))} / ${unitWord.toLowerCase()}`,
    },
  ];
};

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
  const [selectedProduct, setSelectedProduct] = useState<DairyProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('standard');
  const [detailQty, setDetailQty] = useState<number>(1);
  const [detailAdded, setDetailAdded] = useState<boolean>(false);

  const selectedProductVariants = useMemo(
    () => (selectedProduct ? getDairyVariants(selectedProduct) : []),
    [selectedProduct],
  );

  const activeVariant = useMemo(
    () =>
      selectedProductVariants.find((v) => v.id === selectedVariantId) ||
      selectedProductVariants[0] ||
      null,
    [selectedProductVariants, selectedVariantId],
  );

  useEffect(() => {
    if (!selectedProduct) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProduct]);

  const openProductDetail = (product: DairyProduct) => {
    const variants = getDairyVariants(product);
    setSelectedProduct(product);
    setSelectedVariantId(variants[0]?.id || 'standard');
    setDetailQty(Math.max(1, cartQtys[product.id] || 1));
    setDetailAdded(false);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setDetailAdded(false);
  };

  const handleDetailBuy = () => {
    if (!selectedProduct || !activeVariant) return;
    const safeQty = Math.min(99, Math.max(1, detailQty));
    onAddToCart(activeVariant.price, safeQty);
    setDetailAdded(true);
    window.setTimeout(() => {
      setDetailAdded(false);
    }, 1200);
  };

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
    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }
    setActivePage(nextPage);
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
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => openProductDetail(product)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openProductDetail(product);
                            }
                          }}
                          aria-label={`Xem chi tiết ${product.title}`}
                          className="relative w-full aspect-square rounded-lg bg-surface-container-low overflow-hidden mb-space-sm flex items-center justify-center cursor-pointer"
                        >
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
                        <h2
                          role="button"
                          tabIndex={0}
                          onClick={() => openProductDetail(product)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openProductDetail(product);
                            }
                          }}
                          className="font-headline-sm text-headline-sm text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                        >
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

      {/* Product Detail View Modal */}
      {selectedProduct && activeVariant && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dairy-snacks-detail-title"
          onClick={closeProductDetail}
          className="fixed inset-0 z-50 bg-on-surface/55 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-outline-variant/40"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeProductDetail}
              aria-label="Đóng chi tiết sản phẩm"
              className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-surface-container-low hover:bg-primary-fixed text-on-surface hover:text-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-7 text-left">
              {/* Left Side: Product Image */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-low shadow-sm">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 z-10 font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold shadow-sm ${selectedProduct.leftBadgeClass}`}
                  >
                    {selectedProduct.leftBadge}
                  </span>
                  {selectedProduct.rightBadge && (
                    <span className="absolute top-3 right-3 z-10 bg-primary-fixed text-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">
                      {selectedProduct.rightBadge}
                    </span>
                  )}
                </div>

                <div className="bg-secondary-fixed/25 text-on-secondary-fixed-variant rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    verified_user
                  </span>
                  <span>Bảo quản kho lạnh chuẩn • Giao nguyên lốc/hộp, date mới dài hạn.</span>
                </div>
              </div>

              {/* Right Side: Info, Pricing, Variants, Quantity & MUA */}
              <div className="md:col-span-7 flex flex-col justify-between gap-5 pr-2">
                <div className="flex flex-col gap-4">
                  {/* Brand & Title */}
                  <div className="flex flex-col gap-1.5 pr-8">
                    <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                      <span>{selectedProduct.brand}</span>
                      <span>•</span>
                      <span>{selectedProduct.meta}</span>
                    </div>
                    <h2
                      id="dairy-snacks-detail-title"
                      className="font-headline-md sm:font-headline-lg text-on-surface font-bold leading-snug"
                    >
                      {selectedProduct.title}
                    </h2>
                    <p
                      className={`font-body-md text-body-md ${selectedProduct.subMetaClass || 'text-on-surface-variant'}`}
                    >
                      {selectedProduct.subMeta}
                    </p>
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-surface-container-low/70 rounded-xl p-4 flex flex-col gap-1.5 border border-outline-variant/25">
                    <div className="flex items-baseline flex-wrap gap-2.5">
                      <span className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                        {activeVariant.priceStr}
                      </span>
                      {activeVariant.strikeStr && (
                        <span className="text-sm text-outline line-through">
                          {activeVariant.strikeStr}
                        </span>
                      )}
                      {activeVariant.discountBadge && (
                        <span className="px-2 py-0.5 rounded-md bg-secondary-fixed/60 text-secondary font-label-sm text-label-sm font-bold">
                          {activeVariant.discountBadge}
                        </span>
                      )}
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Đơn giá quy đổi: <strong className="text-on-surface">{activeVariant.unitPriceText}</strong>
                    </span>
                  </div>

                  {/* Packaging / Option Selector */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-md text-label-md text-on-surface">
                      Chọn quy cách / phân loại đóng gói:
                    </span>
                    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Quy cách đóng gói">
                      {selectedProductVariants.map((variant) => {
                        const isSelected = variant.id === activeVariant.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setSelectedVariantId(variant.id)}
                            className={`px-3.5 py-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'border-primary bg-primary-fixed/40 text-primary font-bold shadow-sm'
                                : 'border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-primary' : 'border-outline'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-primary" />}
                            </span>
                            <span className="font-label-md text-label-md">{variant.label}</span>
                            <span className="font-body-sm text-body-sm text-outline">
                              ({variant.priceStr})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector & Primary MUA Action */}
                <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <span className="font-label-md text-label-md text-on-surface">Số lượng:</span>
                    <div className="flex items-center bg-surface-container-low rounded-xl p-1 border border-outline-variant/40">
                      <button
                        type="button"
                        onClick={() => setDetailQty((q) => Math.max(1, q - 1))}
                        aria-label="Giảm số lượng"
                        className="w-9 h-9 rounded-lg bg-surface-container-lowest hover:bg-primary-fixed text-on-surface hover:text-primary font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={detailQty}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value, 10);
                          if (Number.isNaN(parsed)) {
                            setDetailQty(1);
                          } else {
                            setDetailQty(Math.min(99, Math.max(1, parsed)));
                          }
                        }}
                        aria-label="Nhập số lượng"
                        className="w-12 text-center bg-transparent font-label-md text-body-md text-on-surface font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => setDetailQty((q) => Math.min(99, q + 1))}
                        aria-label="Tăng số lượng"
                        className="w-9 h-9 rounded-lg bg-surface-container-lowest hover:bg-primary-fixed text-primary font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetailBuy}
                    className={`w-full py-3.5 px-6 rounded-xl font-label-md text-base font-bold shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
                      detailAdded
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-gradient-to-r from-primary-container to-primary text-on-primary hover:opacity-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {detailAdded ? 'check_circle' : 'shopping_cart'}
                    </span>
                    <span>
                      {detailAdded
                        ? 'ĐÃ THÊM VÀO GIỎ HÀNG'
                        : `MUA • ${formatDairyVnd(activeVariant.price * detailQty)}`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
