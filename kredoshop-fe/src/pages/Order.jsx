// File: src/pages/Order.jsx

import React, { useState, useEffect } from "react";
import {
  Package, Clock, CheckCircle, XCircle, Truck,
  CheckCircle2, ListChecks,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Order = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      let currentUserId = localStorage.getItem("userId");
      if (!currentUserId) {
        const userRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/accounts/myinfor`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData && userData.result) {
            currentUserId = userData.result.id;
            localStorage.setItem("userId", currentUserId);
            localStorage.setItem("user", JSON.stringify(userData.result));
          }
        }
      }

      if (!currentUserId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/orders/account/${currentUserId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const STATUS_CFG = {
    PENDING:   { label: "Chờ xác nhận",   cls: "text-red-700   bg-red-50   border-red-100",     icon: Clock,         step: 1 },
    CONFIRMED: { label: "Đã xác nhận",    cls: "text-blue-700  bg-blue-50  border-blue-100",    icon: CheckCircle,   step: 2 },
    SHIPPING:  { label: "Đang giao hàng", cls: "text-blue-700  bg-blue-50  border-blue-100",    icon: Truck,         step: 3 },
    COMPLETED: { label: "Hoàn thành",     cls: "text-emerald-700 bg-emerald-50 border-emerald-100", icon: CheckCircle2, step: 4 },
    CANCELLED: { label: "Đã hủy",         cls: "text-primary/40 bg-secondary border-primary/10", icon: XCircle,      step: 0 },
  };

  const STEPS = [
    { key: "PENDING",   label: "Chờ duyệt", icon: Clock },
    { key: "CONFIRMED", label: "Xác nhận",  icon: CheckCircle },
    { key: "SHIPPING",  label: "Đang giao", icon: Truck },
    { key: "COMPLETED", label: "Hoàn tất",  icon: CheckCircle2 },
  ];

  const getPaymentMethodLabel = (method) => ({
    COD: "COD", BANKING: "Chuyển khoản", MOMO: "MoMo", VNPAY: "VNPAY",
  }[method] || method);

  const TABS = [
    { key: "all",       label: "Tất cả",        count: orders.length },
    { key: "pending",   label: "Chờ xác nhận",  count: orders.filter(o => o.statusOrder === "PENDING").length },
    { key: "confirmed", label: "Đã xác nhận",   count: orders.filter(o => o.statusOrder === "CONFIRMED").length },
  ];

  const filteredOrders = activeTab === "all" ? orders
    : activeTab === "pending" ? orders.filter(o => o.statusOrder === "PENDING")
    : orders.filter(o => o.statusOrder === "CONFIRMED");

  const handleCancel = async (id) => {
    toast(
      (t) => (
        <div className="p-4 selection:bg-accent selection:text-white">
          <p className="font-display font-black text-xs text-primary uppercase tracking-widest flex items-center gap-2">
            <span>⚠️</span> Hủy đơn hàng này?
          </p>
          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-2 leading-relaxed">
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 mt-5">
            <button
              className="px-4 py-2 bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-colors"
              onClick={async () => {
                toast.dismiss(t);
                try {
                  const token = localStorage.getItem("accessToken");
                  await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/orders/status/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ statusOrder: "CANCELLED" }),
                  });
                  await fetchOrders();
                  toast.success("Đơn hàng đã được hủy thành công.");
                } catch { toast.error("Lỗi khi hủy đơn hàng!"); }
              }}
            >Hủy Đơn</button>
            <button
              className="px-4 py-2 border border-primary/10 text-primary bg-white text-[9px] font-black tracking-widest uppercase hover:bg-secondary transition"
              onClick={() => toast.dismiss(t)}
            >Giữ Đơn</button>
          </div>
        </div>
      ),
      { duration: Infinity, className: "rounded-none border border-primary/10 bg-white shadow-xl" }
    );
  };

  return (
    <div className="min-h-screen bg-secondary selection:bg-accent selection:text-white">

      {/* ── Hero bar ── */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-red-500 text-xs sm:text-sm font-black tracking-[0.3em] uppercase mb-2">KREDO STUDIO — TÀI KHOẢN</p>
            <h1 className="text-3xl lg:text-5xl font-display font-black uppercase tracking-tight text-white leading-none">
              Đơn hàng
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm font-black tracking-widest text-white/30 uppercase">
              {orders.length} đơn hàng
            </span>
            <button
              onClick={() => navigate("/product")}
              className="text-xs sm:text-sm font-black tracking-widest text-white/40 uppercase hover:text-white transition-colors border-b border-white/10 hover:border-white pb-1"
            >
              Mua sắm tiếp →
            </button>
          </div>
        </div>

        {/* ── Tab bar inside hero ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex border-t border-white/5 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-8 py-5 font-display font-black text-xs sm:text-sm uppercase tracking-widest transition-all border-b-2 flex items-center gap-3
                ${activeTab === tab.key
                  ? "border-red-500 text-white"
                  : "border-transparent text-white/30 hover:text-white/60"}`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] sm:text-xs px-2.5 py-1 font-black ${activeTab === tab.key ? "bg-red-50 text-accent" : "bg-white/10 text-white/40"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-2 border-red-500 border-t-transparent animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 bg-white border border-primary/5 gap-8">
            <div className="w-20 h-20 bg-secondary flex items-center justify-center text-primary/20">
              <Package size={40} />
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm font-black text-primary/30 uppercase tracking-[0.3em] mb-2">Không có đơn hàng nào</p>
              <p className="text-xs text-primary/20 font-bold uppercase tracking-widest">Danh mục này đang trống</p>
            </div>
            <button
              onClick={() => navigate("/product")}
              className="px-10 py-4.5 bg-[#111111] hover:bg-accent text-white text-xs sm:text-sm font-black tracking-[0.3em] uppercase transition-colors"
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map((order) => {
              const cfg = STATUS_CFG[order.statusOrder] || STATUS_CFG.PENDING;
              const Icon = cfg.icon;
              const isExpanded = expandedOrder === order.id;
              const subtotal = order.orderDetails.reduce((s, d) => s + d.totalPrice, 0);
              const orderTotal = order.customerTrading?.totalAmount !== undefined && order.customerTrading?.totalAmount !== null
                ? order.customerTrading.totalAmount
                : (subtotal >= 1000000 ? subtotal : subtotal + 30000);
              const shippingFee = orderTotal - subtotal;
              const isCancelled = order.statusOrder === "CANCELLED";

              return (
                <div
                  key={order.id}
                  className="bg-white border border-primary/5 hover:border-primary/15 transition-all overflow-hidden shadow-sm"
                >
                  {/* ── Order header ── */}
                  <div className="bg-[#111111] px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-red-500 text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase mb-1">Mã đơn hàng</p>
                        <p className="text-white font-display font-black text-base sm:text-lg uppercase tracking-wider">{order.orderCode}</p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-white/10" />
                      <div className="hidden sm:block">
                        <p className="text-white/30 text-[10px] sm:text-xs font-black tracking-widest uppercase mb-1">Ngày đặt</p>
                        <p className="text-white/60 text-xs sm:text-sm font-bold">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 border text-[10px] sm:text-xs font-black uppercase tracking-widest ${cfg.cls}`}>
                        <Icon size={13} />
                        {cfg.label}
                      </span>
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="text-white/45 hover:text-white text-[10px] sm:text-xs font-black tracking-widest uppercase transition-colors flex items-center gap-1.5 border border-white/10 hover:border-white/30 px-4 py-2"
                      >
                        {isExpanded ? "Thu gọn ↑" : "Xem chi tiết ↓"}
                      </button>
                    </div>
                  </div>

                  {/* ── Progress tracker ── */}
                  {!isCancelled && (
                    <div className="px-8 py-8 bg-secondary/30 border-b border-primary/5 relative">
                      <div className="relative w-full max-w-4xl mx-auto px-4">
                        {/* Progress track line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-primary/10 -translate-y-1/2" />
                        {/* Active Progress fill line */}
                        <div 
                          className="absolute top-5 left-0 h-0.5 bg-[#111111] -translate-y-1/2 transition-all duration-500" 
                          style={{ 
                            width: `${
                              cfg.step === 1 ? '0%' :
                              cfg.step === 2 ? '33.33%' :
                              cfg.step === 3 ? '66.66%' : '100%'
                            }` 
                          }} 
                        />
                        
                        {/* Step indicators */}
                        <div className="relative flex justify-between w-full">
                          {STEPS.map((step, i) => {
                            const StepIcon = step.icon;
                            const done = cfg.step >= (i + 1);
                            return (
                              <div key={step.key} className="flex flex-col items-center gap-2 z-10 bg-transparent px-1">
                                <div className={`w-10 h-10 flex items-center justify-center border transition-all
                                  ${done
                                    ? "bg-[#111111] border-[#111111] text-white"
                                    : "bg-white border-primary/15 text-primary/25"}`}>
                                  <StepIcon size={16} />
                                </div>
                                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap bg-[#f9f8f6] px-1.5 py-0.5
                                  ${done ? "text-primary/70" : "text-primary/20"}`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Compact summary row (always visible) ── */}
                  <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/5">
                    {/* Product thumbnails */}
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {order.orderDetails.slice(0, 3).map((detail, i) => (
                          <div
                            key={i}
                            className="w-12 h-16 bg-secondary border-2 border-white overflow-hidden flex-shrink-0 shadow-sm"
                            style={{ zIndex: 3 - i }}
                          >
                            {detail.productImage ? (
                              <img src={detail.productImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary/20 text-xs font-black">
                                {detail.productName?.charAt(0)}
                              </div>
                            )}
                          </div>
                        ))}
                        {order.orderDetails.length > 3 && (
                          <div className="w-12 h-16 bg-secondary border-2 border-white flex items-center justify-center flex-shrink-0 shadow-sm z-0">
                            <span className="text-xs font-black text-primary/50">+{order.orderDetails.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-black text-primary uppercase tracking-wide">
                          {order.orderDetails.length} sản phẩm
                        </p>
                        <p className="text-xs font-bold text-primary/45 uppercase tracking-widest mt-1">
                          {order.orderDetails[0]?.productName}
                          {order.orderDetails.length > 1 && ` +${order.orderDetails.length - 1} khác`}
                        </p>
                      </div>
                    </div>

                    {/* Total + action */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs font-bold text-primary/35 uppercase tracking-widest mb-1">Tổng cộng</p>
                        <p className="font-display font-black text-xl sm:text-2xl text-accent tabular-nums">{formatPrice(orderTotal)}</p>
                      </div>
                      {order.statusOrder === "PENDING" && (
                        <button
                          className="px-6 py-3 border border-primary/15 hover:border-accent text-primary/50 hover:text-accent text-xs font-black tracking-widest uppercase transition-all"
                          onClick={() => handleCancel(order.id)}
                        >
                          Hủy đơn
                        </button>
                      )}
                      {order.statusOrder === "COMPLETED" && (
                        <button
                          onClick={() => navigate("/product")}
                          className="px-6 py-3 bg-[#111111] hover:bg-accent text-white text-xs font-black tracking-widest uppercase transition-all"
                        >
                          Mua lại
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Expanded detail ── */}
                  {isExpanded && (
                    <div className="px-8 py-8 space-y-8">

                      {/* Receiver info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-primary/5">
                        {[
                          { label: "Người nhận", value: order.customerTrading.receiverName },
                          { label: "Điện thoại",  value: order.customerTrading.receiverPhone },
                          { label: "Địa chỉ",     value: order.customerTrading.receiverAddress },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-xs font-black text-primary/30 uppercase tracking-widest mb-1.5">{label}</p>
                            <p className="text-sm font-black text-primary uppercase tracking-wide leading-relaxed">{value || "—"}</p>
                          </div>
                        ))}
                      </div>

                      {/* Item list */}
                      <div className="divide-y divide-primary/5">
                        {order.orderDetails.map((detail) => (
                          <div key={detail.id} className="py-5 flex items-center gap-6 first:pt-0">
                            {/* Thumbnail */}
                            <div className="w-16 h-20 bg-secondary flex-shrink-0 overflow-hidden border border-primary/5 shadow-sm">
                              {detail.productImage
                                ? <img src={detail.productImage} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-primary/20 font-black text-sm">{detail.productName?.charAt(0)}</div>
                              }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-display font-black text-sm sm:text-base text-primary uppercase tracking-tight hover:text-red-500 transition-colors cursor-pointer truncate"
                                onClick={() => navigate(`/product/${detail.productId}`)}
                              >
                                {detail.productName}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs font-black text-primary/45 uppercase tracking-widest">
                                  Số lượng: <span className="text-primary">{detail.quantity}</span>
                                </span>
                                <span className="w-0.5 h-0.5 bg-primary/20 rounded-full" />
                                <span className="text-xs font-black text-primary/45 uppercase tracking-widest">
                                  {formatPrice(detail.unitPrice)} / cái
                                </span>
                              </div>
                            </div>

                            {/* Line total */}
                            <div className="text-right flex-shrink-0">
                              <p className="font-display font-black text-base text-primary tabular-nums">
                                {formatPrice(detail.quantity * detail.unitPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals breakdown */}
                      <div className="border border-primary/5 p-6 bg-secondary/30 space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm font-bold text-primary/45 uppercase tracking-widest">
                          <span>Tạm tính</span>
                          <span className="text-primary font-black tabular-nums">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm font-bold text-primary/45 uppercase tracking-widest">
                          <span>Phí vận chuyển</span>
                          <span className="text-primary font-black">
                            {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm font-bold text-primary/45 uppercase tracking-widest pt-3 border-t border-primary/8">
                          <span>Tổng cộng</span>
                          <span className="font-display font-black text-lg sm:text-xl text-accent tabular-nums">{formatPrice(orderTotal)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;