import React, { useEffect, useState } from 'react';
import { PageId } from '../types';

interface HomePageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onAddToCart: (price: number, qty?: number) => void;
}

const FRESH_SEGMENTS = [
  'Tất cả tươi sống',
  'Rau xanh an toàn',
  'Thịt heo, bò, gà',
  'Hải sản tươi ngày',
  'Trái cây nhiệt đới',
] as const;

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onAddToCart }) => {
  const [totalSeconds, setTotalSeconds] = useState(1 * 3600 + 45 * 60 + 20);
  const [activeSegment, setActiveSegment] = useState<string>('Tất cả tươi sống');
  const [caiNgotQty, setCaiNgotQty] = useState(1);
  const [addedFlashId, setAddedFlashId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTotalSeconds((prev) => (prev <= 1 ? 2 * 3600 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  const handleQuickAdd = (id: string, price: number, qty = 1) => {
    onAddToCart(price, qty);
    setAddedFlashId(id);
    window.setTimeout(() => {
      setAddedFlashId((curr) => (curr === id ? null : curr));
    }, 1000);
  };

  const sidebarItems: {
    page: PageId;
    label: string;
    icon: string;
    iconBoxClass: string;
    badge?: string;
  }[] = [
    {
      page: 'fresh-produce',
      label: 'Rau củ quả tươi',
      icon: 'spa',
      iconBoxClass: 'bg-secondary-fixed/40 text-secondary',
      badge: 'Sáng nay',
    },
    {
      page: 'meat-seafood',
      label: 'Thịt & Hải sản',
      icon: 'kebab_dining',
      iconBoxClass: 'bg-primary-fixed text-primary',
    },
    {
      page: 'eggs-tofu',
      label: 'Trứng & Đậu hũ',
      icon: 'egg',
      iconBoxClass: 'bg-surface-container text-primary',
    },
    {
      page: 'spices-sauces',
      label: 'Gia vị & Nước mắm',
      icon: 'soup_kitchen',
      iconBoxClass: 'bg-tertiary-fixed text-tertiary',
    },
    {
      page: 'noodles-dry',
      label: 'Mì tôm & Đồ khô',
      icon: 'ramen_dining',
      iconBoxClass: 'bg-primary-fixed-dim/40 text-on-primary-fixed-variant',
    },
    {
      page: 'dairy-snacks',
      label: 'Sữa & Bánh kẹo',
      icon: 'cookie',
      iconBoxClass: 'bg-secondary-fixed/30 text-secondary',
    },
    {
      page: 'beverages',
      label: 'Bia & Nước ngọt',
      icon: 'local_drink',
      iconBoxClass: 'bg-surface-container-high text-primary',
    },
    {
      page: 'household-laundry',
      label: 'Hóa phẩm giặt xả',
      icon: 'clean_hands',
      iconBoxClass: 'bg-tertiary-fixed-dim/40 text-on-tertiary-container',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION & PROMOTIONS */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop py-space-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-stretch">
          {/* Category Quick Sidebar / Rail (Span 3) */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col bg-surface-container-lowest rounded-xl p-space-md shadow-sm justify-between">
            <div className="flex items-center justify-between pb-space-xs mb-space-xs">
              <span className="font-headline-sm text-label-md text-on-surface uppercase tracking-wide">
                Danh Mục Thường Mua
              </span>
              <span className="material-symbols-outlined text-outline text-[18px]">tune</span>
            </div>
            <nav className="flex flex-col gap-1.5">
              {sidebarItems.map((item) => (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center material-symbols-outlined text-[18px] ${item.iconBoxClass}`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                  </div>
                  {item.badge ? (
                    <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/30 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-outline text-[16px] group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm mt-space-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">phone_in_talk</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline">Giao đồ ăn trưa &amp; chiều</span>
                <span className="font-label-md text-label-md text-primary font-bold">1900 8888</span>
              </div>
            </div>
          </aside>

          {/* Main Banner Canvas (Span 6) */}
          <div className="lg:col-span-6 relative rounded-xl overflow-hidden bg-gradient-to-tr from-primary-fixed via-tertiary-fixed to-surface-container p-6 sm:p-8 flex flex-col justify-between shadow-sm min-h-[340px]">
            <div className="relative z-10 flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md self-start text-primary font-label-md text-label-md shadow-xs">
                <span className="material-symbols-outlined text-primary text-[16px]">local_fire_department</span>
                <span>LỄ HỘI NÔNG SẢN &amp; NHU YẾU PHẨM</span>
              </div>
              <h2 className="font-display-lg text-display-lg text-on-primary-fixed font-bold leading-tight mt-1 tracking-tight">
                ĐẠI TIỆC TẠP HÓA SỐ
                <br />
                <span className="text-primary">GIẢM ĐẾN 40%</span>
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Giao siêu tốc 30 phút từ tạp hóa gần nhà bạn nhất. Hàng tươi sạch mỗi sớm mai, đổi trả tận cửa nếu
                không hài lòng.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-3 pt-4">
              <button
                className="px-5 py-2.5 bg-primary hover:bg-on-primary-container text-on-primary rounded-full font-headline-sm text-label-md shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                type="button"
                onClick={() => onNavigate('fresh-produce')}
              >
                <span>Đi Chợ Ngay</span>
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
              </button>
              <div className="flex items-center gap-2 bg-surface-container-lowest/70 backdrop-blur-md px-3.5 py-2 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  85 shipper đang sẵn sàng giao
                </span>
              </div>
            </div>
            {/* Decorative Illustration Background Elements */}
            <div className="absolute -right-8 -bottom-6 w-56 h-56 rounded-full bg-primary-container/20 blur-2xl pointer-events-none"></div>
            <div className="absolute right-4 bottom-4 w-44 h-44 hidden sm:block opacity-90 pointer-events-none">
              <img
                alt="Giỏ hàng tạp hóa tươi ngon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE3l2cqJ_eauCiCzby93ePIzVugG2Avu6Rkk_uCDdN4xsLBY5lB2yFYP92KdL2I3FXBZXL9CneYeUdW0GXCp1OyMOWrnZzEYRTAqlXMHNxyVGgU76F8mRs-XEbF_yrnIl22Mc6Rr1gwV00GWt_W6RV5u-FGtbXqTCVpVXkvpL8O3arq17LAY4SqxYvV1xvTr-JIrc1A9cQQ77MPsmU7aB2wwgzq18vTkibJ_vCXso"
              />
            </div>
          </div>

          {/* Right 2 Mini Banners (Span 3) */}
          <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-gutter-desktop">
            {/* Mini Banner 1: Combo 99k */}
            <div className="flex-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <span className="font-label-sm text-label-sm uppercase bg-secondary-fixed/50 text-secondary px-2 py-0.5 rounded font-bold">
                  Gợi ý tiết kiệm
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-2 font-bold leading-snug">
                  Combo Nấu Cơm Gia Đình 99k
                </h3>
                <p className="font-body-sm text-body-sm text-outline mt-1">
                  Đủ thịt, rau, canh cho cả nhà 4 người no nê.
                </p>
              </div>
              <div className="relative z-10 mt-4 flex items-center justify-between">
                <span className="font-price-lg text-price-lg text-primary font-bold">99.000đ</span>
                <button
                  type="button"
                  onClick={() => handleQuickAdd('mini-combo', 99000)}
                  className="px-3 py-1.5 bg-primary-fixed hover:bg-primary-container text-on-primary-fixed-variant rounded-full font-label-md text-label-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{addedFlashId === 'mini-combo' ? 'Đã thêm' : 'Xem ngay'}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-20 pointer-events-none">
                <span className="material-symbols-outlined text-[100px] text-secondary">restaurant</span>
              </div>
            </div>

            {/* Mini Banner 2: 100% Return Policy */}
            <div className="flex-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <span className="font-label-sm text-label-sm uppercase bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                  Cam kết an tâm
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-2 font-bold leading-snug">
                  Bảo Hiểm Đổi Trả 100% Trong 24h
                </h3>
                <p className="font-body-sm text-body-sm text-outline mt-1">
                  Rau dập, thịt không ưng, hoàn tiền hoặc đổi ngay tại cửa.
                </p>
              </div>
              <div className="relative z-10 mt-4 flex items-center gap-2 text-secondary font-label-md text-label-md">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                <span>Không thủ tục phiền hà</span>
              </div>
              <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-20 pointer-events-none">
                <span className="material-symbols-outlined text-[100px] text-primary">published_with_changes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Commitments Strip */}
        <div className="mt-space-md bg-surface-container-lowest rounded-xl p-space-md shadow-sm grid grid-cols-2 md:grid-cols-4 gap-space-md text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-sm text-label-md text-on-surface font-bold">Giao Nhanh 30 Phút</span>
              <span className="font-body-sm text-body-sm text-outline">Đúng giờ cơm trưa &amp; tối</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[22px]">grass</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-sm text-label-md text-on-surface font-bold">Rau Tươi Hái Sáng</span>
              <span className="font-body-sm text-body-sm text-outline">Nhập mới mỗi ngày từ Đà Lạt</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-sm text-label-md text-on-surface font-bold">Giá Bình Ổn Phố</span>
              <span className="font-body-sm text-body-sm text-outline">Đúng giá niêm yết tiệm quen</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">assignment_return</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-sm text-label-md text-on-surface font-bold">Đổi Trả Tận Cửa</span>
              <span className="font-body-sm text-body-sm text-outline">1 click shipper tới nhận lại</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLASH SALE: GIỜ VÀNG GIÁ SỐC */}
      <section id="flash-sale" className="max-w-7xl mx-auto w-full px-margin-desktop py-space-lg">
        <div className="bg-gradient-to-r from-primary-fixed/80 via-surface-container-lowest to-surface-container-low rounded-xl p-space-md sm:p-space-lg shadow-sm">
          {/* Flash Sale Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md mb-space-md">
            <div className="flex flex-wrap items-center gap-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[28px] animate-bounce">bolt</span>
                <h2 className="font-headline-lg text-headline-lg text-primary uppercase font-bold tracking-tight">
                  Giờ Vàng Giá Sốc
                </h2>
              </div>
              {/* Countdown Timer */}
              <div className="flex items-center gap-1.5 bg-on-primary-container text-on-primary px-3 py-1 rounded-full font-headline-sm text-label-md">
                <span className="font-label-sm text-label-sm text-outline-variant mr-1">Kết thúc sau:</span>
                <span className="bg-primary px-1.5 py-0.5 rounded font-bold" id="fs-hours">
                  {hours}
                </span>
                <span>:</span>
                <span className="bg-primary px-1.5 py-0.5 rounded font-bold" id="fs-minutes">
                  {minutes}
                </span>
                <span>:</span>
                <span className="bg-primary px-1.5 py-0.5 rounded font-bold" id="fs-seconds">
                  {seconds}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('noodles-dry')}
              className="font-label-md text-label-md text-primary hover:text-on-primary-container flex items-center gap-1 font-semibold group cursor-pointer"
            >
              <span>Xem tất cả ưu đãi chớp nhoáng</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* 5 Flash Sale Product Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-md">
            {/* Flash Item 1: Dầu ăn Simply */}
            <article className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Dầu ăn Simply đậu nành nguyên chất 1L"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXp4-3TA0-pAlWDmVac-FwMtByXDCgU-KBTYv6Rai3kDTKWlOxnULl1b9dDryPHJ2B8JH-O2gJc9sS_cmmpv-MEJZaNVBjGFZ30JDigFXAUQsQN759Y7yJ7FXD-dWdkcy06V7vInG3WLRKlTcSL_knOkkRcB_QWSv8uQgAbm0DzhLqq7DHmci3g8h-qOm97QeUvmSoaS5YUNBIpMWDOCwnJn8pDWmlsgCOQMambgQ"
                />
                <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                  -26%
                </span>
                <span className="absolute bottom-2 left-2 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] px-1.5 py-0.5 rounded font-semibold">
                  Chỉ hôm nay
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-label-md text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  Dầu ăn Simply đậu nành nguyên chất 1L
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-lg text-price-lg text-primary font-bold">48.000đ</span>
                  <span className="font-price-strike text-price-strike text-outline line-through">65.000đ</span>
                </div>
                <div className="w-full mt-1.5">
                  <div className="flex justify-between font-label-sm text-[10px] text-outline mb-1">
                    <span>Đã bán 78%</span>
                    <span className="text-primary font-semibold">Còn 12 chai</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleQuickAdd('fs-1', 48000)}
                className={`mt-space-sm w-full py-2 font-label-md text-label-md rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-95 cursor-pointer ${
                  addedFlashId === 'fs-1'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-on-primary-fixed-variant hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {addedFlashId === 'fs-1' ? 'check' : 'add_shopping_cart'}
                </span>
                <span>{addedFlashId === 'fs-1' ? 'Đã thêm' : '+ Thêm Vào Giỏ'}</span>
              </button>
            </article>

            {/* Flash Item 2: Mì Hảo Hảo */}
            <article className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Thùng 30 gói mì Hảo Hảo Tôm Chua Cay"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGIKSaNMAt29m4xsCXliVd1RU9C9bsMUOKKfobW8AbsnPBgOF2VGJpoeEKAG5cFKaa1yg1eQRYoE9n1zc-3xKYw6yx83ZbA5bCCgTi9p7b3sZcgh7P7MDVj5WmeQYc6SQOG3QCj68aH5nTIipcb-zKUnjUatgenpXtOGGWRye7bT7GVehc8tuALIOUa29LAST__NZrHNZPvF-0mjaq4KP0oQQfx-XzJkZmRkb8CaU"
                />
                <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                  -17%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-label-md text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  Thùng 30 gói mì Hảo Hảo Tôm Chua Cay
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-lg text-price-lg text-primary font-bold">112.000đ</span>
                  <span className="font-price-strike text-price-strike text-outline line-through">135.000đ</span>
                </div>
                <div className="w-full mt-1.5">
                  <div className="flex justify-between font-label-sm text-[10px] text-outline mb-1">
                    <span>Đã bán 91%</span>
                    <span className="text-primary font-semibold">Sắp hết!</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleQuickAdd('fs-2', 112000)}
                className={`mt-space-sm w-full py-2 font-label-md text-label-md rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-95 cursor-pointer ${
                  addedFlashId === 'fs-2'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-on-primary-fixed-variant hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {addedFlashId === 'fs-2' ? 'check' : 'add_shopping_cart'}
                </span>
                <span>{addedFlashId === 'fs-2' ? 'Đã thêm' : '+ Thêm Vào Giỏ'}</span>
              </button>
            </article>

            {/* Flash Item 3: Thịt ba chỉ VietGAP */}
            <article className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Thịt ba chỉ heo tươi VietGAP 500g"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBls5kil6nPIieOQieXbtkE8NbQ9EpcVvI4iSLE_I09eGxQY99jlOP5pJ9N2pVVMHS6TPhhIZBJFntQUoEUCKkNHnBI-bOC2V64M5wnfaNRlw2Ea087c09RVWx_GMxeD2pU5Ew5o_ZioBPiPHIsKdXJJ7mnl3MxCE_oggK82DJfHX36dS9Xu7Mawf-_SUGREK-ociYQvfdhNvyvNEl-a5y4JJixjD7MC9qJi_fxVz8"
                />
                <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                  -27%
                </span>
                <span className="absolute top-2 right-2 bg-secondary text-on-secondary font-label-sm text-[10px] px-1.5 py-0.5 rounded font-semibold">
                  VietGAP
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-label-md text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  Thịt ba chỉ heo tươi VietGAP 500g
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-lg text-price-lg text-primary font-bold">62.000đ</span>
                  <span className="font-price-strike text-price-strike text-outline line-through">85.000đ</span>
                </div>
                <div className="w-full mt-1.5">
                  <div className="flex justify-between font-label-sm text-[10px] text-outline mb-1">
                    <span>Đã bán 65%</span>
                    <span className="text-outline">Còn 24 khay</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleQuickAdd('fs-3', 62000)}
                className={`mt-space-sm w-full py-2 font-label-md text-label-md rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-95 cursor-pointer ${
                  addedFlashId === 'fs-3'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-on-primary-fixed-variant hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {addedFlashId === 'fs-3' ? 'check' : 'add_shopping_cart'}
                </span>
                <span>{addedFlashId === 'fs-3' ? 'Đã thêm' : '+ Thêm Vào Giỏ'}</span>
              </button>
            </article>

            {/* Flash Item 4: Nước mắm Nam Ngư */}
            <article className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Nước mắm Nam Ngư Đệ Nhị 900ml"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw2FnC_E4Z9vAjFwLuYkyrq7hCneACkvYb3ygjHyAKjx5uVPHOPxp7FwzQLh0wgtLZs7VBTvgcM9kscewNq0Ysw_V6zoKl06Wjuw8enFFS7MkcQ498xeJ1ZBGIjrou8KMmEp6IwNcq25TmCkmC9lDDDcADGFAuj5FMFlEkfNBJk2sBCTc8zYaEjYSANsg6w4Nag1iZvRv_vTN0g_pW3SqexiDt3zxuIDRlobQhsXk"
                />
                <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                  -25%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-label-md text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  Nước mắm Nam Ngư Đệ Nhị 900ml
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-lg text-price-lg text-primary font-bold">24.000đ</span>
                  <span className="font-price-strike text-price-strike text-outline line-through">32.000đ</span>
                </div>
                <div className="w-full mt-1.5">
                  <div className="flex justify-between font-label-sm text-[10px] text-outline mb-1">
                    <span>Đã bán 84%</span>
                    <span className="text-outline">Còn 8 chai</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleQuickAdd('fs-4', 24000)}
                className={`mt-space-sm w-full py-2 font-label-md text-label-md rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-95 cursor-pointer ${
                  addedFlashId === 'fs-4'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-on-primary-fixed-variant hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {addedFlashId === 'fs-4' ? 'check' : 'add_shopping_cart'}
                </span>
                <span>{addedFlashId === 'fs-4' ? 'Đã thêm' : '+ Thêm Vào Giỏ'}</span>
              </button>
            </article>

            {/* Flash Item 5: Sữa tươi Vinamilk */}
            <article className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Lốc 4 hộp Sữa tươi Vinamilk ít đường 180ml"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxLfyVaf8EqmL-cHLFvDk8UhUidI_No_uUHayUP3NHMUke2gxqoZ7foGMn0gsLTh0PzGsdBGC8eRU98vxapucYU_IaMjTirITn_2HakYE_wEGL5PXBqK5-40E7DmaTzDQZRGTppv8JW4iFXNoBxgQwAaOsjH8RAEcHpeNCoLZ99aHNGJm54WaZ_HhApQUPH_VveBy9OB63YNvP8RALram99EHWbS71EEhbU3cqdlM"
                />
                <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                  -24%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-label-md text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  Lốc 4 hộp Sữa tươi Vinamilk ít đường 180ml
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-lg text-price-lg text-primary font-bold">29.000đ</span>
                  <span className="font-price-strike text-price-strike text-outline line-through">38.000đ</span>
                </div>
                <div className="w-full mt-1.5">
                  <div className="flex justify-between font-label-sm text-[10px] text-outline mb-1">
                    <span>Đã bán 72%</span>
                    <span className="text-outline">Còn 35 lốc</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleQuickAdd('fs-5', 29000)}
                className={`mt-space-sm w-full py-2 font-label-md text-label-md rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-95 cursor-pointer ${
                  addedFlashId === 'fs-5'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-on-primary-fixed-variant hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {addedFlashId === 'fs-5' ? 'check' : 'add_shopping_cart'}
                </span>
                <span>{addedFlashId === 'fs-5' ? 'Đã thêm' : '+ Thêm Vào Giỏ'}</span>
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* 3. ĐI CHỢ HÔM NAY - THỰC PHẨM TƯƠI SỐNG */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop py-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-md">
          <div>
            <div className="flex items-center gap-2 text-secondary font-label-md text-label-md mb-1 font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>TIÊU CHUẨN XANH - NÔNG TRẠI ĐẾN BÀN ĂN</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Đi Chợ Hôm Nay - Thực Phẩm Tươi Sống
            </h2>
          </div>
          {/* Segment Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {FRESH_SEGMENTS.map((seg) => (
              <button
                key={seg}
                type="button"
                onClick={() => setActiveSegment(seg)}
                className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer ${
                  activeSegment === seg
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Grid Cards with Stepper Controllers */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
          {/* Fresh 1: Cải ngọt Đà Lạt */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Cải ngọt Đà Lạt bó 500g"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKjXiQefJ3IELYpjYWkh4Jdc5zhZikli7AnucSH2f4M7rP_FOOdEVR2A6b34Ah6tySedkKr39kRIp0VEjLHldavyQHySg3rffLBBqAQW5RvP7aHwuZFPAQJou1ARgQhl3uMkW0OqmKZV2upYReOl5R0lp47tHblp4OIrxwzVqIqPT6bok-A03dnBn_pXxlOkA_u45hcaK7sD00A8JCHuhVYBdbBEmphtNLR7ImTcE"
                />
                <span className="absolute top-2 left-2 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Tươi mới lúc 6h sáng
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Bó 500g • VietGAP Đà Lạt</span>
              <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-1 mt-0.5">
                Cải ngọt Đà Lạt bó 500g
              </h3>
              <div className="flex items-center gap-1 mt-1 text-primary text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-sm text-label-sm font-bold text-on-surface">4.9</span>
                <span className="font-body-sm text-body-sm text-outline">(128)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-space-md pt-space-xs">
              <div>
                <span className="font-price-lg text-price-lg text-primary font-bold">14.000đ</span>
              </div>
              <div className="flex items-center bg-surface-container-low rounded-full p-1">
                <button
                  onClick={() => setCaiNgotQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full bg-surface-container-lowest text-on-surface hover:text-primary flex items-center justify-center font-bold shadow-xs hover:bg-surface-container cursor-pointer"
                  type="button"
                >
                  -
                </button>
                <span className="px-2 font-label-md text-label-md font-bold text-on-surface">{caiNgotQty}</span>
                <button
                  onClick={() => {
                    setCaiNgotQty((q) => q + 1);
                    onAddToCart(14000, 1);
                  }}
                  className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-xs hover:bg-primary cursor-pointer"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Fresh 2: Cà chua bi hữu cơ */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Cà chua bi hữu cơ 300g"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMe-PZi16_DoTrfAy-JPTCg7xsZIDTy6xxmWAxcf8mGbIidrwO1lkb-E8GBly8VxJGdYDnDvA7UL_-3Cv8K99deRqCxUcnUMVWgmu6hRJFn-GXJOPNUROFQuzUs1E0h_6vzV5g91e7gw9FS9MmU8-rVKgvgFjlDlDcfr82BL_OunBlpxR-Oecv6d6BU3xu06s62S1vtagzbCtLPgHkpaVtIBPBRYEpRGIlISmqrBY"
                />
                <span className="absolute top-2 left-2 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Chuẩn hữu cơ
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Hộp 300g • Rau an toàn</span>
              <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-1 mt-0.5">
                Cà chua bi hữu cơ 300g
              </h3>
              <div className="flex items-center gap-1 mt-1 text-primary text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-sm text-label-sm font-bold text-on-surface">4.8</span>
                <span className="font-body-sm text-body-sm text-outline">(94)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-space-md pt-space-xs">
              <div>
                <span className="font-price-lg text-price-lg text-primary font-bold">18.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('fresh-2', 18000)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  addedFlashId === 'fresh-2'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-primary hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedFlashId === 'fresh-2' ? 'check' : 'add'}
                </span>
              </button>
            </div>
          </div>

          {/* Fresh 3: Ức gà phi lê CP */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Ức gà phi lê tươi CP 500g"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC-6RUpa3Ul_yYTAQHDrSmDAs9K14V4N6OVBVVWkBvRRn2mmjh5onarizda3TeC-lbdyCAGdTqRhyKmVmSlx0PUW14BRL8BE-h9dMR2RJ1UOm_9lUnBhh3PV6S7sXjnPFe19vv2JcVjdLI3V674ysQkgl5owNU_cnKAPANRxeOSTS61yIStW_7_FjpevKUM0SNvaJcg_SD3OjAU26jjihfF2Wev_kAoRmMs9X--iI"
                />
                <span className="absolute top-2 left-2 bg-primary-fixed text-primary font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  Thịt mát 0-4°C
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Khay 500g • CP Food</span>
              <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-1 mt-0.5">
                Ức gà phi lê tươi CP 500g
              </h3>
              <div className="flex items-center gap-1 mt-1 text-primary text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-sm text-label-sm font-bold text-on-surface">5.0</span>
                <span className="font-body-sm text-body-sm text-outline">(215)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-space-md pt-space-xs">
              <div>
                <span className="font-price-lg text-price-lg text-primary font-bold">42.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('fresh-3', 42000)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  addedFlashId === 'fresh-3'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-primary hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedFlashId === 'fresh-3' ? 'check' : 'add'}
                </span>
              </button>
            </div>
          </div>

          {/* Fresh 4: Cá hồi phi lê nhập khẩu */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Cá hồi phi lê nhập khẩu 200g"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8VydmqOyN95vElT0JkDyB6emRC5qELu_6in_n1alVUJj_fRGfG5r1jUziXwjdQfVCrvvAS2iN10oiPpe2bdNm-GTD1Pjj5vr2GZckMK1xqNqEzRnLjBQmZH4voKul2eWmNVyKFHjUebGYgZZoe5hEMzJtpn2wfXFo5nuEXkZDhkLZtEv51m_TgT6ifesGe3drkGD9qj1zHieuKL-otNa9XbDtEOq4bPYZXvJDMC0"
                />
                <span className="absolute top-2 left-2 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  Nauy Bay Air
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Khay 200g • Sashimi grade</span>
              <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-1 mt-0.5">
                Cá hồi phi lê nhập khẩu 200g
              </h3>
              <div className="flex items-center gap-1 mt-1 text-primary text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-sm text-label-sm font-bold text-on-surface">4.9</span>
                <span className="font-body-sm text-body-sm text-outline">(89)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-space-md pt-space-xs">
              <div>
                <span className="font-price-lg text-price-lg text-primary font-bold">85.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('fresh-4', 85000)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  addedFlashId === 'fresh-4'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-primary hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedFlashId === 'fresh-4' ? 'check' : 'add'}
                </span>
              </button>
            </div>
          </div>

          {/* Fresh 5: Trứng gà Ba Huân */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Trứng gà Ba Huân hộp 10 quả"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuMRVLGGAr03XUXUaxWCAIgtcAKfHRNQlmmXZxo9llPyvdnFaX-Myq-FyAAJkq6-euWpspLLCHewa2hSuScyf3SfM0tWpETc8a1xvtbpCtvOWe013Ur5magMAkaCtTPiia6re-PrBaluAp34Uu17Pcq4Wpiq9TgbXcbGRNkpuKmKswunh-fwbYjUwNuBgSjxJKY-K9IrVT--pzUKKgwE4h9Hxw_oY2Rl1qCUqrmag"
                />
                <span className="absolute top-2 left-2 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  Kiểm dịch thú y
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Hộp 10 quả • Size L</span>
              <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-1 mt-0.5">
                Trứng gà Ba Huân hộp 10 quả
              </h3>
              <div className="flex items-center gap-1 mt-1 text-primary text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-sm text-label-sm font-bold text-on-surface">5.0</span>
                <span className="font-body-sm text-body-sm text-outline">(450)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-space-md pt-space-xs">
              <div>
                <span className="font-price-lg text-price-lg text-primary font-bold">29.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('fresh-5', 29000)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  addedFlashId === 'fresh-5'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-primary hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedFlashId === 'fresh-5' ? 'check' : 'add'}
                </span>
              </button>
            </div>
          </div>

          {/* Fresh 6: Cam sành Vĩnh Long */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Cam sành Vĩnh Long mọng nước 1kg"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbCDmoT7L_VGfY4RwckVFC3UxogVOYseaVDV4nxQVyOKIFA3NYIogteHh4ZEhTL0SSiPoDngCPGRj_LvMgpmWcwu-LYH8BaFaOmlkFKCLvbTxuJNfR3VZ6uVSVcC7omvuavY5CdghZm6Jrpzs77aYf88QWExxIOLYJ4jZM8ONq00F1pLhbfIe_YxEI4TCPQR9g1bb1JzeluhNemWyQOPy4JRkwW7nCTHm4XMqWMj8"
                />
                <span className="absolute top-2 left-2 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  Vắt nước ngọt lịm
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Túi 1kg • Miền Tây</span>
              <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-1 mt-0.5">
                Cam sành Vĩnh Long mọng nước 1kg
              </h3>
              <div className="flex items-center gap-1 mt-1 text-primary text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-sm text-label-sm font-bold text-on-surface">4.7</span>
                <span className="font-body-sm text-body-sm text-outline">(182)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-space-md pt-space-xs">
              <div>
                <span className="font-price-lg text-price-lg text-primary font-bold">25.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('fresh-6', 25000)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  addedFlashId === 'fresh-6'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-primary hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedFlashId === 'fresh-6' ? 'check' : 'add'}
                </span>
              </button>
            </div>
          </div>

          {/* Fresh 7: Táo Envy New Zealand */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Táo Envy New Zealand khay 3 trái"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXwDb7hJ06V3xzRI0fb6V2IDDB1yA4k10O8WBjOSily2rid0pJG361eJHdZ4HcNe_VZcKWUYrJ0K3QtQJLnRNUVdCr6B7CLUpvokT_V7r11NQvcOhcUSzUB2Qnp4IZml63FNMKmBJUpO-3WezjNsmgxl6s5Rh6OIRMKxeSgM1HPYdRAMFfiT2c3JYfSF3eMJ5EXmV-Dv3ZkD1CPN-CMoVIKRmdFz0q-uZKOOWfTIo"
                />
                <span className="absolute top-2 left-2 bg-primary-fixed text-primary font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  Giòn ngọt đậm vị
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Khay 3 trái • Nhập khẩu</span>
              <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-1 mt-0.5">
                Táo Envy New Zealand khay 3 trái
              </h3>
              <div className="flex items-center gap-1 mt-1 text-primary text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-sm text-label-sm font-bold text-on-surface">4.9</span>
                <span className="font-body-sm text-body-sm text-outline">(310)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-space-md pt-space-xs">
              <div>
                <span className="font-price-lg text-price-lg text-primary font-bold">49.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('fresh-7', 49000)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  addedFlashId === 'fresh-7'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-primary hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedFlashId === 'fresh-7' ? 'check' : 'add'}
                </span>
              </button>
            </div>
          </div>

          {/* Fresh 8: Đậu hũ trắng sạch làng Mơ */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-sm">
                <img
                  alt="Đậu hũ trắng sạch làng Mơ khay 4 miếng"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2cnrroMUoYE1vXcKn51d4CO2VSLWEUEJYqKshRuNYRsW4fMlKsDreFldJZrK8u8ad9UOZ-H5psOZn9sSbXG1XS6TzXOevmJV4yKC-YCkjRDnmZIom4ztLHiAOB-VubUPpBTp3ItOOVlrOvN_fEwy9U1BzDTec9ap9wAdFUEGQGk-kU-6BQgoHTtNev6bPBttHQ3GzurAxyiBSspqSQKhgPB7NWyVYNwgV_ixAjBE"
                />
                <span className="absolute top-2 left-2 bg-secondary-fixed/90 text-on-secondary-fixed-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  Làm mới mỗi ngày
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Khay 4 miếng • Đậu nành ta</span>
              <h3 className="font-headline-sm text-label-md text-on-surface font-semibold line-clamp-1 mt-0.5">
                Đậu hũ trắng sạch làng Mơ khay 4 miếng
              </h3>
              <div className="flex items-center gap-1 mt-1 text-primary text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-sm text-label-sm font-bold text-on-surface">4.8</span>
                <span className="font-body-sm text-body-sm text-outline">(76)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-space-md pt-space-xs">
              <div>
                <span className="font-price-lg text-price-lg text-primary font-bold">12.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('fresh-8', 12000)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  addedFlashId === 'fresh-8'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-fixed hover:bg-primary text-primary hover:text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedFlashId === 'fresh-8' ? 'check' : 'add'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMBO ĐI CHỢ TIẾT KIỆM CHO GIA ĐÌNH */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop py-space-lg">
        <div className="flex items-center justify-between mb-space-md">
          <div>
            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
              Tiết Kiệm Thời Gian &amp; Chi Phí
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Combo Đi Chợ Tiết Kiệm Cho Gia Đình
            </h2>
          </div>
          <span className="hidden sm:inline font-label-md text-label-md text-secondary bg-secondary-fixed/30 px-3 py-1 rounded-full font-bold">
            🥗 Đầy đủ dinh dưỡng chuẩn bữa cơm Việt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
          {/* Combo 1: Bữa cơm thuần Việt */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="w-full h-44 rounded-lg overflow-hidden bg-surface-container-low mb-space-md relative">
                <img
                  alt="Combo Bữa Cơm Thuần Việt"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZIi0T2_n6R3UUbQb_R9A_gsD1tD33F4ToROCbi4JRJUsWzwkilrCCc3YvVZOQgnMaL0qQAx-HMxvUZOqFL50OBkdvh0-MoyuvntGoE-K7xmEJG_sx3a2GAHiuvG0ZFUEfYiNT2eb1349zOPhsXkh2IGuJWB9NMxxNTmVEY4RkqxTq58LwF8rAHFTlpJXrfncsTnb7H2jlWaBfR8ac1JTlGT3-kmbkE9JyCOurCII"
                />
                <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                  Tiết kiệm 35.000đ
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded font-semibold">
                Khẩu phần 4 người
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
                Combo Bữa Cơm Thuần Việt
              </h3>
              <ul className="mt-space-sm flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Thịt heo ba rọi kho tàu (400g)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Rau muống non lá nhỏ luộc (500g)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Cua đồng xay kèm rau mồng tơi &amp; mướp hương
                </li>
              </ul>
            </div>
            <div className="mt-space-lg pt-space-sm flex items-center justify-between">
              <div>
                <span className="font-body-sm text-body-sm text-outline block">Giá trọn combo:</span>
                <span className="font-headline-lg text-headline-lg text-primary font-bold">125.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('combo-1', 125000)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  addedFlashId === 'combo-1'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary hover:bg-on-primary-container text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {addedFlashId === 'combo-1' ? 'check' : 'add_shopping_cart'}
                </span>
                <span>{addedFlashId === 'combo-1' ? 'Đã thêm' : 'Mua Cả Combo'}</span>
              </button>
            </div>
          </div>

          {/* Combo 2: Ăn vặt cuối tuần */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="w-full h-44 rounded-lg overflow-hidden bg-surface-container-low mb-space-md relative">
                <img
                  alt="Combo Ăn Vặt & Giải Khát"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP4Edv4m_gATjQqUT_GG_TC97n2_cFhM4doqfUWERbZRKSS76DtqBjvVznj34LBcTiE1yRUYVr-komdFzT-1ta9tIGyyDR-1i0OmEh0H6SotsEHQTza0pDPNoBGuUYp6tmppCR09fj_3C9WN2lf9-UxZgN0MMN2dO3za0ARvmPH5uCUgMTk_qcwqwR6yc3ULftbqFZyeUdk95b_p34EYT2BZoF80eibAiZsUcuN98"
                />
                <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                  Tiết kiệm 22.000đ
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-primary bg-primary-fixed px-2 py-0.5 rounded font-semibold">
                Tụ họp bạn bè
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
                Combo Ăn Vặt &amp; Giải Khát
              </h3>
              <ul className="mt-space-sm flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Khoai tây cọng Bỉ chiên giòn (500g)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  4 Lon Coca-Cola nguyên bản mát lạnh (320ml)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Xúc xích Đức xông khói CP gói 250g
                </li>
              </ul>
            </div>
            <div className="mt-space-lg pt-space-sm flex items-center justify-between">
              <div>
                <span className="font-body-sm text-body-sm text-outline block">Giá trọn combo:</span>
                <span className="font-headline-lg text-headline-lg text-primary font-bold">89.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('combo-2', 89000)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  addedFlashId === 'combo-2'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary hover:bg-on-primary-container text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {addedFlashId === 'combo-2' ? 'check' : 'add_shopping_cart'}
                </span>
                <span>{addedFlashId === 'combo-2' ? 'Đã thêm' : 'Mua Cả Combo'}</span>
              </button>
            </div>
          </div>

          {/* Combo 3: Vệ sinh nhà cửa */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="w-full h-44 rounded-lg overflow-hidden bg-surface-container-low mb-space-md relative">
                <img
                  alt="Combo Vệ Sinh Nhà Cửa Tiện Lợi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTjEFiMhHoBQMY1A6ZlezeLppBsT3OPL01Tj4ui4cr_aP7uINWadLGb1Zad30LnuwHwuS7IKB6VL8Z8HmArZbFIe4r3bBz0WUZ5Qr0MhVhCSYYSMGu0UiV5oeBEoxmToRlZ4h7coTR3gCGihoJeqbxBKRaTWe_-DJI5pghhgHh32Y4uKb5RbckWGfIsLN0LquAxz8dv_mZXLZYVgbpynOUBONnQzX1tAUkRS2hhLM"
                />
                <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                  Tiết kiệm 28.000đ
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded font-semibold">
                Gọn gàng sạch mát
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
                Combo Vệ Sinh Nhà Cửa Tiện Lợi
              </h3>
              <ul className="mt-space-sm flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Nước rửa chén Sunlight chanh (750g)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Nước lau sàn Gift hương hoa Lily (1L)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Bọt rửa tay diệt khuẩn hương dưa gang (250ml)
                </li>
              </ul>
            </div>
            <div className="mt-space-lg pt-space-sm flex items-center justify-between">
              <div>
                <span className="font-body-sm text-body-sm text-outline block">Giá trọn combo:</span>
                <span className="font-headline-lg text-headline-lg text-primary font-bold">95.000đ</span>
              </div>
              <button
                onClick={() => handleQuickAdd('combo-3', 95000)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  addedFlashId === 'combo-3'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary hover:bg-on-primary-container text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {addedFlashId === 'combo-3' ? 'check' : 'add_shopping_cart'}
                </span>
                <span>{addedFlashId === 'combo-3' ? 'Đã thêm' : 'Mua Cả Combo'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GIA VỊ & NGUYÊN LIỆU TẠP HÓA TRUYỀN THỐNG */}
      <section className="max-w-7xl mx-auto w-full px-margin-desktop py-space-lg">
        <div className="flex items-center justify-between mb-space-md">
          <div>
            <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wide">
              Căn Bếp Thân Quen
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Gia Vị &amp; Nhu Yếu Phẩm Tạp Hóa
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('spices-sauces')}
            className="font-label-md text-label-md text-primary hover:text-on-primary-container flex items-center gap-1 font-semibold group cursor-pointer"
          >
            <span>Xem toàn bộ kệ tạp hóa</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-md">
          {/* Pantry Item 1: Bột ngọt Ajinomoto */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-xs">
              <img
                alt="Bột ngọt Ajinomoto gói 454g"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbi29KMF_OG_SwcupDS1LWT2ij0BTlL8la_TnTw63yckn6rS7zcFfOwCPyTiXYMS4mo9xqYmXskKV2aAWc01idRzl88djZrSVnrVk7rxG7jzNxAvnJzsTdDCR5zARhSQuHXuOaEe21NYIti1G_YINg7YJcSLfEdb5jdIIwXUnIZ3gS9Dpcj0GO2Ph64Igf986J0s0dlKRF5sEgEXy6206gfgYJb4JptiERhgXrl3A"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-body-md text-on-surface line-clamp-2 leading-snug">
                Bột ngọt Ajinomoto gói 454g
              </h3>
              <span className="font-price-lg text-price-lg text-primary font-bold mt-1">36.000đ</span>
              <span className="font-body-sm text-body-sm text-outline">Gói 454g</span>
            </div>
            <button
              onClick={() => handleQuickAdd('pantry-1', 36000)}
              className={`mt-space-xs w-full py-1.5 font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                addedFlashId === 'pantry-1'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {addedFlashId === 'pantry-1' ? 'check' : 'add'}
              </span>
              <span>{addedFlashId === 'pantry-1' ? 'Đã thêm' : 'Chọn mua'}</span>
            </button>
          </div>

          {/* Pantry Item 2: Muối I-ốt */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-xs">
              <img
                alt="Muối tinh sấy I-ốt Vifon gói 1kg"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOzA5iIdC_UpigUdLoOgXlY1c1eTQFNy9Y6614wGYVnaoIjItcj1DSBZIjeNWJxcTYk0SHSLlKNdRPqC6TqPxtmOntlmPFwVZmDk8jx-wqy0Iro2mgVHLiIAPTrxwEvyfiwihBWfBC423N3uunvOHikNjhFC5E4m2Vzrr4_RnvVA9yufXtp29PL4-Ed-oEQefIMLrHmdL1Tq7ER0zaHzZcLXtac78Z3W6wM7LSV2c"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-body-md text-on-surface line-clamp-2 leading-snug">
                Muối tinh sấy I-ốt Vifon gói 1kg
              </h3>
              <span className="font-price-lg text-price-lg text-primary font-bold mt-1">8.000đ</span>
              <span className="font-body-sm text-body-sm text-outline">Gói 1kg</span>
            </div>
            <button
              onClick={() => handleQuickAdd('pantry-2', 8000)}
              className={`mt-space-xs w-full py-1.5 font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                addedFlashId === 'pantry-2'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {addedFlashId === 'pantry-2' ? 'check' : 'add'}
              </span>
              <span>{addedFlashId === 'pantry-2' ? 'Đã thêm' : 'Chọn mua'}</span>
            </button>
          </div>

          {/* Pantry Item 3: Nước tương Maggi */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-xs">
              <img
                alt="Nước tương Maggi đậm đặc chai 700ml"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0f4gEmFmJBXMr7_0XMGWDjz95a_qx5wq7YklxBZd9RGKVuJHA41pbFzvo7mmkGcZplrVU0RszOeNyBp8vm1K5JfyqDN9iVZ3hE3ByqttuZ58zyO7bhVHeQFfhMg-tRlKEMGRyN7Mx5QUA15SGx20RLiBOPIQqAJ_obCbUaZXaZlSzCFVaxn7eSzctgm-dlJvngil4F0WGAFGgi4YU7bvGp7uDvXeU8PiM3pnxsYg"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-body-md text-on-surface line-clamp-2 leading-snug">
                Nước tương Maggi đậm đặc chai 700ml
              </h3>
              <span className="font-price-lg text-price-lg text-primary font-bold mt-1">28.000đ</span>
              <span className="font-body-sm text-body-sm text-outline">Chai 700ml</span>
            </div>
            <button
              onClick={() => handleQuickAdd('pantry-3', 28000)}
              className={`mt-space-xs w-full py-1.5 font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                addedFlashId === 'pantry-3'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {addedFlashId === 'pantry-3' ? 'check' : 'add'}
              </span>
              <span>{addedFlashId === 'pantry-3' ? 'Đã thêm' : 'Chọn mua'}</span>
            </button>
          </div>

          {/* Pantry Item 4: Tương ớt Chinsu */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-xs">
              <img
                alt="Tương ớt Chinsu cay bùng vị chai 250g"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvVPnDGevjAAvEAuMF_YhN6L-xyBiviATW43dPOMwK5Wm8gJZZeRF3CMmFYlv10IrnKTu8SfsrIQ-AGMWRoTNYQk3xI_1B-JX_fkCSBQpVSlJv14gH0RNj2CeNoTzEW_IGnsJ-JH_k60ENPwKB-PkTcm3Q1Hmpp9nOhys5RPMJDyp1dWxrvt3RUxuVeerc1Xp0zyhEc8Q8NEZzb3NTcfoNnb8DGo_RfHxeM3-hZ1w"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-body-md text-on-surface line-clamp-2 leading-snug">
                Tương ớt Chinsu cay bùng vị chai 250g
              </h3>
              <span className="font-price-lg text-price-lg text-primary font-bold mt-1">15.000đ</span>
              <span className="font-body-sm text-body-sm text-outline">Chai 250g</span>
            </div>
            <button
              onClick={() => handleQuickAdd('pantry-4', 15000)}
              className={`mt-space-xs w-full py-1.5 font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                addedFlashId === 'pantry-4'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {addedFlashId === 'pantry-4' ? 'check' : 'add'}
              </span>
              <span>{addedFlashId === 'pantry-4' ? 'Đã thêm' : 'Chọn mua'}</span>
            </button>
          </div>

          {/* Pantry Item 5: Gạo ST25 Ông Cua túi 5kg */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-xs">
              <img
                alt="Gạo ST25 chính hãng Ông Cua túi 5kg"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Ult4v2fH30kabLGhfyxRDHiqUKMuWTWez4T_nByLhUObEKSdlT_Nzj5xYik-KPEDFSJtoBtYWiCENFy4mypdX6JzR8jdppovyXpjoyWajIJDJd05BtIFHyTxkEWgbFljYHz0tzAbgJQbvqaG1u4rZzE8yEztwbjEFVekl1YnlhscZHX9cHocyY0oGP0w8YTr9vXE-Fci4gSz1OUzPRqLlRCNpWYe7Map_y-SvaM"
              />
              <span className="absolute top-1 left-1 bg-secondary text-on-secondary font-label-sm text-[10px] px-1 py-0.5 rounded font-bold">
                Gạo ngon TG
              </span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-body-md text-on-surface line-clamp-2 leading-snug">
                Gạo ST25 chính hãng Ông Cua túi 5kg
              </h3>
              <span className="font-price-lg text-price-lg text-primary font-bold mt-1">175.000đ</span>
              <span className="font-body-sm text-body-sm text-outline">Túi 5kg</span>
            </div>
            <button
              onClick={() => handleQuickAdd('pantry-5', 175000)}
              className={`mt-space-xs w-full py-1.5 font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                addedFlashId === 'pantry-5'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {addedFlashId === 'pantry-5' ? 'check' : 'add'}
              </span>
              <span>{addedFlashId === 'pantry-5' ? 'Đã thêm' : 'Chọn mua'}</span>
            </button>
          </div>

          {/* Pantry Item 6: Hạt nêm Knorr thịt thăn */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-space-xs">
              <img
                alt="Hạt nêm Knorr thịt thăn xương ống 400g"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoPTnUIBgw_iJ4GVJG2EBH7X6zKrrMhEi21RWDrL5qBJzdz8D4UMLE2Sj_siEaiXrrm0-_KwcISSFW6UGWmBt7AvTFZxz7fv_XsQngOtaFPnVD8W-W6UA8uo8AxfgcTSxk9PMgwAsr0klZtAjncC87FdbY2I6YcQedj5d7zpsOgwGqOvH01BqGGfUvdGn2xxuYv1HiHoJfAePlYwhJ2GMqodJWm75XeYUP8jkX0XU"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-body-md text-on-surface line-clamp-2 leading-snug">
                Hạt nêm Knorr thịt thăn xương ống 400g
              </h3>
              <span className="font-price-lg text-price-lg text-primary font-bold mt-1">34.000đ</span>
              <span className="font-body-sm text-body-sm text-outline">Gói 400g</span>
            </div>
            <button
              onClick={() => handleQuickAdd('pantry-6', 34000)}
              className={`mt-space-xs w-full py-1.5 font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                addedFlashId === 'pantry-6'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {addedFlashId === 'pantry-6' ? 'check' : 'add'}
              </span>
              <span>{addedFlashId === 'pantry-6' ? 'Đã thêm' : 'Chọn mua'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. TIỆN ÍCH TẠP HÓA THÔNG MINH */}
      <section id="smart-utilities" className="max-w-7xl mx-auto w-full px-margin-desktop py-space-xl">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-space-lg">
            <span className="font-label-md text-label-md text-secondary uppercase font-bold tracking-wider">
              Trợ Lý Tiệm Quen
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
              Tiện Ích Tạp Hóa Thông Minh
            </h2>
            <p className="font-body-sm text-body-sm text-outline mt-1">
              Kết hợp văn hóa tin cậy của xóm giềng với công nghệ đi chợ số hóa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
            {/* Utility 1: Auto Meal Planning */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between group hover:bg-surface-container transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Lên Thực Đơn Tự Động</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Bạn chỉ cần chọn số người ăn và ngân sách mong muốn. Hệ thống tự động chọn đủ nguyên liệu sạch và
                  cho ngay vào giỏ hàng chỉ trong 10 giây.
                </p>
              </div>
              <div className="mt-space-md pt-space-xs">
                <button
                  className="w-full py-2.5 bg-surface-container-lowest text-primary font-headline-sm text-label-md rounded-lg shadow-xs hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>Tạo Mâm Cơm Hôm Nay</span>
                </button>
              </div>
            </div>

            {/* Utility 2: Sổ nợ quen / Thanh toán linh hoạt */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between group hover:bg-surface-container transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">history_edu</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Sổ Nợ Quen Trong Xóm</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Dành riêng cho khách hàng thân thiết trong bán kính 1km. Đặt hàng nhận ngay khi cần, thanh toán gom
                  cuối tuần hoặc đầu tháng đúng chất tạp hóa thân tình.
                </p>
              </div>
              <div className="mt-space-md pt-space-xs">
                <button
                  className="w-full py-2.5 bg-surface-container-lowest text-secondary font-headline-sm text-label-md rounded-lg shadow-xs hover:bg-secondary hover:text-on-secondary transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Kích Hoạt &apos;Sổ Quen&apos; (0đ)</span>
                </button>
              </div>
            </div>

            {/* Utility 3: Đặt bằng Zalo & Giọng nói */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between group hover:bg-surface-container transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">mic</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Đặt Bằng Giọng Nói &amp; Zalo
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Thiết kế đặc biệt cho cô chú lớn tuổi ngại gõ phím: Bấm giữ nói &quot;Lấy cho cô 1 ký cà chua và
                  nửa ký thịt nạc&quot; - trợ lý tự chốt đơn và gửi xác nhận.
                </p>
              </div>
              <div className="mt-space-md pt-space-xs">
                <button
                  className="w-full py-2.5 bg-surface-container-lowest text-tertiary font-headline-sm text-label-md rounded-lg shadow-xs hover:bg-tertiary hover:text-on-tertiary transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                  <span>Thử Đọc Đơn Hàng Ngay</span>
                </button>
              </div>
            </div>
          </div>

          {/* Banner Hotline Local Shop Support */}
          <div className="mt-space-lg p-space-md rounded-xl bg-gradient-to-r from-primary-fixed via-tertiary-fixed to-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
                <span className="material-symbols-outlined text-[26px]">moped</span>
              </div>
              <div className="text-left">
                <h4 className="font-headline-sm text-headline-sm text-on-primary-fixed font-bold">
                  Cần Giao Gấp Trong 15 Phút?
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Cửa hàng số 14 tại 128 Nguyễn Đình Chiểu đang phục vụ hẻm nhà bạn.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <a
                className="px-5 py-2.5 bg-primary text-on-primary font-headline-sm text-label-md rounded-full shadow-md hover:bg-on-primary-container transition-colors flex items-center gap-2"
                href="tel:19008888"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Gọi hotline: 1900 8888</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
