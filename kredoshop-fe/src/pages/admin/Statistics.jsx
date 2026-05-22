import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from 'lucide-react';

export default function Statistics() {
  const monthlyStats = [
    { month: 'Tháng 1', revenue: 35000000, orders: 45, customers: 120 },
    { month: 'Tháng 2', revenue: 42000000, orders: 58, customers: 145 },
    { month: 'Tháng 3', revenue: 38000000, orders: 52, customers: 138 },
    { month: 'Tháng 4', revenue: 45000000, orders: 65, customers: 156 },
    { month: 'Tháng 5', revenue: 52000000, orders: 78, customers: 178 },
    { month: 'Tháng 6', revenue: 48000000, orders: 71, customers: 165 },
  ];

  const topProducts = [
    { name: 'Sản phẩm A', sales: 245, revenue: '₫12,250,000', trend: 'up' },
    { name: 'Sản phẩm B', sales: 198, revenue: '₫9,900,000',  trend: 'up' },
    { name: 'Sản phẩm C', sales: 156, revenue: '₫7,800,000',  trend: 'down' },
    { name: 'Sản phẩm D', sales: 134, revenue: '₫6,700,000',  trend: 'up' },
    { name: 'Sản phẩm E', sales: 112, revenue: '₫5,600,000',  trend: 'down' },
  ];

  const overviewStats = [
    { label: 'Doanh thu tháng này', value: '₫52,000,000', change: '+15.3%', isPositive: true,  icon: DollarSign },
    { label: 'Đơn hàng mới',        value: '78',          change: '+9.8%',  isPositive: true,  icon: ShoppingCart },
    { label: 'Khách hàng mới',      value: '178',         change: '+7.5%',  isPositive: true,  icon: Users },
    { label: 'Sản phẩm đã bán',     value: '845',         change: '-2.3%',  isPositive: false, icon: Package },
  ];

  const customerMetrics = [
    { label: 'Khách hàng mới',       pct: 65 },
    { label: 'Khách hàng quay lại',  pct: 35 },
    { label: 'Tỷ lệ chuyển đổi',    pct: 28 },
    { label: 'Mức độ hài lòng',     pct: 92 },
  ];

  const maxRevenue = Math.max(...monthlyStats.map(s => s.revenue));

  return (
    <div className="min-h-screen bg-secondary selection:bg-red-500 selection:text-white pb-16">

      {/* ── Header ── */}
      <div className="bg-[#111111] text-white border-b border-white/10 mb-12">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">BÁO CÁO — KREDO STUDIO</span>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-white mt-2 uppercase tracking-tight">Thống kê & Báo cáo</h1>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Phân tích hiệu suất kinh doanh</p>
          </div>
          <div className="md:text-right">
            <span className="text-white/30 text-[9px] font-bold tracking-widest uppercase block mb-1">Cập nhật lần cuối</span>
            <span className="text-lg font-display font-black text-red-500">{new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-12">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map(({ label, value, change, isPositive, icon: Icon }) => (
            <div key={label} className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-secondary p-3 text-red-500"><Icon className="w-5 h-5" /></div>
                <div className={`flex items-center gap-1 px-2.5 py-1 border text-[9px] font-black tracking-wider uppercase ${isPositive ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-700 bg-red-50 border-red-100'}`}>
                  {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {change}
                </div>
              </div>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{label}</p>
              <p className="text-xl font-display font-black text-primary mt-1">{value}</p>
              <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">So với tháng trước</span>
            </div>
          ))}
        </div>

        {/* ── Revenue chart ── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📊 Doanh thu 6 tháng gần đây</h2>
          </div>
          <div className="space-y-5">
            {monthlyStats.map((stat, idx) => {
              const pct = (stat.revenue / maxRevenue) * 100;
              return (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{stat.month}</span>
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">{stat.orders} đơn</span>
                      <span className="text-[10px] font-black text-primary font-mono">{(stat.revenue / 1000000).toFixed(1)}M ₫</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary h-2">
                    <div className="bg-[#111111] h-2 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Top products */}
          <div className="bg-white border border-primary/5 p-8">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">🏆 Sản phẩm bán chạy</h2>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-secondary border border-primary/5 hover:border-primary/15 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-7 h-7 bg-primary text-white flex items-center justify-center font-display font-black text-[10px]">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-wide">{product.name}</p>
                      <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest mt-0.5">{product.sales} sản phẩm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-black text-xs text-primary">{product.revenue}</span>
                    {product.trend === 'up'
                      ? <TrendingUp className="text-emerald-500" size={16} />
                      : <TrendingDown className="text-red-500" size={16} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer analysis */}
          <div className="bg-white border border-primary/5 p-8">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">👥 Phân tích khách hàng</h2>
            </div>
            <div className="space-y-6">
              {customerMetrics.map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{label}</span>
                    <span className="text-[10px] font-black text-red-500">{pct}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2">
                    <div className="bg-[#111111] h-2 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}