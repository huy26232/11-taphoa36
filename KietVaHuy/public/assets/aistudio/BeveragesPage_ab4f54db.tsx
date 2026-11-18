import React, { useState } from 'react';
import { PageId } from '../types';

interface BeveragesPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

interface BeverageProduct {
  id: string;
  category: 'beer' | 'soda' | 'energy' | 'water';
  brand: string;
  packType: 'can330' | 'pack6' | 'case24' | 'pet';
  isAlcoholic: boolean;
  isZeroCal: boolean;
  discountPct?: number;
  img: string;
  badgeLeft: { text: string; cls: string };
  coldIcon: boolean;
  brandLine: string;
  title: string;
  promoTag: { text: string; cls: string };
  strikeStr?: string;
  price: number;
  priceStr: string;
  unit: string;
}

const PRODUCTS: BeverageProduct[] = [
  {
    id: 'tiger-nau',
    category: 'beer',
    brand: 'Tiger',
    packType: 'can330',
    isAlcoholic: true,
    isZeroCal: false,
    discountPct: 8,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiREmZzy-YZLG9EwarAQPao6l6kCV6gwuXUHIz8ne_vpwl8CUoa64ha9M1xSfD_TLlVzUTmOI3-kU_TUf98xnMro0h2zoyDU-HSwJLKL7tba7qLS5QSnFXTcPK7qd6f0yX5uAKI_fo0PA6VfffVvv8P4veoSw51DdhxO3ObJs3qrwWbczQl7Lx_HJh5MyuLwNY0R-2FyVOMFAtY7hRoPxXn1hxdgICndPXdoN_HXs2',
    badgeLeft: { text: 'Bán chạy #1', cls: 'bg-primary text-on-primary' },
    coldIcon: true,
    brandLine: 'Tiger Beer • 5.0% Cồn',
    title: 'Bia Tiger Nâu Lon 330ml mát lạnh sảng khoái',
    promoTag: {
      text: 'Thùng 24 lon: 395.000đ',
      cls: 'text-on-secondary-container bg-secondary-fixed/40 px-1.5 py-0.5 rounded self-start mt-0.5',
    },
    strikeStr: '19.000đ',
    price: 17500,
    priceStr: '17.500đ',
    unit: '/lon',
  },
  {
    id: 'heineken-silver',
    category: 'beer',
    brand: 'Heineken',
    packType: 'case24',
    isAlcoholic: true,
    isZeroCal: false,
    discountPct: 4,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH_KHYoic8kuL1h8RdzUotX9KFVWUD4CP48bBeJczAE3op6KUNHcllQyGqOl5gpfLeRx1_QZ-HbATnLMExohpGmwyqL6gUEzss7eBcJSoU5uCwMCX_QqcgwfZM5agcDNC5hPdw_Mo4cIewSjKQZ_7tkW4FjVgB8CAhDIDhd55wGraZLJGuVYeRIPsiAm3vSSuqx9gOxW6vPzMtItacAy2eONHgDRiBSE7k4__rcTfU',
    badgeLeft: { text: 'Thùng Siêu Rẻ', cls: 'bg-secondary text-on-secondary' },
    coldIcon: true,
    brandLine: 'Heineken • Dễ Uống 4%',
    title: 'Thùng 24 Lon Bia Heineken Bạc Silver 330ml',
    promoTag: {
      text: 'Tặng kèm túi đá sạch 5kg',
      cls: 'text-primary font-medium mt-0.5',
    },
    strikeStr: '465.000đ',
    price: 445000,
    priceStr: '445.000đ',
    unit: '/thùng',
  },
  {
    id: 'cocacola',
    category: 'soda',
    brand: 'Coca-Cola',
    packType: 'can330',
    isAlcoholic: false,
    isZeroCal: false,
    discountPct: 9,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZjdroy882uHL7U_KDOgllzzFMPWKke5yhu1ATuq3L97XZJ8fHHTWs52dFs1rKRmB7GbNyHmDVHvIMl1JQwD_I3g5caUbFeF_KTAuskX0YiP5RSzio_4GeWaQIjcs4Ah6b5pISi5ORVModFKSvGvj101ZIJ0DTQ1mJfQUxqJvBtwKNOlq9Fk3Hj6u-qPeog4pKVMQsBLLnbpxhuTlOstWXZ1jAxWvWhzFPL1mjh0dP',
    badgeLeft: { text: '-10%', cls: 'bg-primary-fixed text-on-primary-fixed-variant' },
    coldIcon: false,
    brandLine: 'Coca-Cola Co. • Có Ga',
    title: 'Nước Ngọt Coca-Cola Vị Nguyên Bản Lon 320ml',
    promoTag: {
      text: 'Lốc 6 lon chỉ: 59.000đ',
      cls: 'text-on-surface-variant mt-0.5',
    },
    strikeStr: '11.500đ',
    price: 10500,
    priceStr: '10.500đ',
    unit: '/lon',
  },
  {
    id: 'pepsi-zero',
    category: 'soda',
    brand: 'Pepsi',
    packType: 'can330',
    isAlcoholic: false,
    isZeroCal: true,
    discountPct: 9,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5Y0rOO75P6Grtrk2ub4_iWk8_z-ysZdN7v0WPqHfm8Qf9-mvXrNhCTJMl_OphBOHtCSJO6pRX75PDjqkuHXkBy4iO1JOjBrYl4jFq7XeCRCcREvbJkdlr6Fnp8hagu76kRtLCiMZSTzjXrzS1sIeGmdSH7yKBHmRfdIC06IxIpunQBTpN73uM4rfRc_z2T-wcWbVZp9hul8afPryNLQNfvG6lcantaAQWcNdDgBDj',
    badgeLeft: { text: 'Zero Calo', cls: 'bg-secondary-container text-on-secondary-container' },
    coldIcon: false,
    brandLine: 'Suntory PepsiCo • Ăn Kiêng',
    title: 'Nước Ngọt Có Ga Pepsi Không Calo Lon 320ml',
    promoTag: {
      text: 'Thích hợp người giảm ngọt',
      cls: 'text-secondary font-medium mt-0.5',
    },
    strikeStr: '11.500đ',
    price: 10500,
    priceStr: '10.500đ',
    unit: '/lon',
  },
  {
    id: 'sting-dau',
    category: 'energy',
    brand: 'Sting Dâu',
    packType: 'can330',
    isAlcoholic: false,
    isZeroCal: false,
    discountPct: 8,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvk4zj-Qw8sO8EHbYrbna9iOdrRZEUzkqUvvV1E-W-KX5XH_KSzVmKd56WSEV57BKqp5LTXlOfflf1sfsmKayosOPu20DdfN4VanPa0bRsSr1hDumw_6Q8UlnrPPJ4kfrAx5hq3eyADydm3UuPZhLXIMc4ao1Sdr7rzT33JuXEVLeSdV0I1Y1uSnkHWM0LiOzQCSZ4BG4WwozTEw5JgubBRJbqVoGgtLxurk4pMtPN',
    badgeLeft: { text: 'Tăng Lực', cls: 'bg-primary text-on-primary' },
    coldIcon: false,
    brandLine: 'Sting • Nhân Sâm & Dâu',
    title: 'Nước Tăng Lực Sting Dâu Tây Đỏ Lon 320ml',
    promoTag: {
      text: 'Nạp nhanh năng lượng tỉnh táo',
      cls: 'text-outline mt-0.5',
    },
    strikeStr: '12.000đ',
    price: 11000,
    priceStr: '11.000đ',
    unit: '/lon',
  },
  {
    id: 'c2-chanh',
    category: 'energy',
    brand: 'C2 Chanh',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    discountPct: 10,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiZA-BHdgobTVc13mtlHr4FoKCT-5x2VwTCna20H_E3SnIf_OuaYh6wVWfmemanRuMghqFZ22vOw-SkTDXkxEjcFRgeCZA-0ubvzFhvoZbXgyVE3dJtFRZU-6jtnevfvOts0EwfPohF0BsW4d24E1jcrfhLywx4SABG08Gu2kX7aDylP1bWIqqBpY4XHndxyxczvZBswUlfSKhwuCnfMVvBYX0vGsxck_WngjTpGMg',
    badgeLeft: { text: 'Thanh Nhiệt', cls: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
    coldIcon: false,
    brandLine: 'URC • Trà Xanh 100%',
    title: 'Trà Xanh C2 Hương Chanh Chai 455ml Thanh Nhiệt',
    promoTag: {
      text: 'Chai lớn tiết kiệm hơn',
      cls: 'text-outline mt-0.5',
    },
    strikeStr: '10.500đ',
    price: 9500,
    priceStr: '9.500đ',
    unit: '/chai',
  },
  {
    id: 'lavie-500',
    category: 'water',
    brand: 'Lavie',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: true,
    discountPct: 8,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAobL6i-7-Y462AqkLJAwQoSeUqKUSRpOSkKttl2bBjlUTtUWV0e3cw-5RZlv5QyN4OCrjvmqJoRxwt2AJuASgpiH5tT-5wtLk6yVbNIY_A42jB2f80L6PhAnISnuztYGPR7_hKQ_aJKRWD6D4ia29FJOHY20OYiCHyXvPDDhLoTvBZ9fKyBx8uqQ_M3-5tCMIE6WN_o98XWupC1nUl0ecSqyx0YY564SSspb6ysRlY',
    badgeLeft: { text: 'Khoáng Tự Nhiên', cls: 'bg-surface-container-high text-on-surface-variant' },
    coldIcon: false,
    brandLine: 'Nestlé Waters • Nước Khoáng',
    title: 'Nước Khoáng Thiên Nhiên LaVie Chai 500ml',
    promoTag: {
      text: 'Có sẵn lốc 6 & thùng 24 chai',
      cls: 'text-outline mt-0.5',
    },
    strikeStr: '6.500đ',
    price: 6000,
    priceStr: '6.000đ',
    unit: '/chai',
  },
  {
    id: 'teppy-cam',
    category: 'water',
    brand: 'Teppy',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    discountPct: 11,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXzVBGT03_rtdT5ks3D-cm4w-yxcGoAOyvLTXwxVsAcm7jYDTcXSmpCKLGFaM0DWIvecWvHjE1Uhd4nVnEpXChTCgtKTrqkxf-t5hoZTDorOALyhNBQV1feZpicNgzvnBQy8vMjuqIrC0Qf-WxRft_9rucnOnvxaBJLeGtq90xh6gA6MyPNsLWi-vuR8JSJlXgNUzRTSbxT2Joky7dHoipRHbaUQl8D1mAWzYsHonm',
    badgeLeft: { text: 'Có Tép Cam', cls: 'bg-secondary-container text-on-secondary-container' },
    coldIcon: false,
    brandLine: 'Minute Maid • Nước Ép',
    title: 'Nước Ép Cam Teppy Tép Cam Tươi Chai 327ml',
    promoTag: {
      text: 'Giàu Vitamin C bổ sung',
      cls: 'text-secondary font-medium mt-0.5',
    },
    strikeStr: '13.500đ',
    price: 12000,
    priceStr: '12.000đ',
    unit: '/chai',
  },

  // === 13 SẢN PHẨM NƯỚC GIẢI KHÁT KHÔNG CỒN BỔ SUNG (TỔNG CỘNG 21 SẢN PHẨM) ===
  {
    id: 'sprite-15l',
    category: 'soda',
    brand: 'Sprite',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/2443/84808/nuoc-ngot-sprite-vi-chanh-15-lit_202609150938292697.jpg',
    badgeLeft: { text: 'Chai Lớn 1.5L', cls: 'bg-secondary text-on-secondary' },
    coldIcon: false,
    brandLine: 'Coca-Cola Co. • Vị Chanh',
    title: 'Nước Ngọt Sprite Vị Chanh Chai 1.5 Lít',
    promoTag: {
      text: 'Phù hợp bữa cơm & tiệc gia đình',
      cls: 'text-outline mt-0.5',
    },
    price: 21000,
    priceStr: '21.000đ',
    unit: '/chai',
  },
  {
    id: 'fanta-cam-320',
    category: 'soda',
    brand: 'Fanta',
    packType: 'can330',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/2443/76453/nuoc-ngot-fanta-cam-sleek-330ml_202609141628040570.jpg',
    badgeLeft: { text: 'Vị Cam Tươi', cls: 'bg-primary-fixed text-on-primary-fixed-variant' },
    coldIcon: false,
    brandLine: 'Coca-Cola Co. • Có Ga',
    title: 'Nước Ngọt Fanta Vị Cam Lon 320ml',
    promoTag: {
      text: 'Hương cam ngọt dịu, nhiều gas',
      cls: 'text-on-surface-variant mt-0.5',
    },
    price: 9500,
    priceStr: '9.500đ',
    unit: '/lon',
  },
  {
    id: '7up-loc-6',
    category: 'soda',
    brand: '7Up',
    packType: 'pack6',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/2443/198121/loc-6-lon-nuoc-ngot-7-up-330ml_202609141444117737.jpg',
    badgeLeft: { text: 'Lốc 6 Lon', cls: 'bg-secondary-container text-on-secondary-container' },
    coldIcon: false,
    brandLine: 'Suntory PepsiCo • Chanh Tươi',
    title: 'Lốc 6 Lon Nước Ngọt Có Gas 7Up 320ml',
    promoTag: {
      text: 'Lốc 6 lon tiện lợi giải nhiệt',
      cls: 'text-secondary font-medium mt-0.5',
    },
    price: 61000,
    priceStr: '61.000đ',
    unit: '/lốc',
  },
  {
    id: 'coca-zero-th24',
    category: 'soda',
    brand: 'Coca-Cola',
    packType: 'case24',
    isAlcoholic: false,
    isZeroCal: true,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/2443/87881/nuoc-ngot-coke-zero-sleek-lon-320ml-thung-24-lon_202609151000195185.jpg',
    badgeLeft: { text: 'Zero Calo', cls: 'bg-secondary-container text-on-secondary-container' },
    coldIcon: false,
    brandLine: 'Coca-Cola Co. • Không Đường',
    title: 'Thùng 24 Lon Coca-Cola Zero Calo 320ml',
    promoTag: {
      text: 'Thùng 24 lon không đường',
      cls: 'text-secondary font-medium mt-0.5',
    },
    price: 239000,
    priceStr: '239.000đ',
    unit: '/thùng',
  },
  {
    id: 'aquafina-th24',
    category: 'water',
    brand: 'Aquafina',
    packType: 'case24',
    isAlcoholic: false,
    isZeroCal: true,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/2563/84816/thung-24-chai-nuoc-tinh-khiet-aquafina-500ml_202611121334178077.jpg',
    badgeLeft: { text: 'Thùng 24 Chai', cls: 'bg-surface-container-high text-on-surface-variant' },
    coldIcon: false,
    brandLine: 'Aquafina • Nước Tinh Khiết',
    title: 'Thùng 24 Chai Nước Tinh Khiết Aquafina 500ml',
    promoTag: {
      text: 'Công nghệ lọc Hydro-7 tinh khiết',
      cls: 'text-outline mt-0.5',
    },
    price: 122000,
    priceStr: '122.000đ',
    unit: '/thùng',
  },
  {
    id: 'vinh-hao-500',
    category: 'water',
    brand: 'Vĩnh Hảo',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: true,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/2563/76404/nuoc-khoang-vinh-hao-500ml_202611161610061705.jpg',
    badgeLeft: { text: 'Khoáng Thiên Nhiên', cls: 'bg-surface-container-high text-on-surface-variant' },
    coldIcon: false,
    brandLine: 'Vĩnh Hảo • Bổ Sung Khoáng',
    title: 'Nước Khoáng Thiên Nhiên Vĩnh Hảo Chai 500ml',
    promoTag: {
      text: 'Giàu Bicarbonate & khoáng chất',
      cls: 'text-outline mt-0.5',
    },
    price: 5300,
    priceStr: '5.300đ',
    unit: '/chai',
  },
  {
    id: 'tea-plus-450',
    category: 'energy',
    brand: 'Tea+',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/8938/79209/tra-oolong-tea-pet-455ml_202611131539234337.jpg',
    badgeLeft: { text: 'Trà Ô Long', cls: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
    coldIcon: false,
    brandLine: 'TEA+ Plus • Trà Đóng Chai',
    title: 'Trà Ô Long TEA+ Plus Chai Lớn 450ml',
    promoTag: {
      text: 'Chứa hoạt chất OTPP thanh nhẹ',
      cls: 'text-outline mt-0.5',
    },
    price: 11100,
    priceStr: '11.100đ',
    unit: '/chai',
  },
  {
    id: 'khong-do-455',
    category: 'energy',
    brand: 'Không Độ',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/11/image/production/2026/11/image/Products/8938/85739/tra-xanh-khong-do-chanh-chai-455ml_202611121406007298.jpg',
    badgeLeft: { text: 'Thanh Nhiệt', cls: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
    coldIcon: false,
    brandLine: 'Không Độ • Trà Xanh Chanh',
    title: 'Trà Xanh Không Độ Vị Chanh Chai 455ml',
    promoTag: {
      text: 'Chiết xuất lá trà xanh EGCG',
      cls: 'text-outline mt-0.5',
    },
    price: 11600,
    priceStr: '11.600đ',
    unit: '/chai',
  },
  {
    id: 'fuze-tea-450',
    category: 'energy',
    brand: 'Fuze Tea',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8938/204232/bhx/tra-chanh-voi-sa-fuze-tea-450ml_202505191013461795.jpg',
    badgeLeft: { text: 'Chanh & Sả', cls: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
    coldIcon: false,
    brandLine: 'Fuze Tea+ • Trà Trái Cây',
    title: 'Trà Chanh Với Sả Fuze Tea Chai 450ml',
    promoTag: {
      text: 'Hương sả thơm dịu giải nhiệt',
      cls: 'text-outline mt-0.5',
    },
    price: 10000,
    priceStr: '10.000đ',
    unit: '/chai',
  },
  {
    id: 'twister-450',
    category: 'water',
    brand: 'Twister',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/3265/79132/bhx/79132_202411200938554993.jpg',
    badgeLeft: { text: 'Nước Cam Ép', cls: 'bg-secondary-container text-on-secondary-container' },
    coldIcon: false,
    brandLine: 'Twister Tropicana • Nước Ép',
    title: 'Nước Cam Ép Twister Chai 450ml',
    promoTag: {
      text: 'Giàu Vitamin C từ nước cam',
      cls: 'text-secondary font-medium mt-0.5',
    },
    price: 11500,
    priceStr: '11.500đ',
    unit: '/chai',
  },
  {
    id: 'th-true-juice-tao',
    category: 'water',
    brand: 'TH true JUICE',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    discountPct: 20,
    img: 'https://cdn.hstatic.net/products/200001185942/nuoc-tao-tu-nhien-th-true-juice-1_1_6445b0f651354b9aa86b5b8d8189a182_92148e60348040c8a9b6a2ccc4373918.jpg',
    badgeLeft: { text: '-20%', cls: 'bg-primary-fixed text-on-primary-fixed-variant' },
    coldIcon: false,
    brandLine: 'TH true JUICE • Nước Ép Táo',
    title: 'Nước Táo Tự Nhiên TH true JUICE Chai 350ml',
    promoTag: {
      text: 'Chiết xuất trái cây tự nhiên',
      cls: 'text-secondary font-medium mt-0.5',
    },
    strikeStr: '19.200đ',
    price: 15360,
    priceStr: '15.360đ',
    unit: '/chai',
  },
  {
    id: 'revive-500',
    category: 'energy',
    brand: 'Revive',
    packType: 'pet',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/3226/83581/7up-revive-500ml_202609111556498730.jpg',
    badgeLeft: { text: 'Bù Khoáng', cls: 'bg-secondary text-on-secondary' },
    coldIcon: false,
    brandLine: '7Up Revive • Điện Giải',
    title: 'Nước Uống Bù Khoáng 7Up Revive Chai 500ml',
    promoTag: {
      text: 'Bù nước & điện giải sau vận động',
      cls: 'text-outline mt-0.5',
    },
    price: 12100,
    priceStr: '12.100đ',
    unit: '/chai',
  },
  {
    id: 'number1-th24',
    category: 'energy',
    brand: 'Number 1',
    packType: 'case24',
    isAlcoholic: false,
    isZeroCal: false,
    img: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/3226/87336/nuoc-tang-luc-number1-chai-330ml-th24_202609111517178620.jpg',
    badgeLeft: { text: 'Tăng Lực', cls: 'bg-primary text-on-primary' },
    coldIcon: false,
    brandLine: 'Number 1 • Năng Lượng',
    title: 'Thùng 24 Chai Nước Tăng Lực Number 1 330ml',
    promoTag: {
      text: 'Thùng 24 chai nạp nhanh năng lượng',
      cls: 'text-outline mt-0.5',
    },
    price: 245000,
    priceStr: '245.000đ',
    unit: '/thùng',
  },
];

export const BeveragesPage: React.FC<BeveragesPageProps> = ({
  onNavigate,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [packChecks, setPackChecks] = useState<string[]>(['can330', 'case24']);
  const [temperature, setTemperature] = useState('chilled');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Tiger', 'Coca-Cola']);
  const [needChecks, setNeedChecks] = useState<string[]>(['zero']);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [sortOption, setSortOption] = useState('Bán chạy nhất (Hôm nay)');
  const [activePage, setActivePage] = useState(1);
  const [cartQtys, setCartQtys] = useState<Record<string, number>>({});
  const productListTopRef = React.useRef<HTMLElement>(null);

  const togglePackCheck = (id: string) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setSelectedBrands([]);
      setNeedChecks([]);
      setPackChecks([id]);
    } else {
      setPackChecks((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
    }
    setActivePage(1);
  };

  const toggleNeedCheck = (id: string) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setPackChecks([]);
      setSelectedBrands([]);
      setNeedChecks([id]);
    } else {
      setNeedChecks((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]));
    }
    setActivePage(1);
  };

  const toggleBrand = (brand: string) => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      setPackChecks([]);
      setNeedChecks([]);
      setSelectedBrands([brand]);
    } else {
      setSelectedBrands((prev) =>
        prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
      );
    }
    setActivePage(1);
  };

  const handleResetFilters = () => {
    setPackChecks([]);
    setNeedChecks([]);
    setSelectedBrands([]);
    setFiltersApplied(false);
    setActiveTab('all');
    setActivePage(1);
  };

  const handleQuickAdd = (id: string, price: number) => {
    setCartQtys((prev) => ({ ...prev, [id]: 1 }));
    onAddToCart(price, 1);
  };

  const handleStep = (id: string, price: number, delta: number) => {
    setCartQtys((prev) => {
      const next = (prev[id] ?? 0) + delta;
      if (delta > 0) {
        onAddToCart(price, 1);
      }
      if (next <= 0) {
        const rest = { ...prev };
        delete rest[id];
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeTab !== 'all' && p.category !== activeTab) {
      return false;
    }
    if (filtersApplied) {
      if (packChecks.length > 0 && !packChecks.includes(p.packType)) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      if (needChecks.length > 0) {
        const matchesNeed = needChecks.some((need) => {
          if (need === 'alc') return p.isAlcoholic;
          if (need === 'nonalc') return !p.isAlcoholic;
          if (need === 'zero') return p.isZeroCal;
          return false;
        });
        if (!matchesNeed) return false;
      }
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Giá: Thấp đến Cao') return a.price - b.price;
    if (sortOption === 'Giá: Cao đến Thấp') return b.price - a.price;
    if (sortOption === 'Khuyến mãi nhiều nhất') {
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
      {/* BREADCRUMB & CONTEXT ROW */}
      <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-desktop pt-space-md pb-space-xs">
        <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md overflow-x-auto whitespace-nowrap">
          <a
            className="hover:text-primary transition-colors flex items-center gap-1"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <span className="material-symbols-outlined text-[16px] text-outline">home</span>
            Trang chủ
          </a>
          <span className="text-outline-variant font-label-sm">/</span>
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
          <span className="text-outline-variant font-label-sm">/</span>
          <span className="text-primary font-semibold">Bia &amp; Nước ngọt</span>
        </nav>
      </div>

      {/* HERO SECTION */}
      <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-desktop mb-space-lg">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-container-low via-surface-container to-tertiary-fixed/30 p-space-lg md:p-space-xl shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    ac_unit
                  </span>
                  Giao lạnh sẵn theo yêu cầu
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                  Cam kết 30 phút nhận ngay
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-outline font-label-sm text-label-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Kèm đá sạch miễn phí khi mua thùng
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-xs">
                Bia Giải Khát, Nước Ngọt Có Ga &amp; Nước Ép Trái Cây
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Tiệc tùng vui vẻ hoặc giải nhiệt ngày nắng nóng. Có sẵn dịch vụ ướp lạnh đá giao liền không tính thêm phí, đủ mọi thương hiệu quốc dân.
              </p>

              <div className="flex items-center gap-space-lg mt-space-md pt-space-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      100% Chính Hãng
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      Đổi trả tại chỗ nếu móp bể
                    </span>
                  </div>
                </div>
                <div className="h-6 w-px bg-outline-variant/50 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]">thermostat</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      Chuẩn Lạnh 4°C - 6°C
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      Giao thùng giữ nhiệt chuyên dụng
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center shrink-0 w-64 p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="relative w-full h-32 rounded-lg overflow-hidden mb-space-xs">
                <img
                  alt="Combo Tiệc Cuối Tuần"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNK60APfsgUbf_Oy2apqrABjAlih_zR0cfVQ5089CTYngWW5MohmUhVbvMJB1aDnrCt89J3AI2pkMXSczrMxN39j1ktvu-wfUDpWKIm1hyC-a_avBlK20tXBREv0LizxPI6d7PeDNrqSMg7ZkkyZ9YO4TKznZRNmDn05GI0tY6DrwohVNBkUrY5fXy_H-hxOqWZxugPFGVFd_nXL-RaolVMoj0kexEBrb4HKzgeThd"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">
                  Giảm tới 25%
                </span>
              </div>
              <span className="font-label-md text-label-md text-primary font-bold">
                Combo Tiệc Cuối Tuần
              </span>
              <span className="font-label-sm text-label-sm text-outline text-center">
                Tặng túi đá tinh khiết 5kg cho đơn bia từ 350k
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY PILL TABS */}
      <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-desktop mb-space-lg">
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar" id="categoryTabGroup">
          {[
            { id: 'all', icon: 'apps', label: `Tất cả đồ uống (${PRODUCTS.length})` },
            {
              id: 'beer',
              icon: 'sports_bar',
              label: `Bia lon & Bia chai (${PRODUCTS.filter((p) => p.category === 'beer').length})`,
            },
            {
              id: 'soda',
              icon: 'local_drink',
              label: `Nước ngọt có ga (Coca, Pepsi, 7Up) (${PRODUCTS.filter((p) => p.category === 'soda').length})`,
            },
            {
              id: 'energy',
              icon: 'electric_bolt',
              label: `Trà đóng chai & Nước tăng lực (Redbull, Sting) (${PRODUCTS.filter((p) => p.category === 'energy').length})`,
            },
            {
              id: 'water',
              icon: 'water_drop',
              label: `Nước suối khoáng & Nước ép trái cây (${PRODUCTS.filter((p) => p.category === 'water').length})`,
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
                className={`cat-pill px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isActive
                    ? 'active bg-primary-container text-on-primary font-semibold'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CATALOG CONTENT */}
      <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-desktop mb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT SIDEBAR FILTER */}
          <aside className="lg:col-span-3 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  Bộ Lọc Đồ Uống
                </span>
                <button
                  type="button"
                  id="resetFilters"
                  onClick={handleResetFilters}
                  className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                >
                  Thiết lập lại
                </button>
              </div>

              {/* GROUP 1 */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wide">
                  Quy Cách Đóng Gói
                </span>
                <div className="space-y-1.5">
                  {[
                    {
                      id: 'can330',
                      label: 'Lon lẻ 330ml',
                      right: String(PRODUCTS.filter((p) => p.packType === 'can330').length),
                      hot: false,
                    },
                    {
                      id: 'pack6',
                      label: 'Lốc 6 lon tiện lợi',
                      right: String(PRODUCTS.filter((p) => p.packType === 'pack6').length),
                      hot: false,
                    },
                    { id: 'case24', label: 'Thùng 24 lon / chai (Tặng đá)', right: 'HOT', hot: true },
                    {
                      id: 'pet',
                      label: 'Chai nhựa PET / Thủy tinh',
                      right: String(PRODUCTS.filter((p) => p.packType === 'pet').length),
                      hot: false,
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2 font-body-md text-body-md text-on-surface">
                        <input
                          checked={packChecks.includes(opt.id)}
                          onChange={() => togglePackCheck(opt.id)}
                          className="rounded text-primary focus:ring-0 w-4 h-4 accent-primary cursor-pointer"
                          type="checkbox"
                        />
                        {opt.label}
                      </span>
                      <span
                        className={`font-label-sm text-label-sm ${
                          opt.hot ? 'text-secondary font-bold' : 'text-outline'
                        }`}
                      >
                        {opt.right}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* GROUP 2 */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wide">
                  Yêu Cầu Nhiệt Độ
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      temperature === 'chilled'
                        ? 'bg-secondary-fixed/20 hover:bg-secondary-fixed/30'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <input
                      checked={temperature === 'chilled'}
                      onChange={() => setTemperature('chilled')}
                      className="w-4 h-4 text-secondary accent-secondary cursor-pointer"
                      name="temperature"
                      type="radio"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-secondary-fixed-variant font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">mode_fan</span>
                        Ướp lạnh mát rượi
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary">
                        Khách dùng ngay lúc nhận
                      </span>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      temperature === 'room'
                        ? 'bg-secondary-fixed/20 hover:bg-secondary-fixed/30'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <input
                      checked={temperature === 'room'}
                      onChange={() => setTemperature('room')}
                      className="w-4 h-4 text-primary accent-primary cursor-pointer"
                      name="temperature"
                      type="radio"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        Giao thường (Trữ tủ nhà)
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        Nguyên niêm phong hãng
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* GROUP 3 */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wide">
                  Thương Hiệu Chọn Lọc
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Tiger',
                    'Heineken',
                    'Sài Gòn',
                    'Coca-Cola',
                    'Pepsi',
                    'Sprite',
                    'Fanta',
                    '7Up',
                    'Sting Dâu',
                    'C2 Chanh',
                    'Tea+',
                    'Không Độ',
                    'Fuze Tea',
                    'Lavie',
                    'Aquafina',
                    'Vĩnh Hảo',
                    'Twister',
                    'TH true JUICE',
                    'Revive',
                    'Number 1',
                  ].map((brand) => {
                    const isSelected = selectedBrands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => toggleBrand(brand)}
                        className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GROUP 4 */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wide">
                  Nhu Cầu Tiêu Dùng
                </span>
                <div className="space-y-1.5">
                  {[
                    { id: 'alc', label: 'Bia có cồn truyền thống (4.5% - 5%)' },
                    { id: 'nonalc', label: 'Bia không cồn (Heineken 0.0)' },
                    { id: 'zero', label: 'Không calo / Không đường (Zero Sugar)' },
                  ].map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 font-body-md text-body-md text-on-surface cursor-pointer">
                      <input
                        checked={needChecks.includes(opt.id)}
                        onChange={() => toggleNeedCheck(opt.id)}
                        className="rounded text-primary focus:ring-0 w-4 h-4 accent-primary cursor-pointer"
                        type="checkbox"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDEBAR HELPER WIDGET */}
            <div className="bg-gradient-to-br from-secondary-fixed/40 to-surface-container p-space-md rounded-xl shadow-sm">
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[24px]">kitchen</span>
                <div>
                  <p className="font-headline-sm text-label-md text-on-surface font-bold">
                    Thùng Xốp Giữ Lạnh Tận Bàn
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Đơn đặt từ 2 thùng bia sẽ tự động mượn thùng xốp giữ nhiệt và tặng kèm 1 bao đá 5kg hoàn toàn miễn phí.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT GRID */}
          <section
            ref={productListTopRef}
            className="lg:col-span-9 flex flex-col gap-space-md scroll-mt-40"
          >
            <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl shadow-sm">
              <div className="flex items-center gap-space-sm pl-space-xs">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Hiển thị {displayedProducts.length} / {totalProducts} sản phẩm
                </span>
                <span className="hidden sm:inline font-label-sm text-label-sm text-secondary bg-secondary-fixed/30 px-2 py-0.5 rounded-full">
                  Sẵn sàng giao 30p
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline">Sắp xếp:</span>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setActivePage(1);
                  }}
                  className="bg-surface-container-low font-label-md text-label-md text-on-surface rounded-full px-3 py-1.5 focus:outline-none focus:bg-surface-container-lowest cursor-pointer"
                >
                  <option>Bán chạy nhất (Hôm nay)</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                  <option>Khuyến mãi nhiều nhất</option>
                </select>
              </div>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-sm flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
                <p className="font-headline-sm text-on-surface font-semibold">
                  Không tìm thấy đồ uống phù hợp với bộ lọc hiện tại
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Thiết lập lại bộ lọc
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-gutter md:gap-gutter-desktop">
              {displayedProducts.map((product) => {
                const count = cartQtys[product.id] ?? 0;
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="relative w-full aspect-square rounded-lg bg-surface-container-low overflow-hidden mb-space-xs flex items-center justify-center">
                        <img
                          alt={product.title}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          src={product.img}
                        />
                        <span
                          className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${product.badgeLeft.cls}`}
                        >
                          {product.badgeLeft.text}
                        </span>
                        {product.coldIcon && (
                          <span
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-surface-container-lowest/90 flex items-center justify-center text-secondary shadow-sm"
                            title="Ướp lạnh sẵn"
                          >
                            <span className="material-symbols-outlined text-[14px]">ac_unit</span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-label-sm text-label-sm text-outline">{product.brandLine}</span>
                        <h3 className="font-headline-sm text-label-md text-on-surface line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                          {product.title}
                        </h3>
                        <span className={`font-label-sm text-label-sm ${product.promoTag.cls}`}>
                          {product.promoTag.text}
                        </span>
                      </div>
                    </div>

                    <div className="mt-space-sm pt-space-xs flex items-end justify-between">
                      <div className="flex flex-col">
                        {product.strikeStr && (
                          <span className="font-price-strike text-price-strike text-outline line-through">
                            {product.strikeStr}
                          </span>
                        )}
                        <span className="font-price-lg text-price-lg text-primary">
                          {product.priceStr}
                          <span className="text-xs font-normal text-outline">{product.unit}</span>
                        </span>
                      </div>

                      <div className="stepper-wrap flex items-center">
                        {count > 0 ? (
                          <div className="stepper-active flex items-center bg-primary-fixed rounded-full p-0.5 shadow-sm">
                            <button
                              type="button"
                              onClick={() => handleStep(product.id, product.price, -1)}
                              className="btn-minus w-7 h-7 rounded-full bg-surface-container-lowest text-primary font-bold flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="qty-count font-label-md text-label-md text-primary font-bold px-2">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStep(product.id, product.price, 1)}
                              className="btn-plus w-7 h-7 rounded-full bg-surface-container-lowest text-primary font-bold flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product.id, product.price)}
                            className="quick-add-btn w-8 h-8 rounded-full bg-primary-fixed hover:bg-primary text-primary hover:text-on-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {/* PAGINATION SECTION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg">
              <span className="font-body-sm text-body-sm text-outline">
                Hiển thị trang {currentPage} trong tổng số {totalPages} trang ({totalProducts} sản phẩm)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-9 h-9 rounded-lg bg-surface-container-low text-outline hover:bg-surface-container flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg font-label-md text-label-md flex items-center justify-center shadow-sm transition-colors cursor-pointer ${
                      currentPage === p
                        ? 'bg-primary text-on-primary font-bold'
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
                  className="w-9 h-9 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary flex items-center justify-center shadow-sm transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* SERVICE BANNER: PARTY CALL-OUT 30 MINS */}
      <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-desktop mb-space-xl">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-tertiary text-on-primary p-space-lg md:p-space-xl shadow-md">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-space-lg">
            <div className="flex items-center gap-space-md">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center text-on-primary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[32px]">celebration</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed font-bold">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping" />
                  Cứu nguy tiệc gấp - Không lo hết đồ uống
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-primary leading-tight mt-0.5">
                  Tiệc Gấp Gọi Hotline{' '}
                  <span className="text-secondary-fixed underline decoration-secondary-fixed/50">
                    1900 8888
                  </span>
                </h2>
                <p className="font-body-md text-body-md text-on-primary/90 mt-1 max-w-xl">
                  Giao bia ướp lạnh thùng xốp + đá sạch trong 30 phút. Tài xế hỗ trợ khuân vác lên tận căn hộ, phòng tiệc.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm shrink-0">
              <a
                className="px-6 py-3 rounded-full bg-surface-container-lowest text-primary hover:bg-primary-fixed font-headline-sm text-headline-sm font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                href="tel:19008888"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                Gọi 1900 8888
              </a>
              <button
                type="button"
                className="px-5 py-3 rounded-full bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 backdrop-blur-md text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Nhắn Zalo OA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
