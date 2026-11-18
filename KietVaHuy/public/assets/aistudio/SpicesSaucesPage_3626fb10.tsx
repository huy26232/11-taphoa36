import React, { useRef, useState } from 'react';
import { PageId } from '../types';

interface SpicesSaucesPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

type SpicesCategoryId = 'fish-sauce' | 'oil' | 'sauces' | 'seasoning' | 'marinade';
type ProteinTier = 'low' | 'mid' | 'high';
type SizeBucket = '300-500ml' | '900ml - 1L' | '2L - 5L';

interface SpiceProduct {
  id: string;
  category: SpicesCategoryId;
  badgeTop: {
    text: string;
    icon?: string;
    cls: string;
  };
  badgeBottom?: {
    text: string;
    cls: string;
  };
  img: string;
  alt: string;
  brand: string;
  title: string;
  subIcon: string;
  subText: string;
  price: number;
  priceStr: string;
  strikeStr?: string;
  proteinTier?: ProteinTier;
  proteinRank?: number;
  sizeBucket: SizeBucket;
  nutritionTags?: string[];
}

const PRODUCTS: SpiceProduct[] = [
  {
    id: 'nam-ngu',
    category: 'fish-sauce',
    badgeTop: {
      text: 'Bán chạy #1',
      icon: 'local_fire_department',
      cls: 'bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5',
    },
    badgeBottom: {
      text: 'Tiết kiệm 900ml',
      cls: 'bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-semibold px-2 py-0.5 rounded-full',
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ24wliiKInMPlMfoYC7ufetetlnewdvlbqzesM9P8xC-7v8H06xyWgSe4a29z_E3g_SSepqxbsN7E63IzYy6I4ztsxy5w-O3c-Ht3_5K_aWodu_TWCeQAjl1TXQoiiVmJ3xL6owJVtHOXvFz3I5Xi5WZv1s1DzbNrarjcb4Hbz_fFISwfExZY_sY3KBelHRPOkYQku6ZjPv08pYXWzkV1kLray60ZFQvHF4iSXUQf',
    alt: 'Nước mắm Nam Ngư Đệ Nhị',
    brand: 'Nam Ngư',
    title: 'Nước mắm Nam Ngư Đệ Nhị chai 900ml',
    subIcon: 'bolt',
    subText: 'Giao siêu tốc 30 phút',
    price: 28000,
    priceStr: '28.000đ',
    strikeStr: '32.000đ',
    proteinTier: 'low',
    proteinRank: 15,
    sizeBucket: '900ml - 1L',
  },
  {
    id: 'ong-ky',
    category: 'fish-sauce',
    badgeTop: {
      text: '40°N Cốt Nhĩ',
      icon: 'verified',
      cls: 'bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5',
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_k-VCd0MBYeer49J8w_B3ooi9kyoys0AeLaPrWPcWaTFtpAiAaKOTXqyrJ3a-Kx4T-exSKWxu-vjQtNZ0XAvfuAtyxxu1LzifX4o5cHOdOkC5tknQy0yLj0dmCJhBLRqBHHLEiiLd-y0WtgGHmnSjAyJZjugFnQoNQdLPifTMUv0B1MzcAv7lZFWECUvwLvi4Yu1aMa9n8g7BYyKwG4JUgsoBkLGFyZpL0mL1zoio',
    alt: 'Nước mắm truyền thống Phú Quốc Ông Kỳ',
    brand: 'Phú Quốc Ông Kỳ',
    title: 'Nước mắm truyền thống Phú Quốc Ông Kỳ 40 độ đạm 525ml',
    subIcon: 'eco',
    subText: 'Ủ chượp thùng gỗ 12 tháng',
    price: 85000,
    priceStr: '85.000đ',
    strikeStr: '95.000đ',
    proteinTier: 'high',
    proteinRank: 40,
    sizeBucket: '300-500ml',
  },
  {
    id: 'simply',
    category: 'oil',
    badgeTop: {
      text: 'Tốt tim mạch',
      icon: 'favorite',
      cls: 'bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5',
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFQ1KKEOIfwfL_JTGyoJltflScLL_1upanTflAkAaMTwEIe1f7jCJwrrpD29b6uZgn1YXKp6kffozWtlvdczkV5bI7zbDeBzy3Dt4ii_haNaPHh64PnG1mxKCCj8dgXr2KQLLaBcJsuj-6ja-Ag9LHrnF65roZjovU3FCOIPlyS5fIueF2taqAFxrSCChGV96WoID0j6ieqB3LELYPZuU3RFd8aJOWhk4902q9EmfB',
    alt: 'Dầu đậu nành nguyên chất Simply',
    brand: 'Simply',
    title: 'Dầu đậu nành nguyên chất Simply chai 1 Lít',
    subIcon: 'health_and_safety',
    subText: 'Giàu Omega 3, 6 & 9',
    price: 62000,
    priceStr: '62.000đ',
    strikeStr: '68.000đ',
    sizeBucket: '900ml - 1L',
    nutritionTags: ['omega'],
  },
  {
    id: 'maggi-soy',
    category: 'sauces',
    badgeTop: {
      text: 'Lên men tự nhiên',
      cls: 'bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtvd6Oxt3x3P85c-bY9tYr9Fbwx7OjhtPdM97e0hHVGNLpHL21LUn4aZ0FN7v372Yc5NTFU-DvyjoEScgdJE1GDaIA5oRltwQ0ilXPUpxA9snVd0Y8KIR7pY_4uJobc3uJMfqTw4u2jtJsn-dln8kzASkOPcfp6HDy8FmSEJSGdP8YmRrgaRSnaiCzvrn2bDRemgAvjrOEf8SlKcgEX-FswU8YlqZILBPTxCoES7TA',
    alt: 'Nước tương Maggi Đậm Đặc',
    brand: 'Maggi',
    title: 'Nước tương Maggi Đậm Đặc chai 700ml',
    subIcon: 'thumb_up',
    subText: 'Vị ngọt hậu thanh đạm',
    price: 25000,
    priceStr: '25.000đ',
    strikeStr: '29.000đ',
    sizeBucket: '900ml - 1L',
  },
  {
    id: 'knorr',
    category: 'seasoning',
    badgeTop: {
      text: 'Gói lớn 900g',
      cls: 'bg-primary-container text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzTsfodypvfqlnsjXrvhslkivJeskychwn8EFgytffyc_VVHrsq8Qd_HiW4-V0APali9zo5EfwxzdzQPtdgo-IT3q-I50J33kqDPqOVuDgwI87NJsOnp13AkRidmXFjnExFA0m_q_ZBy6Ftk8d0Q5et2YPY5HPVwZJ7hqTVca0Q7dAjXpnQ2S5RrHoGCJR5WQqFs2IoN270WURAHYEiKqGi08GuYN1Q_89zUmr-9Cq',
    alt: 'Hạt nêm Knorr thịt thăn xương ống',
    brand: 'Knorr',
    title: 'Hạt nêm Knorr thịt thăn xương ống gói 900g',
    subIcon: 'check',
    subText: 'Ngọt nước hầm xương',
    price: 68000,
    priceStr: '68.000đ',
    strikeStr: '76.000đ',
    sizeBucket: '900ml - 1L',
    nutritionTags: ['knorr'],
  },
  {
    id: 'chinsu-chili',
    category: 'sauces',
    badgeTop: {
      text: 'Cay thơm',
      cls: 'bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSrGMHp-62DA5hh8A0j5Ja7GH2a0L9zBLhiU3EgrH8BqUgkkIfXaVy2s7u3LflkJtR323Yjq-m46GtnY3r9jN5zKdCM9pFalKy31UjcpUJFkcYzl6USVNRPzV_WtBRLyArMBsfr-wP-zYTHw7Sv2puAWeKztmp3BfLK5ve9oZ4vhv6nsev9B77qzuqZJpVjhQ0Lq62w37EMA_PvX5pkbm4wCCNchR-y7f35IWBVUAh',
    alt: 'Tương ớt Chinsu chai 250g',
    brand: 'Chinsu',
    title: 'Tương ớt Chinsu chai 250g cay đậm vị',
    subIcon: 'restaurant',
    subText: 'Chấm vạn món ngon',
    price: 14000,
    priceStr: '14.000đ',
    strikeStr: '16.000đ',
    sizeBucket: '300-500ml',
  },
  {
    id: 'maggi-oyster',
    category: 'sauces',
    badgeTop: {
      text: 'Bóng món xào',
      cls: 'bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe0on5p_4i1aWhbglEtraPl0wOvWuRGX-Ymk8_lmAp8pbDukkGMq35CxXlW0uximtUjLefNVmCOlquodrwXNJYaTr26Ic9tNx5qQgz_DmWEqZfVjAuX3LnUbqrkuHkDRaU63RK-Hl5frHgf6v57x4qQ8q5RjkGqroHjwzCyfzSE2Xftg-mCF2ScI8uVOtdT16pi_7F8HbfsFawym-yo_cofRjpoaK8KFI6gPppuGQW',
    alt: 'Dầu hào Maggi hảo hạng',
    brand: 'Maggi',
    title: 'Dầu hào Maggi hảo hạng chai 350g',
    subIcon: 'soup_kitchen',
    subText: 'Sốt sệt đậm đà tự nhiên',
    price: 21000,
    priceStr: '21.000đ',
    strikeStr: '24.000đ',
    sizeBucket: '300-500ml',
  },
  {
    id: 'barona',
    category: 'marinade',
    badgeTop: {
      text: 'Chuẩn vị sẵn',
      cls: 'bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE5q8E9v9IJU7kSExR4CWldCUuv4gTORZH0lvY3CBhkQv1pnHrPbZWgkhF0pYKJe4Yw8pbxoAYD7aeRul-p4aStfvxvZ8iqrVYs-fMQ0VfwaaIVzaWCPDjyjeVevn7K5_PoBogelJBhBCDvg0oAI10dyLDBm0yubUdGAGPhD4ANAIUw0IIFtjmkcfDBv8vKA4XErOaDzCqz1-2C6hdMyBl0NJylIAYOFUp2bPT2JR1',
    alt: 'Sốt ướp thịt kho tàu Barona',
    brand: 'Barona',
    title: 'Sốt ướp thịt kho tàu Barona gói 80g tiện lợi',
    subIcon: 'timer',
    subText: 'Nấu ngon không cần nêm',
    price: 11000,
    priceStr: '11.000đ',
    strikeStr: '13.000đ',
    sizeBucket: '300-500ml',
  },
  {
    id: 'chinsu-fish-sauce',
    category: 'fish-sauce',
    badgeTop: {
      text: '20°N Cá Cơm',
      icon: 'verified',
      cls: 'bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/2289/260183/nuoc-mam-chinsu-ca-com-bien-dong-chai-720ml_202608261433083265.jpg',
    alt: 'Nước mắm cá cơm Chinsu Biển Đông chai 720ml',
    brand: 'Chinsu',
    title: 'Nước mắm cá cơm Chinsu Biển Đông chai 720ml',
    subIcon: 'restaurant',
    subText: '20 độ đạm tròn vị bữa cơm',
    price: 71000,
    priceStr: '71.000đ',
    proteinTier: 'low',
    proteinRank: 20,
    sizeBucket: '900ml - 1L',
  },
  {
    id: 'hung-thinh',
    category: 'fish-sauce',
    badgeTop: {
      text: '35°N Siêu Hạng',
      icon: 'eco',
      cls: 'bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/2289/76418/nmam-ca-com-sieu-hang-35-do-620ml_202608261509345705.jpg',
    alt: 'Nước mắm cá cơm siêu hạng Hưng Thịnh 35 độ đạm chai 620ml',
    brand: 'Hưng Thịnh',
    title: 'Nước mắm cá cơm siêu hạng Hưng Thịnh 35 độ đạm chai 620ml',
    subIcon: 'eco',
    subText: 'Phú Quốc truyền thống đậm đà',
    price: 65000,
    priceStr: '65.000đ',
    proteinTier: 'mid',
    proteinRank: 35,
    sizeBucket: '900ml - 1L',
  },
  {
    id: 'neptune-light',
    category: 'oil',
    badgeTop: {
      text: 'Can lớn 2 Lít',
      icon: 'favorite',
      cls: 'bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/226994/bhx/226994-thumb-moi_202411071433303060.jpg',
    alt: 'Dầu ăn thượng hạng Neptune Light can 2 Lít',
    brand: 'Neptune',
    title: 'Dầu ăn thượng hạng Neptune Light can 2 Lít',
    subIcon: 'health_and_safety',
    subText: 'Dầu gạo lứt & hướng dương Omega',
    price: 130000,
    priceStr: '130.000đ',
    sizeBucket: '2L - 5L',
    nutritionTags: ['omega'],
  },
  {
    id: 'tuong-an',
    category: 'oil',
    badgeTop: {
      text: 'Chiên giòn ngon',
      cls: 'bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2286/88739/dau-thuc-vat-tuong-an-cooking-oil-chai-1-lit_202610221114531676.jpg',
    alt: 'Dầu thực vật Tường An Cooking Oil chai 1 Lít',
    brand: 'Tường An',
    title: 'Dầu thực vật Tường An Cooking Oil chai 1 Lít',
    subIcon: 'soup_kitchen',
    subText: 'Chịu nhiệt cao, chiên xào thơm',
    price: 62000,
    priceStr: '62.000đ',
    sizeBucket: '900ml - 1L',
  },
  {
    id: 'ajinomoto-msg',
    category: 'seasoning',
    badgeTop: {
      text: 'Hạt lớn 454g',
      cls: 'bg-primary-container text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2806/77081/bot-ngot-ajinomoto-hat-lon-goi-454g_202610291441393529.jpg',
    alt: 'Bột ngọt hạt lớn Ajinomoto gói 454g',
    brand: 'Ajinomoto',
    title: 'Bột ngọt hạt lớn Ajinomoto gói 454g',
    subIcon: 'check',
    subText: 'Lên men tự nhiên từ mật mía',
    price: 38500,
    priceStr: '38.500đ',
    sizeBucket: '300-500ml',
  },
  {
    id: 'muoi-bac-lieu',
    category: 'seasoning',
    badgeTop: {
      text: 'Bổ sung I-ốt',
      cls: 'bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2803/276058/bhx/276058-thumb-moi_202411112106502060.jpg',
    alt: 'Muối I-ốt Bạc Liêu cao cấp gói 500g',
    brand: 'Bạc Liêu',
    title: 'Muối I-ốt Bạc Liêu cao cấp gói 500g',
    subIcon: 'check_circle',
    subText: 'Hạt muối sạch tinh trắng mịn',
    price: 6600,
    priceStr: '6.600đ',
    sizeBucket: '300-500ml',
  },
  {
    id: 'cholimex-ketchup',
    category: 'sauces',
    badgeTop: {
      text: 'Chai thủy tinh',
      cls: 'bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/2567/82707/tuong-ca-cholimex-270g_202610131118068163.jpg',
    alt: 'Tương cà Cholimex chai 270g',
    brand: 'Cholimex',
    title: 'Tương cà Cholimex chai 270g',
    subIcon: 'restaurant',
    subText: 'Cà chua tươi sánh mịn chua ngọt',
    price: 15800,
    priceStr: '15.800đ',
    sizeBucket: '300-500ml',
  },
  {
    id: 'cholimex-sate',
    category: 'marinade',
    badgeTop: {
      text: 'Cay nồng thơm tôm',
      cls: 'bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/2809/156048/sa-te-tom-cholimex-chai-90g_202611051103245118.jpg',
    alt: 'Sa tế tôm vị cay Cholimex hũ 90g',
    brand: 'Cholimex',
    title: 'Sa tế tôm vị cay Cholimex hũ 90g',
    subIcon: 'local_fire_department',
    subText: 'Ướp nướng, nấu bún bò, lẩu cay',
    price: 10200,
    priceStr: '10.200đ',
    sizeBucket: '300-500ml',
  },
  {
    id: 'ajinomoto-vinegar',
    category: 'sauces',
    badgeTop: {
      text: 'Chua thanh dịu',
      cls: 'bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full',
    },
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/3465/91788/giam-gao-len-men-ajinomoto-chai-400ml_202610291442464772.jpg',
    alt: 'Giấm gạo lên men Ajinomoto chai 400ml',
    brand: 'Ajinomoto',
    title: 'Giấm gạo lên men Ajinomoto chai 400ml',
    subIcon: 'thumb_up',
    subText: 'Lên men từ gạo, pha gỏi & nước chấm',
    price: 18900,
    priceStr: '18.900đ',
    sizeBucket: '300-500ml',
  },
];

const BRAND_FILTER_LIST = [
  'Nam Ngư',
  'Chinsu',
  'Maggi',
  'Knorr',
  'Simply',
  'Neptune',
  'Cholimex',
  'Phú Quốc Ông Kỳ',
  'Hưng Thịnh',
  'Tường An',
  'Ajinomoto',
  'Bạc Liêu',
  'Barona',
];

export const SpicesSaucesPage: React.FC<SpicesSaucesPageProps> = ({
  onNavigate,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('best');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Nam Ngư', 'Knorr', 'Phú Quốc Ông Kỳ']);
  const [proteinLevel, setProteinLevel] = useState('high');
  const [bottleSize, setBottleSize] = useState('900ml - 1L');
  const [nutritionFilters, setNutritionFilters] = useState<string[]>(['knorr']);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 1])),
  );
  const productListTopRef = useRef<HTMLElement>(null);

  const toggleBrand = (brand: string) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setSelectedBrands([brand]);
      setProteinLevel('');
      setBottleSize('');
      setNutritionFilters([]);
    } else {
      setSelectedBrands((prev) =>
        prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
      );
    }
    setActivePage(1);
  };

  const handleSelectProtein = (level: string) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setSelectedBrands([]);
      setBottleSize('');
      setNutritionFilters([]);
      setProteinLevel(level);
    } else {
      setProteinLevel((prev) => (prev === level ? '' : level));
    }
    setActivePage(1);
  };

  const handleSelectBottleSize = (size: string) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setSelectedBrands([]);
      setProteinLevel('');
      setNutritionFilters([]);
      setBottleSize(size);
    } else {
      setBottleSize((prev) => (prev === size ? '' : size));
    }
    setActivePage(1);
  };

  const toggleNutrition = (key: string) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setSelectedBrands([]);
      setProteinLevel('');
      setBottleSize('');
      setNutritionFilters([key]);
    } else {
      setNutritionFilters((prev) =>
        prev.includes(key) ? prev.filter((n) => n !== key) : [...prev, key],
      );
    }
    setActivePage(1);
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setProteinLevel('');
    setBottleSize('');
    setNutritionFilters([]);
    setFiltersApplied(false);
    setActiveTab('all');
    setActivePage(1);
  };

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(99, (prev[id] ?? 1) + delta)),
    }));
  };

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeTab !== 'all' && product.category !== activeTab) {
      return false;
    }
    if (filtersApplied) {
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      if (proteinLevel && product.proteinTier !== proteinLevel) {
        return false;
      }
      if (bottleSize && product.sizeBucket !== bottleSize) {
        return false;
      }
      if (
        nutritionFilters.length > 0 &&
        !nutritionFilters.some((tag) => product.nutritionTags?.includes(tag))
      ) {
        return false;
      }
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'protein') return (b.proteinRank ?? 0) - (a.proteinRank ?? 0);
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
    window.requestAnimationFrame(() => {
      productListTopRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin-desktop py-space-md w-full">
        {/* 1. Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md mb-space-md overflow-x-auto whitespace-nowrap"
        >
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
          <span className="text-primary font-bold">Gia vị &amp; Nước mắm</span>
        </nav>

        {/* 2. Hero Section */}
        <section className="relative w-full rounded-2xl bg-gradient-to-r from-primary-fixed via-surface-container-low to-tertiary-fixed p-6 sm:p-8 shadow-sm overflow-hidden mb-space-lg">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-48 -bottom-10 w-48 h-48 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 flex flex-col items-start gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-surface-container-lowest text-primary px-3 py-1 rounded-full font-label-sm text-label-sm shadow-sm font-bold">
                  <span
                    className="material-symbols-outlined text-[15px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    soup_kitchen
                  </span>
                  Đậm đà vị chuẩn cơm mẹ nấu
                </span>
                <span className="inline-flex items-center gap-1 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Chính hãng 100%
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg sm:text-display-lg font-display-lg text-on-surface tracking-tight text-left">
                Gia Vị Nấu Nướng &amp; Nước Mắm Cốt Truyền Thống
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl text-left leading-relaxed">
                Cam kết nước mắm cốt cá cơm nguyên chất độ đạm chuẩn, dầu ăn tim mạch lành mạnh, hạt nêm gia vị dồi dào dinh dưỡng rõ nguồn gốc xuất xứ. Bữa ăn gia đình thêm trọn vị, an tâm từng giọt nêm.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-secondary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Cốt nhĩ 40°N đậm đà
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-secondary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Dầu thực vật chuẩn Omega 3-6-9
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-end">
              <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Ưu đãi bếp mới
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-bold">GIẢM 15%</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    alt="Combo gia vị khởi đầu"
                    className="w-20 h-20 rounded-lg object-cover bg-surface-container-low shrink-0"
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD-DFLwjLs5Plo10sMNtK_C6YrxI4KLBFwiVJF0_ZRLhU5DjPOHGCVM4QsDzaT61ixIjEUh7zbdl-wdv-oZPpQ2qsn57rKdm54Rs74tVLIl4MJeOzM-_zaMsHtJdW7o9kJlZIY63VKu14kAMZV4YAIxtxC3WXeXAiN_C4Im3Tj6Fskal-8mXQNjpDtxtUT9UYo4aL_T4yXeLFXIcmjpjxmOTjU3dY5AmHBj6pD6N4x"
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-headline-sm text-label-md text-on-surface font-bold leading-snug">
                      Combo Gia Vị Khởi Đầu
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">Đầy đủ 4 món cơ bản</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-price-lg text-price-lg text-primary font-bold">118.000đ</span>
                      <span className="font-price-strike text-price-strike text-outline line-through">
                        139.000đ
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(118000, 1)}
                  className="w-full py-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  Nhận Ưu Đãi Ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Sub-category Navigation Pill Tabs */}
        <nav aria-label="Phân nhóm gia vị" className="w-full overflow-x-auto pb-2 mb-space-lg no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {[
              { id: 'all', icon: 'dinner_dining', iconClass: '', filled: true, label: 'Tất cả gia vị' },
              {
                id: 'fish-sauce',
                icon: 'liquor',
                iconClass: 'text-primary',
                label: 'Nước mắm truyền thống & Công nghiệp',
              },
              {
                id: 'oil',
                icon: 'oil_barrel',
                iconClass: 'text-secondary',
                label: 'Dầu ăn thực vật cao cấp',
              },
              {
                id: 'sauces',
                icon: 'water_drop',
                iconClass: 'text-tertiary',
                label: 'Nước tương, Dầu hào & Tương ớt',
              },
              {
                id: 'seasoning',
                icon: 'grain',
                iconClass: 'text-outline',
                label: 'Muối, Đường, Bột ngọt & Hạt nêm',
              },
              {
                id: 'marinade',
                icon: 'kettle',
                iconClass: 'text-primary',
                label: 'Gia vị ướp sẵn & Nước sốt',
              },
            ].map((tab) => {
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
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md text-label-md shadow-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${isActive ? '' : tab.iconClass}`}
                    style={tab.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-primary-fixed text-on-primary-fixed-variant'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Workspace: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* 4. Sidebar Filter */}
          <aside className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Bộ Lọc Chọn Lọc
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
              >
                Thiết lập lại
              </button>
            </div>

            {/* Filter Block: Thương hiệu */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-label-md text-on-surface font-bold">
                  Thương Hiệu Quen Thuộc
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline">expand_less</span>
              </div>
              <div className="flex flex-col gap-2">
                {BRAND_FILTER_LIST.map((brandName) => {
                  const count = PRODUCTS.filter((p) => p.brand === brandName).length;
                  return (
                    <label key={brandName} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        checked={selectedBrands.includes(brandName)}
                        onChange={() => toggleBrand(brandName)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                        type="checkbox"
                      />
                      <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors flex-1">
                        {brandName}
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Block: Độ đạm nước mắm */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-label-md text-on-surface font-bold">
                  Độ Đạm Nước Mắm
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline">expand_less</span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'low', label: 'Dưới 25°N (Dịu thanh)' },
                  { id: 'mid', label: '30°N - 40°N (Truyền thống đậm đà)' },
                  { id: 'high', label: 'Cốt nhĩ đặc biệt >40°N' },
                ].map((opt) => {
                  const isChecked = proteinLevel === opt.id;
                  return (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        checked={isChecked}
                        onChange={() => handleSelectProtein(opt.id)}
                        className="w-4 h-4 text-primary accent-primary cursor-pointer"
                        name="do_dam"
                        type="radio"
                      />
                      <span
                        className={`font-body-md text-body-md ${
                          isChecked ? 'text-primary font-semibold' : 'text-on-surface group-hover:text-primary'
                        }`}
                      >
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Block: Dung tích & Quy cách */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-label-md text-on-surface font-bold">
                  Dung Tích Đóng Chai
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline">expand_less</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: '300-500ml', label: 'Chai nhỏ 300-500ml' },
                  { id: '900ml - 1L', label: 'Chai tiết kiệm 900ml - 1L' },
                  { id: '2L - 5L', label: 'Can lớn 2L - 5L' },
                ].map((sz) => {
                  const isActive = bottleSize === sz.id;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => handleSelectBottleSize(sz.id)}
                      className={`px-2.5 py-1 font-label-sm text-label-sm rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      {sz.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Block: Tiêu chuẩn dinh dưỡng */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-label-md text-on-surface font-bold">
                  Tiêu Chuẩn Dinh Dưỡng
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline">expand_less</span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'omega', label: 'Dầu ăn bổ sung Omega 3-6-9' },
                  { id: 'knorr', label: 'Hạt nêm từ thịt thăn xương ống' },
                  { id: 'rock-sugar', label: 'Đường phèn tinh khiết' },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      checked={nutritionFilters.includes(opt.id)}
                      onChange={() => toggleNutrition(opt.id)}
                      className="w-4 h-4 rounded text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                      type="checkbox"
                    />
                    <span className="font-body-md text-body-md text-on-surface group-hover:text-secondary">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Guarantee Pill Notice */}
            <div className="bg-secondary-fixed/30 p-4 rounded-xl text-left flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
                verified_user
              </span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-label-md text-on-secondary-fixed-variant font-bold">
                  Cam kết độ đạm thật
                </span>
                <span className="font-body-sm text-body-sm text-on-secondary-fixed-variant/90 leading-tight">
                  Mọi chai nước mắm truyền thống đều được kiểm định hàm lượng nitơ toàn phần minh bạch.
                </span>
              </div>
            </div>
          </aside>

          {/* Right Main */}
          <section ref={productListTopRef} className="lg:col-span-9 flex flex-col gap-space-md scroll-mt-40">
            {/* Bar: Sort & Item Count */}
            <div className="bg-surface-container-lowest px-4 py-3 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Danh sách gia vị thiết yếu
                </span>
                <span className="font-body-sm text-body-sm text-outline">
                  (Hiển thị {displayedProducts.length}/{totalProducts} sản phẩm)
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="font-label-sm text-label-sm text-outline">Sắp xếp theo:</span>
                <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
                  {[
                    { id: 'best', label: 'Bán chạy nhất' },
                    { id: 'price-asc', label: 'Giá tăng dần' },
                    { id: 'protein', label: 'Độ đạm cao' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSortBy(s.id);
                        setActivePage(1);
                      }}
                      className={`px-2.5 py-1 rounded font-label-md text-label-md cursor-pointer transition-colors ${
                        sortBy === s.id
                          ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Product Grid */}
            {displayedProducts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-sm flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer hover:bg-on-primary-container transition-colors"
                >
                  Thiết lập lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {displayedProducts.map((product) => {
                  const qty = quantities[product.id] ?? 1;
                  return (
                    <article
                      key={product.id}
                      className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between text-left group relative"
                    >
                      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                        <span className={product.badgeTop.cls}>
                          {product.badgeTop.icon && (
                            <span className="material-symbols-outlined text-[12px]">
                              {product.badgeTop.icon}
                            </span>
                          )}
                          {product.badgeTop.text}
                        </span>
                        {product.badgeBottom && (
                          <span className={product.badgeBottom.cls}>{product.badgeBottom.text}</span>
                        )}
                      </div>

                      <div>
                        <div className="w-full aspect-square bg-surface-container-low rounded-xl overflow-hidden mb-2.5 relative flex items-center justify-center">
                          <img
                            alt={product.alt}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                            src={product.img}
                          />
                        </div>
                        <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-semibold">
                          {product.brand}
                        </span>
                        <h2 className="font-headline-sm text-label-md text-on-surface font-bold line-clamp-2 mt-0.5 h-10">
                          {product.title}
                        </h2>
                        <div className="flex items-center gap-1 mt-1 text-secondary font-label-sm text-[11px]">
                          <span className="material-symbols-outlined text-[14px]">{product.subIcon}</span>
                          {product.subText}
                        </div>
                      </div>

                      <div className="mt-3 pt-2">
                        <div className="flex items-baseline gap-1.5 mb-2">
                          <span className="font-price-lg text-price-lg text-primary font-bold">
                            {product.priceStr}
                          </span>
                          {product.strikeStr && (
                            <span className="font-price-strike text-price-strike text-outline line-through">
                              {product.strikeStr}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 bg-surface-container-low rounded-lg p-1">
                          <button
                            type="button"
                            aria-label="Giảm"
                            onClick={() => updateQty(product.id, -1)}
                            className="w-7 h-7 rounded bg-surface-container-lowest text-on-surface-variant flex items-center justify-center hover:bg-primary-fixed hover:text-primary transition-colors active:scale-95 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="font-headline-sm text-label-md font-bold text-on-surface px-1">
                            {qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Tăng"
                            onClick={() => updateQty(product.id, 1)}
                            className="w-7 h-7 rounded bg-surface-container-lowest text-on-surface-variant flex items-center justify-center hover:bg-primary-fixed hover:text-primary transition-colors active:scale-95 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onAddToCart(product.price, qty)}
                            className="flex-1 h-7 bg-primary hover:bg-on-primary-container text-on-primary rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                            Thêm
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* 6. Special Kitchen Bundle */}
            <section className="mt-space-md w-full bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-primary-fixed/40 rounded-2xl p-5 sm:p-6 shadow-sm text-left">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative shrink-0">
                    <img
                      alt="Bộ Combo 5 Món Gia Vị Bếp Thiết Yếu"
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover bg-surface-container-low shadow-sm"
                      referrerPolicy="no-referrer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxBVskAN5tyFHKIWq3ABAuonCkSWYYAYy1CNorzfv2-WYZIcvCM2Qu9zf_FccywRW8RDjiYBI7_o7tPhVStc5E9zPd2uMBSOEYL_Nmx91usgyK18ndgr_KQ80LX14dJ42S_l9ASj81wozW-HD9_69m-jfrok8W7gR0qSrG9jHQ_9RA5DmY4EUVdcc8exkNpAg1fEdTy1ksDpn24Cy8LiQKm9jVlq2OEmrkYNnpyrjV"
                    />
                    <span className="absolute -top-2 -left-2 bg-primary text-on-primary text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                      Gói Bếp Chuẩn
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded font-bold">
                        Khuyên dùng cho gia đình
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">Giao nguyên kiện 1 lần</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Bộ Combo 5 Món Gia Vị Bếp Thiết Yếu
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                      Gồm đầy đủ: Nước mắm cốt cá cơm (1 chai) + Muối tinh I-ốt (1kg) + Dầu thực vật Simply (1L) + Nước tương Maggi (700ml) + Hạt nêm Knorr thịt thăn (900g).
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-price-lg text-price-lg text-primary font-bold text-[22px]">
                        175.000đ
                      </span>
                      <span className="font-price-strike text-price-strike text-outline line-through">
                        205.000đ
                      </span>
                      <span className="bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-bold px-2 py-0.5 rounded">
                        Tiết kiệm 30.000đ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => onAddToCart(175000, 1)}
                    className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-on-primary-container text-on-primary rounded-xl font-headline-sm text-headline-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    Mua Cả Combo 175.000đ
                  </button>
                </div>
              </div>
            </section>

            {/* 7. Pagination */}
            <nav
              aria-label="Phân trang sản phẩm"
              className="mt-space-lg flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest px-4 py-3 rounded-xl shadow-sm"
            >
              <span className="font-body-sm text-body-sm text-outline">
                Hiển thị trang <strong className="text-on-surface">{currentPage}</strong> trên{' '}
                <strong className="text-on-surface">{totalPages}</strong> (Tổng {totalProducts} sản phẩm)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Trang trước"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-9 h-9 rounded-lg bg-surface-container-low text-outline flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => {
                  const isActive = currentPage === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-lg font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary font-headline-sm font-bold shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-primary'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-label="Trang sau"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-9 h-9 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </nav>

            {/* Cooking Tip Micro Banner */}
            <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-3 text-left">
              <span className="material-symbols-outlined text-primary text-[28px]">lightbulb</span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-label-md text-on-surface font-bold">
                  Mẹo hay nhà bếp từ Tạp Hóa Số:
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Nên cho nước mắm cốt nguyên chất vào canh hoặc món kho sau khi tắt bếp để giữ nguyên độ đạm và mùi hương nồng đượm đặc trưng.
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
