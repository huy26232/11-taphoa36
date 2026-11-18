import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageId } from '../types';

interface MeatSeafoodPageProps {
  onNavigate: (page: PageId) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

type MeatCategoryId = 'pork' | 'beef' | 'poultry' | 'seafood' | 'eggs';
type PackSizeFilter = '300g' | '500g' | '1kg';
type BrandGroupId = 'cp' | 'meatdeli' | 'bahuan-sanha' | 'other';

const SUBCATEGORIES: Array<{
  id: 'all' | MeatCategoryId;
  icon: string;
  label: string;
  hasCount?: boolean;
  iconColor: string;
}> = [
  { id: 'all', icon: 'all_inclusive', label: 'Tất cả đồ tươi', hasCount: true, iconColor: '' },
  { id: 'pork', icon: 'restaurant', label: 'Thịt heo sạch CP & MeatDeli', iconColor: 'text-primary' },
  { id: 'beef', icon: 'lunch_dining', label: 'Thịt bò mềm & lẩu', iconColor: 'text-primary' },
  { id: 'poultry', icon: 'egg_alt', label: 'Thịt gà ta thả vườn & Vịt', iconColor: 'text-primary' },
  { id: 'seafood', icon: 'set_meal', label: 'Cá, Tôm & Thủy hải sản', iconColor: 'text-secondary' },
  { id: 'eggs', icon: 'egg', label: 'Trứng gia cầm sạch', iconColor: 'text-secondary' },
];

const PREP_OPTIONS = [
  'Cắt lát xào mềm',
  'Chặt khúc nấu canh',
  'Xay nhuyễn làm chả',
  'Lóc xương / Phi lê',
  'Để nguyên tảng',
];

const PACK_SIZES: PackSizeFilter[] = ['300g', '500g', '1kg'];

interface MeatProduct {
  id: string;
  category: MeatCategoryId;
  standardTags: number[];
  packTag: PackSizeFilter;
  brandTag: BrandGroupId;
  freshnessRank: number;
  image: string;
  topBadge: string;
  topBadgeClass: string;
  brand: string;
  brandClass: string;
  pack: string;
  title: string;
  note: string;
  price: number;
  priceFormatted: string;
  strikeFormatted: string;
  hasFriendlyCartBadge?: boolean;
}

const PRODUCTS: MeatProduct[] = [
  {
    id: 'p1',
    category: 'pork',
    standardTags: [0, 1, 2, 3],
    packTag: '300g',
    brandTag: 'cp',
    freshnessRank: 26,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCyfcpjdk6cKh4TpR386ZjfSyYLrxsQMKSkr_o_xmzWbSUr4KYHOgfHC8KQ-gSOkUby9HWJic7KfoMRs_x1D6dZTAIxcg31gubeYCEOuRvWZy-kxrOTUvQT7R3zf2rmPiMw1IHuGz8uC0f8ldcQTF9StUCsPgRlEKCdeFR8-opHTs52LrUyPjH2JHM4c_GVldCYGNQaorL_MuDK97lmdBY2g7SXmTRzpEQtOfMzI6wG',
    topBadge: 'Bán chạy nhất',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'CP Fresh',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 300g',
    title: 'Thịt nạc dăm heo tươi mềm CP chuẩn kiểm dịch',
    note: 'Không chất tạo nạc',
    price: 48500,
    priceFormatted: '48.500đ',
    strikeFormatted: '55.000đ',
  },
  {
    id: 'p2',
    category: 'pork',
    standardTags: [0, 1, 2, 3],
    packTag: '500g',
    brandTag: 'meatdeli',
    freshnessRank: 25,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDSVm4XxM8sxWHDrkt628cAyS-kT2WPYNs7PPiyGo30s3v_Iq8TGTqbk3UGuklSYK4ChOj7gwtFoVBItgubIbCvwRQyrcJy-aygic5KiC1vmmsW1UoQnJQcWJBp_AfYWw363lZyq80c-ltGfPeqpVk3cWyBZT5um0-ub2Tuj8FKxxM-W-T9WxQ_ctTzBSnR5RcRMlFztOw57H9JLiw61zE8zDfrJes2Z61tgfXsd4EY',
    topBadge: 'Thịt tươi sáng nay',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'MeatDeli',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 500g',
    title: 'Thịt ba rọi heo rút sườn hảo hạng giòn bì',
    note: 'Có mã QR tra cứu',
    price: 89000,
    priceFormatted: '89.000đ',
    strikeFormatted: '98.000đ',
  },
  {
    id: 'p3',
    category: 'pork',
    standardTags: [0, 1, 2],
    packTag: '500g',
    brandTag: 'cp',
    freshnessRank: 24,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2PEiJM8b-BoRE_TN3-ve6WhDwMgMxoxx0Z4PBzq3D59VpjdffQf5QdRdUVzbngyugFhjaynbhoVUx9W-eOYtay3752LaeV0S4XmagxDLEsMygbA0YcquiIapXJXMOTP4LmdKkhmy0hqF7DAQntQBtoZXkcfhxar93skVM-qCqW3zFepMYEC-Zy50uVlAGLo-YoxZ9d-qgTURSQ7JdImOyXEZA8wQ91fHhXALfxeiv',
    topBadge: '-12% Giảm',
    topBadgeClass: 'bg-primary-container text-on-primary',
    brand: 'CP Fresh',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 400g',
    title: 'Sườn non heo tươi sạch sụn non giòn ngọt',
    note: 'Hỗ trợ chặt khúc nấu canh',
    price: 79000,
    priceFormatted: '79.000đ',
    strikeFormatted: '90.000đ',
  },
  {
    id: 'p4',
    category: 'pork',
    standardTags: [0, 1, 3],
    packTag: '300g',
    brandTag: 'meatdeli',
    freshnessRank: 23,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCOwsB2GZiBZxnzlEKAZVIWo8uW3fyEeqKcfCrUTCiNqk8MTeEvIT6ajWKRHn9KGl_pqMhAphy7YTMLc6DkO4ku3R7Qncwi3Nx0WkVkokECFob0adH93M2IcEMiva8GjdpqGXS1b6ocFU0j_YUNrjEklOBFqRALmxr6v7xHnJxZxpO9LE4YCO1q6V4muOPIEONyL7bwLY9BwOHf6zgK6ex8YI_NxbfdoU0Q3PNM3fix',
    topBadge: 'Thịt tươi sáng nay',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'MeatDeli',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 300g',
    title: 'Thịt heo xay nạc đùi mềm nấu cháo, xào',
    note: 'Xay mới 5h sáng',
    price: 39000,
    priceFormatted: '39.000đ',
    strikeFormatted: '45.000đ',
  },
  {
    id: 'p5',
    category: 'eggs',
    standardTags: [0, 1, 2],
    packTag: '500g',
    brandTag: 'bahuan-sanha',
    freshnessRank: 22,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWLhIt_iGDuUTFhUHP8FCXVlcSCys4UmFxl5IQUQZ7hsIpCOGHqtMpbXhQpX239N7CxKFJrjoggprt5Z23X0xGDL6pEAFuXGJTTfZw4YfxmTBVA-Cp5CtycM0VcGPwI4tTXIj_qQYiLFbzPFmqxE2aDGDDo_ZYltQWJQ_eWZCbY2S7vFTkWSPPYb9_2-QZ7nItt9bE-8oVdn5p0S3GGaYHr_wIXn-m76d_M3XB7BwI',
    topBadge: 'Chuẩn VietGAP',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Ba Huân',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Hộp 10 trứng',
    title: 'Trứng gà ta chuồng hở VietGAP lòng đỏ cam đậm',
    note: 'Chiếu tia UV tiệt trùng',
    price: 32000,
    priceFormatted: '32.000đ',
    strikeFormatted: '36.000đ',
    hasFriendlyCartBadge: true,
  },
  {
    id: 'p6',
    category: 'beef',
    standardTags: [0, 1, 3],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 21,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBcReoYOwDeRePXxP7e9n8ZnNysjQoeY9Mn26ccvUb6_Ilz9GtQUtpLJY0l2uRRtKciQ7aNGXq4PY_tJ7H579-QzRsdlHLFtoRn5dpExB2EIA_0fS5l4HYsVOXHcgBv9RBucm-bip8MwNFZa9Ubjs5QjVNoBAlfq4_Q-T-C3IUxW6_C4XMNRpj3Dq7fM8nl2jXz3PerdEMIoeEOhUSJvQHJ0jx8Pks-BKn9Z-VSxxtL',
    topBadge: 'Chuyên lẩu / hầm',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'Bò Nhập Khẩu',
    brandClass: 'text-primary bg-primary-fixed',
    pack: 'Khay 300g',
    title: 'Bắp hoa bò Úc tươi mềm giòn gân thái lát lẩu',
    note: 'Thịt mềm ngọt tự nhiên',
    price: 75000,
    priceFormatted: '75.000đ',
    strikeFormatted: '85.000đ',
  },
  {
    id: 'p7',
    category: 'seafood',
    standardTags: [1, 2, 3],
    packTag: '500g',
    brandTag: 'other',
    freshnessRank: 20,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAXRhSbjY6C4NAYgYg8p57eIM3hbMC6_md6s1s-Zjme5ILjntGkGjcCNHyhxK-mJvf9S9mj3wbGndVUX_uezQ9cuPD1ABiR52mHyxory3CiPoALTEDGS75ZVVMBbqYZQEaE-_Ov6Dh0_53p71BQzlCXSXNXoNeBYxAUUh2LV9AptgKYomS6no4VDQ-L_C2fXXx1Gth29WmGCjw46Cy8jxN4Nh6v_gpuNU9qCB-jiuLj',
    topBadge: 'Không xương',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Thủy Sản Sạch',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 500g',
    title: 'Cá basa phi lê trắng sạch không xương tiện nấu',
    note: 'Thích hợp trẻ nhỏ, kho chiên',
    price: 42000,
    priceFormatted: '42.000đ',
    strikeFormatted: '48.000đ',
  },
  {
    id: 'p8',
    category: 'seafood',
    standardTags: [1, 2],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 19,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCwHu0ix3tRVaSx5b3KM0kef_fdUqte4DQswCocfRFRvlOy_qjDbZHZeI1CQlJ4nomHNkWTQ5Tv4NFH4ak4OaUM1CZ5bDs4e2h6rOxJ7PwoYPEb3GVdcwBGlDiyLk0p0hH1_OWIwcj-o022vn4b_hGE_bYqndY25vHw0Bey8775v0bxmFRl55ObdzdT4aOvi2Wzs4p0k3SgQFcuBeM3Zs97kvo95dBaZU-hxkjuQeS',
    topBadge: 'Tôm mới về',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'Hải Sản Biển',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 300g',
    title: 'Tôm thẻ chân trắng tươi sống ngọt thịt vỏ mỏng',
    note: 'Hỗ trợ cắt râu làm sạch',
    price: 58000,
    priceFormatted: '58.000đ',
    strikeFormatted: '65.000đ',
  },
  {
    id: 'p9',
    category: 'pork',
    standardTags: [0, 1, 2, 3],
    packTag: '500g',
    brandTag: 'cp',
    freshnessRank: 18,
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8781/226867/bhx/thit-dui-heo-tui-500g_202510221108282268.jpg',
    topBadge: 'Thịt tươi sáng nay',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'CP Fresh',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Túi 500g',
    title: 'Thịt đùi heo tươi sạch đóng túi 500g',
    note: 'Nạc đùi săn chắc ít mỡ',
    price: 69000,
    priceFormatted: '69.000đ',
    strikeFormatted: '76.000đ',
  },
  {
    id: 'p10',
    category: 'pork',
    standardTags: [0, 1, 2],
    packTag: '500g',
    brandTag: 'cp',
    freshnessRank: 17,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/226937/suon-cot-let-1kg_202607300940490633.jpg',
    topBadge: 'Bán chạy',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'CP Fresh',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 500g',
    title: 'Sườn cốt lết heo tươi sạch C.P khay 500g',
    note: 'Cắt lát vừa ăn rim nướng',
    price: 48400,
    priceFormatted: '48.400đ',
    strikeFormatted: '55.000đ',
  },
  {
    id: 'p11',
    category: 'pork',
    standardTags: [0, 1, 3],
    packTag: '500g',
    brandTag: 'other',
    freshnessRank: 16,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8791/337377/bhx/suon-cot-let-tam-uop-vi-nguyen-ban-g-kitchen-goi-400g_202506061507411657.jpg',
    topBadge: 'Chuẩn 3F Plus',
    topBadgeClass: 'bg-primary-container text-on-primary',
    brand: 'G.Kitchen',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Gói 400g',
    title: 'Sườn cốt lết tẩm ướp vị nguyên bản G Kitchen gói 400g',
    note: 'Hút chân không tiện chiên nướng',
    price: 92000,
    priceFormatted: '92.000đ',
    strikeFormatted: '102.000đ',
  },
  {
    id: 'p12',
    category: 'beef',
    standardTags: [0, 1, 3],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 15,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/8400/362174/loi-nac-vai-bo-my-an-gia-food-goi-300g_202611031103003113.jpg',
    topBadge: 'Bò Mỹ nhập khẩu',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'An Gia Food',
    brandClass: 'text-primary bg-primary-fixed',
    pack: 'Khay 300g',
    title: 'Lõi nạc vai bò Mỹ An Gia Food khay 300g',
    note: 'Vân mỡ đều làm steak, lẩu',
    price: 179000,
    priceFormatted: '179.000đ',
    strikeFormatted: '195.000đ',
  },
  {
    id: 'p13',
    category: 'beef',
    standardTags: [0, 1, 3],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 14,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/8400/320490/ba-chi-bo-uc-dong-lanh-mrt-khay-300g_202611041337469456.jpg',
    topBadge: 'Chuyên lẩu / BBQ',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'Mr.T Beef',
    brandClass: 'text-primary bg-primary-fixed',
    pack: 'Khay 300g',
    title: 'Ba chỉ bò Úc cắt lát lẩu nướng Mr.T khay 300g',
    note: 'Mềm béo vừa ăn nhúng lẩu',
    price: 142000,
    priceFormatted: '142.000đ',
    strikeFormatted: '158.000đ',
  },
  {
    id: 'p14',
    category: 'beef',
    standardTags: [0, 1],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 13,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/3/image/production/2026/3/image/Products/8139/364613/than-co-bo_202603201022194220.jpg',
    topBadge: 'Thịt bò tươi',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Bò Nhập Khẩu',
    brandClass: 'text-primary bg-primary-fixed',
    pack: 'Khay 300g',
    title: 'Thăn cổ bò tươi phi lê thái lát khay 300g',
    note: 'Mềm ngọt xào nhanh không dai',
    price: 67800,
    priceFormatted: '67.800đ',
    strikeFormatted: '75.000đ',
  },
  {
    id: 'p15',
    category: 'poultry',
    standardTags: [0, 1, 2],
    packTag: '500g',
    brandTag: 'cp',
    freshnessRank: 17,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/5/image/production/2026/5/image/Products/8790/226949/dui-ga-goc-tu-tui-500g_202605251510082050.jpg',
    topBadge: 'Gà tươi kiểm dịch',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'CP Fresh',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Túi 500g',
    title: 'Đùi gà góc tư làm sạch đóng túi 500g',
    note: 'Thịt dày chắc chiên nướng ngon',
    price: 49200,
    priceFormatted: '49.200đ',
    strikeFormatted: '55.000đ',
  },
  {
    id: 'p16',
    category: 'poultry',
    standardTags: [0, 1, 2, 3],
    packTag: '500g',
    brandTag: 'cp',
    freshnessRank: 18,
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8790/239600/bhx/uc-ga-tuoi-phi-le-khay-500g_202511041055113485.jpg',
    topBadge: 'Giàu đạm eat clean',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'CP Fresh',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 500g',
    title: 'Ức gà tươi phi lê không xương C.P khay 500g',
    note: 'Sơ chế sạch không da tiện nấu',
    price: 55800,
    priceFormatted: '55.800đ',
    strikeFormatted: '62.000đ',
  },
  {
    id: 'p17',
    category: 'poultry',
    standardTags: [0, 1, 2],
    packTag: '500g',
    brandTag: 'cp',
    freshnessRank: 16,
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8790/226883/bhx/ma-dui-ga-vi-500g_202511041054516000.jpg',
    topBadge: 'Tiết kiệm',
    topBadgeClass: 'bg-primary-container text-on-primary',
    brand: 'CP Fresh',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 500g',
    title: 'Má đùi gà tươi sạch C.P khay 500g',
    note: 'Thịt mềm ngọt dễ chế biến',
    price: 44400,
    priceFormatted: '44.400đ',
    strikeFormatted: '50.000đ',
  },
  {
    id: 'p18',
    category: 'poultry',
    standardTags: [0, 1, 2],
    packTag: '1kg',
    brandTag: 'other',
    freshnessRank: 15,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/5/image/production/2026/5/image/Products/8790/226874/canh-ga-1kg_202605251511496381.jpg',
    topBadge: 'Túi lớn 1kg',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'Gia Cầm Sạch',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Túi 1kg',
    title: 'Cánh gà tươi làm sạch đóng túi lớn 1kg',
    note: 'Da giòn chiên nước mắm tuyệt hảo',
    price: 98000,
    priceFormatted: '98.000đ',
    strikeFormatted: '112.000đ',
  },
  {
    id: 'p19',
    category: 'seafood',
    standardTags: [1, 2],
    packTag: '500g',
    brandTag: 'other',
    freshnessRank: 14,
    image:
      'https://img.onelife.vn/h5KUQ0D4P9BLPuDxbkLvajhoW3n1XzWvDEpazklPEbk/rs:fit:600:600:1/aHR0cHM6Ly9pbWcub25lbGlmZS52bi9CLVRCeVBMS1Bzc0RtOUo5dWF6dDlVeno4ZkpkSTZZZ3RDZWZjSmdTaUlrL3JzOmZpdDo2MDA6NjAwOjEvYUhSMGNITTZMeTl6ZEc5eVlXZGxMbWR2YjJkc1pXRndhWE11WTI5dEwzTmpYM0JqYlY5d2NtOWtkV04wTDNCeWIyUXZNakF5TXk4eE1DOHlOaTh4TlRVd01TMHpOamt4TXpNdWFuQm4ud2VicA.webp',
    topBadge: 'Size lớn 30-40 con',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'Hải Sản Biển',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Gói 500g',
    title: 'Tôm thẻ lớn (30-40 con/kg) tươi ngon gói 500g',
    note: 'Thịt chắc ngọt chuyên hấp nướng',
    price: 139500,
    priceFormatted: '139.500đ',
    strikeFormatted: '155.000đ',
  },
  {
    id: 'p20',
    category: 'seafood',
    standardTags: [1, 2],
    packTag: '500g',
    brandTag: 'other',
    freshnessRank: 13,
    image:
      'https://img.onelife.vn/wNxcrpc7V-QChZUkJ0Ue74-gxhNKPvMMIGfX3bTwyiM/rs:fit:600:600:1/aHR0cHM6Ly9pbWcub25lbGlmZS52bi9fcEFPNEdneXNQRXd1dWhnMS05cHVqUVdrb1NfLU5UTHA5SUZGYVJ1Q3hJL3JzOmZpdDo2MDA6NjAwOjEvYUhSMGNITTZMeTl6ZEc5eVlXZGxMbWR2YjJkc1pXRndhWE11WTI5dEwzTmpYM0JqYlY5d2NtOWtkV04wTDNCeWIyUXZNakF5Tmk4eE1DODVMemN6TnpZNE5pMHlNREkyTFRFd0xUQTVYekV5TGpBMkxqRTVMbmRsWW5BLndlYnA.webp',
    topBadge: 'Tôm sú quảng canh',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'Hải Sản Biển',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Túi 500g',
    title: 'Tôm sú quảng canh (20-25 con/kg) túi 500g',
    note: 'Con to chắc thịt đãi tiệc lẩu',
    price: 239000,
    priceFormatted: '239.000đ',
    strikeFormatted: '265.000đ',
  },
  {
    id: 'p21',
    category: 'seafood',
    standardTags: [1, 2, 3],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 15,
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8782/337912/bhx/ca-hoi-coho-phi-le-na-uy-150g_202507020853576777.jpg',
    topBadge: 'Giàu Omega-3',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Cá Hồi Na Uy',
    brandClass: 'text-primary bg-primary-fixed',
    pack: 'Khay 150g',
    title: 'Cá hồi Coho phi lê Na Uy khay 150g',
    note: 'Lọc xương sạch tiện áp chảo',
    price: 129000,
    priceFormatted: '129.000đ',
    strikeFormatted: '145.000đ',
  },
  {
    id: 'p22',
    category: 'seafood',
    standardTags: [1, 2],
    packTag: '500g',
    brandTag: 'other',
    freshnessRank: 12,
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8782/309438/bhx/ca-basa-khuc_202511251705532734.jpg',
    topBadge: 'Giá tiết kiệm',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Thủy Sản Sạch',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 500g',
    title: 'Cá basa cắt khúc tươi sạch đóng khay 500g',
    note: 'Làm sạch ruột kho tộ nấu canh',
    price: 35000,
    priceFormatted: '35.000đ',
    strikeFormatted: '42.000đ',
  },
  {
    id: 'p23',
    category: 'seafood',
    standardTags: [1, 2],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 11,
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8782/338274/bhx/ca-thu-cat-khuc_202505191028472512.jpg',
    topBadge: 'Cá biển ít xương',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Hải Sản Biển',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 300g',
    title: 'Cá thu cắt khúc dày thịt khay 300g',
    note: 'Cắt lát vừa chiên sốt cà chua',
    price: 53800,
    priceFormatted: '53.800đ',
    strikeFormatted: '62.000đ',
  },
  {
    id: 'p24',
    category: 'seafood',
    standardTags: [1, 3],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 10,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/8400/335959/muc-ong-nguyen-con-dong-lanh-ao-ao-goi-300g_202611031102242751.jpg',
    topBadge: 'Mực giòn ngọt',
    topBadgeClass: 'bg-primary text-on-primary',
    brand: 'Ào Ào Seafood',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Gói 300g',
    title: 'Mực ống nguyên con đông lạnh Ào Ào gói 300g',
    note: 'Cấp đông nhanh giữ trọn vị ngọt',
    price: 109000,
    priceFormatted: '109.000đ',
    strikeFormatted: '122.000đ',
  },
  {
    id: 'p25',
    category: 'seafood',
    standardTags: [1, 2],
    packTag: '1kg',
    brandTag: 'other',
    freshnessRank: 12,
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8782/258462/bhx/ngheu-song-1kg_202504132150277901.jpg',
    topBadge: 'Nghêu sống sạch cát',
    topBadgeClass: 'bg-secondary text-on-secondary',
    brand: 'Thủy Sản Sạch',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Túi 1kg',
    title: 'Nghêu sống tươi ngon đóng túi 1kg',
    note: 'Thịt ngọt thanh hấp sả nấu canh',
    price: 38000,
    priceFormatted: '38.000đ',
    strikeFormatted: '45.000đ',
  },
  {
    id: 'p26',
    category: 'seafood',
    standardTags: [1, 2, 3],
    packTag: '300g',
    brandTag: 'other',
    freshnessRank: 11,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/10/image/production/2026/10/image/Products/8782/341979/luon-lam-sach_202610021451340739.jpg',
    topBadge: 'Sơ chế sạch nhớt',
    topBadgeClass: 'bg-primary-container text-on-primary',
    brand: 'Thủy Sản Sạch',
    brandClass: 'text-secondary bg-secondary-fixed/30',
    pack: 'Khay 300g',
    title: 'Lươn làm sạch bỏ ruột khay 300g',
    note: 'Tiện lợi nấu cháo, xào lăn',
    price: 52000,
    priceFormatted: '52.000đ',
    strikeFormatted: '60.000đ',
  },
];

const INITIAL_STANDARDS = [true, true, false, false];
const INITIAL_BRANDS = [true, true, false];

const BRAND_FILTER_OPTIONS: Array<{ key: BrandGroupId; label: string }> = [
  { key: 'cp', label: 'CP Fresh Meat' },
  { key: 'meatdeli', label: 'MeatDeli Chuẩn Oxy' },
  { key: 'bahuan-sanha', label: 'Ba Huân & San Hà' },
];

interface MeatProductVariant {
  id: string;
  label: string;
  price: number;
  priceFormatted: string;
  strikeFormatted?: string;
  discountBadge?: string;
  unitPriceText: string;
}

function formatMeatPriceVnd(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

function parseMeatStrike(strike?: string): number | null {
  if (!strike) return null;
  const digits = Number(strike.replace(/[^\d]/g, ''));
  return Number.isFinite(digits) && digits > 0 ? digits : null;
}

function computeDiscountPct(price: number, strike: number | null): string | undefined {
  if (!strike || strike <= price) return undefined;
  const pct = Math.round(((strike - price) / strike) * 100);
  return pct > 0 ? `-${pct}%` : undefined;
}

function getMeatVariants(product: MeatProduct): MeatProductVariant[] {
  const packLower = product.pack.toLowerCase();
  const baseStrike = parseMeatStrike(product.strikeFormatted);
  const baseDiscount = computeDiscountPct(product.price, baseStrike);

  if (packLower.includes('trứng')) {
    const doublePrice = Math.round((product.price * 1.92) / 500) * 500;
    const doubleStrike = (baseStrike || product.price) * 2;
    return [
      {
        id: 'standard',
        label: product.pack,
        price: product.price,
        priceFormatted: product.priceFormatted,
        strikeFormatted: product.strikeFormatted,
        discountBadge: baseDiscount,
        unitPriceText: `${formatMeatPriceVnd(Math.round(product.price / 10))} / quả`,
      },
      {
        id: 'pack-2',
        label: 'Combo 2 hộp (20 trứng)',
        price: doublePrice,
        priceFormatted: formatMeatPriceVnd(doublePrice),
        strikeFormatted: formatMeatPriceVnd(doubleStrike),
        discountBadge: computeDiscountPct(doublePrice, doubleStrike),
        unitPriceText: `${formatMeatPriceVnd(Math.round(doublePrice / 20))} / quả`,
      },
    ];
  }

  if (packLower.includes('150g')) {
    const doublePrice = Math.round((product.price * 1.92) / 500) * 500;
    const doubleStrike = (baseStrike || product.price) * 2;
    return [
      {
        id: 'standard',
        label: product.pack,
        price: product.price,
        priceFormatted: product.priceFormatted,
        strikeFormatted: product.strikeFormatted,
        discountBadge: baseDiscount,
        unitPriceText: `${formatMeatPriceVnd(Math.round((product.price / 150) * 1000))} / kg`,
      },
      {
        id: 'pack-2',
        label: 'Combo 2 khay (300g)',
        price: doublePrice,
        priceFormatted: formatMeatPriceVnd(doublePrice),
        strikeFormatted: formatMeatPriceVnd(doubleStrike),
        discountBadge: computeDiscountPct(doublePrice, doubleStrike),
        unitPriceText: `${formatMeatPriceVnd(Math.round((doublePrice / 300) * 1000))} / kg`,
      },
    ];
  }

  if (packLower.includes('300g')) {
    const prefix = packLower.includes('gói') ? 'Gói' : 'Khay';
    const price500 = Math.round(((product.price / 300) * 500 * 0.96) / 500) * 500;
    const strike500 = Math.round((((baseStrike || product.price) / 300) * 500) / 500) * 500;
    const price1kg = Math.round(((product.price / 300) * 1000 * 0.92) / 1000) * 1000;
    const strike1kg = Math.round((((baseStrike || product.price) / 300) * 1000) / 1000) * 1000;
    return [
      {
        id: 'standard',
        label: product.pack,
        price: product.price,
        priceFormatted: product.priceFormatted,
        strikeFormatted: product.strikeFormatted,
        discountBadge: baseDiscount,
        unitPriceText: `${formatMeatPriceVnd(Math.round((product.price / 300) * 1000))} / kg`,
      },
      {
        id: '500g',
        label: `${prefix} 500g`,
        price: price500,
        priceFormatted: formatMeatPriceVnd(price500),
        strikeFormatted: formatMeatPriceVnd(strike500),
        discountBadge: computeDiscountPct(price500, strike500),
        unitPriceText: `${formatMeatPriceVnd(price500 * 2)} / kg`,
      },
      {
        id: '1kg',
        label: 'Túi gia đình 1kg',
        price: price1kg,
        priceFormatted: formatMeatPriceVnd(price1kg),
        strikeFormatted: formatMeatPriceVnd(strike1kg),
        discountBadge: computeDiscountPct(price1kg, strike1kg),
        unitPriceText: `${formatMeatPriceVnd(price1kg)} / kg`,
      },
    ];
  }

  if (packLower.includes('400g')) {
    const doublePrice = Math.round((product.price * 1.9) / 500) * 500;
    const doubleStrike = (baseStrike || product.price) * 2;
    return [
      {
        id: 'standard',
        label: product.pack,
        price: product.price,
        priceFormatted: product.priceFormatted,
        strikeFormatted: product.strikeFormatted,
        discountBadge: baseDiscount,
        unitPriceText: `${formatMeatPriceVnd(Math.round((product.price / 400) * 1000))} / kg`,
      },
      {
        id: 'pack-2',
        label: 'Combo 2 phần (800g)',
        price: doublePrice,
        priceFormatted: formatMeatPriceVnd(doublePrice),
        strikeFormatted: formatMeatPriceVnd(doubleStrike),
        discountBadge: computeDiscountPct(doublePrice, doubleStrike),
        unitPriceText: `${formatMeatPriceVnd(Math.round((doublePrice / 800) * 1000))} / kg`,
      },
    ];
  }

  if (packLower.includes('500g')) {
    const price1kg = Math.round((product.price * 1.92) / 500) * 500;
    const strike1kg = (baseStrike || product.price) * 2;
    return [
      {
        id: 'standard',
        label: product.pack,
        price: product.price,
        priceFormatted: product.priceFormatted,
        strikeFormatted: product.strikeFormatted,
        discountBadge: baseDiscount,
        unitPriceText: `${formatMeatPriceVnd(product.price * 2)} / kg`,
      },
      {
        id: '1kg',
        label: 'Túi tiết kiệm 1kg',
        price: price1kg,
        priceFormatted: formatMeatPriceVnd(price1kg),
        strikeFormatted: formatMeatPriceVnd(strike1kg),
        discountBadge: computeDiscountPct(price1kg, strike1kg),
        unitPriceText: `${formatMeatPriceVnd(price1kg)} / kg`,
      },
    ];
  }

  const price2kg = Math.round((product.price * 1.92) / 1000) * 1000;
  const strike2kg = (baseStrike || product.price) * 2;
  return [
    {
      id: 'standard',
      label: product.pack,
      price: product.price,
      priceFormatted: product.priceFormatted,
      strikeFormatted: product.strikeFormatted,
      discountBadge: baseDiscount,
      unitPriceText: `${product.priceFormatted} / kg`,
    },
    {
      id: '2kg',
      label: 'Combo gia đình 2kg',
      price: price2kg,
      priceFormatted: formatMeatPriceVnd(price2kg),
      strikeFormatted: formatMeatPriceVnd(strike2kg),
      discountBadge: computeDiscountPct(price2kg, strike2kg),
      unitPriceText: `${formatMeatPriceVnd(Math.round(price2kg / 2))} / kg`,
    },
  ];
}

export const MeatSeafoodPage: React.FC<MeatSeafoodPageProps> = ({ onNavigate, onAddToCart }) => {
  const [activeSubcat, setActiveSubcat] = useState<'all' | MeatCategoryId>('all');
  const [selectedPrep, setSelectedPrep] = useState('Cắt lát xào mềm');
  const [selectedPack, setSelectedPack] = useState<PackSizeFilter | ''>('300g');
  const [packApplied, setPackApplied] = useState(false);
  const [standards, setStandards] = useState<boolean[]>(INITIAL_STANDARDS);
  const [standardsApplied, setStandardsApplied] = useState(false);
  const [brands, setBrands] = useState<boolean[]>(INITIAL_BRANDS);
  const [brandsApplied, setBrandsApplied] = useState(false);
  const [priceRange, setPriceRange] = useState('mid');
  const [priceApplied, setPriceApplied] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    p1: 1,
    p2: 1,
    p3: 1,
    p4: 1,
    p5: 1,
    p6: 1,
    p7: 1,
    p8: 1,
  });
  const [addedId, setAddedId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('Bán chạy nhất (Hôm nay)');
  const [activePage, setActivePage] = useState(1);
  const productListTopRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<MeatProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('standard');
  const [detailQty, setDetailQty] = useState<number>(1);
  const [detailAdded, setDetailAdded] = useState<boolean>(false);

  const selectedProductVariants = useMemo(
    () => (selectedProduct ? getMeatVariants(selectedProduct) : []),
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

  const openProductDetail = (product: MeatProduct) => {
    const variants = getMeatVariants(product);
    setSelectedProduct(product);
    setSelectedVariantId(variants[0]?.id || 'standard');
    setDetailQty(quantities[product.id] || 1);
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

  const increment = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const decrement = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) - 1) }));
  };

  const toggleStandard = (idx: number) => {
    if (!standardsApplied) {
      setStandardsApplied(true);
      setStandards(INITIAL_STANDARDS.map((_, i) => i === idx));
    } else {
      setStandards((prev) => prev.map((v, i) => (i === idx ? !v : v)));
    }
    setActivePage(1);
  };

  const toggleBrand = (idx: number) => {
    if (!brandsApplied) {
      setBrandsApplied(true);
      setBrands(INITIAL_BRANDS.map((_, i) => i === idx));
    } else {
      setBrands((prev) => prev.map((v, i) => (i === idx ? !v : v)));
    }
    setActivePage(1);
  };

  const resetAllFilters = () => {
    setActiveSubcat('all');
    setStandards([false, false, false, false]);
    setStandardsApplied(false);
    setBrands([false, false, false]);
    setBrandsApplied(false);
    setPriceRange('');
    setPriceApplied(false);
    setSelectedPrep('Cắt lát xào mềm');
    setSelectedPack('');
    setPackApplied(false);
    setActivePage(1);
  };

  const handleAdd = (product: MeatProduct) => {
    const qty = quantities[product.id] || 1;
    onAddToCart(product.price, qty);
    setAddedId(product.id);
    window.setTimeout(() => {
      setAddedId((curr) => (curr === product.id ? null : curr));
    }, 1000);
  };

  const activeStandardIndices = standards
    .map((checked, idx) => (checked ? idx : -1))
    .filter((idx) => idx !== -1);

  const activeBrandKeys = BRAND_FILTER_OPTIONS.filter((_, idx) => brands[idx]).map((b) => b.key);

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeSubcat !== 'all' && product.category !== activeSubcat) {
      return false;
    }
    if (standardsApplied && activeStandardIndices.length > 0) {
      const matchesStandard = activeStandardIndices.some((idx) => product.standardTags.includes(idx));
      if (!matchesStandard) {
        return false;
      }
    }
    if (packApplied && product.packTag !== selectedPack) {
      return false;
    }
    if (priceApplied && priceRange) {
      if (priceRange === 'low' && product.price >= 50000) return false;
      if (priceRange === 'mid' && (product.price < 50000 || product.price > 100000)) return false;
      if (priceRange === 'high' && product.price <= 100000) return false;
    }
    if (brandsApplied && activeBrandKeys.length > 0 && !activeBrandKeys.includes(product.brandTag)) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Giá: Thấp đến Cao') return a.price - b.price;
    if (sortOption === 'Giá: Cao đến Thấp') return b.price - a.price;
    if (sortOption === 'Mới về sáng 4h30') return b.freshnessRank - a.freshnessRank;
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
      {/* Top Navigation & Breadcrumbs */}
      <section className="max-w-7xl mx-auto px-margin-desktop w-full pt-space-md pb-space-sm">
        <div className="flex flex-wrap items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Trang chủ
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Danh mục sản phẩm
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-primary font-semibold">Thịt, Cá, Trứng &amp; Hải Sản Tươi Sống</span>
        </div>
      </section>

      {/* Editorial Category Hero Banner */}
      <section className="max-w-7xl mx-auto px-margin-desktop w-full pb-space-lg">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-fixed via-surface-container-low to-secondary-fixed/20 p-space-lg md:p-space-xl shadow-sm">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center relative z-10">
            <div className="lg:col-span-8 flex flex-col gap-space-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full uppercase tracking-wider font-bold inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">ac_unit</span> Giữ mát 0°C - 4°C
                </span>
                <span className="bg-secondary text-on-secondary font-label-sm text-label-sm px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Kiểm dịch thú y 100%
                </span>
                <span className="bg-surface-container-lowest text-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold shadow-xs">
                  Mổ sớm 4:30 sáng
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">
                Thịt Sạch Mỗi Ngày – Giữ Lạnh Chuẩn 0°C Tới Bếp Nhà Bạn
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                Tuyển chọn trực tiếp từ các trại đạt chuẩn VietGAP &amp; đối tác MeatDeli, CP. Hút chân không vô
                trùng, vận chuyển bằng thùng giữ nhiệt đá khô, giữ trọn độ mọng nước chỉ sau 30-45 phút giao hàng.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs">
                <div className="flex items-center gap-2.5 bg-surface-container-lowest/80 backdrop-blur-xs p-2.5 rounded-lg shadow-xs">
                  <span className="material-symbols-outlined text-secondary text-[24px]">thermostat</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Chuỗi lạnh 0 - 4°C</span>
                    <span className="font-label-sm text-label-sm text-outline">Đá gel đóng khay kín</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-surface-container-lowest/80 backdrop-blur-xs p-2.5 rounded-lg shadow-xs">
                  <span className="material-symbols-outlined text-primary text-[24px]">qr_code_scanner</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Tem mã QR tra cứu</span>
                    <span className="font-label-sm text-label-sm text-outline">Rõ trang trại &amp; lô giết mổ</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-surface-container-lowest/80 backdrop-blur-xs p-2.5 rounded-lg shadow-xs">
                  <span className="material-symbols-outlined text-secondary text-[24px]">timer</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Giao nhanh 30-45p</span>
                    <span className="font-label-sm text-label-sm text-outline">Không ươn hỏng, 1 đổi 1</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 relative flex justify-center">
              <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden shadow-md">
                <img
                  alt="Thịt cá tươi sống chuẩn lạnh"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIqJb25MLBTp2pLVdBt5M--iqpaUdVCKUV3bkz1fvmou6H8EFuV-cIo7PMpt-PhNgHKGkyheoGMeow0KydE-tEFVww6TBJKj6BGE6V38nZglJLZn7x5GKDhHWupIQr7AXYFLHJhfDexR_GuoFLj00xWOHMPfGWeI_wtktlzcLGX_xjH7BVpPkEkJOCcSRoVS2JjRiAttd40IZcZk5NvnqhO2-4nyzBUCWyrMY44l6A"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                  <span className="font-label-md text-label-md font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px]">verified_user</span>{' '}
                    Cam kết không chất bảo quản
                  </span>
                  <span className="font-label-sm text-label-sm bg-primary/80 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    Sáng nay
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Subcategory Navigator Bar */}
      <section className="max-w-7xl mx-auto px-margin-desktop w-full pb-space-lg">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUBCATEGORIES.map((tab) => {
            const isActive = activeSubcat === tab.id;
            const tabCount =
              tab.id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveSubcat(tab.id);
                  setActivePage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md shrink-0 transition-all shadow-xs cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold active:scale-95'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-primary-fixed'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isActive ? '' : tab.iconColor}`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.hasCount && (
                  <span className="bg-primary-container text-on-primary text-[10px] px-1.5 py-0.5 rounded-full">
                    {tabCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Layout Grid: Filter Sidebar + Product Grid */}
      <section className="max-w-7xl mx-auto px-margin-desktop w-full pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Filter Sidebar Column */}
          <aside className="lg:col-span-3 flex flex-col gap-space-md">
            <div className="bg-secondary-fixed/25 rounded-xl p-space-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary font-bold">Thùng giữ lạnh tại chỗ</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Túi xốp bạc + đá khô tiêu chuẩn</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Bộ lọc tuyển chọn</span>
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                >
                  Đặt lại
                </button>
              </div>

              {/* Section 1: Clean Standards */}
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Tiêu Chuẩn Thịt Sạch
                </span>
                <div className="flex flex-col gap-2">
                  {[
                    'Không chất tạo nạc / Tăng trọng',
                    'Tem truy xuất nguồn gốc QR',
                    'Đạt chuẩn VietGAP / GlobalGAP',
                    'Hút chân không màng vô trùng',
                  ].map((label, idx) => (
                    <label
                      key={label}
                      className="flex items-center gap-2 cursor-pointer font-body-md text-body-md text-on-surface-variant hover:text-primary"
                    >
                      <input
                        checked={standards[idx]}
                        onChange={() => toggleStandard(idx)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        type="checkbox"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 2: Prep Options */}
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Yêu Cầu Sơ Chế Miễn Phí
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PREP_OPTIONS.map((prep) => (
                    <button
                      key={prep}
                      type="button"
                      onClick={() => setSelectedPrep(prep)}
                      className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm cursor-pointer transition-colors ${
                        selectedPrep === prep
                          ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-medium'
                      }`}
                    >
                      {prep}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 3: Pack Size */}
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Quy Cách Đóng Khay
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PACK_SIZES.map((pack) => (
                    <button
                      key={pack}
                      type="button"
                      onClick={() => {
                        if (packApplied && selectedPack === pack) {
                          setPackApplied(false);
                          setSelectedPack('');
                        } else {
                          setSelectedPack(pack);
                          setPackApplied(true);
                        }
                        setActivePage(1);
                      }}
                      className={`py-1.5 rounded-lg font-label-md text-label-md text-center cursor-pointer transition-colors ${
                        selectedPack === pack
                          ? 'bg-primary text-on-primary font-semibold shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {pack}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 4: Price Range */}
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Mức Giá Mua
                </span>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'low', label: 'Dưới 50.000đ (Bữa ăn tiết kiệm)' },
                    { value: 'mid', label: '50.000đ – 100.000đ (Bình ổn)' },
                    { value: 'high', label: 'Trên 100.000đ (Gia đình / Lẩu tiệc)' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer font-body-md text-body-md text-on-surface-variant hover:text-primary"
                    >
                      <input
                        checked={priceRange === opt.value}
                        onChange={() => {
                          setPriceRange(opt.value);
                          setPriceApplied(true);
                          setActivePage(1);
                        }}
                        className="w-4 h-4 text-primary accent-primary"
                        name="price"
                        type="radio"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 5: Brand Filter */}
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Thương Hiệu Cung Cấp
                </span>
                <div className="flex flex-col gap-2">
                  {BRAND_FILTER_OPTIONS.map((b, idx) => {
                    const count = PRODUCTS.filter((p) => p.brandTag === b.key).length;
                    return (
                      <label
                        key={b.label}
                        className="flex items-center justify-between cursor-pointer font-body-md text-body-md text-on-surface-variant hover:text-primary"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            checked={brands[idx]}
                            onChange={() => toggleBrand(idx)}
                            className="w-4 h-4 rounded text-primary accent-primary"
                            type="checkbox"
                          />
                          <span>{b.label}</span>
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">{count} sp</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Butcher Tip Card */}
            <div className="bg-surface-container-high rounded-xl p-space-md flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                <span className="font-label-md text-label-md uppercase">Mẹo Tạp Hóa Số</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Thịt nhận về chưa dùng ngay nên giữ nguyên khay hút chân không và để ngăn mát 0-4°C dùng trong 3 ngày,
                hoặc bảo quản tủ đông tối đa 3 tháng để thịt luôn ngọt nước.
              </p>
            </div>
          </aside>

          {/* Main Product Grid Section */}
          <div ref={productListTopRef} className="lg:col-span-9 flex flex-col gap-space-lg scroll-mt-40">
            {/* Header Toolbar & Sorting */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Sản phẩm thịt cá tươi mỗi ngày
                </span>
                <span className="font-body-sm text-body-sm text-outline">
                  (Hiển thị {displayedProducts.length}/{totalProducts} món tươi chuẩn mát sáng nay)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md text-on-surface-variant">Sắp xếp:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setActivePage(1);
                  }}
                  className="bg-surface-container-low font-label-md text-label-md text-on-surface px-3 py-1.5 rounded-lg focus:outline-none focus:bg-surface-container-lowest"
                >
                  <option>Bán chạy nhất (Hôm nay)</option>
                  <option>Mới về sáng 4h30</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>

            {/* Product Cards Shelf Grid */}
            {displayedProducts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center shadow-xs flex flex-col items-center gap-space-sm">
                <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer hover:bg-on-primary-container transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative"
                >
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
                    className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm cursor-pointer"
                  >
                    <img
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={product.image}
                    />
                    <span
                      className={`absolute top-2 left-2 font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold shadow-xs ${product.topBadgeClass}`}
                    >
                      {product.topBadge}
                    </span>
                    {product.hasFriendlyCartBadge ? (
                      <span className="absolute bottom-2 left-2 bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold shadow-xs">
                        Vỉ giấy thân thiện
                      </span>
                    ) : (
                      <span className="absolute bottom-2 left-2 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold backdrop-blur-xs flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">ac_unit</span> 0-4°C
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`font-label-sm text-label-sm font-semibold px-1.5 py-0.5 rounded ${product.brandClass}`}>
                        {product.brand}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">{product.pack}</span>
                    </div>
                    <h3
                      role="button"
                      tabIndex={0}
                      onClick={() => openProductDetail(product)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openProductDetail(product);
                        }
                      }}
                      className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                    >
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-outline font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span>
                      <span>{product.note}</span>
                    </div>
                  </div>
                  <div className="mt-space-sm pt-space-xs flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <span className="font-price-lg text-price-lg text-primary font-bold">{product.priceFormatted}</span>
                      <span className="font-price-strike text-price-strike text-outline line-through">
                        {product.strikeFormatted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1">
                        <button
                          type="button"
                          onClick={() => decrement(product.id)}
                          className="w-6 h-6 flex items-center justify-center text-on-surface hover:text-primary active:scale-90 font-bold cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-label-md text-label-md font-bold text-on-surface">
                          {quantities[product.id] || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => increment(product.id)}
                          className="w-6 h-6 flex items-center justify-center text-on-surface hover:text-primary active:scale-90 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        className={`flex-1 py-1.5 px-2 rounded-full font-label-md text-label-md flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer ${
                          addedId === product.id
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-primary text-on-primary hover:bg-primary-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {addedId === product.id ? 'check' : 'add_shopping_cart'}
                        </span>
                        <span className="hidden sm:inline">{addedId === product.id ? 'Đã thêm' : 'Thêm'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Custom Butcher Service Callout Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-container via-surface-container-lowest to-primary-fixed p-space-lg shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[30px]">content_cut</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full w-max font-bold mb-1">
                      Độc quyền tại Tạp Hóa Số
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Dịch Vụ Sơ Chế Miễn Phí Tại Tiệm – Như Mua Tại Quầy Phố Quen
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Chỉ cần để lại ghi chú đơn hàng:{' '}
                      <strong className="text-primary font-semibold">
                        &quot;Chặt sườn khúc nhỏ&quot;, &quot;Cắt lát thịt xào mỏng&quot;, &quot;Lóc xương cá
                        basa&quot;
                      </strong>{' '}
                      – Cô bán hàng sẽ trực tiếp sơ chế sạch sẽ trước khi đóng gói gửi bạn.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-primary text-on-primary hover:bg-on-primary-container px-6 py-2.5 rounded-full font-label-md text-label-md font-bold whitespace-nowrap shadow-sm transition-transform active:scale-95 shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  Ghi chú khi đặt hàng
                </button>
              </div>
            </div>

            {/* Pagination Bar */}
            <nav
              aria-label="Phân trang sản phẩm"
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-wrap items-center justify-between gap-space-md"
            >
              <span className="font-body-sm text-body-sm text-outline">
                Hiển thị <span className="font-semibold text-on-surface">{startDisplay} – {endDisplay}</span> trên tổng số{' '}
                <span className="font-semibold text-on-surface">{totalProducts}</span> sản phẩm tươi sống
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Trang trước"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-8 h-8 rounded-lg bg-surface-container-low text-outline flex items-center justify-center hover:bg-primary-fixed hover:text-primary transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
                      className={`w-8 h-8 rounded-lg font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary font-bold shadow-xs'
                          : 'bg-surface-container-low hover:bg-primary-fixed text-on-surface'
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
                  className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-primary-fixed text-on-surface flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* Product Detail View Modal */}
      {selectedProduct && activeVariant && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="meat-detail-title"
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

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-7">
              {/* Left Side: Product Visual */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-low shadow-sm">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold shadow-xs ${selectedProduct.topBadgeClass}`}
                  >
                    {selectedProduct.topBadge}
                  </span>
                  {selectedProduct.hasFriendlyCartBadge ? (
                    <span className="absolute bottom-3 left-3 bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold shadow-xs">
                      Vỉ giấy thân thiện
                    </span>
                  ) : (
                    <span className="absolute bottom-3 left-3 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold backdrop-blur-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">ac_unit</span> Bảo quản mát 0-4°C
                    </span>
                  )}
                </div>

                <div className="bg-secondary-fixed/25 text-on-secondary-fixed-variant rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">verified</span>
                  <span>Thịt cá kiểm dịch 100% • Đóng thùng giữ lạnh giao 30-45 phút.</span>
                </div>
              </div>

              {/* Right Side: Information, Variants, Price, Quantity & MUA */}
              <div className="md:col-span-7 flex flex-col justify-between gap-5 pr-2">
                <div className="flex flex-col gap-4">
                  {/* Brand & Title */}
                  <div className="flex flex-col gap-1.5 pr-8">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded ${selectedProduct.brandClass}`}
                      >
                        {selectedProduct.brand}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span>
                        {selectedProduct.note}
                      </span>
                    </div>
                    <h2
                      id="meat-detail-title"
                      className="font-headline-md sm:font-headline-lg text-on-surface font-bold leading-snug"
                    >
                      {selectedProduct.title}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Hỗ trợ sơ chế theo yêu cầu: <strong className="text-primary">{selectedPrep}</strong>
                    </p>
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-surface-container-low/70 rounded-xl p-4 flex flex-col gap-1.5 border border-outline-variant/25">
                    <div className="flex items-baseline flex-wrap gap-2.5">
                      <span className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                        {activeVariant.priceFormatted}
                      </span>
                      {activeVariant.strikeFormatted && (
                        <span className="text-sm text-outline line-through">{activeVariant.strikeFormatted}</span>
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

                  {/* Packaging / Weight Selector */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-md text-label-md text-on-surface">
                      Chọn quy cách / trọng lượng đóng khay:
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
                            <span className="font-body-sm text-body-sm text-outline">({variant.priceFormatted})</span>
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
                        : `MUA • ${formatMeatPriceVnd(activeVariant.price * detailQty)}`}
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
