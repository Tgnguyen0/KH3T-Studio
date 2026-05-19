// File: src/pages/admin/Dashboard.jsx
import { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, DollarSign, ShoppingCart, Users, Package, Download, TrendingUp, TrendingDown, Clock, MapPin, CreditCard } from 'lucide-react';

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
  // 7. FORMAT CURRENCY
  // -------------------------
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
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

    const activeData = chartData.filter(item => item.orders > 0 || item.revenue > 0);

    const rows = activeData.map(i => {
      const [year, month, day] = i.date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      return [
        `"${formattedDate}"`,
        i.revenue,
        i.orders,
        i.customers,
        i.products
      ];
    });

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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Hoàn thành': return 'Hoàn thành';
      case 'Đang giao': return 'Đang giao';
      case 'Đang xử lý': return 'Đang xử lý';
      case 'Hủy': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentLabel = (payment) => {
    switch (payment) {
      case 'Thẻ tín dụng': return 'Thẻ tín dụng';
      case 'Banking': return 'Chuyển khoản';
      default: return payment;
    }
  }

  return (
    <div className="min-h-screen bg-secondary selection:bg-accent selection:text-white pb-16">

      {/* Luxury Corporate Header */}
      <div className="bg-[#111111] text-white border-b border-white/10 mb-12">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[#c87a53] text-[9px] font-black tracking-[0.4em] uppercase">BÁO CÁO KREDO STUDIO</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-white mt-2 uppercase tracking-tight">
              BẢNG ĐIỀU KHIỂN HỆ THỐNG
            </h1>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Đo lường & Phân tích hiệu suất doanh thu kinh doanh</p>
          </div>
          <div className="md:text-right">
            <span className="text-white/30 text-[9px] font-bold tracking-widest uppercase block mb-1">Cập nhật lần cuối</span>
            <span className="text-lg font-display font-black text-[#c87a53]">{new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-12">

        {/* Date Filters block */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
            <Calendar className="w-4 h-4 text-[#c87a53]" />
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">BỘ LỌC THỜI GIAN</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
            {[
              { label: 'Hôm nay', action: 'today' },
              { label: 'Hôm qua', action: 'yesterday' },
              { label: '7 Ngày qua', action: '7days' },
              { label: '30 Ngày qua', action: '30days' },
              { label: 'Tháng này', action: 'thisMonth' },
              { label: 'Năm nay', action: 'thisYear' }
            ].map((btn) => (
              <button
                key={btn.action}
                onClick={() => setQuickRange(btn.action)}
                className="px-4 py-3 bg-secondary hover:bg-[#c87a53] hover:text-white text-primary text-[10px] font-black tracking-wider uppercase transition-all duration-300 border border-primary/5"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Từ ngày</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-[#c87a53] focus:outline-none border border-primary/5"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Đến ngày</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-[#c87a53] focus:outline-none border border-primary/5"
              />
            </div>
          </div>
        </div>

        {/* KPI metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1: Revenue */}
          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-[#c87a53]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 border text-[9px] font-black tracking-wider uppercase ${revenueGrowth >= 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-accent bg-accent/5 border-accent/10'}`}>
                {revenueGrowth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(revenueGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Tổng doanh thu</p>
            <p className="text-xl font-display font-black text-primary mt-1">{formatCurrency(totalRevenue)}</p>
            <span className="text-[9px] text-[#c87a53] font-semibold tracking-wider block mt-2 uppercase">So với chu kỳ trước</span>
          </div>

          {/* Card 2: Orders */}
          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-[#c87a53]">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 border text-[9px] font-black tracking-wider uppercase ${ordersGrowth >= 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-accent bg-accent/5 border-accent/10'}`}>
                {ordersGrowth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(ordersGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Số đơn đặt hàng</p>
            <p className="text-xl font-display font-black text-primary mt-1">{totalOrders.toLocaleString()}</p>
            <span className="text-[9px] text-[#c87a53] font-semibold tracking-wider block mt-2 uppercase">Tổng số giao dịch</span>
          </div>

          {/* Card 3: Customers */}
          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-[#c87a53]">
                <Users className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 border border-primary/15 text-[8px] font-black uppercase tracking-wider text-primary/40">Hoạt động</span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Khách hàng mới</p>
            <p className="text-xl font-display font-black text-primary mt-1">{totalCustomers.toLocaleString()}</p>
            <span className="text-[9px] text-[#c87a53] font-semibold tracking-wider block mt-2 uppercase">Lượng tương tác chu kỳ</span>
          </div>

          {/* Card 4: Average ticket */}
          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-[#c87a53]">
                <Package className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 border border-primary/15 text-[8px] font-black uppercase tracking-wider text-[#c87a53]">Giá trị trung bình</span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Sản phẩm tiêu thụ</p>
            <p className="text-xl font-display font-black text-primary mt-1">{totalProducts.toLocaleString()}</p>
            <span className="text-[9px] text-[#c87a53] font-semibold tracking-wider block mt-2 uppercase">AOV: {formatCurrency(avgOrderValue)}</span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary/5">
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📊 XU HƯỚNG DOANH THU & ĐƠN HÀNG</h2>
            <div className="flex gap-1.5 text-[9px] font-black uppercase tracking-widest">
              <span className="px-3 py-1 bg-primary text-white">Doanh thu</span>
              <span className="px-3 py-1 bg-secondary text-primary">Đơn đặt</span>
            </div>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c87a53" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c87a53" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1ee" />
                <XAxis dataKey="date" stroke="#111111" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                <YAxis stroke="#111111" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(17,17,17,0.1)',
                    borderRadius: '0px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend style={{ fontSize: '10px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#c87a53" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
                <Area type="monotone" dataKey="orders" stroke="#111111" strokeWidth={1.5} fillOpacity={0} name="Số đơn hàng" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Analysis panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Payment breakdown */}
          <div className="bg-white border border-primary/5 p-8">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
              <CreditCard className="w-4 h-4 text-[#c87a53]" />
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">💳 PHƯƠNG THỨC THANH TOÁN</h2>
            </div>
            <div className="space-y-6">
              {paymentData.map((payment, idx) => {
                const percent = (payment.value);
                const displayName = getPaymentLabel(payment.name);

                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>{displayName}</span>
                      <span className="text-[#c87a53]">{payment.value}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-none overflow-hidden">
                      <div
                        className="h-full bg-[#111111] transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: '#c87a53' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-primary/40 uppercase tracking-wider">
                      <span>{payment.orders.toLocaleString()} ĐƠN HÀNG</span>
                      <span>{formatCurrency(payment.revenue)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly peek graph */}
          <div className="bg-white border border-primary/5 p-8">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
              <Clock className="w-4 h-4 text-[#c87a53]" />
              <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">⏰ KHUNG GIỜ MUA SẮM CAO ĐIỂM</h2>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSlotData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1ee" />
                  <XAxis dataKey="time" stroke="#111111" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                  <YAxis stroke="#111111" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(17,17,17,0.1)',
                      borderRadius: '0px',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#111111" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Region Breakdown */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
            <MapPin className="w-4 h-4 text-[#c87a53]" />
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">🗺️ HIỆU SUẤT DOANH THU THEO VÙNG MIỀN</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {regionData.map((region, idx) => (
              <div key={idx} className="p-5 bg-secondary border border-primary/5 hover:border-primary/15 transition-all text-[10px] font-bold text-primary/50 uppercase tracking-widest space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-primary font-black text-[11px]">{region.name}</span>
                  <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5">+{region.growth}%</span>
                </div>
                <p className="text-base font-display font-black text-accent mt-2">{formatCurrency(region.revenue)}</p>
                <p className="text-[9px] text-primary/30 tracking-wider font-semibold">{region.orders.toLocaleString()} ĐƠN HÀNG</p>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-3 border-b border-primary/5">
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📋 DANH SÁCH ĐƠN HÀNG CHI TIẾT</h2>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-3 bg-[#111111] hover:bg-[#c87a53] text-white text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              XUẤT FILE CSV
            </button>
          </div>

          <div className="overflow-x-auto select-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="py-4 px-4 text-[9px] font-black text-primary/40 uppercase tracking-widest">MÃ ĐƠN HÀNG</th>
                  <th className="py-4 px-4 text-[9px] font-black text-primary/40 uppercase tracking-widest">KHÁCH HÀNG</th>
                  <th className="py-4 px-4 text-right text-[9px] font-black text-primary/40 uppercase tracking-widest">TỔNG CỘNG</th>
                  <th className="py-4 px-4 text-center text-[9px] font-black text-primary/40 uppercase tracking-widest">THANH TOÁN</th>
                  <th className="py-4 px-4 text-center text-[9px] font-black text-primary/40 uppercase tracking-widest">TRẠNG THÁI</th>
                  <th className="py-4 px-4 text-center text-[9px] font-black text-primary/40 uppercase tracking-widest">NGÀY ĐẶT</th>
                  <th className="py-4 px-4 text-center text-[9px] font-black text-primary/40 uppercase tracking-widest">SỐ LƯỢNG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-[10px] font-bold text-primary/60 uppercase tracking-wider">
                {detailedOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-black text-primary">{order.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-primary text-white flex items-center justify-center font-display font-black text-[10px]">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="text-primary font-black">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-display font-black text-xs text-primary">{formatCurrency(order.total)}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 border border-primary/10 bg-secondary text-[8px] font-black tracking-widest uppercase">
                        {getPaymentLabel(order.payment)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase ${order.status === 'Hoàn thành' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                        order.status === 'Đang giao' ? 'text-blue-700 bg-blue-50 border-blue-100' :
                          'text-amber-700 bg-amber-50 border-amber-100'
                        }`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-primary/40 font-mono">{order.date}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-secondary text-primary font-mono text-[9px]">
                        {order.items}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-primary/5 text-[9px] font-bold text-primary/30 uppercase tracking-widest">
            <p>Hiển thị 1-{detailedOrders.length} của {totalOrders} đơn hàng</p>
            <div className="flex gap-1">
              <button className="px-3 py-2 border border-primary/10 text-primary/60 hover:text-primary transition-colors bg-white">Trước</button>
              <button className="px-3 py-2 bg-primary text-white">1</button>
              <button className="px-3 py-2 border border-primary/10 text-primary/60 hover:text-primary transition-colors bg-white">2</button>
              <button className="px-3 py-2 border border-primary/10 text-primary/60 hover:text-primary transition-colors bg-white">Tiếp</button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-8 text-[9px] font-bold text-primary/20 uppercase tracking-[0.25em]">
          © {new Date().getFullYear()} KREDO STUDIO RETAIL REPORT. ALL RIGHTS RESERVED.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
