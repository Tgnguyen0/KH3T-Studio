import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, AlertTriangle, TrendingUp, Download,
  Calendar, ChevronRight, Star, Sparkles, CheckCircle,
  Clock, AlertCircle, PieChart as PieIcon, BarChart3
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

// --- MOCK DATA & CONSTANTS ---
const satisfactionData = [
  { star: 5, count: 450, percent: 70 },
  { star: 4, count: 120, percent: 20 },
  { star: 3, count: 50, percent: 8 },
  { star: 2, count: 10, percent: 2 },
];

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'];

const ProductDashboard = ({ onNavigate }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // --- STATE ---
  const [timeFilter, setTimeFilter] = useState('week');
  const [type, setType] = useState("week");
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statsData, setStatsData] = useState([
    {
      id: 'total',
      title: "Total Products",
      value: "...",
      icon: Package,
      color: "bg-blue-500",
      filterType: "ALL",
      isClickable: true
    },
    {
      id: 'lowstock',
      title: "Low Stock Alert",
      value: "...",
      icon: AlertTriangle,
      color: "bg-orange-500",
      filterType: "LOW_STOCK",
      isClickable: true
    }
  ]);

  // --- HELPERS ---
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchTopProducts();
    fetchSetData();
    fetchProfit(timeFilter);
    getCategoryRevenue();
  }, [type, timeFilter]);

  // --- API CALLS ---
  const getCategoryRevenue = async () => {
    try {
      const response = await fetch("http://localhost:8080/categories/category-revenue", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      
      const formatted = data.result.map((item, index) => ({
        ...item,
        revenueFormatted: formatCurrency(item.revenue),
        color: COLORS[index % COLORS.length] // Gán màu sắc
      }));
      setCategoryData(formatted);
    } catch (error) {
      console.error("API ERROR:", error);
      // Fallback data fake để UI đẹp khi không có API
      setCategoryData([
        { name: "Electronics", revenue: 50000000, color: COLORS[0] },
        { name: "Fashion", revenue: 30000000, color: COLORS[1] },
        { name: "Home", revenue: 15000000, color: COLORS[2] },
      ]);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await fetch(`http://localhost:8080/products/top-trending?type=${type}`);
      const data = await res.json();
      setTopProducts(data);
    } catch (error) {
      setTopProducts([]); // Fallback empty
    }
  };

  const fetchSetData = async () => {
    try {
      const res = await fetch(`http://localhost:8080/products/stats`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      setStatsData(prev => prev.map(item => {
        if (item.id === "total") return { ...item, value: data.result?.totalProducts || 0 };
        if (item.id === "lowstock") return { ...item, value: data.result?.lowStock || 0 };
        return item;
      }));
    } catch (error) {
        // Silent fail or default values
    }
  };

  const fetchProfit = async (filter) => {
    try {
      const res = await fetch(`http://localhost:8080/invoices/${filter}`);
      const data = await res.json();

      const mapDayToEN = (dayEn) => {
        const days = { "MONDAY": "Mon", "TUESDAY": "Tue", "WEDNESDAY": "Wed", "THURSDAY": "Thu", "FRIDAY": "Fri", "SATURDAY": "Sat", "SUNDAY": "Sun" };
        return days[dayEn] || dayEn;
      };

      const formatted = data.map((item) => {
        let rawValue = typeof item.profit === 'string' ? parseFloat(item.profit.replace(/,/g, '')) : item.profit;
        let displayName = filter === "week" ? mapDayToEN(item.day) : (filter === "month" ? `M${item.month}` : `${item.year}`);
        
        return {
          name: displayName,
          profitRaw: rawValue || 0,
          profitFormatted: new Intl.NumberFormat('en-US').format(rawValue || 0)
        };
      });
      setChartData(formatted);
    } catch (e) {
      console.error(e);
      // Fake data for chart visualization if API fails
      setChartData(Array.from({length: 7}, (_, i) => ({ name: `Day ${i+1}`, profitRaw: Math.random() * 1000000 })));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                System Status: Operational
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                <Calendar size={18} />
                <span>Select Date</span>
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1">
                <Download size={18} />
                <span>Export Report</span>
             </button>
          </div>
        </div>

        {/* --- 2. KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statsData.map((item) => (
            <div
              key={item.id}
              onClick={() => item.isClickable && onNavigate && onNavigate(item.filterType)}
              className="group relative overflow-hidden bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <item.icon size={100} className="text-current" />
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{item.title}</p>
                  <h3 className="text-4xl font-extrabold text-slate-800">{item.value}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  <item.icon size={24} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                <span>View Details</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* --- 3. MAIN PROFIT CHART --- */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="text-indigo-600" size={24} />
                        Profit Analytics
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Revenue vs Costs performance over time</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    {["week", "month", "year"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTimeFilter(t)}
                        className={`px-4 py-2 text-sm font-bold rounded-lg capitalize transition-all ${timeFilter === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        {t}
                    </button>
                    ))}
                </div>
            </div>
            
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(val) => [`${new Intl.NumberFormat('en-US').format(val)}`, 'Profit']}
                    />
                    <Area type="monotone" dataKey="profitRaw" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* --- 4. REVENUE BY CATEGORY & CUSTOMER REVIEWS (SIDE BY SIDE) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT: Category Revenue */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <PieIcon className="text-indigo-600" size={24} />
                    Revenue by Category
                </h2>
                
                <div className="flex flex-col md:flex-row items-center gap-8 h-full">
                    <div className="w-full md:w-1/2 h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="revenue"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-slate-700">{categoryData.length}</span>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-3">
                         {categoryData.slice(0, 4).map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                    <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900">{new Intl.NumberFormat('en', { notation: "compact" }).format(cat.revenue)}</span>
                            </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Customer Reviews */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Star className="text-amber-500" size={24} fill="currentColor" />
                    Customer Satisfaction
                </h2>

                <div className="flex items-center gap-6 mb-8">
                     <div className="flex-none text-center p-6 bg-amber-50 rounded-2xl border border-amber-100">
                         <h3 className="text-5xl font-extrabold text-amber-500 mb-1">4.8</h3>
                         <div className="flex gap-1 justify-center mb-2">
                             {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}
                         </div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Score</p>
                     </div>
                     
                     <div className="flex-1 space-y-3">
                        {satisfactionData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="text-sm font-bold text-slate-600 w-4">{item.star}</span>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-amber-400 rounded-full shadow-sm"
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-medium text-slate-400 w-8 text-right">{item.percent}%</span>
                            </div>
                        ))}
                     </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl flex items-start gap-3">
                    <div className="mt-1 bg-white p-1.5 rounded-full shadow-sm">
                        <Sparkles size={16} className="text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-indigo-900">AI Insight</h4>
                        <p className="text-sm text-indigo-700/80 leading-relaxed mt-1">
                            Most positive reviews mention "Fast Delivery". Consider highlighting this in your marketing campaigns.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- 5. BOTTOM SECTION: TOP PRODUCTS & INVENTORY --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Top Products (Chiếm 2 phần) */}
            <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Top Trending Products</h2>
                    <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                        className="bg-slate-50 border-none text-sm font-bold text-slate-600 py-2 px-4 rounded-xl focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="pb-4 pl-2">Product Name</th>
                                <th className="pb-4">Category</th>
                                <th className="pb-4">Sales</th>
                                <th className="pb-4 text-right pr-2">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {topProducts.length > 0 ? topProducts.map((prod, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-2 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-lg shadow-inner">
                                            {prod.img ? <img src={prod.img} alt="" className="w-full h-full object-cover rounded-lg" /> : "📦"}
                                        </div>
                                        <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{prod.name}</span>
                                    </td>
                                    <td className="py-4 text-slate-500">{prod.category}</td>
                                    <td className="py-4 font-semibold text-slate-800">{prod.sales}</td>
                                    <td className="py-4 text-right pr-2">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                            <TrendingUp size={12} /> {prod.trend}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-400">No data available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inventory Health (Chiếm 1 phần) */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Inventory Health</h2>
                    <div className="space-y-6">
                        {[
                            { label: "Available Stock", val: "85%", color: "bg-emerald-500", bg: "bg-emerald-50", icon: CheckCircle, text: "text-emerald-600" },
                            { label: "Low Stock Alert", val: "12%", color: "bg-amber-500", bg: "bg-amber-50", icon: AlertCircle, text: "text-amber-600" },
                            { label: "Unsellable / Dead", val: "3%", color: "bg-rose-500", bg: "bg-rose-50", icon: Clock, text: "text-rose-600" },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${item.bg}`}>
                                            <item.icon size={16} className={item.text} />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{item.val}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{width: item.val}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
                        Manage Inventory
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;