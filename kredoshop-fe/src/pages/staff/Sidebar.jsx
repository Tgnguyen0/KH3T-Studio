// Sidebar.jsx — KREDO Studio Staff Sidebar, mirroring Admin aesthetic exactly.
import React from 'react';
import { ShoppingBag, FileText, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StaffSidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'orders',   label: 'ĐƠN HÀNG', icon: <ShoppingBag size={18} /> },
    { key: 'invoices', label: 'HOÁ ĐƠN',  icon: <FileText    size={18} /> },
  ];

  const handleNav = (key) => {
    setActiveTab(key);
    navigate(`/staff/${key}`);
  };

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#111111] text-white transition-all duration-300 flex flex-col border-r border-white/10 flex-shrink-0`}>

      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        {sidebarOpen ? (
          <div className="flex flex-col">
            <span className="text-sm font-display font-black tracking-[0.2em] text-white">KREDO STUDIO</span>
            <span className="text-[8px] font-bold tracking-widest text-red-500 uppercase mt-1">NHÂN VIÊN</span>
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

      {/* Nav */}
      <nav className="flex-grow p-4 space-y-2.5 mt-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={`w-full flex items-center gap-3.5 p-3.5 transition-all relative font-display font-black text-[10px] tracking-widest uppercase rounded-none
                ${isActive
                  ? 'text-red-500 bg-white/5 border-l-2 border-red-500'
                  : 'text-white/55 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
            >
              <span className={isActive ? 'text-red-500' : 'text-white/40'}>
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <button
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            navigate('/login');
          }}
          className="w-full flex items-center gap-3.5 p-3.5 hover:bg-white/5 text-white/60 hover:text-white transition-all font-display font-black text-[10px] tracking-widest uppercase rounded-none"
        >
          <LogOut size={18} className="text-white/40" />
          {sidebarOpen && <span>ĐĂNG XUẤT</span>}
        </button>
      </div>
    </div>
  );
}