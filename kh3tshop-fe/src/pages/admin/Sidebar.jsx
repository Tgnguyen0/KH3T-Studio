import React from "react";
import {
  BarChart3,
  Umbrella,
  Users,
  Package,
  LogOut,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) {
  const navigate = useNavigate();

  const menuItemClass = (tab) =>
    `flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200
     text-sm font-medium
     ${
       activeTab === tab
         ? "bg-blue-600 text-white shadow-md"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  const iconSize = 22;

  return (
    <div
      className={`${
        sidebarOpen ? "w-72" : "w-24"
      } bg-gray-900 text-white transition-all duration-300 flex flex-col min-h-screen shadow-2xl`}
    >
      {/* HEADER */}
      <div className="p-5 flex items-center justify-between border-b border-gray-800">
        {sidebarOpen && (
          <h2 className="text-2xl font-bold tracking-wide">Bảng Quản Trị</h2>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 hover:bg-gray-800 rounded-xl transition"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-3">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={menuItemClass("dashboard")}
        >
          <BarChart3 size={iconSize} />
          {sidebarOpen && <span>Dashboard</span>}
        </button>

        <button
          onClick={() => setActiveTab("customers")}
          className={menuItemClass("customers")}
        >
          <Users size={iconSize} />
          {sidebarOpen && <span>Khách hàng</span>}
        </button>

        <button
          onClick={() => setActiveTab("employees")}
          className={menuItemClass("employees")}
        >
          <Umbrella size={iconSize} />
          {sidebarOpen && <span>Nhân viên</span>}
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={menuItemClass("products")}
        >
          <Package size={iconSize} />
          {sidebarOpen && <span>Sản phẩm</span>}
        </button>

        <button
          onClick={() => setActiveTab("productDashboard")}
          className={menuItemClass("productDashboard")}
        >
          <TrendingUp size={iconSize} />
          {sidebarOpen && <span>Thống kê Sản phẩm</span>}
        </button>
      </nav>

      {/* FOOTER */}
      <div className="p-5 border-t border-gray-800">
        <button
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition text-white font-medium"
          onClick={() => {
            localStorage.removeItem("accessToken");
            navigate("/login");
          }}
        >
          <LogOut size={iconSize} />
          {sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
