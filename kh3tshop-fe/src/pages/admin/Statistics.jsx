import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from 'lucide-react';

export default function Statistics() {
  // Dữ liệu thống kê theo tháng
  const monthlyStats = [
    { month: 'Tháng 1', revenue: 35000000, orders: 45, customers: 120 },
    { month: 'Tháng 2', revenue: 42000000, orders: 58, customers: 145 },
    { month: 'Tháng 3', revenue: 38000000, orders: 52, customers: 138 },
    { month: 'Tháng 4', revenue: 45000000, orders: 65, customers: 156 },
    { month: 'Tháng 5', revenue: 52000000, orders: 78, customers: 178 },
    { month: 'Tháng 6', revenue: 48000000, orders: 71, customers: 165 }
  ];

  // Sản phẩm bán chạy
  const topProducts = [
    { name: 'Sản phẩm A', sales: 245, revenue: '₫12,250,000', trend: 'up' },
    { name: 'Sản phẩm B', sales: 198, revenue: '₫9,900,000', trend: 'up' },
    { name: 'Sản phẩm C', sales: 156, revenue: '₫7,800,000', trend: 'down' },
    { name: 'Sản phẩm D', sales: 134, revenue: '₫6,700,000', trend: 'up' },
    { name: 'Sản phẩm E', sales: 112, revenue: '₫5,600,000', trend: 'down' }
  ];

  // Thống kê tổng quan
  const overviewStats = [
    { 
      label: 'Doanh Thu Tháng Này', 
      value: '₫52,000,000', 
      change: '+15.3%', 
      isPositive: true,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    { 
      label: 'Đơn Hàng Mới', 
      value: '78', 
      change: '+9.8%', 
      isPositive: true,
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    { 
      label: 'Khách Hàng Mới', 
      value: '178', 
      change: '+7.5%', 
      isPositive: true,
      icon: Users,
      color: 'bg-purple-500'
    },
    { 
      label: 'Sản Phẩm Đã Bán', 
      value: '845', 
      change: '-2.3%', 
      isPositive: false,
      icon: Package,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Thống Kê & Báo Cáo</h1>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Doanh Thu 6 Tháng Gần Đây</h2>
        <div className="space-y-4">
          {monthlyStats.map((stat, idx) => {
            const maxRevenue = Math.max(...monthlyStats.map(s => s.revenue));
            const percentage = (stat.revenue / maxRevenue) * 100;
            
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{stat.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{stat.orders} đơn</span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₫{(stat.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sản phẩm bán chạy */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sản Phẩm Bán Chạy</h2>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 font-bold w-10 h-10 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sản phẩm</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="font-semibold text-gray-800">{product.revenue}</span>
                  {product.trend === 'up' ? (
                    <TrendingUp className="text-green-500" size={20} />
                  ) : (
                    <TrendingDown className="text-red-500" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tỷ lệ chuyển đổi */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Phân Tích Khách Hàng</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Khách Hàng Mới</span>
                <span className="text-sm font-semibold text-gray-800">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Khách Hàng Quay Lại</span>
                <span className="text-sm font-semibold text-gray-800">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tỷ Lệ Chuyển Đổi</span>
                <span className="text-sm font-semibold text-gray-800">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Mức Độ Hài Lòng</span>
                <span className="text-sm font-semibold text-gray-800">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}