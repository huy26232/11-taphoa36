import React from 'react';
import { PageId } from '../types';

interface FooterProps {
  onNavigate?: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent, target?: PageId) => {
    e.preventDefault();
    if (target && onNavigate) {
      onNavigate(target);
    }
  };

  return (
    <footer className="w-full bg-surface-container-lowest mt-space-xl shadow-[0_-4px_20px_-2px_rgba(15,23,42,0.04)]">
      <div className="bg-surface-container-low py-space-md">
        <div className="max-w-7xl mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-space-lg text-left">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">speed</span>
            </div>
            <div>
              <p className="font-headline-sm text-label-md text-on-surface">
                Giao Siêu Tốc 30 Phút
              </p>
              <p className="font-body-sm text-body-sm text-outline">
                Đúng hẹn, thực phẩm giữ độ tươi lạnh
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined">eco</span>
            </div>
            <div>
              <p className="font-headline-sm text-label-md text-on-surface">
                100% Nguồn Gốc Rõ Ràng
              </p>
              <p className="font-body-sm text-body-sm text-outline">
                Chứng nhận chuẩn VietGAP, tươi ngon
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">published_with_changes</span>
            </div>
            <div>
              <p className="font-headline-sm text-label-md text-on-surface">
                Đổi Trả Tại Chỗ Dễ Dàng
              </p>
              <p className="font-body-sm text-body-sm text-outline">
                Không vừa ý, đổi trả tức thì tại cửa
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">loyalty</span>
            </div>
            <div>
              <p className="font-headline-sm text-label-md text-on-surface">
                Tích 3% Mỗi Hóa Đơn
              </p>
              <p className="font-body-sm text-body-sm text-outline">
                Trừ trực tiếp vào lần mua sắm tiếp theo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-lg text-left">
        <div className="lg:col-span-2 pr-space-md">
          <div className="flex items-center gap-space-xs mb-space-sm">
            <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
              Tạp Hóa Số
            </span>
            <span className="font-label-sm text-label-sm text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full font-semibold">
              Tiệm phố thân quen
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
            Hệ thống cửa hàng thực phẩm tươi sống, bách hóa tiện lợi công nghệ mới. Phục vụ bữa
            cơm tươi sạch và nhu cầu sinh hoạt thiết yếu cho mọi gia đình Việt.
          </p>
          <div className="flex flex-col gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
            <p className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">store</span>
              Trụ sở: 128 Nguyễn Đình Chiểu, P. Đa Kao, Quận 1, TP. HCM
            </p>
            <p className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">call</span>
              Tổng đài đặt hàng &amp; CSKH:{' '}
              <strong className="text-primary font-bold">1900 8888</strong> (7:00 - 21:30)
            </p>
            <p className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
              Email: hotro@taphoaso.vn
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-headline-sm text-label-md text-on-surface uppercase tracking-wider mb-space-md font-bold">
            Hỗ Trợ Khách Hàng
          </h4>
          <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#huong-dan"
                onClick={(e) => handleLink(e, 'home')}
              >
                Hướng dẫn đặt hàng
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#giao-hang"
                onClick={(e) => handleLink(e)}
              >
                Chính sách giao hàng 30-45p
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#doi-tra"
                onClick={(e) => handleLink(e)}
              >
                Chính sách kiểm hàng &amp; đổi trả
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#bieu-phi"
                onClick={(e) => handleLink(e)}
              >
                Biểu phí giao hàng bách hóa
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#vat"
                onClick={(e) => handleLink(e)}
              >
                Hóa đơn điện tử VAT
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline-sm text-label-md text-on-surface uppercase tracking-wider mb-space-md font-bold">
            Về Tạp Hóa Số
          </h4>
          <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#gioi-thieu"
                onClick={(e) => handleLink(e, 'home')}
              >
                Giới thiệu hệ thống chuỗi
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#cua-hang"
                onClick={(e) => handleLink(e)}
              >
                Hệ thống 85+ cửa hàng lân cận
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#tuyen-dung"
                onClick={(e) => handleLink(e)}
              >
                Tuyển dụng nhân viên cửa hàng
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#bao-mat"
                onClick={(e) => handleLink(e)}
              >
                Chính sách bảo mật thông tin
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="#hop-tac"
                onClick={(e) => handleLink(e)}
              >
                Liên hệ hợp tác nhà cung cấp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline-sm text-label-md text-on-surface uppercase tracking-wider mb-space-md font-bold">
            Thanh Toán &amp; Chứng Nhận
          </h4>
          <div className="flex flex-wrap gap-2 mb-space-md">
            <span className="px-2.5 py-1 rounded bg-surface-container-low font-label-sm text-label-sm font-semibold text-on-surface">
              VietQR
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-container-low font-label-sm text-label-sm font-semibold text-primary">
              Ví MoMo
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-container-low font-label-sm text-label-sm font-semibold text-secondary">
              COD Tiền mặt
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-container-low font-label-sm text-label-sm font-semibold text-on-surface">
              ZaloPay
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Đã Thông Báo Bộ Công Thương
            </div>
            <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
              Chứng Nhận An Toàn Thực Phẩm
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low py-space-sm">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col sm:flex-row items-center justify-between text-outline font-label-sm text-label-sm gap-2">
          <span>© 2025 Tạp Hóa Số Co., Ltd. Tất cả quyền được bảo lưu.</span>
          <span>Nền tảng mua sắm nhu yếu phẩm hằng ngày tin cậy của gia đình Việt.</span>
        </div>
      </div>
    </footer>
  );
};
