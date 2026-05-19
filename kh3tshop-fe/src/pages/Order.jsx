// File: src/pages/Order.jsx

import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,s
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  CheckCircle2,
  ListChecks,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Order = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        `http://localhost:8080/orders/account/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: {
        label: "Chờ xác nhận",
        color: "text-amber-700 border-amber-200/50 bg-amber-50/50",
        icon: <Clock size={12} />,
      },
      CONFIRMED: {
        label: "Đã xác nhận",
        color: "text-[#c87a53] border-[#c87a53]/20 bg-[#c87a53]/5",
        icon: <CheckCircle size={12} />,
      },
      SHIPPING: {
        label: "Đang giao hàng",
        color: "text-blue-700 border-blue-200/50 bg-blue-50/50",
        icon: <Truck size={12} />,
      },
      COMPLETED: {
        label: "Đã hoàn thành",
        color: "text-emerald-700 border-emerald-200/50 bg-emerald-50/50",
        icon: <CheckCircle size={12} />,
      },
      CANCELLED: {
        label: "Đã hủy",
        color: "text-primary/40 border-primary/10 bg-secondary/50",
        icon: <XCircle size={12} />,
      },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      COD: "Thanh toán khi nhận hàng (COD)",
      BANKING: "Chuyển khoản ngân hàng",
      MOMO: "Ví MoMo",
      VNPAY: "VNPAY",
    };
    return methodMap[method] || method;
  };

  const getFilteredOrders = () => {
    if (activeTab === "all") return orders;
    if (activeTab === "pending")
      return orders.filter((o) => o.statusOrder === "PENDING");
    if (activeTab === "confirmed")
      return orders.filter((o) => o.statusOrder === "CONFIRMED");
    return orders;
  };

  const filteredOrders = getFilteredOrders();

  const handleCancel = async (id) => {
    toast(
      (t) => (
        <div className="p-4 selection:bg-accent selection:text-white">
          <p className="font-display font-black text-xs text-primary uppercase tracking-widest flex items-center gap-2">
            <span>⚠️</span> Hủy đơn hàng này?
          </p>
          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-2 leading-relaxed">
            Hành động này không thể hoàn tác. Quý khách có thực sự muốn hủy?
          </p>
          <div className="flex gap-3 mt-5 justify-start">
            <button
              className="px-4 py-2 bg-accent text-white text-[9px] font-black tracking-widest uppercase transition-colors"
              onClick={async () => {
                toast.dismiss(t);

                try {
                  const token = localStorage.getItem("accessToken");

                  await fetch(`http://localhost:8080/orders/status/${id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ statusOrder: "CANCELLED" }),
                  });

                  await fetchOrders();

                  toast.success("Đơn hàng của bạn đã được hủy thành công.");
                } catch (error) {
                  toast.error("Lỗi khi hủy đơn hàng!");
                }
              }}
            >
              Hủy Đơn
            </button>
            <button
              className="px-4 py-2 border border-primary/10 text-primary bg-white text-[9px] font-black tracking-widest uppercase hover:bg-secondary transition"
              onClick={() => toast.dismiss(t)}
            >
              Giữ Đơn
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        className: "rounded-none border border-primary/10 bg-white shadow-xl",
      }
    );
  };

  return (
    <div className="min-h-screen bg-secondary py-16 selection:bg-accent selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 pb-6 border-b border-primary/5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-black uppercase tracking-tight text-primary">Lịch sử đơn hàng</h1>
            <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.25em] mt-3">Theo dõi các giao dịch thời trang của bạn</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-primary/15 mb-12 overflow-x-auto scrollbar-none">
          {[
            { key: "all", label: "TẤT CẢ ĐƠN HÀNG" },
            { key: "pending", label: "CHỜ XÁC NHẬN" },
            { key: "confirmed", label: "ĐÃ XÁC NHẬN" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                whitespace-nowrap px-8 py-4 font-display font-black text-xs uppercase tracking-[0.2em] transition-all relative border-b-2
                ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-primary/40 hover:text-primary/70"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-2 border-[#c87a53] border-t-transparent animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-24 bg-white border border-primary/5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary mb-6 text-[#c87a53]">
              <Package size={28} />
            </div>
            <h3 className="text-sm font-display font-black uppercase tracking-[0.2em] mb-3 text-primary">Không có đơn hàng nào</h3>
            <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mb-8">
              Danh mục này hiện đang trống. Bắt đầu bộ sưu tập mới của bạn ngay hôm nay.
            </p>
            <button
              onClick={() => navigate("/product")}
              className="px-8 py-4 bg-[#111111] hover:bg-[#c87a53] text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors"
            >
              MUA SẮM NGAY
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.statusOrder);
              return (
                <div
                  key={order.id}
                  className="bg-white border border-primary/5 hover:border-primary/15 transition-all overflow-hidden"
                >
                  {/* Order Top Summary */}
                  <div className="p-6 sm:p-8 bg-secondary/50 border-b border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-primary uppercase tracking-widest">
                        Mã đơn hàng: <span className="text-[#c87a53]">{order.orderCode}</span>
                      </p>
                      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                        Thời gian: {formatDate(order.orderDate)}
                      </p>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 border text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Customer details in Order grid */}
                  <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-primary/5 grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-bold text-primary/50 uppercase tracking-widest">
                    <div>
                      <span className="text-primary/30 font-medium block mb-1">Người nhận</span>
                      <span className="text-primary font-black text-[11px]">{order.customerTrading.receiverName}</span>
                    </div>
                    <div>
                      <span className="text-primary/30 font-medium block mb-1">Số điện thoại</span>
                      <span className="text-primary font-black text-[11px]">{order.customerTrading.receiverPhone}</span>
                    </div>
                    <div>
                      <span className="text-primary/30 font-medium block mb-1">Địa chỉ</span>
                      <span className="text-primary font-black text-[11px] leading-relaxed block max-w-sm">
                        {order.customerTrading.receiverAddress}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="p-6 sm:p-8">
                    <div className="divide-y divide-primary/5">
                      {order.orderDetails.map((detail) => (
                        <div key={detail.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 first:pt-0 last:pb-0">
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-display font-black text-xs text-primary uppercase tracking-wider hover:text-[#c87a53] transition-colors cursor-pointer"
                              onClick={() =>
                                navigate(`/product/${detail.productId}`)
                              }
                            >
                              {detail.productName}
                            </h4>
                            <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mt-2">
                              Số lượng: <span className="text-primary font-black">{detail.quantity}</span>
                            </p>
                            <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mt-1">
                              Đơn giá: <span className="text-primary font-black">{formatPrice(detail.unitPrice)}</span>
                            </p>
                          </div>
                          
                          <div className="sm:text-right">
                            <span className="text-[9px] font-bold text-primary/30 uppercase block mb-1 tracking-widest">Thành tiền</span>
                            <span className="font-display font-black text-xs text-primary">
                              {formatPrice(detail.quantity * detail.unitPrice)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Shipping Row */}
                      <div className="py-6 flex justify-between items-center text-[10px] font-bold text-primary/50 uppercase tracking-widest border-t border-primary/5">
                        <span className="font-medium text-primary/30">Phí vận chuyển chuẩn</span>
                        <span className="font-black text-primary">{formatPrice(30000)}</span>
                      </div>
                    </div>

                    {/* Footer / Summary Action block */}
                    <div className="mt-8 pt-8 border-t border-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div>
                        <span className="text-[9px] font-bold text-primary/30 uppercase block mb-1 tracking-widest">Tổng cộng</span>
                        <span className="font-display font-black text-xl text-accent">
                          {formatPrice(
                            order.orderDetails.reduce(
                              (sum, detail) => sum + detail.totalPrice,
                              0
                            ) + 30000
                          )}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        {order.statusOrder === "PENDING" && (
                          <button
                            className="px-6 py-3 border border-accent hover:bg-accent text-accent hover:text-white text-[10px] font-black tracking-widest uppercase transition-all"
                            onClick={() => handleCancel(order.id)}
                          >
                            Hủy đơn hàng
                          </button>
                        )}

                        {order.statusOrder === "COMPLETED" && (
                          <button
                            onClick={() => navigate("/product")}
                            className="px-6 py-3 bg-[#111111] hover:bg-[#c87a53] text-white text-[10px] font-black tracking-widest uppercase transition-all"
                          >
                            Mua lại
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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
