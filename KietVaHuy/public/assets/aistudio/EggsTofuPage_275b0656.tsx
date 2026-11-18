import React, { useRef, useState } from 'react';
import { PageId } from '../types';

interface EggsTofuPageProps {
  onNavigate: (page: PageId) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

type EggsTofuCategoryId = 'chicken' | 'duck-quail' | 'tofu' | 'salted';

interface EggTofuBadge {
  text: string;
  cls: string;
  icon?: string;
}

interface EggTofuProduct {
  id: string;
  cardKey: string;
  category: EggsTofuCategoryId;
  filterTags: number[];
  freshnessRank: number;
  badges: EggTofuBadge[];
  img: string;
  alt: string;
  brand: string;
  title: string;
  packText: string;
  price: number;
  priceStr: string;
  strikeStr?: string;
  hasQtyStepper?: boolean;
}

const SUBCATEGORIES: Array<{ id: 'all' | EggsTofuCategoryId; label: string }> = [
  { id: 'all', label: '🥚 Tất cả danh mục' },
  { id: 'chicken', label: '🐔 Trứng gà ta & Trứng công nghiệp' },
  { id: 'duck-quail', label: '🦆 Trứng vịt & Trứng cút lộn' },
  { id: 'tofu', label: '🥢 Đậu hũ trắng & Đậu chiên nóng' },
  { id: 'salted', label: '🥣 Trứng muối & Trứng bắc thảo' },
];

const PRODUCTS: EggTofuProduct[] = [
  {
    id: 'c1',
    cardKey: 'c1',
    category: 'chicken',
    filterTags: [0, 1, 4, 7],
    freshnessRank: 18,
    badges: [
      {
        text: 'Hay mua nhất',
        cls: 'px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs',
      },
      {
        text: 'Date: Sáng nay 04:30',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] font-bold',
      },
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh-POpgcK--q1vM2fN6iwmRHWCGBm4Ym3DwJjJ5qwIFX6tAmfIsIc3jIbHE2-LVFB26qw4b5JMp1utsTMyMzByVkmePKCQi5T5xJ74VSVhn45msYa13M5CNFfa3QUroaPa_gEMCRNiAp8olIEt7H1HpKr702M7xPKLhvqR1y4VRmTHp4e-a-tEobwpCR9TIUK1w_ob9QwTomfBPcYeGJuMKgu6CkClITh4QYThpkUG',
    alt: 'Trứng gà Ba Huân sạch vỉ 10 quả',
    brand: 'Ba Huân Clean Egg',
    title: 'Trứng gà Ba Huân sạch vỉ 10 quả',
    packText: 'Vỉ 10 quả (~600g)',
    price: 32000,
    priceStr: '32.000đ',
    strikeStr: '36.000đ',
    hasQtyStepper: true,
  },
  {
    id: 'c2',
    cardKey: 'c2',
    category: 'chicken',
    filterTags: [0, 1, 2, 3, 4, 8, 10],
    freshnessRank: 17,
    badges: [
      {
        text: 'Thảo mộc',
        icon: 'eco',
        cls: 'px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold shadow-xs flex items-center gap-0.5',
      },
      {
        text: 'Lòng đỏ đậm cam',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] font-bold',
      },
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGLdZ9ma9Mq6YtFP6xqmuavD-QLgxukU7FDLRdVzAk7qkONvyOw4d6Nl5SmWfoTo2Wqdwv1-u3Fskd56Ys7HY7iR-QfW45gk-ibxTfLqzM04BMozTKaJXNGdGz3G4Jaa_MWyohTAe6S5DgPTtADDQLERFaFgPV84xkqv838hJBBMoTBxY28I-hHB1SLRmYhJTZ_Er5hXv5GPQM7jiBPSliSGIFFjrkOZGKjIBfOQ3U',
    alt: 'Trứng gà ta thảo mộc khay giấy 6 quả',
    brand: 'Trang Trại Xanh Organic',
    title: 'Trứng gà ta thảo mộc khay giấy 6 quả',
    packText: 'Khay giấy 6 quả (~330g)',
    price: 28000,
    priceStr: '28.000đ',
    strikeStr: '31.000đ',
  },
  {
    id: 'c3',
    cardKey: 'c3',
    category: 'duck-quail',
    filterTags: [0, 1, 6, 7],
    freshnessRank: 16,
    badges: [
      {
        text: 'Loại 1 quả to 70g+',
        cls: 'px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-bold shadow-xs',
      },
      {
        text: 'Date: Hôm nay',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] font-bold',
      },
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEpq-Bha58h9dzxvhBflK56Due7CjN-YFhpzqvg82LsLgoSH5fsRgLM5dHaYCVZqlVgVjMdoJ3_67DEMebL2bGNkMnbYOQ09PU5CcdCQGK2xVrZuejYEItIOaeOFu7K_Om3EFGlYcwyzaNslmKr4kwOzpBZp8x29obKfonjZeMAR0fQEclhqSKDqdfdRMDhS44E2Wzogm6bF4PbX8733cnnsxJgTX_aAeAuaDxPkwQ',
    alt: 'Trứng vịt tươi loại 1 quả to vỉ 10 quả',
    brand: 'Đồng Tháp Mười',
    title: 'Trứng vịt tươi loại 1 quả to vỉ 10 quả',
    packText: 'Vỉ 10 quả (~720g)',
    price: 36000,
    priceStr: '36.000đ',
  },
  {
    id: 'c4',
    cardKey: 'c4',
    category: 'duck-quail',
    filterTags: [0, 1, 9],
    freshnessRank: 15,
    badges: [
      {
        text: 'Tiết kiệm 15%',
        cls: 'px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold shadow-xs',
      },
      {
        text: 'Vỉ 30 quả',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] font-bold',
      },
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1BtcuXPgwEutaK36iIlvcDgCxEqZNvZUfPp7TGBboVUS4oqaHt2pJwkZozkbECWfXfH6oFYWuDHFUZrOiYba4TEmow91HjDlE_5ZfqClIE-TkG-Hq0ctQobKRac6S2U0_TUMfXYxdDjD5fBzODRD0gvTl4VK4O027WGAKqTMAlEc4aEplE623A2gIbAkX1MHWvN9GVjbWHKRppVCpmG_G18XkJwhY4N4-4re8j0HI',
    alt: 'Trứng cút tươi sạch đóng vỉ 30 quả',
    brand: 'Việt Cút Farm',
    title: 'Trứng cút tươi sạch đóng vỉ 30 quả',
    packText: 'Vỉ 30 quả (~350g)',
    price: 22000,
    priceStr: '22.000đ',
    strikeStr: '25.000đ',
  },
  {
    id: 'c5',
    cardKey: 'c5',
    category: 'tofu',
    filterTags: [11],
    freshnessRank: 14,
    badges: [
      {
        text: 'Nấu lẩu / Canh',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shadow-xs',
      },
      {
        text: 'Chuẩn Nhật Bản',
        cls: 'px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] font-bold',
      },
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9h9AcV3AY9_dB409NrXKrs1AsaUDV0nVwqoNvKcUR-8dynfaTWc7HhV8dhP_fcJxW7wMb91xJjGDS4mRnkwkR3Rli8qcbOVs1rpGcABcrg41g8vkGd_roUwI6Pqpi2UHOpJyY1Wez1BOGX_dYhc9S8UCgAyeLrRnBx5ES-bmHiYbBaZid8UQ8S8MZcYefZP_QzNCErRGn0f2vK8AZYbO18Ui3gkaCrgN2yT3HkrPu',
    alt: 'Đậu hũ non Silken Tofu Ichiban 300g',
    brand: 'Ichiban Japan',
    title: 'Đậu hũ non Silken Tofu Ichiban 300g',
    packText: 'Hộp kín 300g',
    price: 14000,
    priceStr: '14.000đ',
  },
  {
    id: 'c6',
    cardKey: 'c6',
    category: 'tofu',
    filterTags: [12],
    freshnessRank: 16,
    badges: [
      {
        text: 'Mới ra lò 05h',
        cls: 'px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold shadow-xs',
      },
      {
        text: 'Không thạch cao 100%',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] font-bold',
      },
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp-7zxgfeu2RPe_959EUwPpxr9NMZPfTg1kRI1GHYANKtfK5zM2AuJgRyEzVPAhWaGjHvfDbhVLoO-WO2qm2_R8i-CIfSjHLFe-LHo14_1IKKxNJxTXF4HqM7FOOZvGK6yu0TQiwFeJZE21_W_3kh_zbTAlgQ5xTDeai4e6N1WZAc1Zsry_cL3xikBHci_RAN_Y680LXBUB_UNhlEDmihm_f7CwPa6ypXEGjyWUmo4',
    alt: 'Đậu hũ trắng nóng hổi (2 miếng lớn)',
    brand: 'Đậu Hũ Làng Mơ',
    title: 'Đậu hũ trắng nóng hổi (2 miếng lớn)',
    packText: '2 miếng (~450g)',
    price: 10000,
    priceStr: '10.000đ',
  },
  {
    id: 'c7',
    cardKey: 'c7',
    category: 'tofu',
    filterTags: [12],
    freshnessRank: 15,
    badges: [
      {
        text: 'Chiên dầu mới',
        cls: 'px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold shadow-xs',
      },
      {
        text: 'Giòn da vàng ươm',
        cls: 'px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] font-bold',
      },
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn65yeBKLsbyEFvPhjJB_W1KhKHqCRRtY5e6rdD2vuMRhbxBJpMDnoTlt3OMMV8PiEi8kQLhD-DD8IAR-cABGRIZQnriHb0ZMoexiClcI40MNMU_Oy186h5T0IIsN_-oxX1EI-2lLAFvevKaBXAuJZf5DSbtcWx0ETOEN0raW4ohiOxLOF1_Ux_MCiaX-Fd5E_5k3mDa6Pq1VNbHhVQthCP_vHE7TaR7fMlbPQ0ceA',
    alt: 'Đậu hũ chiên sẵn giòn da khay 4 miếng',
    brand: 'Bếp Tạp Hóa Số',
    title: 'Đậu hũ chiên sẵn giòn da khay 4 miếng',
    packText: 'Khay 4 miếng (~400g)',
    price: 12000,
    priceStr: '12.000đ',
  },
  {
    id: 'c8',
    cardKey: 'c8',
    category: 'salted',
    filterTags: [0, 6, 8],
    freshnessRank: 12,
    badges: [
      {
        text: 'Ủ trấu truyền thống',
        cls: 'px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold shadow-xs',
      },
      {
        text: 'Lòng đỏ dẻo dầu',
        cls: 'px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] font-bold',
      },
    ],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtbjzDvq0ubVza-iLvyfHN-jwmkoqhw8rZFrDy4xsrZ3Dbmaf53kdQSXApOOkLeIYZl1EGrSyeUYf2kJ9DEJAzsLA6cmlEHqMoUwAduHig3Q4rP38JXfNTRU1LYdW5lkvCkdlMEZQNxq33DKp35p6WxGbsdMRbp_38T5SdFDKy3RAkwp1ZZulfYHgySglbyOVGOfkHT8hIyRbHj3_Ruuo77wuyV9ovPVO77WLLcE9',
    alt: 'Trứng vịt muối lòng đỏ dẻo khay 4 quả',
    brand: 'Đặc Sản Ba Đồn',
    title: 'Trứng vịt muối lòng đỏ dẻo khay 4 quả',
    packText: 'Khay 4 quả (~280g)',
    price: 26000,
    priceStr: '26.000đ',
  },
  {
    id: 'c9',
    cardKey: 'c9',
    category: 'chicken',
    filterTags: [0, 1, 4, 7],
    freshnessRank: 17,
    badges: [
      {
        text: 'Hộp 10 quả',
        cls: 'px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/8783/228775/hop-10-trung-ga-tuoi-tfood_202610311443464472.jpg',
    alt: 'Hộp 10 trứng gà tươi T.Food',
    brand: 'T.Food',
    title: 'Hộp 10 trứng gà tươi T.Food',
    packText: 'Hộp 10 quả (~550g)',
    price: 28000,
    priceStr: '28.000đ',
  },
  {
    id: 'c10',
    cardKey: 'c10',
    category: 'chicken',
    filterTags: [0, 1, 3, 4, 8, 10],
    freshnessRank: 16,
    badges: [
      {
        text: 'Gà ta vỏ hồng',
        icon: 'eco',
        cls: 'px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold shadow-xs flex items-center gap-0.5',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8783/311111/bhx/trung-ga-ta-hop-6-qua_202509301124032388.jpg',
    alt: 'Trứng gà ta hộp 6 quả',
    brand: 'Trang Trại Việt',
    title: 'Trứng gà ta hộp 6 quả',
    packText: 'Hộp 6 quả (~210g)',
    price: 27000,
    priceStr: '27.000đ',
  },
  {
    id: 'c11',
    cardKey: 'c11',
    category: 'duck-quail',
    filterTags: [0, 1, 6, 7],
    freshnessRank: 15,
    badges: [
      {
        text: 'Quả to đều',
        cls: 'px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8783/311102/bhx/trung-vit-hop-10-qua_202509301122002833.jpg',
    alt: 'Trứng vịt hộp 10 quả',
    brand: 'Nông Sản Sạch',
    title: 'Trứng vịt hộp 10 quả',
    packText: 'Hộp 10 quả (~650g)',
    price: 38000,
    priceStr: '38.000đ',
  },
  {
    id: 'c12',
    cardKey: 'c12',
    category: 'salted',
    filterTags: [0, 6, 8],
    freshnessRank: 11,
    badges: [
      {
        text: 'Chín sẵn ăn ngay',
        cls: 'px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8783/311103/bhx/trung-vit-bac-thao-hop-4-qua_202509301122330423.jpg',
    alt: 'Trứng vịt bắc thảo hộp 4 quả',
    brand: 'Vương Ngọc Bích',
    title: 'Trứng vịt bắc thảo hộp 4 quả',
    packText: 'Hộp 4 quả (~280g)',
    price: 26000,
    priceStr: '26.000đ',
  },
  {
    id: 'c13',
    cardKey: 'c13',
    category: 'tofu',
    filterTags: [1, 11],
    freshnessRank: 14,
    badges: [
      {
        text: 'Công nghệ Nhật',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7461/342380/bhx/dau-hu-trang-fuji-san-ichiban-cay-220g_202508131126162223.jpg',
    alt: 'Đậu hũ trắng Fuji San Ichiban cây 220g',
    brand: 'Ichiban Japan',
    title: 'Đậu hũ trắng Fuji San Ichiban cây 220g',
    packText: 'Cây 220g',
    price: 10000,
    priceStr: '10.000đ',
  },
  {
    id: 'c14',
    cardKey: 'c14',
    category: 'tofu',
    filterTags: [1, 11],
    freshnessRank: 13,
    badges: [
      {
        text: 'Mềm mịn lụa',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7461/220429/bhx/frame-55-2-1_202410112031096454.png',
    alt: 'Tàu hũ trắng non Ichi Sakura hộp 350g',
    brand: 'Ichi Sakura',
    title: 'Tàu hũ trắng non Ichi Sakura hộp 350g',
    packText: 'Hộp 350g',
    price: 12200,
    priceStr: '12.200đ',
  },
  {
    id: 'c15',
    cardKey: 'c15',
    category: 'tofu',
    filterTags: [1, 13],
    freshnessRank: 13,
    badges: [
      {
        text: 'Đậu hũ trứng',
        cls: 'px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/7459/200179/dau-hu-trung-vi-nguyen-cay-220g_202611031103312600.jpg',
    alt: 'Đậu hũ trứng Vị Nguyên cây 220g',
    brand: 'Vị Nguyên',
    title: 'Đậu hũ trứng Vị Nguyên cây 220g',
    packText: 'Cây 220g',
    price: 15700,
    priceStr: '15.700đ',
  },
  {
    id: 'c16',
    cardKey: 'c16',
    category: 'tofu',
    filterTags: [1],
    freshnessRank: 12,
    badges: [
      {
        text: 'Gói lớn 500g',
        cls: 'px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7461/218083/bhx/frame-110-1-1_202410112017318979.jpg',
    alt: 'Tàu hũ chiên Ichi Sakura gói 500g',
    brand: 'Ichi Sakura',
    title: 'Tàu hũ chiên Ichi Sakura gói 500g',
    packText: 'Gói 500g',
    price: 28500,
    priceStr: '28.500đ',
  },
  {
    id: 'c17',
    cardKey: 'c17',
    category: 'tofu',
    filterTags: [1, 2],
    freshnessRank: 10,
    badges: [
      {
        text: 'Thuần chay 100%',
        cls: 'px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/7082/5367209/tau-hu-ky-la-an-nhien-goi-100g_202611031601044802.jpg',
    alt: 'Tàu hũ ky lá An Nhiên gói 100g',
    brand: 'An Nhiên',
    title: 'Tàu hũ ky lá An Nhiên gói 100g',
    packText: 'Gói 100g',
    price: 47500,
    priceStr: '47.500đ',
  },
  {
    id: 'c18',
    cardKey: 'c18',
    category: 'tofu',
    filterTags: [1],
    freshnessRank: 11,
    badges: [
      {
        text: 'Ít đường tốt dáng',
        cls: 'px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold shadow-xs',
      },
    ],
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/2943/203663/loc-6-hop-sua-dau-nanh-fami-nguyen-chat-it-duong-200ml_202608211313100120.jpg',
    alt: 'Lốc 6 hộp sữa đậu nành nguyên chất ít đường Fami 200ml',
    brand: 'Fami (Vinasoy)',
    title: 'Lốc 6 hộp sữa đậu nành nguyên chất ít đường Fami 200ml',
    packText: 'Lốc 6 hộp x 200ml',
    price: 29500,
    priceStr: '29.500đ',
  },
];

const INITIAL_FILTERS = [true, true, false, true, true, false, false, true, false, false, false, true, true, false];

export const EggsTofuPage: React.FC<EggsTofuPageProps> = ({ onNavigate, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'all' | EggsTofuCategoryId>('all');
  const [filters, setFilters] = useState<boolean[]>(INITIAL_FILTERS);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [card1Qty, setCard1Qty] = useState(1);
  const [addedCardId, setAddedCardId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [sortOption, setSortOption] = useState('Bán chạy & Đánh giá cao');
  const [activePage, setActivePage] = useState(1);
  const productListTopRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (index: number) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setFilters(INITIAL_FILTERS.map((_, i) => i === index));
    } else {
      setFilters((prev) => prev.map((v, i) => (i === index ? !v : v)));
    }
    setActivePage(1);
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS.map(() => false));
    setFiltersApplied(false);
    setActiveTab('all');
    setActivePage(1);
  };

  const handleAddCard = (id: string, price: number) => {
    onAddToCart(price, 1);
    setAddedCardId(id);
    window.setTimeout(() => {
      setAddedCardId((curr) => (curr === id ? null : curr));
    }, 1200);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeFilterIndices = filters
    .map((checked, idx) => (checked ? idx : -1))
    .filter((idx) => idx !== -1);

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeTab !== 'all' && product.category !== activeTab) {
      return false;
    }
    if (filtersApplied && activeFilterIndices.length > 0) {
      const matchesAny = activeFilterIndices.some((idx) => product.filterTags.includes(idx));
      if (!matchesAny) {
        return false;
      }
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Giá: Thấp đến Cao') return a.price - b.price;
    if (sortOption === 'Giá: Cao đến Thấp') return b.price - a.price;
    if (sortOption === 'Mới thu hoạch hôm nay') return b.freshnessRank - a.freshnessRank;
    return 0;
  });

  const ITEMS_PER_PAGE = 8;
  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, activePage), totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedProducts = sortedProducts.slice(startIndex, endIndex);
  const startDisplay = totalProducts === 0 ? 0 : startIndex + 1;
  const endDisplay = totalProducts === 0 ? 0 : startIndex + displayedProducts.length;

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
      {/* BREADCRUMB & CONTEXT ROW */}
      <div className="max-w-7xl mx-auto w-full px-margin-desktop py-space-sm">
        <nav className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant overflow-x-auto whitespace-nowrap">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Trang chủ
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Danh mục thường mua
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span className="text-primary font-bold">Trứng &amp; Đậu Hũ</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span> 18 Sản phẩm tươi sáng nay
          </span>
        </nav>
      </div>

      {/* HERO BANNER (Asymmetric Bento Header) */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop mb-space-lg">
        <div className="bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container rounded-2xl shadow-sm p-space-lg md:p-space-xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
          <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-secondary-fixed/30 blur-xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center relative z-10">
            {/* Text & Badges */}
            <div className="lg:col-span-8 flex flex-col gap-space-sm text-left">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bolt
                  </span>{' '}
                  Date mới hôm nay (Lô 05:00 sáng)
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span> Chuồng hở chuẩn kiểm
                  dịch 100%
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
                  Đổi trả tại chỗ nếu dập nứt
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight mt-1">
                Trứng Tươi Mỗi Ngày &amp; Đậu Hũ Nóng Mới Ra Lò
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                Cam kết từng quả trứng được soi chiếu đèn quang, không nứt vỡ, nguyên vẹn phấn vỏ tự nhiên. Đậu hũ
                làng nghề thủ công đúc mới mỗi 5:00 sáng từ 100% hạt đậu nành thuần chủng, tuyệt đối không thạch cao
                công nghiệp.
              </p>
              <div className="flex flex-wrap items-center gap-space-lg pt-space-xs text-on-surface">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">health_and_safety</span>
                  <span className="font-label-md text-label-md">Kiểm dịch Thú Y đạt 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">drive_file_rename_outline</span>
                  <span className="font-label-md text-label-md">Đậu nóng ấm tay khi giao</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">local_shipping</span>
                  <span className="font-label-md text-label-md">Hộp chống sốc chuyên dụng</span>
                </div>
              </div>
            </div>

            {/* Mini Widget Bảo Quản & Cam Kết 1 Đổi 1 */}
            <div className="lg:col-span-4">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-space-md shadow-md flex flex-col gap-space-sm text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                    <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                      Kho Lạnh Tạp Hóa Số
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                    Cập nhật 10p trước
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-low p-space-sm rounded-lg">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">ac_unit</span>
                    </div>
                    <div>
                      <div className="font-label-sm text-label-sm text-outline">Nhiệt độ quầy mát</div>
                      <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        4°C - 8°C Chuẩn GAP
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center justify-end gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Ổn định
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">Độ ẩm 75%</span>
                  </div>
                </div>
                <div className="flex items-start gap-space-sm bg-primary-fixed/40 p-space-sm rounded-lg">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <div className="font-label-md text-label-md text-on-primary-fixed-variant font-bold">
                      Cam kết 1 Đổi 1 Tận Cửa
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Bất kỳ quả trứng vỡ dập hoặc chua hỏng, shipper hoàn tiền/đổi mới trong 30 phút mà không cần trả
                      hàng.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HORIZONTAL PILL SUB-CATEGORIES */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop mb-space-lg">
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
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
                className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                  isActive
                    ? 'font-bold bg-primary text-on-primary'
                    : 'font-semibold bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-label-sm px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-primary-container text-on-primary font-bold' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* MAIN CATALOG CONTENT (Split Sidebar Filter + 4-Column Product Shelf) */}
      <div className="max-w-7xl mx-auto w-full px-margin-desktop mb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT SIDEBAR FILTER */}
          <aside className="lg:col-span-3 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-lg text-left">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/40">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Bộ Lọc Tươi Sạch</h2>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-label-sm text-label-sm text-primary hover:underline font-semibold cursor-pointer"
                  id="reset-filter-btn"
                >
                  Thiết lập lại
                </button>
              </div>

              {/* Group 1: Tiêu chuẩn an toàn */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">shield</span>
                  Tiêu Chuẩn An Toàn
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {[
                    { idx: 0, label: 'Kiểm dịch thú y 100%' },
                    { idx: 1, label: 'Chuẩn VietGAP' },
                    { idx: 2, label: 'Hữu cơ Organic' },
                  ].map((item) => {
                    const count = PRODUCTS.filter((p) => p.filterTags.includes(item.idx)).length;
                    return (
                      <label key={item.idx} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          checked={filters[item.idx]}
                          onChange={() => toggleFilter(item.idx)}
                          className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
                          type="checkbox"
                        />
                        <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors flex-1">
                          {item.label}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: Phân loại trứng */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">egg</span>
                  Loại Trứng
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {[
                    { idx: 3, label: 'Gà ta thả vườn' },
                    { idx: 4, label: 'Gà lòng đỏ đậm' },
                    { idx: 5, label: 'Trứng gà ác nhỏ' },
                    { idx: 6, label: 'Vịt đồng quả to' },
                  ].map((item) => {
                    const count = PRODUCTS.filter((p) => p.filterTags.includes(item.idx)).length;
                    return (
                      <label key={item.idx} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          checked={filters[item.idx]}
                          onChange={() => toggleFilter(item.idx)}
                          className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
                          type="checkbox"
                        />
                        <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors flex-1">
                          {item.label}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Group 3: Quy cách đóng gói */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-outline text-[16px]">inventory_2</span>
                  Đóng Gói Tiện Lợi
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {[
                    { idx: 7, label: 'Vỉ 10 quả phổ thông' },
                    { idx: 8, label: 'Khay 4 - 6 quả tiện dụng' },
                    { idx: 9, label: 'Vỉ 30 quả tiết kiệm' },
                    { idx: 10, label: 'Khay giấy bã mía Eco' },
                  ].map((item) => {
                    const count = PRODUCTS.filter((p) => p.filterTags.includes(item.idx)).length;
                    return (
                      <label key={item.idx} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          checked={filters[item.idx]}
                          onChange={() => toggleFilter(item.idx)}
                          className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
                          type="checkbox"
                        />
                        <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors flex-1">
                          {item.label}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Group 4: Loại đậu hũ */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">soup_kitchen</span>
                  Chủng Loại Đậu Hũ
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {[
                    { idx: 11, label: 'Đậu hũ non Nhật Bản' },
                    { idx: 12, label: 'Đậu hũ làng Mơ truyền thống' },
                    { idx: 13, label: 'Đậu hũ trứng gà mềm béo' },
                  ].map((item) => {
                    const count = PRODUCTS.filter((p) => p.filterTags.includes(item.idx)).length;
                    return (
                      <label key={item.idx} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          checked={filters[item.idx]}
                          onChange={() => toggleFilter(item.idx)}
                          className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
                          type="checkbox"
                        />
                        <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors flex-1">
                          {item.label}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Promo Banner in Sidebar */}
              <div className="rounded-xl bg-gradient-to-br from-primary-fixed to-primary-container/30 p-space-sm flex flex-col gap-1 text-on-surface">
                <div className="flex items-center gap-1 font-label-md text-label-md text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified</span> Combo Nấu Canh Tiết Kiệm
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Mua 1 Vỉ Trứng + 2 Đậu Hũ Non giảm ngay 5.000đ khi thanh toán.
                </p>
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT GRID */}
          <div ref={productListTopRef} className="lg:col-span-9 flex flex-col gap-space-md scroll-mt-40">
            {/* Shelf Header Bar */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm px-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Sản phẩm tuyển chọn</span>
                <span className="font-body-sm text-body-sm text-outline">
                  (Hiển thị {displayedProducts.length}/{totalProducts} món có sẵn)
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="font-label-sm text-label-sm text-outline whitespace-nowrap">Sắp xếp:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setActivePage(1);
                  }}
                  className="bg-surface-container-low text-on-surface font-label-md text-label-md py-1.5 px-3 rounded-full focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border-none"
                >
                  <option>Bán chạy &amp; Đánh giá cao</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                  <option>Mới thu hoạch hôm nay</option>
                </select>
              </div>
            </div>

            {/* 4-COLUMN PRODUCT SHELF */}
            {displayedProducts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-sm flex flex-col items-center gap-space-sm">
                <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer hover:bg-on-primary-container transition-colors"
                >
                  Thiết lập lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-space-md">
                {displayedProducts.map((product) => {
                  const isFav = Boolean(favorites[product.cardKey]);
                  const isAdded = addedCardId === product.cardKey;
                  return (
                    <div
                      key={product.id}
                      className="bg-surface-container-lowest rounded-2xl p-space-sm flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group"
                    >
                      <div>
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {product.badges.map((badge) => (
                            <span key={badge.text} className={badge.cls}>
                              {badge.icon && (
                                <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                              )}
                              {badge.icon ? ` ${badge.text}` : badge.text}
                            </span>
                          ))}
                        </div>
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            type="button"
                            onClick={() => toggleFavorite(product.cardKey)}
                            className={`w-7 h-7 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer ${
                              isFav ? 'text-primary' : 'text-outline hover:text-primary'
                            }`}
                          >
                            <span
                              className="material-symbols-outlined text-[16px]"
                              style={isFav ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                              favorite
                            </span>
                          </button>
                        </div>
                        <div className="relative w-full aspect-square rounded-xl bg-surface-container-low overflow-hidden mb-space-sm flex items-center justify-center">
                          <img
                            alt={product.alt}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            src={product.img}
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                            {product.brand}
                          </span>
                          <h3 className="font-headline-sm text-label-md text-on-surface font-bold line-clamp-2 mt-0.5">
                            {product.title}
                          </h3>
                          <span className="font-body-sm text-body-sm text-outline mt-0.5">{product.packText}</span>
                        </div>
                      </div>
                      <div className="mt-space-sm pt-space-xs border-t border-surface-container/60 text-left">
                        <div className="flex items-baseline gap-1.5 mb-2">
                          <span className="font-price-lg text-price-lg text-primary font-extrabold">
                            {product.priceStr}
                          </span>
                          {product.strikeStr && (
                            <span className="font-price-strike text-price-strike text-outline line-through">
                              {product.strikeStr}
                            </span>
                          )}
                        </div>
                        {product.hasQtyStepper ? (
                          <div className="flex items-center justify-between gap-1 w-full bg-surface-container-low rounded-full p-1">
                            <button
                              type="button"
                              onClick={() => setCard1Qty((q) => Math.max(1, q - 1))}
                              className="w-7 h-7 rounded-full bg-surface-container-lowest text-primary hover:bg-primary-fixed flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px] font-bold">remove</span>
                            </button>
                            <span className="font-label-md text-label-md text-on-surface font-bold">{card1Qty}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setCard1Qty((q) => q + 1);
                                onAddToCart(product.price, 1);
                              }}
                              className="w-7 h-7 rounded-full bg-primary text-on-primary hover:bg-on-primary-container flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddCard(product.cardKey, product.price)}
                            className={`w-full py-1.5 px-3 rounded-full font-label-md text-label-md font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
                              isAdded
                                ? 'bg-secondary text-on-secondary'
                                : 'bg-primary-fixed hover:bg-primary text-on-primary-fixed-variant hover:text-on-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isAdded ? 'check' : 'shopping_cart'}
                            </span>
                            {isAdded ? 'Đã thêm' : 'Thêm vào giỏ'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION SECTION */}
            <nav
              aria-label="Phân trang sản phẩm"
              className="flex flex-col sm:flex-row items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm mt-space-sm"
            >
              <div className="font-body-sm text-body-sm text-on-surface-variant text-left">
                Đang xem <strong className="text-primary font-bold">{startDisplay} - {endDisplay}</strong> trong tổng số{' '}
                <strong className="text-on-surface font-bold">{totalProducts}</strong> sản phẩm tươi mới
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Trang trước"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-9 h-9 rounded-full bg-surface-container-low text-outline flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => {
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-full font-label-md text-label-md font-bold flex items-center justify-center transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-primary'
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
                  className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-primary-fixed hover:text-primary transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* BANNER GỢI Ý TIỆN ÍCH / NỘI TRỢ BỎ TÚI */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop mb-space-xl">
        <div className="bg-gradient-to-r from-surface-container via-surface-container-low to-primary-fixed/40 rounded-3xl p-space-lg md:p-space-xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg">
            {/* Left content */}
            <div className="flex-1 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold mb-2">
                <span className="material-symbols-outlined text-[16px]">menu_book</span> Sổ Tay Nấu Nướng Tạp Hóa Số
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                Mẹo luộc trứng lòng đào dẻo quánh &amp; bảo quản đậu hũ tươi 3 ngày
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
                Nấu nước sôi già cùng 1 thìa giấm, hạ trứng nhẹ nhàng canh đúng 6 phút 30 giây rồi ngâm đá lạnh. Đậu hũ
                mua về chần sơ nước sôi pha chút muối hạt, bảo quản ngập nước sạch trong ngăn mát thay nước mỗi ngày.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mt-space-md">
                <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-xl p-space-sm flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">timer</span>
                  </div>
                  <div className="text-left">
                    <div className="font-label-md text-label-md text-on-surface font-bold">Lòng đào béo dẻo: 6:30 phút</div>
                    <div className="font-body-sm text-body-sm text-outline">Vỏ róc tróc, không tanh, cắt đôi sánh mịn</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-xl p-space-sm flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  </div>
                  <div className="text-left">
                    <div className="font-label-md text-label-md text-on-surface font-bold">Đậu hũ ngâm nước muối mát</div>
                    <div className="font-body-sm text-body-sm text-outline">Giữ vị thơm béo 72 giờ không bị chua</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Graphic / SVG Clock Guide */}
            <div className="w-full md:w-72 shrink-0 bg-surface-container-lowest rounded-2xl p-space-md shadow-md text-center flex flex-col items-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  ></path>
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="75, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  ></path>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-price-lg text-price-lg text-primary font-bold">6.5</span>
                  <span className="font-label-sm text-[10px] text-outline uppercase font-semibold">Phút</span>
                </div>
              </div>
              <span className="font-label-md text-label-md text-on-surface font-bold mt-2">
                Trứng Lòng Đào Chuẩn Quán
              </span>
              <span className="font-body-sm text-body-sm text-outline mt-0.5">Nhiệt độ sôi 100°C</span>
              <button
                type="button"
                className="mt-space-sm w-full py-1.5 rounded-full bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold transition-colors cursor-pointer"
              >
                Xem toàn bộ 12 công thức
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
