import { Facebook, Instagram, Mail, Phone, MapPin, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#fbfbf9] border-t border-white/5 pt-20 pb-10 font-body relative overflow-hidden">
      {/* Dynamic Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
          {/* Brand Column (Col Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <a href="/" className="inline-block">
              <span className="font-display font-black text-3xl tracking-[0.15em] text-[#fbfbf9] uppercase">
                KREDO<span className="text-accent">.</span>
              </span>
            </a>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
              Định hình phong cách tối giản, nâng tầm bản sắc cá nhân thông qua ngôn ngữ thiết kế đương đại và chất liệu vải thượng hạng.
            </p>
            {/* Newsletter signup */}
            <div className="mt-4">
              <h4 className="text-xs font-black tracking-widest text-[#c87a53] uppercase mb-3">Newsletter</h4>
              <div className="flex max-w-sm">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..." 
                  className="w-full bg-[#1c1c1e] text-white text-xs font-medium px-4 py-3.5 border-none focus:ring-1 focus:ring-[#c87a53] focus:outline-none"
                />
                <button className="bg-[#c87a53] hover:bg-[#a85f3b] text-[#111111] font-black px-4 transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links Column (Col Span 2) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-[#c87a53] font-black text-xs tracking-widest uppercase mb-2">Liên kết</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Trang chủ</a>
              </li>
              <li>
                <a href="/product" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Sản phẩm</a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Về chúng tôi</a>
              </li>
              <li>
                <a href="/policy" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Chính sách</a>
              </li>
            </ul>
          </div>

          {/* Contact Column (Col Span 3) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="text-[#c87a53] font-black text-xs tracking-widest uppercase mb-2">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                <Phone size={16} className="text-[#c87a53] flex-shrink-0" />
                <span>093 - 3462 - 6578</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                <Mail size={16} className="text-[#c87a53] flex-shrink-0" />
                <span>contact@kredostudio.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm font-medium">
                <MapPin size={16} className="text-[#c87a53] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Đường ABC, Quận Gò Vấp, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>

          {/* Social / Follow Column (Col Span 3) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="text-[#c87a53] font-black text-xs tracking-widest uppercase mb-2">Kết nối</h3>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#111111] hover:bg-white hover:border-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#111111] hover:bg-white hover:border-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#111111] hover:bg-white hover:border-white transition-all duration-300"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#111111] hover:bg-white hover:border-white transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
            <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
              Nhận thông tin cập nhật về các đợt phát hành sản phẩm mới và đặc quyền thành viên sớm nhất.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
          <p>© 2026 KREDO Studio. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="/policy" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            <a href="/policy" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
