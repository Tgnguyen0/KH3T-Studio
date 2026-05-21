// Invoices.jsx — KREDO Studio Staff · Invoice Management
// Style: mirrors Orders.jsx + Sidebar.jsx exactly.
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  FileText, RefreshCw, Search, TrendingUp, TrendingDown, CheckCircle,
} from 'lucide-react';

// ─── helpers ────────────────────────────────────────────────
const formatCurrency = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const PAYMENT_STATUS_CFG = {
  PAID:   { label: 'ĐÃ THANH TOÁN',   cls: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  UNPAID: { label: 'CHƯA THANH TOÁN', cls: 'text-red-700     bg-red-50     border-red-100'     },
};

const PAYMENT_METHOD_LABELS = {
  CASH:          'Tiền mặt',
  CREDIT_CARD:   'Thẻ tín dụng',
  DEBIT_CARD:    'Thẻ ghi nợ',
  BANK_TRANSFER: 'Chuyển khoản',
  MOMO:          'MoMo',
  ZALOPAY:       'ZaloPay',
  VNPAY:         'VNPay',
};

const StatusBadge = ({ status }) => {
  const cfg = PAYMENT_STATUS_CFG[status] || { label: status, cls: 'text-primary/40 bg-secondary border-primary/10' };
  return (
    <span className={`px-2.5 py-1 border text-[8px] font-black tracking-widest uppercase ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

// ─── component ──────────────────────────────────────────────
export default function Invoices() {
  const [invoices,             setInvoices]             = useState([]);
  const [loading,              setLoading]              = useState(true);
  const [searchTerm,           setSearchTerm]           = useState('');
  const [statusFilter,         setStatusFilter]         = useState('all');
  const [paymentMethodFilter,  setPaymentMethodFilter]  = useState('all');
  const [sortBy,               setSortBy]               = useState('date-desc');

  useEffect(() => { loadInvoices(); }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res  = await fetch('http://localhost:8080/invoices');
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : data?.result || []);
    } catch { toast.error('Không thể tải danh sách hoá đơn'); }
    finally   { setLoading(false); }
  };

  // ── filtered list ────────────────────────────────────────
  const filtered = invoices
    .filter((inv) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        inv.id?.toString().includes(q) ||
        inv.invoiceCode?.toLowerCase().includes(q) ||
        inv.order?.orderCode?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
      const matchMethod = paymentMethodFilter === 'all' || inv.paymentMethod === paymentMethodFilter;
      return matchSearch && matchStatus && matchMethod;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc')    return new Date(b.createdAt || b.createDate) - new Date(a.createdAt || a.createDate);
      if (sortBy === 'date-asc')     return new Date(a.createdAt || a.createDate) - new Date(b.createdAt || b.createDate);
      if (sortBy === 'amount-desc')  return (b.totalAmount || 0) - (a.totalAmount || 0);
      if (sortBy === 'amount-asc')   return (a.totalAmount || 0) - (b.totalAmount || 0);
      return 0;
    });

  // ── summary stats ────────────────────────────────────────
  const paidTotal   = invoices.filter((i) => i.paymentStatus === 'PAID').reduce((s, i) => s + (i.totalAmount || 0), 0);
  const unpaidCount = invoices.filter((i) => i.paymentStatus === 'UNPAID').length;
  const totalRevenue = invoices.reduce((s, i) => s + (i.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-secondary selection:bg-red-500 selection:text-white pb-16">

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="bg-[#111111] text-white border-b border-white/10 mb-12">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-red-500 text-[9px] font-black tracking-[0.4em] uppercase">QUẢN LÝ VẬN HÀNH — KREDO STUDIO</span>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-white mt-2 uppercase tracking-tight">
              HOÁ ĐƠN HỆ THỐNG
            </h1>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Theo dõi & quản lý hoá đơn thanh toán</p>
          </div>
          <button
            onClick={loadInvoices}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest uppercase transition-colors border border-white/10"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> LÀM MỚI
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-12">

        {/* ── KPI Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-red-500"><FileText className="w-5 h-5" /></div>
              <span className="px-2 py-0.5 border border-primary/15 text-[8px] font-black uppercase tracking-wider text-primary/40">Tổng</span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Tổng hoá đơn</p>
            <p className="text-xl font-display font-black text-primary mt-1">{invoices.length.toLocaleString()}</p>
            <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Toàn bộ hệ thống</span>
          </div>

          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-red-500"><TrendingUp className="w-5 h-5" /></div>
              <span className="px-2.5 py-1 border text-[9px] font-black tracking-wider uppercase text-emerald-700 bg-emerald-50 border-emerald-100">
                Đã TT
              </span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Đã thanh toán</p>
            <p className="text-xl font-display font-black text-primary mt-1">{formatCurrency(paidTotal)}</p>
            <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Doanh thu xác nhận</span>
          </div>

          <div className="bg-white border border-primary/5 p-6 hover:border-primary/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-secondary p-3 text-red-500"><TrendingDown className="w-5 h-5" /></div>
              <span className="px-2.5 py-1 border text-[9px] font-black tracking-wider uppercase text-red-700 bg-red-50 border-red-100">
                {unpaidCount} chưa TT
              </span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Chưa thanh toán</p>
            <p className="text-xl font-display font-black text-primary mt-1">{unpaidCount.toLocaleString()}</p>
            <span className="text-[9px] text-red-500 font-semibold tracking-wider block mt-2 uppercase">Cần xử lý</span>
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-primary/5">
            <Search className="w-4 h-4 text-red-500" />
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">BỘ LỌC HOÁ ĐƠN</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Tìm kiếm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Mã HĐ, mã đơn..."
                className="w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none border border-primary/5"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Trạng thái TT</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none border border-primary/5"
              >
                <option value="all">Tất cả</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="UNPAID">Chưa thanh toán</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-primary/40 uppercase">Phương thức</label>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full bg-secondary p-3 text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none border border-primary/5"
              >
                <option value="all">Tất cả</option>
                <option value="CASH">Tiền mặt</option>
                <option value="BANK_TRANSFER">Chuyển khoản</option>
                <option value="MOMO">MoMo</option>
                <option value="VNPAY">VNPay</option>
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
                <option value="amount-desc">Số tiền cao nhất</option>
                <option value="amount-asc">Số tiền thấp nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────── */}
        <div className="bg-white border border-primary/5 p-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary/5">
            <h2 className="text-xs font-display font-black tracking-[0.2em] text-primary uppercase">🧾 DANH SÁCH HOÁ ĐƠN</h2>
            <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">
              {filtered.length} kết quả
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[10px] font-black tracking-widest uppercase text-primary/30">Không có hoá đơn nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto select-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/10">
                    {['ID', 'MÃ HOÁ ĐƠN', 'MÃ ĐƠN HÀNG', 'NGÀY TẠO', 'PHƯƠNG THỨC', 'TRẠNG THÁI', 'TỔNG TIỀN'].map((h) => (
                      <th
                        key={h}
                        className={`py-4 px-4 text-[9px] font-black text-primary/40 uppercase tracking-widest ${h === 'TỔNG TIỀN' ? 'text-right' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-black text-primary text-xs">#{inv.id}</td>
                      <td className="py-4 px-4 text-[10px] font-bold text-primary/60 uppercase tracking-wider font-mono">
                        {inv.invoiceCode || '—'}
                      </td>
                      <td className="py-4 px-4 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                        {inv.order?.orderCode || '—'}
                      </td>
                      <td className="py-4 px-4 text-[10px] font-bold text-primary/40 font-mono">
                        {formatDate(inv.createdAt || inv.createDate)}
                      </td>
                      <td className="py-4 px-4 text-[10px] font-bold text-primary/60 uppercase tracking-wider">
                        {PAYMENT_METHOD_LABELS[inv.paymentMethod] || inv.paymentMethod || '—'}
                      </td>
                      <td className="py-4 px-4"><StatusBadge status={inv.paymentStatus} /></td>
                      <td className="py-4 px-4 font-display font-black text-xs text-primary text-right">
                        {formatCurrency(inv.totalAmount || 0)}
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
                Hiển thị {filtered.length} / {invoices.length} hoá đơn
              </p>
              <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">
                Tổng: <span className="text-primary">{formatCurrency(filtered.reduce((s, i) => s + (i.totalAmount || 0), 0))}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 text-[9px] font-bold text-primary/20 uppercase tracking-[0.25em] max-w-7xl mx-auto px-8">
        © {new Date().getFullYear()} KREDO STUDIO. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}