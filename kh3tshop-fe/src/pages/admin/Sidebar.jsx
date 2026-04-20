import React from 'react';
import { BarChart3, Umbrella, Users, Package, Settings, LogOut, Menu, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
            activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <BarChart3 size={20} />
          {sidebarOpen && <span>Dashboard</span>}
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
            activeTab === 'customers' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Users size={20} />
          {sidebarOpen && <span>Customer</span>}
        </button>

         <button
          onClick={() => setActiveTab('employees')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
            activeTab === 'employees' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Umbrella size={20} />
          {sidebarOpen && <span>Employee</span>}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
            activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Package size={20} />
          {sidebarOpen && <span>Product</span>}
        </button>

        <button
          onClick={() => setActiveTab('productDashboard')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
            activeTab === 'productDashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <TrendingUp size={20} />
          {sidebarOpen && <span>Product Dashboard</span>}
        </button>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition mt-2"  
          onClick={()=>{
            localStorage.removeItem("accessToken")
            navigate("/login")}}
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}