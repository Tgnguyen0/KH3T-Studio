// Orders.jsx — KREDO Studio Staff · Order Management
// Style: mirrors Dashboard.jsx + Sidebar.jsx exactly.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ShoppingCart, Eye, Check, RefreshCw, Plus,
  TrendingUp, TrendingDown, X, Search,
} from 'lucide-react';

// ─── helpers ────────────────────────────────────────────────
const formatCurrency = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const STATUS_CFG = {
  PENDING: { label: 'CHỜ DUYỆT', cls: 'text-red-700  bg-red-50  border-red-100' },
  CONFIRMED: { label: 'ĐÃ XÁC NHẬN', cls: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  SHIPPED:   { label: 'ĐANG GIAO',    cls: 'text-blue-700   bg-blue-50   border-blue-100'   },
  DELIVERED: { label: 'ĐÃ GIAO',      cls: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  CANCELLED: { label: 'ĐÃ HUỶ',       cls: 'text-red-700   bg-red-50    border-red-100'    },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || { label: status, cls: 'text-primary/40 bg-secondary border-primary/10' };
  return (
    <span className={`px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

// ─── component ──────────────────────────────────────────────
export default function Orders() {
  const navigate = useNavigate();
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [statusFilter,  setStatusFilter]  = useState('PENDING');
  const [sortBy,        setSortBy]        = useState('date-desc');
  const [showModal,     setShowModal]     = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirming,    setConfirming]    = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res  = await fetch('http://localhost:8080/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data?.result || []);
    } catch { toast.error('Không thể tải đơn hàng'); }
    finally   { setLoading(false); }
  };

  const createInvoice = async (orderId) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch('http://localhost:8080/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId, paymentMethod: 'CASH', paymentStatus: 'UNPAID' }),
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    return res.json();
  };

  const handleConfirm = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !window.confirm('Xác nhận đơn hàng này?')) return;
    try {
      setConfirming(orderId);
      const token = localStorage.getItem('accessToken');
      const statusRes = await fetch(`http://localhost:8080/orders/status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ statusOrder: 'CONFIRMED' }),
      });
      if (!statusRes.ok) throw new Error('Confirm failed');

      try {
        await fetch(`http://localhost:8080/customers/email/notification/${order.account?.id}/${orderId}`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}

      if (order.paymentMethod === 'CASH') {
        try   { await createInvoice(orderId); toast.success('Đã xác nhận & tạo hoá đơn!'); }
        catch { toast.warning('Đã xác nhận, nhưng chưa tạo được hoá đơn.'); }
      } else {
        toast.success('Đã xác nhận đơn hàng!');
      }

      loadOrders();
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || 'Lỗi khi xác nhận');
    } finally {
      setConfirming(null);
    }
  };

  // ── summary counts ──────────────────────────────────────
  const pendingCount   = orders.filter((o) => o.statusOrder === 'PENDING').length;
  const confirmedCount = orders.filter((o) => o.statusOrder === 'CONFIRMED').length;
  const totalRevenue   = orders.reduce((s, o) => s + (o.customerTrading?.totalAmount || 0), 0);

  // ── filtered list ────────────────────────────────────────
  const filtered = orders
    .filter((o) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        o.id?.toString().includes(q) ||
        o.orderCode?.toLowerCase().includes(q) ||
        o.customerTrading?.receiverName?.toLowerCase().includes(q) ||
        o.customerTrading?.receiverPhone?.includes(q);
      const matchStatus = statusFilter === 'all' || o.statusOrder === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc')  return new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt);
      if (sortBy === 'date-asc')   return new Date(a.orderDate || a.createdAt) - new Date(b.orderDate || b.createdAt);
      if (sortBy === 'price-desc') return (b.customerTrading?.totalAmount || 0) - (a.customerTrading?.totalAmount || 0);
      if (sortBy === 'price-asc')  return (a.customerTrading?.totalAmount || 0) - (b.customerTrading?.totalAmount || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-secondary selection:bg-red-500 selection:text-white pb-16">

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="bg-[#111111] text-white border-b border-white/10 mb-12">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">QUẢN LÝ VẬN HÀNH — KREDO STUDIO</span>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-white mt-2 uppercase tracking-tight">
              ĐƠN HÀNG HỆ THỐNG
            </h1>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Xử lý & theo dõi đơn hàng khách hàng</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/product')}
              className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              <Plus size={14} /> TẠO ĐƠN MỚI
            </button>
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest uppercase transition-colors border border-white/10"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> LÀM MỚI
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-12">

        {/* ── KPI Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-red-500"><ShoppingCart className="w-5 h-5" /></div>
              <span className="px-2 py-0.5 border border-primary/15 text-[8px] font-black uppercase tracking-wider text-primary/40">Tổng</span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Tổng đơn hàng</p>
            <p className="text-xl font-display font-black text-primary mt-1">{orders.length.toLocaleString()}</p>
            <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Toàn bộ hệ thống</span>
          </div>

          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-red-500"><TrendingUp className="w-5 h-5" /></div>
              <span className="px-2.5 py-1 border text-[9px] font-black tracking-wider uppercase text-amber-700 bg-red-50 border-red-100">
                {pendingCount} chờ
              </span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Chờ xác nhận</p>
            <p className="text-xl font-display font-black text-primary mt-1">{pendingCount.toLocaleString()}</p>
            <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Cần xử lý ngay</span>
          </div>

          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-red-500"><TrendingUp className="w-5 h-5" /></div>
              <span className="px-2.5 py-1 border text-[9px] font-black tracking-wider uppercase text-emerald-700 bg-emerald-50 border-emerald-100">
                {confirmedCount} đã duyệt
              </span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Tổng doanh thu</p>
            <p className="text-xl font-display font-black text-primary mt-1">{formatCurrency(totalRevenue)}</p>
            <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Tất cả đơn hàng</span>
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
            <Search className="w-4 h-4 text-red-500" />
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">BỘ LỌC ĐƠN HÀNG</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Tìm kiếm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Mã đơn, tên, SĐT..."
                className="w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none border border-primary/5"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none border border-primary/5"
              >
                <option value="all">Tất cả</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="SHIPPED">Đang giao</option>
                <option value="DELIVERED">Đã giao</option>
                <option value="CANCELLED">Đã huỷ</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Sắp xếp</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none border border-primary/5"
              >
                <option value="date-desc">Mới nhất trước</option>
                <option value="date-asc">Cũ nhất trước</option>
                <option value="price-desc">Giá cao nhất</option>
                <option value="price-asc">Giá thấp nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary/5">
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📋 DANH SÁCH ĐƠN HÀNG</h2>
            <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">
              {filtered.length} kết quả{statusFilter !== 'all' ? ` · ${STATUS_CFG[statusFilter]?.label || statusFilter}` : ''}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[10px] font-black tracking-widest uppercase text-primary/30">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto select-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/10">
                    {['MÃ ĐƠN', 'MÃ CODE', 'NGÀY ĐẶT', 'KHÁCH HÀNG', 'TỔNG TIỀN', 'TRẠNG THÁI', 'HÀNH ĐỘNG'].map((h) => (
                      <th key={h} className="py-4 px-4 text-[9px] font-black text-primary/40 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-black text-primary text-xs">#{order.id}</td>
                      <td className="py-4 px-4 text-[10px] font-bold text-primary/60 uppercase tracking-wider">{order.orderCode || '—'}</td>
                      <td className="py-4 px-4 text-[10px] font-bold text-primary/40 font-mono">{formatDate(order.orderDate || order.createdAt)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-primary text-white flex items-center justify-center font-display font-black text-[10px] flex-shrink-0">
                            {(order.customerTrading?.receiverName || '?').charAt(0)}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-wide">
                              {order.customerTrading?.receiverName || '—'}
                            </p>
                            <p className="text-[9px] font-bold text-primary/30 tracking-wider">
                              {order.customerTrading?.receiverPhone || ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-display font-black text-xs text-primary">
                        {formatCurrency(order.customerTrading?.totalAmount || 0)}
                      </td>
                      <td className="py-4 px-4"><StatusBadge status={order.statusOrder} /></td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-[#111111] hover:text-white text-primary text-[9px] font-black tracking-widest uppercase transition-all border border-primary/5"
                          >
                            <Eye size={12} /> VER
                          </button>
                          {order.statusOrder === 'PENDING' && (
                            <button
                              onClick={() => handleConfirm(order.id)}
                              disabled={confirming === order.id}
                              className="flex items-center gap-1.5 px-3 py-2 bg-[#111111] hover:bg-red-500 text-white text-[9px] font-black tracking-widest uppercase transition-all disabled:opacity-50"
                            >
                              <Check size={12} /> DUYỆT
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-primary/5">
              <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">
                Hiển thị {filtered.length} / {orders.length} đơn hàng
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ──────────────────────────────────── */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl">

            {/* Modal header */}
            <div className="bg-[#111111] px-8 py-6 flex justify-between items-center flex-shrink-0">
              <div>
                <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">Chi tiết đơn hàng</span>
                <h2 className="text-2xl font-display font-black text-white mt-1 uppercase">#{selectedOrder.id}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 p-8 space-y-8 bg-secondary">

              {/* Order info */}
              <div className="bg-white border border-primary/5 p-6">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-primary/5">
                  <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📋 Thông tin đơn hàng</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: 'Mã đơn',    value: `#${selectedOrder.id}` },
                    { label: 'Mã code',   value: selectedOrder.orderCode || '—' },
                    { label: 'Ngày đặt',  value: formatDate(selectedOrder.orderDate || selectedOrder.createdAt) },
                    { label: 'Phương thức TT', value: selectedOrder.paymentMethod || '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1">{label}</p>
                      <p className="text-sm font-display font-black text-primary">{value}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1">Trạng thái</p>
                    <StatusBadge status={selectedOrder.statusOrder} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1">Tổng tiền</p>
                    <p className="text-xl font-display font-black text-accent">{formatCurrency(selectedOrder.customerTrading?.totalAmount || 0)}</p>
                  </div>
                  {selectedOrder.note && (
                    <div className="col-span-3">
                      <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1">Ghi chú</p>
                      <p className="text-sm font-bold text-primary/60 bg-secondary p-3 border border-primary/5">{selectedOrder.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Receiver */}
              <div className="bg-white border border-primary/5 p-6">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-primary/5">
                  <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">📦 Thông tin người nhận</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Họ tên', value: selectedOrder.customerTrading?.receiverName || '—' },
                    { label: 'Điện thoại', value: selectedOrder.customerTrading?.receiverPhone || '—' },
                    { label: 'Email', value: selectedOrder.customerTrading?.receiverEmail || '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1">{label}</p>
                      <p className="text-sm font-bold text-primary">{value}</p>
                    </div>
                  ))}
                  <div className="col-span-2">
                    <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1">Địa chỉ</p>
                    <p className="text-sm font-bold text-primary bg-secondary p-3 border border-primary/5">
                      {selectedOrder.customerTrading?.receiverAddress || '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account */}
              {selectedOrder.account && (
                <div className="bg-white border border-primary/5 p-6">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-primary/5">
                    <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">👤 Tài khoản đặt hàng</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { label: 'Username', value: selectedOrder.account.username || '—' },
                      { label: 'Họ tên', value: selectedOrder.account.customer?.fullName || '—' },
                      { label: 'Điện thoại', value: selectedOrder.account.customer?.phoneNumber || '—' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1">{label}</p>
                        <p className="text-sm font-bold text-primary">{value}</p>
                      </div>
                    ))}
                    {selectedOrder.account.customer?.email && (
                      <div className="col-span-3">
                        <p className="text-[9px] font-black tracking-widest text-primary/40 uppercase mb-1">Email</p>
                        <p className="text-sm font-bold text-primary">{selectedOrder.account.customer.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Products */}
              {selectedOrder.orderDetails?.length > 0 && (
                <div className="bg-white border border-primary/5 p-6">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-primary/5">
                    <h3 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">
                      🛍️ SẢN PHẨM ({selectedOrder.orderDetails.length})
                    </h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-primary/10">
                        {['#', 'SẢN PHẨM', 'SL', 'ĐƠN GIÁ', 'THÀNH TIỀN'].map((h) => (
                          <th key={h} className={`py-3 px-4 text-[9px] font-black text-primary/40 uppercase tracking-widest ${h === 'ĐƠN GIÁ' || h === 'THÀNH TIỀN' ? 'text-right' : h === 'SL' ? 'text-center' : ''}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {selectedOrder.orderDetails.map((item, i) => (
                        <tr key={i} className="hover:bg-secondary/40 transition-colors">
                          <td className="py-3 px-4 text-[10px] font-bold text-primary/40">{i + 1}</td>
                          <td className="py-3 px-4 text-[10px] font-black text-primary uppercase tracking-wide">{item.productName || '—'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-secondary text-primary font-mono text-[9px] font-bold">{item.quantity}</span>
                          </td>
                          <td className="py-3 px-4 text-right text-[10px] font-bold text-primary/60">{formatCurrency(item.unitPrice || 0)}</td>
                          <td className="py-3 px-4 text-right font-display font-black text-sm text-primary">{formatCurrency(item.totalPrice || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-primary/10 bg-secondary">
                        <td colSpan={4} className="py-3 px-4 text-right text-[9px] font-black tracking-widest uppercase text-primary/40">Tổng cộng</td>
                        <td className="py-3 px-4 text-right font-display font-black text-base text-accent">
                          {formatCurrency(selectedOrder.customerTrading?.totalAmount || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="bg-white border-t border-primary/5 px-8 py-5 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-primary/10 text-primary/60 hover:text-primary text-[10px] font-black tracking-widest uppercase transition-colors bg-white"
              >
                ĐÓNG
              </button>
              {selectedOrder.statusOrder === 'PENDING' && (
                <button
                  onClick={() => handleConfirm(selectedOrder.id)}
                  disabled={!!confirming}
                  className="flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-red-500 text-white text-[10px] font-black tracking-widest uppercase transition-colors disabled:opacity-60"
                >
                  <Check size={14} /> XÁC NHẬN ĐƠN HÀNG
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-8 text-[9px] font-bold text-primary/20 uppercase tracking-[0.25em] max-w-7xl mx-auto px-8">
        © {new Date().getFullYear()} KREDO STUDIO. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}