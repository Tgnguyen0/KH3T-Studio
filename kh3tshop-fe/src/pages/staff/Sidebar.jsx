import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBox, FaFileInvoice, FaSignOutAlt } from "react-icons/fa";

export default function StaffSidebar() {
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white p-6 flex flex-col z-50">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          KH<span className="text-red-500">3</span>T Staff Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {/* Orders Link */}
        <Link
          to="/staff/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/staff/orders")
              ? "bg-red-500 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <FaBox size={18} />
          <span>Orders</span>
        </Link>
        
        {/* Invoices Link */}
        <Link
          to="/staff/invoices"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/staff/invoices")
              ? "bg-red-500 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <FaFileInvoice size={18} />
          <span>Invoices</span>
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
      >
        <FaSignOutAlt size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}