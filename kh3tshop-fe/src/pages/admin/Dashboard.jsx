import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, DollarSign, ShoppingCart, Users, Package, Download, Filter, TrendingUp, TrendingDown, Clock, MapPin, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const token = localStorage.getItem("accessToken");

  const [paymentData, setPaymentData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [detailedOrders, setDetailedOrders] = useState([]);
  const [timeSlotData, setTimeSlotData] = useState([]);
  const [allData, setAllData] = useState([]);

  // -------------------------
  // 1. DATE RANGE
  // -------------------------
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0]
  });

  // -------------------------
  // 2. API: STATISTICS DAILY
  // -------------------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/orders/daily?start=${dateRange.start}&end=${dateRange.end}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        setAllData(data || []);
      } catch (e) {
        console.error("Error fetching daily stats:", e);
      }
    };

    fetchStats();
  }, [dateRange]);

  // -------------------------
  // 3. OTHER APIs
  // -------------------------
  const fetchTimeSlotData = async () => {
    try {
      const res = await fetch("http://localhost:8080/orders/time-slots", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeSlotData(await res.json());
    } catch (err) {
      console.error("Error fetching time slots:", err);
    }
  };

  const fetchDetailedOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/orders/detailed-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetailedOrders(await res.json());
    } catch (err) {
      console.error("Error fetching detailed orders:", err);
    }
  };

  const fetchRegionData = async () => {
    try {
      const res = await fetch("http://localhost:8080/customer-trading/regions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegionData(await res.json());
    } catch (err) {
      console.error("Error fetching regions:", err);
    }
  };

  const fetchPaymentData = async () => {
    try {
      const res = await fetch("http://localhost:8080/invoices/payment", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaymentData(await res.json());
    } catch (err) {
      console.error("Error fetching payment data:", err);
    }
  };

  useEffect(() => {
    fetchPaymentData();
    fetchRegionData();
    fetchDetailedOrders();
    fetchTimeSlotData();
  }, []);

  // -------------------------
  // 4. DATA NORMALIZATION (FILL MISSING DATES)
  // -------------------------
  const getDateList = (start, end) => {
    const list = [];
    let cur = new Date(start);
    const last = new Date(end);

    while (cur <= last) {
      list.push(cur.toISOString().split("T")[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return list;
  };

  const chartData = useMemo(() => {
    const dateList = getDateList(dateRange.start, dateRange.end);

    return dateList.map(d => {
      const found = allData.find(item => item.date === d);
      return (
        found || {
          date: d,
          revenue: 0,
          orders: 0,
          customers: 0,
          products: 0
        }
      );
    });
  }, [allData, dateRange]);

  // -------------------------
  // 5. TOTALS CALCULATION
  // -------------------------
  const totalRevenue = chartData.reduce((s, i) => s + i.revenue, 0);
  const totalOrders = chartData.reduce((s, i) => s + i.orders, 0);
  const totalCustomers = chartData.reduce((s, i) => s + i.customers, 0);
  const totalProducts = chartData.reduce((s, i) => s + i.products, 0);

  // -------------------------
  // 6. GROWTH CALCULATION (VS PREVIOUS PERIOD)
  // -------------------------
  const getPrevRange = () => {
    const days = chartData.length;
    const end = new Date(dateRange.start);
    end.setDate(end.getDate() - 1);

    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0]
    };
  };

  const prevRange = getPrevRange();
  const prevData = allData.filter(
    d => d.date >= prevRange.start && d.date <= prevRange.end
  );

  const prevRevenue = prevData.reduce((s, i) => s + i.revenue, 0);
  const prevOrders = prevData.reduce((s, i) => s + i.orders, 0);

  const revenueGrowth =
    prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  const ordersGrowth =
    prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;

  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // -------------------------
  // 7. FORMAT CURRENCY (VIETNAMESE DONG in EN LOCALE)
  // -------------------------
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US").format(value) + " VND";
  };

  // -------------------------
  // 8. QUICK RANGE
  // -------------------------
  const setQuickRange = type => {
    const today = new Date();
    let start = new Date();

    switch (type) {
      case "today":
        break;
      case "yesterday":
        start = new Date(today.setDate(today.getDate() - 1));
        break;
      case "7days":
        start = new Date(today.setDate(today.getDate() - 7));
        break;
      case "30days":
        start = new Date(today.setDate(today.getDate() - 30));
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "thisYear":
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        break;
    }

    setDateRange({
      start: start.toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0]
    });
  };

  // -------------------------
  // 9. EXPORT CSV
  // -------------------------
  const exportToCSV = () => {
    const headers = ["Date", "Revenue", "Orders", "Customers", "Products"];

    // 1. LỌC DỮ LIỆU: Chỉ lấy những ngày có doanh thu hoặc đơn hàng > 0
    const activeData = chartData.filter(item => item.orders > 0 || item.revenue > 0);

    // 2. FORMAT LẠI DATA
    const rows = activeData.map(i => {
      // Chuyển đổi format date từ YYYY-MM-DD sang DD/MM/YYYY để Excel dễ đọc
      // Giả sử i.date đang là "2024-12-05"
      const [year, month, day] = i.date.split("-");
      const formattedDate = `${day}/${month}/${year}`; 

      return [
        `"${formattedDate}"`, // Thêm ngoặc kép để Excel hiểu là text, tránh lỗi ####### hoặc tự tính toán
        i.revenue,
        i.orders,
        i.customers,
        i.products
      ];
    });

    // Nếu không có dữ liệu nào thì thông báo (tùy chọn)
    if (rows.length === 0) {
      alert("Không có dữ liệu phát sinh trong khoảng thời gian này để xuất file.");
      return;
    }

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Revenue_Report_${dateRange.start}_${dateRange.end}.csv`;
    link.click();
  };

  // Helper to translate status from Backend (Vietnamese) to Frontend (English)
  const getStatusLabel = (status) => {
    switch (status) {
        case 'Hoàn thành': return 'Completed';
        case 'Đang giao': return 'Shipping';
        case 'Đang xử lý': return 'Processing';
        case 'Hủy': return 'Cancelled';
        default: return status;
    }
  };

  // Helper to translate payment from Backend (Vietnamese) to Frontend (English)
  const getPaymentLabel = (payment) => {
    switch (payment) {
        case 'Thẻ tín dụng': return 'Credit Card';
        case 'Banking': return 'Bank Transfer';
        default: return payment;
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#eef2ff,_#f8fafc_40%,_#e0e7ff_100%)]">
      {/* PREMIUM HEADER */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-[0_10px_60px_rgba(0,0,0,0.35)]">
        {/* Glow effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-[1700px] mx-auto px-8 xl:px-14 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="flex items-center gap-5 text-4xl xl:text-5xl font-black tracking-tight">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,255,255,0.1)]">
                  <DollarSign className="w-9 h-9" />
                </div>
                Dashboard Doanh Thu
              </h1>

              <p className="mt-4 text-lg text-indigo-100">
                Theo dõi doanh thu, đơn hàng và hiệu suất kinh doanh theo thời
                gian thực
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 px-7 py-5 text-right backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              <p className="text-sm text-indigo-100 mb-1">Cập nhật lúc</p>

              <p className="text-2xl font-black tracking-wide">
                {new Date().toLocaleTimeString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto px-8 xl:px-14 -mt-8 pb-10">
        {/* PREMIUM FILTER */}
        <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-3xl mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-3 shadow-[0_10px_25px_rgba(99,102,241,0.35)]">
              <Calendar className="w-6 h-6 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold font-black tracking-tight text-slate-800">
                Bộ lọc thời gian
              </h2>

              <p className="text-slate-500">
                Chọn khoảng thời gian để thống kê dữ liệu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Hôm nay", action: "today" },
              { label: "Hôm qua", action: "yesterday" },
              { label: "7 ngày", action: "7days" },
              { label: "30 ngày", action: "30days" },
              { label: "Tháng này", action: "thisMonth" },
              { label: "Năm nay", action: "thisYear" },
            ].map((btn) => (
              <button
                key={btn.action}
                onClick={() => setQuickRange(btn.action)}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700 shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-[0_12px_30px_rgba(99,102,241,0.18)]"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Từ ngày
              </label>

              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    start: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-slate-700 shadow-[0_4px_20px_rgba(15,23,42,0.05)] outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Đến ngày
              </label>

              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    end: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-slate-700 shadow-[0_4px_20px_rgba(15,23,42,0.05)] outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Modern KPI Cards with animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 mb-8">
          {/* DOANH THU */}
          <div className="group relative overflow-hidden rounded-[30px] border border-white/20 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-7 text-white shadow-[0_20px_60px_rgba(59,130,246,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(59,130,246,0.45)]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white/15 border border-white/20 backdrop-blur-xl p-4 rounded-2xl">
                  <DollarSign className="w-8 h-8" />
                </div>

                <div
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl border ${
                    revenueGrowth >= 0
                      ? "bg-emerald-400/20 border-emerald-300/20 text-emerald-100"
                      : "bg-red-400/20 border-red-300/20 text-red-100"
                  }`}
                >
                  {revenueGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </div>
              </div>

              <p className="text-blue-100 text-sm uppercase tracking-[0.2em] font-semibold mb-3">
                Tổng doanh thu
              </p>

              <h2 className="text-4xl font-black tracking-tight mb-2 break-words">
                {formatCurrency(totalRevenue)}
              </h2>

              <p className="text-blue-100/90 text-sm">So với kỳ trước</p>
            </div>
          </div>

          {/* ĐƠN HÀNG */}
          <div className="group relative overflow-hidden rounded-[30px] border border-white/20 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-500 p-7 text-white shadow-[0_20px_60px_rgba(16,185,129,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(16,185,129,0.45)]">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white/15 border border-white/20 backdrop-blur-xl p-4 rounded-2xl">
                  <ShoppingCart className="w-8 h-8" />
                </div>

                <div
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl border ${
                    ordersGrowth >= 0
                      ? "bg-emerald-400/20 border-emerald-300/20 text-emerald-100"
                      : "bg-red-400/20 border-red-300/20 text-red-100"
                  }`}
                >
                  {ordersGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(ordersGrowth).toFixed(1)}%
                </div>
              </div>

              <p className="text-emerald-100 text-sm uppercase tracking-[0.2em] font-semibold mb-3">
                Tổng đơn hàng
              </p>

              <h2 className="text-4xl font-black tracking-tight mb-2">
                {totalOrders.toLocaleString()}
              </h2>

              <p className="text-emerald-100/90 text-sm">Đơn hàng trong kỳ</p>
            </div>
          </div>

          {/* KHÁCH HÀNG */}
          <div className="group relative overflow-hidden rounded-[30px] border border-white/20 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-7 text-white shadow-[0_20px_60px_rgba(168,85,247,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(168,85,247,0.45)]">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white/15 border border-white/20 backdrop-blur-xl p-4 rounded-2xl">
                  <Users className="w-8 h-8" />
                </div>

                <div className="px-4 py-2 rounded-full text-xs font-bold bg-white/15 border border-white/20 backdrop-blur-xl">
                  Hoạt động
                </div>
              </div>

              <p className="text-purple-100 text-sm uppercase tracking-[0.2em] font-semibold mb-3">
                Khách hàng
              </p>

              <h2 className="text-4xl font-black tracking-tight mb-2">
                {totalCustomers.toLocaleString()}
              </h2>

              <p className="text-purple-100/90 text-sm">
                Khách hàng đang hoạt động
              </p>
            </div>
          </div>

          {/* SẢN PHẨM */}
          <div className="group relative overflow-hidden rounded-[30px] border border-white/20 bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 p-7 text-white shadow-[0_20px_60px_rgba(249,115,22,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(249,115,22,0.45)]">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white/15 border border-white/20 backdrop-blur-xl p-4 rounded-2xl">
                  <Package className="w-8 h-8" />
                </div>

                <div className="px-4 py-2 rounded-full text-xs font-bold bg-white/15 border border-white/20 backdrop-blur-xl">
                  TB: {formatCurrency(avgOrderValue)}
                </div>
              </div>

              <p className="text-orange-100 text-sm uppercase tracking-[0.2em] font-semibold mb-3">
                Sản phẩm bán ra
              </p>

              <h2 className="text-4xl font-black tracking-tight mb-2">
                {totalProducts.toLocaleString()}
              </h2>

              <p className="text-orange-100/90 text-sm">
                Giá trị trung bình đơn hàng
              </p>
            </div>
          </div>
        </div>

        {/* Area Chart - Revenue Trend */}
        {/* BIỂU ĐỒ DOANH THU */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/75 backdrop-blur-2xl shadow-[0_10px_50px_rgba(99,102,241,0.12)] p-6 mb-7">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white shadow-lg">
                  <span className="text-2xl">📈</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold font-black text-slate-800 tracking-tight">
                    Biểu đồ doanh thu
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Theo dõi doanh thu và đơn hàng theo thời gian
                  </p>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all duration-300">
                  Doanh thu
                </button>

                <button className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-slate-600 font-semibold hover:bg-slate-100 transition-all duration-300">
                  Đơn hàng
                </button>
              </div>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={false}
                  stroke="#64748b"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#64748b"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    borderRadius: "18px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  }}
                  formatter={(value) => formatCurrency(value)}
                />

                <Legend
                  wrapperStyle={{
                    paddingTop: "15px",
                    fontWeight: 600,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={4}
                  name="Doanh thu"
                  activeDot={{
                    r: 7,
                    strokeWidth: 0,
                    fill: "#4f46e5",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  strokeWidth={3}
                  name="Đơn hàng"
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: "#10b981",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PHƯƠNG THỨC THANH TOÁN & KHUNG GIỜ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* PHƯƠNG THỨC THANH TOÁN */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/75 backdrop-blur-2xl shadow-[0_10px_50px_rgba(236,72,153,0.12)] p-6">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/10 blur-3xl rounded-full"></div>

            <div className="relative z-10">
              {/* HEADER */}
              <div className="flex items-center gap-4 mb-7">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 text-white shadow-lg">
                  <CreditCard className="w-7 h-7" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold font-black text-slate-800 tracking-tight">
                    Phương thức thanh toán
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Tỷ lệ doanh thu theo hình thức thanh toán
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div className="space-y-5">
                {paymentData.map((payment, idx) => {
                  const percent = payment.value;
                  const displayName = getPaymentLabel(payment.name);

                  return (
                    <div
                      key={idx}
                      className="group rounded-2xl border border-slate-100 bg-white/70 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shadow-md"
                            style={{
                              backgroundColor: payment.color,
                            }}
                          ></div>

                          <span className="font-bold text-slate-700">
                            {displayName}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-black text-slate-800">
                            {payment.value}%
                          </p>
                        </div>
                      </div>

                      {/* PROGRESS */}
                      <div className="relative h-3 rounded-full overflow-hidden bg-slate-100 mb-2">
                        <div
                          className="absolute h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${percent}%`,
                            background: `linear-gradient(90deg, ${payment.color}, ${payment.color}cc)`,
                          }}
                        ></div>
                      </div>

                      {/* FOOTER */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          {payment.orders.toLocaleString()} đơn hàng
                        </span>

                        <span className="font-bold text-slate-700">
                          {formatCurrency(payment.revenue)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* KHUNG GIỜ MUA SẮM */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/75 backdrop-blur-2xl shadow-[0_10px_50px_rgba(245,158,11,0.12)] p-6">
            {/* Glow */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 blur-3xl rounded-full"></div>

            <div className="relative z-10">
              {/* HEADER */}
              <div className="flex items-center gap-4 mb-7">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg">
                  <Clock className="w-7 h-7" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold font-black text-slate-800 tracking-tight">
                    Khung giờ mua sắm
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Thống kê doanh thu theo thời gian trong ngày
                  </p>
                </div>
              </div>

              {/* CHART */}
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={timeSlotData}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#e2e8f0"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    stroke="#64748b"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#64748b"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      borderRadius: "18px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="url(#barGradient)"
                    radius={[14, 14, 0, 0]}
                    name="Doanh thu"
                  />

                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hiệu suất doanh thu theo khu vực */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Doanh thu theo khu vực
                </h2>
                <p className="text-sm text-slate-500">
                  Thống kê hiệu suất bán hàng từng khu vực
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold">
              Cập nhật realtime
            </div>
          </div>

          {/* Region Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
            {regionData.map((region, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition"></div>

                {/* Top */}
                <div className="relative flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {region.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {region.orders.toLocaleString()} đơn hàng
                    </p>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      region.growth >= 10
                        ? "bg-emerald-100 text-emerald-700"
                        : region.growth >= 5
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    +{region.growth}%
                  </div>
                </div>

                {/* Revenue */}
                <div className="relative">
                  <p className="text-sm text-slate-500 mb-1">Tổng doanh thu</p>

                  <h4 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(region.revenue)}
                  </h4>
                </div>

                {/* Bottom Progress */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Tăng trưởng</span>
                    <span>{region.growth}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(region.growth * 8, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bảng chi tiết đơn hàng */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                📋 Chi tiết đơn hàng
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Danh sách đơn hàng và trạng thái thanh toán
              </p>
            </div>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Xuất file CSV
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                  <th className="text-left py-4 px-5 text-sm font-bold text-slate-700">
                    Mã đơn
                  </th>

                  <th className="text-left py-4 px-5 text-sm font-bold text-slate-700">
                    Khách hàng
                  </th>

                  <th className="text-right py-4 px-5 text-sm font-bold text-slate-700">
                    Tổng tiền
                  </th>

                  <th className="text-center py-4 px-5 text-sm font-bold text-slate-700">
                    Thanh toán
                  </th>

                  <th className="text-center py-4 px-5 text-sm font-bold text-slate-700">
                    Trạng thái
                  </th>

                  <th className="text-center py-4 px-5 text-sm font-bold text-slate-700">
                    Ngày
                  </th>

                  <th className="text-center py-4 px-5 text-sm font-bold text-slate-700">
                    Sản phẩm
                  </th>
                </tr>
              </thead>

              <tbody>
                {detailedOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
                  >
                    {/* Order ID */}
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-indigo-600">
                        #{order.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                          {order.customer.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {order.customer}
                          </p>

                          <p className="text-xs text-slate-500">
                            Khách hàng thân thiết
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-5 text-right">
                      <span className="text-lg font-bold text-emerald-600">
                        {formatCurrency(order.total)}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                          order.payment === "Momo"
                            ? "bg-pink-100 text-pink-700"
                            : order.payment === "Banking"
                              ? "bg-blue-100 text-blue-700"
                              : order.payment === "COD"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.payment === "Momo" && "📱"}
                        {order.payment === "Banking" && "🏦"}
                        {order.payment === "COD" && "💵"}
                        {order.payment === "Thẻ tín dụng" && "💳"}

                        {getPaymentLabel(order.payment)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                          order.status === "Hoàn thành"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "Đang giao"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status === "Hoàn thành" && "✅"}
                        {order.status === "Đang giao" && "🚚"}
                        {order.status === "Đang xử lý" && "⏳"}

                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-center text-sm text-slate-600 font-medium">
                      {order.date}
                    </td>

                    {/* Items */}
                    <td className="py-4 px-5 text-center">
                      <div className="inline-flex items-center justify-center min-w-[36px] h-9 px-3 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                        {order.items}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-sm text-slate-500">
              Hiển thị{" "}
              <span className="font-bold text-slate-800">
                1-{detailedOrders.length}
              </span>{" "}
              trên tổng{" "}
              <span className="font-bold text-slate-800">{totalOrders}</span>{" "}
              đơn hàng
            </p>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition">
                ← Trước
              </button>

              <button className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md">
                1
              </button>

              <button className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                2
              </button>

              <button className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                3
              </button>

              <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition">
                Sau →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pb-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            © 2026{" "}
            <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Theo dõi doanh thu & hiệu suất kinh doanh realtime
            </span>{" "}
            — Phát triển bởi KH3TSHOP-TEAM
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
