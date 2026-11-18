import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageId } from '../types';

interface FreshProducePageProps {
  onNavigate: (page: PageId) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

type ProduceCategory = 'leafy' | 'roots' | 'herbs' | 'fruits';
type ProduceCert = 'vietgap' | 'organic' | 'dalatgap';
type ProducePack = '300-500g' | '1-2kg' | 'tray';
type ProduceConv = 'prewashed' | 'peeled' | 'hotpot';

const ITEMS_PER_PAGE = 8;

const PRICE_BTNS = ['Dưới 15.000đ', '15k - 30.000đ', 'Trên 30.000đ'];

interface ProduceItem {
  id: string;
  image: string;
  topBadgeIcon?: string;
  topBadgeText: string;
  topBadgeClass: string;
  bottomBadgeText?: string;
  bottomBadgeClass?: string;
  originIcon: string;
  originText: string;
  originClass: string;
  title: string;
  subtitle: string;
  price: number;
  priceFormatted: string;
  strikeFormatted?: string;
  discountBadge?: string;
  unitSuffix?: string;
  rightMeta?: string;
  rightMetaClass?: string;
  category: ProduceCategory;
  certs: ProduceCert[];
  packs: ProducePack[];
  convs: ProduceConv[];
  popularity: number;
}

const PRODUCE_ITEMS: ProduceItem[] = [
  {
    id: 'p1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCoJKxekx_aBEndO2oTDtzlyfjwtrRdrRb6ZXUgg0Bnc_f2xxaN8IzTuovjTPBpvwo_0r7UPFlKdNJqk0TEuJMbKmzmGr_ZmJ8353xBG5wdEuJJH_6rEU3AN3BjXSUC3f65H4Kxon7ug1y4bGhEDKscUf8oZ97YNpXmoOJWDlBaPbkVVqo7WgoLwPxeYOWkGMqNO_Qz4xaN5JxiCrEAMaZGVMMyxuSxK-punopc7eq2',
    topBadgeIcon: 'schedule',
    topBadgeText: 'Hái 5h sáng',
    topBadgeClass: 'bg-secondary text-on-secondary font-semibold shadow-sm',
    bottomBadgeText: 'Mua nhiều nhất xóm',
    bottomBadgeClass: 'bg-primary text-on-primary font-bold shadow-sm',
    originIcon: 'eco',
    originText: 'Hữu cơ chứng nhận',
    originClass: 'text-secondary',
    title: 'Rau muống nước hữu cơ búp non tươi sạch 500g',
    subtitle: 'Bó 500g • Vừa đủ 1 đĩa xào',
    price: 12000,
    priceFormatted: '12.000đ',
    strikeFormatted: '15.000đ',
    discountBadge: '-20%',
    category: 'leafy',
    certs: ['organic', 'vietgap'],
    packs: ['300-500g'],
    convs: ['prewashed', 'hotpot'],
    popularity: 100,
  },
  {
    id: 'p2',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjp4osoP_A-vWqc8XYAiqp2i1SGc0yThGHF0pZYxA9o2UQH4OS9BCZ2k-9PX3g26z6l0Nd7KrzCqvgoAf-0x_TFnIVCr2hsOh79M6KBgIrrnZC-z64PRc4aNpjr2x85ozsa8BlARjjzpQFzj3FlAWAvG_NGxOjqI12K6M-xzF0i3VmLqw2ZIIG_BF-ynQjqkTeuog4ZZkcz95T34opoK5IlEfCAsy2sDmPbVMdwg3y',
    topBadgeIcon: 'verified',
    topBadgeText: 'VietGAP',
    topBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant font-bold',
    bottomBadgeText: 'Tươi non mới về',
    bottomBadgeClass: 'bg-secondary text-on-secondary font-bold',
    originIcon: 'park',
    originText: 'Trồng nhà màng',
    originClass: 'text-secondary',
    title: 'Rau mồng tơi VietGAP sạch bóng búp mập 500g',
    subtitle: 'Bó 500g • Nấu canh cua ngọt mát',
    price: 11500,
    priceFormatted: '11.500đ',
    rightMeta: 'Tiêu chuẩn loại 1',
    rightMetaClass: 'text-outline',
    category: 'leafy',
    certs: ['vietgap'],
    packs: ['300-500g'],
    convs: ['prewashed'],
    popularity: 95,
  },
  {
    id: 'p3',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3EOtMfMbiWduQMZsvY-23j0wIMvEPj0t30LIDhIgLwF59T1eJECpN_FygELKEIIhGtfq_NLgxonuaLjytlWvS4BNtw6dziUzVKo549TKigwevYc3oaB9GuZqnuO8eL-xlC_BSGePa5gFVLX6TqATJ-qTxfNu1KJSxeAvAmcHyCwiF15oTkFPYHshYvvXaZOBSysu7rlO8Np0Ek2VP4JpNwksDU4x2gsD0OO2ez5Aj',
    topBadgeIcon: 'eco',
    topBadgeText: 'Dalat GAP',
    topBadgeClass: 'bg-surface-container-lowest text-primary font-bold shadow-sm',
    originIcon: 'wb_sunny',
    originText: 'Giòn ngọt dày cơm',
    originClass: 'text-primary',
    title: 'Cà chua beef Đà Lạt mọng nước loại 1 khay 500g',
    subtitle: 'Túi 500g (3-4 quả to tròn)',
    price: 18000,
    priceFormatted: '18.000đ',
    strikeFormatted: '22.000đ',
    discountBadge: '-18%',
    category: 'roots',
    certs: ['dalatgap'],
    packs: ['300-500g', 'tray'],
    convs: ['hotpot'],
    popularity: 92,
  },
  {
    id: 'p4',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC9dl-1XASYbtlHmFZiYBAh3xjRoJilOhPeOaNCMLfKJG1G9Q7dY0uOJJTUZoURnv5UAml5dwiCK0zEs2Xjmp_S72hPDcYecai2RzG7ytAlK5PgzIBhQkBEsI8SWUq9rg7rXpP2sV_GCg2T9quAKXIC09FzCEXaYK50W3Yl266ARO-9EczPzjevVKvZqVR9HPVKYpasrNp7QQ1uRMBk4dtOWFUhzR1zuyPJRFQGZAWJ',
    topBadgeIcon: 'done',
    topBadgeText: 'Ăn sống trực tiếp',
    topBadgeClass: 'bg-secondary text-on-secondary font-semibold shadow-sm',
    originIcon: 'check_circle',
    originText: 'Không đắng chát',
    originClass: 'text-secondary',
    title: 'Dưa leo baby giòn mát khay 500g tươi giòn',
    subtitle: 'Khay 500g • Thích hợp ăn kèm, salad',
    price: 16000,
    priceFormatted: '16.000đ',
    rightMeta: 'Giá bình ổn',
    rightMetaClass: 'text-outline',
    category: 'roots',
    certs: ['vietgap'],
    packs: ['300-500g', 'tray'],
    convs: [],
    popularity: 88,
  },
  {
    id: 'p5',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKhkwMfoMZBR9L4nPicFMuSblFPs1LqDV1tiLA0p-SQ2CE51e8J7zhDxCwh9EUrVqKTXT949vdMGwUUSZ60eDThxhOUSRs0z1WQrz3O20tPui7Rj_j1l8BgtS9e4Cv8GGf9abJA2C-ytgI22b82A6lXgYFuFDRNBuFNC3-CwjRz3DW8mdk2FkqeBHQgK1rZqDRaTUylJn7tQ2wCXdtf2WDjqlvjJxFEF5hV46E8EPI',
    topBadgeText: 'Búp cuốn chặt',
    topBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant font-bold',
    originIcon: 'verified',
    originText: 'Chuẩn VietGAP',
    originClass: 'text-secondary',
    title: 'Bắp cải thảo VietGAP ngọt mát nấu canh, xào thịt',
    subtitle: 'Tính theo kg • Củ khoảng 1kg - 1.2kg',
    price: 22000,
    priceFormatted: '22.000đ',
    unitSuffix: '/ kg',
    rightMeta: 'Cắt cuống sạch',
    rightMetaClass: 'text-outline',
    category: 'leafy',
    certs: ['vietgap'],
    packs: ['1-2kg'],
    convs: ['hotpot'],
    popularity: 85,
  },
  {
    id: 'p6',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAicAw9jcsF2r9HkV80ona0o7xw9o0ZoAgnYAd1-Cc1d3jW-nXetFB1FQxtlO8cao2w0kW8bCr71D2R3efVSp9pkAj-3XEQZAXgGhU0rKw2qdnxz8_VztnaGkwnNzPzVPcIB3t1gd765HDbUnAd10QJ2heNtThXK9LlMpKM4GIbrGZfzaqWY2-opIhz1TCzZTMybvCgGdgZUiXFcp3VPOICXL9oJFSNmBncHDSit_78',
    topBadgeText: 'Không chất tẩy',
    topBadgeClass: 'bg-primary-fixed text-on-primary-fixed-variant font-bold',
    originIcon: 'local_florist',
    originText: 'Vị ngọt đậm',
    originClass: 'text-primary',
    title: 'Cà rốt Đà Lạt củ tươi chắc nịch nguyên cuống 500g',
    subtitle: 'Túi 500g • Củ vừa đều tay',
    price: 19000,
    priceFormatted: '19.000đ',
    rightMeta: 'Chuẩn gốc',
    rightMetaClass: 'text-secondary bg-secondary-fixed/40 px-1.5 py-0.5 rounded font-bold',
    category: 'roots',
    certs: ['dalatgap'],
    packs: ['300-500g'],
    convs: ['peeled'],
    popularity: 90,
  },
  {
    id: 'p7',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Ln63oyK6-GQOzypyizeFPHN-p53jkWy2BLtt4nxqcIEVD3BETfAUJE_2ED6iR1qvNEZqYh54zJtQszmDM5nrV_hSDl6PVxSlPFNj5I1bwycLJ3m_cOuSR9p0nMK-WzkJFzugleGimFwNS80hCnIkngh7eWAhAPikdSj6HAU4wnCYZoyj47_82yWX4xZciymqpnOnGqiRBhxaWqnHlT4E6mWb0Hc7ukHf22Jiqc0c',
    topBadgeText: 'Vắt nhiều nước',
    topBadgeClass: 'bg-secondary text-on-secondary font-semibold shadow-sm',
    originIcon: 'water_drop',
    originText: 'Vườn miền Tây',
    originClass: 'text-secondary',
    title: 'Cam sành Tiền Giang mọng nước bồi bổ sức khỏe',
    subtitle: 'Túi 1kg (khoảng 3-4 trái)',
    price: 25000,
    priceFormatted: '25.000đ',
    unitSuffix: '/ kg',
    discountBadge: '-15%',
    category: 'fruits',
    certs: ['vietgap'],
    packs: ['1-2kg'],
    convs: [],
    popularity: 94,
  },
  {
    id: 'p8',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrOJaI_rwlBE7nuV6sJmol-czw3fgvJlcR3ctnauu_9wVvQmZuuh855qko8lRgKE-wvjZv4G06EIoKSQn5YpWyQUp5Rq8IVzhHIUSxdBqAjnx9F0cdWDjlJh9lvTNKr3gLH5a5FDMGbhtyPRscDDKO5-fkye_mDjHXEGajbNQ0E69AArM39p_4TJ2SkvKYsHLzmJtHzWlnUbsOM6KWJ0KJe-kl1G1_ELqLcLv21h3v',
    topBadgeText: 'Chín tự nhiên',
    topBadgeClass: 'bg-primary text-on-primary font-bold shadow-sm',
    originIcon: 'sentiment_satisfied',
    originText: 'Giàu Kali & Chất xơ',
    originClass: 'text-secondary',
    title: 'Chuối già Nam Mỹ dẻo thơm nải 1kg vỏ láng',
    subtitle: 'Nải 1kg (6-8 trái chín vàng)',
    price: 28000,
    priceFormatted: '28.000đ',
    rightMeta: 'Nải đẹp',
    rightMetaClass: 'text-outline',
    category: 'fruits',
    certs: ['vietgap'],
    packs: ['1-2kg'],
    convs: [],
    popularity: 89,
  },
  {
    id: 'p9',
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/230442/bhx/cai-ngot-500g_202512021550581316.jpg',
    topBadgeIcon: 'verified',
    topBadgeText: 'VietGAP',
    topBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant font-bold',
    originIcon: 'eco',
    originText: 'Lá non xanh mướt',
    originClass: 'text-secondary',
    title: 'Cải ngọt VietGAP túi 500g tươi ngon nấu canh, xào tỏi',
    subtitle: 'Túi 500g • Cọng giòn ngọt thanh',
    price: 14000,
    priceFormatted: '14.000đ',
    strikeFormatted: '17.000đ',
    discountBadge: '-18%',
    category: 'leafy',
    certs: ['vietgap'],
    packs: ['300-500g'],
    convs: ['prewashed'],
    popularity: 91,
  },
  {
    id: 'p10',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/275306/bhx/cai-bo-xoi-tui-300gr_202505100838502944.jpg',
    topBadgeIcon: 'eco',
    topBadgeText: 'Dalat GAP',
    topBadgeClass: 'bg-surface-container-lowest text-primary font-bold shadow-sm',
    originIcon: 'park',
    originText: 'Rau chân vịt Đà Lạt',
    originClass: 'text-secondary',
    title: 'Cải bó xôi Đà Lạt túi 300g giàu sắt và vitamin',
    subtitle: 'Túi 300g • Nấu cháo, xào, sinh tố',
    price: 24000,
    priceFormatted: '24.000đ',
    rightMeta: 'Tươi sớm mai',
    rightMetaClass: 'text-outline',
    category: 'leafy',
    certs: ['organic', 'dalatgap'],
    packs: ['300-500g'],
    convs: ['prewashed'],
    popularity: 86,
  },
  {
    id: 'p11',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8820/271482/bhx/xa-lach-bup-mo-goi-500g_202505061505095414.jpg',
    topBadgeIcon: 'done',
    topBadgeText: 'Ăn sống trực tiếp',
    topBadgeClass: 'bg-secondary text-on-secondary font-semibold shadow-sm',
    originIcon: 'wb_sunny',
    originText: 'Xà lách Đà Lạt',
    originClass: 'text-primary',
    title: 'Xà lách búp mỡ Đà Lạt gói 500g lá mềm giòn ngọt',
    subtitle: 'Gói 500g • Ăn cuốn, trộn salad',
    price: 26000,
    priceFormatted: '26.000đ',
    rightMeta: 'Giòn mát',
    rightMetaClass: 'text-outline',
    category: 'leafy',
    certs: ['dalatgap', 'vietgap'],
    packs: ['300-500g'],
    convs: ['prewashed'],
    popularity: 84,
  },
  {
    id: 'p12',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/2/image/production/2026/2/image/Products/8785/230468/khoai-tay-500g_202602231555463854.jpg',
    topBadgeText: 'Dalat GAP',
    topBadgeClass: 'bg-primary-fixed text-on-primary-fixed-variant font-bold',
    originIcon: 'verified',
    originText: 'Vỏ mỏng ruột vàng',
    originClass: 'text-primary',
    title: 'Khoai tây vàng Đà Lạt túi 500g bở thơm ít mắt',
    subtitle: 'Túi 500g (3-5 củ đều đẹp)',
    price: 19000,
    priceFormatted: '19.000đ',
    rightMeta: 'Hàng mới về',
    rightMetaClass: 'text-outline',
    category: 'roots',
    certs: ['dalatgap'],
    packs: ['300-500g'],
    convs: ['peeled'],
    popularity: 87,
  },
  {
    id: 'p13',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/2/image/production/2026/2/image/Products/8785/273076/hanh-tay-tui-1kg_202602231417178861.jpg',
    topBadgeText: 'Tiết kiệm 1kg',
    topBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant font-bold',
    originIcon: 'check_circle',
    originText: 'Củ chắc vỏ khô',
    originClass: 'text-secondary',
    title: 'Hành tây Đà Lạt củ tròn đều túi 1kg giòn ngọt',
    subtitle: 'Túi 1kg (4-6 củ vừa tay)',
    price: 34000,
    priceFormatted: '34.000đ',
    strikeFormatted: '39.000đ',
    discountBadge: '-13%',
    category: 'roots',
    certs: ['dalatgap', 'vietgap'],
    packs: ['1-2kg'],
    convs: ['peeled'],
    popularity: 83,
  },
  {
    id: 'p14',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8785/234022/bhx/bong-cai-xanh-tui-1kg_202505091101005508.jpg',
    topBadgeIcon: 'eco',
    topBadgeText: 'Dalat GAP',
    topBadgeClass: 'bg-secondary text-on-secondary font-semibold shadow-sm',
    originIcon: 'local_florist',
    originText: 'Búp xanh chắc giòn',
    originClass: 'text-secondary',
    title: 'Bông cải xanh Đà Lạt túi 1kg tươi giòn giàu chất xơ',
    subtitle: 'Túi 1kg (2-3 búp tuyển chọn)',
    price: 42000,
    priceFormatted: '42.000đ',
    rightMeta: 'Loại 1',
    rightMetaClass: 'text-outline',
    category: 'roots',
    certs: ['vietgap', 'dalatgap'],
    packs: ['1-2kg'],
    convs: ['hotpot'],
    popularity: 93,
  },
  {
    id: 'p15',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8779/226959/bhx/nam-kim-cham-goi-150g_202504121248383780.jpg',
    topBadgeText: 'Gói hút chân không',
    topBadgeClass: 'bg-surface-container-lowest text-primary font-bold shadow-sm',
    originIcon: 'soup_kitchen',
    originText: 'Giòn ngọt ăn lẩu',
    originClass: 'text-primary',
    title: 'Nấm kim châm tươi gói 150g trắng giòn sạch sẽ',
    subtitle: 'Gói 150g • Nhúng lẩu, cuộn thịt',
    price: 11000,
    priceFormatted: '11.000đ',
    strikeFormatted: '13.500đ',
    discountBadge: '-19%',
    category: 'herbs',
    certs: ['vietgap'],
    packs: ['tray'],
    convs: ['hotpot'],
    popularity: 96,
  },
  {
    id: 'p16',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/5/image/production/2026/5/image/Products/8779/5366420/nam-dui-ga-viet-nam-vi-200g_202605040951114408.jpg',
    topBadgeIcon: 'verified',
    topBadgeText: 'VietGAP',
    topBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant font-bold',
    originIcon: 'park',
    originText: 'Nấm tươi Việt Nam',
    originClass: 'text-secondary',
    title: 'Nấm đùi gà Việt Nam vỉ 200g thịt dày dai giòn',
    subtitle: 'Khay vỉ 200g • Xào, nướng, nấu lẩu',
    price: 22000,
    priceFormatted: '22.000đ',
    rightMeta: 'Bảo quản lạnh',
    rightMetaClass: 'text-outline',
    category: 'herbs',
    certs: ['vietgap'],
    packs: ['tray'],
    convs: ['hotpot'],
    popularity: 82,
  },
  {
    id: 'p17',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368483/tao-envy-new-zealand-nhap-khau-tui-5-trai_202608281607342565.jpg',
    topBadgeText: 'Nhập khẩu NZ',
    topBadgeClass: 'bg-primary text-on-primary font-bold shadow-sm',
    originIcon: 'verified',
    originText: 'Giòn tan ngọt đậm',
    originClass: 'text-primary',
    title: 'Táo Envy New Zealand nhập khẩu túi 5 trái (1kg)',
    subtitle: 'Túi 1kg (5 trái đỏ au tuyển chọn)',
    price: 119000,
    priceFormatted: '119.000đ',
    strikeFormatted: '135.000đ',
    discountBadge: '-12%',
    category: 'fruits',
    certs: ['organic'],
    packs: ['1-2kg'],
    convs: [],
    popularity: 94,
  },
  {
    id: 'p18',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8788/234062/bhx/xoai-cat-hoa-loc-1kg_202511031310460537.jpg',
    topBadgeText: 'Đặc sản miền Tây',
    topBadgeClass: 'bg-primary-fixed text-on-primary-fixed-variant font-bold',
    originIcon: 'wb_sunny',
    originText: 'Thơm lừng ít xơ',
    originClass: 'text-primary',
    title: 'Xoài cát Hòa Lộc chín vàng túi 1kg ngọt đậm đà',
    subtitle: 'Túi 1kg (2-3 trái to tròn)',
    price: 68000,
    priceFormatted: '68.000đ',
    rightMeta: 'Chín cây',
    rightMetaClass: 'text-outline',
    category: 'fruits',
    certs: ['vietgap'],
    packs: ['1-2kg'],
    convs: [],
    popularity: 90,
  },
  {
    id: 'p19',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8788/234065/bhx/thanh-long-ruot-do-1kg_202510211435522470.jpg',
    topBadgeIcon: 'water_drop',
    topBadgeText: 'Mọng nước',
    topBadgeClass: 'bg-secondary text-on-secondary font-semibold shadow-sm',
    originIcon: 'eco',
    originText: 'Vườn Long An',
    originClass: 'text-secondary',
    title: 'Thanh long ruột đỏ Long An túi 1kg ngọt mát bổ dưỡng',
    subtitle: 'Túi 1kg (2-3 trái ruột đỏ đậm)',
    price: 32000,
    priceFormatted: '32.000đ',
    strikeFormatted: '38.000đ',
    discountBadge: '-16%',
    category: 'fruits',
    certs: ['vietgap'],
    packs: ['1-2kg'],
    convs: [],
    popularity: 85,
  },
  {
    id: 'p20',
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/1/image/production/2026/1/image/Products/8788/226925/buoi-da-xanh-trai-13kg_202601121606481841.jpg',
    topBadgeIcon: 'verified',
    topBadgeText: 'Tép hồng ngọt thanh',
    topBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant font-bold',
    originIcon: 'park',
    originText: 'Đặc sản Bến Tre',
    originClass: 'text-secondary',
    title: 'Bưởi da xanh Bến Tre trái 1.3kg mọng nước dễ bóc',
    subtitle: 'Trái 1.2kg - 1.4kg • Vỏ mỏng',
    price: 58000,
    priceFormatted: '58.000đ',
    rightMeta: 'Tuyển chọn',
    rightMetaClass: 'text-outline',
    category: 'fruits',
    certs: ['vietgap'],
    packs: ['1-2kg'],
    convs: [],
    popularity: 88,
  },
];

const SUBCAT_CHIPS = [
  { id: 'all', label: 'Tất cả rau củ', badge: String(PRODUCE_ITEMS.length) },
  {
    id: 'leafy',
    label: '🥬 Rau ăn lá hàng ngày',
    count: `(${PRODUCE_ITEMS.filter((i) => i.category === 'leafy').length})`,
  },
  {
    id: 'roots',
    label: '🥕 Củ quả nấu canh & xào',
    count: `(${PRODUCE_ITEMS.filter((i) => i.category === 'roots').length})`,
  },
  {
    id: 'herbs',
    label: '🍄 Nấm tươi & Rau gia vị',
    count: `(${PRODUCE_ITEMS.filter((i) => i.category === 'herbs').length})`,
  },
  {
    id: 'fruits',
    label: '🍊 Trái cây nội địa & Nhập khẩu',
    count: `(${PRODUCE_ITEMS.filter((i) => i.category === 'fruits').length})`,
  },
];

interface ProductVariant {
  id: string;
  label: string;
  price: number;
  priceFormatted: string;
  strikeFormatted?: string;
  discountBadge?: string;
  unitPriceText: string;
}

function formatPriceVnd(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

function parseStrikePrice(strike?: string): number | null {
  if (!strike) return null;
  const digits = Number(strike.replace(/[^\d]/g, ''));
  return Number.isFinite(digits) && digits > 0 ? digits : null;
}

function getProductVariants(item: ProduceItem): ProductVariant[] {
  const text = `${item.title} ${item.subtitle}`.toLowerCase();
  const baseStrike = parseStrikePrice(item.strikeFormatted);

  if (text.includes('150g')) {
    const doublePrice = Math.round((item.price * 1.85) / 500) * 500;
    const triplePrice = Math.round((item.price * 2.65) / 500) * 500;
    return [
      {
        id: 'standard',
        label: 'Gói 150g',
        price: item.price,
        priceFormatted: item.priceFormatted,
        strikeFormatted: item.strikeFormatted,
        discountBadge: item.discountBadge,
        unitPriceText: `${formatPriceVnd(Math.round((item.price / 150) * 1000))} / kg`,
      },
      {
        id: 'pack-2',
        label: 'Combo 2 gói (300g)',
        price: doublePrice,
        priceFormatted: formatPriceVnd(doublePrice),
        strikeFormatted: formatPriceVnd(item.price * 2),
        discountBadge: '-8%',
        unitPriceText: `${formatPriceVnd(Math.round((doublePrice / 300) * 1000))} / kg`,
      },
      {
        id: 'pack-3',
        label: 'Combo 3 gói (450g)',
        price: triplePrice,
        priceFormatted: formatPriceVnd(triplePrice),
        strikeFormatted: formatPriceVnd(item.price * 3),
        discountBadge: '-12%',
        unitPriceText: `${formatPriceVnd(Math.round((triplePrice / 450) * 1000))} / kg`,
      },
    ];
  }

  if (text.includes('200g')) {
    const doublePrice = Math.round((item.price * 1.9) / 500) * 500;
    return [
      {
        id: 'standard',
        label: 'Khay vỉ 200g',
        price: item.price,
        priceFormatted: item.priceFormatted,
        strikeFormatted: item.strikeFormatted,
        discountBadge: item.discountBadge,
        unitPriceText: `${formatPriceVnd(Math.round((item.price / 200) * 1000))} / kg`,
      },
      {
        id: 'pack-2',
        label: 'Combo 2 vỉ (400g)',
        price: doublePrice,
        priceFormatted: formatPriceVnd(doublePrice),
        strikeFormatted: formatPriceVnd(item.price * 2),
        discountBadge: '-5%',
        unitPriceText: `${formatPriceVnd(Math.round((doublePrice / 400) * 1000))} / kg`,
      },
    ];
  }

  if (text.includes('300g')) {
    const mediumPrice = Math.round((item.price * 1.55) / 500) * 500;
    const largePrice = Math.round((item.price * 2.95) / 500) * 500;
    return [
      {
        id: 'standard',
        label: 'Túi 300g',
        price: item.price,
        priceFormatted: item.priceFormatted,
        strikeFormatted: item.strikeFormatted,
        discountBadge: item.discountBadge,
        unitPriceText: `${formatPriceVnd(Math.round((item.price / 300) * 1000))} / kg`,
      },
      {
        id: '500g',
        label: 'Túi 500g',
        price: mediumPrice,
        priceFormatted: formatPriceVnd(mediumPrice),
        strikeFormatted: formatPriceVnd(Math.round((item.price / 300) * 500)),
        discountBadge: '-7%',
        unitPriceText: `${formatPriceVnd(mediumPrice * 2)} / kg`,
      },
      {
        id: '1kg',
        label: 'Túi lớn 1kg',
        price: largePrice,
        priceFormatted: formatPriceVnd(largePrice),
        strikeFormatted: formatPriceVnd(Math.round((item.price / 300) * 1000)),
        discountBadge: '-12%',
        unitPriceText: `${formatPriceVnd(largePrice)} / kg`,
      },
    ];
  }

  if (text.includes('500g')) {
    const unitLabel = text.includes('khay')
      ? 'Khay 500g'
      : text.includes('bó')
        ? 'Bó 500g'
        : text.includes('gói')
          ? 'Gói 500g'
          : 'Túi 500g';
    const kgPrice = Math.round((item.price * 1.9) / 500) * 500;
    const kgStrike = baseStrike ? baseStrike * 2 : item.price * 2;
    return [
      {
        id: 'standard',
        label: unitLabel,
        price: item.price,
        priceFormatted: item.priceFormatted,
        strikeFormatted: item.strikeFormatted,
        discountBadge: item.discountBadge,
        unitPriceText: `${formatPriceVnd(item.price * 2)} / kg`,
      },
      {
        id: '1kg',
        label: 'Túi tiết kiệm 1kg',
        price: kgPrice,
        priceFormatted: formatPriceVnd(kgPrice),
        strikeFormatted: formatPriceVnd(kgStrike),
        discountBadge: '-5%',
        unitPriceText: `${formatPriceVnd(kgPrice)} / kg`,
      },
    ];
  }

  if (text.includes('1.3kg') || text.includes('1.2kg')) {
    const twoFruitsPrice = Math.round((item.price * 1.92) / 1000) * 1000;
    return [
      {
        id: 'standard',
        label: '1 Trái (1.2kg - 1.4kg)',
        price: item.price,
        priceFormatted: item.priceFormatted,
        strikeFormatted: item.strikeFormatted,
        discountBadge: item.discountBadge,
        unitPriceText: `${formatPriceVnd(Math.round(item.price / 1.3))} / kg`,
      },
      {
        id: 'pack-2',
        label: 'Combo 2 Trái (~2.6kg)',
        price: twoFruitsPrice,
        priceFormatted: formatPriceVnd(twoFruitsPrice),
        strikeFormatted: formatPriceVnd(item.price * 2),
        discountBadge: '-4%',
        unitPriceText: `${formatPriceVnd(Math.round(twoFruitsPrice / 2.6))} / kg`,
      },
    ];
  }

  const baseLabel = text.includes('nải')
    ? 'Nải 1kg'
    : text.includes('5 trái')
      ? 'Túi 1kg (5 trái)'
      : 'Túi / Khay 1kg';
  const twoKgPrice = Math.round((item.price * 1.9) / 1000) * 1000;
  const twoKgStrike = baseStrike ? baseStrike * 2 : item.price * 2;
  return [
    {
      id: 'standard',
      label: baseLabel,
      price: item.price,
      priceFormatted: item.priceFormatted,
      strikeFormatted: item.strikeFormatted,
      discountBadge: item.discountBadge,
      unitPriceText: `${item.priceFormatted} / kg`,
    },
    {
      id: '2kg',
      label: 'Túi gia đình 2kg',
      price: twoKgPrice,
      priceFormatted: formatPriceVnd(twoKgPrice),
      strikeFormatted: formatPriceVnd(twoKgStrike),
      discountBadge: '-5%',
      unitPriceText: `${formatPriceVnd(Math.round(twoKgPrice / 2))} / kg`,
    },
  ];
}

export const FreshProducePage: React.FC<FreshProducePageProps> = ({ onNavigate, onAddToCart }) => {
  const [activeChip, setActiveChip] = useState('all');
  const [certChecks, setCertChecks] = useState([false, false, false]);
  const [packChecks, setPackChecks] = useState([false, false, false]);
  const [convChecks, setConvChecks] = useState([false, false, false]);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sortOption, setSortOption] = useState('Thu hái mới nhất hôm nay');
  const [currentPage, setCurrentPage] = useState(1);
  const productListRef = useRef<HTMLElement>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    PRODUCE_ITEMS.reduce<Record<string, number>>((acc, item) => {
      acc[item.id] = 1;
    return acc;
    }, {}),
  );
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProduceItem | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('standard');
  const [detailQty, setDetailQty] = useState<number>(1);
  const [detailAdded, setDetailAdded] = useState<boolean>(false);

  const selectedProductVariants = useMemo(
    () => (selectedProduct ? getProductVariants(selectedProduct) : []),
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

  const openProductDetail = (item: ProduceItem) => {
    const variants = getProductVariants(item);
    setSelectedProduct(item);
    setSelectedVariantId(variants[0]?.id || 'standard');
    setDetailQty(quantities[item.id] || 1);
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

  const filteredAndSortedProducts = useMemo(() => {
    const certKeys: ProduceCert[] = ['vietgap', 'organic', 'dalatgap'];
    const packKeys: ProducePack[] = ['300-500g', '1-2kg', 'tray'];
    const convKeys: ProduceConv[] = ['prewashed', 'peeled', 'hotpot'];

    const activeCerts = certKeys.filter((_, idx) => certChecks[idx]);
    const activePacks = packKeys.filter((_, idx) => packChecks[idx]);
    const activeConvs = convKeys.filter((_, idx) => convChecks[idx]);

    const filtered = PRODUCE_ITEMS.filter((item) => {
      if (activeChip !== 'all' && item.category !== activeChip) {
        return false;
      }
      if (activeCerts.length > 0 && !activeCerts.some((c) => item.certs.includes(c))) {
        return false;
      }
      if (activePacks.length > 0 && !activePacks.some((p) => item.packs.includes(p))) {
        return false;
      }
      if (activeConvs.length > 0 && !activeConvs.some((cv) => item.convs.includes(cv))) {
        return false;
      }
      if (selectedPrice === 'Dưới 15.000đ' && item.price >= 15000) {
        return false;
      }
      if (selectedPrice === '15k - 30.000đ' && (item.price < 15000 || item.price > 30000)) {
        return false;
      }
      if (selectedPrice === 'Trên 30.000đ' && item.price <= 30000) {
        return false;
      }
      return true;
    });

    if (sortOption === 'Mua nhiều nhất xóm') {
      return [...filtered].sort((a, b) => b.popularity - a.popularity);
    }
    if (sortOption === 'Giá tăng dần') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortOption === 'Giá giảm dần') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [activeChip, certChecks, packChecks, convChecks, selectedPrice, sortOption]);

  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const safePage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (nextPage: number) => {
    if (totalPages === 0 || nextPage < 1 || nextPage > totalPages || nextPage === safePage) {
      return;
    }
    setCurrentPage(nextPage);
    window.requestAnimationFrame(() => {
      productListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const adjustQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.min(99, Math.max(1, (prev[id] || 1) + delta));
      return { ...prev, [id]: next };
    });
  };

  const resetFilters = () => {
    setActiveChip('all');
    setCertChecks([false, false, false]);
    setPackChecks([false, false, false]);
    setConvChecks([false, false, false]);
    setSelectedPrice('');
    setCurrentPage(1);
  };

  const handleAdd = (id: string, price: number, qty: number) => {
    onAddToCart(price, qty);
    setAddedId(id);
    window.setTimeout(() => {
      setAddedId((curr) => (curr === id ? null : curr));
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Micro Sticky Ticker */}
      <div className="w-full bg-secondary-fixed/40 text-on-secondary-fixed-variant px-margin-desktop py-2 flex items-center justify-between text-body-sm font-body-sm">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-on-secondary text-[12px]">
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            </span>
            <span className="font-semibold text-label-md">Đợt rau củ sớm mai 05:00 sáng nay đã cập bến 85 điểm bán:</span>
            <span className="hidden sm:inline text-on-secondary-container">
              100% búp non, kiểm định dư lượng an toàn VietGAP tại kho lạnh.
            </span>
          </div>
          <div className="flex items-center gap-4 text-label-sm font-label-sm">
            <span className="flex items-center gap-1 text-secondary font-bold">
              <span className="material-symbols-outlined text-[16px]">verified</span> 1 Đổi 1 Tận Cửa Trong 2h
            </span>
            <span className="hidden md:inline text-outline-variant">•</span>
            <span className="hidden md:flex items-center gap-1 text-primary font-semibold">
              <span className="material-symbols-outlined text-[16px]">schedule</span> Giao tươi lạnh giữ ẩm
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-margin-desktop py-6 flex flex-col gap-6">
        {/* Breadcrumb Section */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-label-sm text-label-sm text-outline flex-wrap">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">home</span> Trang chủ
          </button>
          <span className="text-outline-variant">/</span>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Danh mục sản phẩm
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-bold">Rau củ &amp; Trái cây tươi sạch</span>
        </nav>

        {/* Industry Category Hero Banner */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-primary-fixed via-tertiary-fixed/40 to-surface-container shadow-md">
          <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[260px] p-6 sm:p-8 lg:p-10 relative z-10 gap-6">
            <div className="lg:col-span-7 flex flex-col items-start gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm tracking-wide flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-ping"></span>
                  ĐƯỢC THU HÁI LÚC 05:00 SÁNG NAY
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">eco</span>
                  Chuẩn VietGAP &amp; GlobalGAP
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight">
                Rau Củ &amp; Trái Cây Tươi Sạch <span className="text-primary">Mỗi Sớm Mai</span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                100% cuống tươi, giòn ngọt, giữ nguyên hương vị vườn quê. Kiểm tra trực tiếp khi nhận hàng, hoàn tiền
                hoặc 1 đổi 1 tức thì nếu lá dập, củ sượng.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAdd('combo-soup', 59000, 1)}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-md text-label-md shadow-[0_4px_16px_rgba(251,113,133,0.35)] hover:opacity-95 transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">soup_kitchen</span>
                  Đặt Combo Nấu Canh Tuần Này
                </button>
                <a
                  className="px-4 py-2.5 rounded-full bg-surface-container-lowest/80 text-on-surface hover:bg-surface-container-lowest font-label-md text-label-md transition-colors flex items-center gap-1.5"
                  href="#cam-ket"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('cam-ket')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">format_image_left</span>
                  Cam kết chất lượng
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm aspect-video sm:aspect-square lg:h-64 rounded-2xl overflow-hidden shadow-lg bg-surface-container-lowest p-2">
                <img
                  alt="Rau củ tươi sạch"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXdcm2cSJgPgQdN4t_uq3Gb8IPodpGjM59bw5Cq8xT6gIT_X0ptXTeDVbbWun72cD7vM-8y0ba8uvf6XB90o2sb4xPbd-U-Ubk3o51HNA_MCds_-Q2OgDK8ohEXstIAaLeJ--t3z7CymObQUvrNaFAtUu4JC4v7wL79cm-R4SSbwcZ5M20SGFexkyMpQDFVkBrJ8wKfm4qewThk1E7dJrJL7GBUD7sSgRWgDwwTmjm"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[18px]">temp_preferences_custom</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">Nhiệt độ bảo quản</span>
                      <span className="font-body-sm text-body-sm text-secondary font-semibold">Kho mát 8°C - 12°C</span>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline">Giữ tươi 48h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-category Horizontal Navigation Chips */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
          {SUBCAT_CHIPS.map((chip) => {
            const isActive = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setActiveChip(chip.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary active:scale-95'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface'
                }`}
              >
                <span>{chip.label}</span>
                {chip.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold">
                    {chip.badge}
                  </span>
                )}
                {chip.count && <span className="text-outline text-label-sm font-label-sm">{chip.count}</span>}
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-5 bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between pb-3 bg-surface-container-low/50 -mx-5 -mt-5 p-5 rounded-t-2xl">
              <div className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm">
                <span className="material-symbols-outlined text-[20px]">filter_alt</span>
                <span>Bộ Lọc Chuyên Sâu</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-primary hover:underline font-label-sm text-label-sm cursor-pointer"
              >
                Thiết lập lại
              </button>
            </div>

            {/* Filter: Safety Certifications */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                Chứng nhận an toàn
              </span>
              <div className="flex flex-col gap-2 text-body-sm font-body-sm text-on-surface-variant">
                {[
                  {
                    label: 'Tiêu chuẩn VietGAP',
                    count: `(${PRODUCE_ITEMS.filter((i) => i.certs.includes('vietgap')).length})`,
                  },
                  {
                    label: 'Hữu cơ Organic',
                    count: `(${PRODUCE_ITEMS.filter((i) => i.certs.includes('organic')).length})`,
                  },
                  {
                    label: 'Chuẩn an toàn DaLat GAP',
                    count: `(${PRODUCE_ITEMS.filter((i) => i.certs.includes('dalatgap')).length})`,
                  },
                ].map((c, idx) => (
                  <label key={c.label} className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
                    <input
                      checked={certChecks[idx]}
                      onChange={() => {
                        setCertChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      type="checkbox"
                    />
                    <span className="flex-1">{c.label}</span>
                    <span className="font-label-sm text-label-sm text-outline">{c.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Packaging & Weight */}
            <div className="flex flex-col gap-2.5 pt-3 bg-surface-container-low/30 -mx-5 px-5 py-3 rounded-xl">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-outline text-[16px]">scale</span>
                Đóng gói &amp; Định lượng
              </span>
              <div className="flex flex-col gap-2 text-body-sm font-body-sm text-on-surface-variant">
                {[
                  'Bó 300g - 500g (Vừa bữa ăn)',
                  'Túi tiết kiệm 1kg - 2kg',
                  'Khay vỉ ép nhiệt bảo quản',
                ].map((label, idx) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
                    <input
                      checked={packChecks[idx]}
                      onChange={() => {
                        setPackChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      type="checkbox"
                    />
                    <span className="flex-1">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Convenience Needs */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[16px]">handyman</span>
                Nhu cầu tiện lợi cho mẹ
              </span>
              <div className="flex flex-col gap-2">
                <label className="p-2.5 rounded-xl bg-primary-fixed/30 flex items-start gap-2 cursor-pointer hover:bg-primary-fixed/50 transition-colors">
                  <input
                    checked={convChecks[0]}
                    onChange={() => {
                      setConvChecks((prev) => prev.map((v, i) => (i === 0 ? !v : v)));
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary accent-primary"
                    type="checkbox"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      Nhặt sẵn &amp; Bỏ gốc (+2.000đ)
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">Rau nhặt sạch, mang về chỉ việc rửa</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer hover:text-on-surface px-1">
                  <input
                    checked={convChecks[1]}
                    onChange={() => {
                      setConvChecks((prev) => prev.map((v, i) => (i === 1 ? !v : v)));
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    type="checkbox"
                  />
                  <span className="flex-1">Rau củ gọt vỏ sẵn đóng hộp</span>
                </label>
                <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer hover:text-on-surface px-1">
                  <input
                    checked={convChecks[2]}
                    onChange={() => {
                      setConvChecks((prev) => prev.map((v, i) => (i === 2 ? !v : v)));
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    type="checkbox"
                  />
                  <span className="flex-1">Set rau nấu lẩu / canh chua trọn gói</span>
                </label>
              </div>
            </div>

            {/* Filter: Price Range */}
            <div className="flex flex-col gap-2.5 pt-2">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-outline text-[16px]">payments</span>
                Mức giá mỗi bữa
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRICE_BTNS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPrice((prev) => (prev === p ? '' : p));
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm transition-colors cursor-pointer ${
                      selectedPrice === p
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low hover:bg-primary-fixed text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Tip Card */}
            <div className="p-3.5 rounded-xl bg-secondary-fixed/20 text-on-secondary-fixed-variant flex items-start gap-2.5 mt-2">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">tips_and_updates</span>
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-label-md text-secondary font-bold">Mẹo Tạp Hóa:</span>
                <p className="font-body-sm text-body-sm leading-snug">
                  Rau lá xanh rửa qua nước muối loãng, để ráo trước khi cho vào ngăn mát sẽ tươi thêm 3-4 ngày!
                </p>
              </div>
            </div>
          </aside>

          {/* Right Shelf Products Area */}
          <section ref={productListRef} className="lg:col-span-9 flex flex-col gap-5 scroll-mt-40">
            {/* Shelf Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-headline-sm text-headline-sm text-on-surface">Rau Lá &amp; Củ Quả Ăn Hằng Ngày</span>
                <span className="font-body-sm text-body-sm text-outline">
                  (Đang có {totalProducts} mặt hàng tươi sẵn tại quầy)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-outline">Sắp xếp:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low font-label-sm text-label-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Thu hái mới nhất hôm nay</option>
                  <option>Mua nhiều nhất xóm</option>
                  <option>Giá tăng dần</option>
                  <option>Giá giảm dần</option>
                </select>
              </div>
            </div>

            {/* 8 Detailed Product Cards Grid */}
            {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedProducts.map((item) => {
                const qty = quantities[item.id] || 1;
                return (
                  <article
                    key={item.id}
                    className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openProductDetail(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openProductDetail(item);
                        }
                      }}
                      aria-label={`Xem chi tiết ${item.title}`}
                      className="relative w-full aspect-square bg-surface-container-low overflow-hidden cursor-pointer"
                    >
                      <img
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={item.image}
                      />
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded-full font-label-sm text-label-sm flex items-center gap-1 ${item.topBadgeClass}`}
                      >
                        {item.topBadgeIcon && (
                          <span className="material-symbols-outlined text-[12px]">{item.topBadgeIcon}</span>
                        )}
                        {item.topBadgeText}
                      </span>
                      {item.bottomBadgeText && (
                        <span
                          className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md font-label-sm text-[10px] ${item.bottomBadgeClass}`}
                        >
                          {item.bottomBadgeText}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-1 font-label-sm text-[11px] ${item.originClass}`}>
                          <span className="material-symbols-outlined text-[13px]">{item.originIcon}</span>{' '}
                          {item.originText}
                        </div>
                        <h3
                          role="button"
                          tabIndex={0}
                          onClick={() => openProductDetail(item)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openProductDetail(item);
                            }
                          }}
                          className="font-headline-sm text-body-md text-on-surface font-semibold line-clamp-2 leading-tight cursor-pointer hover:text-primary transition-colors"
                        >
                          {item.title}
                        </h3>
                        <span className="font-body-sm text-body-sm text-outline">{item.subtitle}</span>
                      </div>

                      <div className="flex flex-col gap-2 pt-2 bg-surface-container-low/40 -mx-3.5 -mb-3.5 p-3.5 rounded-b-2xl">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-price-lg text-price-lg text-primary">{item.priceFormatted}</span>
                            {item.unitSuffix && (
                              <span className="font-body-sm text-body-sm text-outline">{item.unitSuffix}</span>
                            )}
                            {item.strikeFormatted && (
                              <span className="font-price-strike text-price-strike text-outline line-through">
                                {item.strikeFormatted}
                              </span>
                            )}
                          </div>
                          {item.discountBadge ? (
                            <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded">
                              {item.discountBadge}
                            </span>
                          ) : item.rightMeta ? (
                            <span className={`font-label-sm text-label-sm ${item.rightMetaClass}`}>
                              {item.rightMeta}
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center bg-surface-container-lowest rounded-full shadow-inner p-0.5">
                            <button
                              type="button"
                              onClick={() => adjustQty(item.id, -1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-outline hover:text-primary active:scale-95 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-label-md text-label-md px-2 text-on-surface font-bold">{qty}</span>
                            <button
                              type="button"
                              onClick={() => adjustQty(item.id, 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold active:scale-95 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAdd(item.id, item.price, qty)}
                            className={`flex-1 py-1.5 px-3 rounded-full font-label-md text-label-md transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer ${
                              addedId === item.id
                                ? 'bg-secondary text-on-secondary'
                                : 'bg-primary-container text-on-primary hover:bg-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {addedId === item.id ? 'check' : 'add_shopping_cart'}
                            </span>
                            {addedId === item.id ? 'Đã thêm' : 'Thêm'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl p-10 text-center shadow-sm flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
                <p className="font-headline-sm text-body-md text-on-surface font-semibold">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại
                </p>
                <p className="font-body-sm text-body-sm text-outline">
                  Bạn thử bỏ bớt tiêu chí lọc hoặc thiết lập lại để xem đủ 20 mặt hàng tươi ngon hôm nay.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:opacity-95 cursor-pointer"
                >
                  Thiết lập lại bộ lọc
                </button>
              </div>
            )}

            {/* Shelf Pagination */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between pt-4 pb-2 px-2 flex-wrap gap-3">
                <span className="font-body-sm text-body-sm text-outline">
                  Hiển thị {displayedProducts.length} sản phẩm ({startIndex + 1}–{startIndex + displayedProducts.length}) trong tổng số {totalProducts} sản phẩm rau quả tươi (Trang {safePage}/{totalPages})
                </span>
                <nav aria-label="Phân trang sản phẩm" className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => handlePageChange(safePage - 1)}
                    aria-label="Trang trước"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      safePage <= 1
                        ? 'bg-surface-container-low text-outline cursor-not-allowed opacity-60'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface cursor-pointer'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                    const isActive = pageNum === safePage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-9 h-9 rounded-xl font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => handlePageChange(safePage + 1)}
                    aria-label="Trang sau"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      safePage >= totalPages
                        ? 'bg-surface-container-low text-outline cursor-not-allowed opacity-60'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface cursor-pointer'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </nav>
              </div>
            )}
          </section>
        </div>

        {/* Smart Suggestion Bento Box: Weekly Soup Combo */}
        <section className="w-full rounded-3xl bg-surface-container-lowest p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span> TIẾT KIỆM 20%
                  &amp; TIỆN LỢI
                </span>
                <span className="text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span> Đã nhặt sạch chỉ việc nấu
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Combo Rau Canh Tuần Này (5 Món Thiết Yếu)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Gồm: 500g Rau Muống + 500g Mồng Tơi + 500g Bầu Sao + 500g Cà Chua Đỏ + 1 Túi Hành Ngò gia vị tươi. Nhặt
                sẵn bỏ rễ, bọc màng thở hút ẩm, giữ trọn vị tươi trong 5 ngày.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-headline-lg text-primary font-bold">59.000đ</span>
                  <span className="font-body-md text-body-md text-outline line-through">75.000đ</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd('combo-soup', 59000, 1)}
                  className={`px-6 py-2.5 rounded-full font-label-md text-label-md transition-transform active:scale-95 shadow-md flex items-center gap-2 cursor-pointer ${
                    addedId === 'combo-soup'
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary hover:bg-on-primary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {addedId === 'combo-soup' ? 'check' : 'shopping_basket'}
                  </span>
                  {addedId === 'combo-soup' ? 'Đã thêm Combo' : 'Bỏ Vào Giỏ Combo Này'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-md bg-surface-container-low">
                <img
                  alt="Combo Rau Canh Tuần Này"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBufPd_FufcKkTLvKOE0dW5DkWj1Kq5yKSB8e7ejkuwuKmmZSDshdRN-nhWntkLytGrMSPZt4lUQ5ZQB9jayDTMtQ_nt8bVgWJj2vbc0v5AFsRMbtFauYLR4dnF56IiveAdVxSiUEYe19p32GPHDQ_Yzgc0rcLe0qQ7raGzCiV-CObgYi1BMC_Zcq8l_TKqdrGFvxEShDAeEYfduo_2hOYBes01fVvFbgHt0LhAmIHQ"
                />
                <span className="absolute top-2 right-2 bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold">
                  Đủ 5 bữa canh
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Fresh Quality Commitment & Guarantee Section */}
        <section className="w-full rounded-2xl bg-surface-container-low/50 p-6 sm:p-8 flex flex-col gap-6 scroll-mt-40" id="cam-ket">
          <div className="flex flex-col items-center text-center gap-1.5 max-w-2xl mx-auto">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-bold">
              Cam Kết Từ Người Bán Phố Thân Quen
            </span>
            <h3 className="font-headline-lg text-headline-md text-on-surface font-bold">
              Vì Sao Hàng Triệu Bữa Cơm Chọn Tạp Hóa Số?
            </h3>
            <p className="font-body-sm text-body-sm text-outline">
              Chúng tôi chăm chút từng bó rau, trái cam như chính người nhà mua sắm mỗi ban mai.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3.5 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[26px]">alarm</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-headline-sm text-label-md text-on-surface font-bold">Chuyến xe rau 5 Giờ Sáng</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Rau củ được cắt tại vườn lúc 2h sáng và có mặt tại quầy hàng lúc 5h. Cam kết không lưu cữu sang ngày
                  thứ 2.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[26px]">currency_exchange</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-headline-sm text-label-md text-on-surface font-bold">1 Đổi 1 Tận Nơi Tức Thì</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Nếu quý khách phát hiện cuống dập úng hoặc không ưng ý, nhân viên giao hàng đổi mới hoặc hoàn tiền
                  ngay trong 2 giờ.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface shrink-0">
                <span className="material-symbols-outlined text-[26px]">content_cut</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-headline-sm text-label-md text-on-surface font-bold">Dịch Vụ Sơ Chế Tận Tâm</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Hỗ trợ nhặt sạch lá sâu, cắt gốc, gọt vỏ củ quả theo yêu cầu. Giúp các mẹ bận rộn tiết kiệm đến 30
                  phút nấu nướng.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Product Detail View Modal */}
      {selectedProduct && activeVariant && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
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
              {/* Left Side: High-resolution product image */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-low shadow-sm">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 ${selectedProduct.topBadgeClass}`}
                  >
                    {selectedProduct.topBadgeIcon && (
                      <span className="material-symbols-outlined text-[13px]">{selectedProduct.topBadgeIcon}</span>
                    )}
                    {selectedProduct.topBadgeText}
                  </span>
                  {selectedProduct.bottomBadgeText && (
                    <span
                      className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md font-label-sm text-[11px] ${selectedProduct.bottomBadgeClass}`}
                    >
                      {selectedProduct.bottomBadgeText}
                    </span>
                  )}
                </div>

                <div className="bg-secondary-fixed/25 text-on-secondary-fixed-variant rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">verified</span>
                  <span>Giao tươi lạnh 30-45 phút • 1 Đổi 1 tận cửa nếu dập úng.</span>
                </div>
              </div>

              {/* Right Side: Information, Packaging Options, Pricing, Quantity & MUA */}
              <div className="md:col-span-7 flex flex-col justify-between gap-5 pr-2">
                <div className="flex flex-col gap-4">
                  {/* Origin & Title */}
                  <div className="flex flex-col gap-1.5 pr-8">
                    <div className={`flex items-center gap-1.5 font-label-sm text-label-sm ${selectedProduct.originClass}`}>
                      <span className="material-symbols-outlined text-[15px]">{selectedProduct.originIcon}</span>
                      <span>{selectedProduct.originText}</span>
                    </div>
                    <h2
                      id="product-detail-title"
                      className="font-headline-md sm:font-headline-lg text-on-surface font-bold leading-snug"
                    >
                      {selectedProduct.title}
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">{selectedProduct.subtitle}</p>
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

                  {/* Packaging / Option Selector */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-md text-label-md text-on-surface">
                      Chọn quy cách / phân loại đóng gói:
                    </span>
                    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Phân loại đóng gói">
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
                        : `MUA • ${formatPriceVnd(activeVariant.price * detailQty)}`}
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
