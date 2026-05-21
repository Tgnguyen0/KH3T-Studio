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
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/orders/account/${userId}`, {
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
                  await fetch(`http://localhost:8080/orders/status/${id}`, {
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
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-red-500 text-[9px] font-black tracking-[0.45em] uppercase mb-2">KREDO STUDIO — TÀI KHOẢN</p>
            <h1 className="text-3xl lg:text-5xl font-display font-black uppercase tracking-tight text-white leading-none">
              Đơn hàng
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">
              {orders.length} đơn hàng
            </span>
            <button
              onClick={() => navigate("/product")}
              className="text-[9px] font-black tracking-widest text-white/40 uppercase hover:text-white transition-colors border-b border-white/10 hover:border-white pb-0.5"
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
              className={`whitespace-nowrap px-6 py-4 font-display font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2
                ${activeTab === tab.key
                  ? "border-red-500 text-white"
                  : "border-transparent text-white/30 hover:text-white/60"}`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[8px] px-1.5 py-0.5 font-black ${activeTab === tab.key ? "bg-red-500 text-white" : "bg-white/10 text-white/40"}`}>
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
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 bg-white border border-primary/5 gap-6">
            <div className="w-16 h-16 bg-secondary flex items-center justify-center text-primary/20">
              <Package size={30} />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-black text-primary/30 uppercase tracking-[0.3em] mb-2">Không có đơn hàng nào</p>
              <p className="text-[10px] text-primary/20 font-bold uppercase tracking-widest">Danh mục này đang trống</p>
            </div>
            <button
              onClick={() => navigate("/product")}
              className="px-8 py-3.5 bg-[#111111] hover:bg-accent text-white text-[9px] font-black tracking-[0.3em] uppercase transition-colors"
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
              const orderTotal = order.orderDetails.reduce((s, d) => s + d.totalPrice, 0) + 30000;
              const isCancelled = order.statusOrder === "CANCELLED";

              return (
                <div
                  key={order.id}
                  className="bg-white border border-primary/5 hover:border-primary/15 transition-all overflow-hidden"
                >
                  {/* ── Order header ── */}
                  <div className="bg-[#111111] px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-red-500 text-[8px] font-black tracking-[0.4em] uppercase mb-0.5">Mã đơn hàng</p>
                        <p className="text-white font-display font-black text-sm uppercase tracking-wider">{order.orderCode}</p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-white/10" />
                      <div className="hidden sm:block">
                        <p className="text-white/30 text-[8px] font-black tracking-widest uppercase mb-0.5">Ngày đặt</p>
                        <p className="text-white/60 text-[10px] font-bold">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-[8px] font-black uppercase tracking-widest ${cfg.cls}`}>
                        <Icon size={10} />
                        {cfg.label}
                      </span>
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="text-white/40 hover:text-white text-[9px] font-black tracking-widest uppercase transition-colors flex items-center gap-1.5 border border-white/10 hover:border-white/30 px-3 py-1.5"
                      >
                        {isExpanded ? "Thu gọn ↑" : "Xem chi tiết ↓"}
                      </button>
                    </div>
                  </div>

                  {/* ── Progress tracker ── */}
                  {!isCancelled && (
                    <div className="px-7 py-5 bg-secondary/50 border-b border-primary/5">
                      <div className="flex items-center gap-0">
                        {STEPS.map((step, i) => {
                          const reached = cfg.step >= step.key === "PENDING" ? 1
                            : step.key === "CONFIRMED" ? 2
                            : step.key === "SHIPPING" ? 3 : 4;
                          const StepIcon = step.icon;
                          const done = cfg.step >= (i + 1);
                          const active = cfg.step === (i + 1);
                          return (
                            <React.Fragment key={step.key}>
                              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                <div className={`w-7 h-7 flex items-center justify-center border transition-all
                                  ${done
                                    ? "bg-[#111111] border-[#111111] text-white"
                                    : "bg-white border-primary/15 text-primary/25"}`}>
                                  <StepIcon size={12} />
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest whitespace-nowrap
                                  ${done ? "text-primary/60" : "text-primary/20"}`}>
                                  {step.label}
                                </span>
                              </div>
                              {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-px mx-2 mb-5 transition-all ${cfg.step > i + 1 ? "bg-[#111111]" : "bg-primary/10"}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Compact summary row (always visible) ── */}
                  <div className="px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/5">
                    {/* Product thumbnails */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {order.orderDetails.slice(0, 3).map((detail, i) => (
                          <div
                            key={i}
                            className="w-10 h-12 bg-secondary border border-white overflow-hidden flex-shrink-0"
                            style={{ zIndex: 3 - i }}
                          >
                            {detail.productImage ? (
                              <img src={detail.productImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary/20 text-[8px] font-black">
                                {detail.productName?.charAt(0)}
                              </div>
                            )}
                          </div>
                        ))}
                        {order.orderDetails.length > 3 && (
                          <div className="w-10 h-12 bg-secondary border border-white flex items-center justify-center flex-shrink-0">
                            <span className="text-[8px] font-black text-primary/40">+{order.orderDetails.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-wide">
                          {order.orderDetails.length} sản phẩm
                        </p>
                        <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest mt-0.5">
                          {order.orderDetails[0]?.productName}
                          {order.orderDetails.length > 1 && ` +${order.orderDetails.length - 1} khác`}
                        </p>
                      </div>
                    </div>

                    {/* Total + action */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest mb-0.5">Tổng cộng</p>
                        <p className="font-display font-black text-lg text-accent tabular-nums">{formatPrice(orderTotal)}</p>
                      </div>
                      {order.statusOrder === "PENDING" && (
                        <button
                          className="px-5 py-2.5 border border-primary/15 hover:border-accent text-primary/50 hover:text-accent text-[9px] font-black tracking-widest uppercase transition-all"
                          onClick={() => handleCancel(order.id)}
                        >
                          Hủy đơn
                        </button>
                      )}
                      {order.statusOrder === "COMPLETED" && (
                        <button
                          onClick={() => navigate("/product")}
                          className="px-5 py-2.5 bg-[#111111] hover:bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-all"
                        >
                          Mua lại
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Expanded detail ── */}
                  {isExpanded && (
                    <div className="px-7 py-7 space-y-7">

                      {/* Receiver info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-primary/5">
                        {[
                          { label: "Người nhận", value: order.customerTrading.receiverName },
                          { label: "Điện thoại",  value: order.customerTrading.receiverPhone },
                          { label: "Địa chỉ",     value: order.customerTrading.receiverAddress },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest mb-1.5">{label}</p>
                            <p className="text-[11px] font-black text-primary uppercase tracking-wide leading-relaxed">{value || "—"}</p>
                          </div>
                        ))}
                      </div>

                      {/* Item list */}
                      <div className="divide-y divide-primary/5">
                        {order.orderDetails.map((detail) => (
                          <div key={detail.id} className="py-5 flex items-center gap-5 first:pt-0">
                            {/* Thumbnail */}
                            <div className="w-14 h-[70px] bg-secondary flex-shrink-0 overflow-hidden border border-primary/5">
                              {detail.productImage
                                ? <img src={detail.productImage} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-primary/20 font-black text-xs">{detail.productName?.charAt(0)}</div>
                              }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-display font-black text-xs text-primary uppercase tracking-tight hover:text-red-500 transition-colors cursor-pointer truncate"
                                onClick={() => navigate(`/product/${detail.productId}`)}
                              >
                                {detail.productName}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[8px] font-black text-primary/30 uppercase tracking-widest">
                                  Số lượng: <span className="text-primary">{detail.quantity}</span>
                                </span>
                                <span className="w-0.5 h-0.5 bg-primary/20 rounded-full" />
                                <span className="text-[8px] font-black text-primary/30 uppercase tracking-widest">
                                  {formatPrice(detail.unitPrice)} / cái
                                </span>
                              </div>
                            </div>

                            {/* Line total */}
                            <div className="text-right flex-shrink-0">
                              <p className="font-display font-black text-sm text-primary tabular-nums">
                                {formatPrice(detail.quantity * detail.unitPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals breakdown */}
                      <div className="border border-primary/5 p-5 bg-secondary/30 space-y-2.5">
                        <div className="flex justify-between text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                          <span>Tạm tính</span>
                          <span className="text-primary font-black tabular-nums">
                            {formatPrice(order.orderDetails.reduce((s, d) => s + d.totalPrice, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                          <span>Phí vận chuyển</span>
                          <span className="text-primary font-black">30.000 ₫</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-primary/40 uppercase tracking-widest pt-3 border-t border-primary/8">
                          <span>Tổng cộng</span>
                          <span className="font-display font-black text-base text-accent tabular-nums">{formatPrice(orderTotal)}</span>
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