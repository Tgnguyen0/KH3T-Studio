// Sidebar.jsx - Premium KREDO Studio Admin Sidebar with elegant pitch-black and champagne gold accents.
import React from 'react';
import { BarChart3, Umbrella, Users, Package, LogOut, Menu, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard', label: 'BẢNG ĐIỀU KHIỂN', icon: <BarChart3 size={18} /> },
    { key: 'customers', label: 'KHÁCH HÀNG', icon: <Users size={18} /> },
    { key: 'employees', label: 'NHÂN VIÊN', icon: <Umbrella size={18} /> },
    { key: 'products', label: 'SẢN PHẨM', icon: <Package size={18} /> },
    { key: 'productDashboard', label: 'THỐNG KÊ KHO', icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#111111] text-white transition-all duration-300 flex flex-col border-r border-white/10 selection:bg-red-500 selection:text-[#111111]`}>

      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        {sidebarOpen ? (
          <div className="flex flex-col">
            <span className="text-sm font-display font-black tracking-[0.2em] text-white">KREDO STUDIO</span>
            <span className="text-[8px] font-bold tracking-widest text-red-500 uppercase mt-1">ADMINISTRATOR</span>
          </div>
        ) : (
          <span className="text-xs font-display font-black text-red-500">KR</span>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/5 transition-colors text-white/60 hover:text-white"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Navigation menu */}
      <nav className="flex-grow p-4 space-y-2.5 mt-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3.5 p-3.5 transition-all relative font-display font-black text-[10px] tracking-widest uppercase rounded-none
                ${isActive
                  ? 'text-red-500 bg-white/5 border-l-2 border-red-500'
                  : 'text-white/55 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }
              `}
            >
              <span className={isActive ? 'text-red-500' : 'text-white/40 group-hover:text-white'}>
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer block */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <button
          className="w-full flex items-center gap-3.5 p-3.5 hover:bg-accent text-white/60 hover:text-white transition-all font-display font-black text-[10px] tracking-widest uppercase rounded-none"
          onClick={() => {
            localStorage.removeItem("accessToken");
            navigate("/login");
          }}
        >
          <LogOut size={18} className="text-white/40" />
          {sidebarOpen && <span>ĐĂNG XUẤT</span>}
        </button>
      </div>
    </div>
  );
}
