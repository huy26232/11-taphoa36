import React, { useState, useRef, useEffect } from 'react';
import { ALL_CATEGORIES, PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId, hash?: string) => void;
  cartCount: number;
  cartTotal: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrA7ZBk79zF88yNkaFAKblbsy5Xwo2HQ4ErySUYCfD3JnNwLyOq78MHVdjyuFm4cCSJbCfi_01QhlxNHLkdaaJHWA3t72-Jd3AJ_Q9EKwKSGouykL3dm_R3z_55QjlGbXyt-KErgKSbXS4vY8xwNV_rwabOPeeDkJTTPlLQwQhTLfQHzuivP3932CIa-d68zE9hcStKDoY97xcmXAISfMzOTMsMQxx2pxqXpjPMLeD76';

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBXK0q2XWTVU2ppz8CfIIZnLxQo8M2-wwbEHa_dg192Vz6o3YUS3KFJ_3q-Yf10jOl93l4eOyQS9EWHQEIHJqAKpTXEN4PJbS1tZYtU_9jivOqcaivdBgdYHj3KyCfzoHugorl-yZMCkajDO1P7mfSg1SjP-v0bnKtsvJmIzxQIZUw1qFXWGOM_CByOSJRxHvb-bROZRyS1QndnSLZuLvZqlWNWSnesG10rhzHx9T8';

export function formatVnd(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  cartTotal,
  searchQuery,
  onSearchChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase();
    if (!q.trim()) return;
    if (q.includes('sữa') || q.includes('bánh') || q.includes('kẹo')) {
      onNavigate('dairy-snacks');
    } else if (q.includes('trứng') || q.includes('đậu')) {
      onNavigate('eggs-tofu');
    } else if (q.includes('thịt') || q.includes('cá') || q.includes('tôm')) {
      onNavigate('meat-seafood');
    } else if (q.includes('rau') || q.includes('cà') || q.includes('cam') || q.includes('táo')) {
      onNavigate('fresh-produce');
    } else if (q.includes('mì') || q.includes('gạo') || q.includes('phở') || q.includes('bún')) {
      onNavigate('noodles-dry');
    } else if (q.includes('mắm') || q.includes('gia vị') || q.includes('dầu') || q.includes('nêm')) {
      onNavigate('spices-sauces');
    } else if (q.includes('bia') || q.includes('nước ngọt') || q.includes('coca') || q.includes('pepsi')) {
      onNavigate('beverages');
    } else if (q.includes('giặt') || q.includes('xả') || q.includes('rửa')) {
      onNavigate('household-laundry');
    }
  };

  const navLinkClass = (isActive: boolean) =>
    isActive
      ? 'px-3 py-1 font-label-md text-label-md transition-colors whitespace-nowrap bg-primary-fixed text-on-primary-fixed-variant font-semibold rounded-full'
      : 'px-3 py-1 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors whitespace-nowrap rounded-full';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest shadow-[0_4px_20px_-2px_rgba(251,113,133,0.08)]">
      <div className="h-36 max-w-7xl mx-auto px-margin-desktop flex flex-col justify-between pt-space-sm pb-space-xs">
        <div className="flex items-center justify-between gap-space-lg">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-space-md shrink-0 text-left cursor-pointer"
          >
            {!logoError ? (
              <img
                alt="Logo Tạp Hóa Số"
                className="h-8 w-auto object-contain"
                referrerPolicy="no-referrer"
                src={LOGO_URL}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary leading-tight tracking-tight">
                Tạp Hóa Số
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-space-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                Tươi ngon mỗi ngày
              </span>
            </div>
          </button>

          {/* Delivery Location */}
          <div className="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-md py-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer shrink-0 max-w-xs">
            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="font-label-sm text-label-sm text-on-surface truncate">
                Giao: 128 Nguyễn Đình Chiểu, Q.1
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-medium">
                Hỏa tốc 30-45 phút
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
          </div>

          {/* Search Bar & Suggestions */}
          <div className="flex-1 max-w-xl mx-space-sm">
            <form className="relative flex items-center" onSubmit={handleSearchSubmit}>
              <input
                className="w-full h-10 pl-10 pr-24 rounded-full bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container shadow-inner"
                placeholder="Tìm thịt cá, rau tươi, mì gói, gia vị, bia nước ngọt..."
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-3 text-primary text-[20px]">
                search
              </span>
              <button
                className="absolute right-1 px-4 py-1.5 bg-primary-container hover:bg-primary text-on-primary rounded-full font-label-md text-label-md transition-colors cursor-pointer"
                type="submit"
              >
                Tìm
              </button>
            </form>
            <div className="hidden sm:flex items-center gap-space-sm mt-1 px-space-xs">
              <span className="font-label-sm text-label-sm text-outline">Gợi ý:</span>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#sua-tuoi"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('dairy-snacks');
                }}
              >
                Sữa tươi
              </a>
              <span className="text-outline-variant font-label-sm">•</span>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#trung-ga-ta"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('eggs-tofu');
                }}
              >
                Trứng gà ta
              </a>
              <span className="text-outline-variant font-label-sm">•</span>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#thit-ba-chi"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('meat-seafood');
                }}
              >
                Thịt ba chỉ
              </a>
              <span className="text-outline-variant font-label-sm">•</span>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#rau-muong"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('fresh-produce');
                }}
              >
                Rau muống
              </a>
            </div>
          </div>

          {/* Right Actions: Hotline, Orders, Cart, Profile */}
          <div className="flex items-center gap-space-lg shrink-0">
            <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px]">support_agent</span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm text-label-sm text-outline">Hotline hỗ trợ</span>
                <span className="font-label-md text-label-md text-primary font-bold">1900 8888</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              <span className="hidden lg:inline font-label-md text-label-md font-medium">
                Đơn hàng
              </span>
            </div>
            <div className="relative flex items-center gap-space-sm bg-primary-fixed hover:bg-primary-fixed-dim px-3.5 py-1.5 rounded-full cursor-pointer transition-colors">
              <div className="relative">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  shopping_bag
                </span>
                <span className="absolute -top-1.5 -right-2 bg-primary text-on-primary font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-label-sm text-label-sm text-on-primary-fixed-variant font-semibold">
                  {cartCount} món
                </span>
                <span className="font-label-md text-label-md text-primary font-bold">
                  {formatVnd(cartTotal)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container"
                referrerPolicy="no-referrer"
                src={AVATAR_URL}
              />
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate max-w-[100px]">
                  Chị Mai
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">
                  Khách quen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Nav Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-space-sm min-w-0 flex-1">
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-space-xs bg-primary text-on-primary px-space-md py-1.5 rounded-lg cursor-pointer hover:bg-on-primary-container transition-colors shrink-0 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
                <span className="font-headline-sm text-label-md text-on-primary font-semibold">
                  DANH MỤC SẢN PHẨM
                </span>
                <span className="material-symbols-outlined text-[16px]">
                  {menuOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-lg p-space-sm z-50 border border-surface-container">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('home');
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                      currentPage === 'home'
                        ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                        : 'hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="w-7 h-7 rounded-lg bg-primary-fixed text-primary flex items-center justify-center material-symbols-outlined text-[18px]">
                        home
                      </span>
                      <span className="font-label-md text-label-md">Trang chủ Tạp Hóa Số</span>
                    </div>
                  </button>
                  <div className="h-px bg-surface-container my-1" />
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onNavigate(cat.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                        currentPage === cat.id
                          ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                          : 'hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <span className="w-7 h-7 rounded-lg bg-surface-container text-primary flex items-center justify-center material-symbols-outlined text-[18px]">
                          {cat.icon}
                        </span>
                        <span className="font-label-md text-label-md">{cat.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-outline text-[16px]">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <nav className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
              <a
                aria-current={currentPage === 'home' ? 'page' : undefined}
                className={navLinkClass(currentPage === 'home')}
                data-path="hot-deals"
                href="#hot-deals"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('home', 'flash-sale');
                }}
              >
                🔥 Khuyến Mãi Sốc
              </a>
              <a
                aria-current={currentPage === 'fresh-produce' ? 'page' : undefined}
                className={navLinkClass(currentPage === 'fresh-produce')}
                data-path="fresh-produce"
                href="#fresh-produce"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('fresh-produce');
                }}
              >
                🥗 Rau Củ &amp; Trái Cây
              </a>
              <a
                aria-current={currentPage === 'meat-seafood' ? 'page' : undefined}
                className={navLinkClass(currentPage === 'meat-seafood')}
                data-path="meat-seafood"
                href="#meat-seafood"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('meat-seafood');
                }}
              >
                🥩 Thịt, Cá, Trứng
              </a>
              <a
                aria-current={
                  currentPage === 'spices-sauces' || currentPage === 'noodles-dry'
                    ? 'page'
                    : undefined
                }
                className={navLinkClass(
                  currentPage === 'spices-sauces' || currentPage === 'noodles-dry',
                )}
                data-path="pantry-spices"
                href="#pantry-spices"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('spices-sauces');
                }}
              >
                🍜 Đồ Khô &amp; Gia Vị
              </a>
              <a
                aria-current={currentPage === 'beverages' ? 'page' : undefined}
                className={navLinkClass(currentPage === 'beverages')}
                data-path="beverages"
                href="#beverages"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('beverages');
                }}
              >
                🧃 Nước Ngọt &amp; Bia
              </a>
              <a
                aria-current={currentPage === 'household-laundry' ? 'page' : undefined}
                className={navLinkClass(currentPage === 'household-laundry')}
                data-path="household"
                href="#household"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('household-laundry');
                }}
              >
                🧺 Đồ Dùng Gia Đình
              </a>
              <a
                className={navLinkClass(false)}
                data-path="loyalty-points"
                href="#loyalty-points"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('home', 'smart-utilities');
                }}
              >
                💎 Tích Điểm Tạp Hóa
              </a>
            </nav>
          </div>
          <div className="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-secondary bg-secondary-fixed/30 px-space-md py-1 rounded-full font-medium shrink-0 ml-2">
            <span className="material-symbols-outlined text-[16px]">electric_moped</span>
            <span>Freeship đơn từ 200k</span>
          </div>
        </div>
      </div>
    </header>
  );
};
