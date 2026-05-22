// File: src/pages/admin/ProductDashboard.jsx
// Style: mirrors Dashboard.jsx exactly — bg-secondary, #111111 header, red-500 accent, font-display font-black tracking uppercase
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, AlertTriangle, TrendingUp, Download,
  Calendar, Star, CheckCircle, Clock, AlertCircle,
  PieChart as PieIcon, BarChart3, Sparkles, ChevronRight,
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';

// ─── constants ───────────────────────────────────────────────
const COLORS = ['#ef4444', '#111111', '#6b7280', '#f59e0b', '#8b5cf6'];

const satisfactionData = [
  { star: 5, count: 450, percent: 70 },
  { star: 4, count: 120, percent: 20 },
  { star: 3, count: 50,  percent: 8  },
  { star: 2, count: 10,  percent: 2  },
];

// ─── component ───────────────────────────────────────────────
const ProductDashboard = ({ onNavigate }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [timeFilter,    setTimeFilter]    = useState('week');
  const [type,          setType]          = useState('week');
  const [topProducts,   setTopProducts]   = useState([]);
  const [chartData,     setChartData]     = useState([]);
  const [categoryData,  setCategoryData]  = useState([]);
  const [statsData,     setStatsData]     = useState([
    { id: 'total',    title: 'Tổng sản phẩm',          value: '...', icon: Package,       color: 'bg-[#111111]', filterType: 'ALL',       isClickable: true },
    { id: 'lowstock', title: 'Cảnh báo hết sản phẩm',  value: '...', icon: AlertTriangle, color: 'bg-red-500',   filterType: 'LOW_STOCK', isClickable: true },
  ]);

  const formatCurrency = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // ─── API calls ───────────────────────────────────────────
  useEffect(() => {
    fetchTopProducts();
    fetchSetData();
    fetchProfit(timeFilter);
    getCategoryRevenue();
  }, [type, timeFilter]);

  const getCategoryRevenue = async () => {
    try {
      const res  = await fetch('http://localhost:8080/categories/category-revenue', {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCategoryData(data.result.map((item, i) => ({ ...item, color: COLORS[i % COLORS.length] })));
    } catch {
      setCategoryData([
        { name: 'Áo thun',  revenue: 50000000, color: COLORS[0] },
        { name: 'Áo sơ mi', revenue: 30000000, color: COLORS[1] },
        { name: 'Quần',     revenue: 15000000, color: COLORS[2] },
      ]);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res  = await fetch(`http://localhost:8080/products/top-trending?type=${type}`);
      const data = await res.json();
      setTopProducts(data);
    } catch { setTopProducts([]); }
  };

  const fetchSetData = async () => {
    try {
      const res  = await fetch('http://localhost:8080/products/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStatsData(prev => prev.map(item => {
        if (item.id === 'total')    return { ...item, value: data.result?.totalProducts || 0 };
        if (item.id === 'lowstock') return { ...item, value: data.result?.lowStock || 0 };
        return item;
      }));
    } catch {}
  };

  const fetchProfit = async (filter) => {
    try {
      const res  = await fetch(`http://localhost:8080/invoices/${filter}`);
      const data = await res.json();
      const mapDay = (d) => ({ MONDAY: 'T2', TUESDAY: 'T3', WEDNESDAY: 'T4', THURSDAY: 'T5', FRIDAY: 'T6', SATURDAY: 'T7', SUNDAY: 'CN' }[d] || d);
      setChartData(data.map((item) => {
        const raw = typeof item.profit === 'string' ? parseFloat(item.profit.replace(/,/g, '')) : item.profit;
        const name = filter === 'week' ? mapDay(item.day) : filter === 'month' ? `T${item.month}` : `${item.year}`;
        return { name, profitRaw: raw || 0 };
      }));
    } catch {
      setChartData(Array.from({ length: 7 }, (_, i) => ({ name: `T${i + 2}`, profitRaw: Math.random() * 1000000 })));
    }
  };

  return (
    <div className="min-h-screen bg-secondary selection:bg-red-500 selection:text-white pb-16">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-[#111111] text-white border-b border-white/10 mb-12">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">PHÂN TÍCH SẢN PHẨM — KREDO STUDIO</span>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-white mt-2 uppercase tracking-tight">
              THỐNG KÊ KHO SẢN PHẨM
            </h1>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Phân tích hiệu suất sản phẩm & tồn kho</p>
          </div>
          <div className="md:text-right">
            <span className="text-white/30 text-[9px] font-bold tracking-widest uppercase block mb-1">Cập nhật lần cuối</span>
            <span className="text-lg font-display font-black text-red-500">{new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-12">

        {/* ── KPI Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statsData.map((item) => (
            <div
              key={item.id}
              onClick={() => item.isClickable && onNavigate && onNavigate(item.filterType)}
              className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${item.color} p-3 text-white`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 border border-primary/15 text-[8px] font-black uppercase tracking-wider text-primary/40">
                  XEM CHI TIẾT <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{item.title}</p>
              <p className="text-xl font-display font-black text-primary mt-1">{item.value}</p>
              <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Nhấn để xem chi tiết</span>
            </div>
          ))}
        </div>

        {/* ── Profit Chart ─────────────────────────────────── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b border-primary/5">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-red-500" />
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📊 PHÂN TÍCH LỢI NHUẬN THEO THỜI GIAN</h2>
            </div>
            <div className="flex gap-1.5">
              {[
                { key: 'week',  label: 'TUẦN'  },
                { key: 'month', label: 'THÁNG' },
                { key: 'year',  label: 'NĂM'   },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTimeFilter(t.key)}
                  className={`px-4 py-2 text-[9px] font-black tracking-widest uppercase transition-all border ${
                    timeFilter === t.key
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-secondary text-primary/60 border-primary/5 hover:bg-accent hover:text-white hover:border-accent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1ee" />
                <XAxis dataKey="name"      stroke="#111111" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} stroke="#111111" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(17,17,17,0.1)', borderRadius: '0px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(v) => [new Intl.NumberFormat('vi-VN').format(v) + '₫', 'Lợi nhuận']}
                />
                <Area type="monotone" dataKey="profitRaw" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Lợi nhuận" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Category Revenue + Satisfaction ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Doanh thu theo danh mục */}
          <div className="bg-white border border-primary/5 p-8">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
              <PieIcon className="w-4 h-4 text-red-500" />
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">🗂️ DOANH THU THEO DANH MỤC</h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Pie */}
              <div className="w-full md:w-1/2 h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="revenue">
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => formatCurrency(v)}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(17,17,17,0.1)', borderRadius: '0px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest text-center">
                    {categoryData.length}<br />DANH MỤC
                  </span>
                </div>
              </div>

              {/* List */}
              <div className="w-full md:w-1/2 space-y-3">
                {categoryData.slice(0, 5).map((cat, i) => (
                  <div key={i} className="p-3 bg-secondary border border-primary/5 hover:border-primary/15 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2" style={{ backgroundColor: cat.color, display: 'inline-block' }} />
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider">{cat.name}</span>
                      </div>
                    </div>
                    <p className="text-xs font-display font-black text-accent mt-1">
                      {new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(cat.revenue)}₫
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Đánh giá khách hàng */}
          <div className="bg-white border border-primary/5 p-8">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
              <Star className="w-4 h-4 text-red-500" />
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">⭐ MỨC ĐỘ HÀI LÒNG KHÁCH HÀNG</h2>
            </div>

            <div className="flex items-center gap-6 mb-8">
              {/* Score */}
              <div className="flex-none text-center p-6 bg-secondary border border-primary/5">
                <h3 className="text-4xl font-display font-black text-primary mb-1">4.8</h3>
                <div className="flex gap-0.5 justify-center mb-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={12} className="text-red-500 fill-red-500" />
                  ))}
                </div>
                <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest">Điểm TB</p>
              </div>

              {/* Bars */}
              <div className="flex-1 space-y-3">
                {satisfactionData.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-primary/40 w-3">{item.star}</span>
                    <div className="flex-1 h-2 bg-secondary overflow-hidden rounded-none">
                      <div
                        className="h-full bg-[#111111] transition-all duration-500"
                        style={{ width: `${item.percent}%`, backgroundColor: item.percent >= 50 ? '#ef4444' : '#111111' }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-primary/30 w-8 text-right">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI insight */}
            <div className="p-4 bg-secondary border border-primary/5">
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 border border-primary/5 flex-shrink-0">
                  <Sparkles size={14} className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">GỢI Ý TỪ HỆ THỐNG</h4>
                  <p className="text-[10px] font-bold text-primary/50 leading-relaxed uppercase tracking-wide">
                    Khách hàng đánh giá tích cực nhất về "Giao hàng nhanh". Nên nhấn mạnh điều này trong chiến dịch marketing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Products + Inventory ──────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Top products table */}
          <div className="xl:col-span-2 bg-white border border-primary/5 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b border-primary/5">
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">🔥 SẢN PHẨM BÁN CHẠY NHẤT</h2>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-secondary p-2.5 text-[9px] font-black text-primary uppercase tracking-widest border border-primary/5 focus:ring-1 focus:ring-red-500 focus:outline-none"
              >
                <option value="week">THEO TUẦN</option>
                <option value="month">THEO THÁNG</option>
              </select>
            </div>

            <div className="overflow-x-auto select-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/10">
                    {['#', 'SẢN PHẨM', 'DANH MỤC', 'DOANH SỐ', 'XU HƯỚNG'].map((h) => (
                      <th key={h} className="py-4 px-4 text-[9px] font-black text-primary/40 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {topProducts.length > 0 ? topProducts.map((prod, i) => (
                    <tr key={i} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-4 px-4 text-[10px] font-black text-primary/30 font-mono">{String(i + 1).padStart(2, '0')}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-secondary border border-primary/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {prod.img
                              ? <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                              : <Package size={14} className="text-primary/30" />
                            }
                          </div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-wide">{prod.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[10px] font-bold text-primary/40 uppercase tracking-wider">{prod.category}</td>
                      <td className="py-4 px-4 font-display font-black text-xs text-primary">{prod.sales}</td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1 px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase text-emerald-700 bg-emerald-50 border-emerald-100 w-fit">
                          <TrendingUp size={10} /> {prod.trend}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[10px] font-black text-primary/20 uppercase tracking-widest">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory status */}
          <div className="bg-white border border-primary/5 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
              <Package className="w-4 h-4 text-red-500" />
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📦 TÌNH TRẠNG KHO</h2>
            </div>

            <div className="flex-1 space-y-6">
              {[
                { label: 'TỒN KHO KHẢ DỤNG',      val: '85%', w: 85, icon: CheckCircle,  cls: 'text-emerald-700 bg-emerald-50 border-emerald-100', bar: '#111111' },
                { label: 'CẢNH BÁO SẮP HẾT HÀNG', val: '12%', w: 12, icon: AlertCircle,  cls: 'text-amber-700 bg-amber-50 border-amber-100',   bar: '#f59e0b' },
                { label: 'HÀNG TỒN / KHÓ BÁN',    val: '3%',  w: 3,  icon: Clock,        cls: 'text-red-700 bg-red-50 border-red-100',          bar: '#ef4444' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-1 border text-[8px] font-black uppercase tracking-wider ${item.cls}`}>
                        <item.icon size={10} className="inline" />
                      </span>
                      <span className="text-[9px] font-black text-primary/50 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-primary">{item.val}</span>
                  </div>
                  <div className="h-1.5 bg-secondary overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${item.w}%`, backgroundColor: item.bar }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-primary/5">
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full py-3 bg-[#111111] hover:bg-accent text-white text-[10px] font-black tracking-widest uppercase transition-colors"
              >
                QUẢN LÝ KHO HÀNG
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <div className="text-center pt-8 text-[9px] font-bold text-primary/20 uppercase tracking-[0.25em]">
          © {new Date().getFullYear()} KREDO STUDIO RETAIL REPORT. ALL RIGHTS RESERVED.
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;